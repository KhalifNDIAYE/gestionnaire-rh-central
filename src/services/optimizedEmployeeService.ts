import { supabase } from '@/integrations/supabase/client'
import type { Employee } from './employeeService'

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginationParams {
  page: number
  limit: number
  search?: string
  department?: string
  status?: string
  type?: string
}

class OptimizedEmployeeService {
  private readonly PAGE_SIZE = 20

  async getEmployeesPaginated(params: PaginationParams): Promise<PaginatedResponse<Employee>> {
    const { page = 1, limit = this.PAGE_SIZE, search, department, status, type } = params
    const offset = (page - 1) * limit

    let query = supabase
      .from('employees')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    // Filtres optimisés
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }
    
    if (department && department !== 'all') {
      query = query.eq('department', department)
    }
    
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (type && type !== 'all') {
      query = query.eq('type', type)
    }

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Erreur lors du chargement des employés: ${error.message}`)
    }

    return {
      data: data || [],
      count: count || 0,
      hasNextPage: (offset + limit) < (count || 0),
      hasPreviousPage: page > 1,
    }
  }

  async getEmployeesInfinite(
    pageParam = 0,
    filters: Partial<Omit<PaginationParams, 'page'>> = {}
  ): Promise<{ employees: Employee[]; nextPage?: number }> {
    const limit = filters.limit || this.PAGE_SIZE
    const offset = pageParam * limit

    let query = supabase
      .from('employees')
      .select('*')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    // Appliquer les filtres
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    }
    
    if (filters.department && filters.department !== 'all') {
      query = query.eq('department', filters.department)
    }
    
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Erreur lors du chargement des employés: ${error.message}`)
    }

    return {
      employees: data || [],
      nextPage: data && data.length === limit ? pageParam + 1 : undefined,
    }
  }

  // Optimisation pour le prefetch des détails
  async prefetchEmployeeDetails(ids: string[]) {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .in('id', ids)

    if (error) {
      console.warn('Erreur lors du prefetch des détails employés:', error.message)
      return []
    }

    return data || []
  }

  // Recherche optimisée avec debounce côté serveur
  async searchEmployees(query: string, limit = 10): Promise<Employee[]> {
    if (!query.trim()) return []

    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,fonction.ilike.%${query}%`)
      .limit(limit)

    if (error) {
      throw new Error(`Erreur lors de la recherche: ${error.message}`)
    }

    return data || []
  }

  // Statistiques optimisées
  async getEmployeeStats() {
    const { data, error } = await supabase
      .from('employees')
      .select('status, type, department')

    if (error) {
      throw new Error(`Erreur lors du chargement des statistiques: ${error.message}`)
    }

    const stats = {
      total: data?.length || 0,
      active: data?.filter(e => e.status === 'active').length || 0,
      inactive: data?.filter(e => e.status === 'inactive').length || 0,
      employees: data?.filter(e => e.type === 'employee').length || 0,
      consultants: data?.filter(e => e.type === 'consultant').length || 0,
      byDepartment: data?.reduce((acc, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {},
    }

    return stats
  }
}

export const optimizedEmployeeService = new OptimizedEmployeeService()
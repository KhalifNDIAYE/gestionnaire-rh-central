import { supabase } from '@/integrations/supabase/client'

export interface Project {
  id: string
  name: string
  description?: string
  start_date: string
  end_date: string
  status: string
  budget: number
  actual_cost: number
  project_manager: string
  team: string[]
  consultants: string[]
  created_at: string
  updated_at: string
}

export interface PaginatedProjectResponse {
  data: Project[]
  count: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ProjectFilters {
  search?: string
  status?: string
  manager?: string
  page?: number
  limit?: number
}

class OptimizedProjectService {
  private readonly PAGE_SIZE = 15

  async getProjectsPaginated(filters: ProjectFilters = {}): Promise<PaginatedProjectResponse> {
    const { page = 1, limit = this.PAGE_SIZE, search, status, manager } = filters
    const offset = (page - 1) * limit

    let query = supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    // Filtres optimisés
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (manager && manager !== 'all') {
      query = query.eq('project_manager', manager)
    }

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Erreur lors du chargement des projets: ${error.message}`)
    }

    return {
      data: data || [],
      count: count || 0,
      hasNextPage: (offset + limit) < (count || 0),
      hasPreviousPage: page > 1,
    }
  }

  async getProjectsInfinite(
    pageParam = 0,
    filters: Omit<ProjectFilters, 'page'> = {}
  ): Promise<{ projects: Project[]; nextPage?: number }> {
    const limit = filters.limit || this.PAGE_SIZE
    const offset = pageParam * limit

    let query = supabase
      .from('projects')
      .select('*')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    // Appliquer les filtres
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }
    
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    
    if (filters.manager && filters.manager !== 'all') {
      query = query.eq('project_manager', filters.manager)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Erreur lors du chargement des projets: ${error.message}`)
    }

    return {
      projects: data || [],
      nextPage: data && data.length === limit ? pageParam + 1 : undefined,
    }
  }

  // Recherche rapide pour l'autocomplete
  async searchProjects(query: string, limit = 8): Promise<Pick<Project, 'id' | 'name' | 'status'>[]> {
    if (!query.trim()) return []

    const { data, error } = await supabase
      .from('projects')
      .select('id, name, status')
      .ilike('name', `%${query}%`)
      .limit(limit)

    if (error) {
      throw new Error(`Erreur lors de la recherche: ${error.message}`)
    }

    return data || []
  }

  // Statistiques optimisées
  async getProjectStats() {
    const { data, error } = await supabase
      .from('projects')
      .select('status, budget, actual_cost')

    if (error) {
      throw new Error(`Erreur lors du chargement des statistiques: ${error.message}`)
    }

    const stats = {
      total: data?.length || 0,
      active: data?.filter(p => p.status === 'active').length || 0,
      completed: data?.filter(p => p.status === 'completed').length || 0,
      planning: data?.filter(p => p.status === 'planning').length || 0,
      cancelled: data?.filter(p => p.status === 'cancelled').length || 0,
      totalBudget: data?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0,
      totalActualCost: data?.reduce((sum, p) => sum + (p.actual_cost || 0), 0) || 0,
    }

    return {
      ...stats,
      budgetUtilization: stats.totalBudget > 0 
        ? (stats.totalActualCost / stats.totalBudget) * 100 
        : 0
    }
  }

  // Prefetch des détails de projets
  async prefetchProjectDetails(ids: string[]) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .in('id', ids)

    if (error) {
      console.warn('Erreur lors du prefetch des détails projets:', error.message)
      return []
    }

    return data || []
  }

  // Obtenir les chefs de projet pour les filtres
  async getProjectManagers(): Promise<string[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('project_manager')
      .not('project_manager', 'is', null)

    if (error) {
      console.warn('Erreur lors du chargement des chefs de projet:', error.message)
      return []
    }

    // Retourner la liste unique des chefs de projet
    const managers = [...new Set(data?.map(p => p.project_manager) || [])]
    return managers.filter(Boolean)
  }
}

export const optimizedProjectService = new OptimizedProjectService()
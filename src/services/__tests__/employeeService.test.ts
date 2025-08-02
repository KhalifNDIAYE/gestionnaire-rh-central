import { describe, it, expect, beforeEach, vi } from 'vitest'
import { employeeService, type CreateEmployeeData, type UpdateEmployeeData } from '../employeeService'
import { supabase } from '@/integrations/supabase/client'

// Mock du client Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [],
          error: null
        })),
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            data: [],
            error: null
          })),
          maybeSingle: vi.fn(() => ({
            data: null,
            error: null
          }))
        })),
        maybeSingle: vi.fn(() => ({
          data: null,
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: null,
            error: null
          }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: null
            }))
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          error: null
        }))
      }))
    }))
  }
}))

describe('EmployeeService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllEmployees', () => {
    it('returns employees list successfully', async () => {
      const mockEmployees = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          fonction: 'Développeur',
          department: 'IT',
          status: 'active',
          type: 'employee',
          start_date: '2023-01-01',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ]

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            data: mockEmployees,
            error: null
          }))
        }))
      }))

      vi.mocked(supabase.from).mockReturnValueOnce(mockFrom() as any)

      const result = await employeeService.getAllEmployees()

      expect(result).toEqual(mockEmployees)
      expect(supabase.from).toHaveBeenCalledWith('employees')
    })

    it('throws error when API call fails', async () => {
      const mockError = { message: 'Database error' }
      
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            data: null,
            error: mockError
          }))
        }))
      }))

      vi.mocked(supabase.from).mockReturnValueOnce(mockFrom() as any)

      await expect(employeeService.getAllEmployees())
        .rejects.toThrow('Erreur lors du chargement des employés: Database error')
    })
  })

  describe('createEmployee', () => {
    it('creates employee successfully', async () => {
      const newEmployee: CreateEmployeeData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        fonction: 'Designer',
        department: 'Design',
        start_date: '2023-02-01'
      }

      const mockCreatedEmployee = {
        id: '2',
        ...newEmployee,
        status: 'active',
        type: 'employee',
        created_at: '2023-02-01T00:00:00Z',
        updated_at: '2023-02-01T00:00:00Z'
      }

      const mockFrom = vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: mockCreatedEmployee,
              error: null
            }))
          }))
        }))
      }))

      vi.mocked(supabase.from).mockReturnValueOnce(mockFrom() as any)

      const result = await employeeService.createEmployee(newEmployee)

      expect(result).toEqual(mockCreatedEmployee)
      expect(supabase.from).toHaveBeenCalledWith('employees')
    })
  })

  describe('updateEmployee', () => {
    it('updates employee successfully', async () => {
      const updateData: UpdateEmployeeData = {
        name: 'John Updated',
        salary: 80000
      }

      const mockUpdatedEmployee = {
        id: '1',
        name: 'John Updated',
        email: 'john@example.com',
        fonction: 'Développeur',
        department: 'IT',
        status: 'active',
        type: 'employee',
        start_date: '2023-01-01',
        salary: 80000,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-02-01T00:00:00Z'
      }

      const mockFrom = vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => ({
                data: mockUpdatedEmployee,
                error: null
              }))
            }))
          }))
        }))
      }))

      vi.mocked(supabase.from).mockReturnValueOnce(mockFrom() as any)

      const result = await employeeService.updateEmployee('1', updateData)

      expect(result).toEqual(mockUpdatedEmployee)
    })
  })

  describe('deleteEmployee', () => {
    it('deletes employee successfully', async () => {
      const mockFrom = vi.fn(() => ({
        delete: vi.fn(() => ({
          eq: vi.fn(() => ({
            error: null
          }))
        }))
      }))

      vi.mocked(supabase.from).mockReturnValueOnce(mockFrom() as any)

      await expect(employeeService.deleteEmployee('1')).resolves.not.toThrow()
    })

    it('throws error when delete fails', async () => {
      const mockError = { message: 'Permission denied' }
      
      const mockFrom = vi.fn(() => ({
        delete: vi.fn(() => ({
          eq: vi.fn(() => ({
            error: mockError
          }))
        }))
      }))

      vi.mocked(supabase.from).mockReturnValueOnce(mockFrom() as any)

      await expect(employeeService.deleteEmployee('1'))
        .rejects.toThrow('Erreur lors de la suppression de l\'employé: Permission denied')
    })
  })

  describe('getEmployeeById', () => {
    it('returns employee when found', async () => {
      const mockEmployee = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        fonction: 'Développeur',
        department: 'IT',
        status: 'active',
        type: 'employee',
        start_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() => ({
              data: mockEmployee,
              error: null
            }))
          }))
        }))
      }))

      vi.mocked(supabase.from).mockReturnValueOnce(mockFrom() as any)

      const result = await employeeService.getEmployeeById('1')

      expect(result).toEqual(mockEmployee)
    })

    it('returns null when employee not found', async () => {
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() => ({
              data: null,
              error: null
            }))
          }))
        }))
      }))

      vi.mocked(supabase.from).mockReturnValueOnce(mockFrom() as any)

      const result = await employeeService.getEmployeeById('999')

      expect(result).toBeNull()
    })
  })
})
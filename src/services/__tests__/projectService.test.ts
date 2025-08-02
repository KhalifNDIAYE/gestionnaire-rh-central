import { describe, it, expect, beforeEach, vi } from 'vitest'
import { projectService } from '../projectService'
import { supabase } from '@/integrations/supabase/client'

// Mock du client Supabase
vi.mock('@/integrations/supabase/client')

describe('ProjectService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllProjects', () => {
    it('returns projects list successfully', async () => {
      const mockProjects = [
        {
          id: '1',
          name: 'Projet Test',
          description: 'Description du projet',
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          status: 'active',
          budget: 100000,
          actual_cost: 50000,
          project_manager: 'John Doe',
          team: ['John Doe'],
          consultants: [],
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ]

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            data: mockProjects,
            error: null
          }))
        }))
      }))

      vi.mocked(supabase.from).mockReturnValueOnce(mockFrom() as any)

      const result = await projectService.getProjects()

      expect(result).toEqual(mockProjects)
      expect(supabase.from).toHaveBeenCalledWith('projects')
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

      await expect(projectService.getProjects())
        .rejects.toThrow('Erreur lors du chargement des projets: Database error')
    })
  })

  describe('createProject', () => {
    it('creates project successfully', async () => {
      const newProject = {
        name: 'Nouveau Projet',
        description: 'Description',
        start_date: '2023-03-01',
        end_date: '2023-09-01',
        budget: 75000,
        project_manager: 'Jane Smith'
      }

      const mockCreatedProject = {
        id: '2',
        ...newProject,
        status: 'planning',
        actual_cost: 0,
        team: [],
        consultants: [],
        created_at: '2023-03-01T00:00:00Z',
        updated_at: '2023-03-01T00:00:00Z'
      }

      const mockFrom = vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: mockCreatedProject,
              error: null
            }))
          }))
        }))
      }))

      vi.mocked(supabase.from).mockReturnValueOnce(mockFrom() as any)

      const result = await projectService.createProject(newProject)

      expect(result).toEqual(mockCreatedProject)
      expect(supabase.from).toHaveBeenCalledWith('projects')
    })
  })

  describe('getProjectsByStatus', () => {
    it('filters projects by status correctly', async () => {
      const mockActiveProjects = [
        {
          id: '1',
          name: 'Projet Actif',
          status: 'active',
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          budget: 100000,
          actual_cost: 50000,
          project_manager: 'John Doe',
          team: [],
          consultants: [],
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ]

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              data: mockActiveProjects,
              error: null
            }))
          }))
        }))
      }))

      vi.mocked(supabase.from).mockReturnValueOnce(mockFrom() as any)

      const result = await projectService.getProjectsByStatus('active')

      expect(result).toEqual(mockActiveProjects)
    })
  })
})
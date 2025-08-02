import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock Supabase REST API
  http.get('https://vlfauqpgkyaggxuwtqmp.supabase.co/rest/v1/employees', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        fonction: 'Développeur',
        department: 'IT',
        status: 'active',
        type: 'employee',
        start_date: '2023-01-01',
        salary: 50000,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        fonction: 'Designer',
        department: 'Design',
        status: 'active',
        type: 'consultant',
        start_date: '2023-02-01',
        hourly_rate: 50,
        created_at: '2023-02-01T00:00:00Z',
        updated_at: '2023-02-01T00:00:00Z'
      }
    ])
  }),

  http.post('https://vlfauqpgkyaggxuwtqmp.supabase.co/rest/v1/employees', () => {
    return HttpResponse.json({
      id: '3',
      name: 'New Employee',
      email: 'new@example.com',
      fonction: 'Tester',
      department: 'QA',
      status: 'active',
      type: 'employee',
      start_date: '2023-03-01',
      salary: 45000,
      created_at: '2023-03-01T00:00:00Z',
      updated_at: '2023-03-01T00:00:00Z'
    }, { status: 201 })
  }),

  http.get('https://vlfauqpgkyaggxuwtqmp.supabase.co/rest/v1/projects', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Projet Test',
        description: 'Description du projet test',
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        status: 'active',
        budget: 100000,
        actual_cost: 50000,
        project_manager: 'John Doe',
        team: ['John Doe', 'Jane Smith'],
        consultants: [],
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    ])
  }),

  http.get('https://vlfauqpgkyaggxuwtqmp.supabase.co/rest/v1/time_entries', () => {
    return HttpResponse.json([
      {
        id: '1',
        employee_id: '1',
        employee_name: 'John Doe',
        clock_in: '2023-01-01T09:00:00Z',
        clock_out: '2023-01-01T17:00:00Z',
        break_duration: 60,
        notes: 'Journée productive',
        created_at: '2023-01-01T09:00:00Z',
        updated_at: '2023-01-01T17:00:00Z'
      }
    ])
  })
]
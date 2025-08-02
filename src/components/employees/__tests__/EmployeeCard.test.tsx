import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils/test-utils'
import userEvent from '@testing-library/user-event'
import { EmployeeCard } from '../EmployeeCard'
import type { Employee } from '@/services/employeeService'

const mockEmployee: Employee = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  fonction: 'Développeur Senior',
  department: 'Informatique',
  status: 'active',
  type: 'employee',
  start_date: '2023-01-01',
  salary: 75000,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z'
}

describe('EmployeeCard Component', () => {
  it('renders employee information correctly', () => {
    render(
      <EmployeeCard 
        employee={mockEmployee}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Développeur Senior')).toBeInTheDocument()
    expect(screen.getByText('Informatique')).toBeInTheDocument()
  })

  it('displays active status badge', () => {
    render(
      <EmployeeCard 
        employee={mockEmployee}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(screen.getByText('Actif')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', async () => {
    const handleEdit = vi.fn()
    const user = userEvent.setup()
    
    render(
      <EmployeeCard 
        employee={mockEmployee}
        onEdit={handleEdit}
        onDelete={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: /modifier/i }))
    expect(handleEdit).toHaveBeenCalledWith(mockEmployee)
  })

  it('calls onDelete when delete button is clicked', async () => {
    const handleDelete = vi.fn()
    const user = userEvent.setup()
    
    render(
      <EmployeeCard 
        employee={mockEmployee}
        onEdit={vi.fn()}
        onDelete={handleDelete}
      />
    )

    await user.click(screen.getByRole('button', { name: /supprimer/i }))
    expect(handleDelete).toHaveBeenCalledWith(mockEmployee.id)
  })

  it('shows consultant type correctly', () => {
    const consultantEmployee = {
      ...mockEmployee,
      type: 'consultant' as const,
      salary: undefined,
      hourly_rate: 75
    }

    render(
      <EmployeeCard 
        employee={consultantEmployee}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(screen.getByText('Consultant')).toBeInTheDocument()
  })
})
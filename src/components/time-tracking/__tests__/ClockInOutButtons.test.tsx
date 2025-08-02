import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils/test-utils'
import userEvent from '@testing-library/user-event'
import { ClockInOutButtons } from '../ClockInOutButtons'
import type { Employee } from '@/services/employeeService'

const mockEmployees: Employee[] = [
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
    created_at: '2023-02-01T00:00:00Z',
    updated_at: '2023-02-01T00:00:00Z'
  }
]

const mockOnTimeEntryAdded = vi.fn()

describe('ClockInOutButtons Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders clock in and clock out buttons', () => {
    render(
      <ClockInOutButtons 
        employees={mockEmployees}
        onTimeEntryAdded={mockOnTimeEntryAdded}
      />
    )

    expect(screen.getByRole('button', { name: /entrée/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sortie/i })).toBeInTheDocument()
  })

  it('renders employee selector', () => {
    render(
      <ClockInOutButtons 
        employees={mockEmployees}
        onTimeEntryAdded={mockOnTimeEntryAdded}
      />
    )

    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('shows current time', () => {
    render(
      <ClockInOutButtons 
        employees={mockEmployees}
        onTimeEntryAdded={mockOnTimeEntryAdded}
      />
    )

    // Vérifier qu'une heure est affichée (format approximatif)
    const timeDisplay = screen.getByText(/\d{1,2}:\d{2}/)
    expect(timeDisplay).toBeInTheDocument()
  })

  it('requires employee selection before clock in', async () => {
    const user = userEvent.setup()
    
    render(
      <ClockInOutButtons 
        employees={mockEmployees}
        onTimeEntryAdded={mockOnTimeEntryAdded}
      />
    )

    // Essayer de pointer sans sélectionner d'employé
    await user.click(screen.getByRole('button', { name: /entrée/i }))

    // Vérifier qu'un message d'erreur est affiché
    await waitFor(() => {
      expect(screen.getByText(/sélectionner un employé/i)).toBeInTheDocument()
    })
  })

  it('allows clock in when employee is selected', async () => {
    const user = userEvent.setup()
    
    render(
      <ClockInOutButtons 
        employees={mockEmployees}
        onTimeEntryAdded={mockOnTimeEntryAdded}
      />
    )

    // Sélectionner un employé
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, '1')

    // Pointer à l'entrée
    await user.click(screen.getByRole('button', { name: /entrée/i }))

    // Vérifier que la fonction de callback est appelée
    await waitFor(() => {
      expect(mockOnTimeEntryAdded).toHaveBeenCalled()
    })
  })

  it('shows break duration input', () => {
    render(
      <ClockInOutButtons 
        employees={mockEmployees}
        onTimeEntryAdded={mockOnTimeEntryAdded}
      />
    )

    const breakInput = screen.getByLabelText(/pause/i)
    expect(breakInput).toBeInTheDocument()
    expect(breakInput).toHaveValue(60) // valeur par défaut
  })

  it('shows notes textarea', () => {
    render(
      <ClockInOutButtons 
        employees={mockEmployees}
        onTimeEntryAdded={mockOnTimeEntryAdded}
      />
    )

    const notesTextarea = screen.getByLabelText(/notes/i)
    expect(notesTextarea).toBeInTheDocument()
  })

  it('displays loading state during clock in/out', async () => {
    const user = userEvent.setup()
    
    render(
      <ClockInOutButtons 
        employees={mockEmployees}
        onTimeEntryAdded={mockOnTimeEntryAdded}
      />
    )

    const select = screen.getByRole('combobox')
    await user.selectOptions(select, '1')

    const clockInButton = screen.getByRole('button', { name: /entrée/i })
    await user.click(clockInButton)

    // Vérifier l'état de chargement
    expect(clockInButton).toBeDisabled()
  })
})
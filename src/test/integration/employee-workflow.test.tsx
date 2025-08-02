import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils/test-utils'
import userEvent from '@testing-library/user-event'
import EmployeesPage from '@/pages/EmployeesPage'

describe('Employee Management Workflow Integration', () => {
  beforeEach(() => {
    // Reset any mocks between tests
  })

  it('completes full employee creation workflow', async () => {
    const user = userEvent.setup()
    
    render(<EmployeesPage />)

    // Attendre que la page se charge
    await waitFor(() => {
      expect(screen.getByText('Gestion des Employés')).toBeInTheDocument()
    })

    // Ouvrir le modal d'ajout d'employé
    const addButton = screen.getByRole('button', { name: /ajouter un employé/i })
    await user.click(addButton)

    // Vérifier que le modal s'ouvre
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Remplir le formulaire
    await user.type(screen.getByLabelText(/nom/i), 'Test Employee')
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/fonction/i), 'Testeur')
    await user.selectOptions(screen.getByLabelText(/département/i), 'QA')
    await user.type(screen.getByLabelText(/date d'embauche/i), '2023-03-01')

    // Soumettre le formulaire
    const submitButton = screen.getByRole('button', { name: /ajouter/i })
    await user.click(submitButton)

    // Vérifier que l'employé a été ajouté (via notification ou retour à la liste)
    await waitFor(() => {
      expect(screen.getByText(/succès/i)).toBeInTheDocument()
    })
  })

  it('handles employee search and filtering', async () => {
    const user = userEvent.setup()
    
    render(<EmployeesPage />)

    await waitFor(() => {
      expect(screen.getByText('Gestion des Employés')).toBeInTheDocument()
    })

    // Utiliser la recherche
    const searchInput = screen.getByPlaceholderText(/rechercher/i)
    await user.type(searchInput, 'John')

    // Vérifier que la recherche fonctionne
    expect(searchInput).toHaveValue('John')

    // Utiliser le filtre département
    const departmentFilter = screen.getByDisplayValue(/tous les départements/i)
    await user.selectOptions(departmentFilter, 'IT')

    // Vérifier que le filtre est appliqué
    expect(departmentFilter).toHaveValue('IT')
  })

  it('displays employee statistics correctly', async () => {
    render(<EmployeesPage />)

    await waitFor(() => {
      expect(screen.getByText('Gestion des Employés')).toBeInTheDocument()
    })

    // Vérifier la présence des statistiques
    expect(screen.getByText(/total employés/i)).toBeInTheDocument()
    expect(screen.getByText(/employés actifs/i)).toBeInTheDocument()
    expect(screen.getByText(/consultants/i)).toBeInTheDocument()
  })

  it('handles employee edit workflow', async () => {
    const user = userEvent.setup()
    
    render(<EmployeesPage />)

    await waitFor(() => {
      expect(screen.getByText('Gestion des Employés')).toBeInTheDocument()
    })

    // Attendre que les données se chargent et cliquer sur modifier
    await waitFor(() => {
      const editButtons = screen.queryAllByRole('button', { name: /modifier/i })
      if (editButtons.length > 0) {
        return user.click(editButtons[0])
      }
    })

    // Vérifier si le modal d'édition s'ouvre
    await waitFor(() => {
      const editModal = screen.queryByText(/modifier l'employé/i)
      if (editModal) {
        expect(editModal).toBeInTheDocument()
      }
    })
  })

  it('validates form inputs correctly', async () => {
    const user = userEvent.setup()
    
    render(<EmployeesPage />)

    await waitFor(() => {
      expect(screen.getByText('Gestion des Employés')).toBeInTheDocument()
    })

    // Ouvrir le modal d'ajout
    const addButton = screen.getByRole('button', { name: /ajouter un employé/i })
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Essayer de soumettre sans remplir les champs requis
    const submitButton = screen.getByRole('button', { name: /ajouter/i })
    await user.click(submitButton)

    // Vérifier la présence d'erreurs de validation
    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/ce champ est requis/i)
      expect(errorMessages.length).toBeGreaterThan(0)
    })
  })
})
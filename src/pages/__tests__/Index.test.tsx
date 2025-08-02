import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/test-utils'
import Index from '../Index'

describe('Index Page (Dashboard)', () => {
  it('renders dashboard title', () => {
    render(<Index />)
    expect(screen.getByText('Tableau de Bord')).toBeInTheDocument()
  })

  it('displays stats cards', () => {
    render(<Index />)
    
    // Vérifier la présence des cartes de statistiques
    expect(screen.getByText('Employés Actifs')).toBeInTheDocument()
    expect(screen.getByText('Projets en Cours')).toBeInTheDocument()
    expect(screen.getByText('Heures Aujourd\'hui')).toBeInTheDocument()
    expect(screen.getByText('Demandes en Attente')).toBeInTheDocument()
  })

  it('displays recent activities section', () => {
    render(<Index />)
    
    expect(screen.getByText('Activités Récentes')).toBeInTheDocument()
  })

  it('displays quick actions section', () => {
    render(<Index />)
    
    expect(screen.getByText('Actions Rapides')).toBeInTheDocument()
  })

  it('shows navigation links to main sections', () => {
    render(<Index />)
    
    // Vérifier la présence des liens de navigation
    expect(screen.getByRole('link', { name: /employés/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /projets/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /pointage/i })).toBeInTheDocument()
  })

  it('displays project progress charts', () => {
    render(<Index />)
    
    // Vérifier la présence du graphique des projets
    expect(screen.getByText('Progression des Projets')).toBeInTheDocument()
  })

  it('shows current time/date', () => {
    render(<Index />)
    
    // Vérifier qu'une date est affichée quelque part
    const today = new Date().toLocaleDateString('fr-FR')
    expect(screen.getByText(new RegExp(today.split('/')[0]))).toBeInTheDocument()
  })
})
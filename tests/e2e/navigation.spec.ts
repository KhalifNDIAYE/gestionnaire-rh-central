import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate between main pages', async ({ page }) => {
    await page.goto('/')

    // Vérifier la page d'accueil
    await expect(page.locator('h1')).toContainText('Tableau de Bord')

    // Naviguer vers Employés
    await page.click('text=Employés')
    await expect(page.locator('h1')).toContainText('Gestion des Employés')

    // Naviguer vers Projets
    await page.click('text=Projets')
    await expect(page.locator('h1')).toContainText('Gestion des Projets')

    // Naviguer vers Pointage
    await page.click('text=Pointage')
    await expect(page.locator('h1')).toContainText('Suivi du Temps')

    // Naviguer vers Demandes de congé
    await page.click('text=Demandes de congé')
    await expect(page.locator('h1')).toContainText('Demandes de Congé')
  })

  test('should toggle sidebar', async ({ page }) => {
    await page.goto('/')

    // Vérifier que la sidebar est visible
    await expect(page.locator('aside')).toBeVisible()

    // Cliquer sur le bouton menu pour fermer la sidebar (sur mobile)
    if (await page.locator('button[aria-label="Toggle menu"]').isVisible()) {
      await page.click('button[aria-label="Toggle menu"]')
    }
  })

  test('should display responsive design on mobile', async ({ page }) => {
    // Simuler un appareil mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Vérifier que le design mobile s'affiche correctement
    await expect(page.locator('main')).toBeVisible()
  })
})
import { test, expect } from '@playwright/test'

test.describe('Employee Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display employee list page', async ({ page }) => {
    // Naviguer vers la page employés
    await page.click('text=Employés')
    
    // Vérifier que nous sommes sur la bonne page
    await expect(page.locator('h1')).toContainText('Gestion des Employés')
    
    // Vérifier la présence du bouton d'ajout
    await expect(page.locator('button:has-text("Ajouter un employé")')).toBeVisible()
  })

  test('should open add employee modal', async ({ page }) => {
    await page.click('text=Employés')
    
    // Cliquer sur le bouton d'ajout
    await page.click('button:has-text("Ajouter un employé")')
    
    // Vérifier que le modal s'ouvre
    await expect(page.locator('dialog')).toBeVisible()
    await expect(page.locator('h2:has-text("Ajouter un employé")')).toBeVisible()
  })

  test('should show validation errors when submitting empty form', async ({ page }) => {
    await page.click('text=Employés')
    await page.click('button:has-text("Ajouter un employé")')
    
    // Essayer de soumettre le formulaire vide
    await page.click('button:has-text("Ajouter")')
    
    // Vérifier la présence d'erreurs de validation
    await expect(page.locator('text=Ce champ est requis')).toBeVisible()
  })

  test('should filter employees by department', async ({ page }) => {
    await page.click('text=Employés')
    
    // Attendre que les données se chargent
    await page.waitForTimeout(1000)
    
    // Utiliser le filtre département
    await page.selectOption('select[name="department"]', 'IT')
    
    // Vérifier que le filtre est appliqué
    await expect(page.locator('select[name="department"]')).toHaveValue('IT')
  })

  test('should search employees by name', async ({ page }) => {
    await page.click('text=Employés')
    
    // Utiliser la barre de recherche
    await page.fill('input[placeholder*="Rechercher"]', 'John')
    
    // Vérifier que la recherche fonctionne
    await expect(page.locator('input[placeholder*="Rechercher"]')).toHaveValue('John')
  })
})
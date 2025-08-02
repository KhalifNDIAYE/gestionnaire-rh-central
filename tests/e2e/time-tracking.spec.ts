import { test, expect } from '@playwright/test'

test.describe('Time Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.click('text=Pointage')
  })

  test('should display time tracking page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Suivi du Temps')
    await expect(page.locator('text=Pointage rapide')).toBeVisible()
  })

  test('should show quick clock-in section', async ({ page }) => {
    // Vérifier la présence de la section pointage rapide
    await expect(page.locator('text=Pointage rapide')).toBeVisible()
    
    // Vérifier les boutons d'entrée et sortie
    await expect(page.locator('button:has-text("Entrée")')).toBeVisible()
    await expect(page.locator('button:has-text("Sortie")')).toBeVisible()
  })

  test('should display time entries table', async ({ page }) => {
    // Vérifier la présence du tableau des entrées
    await expect(page.locator('table')).toBeVisible()
    await expect(page.locator('th:has-text("Employé")')).toBeVisible()
    await expect(page.locator('th:has-text("Entrée")')).toBeVisible()
    await expect(page.locator('th:has-text("Sortie")')).toBeVisible()
  })

  test('should show employee selector in quick clock-in', async ({ page }) => {
    // Vérifier la présence du sélecteur d'employé
    await expect(page.locator('select')).toBeVisible()
  })

  test('should allow filtering time entries', async ({ page }) => {
    // Vérifier la présence des filtres
    await expect(page.locator('input[type="date"]')).toBeVisible()
  })
})
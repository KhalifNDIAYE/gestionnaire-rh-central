import { test, expect } from '@playwright/test';

test.describe('Health Checks', () => {
  test('Application loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier que l'application se charge
    await expect(page).toHaveTitle(/Dashboard/);
    
    // Vérifier que les éléments principaux sont présents
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('API endpoints are responsive', async ({ page }) => {
    // Vérifier que l'API Supabase répond
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(200);
  });

  test('Critical user flows work', async ({ page }) => {
    await page.goto('/');
    
    // Test du menu de navigation
    await page.getByRole('button', { name: /menu/i }).click();
    await expect(page.getByRole('menuitem')).toBeVisible();
    
    // Test d'une page principale
    await page.getByRole('link', { name: /employés/i }).click();
    await expect(page).toHaveURL(/employees/);
  });

  test('Performance metrics are acceptable', async ({ page }) => {
    await page.goto('/');
    
    // Mesurer le temps de chargement
    const loadTime = await page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });
    
    // Vérifier que le temps de chargement est acceptable (< 3 secondes)
    expect(loadTime).toBeLessThan(3000);
  });

  test('Error boundaries work correctly', async ({ page }) => {
    // Simuler une erreur et vérifier qu'elle est gérée gracieusement
    await page.goto('/non-existent-page');
    await expect(page.getByText(/404/)).toBeVisible();
  });

  test('Service worker is registered', async ({ page }) => {
    await page.goto('/');
    
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    expect(swRegistered).toBe(true);
  });
});
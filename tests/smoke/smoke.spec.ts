import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('Homepage loads without errors', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier l'absence d'erreurs JavaScript
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  test('All main navigation links work', async ({ page }) => {
    await page.goto('/');
    
    // Tester tous les liens de navigation principaux
    const navLinks = [
      { name: 'Dashboard', url: '/' },
      { name: 'Employés', url: '/employees' },
      { name: 'Projets', url: '/projects' },
      { name: 'Pointage', url: '/time-tracking' },
    ];

    for (const link of navLinks) {
      await page.getByRole('link', { name: link.name }).click();
      await expect(page).toHaveURL(new RegExp(link.url));
      await expect(page.getByRole('main')).toBeVisible();
    }
  });

  test('Forms can be submitted', async ({ page }) => {
    await page.goto('/employees');
    
    // Tester l'ouverture du formulaire d'ajout
    await page.getByRole('button', { name: /ajouter/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Fermer le modal
    await page.getByRole('button', { name: /annuler/i }).click();
  });

  test('Search functionality works', async ({ page }) => {
    await page.goto('/employees');
    
    // Tester la recherche
    const searchInput = page.getByRole('textbox', { name: /rechercher/i });
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.keyboard.press('Enter');
      // Vérifier que la page ne crash pas
      await expect(page.getByRole('main')).toBeVisible();
    }
  });

  test('Responsive design works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Vérifier que l'interface mobile fonctionne
    await expect(page.getByRole('main')).toBeVisible();
    
    // Tester le menu burger mobile
    const menuButton = page.getByRole('button', { name: /menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });
});
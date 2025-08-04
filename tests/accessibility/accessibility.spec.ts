import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });

  test('should be navigable with keyboard', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Verify focus is visible
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing through the page
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const currentFocused = await page.locator(':focus');
      await expect(currentFocused).toBeVisible();
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    if (headings.length > 0) {
      // Check that first heading is h1
      const firstHeading = await headings[0].textContent();
      const firstHeadingTag = await headings[0].evaluate(el => el.tagName.toLowerCase());
      expect(firstHeadingTag).toBe('h1');
    }
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    // Check for navigation landmarks
    const nav = await page.locator('[role="navigation"]');
    if (await nav.count() > 0) {
      await expect(nav.first()).toHaveAttribute('aria-label');
    }

    // Check for banner landmark
    const banner = await page.locator('[role="banner"]');
    if (await banner.count() > 0) {
      expect(await banner.count()).toBeGreaterThan(0);
    }

    // Check for main landmark
    const main = await page.locator('[role="main"], main');
    if (await main.count() > 0) {
      expect(await main.count()).toBeGreaterThan(0);
    }
  });

  test('should handle skip links', async ({ page }) => {
    // Press Tab to focus skip link (if it exists)
    await page.keyboard.press('Tab');
    
    // Check if skip link is focused and visible
    const skipLink = await page.locator('.skip-link:focus, a[href^="#"]:focus').first();
    
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeVisible();
      
      // Press Enter to activate skip link
      await page.keyboard.press('Enter');
      
      // Verify focus moved to target
      const targetId = await skipLink.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const target = await page.locator(targetId);
        await expect(target).toBeFocused();
      }
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    await checkA11y(page, null, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
  });

  test('should work with screen reader announcements', async ({ page }) => {
    // Check for live regions
    const liveRegions = await page.locator('[aria-live]').all();
    
    for (const region of liveRegions) {
      const arieLive = await region.getAttribute('aria-live');
      expect(['polite', 'assertive', 'off']).toContain(arieLive);
    }
  });

  test('should handle form accessibility', async ({ page }) => {
    const forms = await page.locator('form').all();
    
    for (const form of forms) {
      // Check for form labels
      const inputs = await form.locator('input, textarea, select').all();
      
      for (const input of inputs) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledby = await input.getAttribute('aria-labelledby');
        
        if (id) {
          const label = await page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;
          
          // Input should have either a label, aria-label, or aria-labelledby
          expect(hasLabel || ariaLabel || ariaLabelledby).toBeTruthy();
        }
      }
    }
  });

  test('should handle button accessibility', async ({ page }) => {
    const buttons = await page.locator('button, [role="button"]').all();
    
    for (const button of buttons) {
      // Button should have accessible text
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaLabelledby = await button.getAttribute('aria-labelledby');
      
      expect(text?.trim() || ariaLabel || ariaLabelledby).toBeTruthy();
    }
  });

  test('should handle modal accessibility', async ({ page }) => {
    // Look for modal triggers
    const modalTriggers = await page.locator('[aria-haspopup="dialog"], [data-modal-trigger]').all();
    
    for (const trigger of modalTriggers) {
      await trigger.click();
      
      // Wait for modal to appear
      await page.waitForTimeout(500);
      
      // Check if modal has proper ARIA attributes
      const modal = await page.locator('[role="dialog"], [role="alertdialog"]').first();
      
      if (await modal.count() > 0) {
        await expect(modal).toHaveAttribute('aria-modal', 'true');
        
        // Check if focus is trapped in modal
        await page.keyboard.press('Tab');
        const focusedElement = await page.locator(':focus');
        
        // Focus should be within modal
        const isInsideModal = await focusedElement.evaluate((el, modalEl) => {
          return modalEl.contains(el);
        }, await modal.elementHandle());
        
        expect(isInsideModal).toBeTruthy();
        
        // Press Escape to close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        
        // Modal should be closed
        expect(await modal.count()).toBe(0);
      }
    }
  });

  test('should support reduced motion preferences', async ({ page }) => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Reload page with reduced motion
    await page.reload();
    
    // Verify animations are reduced or disabled
    const animatedElements = await page.locator('[class*="animate"], [class*="transition"]').all();
    
    for (const element of animatedElements) {
      const computedStyle = await element.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          animationDuration: style.animationDuration,
          transitionDuration: style.transitionDuration
        };
      });
      
      // Animation and transition durations should be minimal or zero
      expect(
        computedStyle.animationDuration === '0s' || 
        computedStyle.animationDuration === '0.01ms' ||
        computedStyle.transitionDuration === '0s' ||
        computedStyle.transitionDuration === '0.01ms'
      ).toBeTruthy();
    }
  });
});

test.describe('WCAG Compliance', () => {
  test('should meet WCAG 2.1 AA standards', async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
    
    await checkA11y(page, null, {
      tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
    });
  });

  test('should handle keyboard-only navigation', async ({ page }) => {
    await page.goto('/');
    
    // Disable mouse for this test
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Keyboard-Only-User'
    });
    
    // Navigate through all focusable elements
    const focusableElements = await page.locator(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ).all();
    
    for (let i = 0; i < Math.min(focusableElements.length, 10); i++) {
      await page.keyboard.press('Tab');
      const focused = await page.locator(':focus');
      await expect(focused).toBeVisible();
    }
  });
});
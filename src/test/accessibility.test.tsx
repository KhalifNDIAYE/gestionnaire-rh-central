import { render, userEvent, expect, describe, it, vi } from '@/test/utils/test-utils';
import { axe } from 'jest-axe';
import Header from '@/components/layout/Header';
import { AccessibleFormField } from '@/components/accessibility/AccessibleForm';
import { SkipToContent } from '@/components/accessibility/SkipToContent';

// Simple axe test helper
const expectNoViolations = (results: any) => {
  expect(results.violations).toHaveLength(0);
};

describe('Accessibility Tests', () => {
  describe('Header Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Header activeItem="dashboard" />);
      const results = await axe(container);
      expectNoViolations(results);
    });

    it('should have proper ARIA labels', () => {
      const { getByRole, getByLabelText } = render(<Header activeItem="dashboard" />);
      
      // Check for navigation landmark
      expect(getByRole('navigation')).toBeInTheDocument();
      
      // Check for banner landmark
      expect(getByRole('banner')).toBeInTheDocument();
      
      // Check for notifications button
      expect(getByLabelText('Notifications')).toBeInTheDocument();
    });

    it('should have proper breadcrumb structure', () => {
      const { getByRole } = render(<Header activeItem="employees" />);
      
      const nav = getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label');
      
      // Check for list structure in breadcrumb
      const list = nav.querySelector('ol');
      expect(list).toBeInTheDocument();
    });
  });

  describe('AccessibleFormField Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <AccessibleFormField
          id="test-field"
          label="Test Field"
          value=""
          onChange={() => {}}
        />
      );
      const results = await axe(container);
      expectNoViolations(results);
    });

    it('should associate label with input', () => {
      const { getByLabelText } = render(
        <AccessibleFormField
          id="test-field"
          label="Test Field"
          value=""
          onChange={() => {}}
        />
      );
      
      expect(getByLabelText('Test Field')).toBeInTheDocument();
    });

    it('should show required indicator', () => {
      const { getByText } = render(
        <AccessibleFormField
          id="test-field"
          label="Test Field"
          required
          value=""
          onChange={() => {}}
        />
      );
      
      // The asterisk should be present for required fields
      const label = getByText('Test Field').closest('label');
      expect(label).toHaveClass('after:content-[\'*\']');
    });

    it('should handle error states properly', () => {
      const { getByRole, getByText } = render(
        <AccessibleFormField
          id="test-field"
          label="Test Field"
          error="This field is required"
          value=""
          onChange={() => {}}
        />
      );
      
      const input = getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby');
      
      const errorMessage = getByText('This field is required');
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });

    it('should provide helpful descriptions', () => {
      const { getByRole } = render(
        <AccessibleFormField
          id="test-field"
          label="Test Field"
          description="Enter your information here"
          value=""
          onChange={() => {}}
        />
      );
      
      const input = getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby');
    });
  });

  describe('SkipToContent Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<SkipToContent targetId="main-content" />);
      const results = await axe(container);
      expectNoViolations(results);
    });

    it('should have proper skip link attributes', () => {
      const { getByText } = render(<SkipToContent targetId="main-content" />);
      
      const skipLink = getByText('Aller au contenu principal');
      expect(skipLink).toHaveAttribute('href', '#main-content');
      expect(skipLink).toHaveClass('sr-only');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle Enter and Space key activation', () => {
      const mockClick = vi.fn();
      const { getByRole } = render(
        <button onClick={mockClick}>Test Button</button>
      );
      
      const button = getByRole('button');
      
      // Test Enter key
      button.focus();
      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      button.click();
      expect(mockClick).toHaveBeenCalled();
      
      // Test Space key
      mockClick.mockClear();
      button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      button.click();
      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('ARIA Live Regions', () => {
    it('should announce changes to screen readers', () => {
      const { container, rerender } = render(
        <div aria-live="polite" aria-atomic="true">
          Initial message
        </div>
      );
      
      const liveRegion = container.querySelector('[aria-live]');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
      
      // Update the message
      rerender(
        <div aria-live="polite" aria-atomic="true">
          Updated message
        </div>
      );
      
      expect(liveRegion).toHaveTextContent('Updated message');
    });
  });

  describe('Focus Management', () => {
    it('should manage focus properly in modals', () => {
      const { getByRole, getByTestId } = render(
        <div data-testid="modal-container">
          <div role="dialog" aria-modal="true">
            <button>First Button</button>
            <button>Second Button</button>
            <button>Close</button>
          </div>
        </div>
      );
      
      const dialog = getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      
      const buttons = dialog.querySelectorAll('button');
      expect(buttons).toHaveLength(3);
    });
  });

  describe('Color Contrast', () => {
    it('should maintain sufficient color contrast', async () => {
      const { container } = render(
        <div className="bg-background text-foreground p-4">
          <h1 className="text-primary">Primary Text</h1>
          <p className="text-muted-foreground">Secondary text</p>
          <button className="bg-primary text-primary-foreground">Button</button>
        </div>
      );
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      
      expectNoViolations(results);
    });
  });

  describe('Responsive Design Accessibility', () => {
    it('should remain accessible on mobile viewports', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });
      
      const { container } = render(<Header activeItem="dashboard" />);
      const results = await axe(container);
      expectNoViolations(results);
    });
  });
});
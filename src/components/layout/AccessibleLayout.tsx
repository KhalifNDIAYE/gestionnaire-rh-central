import React, { useRef } from 'react';
import { SkipToContent } from '@/components/accessibility/SkipToContent';
import { LiveRegion, useLiveRegion } from '@/components/accessibility/LiveRegion';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { ARIA_LABELS } from '@/lib/accessibility';

interface AccessibleLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const AccessibleLayout = ({ 
  children, 
  header, 
  sidebar, 
  footer, 
  className 
}: AccessibleLayoutProps) => {
  const mainRef = useRef<HTMLElement>(null);
  const { message } = useLiveRegion();

  // Set up keyboard navigation for the entire layout
  useKeyboardNavigation(mainRef, {
    trapFocus: false,
    restoreFocus: false
  });

  return (
    <div className={className}>
      {/* Skip to content link */}
      <SkipToContent targetId="main-content" />
      
      {/* Live region for announcements */}
      <LiveRegion message={message} />
      
      {/* Header */}
      {header}
      
      {/* Layout container */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        {sidebar && (
          <aside 
            role="complementary"
            aria-label={ARIA_LABELS.menu}
            className="sidebar"
          >
            {sidebar}
          </aside>
        )}
        
        {/* Main content */}
        <main 
          ref={mainRef}
          id="main-content"
          role="main"
          tabIndex={-1}
          className="flex-1 outline-none"
          aria-label="Contenu principal"
        >
          {children}
        </main>
      </div>
      
      {/* Footer */}
      {footer && (
        <footer 
          role="contentinfo"
          className="footer"
        >
          {footer}
        </footer>
      )}
    </div>
  );
};
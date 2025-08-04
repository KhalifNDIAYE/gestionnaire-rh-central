import { useEffect, useCallback } from 'react';

interface KeyboardNavigationOptions {
  focusableSelectors?: string[];
  trapFocus?: boolean;
  restoreFocus?: boolean;
  onEscape?: () => void;
}

const defaultFocusableSelectors = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
  '[role="button"]:not([disabled])',
  '[role="link"]:not([disabled])'
];

export const useKeyboardNavigation = (
  containerRef: React.RefObject<HTMLElement>,
  options: KeyboardNavigationOptions = {}
) => {
  const {
    focusableSelectors = defaultFocusableSelectors,
    trapFocus = false,
    restoreFocus = false,
    onEscape
  } = options;

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const selector = focusableSelectors.join(', ');
    return Array.from(containerRef.current.querySelectorAll(selector)) as HTMLElement[];
  }, [containerRef, focusableSelectors]);

  const focusFirst = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
    }
  }, [getFocusableElements]);

  const focusLast = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
    }
  }, [getFocusableElements]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!containerRef.current) return;

    const elements = getFocusableElements();
    const currentIndex = elements.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case 'Tab':
        if (trapFocus && elements.length > 0) {
          event.preventDefault();
          if (event.shiftKey) {
            // Shift+Tab: go to previous element or last if at first
            const nextIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
            elements[nextIndex]?.focus();
          } else {
            // Tab: go to next element or first if at last
            const nextIndex = currentIndex >= elements.length - 1 ? 0 : currentIndex + 1;
            elements[nextIndex]?.focus();
          }
        }
        break;

      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex < elements.length - 1) {
          elements[currentIndex + 1]?.focus();
        } else if (elements.length > 0) {
          elements[0]?.focus();
        }
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex > 0) {
          elements[currentIndex - 1]?.focus();
        } else if (elements.length > 0) {
          elements[elements.length - 1]?.focus();
        }
        break;

      case 'Home':
        event.preventDefault();
        focusFirst();
        break;

      case 'End':
        event.preventDefault();
        focusLast();
        break;

      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;
    }
  }, [containerRef, getFocusableElements, trapFocus, onEscape, focusFirst, focusLast]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let previousActiveElement: Element | null = null;
    
    if (restoreFocus) {
      previousActiveElement = document.activeElement;
    }

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      
      if (restoreFocus && previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [handleKeyDown, restoreFocus, containerRef]);

  return {
    focusFirst,
    focusLast,
    getFocusableElements
  };
};
import { useRef, useCallback, RefObject } from 'react';

interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeOptions {
  minSwipeDistance?: number;
  preventDefaultTouchmoveEvent?: boolean;
}

export const useSwipeGestures = (
  callbacks: SwipeCallbacks,
  options: SwipeOptions = {}
): RefObject<HTMLElement> => {
  const {
    minSwipeDistance = 50,
    preventDefaultTouchmoveEvent = true
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const endX = useRef(0);
  const endY = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault();
    }
    endX.current = e.touches[0].clientX;
    endY.current = e.touches[0].clientY;
  }, [preventDefaultTouchmoveEvent]);

  const handleTouchEnd = useCallback(() => {
    const deltaX = endX.current - startX.current;
    const deltaY = endY.current - startY.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX < minSwipeDistance && absDeltaY < minSwipeDistance) {
      return;
    }

    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0) {
        callbacks.onSwipeRight?.();
      } else {
        callbacks.onSwipeLeft?.();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        callbacks.onSwipeDown?.();
      } else {
        callbacks.onSwipeUp?.();
      }
    }
  }, [callbacks, minSwipeDistance]);

  const attachListeners = useCallback(() => {
    const element = elementRef.current;
    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const detachListeners = useCallback(() => {
    const element = elementRef.current;
    if (element) {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Auto-attach listeners when ref is set
  const setRef = useCallback((node: HTMLElement | null) => {
    if (elementRef.current) {
      detachListeners();
    }
    elementRef.current = node;
    if (node) {
      attachListeners();
    }
  }, [attachListeners, detachListeners]);

  return { current: null, attach: setRef } as RefObject<HTMLElement>;
};
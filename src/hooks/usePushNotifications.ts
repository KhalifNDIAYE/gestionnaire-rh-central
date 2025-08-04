import { useState, useEffect, useCallback } from 'react';

interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
}

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      throw new Error('Notifications not supported');
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, [isSupported]);

  const subscribeToPush = useCallback(async () => {
    if (!isSupported || permission !== 'granted') {
      throw new Error('Notifications not permitted');
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error('Service worker not registered');
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: generateVAPIDKeys(), // You'd need to implement this
      });

      setSubscription(sub);
      return sub;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }, [isSupported, permission]);

  const showLocalNotification = useCallback(async (options: NotificationOptions) => {
    if (!isSupported || permission !== 'granted') {
      throw new Error('Notifications not permitted');
    }

    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/favicon.ico',
      badge: options.badge,
      tag: options.tag,
      data: options.data,
      requireInteraction: options.requireInteraction,
      silent: options.silent,
    });

    return notification;
  }, [isSupported, permission]);

  const scheduleNotification = useCallback((options: NotificationOptions, delay: number) => {
    setTimeout(() => {
      showLocalNotification(options);
    }, delay);
  }, [showLocalNotification]);

  return {
    permission,
    subscription,
    isSupported,
    requestPermission,
    subscribeToPush,
    showLocalNotification,
    scheduleNotification,
  };
};

// Helper function to generate VAPID keys (you'd implement this server-side)
function generateVAPIDKeys() {
  // This is a placeholder - in a real app, you'd get this from your server
  return new Uint8Array([
    0x04, 0x37, 0x77, 0xfe, 0x14, 0x32, 0xec, 0xd2, 0x0a, 0x34, 0xd4, 0xcb,
    0x58, 0x8d, 0x7e, 0x9b, 0x31, 0x8f, 0x41, 0x4b, 0x33, 0x09, 0xeb, 0xf4,
    0x15, 0x6a, 0x3c, 0x70, 0x75, 0xfb, 0x8b, 0x7d, 0x2e, 0x14, 0x32, 0xec,
    0xd2, 0x0a, 0x34, 0xd4, 0xcb, 0x58, 0x8d, 0x7e, 0x9b, 0x31, 0x8f, 0x41,
    0x4b, 0x33, 0x09, 0xeb, 0xf4, 0x15, 0x6a, 0x3c, 0x70, 0x75, 0xfb, 0x8b,
    0x7d, 0x2e, 0x14, 0x32, 0xec, 0xd2, 0x0a
  ]);
}
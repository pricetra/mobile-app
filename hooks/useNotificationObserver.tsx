import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { ReactNode, useEffect } from 'react';

export function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const data = notification.request.content.data;
      const productId = data['productId'] as string | undefined;
      const stockId = data['stockId'] as string | undefined;
      if (productId && stockId) {
        router.push(`/(tabs)/(products)/${productId}?stockId=${stockId}`);
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) return;
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      redirect(response.notification);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

export function NotificationHandler({ children }: { children: ReactNode }) {
  useNotificationObserver();

  return <>{children}</>;
}

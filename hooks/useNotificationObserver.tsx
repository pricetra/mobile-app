import { useAuth } from '@/context/UserContext';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { ReactNode, useEffect } from 'react';

export function useNotificationObserver() {
  const { lists } = useAuth();

  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const data = notification.request.content.data;
      const productId = data['productId'];
      const stockId = data['stockId'];
      if (productId && stockId) {
        router.push(`/(tabs)/(products)/${productId}?stockId=${stockId}`);
      }
    }

    const watchedProducts = lists.watchList.productList;
    if (watchedProducts && watchedProducts.length !== 0) {
      Notifications.getPermissionsAsync().then(({ granted, ios }) => {
        const Status = Notifications.IosAuthorizationStatus;
        if (!granted || ios?.status === Status.NOT_DETERMINED) {
          Notifications.requestPermissionsAsync();
        }
      });
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

import { useGlobalSearchParams, usePathname } from 'expo-router';
import { useEffect } from 'react';

import { useRouteHistory } from '@/context/RouteHistory';

export default function RouteChange() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const { addToHistory } = useRouteHistory();

  useEffect(() => {
    const queryString = new URLSearchParams(params as any).toString();
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;
    addToHistory(fullPath);
  }, [pathname, JSON.stringify(params)]);

  return null;
}

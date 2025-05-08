import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export default function useCurrentLocation() {
  const [location, setLocation] = useState<Location.LocationObject>();

  async function getCurrentLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return alert('Permission to access location was denied');
    }
    Location.watchPositionAsync(
      {
        timeInterval: 1000 * 60,
      },
      setLocation
    );
  }

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return { location };
}

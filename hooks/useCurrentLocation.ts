import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export default function useCurrentLocation() {
  const [location, setLocation] = useState<Location.LocationObject>();

  async function requestPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return alert('Permission to access location was denied');
    }
  }

  async function getCurrentLocation(options: Location.LocationOptions) {
    const curLocation = await Location.getCurrentPositionAsync(options);
    setLocation(curLocation);
    return curLocation;
  }

  async function getCurrentGeocodeAddress(options: Location.LocationOptions) {
    return getCurrentLocation(options).then(async ({ coords }) => {
      console.log(coords.latitude, coords.longitude);
      const address = await Location.reverseGeocodeAsync(coords);
      return address;
    });
  }

  function watchLocation(options: Location.LocationOptions, cb: Location.LocationCallback) {
    return Location.watchPositionAsync(options, (l) => {
      setLocation(l);
      cb(l);
    });
  }

  useEffect(() => {
    requestPermission();
    getCurrentLocation({});
  }, []);

  return { location, getCurrentLocation, watchLocation, getCurrentGeocodeAddress };
}

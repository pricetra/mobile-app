import * as Location from 'expo-location';
import { useState } from 'react';

export default function useLocationService() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject>();

  async function requestPermission() {
    const permissionResponse = await Location.requestForegroundPermissionsAsync();
    setPermissionGranted(permissionResponse.status === Location.PermissionStatus.GRANTED);
    return permissionResponse;
  }

  async function getCurrentLocation(options: Location.LocationOptions) {
    await requestPermission();
    const curLocation = await Location.getCurrentPositionAsync(options);
    setLocation(curLocation);
    return curLocation;
  }

  async function getCurrentGeocodeAddress(options: Location.LocationOptions) {
    await requestPermission();
    return getCurrentLocation(options).then(async ({ coords }) => {
      const address = await Location.reverseGeocodeAsync(coords);
      return address;
    });
  }

  async function watchLocation(options: Location.LocationOptions, cb: Location.LocationCallback) {
    await requestPermission();
    return Location.watchPositionAsync(options, (l) => {
      setLocation(l);
      cb(l);
    });
  }

  return {
    location,
    permissionGranted,
    getCurrentLocation,
    watchLocation,
    getCurrentGeocodeAddress,
  };
}

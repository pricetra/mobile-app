import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useAuth } from './UserContext';

import { LocationInput } from '@/graphql/types/graphql';

export const DEFAULT_SEARCH_RADIUS = 160_934; // ~100 miles

export type LocationContextType = {
  currentLocation?: LocationInput;
  setCurrentLocation: (location?: LocationInput) => void;
  resetCurrentLocation: () => LocationInput | undefined;
};

export const LocationContext = createContext({} as LocationContextType);

export type LocationContextProviderProps = {
  children: ReactNode;
};

export default function LocationContextProvider({ children }: LocationContextProviderProps) {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<LocationInput>();

  function resetCurrentLocation() {
    if (!user.address) return;
    const newLocation = {
      latitude: user.address?.latitude,
      longitude: user.address?.longitude,
      radiusMeters: DEFAULT_SEARCH_RADIUS,
    } as LocationInput;
    setCurrentLocation(newLocation);
    return newLocation;
  }

  useEffect(() => {
    resetCurrentLocation();
  }, [user.address]);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        resetCurrentLocation,
      }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useCurrentLocation = () => useContext(LocationContext);

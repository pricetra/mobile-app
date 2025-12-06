import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';

import { useAuth } from './UserContext';

import { LocationInput } from 'graphql-utils';

export const DEFAULT_SEARCH_RADIUS = 160_934; // ~100 miles

export type LocationInputWithFullAddress = {
  locationInput: LocationInput;
  fullAddress: string;
};

export type LocationContextType = {
  currentLocation: LocationInputWithFullAddress;
  setCurrentLocation: (location?: LocationInputWithFullAddress) => void;
  resetCurrentLocation: () => LocationInputWithFullAddress | undefined;
};

export const LocationContext = createContext({} as LocationContextType);

export type LocationContextProviderProps = {
  children: ReactNode;
};

export default function LocationContextProvider({ children }: LocationContextProviderProps) {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<LocationInputWithFullAddress>();

  function resetCurrentLocation() {
    if (!user.address) return;
    const newLocation = {
      locationInput: {
        latitude: user.address?.latitude,
        longitude: user.address?.longitude,
        radiusMeters: DEFAULT_SEARCH_RADIUS,
      },
      fullAddress: user.address.fullAddress,
    } as LocationInputWithFullAddress;
    setCurrentLocation(newLocation);
    return newLocation;
  }

  useEffect(() => {
    resetCurrentLocation();
  }, [user.address]);

  if (!currentLocation) return <View className="h-full w-full flex-1 bg-white" />;

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setCurrentLocation: (l) => {
          if (!l) return resetCurrentLocation();
          setCurrentLocation(l);
        },
        resetCurrentLocation,
      }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useCurrentLocation = () => useContext(LocationContext);

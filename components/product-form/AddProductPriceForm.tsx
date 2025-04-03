import { useLazyQuery } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { FindBranchesByDistanceDocument, Product } from '@/graphql/types/graphql';

export type AddProductPriceFormProps = {
  product: Product;
  onCancel: () => void;
};

export default function AddProductPriceForm({ product, onCancel }: AddProductPriceFormProps) {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [findBranchesByDistance, { data: branchesData, loading: branchesLoading }] = useLazyQuery(
    FindBranchesByDistanceDocument
  );

  async function getCurrentLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return alert('Permission to access location was denied');
    }

    const location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  }

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (!location) return;
    console.log(location.coords);
    findBranchesByDistance({
      variables: {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        radiusMeters: 3000, // TODO: Ideally use 500 meters as the radius
      },
    });
  }, [location]);

  if (!location || branchesLoading || !branchesData)
    return (
      <View className="flex h-40 items-center justify-center p-10">
        <AntDesign
          name="loading1"
          className="size-[50px] animate-spin text-center"
          color="#374151"
          size={50}
        />
      </View>
    );

  return (
    <View>
      {branchesData.findBranchesByDistance.map((b) => (
        <View key={b.id} className="mb-7">
          <Text className="text-lg font-bold">{b.name}</Text>
          <Text className="text-sm color-gray-700">{b.address?.fullAddress}</Text>
        </View>
      ))}
    </View>
  );
}

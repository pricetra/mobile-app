import { Entypo, Octicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

import { useCurrentLocation } from '@/context/LocationContext';

export type LocationChangeButtonProps = {
  onPress: () => void;
};

export default function LocationChangeButton({ onPress }: LocationChangeButtonProps) {
  const { currentLocation } = useCurrentLocation();
  const parsedAddress = useMemo(
    () => currentLocation.fullAddress.split(','),
    [currentLocation.fullAddress]
  );

  return (
    <TouchableOpacity
      className="flex flex-row items-center gap-3 rounded-full bg-gray-100 px-4 py-1.5"
      onPress={onPress}>
      <Octicons name="location" size={15} color="#1f2937" />

      <View className="py-1">
        <Text className="text-xs font-semibold color-gray-800" numberOfLines={1}>
          {parsedAddress[0].trim()}
        </Text>
      </View>

      <Entypo name="chevron-down" size={15} color="#1f2937" />
    </TouchableOpacity>
  );
}

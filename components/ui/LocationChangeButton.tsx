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
      className="flex flex-row items-center gap-3 rounded-full border-[1px] border-gray-100 bg-gray-50 px-6 py-2"
      onPress={onPress}>
      <Octicons name="location" size={15} color="#1f2937" />

      <View>
        <Text className="text-sm font-semibold color-gray-800" numberOfLines={1}>
          {parsedAddress[0].trim()}
        </Text>
        <Text className="text-[10px] font-normal color-gray-800">
          {parsedAddress.slice(1).join(',').trim()}
        </Text>
      </View>

      <Entypo name="chevron-down" size={15} color="#1f2937" style={{ marginLeft: 10 }} />
    </TouchableOpacity>
  );
}

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

const SORT_OPTIONS = [
  { name: 'Default', value: undefined },
  { name: 'Lowest Price', value: 'asc' },
  { name: 'Highest Price', value: 'desc' },
] as const;

export default function FilterSortByPriceModal({
  value: selectedValue,
  onSubmit,
}: {
  value?: string;
  onClose: () => void;
  onSubmit: (sort?: string) => void;
}) {
  return (
    <View>
      {SORT_OPTIONS.map(({ name, value }, i) => (
        <TouchableOpacity
          onPress={() => onSubmit(value)}
          className="flex flex-row items-center gap-3 py-4"
          key={`sort-${i}`}>
          <MaterialCommunityIcons
            name={value === selectedValue ? 'radiobox-marked' : 'radiobox-blank'}
            size={24}
            color="#396a12"
          />
          <Text className="text-xl font-semibold">{name}</Text>
        </TouchableOpacity>
      ))}

      <View style={{ height: 200 }} />
    </View>
  );
}

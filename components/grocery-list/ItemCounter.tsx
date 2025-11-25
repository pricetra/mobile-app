import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, View, Text } from 'react-native';

export type ItemCounterProps = {
  quantity: number;
  onChange: (newQuantity: number) => void;
};

const iconSize = 13;

export default function ItemCounter({ quantity, onChange }: ItemCounterProps) {
  return (
    <View className="flex flex-row items-center rounded-full border-[1px] border-gray-100 bg-gray-50">
      <TouchableOpacity onPress={() => onChange(quantity - 1)} className="px-3 py-2.5">
        {quantity === 1 ? (
          <Feather name="trash-2" size={iconSize} color="black" />
        ) : (
          <Feather name="minus" size={iconSize} color="black" />
        )}
      </TouchableOpacity>

      <View className="px-4 py-1.5">
        <Text className="text-sm font-bold">{quantity}</Text>
      </View>

      <TouchableOpacity onPress={() => onChange(quantity + 1)} className="px-3 py-2">
        <Feather name="plus" size={iconSize} color="black" />
      </TouchableOpacity>
    </View>
  );
}

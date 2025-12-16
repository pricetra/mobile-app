import { TouchableOpacity, View, Text } from 'react-native';

import ProductItem from '@/components/ProductItem';
import { Product } from 'graphql-utils';

export type ScannedProductViewProps = {
  product: Product;
  onEditModalPress: () => void;
  onAddPriceModalPress: () => void;
};

export default function ScannedProductView({
  product,
  onEditModalPress,
  onAddPriceModalPress,
}: ScannedProductViewProps) {
  return (
    <View className="flex w-full flex-col shadow-xl shadow-black/50">
      <View className="rounded-t-lg bg-white p-5">
        <ProductItem product={product} />
      </View>

      <View className="flex flex-row items-center justify-between gap-3 rounded-b-lg bg-gray-100">
        <TouchableOpacity onPress={onEditModalPress} className="px-10 py-3">
          <Text className="font-bold text-gray-600">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAddPriceModalPress} className="px-10 py-3">
          <Text className="font-bold text-gray-600">Add price</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

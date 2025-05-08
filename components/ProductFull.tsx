import { Entypo } from '@expo/vector-icons';
import { View, Text, useWindowDimensions } from 'react-native';

import Image from './ui/Image';

import { Product } from '@/graphql/types/graphql';

export type ProductFullProps = {
  product: Product;
};

export default function ProductFull({ product }: ProductFullProps) {
  const { width } = useWindowDimensions();

  return (
    <View className="flex flex-col gap-3">
      <View>
        <Image src={product.image} className="bg-gray-400" style={{ width, height: width }} />
      </View>

      <View className="p-5">
        <View className="flex flex-col gap-2">
          <View className="flex flex-row flex-wrap items-center gap-1">
            <Text className="font-semibold">{product.brand}</Text>
            {product.weight && (
              <>
                <Entypo name="dot-single" size={20} color="black" />
                <Text>{product.weight}</Text>
              </>
            )}
          </View>
          <Text className="text-2xl font-bold">{product.name}</Text>
          {product.category && <Text className="text-sm">{product.category.expandedPathname}</Text>}
        </View>

        <View className="mt-10">
          <Text style={{ lineHeight: 19 }}>{product.description}</Text>
        </View>
      </View>
    </View>
  );
}

import { Feather } from '@expo/vector-icons';
import { View, Image, Text } from 'react-native';

import { Skeleton } from './ui/Skeleton';

import { Product } from '@/graphql/types/graphql';
import BarcodeText from './ui/BarcodeText';

export type ProductItemProps = {
  product: Product;
};

export default function ProductItem({ product }: ProductItemProps) {
  return (
    <View className="mb-10 flex max-w-full flex-row gap-2">
      {product.image !== '' ? (
        <Image
          source={{
            uri: product.image,
          }}
          className="size-28 rounded-lg"
        />
      ) : (
        <View className="flex size-28 items-center justify-center rounded-lg bg-gray-300">
          <Feather name="camera-off" size={40} color="#777" />
        </View>
      )}
      <View className="flex max-w-full flex-1 flex-col justify-between gap-2 px-2">
        <View className="flex flex-col gap-1">
          <BarcodeText className="text-sm color-gray-600">{product.code}</BarcodeText>
          <Text className="font-bold">{product.name}</Text>
        </View>

        {product.brand && <Text className="text-sm">{product.brand}</Text>}
      </View>
    </View>
  );
}

export function ProductLoadingItem() {
  return (
    <View className="mb-10 flex max-w-full flex-row gap-2">
      <Skeleton className="size-28 rounded-lg" />
      <View className="max-w-full flex-1 gap-2 p-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-[100px]" />
      </View>
    </View>
  );
}

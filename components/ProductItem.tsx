import { useState } from 'react';
import { View, Image, Text } from 'react-native';

import BarcodeText from './ui/BarcodeText';
import { Skeleton } from './ui/Skeleton';

import { Product } from '@/graphql/types/graphql';

export type ProductItemProps = {
  product: Product;
};

export default function ProductItem({ product }: ProductItemProps) {
  const loadingImage = require('../assets/images/loading_img.jpg');
  const noImage = require('../assets/images/no_img.jpg');
  const [image, setImage] = useState(product.image);

  return (
    <View className="mb-10 flex max-w-full flex-row gap-2">
      <Image
        defaultSource={loadingImage}
        onError={() => setImage('')}
        source={
          image !== ''
            ? {
                uri: image,
              }
            : noImage
        }
        className="size-28 rounded-lg"
      />
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

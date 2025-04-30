import { View, Text } from 'react-native';

import { Skeleton } from './ui/Skeleton';

import Image from '@/components/ui/Image';
import { Product } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';

export type ProductItemProps = {
  product: Product;
};

export default function ProductItem({ product }: ProductItemProps) {
  return (
    <View className="flex max-w-full flex-row gap-2">
      <Image src={createCloudinaryUrl(product.code, 500)} className="size-28 rounded-lg" />
      <View className="flex max-w-full flex-1 flex-col justify-between gap-2 px-2">
        <View className="flex flex-col gap-1">
          <View className="flex flex-row justify-between gap-2">
            {product.brand && <Text className="text-sm">{product.brand}</Text>}
          </View>
          <Text className="font-bold">{product.name}</Text>
        </View>

        <View className="flex flex-row items-center justify-between gap-2">
          <View className="flex-1">
            {product.category && <Text className="text-sm">{product.category.name}</Text>}
            {product.weight && <Text className="text-sm">{product.weight}</Text>}
          </View>

          {product.stock && product.stock.latestPrice && (
            <Text className="text-sm font-bold" style={{ fontFamily: 'monospace' }}>
              ${product.stock.latestPrice.amount}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

export function ProductLoadingItem() {
  return (
    <View className="flex max-w-full flex-row gap-2">
      <Skeleton className="size-28 rounded-lg" />
      <View className="max-w-full flex-1 gap-2 p-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-[100px]" />
      </View>
    </View>
  );
}

export type RenderProductLoadingItemsProps = { count?: number; noPadding?: boolean };

export function RenderProductLoadingItems({
  count = 5,
  noPadding = false,
}: RenderProductLoadingItemsProps) {
  return (
    <View style={{ padding: noPadding ? 0 : 20 }}>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <View className="mb-10" key={i}>
            <ProductLoadingItem />
          </View>
        ))}
    </View>
  );
}

import { Entypo } from '@expo/vector-icons';
import { View, Text, useWindowDimensions } from 'react-native';

import ProductStockMini from './ProductStockMini';
import { Skeleton } from './ui/Skeleton';

import Image from '@/components/ui/Image';
import { Product } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { currencyFormat } from '@/lib/strings';

export type ProductItemProps = {
  product: Product;
};

export default function ProductItem({ product }: ProductItemProps) {
  const { width } = useWindowDimensions();

  return (
    <View className="flex max-w-full flex-row gap-2">
      <View style={{ width: width / 3, height: width / 3, position: 'relative' }}>
        {product.stock?.latestPrice?.sale && (
          <View className="absolute left-1 top-1 z-[1] w-[40px]">
            <Text className="inline-block rounded-md bg-red-700 px-1.5 py-1 text-center text-[9px] font-bold color-white">
              SALE
            </Text>
          </View>
        )}
        <Image
          src={createCloudinaryUrl(product.code, 500)}
          className="rounded-lg"
          style={{ width: width / 3, height: width / 3 }}
        />
      </View>
      <View className="flex max-w-full flex-1 flex-col justify-between gap-2 px-2">
        <View className="flex flex-col gap-1">
          <View className="flex flex-row flex-wrap items-center gap-1">
            {product.brand && <Text className="text-xs">{product.brand}</Text>}

            {product.weight && product.weight.length > 0 && (
              <>
                <Entypo name="dot-single" size={12} color="black" />
                <Text className="text-xs">{product.weight}</Text>
              </>
            )}
          </View>
          <Text className="font-bold">{product.name}</Text>
          {product.category && <Text className="mt-2 text-xs">{product.category.name}</Text>}
        </View>

        {product.stock && (
          <View className="flex flex-row items-center justify-between gap-2">
            {product.stock.store && product.stock.branch && (
              <View className="flex-[2] gap-1">
                <ProductStockMini stock={product.stock} />
              </View>
            )}

            {product.stock.latestPrice && (
              <View className="flex-[1] flex-col items-end">
                {product.stock.latestPrice.sale && product.stock.latestPrice.originalPrice && (
                  <Text className="text-right text-xs line-through color-red-700">
                    {currencyFormat(product.stock.latestPrice.originalPrice)}
                  </Text>
                )}
                <Text className="font-black">
                  {currencyFormat(product.stock.latestPrice.amount)}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

export function ProductLoadingItem() {
  const { width } = useWindowDimensions();

  return (
    <View className="flex max-w-full flex-row gap-2">
      <View style={{ width: width / 3, height: width / 3 }}>
        <Skeleton className="size-full rounded-lg" />
      </View>
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

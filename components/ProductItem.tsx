import { useMemo } from 'react';
import { View, Text } from 'react-native';

import ProductMetadataBadge from './ProductMetadataBadge';
import ProductStockMini from './ProductStockMini';
import AddToGroceryListActionButton from './ui/AddToGroceryListActionButton';
import { Skeleton } from './ui/Skeleton';

import Image from '@/components/ui/Image';
import { Product } from '@/graphql/types/graphql';
import useProductWeightBuilder from '@/hooks/useProductWeightBuilder';
import { createCloudinaryUrl } from '@/lib/files';
import { currencyFormat, getPriceUnit } from '@/lib/strings';
import { cn, isSaleExpired } from '@/lib/utils';

export type ProductItemOptionalProps = {
  imgWidth?: number;
  hideStoreInfo?: boolean;
  hideAddButton?: boolean;
};

export type ProductItemProps = ProductItemOptionalProps & {
  product: Product;
};

export default function ProductItem({
  product,
  hideStoreInfo = false,
  imgWidth = 130,
  hideAddButton = false,
}: ProductItemProps) {
  const isExpired = useMemo(
    () => (product.stock?.latestPrice ? isSaleExpired(product.stock.latestPrice) : false),
    [product.stock?.latestPrice]
  );
  const calculatedAmount = useMemo(() => {
    if (!product.stock?.latestPrice) return 0;
    return !isExpired
      ? product.stock.latestPrice.amount
      : (product.stock.latestPrice.originalPrice ?? product.stock.latestPrice.amount);
  }, [product.stock?.latestPrice, isExpired]);
  const weight = useProductWeightBuilder(product);

  return (
    <View className="flex max-w-full flex-row gap-2">
      <View style={{ width: imgWidth, height: imgWidth, position: 'relative' }}>
        {product.stock?.latestPrice?.sale && !isExpired && (
          <View className="absolute left-1 top-1 z-[1] w-[40px]">
            <Text className="inline-block rounded-md bg-red-700 px-1.5 py-1 text-center text-[9px] font-bold color-white">
              SALE
            </Text>
          </View>
        )}

        {!hideAddButton && <AddToGroceryListActionButton productId={product.id} />}

        <Image
          src={createCloudinaryUrl(product.code, 500)}
          className="rounded-xl"
          style={{ width: imgWidth, height: imgWidth }}
        />
      </View>
      <View className="flex max-w-full flex-1 flex-col gap-3 px-2">
        <View className="flex flex-col gap-1">
          <View className="mb-1 flex flex-row items-center gap-1">
            {product.weightValue && product.weightType && (
              <ProductMetadataBadge type="weight" size="sm" text={weight} />
            )}
            {product.quantityValue && product.quantityType && (
              <ProductMetadataBadge
                type="quantity"
                size="sm"
                text={`${product.quantityValue} ${product.quantityType}`}
              />
            )}
          </View>

          <View className="flex flex-row flex-wrap items-center gap-1">
            {product.brand && product.brand !== 'N/A' && (
              <Text className="text-xs text-gray-600">{product.brand}</Text>
            )}
          </View>
          <Text numberOfLines={3}>{product.name}</Text>
        </View>

        {product.stock && (
          <View className="flex flex-row items-center justify-between gap-2">
            {!hideStoreInfo && product.stock.store && product.stock.branch && (
              <View className="flex-[2] gap-1">
                <ProductStockMini stock={product.stock} />
              </View>
            )}

            {product.stock.latestPrice && (
              <View
                className={cn('flex-[1] flex-col', hideStoreInfo ? 'items-start' : 'items-end')}>
                {product.stock.latestPrice.sale &&
                  !isExpired &&
                  product.stock.latestPrice.originalPrice && (
                    <Text className="text-right text-xs line-through color-red-700">
                      {currencyFormat(product.stock.latestPrice.originalPrice)}
                    </Text>
                  )}
                <View className="flex flex-row items-center justify-start gap-1">
                  <Text className="font-black">{currencyFormat(calculatedAmount)}</Text>
                  {product.stock.latestPrice.unitType !== 'item' && (
                    <Text className="text-xs color-gray-500">
                      {getPriceUnit(product.stock.latestPrice)}
                    </Text>
                  )}
                </View>
                {product.quantityValue > 1 && (
                  <Text className="text-right text-[10px] color-gray-500">
                    {`${currencyFormat(calculatedAmount / product.quantityValue)}/${product.quantityType}`}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

export function ProductItemLoading({ imgWidth = 130 }: Pick<ProductItemProps, 'imgWidth'>) {
  return (
    <View className="flex max-w-full flex-row gap-2">
      <View style={{ width: imgWidth, height: imgWidth }}>
        <Skeleton className="size-full rounded-xl" />
      </View>
      <View className="max-w-full flex-1 gap-2 p-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-[100px]" />
      </View>
    </View>
  );
}

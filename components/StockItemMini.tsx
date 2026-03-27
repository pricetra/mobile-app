import dayjs from 'dayjs';
import { Product, Stock } from 'graphql-utils';
import { useMemo } from 'react';
import { View, Text } from 'react-native';

import Image from '@/components/ui/Image';
import useCalculatedPrice from '@/hooks/useCalculatedPrice';
import useIsSaleExpired from '@/hooks/useIsSaleExpired';
import usePricePerUnit from '@/hooks/usePricePerUnit';
import { createCloudinaryUrl } from '@/lib/files';
import { cleanUrl, currencyFormat, getPriceUnitOrEach } from '@/lib/strings';
import { cn, metersToMiles } from '@/lib/utils';

export type StockItemMiniProps = {
  product: Product;
  stock: Stock;
  approximatePrice?: number;
  stackLogo?: boolean;
};

export default function StockItemMini({
  product,
  stock,
  approximatePrice,
  stackLogo = false,
}: StockItemMiniProps) {
  if (!stock.store || !stock.branch) throw new Error('stock has no store or branch objects');

  const isExpired = useIsSaleExpired(stock.latestPrice);
  const calculatedAmount = useCalculatedPrice({
    isExpired,
    latestPrice: stock.latestPrice,
  });
  const pricePerUnit = usePricePerUnit(calculatedAmount, product);
  const storeUrl = useMemo(
    () => (stock.branch?.onlineAddress ? cleanUrl(stock.branch.onlineAddress.url) : undefined),
    [stock.branch?.onlineAddress]
  );

  return (
    <View className="flex flex-col gap-2">
      <View className={cn('flex gap-2', stackLogo ? 'flex-col' : 'flex-row')}>
        <Image
          src={createCloudinaryUrl(stock.store.logo, 500, 500)}
          className="size-[30px] rounded-lg border-[1px] border-gray-100"
        />

        <View className={cn('flex flex-col gap-1', stackLogo ? '' : 'flex-1')}>
          <View className="flex flex-row items-center">
            {stock.latestPrice?.sale && !isExpired && (
              <View className="mb-1 rounded-full bg-red-700 px-1.5 py-0.5">
                <Text className="text-[8px] color-white">SALE</Text>
              </View>
            )}

            {stock.branch.address?.distance && (
              <View className="mb-1 rounded-full bg-pricetraGreenDark/10 px-1.5 py-0.5">
                <Text className="text-[8px] color-pricetraGreenHeavyDark">
                  {metersToMiles(stock.branch.address.distance)} mi
                </Text>
              </View>
            )}

            {stock.branch.onlineAddress && (
              <View className="mb-1 rounded-full bg-pricetraGreenDark/10 px-1.5 py-0.5">
                <Text className="text-[8px] color-pricetraGreenHeavyDark">Online</Text>
              </View>
            )}
          </View>

          <Text className="text-[13px]" numberOfLines={2}>
            {stock.store.name}
          </Text>

          {stock.branch.address && (
            <Text className="text-[9px]" numberOfLines={2}>
              {stock.branch.address.street}, {stock.branch.address.city}
            </Text>
          )}

          {stock.branch.onlineAddress && storeUrl && (
            <Text className="text-[9px]" numberOfLines={2}>
              {storeUrl}
            </Text>
          )}

          <View
            className="mt-2 flex flex-col gap-0.5"
            style={{
              opacity: stock.latestPrice?.outOfStock || stock.available === false ? 0.5 : 1,
            }}>
            {stock?.latestPrice?.sale && !isExpired && stock.latestPrice.originalPrice && (
              <Text className="text-xs line-through color-red-700">
                {currencyFormat(stock.latestPrice.originalPrice)}
              </Text>
            )}

            {stock?.latestPrice?.amount && (
              <View className="flex flex-row items-center justify-start gap-1">
                <Text className="font-black">{currencyFormat(calculatedAmount)}</Text>
                <Text className="text-xs color-gray-500">
                  {getPriceUnitOrEach(stock.latestPrice)}
                </Text>
              </View>
            )}

            {stock.latestPrice?.amount && pricePerUnit && (
              <Text className="text-[10px] color-gray-500">
                {`${currencyFormat(pricePerUnit.amount)}/${pricePerUnit.unit}`}
              </Text>
            )}

            {approximatePrice && (
              <Text className="">
                <Text className=" font-black">{currencyFormat(approximatePrice)}</Text>*
              </Text>
            )}

            {!stock?.latestPrice?.amount && !approximatePrice && (
              <Text className="text-lg font-black">--</Text>
            )}
          </View>

          {stock.latestPrice?.outOfStock && (
            <View>
              <Text className="text-xs font-semibold color-black">
                <Text className="bg-red-200/50">*Out of Stock</Text>
              </Text>
            </View>
          )}

          {stock.available === false && (
            <View>
              <Text className="text-xs font-semibold color-black">
                <Text className="bg-red-200/50">*Unavailable</Text>
              </Text>
            </View>
          )}
        </View>
      </View>

      {stock.latestPrice?.sale && !isExpired && (
        <View className="flex flex-col gap-1">
          {stock.latestPrice?.expiresAt && (
            <Text>
              <Text className="bg-blue-200/50 text-[9px] italic">
                Valid until{' '}
                <Text className="font-bold">{dayjs(stock.latestPrice.expiresAt).format('LL')}</Text>
              </Text>
            </Text>
          )}

          {stock.latestPrice?.condition && (
            <Text>
              <Text className="bg-yellow-200/50 text-[9px] italic">
                *{stock.latestPrice.condition}
              </Text>
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

import dayjs from 'dayjs';
import { useMemo } from 'react';
import { View, Text } from 'react-native';

import Image from '@/components/ui/Image';
import { Stock } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { currencyFormat, getPriceUnitOrEach } from '@/lib/strings';
import { cn, isSaleExpired, metersToMiles } from '@/lib/utils';

export type StockItemMiniProps = {
  stock: Stock;
  approximatePrice?: number;
  quantityValue?: number;
  quantityType?: string;
  stackLogo?: boolean;
};

export default function StockItemMini({
  stock,
  approximatePrice,
  quantityValue,
  quantityType,
  stackLogo = false,
}: StockItemMiniProps) {
  if (!stock.store || !stock.branch) throw new Error('stock has no store or branch objects');

  const isExpired = useMemo(
    () => (stock.latestPrice ? isSaleExpired(stock.latestPrice) : false),
    [stock.latestPrice]
  );
  const calculatedAmount = useMemo(() => {
    if (!stock?.latestPrice) return 0;
    return !isExpired
      ? stock.latestPrice.amount
      : (stock.latestPrice.originalPrice ?? stock.latestPrice.amount);
  }, [stock?.latestPrice, isExpired]);

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
          </View>

          <Text className="text-[13px]" numberOfLines={2}>
            {stock.store.name}
          </Text>

          <Text className="text-[9px]" numberOfLines={2}>
            {stock.branch.address?.street}, {stock.branch.address?.city}
          </Text>

          <View className="mt-2 flex flex-col gap-0.5">
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

            {stock.latestPrice?.amount && quantityValue && quantityValue > 1 && (
              <Text className="text-[10px] color-gray-500">
                {`${currencyFormat(calculatedAmount / quantityValue)}/${quantityType}`}
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
        </View>
      </View>

      {stock.latestPrice?.sale && !isExpired && (
        <View className="flex flex-col gap-1">
          {stock.latestPrice?.expiresAt && (
            <Text>
              <Text className="bg-yellow-200 text-[9px] italic">
                Valid until{' '}
                <Text className="font-bold">{dayjs(stock.latestPrice.expiresAt).format('LL')}</Text>
              </Text>
            </Text>
          )}

          {stock.latestPrice?.condition && (
            <Text>
              <Text className="bg-yellow-200 text-[9px] italic">
                *{stock.latestPrice.condition}
              </Text>
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

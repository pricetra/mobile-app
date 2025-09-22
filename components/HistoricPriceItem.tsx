import dayjs from 'dayjs';
import { View, Text, Image } from 'react-native';

import { Price, Stock } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { currencyFormat, getPriceUnitOrEach } from '@/lib/strings';

export type HistoricPriceItemProps = {
  stock: Stock;
  price: Price;
};

export default function HistoricPriceItem({ stock, price }: HistoricPriceItemProps) {
  return (
    <View className="mb-7 flex flex-row items-center justify-between gap-3">
      <View className="flex flex-col gap-1">
        {price.sale && (
          <View className="w-[70px]">
            <Text className="inline-block rounded-md bg-red-700 px-1 py-0.5 text-center text-[8px] font-bold color-white">
              SALE Reported
            </Text>
          </View>
        )}

        {price.sale && price.originalPrice && (
          <Text className="text line-through color-red-700">
            {currencyFormat(price.originalPrice)}
          </Text>
        )}
        <View className="flex flex-row items-center justify-start gap-1">
          <Text className="text-xl font-black">{currencyFormat(price.amount)}</Text>
          <Text className="text-xs color-gray-500">/ {price.unitType}</Text>
        </View>

        {price.sale && price.expiresAt && (
          <Text className="bg-yellow-200 text-xs italic">
            Valid until <Text className="font-bold">{dayjs(price.expiresAt).format('LL')}</Text>
          </Text>
        )}

        {stock.latestPrice?.condition && (
          <Text>
            <Text className="bg-yellow-200 text-xs italic">*{stock.latestPrice.condition}</Text>
          </Text>
        )}

        <View className="flex flex-row items-center gap-1">
          <Image
            source={
              price.createdBy?.avatar
                ? {
                    uri: createCloudinaryUrl(price.createdBy.avatar, 100, 100),
                  }
                : require('@/assets/images/no_avatar.jpg')
            }
            className="size-[17px] rounded-full"
          />
          <View>
            <Text className="text-xs">{price.createdBy?.name}</Text>
          </View>
        </View>
      </View>

      <View>
        <Text className="text-xs">Reported on</Text>
        <Text className="mt-0.5 text-right text-sm italic">
          {dayjs(price.createdAt).format('M/D/YY')}
        </Text>
      </View>
    </View>
  );
}

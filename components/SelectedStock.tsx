import dayjs from 'dayjs';
import { View, Text, Image } from 'react-native';

import StockFull from './StockFull';

import { Stock } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';

export type SelectedStockProps = {
  stock: Stock;
};

export default function SelectedStock({ stock }: SelectedStockProps) {
  if (!stock.store || !stock.branch) throw new Error('stock has no store or branch objects');

  return (
    <View className="flex flex-col gap-2">
      <StockFull stock={stock} />

      {stock.updatedBy && (
        <View className="mt-4 flex flex-row items-center gap-2">
          <Image
            source={
              stock.updatedBy.avatar
                ? {
                    uri: createCloudinaryUrl(stock.updatedBy.avatar, 100, 100),
                  }
                : require('@/assets/images/no_avatar.jpg')
            }
            className="size-[25px] rounded-full"
          />
          <View>
            <Text className="text-xs font-bold">{stock.updatedBy.name}</Text>
            <Text className="mt-0.5 text-xs italic">
              {dayjs(stock.latestPrice?.createdAt ?? stock.updatedAt).fromNow()}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

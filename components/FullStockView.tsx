import { useLazyQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';

import SelectedStock from './SelectedStock';

import {
  OrderByType,
  PriceChangeHistoryDocument,
  PriceHistoryFilter,
  Stock,
} from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';

export type FullStockViewProps = {
  stock: Stock;
};

export default function FullStockView({ stock }: FullStockViewProps) {
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<PriceHistoryFilter | undefined>({
    orderBy: OrderByType.Desc,
  });
  const [getPriceHistory, { data: priceHistoryData }] = useLazyQuery(PriceChangeHistoryDocument, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    getPriceHistory({
      variables: {
        productId: stock.productId,
        stockId: stock.id,
        paginator: {
          limit,
          page,
        },
        filters,
      },
    });
  }, [limit, page, filters]);

  return (
    <View>
      <View className="rounded-xl bg-gray-50 p-5">
        <SelectedStock stock={stock} />
      </View>

      <View className="mb-5 mt-10 border-b-[1px] border-gray-100" />

      <Text className="text-xl font-black">Price change history</Text>

      <View className="mt-7">
        {priceHistoryData &&
          priceHistoryData.priceChangeHistory.prices.length > 0 &&
          priceHistoryData.priceChangeHistory.prices.map((p, i) => (
            <View
              className="mb-7 flex flex-row items-center justify-between gap-3"
              key={`price-${i}`}>
              <View className="flex flex-col gap-1">
                <Text className="text-lg font-black">${p.amount}</Text>
                <View className="flex flex-row items-center gap-1">
                  <Image
                    source={
                      p.createdBy?.avatar
                        ? {
                            uri: createCloudinaryUrl(p.createdBy.avatar, 100, 100),
                          }
                        : require('@/assets/images/no_avatar.jpg')
                    }
                    className="size-[17px] rounded-full"
                  />
                  <View>
                    <Text className="text-xs">{p.createdBy?.name}</Text>
                  </View>
                </View>
              </View>

              <View>
                <Text className="mt-0.5 text-sm italic">{dayjs(p.createdAt).fromNow()}</Text>
              </View>
            </View>
          ))}
      </View>

      <View className="h-[200px]" />
    </View>
  );
}

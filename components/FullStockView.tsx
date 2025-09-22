import { useLazyQuery } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import HistoricPriceItem from './HistoricPriceItem';
import SelectedStock from './SelectedStock';
import PaginationSimple from './ui/PaginationSimple';

import Btn from '@/components/ui/Btn';
import {
  OrderByType,
  Price,
  PriceChangeHistoryDocument,
  PriceHistoryFilter,
  Stock,
} from '@/graphql/types/graphql';

export type FullStockViewProps = {
  stock: Stock;
  closeModal: () => void;
};

export default function FullStockView({ stock, closeModal }: FullStockViewProps) {
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
          limit: 10,
          page,
        },
        filters,
      },
    });
  }, [page, filters]);

  return (
    <View>
      <View className="rounded-xl bg-gray-50 p-5">
        <SelectedStock stock={stock} />
      </View>

      <View className="mt-5 flex flex-row justify-between gap-3">
        <Btn
          text="Visit Store Page"
          onPress={() => {
            router.push(`/(tabs)/(stores)/${stock.storeId}/branch/${stock.branchId}`, {
              relativeToDirectory: false,
            });
            closeModal();
          }}
          bgColor="bg-gray-800"
          size="sm"
        />
        <Btn
          text="View Stock"
          onPress={() => {
            router.push(`/(tabs)/(products)/${stock.productId}?stockId=${stock.id}`, {
              relativeToDirectory: false,
            });
            closeModal();
          }}
          iconRight
          icon={<AntDesign name="arrowright" size={20} color="white" />}
          size="sm"
        />
      </View>

      <View className="mb-5 mt-10 border-b-[1px] border-gray-100" />

      <Text className="text-xl font-black">Price change history</Text>

      <View className="mt-7">
        {priceHistoryData &&
          priceHistoryData.priceChangeHistory.prices.length > 0 &&
          priceHistoryData.priceChangeHistory.prices.map((p, i) => (
            <HistoricPriceItem stock={stock} price={p as Price} key={`price-${i}`} />
          ))}

        {priceHistoryData?.priceChangeHistory?.paginator && (
          <View className="mt-5">
            <PaginationSimple
              paginator={priceHistoryData.priceChangeHistory.paginator}
              onPageChange={setPage}
            />
          </View>
        )}
      </View>

      <View className="h-[200px]" />
    </View>
  );
}

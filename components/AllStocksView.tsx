import { useQuery } from '@apollo/client';
import { router } from 'expo-router';
import { GetProductStocksDocument, Product, Stock } from 'graphql-utils';
import { useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, ActivityIndicator } from 'react-native';

import ProductItem from './ProductItem';
import StockItemMini from './StockItemMini';
import { SmartPagination } from './ui/SmartPagination';

import { useCurrentLocation } from '@/context/LocationContext';

export type AllStocksViewProps = {
  product: Product;
  closeModal: () => void;
};

export default function AllStocksView({ product, closeModal }: AllStocksViewProps) {
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(1);
  const { currentLocation } = useCurrentLocation();
  const { data: stocksData, loading } = useQuery(GetProductStocksDocument, {
    variables: {
      paginator: {
        page,
        limit: 30,
      },
      productId: product.id,
      location: currentLocation.locationInput,
    },
    fetchPolicy: 'no-cache',
  });

  return (
    <View>
      <View className="rounded-xl bg-gray-50 p-5">
        <ProductItem product={product} />
      </View>

      <View className="mb-5 mt-10 border-b-[1px] border-gray-100" />

      <Text className="text-xl font-black">Available stocks</Text>

      <View className="mt-7">
        {loading && (
          <View className="my-5 flex flex-row items-center justify-center">
            <ActivityIndicator />
          </View>
        )}

        {stocksData && (
          <View className="flex flex-row flex-wrap justify-between gap-x-5 gap-y-8">
            {stocksData.getProductStocks.stocks.length > 0 &&
              stocksData.getProductStocks.stocks.map((s, i) => (
                <TouchableOpacity
                  onPress={() => {
                    router.push(`/(tabs)/(products)/${product.id}?stockId=${s.id}`);
                    closeModal();
                  }}
                  key={`stock-${s.id}-${i}`}
                  style={{
                    width: width / 2.5,
                  }}>
                  <StockItemMini product={product} stock={s as Stock} />
                </TouchableOpacity>
              ))}
          </View>
        )}

        {stocksData?.getProductStocks?.paginator &&
          stocksData.getProductStocks.paginator.numPages > 1 && (
            <View className="mt-10">
              <SmartPagination
                paginator={stocksData.getProductStocks.paginator}
                onPageChange={setPage}
              />
            </View>
          )}
      </View>

      <View className="h-[200px]" />
    </View>
  );
}

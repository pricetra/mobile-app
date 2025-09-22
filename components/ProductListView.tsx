import { useLazyQuery } from '@apollo/client';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import ProductItem from '@/components/ProductItem';
import { GetAllProductListsByListIdDocument, Product, Stock } from '@/graphql/types/graphql';

export type ProductListViewProps = {
  listId: string;
};

export default function ProductListView({ listId }: ProductListViewProps) {
  const [getProducts, { data, loading, error }] = useLazyQuery(GetAllProductListsByListIdDocument, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    getProducts({
      variables: { listId: +listId },
    });
  }, [listId]);

  return (
    <ScrollView className="p-5">
      {loading && (
        <View className="flex h-[100px] items-center justify-center">
          <ActivityIndicator color="black" />
        </View>
      )}
      {error && <Text>{error.message}</Text>}
      {data?.getAllProductListsByListId.map((pList) => {
        if (!pList.product) return <></>;

        const product = { ...(pList.product as Product) };
        if (pList.stockId !== null && pList.stock) {
          product.stock = { ...(pList.stock as Stock) };
        }
        return (
          <TouchableOpacity
            key={pList.id}
            className="mb-10"
            onPress={() => {
              const params = new URLSearchParams();
              if (pList.stockId) params.append('stockId', pList.stockId.toString());
              router.push(`/(tabs)/(products)/${product.id}?${params.toString()}`);
            }}>
            <ProductItem product={product} />
          </TouchableOpacity>
        );
      })}

      <View className="h-[200px]" />
    </ScrollView>
  );
}

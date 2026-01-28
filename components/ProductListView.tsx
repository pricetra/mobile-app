import { useLazyQuery } from '@apollo/client';
import { router } from 'expo-router';
import { GetAllProductListsByListIdDocument, Product, Stock } from 'graphql-utils';
import { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import ProductItem, { ProductItemLoading } from '@/components/ProductItem';

export type ProductListViewProps = {
  listId: string;
};

export default function ProductListView({ listId }: ProductListViewProps) {
  const [getProducts, { data, loading, error }] = useLazyQuery(GetAllProductListsByListIdDocument, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    getProducts({
      variables: { listId: +listId },
    });
  }, [listId]);

  return (
    <ScrollView className="p-5 pt-10">
      {loading && (
        <>
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <View className="mb-10" key={`product-loading-${i}`}>
                <ProductItemLoading />
              </View>
            ))}
        </>
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

import { useLazyQuery } from '@apollo/client';
import { router } from 'expo-router';
import { MyProductViewHistoryDocument, Product } from 'graphql-utils';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { SmartPagination } from './ui/SmartPagination';

import ProductItem, { ProductItemLoading } from '@/components/ProductItem';

export default function ProductHistoryView() {
  const [page, setPage] = useState(1);
  const [getProducts, { data, loading, error }] = useLazyQuery(MyProductViewHistoryDocument, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    getProducts({
      variables: {
        paginator: {
          limit: 30,
          page,
        },
      },
    });
  }, [page]);

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
      {data?.myProductViewHistory && (
        <>
          {data.myProductViewHistory.products.map((product, i) => {
            return (
              <TouchableOpacity
                key={`product-${product.id}-${i}`}
                className="mb-10"
                onPress={() => {
                  const params = new URLSearchParams();
                  if (product.stock) params.append('stockId', product.stock.id.toString());
                  router.push(`/(tabs)/(products)/${product.id}?${params.toString()}`);
                }}>
                <ProductItem product={product as Product} />
              </TouchableOpacity>
            );
          })}

          {data.myProductViewHistory.paginator.numPages > 1 && (
            <View className="mt-5">
              <SmartPagination
                paginator={data.myProductViewHistory.paginator}
                onPageChange={(p) => setPage(p)}
              />
            </View>
          )}
        </>
      )}

      <View className="h-[200px]" />
    </ScrollView>
  );
}

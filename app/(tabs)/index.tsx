import { useLazyQuery } from '@apollo/client';
import { AlertTriangle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View, RefreshControl, FlatList, SafeAreaView } from 'react-native';

import ProductItem, { ProductLoadingItem } from '@/components/ProductItem';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { AllProductsDocument } from '@/graphql/types/graphql';

export default function HomeScreen() {
  const [getAllProducts, { data: productsData, loading: productsLoading, error: productsError }] =
    useLazyQuery(AllProductsDocument);
  const [refreshing, setRefreshing] = useState(false);

  function fetchAllProducts(refresh?: boolean) {
    return getAllProducts({
      fetchPolicy: refresh ? 'network-only' : undefined,
    });
  }

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <SafeAreaView>
      {productsError && (
        <View className="p-5">
          <Alert icon={AlertTriangle} variant="destructive" className="mb-10 max-w-xl">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{productsError.message}</AlertDescription>
          </Alert>
        </View>
      )}
      {(productsLoading || refreshing) && (
        <View className="p-5">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <View className="mb-10" key={i}>
                <ProductLoadingItem />
              </View>
            ))}
        </View>
      )}

      <FlatList
        data={productsData?.allProducts ?? []}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <View className="mb-10">
            <ProductItem product={item} />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => {
                fetchAllProducts(true).finally(() => setRefreshing(false));
              }, 2000);
            }}
            colors={['grey']}
            progressBackgroundColor="black"
          />
        }
        className="p-5"
      />
    </SafeAreaView>
  );
}

import { useLazyQuery } from '@apollo/client';
import { AlertTriangle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  View,
  RefreshControl,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Text,
} from 'react-native';

import ProductForm from '@/components/ProductForm';
import ProductItem, { ProductLoadingItem } from '@/components/ProductItem';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { AllProductsDocument, Product } from '@/graphql/types/graphql';

export default function HomeScreen() {
  const [getAllProducts, { data: productsData, loading: productsLoading, error: productsError }] =
    useLazyQuery(AllProductsDocument);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [page, setPage] = useState(1);

  function fetchAllProducts(refresh?: boolean) {
    return getAllProducts({
      variables: {
        paginator: {
          limit: 10,
          page,
        },
      },
      fetchPolicy: refresh ? 'network-only' : undefined,
    });
  }

  useEffect(() => {
    fetchAllProducts();
  }, [page]);

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

      <ModalFormMini
        title={selectedProduct ? 'Edit Product' : 'Add Product'}
        visible={selectedProduct !== undefined}
        onRequestClose={() => setSelectedProduct(undefined)}>
        <ProductForm
          product={selectedProduct}
          onCancel={() => setSelectedProduct(undefined)}
          onSuccess={() => setSelectedProduct(undefined)}
          onError={(e) => alert(e.message)}
        />
      </ModalFormMini>

      <FlatList
        data={productsData?.allProducts?.products ?? []}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <View className="mb-10">
            <TouchableOpacity onPress={() => setSelectedProduct(item)}>
              <ProductItem product={item} />
            </TouchableOpacity>
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
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 30 : undefined }}
      />
    </SafeAreaView>
  );
}

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
} from 'react-native';

import ProductForm from '@/components/ProductForm';
import ProductItem, { RenderProductLoadingItems } from '@/components/ProductItem';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { AllProductsDocument, Paginator, Product } from '@/graphql/types/graphql';

export default function HomeScreen() {
  const [initLoading, setInitLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [getAllProducts, { data: productsData, error: productsError }] =
    useLazyQuery(AllProductsDocument);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [products, setProducts] = useState<Product[]>([]);
  const [paginator, setPaginator] = useState<Paginator>();
  const [page, setPage] = useState(1);

  function fetchProducts(force?: boolean) {
    getAllProducts({
      variables: {
        paginator: {
          limit: 30,
          page,
        },
      },
      fetchPolicy: force ? 'network-only' : undefined,
    }).finally(() => {
      setRefreshing(false);
      setInitLoading(false);
    });
  }

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    if (!productsData) return;
    setPaginator(productsData.allProducts.paginator);
  }, [productsData?.allProducts?.paginator]);

  useEffect(() => {
    if (!productsData) return;
    setProducts([...products, ...productsData.allProducts.products]);
  }, [productsData?.allProducts?.products]);

  return (
    <SafeAreaView>
      {productsError && (
        <View className="p-5">
          <Alert icon={AlertTriangle} variant="destructive" className="max-w-xl">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{productsError.message}</AlertDescription>
          </Alert>
        </View>
      )}

      {initLoading && <RenderProductLoadingItems count={10} />}

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
        data={products}
        keyExtractor={({ id }, i) => `${id}-${i}`}
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
                fetchProducts(true);
              }, 2000);
            }}
            colors={['grey']}
            progressBackgroundColor="black"
          />
        }
        onEndReached={() => {
          if (!paginator || !paginator.next) return;
          setPage(paginator.next);
        }}
        onEndReachedThreshold={5}
        className="p-5"
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 30 : undefined }}
        ListFooterComponent={() => {
          if (products.length === 0 || !paginator?.next) return <></>;
          return <RenderProductLoadingItems count={5} />;
        }}
      />
    </SafeAreaView>
  );
}

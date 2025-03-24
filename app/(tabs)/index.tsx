import { useLazyQuery } from '@apollo/client';
import { AlertTriangle } from 'lucide-react-native';
import { useContext, useEffect, useState } from 'react';
import {
  View,
  RefreshControl,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';

import ProductItem, { RenderProductLoadingItems } from '@/components/ProductItem';
import ProductForm from '@/components/product-form/ProductForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { SearchContext } from '@/context/SearchContext';
import { AllProductsDocument, Product } from '@/graphql/types/graphql';

const limit = 30;

export default function HomeScreen() {
  const [initLoading, setInitLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [getAllProducts, { data: productsData, error: productsError }] =
    useLazyQuery(AllProductsDocument);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const { search } = useContext(SearchContext);

  function fetchProducts(page: number, force = false) {
    getAllProducts({
      variables: {
        paginator: {
          limit,
          page,
        },
        search: {
          query: search,
        },
      },
      fetchPolicy: force ? 'no-cache' : undefined,
    }).finally(() => {
      setRefreshing(false);
      setInitLoading(false);
    });
  }

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  useEffect(() => {
    if (!search || search?.length < 2) return;
    setPage(1);
    setInitLoading(true);
    fetchProducts(1, true);
  }, [search]);

  useEffect(() => {
    if (!productsData) return;

    if (page === 1) {
      setProducts([...productsData.allProducts.products]);
      return;
    }
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
          onSuccess={(product) => {
            const idx = products.findIndex(({ id }) => id === product.id);
            const updatedProducts = [...products];
            updatedProducts[idx] = product;
            setProducts(updatedProducts);
            setSelectedProduct(undefined);
          }}
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
                fetchProducts(1, true);
              }, 2000);
            }}
            colors={Platform.OS === 'ios' ? ['black'] : ['white']}
            progressBackgroundColor="#111827"
          />
        }
        onEndReached={() => {
          if (!productsData?.allProducts?.paginator || !productsData?.allProducts?.paginator.next)
            return;
          setPage(productsData.allProducts.paginator.next);
        }}
        onEndReachedThreshold={5}
        className="p-5"
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 30 : undefined }}
        ListFooterComponent={() => {
          if (products.length === 0 || !productsData?.allProducts?.paginator?.next) return <></>;
          return <RenderProductLoadingItems count={5} noPadding />;
        }}
      />
    </SafeAreaView>
  );
}

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
  Text,
} from 'react-native';

import ProductItem, { RenderProductLoadingItems } from '@/components/ProductItem';
import ProductForm from '@/components/product-form/ProductForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { SearchContext } from '@/context/SearchContext';
import { AllProductsDocument, Product } from '@/graphql/types/graphql';

const limit = 30;

export default function HomeScreen() {
  const bottomTabBarHeight = 45;
  const [initLoading, setInitLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [getAllProducts, { data: productsData, error: productsError }] =
    useLazyQuery(AllProductsDocument);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const { search, searching, setSearching } = useContext(SearchContext);

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
    })
      .then(({ data }) => {
        if (!data) return;

        if (page === 1) {
          setProducts([...data.allProducts.products]);
        } else {
          setProducts([...products, ...data.allProducts.products]);
        }
      })
      .finally(() => {
        setRefreshing(false);
        setInitLoading(false);
        if (searching) {
          setSearching(false);
        }
      });
  }

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    setInitLoading(true);
    fetchProducts(1, true);
  }, [search]);

  if (productsError) {
    return (
      <SafeAreaView>
        <View className="p-5">
          <Alert icon={AlertTriangle} variant="destructive" className="max-w-xl">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{productsError.message}</AlertDescription>
          </Alert>
        </View>
      </SafeAreaView>
    );
  }

  if (initLoading || searching) {
    return <RenderProductLoadingItems count={10} />;
  }

  if (!products) return;

  if (products.length === 0) {
    return (
      <View className="flex items-center justify-center px-5 py-36">
        <Text className="text-center">No products found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
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
        indicatorStyle="black"
        renderItem={({ item }) => (
          <View className="mb-10">
            <TouchableOpacity onPress={() => {}} onLongPress={() => setSelectedProduct(item)}>
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
        ListFooterComponent={() => (
          <>
            {products.length > 0 && productsData?.allProducts?.paginator?.next && (
              <RenderProductLoadingItems count={5} noPadding />
            )}
          </>
        )}
        style={{ marginBottom: Platform.OS === 'ios' ? bottomTabBarHeight : 0 }}
      />
    </SafeAreaView>
  );
}

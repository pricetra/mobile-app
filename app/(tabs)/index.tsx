import { useLazyQuery } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { AlertTriangle } from 'lucide-react-native';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  RefreshControl,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Text,
  ScrollView,
} from 'react-native';

import { LocationInput } from '../../graphql/types/graphql';

import ProductItem, { RenderProductLoadingItems } from '@/components/ProductItem';
import ProductForm from '@/components/product-form/ProductForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { useHeader } from '@/context/HeaderContext';
import { SearchContext } from '@/context/SearchContext';
import { AllProductsDocument, Product } from '@/graphql/types/graphql';
import useCurrentLocation from '@/hooks/useCurrentLocation';
import { cn } from '@/lib/utils';

const limit = 30;

const categories = [
  { name: 'All', value: undefined },
  { name: 'Milk', value: 'Milk' },
  { name: 'Eggs', value: 'Eggs' },
  { name: 'Bread', value: 'Bread' },
  { name: 'Pasta', value: 'Pasta' },
  { name: 'Rice', value: 'Rice' },
  { name: 'Butter', value: 'Butter' },
];

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
  const { location, getCurrentLocation } = useCurrentLocation();
  const [locationInput, setLocationInput] = useState<LocationInput>();
  const { setSubHeader } = useHeader();
  const [category, setCategory] = useState<string>();

  useFocusEffect(
    useCallback(() => {
      setSubHeader(
        <ScrollView horizontal>
          <View className="flex flex-row items-center justify-start gap-2 px-5 py-3">
            <Button className="mr-4 rounded-full px-4" variant="secondary" size="sm">
              <View className="flex flex-row items-center justify-center gap-2">
                <Ionicons name="filter" size={15} color="white" />
                <Text className="text-sm font-bold text-white">Filters</Text>
              </View>
            </Button>

            {categories.map((c, i) => (
              <Button
                className={cn(
                  'rounded-full px-4',
                  c.value === category ? 'border-gray-500 bg-gray-500' : undefined
                )}
                variant="outlineLight"
                size="sm"
                key={i}
                onPress={() => {
                  setCategory(c.value);
                }}>
                <Text className={cn('text-sm', c.value === category ? 'text-white' : undefined)}>
                  {c.name}
                </Text>
              </Button>
            ))}
          </View>
        </ScrollView>
      );
      return () => setSubHeader(undefined);
    }, [category])
  );

  useEffect(() => {
    if (!location) return;
    setLocationInput({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      radiusMeters: 160934, // ~100 miles
    });
  }, [location]);

  function fetchProducts(page: number, force = false) {
    getAllProducts({
      variables: {
        paginator: {
          limit,
          page,
        },
        search: {
          query: search,
          location: locationInput,
          category,
        },
      },
      fetchPolicy: force ? 'no-cache' : undefined,
    })
      .then(({ data }) => {
        if (!data) return;

        if (page === 1) {
          setProducts([...data.allProducts.products] as Product[]);
        } else {
          setProducts([...products, ...data.allProducts.products] as Product[]);
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
    if (!locationInput) return;
    fetchProducts(page);
  }, [page, locationInput]);

  useEffect(() => {
    if (search === undefined) return;
    setPage(1);
    setInitLoading(true);
    fetchProducts(1, true);
  }, [search]);

  useEffect(() => {
    setPage(1);
    setInitLoading(true);
    fetchProducts(1, true);
  }, [category]);

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
          onSuccess={({ id }) => {
            router.push(`/(tabs)/(products)/${id}`);
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
            <TouchableOpacity
              onPress={() => router.push(`/(tabs)/(products)/${item.id}`)}
              onLongPress={() => setSelectedProduct(item)}>
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
                getCurrentLocation({});
                setPage(1);
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

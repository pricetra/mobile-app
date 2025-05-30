import { useLazyQuery } from '@apollo/client';
import { router, useFocusEffect } from 'expo-router';
import { AlertTriangle } from 'lucide-react-native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { View, SafeAreaView, Platform, Text } from 'react-native';

import { LocationInput } from '../../graphql/types/graphql';

import ProductFlatlist from '@/components/ProductFlatlist';
import { RenderProductLoadingItems } from '@/components/ProductItem';
import ProductForm from '@/components/product-form/ProductForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import ModalFormFull from '@/components/ui/ModalFormFull';
import TabSubHeaderProductFilter, {
  PartialCategory,
} from '@/components/ui/TabSubHeaderProductFilter';
import { LIMIT } from '@/constants/constants';
import { useHeader } from '@/context/HeaderContext';
import { SearchContext } from '@/context/SearchContext';
import { AllProductsDocument, Product } from '@/graphql/types/graphql';
import useCurrentLocation from '@/hooks/useCurrentLocation';

export default function HomeScreen() {
  const bottomTabBarHeight = 45;
  const [getAllProducts, { data, error, loading, fetchMore }] = useLazyQuery(AllProductsDocument);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const { search, searching, setSearching } = useContext(SearchContext);
  const { location, getCurrentLocation } = useCurrentLocation();
  const [locationInput, setLocationInput] = useState<LocationInput>();
  const { setSubHeader } = useHeader();
  const [categoryFilterInput, setCategoryFilterInput] = useState<PartialCategory>();

  const searchVariables = {
    search: {
      query: search,
      location: locationInput,
      category: categoryFilterInput?.category,
      categoryId: categoryFilterInput?.categoryId,
    },
  };

  useFocusEffect(
    useCallback(() => {
      setSubHeader(
        <TabSubHeaderProductFilter
          selectedCategoryId={categoryFilterInput?.id}
          onSelectCategory={(c) => setCategoryFilterInput(c)}
        />
      );
      return () => setSubHeader(undefined);
    }, [categoryFilterInput])
  );

  useEffect(() => {
    if (!location) return;
    setLocationInput({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      radiusMeters: 160934, // ~100 miles
    });
  }, [location]);

  const loadProducts = useCallback(
    async (page = 1, force = false) => {
      if (!locationInput) return Promise.resolve();

      try {
        return await getAllProducts({
          variables: {
            paginator: { limit: LIMIT, page },
            ...searchVariables,
          },
          fetchPolicy: force ? 'no-cache' : undefined,
        });
      } finally {
        if (searching) setSearching(false);
      }
    },
    [locationInput, searchVariables, searching, setSearching, getAllProducts]
  );

  const loadMore = useCallback(() => {
    if (!data?.allProducts.paginator) return;

    const { next } = data.allProducts.paginator;
    if (!next) return;

    return fetchMore({
      variables: {
        paginator: { limit: LIMIT, page: next },
        ...searchVariables,
      },
      updateQuery: (prev, { fetchMoreResult }) => ({
        ...prev,
        allProducts: {
          ...fetchMoreResult.allProducts,
          products: [...prev.allProducts.products, ...fetchMoreResult.allProducts.products],
        },
      }),
    });
  }, [data, fetchMore, searchVariables]);

  // Initial load and dependency changes
  useEffect(() => {
    loadProducts(1);
  }, [locationInput]);
  useEffect(() => {
    loadProducts(1, true);
  }, [search, categoryFilterInput]);

  if (error) {
    return (
      <SafeAreaView>
        <View className="p-5">
          <Alert icon={AlertTriangle} variant="destructive" className="max-w-xl">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        </View>
      </SafeAreaView>
    );
  }

  if (loading || searching) {
    return <RenderProductLoadingItems count={10} />;
  }

  const products = (data?.allProducts.products as Product[]) || [];

  if (products.length === 0) {
    return (
      <View className="flex items-center justify-center px-5 py-36">
        <Text className="text-center">No products found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ModalFormFull
        title="Edit Product"
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
      </ModalFormFull>

      <ProductFlatlist
        products={products}
        paginator={data?.allProducts.paginator}
        handleRefresh={async () => {
          await getCurrentLocation({});
          return loadProducts(1, true);
        }}
        setPage={loadMore}
        onItemLongPress={(p) => setSelectedProduct(p)}
        style={{ marginBottom: Platform.OS === 'ios' ? bottomTabBarHeight : 0 }}
      />
    </SafeAreaView>
  );
}

import { useLazyQuery } from '@apollo/client';
import convert from 'convert-units';
import { useFocusEffect } from 'expo-router';
import { AlertTriangle } from 'lucide-react-native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { View, SafeAreaView, Platform, Text } from 'react-native';

import ProductFlatlist from '@/components/ProductFlatlist';
import { RenderProductLoadingItems } from '@/components/ProductItem';
import ProductSearchFilterModal from '@/components/ProductSearchFilterModal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import ModalFormMini from '@/components/ui/ModalFormMini';
import TabSubHeaderProductFilter, {
  PartialCategory,
} from '@/components/ui/TabSubHeaderProductFilter';
import { LIMIT } from '@/constants/constants';
import { useHeader } from '@/context/HeaderContext';
import { SearchContext } from '@/context/SearchContext';
import { useAuth } from '@/context/UserContext';
import {
  AllProductsDocument,
  LocationInput,
  Product,
  ProductSearch,
} from '@/graphql/types/graphql';
import useCurrentLocation from '@/hooks/useCurrentLocation';

const DEFAULT_SEARCH_RADIUS = 160_934; // ~100 miles

export default function HomeScreen() {
  const { user } = useAuth();
  const bottomTabBarHeight = 45;
  const [getAllProducts, { data, error, loading, fetchMore }] = useLazyQuery(AllProductsDocument);
  const { search, searching, setSearching } = useContext(SearchContext);
  const { location, getCurrentLocation } = useCurrentLocation();
  const { setSubHeader } = useHeader();
  const [categoryFilterInput, setCategoryFilterInput] = useState<PartialCategory>();
  const [searchRadius, setSearchRadius] = useState(DEFAULT_SEARCH_RADIUS);
  const [locationInput, setLocationInput] = useState<LocationInput>({
    latitude: user.address!.latitude,
    longitude: user.address!.longitude,
    radiusMeters: searchRadius,
  });
  const [address, setAddress] = useState(user.address?.fullAddress);
  const [openFiltersModal, setOpenFiltersModal] = useState(false);

  const searchVariables = {
    query: search,
    location: locationInput,
    category: categoryFilterInput?.category,
    categoryId: categoryFilterInput?.categoryId,
  } as ProductSearch;

  useFocusEffect(
    useCallback(() => {
      setSubHeader(
        <TabSubHeaderProductFilter
          selectedCategoryId={categoryFilterInput?.id}
          onSelectCategory={(c) => setCategoryFilterInput(c)}
          onFiltersButtonPressed={() => setOpenFiltersModal(true)}
        />
      );
      return () => setSubHeader(undefined);
    }, [categoryFilterInput])
  );

  const loadProducts = useCallback(
    async (page = 1, force = false) => {
      if (!locationInput) return Promise.resolve();

      try {
        return await getAllProducts({
          variables: {
            paginator: { limit: LIMIT, page },
            search: { ...searchVariables },
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

  useEffect(() => {
    if (!location) return;
    setLocationInput({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      radiusMeters: searchRadius,
    });
  }, [location, searchRadius]);

  return (
    <SafeAreaView>
      <ModalFormMini
        title="Search Filters"
        visible={openFiltersModal}
        onRequestClose={() => setOpenFiltersModal(false)}>
        <ProductSearchFilterModal
          addressInit={address}
          radiusInit={Math.round(convert(searchRadius).from('m').to('mi')).toString()}
          onSubmit={({ address, location, radius }) => {
            if (radius) setSearchRadius(Math.round(convert(radius).from('mi').to('m')));
            if (location && address) {
              setAddress(address);
              setLocationInput({
                latitude: location.latitude,
                longitude: location.longitude,
                radiusMeters: radius
                  ? Math.round(convert(radius).from('mi').to('m'))
                  : searchRadius,
              });
            }
            setOpenFiltersModal(false);
          }}
        />
      </ModalFormMini>

      {(loading || searching) && <RenderProductLoadingItems count={10} />}

      {error && (
        <SafeAreaView>
          <View className="p-5">
            <Alert icon={AlertTriangle} variant="destructive" className="max-w-xl">
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          </View>
        </SafeAreaView>
      )}

      {data?.allProducts?.products?.length === 0 && (
        <View className="flex items-center justify-center px-5 py-36">
          <Text className="text-center">No products found</Text>
        </View>
      )}

      {data?.allProducts?.products && (
        <ProductFlatlist
          products={data.allProducts.products as Product[]}
          paginator={data?.allProducts.paginator}
          handleRefresh={async () => {
            await getCurrentLocation({});
            return loadProducts(1, true);
          }}
          setPage={loadMore}
          style={{ marginBottom: Platform.OS === 'ios' ? bottomTabBarHeight : 0 }}
        />
      )}
    </SafeAreaView>
  );
}

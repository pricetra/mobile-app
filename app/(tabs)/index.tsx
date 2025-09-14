import { useLazyQuery } from '@apollo/client';
import convert from 'convert-units';
import { useFocusEffect } from 'expo-router';
import { AlertTriangle } from 'lucide-react-native';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { View, SafeAreaView, Platform, Text } from 'react-native';

import BranchesWithProductsFlatlist, {
  BranchesWithProductsFlatlistLoading,
} from '@/components/BranchesWithProductsFlatlist';
import ProductSearchFilterModal from '@/components/ProductSearchFilterModal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import ModalFormMini from '@/components/ui/ModalFormMini';
import TabSubHeaderProductFilter, {
  PartialCategory,
} from '@/components/ui/TabSubHeaderProductFilter';
import { LIMIT } from '@/constants/constants';
import { useHeader } from '@/context/HeaderContext';
import { DEFAULT_SEARCH_RADIUS, useCurrentLocation } from '@/context/LocationContext';
import { SearchContext } from '@/context/SearchContext';
import { useAuth } from '@/context/UserContext';
import { Branch, BranchesWithProductsDocument, ProductSearch } from '@/graphql/types/graphql';
import useLocationService from '@/hooks/useLocationService';

const PRODUCT_LIMIT = 10;

export default function HomeScreen() {
  const { user } = useAuth();
  const { currentLocation, setCurrentLocation } = useCurrentLocation();
  const bottomTabBarHeight = 45;
  const [getAllProducts, { data, error, loading, fetchMore }] = useLazyQuery(
    BranchesWithProductsDocument,
    {
      fetchPolicy: 'network-only',
    }
  );
  const { search, searching, setSearching } = useContext(SearchContext);
  const { location, getCurrentLocation } = useLocationService();
  const { setSubHeader } = useHeader();
  const [categoryFilterInput, setCategoryFilterInput] = useState<PartialCategory>();
  const [address, setAddress] = useState(user.address?.fullAddress);
  const [openFiltersModal, setOpenFiltersModal] = useState(false);

  const searchVariables = useMemo(
    () =>
      ({
        query: search,
        location: currentLocation.locationInput,
        category: categoryFilterInput?.category,
        categoryId: categoryFilterInput?.categoryId,
      }) as ProductSearch,
    [search, currentLocation, categoryFilterInput]
  );

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

  async function loadProducts(page = 1) {
    if (!currentLocation) return Promise.resolve();

    try {
      return await getAllProducts({
        variables: {
          paginator: { limit: LIMIT, page },
          productLimit: PRODUCT_LIMIT,
          filters: { ...searchVariables },
        },
      });
    } finally {
      if (searching) setSearching(false);
    }
  }

  const loadMore = useCallback(() => {
    if (!data?.branchesWithProducts.paginator) return;

    const { next } = data.branchesWithProducts.paginator;
    if (!next) return;

    return fetchMore({
      variables: {
        paginator: { limit: LIMIT, page: next },
        productLimit: PRODUCT_LIMIT,
        ...searchVariables,
      },
      // TODO: Fix
      updateQuery: (prev, { fetchMoreResult }) => ({
        ...prev,
        allProducts: {
          ...fetchMoreResult.branchesWithProducts,
          products: [
            ...prev.branchesWithProducts.branches,
            ...fetchMoreResult.branchesWithProducts.branches,
          ],
        },
      }),
    });
  }, [data, searchVariables]);

  // Initial load and dependency changes
  useEffect(() => {
    loadProducts(1);
  }, [search, categoryFilterInput, currentLocation]);

  useEffect(() => {
    if (!location) return;
    setCurrentLocation({
      locationInput: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        radiusMeters: currentLocation.locationInput.radiusMeters,
      },
      fullAddress: address ?? currentLocation.fullAddress,
    });
  }, [location, address]);

  return (
    <SafeAreaView>
      <ModalFormMini
        title="Search Filters"
        visible={openFiltersModal}
        onRequestClose={() => setOpenFiltersModal(false)}>
        <ProductSearchFilterModal
          addressInit={address}
          radiusInit={Math.round(
            convert(currentLocation.locationInput.radiusMeters ?? DEFAULT_SEARCH_RADIUS)
              .from('m')
              .to('mi')
          ).toString()}
          onSubmit={({ address, location, radius }) => {
            if (!currentLocation) return;
            const newLocation = { ...currentLocation };
            if (radius)
              newLocation.locationInput.radiusMeters = Math.round(
                convert(radius).from('mi').to('m')
              );
            if (location && address) {
              setAddress(address);
              setCurrentLocation({
                locationInput: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  radiusMeters: radius
                    ? Math.round(convert(radius).from('mi').to('m'))
                    : DEFAULT_SEARCH_RADIUS,
                },
                fullAddress: address,
              });
            }
            setOpenFiltersModal(false);
          }}
          onCloseModal={() => setOpenFiltersModal(false)}
        />
      </ModalFormMini>

      {loading && <BranchesWithProductsFlatlistLoading />}

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

      {data?.branchesWithProducts?.branches.length === 0 && (
        <View className="flex items-center justify-center px-5 py-36">
          <Text className="text-center">No products found</Text>
        </View>
      )}

      {data?.branchesWithProducts?.branches && (
        <BranchesWithProductsFlatlist
          branches={data.branchesWithProducts.branches as Branch[]}
          paginator={data?.branchesWithProducts.paginator}
          handleRefresh={async () => {
            await getCurrentLocation({});
            return loadProducts(1);
          }}
          setPage={loadMore}
          style={{ marginBottom: Platform.OS === 'ios' ? bottomTabBarHeight : 0, paddingTop: 10 }}
          categoryFilterInput={categoryFilterInput}
        />
      )}
    </SafeAreaView>
  );
}

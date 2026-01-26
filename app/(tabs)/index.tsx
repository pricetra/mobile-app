import { useLazyQuery, useQuery } from '@apollo/client';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import convert from 'convert-units';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import {
  AllStoresDocument,
  Branch,
  BranchesWithProductsDocument,
  Paginator,
  ProductSearch,
  Store,
} from 'graphql-utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Platform, Text, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';

import { SearchRouteParams } from './search';

import BranchesWithProductsFlatlist from '@/components/BranchesWithProductsFlatlist';
import LocationChangeForm from '@/components/LocationChangeForm';
import ModalFormMini from '@/components/ui/ModalFormMini';
import TabSubHeaderProductFilter from '@/components/ui/TabSubHeaderProductFilter';
import { useHeader } from '@/context/HeaderContext';
import { DEFAULT_SEARCH_RADIUS, useCurrentLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/UserContext';
import useLocationService from '@/hooks/useLocationService';
import useStoreUserBranches from '@/hooks/useStoreUser';
import { getRandomElement } from '@/lib/utils';

const BRANCH_LIMIT = 15;
const PRODUCT_LIMIT = 10;

const searchTaglines = [
  'Search for milk, eggs, cereal...',
  'Find prices for groceries near you',
  'What are you shopping for today?',
  'Search products, brands, or categories',
  'Start with milk, bread, or coffee...',
];

export default function HomeScreen() {
  const { user } = useAuth();
  const myStoreUserBranches = useStoreUserBranches();
  const { currentLocation, setCurrentLocation } = useCurrentLocation();
  const bottomTabBarHeight = 45;

  const params = useLocalSearchParams<SearchRouteParams>();

  // keep accumulated results in state
  const [branches, setBranches] = useState<Branch[]>();
  const [paginator, setPaginator] = useState<Paginator>();

  const [getAllProducts, { loading }] = useLazyQuery(BranchesWithProductsDocument, {
    fetchPolicy: 'no-cache',
  });

  const { data: allStoresData } = useQuery(AllStoresDocument, {
    fetchPolicy: 'cache-first',
    variables: {
      paginator: { page: 1, limit: 9 },
    },
  });

  const [page, setPage] = useState(1);
  const { location } = useLocationService();
  const { setSubHeader } = useHeader();
  const [address, setAddress] = useState(user.address?.fullAddress);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  const style: StyleProp<ViewStyle> = {
    paddingBottom: Platform.OS === 'ios' ? bottomTabBarHeight : 0,
    paddingTop: 20,
  };

  const searchVariables = useMemo(
    () =>
      ({
        query: params.query,
        location: {
          latitude: currentLocation.locationInput.latitude,
          longitude: currentLocation.locationInput.longitude,
        },
        categoryId: params?.categoryId ? +params.categoryId : undefined,
        brand: params.brand,
        sortByPrice: params.sortByPrice,
        sale: params.sale === 'true' ? true : undefined,
      }) as ProductSearch,
    [
      params.query,
      params.categoryId,
      params.brand,
      params.sortByPrice,
      params.sale,
      currentLocation.locationInput.latitude,
      currentLocation.locationInput.longitude,
    ]
  );

  function clearSearch() {
    router.setParams({ ...params, query: '' });
  }

  function toSearchPageWithParams() {
    const paramsBuilder = new URLSearchParams(params);
    router.push(`/(tabs)/search?${paramsBuilder.toString()}`);
  }

  useFocusEffect(
    useCallback(() => {
      setSubHeader(
        <>
          <View className="flex flex-row items-center gap-3 px-5 pb-0.5 pt-1">
            <TouchableOpacity
              className="relative flex flex-1 flex-row items-center gap-3 overflow-hidden rounded-full border-[1px] border-gray-100 bg-gray-50 px-5 py-3"
              onPress={toSearchPageWithParams}>
              <Ionicons name="search" color="#6b7280" size={18} />

              {params.query && params.query.length > 0 ? (
                <Text className="flex-1 color-black" numberOfLines={1}>
                  {params.query}
                </Text>
              ) : (
                <Text className="flex-1 color-[#6b7280]" numberOfLines={1}>
                  {getRandomElement(searchTaglines)}
                </Text>
              )}

              {params.query && params.query.length > 0 && (
                <TouchableOpacity onPress={clearSearch}>
                  <Feather name="x-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/(scan)', { relativeToDirectory: false })}
              className="p-2.5">
              <MaterialCommunityIcons name="barcode-scan" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <TabSubHeaderProductFilter
            onLocationButtonPress={() => setOpenLocationModal(true)}
            onUpdateParams={(p) =>
              router.replace(`/?${p.toString()}`, { relativeToDirectory: true })
            }
          />
        </>
      );
      return () => setSubHeader(undefined);
    }, [
      params.query,
      params.brand,
      params.category,
      params.categoryId,
      params.sale,
      params.sortByPrice,
    ])
  );

  async function loadProducts(page = 1) {
    if (!currentLocation) return Promise.resolve();
    if (page === 1) setResetting(true);

    try {
      const { data } = await getAllProducts({
        variables: {
          paginator: { limit: BRANCH_LIMIT, page },
          productLimit: PRODUCT_LIMIT,
          filters: { ...searchVariables },
        },
      });

      if (data?.branchesWithProducts) {
        setPaginator(data.branchesWithProducts.paginator);
        const filteredBranches = data.branchesWithProducts.branches.filter(
          ({ products }) => products && products.length > 0
        ) as Branch[];
        // append if not first page, else reset
        if (page === 1) {
          setBranches(filteredBranches);
        } else {
          setBranches((prev) => [...(prev ?? []), ...filteredBranches]);
        }
      }
    } finally {
      setResetting(false);
    }
  }

  useEffect(() => {
    setPage(1);
    loadProducts(1);
  }, [searchVariables, currentLocation]);

  // Load when page changes
  useEffect(() => {
    if (page === 1) return;
    loadProducts(page);
  }, [page]);

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
    <>
      <ModalFormMini
        title="Change Location"
        visible={openLocationModal}
        onRequestClose={() => setOpenLocationModal(false)}>
        <LocationChangeForm
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
            setOpenLocationModal(false);
          }}
          onCloseModal={() => setOpenLocationModal(false)}
        />
      </ModalFormMini>

      <BranchesWithProductsFlatlist
        branches={branches}
        paginator={paginator}
        handleRefresh={() => loadProducts(1)}
        setPage={setPage}
        style={style}
        stores={allStoresData?.allStores?.stores as Store[] | undefined}
        loading={loading}
        resetting={resetting}
      />
    </>
  );
}

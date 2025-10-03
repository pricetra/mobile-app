import { useLazyQuery, useQuery } from '@apollo/client';
import { FontAwesome6, Octicons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import convert from 'convert-units';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  Platform,
  Text,
  StyleProp,
  ViewStyle,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import BranchesWithProductsFlatlist, {
  BranchesWithProductsFlatlistLoading,
} from '@/components/BranchesWithProductsFlatlist';
import ProductSearchFilterModal from '@/components/ProductSearchFilterModal';
import ModalFormMini from '@/components/ui/ModalFormMini';
import TabSubHeaderProductFilter, {
  PartialCategory,
} from '@/components/ui/TabSubHeaderProductFilter';
import { useHeader } from '@/context/HeaderContext';
import { DEFAULT_SEARCH_RADIUS, useCurrentLocation } from '@/context/LocationContext';
import { SearchContext } from '@/context/SearchContext';
import { useAuth } from '@/context/UserContext';
import {
  AllStoresDocument,
  Branch,
  BranchesWithProductsDocument,
  MySearchHistoryDocument,
  Paginator,
  ProductSearch,
} from '@/graphql/types/graphql';
import useLocationService from '@/hooks/useLocationService';
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
  const { currentLocation, setCurrentLocation } = useCurrentLocation();
  const bottomTabBarHeight = 45;

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

  const [getSearchHistory, { data: searchHistoryData }] = useLazyQuery(MySearchHistoryDocument, {
    fetchPolicy: 'network-only',
    variables: { paginator: { page: 1, limit: 10 } },
  });

  const [page, setPage] = useState(1);
  const { search, searching, setSearching, searchOpen, handleSearch, setSearchOpen } =
    useContext(SearchContext);
  const { location } = useLocationService();
  const { setSubHeader } = useHeader();
  const [categoryFilterInput, setCategoryFilterInput] = useState<PartialCategory>();
  const [address, setAddress] = useState(user.address?.fullAddress);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  const style: StyleProp<ViewStyle> = {
    paddingBottom: Platform.OS === 'ios' ? bottomTabBarHeight : 0,
    paddingTop: 10,
  };

  const searchVariables = useMemo(
    () =>
      ({
        query: search,
        location: currentLocation.locationInput,
        categoryId: categoryFilterInput?.id,
      }) as ProductSearch,
    [search, currentLocation, categoryFilterInput]
  );

  useEffect(() => {
    if (!searchOpen) return;
    getSearchHistory();
  }, [searchOpen]);

  useFocusEffect(
    useCallback(() => {
      setSubHeader(
        <>
          <View className="h-[50px]">
            {!searchOpen ? (
              <View className="flex flex-row items-center gap-5 px-5 pb-0.5 pt-1">
                <TouchableOpacity
                  className="relative flex flex-1 flex-row items-center gap-3 overflow-hidden rounded-full border-[1px] border-gray-100 bg-gray-50 px-5 py-3"
                  onPress={() => setSearchOpen(true)}>
                  <Ionicons name="search" color="#6b7280" size={18} />
                  <Text className="flex-1 color-[#6b7280]" numberOfLines={1}>
                    {getRandomElement(searchTaglines)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/(scan)', { relativeToDirectory: false })}>
                  <MaterialCommunityIcons name="barcode-scan" size={20} color="black" />
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex flex-row items-center justify-start gap-2 px-5 py-2">
                  <View className="mr-5 flex flex-row items-center justify-center gap-2 rounded-full bg-white px-2 py-2">
                    <Octicons name="history" size={15} color="black" />
                    <Text className="font-bold">History</Text>
                  </View>

                  {searchHistoryData?.mySearchHistory?.searches?.map(({ id, searchTerm }) => (
                    <TouchableOpacity
                      className="flex flex-row items-center justify-center gap-2 rounded-full bg-gray-100 px-4 py-2"
                      key={`sh-${id}`}
                      onPress={() => handleSearch(searchTerm)}>
                      <Text className="text-sm color-gray-500">{searchTerm}</Text>
                      <FontAwesome6 name="up-right-from-square" size={8} color="#6b7280" />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

          <TabSubHeaderProductFilter
            selectedCategoryId={categoryFilterInput?.id}
            onSelectCategory={(c) => setCategoryFilterInput(c)}
            onFiltersButtonPressed={() => {}}
          />
        </>
      );
      return () => setSubHeader(undefined);
    }, [categoryFilterInput, searchOpen, searchHistoryData])
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
      if (searching) setSearching(false);
    }
  }

  // Reset on filter/search/location changes
  useEffect(() => {
    setPage(1);
    loadProducts(1);
  }, [search, categoryFilterInput, currentLocation]);

  // Load when page changes
  useEffect(() => {
    if (page === 1) return;
    loadProducts(page);
  }, [page]);

  useEffect(() => {
    if (!searchOpen) return;
    getSearchHistory();
  }, [searchOpen]);

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

  if (resetting || !branches) return <BranchesWithProductsFlatlistLoading style={style} />;

  return (
    <>
      <ModalFormMini
        title="Change Location"
        visible={openLocationModal}
        onRequestClose={() => setOpenLocationModal(false)}>
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
        categoryFilterInput={categoryFilterInput}
        stores={allStoresData?.allStores?.stores}
        onLocationButtonPressed={() => setOpenLocationModal(true)}
        loading={loading}
      />
    </>
  );
}

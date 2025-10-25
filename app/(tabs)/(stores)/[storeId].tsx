import { useLazyQuery } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';

import BranchProductItem from '@/components/BranchProductItem';
import BranchesWithProductsFlatlist, {
  BranchesWithProductsFlatlistLoading,
  HORIZONTAL_PRODUCT_WIDTH,
} from '@/components/BranchesWithProductsFlatlist';
import CreateBranchForm from '@/components/CreateBranchForm';
import HorizontalShowMoreButton from '@/components/HorizontalShowMoreButton';
import ProductItemHorizontal from '@/components/ProductItemHorizontal';
import Image from '@/components/ui/Image';
import ModalFormMini from '@/components/ui/ModalFormMini';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { SearchContext } from '@/context/SearchContext';
import { useAuth } from '@/context/UserContext';
import {
  BranchesWithProductsDocument,
  FindStoreDocument,
  LocationInput,
  PaginatorInput,
  Branch,
  Product,
} from '@/graphql/types/graphql';
import useLocationService from '@/hooks/useLocationService';
import { createCloudinaryUrl } from '@/lib/files';

export default function SelectedStoreScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const { search, handleSearch, setSearching } = useContext(SearchContext);
  const [openModal, setOpenModal] = useState(false);
  const [findStore, { data: storeData }] = useLazyQuery(FindStoreDocument);
  const [getBranchesWithProducts, { data: branchesData, loading: branchesLoading }] = useLazyQuery(
    BranchesWithProductsDocument,
    {
      fetchPolicy: 'no-cache',
    }
  );
  const { location, getCurrentLocation } = useLocationService();
  const [locationInput, setLocationInput] = useState<LocationInput>({
    latitude: user.address!.latitude,
    longitude: user.address!.longitude,
  });
  const paginator: PaginatorInput = {
    limit: 100,
    page: 1,
  };

  useEffect(() => {
    if (!location) return;
    setLocationInput({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }, [location]);

  useEffect(() => {
    if (!storeData) return;

    getBranchesWithProducts({
      variables: {
        paginator,
        productLimit: 10,
        filters: {
          storeId: storeData.findStore.id,
          location: locationInput,
          query: search,
        },
      },
    });
  }, [storeData, search, locationInput, storeId]);

  useFocusEffect(
    useCallback(() => {
      if (!storeId) return router.back();
      findStore({
        variables: { storeId: +storeId },
      }).then(({ data }) => {
        if (!data) return;

        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => (
            <TabHeaderItem
              {...props}
              showSearch
              leftNav={
                <View className="flex flex-row items-center gap-2">
                  <Image
                    src={createCloudinaryUrl(data.findStore.logo, 100, 100)}
                    className="size-[30px] rounded-lg"
                  />
                  <Text className="font-bold" numberOfLines={1}>
                    {data.findStore.name}
                  </Text>
                </View>
              }
              rightNav={
                <TouchableOpacity
                  onPress={() => setOpenModal(true)}
                  className="flex flex-row items-center gap-2 rounded-full p-2">
                  <Feather name="plus" size={23} color="#396a12" />
                </TouchableOpacity>
              }
            />
          ),
        });
      });
      return () => {
        handleSearch(null);
        setSearching(false);
        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => <TabHeaderItem {...props} />,
        });
      };
    }, [storeId, locationInput])
  );

  return (
    <>
      {storeData && (
        <ModalFormMini
          visible={openModal}
          onRequestClose={() => setOpenModal(false)}
          title="Add Branch">
          <CreateBranchForm
            store={storeData.findStore}
            onSuccess={(_data) => setOpenModal(false)}
            onError={(e) => alert(e.message)}
            onCloseModal={() => setOpenModal(false)}
          />
        </ModalFormMini>
      )}

      {branchesLoading && (
        <BranchesWithProductsFlatlistLoading showLocationButton={false} style={{ marginTop: 90 }} />
      )}

      {storeData && !branchesLoading && branchesData && (
        <FlatList
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          data={branchesData.branchesWithProducts.branches}
          keyExtractor={({ id }) => `branch-${id}`}
          renderItem={({ item: branch }) => (
            <View className="mb-14">
              <View className="mb-7 px-5">
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/(tabs)/(stores)/${branch.storeId}/branch/${branch.id}`)
                  }>
                  <BranchProductItem branch={branch as Branch} hideStoreLogo displayBranchName />
                </TouchableOpacity>
              </View>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={branch.products}
                keyExtractor={({ id }, i) => `${id}-${i}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      router.push(`/(tabs)/(products)/${item.id}?stockId=${item.stock?.id}`, {
                        relativeToDirectory: false,
                      })
                    }
                    style={{
                      width: HORIZONTAL_PRODUCT_WIDTH,
                      marginRight: 16,
                    }}>
                    <ProductItemHorizontal
                      product={item as Product}
                      imgWidth={HORIZONTAL_PRODUCT_WIDTH}
                    />
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                ListFooterComponent={() =>
                  (branch.products?.length ?? 0) > 0 ? (
                    <HorizontalShowMoreButton
                      onPress={() =>
                        router.push(`/(tabs)/(stores)/${branch.storeId}/branch/${branch.id}`, {
                          relativeToDirectory: false,
                        })
                      }
                      heightDiv={1}
                      width={HORIZONTAL_PRODUCT_WIDTH}
                    />
                  ) : undefined
                }
              />
            </View>
          )}
          ListHeaderComponent={
            <View className="mb-8 px-5 py-3">
              <Text className="text-2xl font-bold">Locations for {storeData.findStore.name}</Text>
            </View>
          }
          style={{ paddingVertical: 15 }}
          ListEmptyComponent={
            <View className="flex items-center justify-center px-5 py-10">
              <Text>No branches found for this store.</Text>
            </View>
          }
        />
      )}
    </>
  );
}

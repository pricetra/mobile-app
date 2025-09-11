import { useLazyQuery } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from 'react-native';

import CreateBranchForm from '@/components/CreateBranchForm';
import Image from '@/components/ui/Image';
import ModalFormMini from '@/components/ui/ModalFormMini';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { SearchContext } from '@/context/SearchContext';
import { useAuth } from '@/context/UserContext';
import { FindStoreDocument, LocationInput, PaginatorInput } from '@/graphql/types/graphql';
import useLocationService from '@/hooks/useLocationService';
import { createCloudinaryUrl } from '@/lib/files';

export default function SelectedStoreScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const { search, handleSearch, setSearching } = useContext(SearchContext);
  const [openModal, setOpenModal] = useState(false);
  const [findStore, { data: storeData, loading: storeLoading }] = useLazyQuery(FindStoreDocument);
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
    findStore({
      variables: {
        storeId: +storeId,
        paginator,
        location: locationInput,
        search,
      },
    });
  }, [search]);

  useFocusEffect(
    useCallback(() => {
      if (!storeId) return router.back();
      findStore({
        variables: {
          storeId: +storeId,
          paginator,
          location: locationInput,
        },
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
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={storeLoading}
          onRefresh={async () => {
            await getCurrentLocation({});
          }}
          colors={Platform.OS === 'ios' ? ['black'] : ['white']}
          progressBackgroundColor="#111827"
        />
      }>
      <SafeAreaView className="h-full">
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

        <View className="p-5">
          {storeLoading && (
            <View className="flex h-40 w-full items-center justify-center px-10">
              <ActivityIndicator color="#555" size="large" />
            </View>
          )}
          <View>
            {storeData &&
              (storeData.allBranches.branches.length > 0 ? (
                storeData.allBranches.branches.map((b) => (
                  <TouchableOpacity
                    onPress={() => router.push(`/(stores)/${b.storeId}/branch/${b.id}`)}
                    key={b.id}
                    className="mb-8 flex flex-row items-center justify-between gap-3">
                    <View className="flex flex-1 flex-col gap-1">
                      <Text className="font-bold">{b.name}</Text>
                      <Text className="text-sm color-gray-700">{b.address?.fullAddress}</Text>
                    </View>

                    <View>
                      <Feather name="chevron-right" size={20} color="black" />
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-center text-gray-600">No branches on this store</Text>
              ))}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

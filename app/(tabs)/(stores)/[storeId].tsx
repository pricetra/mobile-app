import { useLazyQuery } from '@apollo/client';
import { AntDesign, Feather } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';

import CreateBranchForm from '@/components/CreateBranchForm';
import Image from '@/components/ui/Image';
import ModalFormMini from '@/components/ui/ModalFormMini';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { FindStoreDocument, LocationInput } from '@/graphql/types/graphql';
import useCurrentLocation from '@/hooks/useCurrentLocation';
import { createCloudinaryUrl } from '@/lib/files';

export default function SelectedStoreScreen() {
  const navigation = useNavigation();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const [openModal, setOpenModal] = useState(false);
  const [findStore, { data: storeData, loading: storeLoading }] = useLazyQuery(FindStoreDocument);
  const { location, getCurrentLocation } = useCurrentLocation();
  const [locationInput, setLocationInput] = useState<LocationInput>();

  useEffect(() => {
    if (!location) return;
    setLocationInput({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }, [location]);

  useFocusEffect(
    useCallback(() => {
      if (!storeId) return router.back();
      findStore({
        variables: { id: storeId, location: locationInput },
      }).then(({ data }) => {
        if (!data) return;

        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => (
            <TabHeaderItem
              {...props}
              leftNav={
                <View className="flex flex-row items-center gap-2">
                  <Image
                    src={createCloudinaryUrl(data.findStore.logo, 100, 100)}
                    className="size-[30px] rounded-lg"
                  />
                  <Text className="font-bold">{data.findStore.name}</Text>
                </View>
              }
              rightNav={
                <TouchableOpacity
                  onPress={() => setOpenModal(true)}
                  className="flex flex-row items-center gap-2 rounded-full p-2">
                  <Feather name="plus" size={20} color="#3b82f6" />
                </TouchableOpacity>
              }
            />
          ),
        });
      });
      return () => {
        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => <TabHeaderItem {...props} />,
        });
      };
    }, [storeId, location])
  );

  return (
    <ScrollView>
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
            />
          </ModalFormMini>
        )}

        <View className="p-5">
          {storeLoading && (
            <View className="flex h-40 w-full items-center justify-center px-10">
              <AntDesign
                name="loading1"
                className="size-[30px] animate-spin text-center"
                color="#555"
                size={30}
              />
            </View>
          )}
          <View>
            {storeData &&
              (storeData.allBranches.length > 0 ? (
                storeData.allBranches.map((b) => (
                  <TouchableOpacity
                    onPress={() => router.push(`/(stores)/${b.storeId}/branch/${b.id}`)}
                    key={b.id}
                    className="mb-7">
                    <Text className="font-bold">{b.name}</Text>
                    <Text className="text-sm color-gray-700">{b.address?.fullAddress}</Text>
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

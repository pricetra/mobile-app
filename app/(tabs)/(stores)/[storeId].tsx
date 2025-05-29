import { useLazyQuery } from '@apollo/client';
import { AntDesign, Feather } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';

import CreateBranchForm from '@/components/CreateBranchForm';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import Image from '@/components/ui/Image';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { useHeader } from '@/context/HeaderContext';
import { FindStoreDocument } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';

export default function SelectedStoreScreen() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { setLeftNav, setRightNav } = useHeader();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const [openModal, setOpenModal] = useState(false);
  const [findStore, { data: storeData, loading: storeLoading }] = useLazyQuery(FindStoreDocument);

  useFocusEffect(
    useCallback(() => {
      setLeftNav(<></>);
      setRefreshKey((prev) => prev + 1);
      return () => {
        setLeftNav(<></>);
      };
    }, [])
  );

  useEffect(() => {
    if (!storeId) return router.back();
    findStore({
      variables: { id: storeId },
    });
  }, [storeId, refreshKey]);

  useEffect(() => {
    if (!storeData) return;
    setLeftNav(
      <View className="flex flex-row items-center gap-2">
        <Image
          src={createCloudinaryUrl(storeData.findStore.logo, 100, 100)}
          className="size-[30px] rounded-lg"
        />
        <Text className="font-bold">{storeData.findStore.name}</Text>
      </View>
    );
    setRightNav(
      <>
        <TouchableOpacity
          onPress={() => setOpenModal(true)}
          className="flex flex-row items-center gap-2 rounded-full p-2">
          <Feather name="plus" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </>
    );
  }, [storeData, refreshKey]);

  return (
    <SafeAreaView className="h-full" key={refreshKey}>
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
        <ScrollView className="mt-5 w-full">
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

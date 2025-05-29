import { useLazyQuery } from '@apollo/client';
import { AntDesign, Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { AlertTriangle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';

import CreateBranchForm from '@/components/CreateBranchForm';
import StoreItem, { StoreItemLoading } from '@/components/StoreItem';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { FindStoreDocument } from '@/graphql/types/graphql';

export default function SelectedStoreScreen() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const [openModal, setOpenModal] = useState(false);
  const [findStore, { data: storeData, loading: storeLoading, error: storeError }] =
    useLazyQuery(FindStoreDocument);

  useEffect(() => {
    if (!storeId || typeof storeId !== 'string') return router.back();
    findStore({
      variables: { id: storeId },
    });
  }, [storeId]);

  return (
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

      <FloatingActionButton onPress={() => setOpenModal(true)}>
        <Feather name="plus" size={20} color="white" />
        <Text className="text-md font-bold color-white">Branch</Text>
      </FloatingActionButton>

      <View className="p-5">
        <View>
          {storeLoading && <StoreItemLoading />}
          {storeError && (
            <Alert icon={AlertTriangle} variant="destructive" className="mb-10 max-w-xl">
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{storeError.message}</AlertDescription>
            </Alert>
          )}
          {storeData && <StoreItem {...storeData.findStore} />}
        </View>
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
                  <View key={b.id} className="mb-7">
                    <Text className="font-bold">{b.name}</Text>
                    <Text className="text-sm color-gray-700">{b.address?.fullAddress}</Text>
                  </View>
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

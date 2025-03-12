import { useQuery } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity, Platform } from 'react-native';

import StoreItem, { StoreItemLoading } from '@/components/StoreItem';
import CreateStoreForm from '@/components/CreateStoreForm';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { AllStoresDocument } from '@/graphql/types/graphql';
import { router } from 'expo-router';

export default function CreateStoreScreen() {
  const { data: allStoresData, loading: allStoresLoading } = useQuery(AllStoresDocument);
  const [openModal, setOpenModal] = useState(false);

  return (
    <SafeAreaView>
      <View
        className="absolute right-0 z-10 p-10"
        style={{ bottom: Platform.OS === 'android' ? 0 : 75 }}>
        <TouchableOpacity
          onPress={() => setOpenModal(true)}
          className="flex size-16 items-center justify-center rounded-full bg-gray-900 p-3 shadow-lg">
          <Feather name="plus" size={25} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="h-full p-5">
        <ModalFormMini
          visible={openModal}
          onRequestClose={() => setOpenModal(false)}
          title="Add Store">
          <CreateStoreForm onSuccess={(_data) => setOpenModal(false)} />
        </ModalFormMini>

        <View className="mb-20">
          {allStoresLoading && (
            <View>
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <StoreItemLoading key={i} />
                ))}
            </View>
          )}
          {allStoresData &&
            allStoresData.allStores.map((c) => (
              <TouchableOpacity key={c.id} onPress={() => router.push(`/(stores)/${c.id}`)}>
                <StoreItem {...c} />
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

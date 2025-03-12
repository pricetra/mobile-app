import { useQuery } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity, Text } from 'react-native';

import CreateStoreForm from '@/components/CreateStoreForm';
import StoreItem, { StoreItemLoading } from '@/components/StoreItem';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { AllStoresDocument } from '@/graphql/types/graphql';

export default function CreateStoreScreen() {
  const { data: allStoresData, loading: allStoresLoading } = useQuery(AllStoresDocument);
  const [openModal, setOpenModal] = useState(false);

  return (
    <SafeAreaView>
      <FloatingActionButton onPress={() => setOpenModal(true)}>
        <Feather name="plus" size={20} color="white" />
        <Text className="text-md font-bold color-white">Store</Text>
      </FloatingActionButton>

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

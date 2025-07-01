import { useQuery } from '@apollo/client';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity, Text } from 'react-native';

import CreateStoreForm from '@/components/CreateStoreForm';
import StoreItem, { StoreItemLoading } from '@/components/StoreItem';
import ModalFormMini from '@/components/ui/ModalFormMini';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { AllStoresDocument } from '@/graphql/types/graphql';

export default function CreateStoreScreen() {
  const navigation = useNavigation();
  const { data: allStoresData, loading: allStoresLoading } = useQuery(AllStoresDocument);
  const [openModal, setOpenModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        header: (props: BottomTabHeaderProps) => (
          <TabHeaderItem
            {...props}
            leftNav={
              <View className="flex flex-row items-center gap-3">
                <View className="flex size-[35px] items-center justify-center rounded-full bg-pricetraGreenHeavyDark/10">
                  <MaterialIcons size={20} name="storefront" color="#396a12" />
                </View>
                <Text className="font-bold" numberOfLines={1}>
                  Stores
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
      return () => {
        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => <TabHeaderItem {...props} />,
        });
      };
    }, [])
  );

  return (
    <SafeAreaView>
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

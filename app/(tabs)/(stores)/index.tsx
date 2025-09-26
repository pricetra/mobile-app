import { useQuery } from '@apollo/client';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity, Text, Alert } from 'react-native';

import CreateStoreForm from '@/components/CreateStoreForm';
import StoreItem, { StoreItemLoading } from '@/components/StoreItem';
import ModalFormMini from '@/components/ui/ModalFormMini';
import PaginationSimple from '@/components/ui/PaginationSimple';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { SearchContext } from '@/context/SearchContext';
import { AllStoresDocument } from '@/graphql/types/graphql';

export default function CreateStoreScreen() {
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const { search } = useContext(SearchContext);
  const { data: allStoresData, loading: allStoresLoading } = useQuery(AllStoresDocument, {
    variables: {
      paginator: {
        page,
        limit: 20,
      },
      search,
    },
  });
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        header: (props: BottomTabHeaderProps) => (
          <TabHeaderItem
            {...props}
            showSearch
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
          <CreateStoreForm
            onSuccess={(_data) => setOpenModal(false)}
            onCloseModal={() => setOpenModal(false)}
            onError={(err) => Alert.alert('Could not create store', err.message)}
          />
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
            allStoresData.allStores.stores.map((c) => (
              <TouchableOpacity key={c.id} onPress={() => router.push(`/(stores)/${c.id}`)}>
                <StoreItem {...c} />
              </TouchableOpacity>
            ))}

          {allStoresData &&
            (allStoresData.allStores.paginator.next || allStoresData.allStores.paginator.prev) && (
              <View>
                <PaginationSimple
                  paginator={allStoresData?.allStores?.paginator}
                  onPageChange={setPage}
                />
              </View>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

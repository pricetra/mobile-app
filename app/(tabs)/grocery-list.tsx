import { useLazyQuery, useQuery } from '@apollo/client';
import { Entypo, FontAwesome6 } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, Platform } from 'react-native';

import { GroceryListItemsDocument } from '../../graphql/types/graphql';

import GroceryListItem from '@/components/grocery-list/GroceryListItem';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import ModalFormMini from '@/components/ui/ModalFormMini';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import {
  GroceryListItem as GqlGroceryListItem,
  GroceryListsDocument,
} from '@/graphql/types/graphql';
import AddGroceryListItem from '@/components/grocery-list/AddGroceryListItem';

export default function GroceryList() {
  const navigation = useNavigation();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { data: groceryLists, loading: groceryListsLoading } = useQuery(GroceryListsDocument);
  const groceryList = useMemo(
    () => groceryLists?.groceryLists?.find((l) => l.default),
    [groceryLists]
  );
  const [getGroceryListItems, { data: groceryListItemsData, loading: groceryListItemsLoading }] =
    useLazyQuery(GroceryListItemsDocument, {
      fetchPolicy: 'network-only',
    });

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        header: (props: BottomTabHeaderProps) => (
          <TabHeaderItem
            {...props}
            leftNav={
              <View className="flex flex-row items-center gap-3">
                <View className="flex size-[35px] items-center justify-center rounded-full bg-pricetraGreenHeavyDark/10">
                  <FontAwesome6 name="list-check" size={15} color="#396a12" />
                </View>
                <Text className="font-bold" numberOfLines={1}>
                  Grocery List
                </Text>
              </View>
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

  useEffect(() => {
    if (!groceryList) return;
    getGroceryListItems({ variables: { groceryListId: groceryList.id } });
  }, [groceryList]);

  if (!groceryList || groceryListsLoading || groceryListItemsLoading || !groceryListItemsData)
    return (
      <View className="flex h-40 w-full items-center justify-center px-10">
        <ActivityIndicator color="#555" size="large" />
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <ModalFormMini
        visible={openCreateModal}
        title="Add Grocery Item"
        onRequestClose={() => setOpenCreateModal(false)}>
        <AddGroceryListItem
          groceryListId={groceryList.id}
          onSuccess={() => setOpenCreateModal(false)}
        />
      </ModalFormMini>

      <FloatingActionButton
        btnClassName="gap-5 px-12 shadow-gray-200"
        onPress={() => setOpenCreateModal(true)}>
        <Entypo name="add-to-list" size={27} color="white" />
        <Text className="text-lg font-bold color-white">Add Item</Text>
      </FloatingActionButton>

      <FlatList
        ListHeaderComponent={
          <View className="mb-2 px-5 py-5">
            <Text className="text-3xl font-extrabold">{groceryList.name}</Text>
          </View>
        }
        data={groceryListItemsData.groceryListItems}
        keyExtractor={({ id }, i) => `grocery-list-item-${id}-${i}`}
        renderItem={({ item }) => <GroceryListItem item={item as GqlGroceryListItem} />}
        refreshControl={
          <RefreshControl
            refreshing={groceryListItemsLoading}
            onRefresh={async () => {
              await getGroceryListItems({ variables: { groceryListId: groceryList.id } });
            }}
            colors={Platform.OS === 'ios' ? ['black'] : ['white']}
            progressBackgroundColor="#111827"
          />
        }
        ListFooterComponent={<View style={{ height: 200 }} />}
      />
    </View>
  );
}

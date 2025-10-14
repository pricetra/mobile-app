import { useLazyQuery } from '@apollo/client';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import AddGroceryListItem from '@/components/grocery-list/AddGroceryListItem';
import GroceryListItem, {
  GroceryListItemDeleteAction,
} from '@/components/grocery-list/GroceryListItem';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import ModalFormMini from '@/components/ui/ModalFormMini';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { useAuth } from '@/context/UserContext';
import {
  GroceryListItem as GqlGroceryListItem,
  GroceryListItemsDocument,
} from '@/graphql/types/graphql';

export default function GroceryList() {
  const navigation = useNavigation();
  const { allGroceryLists } = useAuth();
  const [selectedGroceryList] = useState(allGroceryLists?.defaultGroceryList);
  const [openCreateModal, setOpenCreateModal] = useState(false);
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
                  <FontAwesome5 name="shopping-basket" size={15} color="#396a12" />
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
    if (!selectedGroceryList) return;
    getGroceryListItems({ variables: { groceryListId: selectedGroceryList.id } });
  }, [selectedGroceryList]);

  if (!selectedGroceryList) return <></>;

  return (
    <View style={{ flex: 1 }}>
      <ModalFormMini
        visible={openCreateModal}
        title="Add Grocery Item"
        onRequestClose={() => setOpenCreateModal(false)}>
        <AddGroceryListItem
          groceryListId={selectedGroceryList.id}
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
            <Text className="text-3xl font-extrabold">{selectedGroceryList.name}</Text>
          </View>
        }
        data={groceryListItemsData?.groceryListItems}
        keyExtractor={({ id }, i) => `grocery-list-item-${id}-${i}`}
        renderItem={({ item }) => (
          <GestureHandlerRootView>
            <Swipeable
              containerStyle={{ backgroundColor: '#b91c1c' }}
              friction={2}
              rightThreshold={40}
              renderRightActions={(prog, drag) =>
                GroceryListItemDeleteAction({ groceryListItemId: item.id }, prog, drag)
              }>
              <GroceryListItem item={item as GqlGroceryListItem} />
            </Swipeable>
          </GestureHandlerRootView>
        )}
        refreshControl={
          <RefreshControl
            refreshing={groceryListItemsLoading}
            onRefresh={async () => {
              await getGroceryListItems({ variables: { groceryListId: selectedGroceryList.id } });
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

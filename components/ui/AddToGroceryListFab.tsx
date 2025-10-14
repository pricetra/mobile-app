import { useMutation } from '@apollo/client';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { Text } from 'react-native';

import FloatingActionButton from './FloatingActionButton';

import { useAuth } from '@/context/UserContext';
import {
  AddGroceryListItemDocument,
  CountGroceryListItemsDocument,
  DefaultGroceryListItemsDocument,
  GroceryListItemsDocument,
} from '@/graphql/types/graphql';

export type AddToGroceryListFabProps = {
  productId: number;
};

export default function AddToGroceryListFab({ productId }: AddToGroceryListFabProps) {
  const { allGroceryLists } = useAuth();
  const [addItem, { loading: addingItem }] = useMutation(AddGroceryListItemDocument, {
    refetchQueries: [
      DefaultGroceryListItemsDocument,
      GroceryListItemsDocument,
      CountGroceryListItemsDocument,
    ],
  });
  const [addedToList, setAddedToList] = useState(false);

  return (
    <FloatingActionButton
      btnClassName="gap-5 py-5 px-10 bg-pricetraGreenHeavyDark shadow-black/30"
      onPress={() => {
        if (!allGroceryLists) return;
        const groceryListId = allGroceryLists.defaultGroceryList.id;
        setAddedToList(true);
        addItem({ variables: { input: { productId }, groceryListId } }).catch(() =>
          setAddedToList(false)
        );
      }}
      disabled={addingItem || addedToList}>
      {addedToList ? (
        <Feather name="check" size={20} color="white" />
      ) : (
        <FontAwesome5 name="shopping-basket" size={20} color="white" />
      )}
      <Text className="font-bold color-white">{addedToList ? 'Added' : 'Add to Grocery List'}</Text>
    </FloatingActionButton>
  );
}

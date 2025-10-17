import { useMutation } from '@apollo/client';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';

import { AddToGroceryListFabProps } from './AddToGroceryListFab';

import { useAuth } from '@/context/UserContext';
import {
  AddGroceryListItemDocument,
  CountGroceryListItemsDocument,
  DefaultGroceryListItemsDocument,
  GroceryListItemsDocument,
} from '@/graphql/types/graphql';

export default function AddToGroceryListActionButton({ productId }: AddToGroceryListFabProps) {
  const { allGroceryLists } = useAuth();
  const [addItem] = useMutation(AddGroceryListItemDocument, {
    refetchQueries: [
      DefaultGroceryListItemsDocument,
      GroceryListItemsDocument,
      CountGroceryListItemsDocument,
    ],
  });
  const [addedToList, setAddedToList] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => {
        if (!allGroceryLists) return;
        const groceryListId = allGroceryLists.defaultGroceryList.id;
        setAddedToList(true);
        addItem({ variables: { input: { productId }, groceryListId } }).catch(() =>
          setAddedToList(false)
        );
      }}
      className="absolute right-1 top-1 z-[2] flex size-9 items-center justify-center rounded-full bg-pricetraGreenHeavyDark">
      {addedToList ? (
        <Feather name="check" size={15} color="white" />
      ) : (
        <Ionicons name="add" size={20} color="white" />
      )}
    </TouchableOpacity>
  );
}

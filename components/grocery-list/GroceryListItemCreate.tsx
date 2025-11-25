import { useLazyQuery, useMutation } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';

import Btn from '../ui/Btn';

import {
  AddGroceryListItemDocument,
  CategorySearchDocument,
  CountGroceryListItemsDocument,
  DefaultGroceryListItemsDocument,
  GroceryListItemsDocument,
} from '@/graphql/types/graphql';

export default function GroceryListItemCreate({ groceryListId }: { groceryListId: number }) {
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<{
    id: number;
    name: string;
  }>();
  const [searchCategories, { data: categoriesData }] = useLazyQuery(CategorySearchDocument, {
    fetchPolicy: 'no-cache',
  });
  const [addItem] = useMutation(AddGroceryListItemDocument, {
    refetchQueries: [
      DefaultGroceryListItemsDocument,
      GroceryListItemsDocument,
      CountGroceryListItemsDocument,
    ],
  });

  const debouncedCategorySearch = useCallback(
    _.debounce((search: string) => {
      if (search.length < 2) return;
      searchCategories({
        variables: { search: search?.trim(), quickSearchMode: true },
      });
    }, 500),
    [search]
  );

  useEffect(() => {
    debouncedCategorySearch(search);
  }, [search]);

  useEffect(() => {
    if (!selectedCategoryId) return;
    addItem({
      variables: {
        groceryListId,
        input: {
          category: selectedCategoryId.name,
        },
      },
    });
    setSearch('');
    setSelectedCategoryId(undefined);
  }, [selectedCategoryId]);

  return (
    <View className="flex flex-row border-b-[1px] border-gray-50 bg-white py-2">
      <View className="px-5 py-2">
        <Feather name="plus-circle" size={25} color="#999" />
      </View>

      <View className="flex flex-1 flex-col">
        <View className="flex flex-row flex-wrap gap-3 py-3">
          <TextInput
            placeholder="Add item"
            value={search}
            onChangeText={setSearch}
            className="flex-1 color-black placeholder:color-gray-600"
          />
        </View>

        <View>
          {categoriesData && (
            <View className="my-3 flex flex-row flex-wrap items-center gap-2">
              {categoriesData.categorySearch.map((c, i) => {
                const selected = c.id === selectedCategoryId?.id;
                return (
                  <Btn
                    text={c.name}
                    textWeight={selected ? 'bold' : 'normal'}
                    key={`${c.id}-${i}`}
                    size="xs"
                    bgColor={selected ? 'bg-pricetraGreenHeavyDark' : 'bg-gray-100'}
                    color={selected ? 'text-white' : 'text-black'}
                    rounded="full"
                    icon={selected ? <Feather name="check" size={10} color="white" /> : undefined}
                    onPress={() => setSelectedCategoryId(c)}
                    textSize="text-xs"
                    className="gap-2"
                  />
                );
              })}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

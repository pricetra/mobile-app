import { useLazyQuery } from '@apollo/client';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';

import Input from './Input';

import { CategorySearchDocument } from '@/graphql/types/graphql';

export default function FilterCategoriesModal({
  value,
  onSubmit,
}: {
  value?: string;
  onClose: () => void;
  onSubmit: (category: { id: number; name: string }) => void;
}) {
  const [search, setSearch] = useState(value ?? '');
  const [searchCategories, { data: categoriesData, loading }] = useLazyQuery(
    CategorySearchDocument,
    {
      fetchPolicy: 'no-cache',
    }
  );

  const debouncedCategorySearch = useCallback(
    _.debounce((search: string) => {
      searchCategories({
        variables: { search: search?.trim(), quickSearchMode: true },
      });
    }, 500),
    [search]
  );

  useEffect(() => {
    debouncedCategorySearch(search);
  }, [search]);

  return (
    <View>
      <Input
        onChangeText={setSearch}
        value={search}
        keyboardType="ascii-capable"
        inputMode="search"
        placeholder="Search Categories..."
      />

      <View className="mt-5">
        {loading && (
          <View className="flex flex-row items-center justify-center px-5 py-7">
            <ActivityIndicator color="black" />
          </View>
        )}

        {categoriesData && (
          <View>
            {categoriesData.categorySearch.length === 0 ? (
              <View className="flex flex-row items-center justify-center px-5 py-7">
                <Text className="text-center text-gray-500">No brands found</Text>
              </View>
            ) : (
              <>
                {categoriesData.categorySearch.map((category, i) => (
                  <View className="border-b border-gray-200" key={`brand-${category.id}-${i}`}>
                    <TouchableOpacity onPress={() => onSubmit(category)} className="px-5 py-4">
                      <Text className="text-xl font-semibold">{category.name}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        <View style={{ height: 200 }} />
      </View>
    </View>
  );
}

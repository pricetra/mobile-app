import { useLazyQuery } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

import CategoryCombobox, { CategoryComboboxData } from './CategoryCombobox';
import Input from '../ui/Input';

import Btn from '@/components/ui/Btn';
import { Category, CategorySearchDocument, GetCategoryDocument } from '@/graphql/types/graphql';
import { categoriesFromChild } from '@/lib/utils';

export type CategorySelectorProps = {
  category?: Category;
  editable: boolean;
  onChange: (category: Category) => void;
};

export default function CategorySelector({ category, onChange }: CategorySelectorProps) {
  const [search, setSearch] = useState(category?.name ?? '');
  const [categoryDataSet, setCategoryDataSet] = useState<CategoryComboboxData[]>([{ depth: 1 }]);
  const [showCreateCategoryView, setShowCreateCategoryView] = useState(false);

  const [searchCategories, { data: categoriesData, loading: categoriesLoading }] = useLazyQuery(
    CategorySearchDocument,
    {
      fetchPolicy: 'no-cache',
    }
  );
  const [getCategory, { loading: categoryLoading }] = useLazyQuery(GetCategoryDocument);

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
    if (!category) {
      setCategoryDataSet([{ depth: 1 }]);
      return;
    }

    const categories = categoriesFromChild(category);
    categories.push({ depth: categories.length + 1 } as Category);
    setCategoryDataSet(
      categories.map(
        (c, i) =>
          ({
            parentCategory: i > 0 ? categories[i - 1] : undefined,
            depth: c.depth ?? i + 1,
            selection: { id: c.id?.toString(), title: c.name },
          }) as CategoryComboboxData
      )
    );
  }, [category]);

  return (
    <View className="mb-5 mt-3">
      {!showCreateCategoryView && (
        <View>
          <Input
            onChangeText={setSearch}
            value={search}
            keyboardType="ascii-capable"
            inputMode="search"
          />

          {categoriesLoading && (
            <View className="flex flex-row items-center justify-center p-5">
              <ActivityIndicator color="black" />
            </View>
          )}

          {categoriesData && (
            <View className="my-3 flex flex-row flex-wrap items-center gap-2">
              {categoriesData.categorySearch.map((c, i) => {
                const selected = c.id === category?.id;
                return (
                  <Btn
                    text={c.name}
                    textWeight={selected ? 'bold' : 'normal'}
                    key={`${c.id}-${i}`}
                    size="xs"
                    bgColor={selected ? 'bg-pricetraGreenHeavyDark' : 'bg-gray-100'}
                    color={selected ? 'text-white' : 'text-black'}
                    rounded="full"
                    icon={selected ? <Feather name="check" size={15} color="white" /> : undefined}
                    onPress={() => {
                      onChange({ ...c, path: `{${c.id}}`, expandedPathname: `{${c.name}}` });
                      getCategory({ variables: { id: c.id } }).then(({ data }) => {
                        if (!data) return;
                        onChange(data.getCategory);
                      });
                    }}
                    loading={selected && categoryLoading}
                  />
                );
              })}
              <Btn
                text="New"
                size="xs"
                bgColor="bg-gray-800"
                color="text-white"
                rounded="full"
                onPress={() => setShowCreateCategoryView(true)}
                icon={<Feather name="plus" size={15} color="white" />}
              />
            </View>
          )}
        </View>
      )}

      {showCreateCategoryView && (
        <View>
          <View className="mb-3 flex flex-row">
            <Btn
              text="Search"
              icon={<Feather name="arrow-left" size={17} color="black" />}
              color="black"
              bgColor="bg-gray-200"
              onPress={() => setShowCreateCategoryView(false)}
              size="sm"
            />

            <View className="flex-1" />
          </View>

          <View className="flex flex-1 flex-col gap-2">
            {categoryDataSet.map(({ parentCategory, depth, selection }, i) => (
              <CategoryCombobox
                depth={depth}
                selection={selection}
                parentCategory={parentCategory}
                key={i}
                onSelect={(category) => {
                  const prevDepth = category.depth ?? i;
                  setCategoryDataSet([
                    ...categoryDataSet.splice(0, i + 1),
                    { parentCategory: category, depth: prevDepth + 1 },
                  ]);
                  onChange(category);
                }}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

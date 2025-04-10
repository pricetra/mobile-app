import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

import Combobox, { ComboboxItem } from '@/components/ui/Combobox';
import { Category, CreateCategoryDocument, GetCategoriesDocument } from '@/graphql/types/graphql';
import { postgresArrayToNumericArray } from '@/lib/strings';

export type CategoryComboboxData = {
  depth: number;
  parentCategory?: Category;
  selection?: AutocompleteDropdownItem;
};

export type CategoryComboboxProps = CategoryComboboxData & {
  depth: number;
  onSelect: (category: Category) => void;
};

export default function CategoryCombobox({
  parentCategory,
  depth,
  onSelect,
  selection,
}: CategoryComboboxProps) {
  const { data, error, loading } = useQuery(GetCategoriesDocument, {
    variables: { depth, parentId: parentCategory?.id },
  });
  const [createCategory] = useMutation(CreateCategoryDocument, {
    refetchQueries: [GetCategoriesDocument],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [rawCategoryInput, setRawCategoryInput] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!error) return;
    alert(error.message);
  }, [error]);

  useEffect(() => {
    if (!data) return;
    setCategories(data.getCategories);
  }, [data]);

  function addNewCategory(value: string) {
    const parentPath = parentCategory ? postgresArrayToNumericArray(parentCategory.path) : [];
    return createCategory({
      variables: {
        input: {
          name: value,
          parentPath,
        },
      },
    });
  }

  return (
    <Combobox
      dataSet={categories.map((c) => ({ id: c.id, title: c.name })) ?? []}
      onSelectItem={(item) => {
        const category = categories.find(({ id }) => id === item?.id);
        if (!category) return;
        onSelect(category);
      }}
      loading={loading || adding}
      initialValue={selection}
      textInputProps={{
        placeholder: parentCategory ? `Subcategory of ${parentCategory.name}` : 'Select category',
        autoCorrect: false,
        autoCapitalize: 'words',
        onChange: (e) => setRawCategoryInput(e.nativeEvent.text.trim()),
      }}
      EmptyResultComponent={
        <>
          {rawCategoryInput.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                setAdding(true);
                addNewCategory(rawCategoryInput)
                  .then(({ data, errors }) => {
                    if (errors || !data) return;
                    onSelect(data.createCategory);
                  })
                  .catch((err) => alert(err))
                  .finally(() => setAdding(false));
              }}>
              <ComboboxItem value={`Add "${rawCategoryInput}"`} />
            </TouchableOpacity>
          ) : (
            <ComboboxItem
              value={`No categories found. If you need a new category, type the value and press "Add"`}
            />
          )}
        </>
      }
    />
  );
}

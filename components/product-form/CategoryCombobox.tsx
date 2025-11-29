import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

import Combobox, { ComboboxItem } from '@/components/ui/Combobox';
import { Category, CreateCategoryDocument, GetCategoriesDocument } from 'graphql-utils';
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
    fetchPolicy: 'network-only',
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

  useEffect(() => {
    if (!selection || !selection.title) return;
    setRawCategoryInput(selection.title);
  }, [selection]);

  function addNewCategory(value: string) {
    const parentPath = parentCategory ? postgresArrayToNumericArray(parentCategory.path) : [];
    return createCategory({
      variables: {
        input: {
          name: value.trim(),
          parentPath,
        },
      },
    });
  }

  return (
    <Combobox
      dataSet={categories.map((c) => ({ id: c.id.toString(), title: c.name })) ?? []}
      onSelectItem={(item) => {
        if (!item) return;
        const category = categories.find(({ id }) => id === +item.id);
        if (!category) return;
        setRawCategoryInput(category.name);
        onSelect(category);
      }}
      loading={loading || adding}
      initialValue={selection}
      showClear
      textInputProps={{
        placeholder: parentCategory ? `Subcategory of ${parentCategory.name}` : 'Select category',
        autoCorrect: false,
        autoCapitalize: 'words',
        onChange: (e) => setRawCategoryInput(e.nativeEvent.text),
        value: rawCategoryInput,
      }}
      onClear={() => setRawCategoryInput('')}
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

import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import Combobox from '@/components/ui/Combobox';
import { Category, GetCategoriesDocument } from '@/graphql/types/graphql';

export type CategoryComboboxData = {
  parentCategory?: Category;
  depth: number;
};

export type CategoryComboboxProps = CategoryComboboxData & {
  depth: number;
  onSelect: (category: Category) => void;
};

export default function CategoryCombobox({
  parentCategory,
  depth,
  onSelect,
}: CategoryComboboxProps) {
  const { data, error, loading } = useQuery(GetCategoriesDocument, {
    variables: { depth, parentId: parentCategory?.id },
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!error) return;
    alert(error.message);
  }, [error]);

  useEffect(() => {
    if (!data) return;
    setCategories(data.getCategories);
  }, [data]);

  return (
    <Combobox
      dataSet={categories.map((c) => ({ id: c.id, title: c.name })) ?? []}
      onSelectItem={(item) => {
        const category = categories.find(({ id }) => id === item?.id);
        if (!category) return;
        onSelect(category);
      }}
      loading={loading}
    />
  );
}

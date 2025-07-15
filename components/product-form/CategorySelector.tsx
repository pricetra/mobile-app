import { useEffect, useState } from 'react';
import { View } from 'react-native';

import CategoryCombobox, { CategoryComboboxData } from './CategoryCombobox';

import { Category } from '@/graphql/types/graphql';
import { categoriesFromChild } from '@/lib/utils';

export type CategorySelectorProps = {
  category?: Category;
  editable: boolean;
  onChange: (category: Category) => void;
};

export default function CategorySelector({ category, onChange }: CategorySelectorProps) {
  const [categoryDataSet, setCategoryDataSet] = useState<CategoryComboboxData[]>([{ depth: 1 }]);

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
  );
}

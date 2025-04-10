import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import CategoryCombobox, { CategoryComboboxData } from './CategoryCombobox';

import { Category } from '@/graphql/types/graphql';

export type CategorySelectorProps = {
  category?: Category;
  editable: boolean;
  onChange: (category: Category) => void;
};

export default function CategorySelector({ category, onChange }: CategorySelectorProps) {
  const [categoryDataSet, setCategoryDataSet] = useState<CategoryComboboxData[]>([{ depth: 1 }]);

  return (
    <View className="flex flex-1 flex-col gap-2">
      {categoryDataSet.map(({ parentCategory, depth }, i) => (
        <CategoryCombobox
          depth={depth}
          parentCategory={parentCategory}
          key={i}
          onSelect={(category) => {
            const prevDepth = category.depth ?? i;
            setCategoryDataSet([
              ...categoryDataSet.splice(0, i + 1),
              { parentCategory: category, depth: prevDepth + 1 },
            ]);
          }}
        />
      ))}
    </View>
  );
}

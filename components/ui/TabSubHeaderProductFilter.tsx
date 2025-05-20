import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, ScrollView, View } from 'react-native';

import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const categories: PartialCategory[] = [
  { id: undefined, name: 'All', category: undefined },
  { id: '464', name: 'Milk', category: 'Milk' },
  { id: '478', name: 'Eggs', categoryId: '478' },
  { id: '490', name: 'Bread', category: 'Bread' },
  { id: '635', name: 'Pasta', category: 'Pasta' },
  { id: '965', name: 'Rice', category: 'Rice' },
  { id: '474', name: 'Butter', category: 'Butter' },
];

export type PartialCategory = { id?: string; name: string; category?: string; categoryId?: string };

export type TabSubHeaderProductFilterProps = {
  selectedCategoryId?: string;
  onSelectCategory: (category: PartialCategory) => void;
};

export default function TabSubHeaderProductFilter({
  selectedCategoryId,
  onSelectCategory,
}: TabSubHeaderProductFilterProps) {
  return (
    <ScrollView horizontal>
      <View className="flex flex-row items-center justify-start gap-2 px-5 py-3">
        <Button className="mr-4 rounded-full px-4" variant="secondary" size="sm">
          <View className="flex flex-row items-center justify-center gap-2">
            <Ionicons name="filter" size={15} color="white" />
            <Text className="text-sm font-bold text-white">Filters</Text>
          </View>
        </Button>

        <View className="mr-[15vh] flex flex-row items-center gap-2">
          {categories.map((c, i) => (
            <Button
              className={cn(
                'rounded-full px-4 active:border-pricetraGreenDark active:bg-pricetraGreenDark',
                c.id === selectedCategoryId
                  ? 'border-pricetraGreenDark bg-pricetraGreenDark'
                  : undefined
              )}
              variant="outlineLight"
              size="sm"
              key={i}
              onPress={() => onSelectCategory(c)}>
              <Text
                className={cn('text-sm', c.id === selectedCategoryId ? 'text-white' : undefined)}>
                {c.name}
              </Text>
            </Button>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

import { Text, ScrollView, View } from 'react-native';

import LocationChangeButton from './LocationChangeButton';

import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const categories: PartialCategory[] = [
  { id: undefined, name: 'All' },
  { id: '464', name: 'Milk' },
  { id: '478', name: 'Eggs' },
  { id: '509', name: 'Produce' },
  { id: '490', name: 'Bread' },
  { id: '635', name: 'Pasta' },
  { id: '965', name: 'Rice' },
  { id: '474', name: 'Butter' },
];

export type PartialCategory = { id?: string; name: string };

export type TabSubHeaderProductFilterProps = {
  selectedCategoryId?: string;
  onSelectCategory: (category: PartialCategory) => void;
  onLocationButtonPress?: () => void;
};

export default function TabSubHeaderProductFilter({
  selectedCategoryId,
  onSelectCategory,
  onLocationButtonPress,
}: TabSubHeaderProductFilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex flex-row items-center justify-start gap-2 px-5 py-3">
        {onLocationButtonPress && <LocationChangeButton onPress={onLocationButtonPress} />}

        <View className="ml-1 mr-5 flex flex-row items-center gap-2">
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

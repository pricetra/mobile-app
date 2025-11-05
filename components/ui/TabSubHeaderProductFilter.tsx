import { useGlobalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Text, ScrollView, View } from 'react-native';

import Button from './Button';
import LocationChangeButton from './LocationChangeButton';
import SearchFilters from './SearchFilters';

import { SearchRouteParams } from '@/app/(tabs)/search';
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
  onLocationButtonPress?: () => void;
  onUpdateParams: (p: URLSearchParams) => void;
};

export default function TabSubHeaderProductFilter({
  onLocationButtonPress,
  onUpdateParams,
}: TabSubHeaderProductFilterProps) {
  const params = useGlobalSearchParams<SearchRouteParams>();
  const urlParamBuilder = useMemo(() => new URLSearchParams(params), [params]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex flex-row items-center justify-start gap-2 px-5 py-3">
        {onLocationButtonPress && <LocationChangeButton onPress={onLocationButtonPress} />}

        <SearchFilters params={params} onUpdateParams={onUpdateParams} />

        {(!urlParamBuilder.size || urlParamBuilder.size === 0) && (
          <View className="ml-1 mr-5 flex flex-row items-center gap-2">
            {categories.map((c, i) => (
              <Button
                className={cn(
                  'rounded-full px-4 active:border-pricetraGreenDark active:bg-pricetraGreenDark',
                  String(c.id) === params.categoryId
                    ? 'border-pricetraGreenDark bg-pricetraGreenDark'
                    : undefined
                )}
                variant="outlineLight"
                size="sm"
                key={i}
                onPress={() => {
                  urlParamBuilder.set('categoryId', String(c.id));
                  urlParamBuilder.set('category', String(c.name));
                  onUpdateParams(urlParamBuilder);
                }}>
                <Text
                  className={cn(
                    'text-sm',
                    String(c.id) === params.categoryId ? 'text-white' : undefined
                  )}>
                  {c.name}
                </Text>
              </Button>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

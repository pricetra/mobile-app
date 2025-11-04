import { useGlobalSearchParams } from 'expo-router';
import { Text, ScrollView, View } from 'react-native';

import LocationChangeButton from './LocationChangeButton';
import SearchFilters from './SearchFilters';

import { SearchRouteParams } from '@/app/(tabs)/search';

export type PartialCategory = { id?: string; name: string };

export type TabSubHeaderProductFilterProps = {
  selectedCategoryId?: string;
  onSelectCategory: (category: PartialCategory) => void;
  onLocationButtonPress?: () => void;
  onUpdateParams: (p: URLSearchParams) => void;
};

export default function TabSubHeaderProductFilter({
  selectedCategoryId,
  onSelectCategory,
  onLocationButtonPress,
  onUpdateParams,
}: TabSubHeaderProductFilterProps) {
  const params = useGlobalSearchParams<SearchRouteParams>();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex flex-row items-center justify-start gap-2 px-5 py-3">
        {onLocationButtonPress && <LocationChangeButton onPress={onLocationButtonPress} />}

        <SearchFilters params={params} onUpdateParams={onUpdateParams} />
      </View>
    </ScrollView>
  );
}

import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity, View, Text } from 'react-native';

import { SearchRouteParams } from '@/app/(tabs)/search';

export type SearchFiltersProps = {
  onUpdateParams: (p: URLSearchParams) => void;
  params: SearchRouteParams;
};

export default function SearchFilters({ params, onUpdateParams }: SearchFiltersProps) {
  return (
    <View className="flex flex-row flex-wrap items-center gap-3">
      {(params.category || params.categoryId) && (
        <SearchFilterButton
          label="Category"
          value={params.category}
          onPressClear={() => {
            const sp = new URLSearchParams(params);
            sp.delete('category');
            sp.delete('categoryId');
            onUpdateParams(sp);
          }}
        />
      )}

      {params.brand && (
        <SearchFilterButton
          label="Brand"
          value={params.brand}
          onPressClear={() => {
            const sp = new URLSearchParams(params);
            sp.delete('brand');
            onUpdateParams(sp);
          }}
        />
      )}

      {params.sortByPrice && (
        <SearchFilterButton
          label={params.sortByPrice === 'asc' ? 'Lowest price' : 'Highest price'}
          onPressClear={() => {
            const sp = new URLSearchParams(params);
            sp.delete('sortByPrice');
            onUpdateParams(sp);
          }}
        />
      )}

      {params.sale && (
        <SearchFilterButton
          label="Sale"
          onPressClear={() => {
            const sp = new URLSearchParams(params);
            sp.delete('sale');
            onUpdateParams(sp);
          }}
        />
      )}
    </View>
  );
}

function SearchFilterButton({
  label,
  value,
  onPress,
  onPressClear,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  onPressClear: () => void;
}) {
  return (
    <View className="flex flex-row items-center gap-2 rounded-full bg-gray-100">
      <TouchableOpacity className="flex flex-row items-center gap-1 py-2 pl-4" onPress={onPress}>
        <Text className="text-sm">{label}</Text>
        {value && <Text className="text-sm font-bold">{value}</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressClear} className="p-1.5 pr-4">
        <AntDesign name="close" size={13} color="black" />
      </TouchableOpacity>
    </View>
  );
}

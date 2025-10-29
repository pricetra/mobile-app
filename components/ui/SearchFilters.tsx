import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity, View, Text } from 'react-native';

import { SearchRouteParams } from '@/app/(tabs)/search';

export type SearchFiltersProps = {
  onUpdateParams: (p: URLSearchParams) => void;
  params: SearchRouteParams;
};

export default function SearchFilters({ params, onUpdateParams }: SearchFiltersProps) {
  return (
    <View className="flex flex-row items-center gap-3">
      {params.query && (
        <View className="flex flex-row items-center gap-3 rounded-full border-[1px] border-gray-200 bg-gray-50 px-4 py-2">
          <Text className="text-sm">
            <Text>Search: </Text>
            <Text className="font-bold">{params.query}</Text>
          </Text>

          <TouchableOpacity
            onPress={() => {
              const sp = new URLSearchParams(params);
              sp.delete('query');
              onUpdateParams(sp);
            }}>
            <AntDesign name="close" size={13} color="black" />
          </TouchableOpacity>
        </View>
      )}

      {params.category && params.categoryId && (
        <View className="flex flex-row items-center gap-3 rounded-full border-[1px] border-gray-200 bg-gray-50 px-4 py-2">
          <Text className="text-sm">
            <Text>Category: </Text>
            <Text className="font-bold">{params.category}</Text>
          </Text>

          <TouchableOpacity
            onPress={() => {
              const sp = new URLSearchParams(params);
              sp.delete('category');
              sp.delete('categoryId');
              onUpdateParams(sp);
            }}>
            <AntDesign name="close" size={13} color="black" />
          </TouchableOpacity>
        </View>
      )}

      {params.brand && (
        <View className="flex flex-row items-center gap-3 rounded-full border-[1px] border-gray-200 bg-gray-50 px-4 py-2">
          <Text className="text-sm">
            <Text>Brand: </Text>
            <Text className="font-bold">{params.brand}</Text>
          </Text>

          <TouchableOpacity
            onPress={() => {
              const sp = new URLSearchParams(params);
              sp.delete('brand');
              onUpdateParams(sp);
            }}>
            <AntDesign name="close" size={13} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

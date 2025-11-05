import { Feather, Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Keyboard, TextInput, TouchableOpacity, View } from 'react-native';

import { cn } from '@/lib/utils';

export type TabHeaderItemSearchBarProps = {
  handleSearch: (s?: string) => void;
  branchName: string;
  query?: string;
};

export default function TabHeaderItemSearchBar({
  branchName,
  handleSearch,
  query,
}: TabHeaderItemSearchBarProps) {
  const [searchText, setSearchText] = useState<string | undefined>(query);
  const searchTextLen = useMemo(() => (searchText ?? '').length, [searchText]);

  return (
    <View className="relative">
      <Ionicons
        name="search"
        color="#6b7280"
        size={18}
        className="absolute left-[20px] top-[10px] z-[1]"
      />
      <TextInput
        placeholder={`Search ${branchName}`}
        value={searchText ?? ''}
        onEndEditing={() => {
          handleSearch(searchText ?? undefined);
        }}
        onChangeText={setSearchText}
        inputMode="search"
        className={cn(
          'rounded-full border-[1px] border-gray-100 bg-gray-50 px-5 py-3 pl-[50px] color-black placeholder:color-gray-500 focus:bg-transparent',
          searchTextLen > 0 ? 'pr-[80px]' : ''
        )}
        enterKeyHint="search"
      />

      {searchTextLen > 0 && (
        <View className="absolute right-5 top-3 z-[1] flex flex-row items-center justify-end gap-2">
          <TouchableOpacity
            onPress={() => {
              setSearchText('');
              handleSearch(undefined);
              Keyboard.dismiss();
            }}>
            <Feather name="x-circle" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleSearch(searchText ?? undefined);
              Keyboard.dismiss();
            }}
            className="size-[20px] rounded-full bg-pricetraGreenHeavyDark p-[2px]">
            <Feather name="arrow-right" size={15} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

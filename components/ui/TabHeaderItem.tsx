import { Feather, Ionicons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { Platform, SafeAreaView, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import TabHeaderSearchBar from './TabHeaderSearchBar';

import { useHeader } from '@/context/HeaderContext';
import { SearchContext } from '@/context/SearchContext';
import { cn } from '@/lib/utils';

export type TabHeaderItemProps = BottomTabHeaderProps & {
  leftNav?: ReactNode;
  rightNav?: ReactNode;
  showSearch?: boolean;
  onSearchChange?: (query: string | null | undefined) => void;
};

const iconSize = 20;
const logoHeight = 23;
const padding = 15;
const navHeight = 2 * padding + logoHeight;

const iconColor = '#333';

export default function TabHeaderItem({
  leftNav,
  rightNav,
  showSearch,
  onSearchChange,
}: TabHeaderItemProps) {
  const { subHeader } = useHeader();
  const { search, handleSearch } = useContext(SearchContext);
  const [openSearch, setOpenSearch] = useState(false);

  const iconStyles: StyleProp<ViewStyle> = {
    paddingVertical: padding,
    paddingHorizontal: padding + 5,
  };

  useEffect(() => {
    if (!search || search === '' || !showSearch) return;
    setOpenSearch(true);
  }, [search]);

  useEffect(() => {
    if (!onSearchChange) return;
    onSearchChange(search);
  }, [search]);

  return (
    <SafeAreaView
      className={cn(
        'flex w-full bg-white',
        Platform.OS === 'android' ? 'shadow shadow-black/100' : 'border-b-[1px] border-neutral-100'
      )}>
      <View
        className="w-full flex-row items-center justify-between gap-3"
        style={{ marginTop: Platform.OS === 'android' ? 30 : 0, height: navHeight }}>
        {openSearch ? (
          <TabHeaderSearchBar
            onBackPressed={() => {
              handleSearch(null);
              setOpenSearch(false);
            }}
            logoHeight={logoHeight}
            padding={padding}
            iconStyles={iconStyles}
            iconColor={iconColor}
            iconSize={iconSize}
            updateSearch={handleSearch}
            searchText={search}
          />
        ) : (
          <>
            <View className="flex flex-[2] flex-row items-center justify-start gap-1">
              <TouchableOpacity onPress={() => router.back()} style={iconStyles}>
                <Feather name="arrow-left" size={iconSize} color={iconColor} />
              </TouchableOpacity>

              {leftNav}
            </View>

            <View
              className="flex flex-[1] flex-row items-center justify-end gap-3"
              style={{ paddingHorizontal: iconStyles.paddingHorizontal }}>
              {rightNav}

              {showSearch && (
                <TouchableOpacity onPress={() => setOpenSearch(true)}>
                  <Ionicons name="search" color={iconColor} size={iconSize} />
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
      <View>{subHeader ? subHeader : <></>}</View>
    </SafeAreaView>
  );
}

import { Feather, Ionicons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import TabHeaderContainer, { navConsts } from './TabHeaderContainer';
import TabHeaderSearchBar from './TabHeaderSearchBar';

import { useHeader } from '@/context/HeaderContext';
import { SearchContext } from '@/context/SearchContext';

export type TabHeaderItemProps = BottomTabHeaderProps & {
  leftNav?: ReactNode;
  rightNav?: ReactNode;
  showSearch?: boolean;
  onSearchChange?: (query: string | null | undefined) => void;
};

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
    paddingVertical: navConsts.padding,
    paddingHorizontal: navConsts.padding + 5,
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
    <TabHeaderContainer subHeader={subHeader}>
      {openSearch ? (
        <TabHeaderSearchBar
          onBackPressed={() => {
            handleSearch(null);
            setOpenSearch(false);
          }}
          logoHeight={navConsts.logoHeight}
          padding={navConsts.padding}
          iconStyles={iconStyles}
          iconColor={navConsts.iconColor}
          iconSize={navConsts.iconSize}
          updateSearch={handleSearch}
          searchText={search}
        />
      ) : (
        <>
          <View className="flex flex-[2] flex-row items-center justify-start gap-1">
            <TouchableOpacity onPress={() => router.back()} style={iconStyles}>
              <Feather name="arrow-left" size={navConsts.iconSize} color={navConsts.iconColor} />
            </TouchableOpacity>

            {leftNav}
          </View>

          <View
            className="flex flex-[1] flex-row items-center justify-end gap-3"
            style={{ paddingHorizontal: iconStyles.paddingHorizontal }}>
            {rightNav}

            {showSearch && (
              <TouchableOpacity onPress={() => setOpenSearch(true)}>
                <Ionicons name="search" color={navConsts.iconColor} size={navConsts.iconSize} />
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </TabHeaderContainer>
  );
}

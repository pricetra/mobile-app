import { Ionicons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Platform, SafeAreaView, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import TabHeaderSearchBar from './TabHeaderSearchBar';

import { useDrawer } from '@/context/DrawerContext';
import { useHeader } from '@/context/HeaderContext';
import { SearchContext } from '@/context/SearchContext';
import { cn } from '@/lib/utils';

export type TabHeaderProps = BottomTabHeaderProps;

const iconSize = 20;
const logoHeight = 23;
const padding = 15;
const navHeight = 2 * padding + logoHeight;

const iconColor = '#333';

export default function TabHeader(props: TabHeaderProps) {
  const { leftSection, middleSection, rightSection, subHeader } = useHeader();
  const { openDrawer } = useDrawer();
  const { search, handleSearch } = useContext(SearchContext);
  const [searchText, setSearchText] = useState(search);
  const [openSearch, setOpenSearch] = useState(false);

  const iconStyles: StyleProp<ViewStyle> = {
    paddingVertical: padding,
    paddingHorizontal: padding + 5,
  };

  function updateSearch(text: string | null) {
    setSearchText(text);
    handleSearch(text);
  }

  useEffect(() => {
    console.log('leftSection typeof:', typeof leftSection); // should be "function"
  }, [leftSection]);

  return (
    <SafeAreaView
      className={cn(
        'flex w-full bg-white',
        Platform.OS === 'android' ? 'shadow shadow-black/100' : 'border-b-[1px] border-neutral-100'
      )}>
      <View
        className="w-full flex-row items-center justify-center gap-3"
        style={{ marginTop: Platform.OS === 'android' ? 30 : 0, height: navHeight }}>
        {openSearch ? (
          <TabHeaderSearchBar
            onBackPressed={() => {
              updateSearch(null);
              setOpenSearch(false);
            }}
            logoHeight={logoHeight}
            padding={padding}
            iconStyles={iconStyles}
            iconColor={iconColor}
            iconSize={iconSize}
            updateSearch={updateSearch}
            searchText={searchText}
          />
        ) : (
          <>
            {leftSection ? (
              // leftSection(iconColor, iconSize, iconStyles)
              <></>
            ) : (
              <TouchableOpacity onPress={() => openDrawer()} style={iconStyles}>
                <Ionicons name="menu" color={iconColor} size={iconSize} />
              </TouchableOpacity>
            )}

            {middleSection ? (
              middleSection(iconColor, iconSize, iconStyles)
            ) : (
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/')}
                className="flex w-full flex-1 items-center justify-center"
                style={iconStyles}>
                <Image
                  source={require('../../assets/images/logotype_header_black.svg')}
                  style={{ height: logoHeight, width: 119.21 }}
                />
              </TouchableOpacity>
            )}

            {rightSection ? (
              rightSection(iconColor, iconSize, iconStyles)
            ) : (
              <TouchableOpacity onPress={() => setOpenSearch(true)} style={iconStyles}>
                <Ionicons name="search" color={iconColor} size={iconSize} />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      <View>{subHeader ? subHeader(iconColor, iconSize, iconStyles) : <></>}</View>
    </SafeAreaView>
  );
}

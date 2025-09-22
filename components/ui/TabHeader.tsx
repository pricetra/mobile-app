import { Ionicons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
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
  const { subHeader } = useHeader();
  const { openDrawer } = useDrawer();
  const { search, handleSearch, setSearching, searching } = useContext(SearchContext);
  const [openSearch, setOpenSearch] = useState(false);

  const iconStyles: StyleProp<ViewStyle> = {
    paddingVertical: padding,
    paddingHorizontal: padding + 5,
  };

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
              handleSearch(null);
              setOpenSearch(false);
              if (searching) setSearching(false);
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
            <TouchableOpacity onPress={() => openDrawer()} style={iconStyles}>
              <Ionicons name="menu" color={iconColor} size={iconSize} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/')}
              className="flex w-full flex-1 items-center justify-center"
              style={iconStyles}>
              {process.env.NODE_ENV === 'development' ? (
                <Image
                  source={require('@/assets/images/logotype_header_black_dev.svg')}
                  style={{ height: logoHeight, width: 119.21 }}
                />
              ) : (
                <Image
                  source={require('@/assets/images/logotype_header_black.svg')}
                  style={{ height: logoHeight, width: 119.21 }}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setOpenSearch(true)} style={iconStyles}>
              <Ionicons name="search" color={iconColor} size={iconSize} />
            </TouchableOpacity>
          </>
        )}
      </View>
      <View>{subHeader ? subHeader : <></>}</View>
    </SafeAreaView>
  );
}

import { Feather, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useContext } from 'react';
import { Platform, SafeAreaView, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import TabHeaderSearchBar from './TabHeaderSearchBar';

import { useDrawer } from '@/context/DrawerContext';
import { useHeader } from '@/context/HeaderContext';
import { SearchContext } from '@/context/SearchContext';
import { useAuth } from '@/context/UserContext';
import { createCloudinaryUrl } from '@/lib/files';
import { cn } from '@/lib/utils';

export type TabHeaderProps = BottomTabHeaderProps;

const iconSize = 20;
const logoHeight = 23;
const padding = 15;
const navHeight = 2 * padding + logoHeight;

const iconColor = '#333';

export default function TabHeader(props: TabHeaderProps) {
  const { user } = useAuth();
  const { subHeader } = useHeader();
  const { openDrawer } = useDrawer();
  const { search, handleSearch, setSearching, searching, searchOpen, setSearchOpen } =
    useContext(SearchContext);

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
        {searchOpen ? (
          <TabHeaderSearchBar
            onBackPressed={() => {
              handleSearch(null);
              setSearchOpen(false);
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
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/grocery-list', { relativeToDirectory: false })}
              style={iconStyles}>
              <FontAwesome5 name="shopping-basket" size={iconSize - 2} color={iconColor} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/', { relativeToDirectory: false })}
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

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/(profile)', { relativeToDirectory: false })}
              style={iconStyles}>
              {user.avatar ? (
                <Image
                  source={{
                    uri: createCloudinaryUrl(user.avatar, 2 * iconSize, 2 * iconSize),
                  }}
                  style={{
                    width: iconSize + 2,
                    height: iconSize + 2,
                    borderRadius: 20,
                  }}
                />
              ) : (
                <Feather size={iconSize} name="user" color={iconColor} />
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
      <View>{subHeader ? subHeader : <></>}</View>
    </SafeAreaView>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { useDrawer } from '@/context/DrawerContext';
import { SearchContext } from '@/context/SearchContext';
import { cn } from '@/lib/utils';

export type TabHeaderProps = BottomTabHeaderProps;

const iconSize = 20;
const logoHeight = 23;
const padding = 15;
const navHeight = 2 * padding + logoHeight;

const iconColor = '#333';

export default function TabHeader(props: TabHeaderProps) {
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
          <>
            <TouchableOpacity
              onPress={() => {
                updateSearch(null);
                setOpenSearch(false);
              }}
              style={iconStyles}>
              <Ionicons name="arrow-back" color={iconColor} size={iconSize} />
            </TouchableOpacity>

            <TextInput
              placeholder="Search..."
              autoFocus
              style={{
                flex: 1,
                height: logoHeight,
                padding: 0,
                fontSize: 17,
                paddingRight: padding,
                marginRight: padding,
              }}
              clearButtonMode="while-editing"
              className="placeholder:color-slate-400"
              onChangeText={updateSearch}
              value={searchText ?? ''}
            />
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => openDrawer()} style={iconStyles}>
              <Ionicons name="menu" color={iconColor} size={iconSize} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/')}
              className="flex w-full flex-1 items-center justify-center"
              style={iconStyles}>
              <Image
                source={require('../../assets/images/logotype_header_black.svg')}
                style={{ height: logoHeight, width: 119.21 }}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setOpenSearch(true)} style={iconStyles}>
              <Ionicons name="search" color={iconColor} size={iconSize} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

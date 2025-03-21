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

import { SearchContext } from '@/context/SearchContext';

export type TabHeaderProps = BottomTabHeaderProps;

const iconSize = 20;
const logoHeight = 23;
const padding = 15;
const navHeight = 2 * padding + logoHeight;

export default function TabHeader(props: TabHeaderProps) {
  const { search, setSearch } = useContext(SearchContext);
  const [searchText, setSearchText] = useState(search);
  const [openSearch, setOpenSearch] = useState(false);

  const iconStyles: StyleProp<ViewStyle> = {
    paddingVertical: padding,
    paddingHorizontal: padding + 5,
  };

  function updateSearch(text: string) {
    setSearchText(text);
    setSearch(text);
  }

  return (
    <SafeAreaView className="flex w-full bg-gray-900">
      <View
        className="w-full flex-row items-center justify-center gap-3"
        style={{ marginTop: Platform.OS === 'android' ? 30 : 0, height: navHeight }}>
        {openSearch ? (
          <>
            <TouchableOpacity
              onPress={() => {
                updateSearch('');
                setOpenSearch(false);
              }}
              style={iconStyles}>
              <Ionicons name="arrow-back" color="#e2e8f0" size={iconSize} />
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
              className="color-white placeholder:color-slate-400"
              onChangeText={updateSearch}
              value={searchText}
            />
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => {
                if (props.options.title || props.options.tabBarIcon) return;
                router.back();
              }}
              style={iconStyles}>
              {props.options.tabBarIcon ? (
                props.options.tabBarIcon({ focused: true, color: '#e2e8f0', size: iconSize })
              ) : (
                <Ionicons name="chevron-back-outline" color="#e2e8f0" size={iconSize} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/')}
              className="flex w-full flex-1 items-center justify-center"
              style={iconStyles}>
              <Image
                source={require('../../assets/images/logotype_header.svg')}
                style={{ height: logoHeight, width: 119.21 }}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setOpenSearch(true)} style={iconStyles}>
              <Ionicons name="search" color="#e2e8f0" size={iconSize} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

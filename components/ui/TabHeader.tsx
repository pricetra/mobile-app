import { Ionicons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { Platform, SafeAreaView, View, TouchableOpacity, TextInput } from 'react-native';

import { SearchContext } from '@/context/SearchContext';

export type TabHeaderProps = BottomTabHeaderProps;

export default function TabHeader(props: TabHeaderProps) {
  const { search, setSearch } = useContext(SearchContext);
  const [searchText, setSearchText] = useState(search);
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <SafeAreaView className="flex w-full bg-gray-900">
      <View
        className="w-full flex-row items-center justify-center gap-3 px-5 py-4"
        style={{ marginTop: Platform.OS === 'android' ? 30 : 0 }}>
        {openSearch ? (
          <>
            <TouchableOpacity onPress={() => setOpenSearch(false)}>
              <Ionicons name="arrow-back" color="#e2e8f0" size={20} />
            </TouchableOpacity>

            <TextInput
              placeholder="Search..."
              autoFocus
              style={{ flex: 1, marginLeft: 10, height: 23, padding: 0 }}
              clearButtonMode="while-editing"
              className="color-white placeholder:color-slate-400"
              onChangeText={(t) => {
                setSearchText(t);
                setSearch(t);
              }}
              value={searchText}
            />
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => {
                if (props.options.title || props.options.tabBarIcon) return;
                router.back();
              }}>
              {props.options.tabBarIcon ? (
                props.options.tabBarIcon({ focused: true, color: '#e2e8f0', size: 20 })
              ) : (
                <Ionicons name="chevron-back-outline" color="#e2e8f0" size={20} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/')}
              className="flex w-full flex-1 items-center justify-center">
              <Image
                source={require('../../assets/images/logotype_header.svg')}
                style={{ height: 23, width: 119.21 }}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setOpenSearch(true)}>
              <Ionicons name="search" color="#e2e8f0" size={20} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

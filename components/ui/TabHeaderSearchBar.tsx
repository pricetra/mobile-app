import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleProp, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';

export type TabHeaderSearchBarProps = {
  onBackPressed: () => void;
  logoHeight: number;
  padding: number;
  iconStyles: StyleProp<ViewStyle>;
  iconColor: string;
  iconSize: number;
  updateSearch: (text: string | null) => void;
  searchText?: string | null;
};

export default function TabHeaderSearchBar({
  onBackPressed,
  iconStyles,
  iconColor,
  logoHeight,
  iconSize,
  padding,
  updateSearch,
  searchText,
}: TabHeaderSearchBarProps) {
  const [text, setText] = useState(searchText ?? '');
  useEffect(() => {
    setText(searchText ?? '');
  }, [searchText]);

  return (
    <>
      <TouchableOpacity onPress={onBackPressed} style={iconStyles}>
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
        }}
        className="flex-1 placeholder:color-slate-400"
        onEndEditing={() => updateSearch(text)}
        onChangeText={setText}
        value={text}
        inputMode="search"
        returnKeyType="search"
      />

      <View className="flex flex-row items-center justify-end gap-5 pr-5">
        {text.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setText('');
              if (searchText !== '') updateSearch(null);
            }}>
            <Feather name="x-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}

        {/* <TouchableOpacity
          onPress={() => {
            updateSearch(text);
            Keyboard.dismiss();
          }}
          className="flex items-center justify-center rounded-full bg-pricetraGreenHeavyDark p-2.5">
          <Ionicons name="search" size={17} color="white" />
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/(scan)', { relativeToDirectory: false })}
          className="flex items-center justify-center rounded-full bg-gray-100 p-2.5">
          <MaterialCommunityIcons name="barcode-scan" size={17} color="black" />
        </TouchableOpacity>
      </View>
    </>
  );
}

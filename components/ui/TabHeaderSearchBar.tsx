import { Ionicons } from '@expo/vector-icons';
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
          paddingRight: padding,
          marginRight: padding,
        }}
        className="flex-1 placeholder:color-slate-400"
        onEndEditing={() => updateSearch(text)}
        onChangeText={setText}
        value={text}
        inputMode="search"
      />

      {text.length > 0 && (
        <View className="flex flex-row items-center justify-end gap-2 pr-5">
          {/* <TouchableOpacity
            onPress={() => {
              setText('');
              updateSearch(null);
            }}>
            <Feather name="x-circle" size={20} color="#999" />
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() => {
              updateSearch(text);
            }}
            className="flex size-[30px] items-center justify-center rounded-full bg-pricetraGreenHeavyDark">
            <Ionicons name="search" size={17} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

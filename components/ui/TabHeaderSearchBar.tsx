import { Ionicons } from '@expo/vector-icons';
import { StyleProp, TextInput, TouchableOpacity, ViewStyle } from 'react-native';

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
        clearButtonMode="while-editing"
        className="placeholder:color-slate-400"
        onChangeText={updateSearch}
        value={searchText ?? ''}
      />
    </>
  );
}

import { StyleProp, View, ViewStyle } from 'react-native';
import {
  AutocompleteDropdown,
  IAutocompleteDropdownProps,
} from 'react-native-autocomplete-dropdown';

import Separator from '@/components/ui/Separator';
import Text from '@/components/ui/Text';

export type ComboboxItemProps = {
  value: string;
};

export function ComboboxItem({ value }: ComboboxItemProps) {
  return (
    <View className="flex w-full flex-row items-center px-4 py-3">
      <Text className="text-base text-black">{value}</Text>
    </View>
  );
}

export interface ComboboxProps extends IAutocompleteDropdownProps {
  inputContainerStylesExtras?: ViewStyle;
}

export default function Combobox({
  textInputProps,
  inputContainerStylesExtras,
  ...props
}: ComboboxProps) {
  return (
    <AutocompleteDropdown
      {...props}
      direction="down"
      suggestionsListContainerStyle={{
        backgroundColor: 'white',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 6,
        top: 5,
        left: 0,
        boxShadow: '0 7px 6px 0px rgba(0,0,0,0.1)',
        maxHeight: 300,
        overflow: 'scroll',
      }}
      renderItem={(item) => <ComboboxItem value={item.title ?? ''} />}
      ItemSeparatorComponent={() => <Separator />}
      inputContainerStyle={{
        backgroundColor: 'white',
        borderRadius: 6,
        borderColor: '#d1d5db',
        borderWidth: 1,
        margin: 0,
        padding: 0,
        ...inputContainerStylesExtras,
      }}
      textInputProps={{
        ...textInputProps,
        style: {
          color: 'black',
        },
      }}
      ref={null}
    />
  );
}

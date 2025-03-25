import { View } from 'react-native';
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

export default function Combobox({ textInputProps, ...props }: IAutocompleteDropdownProps) {
  return (
    <AutocompleteDropdown
      {...props}
      direction="down"
      suggestionsListContainerStyle={{
        backgroundColor: 'white',
        borderRadius: 6,
        top: 25,
        right: 25,
        boxShadow: '0px 3px 20px 0px rgba(0,0,0,0.2)',
      }}
      renderItem={(item) => <ComboboxItem value={item.title ?? ''} />}
      ItemSeparatorComponent={() => <Separator />}
      inputContainerStyle={{
        backgroundColor: 'white',
        borderRadius: 6,
        borderColor: '#d1d5db',
        borderWidth: 1,
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

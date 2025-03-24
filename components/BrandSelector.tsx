import { Dispatch, SetStateAction, useState } from 'react';
import { Platform, View } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

import Text from '@/components/ui/Text';
import { Brand } from '@/graphql/types/graphql';

export type BrandSelectorProps = {
  value: string;
  setValue: (value: string) => void;
  editable: boolean;
  brandsLoading: boolean;
  brands: Brand[];
  setBrands: Dispatch<SetStateAction<Brand[] | undefined>>;
};

export default function BrandSelector({
  value,
  brandsLoading,
  editable,
  brands,
  setBrands,
  setValue,
}: BrandSelectorProps) {
  const [brandInputRaw, setBrandInputRaw] = useState<string>(value ?? '');
  const [adding, setAdding] = useState(false);

  function addNewBrand(brand: string) {
    if (!brands) return;
    setBrands([...brands, { brand, products: 0 }]);
  }

  return (
    <AutocompleteDropdown
      editable={editable}
      loading={brandsLoading || adding}
      direction={Platform.select({ ios: 'down' })}
      showClear
      clearOnFocus={false}
      closeOnSubmit
      debounce={300}
      matchFrom="start"
      initialValue={value}
      dataSet={brands.map(({ brand }) => ({
        id: brand,
        title: brand,
      }))}
      onSelectItem={(data) => {
        setValue(data?.title ?? '');
      }}
      onSubmit={() => {
        if (!brands?.find((b) => b.brand === brandInputRaw)) {
          addNewBrand(brandInputRaw);
        }
        setValue(brandInputRaw);
      }}
      suggestionsListContainerStyle={{
        backgroundColor: 'white',
        borderRadius: 6,
        top: 25,
        right: 25,
        boxShadow: '0px 3px 20px 0px rgba(0,0,0,0.2)',
      }}
      renderItem={(item) => <Text className="px-5 py-3 color-black">{item.title}</Text>}
      ItemSeparatorComponent={() => <View className="h-[1px] w-full bg-gray-100" />}
      inputContainerStyle={{
        backgroundColor: 'white',
        borderRadius: 6,
        borderColor: '#d1d5db',
        borderWidth: 1,
      }}
      textInputProps={{
        placeholder: 'Brand',
        autoCorrect: false,
        autoCapitalize: 'words',
        style: {
          color: 'black',
        },
        onChange: (e) => setBrandInputRaw(e.nativeEvent.text.trim()),
      }}
      EmptyResultComponent={
        <Text
          className="px-5 py-3 color-black"
          onPress={() => {
            addNewBrand(brandInputRaw);
            setAdding(true);
            setTimeout(() => {
              setValue(brandInputRaw);
              setAdding(false);
            }, 500);
          }}>
          Add "{brandInputRaw}"
        </Text>
      }
    />
  );
}

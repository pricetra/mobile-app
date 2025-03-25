import { Dispatch, SetStateAction, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import Combobox, { ComboboxItem } from '@/components/ui/Combobox';
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
    <Combobox
      editable={editable}
      loading={brandsLoading || adding}
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
      textInputProps={{
        placeholder: 'Brand',
        autoCorrect: false,
        autoCapitalize: 'words',
        onChange: (e) => setBrandInputRaw(e.nativeEvent.text.trim()),
      }}
      EmptyResultComponent={
        <TouchableOpacity
          onPress={() => {
            addNewBrand(brandInputRaw);
            setAdding(true);
            setTimeout(() => {
              setValue(brandInputRaw);
              setAdding(false);
            }, 500);
          }}>
          <ComboboxItem value={`Add "${brandInputRaw}"`} />
        </TouchableOpacity>
      }
    />
  );
}

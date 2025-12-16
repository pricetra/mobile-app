import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import Combobox, { ComboboxItem } from '@/components/ui/Combobox';
import { Brand } from 'graphql-utils';

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

  useEffect(() => {
    if (brandsLoading) return;
    if (!brands.find((b) => b.brand === value)) addNewBrand(value);
    setBrandInputRaw(value);
  }, [value, brands, brandsLoading]);

  function addNewBrand(brand: string) {
    if (!brands) return;
    setBrands([...brands, { brand: brand?.trim(), products: 0 }]);
  }

  return (
    <Combobox
      editable={editable}
      loading={brandsLoading || adding}
      showClear={false}
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
        const selectedBrandName = data?.title ?? '';
        setValue(selectedBrandName);
        setBrandInputRaw(selectedBrandName);
      }}
      onSubmit={() => {
        const foundBrand = brands?.find((b) => b.brand === brandInputRaw);
        if (!foundBrand) {
          addNewBrand(brandInputRaw);
        }
        setValue(brandInputRaw);
      }}
      textInputProps={{
        placeholder: 'Brand',
        autoCorrect: false,
        autoCapitalize: 'words',
        onChange: (e) => setBrandInputRaw(e.nativeEvent.text),
        value: brandInputRaw,
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

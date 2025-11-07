import { useQuery } from '@apollo/client';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';

import Input from './Input';

import { AllBrandsDocument, Brand } from '@/graphql/types/graphql';

export default function FilterBrandsModal({
  value,
  onSubmit,
}: {
  value?: string;
  onClose: () => void;
  onSubmit: (selectedBrand: string) => void;
}) {
  const [search, setSearch] = useState(value ?? '');
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>();
  const { data, loading } = useQuery(AllBrandsDocument, {
    fetchPolicy: 'no-cache',
    variables: {
      joinStock: true,
    },
  });

  useEffect(() => {
    if (!data) return;
    setFilteredBrands([...data.allBrands]);
  }, [data]);

  const debouncedSearch = useCallback(
    _.debounce((search: string) => {
      setFilteredBrands(
        data?.allBrands.filter(({ brand }) => brand.toLowerCase().includes(search.toLowerCase()))
      );
    }, 100),
    [search]
  );

  useEffect(() => {
    debouncedSearch(search);
  }, [search]);

  return (
    <View>
      <Input
        onChangeText={setSearch}
        value={search}
        keyboardType="ascii-capable"
        inputMode="search"
        placeholder="Search Brands..."
      />

      <View className="mt-5">
        {loading && (
          <View className="flex flex-row items-center justify-center px-5 py-7">
            <ActivityIndicator color="black" />
          </View>
        )}

        {filteredBrands && (
          <View>
            {filteredBrands.length === 0 ? (
              <View className="flex flex-row items-center justify-center px-5 py-7">
                <Text className="text-center text-gray-500">No brands found</Text>
              </View>
            ) : (
              <>
                {filteredBrands.map(({ brand }, i) => (
                  <View className="border-b border-gray-200" key={`brand-${brand}-${i}`}>
                    <TouchableOpacity onPress={() => onSubmit(brand)} className="px-5 py-4">
                      <Text className="text-xl font-semibold">{brand}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        <View style={{height: 200}} />
      </View>
    </View>
  );
}

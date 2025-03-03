import { useQuery } from '@apollo/client';
import { View, Text, ScrollView } from 'react-native';

import { GetAllCountriesDocument } from '@/graphql/types/graphql';

export default function HomeScreen() {
  const { data: countryData, error, loading } = useQuery(GetAllCountriesDocument);

  return (
    <ScrollView>
      <View className="p-5 pb-24">
        {error && <Text className="text-center text-red-400">{error.message}</Text>}
        {loading && <Text className="text-center">Loading</Text>}

        {countryData?.getAllCountries?.map(({ name }) => <Text>{name}</Text>)}
      </View>
    </ScrollView>
  );
}

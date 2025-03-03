import { useQuery } from '@apollo/client';
import { Stack } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';

import { GetAllCountriesDocument } from '@/graphql/types/graphql';

export default function HomeScreen() {
  const { data: countryData, error, loading } = useQuery(GetAllCountriesDocument);

  return (
    <ScrollView>
      <View className="pb-20 pt-5">
        <Stack.Screen options={{ title: 'Oops!' }} />

        <View className="h-10 w-10 bg-blue-500" />

        <Text className="mb-10 text-3xl font-bold">Home</Text>

        {error && <Text className="text-center text-red-400">{error.message}</Text>}
        {loading && <Text className="text-center">Loading</Text>}

        {countryData?.getAllCountries?.map(({ name }) => <Text>{name}</Text>)}
      </View>
    </ScrollView>
  );
}

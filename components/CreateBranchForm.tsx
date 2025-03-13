import axios from 'axios';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Input } from './ui/Input';

import Button from '@/components/ui/Button';
import { mapsApiClient } from '@/lib/maps-api';

export default function CreateBranchForm() {
  const [mapsSearch, setMapsSearch] = useState('');

  function search() {
    const key = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
    mapsApiClient
      .placeAutocomplete({
        params: {
          input: mapsSearch,
          // query: mapsSearch,
          key,
        },
      })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }

  return (
    <View className="flex flex-col gap-6">
      <Input
        placeholder="Search locations"
        onChangeText={setMapsSearch}
        value={mapsSearch}
        autoCorrect
        autoFocus
      />

      <Button onPress={search}>Search</Button>
    </View>
  );
}

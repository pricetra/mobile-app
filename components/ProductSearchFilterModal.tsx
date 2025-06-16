import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useState } from 'react';
import { TouchableOpacity, View, Text, Alert, ActivityIndicator } from 'react-native';

import Input from './ui/Input';

import useCurrentLocation from '@/hooks/useCurrentLocation';

export type SearchFilterReturnType = {
  location?: Location.LocationGeocodedLocation;
  radius?: number;
};

export type ProductSearchFilterModalProps = {
  onSubmit: (res: SearchFilterReturnType) => void;
};

export default function ProductSearchFilterModal({ onSubmit }: ProductSearchFilterModalProps) {
  const [address, setAddress] = useState<string>();
  const [locating, setLocating] = useState(false);
  const [radius, setRadius] = useState<string>();
  const { getCurrentGeocodeAddress } = useCurrentLocation();
  const [submitting, setSubmitting] = useState(false);

  return (
    <View className="flex flex-col gap-7">
      <View className="flex flex-col gap-2">
        <Input
          placeholder="Zip Code or Full Address..."
          value={address}
          onChangeText={setAddress}
          label="Address"
        />
        <TouchableOpacity
          onPress={() => {
            setLocating(true);
            getCurrentGeocodeAddress({})
              .then((data) => {
                if (data.length === 0)
                  return Alert.alert(
                    'Invalid address',
                    'Your current location returned an invalid response'
                  );
                let formattedAddress = data[0].formattedAddress;
                if (!formattedAddress) {
                  formattedAddress = `${data[0].name}, ${data[0].city}, ${data[0].region} ${data[0].postalCode}`;
                }
                setAddress(formattedAddress ?? undefined);
              })
              .finally(() => {
                setLocating(false);
              });
          }}
          disabled={locating}
          className="flex flex-row items-center gap-2">
          {locating ? (
            <>
              <ActivityIndicator size={15} color="#396a12" />
              <Text className="text-sm font-semibold text-pricetraGreenHeavyDark">Locating...</Text>
            </>
          ) : (
            <>
              <MaterialIcons name="my-location" size={15} color="#396a12" />
              <Text className="text-sm font-semibold text-pricetraGreenHeavyDark">
                Use Current Location
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Input
        placeholder="Search radius (Miles)"
        keyboardType="decimal-pad"
        value={radius}
        onChangeText={setRadius}
        label="Search Radius"
      />

      <TouchableOpacity
        className="mt-5 flex flex-1 flex-row items-center justify-center gap-5 rounded-lg bg-pricetraGreenHeavyDark px-7 py-3"
        onPress={async () => {
          setSubmitting(true);
          const res = {} as SearchFilterReturnType;
          if (address) {
            const locations = await Location.geocodeAsync(address);
            if (locations.length > 0) res.location = locations[0];
          }

          if (radius) {
            try {
              res.radius = parseInt(radius, 10);
            } catch {
              res.radius = 5;
            }
          }

          onSubmit(res);
          setSubmitting(false);
        }}>
        {submitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-lg font-bold color-white">Apply Filters</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

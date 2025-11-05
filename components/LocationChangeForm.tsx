import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useState } from 'react';
import { TouchableOpacity, View, Text, Alert, ActivityIndicator } from 'react-native';

import Btn from './ui/Btn';
import Input from './ui/Input';

import useLocationService from '@/hooks/useLocationService';

export type LocationChangeReturnType = {
  address?: string;
  location?: Location.LocationGeocodedLocation;
  radius?: number;
};

export type LocationChangeFormProps = {
  addressInit?: string;
  radiusInit?: string;
  onSubmit: (res: LocationChangeReturnType) => void;
  onCloseModal: () => void;
};

export default function LocationChangeForm({
  addressInit,
  radiusInit,
  onSubmit,
  onCloseModal,
}: LocationChangeFormProps) {
  const [address, setAddress] = useState(addressInit);
  const [locating, setLocating] = useState(false);
  const [radius, setRadius] = useState(radiusInit);
  const { getCurrentGeocodeAddress } = useLocationService();
  const [submitting, setSubmitting] = useState(false);

  async function submitForm() {
    setSubmitting(true);
    const res = {} as LocationChangeReturnType;
    if (address) {
      const locations = await Location.geocodeAsync(address);
      if (locations.length > 0) {
        res.address = address;
        res.location = locations[0];
      }
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
  }

  function currentAddress() {
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
  }

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
          onPress={currentAddress}
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
        label="Search Radius (mi)"
      />

      <View className="mt-5 flex flex-row items-center gap-3">
        <Btn
          onPress={onCloseModal}
          disabled={submitting}
          text="Cancel"
          size="md"
          bgColor="bg-gray-100"
          color="text-gray-700"
        />

        <View className="flex-1">
          <Btn onPress={submitForm} loading={submitting} size="md" text="Set Location" />
        </View>
      </View>

      <View style={{ height: 30 }} />
    </View>
  );
}

import { useLazyQuery, useMutation } from '@apollo/client/react';
import {
  BarcodeScanDocument,
  BarcodeScanQuery,
  ExtractAndCreateProductDocument,
  ExtractAndCreateProductMutation,
  LocationInput,
  UserRole,
} from 'graphql-utils';
import { Alert, AlertButton } from 'react-native';

import useLocationService from './useLocationService';

import { useAuth } from '@/context/UserContext';
import { selectImageForProductExtraction } from '@/lib/files';
import { isRoleAuthorized } from '@/lib/roles';

export default function useAddProductPrompt() {
  const { user } = useAuth();
  const [barcodeScan, { loading: processingBarcode }] = useLazyQuery(BarcodeScanDocument);
  const [extractProductFields, { loading: extractingProduct }] = useMutation(
    ExtractAndCreateProductDocument
  );
  const { getCurrentLocation } = useLocationService();

  async function handleBarcodeScan(
    barcode: string,
    {
      onSuccess,
      onError,
    }: {
      onSuccess: (data: BarcodeScanQuery) => void;
      onError: (err: Error) => void;
    }
  ) {
    const { coords } = await getCurrentLocation({});
    let locationInput: LocationInput | undefined = undefined;
    if (coords) {
      locationInput = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        radiusMeters: 6000, // ~3.7 miles
      };
    }

    barcodeScan({
      variables: {
        barcode,
        location: locationInput,
      },
    }).then(({ data }) => {
      if (!data) {
        onError(new Error('barcode was not found'));
        return;
      }
      onSuccess(data);
    });
  }

  async function handleExtractionImage(
    barcode: string,
    {
      onSuccess,
      onError,
      onFinally,
    }: {
      onSuccess: (data: ExtractAndCreateProductMutation) => void;
      onError: (err: Error) => void;
      onFinally?: () => void;
    }
  ) {
    const pic = await selectImageForProductExtraction(true, 0);
    if (!pic) {
      onError(new Error('could not select image'));
      return;
    }

    extractProductFields({
      variables: { barcode: barcode.replaceAll('*', ''), base64Image: pic.base64 },
    })
      .then(async ({ data, errors }) => {
        if (!data) {
          const err = errors?.at(0);
          Alert.alert('Error extracting product data', err?.message);
          onError(new Error(err?.message));
          return;
        }
        onSuccess(data);
      })
      .finally(onFinally);
  }

  function extractProductFromImagePrompt({
    onCancel,
    onAddManually,
    onTakePicture,
  }: {
    onCancel: () => void;
    onAddManually: () => void;
    onTakePicture: () => void;
  }) {
    const alertButtons: AlertButton[] = [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: onCancel,
      },
    ];
    if (isRoleAuthorized(UserRole.Contributor, user.role)) {
      alertButtons.push({
        text: 'Add Manually',
        style: 'default',
        onPress: onAddManually,
      });
    }
    alertButtons.push({
      text: 'Take Picture',
      style: 'default',
      isPreferred: true,
      onPress: onTakePicture,
    });
    return alertButtons;
  }

  return {
    handleBarcodeScan,
    handleExtractionImage,
    extractProductFromImagePrompt,
    processingBarcode,
    extractingProduct,
  };
}

import * as ImagePicker from 'expo-image-picker';

import { buildBase64ImageString } from './strings';

export const CLOUDINARY_UPLOAD_BASE = `https://res.cloudinary.com/${process.env.EXPO_PUBLIC_CLOUD_NAME}/image/upload`;

export function createCloudinaryUrl(public_id: string, width?: number, height?: number) {
  let url = CLOUDINARY_UPLOAD_BASE;
  const transformations: string[] = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (transformations.length > 0) url += `/${transformations.join(',')}`;
  url += `/${public_id}`;
  return url;
}

export type ExtractionImageSelectionType = {
  imageUri: string;
  base64: string;
  base64EncodingOnly?: string;
};

export async function selectImageForProductExtraction(
  useCamera: boolean = false,
  quality: number = 1
): Promise<ExtractionImageSelectionType | undefined> {
  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality,
    base64: true,
    allowsMultipleSelection: false,
    cameraType: ImagePicker.CameraType.back,
  };
  const result = await (useCamera
    ? ImagePicker.launchCameraAsync(options)
    : ImagePicker.launchImageLibraryAsync(options));

  if (result.canceled || result.assets.length === 0) return undefined;

  const picture = result.assets.at(0);
  if (!picture || !picture.base64 || !picture.uri) return undefined;

  return {
    imageUri: picture.uri,
    base64: buildBase64ImageString(picture),
    base64EncodingOnly: picture.base64,
  };
}

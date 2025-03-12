import { Cloudinary } from '@cloudinary/url-gen';
import { upload } from 'cloudinary-react-native';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params';

export async function getFileBlobFromUri(uri: string) {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
}

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.EXPO_PUBLIC_CLOUD_NAME,
    apiKey: process.env.EXPO_PUBLIC_CLOUD_API_KEY,
    apiSecret: process.env.EXPO_PUBLIC_CLOUD_API_SECRET,
  },
  url: {
    secure: true,
  },
});

export type UploadToCloudinaryProps = {
  file: any;
  public_id: string;
  tags: string[];
  onSuccess: (res: UploadApiResponse) => void;
  onError: (err: UploadApiErrorResponse) => void;
};

export function uploadToCloudinary({
  file,
  public_id,
  tags,
  onSuccess,
  onError,
}: UploadToCloudinaryProps) {
  upload(cloudinary, {
    file,
    options: {
      public_id,
      tags,
    },
    callback: async (err, res) => {
      if (err) return onError(err);
      if (res) return onSuccess(res);
    },
  });
}

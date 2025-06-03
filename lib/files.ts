import { Cloudinary } from '@cloudinary/url-gen';
import { upload } from 'cloudinary-react-native';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params';

import { GoogleVisionResponse } from '@/types/google-vision-api';

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
  onFinally?: () => void;
};

export function uploadToCloudinary({
  file,
  public_id,
  tags,
  onSuccess,
  onError,
  onFinally,
}: UploadToCloudinaryProps) {
  upload(cloudinary, {
    file,
    options: {
      public_id,
      tags,
    },
    callback: async (err, res) => {
      if (err) onError(err);
      else if (res) onSuccess(res);

      if (onFinally) onFinally();
    },
  });
}

export const CLOUDINARY_UPLOAD_BASE = 'https://res.cloudinary.com/pricetra-cdn/image/upload';

export function createCloudinaryUrl(public_id: string, width?: number, height?: number) {
  let url = CLOUDINARY_UPLOAD_BASE;
  const transformations: string[] = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (transformations.length > 0) url += `/${transformations.join(',')}`;
  url += `/${public_id}`;
  return url;
}

const GOOGLE_VISION_API_URL = 'https://vision.googleapis.com/v1';

export async function callGoogleVisionAsync(base64: string) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY;
  const body = {
    requests: [
      {
        image: {
          content: base64,
        },
        features: [{ type: 'TEXT_DETECTION' }, { type: 'LOGO_DETECTION' }],
      },
    ],
  };
  const res = await fetch(`${GOOGLE_VISION_API_URL}/images:annotate?key=${apiKey}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return (await res.json()) as GoogleVisionResponse;
}

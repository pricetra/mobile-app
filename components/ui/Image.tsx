import { useState } from 'react';
import { Image as NativeImage } from 'react-native';

export type ImageProps = {
  src: string;
  className?: string;
};

export default function Image({ src, className }: ImageProps) {
  const loadingImage = require('../../assets/images/loading_img.jpg');
  const noImage = require('../../assets/images/no_img.jpg');
  const [image, setImage] = useState(src);

  return (
    <NativeImage
      defaultSource={loadingImage}
      onError={() => setImage('')}
      source={
        image !== ''
          ? {
              uri: image,
            }
          : noImage
      }
      className={className}
    />
  );
}

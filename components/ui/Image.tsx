import { useEffect, useState } from 'react';
import { ImageStyle, Image as NativeImage, StyleProp } from 'react-native';

export type ImageProps = {
  src: string;
  className?: string;
  onError?: () => void;
  style?: StyleProp<ImageStyle>;
};

export default function Image({ src, className, onError, ...props }: ImageProps) {
  const loadingImage = require('../../assets/images/loading_img.jpg');
  const noImage = require('../../assets/images/no_img.jpg');
  const [image, setImage] = useState(src);

  useEffect(() => {
    setImage(src);
  }, [src]);

  return (
    <NativeImage
      defaultSource={loadingImage}
      onError={() => {
        setImage('');
        if (onError) onError();
      }}
      source={
        image !== ''
          ? {
              uri: image,
            }
          : noImage
      }
      className={className}
      {...props}
    />
  );
}

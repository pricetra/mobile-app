import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';

import BarcodeText from '@/components/ui/BarcodeText';

export type BarcodePreviewProps = {
  scannedCode: string;
};

export default function BarcodePreview({ scannedCode }: BarcodePreviewProps) {
  const [barcode, setBarcode] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (scannedCode && scannedCode === barcode) return;

    setBarcode(scannedCode);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  }, [scannedCode]);

  return (
    <View className="flex items-center justify-center">
      <View className="relative">
        <BarcodeText
          className="rounded-lg bg-white/70 px-5 py-3 text-center text-xl color-black"
          letterSpacing={5}>
          {barcode}
        </BarcodeText>

        {showAlert && (
          <Animated.View className="absolute -left-2 -top-2 z-[2] flex size-5 items-center justify-center">
            <View className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
            <View className="relative inline-flex size-3 rounded-full bg-green-500" />
          </Animated.View>
        )}
      </View>
    </View>
  );
}

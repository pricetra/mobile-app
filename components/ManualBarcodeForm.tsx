import { useState } from 'react';
import { View } from 'react-native';

import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ManualBarcodeForm({ onSubmit }: { onSubmit: (barcode: string) => void }) {
  const [barcode, setBarcode] = useState('');
  return (
    <View className="mb-10 flex gap-10">
      <Input
        placeholder="Ex. 078742370361"
        onChangeText={setBarcode}
        value={barcode}
        autoFocus
        keyboardType="number-pad"
      />

      <Button
        className="mt-5"
        variant="secondary"
        disabled={barcode.trim().length === 0}
        onPress={() => onSubmit(barcode.trim())}>
        Search
      </Button>
    </View>
  );
}

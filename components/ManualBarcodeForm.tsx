import { useEffect, useState } from 'react';
import { View } from 'react-native';

import Button from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import Btn from './ui/Btn';

export default function ManualBarcodeForm({ onSubmit }: { onSubmit: (barcode: string) => void }) {
  const [barcode, setBarcode] = useState('');
  const [exact, setExact] = useState(false);

  useEffect(() => {
    if (!exact) {
      setBarcode((prev) => prev.replaceAll('*', ''));
      return;
    }
    setBarcode((prev) => `*${prev}`);
  }, [exact]);

  return (
    <View className="mb-10 flex gap-10">
      <Input
        placeholder="Ex. 078742370361"
        onChangeText={setBarcode}
        value={barcode}
        autoFocus
        keyboardType="number-pad"
      />

      <Checkbox label="Exact Match" checked={exact} onCheckedChange={setExact} />

      <Btn
        disabled={barcode.trim().length < 4}
        onPress={() => onSubmit(barcode.trim())}
        text="Search"
        className="mt-5"
      />
    </View>
  );
}

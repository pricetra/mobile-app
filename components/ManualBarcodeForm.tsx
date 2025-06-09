import { useEffect, useState } from 'react';
import { View } from 'react-native';

import Button from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';

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

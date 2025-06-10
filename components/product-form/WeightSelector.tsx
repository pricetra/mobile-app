import { useEffect, useState } from 'react';
import { TextInputProps, View } from 'react-native';
import { AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

import Combobox from '@/components/ui/Combobox';
import { Input } from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { defaultMeasurementUnit, measurementUnits } from '@/constants/measurements';

export type WeightSelectorProps = {
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: TextInputProps['onBlur'];
  editable: boolean;
};

function getMeasurement(value: string): { measurement: string; unit: AutocompleteDropdownItem } {
  const parsedValue = value.split(' ');
  if (parsedValue.length < 2) return { measurement: '', unit: defaultMeasurementUnit };

  const measurement = parsedValue.at(0) ?? '';
  const unit = parsedValue.slice(1).join(' ').toLowerCase();

  return { measurement, unit: { id: unit, title: unit } };
}

export default function WeightSelector({ value, onChangeText, editable }: WeightSelectorProps) {
  const parsedValue = getMeasurement(value);
  const [measurement, setMeasurement] = useState<string>(parsedValue.measurement);
  const [unit, setUnit] = useState<AutocompleteDropdownItem>(parsedValue.unit);

  useEffect(() => {
    const { measurement, unit } = getMeasurement(value);
    setMeasurement(measurement);
    setUnit(unit);
  }, [value]);

  useEffect(() => {
    if (!measurement || !unit) return;
    onChangeText(`${measurement} ${unit.id}`);
  }, [measurement, unit]);

  return (
    <>
      <View className="flex flex-1 flex-row items-center justify-center gap-2">
        <Input
          onChangeText={setMeasurement}
          value={measurement}
          label="Weight"
          editable={editable}
          keyboardType="numeric"
          className="flex-1"
          placeholder="Weight"
        />

        <View className="relative">
          <Label className="mb-1">Unit</Label>
          <View className="mt-[-2px]">
            <Combobox
              editable={editable}
              showClear={false}
              initialValue={unit}
              onSelectItem={(i) => setUnit(i ?? { id: 'ml' })}
              dataSet={measurementUnits.map((u) => ({ id: u, title: u }))}
              textInputProps={{
                autoCorrect: false,
              }}
              inputContainerStylesExtras={{
                minWidth: 85,
              }}
            />
          </View>
        </View>
      </View>
    </>
  );
}

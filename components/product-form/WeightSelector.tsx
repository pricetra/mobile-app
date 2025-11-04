import { useEffect, useMemo, useRef, useState } from 'react';
import { TextInputProps, View } from 'react-native';
import { AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

import Combobox from '@/components/ui/Combobox';
import { Input } from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { defaultMeasurementUnit, measurementUnits } from '@/constants/measurements';

export type WeightType = {
  weightValue?: string;
  weightType?: string;
};

export type WeightSelectorProps = {
  value?: string;
  onChangeText: (value: WeightType) => void;
  onBlur?: TextInputProps['onBlur'];
  editable: boolean;
};

function getMeasurement(value?: string): WeightType {
  if (!value) return {};
  const parsedValue = value.split(' ');
  if (parsedValue.length < 2) return { weightType: defaultMeasurementUnit.id };

  const measurement = parsedValue.at(0) ?? '';
  const unit = parsedValue.slice(1).join(' ').toLowerCase();

  return { weightType: unit || defaultMeasurementUnit.id, weightValue: measurement || '' };
}

export default function WeightSelector({ value, onChangeText, editable }: WeightSelectorProps) {
  const [measurement, setMeasurement] = useState<string>('');
  const [unit, setUnit] = useState<AutocompleteDropdownItem>(defaultMeasurementUnit);

  const parsedValue = useMemo(() => getMeasurement(value), [value]);

  const lastEmittedValue = useRef<WeightType>({});

  useEffect(() => {
    // shallow-equality check by fields (avoid object identity compare)
    const sameAsLast =
      lastEmittedValue.current.weightValue === parsedValue.weightValue &&
      lastEmittedValue.current.weightType === parsedValue.weightType;

    if (sameAsLast) return;

    setMeasurement(parsedValue.weightValue ?? '');
    setUnit({
      id: parsedValue.weightType ?? defaultMeasurementUnit.id,
      title: parsedValue.weightType ?? defaultMeasurementUnit.id,
    });
  }, [parsedValue]);

  // emit changes upstream when local inputs change
  useEffect(() => {
    if (measurement === undefined || measurement === null || measurement === '' || !unit?.id) {
      return;
    }

    const newValue: WeightType = {
      weightValue: measurement,
      weightType: unit.id,
    };

    // avoid re-emitting identical shape repeatedly
    const sameAsLast =
      lastEmittedValue.current.weightValue === newValue.weightValue &&
      lastEmittedValue.current.weightType === newValue.weightType;

    if (sameAsLast) return;

    lastEmittedValue.current = newValue;
    onChangeText(newValue);
  }, [measurement, unit, onChangeText]);

  return (
    <View className="flex flex-1 flex-row items-center justify-center gap-2">
      <Input
        onChangeText={setMeasurement}
        value={measurement ?? ''}
        label="Weight"
        editable={editable}
        keyboardType="decimal-pad"
        inputMode="decimal"
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
            onSelectItem={(i) =>
              setUnit(i ?? { id: defaultMeasurementUnit.id, title: defaultMeasurementUnit.id })
            }
            dataSet={measurementUnits.map((u) => ({ id: u, title: u }))}
            textInputProps={{
              autoCorrect: false,
              placeholder: 'Unit',
              value: unit.id,
            }}
            inputContainerStylesExtras={{
              minWidth: 85,
            }}
          />
        </View>
      </View>
    </View>
  );
}

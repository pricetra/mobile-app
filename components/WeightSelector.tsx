import { useEffect, useState } from 'react';
import { TextInputProps, View } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

import { Input } from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Text from '@/components/ui/Text';
import { defaultMeasurementUnit, measurementUnits } from '@/constants/measurements';

export type WeightSelectorProps = {
  value: string;
  onChangeText: (value: string) => void;
  onBlur: TextInputProps['onBlur'];
  editable: boolean;
};

function getMeasurement(value: string): { measurement: string; unit: AutocompleteDropdownItem } {
  const parsedValue = value.split(' ');
  if (parsedValue.length < 2) return { measurement: '', unit: defaultMeasurementUnit };

  const measurement = parsedValue.at(0) ?? '';
  const unit = parsedValue.slice(1).join(' ').toLowerCase();

  return { measurement, unit: { id: unit, title: unit } };
}

export default function WeightSelector({
  value,
  onChangeText,
  onBlur,
  editable,
}: WeightSelectorProps) {
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
      <View className="flex flex-1 flex-row gap-2">
        <Input
          onChangeText={setMeasurement}
          value={measurement}
          label="Weight"
          editable={editable}
          keyboardType="numeric"
          className="flex-1"
        />

        <View className="relative">
          <Label className="mb-[1px]">Unit</Label>
          <AutocompleteDropdown
            editable={editable}
            showClear={false}
            initialValue={unit}
            onSelectItem={(i) => setUnit(i ?? { id: 'ml' })}
            dataSet={measurementUnits.map((u) => ({ id: u, title: u }))}
            suggestionsListContainerStyle={{
              backgroundColor: 'white',
              borderRadius: 6,
              top: 25,
              right: 25,
              boxShadow: '0px 3px 20px 0px rgba(0,0,0,0.2)',
              width: 90,
            }}
            renderItem={(item) => <Text className="px-5 py-3 color-black">{item.title}</Text>}
            ItemSeparatorComponent={() => <View className="h-[1px] w-full bg-gray-100" />}
            inputContainerStyle={{
              backgroundColor: 'white',
              borderRadius: 6,
              borderColor: '#d1d5db',
              borderWidth: 1,
              width: 90,
            }}
            textInputProps={{
              autoCorrect: false,
              style: {
                color: 'black',
              },
            }}
          />
        </View>
      </View>
    </>
  );
}

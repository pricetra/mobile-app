import { PortalHost } from '@rn-primitives/portal';
import * as SelectPrimitive from '@rn-primitives/select';
import { Fragment, useEffect, useState } from 'react';
import { Platform, TextInputProps, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';

import { Input } from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

export type WeightSelectorProps = {
  value: string;
  onChangeText: (value: string) => void;
  onBlur: TextInputProps['onBlur'];
  editable: boolean;
};

const units = [
  'fl oz',
  'oz',
  'lb',
  'g',
  'ml',
  'kg',
  'gal',
  'qt',
  'pt',
  'cup',
  'can',
  'pkg',
  'slice',
  'pc',
  'stick',
  'clove',
  'bag',
  'bunch',
];

const defaultUnit = { value: 'oz', label: 'oz' };

const CUSTOM_PORTAL_HOST_NAME = 'modal-example';
const WindowOverlay = Platform.OS === 'ios' ? FullWindowOverlay : Fragment;

export default function WeightSelector({
  value,
  onChangeText,
  onBlur,
  editable,
}: WeightSelectorProps) {
  const [measurement, setMeasurement] = useState<string>();
  const [unit, setUnit] = useState<SelectPrimitive.Option>(defaultUnit);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  useEffect(() => {
    const parsedValue = value.split(' ');
    if (parsedValue.length < 2) return;

    const measurement = parsedValue.at(0);
    const unit = parsedValue.slice(1).join(' ').toLowerCase();
    setMeasurement(measurement);
    setUnit({ label: unit, value: unit });
  }, [value]);

  useEffect(() => {
    if (!measurement || !unit) return;
    onChangeText(`${measurement} ${unit?.value}`);
  }, [measurement, unit]);

  return (
    <>
      <View className="flex flex-1 flex-row items-center gap-2">
        <Input
          onChangeText={setMeasurement}
          value={measurement}
          label="Weight"
          editable={editable}
          keyboardType="numeric"
          className="flex-1"
        />

        <View className="relative">
          <Label className="mb-1">Unit</Label>

          <Select
            defaultValue={defaultUnit}
            value={unit}
            onValueChange={setUnit}
            className="relative">
            <SelectTrigger>
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent
              insets={contentInsets}
              className="z-50"
              portalHost={CUSTOM_PORTAL_HOST_NAME}>
              <SelectGroup>
                {units.map((v) => (
                  <SelectItem label={v} value={v} key={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>
      </View>

      <WindowOverlay>
        {/* #7 */}
        <PortalHost name={CUSTOM_PORTAL_HOST_NAME} />
      </WindowOverlay>
    </>
  );
}

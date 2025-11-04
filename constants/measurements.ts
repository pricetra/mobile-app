import { AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

export const measurementUnits = [
  'fl oz',
  'oz',
  'lb',
  'g',
  'l',
  'ml',
  'kg',
  'gal',
  'qt',
  'pt',
  'cup',
];

export const defaultMeasurementUnit: AutocompleteDropdownItem = {
  id: measurementUnits[1],
  title: measurementUnits[1],
};

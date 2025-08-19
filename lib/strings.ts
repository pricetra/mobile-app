import * as ImagePicker from 'expo-image-picker';

export function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function postgresArrayToArray(rawArray: string): string[] {
  return rawArray.substring(1, rawArray.length - 1).split(',');
}

export function postgresArrayToNumericArray(rawArray: string): number[] {
  const strArray = postgresArrayToArray(rawArray);
  return strArray.map((v) => parseInt(v, 10));
}

export function enumToNormalizedString(e: any): string {
  return titleCase(e.toString().split('_').join(' '));
}

export function currencyFormat(v: number): string {
  return (
    '$' +
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v)
  );
}

export function buildBase64ImageString(picture: ImagePicker.ImagePickerAsset): string {
  return `data:${picture.mimeType};base64,${picture.base64}`;
}

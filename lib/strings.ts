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

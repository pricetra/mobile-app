import { AuthDeviceType } from 'graphql-utils';
import { Platform } from 'react-native';

export function getAuthDeviceTypeFromPlatform(): AuthDeviceType {
  switch (Platform.OS) {
    case 'android':
      return AuthDeviceType.Android;
    case 'ios':
      return AuthDeviceType.Ios;
    case 'web':
      return AuthDeviceType.Web;
    case 'macos':
      return AuthDeviceType.Other;
    case 'windows':
      return AuthDeviceType.Other;
    default:
      return AuthDeviceType.Unknown;
  }
}

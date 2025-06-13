const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  name: IS_DEV ? 'Pricetra (Dev)' : 'Pricetra',
  slug: 'pricetra',
  version: '1.0.8',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'pricetra',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV ? 'com.pricetra.mobileApp.dev' : 'com.pricetra.mobileApp',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    permissions: [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
    ],
    package: IS_DEV ? 'com.pricetra.mobileApp.dev' : 'com.pricetra.mobileApp',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Allow Pricetra to access your camera',
        microphonePermission: 'Allow Pricetra to access your microphone',
        recordAudioAndroid: true,
      },
    ],
    'expo-secure-store',
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Allow Pricetra to use your location.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '5e02d7a0-8d71-485d-aec0-90390344e35a',
    },
  },
  owner: 'pricetra',
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: 'https://u.expo.dev/5e02d7a0-8d71-485d-aec0-90390344e35a',
  },
};

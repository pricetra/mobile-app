import { AuthError } from 'expo-auth-session/build/Errors';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect, useState } from 'react';

const CLIENT_ID_DEV = '625150659652-kuui6jjol468n3s63fvfqgbavj2v673h.apps.googleusercontent.com';
const CLIENT_ID_PROD = '625150659652-kuekq6e382kgs0b99eo2519dk25tuc55.apps.googleusercontent.com';
const CLIENT_ID = process.env.NODE_ENV !== 'production' ? CLIENT_ID_DEV : CLIENT_ID_PROD;

export function useGoogleAuth() {
  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
  });
  const [accessToken, setAccessToken] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError>();

  useEffect(() => {
    if (!response) return;

    if (response.type === 'success') {
      const { access_token } = response.params;
      setAccessToken(access_token);
    }
    if (response.type === 'error') {
      setError(response.error ?? undefined);
    }
    setLoading(false);
  }, [response]);

  return {
    signIn: () => {
      setLoading(true);
      promptAsync();
    },
    accessToken,
    loading,
    error,
  };
}

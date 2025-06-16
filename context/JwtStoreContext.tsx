import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useEffect, useState } from 'react';

export const JWT_KEY = 'JWT';

export type JwtStore = {
  jwt?: string;
  loading: boolean;
  updateJwt: (newJwt: string) => Promise<void>;
  removeJwt: () => Promise<void>;
};

export const JwtStoreContext = createContext({} as JwtStore);

export type JwtStoreProviderProps = {
  children: ReactNode;
};

export default function JwtStoreProvider({ children }: JwtStoreProviderProps) {
  const [loading, setLoading] = useState(true);
  const [jwt, setJwt] = useState<string>();

  useEffect(() => {
    SecureStore.getItemAsync(JWT_KEY)
      .then((val) => {
        setJwt(val ?? undefined);
      })
      .finally(() => setLoading(false));
  }, []);

  async function updateJwt(newJwt: string) {
    await SecureStore.setItemAsync(JWT_KEY, newJwt);
    return setJwt(newJwt);
  }

  async function removeJwt() {
    await SecureStore.deleteItemAsync(JWT_KEY);
    return setJwt(undefined);
  }

  return (
    <JwtStoreContext.Provider
      value={{
        jwt,
        loading,
        updateJwt,
        removeJwt,
      }}>
      {children}
    </JwtStoreContext.Provider>
  );
}

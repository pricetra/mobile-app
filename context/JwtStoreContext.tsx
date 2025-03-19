import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useEffect, useState } from 'react';

import { JWT_KEY } from './UserContext';

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

  function updateJwt(newJwt: string) {
    return SecureStore.setItemAsync(JWT_KEY, newJwt).then(() => setJwt(newJwt));
  }

  function removeJwt() {
    return SecureStore.deleteItemAsync(JWT_KEY).then(() => setJwt(undefined));
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

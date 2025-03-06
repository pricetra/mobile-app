import { useQuery } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode } from 'react';
import { View } from 'react-native';

import { MeDocument, User } from '@/graphql/types/graphql';

export const JWT_KEY = 'JWT';

export type UserContextType = {
  user: User;
  token: string;
  logout: () => void;
};

export const UserAuthContext = createContext<UserContextType>({} as UserContextType);

type UserContextProviderProps = {
  children: ReactNode;
  jwt: string;
};

export function UserContextProvider({ children, jwt }: UserContextProviderProps) {
  const router = useRouter();
  const {
    data: userData,
    loading: userDataLoading,
    error: userError,
  } = useQuery(MeDocument, {
    context: { headers: { authorization: `Bearer ${jwt}` } },
  });

  function removeStoredJwtAndRedirect() {
    SecureStore.deleteItemAsync(JWT_KEY).finally(() => {
      router.replace('/login');
    });
  }

  if (userDataLoading)
    return (
      <View className="flex h-screen w-screen items-center justify-center bg-white p-10">
        <AntDesign
          name="loading1"
          className="size-[50px] animate-spin text-center"
          color="#374151"
          size={50}
        />
      </View>
    );

  if (userError) {
    removeStoredJwtAndRedirect();
    return <></>;
  }

  if (!userData) throw new Error('could not load user data');

  return (
    <UserAuthContext.Provider
      value={
        {
          token: jwt,
          user: userData.me,
          logout: () => {
            removeStoredJwtAndRedirect();
          },
        } as UserContextType
      }>
      {children}
    </UserAuthContext.Provider>
  );
}

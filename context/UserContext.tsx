import { useMutation, useQuery } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';

import { JwtStoreContext } from './JwtStoreContext';

import { LogoutDocument, MeDocument, User } from '@/graphql/types/graphql';

export type UserContextType = {
  user: User;
  token: string;
  updateUser: (updatedUser: User) => void;
  logout: () => void;
};

export const UserAuthContext = createContext<UserContextType>({} as UserContextType);

type UserContextProviderProps = {
  children: ReactNode;
  jwt: string;
};

export function UserContextProvider({ children, jwt }: UserContextProviderProps) {
  const { removeJwt } = useContext(JwtStoreContext);
  const [user, setUser] = useState<User>();
  const router = useRouter();
  const {
    data: userData,
    loading: userDataLoading,
    error: userError,
  } = useQuery(MeDocument, {
    context: { headers: { authorization: `Bearer ${jwt}` } },
  });
  const [logout] = useMutation(LogoutDocument);

  useEffect(() => {
    if (!userData) return;
    setUser(userData.me);
  }, [userData]);

  function removeStoredJwtAndRedirect() {
    removeJwt().finally(() => {
      router.replace('/login');
    });
  }

  if (userDataLoading)
    return (
      <View className="flex h-screen w-screen items-center justify-center gap-10 bg-white p-10">
        <Image
          source={require('../assets/images/logotype_black_color.svg')}
          style={{ height: 45, width: 190 }}
        />

        <AntDesign
          name="loading1"
          className="mt-10 size-[40px] animate-spin text-center"
          color="black"
          size={40}
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
          user: user ?? userData.me,
          updateUser: (updatedUser) => setUser(updatedUser),
          logout: () => {
            logout().then(({ data, errors }) => {
              if (errors || !data || !data.logout) return;
              removeStoredJwtAndRedirect();
            });
          },
        } as UserContextType
      }>
      {children}
    </UserAuthContext.Provider>
  );
}

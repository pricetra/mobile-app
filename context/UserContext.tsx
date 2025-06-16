import { useLazyQuery, useMutation } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';

import { JwtStoreContext } from './JwtStoreContext';

import {
  GetAllListsDocument,
  List,
  ListType,
  LogoutDocument,
  MeDocument,
  User,
} from '@/graphql/types/graphql';

export type UserListsType = {
  allLists: List[];
  favorites: List;
  watchList: List;
};

export type UserContextType = {
  user: User;
  lists: UserListsType;
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
  const [userLists, setUserLists] = useState<UserListsType>();
  const router = useRouter();
  const [me] = useLazyQuery(MeDocument, {
    fetchPolicy: 'no-cache',
  });
  const [lists] = useLazyQuery(GetAllListsDocument, {
    fetchPolicy: 'no-cache',
  });
  const [logout] = useMutation(LogoutDocument);
  const [loading, setLoading] = useState(true);

  function removeStoredJwtAndRedirect() {
    removeJwt().finally(() => {
      router.replace('/login');
    });
  }

  useEffect(() => {
    if (!jwt) return;

    const ctx = {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    };
    me({
      context: { ...ctx },
    })
      .then(async ({ data: userData, error, errors }) => {
        if (error || errors || !userData) return removeStoredJwtAndRedirect();

        setUser(userData.me as User);
        const { data: listData } = await lists({ context: { ...ctx } });
        return listData;
      })
      .then((listData) => {
        if (!listData) return;

        const allLists = listData.getAllLists as List[];
        setUserLists({
          allLists,
          favorites: allLists.find(({ type }) => type === ListType.Favorites)!,
          watchList: allLists.find(({ type }) => type === ListType.WatchList)!,
        });
      })
      .catch((_e) => removeStoredJwtAndRedirect())
      .finally(() => setLoading(false));
  }, [jwt]);

  if (loading)
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

  if (!user) {
    removeStoredJwtAndRedirect();
    return <></>;
  }

  return (
    <UserAuthContext.Provider
      value={{
        token: jwt,
        user,
        lists: userLists ?? { allLists: [], favorites: {} as List, watchList: {} as List },
        updateUser: (updatedUser) => setUser(updatedUser),
        logout: () => {
          logout().then(({ data, errors }) => {
            if (errors || !data || !data.logout) return;
            removeStoredJwtAndRedirect();
          });
        },
      }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export const useAuth = () => useContext(UserAuthContext);

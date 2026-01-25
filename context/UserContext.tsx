import { useLazyQuery, useMutation } from '@apollo/client';
import { Image } from 'expo-image';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import {
  AuthDeviceType,
  CheckAppVersionDocument,
  GroceryList,
  List,
  ListType,
  LogoutDocument,
  MeDocument,
  MyStoreUserDocument,
  PostAuthUserDataDocument,
  RegisterExpoPushTokenDocument,
  StoreUser,
  User,
} from 'graphql-utils';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, View } from 'react-native';

import { JwtStoreContext } from './JwtStoreContext';

import { version } from '@/package.json';

const MINUTE = 1000 * 60;

export type UserListsType = {
  allLists: List[];
  favorites: List;
  watchList: List;
};

export type GroceryListsType = {
  defaultGroceryList: GroceryList;
  groceryLists: GroceryList[];
};

export type UserContextType = {
  user: User;
  lists: UserListsType;
  allGroceryLists?: GroceryListsType;
  myStoreUsers?: StoreUser[];
  token: string;
  updateUser: (updatedUser: User) => void;
  logout: () => void;
  loggingOut: boolean;
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
  const [allGroceryLists, setAllGroceryLists] = useState<GroceryListsType>();
  const router = useRouter();
  const [checkAppVersion, { data: appVersionCheckData }] = useLazyQuery(CheckAppVersionDocument, {
    fetchPolicy: 'no-cache',
    variables: {
      platform: Platform.OS as AuthDeviceType,
      version,
    },
  });
  const [me, { data: meData, error: meError }] = useLazyQuery(MeDocument, {
    fetchPolicy: 'no-cache',
  });
  const [getPostAuthUserData, { data: postAuthUserData }] = useLazyQuery(PostAuthUserDataDocument, {
    fetchPolicy: 'no-cache',
  });
  const [logout, { loading: loggingOut }] = useMutation(LogoutDocument);
  const [registerExpoPushToken] = useMutation(RegisterExpoPushTokenDocument, {
    refetchQueries: [MeDocument],
    fetchPolicy: 'no-cache',
  });
  const [loading, setLoading] = useState(true);

  const [getMyStoreUsers, { data: myStoreUsersData }] = useLazyQuery(MyStoreUserDocument, {
    fetchPolicy: 'no-cache',
  });
  const [myStoreUsers, setMyStoreUsers] = useState<StoreUser[]>();

  function removeStoredJwtAndRedirect() {
    removeJwt().finally(() => {
      router.replace('/login');
    });
  }

  function fetchAndRegisterExpoPushToken(user: User) {
    Notifications.getExpoPushTokenAsync()
      .then(({ data: expoPushToken }) => {
        if (user.expoPushToken && expoPushToken === user.expoPushToken) return;

        registerExpoPushToken({
          variables: { expoPushToken },
        });
      })
      .catch((err: any) => Alert.alert('Could not generate Push Token', err.toString()));
  }

  useEffect(() => {
    if (!meError) return;
    removeStoredJwtAndRedirect();
  }, [meError]);

  useEffect(() => {
    if (!meData) return;
    setUser(meData.me as User);
  }, [meData]);

  useEffect(() => {
    if (!postAuthUserData?.getAllLists) return;

    const allLists = postAuthUserData.getAllLists as List[];
    setUserLists({
      allLists,
      favorites: allLists.find(({ type }) => type === ListType.Favorites)!,
      watchList: allLists.find(({ type }) => type === ListType.WatchList)!,
    });
  }, [postAuthUserData?.getAllLists]);

  useEffect(() => {
    if (!postAuthUserData?.groceryLists) return;

    const allLists = postAuthUserData.groceryLists as GroceryList[];
    setAllGroceryLists({
      defaultGroceryList: allLists.find((l) => l.default)!,
      groceryLists: allLists,
    });
  }, [postAuthUserData?.groceryLists]);

  useEffect(() => {
    if (!myStoreUsersData) return;
    if (myStoreUsersData.myStoreUsers.length === 0) return;

    setMyStoreUsers(myStoreUsersData.myStoreUsers as StoreUser[]);
  }, [myStoreUsersData]);

  useEffect(() => {
    if (!appVersionCheckData || appVersionCheckData.checkAppVersion) return;

    Alert.alert(
      'Update Required',
      'The app version you are using is outdated. Please update to the latest version to continue using the app.',
      [
        {
          text: 'Update',
          onPress: () => {
            // TODO: Redirect to app store or download page
          },
        },
      ],
      { cancelable: false }
    );
  }, [appVersionCheckData]);

  useEffect(() => {
    checkAppVersion();
    setInterval(() => {
      checkAppVersion();
    }, MINUTE * 30);
  }, []);

  useEffect(() => {
    if (!jwt || !appVersionCheckData?.checkAppVersion) return;

    const ctx = {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    };
    me({ context: { ...ctx } })
      .then(async ({ data: userData }) => {
        if (!userData) return;

        fetchAndRegisterExpoPushToken(userData.me as User);
        await getPostAuthUserData({ context: { ...ctx } });
        getMyStoreUsers({ context: { ...ctx } });
      })
      .catch((_e) => removeStoredJwtAndRedirect())
      .finally(() => setLoading(false));
  }, [jwt, appVersionCheckData]);

  if (loading)
    return (
      <View className="flex h-screen w-screen items-center justify-center gap-10 bg-white p-10">
        <Image
          source={require('../assets/images/logotype_black_color.svg')}
          style={{ height: 45, width: 190 }}
        />

        <ActivityIndicator color="black" size={40} style={{ marginTop: 20 }} />
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
        allGroceryLists,
        myStoreUsers,
        updateUser: (updatedUser) => setUser(updatedUser),
        logout: () => {
          logout().finally(() => {
            removeStoredJwtAndRedirect();
          });
        },
        loggingOut,
      }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export const useAuth = () => useContext(UserAuthContext);

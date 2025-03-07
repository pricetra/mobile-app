import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createContext, ReactNode, useEffect, useState } from 'react';

const httpLink = createHttpLink({
  uri: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/graphql',
});

function createAuthLink(jwt?: string) {
  return setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: jwt ? `Bearer ${jwt}` : undefined,
      },
    };
  });
}

export type ApolloContextType = {
  setAuthHeader: (token: string) => void;
};

export const ApolloContext = createContext<ApolloContextType>({} as ApolloContextType);

type ApolloWrapperProps = { children: ReactNode };

export default function ApolloWrapper({ children }: ApolloWrapperProps) {
  const [jwt, setJwt] = useState<string>();
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>(
    new ApolloClient({
      link: createAuthLink().concat(httpLink),
      cache: new InMemoryCache(),
    })
  );

  useEffect(() => {
    if (!jwt || jwt.length === 0) return;

    setClient(
      new ApolloClient({
        link: createAuthLink(jwt).concat(httpLink),
        cache: new InMemoryCache(),
      })
    );
  }, [jwt]);

  return (
    <ApolloContext.Provider
      value={{
        setAuthHeader: (token) => setJwt(token),
      }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ApolloContext.Provider>
  );
}

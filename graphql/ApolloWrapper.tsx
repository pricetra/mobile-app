import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { createContext, ReactNode, useEffect, useState } from 'react';

const uri = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/graphql';

const httpLink = createHttpLink({ uri });
const uploadLink = createUploadLink({ uri });

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

function newClient(jwt?: string) {
  return new ApolloClient({
    link: createAuthLink(jwt).concat(uploadLink),
    cache: new InMemoryCache(),
  });
}

export type ApolloContextType = {
  setAuthHeader: (token: string) => void;
};

export const ApolloContext = createContext<ApolloContextType>({} as ApolloContextType);

type ApolloWrapperProps = { children: ReactNode };

export default function ApolloWrapper({ children }: ApolloWrapperProps) {
  const [jwt, setJwt] = useState<string>();
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>(newClient());

  useEffect(() => {
    if (!jwt || jwt.length === 0) return;

    setClient(newClient(jwt));
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

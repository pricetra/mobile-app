import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { ReactNode, useContext, useEffect, useState } from 'react';

import { RetryLink } from '@apollo/client/link/retry';

import { JwtStoreContext } from '@/context/JwtStoreContext';

const uri = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/graphql';

const httpLink = createHttpLink({ uri });
const uploadLink = createUploadLink({ uri });

const retryLink = new RetryLink({
  delay: {
    initial: 1000,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 5,
    retryIf: (error, _operation) => !!error,
  },
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

function newClient(jwt?: string) {
  return new ApolloClient({
    link: createAuthLink(jwt).concat(uploadLink).concat(retryLink),
    cache: new InMemoryCache(),
  });
}

type ApolloWrapperProps = { children: ReactNode };

export default function ApolloWrapper({ children }: ApolloWrapperProps) {
  const { jwt } = useContext(JwtStoreContext);
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  useEffect(() => {
    setClient(newClient(jwt));
  }, [jwt]);

  if (!client) return <></>;

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

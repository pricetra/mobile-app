import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { RetryLink } from '@apollo/client/link/retry';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { ReactNode } from 'react';

export const uri = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/graphql';

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

function createAuthLink(jwt: string) {
  return setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${jwt}`,
    },
  }));
}

function newClient(jwt?: string) {
  if (!jwt)
    return new ApolloClient({
      link: uploadLink,
      cache: new InMemoryCache(),
    });

  return new ApolloClient({
    link: ApolloLink.from([retryLink, createAuthLink(jwt), uploadLink]),
    cache: new InMemoryCache(),
  });
}

type ApolloWrapperProps = { jwt?: string; children: ReactNode };

export default function ApolloWrapper({ jwt, children }: ApolloWrapperProps) {
  return <ApolloProvider client={newClient(jwt)}>{children}</ApolloProvider>;
}

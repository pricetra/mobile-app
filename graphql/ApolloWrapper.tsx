import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ReactNode } from 'react';

const client = new ApolloClient({
  uri: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/graphql',
  cache: new InMemoryCache(),
});

type ApolloWrapperProps = { children: ReactNode };

export default function ApolloWrapper({ children }: ApolloWrapperProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

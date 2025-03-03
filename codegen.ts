import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/graphql',
  documents: ['graphql/documents/**/*.ts'],
  generates: {
    'graphql/types/': {
      // plugins: ['typescript', 'typescript-operations'],
      // config: {
      //   avoidOptionals: true,
      // },
      preset: 'client',
    },
  },
};
export default config;

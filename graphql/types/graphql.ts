/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Time: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  country?: Maybe<Scalars['String']['output']>;
  countryCode: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  createdBy?: Maybe<CreatedByUser>;
  createdById?: Maybe<Scalars['ID']['output']>;
  distance?: Maybe<Scalars['Float']['output']>;
  fullAddress: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  mapsLink: Scalars['String']['output'];
  updatedAt: Scalars['Time']['output'];
  updatedBy?: Maybe<UpdatedByUser>;
  updatedById?: Maybe<Scalars['ID']['output']>;
};

export type AdministrativeDivision = {
  __typename?: 'AdministrativeDivision';
  cities: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Auth = {
  __typename?: 'Auth';
  isNewUser?: Maybe<Scalars['Boolean']['output']>;
  token: Scalars['String']['output'];
  user: User;
};

export enum AuthPlatformType {
  Apple = 'APPLE',
  Google = 'GOOGLE',
  Internal = 'INTERNAL'
}

export type Country = {
  __typename?: 'Country';
  administrativeDivisions: Array<AdministrativeDivision>;
  callingCode?: Maybe<Scalars['String']['output']>;
  code: Scalars['String']['output'];
  currency?: Maybe<Currency>;
  language?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type CreateAccountInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type CreateAddress = {
  administrativeDivision: Scalars['String']['input'];
  city: Scalars['String']['input'];
  countryCode: Scalars['String']['input'];
  fullAddress: Scalars['String']['input'];
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  mapsLink: Scalars['String']['input'];
};

export type CreatedByUser = {
  __typename?: 'CreatedByUser';
  active?: Maybe<Scalars['Boolean']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Currency = {
  __typename?: 'Currency';
  currencyCode: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  numToBasic?: Maybe<Scalars['Int']['output']>;
  symbol: Scalars['String']['output'];
  symbolNative: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: User;
  resendEmailVerificationCode: Scalars['Boolean']['output'];
  updateProfile: User;
  verifyEmail: User;
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationResendEmailVerificationCodeArgs = {
  email: Scalars['String']['input'];
};


export type MutationUpdateProfileArgs = {
  input: UpdateUser;
};


export type MutationVerifyEmailArgs = {
  verificationCode: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getAllCountries: Array<Country>;
  googleOAuth: Auth;
  login: Auth;
  me: User;
};


export type QueryGoogleOAuthArgs = {
  accessToken: Scalars['String']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLoginArgs = {
  email: Scalars['String']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type UpdateUser = {
  avatar?: InputMaybe<Scalars['Upload']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  birthDate?: InputMaybe<Scalars['Time']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatedByUser = {
  __typename?: 'UpdatedByUser';
  active?: Maybe<Scalars['Boolean']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  active: Scalars['Boolean']['output'];
  authPlatform?: Maybe<AuthPlatformType>;
  authStateId?: Maybe<Scalars['ID']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  birthDate?: Maybe<Scalars['Time']['output']>;
  createdAt: Scalars['Time']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Time']['output'];
};

export type UserShallow = {
  __typename?: 'UserShallow';
  active?: Maybe<Scalars['Boolean']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type GetAllCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCountriesQuery = { __typename?: 'Query', getAllCountries: Array<{ __typename?: 'Country', code: string, name: string, callingCode?: string | null, language?: string | null, administrativeDivisions: Array<{ __typename?: 'AdministrativeDivision', name: string, cities: string }>, currency?: { __typename?: 'Currency', currencyCode: string, name: string, symbol: string, symbolNative: string, decimals: number, numToBasic?: number | null } | null }> };


export const GetAllCountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivisions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"cities"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"symbolNative"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"numToBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"callingCode"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]} as unknown as DocumentNode<GetAllCountriesQuery, GetAllCountriesQueryVariables>;
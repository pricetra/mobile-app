/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation CreateAccount($email: String!, $name: String!, $password: String!) {\n    createAccount(input: { email: $email, name: $name, password: $password }) {\n      id\n      name\n      email\n      phoneNumber\n      createdAt\n      updatedAt\n      authPlatform\n    }\n  }\n": typeof types.CreateAccountDocument,
    "\n  mutation VerifyEmail($verificationCode: String!) {\n    verifyEmail(verificationCode: $verificationCode) {\n      id\n      name\n      email\n      avatar\n      createdAt\n      updatedAt\n      active\n      authPlatform\n      authStateId\n    }\n  }\n": typeof types.VerifyEmailDocument,
    "\n  mutation ResendVerification($email: String!) {\n    resendEmailVerificationCode(email: $email)\n  }\n": typeof types.ResendVerificationDocument,
    "\n  mutation Logout {\n    logout\n  }\n": typeof types.LogoutDocument,
    "\n  mutation UpdateProfile($input: UpdateUser!) {\n    updateProfile(input: $input) {\n      id\n      name\n      email\n      avatar\n      createdAt\n      updatedAt\n      active\n      authPlatform\n      authStateId\n    }\n  }\n": typeof types.UpdateProfileDocument,
    "\n  mutation CreateStore($input: CreateStore!) {\n    createStore(input: $input) {\n      id\n      name\n      logo\n      website\n      createdById\n      updatedById\n    }\n  }\n": typeof types.CreateStoreDocument,
    "\n  query GetAllCountries {\n    getAllCountries {\n      code\n      name\n      administrativeDivisions {\n        name\n        cities\n      }\n      currency {\n        currencyCode\n        name\n        symbol\n        symbolNative\n        decimals\n        numToBasic\n      }\n      callingCode\n      language\n    }\n  }\n": typeof types.GetAllCountriesDocument,
    "\n  query BarcodeScan($barcode: String!) {\n    barcodeScan(barcode: $barcode) {\n      id\n      name\n      image\n      description\n      url\n      brand\n      code\n      color\n      model\n      category\n      weight\n      lowestRecordedPrice\n      highestRecordedPrice\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.BarcodeScanDocument,
    "\n  fragment UserFields on User {\n    id\n    name\n    email\n    avatar\n    createdAt\n    updatedAt\n    active\n    authPlatform\n    authStateId\n  }\n": typeof types.UserFieldsFragmentDoc,
    "\n  query LoginInternal(\n    $email: String!\n    $password: String!\n    $ipAddress: String\n    $device: AuthDeviceType\n  ) {\n    login(email: $email, password: $password, ipAddress: $ipAddress, device: $device) {\n      token\n      user {\n        id\n        name\n        email\n        avatar\n        createdAt\n        updatedAt\n        active\n        authPlatform\n        authStateId\n      }\n    }\n  }\n": typeof types.LoginInternalDocument,
    "\n  query GoogleOAuth($accessToken: String!, $ipAddress: String, $device: AuthDeviceType) {\n    googleOAuth(accessToken: $accessToken, device: $device) {\n      token\n      user {\n        id\n        name\n        email\n        avatar\n        createdAt\n        updatedAt\n        active\n        authPlatform\n        authStateId\n      }\n      isNewUser\n    }\n  }\n": typeof types.GoogleOAuthDocument,
    "\n  query Me {\n    me {\n      id\n      name\n      email\n      avatar\n      createdAt\n      updatedAt\n      active\n      authPlatform\n      authStateId\n    }\n  }\n": typeof types.MeDocument,
    "\n  query AllProducts {\n    allProducts {\n      id\n      name\n      image\n      description\n      url\n      brand\n      code\n      color\n      model\n      category\n      weight\n      lowestRecordedPrice\n      highestRecordedPrice\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.AllProductsDocument,
    "\n  query AllStores {\n    allStores {\n      id\n      name\n      logo\n      website\n      createdBy {\n        id\n        name\n        avatar\n      }\n    }\n  }\n": typeof types.AllStoresDocument,
    "\n  query FindStore($id: ID!) {\n    findStore(id: $id) {\n      id\n      name\n      logo\n      website\n      createdBy {\n        id\n        name\n        avatar\n      }\n    }\n  }\n": typeof types.FindStoreDocument,
};
const documents: Documents = {
    "\n  mutation CreateAccount($email: String!, $name: String!, $password: String!) {\n    createAccount(input: { email: $email, name: $name, password: $password }) {\n      id\n      name\n      email\n      phoneNumber\n      createdAt\n      updatedAt\n      authPlatform\n    }\n  }\n": types.CreateAccountDocument,
    "\n  mutation VerifyEmail($verificationCode: String!) {\n    verifyEmail(verificationCode: $verificationCode) {\n      id\n      name\n      email\n      avatar\n      createdAt\n      updatedAt\n      active\n      authPlatform\n      authStateId\n    }\n  }\n": types.VerifyEmailDocument,
    "\n  mutation ResendVerification($email: String!) {\n    resendEmailVerificationCode(email: $email)\n  }\n": types.ResendVerificationDocument,
    "\n  mutation Logout {\n    logout\n  }\n": types.LogoutDocument,
    "\n  mutation UpdateProfile($input: UpdateUser!) {\n    updateProfile(input: $input) {\n      id\n      name\n      email\n      avatar\n      createdAt\n      updatedAt\n      active\n      authPlatform\n      authStateId\n    }\n  }\n": types.UpdateProfileDocument,
    "\n  mutation CreateStore($input: CreateStore!) {\n    createStore(input: $input) {\n      id\n      name\n      logo\n      website\n      createdById\n      updatedById\n    }\n  }\n": types.CreateStoreDocument,
    "\n  query GetAllCountries {\n    getAllCountries {\n      code\n      name\n      administrativeDivisions {\n        name\n        cities\n      }\n      currency {\n        currencyCode\n        name\n        symbol\n        symbolNative\n        decimals\n        numToBasic\n      }\n      callingCode\n      language\n    }\n  }\n": types.GetAllCountriesDocument,
    "\n  query BarcodeScan($barcode: String!) {\n    barcodeScan(barcode: $barcode) {\n      id\n      name\n      image\n      description\n      url\n      brand\n      code\n      color\n      model\n      category\n      weight\n      lowestRecordedPrice\n      highestRecordedPrice\n      createdAt\n      updatedAt\n    }\n  }\n": types.BarcodeScanDocument,
    "\n  fragment UserFields on User {\n    id\n    name\n    email\n    avatar\n    createdAt\n    updatedAt\n    active\n    authPlatform\n    authStateId\n  }\n": types.UserFieldsFragmentDoc,
    "\n  query LoginInternal(\n    $email: String!\n    $password: String!\n    $ipAddress: String\n    $device: AuthDeviceType\n  ) {\n    login(email: $email, password: $password, ipAddress: $ipAddress, device: $device) {\n      token\n      user {\n        id\n        name\n        email\n        avatar\n        createdAt\n        updatedAt\n        active\n        authPlatform\n        authStateId\n      }\n    }\n  }\n": types.LoginInternalDocument,
    "\n  query GoogleOAuth($accessToken: String!, $ipAddress: String, $device: AuthDeviceType) {\n    googleOAuth(accessToken: $accessToken, device: $device) {\n      token\n      user {\n        id\n        name\n        email\n        avatar\n        createdAt\n        updatedAt\n        active\n        authPlatform\n        authStateId\n      }\n      isNewUser\n    }\n  }\n": types.GoogleOAuthDocument,
    "\n  query Me {\n    me {\n      id\n      name\n      email\n      avatar\n      createdAt\n      updatedAt\n      active\n      authPlatform\n      authStateId\n    }\n  }\n": types.MeDocument,
    "\n  query AllProducts {\n    allProducts {\n      id\n      name\n      image\n      description\n      url\n      brand\n      code\n      color\n      model\n      category\n      weight\n      lowestRecordedPrice\n      highestRecordedPrice\n      createdAt\n      updatedAt\n    }\n  }\n": types.AllProductsDocument,
    "\n  query AllStores {\n    allStores {\n      id\n      name\n      logo\n      website\n      createdBy {\n        id\n        name\n        avatar\n      }\n    }\n  }\n": types.AllStoresDocument,
    "\n  query FindStore($id: ID!) {\n    findStore(id: $id) {\n      id\n      name\n      logo\n      website\n      createdBy {\n        id\n        name\n        avatar\n      }\n    }\n  }\n": types.FindStoreDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateAccount($email: String!, $name: String!, $password: String!) {\n    createAccount(input: { email: $email, name: $name, password: $password }) {\n      id\n      name\n      email\n      phoneNumber\n      createdAt\n      updatedAt\n      authPlatform\n    }\n  }\n"): (typeof documents)["\n  mutation CreateAccount($email: String!, $name: String!, $password: String!) {\n    createAccount(input: { email: $email, name: $name, password: $password }) {\n      id\n      name\n      email\n      phoneNumber\n      createdAt\n      updatedAt\n      authPlatform\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VerifyEmail($verificationCode: String!) {\n    verifyEmail(verificationCode: $verificationCode) {\n      id\n      name\n      email\n      avatar\n      createdAt\n      updatedAt\n      active\n      authPlatform\n      authStateId\n    }\n  }\n"): (typeof documents)["\n  mutation VerifyEmail($verificationCode: String!) {\n    verifyEmail(verificationCode: $verificationCode) {\n      id\n      name\n      email\n      avatar\n      createdAt\n      updatedAt\n      active\n      authPlatform\n      authStateId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ResendVerification($email: String!) {\n    resendEmailVerificationCode(email: $email)\n  }\n"): (typeof documents)["\n  mutation ResendVerification($email: String!) {\n    resendEmailVerificationCode(email: $email)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout {\n    logout\n  }\n"): (typeof documents)["\n  mutation Logout {\n    logout\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProfile($input: UpdateUser!) {\n    updateProfile(input: $input) {\n      id\n      name\n      email\n      avatar\n      createdAt\n      updatedAt\n      active\n      authPlatform\n      authStateId\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProfile($input: UpdateUser!) {\n    updateProfile(input: $input) {\n      id\n      name\n      email\n      avatar\n      createdAt\n      updatedAt\n      active\n      authPlatform\n      authStateId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateStore($input: CreateStore!) {\n    createStore(input: $input) {\n      id\n      name\n      logo\n      website\n      createdById\n      updatedById\n    }\n  }\n"): (typeof documents)["\n  mutation CreateStore($input: CreateStore!) {\n    createStore(input: $input) {\n      id\n      name\n      logo\n      website\n      createdById\n      updatedById\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllCountries {\n    getAllCountries {\n      code\n      name\n      administrativeDivisions {\n        name\n        cities\n      }\n      currency {\n        currencyCode\n        name\n        symbol\n        symbolNative\n        decimals\n        numToBasic\n      }\n      callingCode\n      language\n    }\n  }\n"): (typeof documents)["\n  query GetAllCountries {\n    getAllCountries {\n      code\n      name\n      administrativeDivisions {\n        name\n        cities\n      }\n      currency {\n        currencyCode\n        name\n        symbol\n        symbolNative\n        decimals\n        numToBasic\n      }\n      callingCode\n      language\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BarcodeScan($barcode: String!) {\n    barcodeScan(barcode: $barcode) {\n      id\n      name\n      image\n      description\n      url\n      brand\n      code\n      color\n      model\n      category\n      weight\n      lowestRecordedPrice\n      highestRecordedPrice\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query BarcodeScan($barcode: String!) {\n    barcodeScan(barcode: $barcode) {\n      id\n      name\n      image\n      description\n      url\n      brand\n      code\n      color\n      model\n      category\n      weight\n      lowestRecordedPrice\n      highestRecordedPrice\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UserFields on User {\n    id\n    name\n    email\n    avatar\n    createdAt\n    updatedAt\n    active\n    authPlatform\n    authStateId\n  }\n"): (typeof documents)["\n  fragment UserFields on User {\n    id\n    name\n    email\n    avatar\n    createdAt\n    updatedAt\n    active\n    authPlatform\n    authStateId\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LoginInternal(\n    $email: String!\n    $password: String!\n    $ipAddress: String\n    $device: AuthDeviceType\n  ) {\n    login(email: $email, password: $password, ipAddress: $ipAddress, device: $device) {\n      token\n      user {\n        id\n        name\n        email\n        avatar\n        createdAt\n        updatedAt\n        active\n        authPlatform\n        authStateId\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoginInternal(\n    $email: String!\n    $password: String!\n    $ipAddress: String\n    $device: AuthDeviceType\n  ) {\n    login(email: $email, password: $password, ipAddress: $ipAddress, device: $device) {\n      token\n      user {\n        id\n        name\n        email\n        avatar\n        createdAt\n        updatedAt\n        active\n        authPlatform\n        authStateId\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GoogleOAuth($accessToken: String!, $ipAddress: String, $device: AuthDeviceType) {\n    googleOAuth(accessToken: $accessToken, device: $device) {\n      token\n      user {\n        id\n        name\n        email\n        avatar\n        createdAt\n        updatedAt\n        active\n        authPlatform\n        authStateId\n      }\n      isNewUser\n    }\n  }\n"): (typeof documents)["\n  query GoogleOAuth($accessToken: String!, $ipAddress: String, $device: AuthDeviceType) {\n    googleOAuth(accessToken: $accessToken, device: $device) {\n      token\n      user {\n        id\n        name\n        email\n        avatar\n        createdAt\n        updatedAt\n        active\n        authPlatform\n        authStateId\n      }\n      isNewUser\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      name\n      email\n      avatar\n      createdAt\n      updatedAt\n      active\n      authPlatform\n      authStateId\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      name\n      email\n      avatar\n      createdAt\n      updatedAt\n      active\n      authPlatform\n      authStateId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AllProducts {\n    allProducts {\n      id\n      name\n      image\n      description\n      url\n      brand\n      code\n      color\n      model\n      category\n      weight\n      lowestRecordedPrice\n      highestRecordedPrice\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query AllProducts {\n    allProducts {\n      id\n      name\n      image\n      description\n      url\n      brand\n      code\n      color\n      model\n      category\n      weight\n      lowestRecordedPrice\n      highestRecordedPrice\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AllStores {\n    allStores {\n      id\n      name\n      logo\n      website\n      createdBy {\n        id\n        name\n        avatar\n      }\n    }\n  }\n"): (typeof documents)["\n  query AllStores {\n    allStores {\n      id\n      name\n      logo\n      website\n      createdBy {\n        id\n        name\n        avatar\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FindStore($id: ID!) {\n    findStore(id: $id) {\n      id\n      name\n      logo\n      website\n      createdBy {\n        id\n        name\n        avatar\n      }\n    }\n  }\n"): (typeof documents)["\n  query FindStore($id: ID!) {\n    findStore(id: $id) {\n      id\n      name\n      logo\n      website\n      createdBy {\n        id\n        name\n        avatar\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
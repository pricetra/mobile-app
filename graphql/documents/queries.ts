import { gql } from '@apollo/client';

export const GET_ALL_COUNTRIES_QUERY = gql`
  query GetAllCountries {
    getAllCountries {
      code
      name
      administrativeDivisions {
        name
        cities
      }
      currency {
        currencyCode
        name
        symbol
        symbolNative
        decimals
        numToBasic
      }
      callingCode
      language
    }
  }
`;

export const BARCODE_SCAN_QUERY = gql`
  query BarcodeScan($barcode: String!) {
    barcodeScan(barcode: $barcode) {
      id
      name
      image
      description
      url
      brand
      code
      color
      model
      category
      weight
      lowestRecordedPrice
      highestRecordedPrice
      createdAt
      updatedAt
    }
  }
`;

export const UserFragment = gql`
  fragment UserFields on User {
    id
    name
    email
    avatar
    createdAt
    updatedAt
    active
    authPlatform
    authStateId
  }
`;

export const LOGIN_INTERNAL_QUERY = gql`
  query LoginInternal(
    $email: String!
    $password: String!
    $ipAddress: String
    $device: AuthDeviceType
  ) {
    login(email: $email, password: $password, ipAddress: $ipAddress, device: $device) {
      token
      user {
        id
        name
        email
        avatar
        createdAt
        updatedAt
        active
        authPlatform
        authStateId
      }
    }
  }
`;

export const GOOGLE_OAUTH_QUERY = gql`
  query GoogleOAuth($accessToken: String!, $ipAddress: String, $device: AuthDeviceType) {
    googleOAuth(accessToken: $accessToken, device: $device) {
      token
      user {
        id
        name
        email
        avatar
        createdAt
        updatedAt
        active
        authPlatform
        authStateId
      }
      isNewUser
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      avatar
      createdAt
      updatedAt
      active
      authPlatform
      authStateId
    }
  }
`;

export const ALL_PRODUCTS_QUERY = gql(`
  query AllProducts {
    allProducts {
      id
      name
      image
      description
      url
      brand
      code
      color
      model
      category
      weight
      lowestRecordedPrice
      highestRecordedPrice
      createdAt
      updatedAt
    }
  }
`);

export const ALL_STORES_QUERY = gql(`
  query AllStores {
    allStores {
      id
      name
      logo
      website
      createdBy {
        id
        name
        avatar
      }
    }
  }
`);

export const FIND_STORE_QUERY = gql(`
  query FindStore($id: ID!) {
    findStore(id: $id) {
      id
      name
      logo
      website
      createdBy {
        id
        name
        avatar
      }
    }
  }
`);

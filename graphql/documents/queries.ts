import { gql } from "@apollo/client";

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
  query LoginInternal($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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
  query GoogleOAuth($accessToken: String!) {
    googleOAuth(accessToken: $accessToken) {
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
`)

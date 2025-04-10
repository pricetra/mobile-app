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
      categoryId
      category {
        id
        name
        expandedPathname
        path
      }
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
  query AllProducts($paginator: PaginatorInput!, $search: ProductSearch) {
    allProducts(paginator: $paginator, search: $search) {
      products {
        id
        name
        image
        description
        url
        brand
        code
        color
        model
        categoryId
        category {
          id
          name
          expandedPathname
          path
        }
        weight
        lowestRecordedPrice
        highestRecordedPrice
        createdAt
        updatedAt
        createdBy {
          id
          name
          avatar
        }
      }
      paginator {
        next
        page
        prev
        limit
        total
        numPages
      }
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

    allBranches(storeId: $id) {
      id
      name
      addressId
      storeId
      address {
        id
        latitude
        longitude
        mapsLink
        fullAddress
        countryCode
        country
        zipCode
      }
    }
  }
`);

export const ALL_BRANCHES_QUERY = gql(`
  query AllBranches($storeId: ID!) {
    allBranches(storeId: $storeId) {
      id
      name
      addressId
      storeId
      address {
        id
        latitude
        longitude
        mapsLink
        fullAddress
        countryCode
        country
        zipCode
      }
    }
  }
`);

export const FIND_BRANCH_QUERY = gql(`
  query FindBranch($id: ID!, $storeId: ID!) {
    findBranch(id: $id, storeId: $storeId) {
      id
      name
      addressId
      storeId
      address {
        id
        latitude
        longitude
        mapsLink
        fullAddress
        countryCode
        country
        zipCode
      }
    }
  }
`);

export const ALL_BRANDS_QUERY = gql`
  query AllBrands {
    allBrands {
      brand
      products
    }
  }
`;

export const FIND_BRANCHES_BY_DISTANCE = gql(`
  query FindBranchesByDistance($lat: Float!, $lon: Float!, $radiusMeters: Int!) {
    findBranchesByDistance(lat: $lat, lon: $lon, radiusMeters: $radiusMeters) {
      id
      name
      storeId
      addressId
      store {
        id
        name
        website
        logo
      }
      address {
        id
        distance
        fullAddress
        city
        administrativeDivision
        zipCode
        countryCode
        country
        latitude
        longitude
      }
    }
  }
`);

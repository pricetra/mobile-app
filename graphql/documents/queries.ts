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
  query BarcodeScan($barcode: String!, $searchMode: Boolean) {
    barcodeScan(barcode: $barcode, searchMode: $searchMode) {
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
    role
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
        role
        addressId
        address {
          id
          latitude
          longitude
          mapsLink
          fullAddress
          city
          administrativeDivision
          zipCode
          countryCode
          country
        }
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
        role
        addressId
        address {
          id
          latitude
          longitude
          mapsLink
          fullAddress
          city
          administrativeDivision
          zipCode
          countryCode
          country
        }
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
      role
      addressId
      address {
        id
        latitude
        longitude
        mapsLink
        fullAddress
        city
        administrativeDivision
        zipCode
        countryCode
        country
      }
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
        stock {
          id
          productId
          storeId
          store {
            id
            name
            logo
          }
          branchId
          branch {
            id
            name
            address {
              id
              latitude
              longitude
              mapsLink
              fullAddress
              city
              administrativeDivision
              zipCode
              country
              distance
            }
          }
          latestPriceId
          latestPrice {
            id
            amount
            currencyCode
            createdAt
            sale
            originalPrice
            condition
            expiresAt
          }
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

export const PRODUCT_BY_ID_QUERY = gql(`
  query Product($productId: ID!, $viewerTrail: ViewerTrailInput) {
    product(id: $productId, viewerTrail: $viewerTrail) {
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
        categoryAlias
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
      views
      productList {
        id
        listId
        userId
        productId
        type
        stockId
        createdAt
      }
    }
  }
`);

export const GET_PRODUCT_STOCKS_QUERY = gql(`
  query GetProductStocks($productId: ID!, $location: LocationInput) {
    getProductStocks(productId: $productId, location: $location) {
      id
      productId
      storeId
      store {
        id
        name
        logo
      }
      branchId
      branch {
        id
        name
        address {
          id
          fullAddress
          distance
        }
      }
      latestPriceId
      latestPrice {
        id
        amount
        currencyCode
        sale
        originalPrice
        condition
        expiresAt
      }
      createdAt
      updatedAt
      createdBy {
        id
        name
        avatar
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
  query FindStore($id: ID!, $location: LocationInput) {
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

    allBranches(storeId: $id, location: $location) {
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
  query AllBranches($storeId: ID!, $location: LocationInput) {
    allBranches(storeId: $storeId, location: $location) {
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

export const BRANCH_QUERY = gql(`
  query Branch($branchId: ID!, $storeId: ID!) {
    findBranch(id: $branchId, storeId: $storeId) {
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

    findStore(id: $storeId) {
      id
      name
      logo
      website
    }
  }
`);

export const FIND_BRANCH_QUERY = gql(`
  query FindBranch($branchId: ID!, $storeId: ID!) {
    findBranch(id: $branchId, storeId: $storeId) {
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

export const FIND_BRANCHES_BY_DISTANCE_QUERY = gql(`
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

export const GET_CATEGORIES_QUERY = gql(`
  query GetCategories($depth: Int, $parentId: ID) {
    getCategories(depth: $depth, parentId: $parentId) {
      id
      name
      path
      expandedPathname
      categoryAlias
      depth
    }
  }
`);

export const MY_PRODUCT_BILLING_DATA_QUERY = gql(`
  query MyProductBillingData($paginator: PaginatorInput!) {
    myProductBillingData(paginator: $paginator) {
      data {
        id
        rate
        userId
        user {
          id
          name
          avatar
          active
        }
        productId
        product {
          id
          name
          image
          brand
          code
          category {
            id
            name
            expandedPathname
            path
          }
          createdAt
          updatedAt
        }
        createdAt
        paidAt
        billingRateType
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

export const GET_ALL_LISTS = gql`
  query GetAllLists($listType: ListType) {
    getAllLists(listType: $listType) {
      id
      name
      type
      userId
      createdAt
      productList {
        id
        listId
        productId
        product {
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
        stock {
          id
          productId
          storeId
          branchId
          latestPriceId
          latestPrice {
            id
            amount
            currencyCode
            createdAt
            sale
            originalPrice
            condition
            expiresAt
          }
        }
        stockId
        createdAt
      }
      branchList {
        id
        listId
        branchId
        branch {
          id
          name
          address {
            id
            latitude
            longitude
            mapsLink
            fullAddress
            city
            administrativeDivision
            zipCode
            country
            distance
          }
        }
        createdAt
      }
    }
  }
`;

export const GET_STOCK_BY_ID = gql(`
  query Stock($stockId: ID!) {
    stock(stockId: $stockId) {
      id
      productId
      storeId
      store {
        id
        name
        logo
      }
      branchId
      branch {
        id
        name
        address {
          id
          fullAddress
          distance
        }
      }
      latestPriceId
      latestPrice {
        id
        amount
        currencyCode
        sale
        originalPrice
        condition
        expiresAt
      }
      createdAt
      updatedAt
      createdBy {
        id
        name
        avatar
      }
    }
  }
`);

export const GET_FAVORITE_BRANCHES_WITH_PRICE_DATA_QUERY = gql(`
  query FavoriteBranchesWithPrices($productId: ID!) {
    getFavoriteBranchesWithPrices(productId: $productId) {
      id
      branchId
      branch {
        id
        name
        store {
          id
          name
          logo
        }
        address {
          id
          latitude
          longitude
          mapsLink
          fullAddress
          city
          administrativeDivision
          zipCode
          country
          distance
        }
      }
      stock {
        id
        productId
        storeId
        branchId
        latestPriceId
        latestPrice {
          id
          amount
          currencyCode
          createdAt
          sale
          originalPrice
          condition
          expiresAt
        }
      }
      approximatePrice
    }
  }
`);

export const VERIFY_PASSWORD_RESET_CODE_QUERY = gql(`
  query VerifyPasswordResetCode($email: String!, $code: String!) {
    verifyPasswordResetCode(email: $email, code: $code)
  }
`);

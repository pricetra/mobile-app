import { gql } from '@apollo/client';

export const CREATE_USER_MUTATION = gql`
  mutation CreateAccount($email: String!, $name: String!, $password: String!) {
    createAccount(input: { email: $email, name: $name, password: $password }) {
      id
      name
      email
      phoneNumber
      createdAt
      updatedAt
      authPlatform
      role
    }
  }
`;

export const VERIFY_EMAIL_MUTATION = gql(`
  mutation VerifyEmail($verificationCode: String!) {
    verifyEmail(verificationCode: $verificationCode) {
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
  }
`);

export const RESEND_VERIFICATION_MUTATION = gql(`
  mutation ResendVerification($email: String!) {
    resendEmailVerificationCode(email: $email)
  }
`);

export const LOGOUT_MUTATION = gql(`
  mutation Logout {
    logout
  }
`);

export const UPDATE_PROFILE_MUTATION = gql(`
  mutation UpdateProfile($input: UpdateUser!) {
    updateProfile(input: $input) {
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
        street
        city
        administrativeDivision
        countryCode
        country
        zipCode
      }
      birthDate
      phoneNumber
      bio
    }
  }
`);

export const CREATE_STORE_MUTATION = gql(`
  mutation CreateStore($input: CreateStore!) {
    createStore(input: $input) {
      id
      name
      logo
      website
    }
  }
`);

export const CREATE_BRANCH_WITH_FULL_ADDRESS_MUTATION = gql(`
  mutation CreateBranchFromFullAddress($storeId: ID!, $fullAddress: String!) {
    createBranchWithFullAddress(storeId: $storeId, fullAddress: $fullAddress) {
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
        street
        city
        administrativeDivision
        countryCode
        country
        zipCode
      }
    }
  }
`);

export const CREATE_BRANCH_MUTATION = gql(`
  mutation CreateBranch($input: CreateBranch!) {
    createBranch(input: $input) {
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
        street
        city
        administrativeDivision
        countryCode
        country
        zipCode
      }
    }
  }
`);

export const CREATE_PRODUCT_MUTATION = gql(`
  mutation CreateProduct($input: CreateProduct!) {
    createProduct(input: $input) {
      id
      name
      image
      description
      brand
      code
      model
      categoryId
      category {
        id
        name
        expandedPathname
        path
      }
      weightValue
      weightType
      createdAt
      updatedAt
    }
  }
`);

export const UPDATE_PRODUCT_MUTATION = gql(`
  mutation UpdateProduct($id: ID!, $input: UpdateProduct!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      image
      description
      brand
      code
      model
      categoryId
      category {
        id
        name
        expandedPathname
        path
      }
      weightValue
      weightType
      createdAt
      updatedAt
    }
  }
`);

export const CREATE_CATEGORY_MUTATION = gql(`
  mutation CreateCategory($input: CreateCategory!) {
    createCategory(input:$input) {
      id
      name
      path
      expandedPathname
      categoryAlias
      depth
    }
  }
`);

export const CREATE_PRICE_MUTATION = gql(`
  mutation CreatePrice($input: CreatePrice!) {
    createPrice(input: $input) {
      id
      amount
      currencyCode
      productId
      storeId
      stockId
      branchId
    }
  }
`);

export const ADD_TO_LIST_MUTATION = gql(`
  mutation AddToList($listId: ID!, $productId: ID!, $stockId: ID) {
    addToList(listId: $listId, productId: $productId, stockId: $stockId) {
      id
      userId
      listId
      productId
      stockId
      createdAt
    }
  }
`);

export const REMOVE_FROM_LIST_MUTATION = gql(`
  mutation RemoveFromList($listId: ID!, $productListId: ID!) {
    removeFromList(listId: $listId, productListId: $productListId) {
      id
      userId
      listId
      productId
      stockId
      createdAt
    }
  }
`);

export const REMOVE_FROM_LIST_BY_PRODUCT_ID_MUTATION = gql(`
  mutation RemoveFromListWithProductId($listId: ID!, $productId: ID!, $stockId: ID) {
    removeFromListWithProductId(listId: $listId, productId: $productId, stockId: $stockId) {
      id
      userId
      listId
      productId
      stockId
      createdAt
    }
  }
`);

export const ADD_BRANCH_TO_LIST_MUTATION = gql(`
  mutation AddBranchToList($listId: ID!, $branchId: ID!) {
    addBranchToList(listId: $listId, branchId: $branchId) {
      id
      userId
      listId
      branchId
      createdAt
    }
  }
`);

export const BULK_ADD_BRANCHES_TO_LIST_MUTATION = gql(`
  mutation BulkAddBranchesToList($listId: ID!, $branchIds: [ID!]!) {
    bulkAddBranchesToList(listId: $listId, branchIds: $branchIds) {
      id
      userId
      listId
      branchId
      createdAt
    }
  }
`);

export const REMOVE_BRANCH_FROM_LIST_MUTATION = gql(`
  mutation RemoveBranchFromList($listId: ID!, $branchListId: ID!) {
    removeBranchFromList(listId: $listId, branchListId: $branchListId) {
      id
      userId
      listId
      branchId
      createdAt
    }
  }
`);

export const REQUEST_RESET_PASSWORD_MUTATION = gql(`
  mutation RequestResetPassword($email: String!) {
    requestPasswordReset(email: $email)
  }
`);

export const UPDATE_PASSWORD_WITH_RESET_CODE_MUTATION = gql(`
  mutation UpdatePasswordWithResetCode($email: String!, $code: String!, $newPassword: String!) {
    updatePasswordWithResetCode(
      email: $email
      code: $code
      newPassword: $newPassword
    )
  }
`);

export const REGISTER_EXPO_PUSH_TOKEN = gql(`
  mutation RegisterExpoPushToken($expoPushToken: String!) {
    registerExpoPushToken(expoPushToken: $expoPushToken) {
      id
      name
      email
      avatar
      createdAt
      updatedAt
      active
      authPlatform
      authStateId
      expoPushToken
      role
      addressId
      address {
        id
        latitude
        longitude
        mapsLink
        fullAddress
        street
        city
        administrativeDivision
        countryCode
        country
        zipCode
      }
    }
  }
`);

export const UPDATE_PRODUCT_NUTRITION_MUTATION = gql(`
  mutation UpdateProductNutritionData($productId: ID!) {
    updateProductNutritionData(productId: $productId) {
      productId
      openfoodfactsUpdatedAt
      createdAt
      updatedAt
    }
  }
`);

export const EXTRACT_AND_CREATE_PRODUCT_FIELDS_QUERY = gql(`
  mutation ExtractAndCreateProduct($barcode: String!, $base64Image: String!) {
    extractAndCreateProduct(barcode: $barcode, base64Image: $base64Image) {
      id
      code
      brand
      name
      categoryId
      weightValue
      weightType
      quantityValue
      quantityType
      description
    }
  }
`);

export const SANITIZE_PRODUCT_MUTATION = gql(`
  mutation SanitizeProduct($id: ID!) {
    sanitizeProduct(id: $id) {
      id
      name
      image
      description
      brand
      code
      model
      categoryId
      category {
        id
        name
        categoryAlias
        expandedPathname
        path
      }
      approximateWeight
      netWeight
      weightValue
      weightType
      quantityValue
      quantityType
      createdAt
      updatedAt
      views
    }
  }
`);

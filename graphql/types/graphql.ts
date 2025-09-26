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
  ID: { input: number; output: number; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Int64: { input: any; output: any; }
  Time: { input: any; output: any; }
  Upload: { input: any; output: any; }
  Void: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  administrativeDivision: Scalars['String']['output'];
  city: Scalars['String']['output'];
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
  street?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Time']['output'];
  updatedBy?: Maybe<UpdatedByUser>;
  updatedById?: Maybe<Scalars['ID']['output']>;
  zipCode: Scalars['String']['output'];
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

export enum AuthDeviceType {
  Android = 'android',
  Ios = 'ios',
  Other = 'other',
  Unknown = 'unknown',
  Web = 'web'
}

export enum AuthPlatformType {
  Apple = 'APPLE',
  Google = 'GOOGLE',
  Internal = 'INTERNAL'
}

export type Branch = {
  __typename?: 'Branch';
  address: Address;
  addressId: Scalars['ID']['output'];
  createdBy?: Maybe<CreatedByUser>;
  createdById?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  products?: Maybe<Array<Product>>;
  store?: Maybe<Store>;
  storeId: Scalars['ID']['output'];
  updatedBy?: Maybe<UpdatedByUser>;
  updatedById?: Maybe<Scalars['ID']['output']>;
};

export type BranchList = {
  __typename?: 'BranchList';
  branch?: Maybe<Branch>;
  branchId: Scalars['ID']['output'];
  createdAt: Scalars['Time']['output'];
  id: Scalars['ID']['output'];
  list?: Maybe<List>;
  listId: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
};

export type BranchListWithPrices = {
  __typename?: 'BranchListWithPrices';
  approximatePrice?: Maybe<Scalars['Float']['output']>;
  branch?: Maybe<Branch>;
  branchId: Scalars['ID']['output'];
  createdAt: Scalars['Time']['output'];
  id: Scalars['ID']['output'];
  stock?: Maybe<Stock>;
};

export type Brand = {
  __typename?: 'Brand';
  brand: Scalars['String']['output'];
  products: Scalars['Int64']['output'];
};

export type Category = {
  __typename?: 'Category';
  categoryAlias?: Maybe<Scalars['String']['output']>;
  depth?: Maybe<Scalars['Int']['output']>;
  expandedPathname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

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
  street?: InputMaybe<Scalars['String']['input']>;
  zipCode: Scalars['Int']['input'];
};

export type CreateBranch = {
  address: CreateAddress;
  name: Scalars['String']['input'];
  storeId: Scalars['ID']['input'];
};

export type CreateCategory = {
  name: Scalars['String']['input'];
  parentPath: Array<Scalars['Int']['input']>;
};

export type CreateGroceryListInput = {
  name: Scalars['String']['input'];
};

export type CreateGroceryListItemInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  productId?: InputMaybe<Scalars['ID']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePrice = {
  amount: Scalars['Float']['input'];
  branchId: Scalars['ID']['input'];
  condition?: InputMaybe<Scalars['String']['input']>;
  currencyCode?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['Time']['input']>;
  imageFile?: InputMaybe<Scalars['Upload']['input']>;
  imageId?: InputMaybe<Scalars['String']['input']>;
  originalPrice?: InputMaybe<Scalars['Float']['input']>;
  productId: Scalars['ID']['input'];
  sale: Scalars['Boolean']['input'];
  unitType: Scalars['String']['input'];
};

export type CreateProduct = {
  brand: Scalars['String']['input'];
  categoryId: Scalars['ID']['input'];
  code: Scalars['String']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  highestRecordedPrice?: InputMaybe<Scalars['Float']['input']>;
  imageBase64?: InputMaybe<Scalars['String']['input']>;
  imageFile?: InputMaybe<Scalars['Upload']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  lowestRecordedPrice?: InputMaybe<Scalars['Float']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  quantityType?: InputMaybe<Scalars['String']['input']>;
  quantityValue?: InputMaybe<Scalars['Int']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['String']['input']>;
};

export type CreateStock = {
  branchId: Scalars['ID']['input'];
  productId: Scalars['ID']['input'];
  storeId: Scalars['ID']['input'];
};

export type CreateStore = {
  logoBase64?: InputMaybe<Scalars['String']['input']>;
  logoFile?: InputMaybe<Scalars['Upload']['input']>;
  name: Scalars['String']['input'];
  website: Scalars['String']['input'];
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

export type GroceryList = {
  __typename?: 'GroceryList';
  createdAt: Scalars['Time']['output'];
  default: Scalars['Boolean']['output'];
  groceryListItems?: Maybe<Array<GroceryListItem>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['Time']['output'];
  userId: Scalars['ID']['output'];
};

export type GroceryListItem = {
  __typename?: 'GroceryListItem';
  category?: Maybe<Scalars['String']['output']>;
  completed: Scalars['Boolean']['output'];
  createdAt: Scalars['Time']['output'];
  groceryList?: Maybe<GroceryList>;
  groceryListId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['ID']['output']>;
  quantity: Scalars['Int']['output'];
  unit?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Time']['output'];
  weight?: Maybe<Scalars['String']['output']>;
};

export type List = {
  __typename?: 'List';
  branchList?: Maybe<Array<BranchList>>;
  createdAt: Scalars['Time']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  productList?: Maybe<Array<ProductList>>;
  type: ListType;
  userId: Scalars['ID']['output'];
};

export enum ListType {
  Favorites = 'FAVORITES',
  Personal = 'PERSONAL',
  WatchList = 'WATCH_LIST'
}

export type LocationInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  radiusMeters?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addBranchToList: BranchList;
  addGroceryListItem: GroceryListItem;
  addToList: ProductList;
  bulkAddBranchesToList: Array<BranchList>;
  clearSearchHistory: Scalars['Boolean']['output'];
  createAccount: User;
  createBranch: Branch;
  createBranchWithFullAddress: Branch;
  createCategory: Category;
  createList: List;
  createPrice: Price;
  createProduct: Product;
  createStore: Store;
  deleteList: List;
  deleteSearchById: Scalars['Boolean']['output'];
  logout: Scalars['Boolean']['output'];
  markGroceryListItem: GroceryListItem;
  registerExpoPushToken: User;
  removeBranchFromList: BranchList;
  removeFromList: ProductList;
  removeFromListWithProductId: ProductList;
  requestPasswordReset: Scalars['Boolean']['output'];
  resendEmailVerificationCode: Scalars['Boolean']['output'];
  saveProductsFromUPCItemDb: SearchResult;
  updateGroceryListItem: GroceryListItem;
  updatePasswordWithResetCode: Scalars['Boolean']['output'];
  updateProduct: Product;
  updateProductNutritionData: ProductNutrition;
  updateProfile: User;
  updateUserById: User;
  verifyEmail: User;
};


export type MutationAddBranchToListArgs = {
  branchId: Scalars['ID']['input'];
  listId: Scalars['ID']['input'];
};


export type MutationAddGroceryListItemArgs = {
  groceryListId?: InputMaybe<Scalars['ID']['input']>;
  input: CreateGroceryListItemInput;
};


export type MutationAddToListArgs = {
  listId: Scalars['ID']['input'];
  productId: Scalars['ID']['input'];
  stockId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationBulkAddBranchesToListArgs = {
  branchIds: Array<Scalars['ID']['input']>;
  listId: Scalars['ID']['input'];
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationCreateBranchArgs = {
  input: CreateBranch;
};


export type MutationCreateBranchWithFullAddressArgs = {
  fullAddress: Scalars['String']['input'];
  storeId: Scalars['ID']['input'];
};


export type MutationCreateCategoryArgs = {
  input: CreateCategory;
};


export type MutationCreateListArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreatePriceArgs = {
  input: CreatePrice;
};


export type MutationCreateProductArgs = {
  input: CreateProduct;
};


export type MutationCreateStoreArgs = {
  input: CreateStore;
};


export type MutationDeleteListArgs = {
  listId: Scalars['ID']['input'];
};


export type MutationDeleteSearchByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMarkGroceryListItemArgs = {
  completed: Scalars['Boolean']['input'];
  groceryListItemId: Scalars['ID']['input'];
};


export type MutationRegisterExpoPushTokenArgs = {
  expoPushToken: Scalars['String']['input'];
};


export type MutationRemoveBranchFromListArgs = {
  branchListId: Scalars['ID']['input'];
  listId: Scalars['ID']['input'];
};


export type MutationRemoveFromListArgs = {
  listId: Scalars['ID']['input'];
  productListId: Scalars['ID']['input'];
};


export type MutationRemoveFromListWithProductIdArgs = {
  listId: Scalars['ID']['input'];
  productId: Scalars['ID']['input'];
  stockId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationRequestPasswordResetArgs = {
  email: Scalars['String']['input'];
};


export type MutationResendEmailVerificationCodeArgs = {
  email: Scalars['String']['input'];
};


export type MutationSaveProductsFromUpcItemDbArgs = {
  input: SaveExternalProductInput;
};


export type MutationUpdateGroceryListItemArgs = {
  groceryListItemId: Scalars['ID']['input'];
  input: CreateGroceryListItemInput;
};


export type MutationUpdatePasswordWithResetCodeArgs = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationUpdateProductArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProduct;
};


export type MutationUpdateProductNutritionDataArgs = {
  productId: Scalars['ID']['input'];
};


export type MutationUpdateProfileArgs = {
  input: UpdateUser;
};


export type MutationUpdateUserByIdArgs = {
  input: UpdateUserFull;
  userId: Scalars['ID']['input'];
};


export type MutationVerifyEmailArgs = {
  verificationCode: Scalars['String']['input'];
};

export enum OrderByType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PaginatedBranches = {
  __typename?: 'PaginatedBranches';
  branches: Array<Branch>;
  paginator: Paginator;
};

export type PaginatedPriceHistory = {
  __typename?: 'PaginatedPriceHistory';
  paginator: Paginator;
  prices: Array<Price>;
};

export type PaginatedProductBilling = {
  __typename?: 'PaginatedProductBilling';
  data: Array<ProductBilling>;
  paginator: Paginator;
};

export type PaginatedProducts = {
  __typename?: 'PaginatedProducts';
  paginator: Paginator;
  products: Array<Product>;
};

export type PaginatedSearch = {
  __typename?: 'PaginatedSearch';
  paginator: Paginator;
  searches: Array<SearchHistory>;
};

export type PaginatedStores = {
  __typename?: 'PaginatedStores';
  paginator: Paginator;
  stores: Array<Store>;
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  paginator: Paginator;
  users: Array<User>;
};

export type Paginator = {
  __typename?: 'Paginator';
  limit: Scalars['Int']['output'];
  next?: Maybe<Scalars['Int']['output']>;
  numPages: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  prev?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type PaginatorInput = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};

export type Price = {
  __typename?: 'Price';
  amount: Scalars['Float']['output'];
  branch?: Maybe<Branch>;
  branchId: Scalars['ID']['output'];
  condition?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  createdBy?: Maybe<CreatedByUser>;
  createdById?: Maybe<Scalars['ID']['output']>;
  currencyCode: Scalars['String']['output'];
  expiresAt?: Maybe<Scalars['Time']['output']>;
  id: Scalars['ID']['output'];
  imageId?: Maybe<Scalars['String']['output']>;
  originalPrice?: Maybe<Scalars['Float']['output']>;
  product?: Maybe<Product>;
  productId: Scalars['ID']['output'];
  sale: Scalars['Boolean']['output'];
  stock?: Maybe<Stock>;
  stockId: Scalars['ID']['output'];
  store?: Maybe<Store>;
  storeId: Scalars['ID']['output'];
  unitType: Scalars['String']['output'];
  updatedAt: Scalars['Time']['output'];
  updatedBy?: Maybe<UpdatedByUser>;
  updatedById?: Maybe<Scalars['ID']['output']>;
};

export type PriceHistoryFilter = {
  orderBy?: InputMaybe<OrderByType>;
};

export type Product = {
  __typename?: 'Product';
  brand: Scalars['String']['output'];
  category?: Maybe<Category>;
  categoryId: Scalars['ID']['output'];
  code: Scalars['String']['output'];
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  createdBy?: Maybe<CreatedByUser>;
  createdById?: Maybe<Scalars['ID']['output']>;
  description: Scalars['String']['output'];
  highestRecordedPrice?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  lowestRecordedPrice?: Maybe<Scalars['Float']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  productList: Array<ProductList>;
  quantityType: Scalars['String']['output'];
  quantityValue: Scalars['Int']['output'];
  stock?: Maybe<Stock>;
  updatedAt: Scalars['Time']['output'];
  updatedBy?: Maybe<UpdatedByUser>;
  updatedById?: Maybe<Scalars['ID']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  views: Scalars['Int']['output'];
  weightType?: Maybe<Scalars['String']['output']>;
  weightValue?: Maybe<Scalars['Float']['output']>;
};

export type ProductBilling = {
  __typename?: 'ProductBilling';
  billingRateType: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  id: Scalars['ID']['output'];
  paidAt?: Maybe<Scalars['Time']['output']>;
  product?: Maybe<Product>;
  productId: Scalars['ID']['output'];
  rate: Scalars['Float']['output'];
  user?: Maybe<UserShallow>;
  userId: Scalars['ID']['output'];
};

export type ProductExtractionFields = {
  __typename?: 'ProductExtractionFields';
  brand: Scalars['String']['output'];
  category: Scalars['String']['output'];
  productName: Scalars['String']['output'];
  quantity?: Maybe<Scalars['Int']['output']>;
  weight?: Maybe<Scalars['String']['output']>;
};

export type ProductExtractionResponse = {
  __typename?: 'ProductExtractionResponse';
  brand: Scalars['String']['output'];
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  quantity?: Maybe<Scalars['Int']['output']>;
  weight?: Maybe<Scalars['String']['output']>;
};

export type ProductList = {
  __typename?: 'ProductList';
  createdAt: Scalars['Time']['output'];
  id: Scalars['ID']['output'];
  list?: Maybe<List>;
  listId: Scalars['ID']['output'];
  product?: Maybe<Product>;
  productId: Scalars['ID']['output'];
  stock?: Maybe<Stock>;
  stockId?: Maybe<Scalars['ID']['output']>;
  type?: Maybe<ListType>;
  userId: Scalars['ID']['output'];
};

export type ProductNutriment = {
  __typename?: 'ProductNutriment';
  alcohol?: Maybe<Scalars['Float']['output']>;
  alcohol100g?: Maybe<Scalars['Float']['output']>;
  alcoholServing?: Maybe<Scalars['Float']['output']>;
  alcoholUnit?: Maybe<Scalars['String']['output']>;
  alcoholValue?: Maybe<Scalars['Float']['output']>;
  calcium?: Maybe<Scalars['Float']['output']>;
  calcium100g?: Maybe<Scalars['Float']['output']>;
  calciumLabel?: Maybe<Scalars['String']['output']>;
  calciumServing?: Maybe<Scalars['Float']['output']>;
  calciumUnit?: Maybe<Scalars['String']['output']>;
  calciumValue?: Maybe<Scalars['Float']['output']>;
  carbohydrates?: Maybe<Scalars['Float']['output']>;
  carbohydrates100g?: Maybe<Scalars['Float']['output']>;
  carbohydratesServing?: Maybe<Scalars['Float']['output']>;
  carbohydratesUnit?: Maybe<Scalars['String']['output']>;
  carbohydratesValue?: Maybe<Scalars['Float']['output']>;
  cholesterol100g?: Maybe<Scalars['Float']['output']>;
  energy?: Maybe<Scalars['Float']['output']>;
  energy100g?: Maybe<Scalars['Float']['output']>;
  energyKcal?: Maybe<Scalars['Float']['output']>;
  energyKcal100g?: Maybe<Scalars['Float']['output']>;
  energyKcalServing?: Maybe<Scalars['Float']['output']>;
  energyKcalUnit?: Maybe<Scalars['String']['output']>;
  energyKcalValue?: Maybe<Scalars['Float']['output']>;
  energyServing?: Maybe<Scalars['Float']['output']>;
  energyUnit?: Maybe<Scalars['String']['output']>;
  energyValue?: Maybe<Scalars['Float']['output']>;
  fat?: Maybe<Scalars['Float']['output']>;
  fat100g?: Maybe<Scalars['Float']['output']>;
  fatServing?: Maybe<Scalars['Float']['output']>;
  fatUnit?: Maybe<Scalars['String']['output']>;
  fatValue?: Maybe<Scalars['Float']['output']>;
  fiber?: Maybe<Scalars['Float']['output']>;
  fiber100g?: Maybe<Scalars['Float']['output']>;
  fiberServing?: Maybe<Scalars['Float']['output']>;
  fiberUnit?: Maybe<Scalars['String']['output']>;
  fiberValue?: Maybe<Scalars['Float']['output']>;
  iron?: Maybe<Scalars['Float']['output']>;
  iron100g?: Maybe<Scalars['Float']['output']>;
  ironLabel?: Maybe<Scalars['String']['output']>;
  ironServing?: Maybe<Scalars['Float']['output']>;
  ironUnit?: Maybe<Scalars['String']['output']>;
  ironValue?: Maybe<Scalars['Float']['output']>;
  monounsaturatedFat100g?: Maybe<Scalars['Float']['output']>;
  novaGroup?: Maybe<Scalars['Float']['output']>;
  novaGroup100g?: Maybe<Scalars['Float']['output']>;
  novaGroupServing?: Maybe<Scalars['Float']['output']>;
  nutritionScoreFr?: Maybe<Scalars['Float']['output']>;
  nutritionScoreFr100g?: Maybe<Scalars['Float']['output']>;
  nutritionScoreFrServing?: Maybe<Scalars['Float']['output']>;
  nutritionScoreUk?: Maybe<Scalars['Float']['output']>;
  nutritionScoreUk100g?: Maybe<Scalars['Float']['output']>;
  nutritionScoreUkServing?: Maybe<Scalars['Float']['output']>;
  polyunsaturatedFat100g?: Maybe<Scalars['Float']['output']>;
  potassium100g?: Maybe<Scalars['Float']['output']>;
  proteins?: Maybe<Scalars['Float']['output']>;
  proteins100g?: Maybe<Scalars['Float']['output']>;
  proteinsServing?: Maybe<Scalars['Float']['output']>;
  proteinsUnit?: Maybe<Scalars['String']['output']>;
  proteinsValue?: Maybe<Scalars['Float']['output']>;
  salt?: Maybe<Scalars['Float']['output']>;
  salt100g?: Maybe<Scalars['Float']['output']>;
  saltServing?: Maybe<Scalars['Float']['output']>;
  saltUnit?: Maybe<Scalars['String']['output']>;
  saltValue?: Maybe<Scalars['Float']['output']>;
  saturatedFat?: Maybe<Scalars['Float']['output']>;
  saturatedFat100g?: Maybe<Scalars['Float']['output']>;
  saturatedFatServing?: Maybe<Scalars['Float']['output']>;
  saturatedFatUnit?: Maybe<Scalars['String']['output']>;
  saturatedFatValue?: Maybe<Scalars['Float']['output']>;
  sodium?: Maybe<Scalars['Float']['output']>;
  sodium100g?: Maybe<Scalars['Float']['output']>;
  sodiumServing?: Maybe<Scalars['Float']['output']>;
  sodiumUnit?: Maybe<Scalars['String']['output']>;
  sodiumValue?: Maybe<Scalars['Float']['output']>;
  sugars?: Maybe<Scalars['Float']['output']>;
  sugars100g?: Maybe<Scalars['Float']['output']>;
  sugarsServing?: Maybe<Scalars['Float']['output']>;
  sugarsUnit?: Maybe<Scalars['String']['output']>;
  sugarsValue?: Maybe<Scalars['Float']['output']>;
  transFat?: Maybe<Scalars['Float']['output']>;
  transFat100g?: Maybe<Scalars['Float']['output']>;
  transFatLabel?: Maybe<Scalars['String']['output']>;
  transFatServing?: Maybe<Scalars['Float']['output']>;
  transFatUnit?: Maybe<Scalars['String']['output']>;
  transFatValue?: Maybe<Scalars['Float']['output']>;
  vitaminA?: Maybe<Scalars['Float']['output']>;
  vitaminA100g?: Maybe<Scalars['Float']['output']>;
  vitaminALabel?: Maybe<Scalars['String']['output']>;
  vitaminAServing?: Maybe<Scalars['Float']['output']>;
  vitaminAUnit?: Maybe<Scalars['String']['output']>;
  vitaminAValue?: Maybe<Scalars['Float']['output']>;
  vitaminC?: Maybe<Scalars['Float']['output']>;
  vitaminC100g?: Maybe<Scalars['Float']['output']>;
  vitaminCLabel?: Maybe<Scalars['String']['output']>;
  vitaminCServing?: Maybe<Scalars['Float']['output']>;
  vitaminCUnit?: Maybe<Scalars['String']['output']>;
  vitaminCValue?: Maybe<Scalars['Float']['output']>;
};

export type ProductNutrition = {
  __typename?: 'ProductNutrition';
  createdAt: Scalars['Time']['output'];
  glutenFree?: Maybe<Scalars['Boolean']['output']>;
  halal?: Maybe<Scalars['Boolean']['output']>;
  ingredientList?: Maybe<Array<Scalars['String']['output']>>;
  ingredientText?: Maybe<Scalars['String']['output']>;
  kosher?: Maybe<Scalars['Boolean']['output']>;
  lactoseFree?: Maybe<Scalars['Boolean']['output']>;
  nutriments?: Maybe<ProductNutriment>;
  openfoodfactsUpdatedAt: Scalars['String']['output'];
  productId: Scalars['ID']['output'];
  servingSize?: Maybe<Scalars['String']['output']>;
  servingSizeUnit?: Maybe<Scalars['String']['output']>;
  servingSizeValue?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['Time']['output'];
  vegan?: Maybe<Scalars['Boolean']['output']>;
  vegetarian?: Maybe<Scalars['Boolean']['output']>;
};

export type ProductSearch = {
  branchId?: InputMaybe<Scalars['ID']['input']>;
  brand?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  location?: InputMaybe<LocationInput>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  sale?: InputMaybe<Scalars['Boolean']['input']>;
  sortByPrice?: InputMaybe<Scalars['String']['input']>;
  storeId?: InputMaybe<Scalars['ID']['input']>;
  weight?: InputMaybe<Scalars['String']['input']>;
  wideSearch?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Query = {
  __typename?: 'Query';
  allBranches: PaginatedBranches;
  allBrands: Array<Brand>;
  allProducts: PaginatedProducts;
  allStores: PaginatedStores;
  barcodeScan: Product;
  branchesWithProducts: PaginatedBranches;
  checkAppVersion: Scalars['Boolean']['output'];
  defaultGroceryListItems: Array<GroceryListItem>;
  extractProductFields: ProductExtractionResponse;
  findBranch: Branch;
  findBranchesByDistance: Array<Branch>;
  findStore: Store;
  getAllBranchListsByListId: Array<BranchList>;
  getAllCountries: Array<Country>;
  getAllLists: Array<List>;
  getAllProductListsByListId: Array<ProductList>;
  getAllUsers: PaginatedUsers;
  getCategories: Array<Category>;
  getFavoriteBranchesWithPrices: Array<BranchListWithPrices>;
  getProductNutritionData: ProductNutrition;
  getProductStocks: Array<Stock>;
  googleOAuth: Auth;
  groceryList: GroceryList;
  groceryListItems: Array<GroceryListItem>;
  groceryLists: Array<GroceryList>;
  login: Auth;
  me: User;
  myProductBillingData: PaginatedProductBilling;
  myProductViewHistory: PaginatedProducts;
  mySearchHistory: PaginatedSearch;
  priceChangeHistory: PaginatedPriceHistory;
  product: Product;
  productBillingDataByUserId: PaginatedProductBilling;
  stock: Stock;
  verifyPasswordResetCode: Scalars['Boolean']['output'];
};


export type QueryAllBranchesArgs = {
  location?: InputMaybe<LocationInput>;
  paginator: PaginatorInput;
  search?: InputMaybe<Scalars['String']['input']>;
  storeId: Scalars['ID']['input'];
};


export type QueryAllProductsArgs = {
  paginator: PaginatorInput;
  search?: InputMaybe<ProductSearch>;
};


export type QueryAllStoresArgs = {
  paginator: PaginatorInput;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryBarcodeScanArgs = {
  barcode: Scalars['String']['input'];
  searchMode?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryBranchesWithProductsArgs = {
  filters?: InputMaybe<ProductSearch>;
  paginator: PaginatorInput;
  productLimit: Scalars['Int']['input'];
};


export type QueryCheckAppVersionArgs = {
  platform: AuthDeviceType;
  version: Scalars['String']['input'];
};


export type QueryExtractProductFieldsArgs = {
  base64Image: Scalars['String']['input'];
};


export type QueryFindBranchArgs = {
  id: Scalars['ID']['input'];
  storeId: Scalars['ID']['input'];
};


export type QueryFindBranchesByDistanceArgs = {
  lat: Scalars['Float']['input'];
  lon: Scalars['Float']['input'];
  radiusMeters: Scalars['Int']['input'];
};


export type QueryFindStoreArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetAllBranchListsByListIdArgs = {
  listId: Scalars['ID']['input'];
};


export type QueryGetAllListsArgs = {
  listType?: InputMaybe<ListType>;
};


export type QueryGetAllProductListsByListIdArgs = {
  listId: Scalars['ID']['input'];
};


export type QueryGetAllUsersArgs = {
  filters?: InputMaybe<UserFilter>;
  paginator: PaginatorInput;
};


export type QueryGetCategoriesArgs = {
  depth?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetFavoriteBranchesWithPricesArgs = {
  productId: Scalars['ID']['input'];
};


export type QueryGetProductNutritionDataArgs = {
  productId: Scalars['ID']['input'];
};


export type QueryGetProductStocksArgs = {
  location?: InputMaybe<LocationInput>;
  productId: Scalars['ID']['input'];
};


export type QueryGoogleOAuthArgs = {
  accessToken: Scalars['String']['input'];
  device?: InputMaybe<AuthDeviceType>;
  ipAddress?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGroceryListArgs = {
  groceryListId: Scalars['ID']['input'];
};


export type QueryGroceryListItemsArgs = {
  groceryListId: Scalars['ID']['input'];
};


export type QueryLoginArgs = {
  device?: InputMaybe<AuthDeviceType>;
  email: Scalars['String']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};


export type QueryMyProductBillingDataArgs = {
  paginator: PaginatorInput;
};


export type QueryMyProductViewHistoryArgs = {
  paginator: PaginatorInput;
};


export type QueryMySearchHistoryArgs = {
  paginator: PaginatorInput;
};


export type QueryPriceChangeHistoryArgs = {
  filters?: InputMaybe<PriceHistoryFilter>;
  paginator: PaginatorInput;
  productId: Scalars['ID']['input'];
  stockId: Scalars['ID']['input'];
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
  viewerTrail?: InputMaybe<ViewerTrailInput>;
};


export type QueryProductBillingDataByUserIdArgs = {
  paginator: PaginatorInput;
  userId: Scalars['ID']['input'];
};


export type QueryStockArgs = {
  stockId: Scalars['ID']['input'];
};


export type QueryVerifyPasswordResetCodeArgs = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};

export type SaveExternalProductInput = {
  brand?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  numPagesToQuery: Scalars['Int']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
  search: Scalars['String']['input'];
  upc?: InputMaybe<Scalars['String']['input']>;
};

export type SearchHistory = {
  __typename?: 'SearchHistory';
  createdAt: Scalars['Time']['output'];
  id: Scalars['ID']['output'];
  searchTerm: Scalars['String']['output'];
};

export type SearchResult = {
  __typename?: 'SearchResult';
  added: Scalars['Int']['output'];
  failed: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type Stock = {
  __typename?: 'Stock';
  branch?: Maybe<Branch>;
  branchId: Scalars['ID']['output'];
  createdAt: Scalars['Time']['output'];
  createdBy?: Maybe<CreatedByUser>;
  createdById?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  latestPrice?: Maybe<Price>;
  latestPriceId: Scalars['ID']['output'];
  product?: Maybe<Product>;
  productId: Scalars['ID']['output'];
  store?: Maybe<Store>;
  storeId: Scalars['ID']['output'];
  updatedAt: Scalars['Time']['output'];
  updatedBy?: Maybe<UpdatedByUser>;
  updatedById?: Maybe<Scalars['ID']['output']>;
};

export type Store = {
  __typename?: 'Store';
  createdBy?: Maybe<CreatedByUser>;
  createdById?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  logo: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedBy?: Maybe<UpdatedByUser>;
  updatedById?: Maybe<Scalars['ID']['output']>;
  website: Scalars['String']['output'];
};

export type UpdateProduct = {
  brand?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  highestRecordedPrice?: InputMaybe<Scalars['Float']['input']>;
  imageBase64?: InputMaybe<Scalars['String']['input']>;
  imageFile?: InputMaybe<Scalars['Upload']['input']>;
  lowestRecordedPrice?: InputMaybe<Scalars['Float']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  quantityType?: InputMaybe<Scalars['String']['input']>;
  quantityValue?: InputMaybe<Scalars['Int']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUser = {
  address?: InputMaybe<Scalars['String']['input']>;
  avatarBase64?: InputMaybe<Scalars['String']['input']>;
  avatarFile?: InputMaybe<Scalars['Upload']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  birthDate?: InputMaybe<Scalars['Time']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserFull = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  avatarBase64?: InputMaybe<Scalars['String']['input']>;
  avatarFile?: InputMaybe<Scalars['Upload']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  birthDate?: InputMaybe<Scalars['Time']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
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
  address?: Maybe<Address>;
  addressId?: Maybe<Scalars['ID']['output']>;
  authDevice?: Maybe<AuthDeviceType>;
  authPlatform?: Maybe<AuthPlatformType>;
  authStateId?: Maybe<Scalars['String']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  birthDate?: Maybe<Scalars['Time']['output']>;
  createdAt: Scalars['Time']['output'];
  email: Scalars['String']['output'];
  expoPushToken?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  updatedAt: Scalars['Time']['output'];
};

export type UserFilter = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
};

export enum UserRole {
  Admin = 'ADMIN',
  Consumer = 'CONSUMER',
  Contributor = 'CONTRIBUTOR',
  SuperAdmin = 'SUPER_ADMIN'
}

export type UserShallow = {
  __typename?: 'UserShallow';
  active?: Maybe<Scalars['Boolean']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ViewerTrailInput = {
  origin?: InputMaybe<Scalars['String']['input']>;
  stockId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateUserByIdMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  input: UpdateUserFull;
}>;


export type UpdateUserByIdMutation = { __typename?: 'Mutation', updateUserById: { __typename?: 'User', id: number, email: string, phoneNumber?: string | null, name: string, avatar?: string | null, birthDate?: any | null, bio?: string | null, active: boolean, role: UserRole, createdAt: any, updatedAt: any } };

export type GetAllUsersQueryVariables = Exact<{
  paginator: PaginatorInput;
  filters?: InputMaybe<UserFilter>;
}>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers: { __typename?: 'PaginatedUsers', users: Array<{ __typename?: 'User', id: number, email: string, phoneNumber?: string | null, name: string, avatar?: string | null, birthDate?: any | null, bio?: string | null, active: boolean, role: UserRole, createdAt: any, updatedAt: any }>, paginator: { __typename?: 'Paginator', next?: number | null, page: number, prev?: number | null, limit: number, total: number, numPages: number } } };

export type ProductBillingDataByUserIdQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  paginator: PaginatorInput;
}>;


export type ProductBillingDataByUserIdQuery = { __typename?: 'Query', productBillingDataByUserId: { __typename?: 'PaginatedProductBilling', data: Array<{ __typename?: 'ProductBilling', id: number, rate: number, userId: number, productId: number, createdAt: any, paidAt?: any | null, billingRateType: string, user?: { __typename?: 'UserShallow', id: number, name: string, avatar?: string | null, active?: boolean | null } | null, product?: { __typename?: 'Product', id: number, name: string, image: string, brand: string, code: string, createdAt: any, updatedAt: any, category?: { __typename?: 'Category', id: number, name: string, expandedPathname: string, path: string } | null } | null }>, paginator: { __typename?: 'Paginator', next?: number | null, page: number, prev?: number | null, limit: number, total: number, numPages: number } } };

export type CreateAccountMutationVariables = Exact<{
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'User', id: number, name: string, email: string, phoneNumber?: string | null, createdAt: any, updatedAt: any, authPlatform?: AuthPlatformType | null, role: UserRole } };

export type VerifyEmailMutationVariables = Exact<{
  verificationCode: Scalars['String']['input'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'User', id: number, name: string, email: string, avatar?: string | null, createdAt: any, updatedAt: any, active: boolean, authPlatform?: AuthPlatformType | null, authStateId?: string | null, role: UserRole } };

export type ResendVerificationMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ResendVerificationMutation = { __typename?: 'Mutation', resendEmailVerificationCode: boolean };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateUser;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'User', id: number, name: string, email: string, avatar?: string | null, createdAt: any, updatedAt: any, active: boolean, authPlatform?: AuthPlatformType | null, authStateId?: string | null, role: UserRole, addressId?: number | null, birthDate?: any | null, phoneNumber?: string | null, bio?: string | null, address?: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string } | null } };

export type CreateStoreMutationVariables = Exact<{
  input: CreateStore;
}>;


export type CreateStoreMutation = { __typename?: 'Mutation', createStore: { __typename?: 'Store', id: number, name: string, logo: string, website: string, createdById?: number | null, updatedById?: number | null } };

export type CreateBranchFromFullAddressMutationVariables = Exact<{
  storeId: Scalars['ID']['input'];
  fullAddress: Scalars['String']['input'];
}>;


export type CreateBranchFromFullAddressMutation = { __typename?: 'Mutation', createBranchWithFullAddress: { __typename?: 'Branch', id: number, name: string, addressId: number, storeId: number, address: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string } } };

export type CreateBranchMutationVariables = Exact<{
  input: CreateBranch;
}>;


export type CreateBranchMutation = { __typename?: 'Mutation', createBranch: { __typename?: 'Branch', id: number, name: string, addressId: number, storeId: number, address: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string } } };

export type CreateProductMutationVariables = Exact<{
  input: CreateProduct;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'Product', id: number, name: string, image: string, description: string, url?: string | null, brand: string, code: string, color?: string | null, model?: string | null, categoryId: number, weightValue?: number | null, weightType?: string | null, lowestRecordedPrice?: number | null, highestRecordedPrice?: number | null, createdAt: any, updatedAt: any, category?: { __typename?: 'Category', id: number, name: string, expandedPathname: string, path: string } | null } };

export type UpdateProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateProduct;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct: { __typename?: 'Product', id: number, name: string, image: string, description: string, url?: string | null, brand: string, code: string, color?: string | null, model?: string | null, categoryId: number, weightValue?: number | null, weightType?: string | null, lowestRecordedPrice?: number | null, highestRecordedPrice?: number | null, createdAt: any, updatedAt: any, category?: { __typename?: 'Category', id: number, name: string, expandedPathname: string, path: string } | null } };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategory;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', id: number, name: string, path: string, expandedPathname: string, categoryAlias?: string | null, depth?: number | null } };

export type CreatePriceMutationVariables = Exact<{
  input: CreatePrice;
}>;


export type CreatePriceMutation = { __typename?: 'Mutation', createPrice: { __typename?: 'Price', id: number, amount: number, currencyCode: string, productId: number, storeId: number, branchId: number, product?: { __typename?: 'Product', id: number, name: string, brand: string, category?: { __typename?: 'Category', id: number, expandedPathname: string } | null } | null, store?: { __typename?: 'Store', id: number, name: string } | null, branch?: { __typename?: 'Branch', id: number, name: string, address: { __typename?: 'Address', id: number, fullAddress: string } } | null } };

export type AddToListMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
  productId: Scalars['ID']['input'];
  stockId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type AddToListMutation = { __typename?: 'Mutation', addToList: { __typename?: 'ProductList', id: number, userId: number, listId: number, productId: number, stockId?: number | null, createdAt: any } };

export type RemoveFromListMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
  productListId: Scalars['ID']['input'];
}>;


export type RemoveFromListMutation = { __typename?: 'Mutation', removeFromList: { __typename?: 'ProductList', id: number, userId: number, listId: number, productId: number, stockId?: number | null, createdAt: any } };

export type RemoveFromListWithProductIdMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
  productId: Scalars['ID']['input'];
  stockId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type RemoveFromListWithProductIdMutation = { __typename?: 'Mutation', removeFromListWithProductId: { __typename?: 'ProductList', id: number, userId: number, listId: number, productId: number, stockId?: number | null, createdAt: any } };

export type AddBranchToListMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
  branchId: Scalars['ID']['input'];
}>;


export type AddBranchToListMutation = { __typename?: 'Mutation', addBranchToList: { __typename?: 'BranchList', id: number, userId: number, listId: number, branchId: number, createdAt: any } };

export type BulkAddBranchesToListMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
  branchIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type BulkAddBranchesToListMutation = { __typename?: 'Mutation', bulkAddBranchesToList: Array<{ __typename?: 'BranchList', id: number, userId: number, listId: number, branchId: number, createdAt: any }> };

export type RemoveBranchFromListMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
  branchListId: Scalars['ID']['input'];
}>;


export type RemoveBranchFromListMutation = { __typename?: 'Mutation', removeBranchFromList: { __typename?: 'BranchList', id: number, userId: number, listId: number, branchId: number, createdAt: any } };

export type RequestResetPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type RequestResetPasswordMutation = { __typename?: 'Mutation', requestPasswordReset: boolean };

export type UpdatePasswordWithResetCodeMutationVariables = Exact<{
  email: Scalars['String']['input'];
  code: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type UpdatePasswordWithResetCodeMutation = { __typename?: 'Mutation', updatePasswordWithResetCode: boolean };

export type RegisterExpoPushTokenMutationVariables = Exact<{
  expoPushToken: Scalars['String']['input'];
}>;


export type RegisterExpoPushTokenMutation = { __typename?: 'Mutation', registerExpoPushToken: { __typename?: 'User', id: number, name: string, email: string, avatar?: string | null, createdAt: any, updatedAt: any, active: boolean, authPlatform?: AuthPlatformType | null, authStateId?: string | null, expoPushToken?: string | null, role: UserRole, addressId?: number | null, address?: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string } | null } };

export type UpdateProductNutritionDataMutationVariables = Exact<{
  productId: Scalars['ID']['input'];
}>;


export type UpdateProductNutritionDataMutation = { __typename?: 'Mutation', updateProductNutritionData: { __typename?: 'ProductNutrition', productId: number, openfoodfactsUpdatedAt: string, createdAt: any, updatedAt: any } };

export type GetAllCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCountriesQuery = { __typename?: 'Query', getAllCountries: Array<{ __typename?: 'Country', code: string, name: string, callingCode?: string | null, language?: string | null, administrativeDivisions: Array<{ __typename?: 'AdministrativeDivision', name: string, cities: string }>, currency?: { __typename?: 'Currency', currencyCode: string, name: string, symbol: string, symbolNative: string, decimals: number, numToBasic?: number | null } | null }> };

export type BarcodeScanQueryVariables = Exact<{
  barcode: Scalars['String']['input'];
  searchMode?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type BarcodeScanQuery = { __typename?: 'Query', barcodeScan: { __typename?: 'Product', id: number, name: string, image: string, description: string, url?: string | null, brand: string, code: string, color?: string | null, model?: string | null, categoryId: number, weightValue?: number | null, weightType?: string | null, quantityValue: number, quantityType: string, lowestRecordedPrice?: number | null, highestRecordedPrice?: number | null, createdAt: any, updatedAt: any, category?: { __typename?: 'Category', id: number, name: string, expandedPathname: string, path: string } | null } };

export type UserFieldsFragment = { __typename?: 'User', id: number, name: string, email: string, avatar?: string | null, createdAt: any, updatedAt: any, active: boolean, authPlatform?: AuthPlatformType | null, authStateId?: string | null, role: UserRole } & { ' $fragmentName'?: 'UserFieldsFragment' };

export type LoginInternalQueryVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  device?: InputMaybe<AuthDeviceType>;
}>;


export type LoginInternalQuery = { __typename?: 'Query', login: { __typename?: 'Auth', token: string, user: { __typename?: 'User', id: number, name: string, email: string, avatar?: string | null, createdAt: any, updatedAt: any, active: boolean, authPlatform?: AuthPlatformType | null, authStateId?: string | null, expoPushToken?: string | null, role: UserRole, addressId?: number | null, address?: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string } | null } } };

export type GoogleOAuthQueryVariables = Exact<{
  accessToken: Scalars['String']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  device?: InputMaybe<AuthDeviceType>;
}>;


export type GoogleOAuthQuery = { __typename?: 'Query', googleOAuth: { __typename?: 'Auth', token: string, isNewUser?: boolean | null, user: { __typename?: 'User', id: number, name: string, email: string, avatar?: string | null, createdAt: any, updatedAt: any, active: boolean, authPlatform?: AuthPlatformType | null, authStateId?: string | null, expoPushToken?: string | null, role: UserRole, addressId?: number | null, address?: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string } | null } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, name: string, email: string, avatar?: string | null, createdAt: any, updatedAt: any, active: boolean, authPlatform?: AuthPlatformType | null, authStateId?: string | null, expoPushToken?: string | null, role: UserRole, addressId?: number | null, birthDate?: any | null, phoneNumber?: string | null, bio?: string | null, address?: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string } | null } };

export type AllProductsQueryVariables = Exact<{
  paginator: PaginatorInput;
  search?: InputMaybe<ProductSearch>;
}>;


export type AllProductsQuery = { __typename?: 'Query', allProducts: { __typename?: 'PaginatedProducts', products: Array<{ __typename?: 'Product', id: number, name: string, image: string, description: string, url?: string | null, brand: string, code: string, color?: string | null, model?: string | null, categoryId: number, weightValue?: number | null, weightType?: string | null, quantityValue: number, quantityType: string, lowestRecordedPrice?: number | null, highestRecordedPrice?: number | null, createdAt: any, updatedAt: any, views: number, category?: { __typename?: 'Category', id: number, name: string, expandedPathname: string, path: string } | null, stock?: { __typename?: 'Stock', id: number, productId: number, storeId: number, branchId: number, latestPriceId: number, store?: { __typename?: 'Store', id: number, name: string, logo: string } | null, branch?: { __typename?: 'Branch', id: number, name: string, address: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string, distance?: number | null } } | null, latestPrice?: { __typename?: 'Price', id: number, productId: number, branchId: number, storeId: number, amount: number, currencyCode: string, createdAt: any, sale: boolean, originalPrice?: number | null, condition?: string | null, expiresAt?: any | null, unitType: string } | null } | null, createdBy?: { __typename?: 'CreatedByUser', id: number, name: string, avatar?: string | null } | null, updatedBy?: { __typename?: 'UpdatedByUser', id: number, name: string, avatar?: string | null } | null }>, paginator: { __typename?: 'Paginator', next?: number | null, page: number, prev?: number | null, limit: number, total: number, numPages: number } } };

export type ProductQueryVariables = Exact<{
  productId: Scalars['ID']['input'];
  viewerTrail?: InputMaybe<ViewerTrailInput>;
}>;


export type ProductQuery = { __typename?: 'Query', product: { __typename?: 'Product', id: number, name: string, image: string, description: string, url?: string | null, brand: string, code: string, color?: string | null, model?: string | null, categoryId: number, weightValue?: number | null, weightType?: string | null, quantityValue: number, quantityType: string, lowestRecordedPrice?: number | null, highestRecordedPrice?: number | null, createdAt: any, updatedAt: any, views: number, category?: { __typename?: 'Category', id: number, name: string, categoryAlias?: string | null, expandedPathname: string, path: string } | null, createdBy?: { __typename?: 'CreatedByUser', id: number, name: string, avatar?: string | null } | null, productList: Array<{ __typename?: 'ProductList', id: number, listId: number, userId: number, productId: number, type?: ListType | null, stockId?: number | null, createdAt: any }> } };

export type GetProductStocksQueryVariables = Exact<{
  productId: Scalars['ID']['input'];
  location?: InputMaybe<LocationInput>;
}>;


export type GetProductStocksQuery = { __typename?: 'Query', getProductStocks: Array<{ __typename?: 'Stock', id: number, productId: number, storeId: number, branchId: number, latestPriceId: number, createdAt: any, updatedAt: any, store?: { __typename?: 'Store', id: number, name: string, logo: string } | null, branch?: { __typename?: 'Branch', id: number, name: string, address: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string, distance?: number | null } } | null, latestPrice?: { __typename?: 'Price', id: number, productId: number, branchId: number, storeId: number, amount: number, currencyCode: string, sale: boolean, originalPrice?: number | null, condition?: string | null, expiresAt?: any | null, unitType: string } | null, createdBy?: { __typename?: 'CreatedByUser', id: number, name: string, avatar?: string | null } | null, updatedBy?: { __typename?: 'UpdatedByUser', id: number, name: string, avatar?: string | null } | null }> };

export type AllStoresQueryVariables = Exact<{
  paginator: PaginatorInput;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type AllStoresQuery = { __typename?: 'Query', allStores: { __typename?: 'PaginatedStores', stores: Array<{ __typename?: 'Store', id: number, name: string, logo: string, website: string, createdBy?: { __typename?: 'CreatedByUser', id: number, name: string, avatar?: string | null } | null }>, paginator: { __typename?: 'Paginator', next?: number | null, page: number, prev?: number | null, limit: number, total: number, numPages: number } } };

export type FindStoreQueryVariables = Exact<{
  storeId: Scalars['ID']['input'];
  paginator: PaginatorInput;
  search?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<LocationInput>;
}>;


export type FindStoreQuery = { __typename?: 'Query', findStore: { __typename?: 'Store', id: number, name: string, logo: string, website: string, createdBy?: { __typename?: 'CreatedByUser', id: number, name: string, avatar?: string | null } | null }, allBranches: { __typename?: 'PaginatedBranches', branches: Array<{ __typename?: 'Branch', id: number, name: string, addressId: number, storeId: number, address: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string } }>, paginator: { __typename?: 'Paginator', next?: number | null, page: number, prev?: number | null, limit: number, total: number, numPages: number } } };

export type AllBranchesQueryVariables = Exact<{
  storeId: Scalars['ID']['input'];
  paginator: PaginatorInput;
  search?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<LocationInput>;
}>;


export type AllBranchesQuery = { __typename?: 'Query', allBranches: { __typename?: 'PaginatedBranches', branches: Array<{ __typename?: 'Branch', id: number, name: string, addressId: number, storeId: number, address: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string, distance?: number | null } }>, paginator: { __typename?: 'Paginator', next?: number | null, page: number, prev?: number | null, limit: number, total: number, numPages: number } } };

export type BranchQueryVariables = Exact<{
  branchId: Scalars['ID']['input'];
  storeId: Scalars['ID']['input'];
}>;


export type BranchQuery = { __typename?: 'Query', findBranch: { __typename?: 'Branch', id: number, name: string, addressId: number, storeId: number, address: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string } }, findStore: { __typename?: 'Store', id: number, name: string, logo: string, website: string } };

export type FindBranchQueryVariables = Exact<{
  branchId: Scalars['ID']['input'];
  storeId: Scalars['ID']['input'];
}>;


export type FindBranchQuery = { __typename?: 'Query', findBranch: { __typename?: 'Branch', id: number, name: string, addressId: number, storeId: number, address: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string } } };

export type AllBrandsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllBrandsQuery = { __typename?: 'Query', allBrands: Array<{ __typename?: 'Brand', brand: string, products: any }> };

export type FindBranchesByDistanceQueryVariables = Exact<{
  lat: Scalars['Float']['input'];
  lon: Scalars['Float']['input'];
  radiusMeters: Scalars['Int']['input'];
}>;


export type FindBranchesByDistanceQuery = { __typename?: 'Query', findBranchesByDistance: Array<{ __typename?: 'Branch', id: number, name: string, storeId: number, addressId: number, store?: { __typename?: 'Store', id: number, name: string, website: string, logo: string } | null, address: { __typename?: 'Address', id: number, distance?: number | null, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string } }> };

export type GetCategoriesQueryVariables = Exact<{
  depth?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetCategoriesQuery = { __typename?: 'Query', getCategories: Array<{ __typename?: 'Category', id: number, name: string, path: string, expandedPathname: string, categoryAlias?: string | null, depth?: number | null }> };

export type MyProductBillingDataQueryVariables = Exact<{
  paginator: PaginatorInput;
}>;


export type MyProductBillingDataQuery = { __typename?: 'Query', myProductBillingData: { __typename?: 'PaginatedProductBilling', data: Array<{ __typename?: 'ProductBilling', id: number, rate: number, userId: number, productId: number, createdAt: any, paidAt?: any | null, billingRateType: string, user?: { __typename?: 'UserShallow', id: number, name: string, avatar?: string | null, active?: boolean | null } | null, product?: { __typename?: 'Product', id: number, name: string, image: string, brand: string, code: string, createdAt: any, updatedAt: any, category?: { __typename?: 'Category', id: number, name: string, expandedPathname: string, path: string } | null } | null }>, paginator: { __typename?: 'Paginator', next?: number | null, page: number, prev?: number | null, limit: number, total: number, numPages: number } } };

export type GetAllListsQueryVariables = Exact<{
  listType?: InputMaybe<ListType>;
}>;


export type GetAllListsQuery = { __typename?: 'Query', getAllLists: Array<{ __typename?: 'List', id: number, name: string, type: ListType, userId: number, createdAt: any, productList?: Array<{ __typename?: 'ProductList', id: number, listId: number, productId: number, stockId?: number | null, createdAt: any, product?: { __typename?: 'Product', id: number, name: string, image: string, description: string, url?: string | null, brand: string, code: string, color?: string | null, model?: string | null, categoryId: number, weightValue?: number | null, weightType?: string | null, quantityValue: number, quantityType: string, lowestRecordedPrice?: number | null, highestRecordedPrice?: number | null, createdAt: any, updatedAt: any, category?: { __typename?: 'Category', id: number, name: string, expandedPathname: string, path: string } | null } | null, stock?: { __typename?: 'Stock', id: number, productId: number, storeId: number, branchId: number, latestPriceId: number, latestPrice?: { __typename?: 'Price', id: number, productId: number, branchId: number, storeId: number, amount: number, currencyCode: string, createdAt: any, sale: boolean, originalPrice?: number | null, condition?: string | null, expiresAt?: any | null, unitType: string } | null } | null }> | null, branchList?: Array<{ __typename?: 'BranchList', id: number, listId: number, branchId: number, createdAt: any, branch?: { __typename?: 'Branch', id: number, name: string, address: { __typename?: 'Address', id: number, distance?: number | null, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string } } | null }> | null }> };

export type StockQueryVariables = Exact<{
  stockId: Scalars['ID']['input'];
}>;


export type StockQuery = { __typename?: 'Query', stock: { __typename?: 'Stock', id: number, productId: number, storeId: number, branchId: number, latestPriceId: number, createdAt: any, updatedAt: any, store?: { __typename?: 'Store', id: number, name: string, logo: string } | null, branch?: { __typename?: 'Branch', id: number, name: string, address: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string, distance?: number | null } } | null, latestPrice?: { __typename?: 'Price', id: number, productId: number, branchId: number, storeId: number, amount: number, currencyCode: string, sale: boolean, originalPrice?: number | null, condition?: string | null, expiresAt?: any | null, createdAt: any, unitType: string } | null, createdBy?: { __typename?: 'CreatedByUser', id: number, name: string, avatar?: string | null } | null, updatedBy?: { __typename?: 'UpdatedByUser', id: number, name: string, avatar?: string | null } | null } };

export type FavoriteBranchesWithPricesQueryVariables = Exact<{
  productId: Scalars['ID']['input'];
}>;


export type FavoriteBranchesWithPricesQuery = { __typename?: 'Query', getFavoriteBranchesWithPrices: Array<{ __typename?: 'BranchListWithPrices', id: number, branchId: number, approximatePrice?: number | null, branch?: { __typename?: 'Branch', id: number, name: string, store?: { __typename?: 'Store', id: number, name: string, logo: string } | null, address: { __typename?: 'Address', id: number, distance?: number | null, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string } } | null, stock?: { __typename?: 'Stock', id: number, productId: number, storeId: number, branchId: number, latestPriceId: number, latestPrice?: { __typename?: 'Price', id: number, productId: number, branchId: number, storeId: number, amount: number, currencyCode: string, createdAt: any, sale: boolean, originalPrice?: number | null, condition?: string | null, expiresAt?: any | null, unitType: string, createdBy?: { __typename?: 'CreatedByUser', id: number, name: string, avatar?: string | null } | null, updatedBy?: { __typename?: 'UpdatedByUser', id: number, name: string, avatar?: string | null } | null } | null } | null }> };

export type VerifyPasswordResetCodeQueryVariables = Exact<{
  email: Scalars['String']['input'];
  code: Scalars['String']['input'];
}>;


export type VerifyPasswordResetCodeQuery = { __typename?: 'Query', verifyPasswordResetCode: boolean };

export type GetAllProductListsByListIdQueryVariables = Exact<{
  listId: Scalars['ID']['input'];
}>;


export type GetAllProductListsByListIdQuery = { __typename?: 'Query', getAllProductListsByListId: Array<{ __typename?: 'ProductList', id: number, listId: number, userId: number, productId: number, type?: ListType | null, stockId?: number | null, createdAt: any, product?: { __typename?: 'Product', id: number, name: string, image: string, description: string, url?: string | null, brand: string, code: string, color?: string | null, model?: string | null, categoryId: number, weightValue?: number | null, weightType?: string | null, quantityValue: number, quantityType: string, lowestRecordedPrice?: number | null, highestRecordedPrice?: number | null, createdAt: any, updatedAt: any, category?: { __typename?: 'Category', id: number, name: string, expandedPathname: string, path: string } | null } | null, stock?: { __typename?: 'Stock', id: number, productId: number, storeId: number, branchId: number, latestPriceId: number, store?: { __typename?: 'Store', id: number, name: string, logo: string } | null, branch?: { __typename?: 'Branch', id: number, name: string, address: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string } } | null, latestPrice?: { __typename?: 'Price', id: number, productId: number, branchId: number, storeId: number, amount: number, currencyCode: string, createdAt: any, sale: boolean, originalPrice?: number | null, condition?: string | null, expiresAt?: any | null, unitType: string } | null } | null }> };

export type GetAllBranchListsByListIdQueryVariables = Exact<{
  listId: Scalars['ID']['input'];
}>;


export type GetAllBranchListsByListIdQuery = { __typename?: 'Query', getAllBranchListsByListId: Array<{ __typename?: 'BranchList', id: number, listId: number, branchId: number, createdAt: any, branch?: { __typename?: 'Branch', id: number, name: string, storeId: number, address: { __typename?: 'Address', id: number, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string }, store?: { __typename?: 'Store', id: number, name: string, logo: string } | null } | null }> };

export type ExtractProductFieldsQueryVariables = Exact<{
  base64Image: Scalars['String']['input'];
}>;


export type ExtractProductFieldsQuery = { __typename?: 'Query', extractProductFields: { __typename?: 'ProductExtractionResponse', brand: string, name: string, weight?: string | null, quantity?: number | null, categoryId?: number | null, category?: { __typename?: 'Category', id: number, name: string, expandedPathname: string, path: string } | null } };

export type CheckAppVersionQueryVariables = Exact<{
  platform: AuthDeviceType;
  version: Scalars['String']['input'];
}>;


export type CheckAppVersionQuery = { __typename?: 'Query', checkAppVersion: boolean };

export type PriceChangeHistoryQueryVariables = Exact<{
  productId: Scalars['ID']['input'];
  stockId: Scalars['ID']['input'];
  paginator: PaginatorInput;
  filters?: InputMaybe<PriceHistoryFilter>;
}>;


export type PriceChangeHistoryQuery = { __typename?: 'Query', priceChangeHistory: { __typename?: 'PaginatedPriceHistory', prices: Array<{ __typename?: 'Price', id: number, productId: number, stockId: number, branchId: number, storeId: number, amount: number, originalPrice?: number | null, sale: boolean, expiresAt?: any | null, condition?: string | null, unitType: string, currencyCode: string, createdAt: any, createdBy?: { __typename?: 'CreatedByUser', id: number, name: string, avatar?: string | null } | null, updatedBy?: { __typename?: 'UpdatedByUser', id: number, name: string, avatar?: string | null } | null }>, paginator: { __typename?: 'Paginator', next?: number | null, page: number, prev?: number | null, limit: number, total: number, numPages: number } } };

export type BranchesWithProductsQueryVariables = Exact<{
  paginator: PaginatorInput;
  productLimit: Scalars['Int']['input'];
  filters?: InputMaybe<ProductSearch>;
}>;


export type BranchesWithProductsQuery = { __typename?: 'Query', branchesWithProducts: { __typename?: 'PaginatedBranches', branches: Array<{ __typename?: 'Branch', id: number, name: string, storeId: number, store?: { __typename?: 'Store', id: number, name: string, logo: string } | null, address: { __typename?: 'Address', id: number, distance?: number | null, latitude: number, longitude: number, mapsLink: string, fullAddress: string, street?: string | null, city: string, administrativeDivision: string, countryCode: string, country?: string | null, zipCode: string }, products?: Array<{ __typename?: 'Product', id: number, name: string, image: string, description: string, url?: string | null, brand: string, code: string, color?: string | null, model?: string | null, categoryId: number, weightValue?: number | null, weightType?: string | null, quantityValue: number, quantityType: string, lowestRecordedPrice?: number | null, highestRecordedPrice?: number | null, createdAt: any, updatedAt: any, views: number, category?: { __typename?: 'Category', id: number, name: string, expandedPathname: string, path: string } | null, stock?: { __typename?: 'Stock', id: number, productId: number, storeId: number, branchId: number, latestPriceId: number, latestPrice?: { __typename?: 'Price', id: number, productId: number, branchId: number, storeId: number, amount: number, currencyCode: string, createdAt: any, sale: boolean, originalPrice?: number | null, condition?: string | null, expiresAt?: any | null, unitType: string } | null } | null, createdBy?: { __typename?: 'CreatedByUser', id: number, name: string, avatar?: string | null } | null, updatedBy?: { __typename?: 'UpdatedByUser', id: number, name: string, avatar?: string | null } | null }> | null }>, paginator: { __typename?: 'Paginator', next?: number | null, page: number, prev?: number | null, limit: number, total: number, numPages: number } } };

export type GetProductNutritionDataQueryVariables = Exact<{
  productId: Scalars['ID']['input'];
}>;


export type GetProductNutritionDataQuery = { __typename?: 'Query', getProductNutritionData: { __typename?: 'ProductNutrition', productId: number, servingSize?: string | null, servingSizeUnit?: string | null, servingSizeValue?: number | null, ingredientText?: string | null, ingredientList?: Array<string> | null, vegan?: boolean | null, vegetarian?: boolean | null, glutenFree?: boolean | null, lactoseFree?: boolean | null, halal?: boolean | null, kosher?: boolean | null, createdAt: any, updatedAt: any, nutriments?: { __typename?: 'ProductNutriment', salt?: number | null, salt100g?: number | null, saltValue?: number | null, saltServing?: number | null, saltUnit?: string | null, sugars?: number | null, sugars100g?: number | null, sugarsValue?: number | null, sugarsServing?: number | null, sugarsUnit?: string | null, iron?: number | null, iron100g?: number | null, ironValue?: number | null, ironServing?: number | null, ironUnit?: string | null, ironLabel?: string | null, calcium?: number | null, calcium100g?: number | null, calciumValue?: number | null, calciumServing?: number | null, calciumUnit?: string | null, calciumLabel?: string | null, cholesterol100g?: number | null, saturatedFat?: number | null, saturatedFat100g?: number | null, saturatedFatValue?: number | null, saturatedFatServing?: number | null, saturatedFatUnit?: string | null, fat?: number | null, fat100g?: number | null, fatValue?: number | null, fatServing?: number | null, fatUnit?: string | null, transFat?: number | null, transFat100g?: number | null, transFatValue?: number | null, transFatServing?: number | null, transFatUnit?: string | null, transFatLabel?: string | null, vitaminA?: number | null, vitaminA100g?: number | null, vitaminAValue?: number | null, vitaminAServing?: number | null, vitaminAUnit?: string | null, vitaminALabel?: string | null, vitaminC?: number | null, vitaminC100g?: number | null, vitaminCValue?: number | null, vitaminCServing?: number | null, vitaminCUnit?: string | null, vitaminCLabel?: string | null, proteins?: number | null, proteins100g?: number | null, proteinsValue?: number | null, proteinsServing?: number | null, proteinsUnit?: string | null, fiber?: number | null, fiber100g?: number | null, fiberValue?: number | null, fiberServing?: number | null, fiberUnit?: string | null, carbohydrates?: number | null, carbohydrates100g?: number | null, carbohydratesValue?: number | null, carbohydratesServing?: number | null, carbohydratesUnit?: string | null, alcohol?: number | null, alcohol100g?: number | null, alcoholValue?: number | null, alcoholServing?: number | null, alcoholUnit?: string | null, sodium?: number | null, sodium100g?: number | null, sodiumValue?: number | null, sodiumServing?: number | null, sodiumUnit?: string | null, potassium100g?: number | null, polyunsaturatedFat100g?: number | null, monounsaturatedFat100g?: number | null, novaGroup?: number | null, novaGroup100g?: number | null, novaGroupServing?: number | null, energy?: number | null, energy100g?: number | null, energyValue?: number | null, energyServing?: number | null, energyUnit?: string | null, energyKcal?: number | null, energyKcal100g?: number | null, energyKcalValue?: number | null, energyKcalServing?: number | null, energyKcalUnit?: string | null, nutritionScoreFr?: number | null, nutritionScoreFr100g?: number | null, nutritionScoreFrServing?: number | null, nutritionScoreUk?: number | null, nutritionScoreUk100g?: number | null, nutritionScoreUkServing?: number | null } | null } };

export type MySearchHistoryQueryVariables = Exact<{
  paginator: PaginatorInput;
}>;


export type MySearchHistoryQuery = { __typename?: 'Query', mySearchHistory: { __typename?: 'PaginatedSearch', searches: Array<{ __typename?: 'SearchHistory', id: number, searchTerm: string }>, paginator: { __typename?: 'Paginator', next?: number | null, page: number, prev?: number | null, limit: number, total: number, numPages: number } } };

export const UserFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"authPlatform"}},{"kind":"Field","name":{"kind":"Name","value":"authStateId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<UserFieldsFragment, unknown>;
export const UpdateUserByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserFull"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateUserByIdMutation, UpdateUserByIdMutationVariables>;
export const GetAllUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginatorInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginator"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paginator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"prev"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"numPages"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const ProductBillingDataByUserIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProductBillingDataByUserId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginatorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productBillingDataByUserId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"paginator"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"expandedPathname"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}},{"kind":"Field","name":{"kind":"Name","value":"billingRateType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paginator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"prev"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"numPages"}}]}}]}}]}}]} as unknown as DocumentNode<ProductBillingDataByUserIdQuery, ProductBillingDataByUserIdQueryVariables>;
export const CreateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authPlatform"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const VerifyEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verificationCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"verificationCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verificationCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"authPlatform"}},{"kind":"Field","name":{"kind":"Name","value":"authStateId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const ResendVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResendVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendEmailVerificationCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<ResendVerificationMutation, ResendVerificationMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUser"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"authPlatform"}},{"kind":"Field","name":{"kind":"Name","value":"authStateId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const CreateStoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateStore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateStore"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"createdById"}},{"kind":"Field","name":{"kind":"Name","value":"updatedById"}}]}}]}}]} as unknown as DocumentNode<CreateStoreMutation, CreateStoreMutationVariables>;
export const CreateBranchFromFullAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBranchFromFullAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fullAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBranchWithFullAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fullAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fullAddress"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}}]}}]} as unknown as DocumentNode<CreateBranchFromFullAddressMutation, CreateBranchFromFullAddressMutationVariables>;
export const CreateBranchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBranch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBranch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBranch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}}]}}]} as unknown as DocumentNode<CreateBranchMutation, CreateBranchMutationVariables>;
export const CreateProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProduct"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"expandedPathname"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"weightValue"}},{"kind":"Field","name":{"kind":"Name","value":"weightType"}},{"kind":"Field","name":{"kind":"Name","value":"lowestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"highestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateProductMutation, CreateProductMutationVariables>;
export const UpdateProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProduct"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"expandedPathname"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"weightValue"}},{"kind":"Field","name":{"kind":"Name","value":"weightType"}},{"kind":"Field","name":{"kind":"Name","value":"lowestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"highestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateProductMutation, UpdateProductMutationVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCategory"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"expandedPathname"}},{"kind":"Field","name":{"kind":"Name","value":"categoryAlias"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}}]}}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const CreatePriceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePrice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePrice"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPrice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"expandedPathname"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"branch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreatePriceMutation, CreatePriceMutationVariables>;
export const AddToListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddToList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stockId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addToList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"listId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}},{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}},{"kind":"Argument","name":{"kind":"Name","value":"stockId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stockId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"listId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"stockId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<AddToListMutation, AddToListMutationVariables>;
export const RemoveFromListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveFromList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productListId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeFromList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"listId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}},{"kind":"Argument","name":{"kind":"Name","value":"productListId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productListId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"listId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"stockId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<RemoveFromListMutation, RemoveFromListMutationVariables>;
export const RemoveFromListWithProductIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveFromListWithProductId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stockId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeFromListWithProductId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"listId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}},{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}},{"kind":"Argument","name":{"kind":"Name","value":"stockId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stockId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"listId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"stockId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<RemoveFromListWithProductIdMutation, RemoveFromListWithProductIdMutationVariables>;
export const AddBranchToListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddBranchToList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"branchId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addBranchToList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"listId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}},{"kind":"Argument","name":{"kind":"Name","value":"branchId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"branchId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"listId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<AddBranchToListMutation, AddBranchToListMutationVariables>;
export const BulkAddBranchesToListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkAddBranchesToList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"branchIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkAddBranchesToList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"listId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}},{"kind":"Argument","name":{"kind":"Name","value":"branchIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"branchIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"listId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<BulkAddBranchesToListMutation, BulkAddBranchesToListMutationVariables>;
export const RemoveBranchFromListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveBranchFromList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"branchListId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeBranchFromList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"listId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}},{"kind":"Argument","name":{"kind":"Name","value":"branchListId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"branchListId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"listId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<RemoveBranchFromListMutation, RemoveBranchFromListMutationVariables>;
export const RequestResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestPasswordReset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<RequestResetPasswordMutation, RequestResetPasswordMutationVariables>;
export const UpdatePasswordWithResetCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePasswordWithResetCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePasswordWithResetCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}}]}]}}]} as unknown as DocumentNode<UpdatePasswordWithResetCodeMutation, UpdatePasswordWithResetCodeMutationVariables>;
export const RegisterExpoPushTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterExpoPushToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expoPushToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerExpoPushToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"expoPushToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expoPushToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"authPlatform"}},{"kind":"Field","name":{"kind":"Name","value":"authStateId"}},{"kind":"Field","name":{"kind":"Name","value":"expoPushToken"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterExpoPushTokenMutation, RegisterExpoPushTokenMutationVariables>;
export const UpdateProductNutritionDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProductNutritionData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProductNutritionData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"openfoodfactsUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateProductNutritionDataMutation, UpdateProductNutritionDataMutationVariables>;
export const GetAllCountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivisions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"cities"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"symbolNative"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"numToBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"callingCode"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]} as unknown as DocumentNode<GetAllCountriesQuery, GetAllCountriesQueryVariables>;
export const BarcodeScanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BarcodeScan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"barcode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchMode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"barcodeScan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"barcode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"barcode"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchMode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchMode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"expandedPathname"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"weightValue"}},{"kind":"Field","name":{"kind":"Name","value":"weightType"}},{"kind":"Field","name":{"kind":"Name","value":"quantityValue"}},{"kind":"Field","name":{"kind":"Name","value":"quantityType"}},{"kind":"Field","name":{"kind":"Name","value":"lowestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"highestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<BarcodeScanQuery, BarcodeScanQueryVariables>;
export const LoginInternalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoginInternal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ipAddress"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"device"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthDeviceType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"ipAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ipAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"device"},"value":{"kind":"Variable","name":{"kind":"Name","value":"device"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"authPlatform"}},{"kind":"Field","name":{"kind":"Name","value":"authStateId"}},{"kind":"Field","name":{"kind":"Name","value":"expoPushToken"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LoginInternalQuery, LoginInternalQueryVariables>;
export const GoogleOAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GoogleOAuth"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ipAddress"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"device"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthDeviceType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"googleOAuth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accessToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}}},{"kind":"Argument","name":{"kind":"Name","value":"device"},"value":{"kind":"Variable","name":{"kind":"Name","value":"device"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"authPlatform"}},{"kind":"Field","name":{"kind":"Name","value":"authStateId"}},{"kind":"Field","name":{"kind":"Name","value":"expoPushToken"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"isNewUser"}}]}}]}}]} as unknown as DocumentNode<GoogleOAuthQuery, GoogleOAuthQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"authPlatform"}},{"kind":"Field","name":{"kind":"Name","value":"authStateId"}},{"kind":"Field","name":{"kind":"Name","value":"expoPushToken"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const AllProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginatorInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductSearch"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allProducts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginator"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"expandedPathname"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stock"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"branch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"distance"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestPriceId"}},{"kind":"Field","name":{"kind":"Name","value":"latestPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"sale"}},{"kind":"Field","name":{"kind":"Name","value":"originalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"unitType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"weightValue"}},{"kind":"Field","name":{"kind":"Name","value":"weightType"}},{"kind":"Field","name":{"kind":"Name","value":"quantityValue"}},{"kind":"Field","name":{"kind":"Name","value":"quantityType"}},{"kind":"Field","name":{"kind":"Name","value":"lowestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"highestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paginator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"prev"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"numPages"}}]}}]}}]}}]} as unknown as DocumentNode<AllProductsQuery, AllProductsQueryVariables>;
export const ProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Product"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"viewerTrail"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ViewerTrailInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}},{"kind":"Argument","name":{"kind":"Name","value":"viewerTrail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"viewerTrail"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"categoryAlias"}},{"kind":"Field","name":{"kind":"Name","value":"expandedPathname"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"weightValue"}},{"kind":"Field","name":{"kind":"Name","value":"weightType"}},{"kind":"Field","name":{"kind":"Name","value":"quantityValue"}},{"kind":"Field","name":{"kind":"Name","value":"quantityType"}},{"kind":"Field","name":{"kind":"Name","value":"lowestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"highestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"productList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"listId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"stockId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<ProductQuery, ProductQueryVariables>;
export const GetProductStocksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductStocks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LocationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProductStocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}},{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"branch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"distance"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestPriceId"}},{"kind":"Field","name":{"kind":"Name","value":"latestPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"sale"}},{"kind":"Field","name":{"kind":"Name","value":"originalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"unitType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<GetProductStocksQuery, GetProductStocksQueryVariables>;
export const AllStoresDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllStores"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginatorInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allStores"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginator"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"paginator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"prev"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"numPages"}}]}}]}}]}}]} as unknown as DocumentNode<AllStoresQuery, AllStoresQueryVariables>;
export const FindStoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindStore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginatorInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LocationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allBranches"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}}},{"kind":"Argument","name":{"kind":"Name","value":"paginator"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"branches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"paginator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"prev"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"numPages"}}]}}]}}]}}]} as unknown as DocumentNode<FindStoreQuery, FindStoreQueryVariables>;
export const AllBranchesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllBranches"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginatorInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LocationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allBranches"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}}},{"kind":"Argument","name":{"kind":"Name","value":"paginator"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"branches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"distance"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"paginator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"prev"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"numPages"}}]}}]}}]}}]} as unknown as DocumentNode<AllBranchesQuery, AllBranchesQueryVariables>;
export const BranchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Branch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"branchId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findBranch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"branchId"}}},{"kind":"Argument","name":{"kind":"Name","value":"storeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"findStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"website"}}]}}]}}]} as unknown as DocumentNode<BranchQuery, BranchQueryVariables>;
export const FindBranchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindBranch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"branchId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findBranch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"branchId"}}},{"kind":"Argument","name":{"kind":"Name","value":"storeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}}]}}]} as unknown as DocumentNode<FindBranchQuery, FindBranchQueryVariables>;
export const AllBrandsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllBrands"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allBrands"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"products"}}]}}]}}]} as unknown as DocumentNode<AllBrandsQuery, AllBrandsQueryVariables>;
export const FindBranchesByDistanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindBranchesByDistance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lon"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"radiusMeters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findBranchesByDistance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lat"}}},{"kind":"Argument","name":{"kind":"Name","value":"lon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lon"}}},{"kind":"Argument","name":{"kind":"Name","value":"radiusMeters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"radiusMeters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"distance"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}}]}}]} as unknown as DocumentNode<FindBranchesByDistanceQuery, FindBranchesByDistanceQueryVariables>;
export const GetCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"depth"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCategories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"depth"},"value":{"kind":"Variable","name":{"kind":"Name","value":"depth"}}},{"kind":"Argument","name":{"kind":"Name","value":"parentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"expandedPathname"}},{"kind":"Field","name":{"kind":"Name","value":"categoryAlias"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}}]}}]}}]} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const MyProductBillingDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyProductBillingData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginatorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myProductBillingData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginator"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"expandedPathname"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}},{"kind":"Field","name":{"kind":"Name","value":"billingRateType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paginator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"prev"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"numPages"}}]}}]}}]}}]} as unknown as DocumentNode<MyProductBillingDataQuery, MyProductBillingDataQueryVariables>;
export const GetAllListsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllLists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ListType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllLists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"listType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"productList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"listId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"expandedPathname"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"weightValue"}},{"kind":"Field","name":{"kind":"Name","value":"weightType"}},{"kind":"Field","name":{"kind":"Name","value":"quantityValue"}},{"kind":"Field","name":{"kind":"Name","value":"quantityType"}},{"kind":"Field","name":{"kind":"Name","value":"lowestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"highestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stock"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"latestPriceId"}},{"kind":"Field","name":{"kind":"Name","value":"latestPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"sale"}},{"kind":"Field","name":{"kind":"Name","value":"originalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"unitType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stockId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"branchList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"listId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"branch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"distance"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllListsQuery, GetAllListsQueryVariables>;
export const StockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Stock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stockId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stock"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stockId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stockId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"branch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"distance"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestPriceId"}},{"kind":"Field","name":{"kind":"Name","value":"latestPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"sale"}},{"kind":"Field","name":{"kind":"Name","value":"originalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"unitType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<StockQuery, StockQueryVariables>;
export const FavoriteBranchesWithPricesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FavoriteBranchesWithPrices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFavoriteBranchesWithPrices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"branch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"distance"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stock"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"latestPriceId"}},{"kind":"Field","name":{"kind":"Name","value":"latestPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"sale"}},{"kind":"Field","name":{"kind":"Name","value":"originalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"unitType"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"approximatePrice"}}]}}]}}]} as unknown as DocumentNode<FavoriteBranchesWithPricesQuery, FavoriteBranchesWithPricesQueryVariables>;
export const VerifyPasswordResetCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VerifyPasswordResetCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyPasswordResetCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}]}]}}]} as unknown as DocumentNode<VerifyPasswordResetCodeQuery, VerifyPasswordResetCodeQueryVariables>;
export const GetAllProductListsByListIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllProductListsByListId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllProductListsByListId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"listId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"listId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"stockId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"expandedPathname"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"weightValue"}},{"kind":"Field","name":{"kind":"Name","value":"weightType"}},{"kind":"Field","name":{"kind":"Name","value":"quantityValue"}},{"kind":"Field","name":{"kind":"Name","value":"quantityType"}},{"kind":"Field","name":{"kind":"Name","value":"lowestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"highestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stock"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"branch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestPriceId"}},{"kind":"Field","name":{"kind":"Name","value":"latestPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"sale"}},{"kind":"Field","name":{"kind":"Name","value":"originalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"unitType"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllProductListsByListIdQuery, GetAllProductListsByListIdQueryVariables>;
export const GetAllBranchListsByListIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllBranchListsByListId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllBranchListsByListId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"listId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"listId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"branch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetAllBranchListsByListIdQuery, GetAllBranchListsByListIdQueryVariables>;
export const ExtractProductFieldsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ExtractProductFields"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"base64Image"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"extractProductFields"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"base64Image"},"value":{"kind":"Variable","name":{"kind":"Name","value":"base64Image"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"expandedPathname"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]}}]} as unknown as DocumentNode<ExtractProductFieldsQuery, ExtractProductFieldsQueryVariables>;
export const CheckAppVersionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckAppVersion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"platform"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthDeviceType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"version"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkAppVersion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"platform"},"value":{"kind":"Variable","name":{"kind":"Name","value":"platform"}}},{"kind":"Argument","name":{"kind":"Name","value":"version"},"value":{"kind":"Variable","name":{"kind":"Name","value":"version"}}}]}]}}]} as unknown as DocumentNode<CheckAppVersionQuery, CheckAppVersionQueryVariables>;
export const PriceChangeHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PriceChangeHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stockId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginatorInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PriceHistoryFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceChangeHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}},{"kind":"Argument","name":{"kind":"Name","value":"stockId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stockId"}}},{"kind":"Argument","name":{"kind":"Name","value":"paginator"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"stockId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"originalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"sale"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"unitType"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paginator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"prev"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"numPages"}}]}}]}}]}}]} as unknown as DocumentNode<PriceChangeHistoryQuery, PriceChangeHistoryQueryVariables>;
export const BranchesWithProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BranchesWithProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginatorInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productLimit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductSearch"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"branchesWithProducts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginator"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}}},{"kind":"Argument","name":{"kind":"Name","value":"productLimit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productLimit"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"branches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"distance"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapsLink"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"administrativeDivision"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"expandedPathname"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stock"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"latestPriceId"}},{"kind":"Field","name":{"kind":"Name","value":"latestPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"branchId"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"sale"}},{"kind":"Field","name":{"kind":"Name","value":"originalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"unitType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"weightValue"}},{"kind":"Field","name":{"kind":"Name","value":"weightType"}},{"kind":"Field","name":{"kind":"Name","value":"quantityValue"}},{"kind":"Field","name":{"kind":"Name","value":"quantityType"}},{"kind":"Field","name":{"kind":"Name","value":"lowestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"highestRecordedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"paginator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"prev"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"numPages"}}]}}]}}]}}]} as unknown as DocumentNode<BranchesWithProductsQuery, BranchesWithProductsQueryVariables>;
export const GetProductNutritionDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductNutritionData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProductNutritionData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeValue"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientText"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientList"}},{"kind":"Field","name":{"kind":"Name","value":"nutriments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"salt"}},{"kind":"Field","name":{"kind":"Name","value":"salt100g"}},{"kind":"Field","name":{"kind":"Name","value":"saltValue"}},{"kind":"Field","name":{"kind":"Name","value":"saltServing"}},{"kind":"Field","name":{"kind":"Name","value":"saltUnit"}},{"kind":"Field","name":{"kind":"Name","value":"sugars"}},{"kind":"Field","name":{"kind":"Name","value":"sugars100g"}},{"kind":"Field","name":{"kind":"Name","value":"sugarsValue"}},{"kind":"Field","name":{"kind":"Name","value":"sugarsServing"}},{"kind":"Field","name":{"kind":"Name","value":"sugarsUnit"}},{"kind":"Field","name":{"kind":"Name","value":"iron"}},{"kind":"Field","name":{"kind":"Name","value":"iron100g"}},{"kind":"Field","name":{"kind":"Name","value":"ironValue"}},{"kind":"Field","name":{"kind":"Name","value":"ironServing"}},{"kind":"Field","name":{"kind":"Name","value":"ironUnit"}},{"kind":"Field","name":{"kind":"Name","value":"ironLabel"}},{"kind":"Field","name":{"kind":"Name","value":"calcium"}},{"kind":"Field","name":{"kind":"Name","value":"calcium100g"}},{"kind":"Field","name":{"kind":"Name","value":"calciumValue"}},{"kind":"Field","name":{"kind":"Name","value":"calciumServing"}},{"kind":"Field","name":{"kind":"Name","value":"calciumUnit"}},{"kind":"Field","name":{"kind":"Name","value":"calciumLabel"}},{"kind":"Field","name":{"kind":"Name","value":"cholesterol100g"}},{"kind":"Field","name":{"kind":"Name","value":"saturatedFat"}},{"kind":"Field","name":{"kind":"Name","value":"saturatedFat100g"}},{"kind":"Field","name":{"kind":"Name","value":"saturatedFatValue"}},{"kind":"Field","name":{"kind":"Name","value":"saturatedFatServing"}},{"kind":"Field","name":{"kind":"Name","value":"saturatedFatUnit"}},{"kind":"Field","name":{"kind":"Name","value":"fat"}},{"kind":"Field","name":{"kind":"Name","value":"fat100g"}},{"kind":"Field","name":{"kind":"Name","value":"fatValue"}},{"kind":"Field","name":{"kind":"Name","value":"fatServing"}},{"kind":"Field","name":{"kind":"Name","value":"fatUnit"}},{"kind":"Field","name":{"kind":"Name","value":"transFat"}},{"kind":"Field","name":{"kind":"Name","value":"transFat100g"}},{"kind":"Field","name":{"kind":"Name","value":"transFatValue"}},{"kind":"Field","name":{"kind":"Name","value":"transFatServing"}},{"kind":"Field","name":{"kind":"Name","value":"transFatUnit"}},{"kind":"Field","name":{"kind":"Name","value":"transFatLabel"}},{"kind":"Field","name":{"kind":"Name","value":"vitaminA"}},{"kind":"Field","name":{"kind":"Name","value":"vitaminA100g"}},{"kind":"Field","name":{"kind":"Name","value":"vitaminAValue"}},{"kind":"Field","name":{"kind":"Name","value":"vitaminAServing"}},{"kind":"Field","name":{"kind":"Name","value":"vitaminAUnit"}},{"kind":"Field","name":{"kind":"Name","value":"vitaminALabel"}},{"kind":"Field","name":{"kind":"Name","value":"vitaminC"}},{"kind":"Field","name":{"kind":"Name","value":"vitaminC100g"}},{"kind":"Field","name":{"kind":"Name","value":"vitaminCValue"}},{"kind":"Field","name":{"kind":"Name","value":"vitaminCServing"}},{"kind":"Field","name":{"kind":"Name","value":"vitaminCUnit"}},{"kind":"Field","name":{"kind":"Name","value":"vitaminCLabel"}},{"kind":"Field","name":{"kind":"Name","value":"proteins"}},{"kind":"Field","name":{"kind":"Name","value":"proteins100g"}},{"kind":"Field","name":{"kind":"Name","value":"proteinsValue"}},{"kind":"Field","name":{"kind":"Name","value":"proteinsServing"}},{"kind":"Field","name":{"kind":"Name","value":"proteinsUnit"}},{"kind":"Field","name":{"kind":"Name","value":"fiber"}},{"kind":"Field","name":{"kind":"Name","value":"fiber100g"}},{"kind":"Field","name":{"kind":"Name","value":"fiberValue"}},{"kind":"Field","name":{"kind":"Name","value":"fiberServing"}},{"kind":"Field","name":{"kind":"Name","value":"fiberUnit"}},{"kind":"Field","name":{"kind":"Name","value":"carbohydrates"}},{"kind":"Field","name":{"kind":"Name","value":"carbohydrates100g"}},{"kind":"Field","name":{"kind":"Name","value":"carbohydratesValue"}},{"kind":"Field","name":{"kind":"Name","value":"carbohydratesServing"}},{"kind":"Field","name":{"kind":"Name","value":"carbohydratesUnit"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol100g"}},{"kind":"Field","name":{"kind":"Name","value":"alcoholValue"}},{"kind":"Field","name":{"kind":"Name","value":"alcoholServing"}},{"kind":"Field","name":{"kind":"Name","value":"alcoholUnit"}},{"kind":"Field","name":{"kind":"Name","value":"sodium"}},{"kind":"Field","name":{"kind":"Name","value":"sodium100g"}},{"kind":"Field","name":{"kind":"Name","value":"sodiumValue"}},{"kind":"Field","name":{"kind":"Name","value":"sodiumServing"}},{"kind":"Field","name":{"kind":"Name","value":"sodiumUnit"}},{"kind":"Field","name":{"kind":"Name","value":"potassium100g"}},{"kind":"Field","name":{"kind":"Name","value":"polyunsaturatedFat100g"}},{"kind":"Field","name":{"kind":"Name","value":"monounsaturatedFat100g"}},{"kind":"Field","name":{"kind":"Name","value":"novaGroup"}},{"kind":"Field","name":{"kind":"Name","value":"novaGroup100g"}},{"kind":"Field","name":{"kind":"Name","value":"novaGroupServing"}},{"kind":"Field","name":{"kind":"Name","value":"energy"}},{"kind":"Field","name":{"kind":"Name","value":"energy100g"}},{"kind":"Field","name":{"kind":"Name","value":"energyValue"}},{"kind":"Field","name":{"kind":"Name","value":"energyServing"}},{"kind":"Field","name":{"kind":"Name","value":"energyUnit"}},{"kind":"Field","name":{"kind":"Name","value":"energyKcal"}},{"kind":"Field","name":{"kind":"Name","value":"energyKcal100g"}},{"kind":"Field","name":{"kind":"Name","value":"energyKcalValue"}},{"kind":"Field","name":{"kind":"Name","value":"energyKcalServing"}},{"kind":"Field","name":{"kind":"Name","value":"energyKcalUnit"}},{"kind":"Field","name":{"kind":"Name","value":"nutritionScoreFr"}},{"kind":"Field","name":{"kind":"Name","value":"nutritionScoreFr100g"}},{"kind":"Field","name":{"kind":"Name","value":"nutritionScoreFrServing"}},{"kind":"Field","name":{"kind":"Name","value":"nutritionScoreUk"}},{"kind":"Field","name":{"kind":"Name","value":"nutritionScoreUk100g"}},{"kind":"Field","name":{"kind":"Name","value":"nutritionScoreUkServing"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vegan"}},{"kind":"Field","name":{"kind":"Name","value":"vegetarian"}},{"kind":"Field","name":{"kind":"Name","value":"glutenFree"}},{"kind":"Field","name":{"kind":"Name","value":"lactoseFree"}},{"kind":"Field","name":{"kind":"Name","value":"halal"}},{"kind":"Field","name":{"kind":"Name","value":"kosher"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetProductNutritionDataQuery, GetProductNutritionDataQueryVariables>;
export const MySearchHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MySearchHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginatorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mySearchHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginator"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginator"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"searchTerm"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paginator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"prev"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"numPages"}}]}}]}}]}}]} as unknown as DocumentNode<MySearchHistoryQuery, MySearchHistoryQueryVariables>;
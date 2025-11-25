import { gql } from '@apollo/client';

export const GROCERY_LISTS_QUERY = gql(`
  query GroceryLists {
    groceryLists {
      id
      name
      default
      createdAt
    }
  }
`);

export const GET_GROCERY_LIST_ITEMS_QUERY = gql(`
  query GroceryListItems($groceryListId: ID!, $filters: GroceryListItemsFilters) {
    groceryListItems(groceryListId: $groceryListId, filters: $filters) {
      id
      groceryListId
      productId
      product {
        id
        code
        name
        image
        category {
          id
          name
        }
        weightValue
        weightType
        quantityValue
        quantityType
      }
      category
      weight
      quantity
      unit
      completed
      createdAt
    }
  }
`);

export const DEFAULT_GROCERY_LIST_ITEMS_QUERY = gql(`
  query DefaultGroceryListItems($filters: GroceryListItemsFilters) {
    defaultGroceryListItems(filters: $filters) {
      id
      groceryListId
      productId
      product {
        id
        code
        name
        image
        category {
          id
          name
        }
        weightValue
        weightType
        quantityValue
        quantityType
      }
      category
      weight
      quantity
      unit
      completed
      createdAt
    }
  }
`);

export const COUNT_GROCERY_LIST_ITEMS_QUERY = gql(`
  query CountGroceryListItems($groceryListId: ID, $includeCompleted: Boolean) {
    countGroceryListItems(groceryListId: $groceryListId, includeCompleted: $includeCompleted)
  }
`);

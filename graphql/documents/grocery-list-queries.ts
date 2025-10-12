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
  query GroceryListItems($groceryListId: ID!) {
    groceryListItems(groceryListId: $groceryListId) {
      id
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
  query DefaultGroceryListItems {
    defaultGroceryListItems {
      id
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

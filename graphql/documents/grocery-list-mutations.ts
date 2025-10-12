import { gql } from '@apollo/client';

export const ADD_GROCERY_LIST_ITEMS_MUTATION = gql(`
  mutation AddGroceryListItem($groceryListId: ID!, $input: CreateGroceryListItemInput!) {
    addGroceryListItem(groceryListId: $groceryListId, input: $input) {
      id
    }
  }
`);

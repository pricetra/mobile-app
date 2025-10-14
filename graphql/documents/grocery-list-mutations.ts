import { gql } from '@apollo/client';

export const ADD_GROCERY_LIST_ITEMS_MUTATION = gql(`
  mutation AddGroceryListItem($groceryListId: ID!, $input: CreateGroceryListItemInput!) {
    addGroceryListItem(groceryListId: $groceryListId, input: $input) {
      id
    }
  }
`);

export const UPDATE_GROCERY_LIST_ITEMS_MUTATION = gql(`
  mutation UpdateGroceryListItem($groceryListItemId: ID!, $input: CreateGroceryListItemInput!) {
    updateGroceryListItem(groceryListItemId: $groceryListItemId, input: $input) {
      id
    }
  }
`);

export const DELETE_GROCERY_LIST_ITEMS_MUTATION = gql(`
  mutation DeleteGroceryListItem($groceryListItemId: ID!) {
    deleteGroceryListItem(groceryListItemId: $groceryListItemId) {
      id
    }
  }
`);

export const MARK_GROCERY_ITEM_MUTATION = gql(`
  mutation MarkGroceryListItem($groceryListItemId: ID!, $completed: Boolean!) {
    markGroceryListItem(groceryListItemId: $groceryListItemId, completed:$completed) {
      id
      completed
    }
  }
`);

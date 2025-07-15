import { gql } from '@apollo/client';

export const UPDATE_USER_BY_ID_MUTATION = gql(`
  mutation UpdateUserById($userId: ID!, $input: UpdateUserFull!) {
    updateUserById(userId: $userId, input: $input) {
      id
      email
      phoneNumber
      name
      avatar
      birthDate
      bio
      active
      role
      createdAt
      updatedAt
    }
  }
`);

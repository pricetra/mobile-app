import { gql } from '@apollo/client';

export const GET_ALL_USERS_QUERY = gql(`
  query GetAllUsers($paginator: PaginatorInput!, $filters: UserFilter) {
    getAllUsers(paginator:$paginator, filters:$filters) {
      users {
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

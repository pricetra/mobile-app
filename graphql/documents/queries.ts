import { gql } from "@apollo/client";

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

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

export const BARCODE_SCAN_QUERY = gql`
  query barcodeScan($barcode: String!) {
    barcodeScan(barcode: $barcode) {
      id
      name
      image
      description
      url
      brand
      code
      color
      model
      category
      weight
      lowestRecordedPrice
      highestRecordedPrice
      createdAt
      updatedAt
    }
  }
`

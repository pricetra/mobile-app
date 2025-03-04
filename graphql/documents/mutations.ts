import { gql } from '@apollo/client';

export const CREATE_USER_QUERY = gql`
  mutation CreateAccount($email: String!, $name: String!, $password: String!) {
    createAccount(input: { email: $email, name: $name, password: $password }) {
      id
      name
      email
      phoneNumber
      createdAt
      updatedAt
      authPlatform
    }
  }
`;

export const VERIFY_EMAIL_QUERY = gql(`
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
    }
  }
`);

export const RESEND_VERIFICATION_QUERY = gql(`
  mutation ResendVerification($email: String!) {
    resendEmailVerificationCode(email: $email)
  }
`);

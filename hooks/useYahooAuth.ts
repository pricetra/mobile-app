import * as AuthSession from 'expo-auth-session';

const yahooOAuthDiscovery = {
  authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
  tokenEndpoint: 'https://api.login.yahoo.com/oauth2/get_token',
};

const yahooOAuthRedirectUri = AuthSession.makeRedirectUri({
  scheme: 'pricetra',
  path: 'auth/yahoo',
});

export default function useYahooAuth() {
  const [yahooOauthRequest, yahooOauthResponse, initiateYahooPromptAsync] =
    AuthSession.useAuthRequest(
      {
        clientId: process.env.EXPO_PUBLIC_YAHOO_OAUTH_CLIENT_ID!,
        redirectUri: yahooOAuthRedirectUri,
        responseType: AuthSession.ResponseType.Code,
        scopes: ['openid'],
      },
      yahooOAuthDiscovery
    );

  return {
    yahooOauthRequest,
    yahooOauthResponse,
    initiateYahooPromptAsync,
  };
}

// TODO: BACKEND — décommenter et configurer quand le tenant ENGIE Okta est disponible
// import { OktaAuth } from '@okta/okta-auth-js';
// import { useOktaAuth } from '@okta/okta-react';
//
// export const oktaAuth = new OktaAuth({
//   issuer: import.meta.env.VITE_OKTA_ISSUER,       // ex: https://engie.okta.com/oauth2/default
//   clientId: import.meta.env.VITE_OKTA_CLIENT_ID,  // ex: 0oa...
//   redirectUri: `${window.location.origin}/login/callback`,
//   scopes: ['openid', 'profile', 'email'],
//   pkce: true,
// });

import { BYPASS_AUTH } from '../../../src/config/env';

export const MOCK_USER = {
  first: 'Romain',
  last: 'DEL FABRO',
  initials: 'RD',
  email: 'romain.delfabro@tractebel.com',
};

export function useAuth() {
  if (BYPASS_AUTH) {
    return {
      user: MOCK_USER,
      isAuthenticated: true,
      isLoading: false,
    };
  }

  // TODO: BACKEND — Okta Auth JS v7
  // const { authState } = useOktaAuth();
  // return {
  //   user: authState?.idToken?.claims,
  //   isAuthenticated: authState?.isAuthenticated ?? false,
  //   isLoading: !authState,
  // };
}

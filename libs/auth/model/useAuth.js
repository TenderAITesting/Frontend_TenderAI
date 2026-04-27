const BYPASS_AUTH = true; // TODO: BACKEND — passer à false en production

// TODO: BACKEND — installer @okta/okta-react et configurer OktaAuth
// import { useOktaAuth } from '@okta/okta-react';

export const MOCK_USER = {
  first: 'Romain',
  last: 'DEL FABRO',
  initials: 'RD',
  email: 'romain.delfabro@tractebel.com',
};

/**
 * Hook d'authentification.
 * En mode dev, retourne un utilisateur mocké et isAuthenticated = true.
 * TODO: BACKEND — remplacer par useOktaAuth() depuis @okta/okta-react
 *   enableOktaAuth: false dans config/config.dev.ts pour le dev local
 */
export function useAuth() {
  if (BYPASS_AUTH) {
    return {
      user: MOCK_USER,
      isAuthenticated: true,
      isLoading: false,
    };
  }

  // TODO: BACKEND — Okta Auth JS v7
  // const { authState, oktaAuth } = useOktaAuth();
  // return {
  //   user: authState?.idToken?.claims,
  //   isAuthenticated: authState?.isAuthenticated ?? false,
  //   isLoading: !authState,
  // };
}

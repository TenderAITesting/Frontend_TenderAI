const USE_MOCK = true; // TODO: BACKEND — passer à false

// TODO: BACKEND — URL de base depuis config/config.{mode}.ts
// const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://az-0278-tenderservice-prd-as-001.azurewebsites.net';

/**
 * Client HTTP minimal avec injection de tokens Okta.
 * TODO: BACKEND — injecter les headers Authorization + x-id-token depuis useAuth()
 * TODO: BACKEND — gérer les erreurs 4xx/5xx
 */
export const httpClient = {
  get: async (path) => {
    if (USE_MOCK) throw new Error('Mock mode — httpClient.get() non implémenté');
    // TODO: BACKEND
    // const res = await fetch(`${BASE_URL}${path}`, {
    //   headers: { Authorization: `Bearer ${accessToken}`, 'x-id-token': idToken },
    // });
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // return res.json();
  },

  post: async (path, body) => {
    if (USE_MOCK) throw new Error('Mock mode — httpClient.post() non implémenté');
    // TODO: BACKEND
  },

  patch: async (path, body) => {
    if (USE_MOCK) throw new Error('Mock mode — httpClient.patch() non implémenté');
    // TODO: BACKEND
  },

  delete: async (path) => {
    if (USE_MOCK) throw new Error('Mock mode — httpClient.delete() non implémenté');
    // TODO: BACKEND
  },
};

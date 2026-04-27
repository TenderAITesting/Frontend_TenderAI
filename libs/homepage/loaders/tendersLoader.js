import { INITIAL_TENDERS } from '../../../src/data/constants';

const USE_MOCK = true; // TODO: BACKEND

/**
 * React Router loader pour /homepage.
 * TODO: BACKEND — activer createBrowserRouter dans App.jsx pour que ce loader soit appelé.
 * TODO: BACKEND — remplacer par httpClient.get('/tenders')
 */
export async function tendersLoader() {
  if (USE_MOCK) {
    return { tenders: INITIAL_TENDERS };
  }
  // TODO: BACKEND — GET /tenders
  // const tenders = await httpClient.get('/tenders');
  // return { tenders };
}

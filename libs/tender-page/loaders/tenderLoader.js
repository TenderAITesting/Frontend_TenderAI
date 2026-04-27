import { INITIAL_TENDERS } from '../../../src/data/constants';

const USE_MOCK = true; // TODO: BACKEND

/**
 * React Router loader pour /tender/:id.
 * TODO: BACKEND — activer createBrowserRouter dans App.jsx pour que ce loader soit appelé.
 * TODO: BACKEND — remplacer par httpClient.get(`/tenders/${params.id}`)
 */
export async function tenderLoader({ params }) {
  if (USE_MOCK) {
    const tender = INITIAL_TENDERS.find(t => t.id === params.id) ?? null;
    return { tender };
  }
  // TODO: BACKEND — GET /tenders/:id
  // const tender = await httpClient.get(`/tenders/${params.id}`);
  // return { tender };
}

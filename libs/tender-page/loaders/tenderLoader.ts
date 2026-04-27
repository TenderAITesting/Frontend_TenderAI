import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { httpClient } from '../../http-client';
import { getMockTenders } from '../../../src/data/mockStore';

const USE_MOCK = true; // TODO: BACKEND — passer à false

// Factory : reçoit queryClient pour précharger le tender avant le rendu.
// En mode mock : no-op — useTender() lit depuis le mockStore.
// En mode backend : prefetchQuery(['tender', id]) pour un rendu instantané.
export function tenderLoader(queryClient: QueryClient) {
  return async ({ params }: LoaderFunctionArgs): Promise<null> => {
    const { id } = params;
    if (USE_MOCK || !id) return null;
    try {
      await queryClient.prefetchQuery({
        queryKey: ['tender', id],
        queryFn: async () => {
          try {
            return await httpClient.get(`/tenders/${id}`); // TODO: BACKEND — GET /tenders/:id
          } catch {
            // Fallback mocké si le backend est inaccessible
            return getMockTenders().find((t: any) => t.id === id) ?? null;
          }
        },
        staleTime: 30_000,
      });
    } catch {
      // Fallback silencieux — useTender() retournera les données mockées
    }
    return null;
  };
}

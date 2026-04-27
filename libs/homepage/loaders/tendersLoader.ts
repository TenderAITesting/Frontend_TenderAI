import type { QueryClient } from '@tanstack/react-query';
import { httpClient } from '../../http-client';

const USE_MOCK = true; // TODO: BACKEND — passer à false

// Factory : reçoit queryClient pour précharger le cache React Query avant le rendu.
// En mode mock : no-op — useTenders() gère les données via le mockStore.
// En mode backend : prefetchQuery(['tenders']) pour un rendu instantané sans waterfall.
export function tendersLoader(queryClient: QueryClient) {
  return async (): Promise<null> => {
    if (USE_MOCK) return null;
    try {
      await queryClient.prefetchQuery({
        queryKey: ['tenders'],
        queryFn: () => httpClient.get('/tenders'), // TODO: BACKEND — GET /tenders
        staleTime: 30_000,
      });
    } catch {
      // Fallback silencieux — useTenders() retournera les données mockées
    }
    return null;
  };
}

import type { QueryClient } from '@tanstack/react-query';
import { httpClient } from '../../http-client';
import { toFrontendTenders } from '../../http-client/tenderMapper';

// Prefetch GET /tenders so the dashboard renders without a waterfall.
export function tendersLoader(queryClient: QueryClient) {
  return async (): Promise<null> => {
    try {
      await queryClient.prefetchQuery({
        queryKey: ['tenders'],
        queryFn: async () => toFrontendTenders(await httpClient.get<any[]>('/tenders')),
        staleTime: 30_000,
      });
    } catch {
      /* useTenders() will handle */
    }
    return null;
  };
}


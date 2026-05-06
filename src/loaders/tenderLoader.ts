import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { httpClient } from '../../libs/http-client';
import { toFrontendTender } from '../../libs/http-client/tenderMapper';

// Prefetch GET /tenders/:id so the route renders without a waterfall.
// Errors are swallowed — useTender() will retry and surface the error if needed.
export function tenderLoader(queryClient: QueryClient) {
  return async ({ params }: LoaderFunctionArgs): Promise<null> => {
    const { id } = params;
    if (!id) return null;
    try {
      await queryClient.prefetchQuery({
        queryKey: ['tender', id],
        queryFn: async () => toFrontendTender(await httpClient.get<any>(`/tenders/${id}`)),
        staleTime: 30_000,
      });
    } catch {
      /* useTender() will handle */
    }
    return null;
  };
}


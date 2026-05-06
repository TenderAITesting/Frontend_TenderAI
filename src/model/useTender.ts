import { useQuery, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '../../libs/http-client';
import { toFrontendTender } from '../../libs/http-client/tenderMapper';

// Real-backend tender hook. Reads from the ['tenders'] cache as initialData
// for an instant first paint, then fetches /tenders/:id in the background.
export function useTender(id: string | undefined) {
  const queryClient = useQueryClient();

  const initialData = (() => {
    const cached = queryClient.getQueryData<any[]>(['tenders']);
    return cached?.find((t: any) => t.id === id) ?? undefined;
  })();

  return useQuery({
    queryKey: ['tender', id],
    queryFn: async () => {
      const raw = await httpClient.get<any>(`/tenders/${id}`);
      return toFrontendTender(raw);
    },
    initialData,
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useRunAgent() {
  return {
    runAgent: async (tenderId: string, agent: string) =>
      httpClient.post<{ tender_id: string; progress_id: string }>(
        `/agents/agent_process/${tenderId}?agent=${agent}`,
      ),
    isLoading: false,
  };
}

export function useUpdateAgentStatus() {
  return {
    updateStatus: async (tenderId: string, agent: string, status: string) =>
      httpClient.put(`/tenders/update_status/${tenderId}?agent=${agent}`, { status }),
    isLoading: false,
  };
}


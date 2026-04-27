import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMockTenders } from '../../../src/data/mockStore';
import { httpClient } from '../../http-client';

const USE_MOCK = true; // TODO: BACKEND — passer à false et connecter l'API

// Lit depuis le cache ['tenders'] si disponible, sinon cherche dans le mockStore.
// initialData en mode mock = synchrone, évite un cycle render vide qui bloquerait
// l'initialisation du useState dans TenderPage.
export function useTender(id: string | undefined) {
  const queryClient = useQueryClient();

  // Calcul synchrone pour initialData (pas un hook — juste une méthode queryClient)
  const initialData = USE_MOCK
    ? (() => {
        const cached = queryClient.getQueryData<any[]>(['tenders']);
        const store = cached ?? getMockTenders();
        return store.find((t: any) => t.id === id) ?? null;
      })()
    : undefined;

  return useQuery({
    queryKey: ['tender', id],
    queryFn: USE_MOCK
      ? async () => {
          const cached = queryClient.getQueryData<any[]>(['tenders']);
          const store = cached ?? getMockTenders();
          return store.find((t: any) => t.id === id) ?? null;
        }
      : async () => {
          try {
            return await httpClient.get(`/tenders/${id}`); // TODO: BACKEND — GET /tenders/:id
          } catch {
            // Fallback mocké si le backend est inaccessible
            return getMockTenders().find((t: any) => t.id === id) ?? null;
          }
        },
    initialData,
    enabled: !!id,
    staleTime: Infinity,
  });
}

export function useRunAgent() {
  if (USE_MOCK) {
    return {
      runAgent: (_tenderId: string, _agentId: string) =>
        Promise.resolve({ progressId: 'mock-progress-id' }),
      isLoading: false,
    };
  }
  // TODO: BACKEND — POST /agents/agent_process/:id?agent=agent_X
  // Puis polling GET /tenders/progressAgent/:progressId toutes les 10 secondes
  return { runAgent: async () => ({}), isLoading: false };
}

export function useUpdateAgentStatus() {
  if (USE_MOCK) {
    return {
      updateStatus: (_tenderId: string, _agentId: string, _status: string) => Promise.resolve(),
      isLoading: false,
    };
  }
  // TODO: BACKEND — PUT /tenders/update_status/:id?agent=agent_X
  return { updateStatus: async () => {}, isLoading: false };
}

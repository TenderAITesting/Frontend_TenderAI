import { INITIAL_TENDERS } from '../../../src/data/constants';

const USE_MOCK = true; // TODO: BACKEND — passer à false et connecter l'API

// TODO: BACKEND — remplacer par useQuery de @tanstack/react-query
// import { useQuery, useMutation } from '@tanstack/react-query';
// import { httpClient } from '../../http-client';

/**
 * Hook pour charger le détail d'un tender par ID.
 * TODO: BACKEND — GET /tenders/:id
 */
export function useTender(id) {
  if (USE_MOCK) {
    const tender = INITIAL_TENDERS.find(t => t.id === id) ?? null;
    return { data: tender, isLoading: false, error: null };
  }

  // TODO: BACKEND — implémentation React Query
  // return useQuery({
  //   queryKey: ['tender', id],
  //   queryFn: () => httpClient.get(`/tenders/${id}`),
  //   enabled: !!id,
  // });
}

/**
 * Hook pour lancer un agent sur un tender.
 * TODO: BACKEND — POST /agents/agent_process/:id?agent=agent_X
 *   Puis polling GET /tenders/progressAgent/:progressId toutes les 10 secondes
 */
export function useRunAgent() {
  if (USE_MOCK) {
    return {
      runAgent: (_tenderId, _agentId) => Promise.resolve({ progressId: 'mock-progress-id' }),
      isLoading: false,
    };
  }
  // TODO: BACKEND — POST /agents/agent_process/:id?agent=agent_X
}

/**
 * Hook pour valider/rejeter les résultats d'un agent.
 * TODO: BACKEND — PUT /tenders/update_status/:id?agent=agent_X
 */
export function useUpdateAgentStatus() {
  if (USE_MOCK) {
    return {
      updateStatus: (_tenderId, _agentId, _status) => Promise.resolve(),
      isLoading: false,
    };
  }
  // TODO: BACKEND — PUT /tenders/update_status/:id?agent=agent_X
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMockTenders, setMockTenders } from '../../../src/data/mockStore';
import { httpClient } from '../../http-client';

const USE_MOCK = true; // TODO: BACKEND — passer à false et connecter l'API

export function useTenders() {
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['tenders'],
    queryFn: USE_MOCK
      ? async () => [...getMockTenders()]
      : async () => {
          try {
            return await httpClient.get('/tenders');
          } catch {
            // Fallback mocké si le backend est inaccessible
            return [...getMockTenders()];
          }
        },
    staleTime: USE_MOCK ? Infinity : 30_000,
  });

  const addMutation = useMutation({
    mutationFn: USE_MOCK
      ? async (tender: any) => {
          setMockTenders([tender, ...getMockTenders()]);
          return tender;
        }
      : (tender: any) => httpClient.post('/tenders', tender), // TODO: BACKEND — POST /tenders
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenders'] }),
  });

  const updateMutation = useMutation({
    mutationFn: USE_MOCK
      ? async ({ id, patch }: { id: string; patch: Record<string, any> }) => {
          setMockTenders(getMockTenders().map(t => (t.id === id ? { ...t, ...patch } : t)));
        }
      : ({ id, patch }: { id: string; patch: Record<string, any> }) =>
          httpClient.patch(`/tenders/${id}`, patch), // TODO: BACKEND — PATCH /tenders/:id
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
      queryClient.invalidateQueries({ queryKey: ['tender', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: USE_MOCK
      ? async (id: string) => {
          setMockTenders(getMockTenders().filter(t => t.id !== id));
        }
      : (id: string) => httpClient.delete(`/tenders/${id}`), // TODO: BACKEND — DELETE /tenders/:id
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenders'] }),
  });

  return {
    data,
    isLoading,
    error,
    addTender: (tender: any) => addMutation.mutate(tender),
    updateTender: (id: string, patch: Record<string, any>) => updateMutation.mutate({ id, patch }),
    deleteTender: (id: string) => deleteMutation.mutate(id),
  };
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '../../http-client';
import {
  deleteSidecar,
  splitUpdatePatch,
  toCreateTenderPayload,
  toFrontendTender,
  toFrontendTenders,
} from '../../http-client/tenderMapper';

// React Query hook wired to the local backend (DEBUG=true).
// Returns tenders in the frontend shape (mapper handles backend <-> FE mapping).
export function useTenders() {
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['tenders'],
    queryFn: async () => toFrontendTenders(await httpClient.get<any[]>('/tenders')),
    staleTime: 30_000,
  });

  const addMutation = useMutation({
    mutationFn: async (tender: any) => {
      const payload = toCreateTenderPayload(tender);
      const created = await httpClient.post<any>('/tenders', payload);
      // Persist FE-only fields (projectId, maxStepIdx, lastStep) in the sidecar
      splitUpdatePatch(created.id, {
        projectId: tender.projectId,
        maxStepIdx: tender.maxStepIdx ?? 0,
        lastStep: tender.lastStep ?? 'documents',
      });
      return toFrontendTender(created);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenders'] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, any> }) => {
      const { backend } = splitUpdatePatch(id, patch);
      if (backend) {
        await httpClient.put(`/tenders/${id}`, backend);
      }
      return { id };
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
      queryClient.invalidateQueries({ queryKey: ['tender', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await httpClient.delete(`/tenders/${id}`);
      deleteSidecar(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenders'] }),
  });

  return {
    data,
    isLoading,
    error,
    // addTender returns a Promise so callers can navigate using the backend-assigned id.
    addTender: (tender: any) => addMutation.mutateAsync(tender),
    updateTender: (id: string, patch: Record<string, any>) =>
      updateMutation.mutate({ id, patch }),
    deleteTender: (id: string) => deleteMutation.mutate(id),
  };
}


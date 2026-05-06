import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '../../http-client';
import {
  splitUpdatePatch,
  toCreateTenderPayload,
  toFrontendTender,
} from '../../http-client/tenderMapper';

// Optional helper for upload-driven tender creation.
// For metadata-only creation, prefer useTenders().addTender from libs/homepage.
export function useCreateTender() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (tender: any) => {
      const created = await httpClient.post<any>('/tenders', toCreateTenderPayload(tender));
      splitUpdatePatch(created.id, {
        projectId: tender.projectId,
        maxStepIdx: tender.maxStepIdx ?? 0,
        lastStep: tender.lastStep ?? 'documents',
      });
      return toFrontendTender(created);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenders'] }),
  });

  return {
    createTender: (tender: any) => mutation.mutateAsync(tender),
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}


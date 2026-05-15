import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getMockTenders, setMockTenders } from '../../../src/data/mockStore';
import { httpClient } from '../../http-client';
import { USE_MOCK } from '../../../src/config/env';

// Hook dédié à la création via upload de document.
// En mode backend : POST /documents/process_document (upload + création tender)
//   Réponse attendue : { id: string, progressId: string }
//   Puis polling GET /tenders/progress/:progressId jusqu'à completion
//   Puis redirect vers /tender/:id?autoStart=true
export function useCreateTender() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: USE_MOCK
      ? async (tender: any) => {
          setMockTenders([tender, ...getMockTenders()]);
          return tender;
        }
      : async (tender: any) => {
          try {
            return await httpClient.post('/documents/process_document', tender); // TODO: BACKEND
          } catch {
            // Fallback mocké si le backend est inaccessible
            setMockTenders([tender, ...getMockTenders()]);
            return tender;
          }
        },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenders'] }),
  });

  return {
    createTender: (tender: any) => mutation.mutate(tender),
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

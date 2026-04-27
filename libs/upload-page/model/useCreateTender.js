const USE_MOCK = true; // TODO: BACKEND — passer à false et connecter l'API

// TODO: BACKEND — remplacer par useMutation de @tanstack/react-query
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { httpClient } from '../../http-client';

/**
 * Hook de création d'un tender.
 * En mode mock, délègue la création au callback onCreateTender fourni par App.jsx.
 * TODO: BACKEND — POST /documents/process_document (upload + création tender)
 *   Réponse attendue : { id: string, progressId: string }
 *   Puis polling GET /tenders/progress/:progressId jusqu'à completion
 *   Puis redirect vers /tender/:id?autoStart=true
 */
export function useCreateTender(onCreateTender) {
  if (USE_MOCK) {
    return {
      createTender: onCreateTender,
      isLoading: false,
      error: null,
    };
  }

  // TODO: BACKEND — implémentation React Query
  // const queryClient = useQueryClient();
  // const mutation = useMutation({
  //   mutationFn: (formData) => httpClient.post('/documents/process_document', formData),
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenders'] }),
  // });
  // return { createTender: mutation.mutate, isLoading: mutation.isPending, error: mutation.error };
}

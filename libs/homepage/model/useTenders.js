import { useState } from 'react';
import { INITIAL_TENDERS } from '../../../src/data/constants';

const USE_MOCK = true; // TODO: BACKEND — passer à false et connecter l'API

// TODO: BACKEND — remplacer par useQuery de @tanstack/react-query
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { httpClient } from '../../http-client';

// Store module-level pour simuler la persistance entre les navigations
let _mockStore = INITIAL_TENDERS.map(t => ({ ...t }));

export function useTenders() {
  const [tenders, setTenders] = useState(_mockStore);

  const addTender = (tender) => {
    // TODO: BACKEND — POST /tenders
    _mockStore = [tender, ..._mockStore];
    setTenders([..._mockStore]);
  };

  const updateTender = (id, patch) => {
    // TODO: BACKEND — PATCH /tenders/:id
    _mockStore = _mockStore.map(t => t.id === id ? { ...t, ...patch } : t);
    setTenders([..._mockStore]);
  };

  const deleteTender = (id) => {
    // TODO: BACKEND — DELETE /tenders/:id
    _mockStore = _mockStore.filter(t => t.id !== id);
    setTenders([..._mockStore]);
  };

  if (USE_MOCK) {
    return { data: tenders, isLoading: false, error: null, addTender, updateTender, deleteTender };
  }

  // TODO: BACKEND — implémentation React Query
  // const queryClient = useQueryClient();
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ['tenders'],
  //   queryFn: () => httpClient.get('/tenders'),
  // });
  // const addMutation = useMutation({
  //   mutationFn: (tender) => httpClient.post('/tenders', tender),
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenders'] }),
  // });
  // ...
}

import { INITIAL_TENDERS } from './constants';

// Source de vérité unique pour les tenders en mode mock.
// Module-level pour persister entre les navigations sans Context.
// TODO: BACKEND — supprimer quand React Query est connecté au vrai backend.
export let mockTenders = INITIAL_TENDERS.map(t => ({ ...t }));

export const getMockTenders = () => mockTenders;

export const setMockTenders = (next: typeof mockTenders) => {
  mockTenders = next;
};

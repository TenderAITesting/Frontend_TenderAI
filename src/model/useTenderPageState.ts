import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DEFAULT_DOCS, DEFAULT_DOC_AGENTS } from '../config/app-config';
import type { WorkflowState, WorkflowHandlers } from './types';

function freshDocs() {
  return {
    docs: DEFAULT_DOCS.map(d => ({ ...d })),
    docAgents: {
      doc1: { ...DEFAULT_DOC_AGENTS.doc1 },
      doc2: { ...DEFAULT_DOC_AGENTS.doc2 },
    },
  };
}

interface Params {
  id?: string;
  tenderStep: string;
  tender: any | null;
  updateTender: (id: string, patch: any) => void;
}

export function useTenderPageState({ id, tenderStep, tender, updateTender }: Params): { s: WorkflowState; handlers: WorkflowHandlers } {
  const navigate = useNavigate();
  const location = useLocation();
  const isNewOnMount = location.state?.isNew ?? false;

  const [s, setS] = useState(() => ({
    lang: 'EN',
    isNew: isNewOnMount,
    currentMaxStepIdx: tender?.maxStepIdx ?? 0,
    processing: false,
    elapsed: 0,
    showResults: false,
    resultsAgent: 'a1',
    resultsTab: 'keyinfo',
    showDisclaimer: null as string | null,
    showSrcPage: null as string | null,
    showExportModal: false,
    exportLang: null as string | null,
    exporting: false,
    showUpdateDocs: false,
    docsUpdated: false,
    resultsValidated: { a1: false, a2: false, a3: false } as Record<string, boolean>,
    activeSection: '1.0',
    templateType: 'standard',
    enrichedOpts: { context: true, offers: true, refs: true, methodology: false } as Record<string, boolean>,
    planType: 'standard',
    contactOpen: true,
    ...freshDocs(),
  }));

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const set = useCallback((patch: any) => {
    setS(prev => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }, []);

  // Elapsed timer for agent processing
  useEffect(() => {
    if (s.processing && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setS(prev => ({ ...prev, elapsed: prev.elapsed + 1 }));
      }, 1000);
    } else if (!s.processing && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  }, [s.processing]);

  // Scroll SrcModal to the target page when it opens
  useEffect(() => {
    if (s.showSrcPage) {
      const pg = parseInt((s.showSrcPage || 'p.1').replace('p.', ''));
      const container = document.getElementById('src-scroll');
      const target = document.getElementById(`src-page-${pg}`);
      if (container && target) container.scrollTop = target.offsetTop;
    }
  }, [s.showSrcPage]);

  // Sync step progress so the dashboard stays up to date
  // TODO: BACKEND — remplacer par appel API PATCH /tenders/:id
  useEffect(() => {
    if (id) {
      updateTender(id, { lastStep: tenderStep, maxStepIdx: s.currentMaxStepIdx });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenderStep, s.currentMaxStepIdx, id]);

  const handlers = {
    goView: () => navigate('/homepage'),

    goStep: (targetStep: string) => {
      const steps = ['documents', 'agents', 'config', 'planning', 'drafting'];
      const cur = steps.indexOf(tenderStep);
      const target = steps.indexOf(targetStep);
      if (s.isNew && target > cur) return;
      if (!s.isNew && target > s.currentMaxStepIdx) return;
      navigate(`/tender/${id}/${targetStep}`);
    },

    startProc: () => {
      set((prev: typeof s) => ({
        processing: true,
        docsUpdated: false,
        resultsValidated: { a1: false, a2: false, a3: false },
        currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 1),
      }));
      navigate(`/tender/${id}/agents`);
    },

    validateAgent: (agId: string) => set((prev: typeof s) => ({
      resultsValidated: { ...prev.resultsValidated, [agId]: true },
    })),

    skipToAgents: () => {
      set((prev: typeof s) => ({ currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 1) }));
      navigate(`/tender/${id}/agents`);
    },

    openRes:   (agId: string) => set({ showResults: true, resultsAgent: agId || 'a1', resultsTab: 'keyinfo' }),
    closeRes:  () => set({ showResults: false }),
    setResTab: (t: string) => set({ resultsTab: t }),

    togDA: (d: string, a: string) => set((prev: typeof s) => {
      if (a === 'a3' && !prev.docAgents[d]?.a2) return prev;
      const x = { ...prev.docAgents };
      x[d] = { ...x[d], [a]: !x[d][a] };
      if (a === 'a2' && !x[d].a2) x[d] = { ...x[d], a3: false };
      return { docAgents: x };
    }),

    deleteDoc: (key: string) => set((prev: typeof s) => {
      const docs = prev.docs.filter((d: any) => d.key !== key);
      const da = { ...prev.docAgents };
      delete da[key];
      return { docs, docAgents: da, docsUpdated: true };
    }),

    setLang:     (l: string) => set({ lang: l }),
    setPlanType: (t: string) => set({ planType: t }),
    setSection:  (sec: string) => set({ activeSection: sec }),
    setTemplate: (t: string) => set({ templateType: t }),

    togEnriched: (k: string) => set((prev: typeof s) => {
      const o = { ...prev.enrichedOpts, [k]: !prev.enrichedOpts[k] };
      return { enrichedOpts: o };
    }),

    launchProp: () => {
      set((prev: typeof s) => ({ currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 2) }));
      navigate(`/tender/${id}/config`);
    },

    launchPlanning: () => {
      set((prev: typeof s) => ({ currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 3) }));
      navigate(`/tender/${id}/planning`);
    },

    launchDraft: () => {
      set((prev: typeof s) => ({ currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 4) }));
      navigate(`/tender/${id}/drafting`);
    },

    freezeAndDraft: () => {
      set((prev: typeof s) => ({ currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 4) }));
      navigate(`/tender/${id}/drafting`);
    },

    openDisc:    (t: string) => set({ showDisclaimer: t }),
    closeDisc:   () => set({ showDisclaimer: null }),
    confirmDisc: () => {
      const wasUpload = s.showDisclaimer === 'tenderupload';
      set({ showDisclaimer: null, ...(wasUpload ? { docsUpdated: true } : {}) });
    },

    openSrc:  (pg: string) => set({ showSrcPage: pg }),
    closeSrc: () => set({ showSrcPage: null }),

    openExport:    () => set({ showExportModal: true, exportLang: null }),
    closeExport:   () => set({ showExportModal: false }),
    setExportLang: (l: string) => set({ exportLang: l }),
    confirmExport: () => {
      set({ showExportModal: false, exporting: true });
      setTimeout(() => set({ exporting: false }), 1500);
    },

    rerun: () => {
      set((prev: typeof s) => ({
        showResults: false,
        processing: true,
        elapsed: 0,
        currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 1),
      }));
      navigate(`/tender/${id}/agents`);
    },

    updateDocs:        () => set({ showResults: false, showUpdateDocs: true }),
    closeUpdateDocs:   () => set({ showUpdateDocs: false }),
    confirmUpdateDocs: () => {
      set({ showUpdateDocs: false, docsUpdated: true });
      navigate(`/tender/${id}/documents`);
    },

    togContact: () => set((prev: typeof s) => ({ contactOpen: !prev.contactOpen })),
  };

  return { s, handlers };
}

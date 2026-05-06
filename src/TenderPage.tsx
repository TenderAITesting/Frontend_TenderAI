import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { NJButton } from '@engie-group/fluid-design-system-react';
import BannerStepper from './components/Stepper';
import UploadTab from '../libs/tender-documents';
import TenderAnalysisTab from '../libs/tender-analysis';
import DraftConfiguratorTab from '../libs/draft-configurator';
import PlanningStep from '../libs/proposal-planning';
import DraftingStep from '../libs/proposal-drafting';
import ResultsModal from './components/ResultsModal';
import DisclaimerModal from './components/DisclaimerModal';
import ExportModal from './components/ExportModal';
import UpdateDocsModal from './components/UpdateDocsModal';
import SrcModal from './components/SrcModal';
import { DEFAULT_DOCS, DEFAULT_DOC_AGENTS } from './data/constants';
import { useTender, useRunAgent } from './model/useTender';
import { useTenders } from '../libs/homepage/model/useTenders';

function freshDocs() {
  return {
    docs: DEFAULT_DOCS.map(d => ({ ...d })),
    docAgents: {
      doc1: { ...DEFAULT_DOC_AGENTS.doc1 },
      doc2: { ...DEFAULT_DOC_AGENTS.doc2 },
    },
  };
}

export default function TenderView() {
  const { id, step } = useParams<{ id: string; step: string }>();
  const tenderStep = step || 'documents';
  const navigate = useNavigate();
  const location = useLocation();
  const { data: tender = null } = useTender(id);
  const { updateTender } = useTenders();
  const { runAgent } = useRunAgent();
  const queryClient = useQueryClient();

  // isNew = true quand on arrive juste après la création (état de navigation)
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
    showDisclaimer: null,
    showSrcPage: null,
    showExportModal: false,
    exportLang: null,
    exporting: false,
    showUpdateDocs: false,
    docsUpdated: false,
    resultsValidated: { a1: false, a2: false, a3: false },
    activeSection: '1.0',
    templateType: 'standard',
    enrichedOpts: { context: true, offers: true, refs: true, methodology: false },
    planType: 'standard',
    contactOpen: true,
    ...freshDocs(),
  }));

  const timerRef = useRef(null);

  const set = useCallback((patch) => {
    setS(prev => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }, []);

  // Elapsed timer
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

  // Scroll SrcModal to target page
  useEffect(() => {
    if (s.showSrcPage) {
      const pg = parseInt((s.showSrcPage || 'p.1').replace('p.', ''));
      const container = document.getElementById('src-scroll');
      const target = document.getElementById(`src-page-${pg}`);
      if (container && target) container.scrollTop = target.offsetTop;
    }
  }, [s.showSrcPage]);

  // Sync step progress to parent state so Dashboard stays up to date
  // TODO: remplacer par appel API PATCH /tenders/:id
  useEffect(() => {
    if (id) {
      updateTender(id, { lastStep: tenderStep, maxStepIdx: s.currentMaxStepIdx });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenderStep, s.currentMaxStepIdx, id]);

  if (!tender) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Tender not found.</p>
        <NJButton variant="primary" label="Back to Dashboard" onClick={() => navigate('/homepage')} />
      </div>
    );
  }

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
      // Determine which backend agents to launch from selected docAgents.
      // a1 -> agent_1, a2 -> agent_2 (no agent_3 backend yet).
      const wanted: Array<'agent_1' | 'agent_2'> = [];
      const hasA1 = Object.values(s.docAgents || {}).some((d: any) => d?.a1);
      const hasA2 = Object.values(s.docAgents || {}).some((d: any) => d?.a2);
      if (hasA1) wanted.push('agent_1');
      if (hasA2) wanted.push('agent_2');
      // Fallback: if no FE selection (e.g. seeded tender), trigger both.
      if (wanted.length === 0) wanted.push('agent_1', 'agent_2');

      set(prev => ({
        processing: true, docsUpdated: false,
        resultsValidated: { a1: false, a2: false, a3: false },
        currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 1),
      }));
      navigate(`/tender/${id}/agents`);

      if (id) {
        // Fire-and-forget: in DEBUG the backend uses fake_run_agent which writes
        // sample.json/.xlsx into Azurite and self-callbacks as COMPLETED.
        Promise.allSettled(wanted.map(a => runAgent(id, a)))
          .then(() => {
            // Refresh tender + agent progress so the UI flips to "validated".
            queryClient.invalidateQueries({ queryKey: ['tender', id] });
            queryClient.invalidateQueries({ queryKey: ['tenders'] });
          })
          .catch(err => console.error('[startProc] agent_process failed', err));
      }
    },

    validateAgent: (agId) => set(prev => ({ resultsValidated: { ...prev.resultsValidated, [agId]: true } })),

    skipToAgents: () => {
      set(prev => ({ currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 1) }));
      navigate(`/tender/${id}/agents`);
    },

    openRes:   (agId) => set({ showResults: true, resultsAgent: agId || 'a1', resultsTab: 'keyinfo' }),
    closeRes:  ()     => set({ showResults: false }),
    setResTab: (t)    => set({ resultsTab: t }),

    togDA: (d, a) => set(prev => {
      if (a === 'a3' && !prev.docAgents[d]?.a2) return prev;
      const x = { ...prev.docAgents };
      x[d] = { ...x[d] };
      x[d][a] = !x[d][a];
      if (a === 'a2' && !x[d].a2) x[d] = { ...x[d], a3: false };
      return { docAgents: x };
    }),

    deleteDoc: (key) => set(prev => {
      const docs = prev.docs.filter(d => d.key !== key);
      const da = { ...prev.docAgents };
      delete da[key];
      return { docs, docAgents: da, docsUpdated: true };
    }),

    setLang:     (l) => set({ lang: l }),
    setPlanType: (t) => set({ planType: t }),
    setSection:  (sec) => set({ activeSection: sec }),
    setTemplate: (t) => set({ templateType: t }),

    togEnriched: (k) => set(prev => {
      const o = { ...prev.enrichedOpts }; o[k] = !o[k];
      return { enrichedOpts: o };
    }),

    launchProp: () => {
      set(prev => ({ currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 2) }));
      navigate(`/tender/${id}/config`);
    },

    launchPlanning: () => {
      set(prev => ({ currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 3) }));
      navigate(`/tender/${id}/planning`);
    },

    launchDraft: () => {
      set(prev => ({ currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 4) }));
      navigate(`/tender/${id}/drafting`);
    },

    freezeAndDraft: () => {
      set(prev => ({ currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 4) }));
      navigate(`/tender/${id}/drafting`);
    },

    openDisc:    (t) => set({ showDisclaimer: t }),
    closeDisc:   ()  => set({ showDisclaimer: null }),
    confirmDisc: ()  => {
      const wasUpload = s.showDisclaimer === 'tenderupload';
      set({ showDisclaimer: null, ...(wasUpload ? { docsUpdated: true } : {}) });
    },

    openSrc:  (pg) => set({ showSrcPage: pg }),
    closeSrc: ()   => set({ showSrcPage: null }),

    openExport:    ()  => set({ showExportModal: true, exportLang: null }),
    closeExport:   ()  => set({ showExportModal: false }),
    setExportLang: (l) => set({ exportLang: l }),
    confirmExport: ()  => {
      set({ showExportModal: false, exporting: true });
      setTimeout(() => set({ exporting: false }), 1500);
    },

    rerun: () => {
      set(prev => ({
        showResults: false, processing: true, elapsed: 0,
        currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 1),
      }));
      navigate(`/tender/${id}/agents`);
    },
    updateDocs:     () => set({ showResults: false, showUpdateDocs: true }),
    closeUpdateDocs: () => set({ showUpdateDocs: false }),
    confirmUpdateDocs: () => {
      set({ showUpdateDocs: false, docsUpdated: true });
      navigate(`/tender/${id}/documents`);
    },

    togContact: () => set(prev => ({ contactOpen: !prev.contactOpen })),
  };

  const fmtTime = (sec) =>
    [Math.floor(sec / 3600), Math.floor((sec % 3600) / 60), sec % 60]
      .map(v => String(v).padStart(2, '0'))
      .join(':');

  // s enrichi avec les données du tender pour compatibilité avec les composants enfants
  const sc = { ...s, tenderStep, currentTender: id, tenderId: id, tenders: [tender] };

  return (
    <div style={{ height: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{
        background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
        borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
        padding: '0 24px', height: 44, flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <NJButton
          variant="secondary"
          emphasis="subtle"
          scale="sm"
          icon="arrow_back"
          label="Dashboard"
          onClick={() => navigate('/homepage')}
        />
        <div style={{ width: 1, height: 20, background: 'var(--nj-semantic-color-border-neutral-minimal-default)' }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--nj-semantic-color-text-neutral-primary-default)' }}>
          {tender.name}
        </span>
        {tender.client && (
          <span style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-500)' }}>
            · {tender.client}
          </span>
        )}
      </div>

      <BannerStepper
        tenderStep={tenderStep}
        isNew={s.isNew}
        currentMaxStepIdx={s.currentMaxStepIdx}
        onGoStep={handlers.goStep}
      />

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {tenderStep === 'documents' && <UploadTab            s={sc} handlers={handlers} />}
        {tenderStep === 'agents'    && <TenderAnalysisTab    s={sc} handlers={handlers} fmtTime={fmtTime} />}
        {tenderStep === 'config'    && <DraftConfiguratorTab s={sc} handlers={handlers} />}
        {tenderStep === 'planning'  && <PlanningStep          s={sc} handlers={handlers} />}
        {tenderStep === 'drafting'  && <DraftingStep          s={sc} handlers={handlers} />}
      </div>

      {s.showResults    && <ResultsModal     s={sc} handlers={{ onClose: handlers.closeRes, onValidate: handlers.validateAgent, onReRunAI: handlers.rerun, onUpdateDocs: handlers.updateDocs, openSrc: handlers.openSrc }} />}
      {s.showDisclaimer && <DisclaimerModal  type={s.showDisclaimer} onClose={handlers.closeDisc} onConfirm={handlers.confirmDisc} />}
      {s.showSrcPage    && <SrcModal         page={s.showSrcPage} onClose={handlers.closeSrc} />}
      {s.showExportModal && <ExportModal     exportLang={s.exportLang} onSetLang={handlers.setExportLang} onConfirm={handlers.confirmExport} onClose={handlers.closeExport} />}
      {s.showUpdateDocs  && <UpdateDocsModal onClose={handlers.closeUpdateDocs} onConfirm={handlers.confirmUpdateDocs} />}
    </div>
  );
}

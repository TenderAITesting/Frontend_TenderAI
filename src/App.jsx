import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { USER, DEFAULT_DOCS, DEFAULT_DOC_AGENTS, INITIAL_TENDERS } from './data/constants';
import TopBar from './components/TopBar';
import DashboardView from './components/DashboardView';
import NewProjectView from './components/NewProjectView';
import TenderView from './components/ProposalView';
import ResultsModal from './components/ResultsModal';
import DisclaimerModal from './components/DisclaimerModal';
import ExportModal from './components/ExportModal';
import UpdateDocsModal from './components/UpdateDocsModal';
import SrcModal from './components/SrcModal';

function freshDocs() {
  return {
    docs: DEFAULT_DOCS.map(d => ({ ...d })),
    docAgents: {
      doc1: { ...DEFAULT_DOC_AGENTS.doc1 },
      doc2: { ...DEFAULT_DOC_AGENTS.doc2 },
    },
  };
}

const INITIAL = {
  view: 'dashboard',
  lang: 'EN',
  tenderStep: 'upload',
  isNew: true,
  currentTender: null,
  currentMaxStepIdx: 0,
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
  resultsValidated: false,
  activeSection: '1.0',
  templateType: 'standard',
  enrichedOpts: { context: true, offers: true, refs: true, methodology: false },
  ...freshDocs(),
  newForm: { name: '', client: '', projectId: '', lastName: USER.last, firstName: USER.first },
  editingTender: null,
  contactOpen: true,
  tenders: INITIAL_TENDERS,
};

export default function App() {
  const [s, setS] = useState(INITIAL);
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

  // Save current tender progress before switching
  function saveTenderProgress(state) {
    if (state.currentTender === null || state.view !== 'tender') return null;
    const tenders = [...state.tenders];
    tenders[state.currentTender] = {
      ...tenders[state.currentTender],
      lastStep: state.tenderStep,
      maxStepIdx: state.currentMaxStepIdx,
    };
    return tenders;
  }

  // ── Handlers ──
  const handlers = {
    goView: (v) => set(prev => {
      const tenders = saveTenderProgress(prev);
      return tenders ? { view: v, tenders } : { view: v };
    }),

    goNew: () => set(prev => {
      const tenders = saveTenderProgress(prev);
      const patch = { view: 'new_project', editingTender: null, newForm: { name: '', client: '', projectId: '', lastName: USER.last, firstName: USER.first } };
      if (tenders) patch.tenders = tenders;
      return patch;
    }),

    openEditTender: (idx) => set(prev => {
      const tenders = saveTenderProgress(prev);
      const t = (tenders || prev.tenders)[idx];
      return {
        ...(tenders ? { tenders } : {}),
        view: 'new_project',
        editingTender: idx,
        newForm: { name: t.name, client: t.client || '', projectId: t.projectId || '', lastName: USER.last, firstName: USER.first },
      };
    }),

    openTender: (idx) => {
      const updatedTenders = saveTenderProgress(s) || s.tenders;
      const t = updatedTenders[idx];
      set({
        view: 'tender', currentTender: idx, isNew: false,
        tenderStep: t.lastStep || 'agents',
        currentMaxStepIdx: t.maxStepIdx !== undefined ? t.maxStepIdx : 1,
        tenders: updatedTenders,
        processing: false, elapsed: 0, docsUpdated: false,
        ...freshDocs(),
      });
    },

    submitNew: () => {
      if (s.editingTender !== null) {
        set(prev => {
          const tenders = [...prev.tenders];
          tenders[prev.editingTender] = {
            ...tenders[prev.editingTender],
            name: prev.newForm.name || tenders[prev.editingTender].name,
            client: prev.newForm.client || tenders[prev.editingTender].client,
            projectId: prev.newForm.projectId || tenders[prev.editingTender].projectId,
          };
          return { tenders, view: 'dashboard', editingTender: null };
        });
        return;
      }
      const year = new Date().getFullYear();
      const seq = String(Math.floor(Math.random() * 900) + 100);
      const t = {
        name: s.newForm.name || 'New Tender',
        client: s.newForm.client || '—',
        projectId: s.newForm.projectId.trim() || `TRB-${year}-${seq}`,
        modified: new Date().toLocaleDateString('fr-FR'),
        maxStepIdx: 0, lastStep: 'upload', status: 'uploaded',
      };
      set(prev => ({
        tenders: [t, ...prev.tenders],
        view: 'tender', currentTender: 0, isNew: true,
        tenderStep: 'upload', currentMaxStepIdx: 0,
        processing: false, elapsed: 0, docsUpdated: false,
        editingTender: null,
        ...freshDocs(),
      }));
    },

    updateForm: (f, v) => set(prev => ({ newForm: { ...prev.newForm, [f]: v } })),

    goStep: (step) => {
      const steps = ['upload', 'agents', 'planning', 'drafting'];
      const cur = steps.indexOf(s.tenderStep);
      const target = steps.indexOf(step);
      if (s.isNew && target > cur) return;
      if (!s.isNew && target > s.currentMaxStepIdx) return;
      set({ tenderStep: step });
    },

    startProc: () => set(prev => ({
      processing: true, tenderStep: 'agents', docsUpdated: false, resultsValidated: false,
      currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 1),
    })),

    validateResults: () => set({ resultsValidated: true }),

    skipToAgents: () => set(prev => ({
      tenderStep: 'agents',
      currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 1),
    })),

    openRes: (agId) => set({ showResults: true, resultsAgent: agId || 'a1', resultsTab: 'keyinfo' }),
    closeRes: () => set({ showResults: false }),
    setResTab: (t) => set({ resultsTab: t }),

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

    setLang: (l) => set({ lang: l }),

    setSection: (id) => set({ activeSection: id }),
    setTemplate: (t) => set({ templateType: t }),
    togEnriched: (k) => set(prev => {
      const o = { ...prev.enrichedOpts }; o[k] = !o[k];
      return { enrichedOpts: o };
    }),

    launchProp: () => set(prev => ({
      tenderStep: 'planning', activeSection: '1.0',
      currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 2),
    })),

    freezeAndDraft: () => set(prev => ({
      tenderStep: 'drafting',
      currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 3),
    })),

    openDisc: (t) => set({ showDisclaimer: t }),
    closeDisc: () => set({ showDisclaimer: null }),
    confirmDisc: () => {
      const wasUpload = s.showDisclaimer === 'tenderupload';
      set({ showDisclaimer: null, ...(wasUpload ? { docsUpdated: true } : {}) });
    },

    openSrc: (pg) => set({ showSrcPage: pg }),
    closeSrc: () => set({ showSrcPage: null }),

    openExport: () => set({ showExportModal: true, exportLang: null }),
    closeExport: () => set({ showExportModal: false }),
    setExportLang: (l) => set({ exportLang: l }),
    confirmExport: () => {
      set({ showExportModal: false, exporting: true });
      setTimeout(() => set({ exporting: false }), 1500);
    },

    rerun: () => set(prev => ({
      showResults: false, processing: true, tenderStep: 'agents', elapsed: 0,
      currentMaxStepIdx: Math.max(prev.currentMaxStepIdx, 1),
    })),
    updateDocs: () => set({ showResults: false, showUpdateDocs: true }),
    closeUpdateDocs: () => set({ showUpdateDocs: false }),
    confirmUpdateDocs: () => set({ showUpdateDocs: false, tenderStep: 'upload', docsUpdated: true }),

    togContact: () => set(prev => ({ contactOpen: !prev.contactOpen })),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar view={s.view} user={USER} onGoView={handlers.goView} />

      {s.view === 'dashboard' && (
        <DashboardView
          tenders={s.tenders}
          onNew={handlers.goNew}
          onOpen={handlers.openTender}
          onEdit={handlers.openEditTender}
        />
      )}

      {s.view === 'new_project' && (
        <NewProjectView
          newForm={s.newForm}
          onUpdateForm={handlers.updateForm}
          onSubmit={handlers.submitNew}
          onCancel={() => set({ view: 'dashboard', editingTender: null })}
          editMode={s.editingTender !== null}
        />
      )}

      {s.view === 'tender' && (
        <TenderView
          s={s}
          handlers={handlers}
          fmtTime={(sec) => [Math.floor(sec/3600),Math.floor((sec%3600)/60),sec%60].map(v=>String(v).padStart(2,'0')).join(':')}
        />
      )}

      {s.showResults && (
        <ResultsModal s={s} handlers={handlers} />
      )}
      {s.showDisclaimer && (
        <DisclaimerModal type={s.showDisclaimer} onClose={handlers.closeDisc} onConfirm={handlers.confirmDisc} />
      )}
      {s.showSrcPage && (
        <SrcModal page={s.showSrcPage} onClose={handlers.closeSrc} />
      )}
      {s.showExportModal && (
        <ExportModal exportLang={s.exportLang} onSetLang={handlers.setExportLang} onConfirm={handlers.confirmExport} onClose={handlers.closeExport} />
      )}
      {s.showUpdateDocs && (
        <UpdateDocsModal onClose={handlers.closeUpdateDocs} onConfirm={handlers.confirmUpdateDocs} />
      )}
    </div>
  );
}

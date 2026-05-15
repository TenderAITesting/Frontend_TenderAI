export interface WorkflowState {
  lang: string;
  isNew: boolean;
  currentMaxStepIdx: number;
  processing: boolean;
  elapsed: number;
  showResults: boolean;
  resultsAgent: string;
  resultsTab: string;
  showDisclaimer: string | null;
  showSrcPage: string | null;
  showExportModal: boolean;
  exportLang: string | null;
  exporting: boolean;
  showUpdateDocs: boolean;
  docsUpdated: boolean;
  resultsValidated: Record<string, boolean>;
  activeSection: string;
  templateType: string;
  enrichedOpts: Record<string, boolean>;
  planType: string;
  contactOpen: boolean;
  docs: Array<{ key: string; name: string; size: string; ago: string }>;
  docAgents: Record<string, Record<string, boolean>>;
  // Extended by TenderPage before passing as sc
  tenderStep?: string;
  currentTender?: string;
  tenders?: any[];
}

export interface WorkflowHandlers {
  goView: () => void;
  goStep: (targetStep: string) => void;
  startProc: () => void;
  validateAgent: (agId: string) => void;
  skipToAgents: () => void;
  openRes: (agId: string) => void;
  closeRes: () => void;
  setResTab: (t: string) => void;
  togDA: (d: string, a: string) => void;
  deleteDoc: (key: string) => void;
  setLang: (l: string) => void;
  setPlanType: (t: string) => void;
  setSection: (sec: string) => void;
  setTemplate: (t: string) => void;
  togEnriched: (k: string) => void;
  launchProp: () => void;
  launchPlanning: () => void;
  launchDraft: () => void;
  freezeAndDraft: () => void;
  openDisc: (t: string) => void;
  closeDisc: () => void;
  confirmDisc: () => void;
  openSrc: (pg: string) => void;
  closeSrc: () => void;
  openExport: () => void;
  closeExport: () => void;
  setExportLang: (l: string) => void;
  confirmExport: () => void;
  rerun: () => void;
  updateDocs: () => void;
  closeUpdateDocs: () => void;
  confirmUpdateDocs: () => void;
  togContact: () => void;
}

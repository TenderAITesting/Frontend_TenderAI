import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NJButton } from '@engie-group/fluid-design-system-react';
import { useTopBar } from '../libs/layout';
import styles from './TenderPage.module.css';
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
import { useTender } from './model/useTender';
import { useTenders } from '../libs/homepage/model/useTenders';
import { useTenderPageState } from './model/useTenderPageState';

function fmtTime(sec: number): string {
  return [Math.floor(sec / 3600), Math.floor((sec % 3600) / 60), sec % 60]
    .map(v => String(v).padStart(2, '0'))
    .join(':');
}

export default function TenderView() {
  const { id, step } = useParams<{ id: string; step: string }>();
  const tenderStep = step || 'documents';
  const navigate = useNavigate();
  const { data: tender = null } = useTender(id);
  const { updateTender } = useTenders();
  const { s, handlers } = useTenderPageState({ id, tenderStep, tender, updateTender });
  const { setSlot } = useTopBar();

  useEffect(() => {
    if (!tender) { setSlot(null); return; }
    setSlot(
      <div className={styles["tp-slot"]}>
        <button
          className={styles["tp-slot-back-btn"]}
          onClick={() => navigate('/homepage')}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--nj-semantic-color-background-neutral-secondary-default)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          Dashboard
        </button>
        <div className={styles["tp-slot-divider"]} />
        <span className={styles["tp-slot-name"]}>{tender.name}</span>
        {tender.client && <span className={styles["tp-slot-client"]}>· {tender.client}</span>}
      </div>
    );
    return () => setSlot(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tender, navigate]);

  if (!tender) {
    return (
      <div className={styles["tp-not-found"]}>
        <p>Tender not found.</p>
        <NJButton variant="primary" label="Back to Dashboard" onClick={() => navigate('/homepage')} />
      </div>
    );
  }

  const sc = { ...s, tenderStep, currentTender: id, tenders: [tender] };

  return (
    <div className={styles["tp-container"]}>
      <BannerStepper
        tenderStep={tenderStep}
        isNew={s.isNew}
        currentMaxStepIdx={s.currentMaxStepIdx}
        onGoStep={handlers.goStep}
      />

      <div className={styles["tp-content"]}>
        {tenderStep === 'documents' && <UploadTab            s={sc} handlers={handlers} />}
        {tenderStep === 'agents'    && <TenderAnalysisTab    s={sc} handlers={handlers} fmtTime={fmtTime} />}
        {tenderStep === 'config'    && <DraftConfiguratorTab s={sc} handlers={handlers} />}
        {tenderStep === 'planning'  && <PlanningStep          s={sc} handlers={handlers} />}
        {tenderStep === 'drafting'  && <DraftingStep          s={sc} handlers={handlers} />}
      </div>

      {s.showResults     && <ResultsModal     s={sc} handlers={{ onClose: handlers.closeRes, onValidate: handlers.validateAgent, onReRunAI: handlers.rerun, onUpdateDocs: handlers.updateDocs, openSrc: handlers.openSrc }} />}
      {s.showDisclaimer  && <DisclaimerModal  type={s.showDisclaimer} onClose={handlers.closeDisc} onConfirm={handlers.confirmDisc} />}
      {s.showSrcPage     && <SrcModal         page={s.showSrcPage} onClose={handlers.closeSrc} />}
      {s.showExportModal && <ExportModal      exportLang={s.exportLang} onSetLang={handlers.setExportLang} onConfirm={handlers.confirmExport} onClose={handlers.closeExport} />}
      {s.showUpdateDocs  && <UpdateDocsModal  onClose={handlers.closeUpdateDocs} onConfirm={handlers.confirmUpdateDocs} />}
    </div>
  );
}

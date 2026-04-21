import BannerStepper from './Stepper';
import UploadTab from './DocumentsTab';
import AgentsTab from './AgentsTab';
import PlanningStep from './TocStep';
import DraftingStep from './DraftStep';

export default function TenderView({ s, handlers, fmtTime }) {
  const { tenderStep, tenders, currentTender } = s;
  const tender = currentTender !== null ? tenders[currentTender] : null;

  return (
    <div>
      {tender && (
        <div style={{ background: '#F8FAFC', borderBottom: '1px solid #E2EBF3', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1B2B3C' }}>{tender.name}</span>
          {tender.client && tender.client !== '—' && (
            <span style={{ fontSize: 12, color: '#7E95A8' }}>· {tender.client}</span>
          )}
        </div>
      )}

      <BannerStepper
        tenderStep={tenderStep}
        isNew={s.isNew}
        currentMaxStepIdx={s.currentMaxStepIdx}
        onGoStep={handlers.goStep}
      />

      {tenderStep === 'upload'    && <UploadTab s={s} handlers={handlers} />}
      {tenderStep === 'agents'   && <AgentsTab s={s} handlers={handlers} fmtTime={fmtTime} />}
      {tenderStep === 'planning' && <PlanningStep s={s} handlers={handlers} />}
      {tenderStep === 'drafting' && <DraftingStep s={s} handlers={handlers} />}
    </div>
  );
}

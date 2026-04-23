import BannerStepper from './Stepper';
import UploadTab from './DocumentsTab';
import TenderAnalysisTab from './TenderAnalysisTab';
import DraftConfiguratorTab from './DraftConfiguratorTab';
import PlanningStep from './TocStep';
import DraftingStep from './DraftStep';

export default function TenderView({ s, handlers, fmtTime }) {
  const { tenderStep, tenders, currentTender } = s;
  const tender = currentTender !== null ? tenders[currentTender] : null;

  return (
    <div>
      {tender && (
        <div style={{
          background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
          borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
          padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--nj-semantic-color-text-neutral-primary-default)' }}>{tender.name}</span>
          {tender.client && tender.client !== '—' && (
            <span style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-500)' }}>· {tender.client}</span>
          )}
        </div>
      )}

      <BannerStepper
        tenderStep={tenderStep}
        isNew={s.isNew}
        currentMaxStepIdx={s.currentMaxStepIdx}
        onGoStep={handlers.goStep}
      />

      {tenderStep === 'upload'    && <UploadTab            s={s} handlers={handlers} />}
      {tenderStep === 'agents'   && <TenderAnalysisTab    s={s} handlers={handlers} fmtTime={fmtTime} />}
      {tenderStep === 'config'   && <DraftConfiguratorTab s={s} handlers={handlers} />}
      {tenderStep === 'planning' && <PlanningStep          s={s} handlers={handlers} />}
      {tenderStep === 'drafting' && <DraftingStep          s={s} handlers={handlers} />}
    </div>
  );
}

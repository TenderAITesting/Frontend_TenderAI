import { NJButton } from '@engie-group/fluid-design-system-react';
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
    <div style={{ height: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {tender && (
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
            onClick={() => handlers.goView('dashboard')}
          />
          <div style={{ width: 1, height: 20, background: 'var(--nj-semantic-color-border-neutral-minimal-default)' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--nj-semantic-color-text-neutral-primary-default)' }}>{tender.name}</span>
          {tender.client && (
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

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {tenderStep === 'upload'    && <UploadTab            s={s} handlers={handlers} />}
        {tenderStep === 'agents'   && <TenderAnalysisTab    s={s} handlers={handlers} fmtTime={fmtTime} />}
        {tenderStep === 'config'   && <DraftConfiguratorTab s={s} handlers={handlers} />}
        {tenderStep === 'planning' && <PlanningStep          s={s} handlers={handlers} />}
        {tenderStep === 'drafting' && <DraftingStep          s={s} handlers={handlers} />}
      </div>
    </div>
  );
}
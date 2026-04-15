import { NJButton } from '@engie-group/fluid-design-system-react';
import { NAV_SECS } from '../data/constants';
import Stepper from './Stepper';
import TocStep from './TocStep';
import EvidenceStep from './EvidenceStep';
import DraftStep from './DraftStep';

export default function ProposalView({ proposalStep, activeSection, ph, editingPH, onGoStep, onSetSection, onStartPH, onStopPH, onPhChange }) {
  const frozen = proposalStep > 1;

  const navHeader = frozen ? (
    <div style={{ padding: '0 14px 10px' }}>
      <span style={{ fontSize: 12, fontWeight: 700 }}>Proposal Structure</span>
    </div>
  ) : (
    <div style={{ padding: '0 14px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, fontWeight: 700 }}>Proposal Structure</span>
      <span style={{ fontSize: 11, color: 'var(--nj-semantic-color-text-brand-default)', cursor: 'pointer', fontWeight: 600 }}>+ Add Section</span>
    </div>
  );

  const navFooter = !frozen && (
    <div style={{ padding: '10px 14px' }}>
      <div style={{ fontSize: 11, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', textAlign: 'center', cursor: 'pointer', padding: 8, border: '1.5px dashed var(--nj-semantic-color-border-neutral-subtle-default)', borderRadius: 8 }}>+ New Main Section</div>
    </div>
  );

  let content;
  if (proposalStep === 1) content = <TocStep />;
  else if (proposalStep === 2) content = <EvidenceStep ph={ph} editingPH={editingPH} onStartPH={onStartPH} onStopPH={onStopPH} onPhChange={onPhChange} />;
  else content = <DraftStep />;

  let bottomLeft, bottomRight;
  if (proposalStep === 1) {
    bottomLeft = 'You can edit section titles, reorder, or add new sections before validating.';
    bottomRight = (
      <>
        <NJButton label="✏ Edit" variant="secondary" emphasis="subtle" scale="sm" />
        <NJButton label="Freeze Golden ToC & Continue →" variant="primary" emphasis="bold" scale="sm" onClick={() => onGoStep(2)} />
      </>
    );
  } else if (proposalStep === 2) {
    bottomLeft = <NJButton label="← Back to Plan TOC" variant="secondary" emphasis="subtle" scale="sm" onClick={() => onGoStep(1)} />;
    bottomRight = (
      <>
        <NJButton label="✏ Edit" variant="secondary" emphasis="subtle" scale="sm" />
        <NJButton label="Draft a proposal →" variant="primary" emphasis="bold" scale="sm" onClick={() => onGoStep(3)} />
      </>
    );
  } else {
    bottomLeft = <NJButton label="← Back to Evidence" variant="secondary" emphasis="subtle" scale="sm" onClick={() => onGoStep(2)} />;
    bottomRight = (
      <>
        <NJButton label="Preview full document" variant="secondary" emphasis="subtle" scale="sm" />
        <NJButton label="↓ Export Word (.docx) →" variant="primary" emphasis="bold" scale="sm" iconName="download" />
      </>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <Stepper proposalStep={proposalStep} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* nav */}
        <div className="prop-nav">
          {navHeader}
          {NAV_SECS.map((s) => (
            <div
              key={s.id}
              className={`nav-item ${s.sub ? 'sub' : ''} ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => onSetSection(s.id)}
            >
              <span style={{ fontSize: 10, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)' }}>⠿</span>{s.id} {s.label}
            </div>
          ))}
          {navFooter}
        </div>

        {/* content area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {content}
          </div>
          <div className="bottom-bar">
            <span style={{ fontSize: 12, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)' }}>{bottomLeft}</span>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{bottomRight}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

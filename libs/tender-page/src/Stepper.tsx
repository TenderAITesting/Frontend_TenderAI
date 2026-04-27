const STEPS = ['upload', 'agents', 'config', 'planning', 'drafting'];
const LABELS = ['Tender Upload', 'Tender Analysis', 'Draft Configurator', 'Proposal Planning', 'Proposal Drafting'];

export default function BannerStepper({ tenderStep, isNew, currentMaxStepIdx, onGoStep }) {
  const cur = STEPS.indexOf(tenderStep);

  return (
    <div className="step-banner">
      {STEPS.map((step, i) => {
        const isCur = i === cur;
        const isDone = isNew ? i < cur : (i <= currentMaxStepIdx && !isCur);
        const blocked = isNew ? i > cur : i > currentMaxStepIdx;

        return (
          <div key={step} style={{ display: 'contents' }}>
            <div
              className={`banner-step${isCur ? ' s-cur' : isDone ? ' s-done' : ''}`}
              style={{ cursor: blocked ? 'default' : 'pointer', opacity: blocked ? 0.38 : 1 }}
              onClick={() => !blocked && onGoStep(step)}
            >
              <div className="bs-num">
                {isDone && !isCur ? '✓' : i + 1}
              </div>
              <div className="bs-label">{LABELS[i]}</div>
            </div>
            {i < 4 && <div className="banner-sep">›</div>}
          </div>
        );
      })}
    </div>
  );
}

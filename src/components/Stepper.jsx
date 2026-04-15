export default function Stepper({ proposalStep }) {
  const steps = [
    ['1', 'PLAN TOC'],
    ['2', 'EVIDENCE'],
    ['3', 'DRAFT & EXPORT'],
  ];

  return (
    <div className="stepper">
      <div className="step-wrap">
        {steps.map(([n, lbl], i) => {
          const num = parseInt(n);
          const done = num < proposalStep;
          const cur = num === proposalStep;
          return (
            <div key={n} style={{ display: 'contents' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className={`step-dot ${done ? 'done' : cur ? 'cur' : ''}`}>{done ? '✓' : n}</div>
                <div className={`step-label ${cur ? 'cur' : ''}`}>{i + 1}. {lbl}</div>
              </div>
              {i < 2 && <div className={`step-line ${num < proposalStep ? 'done' : ''}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

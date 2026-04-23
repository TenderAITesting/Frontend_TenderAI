import { NJButton, NJTag, NJSpinner, NJIcon } from '@engie-group/fluid-design-system-react';

export default function TenderAnalysisTab({ s, handlers, fmtTime }) {
  const { docs, docAgents, processing, isNew, elapsed, resultsValidated } = s;
  const { openRes, validateResults, goStep, launchProp } = handlers;

  const sel = {
    a1: docs.some(d => docAgents[d.key]?.a1),
    a2: docs.some(d => docAgents[d.key]?.a2),
    a3: docs.some(d => docAgents[d.key]?.a3),
  };

  const agData = [
    {
      id: 'a1', icon: 'person', title: 'Tender Key Information',
      desc: 'Extracts key dates, mandatory criteria, submission requirements, and pre-award activities.',
      status: !sel.a1 ? 'not_selected' : (processing || !isNew) ? 'completed' : 'pending',
      time: '09:14', hasView: true,
    },
    {
      id: 'a2', icon: 'grid_view', title: 'Technical Requirements',
      desc: 'Maps technical architecture requirements to company capabilities.',
      status: !sel.a2 ? 'not_selected' : (processing || !isNew) ? 'completed' : 'pending',
      time: '09:31', hasView: true,
    },
    {
      id: 'a3', icon: 'warning', title: 'Project Risks',
      desc: 'Identifies legal liabilities, operational constraints, and compliance risks.',
      status: !sel.a3 ? 'not_selected' : (processing || !isNew) ? (!isNew ? 'completed' : 'running') : 'pending',
      time: '09:47', hasView: !isNew,
    },
  ];

  const anySelected = sel.a1 || sel.a2 || sel.a3;
  const allSelectedCompleted = anySelected && agData.every(a => !sel[a.id] || a.status === 'completed');

  function statusBadge(status) {
    if (status === 'completed')    return <NJTag variant="green"  scale="xs" label="COMPLETED"    />;
    if (status === 'running')      return <NJTag variant="orange" scale="xs" label="RUNNING"      />;
    if (status === 'not_selected') return <NJTag variant="grey"   scale="xs" label="NOT SELECTED" />;
    return <NJTag scale="xs" label="PENDING" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 112px)' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px' }}>

        <div style={{ fontSize: 10, color: 'var(--nj-core-color-reference-neutral-500)', fontWeight: 700, letterSpacing: '.1em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ color: 'var(--nj-core-color-reference-brand-500)', fontSize: 12 }}>✦</span> ANALYSIS AGENTS
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 28 }}>
          {agData.map(a => {
            const isDone = a.status === 'completed';
            const isRun  = a.status === 'running';
            const isNone = a.status === 'not_selected';
            return (
              <div
                key={a.id}
                className={`agent-card${isRun ? ' running' : ''}`}
                style={{ opacity: isNone ? 0.5 : 1 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 11 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: isRun ? 'var(--nj-core-color-reference-brand-100)' : 'var(--nj-semantic-color-background-neutral-secondary-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--nj-core-color-reference-brand-500)' }}>
                    <NJIcon name={a.icon} style={{ fontSize: 20 }} />
                  </div>
                  {statusBadge(a.status)}
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 5 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-500)', lineHeight: 1.55 }}>{a.desc}</div>
                {(isDone || isRun) && (
                  <div style={{ fontSize: 11, color: 'var(--nj-core-color-reference-neutral-500)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <NJIcon name="schedule" style={{ fontSize: 13 }} />
                    Apr 13, 2026 · {a.time}
                  </div>
                )}
                {isRun && (
                  <div className="elapsed-inline">
                    <NJSpinner scale="2xs" />
                    Processing elapsed: {fmtTime(elapsed)}
                  </div>
                )}
                {isDone && a.hasView && (
                  <NJButton
                    variant="secondary"
                    emphasis="subtle"
                    scale="sm"
                    icon="visibility"
                    label="View Results"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
                    onClick={() => openRes(a.id)}
                  />
                )}
              </div>
            );
          })}
        </div>

        {allSelectedCompleted && !resultsValidated && (
          <div style={{ marginBottom: 24, padding: '16px 20px', background: 'var(--nj-semantic-color-background-status-warning-subtle-default)', border: '1.5px solid var(--nj-core-color-reference-status-warning-400)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Review required before proceeding</div>
              <div style={{ fontSize: 12, color: 'var(--nj-semantic-color-text-neutral-contrast-default)' }}>Please review the results of all analysis agents above before configuring the proposal draft.</div>
            </div>
            <NJButton variant="primary" icon="check_circle" label="Validate Analysis Results" onClick={validateResults} style={{ flexShrink: 0 }} />
          </div>
        )}

        {resultsValidated && (
          <div style={{ marginBottom: 24, padding: '12px 20px', background: 'var(--nj-semantic-color-background-status-success-subtle-default)', border: '1.5px solid var(--nj-core-color-reference-status-success-400)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <NJIcon name="check_circle" style={{ fontSize: 18, color: 'var(--nj-semantic-color-text-status-success-primary-default)' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--nj-semantic-color-text-status-success-primary-default)' }}>Analysis results validated — proceed to Draft Configurator</span>
          </div>
        )}

      </div>

      <div className="bottom-bar">
        <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="arrow_back" label="Tender Upload" onClick={() => goStep('upload')} />
        <NJButton
          variant="primary"
          icon="arrow_forward"
          label="Continue to Draft Configurator"
          disabled={!resultsValidated}
          onClick={resultsValidated ? launchProp : undefined}
        />
      </div>
    </div>
  );
}

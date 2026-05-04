import { NJButton, NJTag, NJSpinner, NJIcon } from '@engie-group/fluid-design-system-react';

export default function TenderAnalysisTab({ s, handlers, fmtTime }) {
  const { docs, docAgents, processing, isNew, elapsed, resultsValidated } = s;
  const { openRes, goStep, launchProp } = handlers;

  const sel = {
    a1: docs.some(d => docAgents[d.key]?.a1),
    a2: docs.some(d => docAgents[d.key]?.a2),
    a3: docs.some(d => docAgents[d.key]?.a3),
  };

  const agData = [
    {
      id: 'a1', icon: 'manage_search',
      title: 'Tender Key Information',
      desc: 'Extracts key tender facts, submission requirements, timelines, and pre-award activities.',
      accent: 'var(--nj-core-color-reference-brand-400)',
      accentBg: 'var(--nj-core-color-reference-brand-100)',
      status: !sel.a1 ? 'not_selected' : resultsValidated.a1 ? 'validated' : (processing || !isNew) ? 'completed' : 'pending',
      time: '09:14', hasView: true,
    },
    {
      id: 'a2', icon: 'checklist',
      title: 'Technical Requirements',
      desc: 'Extracts and structures technical requirements from the tender documents.',
      accent: 'var(--nj-core-color-reference-brand-600)',
      accentBg: 'var(--nj-core-color-reference-brand-200)',
      status: !sel.a2 ? 'not_selected' : resultsValidated.a2 ? 'validated' : (processing || !isNew) ? 'completed' : 'pending',
      time: '09:31', hasView: true,
    },
    {
      id: 'a3', icon: 'gpp_maybe',
      title: 'Project Risks',
      desc: 'Identifies technical, commercial, contractual, and delivery risks based on tender context and requirements.',
      accent: 'var(--nj-core-color-reference-brand-800)',
      accentBg: 'var(--nj-core-color-reference-brand-300)',
      status: !sel.a3 ? 'not_selected' : resultsValidated.a3 ? 'validated' : (processing || !isNew) ? (!isNew ? 'completed' : 'running') : 'pending',
      time: '09:47', hasView: !isNew,
    },
  ];

  const anySelected = sel.a1 || sel.a2 || sel.a3;
  const allSelectedValidated = anySelected && agData.every(a => !sel[a.id] || a.status === 'validated');

  function statusBadge(status) {
    if (status === 'validated')    return <NJTag variant="green"  scale="xs" label="VALIDATED"    />;
    if (status === 'completed')    return <NJTag variant="green"  scale="xs" label="COMPLETED"    />;
    if (status === 'running')      return <NJTag variant="orange" scale="xs" label="RUNNING"      />;
    if (status === 'not_selected') return <NJTag variant="grey"   scale="xs" label="NOT SELECTED" />;
    return <NJTag scale="xs" label="PENDING" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, alignItems: 'stretch' }}>
          {agData.map(a => {
            const isDone      = a.status === 'completed';
            const isValidated = a.status === 'validated';
            const isRun       = a.status === 'running';
            const isNone      = a.status === 'not_selected';

            const borderColor = isValidated
              ? 'var(--nj-core-color-reference-status-success-400)'
              : isRun
              ? 'var(--nj-core-color-reference-brand-500)'
              : 'var(--nj-semantic-color-border-neutral-minimal-default)';

            return (
              <div
                key={a.id}
                className={isRun ? 'agent-card running' : 'agent-card'}
                style={{
                  opacity: isNone ? 0.4 : 1,
                  border: `1.5px solid ${borderColor}`,
                  boxShadow: isValidated
                    ? '0 0 0 3px var(--nj-semantic-color-background-status-success-subtle-default)'
                    : 'var(--nj-semantic-elevation-shadow-2-dp)',
                  display: 'flex', flexDirection: 'column',
                  minHeight: 300,
                  padding: 0, overflow: 'hidden', borderRadius: 12,
                  transition: 'box-shadow .2s, border-color .2s',
                }}
              >
                {/* Accent bar */}
                <div style={{
                  height: 5,
                  background: isNone
                    ? 'var(--nj-semantic-color-border-neutral-minimal-default)'
                    : isValidated
                    ? 'var(--nj-core-color-reference-status-success-400)'
                    : a.accent,
                  flexShrink: 0,
                }} />

                {/* Body */}
                <div style={{ padding: '22px 22px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>

                  {/* Icon + status badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                      background: isNone
                        ? 'var(--nj-semantic-color-background-neutral-secondary-default)'
                        : isValidated
                        ? 'var(--nj-semantic-color-background-status-success-subtle-default)'
                        : a.accentBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isNone
                        ? 'var(--nj-core-color-reference-neutral-400)'
                        : isValidated
                        ? 'var(--nj-core-color-reference-status-success-600)'
                        : a.accent,
                    }}>
                      <NJIcon name={isValidated ? 'verified' : a.icon} style={{ fontSize: 28 }} />
                    </div>
                    {statusBadge(a.status)}
                  </div>

                  {/* Title */}
                  <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3, marginBottom: 5 }}>
                    {a.title}
                  </div>

                  {/* Subtitle */}
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase',
                    color: isNone ? 'var(--nj-core-color-reference-neutral-400)' : a.accent,
                    marginBottom: 14,
                  }}>
                    {a.subtitle}
                  </div>

                  {/* Description */}
                  <div style={{ fontSize: 13, color: 'var(--nj-core-color-reference-neutral-500)', lineHeight: 1.65, flex: 1 }}>
                    {a.desc}
                  </div>

                  {/* Timestamp */}
                  {(isDone || isValidated || isRun) && (
                    <div style={{ fontSize: 11, color: 'var(--nj-core-color-reference-neutral-400)', marginTop: 16, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <NJIcon name="schedule" style={{ fontSize: 14 }} />
                      Apr 13, 2026 · {a.time}
                    </div>
                  )}

                  {/* Running */}
                  {isRun && (
                    <div className="elapsed-inline" style={{ marginTop: 12 }}>
                      <NJSpinner scale="2xs" />
                      Processing elapsed: {fmtTime(elapsed)}
                    </div>
                  )}
                </div>

                {/* Footer action */}
                {(isDone || isValidated) && a.hasView ? (
                  <div style={{ padding: '16px 22px 22px', marginTop: 16, borderTop: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)' }}>
                    <NJButton
                      variant={isValidated ? 'secondary' : 'primary'}
                      emphasis="subtle"
                      scale="sm"
                      icon="visibility"
                      label="View Results"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => openRes(a.id)}
                    />
                  </div>
                ) : (
                  <div style={{ height: 22 }} />
                )}
              </div>
            );
          })}
        </div>

      </div>

      <div className="bottom-bar" style={{ flexDirection: 'column', gap: 0, padding: 0 }}>
        {!allSelectedValidated && anySelected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 24px 0', justifyContent: 'flex-end' }}>
            <NJIcon name="info" style={{ fontSize: 14, color: 'var(--nj-core-color-reference-neutral-400)' }} />
            <span style={{ fontSize: 15, color: 'var(--nj-core-color-reference-neutral-400)' }}>
              Open each analysis and click <strong>Validate Results</strong> to continue.
            </span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '10px 24px' }}>
          <NJButton variant="secondary" emphasis="subtle" scale="md" icon="arrow_back" label="Tender Upload" onClick={() => goStep('documents')} />
          <NJButton
            variant="primary"
            scale="md"
            icon="arrow_forward"
            label="Continue to Draft Configurator"
            disabled={!allSelectedValidated}
            onClick={launchProp}
          />
        </div>
      </div>
    </div>
  );
}
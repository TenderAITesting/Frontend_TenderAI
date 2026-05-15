import { NJButton, NJTag, NJSpinner, NJIcon } from '@engie-group/fluid-design-system-react';
import styles from './TenderAnalysisTab.module.css';

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
    <div className={styles["ta-container"]}>
      <div className={styles["ta-scroll"]}>

        <div className={styles["ta-grid"]}>
          {agData.map(a => {
            const isDone      = a.status === 'completed';
            const isValidated = a.status === 'validated';
            const isRun       = a.status === 'running';
            const isNone      = a.status === 'not_selected';

            return (
              <div
                key={a.id}
                className={`${styles["ta-card"]}${isRun ? ` ${styles["ta-card-running"]}` : ''}${isValidated ? ` ${styles["ta-card-validated"]}` : ''}${isNone ? ` ${styles["ta-card-none"]}` : ''}`}
              >
                {/* Accent bar */}
                <div
                  className={styles["ta-accent-bar"]}
                  style={{
                    background: isNone
                      ? 'var(--nj-semantic-color-border-neutral-minimal-default)'
                      : isValidated
                      ? 'var(--nj-core-color-reference-status-success-400)'
                      : a.accent,
                  }}
                />

                {/* Body */}
                <div className={styles["ta-card-body"]}>

                  {/* Icon + status badge */}
                  <div className={styles["ta-icon-row"]}>
                    <div
                      className={styles["ta-icon"]}
                      style={{
                        background: isNone
                          ? 'var(--nj-semantic-color-background-neutral-secondary-default)'
                          : isValidated
                          ? 'var(--nj-semantic-color-background-status-success-subtle-default)'
                          : a.accentBg,
                        color: isNone
                          ? 'var(--nj-core-color-reference-neutral-400)'
                          : isValidated
                          ? 'var(--nj-core-color-reference-status-success-600)'
                          : a.accent,
                      }}
                    >
                      <NJIcon name={isValidated ? 'verified' : a.icon} style={{ fontSize: 28 }} />
                    </div>
                    {statusBadge(a.status)}
                  </div>

                  {/* Title */}
                  <div className={styles["ta-card-title"]}>{a.title}</div>

                  {/* Subtitle */}
                  <div
                    className={styles["ta-card-subtitle"]}
                    style={{ color: isNone ? 'var(--nj-core-color-reference-neutral-400)' : a.accent }}
                  >
                    {a.subtitle}
                  </div>

                  {/* Description */}
                  <div className={styles["ta-card-desc"]}>{a.desc}</div>

                  {/* Timestamp */}
                  {(isDone || isValidated || isRun) && (
                    <div className={styles["ta-timestamp"]}>
                      <NJIcon name="schedule" style={{ fontSize: 14 }} />
                      Apr 13, 2026 · {a.time}
                    </div>
                  )}

                  {/* Running */}
                  {isRun && (
                    <div className={`${styles["elapsed-inline"]} ${styles["ta-elapsed"]}`}>
                      <NJSpinner scale="2xs" />
                      Processing elapsed: {fmtTime(elapsed)}
                    </div>
                  )}
                </div>

                {/* Footer action */}
                {(isDone || isValidated) && a.hasView ? (
                  <div className={styles["ta-card-footer"]}>
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
                  <div className={styles["ta-card-spacer"]} />
                )}
              </div>
            );
          })}
        </div>

      </div>

      <div className={`bottom-bar ${styles["ta-bottom-bar"]}`}>
        {!allSelectedValidated && anySelected && (
          <div className={styles["ta-bottom-hint"]}>
            <NJIcon name="info" style={{ fontSize: 14, color: 'var(--nj-core-color-reference-neutral-400)' }} />
            <span className={styles["ta-bottom-hint-text"]}>
              Open each analysis and click <strong>Validate Results</strong> to continue.
            </span>
          </div>
        )}
        <div className={styles["ta-bottom-controls"]}>
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
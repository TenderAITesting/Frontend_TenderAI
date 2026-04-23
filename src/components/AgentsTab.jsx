import { useState } from 'react';
import { NJButton, NJTag, NJSpinner, NJRadioGroup, NJRadio, NJCheckbox, NJInlineMessage, NJIcon } from '@engie-group/fluid-design-system-react';

export default function AgentsTab({ s, handlers, fmtTime }) {
  const { docs, docAgents, processing, isNew, elapsed, templateType, enrichedOpts, resultsValidated } = s;
  const { openRes, launchProp, setTemplate, togEnriched, openDisc, validateResults } = handlers;
  const [dragOverOffers, setDragOverOffers] = useState(false);
  const [dragOverRefs, setDragOverRefs] = useState(false);

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
    if (status === 'completed')    return <NJTag variant="green" scale="xs" label="COMPLETED" />;
    if (status === 'running')      return <NJTag variant="orange" scale="xs" label="RUNNING" />;
    if (status === 'not_selected') return <NJTag variant="grey" scale="xs" label="NOT SELECTED" />;
    return <NJTag scale="xs" label="PENDING" />;
  }

  const isEnriched = templateType === 'enriched';

  return (
    <div style={{ padding: '22px 24px' }}>
      {/* Phase 1 */}
      <div style={{ fontSize: 10, color: 'var(--nj-core-color-reference-neutral-500)', fontWeight: 700, letterSpacing: '.1em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ color: 'var(--nj-core-color-reference-brand-500)', fontSize: 12 }}>✦</span> PHASE 1 — ANALYSIS AGENTS
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 28 }}>
        {agData.map(a => {
          const isDone = a.status === 'completed';
          const isRun = a.status === 'running';
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

      {/* Validation gate */}
      {allSelectedCompleted && !resultsValidated && (
        <div style={{ marginBottom: 24, padding: '16px 20px', background: 'var(--nj-semantic-color-background-status-warning-subtle-default)', border: '1.5px solid var(--nj-core-color-reference-status-warning-400)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Review required before Phase 2</div>
            <div style={{ fontSize: 12, color: 'var(--nj-semantic-color-text-neutral-contrast-default)' }}>Please review the results of all analysis agents above before proceeding to proposal drafting.</div>
          </div>
          <NJButton variant="primary" icon="check_circle" label="Validate Analysis Results" onClick={validateResults} style={{ flexShrink: 0 }} />
        </div>
      )}
      {resultsValidated && (
        <div style={{ marginBottom: 24, padding: '12px 20px', background: 'var(--nj-semantic-color-background-status-success-subtle-default)', border: '1.5px solid var(--nj-core-color-reference-status-success-400)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <NJIcon name="check_circle" style={{ fontSize: 18, color: 'var(--nj-semantic-color-text-status-success-primary-default)' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--nj-semantic-color-text-status-success-primary-default)' }}>Analysis results validated — Phase 2 unlocked</span>
        </div>
      )}

      {/* Phase 2 */}
      <div style={{ fontSize: 10, color: 'var(--nj-core-color-reference-neutral-500)', fontWeight: 700, letterSpacing: '.1em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ color: 'var(--nj-core-color-reference-brand-500)', fontSize: 12 }}>✦</span> PHASE 2 — PROPOSAL DRAFTING
      </div>

      <div className="card" style={{ padding: 22 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
          {/* Left: Configure */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <NJIcon name="tune" style={{ fontSize: 16, color: 'var(--nj-core-color-reference-brand-500)' }} />
              Configure Draft Parameters
            </div>

            {/* Template choice */}
            <div style={{ marginBottom: 16 }}>
              <div className="inp-label" style={{ marginBottom: 6 }}>1. CHOOSE THE TEMPLATE</div>
              <div style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-500)', marginBottom: 9, lineHeight: 1.55 }}>
                Define your proposal's structure: use the standard company framework or generate a context-aware Table of Contents enriched by your specific source documents.
              </div>
              <NJRadioGroup orientation="row" style={{ gap: 10 }}>
                {['standard', 'enriched'].map(t => (
                  <NJRadio
                    key={t}
                    value={t}
                    label={t === 'standard' ? 'Standard ToC' : 'Enriched ToC'}
                    checked={templateType === t}
                    onChange={() => setTemplate(t)}
                  />
                ))}
              </NJRadioGroup>
              
              {!isEnriched && (
                <div style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <NJCheckbox
                    checked={enrichedOpts.methodology}
                    onChange={() => togEnriched('methodology')}
                  />
                  <span
                    style={{ fontSize: 12, cursor: 'pointer', color: enrichedOpts.methodology ? 'var(--nj-core-color-reference-brand-500)' : 'inherit', fontWeight: enrichedOpts.methodology ? 600 : 400 }}
                    onClick={() => togEnriched('methodology')}
                  >Include Methodology documents</span>
                </div>
              )}

              {isEnriched && (
                <div style={{ marginTop: 11, padding: 12, background: 'var(--nj-semantic-color-background-neutral-secondary-default)', borderRadius: 8, border: '1.5px solid var(--nj-semantic-color-border-neutral-minimal-default)' }}>
                  <div className="inp-label" style={{ marginBottom: 9 }}>INCLUDE IN ENRICHED TOC</div>
                  {[['context', 'Current Project Context'], ['offers', 'Past Offers / Methodology'], ['refs', 'Reference Projects']].map(([k, lbl]) => (
                    <div key={k} style={{ marginBottom: 7, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <NJCheckbox
                        checked={enrichedOpts[k]}
                        onChange={() => togEnriched(k)}
                      />
                      <span
                        style={{ fontSize: 12, cursor: 'pointer', color: enrichedOpts[k] ? 'var(--nj-core-color-reference-brand-500)' : 'inherit', fontWeight: enrichedOpts[k] ? 600 : 400 }}
                        onClick={() => togEnriched(k)}
                      >{lbl}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past offers */}
            <div style={{ marginBottom: 13 }}>
              <div className="inp-label" style={{ marginBottom: 7 }}>2. PAST OFFERS</div>
              <div
                style={{ border: `1.5px dashed ${dragOverOffers ? 'var(--nj-core-color-reference-brand-500)' : 'var(--nj-semantic-color-border-neutral-subtle-default)'}`, borderRadius: 8, padding: 14, textAlign: 'center', background: 'var(--nj-semantic-color-background-neutral-secondary-default)', transition: 'border-color .2s' }}
                onDragOver={e => { e.preventDefault(); setDragOverOffers(true); }}
                onDragLeave={() => setDragOverOffers(false)}
                onDrop={e => { e.preventDefault(); setDragOverOffers(false); openDisc('pastoffers'); }}
              >
                <div style={{ fontSize: 11, color: 'var(--nj-core-color-reference-neutral-400)', marginBottom: 8 }}>Drop files here or</div>
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="folder_open" label="Browse Files" onClick={() => openDisc('pastoffers')} />
              </div>
            </div>

            {/* Project references */}
            <div style={{ marginBottom: 16 }}>
              <div className="inp-label" style={{ marginBottom: 7 }}>3. PROJECT REFERENCES</div>
              <div
                style={{ border: `1.5px dashed ${dragOverRefs ? 'var(--nj-core-color-reference-brand-500)' : 'var(--nj-semantic-color-border-neutral-subtle-default)'}`, borderRadius: 8, padding: 14, textAlign: 'center', background: 'var(--nj-semantic-color-background-neutral-secondary-default)', transition: 'border-color .2s' }}
                onDragOver={e => { e.preventDefault(); setDragOverRefs(true); }}
                onDragLeave={() => setDragOverRefs(false)}
                onDrop={e => { e.preventDefault(); setDragOverRefs(false); openDisc('references'); }}
              >
                <div style={{ fontSize: 11, color: 'var(--nj-core-color-reference-neutral-400)', marginBottom: 8 }}>Drop files here or</div>
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="folder_open" label="Browse Files" onClick={() => openDisc('references')} />
              </div>
            </div>
          </div>

          {/* Right: Launch */}
          <div style={{ borderLeft: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', paddingLeft: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--nj-core-color-reference-brand-500)', letterSpacing: '.06em', marginBottom: 8 }}>PROPOSAL GENERATION</div>
            <p style={{ fontSize: 13, color: 'var(--nj-semantic-color-text-neutral-contrast-default)', lineHeight: 1.75, marginBottom: 20 }}>
              This step synthetizes Phase 1 analysis with your organizational templates and past performance data to generate a complete, structured technical proposal.
            </p>
            {!resultsValidated && allSelectedCompleted && (
              <div style={{ fontSize: 11, color: 'var(--nj-semantic-color-text-status-warning-primary-default)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <NJIcon name="lock" style={{ fontSize: 14 }} />
                Validate analysis results above to unlock
              </div>
            )}
            <NJButton
              variant="primary"
              icon="rocket_launch"
              label="Launch Proposal Generation"
              onClick={resultsValidated ? launchProp : undefined}
              disabled={!resultsValidated}
              style={{ width: '100%', justifyContent: 'center' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

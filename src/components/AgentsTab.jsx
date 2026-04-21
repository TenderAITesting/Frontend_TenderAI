import { NJButton, NJTag, NJSpinner, NJRadioGroup, NJRadio, NJCheckbox, NJInlineMessage } from '@engie-group/fluid-design-system-react';

export default function AgentsTab({ s, handlers, fmtTime }) {
  const { docs, docAgents, processing, isNew, elapsed, templateType, enrichedOpts } = s;
  const { openRes, launchProp, setTemplate, togEnriched, openDisc } = handlers;

  const sel = {
    a1: docs.some(d => docAgents[d.key]?.a1),
    a2: docs.some(d => docAgents[d.key]?.a2),
    a3: docs.some(d => docAgents[d.key]?.a3),
  };

  const agData = [
    {
      id: 'a1', icon: '👤', title: 'Key Info & Activities Agent',
      desc: 'Extracts key dates, mandatory criteria, submission requirements, and pre-award activities.',
      status: !sel.a1 ? 'not_selected' : (processing || !isNew) ? 'completed' : 'pending',
      time: '09:14', hasView: true,
    },
    {
      id: 'a2', icon: '⊞', title: 'Technical Extraction Agent',
      desc: 'Maps technical architecture requirements to company capabilities.',
      status: !sel.a2 ? 'not_selected' : (processing || !isNew) ? 'completed' : 'pending',
      time: '09:31', hasView: true,
    },
    {
      id: 'a3', icon: '⚠', title: 'Risk Analysis Agent',
      desc: 'Identifies legal liabilities, operational constraints, and compliance risks.',
      status: !sel.a3 ? 'not_selected' : (processing || !isNew) ? (!isNew ? 'completed' : 'running') : 'pending',
      time: '09:47', hasView: !isNew,
    },
  ];

  function statusBadge(status) {
    if (status === 'completed')    return <NJTag variant="green" scale="xs">COMPLETED</NJTag>;
    if (status === 'running')      return <NJTag variant="orange" scale="xs">RUNNING</NJTag>;
    if (status === 'not_selected') return <NJTag variant="grey" scale="xs">NOT SELECTED</NJTag>;
    return <NJTag scale="xs">PENDING</NJTag>;
  }

  const isEnriched = templateType === 'enriched';

  return (
    <div style={{ padding: '22px 24px' }}>
      {/* Phase 1 */}
      <div style={{ fontSize: 10, color: '#7E95A8', fontWeight: 700, letterSpacing: '.1em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ color: '#13B5CB', fontSize: 12 }}>✦</span> PHASE 1 — ANALYSIS AGENTS
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
                <div style={{ width: 36, height: 36, borderRadius: 8, background: isRun ? '#E8F8FC' : '#F5F8FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{a.icon}</div>
                {statusBadge(a.status)}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 5 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: '#7E95A8', lineHeight: 1.55 }}>{a.desc}</div>
              {(isDone || isRun) && (
                <div style={{ fontSize: 11, color: '#7E95A8', marginTop: 6 }}>🕐 Apr 13, 2026 · {a.time}</div>
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
                  label="View Results"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
                  onClick={() => openRes(a.id)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Phase 2 */}
      <div style={{ fontSize: 10, color: '#7E95A8', fontWeight: 700, letterSpacing: '.1em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ color: '#13B5CB', fontSize: 12 }}>✦</span> PHASE 2 — PROPOSAL DRAFTING
      </div>

      <div className="card" style={{ padding: 22 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
          {/* Left: Configure */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15 }}>⊞</span> Configure Draft Parameters
            </div>

            {/* Template choice */}
            <div style={{ marginBottom: 16 }}>
              <div className="inp-label" style={{ marginBottom: 9 }}>1. CHOOSE THE TEMPLATE</div>
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
              {isEnriched && (
                <div style={{ marginTop: 11, padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1.5px solid #E2EBF3' }}>
                  <div className="inp-label" style={{ marginBottom: 9 }}>INCLUDE IN ENRICHED TOC</div>
                  {[['context', 'Current Project Context'], ['offers', 'Past Offers / Methodology'], ['refs', 'Reference Projects']].map(([k, lbl]) => (
                    <div key={k} style={{ marginBottom: 7, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <NJCheckbox
                        checked={enrichedOpts[k]}
                        onChange={() => togEnriched(k)}
                      />
                      <span style={{ fontSize: 12, cursor: 'pointer', color: enrichedOpts[k] ? '#13B5CB' : 'inherit', fontWeight: enrichedOpts[k] ? 600 : 400 }}
                        onClick={() => togEnriched(k)}>{lbl}</span>
                    </div>
                  ))}
                  <NJInlineMessage variant="information" style={{ marginTop: 8 }}>
                    You can also upload <strong>methodology documents</strong> alongside past offers — Agent 5 will use them to enrich the Table of Contents structure.
                  </NJInlineMessage>
                </div>
              )}
            </div>

            {/* Past offers */}
            <div style={{ marginBottom: 13 }}>
              <div className="inp-label" style={{ marginBottom: 7 }}>2. PAST OFFERS</div>
              <div style={{ border: '1.5px dashed #D1DBE6', borderRadius: 8, padding: 14, textAlign: 'center', background: '#FAFBFC' }}>
                <div style={{ fontSize: 11, color: '#9EB0C0', marginBottom: 8 }}>Drop files here or</div>
                <NJButton variant="secondary" emphasis="subtle" scale="sm" label="Browse Files" onClick={() => openDisc('pastoffers')} />
              </div>
            </div>

            {/* Project references */}
            <div style={{ marginBottom: 16 }}>
              <div className="inp-label" style={{ marginBottom: 7 }}>3. PROJECT REFERENCES</div>
              <div style={{ border: '1.5px dashed #D1DBE6', borderRadius: 8, padding: 14, textAlign: 'center', background: '#FAFBFC' }}>
                <div style={{ fontSize: 11, color: '#9EB0C0', marginBottom: 8 }}>Drop files here or</div>
                <NJButton variant="secondary" emphasis="subtle" scale="sm" label="Browse Files" onClick={() => openDisc('references')} />
              </div>
            </div>

            <NJInlineMessage variant="information">
              <strong>Pro-tip:</strong> Including at least two past proposals from the same sector improves tone-matching by up to 40%.
            </NJInlineMessage>
          </div>

          {/* Right: Launch */}
          <div style={{ borderLeft: '1px solid #E2EBF3', paddingLeft: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#13B5CB', letterSpacing: '.06em', marginBottom: 8 }}>PROPOSAL GENERATION</div>
            <p style={{ fontSize: 13, color: '#4A6070', lineHeight: 1.75, marginBottom: 20 }}>
              Agent 5 synthesizes Phase 1 analysis with your organizational templates and past performance data to generate a complete, structured technical proposal.
            </p>
            <NJButton variant="primary" label="Launch Proposal Generation →" onClick={launchProp} style={{ width: '100%', justifyContent: 'center' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

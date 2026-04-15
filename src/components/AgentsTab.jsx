import { NJButton, NJBadge, NJSpinner, NJIcon } from '@engie-group/fluid-design-system-react';
import SkelLines from './SkelLines';

export default function AgentsTab({ processing, onOpenRes, onLaunchProp }) {
  const agentsData = [
    { icon: '👤', title: 'Agent 1: Key Info', desc: 'Extracting executive summaries, deadlines, and mandatory criteria.', status: processing ? 'completed' : 'pending', time: processing ? 'Last run: Apr 13, 2026 · 09:14' : '', hasView: true },
    { icon: '⊞', title: 'Agent 2: Technical', desc: 'Mapping technical architecture requirements to company capabilities.', status: processing ? 'completed' : 'pending', time: processing ? 'Last run: Apr 13, 2026 · 09:31' : '', hasView: false },
    { icon: '⚠', title: 'Agent 3: Risks', desc: 'Identifying legal liabilities and operational constraints.', status: processing ? 'running' : 'pending', time: processing ? 'Started: Apr 13, 2026 · 09:47' : '', hasView: false },
  ];

  return (
    <div style={{ padding: '16px 20px 24px' }}>
      <div style={{ fontSize: 10, color: '#7E95A8', fontWeight: 700, letterSpacing: '.1em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: '#13B5CB' }}>✦</span> PHASE 1: ANALYSIS AGENTS (1–3)
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 26 }}>
        {agentsData.map((a) => {
          const isRun = a.status === 'running';
          const isDone = a.status === 'completed';
          return (
            <div key={a.title} className={`agent-card ${isRun ? 'running' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: isRun ? '#E8F8FC' : '#F5F8FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{a.icon}</div>
                {isDone && <NJBadge variant="success" emphasis="subtle" scale="sm">COMPLETED</NJBadge>}
                {isRun && <NJBadge variant="warning" emphasis="subtle" scale="sm">RUNNING</NJBadge>}
                {!isDone && !isRun && <NJBadge variant="neutral" emphasis="subtle" scale="sm">NO PROCESSING LAUNCHED</NJBadge>}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: '#7E95A8', lineHeight: 1.5, marginBottom: 11 }}>{a.desc}</div>
              {a.time && <div style={{ fontSize: 11, color: '#7E95A8', marginBottom: 11 }}>🕐 {a.time}</div>}
              {isDone && (
                <NJButton
                  label="View Results"
                  variant="secondary"
                  emphasis="subtle"
                  scale="sm"
                  onClick={a.hasView ? onOpenRes : undefined}
                  disabled={!a.hasView}
                  style={{ width: '100%' }}
                />
              )}
              {isRun && (
                <NJButton
                  label="Processing..."
                  variant="primary"
                  emphasis="bold"
                  scale="sm"
                  disabled
                  iconName="sync"
                  style={{ width: '100%' }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 10, color: '#7E95A8', fontWeight: 700, letterSpacing: '.1em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: '#13B5CB' }}>✦</span> PHASE 2: AGENT 5 CONFIGURATION
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#13B5CB', letterSpacing: '.05em', marginBottom: 8 }}>PROPOSAL DRAFTING</div>
          <p style={{ fontSize: 13, color: '#1B2B3C', lineHeight: 1.65, marginBottom: 20 }}>
            Transform extracted requirements into a comprehensive technical proposal. Agent 5 synthesizes analysis from Phase 1 with your organizational templates and past performance data.
          </p>
          <NJButton
            label="Launch Proposal Generation →"
            variant="primary"
            emphasis="bold"
            onClick={onLaunchProp}
          />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>⊞</span> Configure Draft Parameters
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <div style={{ fontSize: 10, color: '#7E95A8', fontWeight: 700, letterSpacing: '.05em', marginBottom: 7 }}>1. REFERENCE PAST PROPOSALS</div>
              <div style={{ border: '1.5px dashed #E2EBF3', borderRadius: 8, padding: '14px 12px', textAlign: 'center', background: '#FAFBFC', marginBottom: 8 }}>
                <div style={{ fontSize: 20, color: '#7E95A8', marginBottom: 4 }}>+</div>
                <div style={{ fontSize: 11, color: '#7E95A8' }}>Drop past offers or <span style={{ color: '#13B5CB', cursor: 'pointer' }}>browse</span></div>
              </div>
              <div style={{ fontSize: 11, padding: '5px 8px', background: '#F5F8FB', borderRadius: 5, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span>▪ Offshore_Grid_202...</span><span style={{ color: '#7E95A8', cursor: 'pointer' }}>✕</span>
              </div>
              <div style={{ fontSize: 11, padding: '5px 8px', background: '#F5F8FB', borderRadius: 5, display: 'flex', justifyContent: 'space-between' }}>
                <span>▪ Solar_Plant_Specs...</span><span style={{ color: '#7E95A8', cursor: 'pointer' }}>✕</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#7E95A8', fontWeight: 700, letterSpacing: '.05em', marginBottom: 7 }}>2. ORIGINAL TOC TEMPLATE</div>
              <select style={{ width: '100%', border: '1px solid #E2EBF3', borderRadius: 6, padding: '7px 10px', fontSize: 12, background: '#fff', color: '#1B2B3C', cursor: 'pointer' }}>
                <option>Engineering Master Template</option>
                <option>Standard Proposal Template</option>
              </select>
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 10, color: '#7E95A8', fontWeight: 700, letterSpacing: '.05em', marginBottom: 6 }}>TOC PREVIEW</div>
                <SkelLines n={3} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: '9px 12px', background: '#EEF8FF', borderRadius: 6, fontSize: 11, color: '#2B6CB0', display: 'flex', gap: 8 }}>
            <span style={{ flexShrink: 0 }}>ℹ</span>
            <span><strong>Pro-tip:</strong> Including at least two past proposals from the energy sector improves Agent 5's tone-matching by up to 40%.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

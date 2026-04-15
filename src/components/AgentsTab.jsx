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
      <div style={{ fontSize: 10, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', fontWeight: 700, letterSpacing: '.1em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--nj-semantic-color-text-brand-default)' }}>✶</span> PHASE 1: ANALYSIS AGENTS (1–3)
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 26 }}>
        {agentsData.map((a) => {
          const isRun = a.status === 'running';
          const isDone = a.status === 'completed';
          return (
            <div key={a.title} className={`agent-card ${isRun ? 'running' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: isRun ? 'var(--nj-semantic-color-background-brand-subtle)' : 'var(--nj-semantic-color-background-neutral-secondary-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{a.icon}</div>
                {isDone && <NJBadge variant="success" emphasis="subtle" scale="sm">COMPLETED</NJBadge>}
                {isRun && <NJBadge variant="warning" emphasis="subtle" scale="sm">RUNNING</NJBadge>}
                {!isDone && !isRun && <NJBadge variant="neutral" emphasis="subtle" scale="sm">NO PROCESSING LAUNCHED</NJBadge>}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', lineHeight: 1.5, marginBottom: 11 }}>{a.desc}</div>
              {a.time && <div style={{ fontSize: 11, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', marginBottom: 11 }}>🕐 {a.time}</div>}
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

      <div style={{ fontSize: 10, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', fontWeight: 700, letterSpacing: '.1em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--nj-semantic-color-text-brand-default)' }}>✶</span> PHASE 2: AGENT 5 CONFIGURATION
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--nj-semantic-color-text-brand-default)', letterSpacing: '.05em', marginBottom: 8 }}>PROPOSAL DRAFTING</div>
          <p style={{ fontSize: 13, color: 'var(--nj-semantic-color-text-neutral-primary-default)', lineHeight: 1.65, marginBottom: 20 }}>
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
              <div style={{ fontSize: 10, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', fontWeight: 700, letterSpacing: '.05em', marginBottom: 7 }}>1. REFERENCE PAST PROPOSALS</div>
              <div style={{ border: '1.5px dashed var(--nj-semantic-color-border-neutral-subtle-default)', borderRadius: 12, padding: '18px 12px', textAlign: 'center', background: 'var(--nj-semantic-color-background-neutral-secondary-default)', marginBottom: 8 }}>
                <div style={{ fontSize: 20, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', marginBottom: 4 }}>+</div>
                <div style={{ fontSize: 11, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)' }}>Drop past offers or <span style={{ color: 'var(--nj-semantic-color-text-brand-default)', cursor: 'pointer', fontWeight: 600 }}>browse</span></div>
              </div>
              <div style={{ fontSize: 11, padding: '6px 10px', background: 'var(--nj-semantic-color-background-neutral-secondary-default)', borderRadius: 6, marginBottom: 5, display: 'flex', justifyContent: 'space-between', border: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)' }}>
                <span>▪ Offshore_Grid_202...</span><span style={{ color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', cursor: 'pointer' }}>✕</span>
              </div>
              <div style={{ fontSize: 11, padding: '6px 10px', background: 'var(--nj-semantic-color-background-neutral-secondary-default)', borderRadius: 6, display: 'flex', justifyContent: 'space-between', border: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)' }}>
                <span>▪ Solar_Plant_Specs...</span><span style={{ color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', cursor: 'pointer' }}>✕</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', fontWeight: 700, letterSpacing: '.05em', marginBottom: 7 }}>2. ORIGINAL TOC TEMPLATE</div>
              <select style={{ width: '100%', border: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)', borderRadius: 8, padding: '8px 10px', fontSize: 12, background: 'var(--nj-semantic-color-background-neutral-primary-default)', color: 'var(--nj-semantic-color-text-neutral-primary-default)', cursor: 'pointer', outline: 'none' }}>
                <option>Engineering Master Template</option>
                <option>Standard Proposal Template</option>
              </select>
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 10, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', fontWeight: 700, letterSpacing: '.05em', marginBottom: 6 }}>TOC PREVIEW</div>
                <SkelLines n={3} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--nj-semantic-color-background-neutral-secondary-default)', borderRadius: 10, fontSize: 11, color: 'var(--nj-semantic-color-text-neutral-secondary-default)', display: 'flex', gap: 8, border: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)' }}>
            <span style={{ flexShrink: 0 }}>ℹ</span>
            <span><strong>Pro-tip:</strong> Including at least two past proposals from the energy sector improves Agent 5's tone-matching by up to 40%.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

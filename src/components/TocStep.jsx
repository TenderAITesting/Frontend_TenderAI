import { useState } from 'react';
import { NJButton, NJInlineMessage } from '@engie-group/fluid-design-system-react';
import { STD_TOC, TOC_DETAILS, NAV_SECS } from '../data/constants';

export default function PlanningStep({ s, handlers }) {
  const { templateType, enrichedOpts, activeSection, planType } = s;
  const { setSection, goStep, freezeAndDraft } = handlers;

  const [isEditMode, setIsEditMode] = useState(false);
  const [hiddenNavIds, setHiddenNavIds] = useState(new Set());
  const [tocRows, setTocRows] = useState(() => {
    let t = [...STD_TOC];
    if (templateType === 'enriched') {
      if (enrichedOpts.context) t.splice(1, 0, { n: '0.1', label: 'Project Context & Background', sub: true, pages: '2 p.' });
      if (enrichedOpts.offers) {
        const i = t.findIndex(r => r.n === '4');
        if (i >= 0) t.splice(i + 1, 0, { n: '4.1', label: 'Past Offer Analysis', sub: true, pages: '2 p.' });
      }
      if (enrichedOpts.refs) {
        const j = t.findIndex(r => r.n === '4.1' || r.n === '4');
        if (j >= 0) t.splice(j + 2, 0, { n: '4.2', label: 'Reference Projects', sub: true, pages: '2 p.' });
      }
    }
    return t;
  });

  function deleteSection(navId, navLabel) {
    setHiddenNavIds(ids => new Set([...ids, navId]));
    setTocRows(rows => rows.filter(r => r.label !== navLabel));
  }

  const navItems = NAV_SECS
    .filter(sec => !hiddenNavIds.has(sec.id))
    .map(sec => (
      <div
        key={sec.id}
        className={`nav-item${sec.sub ? ' sub' : ''}${activeSection === sec.id ? ' active' : ''}`}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => setSection(sec.id)}>
          <span style={{ fontSize: 9, color: 'var(--nj-semantic-color-border-neutral-subtle-default)' }}>⠿</span>
          {sec.id} {sec.label}
        </div>
        {isEditMode && (
          <span
            style={{ cursor: 'pointer', color: 'var(--nj-core-color-reference-neutral-400)', fontSize: 15, padding: '0 6px', flexShrink: 0, lineHeight: 1 }}
            onClick={e => { e.stopPropagation(); deleteSection(sec.id, sec.label); }}
          >−</span>
        )}
      </div>
    ));

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Sidebar */}
      <div className="prop-nav">
        <div style={{ padding: '0 14px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700 }}>Proposal Structure</span>
        </div>
        {navItems}
        {isEditMode && (
          <div style={{ padding: '10px 14px' }}>
            <div
              style={{ fontSize: 11, color: 'var(--nj-core-color-reference-neutral-400)', textAlign: 'center', cursor: 'pointer', padding: 8, border: '1.5px dashed var(--nj-semantic-color-border-neutral-minimal-default)', borderRadius: 6 }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--nj-core-color-reference-brand-500)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--nj-semantic-color-border-neutral-minimal-default)'}
              onClick={() => setTocRows(rows => [...rows, { n: `${rows.length + 1}.0`, label: 'New Section', sub: false, pages: '—' }])}
            >
              + New Main Section
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px' }}>
          <NJInlineMessage variant="warning" style={{ marginBottom: 20 }}>
            <strong>Your validation is required.</strong> The proposal will not proceed to drafting until you confirm this Table of Contents. You can edit section titles or add new sections before freezing.
            {planType && (
              <div style={{ marginTop: 4, fontSize: 12, color: 'var(--nj-core-color-reference-neutral-500)' }}>
                Template: <strong>{planType === 'tailored' ? 'Tailored Plan' : 'Standard Plan'}</strong>
              </div>
            )}
          </NJInlineMessage>

          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--nj-semantic-color-background-neutral-secondary-default)' }}>
                  <th style={{ textAlign: 'left', padding: '9px 12px', borderBottom: '1.5px solid var(--nj-semantic-color-border-neutral-minimal-default)', fontSize: 11, fontWeight: 700, color: 'var(--nj-core-color-reference-neutral-500)', letterSpacing: '.06em', width: 50 }}>#</th>
                  <th style={{ textAlign: 'left', padding: '9px 12px', borderBottom: '1.5px solid var(--nj-semantic-color-border-neutral-minimal-default)', fontSize: 11, fontWeight: 700, color: 'var(--nj-core-color-reference-neutral-500)', letterSpacing: '.06em' }}>SECTION TITLE</th>
                  <th style={{ textAlign: 'right', padding: '9px 12px', borderBottom: '1.5px solid var(--nj-semantic-color-border-neutral-minimal-default)', fontSize: 11, fontWeight: 700, color: 'var(--nj-core-color-reference-neutral-500)', letterSpacing: '.06em', width: 90 }}>EST. PAGES</th>
                  <th style={{ textAlign: 'right', padding: '9px 12px', borderBottom: '1.5px solid var(--nj-semantic-color-border-neutral-minimal-default)', fontSize: 11, fontWeight: 700, color: 'var(--nj-core-color-reference-neutral-500)', letterSpacing: '.06em', width: 120 }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {tocRows.map(r => {
                  const det = TOC_DETAILS[r.n] || {};
                  return (
                    <tr
                      key={r.n}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--nj-semantic-color-background-neutral-secondary-default)'}
                      onMouseOut={e => e.currentTarget.style.background = ''}
                    >
                      <td style={{ padding: '10px 12px', paddingLeft: r.sub ? 28 : 12, borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', fontSize: 11, color: 'var(--nj-core-color-reference-neutral-400)', fontFamily: "'DM Mono', monospace", verticalAlign: 'top' }}>{r.n}</td>
                      <td style={{ padding: '10px 12px', paddingLeft: r.sub ? 28 : 12, borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: det.desc ? 4 : 0 }}>
                          <span style={{ fontSize: 13, fontWeight: r.sub ? 500 : 700 }}>{r.label}</span>
                          {r.warn && (
                            <span style={{ fontSize: 10, background: 'var(--nj-core-color-reference-status-warning-100)', color: 'var(--nj-semantic-color-text-status-warning-contrast-default)', border: '1px solid var(--nj-core-color-reference-status-warning-400)', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>⚠ No past offer loaded</span>
                          )}
                          {det.desc && <span style={{ fontSize: 11, color: 'var(--nj-core-color-reference-neutral-400)', fontStyle: 'italic' }}>{det.desc.length > 80 ? det.desc.slice(0, 80) + '…' : det.desc}</span>}
                        </div>
                        {det.guide && (
                          <div style={{ fontSize: 11, color: 'var(--nj-core-color-reference-neutral-500)', marginBottom: 4 }}>
                            <strong>Writing Guidelines</strong>{' '}
                            <span style={{ color: 'var(--nj-core-color-reference-neutral-400)' }}>{det.guide.length > 90 ? det.guide.slice(0, 90) + '…' : det.guide}</span>
                          </div>
                        )}
                        {det.example && (
                          <div style={{ fontSize: 11, color: 'var(--nj-core-color-reference-neutral-400)', marginBottom: 4 }}>
                            <strong style={{ color: 'var(--nj-core-color-reference-neutral-500)' }}>Content Example:</strong>{' '}
                            {det.example.length > 100 ? det.example.slice(0, 100) + '…' : det.example}{' '}
                            <span style={{ color: 'var(--nj-core-color-reference-brand-500)', cursor: 'pointer' }}>Review & Edit ›</span>
                          </div>
                        )}
                        {det.note && (
                          <div style={{ fontSize: 10, color: 'var(--nj-semantic-color-text-status-warning-contrast-default)', background: 'var(--nj-core-color-reference-status-warning-100)', border: '1px solid var(--nj-core-color-reference-status-warning-400)', borderRadius: 5, padding: '3px 8px', display: 'inline-block', marginTop: 2 }}>⚠ {det.note}</div>
                        )}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', textAlign: 'right', fontSize: 12, color: 'var(--nj-core-color-reference-neutral-400)', fontFamily: "'DM Mono', monospace", verticalAlign: 'top' }}>{r.pages || '—'}</td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', textAlign: 'right', verticalAlign: 'top' }}>
                        {isEditMode && (
                          <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="edit" label="Review and Edit" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bottom-bar">
          <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="arrow_back" label="Tender Analysis & Validation" onClick={() => goStep('agents')} />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <NJButton
              variant="secondary"
              emphasis="subtle"
              scale="sm"
              icon={isEditMode ? 'check' : 'edit'}
              label={isEditMode ? 'Done' : 'Edit Structure'}
              onClick={() => setIsEditMode(v => !v)}
            />
            <NJButton variant="primary" icon="lock" label="Freeze Golden ToC & Draft Proposal" onClick={freezeAndDraft} />
          </div>
        </div>
      </div>
    </div>
  );
}

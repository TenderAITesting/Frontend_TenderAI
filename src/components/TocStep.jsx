import { NJButton, NJInlineMessage } from '@engie-group/fluid-design-system-react';
import { STD_TOC, TOC_DETAILS, NAV_SECS } from '../data/constants';

export default function PlanningStep({ s, handlers }) {
  const { templateType, enrichedOpts, activeSection } = s;
  const { setSection, goStep, freezeAndDraft } = handlers;

  let toc = [...STD_TOC];
  if (templateType === 'enriched') {
    if (enrichedOpts.context) toc.splice(1, 0, { n: '0.1', label: 'Project Context & Background', sub: true, pages: '2 p.' });
    if (enrichedOpts.offers) {
      const i = toc.findIndex(r => r.n === '4');
      if (i >= 0) toc.splice(i + 1, 0, { n: '4.1', label: 'Past Offer Analysis', sub: true, pages: '2 p.' });
    }
    if (enrichedOpts.refs) {
      const j = toc.findIndex(r => r.n === '4.1' || r.n === '4');
      if (j >= 0) toc.splice(j + 2, 0, { n: '4.2', label: 'Reference Projects', sub: true, pages: '2 p.' });
    }
  }

  const navItems = NAV_SECS.map(sec => (
    <div
      key={sec.id}
      className={`nav-item${sec.sub ? ' sub' : ''}${activeSection === sec.id ? ' active' : ''}`}
      onClick={() => setSection(sec.id)}
    >
      <span style={{ fontSize: 9, color: '#CBD5E0' }}>⠿</span>
      {sec.id} {sec.label}
    </div>
  ));

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 112px)' }}>
      {/* Sidebar */}
      <div className="prop-nav">
        <div style={{ padding: '0 14px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700 }}>Proposal Structure</span>
          <span style={{ fontSize: 11, color: '#13B5CB', cursor: 'pointer', fontWeight: 600 }}>+ Add</span>
        </div>
        {navItems}
        <div style={{ padding: '10px 14px' }}>
          <div
            style={{ fontSize: 11, color: '#9EB0C0', textAlign: 'center', cursor: 'pointer', padding: 8, border: '1.5px dashed #E2EBF3', borderRadius: 6 }}
            onMouseOver={e => e.currentTarget.style.borderColor = '#13B5CB'}
            onMouseOut={e => e.currentTarget.style.borderColor = '#E2EBF3'}
          >
            + New Main Section
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px' }}>
          <NJInlineMessage variant="warning" style={{ marginBottom: 20 }}>
            <strong>Your validation is required.</strong> The proposal will not proceed to drafting until you confirm this Table of Contents. You can edit section titles or add new sections before freezing.
            <div style={{ marginTop: 4, fontSize: 12 }}>
              Template: <strong>{templateType === 'enriched' ? 'Enriched' : 'Standard'} ToC</strong>
            </div>
          </NJInlineMessage>

          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  <th style={{ textAlign: 'left', padding: '9px 12px', borderBottom: '1.5px solid #E2EBF3', fontSize: 11, fontWeight: 700, color: '#7E95A8', letterSpacing: '.06em', width: 50 }}>#</th>
                  <th style={{ textAlign: 'left', padding: '9px 12px', borderBottom: '1.5px solid #E2EBF3', fontSize: 11, fontWeight: 700, color: '#7E95A8', letterSpacing: '.06em' }}>SECTION TITLE</th>
                  <th style={{ textAlign: 'right', padding: '9px 12px', borderBottom: '1.5px solid #E2EBF3', fontSize: 11, fontWeight: 700, color: '#7E95A8', letterSpacing: '.06em', width: 90 }}>EST. PAGES</th>
                  <th style={{ textAlign: 'right', padding: '9px 12px', borderBottom: '1.5px solid #E2EBF3', fontSize: 11, fontWeight: 700, color: '#7E95A8', letterSpacing: '.06em', width: 120 }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {toc.map(r => {
                  const det = TOC_DETAILS[r.n] || {};
                  return (
                    <tr
                      key={r.n}
                      onMouseOver={e => e.currentTarget.style.background = '#F4F9FC'}
                      onMouseOut={e => e.currentTarget.style.background = ''}
                    >
                      <td style={{ padding: '10px 12px', paddingLeft: r.sub ? 28 : 12, borderBottom: '1px solid #EAEFF5', fontSize: 11, color: '#9EB0C0', fontFamily: "'DM Mono', monospace", verticalAlign: 'top' }}>{r.n}</td>
                      <td style={{ padding: '10px 12px', paddingLeft: r.sub ? 28 : 12, borderBottom: '1px solid #EAEFF5' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: det.desc ? 4 : 0 }}>
                          <span style={{ fontSize: 13, fontWeight: r.sub ? 500 : 700 }}>{r.label}</span>
                          {r.warn && <span style={{ fontSize: 10, background: '#FEF8ED', color: '#8A5A00', border: '1px solid #F5A623', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>⚠ No past offer loaded</span>}
                          {det.desc && <span style={{ fontSize: 11, color: '#9EB0C0', fontStyle: 'italic' }}>{det.desc.length > 80 ? det.desc.slice(0, 80) + '…' : det.desc}</span>}
                        </div>
                        {det.guide && (
                          <div style={{ fontSize: 11, color: '#7E95A8', marginBottom: 4 }}>
                            <strong>Writing Guidelines</strong>{' '}
                            <span style={{ color: '#9EB0C0' }}>{det.guide.length > 90 ? det.guide.slice(0, 90) + '…' : det.guide}</span>
                          </div>
                        )}
                        {det.example && (
                          <div style={{ fontSize: 11, color: '#9EB0C0', marginBottom: 4 }}>
                            <strong style={{ color: '#7E95A8' }}>Content Example:</strong>{' '}
                            {det.example.length > 100 ? det.example.slice(0, 100) + '…' : det.example}{' '}
                            <span style={{ color: '#13B5CB', cursor: 'pointer' }}>Review & Edit ›</span>
                          </div>
                        )}
                        {det.note && (
                          <div style={{ fontSize: 10, color: '#8A5A00', background: '#FEF8ED', border: '1px solid #F5A623', borderRadius: 5, padding: '3px 8px', display: 'inline-block', marginTop: 2 }}>⚠ {det.note}</div>
                        )}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #EAEFF5', textAlign: 'right', fontSize: 12, color: '#9EB0C0', fontFamily: "'DM Mono', monospace", verticalAlign: 'top' }}>{r.pages || '—'}</td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #EAEFF5', textAlign: 'right', verticalAlign: 'top' }}>
                        <NJButton variant="primary" scale="sm" label="Edit Section" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bottom-bar">
          <NJButton variant="secondary" emphasis="subtle" scale="sm" label="← Agents & Validation" onClick={() => goStep('agents')} />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <NJButton variant="secondary" emphasis="subtle" scale="sm" label="✎ Edit Structure" />
            <NJButton variant="primary" label="Freeze Golden ToC & Draft the Proposal →" onClick={freezeAndDraft} />
          </div>
        </div>
      </div>
    </div>
  );
}

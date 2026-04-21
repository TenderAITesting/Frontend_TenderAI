import { NJButton, NJTabs, NJTab } from '@engie-group/fluid-design-system-react';

const KEY_INFO_ROWS = [
  ['Issuing Organization', "COMMISSARIAT À L'ÉNERGIE ATOMIQUE ET AUX ÉNERGIES ALTERNATIVES (CEA)", 'p.2'],
  ['Is the project with ENGIE affiliate?', 'NO', null],
  ['Submission Deadline', '15 April 2024', 'p.4'],
];

const PRE_AWARD_SECTIONS = [
  { label: 'Doc 1 — RFP_Section_A_Technical_Scope.pdf', rows: [
    ['Liability Cap', 'Limited to 100% of contract value', 'p.9'],
    ['Performance Bond Required', 'Yes – 10% of contract value', 'p.11'],
    ['NDA Required', 'Yes – prior to bid submission', 'p.7'],
    ['Insurance Requirements', 'Min. €10M professional indemnity', 'p.13'],
  ]},
  { label: 'Doc 2 — Draft_Contract_Agreement.docx', rows: [
    ['Advance Payment Guarantee', '10% of contract price', 'p.12'],
    ['Retention Money', "5% – released on project completion", 'p.14'],
    ['Termination for Convenience', 'Client right with 30 days notice', 'p.16'],
  ]},
];

const CONTACTS = [
  ['Jérôme DUCOS', 'jerome.ducos@cea.fr', '04 66 39 78 73', 'p.15'],
  ['Yannis OUAKLI', 'yannis.ouakli@cea.fr', '04 66 39 71 77', 'p.15'],
];

const AGENT_TITLES = {
  a1: 'Key Info & Activities Agent — Results',
  a2: 'Technical Extraction Agent — Results',
  a3: 'Risk Analysis Agent — Results',
};

function InfoRow({ label, value, src, onOpenSrc }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 14, padding: '9px 0', borderBottom: '1px solid #EAEFF5', alignItems: 'start' }}>
      <div style={{ fontSize: 13, color: '#4A6070' }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#7E95A8', marginBottom: 4 }}>VALUE</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{value}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#7E95A8', marginBottom: 4 }}>SOURCE</div>
          {src
            ? <a onClick={e => { e.preventDefault(); onOpenSrc(src); }} href="#" style={{ color: '#13B5CB', fontSize: 12, cursor: 'pointer' }}>📄 RFP Section A – {src} ↗</a>
            : <div style={{ fontSize: 12, color: '#9EB0C0', fontStyle: 'italic' }}>Not specified</div>
          }
        </div>
      </div>
    </div>
  );
}

export default function ResultsModal({ s, handlers }) {
  const { resultsAgent, resultsTab, contactOpen } = s;
  const { closeRes, setResTab, togContact, openSrc, rerun, updateDocs } = handlers;

  const isA1 = resultsAgent === 'a1';

  const keyInfoContent = (
    <>
      <div style={{ fontSize: 12, color: '#9EB0C0', marginBottom: 16 }}>Showing {KEY_INFO_ROWS.length + 1} rows</div>
      {KEY_INFO_ROWS.map(([q, v, src]) => (
        <InfoRow key={q} label={q} value={v} src={src} onOpenSrc={openSrc} />
      ))}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', color: '#7E95A8', marginBottom: 10, paddingBottom: 6, borderBottom: '2px solid #E2EBF3' }}>CONTACT PERSONS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 14, padding: '9px 0', alignItems: 'flex-start' }}>
          <div style={{ fontSize: 13, color: '#4A6070' }}>Contact Persons</div>
          <div>
            <NJButton
              variant="primary"
              scale="sm"
              label={`${contactOpen ? '∨' : '›'} View Details (2 items)`}
              onClick={togContact}
              style={{ marginBottom: 10 }}
            />
            {contactOpen && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['NAME', 'EMAIL', 'PHONE', 'SOURCE'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '7px 10px', borderBottom: '1px solid #E2EBF3', fontWeight: 700, fontSize: 11, color: '#7E95A8', letterSpacing: '.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CONTACTS.map(([n, e, p, src]) => (
                    <tr key={n} onMouseOver={ev => ev.currentTarget.style.background = '#F4F9FC'} onMouseOut={ev => ev.currentTarget.style.background = ''}>
                      <td style={{ padding: '7px 10px', borderBottom: '1px solid #EAEFF5', fontWeight: 500 }}>{n}</td>
                      <td style={{ padding: '7px 10px', borderBottom: '1px solid #EAEFF5' }}><a href={`mailto:${e}`} style={{ color: '#13B5CB' }}>{e}</a></td>
                      <td style={{ padding: '7px 10px', borderBottom: '1px solid #EAEFF5', fontFamily: "'DM Mono', monospace", fontSize: 11 }}>{p}</td>
                      <td style={{ padding: '7px 10px', borderBottom: '1px solid #EAEFF5' }}>
                        <a onClick={ev => { ev.preventDefault(); openSrc(src); }} href="#" style={{ color: '#13B5CB', fontSize: 12 }}>📄 RFP – {src} ↗</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const preAwardContent = (
    <>
      <div style={{ fontSize: 12, color: '#9EB0C0', marginBottom: 16 }}>
        Showing {PRE_AWARD_SECTIONS.reduce((a, s) => a + s.rows.length, 0)} rows across {PRE_AWARD_SECTIONS.length} documents
      </div>
      {PRE_AWARD_SECTIONS.map(doc => (
        <div key={doc.label} style={{ marginBottom: 22 }}>
          <div style={{ background: '#F0FBFD', border: '1px solid #B0E8F2', borderRadius: 7, padding: '8px 14px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#0D9DB5' }}>
            <span style={{ fontSize: 15 }}>≡</span>{doc.label}
          </div>
          {doc.rows.map(([q, v, src]) => (
            <InfoRow key={q} label={q} value={v} src={src} onOpenSrc={openSrc} />
          ))}
        </div>
      ))}
    </>
  );

  const agentPlaceholder = (
    <div style={{ padding: 32, textAlign: 'center', color: '#7E95A8' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#1B2B3C', marginBottom: 8 }}>Agent's results</div>
      <div style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 360, margin: '0 auto' }}>
        The extracted results for this agent are available in the downloaded Excel file. Use the <strong>↓ Download Excel</strong> button below to access the full output.
      </div>
    </div>
  );

  return (
    <div className="overlay" onClick={closeRes}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2EBF3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{AGENT_TITLES[resultsAgent] || 'Agent Results'}</div>
            <div style={{ fontSize: 11, color: '#7E95A8', marginTop: 2 }}>
              agent{(resultsAgent || 'a1').slice(1)}_2026_03_23_152534.xlsx — Read-only
            </div>
          </div>
          <button onClick={closeRes} style={{ background: 'none', border: 'none', fontSize: 18, color: '#7E95A8', cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>

        {/* Tabs + body */}
        {isA1 ? (
          <div style={{ padding: '0 20px', borderBottom: '1px solid #E2EBF3' }}>
            <NJTabs
              label="Agent results tabs"
              activeTab={resultsTab}
              onClickTabItem={(id) => setResTab(id)}
              scale="sm"
            >
              <NJTab id="keyinfo" label="Key Information" aria-controls="panel-keyinfo">
                <div style={{ overflowY: 'auto', maxHeight: 'calc(88vh - 170px)', padding: '16px 0' }}>
                  {keyInfoContent}
                </div>
              </NJTab>
              <NJTab id="preaward" label="Pre-Award Activities" aria-controls="panel-preaward">
                <div style={{ overflowY: 'auto', maxHeight: 'calc(88vh - 170px)', padding: '16px 0' }}>
                  {preAwardContent}
                </div>
              </NJTab>
            </NJTabs>
          </div>
        ) : (
          <div style={{ overflowY: 'auto', flex: 1, padding: '16px 20px' }}>{agentPlaceholder}</div>
        )}

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #E2EBF3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <NJButton variant="secondary" emphasis="subtle" scale="sm" label="↺ Re-run Agent" onClick={rerun} />
            <NJButton variant="primary" emphasis="subtle" scale="sm" label="⬆ Update Documents" onClick={updateDocs} />
          </div>
          <NJButton variant="primary" scale="sm" label="↓ Download Excel" />
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { NJButton, NJIconButton, NJLink } from '@engie-group/fluid-design-system-react';

export default function ResultsModal({ modalTab, onSetModalTab, onClose }) {
  const [contactOpen, setContactOpen] = useState(true);

  const tabs = [
    ['keyinfo', 'Tender Key Info'],
    ['pre1', 'PreAwardAct Doc 1 2025-C-00150_'],
    ['pre2', 'PreAwardAct Doc 2 2025-C-00150_'],
    ['post', 'PostAwardAct Doc'],
  ];

  const openSrc = (pg) => {
    alert(`Source : RFP_Section_A_Technical_Scope.pdf — ${pg}\n\nDans l'application réelle, le panneau de prévisualisation s'ouvrirait directement sur cette page.`);
  };

  const contacts = [
    ['Jérôme DUCOS', 'jerome.ducos@cea.fr', '04 66 39 78 73', 'p.15'],
    ['Yannis OUAKLI', 'yannis.ouakli@cea.fr', '04 66 39 71 77', 'p.15'],
  ];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* header */}
        <div style={{ padding: '0.85rem 0.75rem 0.85rem 1.5rem', background: 'var(--nj-semantic-color-background-neutral-secondary-default)', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 500 }}>Preview 78dec0ef-0114-4ec1-8287-7209d9eaddc1_agent1_2026_03_23_152534.xlsx (Read-only)</span>
          <NJIconButton icon="close" aria-label="Close modal" scale="sm" onClick={onClose} />
        </div>

        {/* tabs */}
        <div style={{ padding: '0 18px', background: 'var(--nj-semantic-color-background-neutral-secondary-default)', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)', display: 'flex', overflowX: 'auto' }}>
          {tabs.map(([k, l]) => (
            <button key={k} className={`modal-tab-btn ${modalTab === k ? 'active' : ''}`} onClick={() => onSetModalTab(k)}>{l}</button>
          ))}
        </div>

        {/* body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', marginBottom: 13 }}>Showing 26 rows</div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', marginBottom: 12 }}>KEY INFORMATION</div>

          {/* row 1 */}
          <div className="mrow">
            <div style={{ fontSize: 13, paddingTop: 2 }}>Issuing Organization</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', marginBottom: 5 }}>Value</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>COMMISSARIAT À L'ÉNERGIE ATOMIQUE ET AUX ÉNERGIES ALTERNATIVES (CEA)</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', marginBottom: 5 }}>Source</div>
                <a className="cyan-link" onClick={() => openSrc('p.2')} href="#">📄 RFP Section A – p.2 ↗</a>
              </div>
            </div>
          </div>

          {/* row 2 */}
          <div className="mrow">
            <div style={{ fontSize: 13, paddingTop: 2 }}>Is the project with ENGIE affiliate being sole or co-developer / client ?</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', marginBottom: 5 }}>Value</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>NO</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', marginBottom: 5 }}>Source</div>
                <div style={{ fontSize: 12, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', fontStyle: 'italic' }}>Not specified</div>
              </div>
            </div>
          </div>

          {/* row 3: contacts */}
          <div className="mrow" style={{ flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 13, paddingTop: 2 }}>Contact Persons</div>
              <div>
                <NJButton
                  label={`${contactOpen ? '∨' : '›'} View Details (2 items)`}
                  variant="primary"
                  emphasis="bold"
                  scale="sm"
                  onClick={() => setContactOpen(!contactOpen)}
                  style={{ marginBottom: 10 }}
                />
                {contactOpen && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginTop: 2 }}>
                    <thead>
                      <tr style={{ background: 'var(--nj-semantic-color-background-neutral-secondary-default)' }}>
                        <th style={{ textAlign: 'left', padding: '7px 10px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)', fontWeight: 700, fontSize: 11 }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '7px 10px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)', fontWeight: 700, fontSize: 11 }}>Email</th>
                        <th style={{ textAlign: 'left', padding: '7px 10px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)', fontWeight: 700, fontSize: 11 }}>Phone</th>
                        <th style={{ textAlign: 'left', padding: '7px 10px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)', fontWeight: 700, fontSize: 11 }}>Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map(([n, e, p, s]) => (
                        <tr key={n}>
                          <td style={{ padding: '7px 10px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)' }}>{n}</td>
                          <td style={{ padding: '7px 10px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)' }}><a href={`mailto:${e}`} style={{ color: 'var(--nj-semantic-color-text-brand-default)' }}>{e}</a></td>
                          <td style={{ padding: '7px 10px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)' }}>{p}</td>
                          <td style={{ padding: '7px 10px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)' }}>
                            <a className="cyan-link" onClick={() => openSrc(s)} href="#">📄 RFP Section A – {s} ↗</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div style={{ padding: '13px 18px', background: 'var(--nj-semantic-color-background-neutral-secondary-default)', borderTop: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)', display: 'flex', justifyContent: 'center', gap: 10 }}>
          <NJButton label="↓ Download Excel" variant="primary" emphasis="bold" scale="sm" />
          <NJButton label="Feedback" variant="secondary" emphasis="subtle" scale="sm" />
          <NJButton label="Close" variant="secondary" emphasis="subtle" scale="sm" onClick={onClose} />
        </div>
      </div>
    </div>
  );
}

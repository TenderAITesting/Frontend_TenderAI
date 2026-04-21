import { useRef, useState } from 'react';
import { NJButton, NJCheckbox } from '@engie-group/fluid-design-system-react';
import { AGENTS } from '../data/constants';

export default function UploadTab({ s, handlers }) {
  const { docs, docAgents, isNew, docsUpdated, lang } = s;
  const { setLang, togDA, deleteDoc, startProc, skipToAgents, openDisc } = handlers;
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const hasA1orA2 = docs.some(d => docAgents[d.key]?.a1 || docAgents[d.key]?.a2);

  return (
    <div style={{ padding: 24 }}>
      {/* Drop zone */}
      <div
        style={{
          border: `2px dashed ${dragOver ? '#13B5CB' : '#D1DBE6'}`,
          borderRadius: 10, padding: '22px 16px', textAlign: 'center',
          background: '#fff', marginBottom: 20, transition: 'border-color .2s',
        }}
        onMouseOver={() => setDragOver(true)}
        onMouseLeave={() => setDragOver(false)}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); }}
      >
        <input ref={fileInputRef} type="file" accept=".pdf,.docx" multiple style={{ display: 'none' }} />
        <div style={{ fontSize: 24, color: '#13B5CB', marginBottom: 7 }}>⬆</div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Drag and drop tender documents</div>
        <div style={{ fontSize: 12, color: '#7E95A8', marginBottom: 14 }}>PDF and DOCX supported</div>
        <NJButton variant="secondary" emphasis="subtle" scale="sm" label="Browse Files" onClick={() => openDisc('tenderupload')} />
      </div>

      {/* List header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Project Documents</span>
          <span style={{ fontSize: 12, color: '#7E95A8', marginLeft: 6 }}>({docs.length} uploaded)</span>
        </div>
      </div>

      {/* Matrix table */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 20 }}>
        <table className="mx-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Document</th>
              {AGENTS.map(a => (
                <th key={a.id}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 3, background: '#13B5CB', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#1B2B3C' }}>{a.title}</span>
                  </div>
                </th>
              ))}
              <th style={{ width: 44 }} />
            </tr>
          </thead>
          <tbody>
            {docs.map(doc => (
              <tr key={doc.key}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: '#F0F4F8', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15 }}>≡</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{doc.name}</div>
                      <div style={{ fontSize: 11, color: '#7E95A8' }}>{doc.size} · Uploaded {doc.ago}</div>
                    </div>
                  </div>
                </td>
                {AGENTS.map(ag => {
                  const isA3 = ag.id === 'a3';
                  const blocked = isA3 && !hasA1orA2;
                  return (
                    <td key={ag.id} style={{ opacity: blocked ? 0.3 : 1 }} title={blocked ? 'Select Agent 1 or Agent 2 first' : ''}>
                      <NJCheckbox
                        checked={!!docAgents[doc.key]?.[ag.id]}
                        disabled={blocked}
                        onChange={() => togDA(doc.key, ag.id)}
                      />
                    </td>
                  );
                })}
                <td style={{ textAlign: 'right', paddingRight: 12 }}>
                  <button
                    onClick={() => deleteDoc(doc.key)}
                    title="Remove document"
                    style={{ background: 'none', border: '1.5px solid #E2EBF3', borderRadius: 6, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9EB0C0', fontSize: 14, transition: 'all .15s' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = '#e53e3e'; e.currentTarget.style.color = '#e53e3e'; e.currentTarget.style.background = '#FEF2F2'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = '#E2EBF3'; e.currentTarget.style.color = '#9EB0C0'; e.currentTarget.style.background = 'none'; }}
                  >✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Language + Process */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
          <div>
            <div className="inp-label" style={{ marginBottom: 7, textAlign: 'right' }}>PROPOSAL REVIEW LANGUAGE</div>
            <div style={{ display: 'flex', gap: 7 }}>
              {[['EN', 'English'], ['FR', 'French']].map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  style={{
                    padding: '6px 18px', borderRadius: 6, cursor: 'pointer',
                    border: `1.5px solid ${lang === code ? '#13B5CB' : '#E2EBF3'}`,
                    background: lang === code ? '#E8F8FC' : '#fff',
                    color: lang === code ? '#0D9DB5' : '#7E95A8',
                    fontSize: 12, fontWeight: lang === code ? 700 : 500, transition: 'all .15s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            {(!isNew && !docsUpdated) ? (
              <>
                <NJButton variant="secondary" emphasis="subtle" disabled label="✓ Process Documents" style={{ pointerEvents: 'none' }} />
                <span style={{ fontSize: 10, color: '#9EB0C0', letterSpacing: '.04em' }}>
                  DOCUMENTS ALREADY PROCESSED — ADD NEW DOCS TO RE-PROCESS
                </span>
              </>
            ) : (
              <>
                <NJButton variant="primary" label="✓ Process Documents" onClick={startProc} />
                <span style={{ fontSize: 10, color: '#9EB0C0', letterSpacing: '.04em' }}>
                  RUNS ALL CONFIGURED AGENTS FOR {docs.length} DOCUMENTS
                </span>
              </>
            )}
            {!isNew && (
              <NJButton variant="secondary" emphasis="subtle" scale="sm" label="Skip — already processed → ›" onClick={skipToAgents} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

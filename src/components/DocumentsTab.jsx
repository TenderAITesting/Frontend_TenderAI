import { useRef, useState } from 'react';
import { NJButton, NJCheckbox, NJIconButton, NJSelectRoot, NJSelectItem } from '@engie-group/fluid-design-system-react';
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
          border: `2px dashed ${dragOver ? 'var(--nj-core-color-reference-brand-500)' : 'var(--nj-semantic-color-border-neutral-subtle-default)'}`,
          borderRadius: 10, padding: '22px 16px', textAlign: 'center',
          background: 'var(--nj-semantic-color-background-neutral-primary-default)',
          marginBottom: 20, transition: 'border-color .2s',
        }}
        onMouseOver={() => setDragOver(true)}
        onMouseLeave={() => setDragOver(false)}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); }}
      >
        <input ref={fileInputRef} type="file" accept=".pdf,.docx" multiple style={{ display: 'none' }} />
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Drag and drop tender documents</div>
        <div style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-500)', marginBottom: 14 }}>PDF and DOCX supported</div>
        <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="folder_open" label="Browse Files" onClick={() => openDisc('tenderupload')} />
      </div>

      {/* List header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Project Documents</span>
          <span style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-500)', marginLeft: 6 }}>({docs.length} uploaded)</span>
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
                    <span style={{ width: 16, height: 16, borderRadius: 3, background: 'var(--nj-core-color-reference-brand-500)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--nj-semantic-color-background-neutral-primary-default)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--nj-semantic-color-text-neutral-primary-default)' }}>{a.title}</span>
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
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{doc.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--nj-core-color-reference-neutral-500)' }}>{doc.size} · Uploaded {doc.ago}</div>
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
                  <NJIconButton
                    icon="delete"
                    label="Remove document"
                    scale="xs"
                    variant="secondary"
                    emphasis="subtle"
                    onClick={() => deleteDoc(doc.key)}
                  />
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
            <NJSelectRoot
              value={lang}
              onChange={e => setLang(e.target.value)}
              style={{ minWidth: 160 }}
            >
              <NJSelectItem value="EN">English</NJSelectItem>
              <NJSelectItem value="FR">French</NJSelectItem>
            </NJSelectRoot>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            {(!isNew && !docsUpdated) ? (
              <>
                <NJButton variant="secondary" emphasis="subtle" disabled icon="check" label="Process Documents" style={{ pointerEvents: 'none' }} />
                <span style={{ fontSize: 10, color: 'var(--nj-core-color-reference-neutral-400)', letterSpacing: '.04em' }}>
                  DOCUMENTS ALREADY PROCESSED — ADD NEW DOCS TO RE-PROCESS
                </span>
              </>
            ) : (
              <>
                <NJButton variant="primary" icon="play_arrow" label="Process Documents" onClick={startProc} />
                <span style={{ fontSize: 10, color: 'var(--nj-core-color-reference-neutral-400)', letterSpacing: '.04em' }}>
                  RUNS ALL CONFIGURED AGENTS FOR {docs.length} DOCUMENTS
                </span>
              </>
            )}
            {!isNew && (
              <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="skip_next" label="Skip — already processed" onClick={skipToAgents} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

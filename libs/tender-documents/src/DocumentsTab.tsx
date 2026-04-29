import { useRef, useState } from 'react';
import { NJButton, NJCheckbox, NJIconButton, NJIcon, NJSelectItem, NJSelectRoot } from '@engie-group/fluid-design-system-react';
import { AGENTS } from '../../../src/data/constants';
import DisclaimerModal from '../../../src/components/DisclaimerModal';

const COL_LABELS = {
  a1: 'Tender Key Information',
  a2: 'Technical Requirements',
  a3: 'Project Risks',
};

const LANG_OPTIONS = [
  { value: 'EN', label: 'English' },
  { value: 'FR', label: 'French' },
  { value: 'NL', label: 'Dutch' },
  { value: 'DE', label: 'German' },
  { value: 'ES', label: 'Spanish' },
  { value: 'PT', label: 'Portuguese' },
];

export default function UploadTab({ s, handlers }) {
  const { docs, docAgents, isNew, docsUpdated, lang } = s;
  const { setLang, togDA, deleteDoc, startProc, skipToAgents, openDisc } = handlers;
  const [dragOver, setDragOver] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showUploadDisc, setShowUploadDisc] = useState(false);
  const fileInputRef = useRef(null);

  return (
    <div style={{ padding: 24, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
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
        onDrop={e => { e.preventDefault(); setDragOver(false); openDisc('tenderupload'); }}
      >
        <input ref={fileInputRef} type="file" accept=".pdf,.docx" multiple style={{ display: 'none' }} />
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Drag and drop tender documents</div>
        <div style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-500)', marginBottom: 14 }}>PDF and DOCX supported</div>
        <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="folder_open" label="Browse Files" onClick={() => setShowUploadDisc(true)} />
      </div>

      {/* List header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
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
                <th key={a.id} title={a.desc} style={{ cursor: 'help' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--nj-semantic-color-text-neutral-primary-default)' }}>{COL_LABELS[a.id] || a.title}</span>
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
                  const blocked = isA3 && !docAgents[doc.key]?.a2;
                  return (
                    <td key={ag.id} style={{ opacity: blocked ? 0.3 : 1 }} title={blocked ? 'Select Agent 2 first for this document' : ''}>
                      <NJCheckbox
                        checked={!!docAgents[doc.key]?.[ag.id]}
                        disabled={blocked}
                        onChange={() => togDA(doc.key, ag.id)}
                      />
                    </td>
                  );
                })}
                <td style={{ textAlign: 'right', paddingRight: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                    <NJIconButton
                      icon="visibility"
                      aria-label="Preview document"
                      scale="xs"
                      variant="secondary"
                                            onClick={() => setPreviewDoc(doc)}
                    />
                    <NJIconButton
                      icon="delete"
                      aria-label="Remove document"
                      scale="xs"
                      variant="secondary"
                                            onClick={() => deleteDoc(doc.key)}
                    />
                  </div>
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
            <div className="inp-label" style={{ marginBottom: 7, textAlign: 'right' }}>TENDER ANALYSIS LANGUAGE</div>
            <NJSelectRoot
              label="Language"
              listNavigationLabel="Use up and down arrows and Enter to select a language"
              buttonDefaultValueLabel="Select a language"
              value={lang}
              onChange={setLang}
              style={{ minWidth: 180 }}
            >
              {LANG_OPTIONS.map(opt => (
                <NJSelectItem key={opt.value} value={opt.value}>{opt.label}</NJSelectItem>
              ))}
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
      {previewDoc && (
        <div className="overlay" onClick={() => setPreviewDoc(null)} style={{ zIndex: 500 }}>
          <div
            className="modal-box"
            style={{ maxWidth: 720, width: '90vw', maxHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{previewDoc.name}</div>
                <div style={{ fontSize: 11, color: 'var(--nj-core-color-reference-neutral-500)', marginTop: 2 }}>{previewDoc.size} · Uploaded {previewDoc.ago}</div>
              </div>
              <NJIconButton icon="close" aria-label="Close" scale="sm" variant="secondary" onClick={() => setPreviewDoc(null)} />
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 380, background: 'var(--nj-semantic-color-background-neutral-secondary-default)' }}>
              <div style={{ width: '100%', maxWidth: 520, background: 'var(--nj-semantic-color-background-neutral-primary-default)', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,.08)', padding: '32px 28px', textAlign: 'center' }}>
                <NJIcon name="description" style={{ fontSize: 56, color: 'var(--nj-core-color-reference-brand-500)', marginBottom: 14 }} />
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{previewDoc.name}</div>
                <div style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-500)', marginBottom: 20 }}>{previewDoc.size}</div>
                <div style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-400)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
                  Document preview is not available in this environment.<br />Use the download option to open the file locally.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showUploadDisc && (
        <DisclaimerModal
          type="tenderupload"
          onClose={() => setShowUploadDisc(false)}
          onConfirm={() => {
            fileInputRef.current?.click();
            setShowUploadDisc(false);
          }}
        />
      )}
    </div>
  );
}
import { useRef, useState } from 'react';
import { NJButton, NJCheckbox, NJIconButton, NJIcon, NJSelectItem, NJSelectRoot } from '@engie-group/fluid-design-system-react';
import { AGENTS, LANG_OPTIONS } from '../../../src/config/app-config';
import DisclaimerModal from '../../../src/components/DisclaimerModal';
import styles from './DocumentsTab.module.css';

const COL_LABELS = {
  a1: 'Tender Key Information',
  a2: 'Technical Requirements',
  a3: 'Project Risks',
};

export default function UploadTab({ s, handlers }) {
  const { docs, docAgents, isNew, docsUpdated, lang } = s;
  const { setLang, togDA, deleteDoc, startProc, skipToAgents, openDisc } = handlers;
  const [dragOver, setDragOver] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showUploadDisc, setShowUploadDisc] = useState(false);
  const fileInputRef = useRef(null);

  return (
    <div className={styles["dt-container"]}>
      {/* Drop zone */}
      <div
        className={`${styles["dt-drop-zone"]}${dragOver ? ` ${styles["dt-drop-zone-active"]}` : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); openDisc('tenderupload'); }}
      >
        <input ref={fileInputRef} type="file" accept=".pdf,.docx" multiple className={styles["dt-hidden"]} />
        <NJIcon name="cloud_upload" style={{ fontSize: 40, color: 'var(--nj-core-color-reference-brand-500)', marginBottom: 12 }} />
        <div className={styles["dt-drop-label"]}>Drag and drop your documents here</div>
        <div className={styles["dt-drop-or"]}>OR</div>
        <div className={styles["dt-drop-browse"]} onClick={() => setShowUploadDisc(true)}>
          Browse files
        </div>
        <div className={styles["dt-drop-formats"]}>Accepted formats: PDF, Word</div>
      </div>

      {/* List header */}
      <div className={styles["dt-list-header"]}>
        <div>
          <span className={styles["dt-doc-title"]}>Project Documents</span>
          <span className={styles["dt-doc-count"]}>({docs.length} uploaded)</span>
        </div>
      </div>

      {/* Matrix table */}
      <div className={`${styles["card"]} ${styles["dt-card"]}`}>
        <table className={styles["mx-table"]}>
          <thead>
            <tr>
              <th className={styles["dt-col-doc"]}>Document</th>
              {AGENTS.map(a => (
                <th key={a.id} title={a.desc} className={styles["dt-col-agent"]}>
                  <div className={styles["dt-agent-header"]}>
                    <span className={styles["dt-agent-label"]}>{COL_LABELS[a.id] || a.title}</span>
                  </div>
                </th>
              ))}
              <th className={styles["dt-col-actions"]} />
            </tr>
          </thead>
          <tbody>
            {docs.map(doc => (
              <tr key={doc.key}>
                <td>
                  <div className={styles["dt-doc-cell"]}>
                    <div>
                      <div className={styles["dt-doc-name"]}>{doc.name}</div>
                      <div className={styles["dt-doc-meta"]}>{doc.size} · Uploaded {doc.ago}</div>
                    </div>
                  </div>
                </td>
                {AGENTS.map(ag => {
                  const isA3 = ag.id === 'a3';
                  const blocked = isA3 && !docAgents[doc.key]?.a2;
                  return (
                    <td key={ag.id} className={blocked ? styles["dt-agent-cell-blocked"] : ''} title={blocked ? 'Select Agent 2 first for this document' : ''}>
                      <NJCheckbox
                        checked={!!docAgents[doc.key]?.[ag.id]}
                        disabled={blocked}
                        onChange={() => togDA(doc.key, ag.id)}
                      />
                    </td>
                  );
                })}
                <td className={styles["dt-actions-td"]}>
                  <div className={styles["dt-actions-inner"]}>
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
      <div className={styles["dt-footer"]}>
        <div className={styles["dt-footer-right"]}>
          <div>
            <div className={`${styles["inp-label"]} ${styles["dt-inp-label-right"]}`}>TENDER ANALYSIS LANGUAGE</div>
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

          <div className={styles["dt-actions-col"]}>
            {(!isNew && !docsUpdated) ? (
              <>
                <NJButton variant="secondary" emphasis="subtle" disabled icon="check" label="Process Documents" style={{ pointerEvents: 'none' }} />
                <span className={styles["dt-note"]}>
                  DOCUMENTS ALREADY PROCESSED — ADD NEW DOCS TO RE-PROCESS
                </span>
              </>
            ) : (
              <>
                <NJButton variant="primary" icon="play_arrow" label="Process Documents" onClick={startProc} />
                <span className={styles["dt-note"]}>
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
        <div className={`modal-overlay ${styles["dt-preview-overlay"]}`} onClick={() => setPreviewDoc(null)}>
          <div
            className={`${styles["modal-box"]} ${styles["dt-preview-box"]}`}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles["dt-preview-header"]}>
              <div>
                <div className={styles["dt-preview-name"]}>{previewDoc.name}</div>
                <div className={styles["dt-preview-meta"]}>{previewDoc.size} · Uploaded {previewDoc.ago}</div>
              </div>
              <NJIconButton icon="close" aria-label="Close" scale="sm" variant="secondary" onClick={() => setPreviewDoc(null)} />
            </div>
            <div className={styles["dt-preview-body"]}>
              <div className={styles["dt-preview-card"]}>
                <NJIcon name="description" style={{ fontSize: 56, color: 'var(--nj-core-color-reference-brand-500)', marginBottom: 14 }} />
                <div className={styles["dt-preview-file-name"]}>{previewDoc.name}</div>
                <div className={styles["dt-preview-file-size"]}>{previewDoc.size}</div>
                <div className={styles["dt-preview-note"]}>
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
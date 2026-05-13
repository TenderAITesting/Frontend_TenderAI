import { useRef, useState } from 'react';
import { NJButton, NJIcon, NJIconButton, NJInlineMessage } from '@engie-group/fluid-design-system-react';
import styles from './UpdateDocsModal.module.css';

export default function UpdateDocsModal({ onClose, onConfirm }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className={styles["disc-overlay"]} onClick={onClose}>
      <div className={styles["disc-box"]} onClick={e => e.stopPropagation()}>
        <div className={styles["update-header"]}>
          <div className={styles["update-title"]}>Update Documents</div>
          <NJIconButton icon="close" aria-label="Close" scale="sm" variant="secondary" onClick={onClose} />
        </div>

        <NJInlineMessage variant="warning" style={{ marginBottom: 18 }}>
          <strong>Authorization required:</strong> Only client tender documents that the client has authorized for processing using public cloud and AI services may be uploaded. If client authorization is missing or unclear, do not upload the document.
        </NJInlineMessage>

        <input ref={fileInputRef} type="file" accept=".pdf,.docx" multiple className={styles["update-file-input"]} />
        <div
          className={`${styles["update-drop-zone"]}${dragOver ? ` ${styles["update-drop-zone-active"]}` : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); onConfirm(); }}
        >
          <NJIcon name="cloud_upload" style={{ fontSize: 40, color: 'var(--nj-core-color-reference-brand-500)', marginBottom: 12 }} />
          <div className={styles["update-drop-label"]}>Drag and drop your documents here</div>
          <div className={styles["update-drop-or"]}>OR</div>
          <div className={styles["update-browse"]} onClick={() => fileInputRef.current?.click()}>
            Browse files
          </div>
          <div className={styles["update-formats"]}>Accepted formats: PDF, Word</div>
        </div>

        <div className={styles["update-footer"]}>
          <NJButton variant="secondary" emphasis="subtle" label="Cancel" onClick={onClose} />
          <NJButton variant="primary" icon="arrow_forward" label="Confirm & Go to Upload" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}

import { useRef, useState } from 'react';
import { NJButton, NJIcon, NJIconButton, NJInlineMessage } from '@engie-group/fluid-design-system-react';

export default function UpdateDocsModal({ onClose, onConfirm }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="disc-overlay" onClick={onClose}>
      <div className="disc-box fadein" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Update Documents</div>
          <NJIconButton icon="close" aria-label="Close" scale="sm" variant="secondary" onClick={onClose} />
        </div>

        <NJInlineMessage variant="warning" style={{ marginBottom: 18 }}>
          <strong>Authorization required:</strong> Only client tender documents that the client has authorized for processing using public cloud and AI services may be uploaded. If client authorization is missing or unclear, do not upload the document.
        </NJInlineMessage>

        <input ref={fileInputRef} type="file" accept=".pdf,.docx" multiple style={{ display: 'none' }} />
        <div
          style={{
            border: `2px dashed ${dragOver ? 'var(--nj-core-color-reference-brand-500)' : 'var(--nj-semantic-color-border-neutral-subtle-default)'}`,
            borderRadius: 10, padding: '28px 16px', textAlign: 'center',
            background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
            marginBottom: 18, transition: 'border-color .2s', cursor: 'pointer',
          }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); onConfirm(); }}
        >
          <NJIcon name="cloud_upload" style={{ fontSize: 40, color: 'var(--nj-core-color-reference-brand-500)', marginBottom: 12 }} />
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Drag and drop your documents here</div>
          <div style={{ fontSize: 13, color: 'var(--nj-core-color-reference-neutral-500)', marginBottom: 6 }}>OR</div>
          <div
            style={{ fontSize: 14, fontWeight: 700, color: 'var(--nj-core-color-reference-brand-500)', marginBottom: 12, cursor: 'pointer' }}
            onClick={() => fileInputRef.current?.click()}
          >
            Browse files
          </div>
          <div style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-400)' }}>Accepted formats: PDF, Word</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <NJButton variant="secondary" emphasis="subtle" label="Cancel" onClick={onClose} />
          <NJButton variant="primary" icon="arrow_forward" label="Confirm & Go to Upload" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}

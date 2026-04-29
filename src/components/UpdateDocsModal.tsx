import { NJButton, NJIconButton, NJInlineMessage } from '@engie-group/fluid-design-system-react';

export default function UpdateDocsModal({ onClose, onConfirm }) {
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

        <div style={{ border: '2px dashed var(--nj-semantic-color-border-neutral-subtle-default)', borderRadius: 10, padding: '20px 16px', textAlign: 'center', background: 'var(--nj-semantic-color-background-neutral-secondary-default)', marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Drag and drop updated documents</div>
          <div style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-500)', marginBottom: 12 }}>PDF and DOCX supported</div>
          <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="folder_open" label="Browse Files" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <NJButton variant="secondary" emphasis="subtle" label="Cancel" onClick={onClose} />
          <NJButton variant="primary" icon="arrow_forward" label="Confirm & Go to Upload" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}

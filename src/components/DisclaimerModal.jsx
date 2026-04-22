import { NJButton, NJInlineMessage, NJIcon } from '@engie-group/fluid-design-system-react';

const LABELS = {
  pastoffers: 'Past Offers',
  references: 'Project References',
  tenderupload: 'Tender Documents',
};

export default function DisclaimerModal({ type, onClose, onConfirm }) {
  return (
    <div className="disc-overlay" onClick={onClose}>
      <div className="disc-box fadein" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
          
          {/* Conteneur de l'icône */}
          <div style={{ 
            width: 40, 
            height: 40, 
            background: 'var(--nj-core-color-reference-status-warning-100)', 
            border: '1.5px solid var(--nj-core-color-reference-status-warning-400)', 
            borderRadius: 10, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexShrink: 0 
          }}>
            <NJIcon 
              name="warning" 
              style={{ 
                fontSize: 20, 
                color: 'var(--nj-core-color-reference-status-warning-600)' 
              }} 
            />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Important Notice</div>
            <div style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-500)' }}>{LABELS[type]} — Authorization Required</div>
          </div>
        </div>

        <NJInlineMessage variant="warning" style={{ marginBottom: 22 }}>
          {type === 'tenderupload' ? (
            <>
              Only client tender documents that the client has <strong>authorized for processing using public cloud and AI services</strong> may be uploaded.<br /><br />
              If client authorization is missing or unclear, the document <strong style={{ color: 'var(--nj-semantic-color-text-status-danger-primary-default)' }}>must not be uploaded</strong>.
            </>
          ) : (
            <>
              Only past offers and reference documents that the <strong>client has explicitly authorized for public cloud and AI processing</strong> may be uploaded.<br /><br />
              If client authorization is missing or unclear, the document <strong style={{ color: 'var(--nj-semantic-color-text-status-danger-primary-default)' }}>must not be uploaded</strong>.
            </>
          )}
        </NJInlineMessage>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <NJButton variant="secondary" emphasis="subtle" label="Cancel" onClick={onClose} />
          <NJButton variant="primary" icon="folder_open" label="I Understand — Browse Files" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}

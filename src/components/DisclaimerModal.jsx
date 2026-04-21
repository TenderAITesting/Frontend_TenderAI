import { NJButton, NJInlineMessage } from '@engie-group/fluid-design-system-react';

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
          <div style={{ width: 40, height: 40, background: '#FEF8ED', border: '1.5px solid #F5A623', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>⚠</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Important Notice</div>
            <div style={{ fontSize: 12, color: '#7E95A8' }}>{LABELS[type]} — Authorization Required</div>
          </div>
        </div>

        <NJInlineMessage variant="warning" style={{ marginBottom: 22 }}>
          {type === 'tenderupload' ? (
            <>
              Only client tender documents that the client has <strong>authorized for processing using public cloud and AI services</strong> may be uploaded.<br /><br />
              If client authorization is missing or unclear, the document <strong style={{ color: '#C0392B' }}>must not be uploaded</strong>.
            </>
          ) : (
            <>
              Only past offers and reference documents that the <strong>client has explicitly authorized for public cloud and AI processing</strong> may be uploaded.<br /><br />
              If client authorization is missing or unclear, the document <strong style={{ color: '#C0392B' }}>must not be uploaded</strong>.
            </>
          )}
        </NJInlineMessage>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <NJButton variant="secondary" emphasis="subtle" label="Cancel" onClick={onClose} />
          <NJButton variant="primary" label="I Understand — Browse Files" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}

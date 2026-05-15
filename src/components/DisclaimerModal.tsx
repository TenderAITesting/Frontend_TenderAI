import { NJButton, NJInlineMessage, NJIcon } from '@engie-group/fluid-design-system-react';
import styles from './DisclaimerModal.module.css';

const LABELS = {
  tenderupload: 'Tender Documents',
  pastoffers:   'Past Offers',
  methodology:  'Methodology Documents',
  projectrefs:  'Project References',
};

export default function DisclaimerModal({ type, onClose, onConfirm }) {
  return (
    <div className={styles["disc-overlay"]} onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className={styles["disc-header"]}>
          <div className={styles["disc-icon"]}>
            <NJIcon
              name="warning"
              style={{ fontSize: 20, color: 'var(--nj-core-color-reference-status-warning-600)' }}
            />
          </div>
          <div>
            <div className={styles["disc-title"]}>Important Notice</div>
            <div className={styles["disc-subtitle"]}>{LABELS[type]} — Authorization Required</div>
          </div>
        </div>

        <NJInlineMessage variant="warning" style={{ marginBottom: 22 }}>
          {type === 'tenderupload' ? (
            <>
              Only client tender documents that the client has <strong>authorized for processing using public cloud and AI services</strong> may be uploaded.<br /><br />
              If client authorization is missing or unclear, the document <strong className={styles["disc-danger-text"]}>must not be uploaded</strong>.
            </>
          ) : type === 'pastoffers' ? (
            <>
              You are about to upload past proposal documents. Make sure they do not contain <strong>confidential client data that has not been cleared for reuse</strong>.
            </>
          ) : type === 'methodology' ? (
            <>
              You are about to upload internal methodology documents. Ensure these are <strong>approved for use in this tender context</strong>.
            </>
          ) : type === 'projectrefs' ? (
            <>
              You are about to upload project reference documents. Verify that <strong>client approvals for reference usage are in place</strong>.
            </>
          ) : (
            <>
              Only past offers and reference documents that the <strong>client has explicitly authorized for public cloud and AI processing</strong> may be uploaded.<br /><br />
              If client authorization is missing or unclear, the document <strong className={styles["disc-danger-text"]}>must not be uploaded</strong>.
            </>
          )}
        </NJInlineMessage>

        <div className={styles["disc-footer"]}>
          <NJButton variant="secondary" emphasis="subtle" label="Cancel" onClick={onClose} />
          <NJButton variant="primary" icon="folder_open" label="I Understand — Browse Files" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}

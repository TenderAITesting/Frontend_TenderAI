import { NJIconButton } from '@engie-group/fluid-design-system-react';
import { DOC_PAGES } from '../data/constants';
import styles from './SrcModal.module.css';

export default function SrcModal({ page, onClose }) {
  const pg = parseInt((page || 'p.1').replace('p.', ''));

  return (
    <div className={styles["src-overlay"]} onClick={onClose}>
      <div className={styles["src-modal-box"]} onClick={e => e.stopPropagation()}>
        <div className={styles["src-header"]}>
          <div className={styles["src-header-left"]}>
            <span className={`material-symbols-outlined ${styles["src-header-icon"]}`}>description</span>
            <div>
              <div className={styles["src-file-title"]}>RFP_Section_A_Technical_Scope.pdf</div>
              <div className={styles["src-page-info"]}>
                Opened at page {pg} · {DOC_PAGES.length} pages total
              </div>
            </div>
          </div>
          <NJIconButton icon="close" aria-label="Close" scale="sm" variant="secondary" onClick={onClose} />
        </div>

        <div id="src-scroll" className={styles["src-scroll"]}>
          {DOC_PAGES.map(p => (
            <div key={p.n} id={`src-page-${p.n}`} className={styles["src-page"]}>
              <div className={styles["src-page-label"]}>
                <span>RFP_Section_A_Technical_Scope.pdf</span>
                <span>Page {p.n} / {DOC_PAGES.length}</span>
              </div>
              <div className={styles["src-page-content"]} dangerouslySetInnerHTML={{ __html: p.content }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

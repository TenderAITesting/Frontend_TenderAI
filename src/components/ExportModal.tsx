import { NJButton, NJIconButton, NJRadioGroup, NJRadio } from '@engie-group/fluid-design-system-react';
import { LANG_OPTIONS } from '../config/app-config';
import styles from './ExportModal.module.css';

export default function ExportModal({ exportLang, onSetLang, onConfirm, onClose }) {
  const canConfirm = exportLang !== null;

  return (
    <div className={styles["disc-overlay"]} onClick={onClose}>
      <div className={styles["disc-box"]} onClick={e => e.stopPropagation()}>
        <div className={styles["export-header"]}>
          <div className={styles["export-title"]}>Export Language</div>
          <NJIconButton icon="close" aria-label="Close" scale="sm" variant="secondary" onClick={onClose} />
        </div>

        <p className={styles["export-desc"]}>
          Select the language for the exported Word document.
        </p>

        <div className={styles["export-radio-group"]}>
          <NJRadioGroup orientation="column" style={{ gap: 10 }}>
            {LANG_OPTIONS.map(({ value, label }) => (
              <NJRadio
                key={value}
                value={value}
                label={label}
                checked={exportLang === value}
                onChange={() => onSetLang(value)}
              />
            ))}
          </NJRadioGroup>
        </div>

        <div className={styles["export-footer"]}>
          <NJButton variant="secondary" emphasis="subtle" label="Cancel" onClick={onClose} />
          <NJButton
            variant="primary"
            icon="download"
            label="Export"
            onClick={canConfirm ? onConfirm : undefined}
            disabled={!canConfirm}
          />
        </div>
      </div>
    </div>
  );
}

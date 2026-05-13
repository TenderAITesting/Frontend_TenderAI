import styles from './Stepper.module.css';

const STEPS = ['documents', 'agents', 'config', 'planning', 'drafting'];
const LABELS = ['Tender Upload', 'Tender Analysis', 'Draft Configurator', 'Proposal Planning', 'Proposal Drafting'];

export default function BannerStepper({ tenderStep, isNew, currentMaxStepIdx, onGoStep }) {
  const cur = STEPS.indexOf(tenderStep);

  return (
    <div className={styles["step-banner"]}>
      {STEPS.map((step, i) => {
        const isCur = i === cur;
        const isDone = isNew ? i < cur : (i <= currentMaxStepIdx && !isCur);
        const blocked = isNew ? i > cur : i > currentMaxStepIdx;

        return (
          <div key={step} className={styles["step-contents"]}>
            <div
              className={`${styles["banner-step"]}${isCur ? ` ${styles["s-cur"]}` : isDone ? ` ${styles["s-done"]}` : ''}${blocked ? ` ${styles["s-blocked"]}` : ''}`}
              onClick={() => !blocked && onGoStep(step)}
            >
              <div className={styles["bs-num"]}>
                {isDone && !isCur
                  ? <span className={`material-icons ${styles["banner-icon"]}`} aria-hidden="true">check</span>
                  : i + 1}
              </div>
              <div className={styles["bs-label"]}>{LABELS[i]}</div>
            </div>
            {i < 4 && <div className={styles["banner-sep"]}><span className={`material-icons ${styles["banner-icon"]}`} aria-hidden="true">chevron_right</span></div>}
          </div>
        );
      })}
    </div>
  );
}

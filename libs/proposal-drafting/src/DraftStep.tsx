import { NJButton, NJHeading } from '@engie-group/fluid-design-system-react';
import { NAV_SECS, DRAFT_SECS, DRAFTED_SECS } from '../../../src/config/app-config';
import styles from './DraftStep.module.css';

const DRAFT_BODIES = {
  '1.0': `<p style="font-size:14px;line-height:1.9;margin-bottom:16px">This proposal is submitted by <strong>Tractebel Engineering</strong> in response to the Request for Proposal issued by Tractebel Global for the Offshore Wind Farm — North Sea Phase IV project (Ref. PLW-2024-0892-NW).</p>
<p style="font-size:14px;line-height:1.9;margin-bottom:16px">Tractebel Engineering brings over 30 years of offshore infrastructure expertise. Our team of <span style="background:var(--nj-core-color-yellow-100);color:var(--nj-core-color-yellow-700);font-style:italic;padding:1px 7px;border-radius:4px;font-size:.875em;border:1px solid var(--nj-core-color-yellow-300)">[team size]</span> specialists will be mobilised within <span style="background:var(--nj-core-color-yellow-100);color:var(--nj-core-color-yellow-700);font-style:italic;padding:1px 7px;border-radius:4px;font-size:.875em;border:1px solid var(--nj-core-color-yellow-300)">[mobilisation timeline]</span> of contract award.</p>
<p style="font-size:14px;line-height:1.9">We are confident our technical approach, organisational structure, and track record uniquely position us to deliver this project on schedule and within budget.</p>`,
  '3.0': `<p style="font-size:14px;line-height:1.9;margin-bottom:16px">Our proposed deployment prioritizes local expertise combined with global oversight. The project will be structured across <span style="background:var(--nj-core-color-yellow-100);color:var(--nj-core-color-yellow-700);font-style:italic;padding:1px 7px;border-radius:4px;font-size:.875em;border:1px solid var(--nj-core-color-yellow-300)">[number of phases]</span> distinct phases, with a dedicated steering committee ensuring that all sustainability milestones are met within the <span style="background:var(--nj-core-color-yellow-100);color:var(--nj-core-color-yellow-700);font-style:italic;padding:1px 7px;border-radius:4px;font-size:.875em;border:1px solid var(--nj-core-color-yellow-300)">[equipment type]</span> framework.</p>
<p style="font-size:14px;line-height:1.9;margin-bottom:16px">Key personnel will include a Lead Civil Engineer with over 15 years of experience. The allocation of heavy machinery, specifically the <span style="background:var(--nj-core-color-yellow-100);color:var(--nj-core-color-yellow-700);font-style:italic;padding:1px 7px;border-radius:4px;font-size:.875em;border:1px solid var(--nj-core-color-yellow-300)">[machinery spec]</span>, follows the phased rollout schedule agreed upon during pre-qualification.</p>
<p style="font-size:14px;line-height:1.9">Our mobilisation approach draws on previous deployments in comparable environments, minimising on-site learning curves and ensuring continuity between project phases.</p>`,
};

const FALLBACK_BODY = `<p style="font-size:14px;line-height:1.9;color:var(--nj-core-color-reference-neutral-500);font-style:italic">This section is being drafted by Agent 5. Content will appear here shortly.</p>`;

export default function DraftingStep({ s, handlers }) {
  const { activeSection, exporting } = s;
  const { setSection, goStep, openExport } = handlers;

  const secData = DRAFT_SECS[activeSection] || { title: 'Section Content' };
  const secLabel = NAV_SECS.find(n => n.id === activeSection)?.label || secData.title;
  const body = DRAFT_BODIES[activeSection] || FALLBACK_BODY;

  return (
    <div className={styles["ds-container"]}>
      {/* Sidebar */}
      <div className={styles["prop-nav"]}>
        <div className={styles["ds-nav-title"]}>Proposal Sections</div>
        <div className={styles["ds-nav-legend"]}>
          <span className={styles["ds-nav-dot"]} />
          = drafted
        </div>
        {NAV_SECS.map(sec => (
          <div
            key={sec.id}
            className={`${styles["nav-item"]}${sec.sub ? ` ${styles["sub"]}` : ''}${activeSection === sec.id ? ` ${styles["active"]}` : ''}`}
            onClick={() => setSection(sec.id)}
          >
            <span className={styles["ds-nav-drag-icon"]}>⠿</span>
            {sec.id} {sec.label}
            {DRAFTED_SECS.has(sec.id) && (
              <span className={styles["ds-nav-drafted-dot"]} />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className={styles["ds-content"]}>
        <div className={styles["ds-scroll"]}>
          <div className={styles["ds-doc-area"]}>
            <div className={styles["ds-doc-header"]}>
              <div className={styles["ds-doc-confidential"]}>TRACTEBEL ENGINEERING — CONFIDENTIAL</div>
              <NJHeading as="h1" style={{ marginBottom: 6 }}>Technical Proposal</NJHeading>
              <div className={styles["ds-doc-ref"]}>Ref. PLW-2024-0892-NW &nbsp;·&nbsp; April 2026 &nbsp;·&nbsp; Draft v0.1</div>
            </div>
            <div className={styles["ds-section-label"]}>
              {activeSection} — {secLabel.toUpperCase()}
            </div>
            <NJHeading as="h2" style={{ marginBottom: 22 }}>{secData.title}</NJHeading>
            <div dangerouslySetInnerHTML={{ __html: body }} />
            <div className={styles["ds-doc-footer"]}>
              <span>Generated by Tender AI · April 2026</span>
              <span>Confidential — Draft v0.1</span>
            </div>
          </div>
        </div>

        <div className="bottom-bar">
          <NJButton variant="secondary" emphasis="subtle" scale="md" icon="arrow_back" label="Proposal Planning" onClick={() => goStep('planning')} />
          <div className={styles["ds-bottom-actions"]}>
            <NJButton variant="secondary" emphasis="subtle" scale="md" icon="edit" label="Edit Section" />
            <NJButton variant="primary" emphasis="subtle" scale="md" icon="visibility" label="Preview Full Document" />
            <NJButton
              variant="primary"
              icon="download"
              isLoading={exporting}
              label={exporting ? 'Exporting…' : 'Export Word (.docx)'}
              onClick={exporting ? undefined : openExport}
              disabled={exporting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { NJButton, NJHeading } from '@engie-group/fluid-design-system-react';
import { NAV_SECS, DRAFT_SECS, DRAFTED_SECS } from '../../../src/data/constants';

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
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Sidebar */}
      <div className="prop-nav">
        <div style={{ padding: '0 14px 5px', fontSize: 12, fontWeight: 700 }}>Proposal Sections</div>
        <div style={{ padding: '0 14px 9px', fontSize: 10, color: 'var(--nj-core-color-reference-neutral-400)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, background: 'var(--nj-core-color-reference-brand-500)', borderRadius: '50%', display: 'inline-block' }} />
          = drafted
        </div>
        {NAV_SECS.map(sec => (
          <div
            key={sec.id}
            className={`nav-item${sec.sub ? ' sub' : ''}${activeSection === sec.id ? ' active' : ''}`}
            onClick={() => setSection(sec.id)}
          >
            <span style={{ fontSize: 9, color: 'var(--nj-semantic-color-border-neutral-subtle-default)' }}>⠿</span>
            {sec.id} {sec.label}
            {DRAFTED_SECS.has(sec.id) && (
              <span style={{ marginLeft: 'auto', width: 6, height: 6, background: 'var(--nj-core-color-reference-brand-500)', borderRadius: '50%', flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '36px 56px', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '2px solid var(--nj-semantic-color-border-neutral-minimal-default)' }}>
              <div style={{ fontSize: 10, letterSpacing: '.16em', color: 'var(--nj-core-color-reference-neutral-400)', marginBottom: 8, fontWeight: 700 }}>TRACTEBEL ENGINEERING — CONFIDENTIAL</div>
              <NJHeading tag="h1" style={{ marginBottom: 6 }}>Technical Proposal</NJHeading>
              <div style={{ fontSize: 13, color: 'var(--nj-core-color-reference-neutral-400)' }}>Ref. PLW-2024-0892-NW &nbsp;·&nbsp; April 2026 &nbsp;·&nbsp; Draft v0.1</div>
            </div>
            <div style={{ fontSize: 10, color: 'var(--nj-core-color-reference-brand-500)', fontWeight: 700, letterSpacing: '.1em', marginBottom: 8 }}>
              {activeSection} — {secLabel.toUpperCase()}
            </div>
            <NJHeading tag="h2" style={{ marginBottom: 22 }}>{secData.title}</NJHeading>
            <div dangerouslySetInnerHTML={{ __html: body }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--nj-semantic-color-border-neutral-subtle-default)', borderTop: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', paddingTop: 14, marginTop: 48, fontFamily: "'DM Mono', monospace" }}>
              <span>Generated by Tender AI · April 2026</span>
              <span>Confidential — Draft v0.1</span>
            </div>
          </div>
        </div>

        <div className="bottom-bar">
          <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="arrow_back" label="Proposal Planning" onClick={() => goStep('planning')} />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="edit" label="Edit Section" />
            <NJButton variant="primary" emphasis="subtle" scale="sm" icon="visibility" label="Preview Full Document" />
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

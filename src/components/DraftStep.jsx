function PhInline({ text }) {
  return (
    <span style={{ background: '#FEF3C7', color: '#92400E', fontStyle: 'italic', padding: '1px 7px', borderRadius: 4, fontSize: '.875em', border: '1px solid #FCD34D' }}>
      [{text}]
    </span>
  );
}

export default function DraftStep() {
  return (
    <div className="draft-wrap">
      <div style={{ textAlign: 'center', marginBottom: 30, paddingBottom: 22, borderBottom: '1px solid #E2EBF3' }}>
        <div style={{ fontSize: 11, letterSpacing: '.12em', color: '#7E95A8', marginBottom: 7, fontWeight: 600 }}>TRACTEBEL INFRASTRUCTURE HUB</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 5 }}>Technical Proposal</h1>
        <div style={{ fontSize: 13, color: '#7E95A8' }}>Ref. TIH-2026-043 — April 2026</div>
      </div>
      <div style={{ fontSize: 11, color: '#13B5CB', fontWeight: 700, letterSpacing: '.08em', marginBottom: 7 }}>02 — BASIS OF DESIGN</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18 }}>Resource Strategy and Deployment Matrix</h2>
      <p style={{ fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
        Our proposed deployment for the <strong>Tractebel Infrastructure Hub</strong> prioritizes local
        expertise combined with global oversight. The project will{' '}
        <PhInline text="Placeholder: project duration" />{' '}
        dedicated steering committee ensuring all sustainability milestones are met within the{' '}
        <PhInline text="Placeholder: equipment type" />{' '}
        framework.
      </p>
      <p style={{ fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
        Key personnel will include a Lead Civil Engineer with over 15 years of experience in regional
        topography. The allocation of heavy machinery follows the phased rollout schedule agreed upon
        during pre-qualification. Phase transitions will be validated against the{' '}
        <PhInline text="Placeholder: regulatory standard" />{' '}
        compliance checklist.
      </p>
      <p style={{ fontSize: 14, lineHeight: 1.9, marginBottom: 42 }}>
        Our mobilisation approach draws on previous deployments in comparable environments,
        minimising on-site learning curves and ensuring continuity between project phases.
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#7E95A8', borderTop: '1px solid #E2EBF3', paddingTop: 13 }}>
        <span>Page 12 of 28</span>
        <span>Confidential — Draft v0.3</span>
      </div>
    </div>
  );
}

import { NJIconButton, NJHeading, NJText } from '@engie-group/fluid-design-system-react';

export default function ProjectCard() {
  return (
    <div style={{ padding: '16px 20px 0' }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '0.7rem 1.25rem', background: 'var(--nj-semantic-color-background-neutral-secondary-default)', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', letterSpacing: '.08em' }}>CURRENT PROJECT</span>
          <NJIconButton icon="edit" aria-label="Edit project" scale="sm" />
        </div>
        <div style={{ padding: '14px 18px' }}>
          <NJHeading scale="md" style={{ marginBottom: 12, lineHeight: 1.35 }}>
            Offshore Wind Farm –<br />North Sea Phase IV
          </NJHeading>
          <div style={{ display: 'flex', gap: 32 }}>
            <div>
              <NJText scale="sm" variant="secondary" style={{ fontWeight: 700, letterSpacing: '.06em', marginBottom: 3, fontSize: 10 }}>CLIENT</NJText>
              <NJText scale="sm">Tractebel Global</NJText>
            </div>
            <div>
              <NJText scale="sm" variant="secondary" style={{ fontWeight: 700, letterSpacing: '.06em', marginBottom: 3, fontSize: 10 }}>PROJECT ID</NJText>
              <NJText scale="sm" style={{ color: 'var(--nj-semantic-color-text-brand-default)', fontWeight: 600 }}>PLW-2024-0892-NW</NJText>
            </div>
            <div>
              <NJText scale="sm" variant="secondary" style={{ fontWeight: 700, letterSpacing: '.06em', marginBottom: 3, fontSize: 10 }}>RESPONSIBLE</NJText>
              <NJText scale="sm">Marcus Vane</NJText>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

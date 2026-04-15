import { NJIconButton, NJHeading, NJText } from '@engie-group/fluid-design-system-react';

export default function ProjectCard() {
  return (
    <div style={{ padding: '16px 20px 0' }}>
      <div className="card" style={{ padding: '15px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <NJHeading scale="md" style={{ marginBottom: 13, lineHeight: 1.35 }}>
              Offshore Wind Farm –<br />North Sea Phase IV
            </NJHeading>
            <div style={{ display: 'flex', gap: 30 }}>
              <div>
                <NJText scale="sm" variant="secondary" style={{ fontWeight: 600, letterSpacing: '.06em', marginBottom: 3, fontSize: 10 }}>CLIENT</NJText>
                <NJText scale="sm">Tractebel Global</NJText>
              </div>
              <div>
                <NJText scale="sm" variant="secondary" style={{ fontWeight: 600, letterSpacing: '.06em', marginBottom: 3, fontSize: 10 }}>PROJECT ID</NJText>
                <NJText scale="sm" style={{ color: 'var(--nj-semantic-color-text-brand-default)', fontWeight: 500 }}>PLW-2024-0892-NW</NJText>
              </div>
              <div>
                <NJText scale="sm" variant="secondary" style={{ fontWeight: 600, letterSpacing: '.06em', marginBottom: 3, fontSize: 10 }}>RESPONSIBLE</NJText>
                <NJText scale="sm">Marcus Vane</NJText>
              </div>
            </div>
          </div>
          <NJIconButton icon="edit" aria-label="Edit project" scale="sm" />
        </div>
      </div>
    </div>
  );
}

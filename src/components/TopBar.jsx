import { NJIconButton, NJAvatarRoot } from '@engie-group/fluid-design-system-react';

export default function TopBar({ view, onGoView }) {
  const backOrDash =
    view === 'rfp' ? (
      <span style={{ color: 'var(--nj-semantic-color-text-neutral-secondary-default)', fontSize: 13, fontWeight: 500 }}>Dashboard</span>
    ) : (
      <button
        onClick={() => onGoView('rfp')}
        style={{ color: 'var(--nj-semantic-color-text-neutral-secondary-default)', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
      >
        ← Back to Agent 5 configuration
      </button>
    );

  const mid =
    view === 'proposal' ? (
      <span style={{ color: 'var(--nj-semantic-color-text-brand-default)', fontWeight: 600, fontSize: 14 }}>Tender AI</span>
    ) : (
      <span />
    );

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <span className="logo">Tender AI</span>
        {backOrDash}
      </div>
      {mid}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <NJIconButton icon="notifications" aria-label="Notifications" scale="sm" />
        <NJIconButton icon="settings" aria-label="Settings" scale="sm" />
        <NJAvatarRoot label="Marcus Vane" scale="sm" />
      </div>
    </div>
  );
}

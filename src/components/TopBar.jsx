import { NJButton, NJAvatarRoot } from '@engie-group/fluid-design-system-react';

export default function TopBar({ view, user, onGoView }) {
  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="tractebel-badge">TRACTEBEL</span>
        <span className="logo">Tender AI</span>
        {view !== 'dashboard' && (
          <NJButton
            variant="secondary"
            emphasis="subtle"
            scale="sm"
            icon="arrow_back"
            label="Dashboard"
            onClick={() => onGoView('dashboard')}
          />
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-500)', fontWeight: 500 }}>
          {user.first} {user.last}
        </span>
        <NJAvatarRoot scale="sm" initials={user.initials} />
      </div>
    </div>
  );
}

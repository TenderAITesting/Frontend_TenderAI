import { NJButton, NJAvatarRoot } from '@engie-group/fluid-design-system-react';
import tractebelLogo from '../assets/logo.png';

export default function TopBar({ view, user, onGoView }) {
  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src={tractebelLogo} alt="Tractebel Engie" style={{ height: 36, width: 'auto' }} />
        <div style={{ width: 1, height: 24, background: 'var(--nj-semantic-color-border-neutral-minimal-default)' }} />
        <span className="logo">TENDER AI</span>
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

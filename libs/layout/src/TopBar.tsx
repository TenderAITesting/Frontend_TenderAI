import { NJAvatarRoot } from '@engie-group/fluid-design-system-react';
import tractebelLogo from '../../../src/assets/logo.png';
import { useTopBar } from './TopBarContext';

export default function TopBar({ user }) {
  const { slot } = useTopBar();
  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={tractebelLogo} alt="Tractebel Engie" style={{ height: 36, width: 'auto' }} />
        {!slot && <span className="tractebel-badge">TENDER AI</span>}
        {slot && (
          <>
            <div style={{ width: 1, height: 24, background: 'var(--nj-semantic-color-border-neutral-minimal-default)' }} />
            {slot}
          </>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          fontSize: 'var(--nj-semantic-font-size-text-xs-desktop)',
          fontWeight: 'var(--nj-semantic-font-weight-regular)',
          color: 'var(--nj-semantic-color-text-neutral-contrast-default)',
        }}>
          {user.first} {user.last}
        </span>
        <NJAvatarRoot scale="sm" initials={user.initials} label={`${user.first} ${user.last}`} />
      </div>
    </div>
  );
}

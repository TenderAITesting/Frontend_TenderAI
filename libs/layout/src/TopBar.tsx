import { NJAvatarRoot } from '@engie-group/fluid-design-system-react';
import tractebelLogo from '../../../src/assets/logo.png';
import { useTopBar } from './TopBarContext';
import styles from './TopBar.module.css';

export default function TopBar({ user }) {
  const { slot } = useTopBar();
  return (
    <div className={styles["topbar"]}>
      <div className={styles["topbar-left"]}>
        <img src={tractebelLogo} alt="Tractebel Engie" className={styles["topbar-logo"]} />
        {!slot && <span className={styles["tractebel-badge"]}>TENDER AI</span>}
        {slot && (
          <>
            <div className={styles["topbar-divider"]} />
            {slot}
          </>
        )}
      </div>
      <div className={styles["topbar-right"]}>
        <span className={styles["topbar-username"]}>
          {user.first} {user.last}
        </span>
        <NJAvatarRoot scale="sm" initials={user.initials} label={`${user.first} ${user.last}`} />
      </div>
    </div>
  );
}

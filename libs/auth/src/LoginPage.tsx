import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

// TODO: BACKEND — décommenter quand le tenant ENGIE Okta est disponible
// import { useOktaAuth } from '@okta/okta-react';
// import { Security } from '@okta/okta-react';
// import { oktaAuth } from '../model/useAuth';

import { BYPASS_AUTH } from '../../../src/config/env';

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (BYPASS_AUTH) {
      navigate('/homepage', { replace: true });
      return;
    }
    // TODO: BACKEND — déclencher le flow Okta PKCE
    // const { oktaAuth } = useOktaAuth();
    // oktaAuth.signInWithRedirect({ originalUri: '/homepage' });
  }, [navigate]);

  return (
    <div className={styles["login-container"]}>
      <p className={styles["login-message"]}>
        Redirecting…
      </p>
    </div>
  );
}

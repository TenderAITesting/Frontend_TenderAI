import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// TODO: BACKEND — décommenter quand le tenant ENGIE Okta est disponible
// import { useOktaAuth } from '@okta/okta-react';
// import { Security } from '@okta/okta-react';
// import { oktaAuth } from '../model/useAuth';

const BYPASS_AUTH = true; // TODO: BACKEND — passer à false (enableOktaAuth: true)

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 52px)' }}>
      <p style={{ fontSize: 13, color: 'var(--nj-core-color-reference-neutral-500)' }}>
        Redirecting…
      </p>
    </div>
  );
}

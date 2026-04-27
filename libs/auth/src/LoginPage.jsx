import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BYPASS_AUTH = true; // TODO: BACKEND — passer à false en production

/**
 * Page de login.
 * En mode dev (BYPASS_AUTH = true), redirige immédiatement vers /homepage.
 * TODO: BACKEND — intégrer Okta Auth JS v7 :
 *   import { useOktaAuth } from '@okta/okta-react';
 *   oktaAuth.signInWithRedirect() si non authentifié
 */
export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (BYPASS_AUTH) {
      navigate('/homepage', { replace: true });
      return;
    }
    // TODO: BACKEND — déclencher le flow Okta PKCE
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

// Real HTTP client wired against the local backend (DEBUG=true).
// In DEBUG, the backend bypasses Okta, so we don't send Authorization headers.
// Toggle by setting VITE_API_URL in .env.local — defaults to http://localhost:8000.

const BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000';

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...((init.headers as Record<string, string>) ?? {}),
  };
  // Don't force Content-Type when sending FormData (browser sets the boundary).
  if (init.body && !(init.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText} on ${path}: ${text}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

export const httpClient = {
  get:    <T = any>(path: string)               => request<T>(path),
  post:   <T = any>(path: string, body?: any)   =>
    request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }),
  put:    <T = any>(path: string, body?: any)   =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  patch:  <T = any>(path: string, body?: any)   =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) }),
  delete: <T = any>(path: string)               => request<T>(path, { method: 'DELETE' }),
};

export const API_BASE_URL = BASE_URL;


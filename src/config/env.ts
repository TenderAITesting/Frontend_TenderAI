// Single source of truth for environment flags.
// TODO: BACKEND — set VITE_USE_MOCK=false and VITE_BYPASS_AUTH=false in .env.local to activate real API + Okta.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
export const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH !== 'false';
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

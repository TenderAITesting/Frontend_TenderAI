// Mappers between the backend Tender schema and the frontend tender shape.
// Backend fields not used by the UI (status_agent_1/2, selected_agents, ...) are
// preserved on the FE object too so consumers that already inspect them keep working.
//
// FE-only fields (projectId, maxStepIdx, lastStep) are stored client-side in
// localStorage because they don't exist in the backend SQLModel.

const SIDECAR_KEY = 'tender-meta-v1';

type Sidecar = Record<string, { projectId?: string; maxStepIdx?: number; lastStep?: string }>;

function readSidecar(): Sidecar {
  try {
    return JSON.parse(localStorage.getItem(SIDECAR_KEY) || '{}') as Sidecar;
  } catch {
    return {};
  }
}

function writeSidecar(s: Sidecar): void {
  try {
    localStorage.setItem(SIDECAR_KEY, JSON.stringify(s));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function getSidecar(id: string) {
  return readSidecar()[id] ?? {};
}

export function setSidecar(id: string, patch: Partial<Sidecar[string]>): void {
  const s = readSidecar();
  s[id] = { ...(s[id] ?? {}), ...patch };
  writeSidecar(s);
}

export function deleteSidecar(id: string): void {
  const s = readSidecar();
  delete s[id];
  writeSidecar(s);
}

// ---------------------------------------------------------------------------
// Status mapping
// ---------------------------------------------------------------------------
// Backend:  In progress | To validate | Validated | Failed
// Frontend: uploaded | analysis_in_progress | analysis_validated |
//           planning_in_progress | drafting_in_progress | proposal_ready
function backendStatusToFrontend(
  backendStatus: string | undefined,
  lastStep: string | undefined,
): string {
  if (lastStep === 'drafting') return 'drafting_in_progress';
  if (lastStep === 'planning') return 'planning_in_progress';
  switch (backendStatus) {
    case 'Validated':
      return 'analysis_validated';
    case 'In progress':
    case 'To validate':
      return 'analysis_in_progress';
    case 'Failed':
      return 'uploaded';
    default:
      return 'uploaded';
  }
}

function formatModified(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('fr-FR');
}

// ---------------------------------------------------------------------------
// Backend -> Frontend
// ---------------------------------------------------------------------------
export function toFrontendTender(b: any): any {
  if (!b) return b;
  const meta = getSidecar(b.id);
  return {
    id: b.id,
    name: b.name,
    client: b.client ?? '',
    projectId: meta.projectId ?? '',
    modified: formatModified(b.updated_at ?? b.created_at),
    maxStepIdx: meta.maxStepIdx ?? 0,
    lastStep: meta.lastStep ?? 'documents',
    status: backendStatusToFrontend(b.status, meta.lastStep),
    // Pass-through backend fields (kept for future use)
    user: b.user,
    selected_agents: b.selected_agents ?? [],
    status_agent_1: b.status_agent_1,
    status_agent_2: b.status_agent_2,
    created_at: b.created_at,
    updated_at: b.updated_at,
    backendStatus: b.status,
  };
}

export function toFrontendTenders(list: any[] | undefined | null): any[] {
  return Array.isArray(list) ? list.map(toFrontendTender) : [];
}

// ---------------------------------------------------------------------------
// Frontend -> Backend (POST /tenders)
// ---------------------------------------------------------------------------
export function toCreateTenderPayload(t: any): {
  name: string;
  client: string;
  user: string;
  selected_agents: string[];
} {
  return {
    name: t.name ?? 'New Tender',
    client: t.client ?? '',
    user: t.user ?? (`${t.firstName ?? ''} ${t.lastName ?? ''}`.trim() || 'dev.user@engie.com'),
    selected_agents: t.selected_agents ?? [],
  };
}

// ---------------------------------------------------------------------------
// Frontend patch -> Backend PUT /tenders/:id (only fields the backend knows)
// + persist FE-only fields in the sidecar
// ---------------------------------------------------------------------------
export function splitUpdatePatch(
  id: string,
  patch: Record<string, any>,
): { backend: Record<string, any> | null; sidecar: Record<string, any> } {
  const sidecar: Record<string, any> = {};
  const backend: Record<string, any> = {};

  for (const [key, value] of Object.entries(patch)) {
    switch (key) {
      case 'name':
      case 'client':
      case 'user':
        backend[key] = value;
        break;
      case 'projectId':
      case 'maxStepIdx':
      case 'lastStep':
        sidecar[key] = value;
        break;
      // Ignore status / modified / id / backend-only fields here.
    }
  }

  if (Object.keys(sidecar).length > 0) {
    setSidecar(id, sidecar);
  }
  return {
    backend: Object.keys(backend).length > 0 ? backend : null,
    sidecar,
  };
}

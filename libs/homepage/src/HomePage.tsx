import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NJButton, NJInputSearch, NJTag, NJIconButton, NJInlineMessage } from '@engie-group/fluid-design-system-react';
import { useTenders } from '../model/useTenders';

const STATUSES: Record<string, { label: string; variant: string; desc: string }> = {
  uploaded:             { label: 'Uploaded',               variant: 'grey',   desc: 'Tender created, documents uploaded, no meaningful agent run yet.' },
  analysis_in_progress: { label: 'Analysis in progress',   variant: 'orange', desc: 'At least one analysis agent is running, missing, stale, or still under review.' },
  analysis_validated:   { label: 'Analysis validated',     variant: 'teal',   desc: 'The tender has passed the validation gate required to start planning.' },
  planning_in_progress: { label: 'Planning in progress',   variant: 'blue',   desc: 'Agent 5.1 has started or the planning phase is being edited/reviewed.' },
  drafting_in_progress: { label: 'Drafting in progress',   variant: 'purple', desc: 'Drafting workflow has started, including evidence and draft generation.' },
  proposal_ready:       { label: 'Proposal ready',         variant: 'green',  desc: 'A proposal draft exists and is ready for user review.' },
};

export default function DashboardView() {
  const navigate = useNavigate();
  const { data: tenders = [], deleteTender } = useTenders();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTenders = useMemo(() => {
    const term = (searchTerm ?? '').trim().toLowerCase();
    if (!term) return tenders;
    return tenders.filter(t =>
      t.name.toLowerCase().includes(term) ||
      t.client.toLowerCase().includes(term) ||
      (t.projectId ?? '').toLowerCase().includes(term)
    );
  }, [tenders, searchTerm]);

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <NJInputSearch
              style={{ width: 320 }}
              placeholder="Search projects, clients, or project IDs…"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value ?? '')}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Escape') setSearchTerm(''); }}
            />
            <NJButton variant="primary" icon="search" label="Search" onClick={() => setSearchTerm(searchTerm.trim())} />
            <NJButton variant="primary" icon="add" label="New Tender" onClick={() => navigate('/upload')} />
          </div>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Project name</th>
                <th>Client</th>
                <th>Project Id</th>
                <th>Last Modified</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenders.map((t) => {
                const st = STATUSES[t.status] || STATUSES.uploaded;
                return (
                  <tr key={t.id}>
                    <td>
                      <span
                        style={{ color: 'var(--nj-core-color-reference-brand-500)', fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => navigate(`/tender/${t.id}`)}
                      >{t.name}</span>
                    </td>
                    <td>{t.client || '—'}</td>
                    <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--nj-core-color-reference-neutral-500)' }}>
                      {t.projectId || '—'}
                    </td>
                    <td style={{ color: 'var(--nj-core-color-reference-neutral-500)', fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                      {t.modified}
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <span title={st.desc} style={{ cursor: 'help', display: 'inline-flex' }}>
                        <NJTag variant={st.variant as any} scale="sm" label={st.label} />
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', gap: 4 }}>
                        <NJIconButton
                          icon="edit"
                          aria-label="Edit tender"
                          scale="sm"
                          variant="secondary"
                          onClick={() => navigate('/upload', { state: { editingTenderId: t.id } })}
                        />
                        <NJIconButton
                          icon="delete"
                          aria-label="Delete tender"
                          scale="sm"
                          variant="secondary"
                          onClick={() => deleteTender(t.id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '0 24px 16px' }}>
        <NJInlineMessage variant="warning">
          <strong>Document Retention:</strong> Uploaded documents are stored for a maximum of{' '}
          <strong>90 days</strong>. This period is reinitialized each time a document is edited or modified.
        </NJInlineMessage>
      </div>
    </div>
  );
}

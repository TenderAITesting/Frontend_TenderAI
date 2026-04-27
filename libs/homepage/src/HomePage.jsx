import { useNavigate } from 'react-router-dom';
import { NJButton, NJInputSearch, NJTag, NJIconButton, NJInlineMessage } from '@engie-group/fluid-design-system-react';

const STATUSES = {
  uploaded:             { label: 'Uploaded',               variant: 'grey',   desc: 'Tender created, documents uploaded, no meaningful agent run yet.' },
  analysis_in_progress: { label: 'Analysis in progress',   variant: 'orange', desc: 'At least one analysis agent is running, missing, stale, or still under review.' },
  analysis_validated:   { label: 'Analysis validated',     variant: 'teal',   desc: 'The tender has passed the validation gate required to start planning.' },
  planning_in_progress: { label: 'Planning in progress',   variant: 'blue',   desc: 'Agent 5.1 has started or the planning phase is being edited/reviewed.' },
  drafting_in_progress: { label: 'Drafting in progress',   variant: 'purple', desc: 'Drafting workflow has started, including evidence and draft generation.' },
  proposal_ready:       { label: 'Proposal ready',         variant: 'green',  desc: 'A proposal draft exists and is ready for user review.' },
};

export default function DashboardView({ tenders, onDeleteTender }) {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <NJInputSearch
              style={{ width: 320 }}
              placeholder="Search projects, clients, or project IDs…"
            />
            <NJButton variant="primary" icon="search" label="Search" />
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
              {tenders.map((t) => {
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
                        <NJTag variant={st.variant} scale="sm" label={st.label} />
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', gap: 4 }}>
                        <NJIconButton
                          icon="edit"
                          label="Edit tender"
                          scale="sm"
                          variant="secondary"
                          emphasis="subtle"
                          onClick={() => navigate('/upload', { state: { editingTenderId: t.id } })}
                        />
                        <NJIconButton
                          icon="delete"
                          label="Delete tender"
                          scale="sm"
                          variant="secondary"
                          emphasis="subtle"
                          onClick={() => onDeleteTender(t.id)}
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

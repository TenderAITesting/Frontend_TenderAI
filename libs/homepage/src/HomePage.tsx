import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NJButton, NJInputSearch, NJIconButton, NJInlineMessage } from '@engie-group/fluid-design-system-react';
import { useTenders } from '../model/useTenders';
import { PROJECT_SOURCES } from '../../../src/data/constants';

const STEPS = [
  'Tender uploaded',
  'Tender Analysis',
  'Draft Configuration',
  'Proposal Planning',
  'Proposal ready',
] as const;

function InlineStepper({ maxStepIdx, status }: { maxStepIdx: number; status: string }) {
  // maxStepIdx is synced live by TenderPage on every navigation (0=documents … 4=drafting)
  // status === 'proposal_ready' is the only manual override → show all steps done
  const active = status === 'proposal_ready' ? 6 : (maxStepIdx ?? 0) + 1;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', height: 28, gap: 0 }}>
      {STEPS.map((_, i) => {
        const step    = i + 1;
        const done    = step < active;
        const current = step === active;

        const icon  = done ? 'check_circle' : current ? 'radio_button_checked' : 'radio_button_unchecked';
        const color = done
          ? 'var(--nj-semantic-color-background-brand-solid-default)'
          : current
          ? 'var(--nj-semantic-color-background-brand-solid-default)'
          : 'var(--nj-semantic-color-border-neutral-subtle-default)';

        return (
          <span key={step} style={{ display: 'inline-flex', alignItems: 'center' }}>
            {i > 0 && (
              <span style={{
                display: 'inline-block',
                width: 14,
                height: 2,
                background: step <= active
                  ? 'var(--nj-semantic-color-background-brand-solid-default)'
                  : 'var(--nj-semantic-color-border-neutral-subtle-default)',
                flexShrink: 0,
              }} />
            )}
            <span
              className="material-icons"
              aria-hidden="true"
              style={{ fontSize: 12, color, lineHeight: 1, flexShrink: 0 }}
            >
              {icon}
            </span>
          </span>
        );
      })}
      <span style={{
        marginLeft: 8,
        color: 'var(--nj-semantic-color-text-neutral-secondary-default)',
        whiteSpace: 'nowrap',
      }}>
        {STEPS[Math.min(active, STEPS.length) - 1]}
      </span>
    </div>
  );
}

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
      Object.values(t.projectIds ?? {}).some((v: any) => v?.toLowerCase().includes(term))
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
              {filteredTenders.map((t) => (
                <tr key={t.id}>
                  <td>
                    <span
                      style={{ color: 'var(--nj-core-color-reference-brand-500)', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => navigate(`/tender/${t.id}`)}
                    >{t.name}</span>
                  </td>
                  <td>{t.client || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                      {PROJECT_SOURCES.filter(src => t.projectIds?.[src.key]).map(src => (
                        <span key={src.key} title={src.label} style={{
                          display: 'inline-flex', alignItems: 'center',
                          gap: 'var(--nj-semantic-size-spacing-4)',
                          background: src.bg, color: src.color, border: `1px solid ${src.border}`,
                          fontSize: 'var(--nj-semantic-font-size-text-xs-desktop)',
                          fontWeight: 'var(--nj-semantic-font-weight-bold)',
                          padding: 'var(--nj-semantic-size-spacing-4) var(--nj-semantic-size-spacing-8)',
                          borderRadius: 'var(--nj-semantic-size-border-radius-sm)',
                          whiteSpace: 'nowrap',
                        }}>
                          <span style={{ opacity: 0.65 }}>{src.abbr}</span>
                          {t.projectIds[src.key]}
                        </span>
                      ))}
                      {!PROJECT_SOURCES.some(src => t.projectIds?.[src.key]) && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center',
                          background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
                          color: 'var(--nj-semantic-color-text-neutral-contrast-default)',
                          border: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)',
                          fontSize: 'var(--nj-semantic-font-size-text-xs-desktop)',
                          fontWeight: 'var(--nj-semantic-font-weight-regular)',
                          padding: 'var(--nj-semantic-size-spacing-4) var(--nj-semantic-size-spacing-8)',
                          borderRadius: 'var(--nj-semantic-size-border-radius-sm)',
                          whiteSpace: 'nowrap',
                        }}>missing</span>
                      )}
                    </div>
                  </td>
                  <td style={{ color: 'var(--nj-core-color-reference-neutral-500)', fontFamily: "'Lato', sans-serif", fontSize: 12 }}>
                    {t.modified}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <InlineStepper maxStepIdx={t.maxStepIdx ?? 0} status={t.status} />
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
              ))}
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

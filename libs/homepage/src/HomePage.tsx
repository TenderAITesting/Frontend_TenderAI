import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NJButton, NJInputSearch, NJIconButton, NJInlineMessage } from '@engie-group/fluid-design-system-react';
import { Stepper, Step, StepLabel, StepConnector, stepConnectorClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTenders } from '../model/useTenders';

const CompactConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 11,
    left: 'calc(-50% + 11px)',
    right: 'calc(50% + 11px)',
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#e0e0e0',
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundColor: '#1976d2',
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundColor: '#1976d2',
  },
}));
import { PROJECT_SOURCES } from '../../../src/data/constants';

const STEPS = [
  'Tender Uploaded',
  'Tender Analysis',
  'Draft Configuration',
  'Proposal Planning',
  'Proposal Ready',
];

function InlineStepper({ maxStepIdx, status }: { maxStepIdx: number; status: string }) {
  const activeStep = status === 'proposal_ready' ? STEPS.length : (maxStepIdx ?? 0);
  const labelIdx = Math.min(activeStep, STEPS.length - 1);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<CompactConnector />}
        sx={{
          padding: 0, width: 200,
          '& .MuiStep-root': { padding: 0 },
          '& .MuiStepLabel-label': { display: 'none' },
          '& .MuiStepLabel-iconContainer': { padding: 0 },
        }}
      >
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>
      <span style={{ fontSize: 12, whiteSpace: 'nowrap', color: 'var(--nj-semantic-color-text-neutral-secondary-default)' }}>
        {STEPS[labelIdx]}
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

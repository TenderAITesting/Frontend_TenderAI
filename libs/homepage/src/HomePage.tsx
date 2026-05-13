import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NJButton, NJInputSearch, NJIconButton, NJInlineMessage } from '@engie-group/fluid-design-system-react';
import { Stepper, Step, StepLabel, StepConnector, stepConnectorClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTenders } from '../model/useTenders';
import { PROJECT_SOURCES } from '../../../src/data/constants';
import styles from './HomePage.module.css';

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
    <div className={styles["hp-stepper-wrap"]}>
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
      <span className={styles["hp-step-label"]}>
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
    <div className={styles["hp-container"]}>
      <div className={styles["hp-content"]}>
        <div className={styles["hp-toolbar"]}>
          <div className={styles["hp-toolbar-left"]}>
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

        <div className={styles["card"]}>
          <table className={styles["data-table"]}>
            <thead>
              <tr>
                <th>Project name</th>
                <th>Client</th>
                <th>Project Id</th>
                <th>Last Modified</th>
                <th>Status</th>
                <th className={styles["hp-actions-th"]}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenders.map((t) => (
                <tr key={t.id}>
                  <td>
                    <span className={styles["hp-tender-link"]} onClick={() => navigate(`/tender/${t.id}`)}>
                      {t.name}
                    </span>
                  </td>
                  <td>{t.client || '—'}</td>
                  <td>
                    <div className={styles["hp-proj-ids"]}>
                      {PROJECT_SOURCES.filter(src => t.projectIds?.[src.key]).map(src => (
                        <span
                          key={src.key}
                          title={src.label}
                          className={styles["hp-proj-badge"]}
                          style={{ background: src.bg, color: src.color, border: `1px solid ${src.border}` }}
                        >
                          <span className={styles["hp-proj-badge-abbr"]}>{src.abbr}</span>
                          {t.projectIds[src.key]}
                        </span>
                      ))}
                      {!PROJECT_SOURCES.some(src => t.projectIds?.[src.key]) && (
                        <span className={styles["hp-proj-badge-missing"]}>missing</span>
                      )}
                    </div>
                  </td>
                  <td className={styles["hp-modified-date"]}>{t.modified}</td>
                  <td className={styles["hp-status-td"]}>
                    <InlineStepper maxStepIdx={t.maxStepIdx ?? 0} status={t.status} />
                  </td>
                  <td className={styles["hp-actions-td"]} onClick={e => e.stopPropagation()}>
                    <div className={styles["hp-actions-btns"]}>
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

      <div className={styles["hp-footer"]}>
        <NJInlineMessage variant="warning">
          <strong>Document Retention:</strong> Uploaded documents are stored for a maximum of{' '}
          <strong>90 days</strong>. This period is reinitialized each time a document is edited or modified.
        </NJInlineMessage>
      </div>
    </div>
  );
}

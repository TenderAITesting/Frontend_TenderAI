import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { NJButton, NJFormItem, NJHeading } from '@engie-group/fluid-design-system-react';
import { USER, PROJECT_SOURCES } from '../../../src/config/app-config';
import { useTenders } from '../../homepage/model/useTenders';
import styles from './UploadPage.module.css';

export default function NewProjectView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: tenders = [], addTender, updateTender } = useTenders();

  const editingTenderId: string | null = location.state?.editingTenderId ?? null;
  const editingTender = editingTenderId ? tenders.find((t: any) => t.id === editingTenderId) : null;
  const editMode = editingTender != null;

  const [form, setForm] = useState({
    name:      editingTender?.name   ?? '',
    client:    editingTender?.client ?? '',
    projectIds: {
      salesforce: editingTender?.projectIds?.salesforce ?? '',
      planisware: editingTender?.projectIds?.planisware ?? '',
      temis:      editingTender?.projectIds?.temis      ?? '',
    },
    lastName:  USER.last,
    firstName: USER.first,
  });

  const updateForm = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));
  const updateProjectId = (source: string, value: string) =>
    setForm(prev => ({ ...prev, projectIds: { ...prev.projectIds, [source]: value } }));
  const canSubmit = form.name.trim().length > 0 && form.client.trim().length > 0;

  const handleSubmit = () => {
    const pids = {
      salesforce: form.projectIds.salesforce.trim() || undefined,
      planisware: form.projectIds.planisware.trim() || undefined,
      temis:      form.projectIds.temis.trim()      || undefined,
    };

    if (editMode) {
      // TODO: BACKEND — PATCH /tenders/:id
      updateTender(editingTenderId!, {
        name:       form.name   || editingTender.name,
        client:     form.client || editingTender.client,
        projectIds: pids,
      });
      navigate('/homepage');
      return;
    }

    // TODO: BACKEND — POST /tenders — générer l'ID côté serveur
    const newId = uuidv4();
    addTender({
      id:         newId,
      name:       form.name || 'New Tender',
      client:     form.client,
      projectIds: pids,
      modified:   new Date().toLocaleDateString('fr-FR'),
      maxStepIdx: 0,
      lastStep:   'documents',
      status:     'uploaded',
    });
    navigate(`/tender/${newId}`, { state: { isNew: true } });
  };

  return (
    <div className={styles["up-container"]}>
      <div className={`${styles["card"]} ${styles["fadein"]} ${styles["up-card"]}`}>
        <div className={styles["up-back-btn"]}>
          <NJButton
            variant="secondary"
            emphasis="subtle"
            scale="sm"
            icon="arrow_back"
            label="Dashboard"
            onClick={() => navigate('/homepage')}
          />
        </div>

        <NJHeading as="h3" style={{ marginBottom: 6 }}>
          {editMode ? 'Edit Project' : 'Project Information'}
        </NJHeading>
        <p className={styles["up-desc"]}>
          {editMode
            ? 'Update the project details below.'
            : 'Fill in the project details before uploading your tender documents.'}
        </p>

        <div className={styles["up-field"]}>
          <NJFormItem
            id="proj-name"
            label="Project name *"
            labelKind="static"
            value={form.name}
            onChange={(e: any) => updateForm('name', e.target.value)}
            placeholder="Enter project name"
          />
        </div>

        <div className={styles["up-field"]}>
          <NJFormItem
            id="proj-client"
            label="Client *"
            labelKind="static"
            value={form.client}
            onChange={(e: any) => updateForm('client', e.target.value)}
            placeholder="Client name"
          />
        </div>

        <div className={styles["up-field"]}>
          <div className={styles["up-pid-label"]}>Project ID</div>
          <div className={styles["up-pid-grid"]}>
            {PROJECT_SOURCES.map(src => (
              <div key={src.key} className={styles["proj-id-cell"]}>
                <NJFormItem
                  id={`proj-${src.key}`}
                  label={src.label}
                  labelKind="static"
                  value={form.projectIds[src.key as keyof typeof form.projectIds]}
                  onChange={(e: any) => updateProjectId(src.key, e.target.value)}
                  placeholder={`${src.label} ID…`}
                />
                <span
                  className={styles["up-pid-badge"]}
                  style={{ background: src.bg, color: src.color, border: `1px solid ${src.border}` }}
                >{src.abbr}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles["up-names-grid"]}>
          <NJFormItem
            id="proj-lastname"
            label="Responsible Last name"
            labelKind="static"
            value={form.lastName}
            onChange={(e: any) => updateForm('lastName', e.target.value)}
          />
          <NJFormItem
            id="proj-firstname"
            label="Responsible First name"
            labelKind="static"
            value={form.firstName}
            onChange={(e: any) => updateForm('firstName', e.target.value)}
          />
        </div>

        <div className={styles["up-footer"]}>
          <NJButton
            variant="primary"
            icon={editMode ? 'save' : 'arrow_forward'}
            label={editMode ? 'Save Changes' : 'Next — Upload Documents'}
            onClick={handleSubmit}
            disabled={!canSubmit}
          />
        </div>
      </div>
    </div>
  );
}

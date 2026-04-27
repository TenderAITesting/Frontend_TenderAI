import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { NJButton, NJFormItem, NJHeading, NJText } from '@engie-group/fluid-design-system-react';
import { USER } from '../data/constants';

export default function NewProjectView({ tenders, onCreateTender, onUpdateTender }) {
  const navigate = useNavigate();
  const location = useLocation();

  // L'édition passe l'ID du tender via l'état de navigation
  const editingTenderId = location.state?.editingTenderId ?? null;
  const editingTender = editingTenderId ? tenders.find(t => t.id === editingTenderId) : null;
  const editMode = editingTender !== null;

  const [form, setForm] = useState({
    name:        editingTender?.name       ?? '',
    client:      editingTender?.client     ?? '',
    projectId:   editingTender?.projectId  ?? '',
    lastName:    USER.last,
    firstName:   USER.first,
  });

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const canSubmit = form.name.trim().length > 0;

  const handleSubmit = () => {
    if (editMode) {
      // TODO: remplacer par appel API PATCH /tenders/:id
      onUpdateTender(editingTenderId, {
        name:      form.name      || editingTender.name,
        client:    form.client    || editingTender.client,
        projectId: form.projectId || editingTender.projectId,
      });
      navigate('/');
      return;
    }

    // TODO: remplacer par appel API POST /tenders — générer l'ID côté serveur
    const newId = uuidv4();
    const newTender = {
      id:          newId,
      name:        form.name || 'New Tender',
      client:      form.client,
      projectId:   form.projectId.trim(),
      modified:    new Date().toLocaleDateString('fr-FR'),
      maxStepIdx:  0,
      lastStep:    'upload',
      status:      'uploaded',
    };

    onCreateTender(newTender);
    // isNew = true pour verrouiller la navigation en avant dans le stepper
    navigate(`/tender/${newId}`, { state: { isNew: true } });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '52px 24px', minHeight: 'calc(100vh - 52px)' }}>
      <div className="card fadein" style={{ width: '100%', maxWidth: 540, padding: '38px 42px' }}>
        <div style={{ marginBottom: 22 }}>
          <NJButton
            variant="secondary"
            emphasis="subtle"
            scale="sm"
            icon="arrow_back"
            label="Dashboard"
            onClick={() => navigate('/')}
          />
        </div>

        <NJHeading tag="h2" style={{ marginBottom: 6 }}>
          {editMode ? 'Edit Project' : 'Project Information'}
        </NJHeading>
        <NJText style={{ color: 'var(--nj-core-color-reference-neutral-500)', marginBottom: 28, display: 'block' }}>
          {editMode
            ? 'Update the project details below.'
            : 'Fill in the project details before uploading your tender documents.'}
        </NJText>

        <div style={{ marginBottom: 16 }}>
          <NJFormItem
            id="proj-name"
            label="Project name *"
            labelKind="static"
            value={form.name}
            onChange={e => updateForm('name', e.target.value)}
            placeholder="Enter project name"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <NJFormItem
            id="proj-client"
            label="Client"
            labelKind="static"
            value={form.client}
            onChange={e => updateForm('client', e.target.value)}
            placeholder="Client name"
          />
          <NJFormItem
            id="proj-id"
            label="Project ID"
            labelKind="static"
            value={form.projectId}
            onChange={e => updateForm('projectId', e.target.value)}
            placeholder="e.g. PLW-2024-0892"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 30 }}>
          <NJFormItem
            id="proj-lastname"
            label="Responsible Last name"
            labelKind="static"
            value={form.lastName}
            onChange={e => updateForm('lastName', e.target.value)}
          />
          <NJFormItem
            id="proj-firstname"
            label="Responsible First name"
            labelKind="static"
            value={form.firstName}
            onChange={e => updateForm('firstName', e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
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

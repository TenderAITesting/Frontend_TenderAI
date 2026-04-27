import { NJButton, NJFormItem, NJHeading, NJText } from '@engie-group/fluid-design-system-react';

export default function NewProjectView({ newForm, onUpdateForm, onSubmit, onCancel, editMode }) {
  const canSubmit = newForm.name.trim().length > 0;

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
            onClick={onCancel}
          />
        </div>

        <NJHeading tag="h2" style={{ marginBottom: 6 }}>{editMode ? 'Edit Project' : 'Project Information'}</NJHeading>
        <NJText style={{ color: 'var(--nj-core-color-reference-neutral-500)', marginBottom: 28, display: 'block' }}>
          {editMode ? 'Update the project details below.' : 'Fill in the project details before uploading your tender documents.'}
        </NJText>

        <div style={{ marginBottom: 16 }}>
          <NJFormItem
            id="proj-name"
            label="Project name *"
            labelKind="static"
            value={newForm.name}
            onChange={e => onUpdateForm('name', e.target.value)}
            placeholder="Enter project name"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <NJFormItem
            id="proj-client"
            label="Client"
            labelKind="static"
            value={newForm.client}
            onChange={e => onUpdateForm('client', e.target.value)}
            placeholder="Client name"
          />
          <NJFormItem
            id="proj-id"
            label="Project ID"
            labelKind="static"
            value={newForm.projectId || ''}
            onChange={e => onUpdateForm('projectId', e.target.value)}
            placeholder="e.g. PLW-2024-0892"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 30 }}>
          <NJFormItem
            id="proj-lastname"
            label="Responsible Last name"
            labelKind="static"
            value={newForm.lastName}
            onChange={e => onUpdateForm('lastName', e.target.value)}
          />
          <NJFormItem
            id="proj-firstname"
            label="Responsible First name"
            labelKind="static"
            value={newForm.firstName}
            onChange={e => onUpdateForm('firstName', e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <NJButton
            variant="primary"
            icon={editMode ? 'save' : 'arrow_forward'}
            label={editMode ? 'Save Changes' : 'Next — Upload Documents'}
            onClick={onSubmit}
            disabled={!canSubmit}
          />
        </div>
      </div>
    </div>
  );
}
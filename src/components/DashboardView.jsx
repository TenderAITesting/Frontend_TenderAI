import { NJButton, NJInputSearch, NJTag, NJInlineMessage } from '@engie-group/fluid-design-system-react';

export default function DashboardView({ tenders, onNew, onOpen }) {
  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <NJInputSearch
              style={{ width: 320 }}
              placeholder="Search projects, clients, or responsible persons…"
            />
            <NJButton variant="primary" icon="search" label="Search" />
          </div>
          <NJButton variant="primary" icon="add" label="New Tender" onClick={onNew} />
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Project name</th>
                <th>Client</th>
                <th>Responsible</th>
                <th>Last Modified</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tenders.map((t, i) => (
                <tr key={i} style={{ cursor: 'pointer' }} onClick={() => onOpen(i)}>
                  <td>
                    <span style={{ color: 'var(--nj-core-color-reference-brand-500)', fontWeight: 600 }}>{t.name}</span>
                  </td>
                  <td>{t.client}</td>
                  <td>{t.responsible}</td>
                  <td style={{ color: 'var(--nj-core-color-reference-neutral-500)', fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                    {t.modified}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <NJTag variant="teal" scale="sm" label="To validate" />
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

import { NJButton, NJInputSearch, NJTag } from '@engie-group/fluid-design-system-react';

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
            <NJButton variant="primary" label="Search" />
          </div>
          <NJButton variant="primary" label="+ New Tender" onClick={onNew} />
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
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenders.map((t, i) => (
                <tr
                  key={i}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onOpen(i)}
                >
                  <td><span style={{ color: '#13B5CB', fontWeight: 600 }}>{t.name}</span></td>
                  <td>{t.client}</td>
                  <td>{t.responsible}</td>
                  <td style={{ color: '#7E95A8', fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                    {t.modified}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <NJTag variant="teal" scale="sm">To validate</NJTag>
                  </td>
                  <td />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="retention-bar">
        <span style={{ fontSize: 16 }}>⚠</span>
        <span>
          <strong>Document Retention:</strong> Uploaded documents are stored for a maximum of{' '}
          <strong>90 days</strong>. This period is reinitialized each time a document is edited or modified.
        </span>
      </div>
    </div>
  );
}

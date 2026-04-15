import { NJInlineMessage, NJBadge } from '@engie-group/fluid-design-system-react';
import { TOC_ROWS } from '../data/constants';

export default function TocStep() {
  return (
    <div style={{ padding: '22px 28px' }}>
      <NJInlineMessage variant="warning" style={{ marginBottom: 22 }}>
        <strong>Your validation is required.</strong> The proposal will not proceed to the evidence research phase until you confirm or edit the Table of Contents below.
      </NJInlineMessage>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F8FAFC' }}>
            <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #E2EBF3', fontSize: 11, fontWeight: 700, color: '#7E95A8', width: 44 }}>#</th>
            <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #E2EBF3', fontSize: 11, fontWeight: 700, color: '#7E95A8' }}>SECTION TITLE</th>
            <th style={{ textAlign: 'right', padding: '8px 12px', borderBottom: '1px solid #E2EBF3', fontSize: 11, fontWeight: 700, color: '#7E95A8', width: 90 }}>EST. PAGES</th>
          </tr>
        </thead>
        <tbody>
          {TOC_ROWS.map((r) => {
            const sub = r.n.includes('.');
            return (
              <tr key={r.n}>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #E2EBF3', fontSize: 13, color: '#7E95A8', paddingLeft: sub ? 30 : 12 }}>{r.n}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #E2EBF3', paddingLeft: sub ? 30 : 12 }}>
                  <div style={{ fontSize: 13, fontWeight: sub ? 400 : 600 }}>{r.title}</div>
                  {r.desc && <div style={{ fontSize: 11, color: '#7E95A8', marginTop: 2 }}>{r.desc}</div>}
                  {r.warn && <NJBadge variant="warning" emphasis="minimal" scale="sm">⚠ No past offer loaded</NJBadge>}
                </td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #E2EBF3', textAlign: 'right', fontSize: 13, color: '#7E95A8' }}>{r.pages}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

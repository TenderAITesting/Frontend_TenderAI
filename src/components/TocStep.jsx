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
          <tr style={{ background: 'var(--nj-semantic-color-background-neutral-secondary-default)' }}>
            <th style={{ textAlign: 'left', padding: '9px 12px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)', fontSize: 11, fontWeight: 700, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', width: 44 }}>#</th>
            <th style={{ textAlign: 'left', padding: '9px 12px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)', fontSize: 11, fontWeight: 700, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)' }}>SECTION TITLE</th>
            <th style={{ textAlign: 'right', padding: '9px 12px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)', fontSize: 11, fontWeight: 700, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', width: 90 }}>EST. PAGES</th>
          </tr>
        </thead>
        <tbody>
          {TOC_ROWS.map((r) => {
            const sub = r.n.includes('.');
            return (
              <tr key={r.n}>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)', fontSize: 13, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', paddingLeft: sub ? 30 : 12 }}>{r.n}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)', paddingLeft: sub ? 30 : 12 }}>
                  <div style={{ fontSize: 13, fontWeight: sub ? 400 : 600 }}>{r.title}</div>
                  {r.desc && <div style={{ fontSize: 11, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', marginTop: 2 }}>{r.desc}</div>}
                  {r.warn && <NJBadge variant="warning" emphasis="minimal" scale="sm">⚠ No past offer loaded</NJBadge>}
                </td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)', textAlign: 'right', fontSize: 13, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)' }}>{r.pages}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

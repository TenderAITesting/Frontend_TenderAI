import { NJIconButton } from '@engie-group/fluid-design-system-react';
import { DOC_PAGES } from '../../../src/data/constants';

export default function SrcModal({ page, onClose }) {
  const pg = parseInt((page || 'p.1').replace('p.', ''));

  return (
    <div className="overlay" onClick={onClose} style={{ zIndex: 900 }}>
      <div className="modal-box" style={{ maxWidth: 700, height: '82vh' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--nj-core-color-reference-neutral-500)' }}>description</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>RFP_Section_A_Technical_Scope.pdf</div>
              <div style={{ fontSize: 11, color: 'var(--nj-core-color-reference-brand-500)', marginTop: 1 }}>
                Opened at page {pg} · {DOC_PAGES.length} pages total
              </div>
            </div>
          </div>
          <NJIconButton icon="close" label="Close" scale="sm" variant="secondary" emphasis="subtle" onClick={onClose} />
        </div>

        {/* Pages */}
        <div id="src-scroll" style={{ overflowY: 'auto', flex: 1 }}>
          {DOC_PAGES.map(p => (
            <div key={p.n} id={`src-page-${p.n}`} style={{ marginBottom: 0, borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)' }}>
              <div style={{ background: 'var(--nj-semantic-color-background-neutral-secondary-default)', padding: '6px 24px', fontSize: 10, fontWeight: 700, color: 'var(--nj-core-color-reference-neutral-500)', letterSpacing: '.08em', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>RFP_Section_A_Technical_Scope.pdf</span>
                <span>Page {p.n} / {DOC_PAGES.length}</span>
              </div>
              <div style={{ padding: '28px 32px', minHeight: 200, fontSize: 13, lineHeight: 1.8, color: 'var(--nj-semantic-color-text-neutral-primary-default)', background: 'var(--nj-semantic-color-background-neutral-primary-default)' }} dangerouslySetInnerHTML={{ __html: p.content }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

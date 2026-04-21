import { DOC_PAGES } from '../data/constants';

export default function SrcModal({ page, onClose }) {
  const pg = parseInt((page || 'p.1').replace('p.', ''));

  return (
    <div className="overlay" onClick={onClose} style={{ zIndex: 900 }}>
      <div className="modal-box" style={{ maxWidth: 700, height: '82vh' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #E2EBF3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>≡</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>RFP_Section_A_Technical_Scope.pdf</div>
              <div style={{ fontSize: 11, color: '#13B5CB', marginTop: 1 }}>
                Opened at page {pg} · {DOC_PAGES.length} pages total
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, color: '#7E95A8', cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>

        {/* Pages */}
        <div id="src-scroll" style={{ overflowY: 'auto', flex: 1 }}>
          {DOC_PAGES.map(p => (
            <div key={p.n} id={`src-page-${p.n}`} style={{ marginBottom: 0, borderBottom: '1px solid #E2EBF3' }}>
              <div style={{ background: '#F8FAFC', padding: '6px 24px', fontSize: 10, fontWeight: 700, color: '#7E95A8', letterSpacing: '.08em', borderBottom: '1px solid #E2EBF3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>RFP_Section_A_Technical_Scope.pdf</span>
                <span>Page {p.n} / {DOC_PAGES.length}</span>
              </div>
              <div style={{ padding: '28px 32px', minHeight: 200, fontSize: 13, lineHeight: 1.8, color: '#1B2B3C', background: '#fff' }} dangerouslySetInnerHTML={{ __html: p.content }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

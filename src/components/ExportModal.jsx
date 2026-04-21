import { NJButton } from '@engie-group/fluid-design-system-react';

const LANGS = [
  ['EN', 'English'],
  ['FR', 'French'],
  ['NL', 'Dutch'],
  ['DE', 'German'],
  ['ES', 'Spanish'],
  ['PT', 'Portuguese'],
];

export default function ExportModal({ exportLang, onSetLang, onConfirm, onClose }) {
  const canConfirm = exportLang !== null;

  return (
    <div className="disc-overlay" onClick={onClose}>
      <div className="disc-box fadein" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Export Language</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, color: '#7E95A8', cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>

        <p style={{ fontSize: 13, color: '#7E95A8', marginBottom: 18 }}>
          Select the language for the exported Word document.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {LANGS.map(([code, label]) => {
            const sel = exportLang === code;
            return (
              <button
                key={code}
                onClick={() => onSetLang(code)}
                style={{
                  textAlign: 'left', padding: '10px 14px', borderRadius: 7, cursor: 'pointer',
                  border: `1.5px solid ${sel ? '#13B5CB' : '#E2EBF3'}`,
                  background: sel ? '#E8F8FC' : '#fff',
                  color: sel ? '#0D9DB5' : '#1B2B3C',
                  fontSize: 13, fontWeight: sel ? 700 : 400,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <span>{label}</span>
                {sel && <span style={{ fontSize: 14, color: '#13B5CB' }}>✓</span>}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <NJButton variant="secondary" emphasis="subtle" label="Cancel" onClick={onClose} />
          <NJButton
            variant="primary"
            label="Export →"
            onClick={canConfirm ? onConfirm : undefined}
            disabled={!canConfirm}
          />
        </div>
      </div>
    </div>
  );
}

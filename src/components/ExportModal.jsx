import { NJButton, NJIconButton, NJRadioGroup, NJRadio } from '@engie-group/fluid-design-system-react';

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
          <NJIconButton icon="close" label="Close" scale="sm" variant="secondary" emphasis="subtle" onClick={onClose} />
        </div>

        <p style={{ fontSize: 13, color: 'var(--nj-core-color-reference-neutral-500)', marginBottom: 18 }}>
          Select the language for the exported Word document.
        </p>

        <div style={{ marginBottom: 24 }}>
          <NJRadioGroup orientation="vertical" style={{ gap: 10 }}>
            {LANGS.map(([code, label]) => (
              <NJRadio
                key={code}
                value={code}
                label={label}
                checked={exportLang === code}
                onChange={() => onSetLang(code)}
              />
            ))}
          </NJRadioGroup>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <NJButton variant="secondary" emphasis="subtle" label="Cancel" onClick={onClose} />
          <NJButton
            variant="primary"
            icon="download"
            label="Export"
            onClick={canConfirm ? onConfirm : undefined}
            disabled={!canConfirm}
          />
        </div>
      </div>
    </div>
  );
}

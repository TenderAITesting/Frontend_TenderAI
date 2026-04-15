import { useRef, useEffect } from 'react';
import { NJInlineMessage, NJLink, NJIconButton } from '@engie-group/fluid-design-system-react';
import { SRCS } from '../data/constants';

function PhSpan({ id, label, value, editingPH, onStartPH, onStopPH, onPhChange }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingPH === id && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
    }
  }, [editingPH, id]);

  if (editingPH === id) {
    return (
      <input
        ref={inputRef}
        className="ph-input"
        value={value}
        onChange={(e) => onPhChange(id, e.target.value)}
        onBlur={onStopPH}
        onKeyDown={(e) => { if (e.key === 'Enter') onStopPH(); }}
      />
    );
  }
  if (value) {
    return (
      <span className="ph-filled" onClick={() => onStartPH(id)} title="Cliquer pour modifier">{value}</span>
    );
  }
  return (
    <span className="ph-span" onClick={() => onStartPH(id)} title="Cliquer pour éditer">[{label}]</span>
  );
}

export default function EvidenceStep({ ph, editingPH, onStartPH, onStopPH, onPhChange }) {
  const hasAny = Object.values(ph).some(Boolean);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* center draft */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px', borderRight: '1px solid #E2EBF3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: '#13B5CB', fontWeight: 700, letterSpacing: '.08em' }}>02 BASIS OF DESIGN</div>
          <span style={{ color: 'var(--nj-semantic-color-text-secondary-default)', fontSize: 14, cursor: 'pointer' }} title="Éditer">✏</span>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, marginBottom: 18 }}>
          Resource Strategy and<br />Deployment Matrix
        </h2>
        <p style={{ fontSize: 13.5, lineHeight: 1.85, marginBottom: 16 }}>
          Our proposed deployment for the <strong>Tractebel Infrastructure Hub</strong> prioritizes
          local expertise combined with global oversight. The project will{' '}
          <PhSpan id="proj" label="Placeholder: project duration" value={ph.proj} editingPH={editingPH} onStartPH={onStartPH} onStopPH={onStopPH} onPhChange={onPhChange} />{' '}
          dedicated steering committee ensuring that all sustainability milestones are met within the{' '}
          <PhSpan id="equip" label="Placeholder: equipment type" value={ph.equip} editingPH={editingPH} onStartPH={onStartPH} onStopPH={onStopPH} onPhChange={onPhChange} />{' '}
          framework.
        </p>
        <p style={{ fontSize: 13.5, lineHeight: 1.85, marginBottom: 16 }}>
          Key personnel will include a Lead Civil Engineer with over 15 years of experience in
          regional topography. The allocation of heavy machinery, specifically the{' '}
          <PhSpan id="mach" label="Placeholder: machinery spec" value={ph.mach} editingPH={editingPH} onStartPH={onStartPH} onStopPH={onStopPH} onPhChange={onPhChange} />{' '}
          follows the phased rollout schedule agreed upon during pre-qualification. Phase transitions
          will be validated against the{' '}
          <PhSpan id="reg" label="Placeholder: regulatory stand." value={ph.reg} editingPH={editingPH} onStartPH={onStartPH} onStopPH={onStopPH} onPhChange={onPhChange} />{' '}
          compliance checklist.
        </p>
        <p style={{ fontSize: 13.5, lineHeight: 1.85 }}>
          Our mobilisation approach draws on previous deployments in comparable environments,
          minimising on-site learning curves and ensuring continuity between project phases.
        </p>
        {hasAny && (
          <NJInlineMessage variant="success" style={{ marginTop: 18 }}>
            ✓ Placeholder renseigné — cliquez dessus pour modifier.
          </NJInlineMessage>
        )}
      </div>

      {/* right evidence */}
      <div style={{ width: 240, padding: '20px 16px', background: '#FAFCFE', overflowY: 'auto', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#13B5CB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>✓</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700 }}>Evidence Repository</span>
        </div>
        {SRCS.map((s) => (
          <div key={s.id} className="src-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#13B5CB', letterSpacing: '.05em' }}>SOURCE {s.id}</span>
              <span style={{ fontSize: 10, color: '#7E95A8' }}>PDF PAGE {s.page}</span>
            </div>
            <div style={{ fontSize: 11, color: '#1B2B3C', lineHeight: 1.5, marginBottom: 7 }}>{s.q}</div>
            <a className="cyan-link" onClick={(e) => e.preventDefault()} href="#" style={{ fontSize: 11 }}>↗ View Document</a>
          </div>
        ))}
      </div>
    </div>
  );
}

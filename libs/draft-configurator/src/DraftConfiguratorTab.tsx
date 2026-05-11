import { useState, useRef } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import { NJButton, NJCheckbox, NJIcon, NJIconButton, NJTag } from '@engie-group/fluid-design-system-react';
import DisclaimerModal from '../../../src/components/DisclaimerModal';

type FilesState = Record<string, string[]>;
type DragOverState = Record<string, boolean>;

interface FileUploadZoneProps {
  cardKey: string;
  files: FilesState;
  dragOver: DragOverState;
  setDragOver: Dispatch<SetStateAction<DragOverState>>;
  onFiles: (key: string, files: FileList | null) => void;
  onRemove: (key: string, name: string) => void;
  inputRef: RefObject<HTMLInputElement>;
  onBrowse: () => void;
}

// ─── FileUploadZone ────────────────────────────────────────────────────────────
function FileUploadZone({ cardKey, files, dragOver, setDragOver, onFiles, onRemove, inputRef, onBrowse }: FileUploadZoneProps) {
  const cardFiles = files[cardKey] || [];
  const isDragging = dragOver[cardKey] || false;

  return (
    <div>
      <input
        type="file"
        multiple
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={e => { onFiles(cardKey, e.target.files); e.target.value = ''; }}
      />
      <div
        style={{
          border: `1.5px dashed ${isDragging ? 'var(--nj-semantic-color-border-brand-strong-default)' : 'var(--nj-semantic-color-border-neutral-subtle-default)'}`,
          borderRadius: 8, padding: '16px 10px 12px',
          background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
          transition: 'border-color .2s', textAlign: 'center', cursor: 'pointer',
        }}
        onDragOver={e => { e.preventDefault(); setDragOver(p => ({ ...p, [cardKey]: true })); }}
        onDragLeave={() => setDragOver(p => ({ ...p, [cardKey]: false }))}
        onDrop={e => {
          e.preventDefault();
          setDragOver(p => ({ ...p, [cardKey]: false }));
          onFiles(cardKey, e.dataTransfer.files);
        }}
      >
        {cardFiles.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            {cardFiles.map(name => (
              <div
                key={name}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, marginBottom: 5, padding: '3px 6px', background: 'var(--nj-semantic-color-background-neutral-primary-default)', borderRadius: 5, border: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                  <NJIcon name="insert_drive_file" style={{ fontSize: 13, color: 'var(--nj-semantic-color-icon-neutral-secondary-default)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--nj-semantic-color-text-neutral-primary-default)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                </div>
                <NJIconButton
                  icon="close"
                  aria-label="Remove file"
                  scale="sm"
                  variant="secondary"
                  onClick={(e) => { e.stopPropagation(); onRemove(cardKey, name); }}
                />
              </div>
            ))}
          </div>
        )}
        <NJIcon name="cloud_upload" style={{ fontSize: 32, color: 'var(--nj-semantic-color-icon-brand-primary-default)', marginBottom: 8 }} />
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Drag and drop your files here</div>
        <div style={{ fontSize: 11, color: 'var(--nj-semantic-color-text-neutral-secondary-default)', marginBottom: 4 }}>OR</div>
        <div
          style={{ fontSize: 12, fontWeight: 700, color: 'var(--nj-semantic-color-text-brand-primary-default)', marginBottom: 6, cursor: 'pointer' }}
          onClick={e => { e.stopPropagation(); onBrowse(); }}
        >
          Browse files
        </div>
        <div style={{ fontSize: 11, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)' }}>
          {cardFiles.length ? 'PDF, Word' : 'Optional · PDF, Word'}
        </div>
      </div>
    </div>
  );
}

// ─── Plan type card data ───────────────────────────────────────────────────────
const PLAN_CARDS = [
  {
    key: 'standard',
    icon: 'article',
    title: 'Standard plan',
    body: 'Uses the Tractebel base Table of Contents (ToC) and standard section guidance.',
    badge: '⚡ Best for a fast first draft.',
    badgeVariant: 'blue' as const,
    badgePill: true,
  },
  {
    key: 'tailored',
    icon: 'tune',
    title: 'Tailored plan',
    body: 'Uses the Tractebel base Table of Contents (ToC), then adapts it with the inputs you select below.',
    badge: '⭐ Best for complex or strategic tenders.',
    badgeVariant: 'orange' as const,
    badgePill: true,
  },
];

const BASE_DOC_CARDS = [
  { key: 'offers',      icon: 'folder',      title: 'Past offers',             desc: 'Reuse past proposal structures and content to support drafting.' },
  { key: 'methodology', icon: 'menu_book',   title: 'Methodology documents',   desc: 'Use internal methods or frameworks to support drafting.' },
  { key: 'refs',        icon: 'star_border', title: 'Project references',      desc: 'Use selected references to inform and support drafting.' },
];

const TAILORED_DOC_CARDS = [
  { key: 'context',     icon: 'assignment',  title: 'Current tender context',  desc: 'Use validated project context, requirements, and risks to tailor the proposal structure.', locked: true },
  { key: 'offers',      icon: 'folder',      title: 'Past offers',             desc: 'Reuse selected past proposal structures and relevant patterns.' },
  { key: 'methodology', icon: 'menu_book',   title: 'Methodology documents',   desc: 'Use internal methods or frameworks to refine approach and section structure.' },
  { key: 'refs',        icon: 'star_border', title: 'Project references',      desc: 'Use selected references to strengthen experience-related sections.' },
];

const CARD_DISC_TYPE = { offers: 'pastoffers', methodology: 'methodology', refs: 'projectrefs' };

// ─── Main component ────────────────────────────────────────────────────────────
export default function DraftConfiguratorTab({ s, handlers }) {
  const { goStep, launchPlanning, setPlanType } = handlers;
  const planType = s.planType ?? 'standard';

  const [files,             setFiles]            = useState<FilesState>({ offers: [], methodology: [], refs: [] });
  const [included,          setIncluded]         = useState<Record<string, boolean>>({ offers: true, methodology: true, refs: true });
  const [dragOver,          setDragOver]         = useState<DragOverState>({ offers: false, methodology: false, refs: false });
  const [pendingUploadKey,  setPendingUploadKey] = useState<string | null>(null);
  const [useAdditionalDocs, setUseAdditionalDocs] = useState<boolean>(false);

  const offerRef  = useRef<HTMLInputElement>(null);
  const methodRef = useRef<HTMLInputElement>(null);
  const refsRef   = useRef<HTMLInputElement>(null);
  const inputRefs = { offers: offerRef, methodology: methodRef, refs: refsRef };

  function handleFiles(key: string, rawFiles: FileList | null) {
    if (!rawFiles) return;
    setFiles(prev => ({
      ...prev,
      [key]: [...prev[key], ...Array.from(rawFiles).map(f => f.name)],
    }));
  }

  function removeFile(key: string, name: string) {
    setFiles(prev => ({ ...prev, [key]: prev[key].filter((f: string) => f !== name) }));
  }

  function toggleIncluded(key: string) {
    setIncluded(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

        {/* Section heading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--nj-semantic-color-background-neutral-secondary-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--nj-semantic-color-icon-brand-primary-default)', flexShrink: 0 }}>
            <NJIcon name="grid_view" style={{ fontSize: 20 }} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Configure Draft Parameters</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--nj-semantic-color-text-neutral-secondary-default)', marginBottom: 24, paddingLeft: 48 }}>
          How should the proposal plan be built?
        </div>

        {/* Plan type selector cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {PLAN_CARDS.map(card => {
            const isActive = planType === card.key;
            return (
              <div
                key={card.key}
                onClick={() => setPlanType(card.key)}
                style={{
                  border: `2px solid ${isActive ? 'var(--nj-semantic-color-border-brand-strong-default)' : 'var(--nj-semantic-color-border-neutral-minimal-default)'}`,
                  borderRadius: 12,
                  padding: 20,
                  cursor: 'pointer',
                  background: isActive ? 'var(--nj-semantic-color-background-brand-subtle-default)' : 'var(--nj-semantic-color-background-neutral-primary-default)',
                  transition: 'border-color .15s, background .15s',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                  background: isActive ? 'var(--nj-semantic-color-background-brand-subtle-default)' : 'var(--nj-semantic-color-background-neutral-secondary-default)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--nj-semantic-color-icon-brand-primary-default)',
                }}>
                  <NJIcon name={card.icon} style={{ fontSize: 28 }} />
                </div>

                {/* Body */}
                <div style={{ flex: 1 }}>
                  {/* Radio + title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${isActive ? 'var(--nj-semantic-color-border-brand-strong-default)' : 'var(--nj-semantic-color-border-neutral-subtle-default)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isActive ? 'var(--nj-semantic-color-background-brand-solid-default)' : 'transparent',
                    }}>
                      {isActive && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--nj-semantic-color-background-neutral-primary-default)' }} />}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{card.title}</span>
                  </div>

                  {/* Description */}
                  <div style={{ fontSize: 13, color: 'var(--nj-semantic-color-text-neutral-secondary-default)', marginBottom: 12, lineHeight: 1.55 }}>
                    {card.body}
                  </div>

                  {/* Badge */}
                  <NJTag variant={card.badgeVariant} scale="sm" label={card.badge} style={card.badgePill ? { borderRadius: 'var(--nj-semantic-size-border-radius-pill)' } : undefined} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Contextual info banner — tailored plan only */}
        {planType === 'tailored' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: '14px 18px', background: 'var(--nj-semantic-color-background-brand-subtle-default)', borderRadius: 10, border: '2px solid var(--nj-semantic-color-border-brand-strong-default)' }}>
            <NJIcon name="info" style={{ fontSize: 18, color: 'var(--nj-semantic-color-icon-brand-primary-default)', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--nj-semantic-color-text-neutral-primary-default)' }}>
              Past offers, methodology documents, and references are optional. They are used to <strong>shape the plan</strong> only if you select them.
            </span>
          </div>
        )}

        {/* ── STANDARD PLAN: toggle question + optional 3-column document cards ── */}
        {planType === 'standard' && (
          <>
            {/* Toggle bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '14px 18px', background: 'var(--nj-semantic-color-background-brand-subtle-default)', borderRadius: 10, border: '2px solid var(--nj-semantic-color-border-brand-strong-default)' }}>
              <span style={{ fontSize: 13, color: 'var(--nj-semantic-color-text-neutral-primary-default)', flex: 1 }}>
                Do you want to support your drafting with additional documents (past offers, methodology documents, project references)?
              </span>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <NJButton
                  scale="sm"
                  variant={useAdditionalDocs ? 'primary' : 'secondary'}
                  emphasis={useAdditionalDocs ? undefined : 'subtle'}
                  label="Yes"
                  onClick={() => setUseAdditionalDocs(true)}
                />
                <NJButton
                  scale="sm"
                  variant={!useAdditionalDocs ? 'primary' : 'secondary'}
                  emphasis={!useAdditionalDocs ? undefined : 'subtle'}
                  label="No"
                  onClick={() => setUseAdditionalDocs(false)}
                />
              </div>
            </div>

            {/* Document cards — only when Yes */}
            {useAdditionalDocs && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                {BASE_DOC_CARDS.map(card => (
                  <div key={card.key} className="card" style={{ padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--nj-semantic-color-background-neutral-secondary-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--nj-semantic-color-icon-brand-primary-default)', flexShrink: 0 }}>
                        <NJIcon name={card.icon} style={{ fontSize: 18 }} />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 13, marginTop: 6 }}>{card.title}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--nj-semantic-color-text-neutral-secondary-default)', marginBottom: 12, lineHeight: 1.55 }}>
                      {card.desc}
                    </div>
                    <FileUploadZone
                      cardKey={card.key}
                      files={files}
                      dragOver={dragOver}
                      setDragOver={setDragOver}
                      onFiles={handleFiles}
                      onRemove={removeFile}
                      inputRef={inputRefs[card.key]}
                      onBrowse={() => setPendingUploadKey(card.key)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── TAILORED PLAN: 4-column document cards ── */}
        {planType === 'tailored' && (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'var(--nj-semantic-color-text-neutral-primary-default)' }}>
              Design your proposal plan with
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14 }}>
              {TAILORED_DOC_CARDS.map(card => (
                <div key={card.key} className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--nj-semantic-color-background-neutral-secondary-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--nj-semantic-color-icon-brand-primary-default)', flexShrink: 0 }}>
                      <NJIcon name={card.icon} style={{ fontSize: 16 }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{card.title}</span>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--nj-semantic-color-text-neutral-secondary-default)', marginBottom: 12, lineHeight: 1.55, flex: 1 }}>
                    {card.desc}
                  </div>

                  {card.locked ? (
                    <NJTag variant="green" scale="sm" label="Included by default" style={{ borderRadius: 'var(--nj-semantic-size-border-radius-pill)', alignSelf: 'flex-start' }} />
                  ) : (
                    <>
                      <FileUploadZone
                        cardKey={card.key}
                        files={files}
                        dragOver={dragOver}
                        setDragOver={setDragOver}
                        onFiles={handleFiles}
                        onRemove={removeFile}
                        inputRef={inputRefs[card.key]}
                        onBrowse={() => setPendingUploadKey(card.key)}
                      />
                      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <NJCheckbox
                          checked={included[card.key]}
                          onChange={() => toggleIncluded(card.key)}
                        />
                        <span
                          style={{ fontSize: 12, cursor: 'pointer', color: 'var(--nj-semantic-color-text-neutral-primary-default)' }}
                          onClick={() => toggleIncluded(card.key)}
                        >
                          Include in ToC generation
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--nj-semantic-color-text-neutral-tertiary-default)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <NJIcon name="info" style={{ fontSize: 12 }} />
                        Files remain available for drafting.
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* Bottom bar */}
      <div className="bottom-bar">
        <NJButton variant="secondary" emphasis="subtle" scale="md" icon="arrow_back" label="Tender Analysis" onClick={() => goStep('agents')} />
        <NJButton
          variant="primary"
          icon="rocket_launch"
          label="Launch Proposal Generation"
          onClick={launchPlanning}
        />
      </div>

      {/* Warning popup for file uploads */}
      {pendingUploadKey && (
        <DisclaimerModal
          type={CARD_DISC_TYPE[pendingUploadKey]}
          onClose={() => setPendingUploadKey(null)}
          onConfirm={() => {
            inputRefs[pendingUploadKey]?.current?.click();
            setPendingUploadKey(null);
          }}
        />
      )}
    </div>
  );
}

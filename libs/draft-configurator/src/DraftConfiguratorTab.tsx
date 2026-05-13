import { useState, useRef } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import { NJButton, NJCheckbox, NJIcon, NJIconButton, NJTag, NJToggle } from '@engie-group/fluid-design-system-react';
import DisclaimerModal from '../../../src/components/DisclaimerModal';
import styles from './DraftConfiguratorTab.module.css';

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
        className={styles["dc-hidden"]}
        onChange={e => { onFiles(cardKey, e.target.files); e.target.value = ''; }}
      />
      <div
        className={`${styles["dc-drop-zone"]}${isDragging ? ` ${styles["dc-drop-zone-active"]}` : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(p => ({ ...p, [cardKey]: true })); }}
        onDragLeave={() => setDragOver(p => ({ ...p, [cardKey]: false }))}
        onDrop={e => {
          e.preventDefault();
          setDragOver(p => ({ ...p, [cardKey]: false }));
          onFiles(cardKey, e.dataTransfer.files);
        }}
      >
        {cardFiles.length > 0 && (
          <div className={styles["dc-files-list"]}>
            {cardFiles.map(name => (
              <div key={name} className={styles["dc-file-item"]}>
                <div className={styles["dc-file-item-left"]}>
                  <NJIcon name="insert_drive_file" style={{ fontSize: 13, color: 'var(--nj-semantic-color-icon-neutral-secondary-default)', flexShrink: 0 }} />
                  <span className={styles["dc-file-name"]}>{name}</span>
                </div>
                <NJIconButton
                  icon="close"
                  aria-label="Remove file"
                  scale="xs"
                  variant="secondary"
                  onClick={(e) => { e.stopPropagation(); onRemove(cardKey, name); }}
                />
              </div>
            ))}
          </div>
        )}
        <NJIcon name="cloud_upload" style={{ fontSize: 32, color: 'var(--nj-semantic-color-icon-brand-primary-default)', marginBottom: 8 }} />
        <div className={styles["dc-drop-label"]}>Drag and drop your files here</div>
        <div className={styles["dc-drop-or"]}>OR</div>
        <div className={styles["dc-drop-browse"]} onClick={e => { e.stopPropagation(); onBrowse(); }}>
          Browse files
        </div>
        <div className={styles["dc-drop-formats"]}>
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
    badge: '⚡ Best for a fast first draft',
    badgeVariant: 'blue' as const,
    badgePill: true,
  },
  {
    key: 'tailored',
    icon: 'tune',
    title: 'Tailored plan',
    body: 'Uses the Tractebel base Table of Contents (ToC), then adapts it with the inputs you select below.',
    badge: '⭐ Best for complex or strategic tenders',
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
    <div className={styles["dc-container"]}>
      <div className={styles["dc-scroll"]}>

        {/* Section heading */}
        <div className={styles["dc-section-heading"]}>
          <div className={styles["dc-section-icon"]}>
            <NJIcon name="grid_view" style={{ fontSize: 20 }} />
          </div>
          <span className={styles["dc-section-title"]}>Configure Draft Parameters</span>
        </div>
        <div className={styles["dc-section-subtitle"]}>How should the proposal plan be built?</div>

        {/* Plan type selector cards */}
        <div className={styles["dc-plan-grid"]}>
          {PLAN_CARDS.map(card => {
            const isActive = planType === card.key;
            return (
              <div
                key={card.key}
                onClick={() => setPlanType(card.key)}
                className={`${styles["dc-plan-card"]}${isActive ? ` ${styles["dc-plan-card-active"]}` : ''}`}
              >
                {/* Icon */}
                <div className={`${styles["dc-plan-icon"]}${isActive ? ` ${styles["dc-plan-icon-active"]}` : ''}`}>
                  <NJIcon name={card.icon} style={{ fontSize: 28 }} />
                </div>

                {/* Body */}
                <div className={styles["dc-plan-body"]}>
                  {/* Radio + title */}
                  <div className={styles["dc-radio-row"]}>
                    <div className={`${styles["dc-radio"]}${isActive ? ` ${styles["dc-radio-active"]}` : ''}`}>
                      {isActive && <div className={styles["dc-radio-dot"]} />}
                    </div>
                    <span className={styles["dc-plan-title"]}>{card.title}</span>
                  </div>

                  {/* Description */}
                  <div className={styles["dc-plan-desc"]}>{card.body}</div>

                  {/* Badge */}
                  <NJTag variant={card.badgeVariant} scale="xs" label={card.badge} style={card.badgePill ? { borderRadius: 'var(--nj-semantic-size-border-radius-pill)' } : undefined} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Contextual info banner — tailored plan only */}
        {planType === 'tailored' && (
          <div className={styles["dc-info-banner"]}>
            <NJIcon name="info" style={{ fontSize: 18, color: 'var(--nj-semantic-color-icon-brand-primary-default)', flexShrink: 0 }} />
            <span className={styles["dc-info-text"]}>
              Past offers, methodology documents, and references are optional. They are used to <strong>shape the plan</strong> only if you select them.
            </span>
          </div>
        )}

        {/* ── STANDARD PLAN: toggle question + optional 3-column document cards ── */}
        {planType === 'standard' && (
          <>
            {/* Toggle bar */}
            <div className={styles["dc-toggle-bar"]}>
              <span className={styles["dc-toggle-label"]}>
                Do you want to support your drafting with additional documents (past offers, methodology documents, project references)?
              </span>
              <NJToggle
                checked={useAdditionalDocs}
                onChange={(_e, checked) => setUseAdditionalDocs(checked)}
                aria-label="Use additional documents"
              />
            </div>

            {/* Document cards — only when Yes */}
            {useAdditionalDocs && (
              <div className={styles["dc-doc-grid-3"]}>
                {BASE_DOC_CARDS.map(card => (
                  <div key={card.key} className={`${styles["card"]} ${styles["dc-doc-card"]}`}>
                    <div className={styles["dc-doc-header"]}>
                      <div className={styles["dc-doc-icon-lg"]}>
                        <NJIcon name={card.icon} style={{ fontSize: 18 }} />
                      </div>
                      <div className={styles["dc-doc-title-mt"]}>{card.title}</div>
                    </div>
                    <div className={styles["dc-doc-desc"]}>{card.desc}</div>
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
            <div className={styles["dc-section-label"]}>Design your proposal plan with</div>
            <div className={styles["dc-doc-grid-4"]}>
              {TAILORED_DOC_CARDS.map(card => (
                <div key={card.key} className={`${styles["card"]} ${styles["dc-doc-card-flex"]}`}>
                  <div className={styles["dc-doc-header-sm"]}>
                    <div className={styles["dc-doc-icon-sm"]}>
                      <NJIcon name={card.icon} style={{ fontSize: 16 }} />
                    </div>
                    <span className={styles["dc-doc-title"]}>{card.title}</span>
                  </div>

                  <div className={styles["dc-doc-desc-flex"]}>{card.desc}</div>

                  {card.locked ? (
                    <NJTag variant="green" scale="xs" label="Included by default" style={{ borderRadius: 'var(--nj-semantic-size-border-radius-pill)', alignSelf: 'flex-start' }} />
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
                      <div className={styles["dc-include-row"]}>
                        <NJCheckbox
                          checked={included[card.key]}
                          onChange={() => toggleIncluded(card.key)}
                        />
                        <span className={styles["dc-include-label"]} onClick={() => toggleIncluded(card.key)}>
                          Include in ToC generation
                        </span>
                      </div>
                      <div className={styles["dc-include-info"]}>
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
      <div className={styles["bottom-bar"]}>
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

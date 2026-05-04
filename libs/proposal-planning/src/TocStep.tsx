import React, { useState, useRef } from 'react';
import { NJButton } from '@engie-group/fluid-design-system-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Subsection {
  id: string;
  title: string;
  confidence: number;
  guidance?: string;
  evidenceGaps?: string[];
}

interface Section {
  id: number;
  title: string;
  confidence: number;
  subsections: Subsection[];
  guidance: string;
  evidenceGaps: string[];
}

type SelectedItem =
  | { kind: 'section'; section: Section }
  | { kind: 'subsection'; sub: Subsection; parent: Section };

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_SECTIONS: Section[] = [
  {
    id: 1, title: 'Executive Summary', confidence: 72, subsections: [],
    guidance: 'Summarize company overview, key differentiators and objectives. Be concise and client-focused.',
    evidenceGaps: ['Missing client-specific context', 'No quantified outcomes provided'],
  },
  {
    id: 2, title: 'Understanding of the Assignment', confidence: 87,
    subsections: [
      { id: '2.1', title: 'UP1 context and objectives of the MA ventilation simplification', confidence: 83, guidance: 'Clearly articulate the UP1 context and the specific objectives driving the ventilation simplification. Link to the strategic goals.', evidenceGaps: [] },
      { id: '2.2', title: 'Existing state and target end state', confidence: 78, guidance: 'Describe the current ventilation system baseline and the desired future state. Use measurable criteria where possible.', evidenceGaps: ['Baseline documentation not yet confirmed'] },
      { id: '2.3', title: 'Scope of my proposal', confidence: 85, guidance: 'Define precisely what is included and excluded from the proposal scope. Avoid ambiguity.', evidenceGaps: [] },
      { id: '2.4', title: 'Consistent with Lhyfe/Idl community support', confidence: 80, guidance: 'Demonstrate alignment with Lhyfe/Idl community standards and support commitments.', evidenceGaps: [] },
      { id: '2.5', title: 'Key technical risks and regulatory constraints', confidence: 80, guidance: 'Enumerate key technical risks and applicable regulatory constraints. Reference relevant nuclear standards.', evidenceGaps: [] },
    ],
    guidance: 'Define scope of interpretation, outline technical challenges and align with client expectations.',
    evidenceGaps: [],
  },
  {
    id: 3, title: 'Technical Approach and Methodology', confidence: 89, subsections: [],
    guidance: 'Detail the technical methodology. Prioritize clarity and traceability to tender requirements.',
    evidenceGaps: [],
  },
  {
    id: 4, title: 'Safety, Radioprotection, HSE, and Environmental Approach', confidence: 87, subsections: [],
    guidance: 'Cover all regulatory safety requirements. Reference applicable nuclear standards explicitly.',
    evidenceGaps: [],
  },
  {
    id: 5, title: 'Deliverables, Approvals, and Planning', confidence: 81, subsections: [],
    guidance: 'List all deliverables with clear ownership and timeline. Align with tender milestones.',
    evidenceGaps: ['Planning schedule not yet confirmed'],
  },
  {
    id: 6, title: 'Project Organization, Team, and Competencies', confidence: 85, subsections: [],
    guidance: 'Present team structure and relevant competencies. Highlight nuclear-specific expertise.',
    evidenceGaps: [],
  },
  {
    id: 7, title: 'Relevant Experience and Consultant Strengths', confidence: 31,
    subsections: [
      { id: '7.1', title: 'Relevant ventilations and nuclear studies references', confidence: 24, guidance: 'Select only the most directly comparable references in nuclear ventilation or similar regulated environments. For each reference, specify scope, environment, and measurable outcomes. Avoid inflating analogies.', evidenceGaps: ['No direct nuclear ventilation project reference identified', 'Missing quantified outcomes for cited studies', 'Comparable regulated environment references insufficient'] },
      { id: '7.2', title: 'Relevant safety dossier references', confidence: 26, guidance: 'Cite concrete examples of safety dossiers produced in nuclear or high-risk environments. Specify the regulatory framework applied and the role held.', evidenceGaps: ['No completed safety dossier reference in nuclear context', 'Role and contribution in past safety dossiers not documented'] },
      { id: '7.3', title: 'Traceable differentiators', confidence: 23, guidance: 'Identify 2-3 differentiators that are directly traceable to tender evaluation criteria. Each must be supported by at least one concrete proof point.', evidenceGaps: ['Differentiators not yet mapped to tender criteria', 'Proof points missing or unverifiable', 'Risk of overlap with competitor positioning'] },
      { id: '7.4', title: 'About part of N.T.T. if applicable', confidence: 10, guidance: 'Only include if N.T.T. involvement adds demonstrable value for this tender. Clearly define the scope, role, and added value. If not applicable, omit entirely.', evidenceGaps: ['N.T.T. applicability to this tender not confirmed', 'No supporting documentation available', 'Value proposition for client not established'] },
    ],
    guidance: 'Use this section to prove credibility with restraint and precision. Prioritize only the most relevant evidence for this tender, especially references related to ventilation studies, nuclear environments, safety dossiers, and regulated engineering assignments. Keep all claims auditable. Do not stretch analogies or include unsupported marketing statements.',
    evidenceGaps: [
      'Limited direct references in nuclear ventilation projects',
      'Weak differentiation from similar assignments',
      'Lack of quantified performance proof points',
    ],
  },
  {
    id: 8, title: 'Commercial Proposal Summary', confidence: 81, subsections: [],
    guidance: 'Present pricing clearly. Justify cost structure relative to scope and risk.',
    evidenceGaps: [],
  },
  {
    id: 9, title: 'Assumptions, Client Inputs, and Exclusions', confidence: 70, subsections: [],
    guidance: 'Be explicit about all assumptions. List exclusions clearly to manage client expectations.',
    evidenceGaps: ['Client input list not finalized'],
  },
  {
    id: 10, title: 'Contract Terms and General Conditions', confidence: 72, subsections: [],
    guidance: 'Reference standard contract framework. Flag any deviations from standard terms.',
    evidenceGaps: [],
  },
  {
    id: 11, title: 'General Terms and Conditions', confidence: 40, subsections: [],
    guidance: 'Include standard GTC. Ensure alignment with nuclear regulatory requirements.',
    evidenceGaps: ['GTC version not confirmed for this client'],
  },
  {
    id: 12, title: 'Attachments', confidence: 36, subsections: [],
    guidance: 'List all supporting documents. Ensure all referenced attachments are available.',
    evidenceGaps: ['Several referenced documents not yet uploaded'],
  },
];

// ─── Confidence helpers ────────────────────────────────────────────────────────

function getConfidenceColors(confidence: number) {
  if (confidence >= 80) return {
    bg: 'var(--nj-core-color-reference-status-success-100, #f0fdf4)',
    border: 'var(--nj-core-color-reference-status-success-300, #86efac)',
    text: 'var(--nj-core-color-reference-status-success-700, #15803d)',
    dot: 'var(--nj-core-color-reference-status-success-500, #22c55e)',
    label: 'Strong support',
  };
  if (confidence >= 60) return {
    bg: 'var(--nj-core-color-reference-status-warning-100, #fefce8)',
    border: 'var(--nj-core-color-reference-status-warning-200, #fde68a)',
    text: 'var(--nj-core-color-reference-status-warning-700, #a16207)',
    dot: 'var(--nj-core-color-reference-status-warning-400, #fbbf24)',
    label: 'Usable support',
  };
  if (confidence >= 40) return {
    bg: 'var(--nj-core-color-reference-status-warning-100, #fff7ed)',
    border: 'var(--nj-core-color-reference-status-warning-400, #fdba74)',
    text: 'var(--nj-semantic-color-text-status-warning-contrast-default, #c2410c)',
    dot: 'var(--nj-core-color-reference-status-warning-500, #f97316)',
    label: 'Weak support',
  };
  return {
    bg: 'var(--nj-core-color-reference-status-error-100, #fef2f2)',
    border: 'var(--nj-core-color-reference-status-error-300, #fca5a5)',
    text: 'var(--nj-core-color-reference-status-error-700, #dc2626)',
    dot: 'var(--nj-core-color-reference-status-error-500, #ef4444)',
    label: 'Insufficient',
  };
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function ConfidenceBadge({ confidence, large }: { confidence: number; large?: boolean }) {
  const c = getConfidenceColors(confidence);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: large ? '5px 12px' : '2px 8px',
      borderRadius: 20,
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.text,
      fontSize: large ? 14 : 11,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      {confidence}%
      {large && <span style={{ fontWeight: 400, fontSize: 12 }}> — {c.label}</span>}
    </span>
  );
}

function CollapsibleBlock({
  iconText, title, titleColor, open, onToggle, children, readOnlyLabel,
}: {
  iconText: string;
  title: string;
  titleColor?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  readOnlyLabel?: string;
}) {
  return (
    <div style={{
      border: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
      borderRadius: 8, marginBottom: 10, overflow: 'hidden',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
          border: 'none', cursor: 'pointer', gap: 8, textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0 }}>{iconText}</span>
          <span style={{
            fontSize: 13, fontWeight: 600,
            color: titleColor || 'var(--nj-semantic-color-text-neutral-primary-default)',
          }}>
            {title}
          </span>
          {readOnlyLabel && (
            <span style={{
              fontSize: 10, color: 'var(--nj-core-color-reference-neutral-400)',
              display: 'flex', alignItems: 'center', gap: 3, fontWeight: 400,
            }}>
              &#128274; {readOnlyLabel}
            </span>
          )}
        </div>
        <span style={{ fontSize: 10, color: 'var(--nj-core-color-reference-neutral-400)', flexShrink: 0 }}>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div style={{
          padding: 14,
          background: 'var(--nj-semantic-color-background-neutral-primary-default)',
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function PlanningStep({ handlers }: { s: any; handlers: any }) {
  const { goStep, freezeAndDraft } = handlers;

  // Section data
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);

  // Selection: key is String(section.id) for sections, sub.id for subsections
  const [selectedKey, setSelectedKey] = useState<string>('7');

  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([2, 7]));

  // Edit mode (right panel)
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedGuidance, setEditedGuidance] = useState('');

  // Collapsible right panel blocks
  const [guidanceOpen, setGuidanceOpen] = useState(true);
  const [gapsOpen, setGapsOpen] = useState(true);

  // Drag & drop (always active)
  const dragId = useRef<number | null>(null);

  // Delete mode: shows "−" on each row
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Add section inline form
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  // Freeze confirmation modal
  const [showFreezeModal, setShowFreezeModal] = useState(false);

  // ─── Derived selected item ───────────────────────────────────────────────

  function findSelected(key: string): SelectedItem | null {
    for (const sec of sections) {
      if (String(sec.id) === key) return { kind: 'section', section: sec };
      for (const sub of sec.subsections) {
        if (sub.id === key) return { kind: 'subsection', sub, parent: sec };
      }
    }
    return null;
  }

  const selected = findSelected(selectedKey);
  const selTitle      = selected?.kind === 'section' ? selected.section.title      : selected?.sub.title      ?? '';
  const selConfidence = selected?.kind === 'section' ? selected.section.confidence : selected?.sub.confidence ?? 0;
  const selGuidance   = selected?.kind === 'section' ? selected.section.guidance   : selected?.sub.guidance   ?? '';
  const selGaps       = selected?.kind === 'section' ? selected.section.evidenceGaps : selected?.sub.evidenceGaps ?? [];
  const selLabel      = selected?.kind === 'section' ? `Section ${selected.section.id}` : selected?.sub.id ?? '';
  const selColors     = getConfidenceColors(selConfidence);

  // ─── Handlers ────────────────────────────────────────────────────────────

  function handleSelect(key: string) {
    if (editMode) return;
    setSelectedKey(key);
  }

  function toggleExpand(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function startEdit() {
    setEditedTitle(selTitle);
    setEditedGuidance(selGuidance);
    setEditMode(true);
  }

  function cancelEdit() { setEditMode(false); }

  function saveEdit() {
    setSections(prev => prev.map(sec => {
      if (selected?.kind === 'section' && sec.id === selected.section.id) {
        return { ...sec, title: editedTitle.trim() || sec.title, guidance: editedGuidance };
      }
      if (selected?.kind === 'subsection' && sec.id === selected.parent.id) {
        return {
          ...sec,
          subsections: sec.subsections.map(sub =>
            sub.id === selected.sub.id
              ? { ...sub, title: editedTitle.trim() || sub.title, guidance: editedGuidance }
              : sub
          ),
        };
      }
      return sec;
    }));
    setEditMode(false);
  }

  function handleAddSection() {
    if (!newSectionTitle.trim()) return;
    const newId = Math.max(...sections.map(sec => sec.id)) + 1;
    setSections(prev => [...prev, {
      id: newId, title: newSectionTitle.trim(), confidence: 0,
      subsections: [], guidance: '', evidenceGaps: [],
    }]);
    setNewSectionTitle('');
    setShowAddSection(false);
    setSelectedKey(String(newId));
  }

  function handleDeleteSection(id: number) {
    const remaining = sections.filter(sec => sec.id !== id);
    setSections(remaining);
    setDeleteConfirmId(null);
    setDeleteMode(false);
    if (selectedKey === String(id) || sections.find(s => s.id === id)?.subsections.some(sub => sub.id === selectedKey)) {
      setSelectedKey(remaining.length ? String(remaining[0].id) : '');
    }
  }

  function handleDragStart(id: number) { dragId.current = id; }
  function handleDragOver(e: React.DragEvent) { e.preventDefault(); }
  function handleDrop(targetId: number) {
    if (dragId.current === null || dragId.current === targetId) return;
    setSections(prev => {
      const from = prev.findIndex(sec => sec.id === dragId.current);
      const to   = prev.findIndex(sec => sec.id === targetId);
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    dragId.current = null;
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  const LEGEND = [
    { range: '80–100%', score: 90, label: 'Strong support' },
    { range: '60–79%',  score: 70, label: 'Usable support' },
    { range: '40–59%',  score: 50, label: 'Weak support'   },
    { range: '0–39%',   score: 20, label: 'Insufficient'   },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Legend bar ─────────────────────────────────────────────────────── */}
      <div style={{
        background: 'var(--nj-semantic-color-background-neutral-primary-default)',
        borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
        padding: '8px 24px', display: 'flex', gap: 28, alignItems: 'center', flexShrink: 0,
      }}>
        {LEGEND.map(({ range, score, label }) => {
          const c = getConfidenceColors(score);
          return (
            <div key={range} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: c.dot, flexShrink: 0, display: 'inline-block',
              }} />
              <span style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-500)' }}>
                <strong style={{ color: c.text, fontWeight: 700 }}>{range}</strong>
                {' '}{label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Split panels ───────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
        <div style={{
          width: '45%', display: 'flex', flexDirection: 'column', overflow: 'hidden',
          borderRight: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
          background: 'var(--nj-semantic-color-background-neutral-primary-default)',
        }}>

          {/* Panel header */}
          <div style={{
            padding: '12px 16px', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
            flexShrink: 0,
            borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--nj-core-color-reference-brand-500)' }}>
              Golden Table of Contents
            </span>
            <div />
          </div>

          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: deleteMode ? '20px 36px 1fr auto 28px' : '20px 36px 1fr auto',
            padding: '7px 12px', flexShrink: 0,
            background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
            borderBottom: '1.5px solid var(--nj-semantic-color-border-neutral-minimal-default)',
            gap: 4,
          }}>
            <span />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--nj-core-color-reference-neutral-500)', letterSpacing: '.06em' }}>#</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--nj-core-color-reference-neutral-500)', letterSpacing: '.06em' }}>SECTION / SUBSECTION</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--nj-core-color-reference-neutral-500)', letterSpacing: '.06em', textAlign: 'right' }}>CONFIDENCE</span>
            {deleteMode && <span />}
          </div>

          {/* Rows */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {sections.map(sec => {
              const isSecSelected = selectedKey === String(sec.id);
              const isExpanded    = expandedSections.has(sec.id);
              const hasChildren   = sec.subsections.length > 0;

              return (
                <div key={sec.id}>
                  {/* Parent row */}
                  <div
                    draggable={true}
                    onDragStart={() => handleDragStart(sec.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(sec.id)}
                    onClick={() => handleSelect(String(sec.id))}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: deleteMode ? '20px 36px 1fr auto 28px' : '20px 36px 1fr auto',
                      alignItems: 'center',
                      padding: '10px 12px',
                      cursor: 'grab',
                      borderLeft: isSecSelected
                        ? '3px solid var(--nj-core-color-reference-brand-500)'
                        : '3px solid transparent',
                      background: isSecSelected
                        ? 'var(--nj-core-color-reference-brand-100, #eff6ff)'
                        : 'transparent',
                      borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
                      transition: 'background .1s',
                      gap: 4,
                    }}
                    onMouseEnter={e => { if (!isSecSelected) e.currentTarget.style.background = 'var(--nj-semantic-color-background-neutral-secondary-default)'; }}
                    onMouseLeave={e => { if (!isSecSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Drag handle */}
                    <span style={{ fontSize: 14, color: 'var(--nj-core-color-reference-neutral-400)', cursor: 'grab', lineHeight: 1, userSelect: 'none' }}>⠿</span>

                    {/* Number */}
                    <span style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-400)', fontFamily: "'DM Mono', monospace", alignSelf: 'start', paddingTop: 1 }}>
                      {sec.id}
                    </span>

                    {/* Title + chevron */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0, overflow: 'hidden' }}>
                      {hasChildren && (
                        <span
                          onClick={e => toggleExpand(sec.id, e)}
                          style={{ fontSize: 9, color: 'var(--nj-core-color-reference-neutral-400)', cursor: 'pointer', flexShrink: 0, lineHeight: 1, padding: '0 2px', userSelect: 'none' }}
                        >
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      )}
                      <span style={{
                        fontSize: 13, fontWeight: 700,
                        color: isSecSelected
                          ? 'var(--nj-core-color-reference-brand-700, var(--nj-core-color-reference-brand-500))'
                          : 'var(--nj-semantic-color-text-neutral-primary-default)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                      }}>
                        {sec.title}
                      </span>
                    </div>

                    {/* Confidence badge */}
                    <ConfidenceBadge confidence={sec.confidence} />

                    {/* Minus button in delete mode */}
                    {deleteMode && (
                      <button
                        onClick={e => { e.stopPropagation(); setDeleteConfirmId(sec.id); }}
                        style={{
                          width: 22, height: 22, borderRadius: '50%', border: 'none',
                          background: 'var(--nj-core-color-reference-status-error-500, #ef4444)',
                          color: '#fff', fontSize: 16, fontWeight: 700,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          lineHeight: 1, flexShrink: 0, padding: 0,
                        }}
                        title="Delete this section"
                      >
                        −
                      </button>
                    )}
                  </div>

                  {/* Delete confirmation */}
                  {deleteConfirmId === sec.id && (
                    <div style={{
                      margin: '0 12px 4px',
                      padding: '10px 14px',
                      background: 'var(--nj-core-color-reference-status-error-100, #fef2f2)',
                      border: '1px solid var(--nj-core-color-reference-status-error-300, #fca5a5)',
                      borderRadius: 6,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    }}>
                      <span style={{ fontSize: 12, color: 'var(--nj-core-color-reference-status-error-700, #dc2626)' }}>
                        Delete "{sec.title}"?
                      </span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <NJButton variant="secondary" emphasis="subtle" scale="sm" label="Cancel" onClick={() => setDeleteConfirmId(null)} />
                        <NJButton variant="primary" scale="sm" label="Delete" onClick={() => handleDeleteSection(sec.id)} />
                      </div>
                    </div>
                  )}

                  {/* Subsection rows */}
                  {isExpanded && hasChildren && sec.subsections.map(sub => {
                    const isSubSelected = selectedKey === sub.id;
                    return (
                      <div
                        key={sub.id}
                        onClick={() => handleSelect(sub.id)}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: deleteMode ? '36px 1fr auto 28px' : '36px 1fr auto',
                          alignItems: 'center', padding: '8px 12px', paddingLeft: 44,
                          borderLeft: isSubSelected
                            ? '3px solid var(--nj-core-color-reference-brand-500)'
                            : '3px solid transparent',
                          background: isSubSelected
                            ? 'var(--nj-core-color-reference-brand-100, #eff6ff)'
                            : 'transparent',
                          borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
                          cursor: 'pointer', gap: 4, transition: 'background .1s',
                        }}
                        onMouseEnter={e => { if (!isSubSelected) e.currentTarget.style.background = 'var(--nj-semantic-color-background-neutral-secondary-default)'; }}
                        onMouseLeave={e => { if (!isSubSelected) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span style={{ fontSize: 11, color: 'var(--nj-core-color-reference-neutral-400)', fontFamily: "'DM Mono', monospace" }}>
                          {sub.id}
                        </span>
                        <span style={{
                          fontSize: 12,
                          color: isSubSelected
                            ? 'var(--nj-core-color-reference-brand-700, var(--nj-core-color-reference-brand-500))'
                            : 'var(--nj-semantic-color-text-neutral-contrast-default, #555)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          fontWeight: isSubSelected ? 600 : 400,
                        }}>
                          {sub.title}
                        </span>
                        <ConfidenceBadge confidence={sub.confidence} />
                        {deleteMode && <span />}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Bottom toolbar: Add / Delete */}
            <div style={{
              flexShrink: 0,
              padding: '8px 12px',
              borderTop: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
              display: 'flex', gap: 8, justifyContent: 'center',
            }}>
              {deleteMode ? (
                <NJButton
                  variant="secondary" emphasis="subtle" scale="sm" icon="close"
                  label="Cancel"
                  onClick={() => { setDeleteMode(false); setDeleteConfirmId(null); }}
                />
              ) : (
                <>
                  <NJButton
                    variant="primary" scale="sm" icon="add" label="Add section"
                    onClick={() => { setShowAddSection(true); setNewSectionTitle(''); }}
                  />
                  <NJButton
                    variant="secondary" emphasis="subtle" scale="sm" icon="delete"
                    label="Delete section"
                    onClick={() => { setDeleteMode(true); setDeleteConfirmId(null); }}
                  />
                </>
              )}
            </div>

            {/* Add section inline form */}
            {showAddSection && (
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
                background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
              }}>
                <input
                  className="inp"
                  placeholder="New section title…"
                  value={newSectionTitle}
                  onChange={e => setNewSectionTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAddSection();
                    if (e.key === 'Escape') { setShowAddSection(false); setNewSectionTitle(''); }
                  }}
                  autoFocus
                  style={{ marginBottom: 8 }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <NJButton variant="primary" scale="sm" label="Add" onClick={handleAddSection} />
                  <NJButton variant="secondary" emphasis="subtle" scale="sm" label="Cancel"
                    onClick={() => { setShowAddSection(false); setNewSectionTitle(''); }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────────────────────────── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
        }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

            {/* Section / subsection header card */}
            <div style={{
              background: 'var(--nj-semantic-color-background-neutral-primary-default)',
              border: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
              borderRadius: 8, padding: 16, marginBottom: 12,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--nj-core-color-reference-brand-500)', fontWeight: 600, marginBottom: 6, letterSpacing: '.04em' }}>
                    {selLabel}
                  </div>
                  {editMode ? (
                    <>
                      <span style={{ fontSize: 11, color: 'var(--nj-core-color-reference-neutral-400)', display: 'block', marginBottom: 4 }}>Section title</span>
                      <input
                        className="inp"
                        value={editedTitle}
                        onChange={e => setEditedTitle(e.target.value)}
                        style={{ fontSize: 15, fontWeight: 700 }}
                      />
                    </>
                  ) : (
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--nj-semantic-color-text-neutral-primary-default)', lineHeight: 1.3 }}>
                      {selTitle}
                    </h2>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <ConfidenceBadge confidence={selConfidence} large />
                  {selConfidence < 40 && (
                    <span style={{ fontSize: 11, color: selColors.text }}>Insufficient evidence</span>
                  )}
                </div>
              </div>

              {selConfidence < 40 && (
                <div className="warn-box" style={{ marginTop: 12 }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>&#9651;</span>
                  <span style={{ fontSize: 12, color: 'var(--nj-semantic-color-text-status-warning-contrast-default)' }}>
                    Additional evidence recommended before drafting.
                  </span>
                </div>
              )}
            </div>

            {/* Drafting guidance */}
            <CollapsibleBlock iconText="&#9998;" title="Drafting guidance" open={guidanceOpen} onToggle={() => setGuidanceOpen(v => !v)}>
              {editMode ? (
                <textarea
                  className="inp"
                  value={editedGuidance}
                  onChange={e => setEditedGuidance(e.target.value)}
                  style={{ minHeight: 120, resize: 'vertical', width: '100%', fontSize: 13 }}
                />
              ) : (
                <p style={{
                  fontSize: 13, lineHeight: 1.6,
                  color: selGuidance ? 'var(--nj-semantic-color-text-neutral-primary-default)' : 'var(--nj-core-color-reference-neutral-400)',
                  fontStyle: selGuidance ? 'normal' : 'italic',
                }}>
                  {selGuidance || 'No guidance provided.'}
                </p>
              )}
            </CollapsibleBlock>

            {/* Evidence gaps */}
            <CollapsibleBlock
              iconText="&#9651;"
              title="Evidence gaps"
              titleColor="var(--nj-semantic-color-text-status-warning-contrast-default)"
              open={gapsOpen}
              onToggle={() => setGapsOpen(v => !v)}
              readOnlyLabel="AI-generated — read only"
            >
              {(selGaps ?? []).length === 0 ? (
                <p style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-400)', fontStyle: 'italic' }}>
                  No evidence gaps detected.
                </p>
              ) : (
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  {(selGaps ?? []).map((gap, i) => (
                    <li key={i} style={{ fontSize: 13, color: 'var(--nj-semantic-color-text-neutral-primary-default)', lineHeight: 1.7 }}>
                      {gap}
                    </li>
                  ))}
                </ul>
              )}
            </CollapsibleBlock>

            {/* Edit / Save / Cancel */}
            <div style={{ padding: '12px 14px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              {editMode ? (
                <>
                  <NJButton variant="primary" scale="md" icon="save" label="Save changes" onClick={saveEdit} />
                  <NJButton variant="secondary" emphasis="subtle" scale="md" label="Cancel" onClick={cancelEdit} />
                </>
              ) : (
                <NJButton variant="secondary" emphasis="subtle" scale="md" icon="edit" label="Edit" onClick={startEdit} />
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom action bar ───────────────────────────────────────────────── */}
      <div className="bottom-bar">
        <NJButton
          variant="secondary" emphasis="subtle" scale="md"
          icon="arrow_back" label="Draft Configurator"
          onClick={() => goStep('config')}
        />
        <NJButton
          variant="primary" scale="md"
          icon="lock" label="Freeze Golden ToC & Draft Proposal"
          onClick={() => setShowFreezeModal(true)}
        />
      </div>

      {/* ── Freeze confirmation modal ───────────────────────────────────────── */}
      {showFreezeModal && (
        <div className="overlay" onClick={() => setShowFreezeModal(false)}>
          <div className="disc-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--nj-semantic-color-text-neutral-primary-default)' }}>
              Freeze Table of Contents?
            </h3>
            <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 20, color: 'var(--nj-core-color-reference-neutral-500)' }}>
              You are about to freeze the Table of Contents. No further structural changes will be possible.
              The proposal drafting agent will start automatically.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <NJButton variant="secondary" emphasis="subtle" scale="md" label="Cancel" onClick={() => setShowFreezeModal(false)} />
              <NJButton variant="primary" scale="md" icon="arrow_forward" label="Confirm & Freeze" onClick={() => { setShowFreezeModal(false); freezeAndDraft(); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

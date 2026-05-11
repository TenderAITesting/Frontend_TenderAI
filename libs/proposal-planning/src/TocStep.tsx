import React, { useState, useRef, useEffect } from 'react';
import { NJButton, NJIconButton } from '@engie-group/fluid-design-system-react';

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
    bg: 'var(--nj-core-color-reference-status-info-100, #eff6ff)',
    border: 'var(--nj-core-color-reference-status-info-300, #93c5fd)',
    text: 'var(--nj-core-color-reference-status-info-700, #1d4ed8)',
    dot: 'var(--nj-core-color-reference-status-info-500, #3b82f6)',
    label: 'Usable support',
  };
  if (confidence >= 40) return {
    bg: 'var(--nj-core-color-reference-status-warning-100, #fff7ed)',
    border: 'var(--nj-core-color-reference-status-warning-400, #fb923c)',
    text: 'var(--nj-core-color-reference-status-warning-800, #9a3412)',
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
  iconText, title, titleColor, children, readOnlyLabel, headerRight,
}: {
  iconText: React.ReactNode;
  title: string;
  titleColor?: string;
  children: React.ReactNode;
  readOnlyLabel?: string;
  headerRight?: React.ReactNode;
}) {
  return (
    <div style={{
      border: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
      borderRadius: 8, marginBottom: 10, overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0, display: 'flex', alignItems: 'center' }}>{iconText}</span>
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
        {headerRight}
      </div>
      <div style={{
        padding: 14,
        background: 'var(--nj-semantic-color-background-neutral-primary-default)',
      }}>
        {children}
      </div>
    </div>
  );
}

function EditControls({ editMode, onEdit, onSave, onCancel }: {
  editMode: boolean; onEdit: () => void; onSave: () => void; onCancel: () => void;
}) {
  const btn = (primary?: boolean): React.CSSProperties => ({
    background: primary ? 'var(--nj-core-color-reference-brand-500)' : 'transparent',
    border: `1px solid ${primary ? 'transparent' : 'var(--nj-semantic-color-border-neutral-subtle-default, #d1d5db)'}`,
    borderRadius: 6, cursor: 'pointer',
    width: 28, height: 28, padding: 0,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    color: primary ? '#fff' : 'var(--nj-core-color-reference-neutral-500)',
    fontSize: 15, lineHeight: 1, flexShrink: 0, transition: 'opacity .15s',
  });
  const icon = (name: string) => (
    <span className="material-icons" style={{ fontSize: 16, lineHeight: 1 }}>{name}</span>
  );
  if (editMode) return (
    <div style={{ display: 'flex', gap: 4 }}>
      <button style={btn(true)} onClick={onSave} title="Enregistrer">{icon('save')}</button>
      <button style={btn()} onClick={onCancel} title="Cancel">{icon('undo')}</button>
    </div>
  );
  return <button style={btn()} onClick={onEdit} title="Modifier">{icon('edit')}</button>;
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function PlanningStep({ handlers }: { s: any; handlers: any }) {
  const { goStep, freezeAndDraft } = handlers;

  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [selectedKey, setSelectedKey] = useState<string>('7');
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([2, 7]));

  const [editTitle, setEditTitle] = useState(false);
  const [editGuidance, setEditGuidance] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedGuidance, setEditedGuidance] = useState('');

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const dragId    = useRef<number | null>(null);
  const dragSubId = useRef<string | null>(null);
  const dragSubParentId = useRef<number | null>(null);

  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteSubConfirmId, setDeleteSubConfirmId] = useState<string | null>(null);

  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const [showAddSubsection, setShowAddSubsection] = useState(false);
  const [newSubsectionTitle, setNewSubsectionTitle] = useState('');

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

  // ─── Renumber helper ─────────────────────────────────────────────────────

  function renumber(secs: Section[], curKey: string): [Section[], string] {
    let newKey = curKey;
    const out = secs.map((sec, si) => {
      const newId = si + 1;
      if (curKey === String(sec.id)) newKey = String(newId);
      const subsections = sec.subsections.map((sub, subi) => {
        const newSubId = `${newId}.${subi + 1}`;
        if (curKey === sub.id) newKey = newSubId;
        return { ...sub, id: newSubId };
      });
      return { ...sec, id: newId, subsections };
    });
    return [out, newKey];
  }

  // ─── Handlers ────────────────────────────────────────────────────────────

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleSelect(key: string) {
    if (editTitle || editGuidance) return;
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

  function startEditTitle() { setEditedTitle(selTitle); setEditTitle(true); }
  function cancelEditTitle() { setEditTitle(false); }
  function saveEditTitle() {
    setSections(prev => prev.map(sec => {
      if (selected?.kind === 'section' && sec.id === selected.section.id)
        return { ...sec, title: editedTitle.trim() || sec.title };
      if (selected?.kind === 'subsection' && sec.id === selected.parent.id)
        return { ...sec, subsections: sec.subsections.map(sub => sub.id === selected.sub.id ? { ...sub, title: editedTitle.trim() || sub.title } : sub) };
      return sec;
    }));
    setEditTitle(false);
  }

  function startEditGuidance() { setEditedGuidance(selGuidance); setEditGuidance(true); }
  function cancelEditGuidance() { setEditGuidance(false); }
  function saveEditGuidance() {
    setSections(prev => prev.map(sec => {
      if (selected?.kind === 'section' && sec.id === selected.section.id)
        return { ...sec, guidance: editedGuidance };
      if (selected?.kind === 'subsection' && sec.id === selected.parent.id)
        return { ...sec, subsections: sec.subsections.map(sub => sub.id === selected.sub.id ? { ...sub, guidance: editedGuidance } : sub) };
      return sec;
    }));
    setEditGuidance(false);
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

  function handleAddSubsection() {
    if (!newSubsectionTitle.trim()) return;
    const parentSecId = selected?.kind === 'section'
      ? selected.section.id
      : selected?.kind === 'subsection'
      ? selected.parent.id
      : null;
    if (parentSecId === null) return;

    const newSections = sections.map(sec => {
      if (sec.id !== parentSecId) return sec;
      const newSubId = `${sec.id}.${sec.subsections.length + 1}`;
      const newSub: Subsection = {
        id: newSubId,
        title: newSubsectionTitle.trim(),
        confidence: 0,
        guidance: '',
        evidenceGaps: [],
      };
      return { ...sec, subsections: [...sec.subsections, newSub] };
    });

    const parentSec = newSections.find(s => s.id === parentSecId);
    const newSubId = parentSec?.subsections[parentSec.subsections.length - 1]?.id ?? String(parentSecId);

    setSections(newSections);
    setExpandedSections(prev => new Set([...prev, parentSecId]));
    setSelectedKey(newSubId);
    setNewSubsectionTitle('');
    setShowAddSubsection(false);
  }

  function handleDeleteSection(id: number) {
    const remaining = sections.filter(sec => sec.id !== id);
    setSections(remaining);
    setDeleteConfirmId(null);
    setDeleteSubConfirmId(null);
    setDeleteMode(false);
    if (selectedKey === String(id) || sections.find(s => s.id === id)?.subsections.some(sub => sub.id === selectedKey)) {
      setSelectedKey(remaining.length ? String(remaining[0].id) : '');
    }
  }

  function handleDeleteSubsection(secId: number, subId: string) {
    setSections(prev => prev.map(sec =>
      sec.id === secId
        ? { ...sec, subsections: sec.subsections.filter(s => s.id !== subId) }
        : sec
    ));
    setDeleteSubConfirmId(null);
    if (selectedKey === subId) {
      const parent = sections.find(s => s.id === secId);
      setSelectedKey(parent ? String(parent.id) : '');
    }
  }

  function handleDragStart(id: number) { dragId.current = id; }
  function handleDragOver(e: React.DragEvent) { e.preventDefault(); }
  function handleDrop(targetId: number) {
    if (dragId.current === null || dragId.current === targetId) return;
    const from = sections.findIndex(sec => sec.id === dragId.current);
    const to   = sections.findIndex(sec => sec.id === targetId);
    const next = [...sections];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const [numbered, newKey] = renumber(next, selectedKey);
    setSections(numbered);
    setSelectedKey(newKey);
    dragId.current = null;
  }

  function handleSubDragStart(secId: number, subId: string) {
    dragSubId.current = subId;
    dragSubParentId.current = secId;
  }
  function handleSubDrop(secId: number, targetSubId: string) {
    if (!dragSubId.current || dragSubId.current === targetSubId) return;
    if (dragSubParentId.current !== secId) return;
    const secIdx = sections.findIndex(s => s.id === secId);
    if (secIdx === -1) return;
    const subs = [...sections[secIdx].subsections];
    const from = subs.findIndex(s => s.id === dragSubId.current);
    const to   = subs.findIndex(s => s.id === targetSubId);
    const [moved] = subs.splice(from, 1);
    subs.splice(to, 0, moved);
    const newSections = sections.map((sec, i) => i === secIdx ? { ...sec, subsections: subs } : sec);
    const [numbered, newKey] = renumber(newSections, selectedKey);
    setSections(numbered);
    setSelectedKey(newKey);
    dragSubId.current = null;
    dragSubParentId.current = null;
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  const LEGEND = [
    { range: '80–100%', score: 90, label: 'Strong support' },
    { range: '60–79%',  score: 70, label: 'Usable support' },
    { range: '40–59%',  score: 50, label: 'Weak support'   },
    { range: '0–39%',   score: 20, label: 'Insufficient'   },
  ];

  // Which section id is the parent of the add-subsection form
  const addSubParentId = showAddSubsection
    ? (selected?.kind === 'section' ? selected.section.id : selected?.kind === 'subsection' ? selected.parent.id : null)
    : null;

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {deleteMode && (
                <NJIconButton
                  icon="close"
                  aria-label="Cancel"
                  scale="sm"
                  variant="secondary"
                  onClick={() => { setDeleteMode(false); setDeleteConfirmId(null); setDeleteSubConfirmId(null); }}
                />
              )}
              <div style={{ position: 'relative' }} ref={menuRef}>
                <NJIconButton
                  icon="more_vert"
                  aria-label="Options"
                  scale="sm"
                  variant="secondary"
                  onClick={() => setMenuOpen(v => !v)}
                />
                {menuOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '100%', zIndex: 200,
                    background: 'var(--nj-semantic-color-background-neutral-primary-default)',
                    border: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
                    borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,.12)',
                    minWidth: 172, overflow: 'hidden', marginTop: 4,
                  }}>
                    <button
                      onClick={() => { setMenuOpen(false); setShowAddSection(true); setNewSectionTitle(''); }}
                      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--nj-semantic-color-text-neutral-primary-default)', textAlign: 'left' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--nj-semantic-color-background-neutral-secondary-default)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                    >
                      <span className="material-icons" style={{ fontSize: 16, color: 'var(--nj-core-color-reference-neutral-500)' }}>add</span>
                      Add section
                    </button>
                    <button
                      onClick={() => {
                        if (!selected) return;
                        setMenuOpen(false);
                        if (selected.kind === 'section') {
                          setExpandedSections(prev => new Set([...prev, selected.section.id]));
                        }
                        setShowAddSubsection(true);
                        setNewSubsectionTitle('');
                      }}
                      disabled={!selected}
                      style={{ width: '100%', background: 'none', border: 'none', cursor: selected ? 'pointer' : 'default', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: selected ? 'var(--nj-semantic-color-text-neutral-primary-default)' : 'var(--nj-core-color-reference-neutral-400)', textAlign: 'left', opacity: selected ? 1 : 0.5 }}
                      onMouseEnter={e => { if (selected) (e.currentTarget as HTMLButtonElement).style.background = 'var(--nj-semantic-color-background-neutral-secondary-default)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                    >
                      <span className="material-icons" style={{ fontSize: 16, color: selected ? 'var(--nj-core-color-reference-neutral-500)' : 'var(--nj-core-color-reference-neutral-300)' }}>playlist_add</span>
                      Add subsection
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); setDeleteMode(true); setDeleteConfirmId(null); }}
                      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--nj-core-color-reference-status-error-600, #dc2626)', textAlign: 'left' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--nj-semantic-color-background-neutral-secondary-default)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                    >
                      <span className="material-icons" style={{ fontSize: 16 }}>delete_outline</span>
                      Delete section
                    </button>
                  </div>
                )}
              </div>
            </div>
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
                    <span style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-400)', fontFamily: "'Lato', sans-serif", alignSelf: 'start', paddingTop: 1 }}>
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

                    {/* Trash icon in delete mode */}
                    {deleteMode && (
                      <button
                        onClick={e => { e.stopPropagation(); setDeleteConfirmId(deleteConfirmId === sec.id ? null : sec.id); }}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--nj-core-color-reference-status-error-500, #ef4444)', flexShrink: 0,
                        }}
                        title="Delete this section"
                      >
                        <span className="material-icons" style={{ fontSize: 18 }}>delete_outline</span>
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
                      borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 10,
                    }}>
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--nj-core-color-reference-status-error-700, #dc2626)' }}>
                          Delete "{sec.title}"?
                        </span>
                        {sec.subsections.length > 0 && (
                          <div style={{ marginTop: 6, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                            <span className="material-icons" style={{ fontSize: 14, color: 'var(--nj-core-color-reference-status-error-600, #dc2626)', flexShrink: 0, marginTop: 1 }}>warning</span>
                            <span style={{ fontSize: 11, color: 'var(--nj-core-color-reference-status-error-700, #dc2626)', lineHeight: 1.5 }}>
                              This section has {sec.subsections.length} subsection{sec.subsections.length > 1 ? 's' : ''} ({sec.subsections.map(s => s.id).join(', ')}) that will also be deleted.
                            </span>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <NJButton variant="secondary" emphasis="subtle" scale="sm" label="Cancel" onClick={() => setDeleteConfirmId(null)} />
                        <NJButton variant="primary" scale="sm" label="Delete" onClick={() => handleDeleteSection(sec.id)} />
                      </div>
                    </div>
                  )}

                  {/* Subsection rows */}
                  {isExpanded && hasChildren && sec.subsections.map((sub) => {
                    const isSubSelected = selectedKey === sub.id;
                    return (
                      <React.Fragment key={sub.id}>
                        <div
                          draggable={true}
                          onDragStart={() => handleSubDragStart(sec.id, sub.id)}
                          onDragOver={handleDragOver}
                          onDrop={() => handleSubDrop(sec.id, sub.id)}
                          onClick={() => handleSelect(sub.id)}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: deleteMode
                              ? '20px 36px 1fr auto 28px'
                              : '20px 36px 1fr auto',
                            alignItems: 'center',
                            padding: '7px 12px',
                            paddingLeft: 24,
                            borderLeft: isSubSelected
                              ? '3px solid var(--nj-core-color-reference-brand-500)'
                              : '3px solid transparent',
                            background: isSubSelected
                              ? 'var(--nj-core-color-reference-brand-100, #eff6ff)'
                              : 'transparent',
                            borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
                            cursor: 'grab', gap: 4, transition: 'background .1s',
                          }}
                          onMouseEnter={e => { if (!isSubSelected) e.currentTarget.style.background = 'var(--nj-semantic-color-background-neutral-secondary-default)'; }}
                          onMouseLeave={e => { if (!isSubSelected) e.currentTarget.style.background = 'transparent'; }}
                        >
                          {/* Drag handle */}
                          <span style={{ fontSize: 14, color: 'var(--nj-core-color-reference-neutral-400)', cursor: 'grab', lineHeight: 1, userSelect: 'none' }}>⠿</span>

                          <span style={{ fontSize: 11, color: 'var(--nj-core-color-reference-neutral-400)', fontFamily: "'Lato', sans-serif" }}>
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
                          {deleteMode && (
                            <button
                              onClick={e => { e.stopPropagation(); setDeleteSubConfirmId(deleteSubConfirmId === sub.id ? null : sub.id); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--nj-core-color-reference-status-error-500, #ef4444)', flexShrink: 0 }}
                              title="Delete this subsection"
                            >
                              <span className="material-icons" style={{ fontSize: 18 }}>delete_outline</span>
                            </button>
                          )}
                        </div>
                        {deleteSubConfirmId === sub.id && (
                          <div style={{
                            margin: '0 12px 4px 44px', padding: '10px 14px',
                            background: 'var(--nj-core-color-reference-status-error-100, #fef2f2)',
                            border: '1px solid var(--nj-core-color-reference-status-error-300, #fca5a5)',
                            borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 10,
                          }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--nj-core-color-reference-status-error-700, #dc2626)' }}>
                              Delete "{sub.title}"?
                            </span>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                              <NJButton variant="secondary" emphasis="subtle" scale="sm" label="Cancel" onClick={() => setDeleteSubConfirmId(null)} />
                              <NJButton variant="primary" scale="sm" label="Delete" onClick={() => handleDeleteSubsection(sec.id, sub.id)} />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {/* Add subsection inline form — shown below this section's subsections */}
                  {addSubParentId === sec.id && (
                    <div style={{
                      padding: '10px 16px 10px 44px',
                      borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
                      background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
                    }}>
                      <input
                        className="inp"
                        placeholder="New subsection title…"
                        value={newSubsectionTitle}
                        onChange={e => setNewSubsectionTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleAddSubsection();
                          if (e.key === 'Escape') { setShowAddSubsection(false); setNewSubsectionTitle(''); }
                        }}
                        autoFocus
                        style={{ marginBottom: 8, fontSize: 12 }}
                      />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <NJButton variant="primary" scale="sm" label="Add" onClick={handleAddSubsection} />
                        <NJButton variant="secondary" emphasis="subtle" scale="sm" label="Cancel"
                          onClick={() => { setShowAddSubsection(false); setNewSubsectionTitle(''); }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

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
                  {editTitle ? (
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ConfidenceBadge confidence={selConfidence} large />
                    <EditControls editMode={editTitle} onEdit={startEditTitle} onSave={saveEditTitle} onCancel={cancelEditTitle} />
                  </div>
                  {selConfidence < 40 && (
                    <span style={{ fontSize: 11, color: selColors.text }}>Insufficient evidence</span>
                  )}
                </div>
              </div>

              {selConfidence < 40 && (
                <div className="warn-box" style={{ marginTop: 12 }}>
                  <span className="material-icons" style={{ fontSize: 18, flexShrink: 0, color: 'var(--nj-semantic-color-text-status-warning-contrast-default)' }}>warning</span>
                  <span style={{ fontSize: 12, color: 'var(--nj-semantic-color-text-status-warning-contrast-default)' }}>
                    Additional evidence recommended before drafting.
                  </span>
                </div>
              )}
            </div>

            {/* Drafting guidance */}
            <CollapsibleBlock
              iconText={<span className="material-icons" style={{ fontSize: 16, color: 'var(--nj-core-color-reference-neutral-500)' }}>edit_note</span>}
              title="Drafting guidance"
              headerRight={<EditControls editMode={editGuidance} onEdit={startEditGuidance} onSave={saveEditGuidance} onCancel={cancelEditGuidance} />}
            >
              {editGuidance ? (
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
              iconText={<span className="material-icons" style={{ fontSize: 16, color: 'var(--nj-semantic-color-text-status-warning-contrast-default)' }}>warning</span>}
              title="Evidence gaps"
              titleColor="var(--nj-semantic-color-text-status-warning-contrast-default)"
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

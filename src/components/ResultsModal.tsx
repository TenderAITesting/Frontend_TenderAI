import React, { useState, useEffect } from 'react';
import { NJButton, NJLink } from '@engie-group/fluid-design-system-react';
import { parseStructuredData } from '../utils/parseResultsData';
import { useExcelData } from '../model/useExcelData';
import styles from './ResultsModal.module.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const AGENT_TITLES: Record<string, string> = {
  a1: 'Tender Key Information',
  a2: 'Technical Requirements — Results',
  a3: 'Project Risks — Results',
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ResultsModalS {
  resultsAgent: string;
  resultsValidated: Record<string, boolean>;
  file?: File | null;
  responsibleName?: string;
  tenderId?: string;
  agentName?: string;
}

interface ResultsModalHandlers {
  onClose: () => void;
  onReRunAI?: () => void;
  onUpdateDocs?: () => void;
  onFeedback?: () => void;
  onValidate?: (agent: string) => void;
  openSrc: (p: string) => void;
}

interface ResultsModalProps {
  s: ResultsModalS;
  handlers: ResultsModalHandlers;
}

// ─── Page-ref link helper ─────────────────────────────────────────────────────

function renderWithPageRefs(text: string, openSrc: (p: string) => void): React.ReactNode {
  const parts = text.split(/(p\.\s*\d+)/g);
  if (parts.length === 1) return <span className={styles["rm-cell-text"]}>{text}</span>;
  return (
    <span className={styles["rm-cell-text"]}>
      {parts.map((part, i) =>
        /^p\.\s*\d+$/.test(part)
          ? <NJLink key={i} href="#" onClick={e => { e.preventDefault(); openSrc(part.replace(/\s+/, '')); }}>{part.replace(/\s+/, '')} ↗</NJLink>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

// ─── Nested table sub-components ─────────────────────────────────────────────

interface NestedTableProps {
  data: any[];
  cellKey: string;
  openSrc: (p: string) => void;
}

function NestedTable({ data, cellKey, openSrc }: NestedTableProps) {
  if (!Array.isArray(data) || data.length === 0) return null;
  const allKeys = [...new Set<string>(data.flatMap(item => Object.keys(item)))];
  return (
    <table key={cellKey} className={styles["rm-nested-table"]}>
      <thead>
        <tr>
          {allKeys.map(key => (
            <th key={key} className={styles["rm-nested-th"]}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={i}>
            {allKeys.map(key => {
              const v = Array.isArray(item[key]) ? item[key].join(', ') : String(item[key] ?? '');
              return (
                <td key={key} className={styles["rm-nested-td"]}>
                  {/p\.\s*\d+/.test(v) ? renderWithPageRefs(v, openSrc) : v || '—'}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface EditableNestedTableProps {
  data: any[];
  rowIndex: number;
  cellIndex: number;
  onAddItem: (ri: number, ci: number) => void;
  onDeleteItem: (ri: number, ci: number, ii: number) => void;
  onEditItem: (ri: number, ci: number, ii: number, field: string, value: string | string[]) => void;
}

function EditableNestedTable({ data, rowIndex, cellIndex, onAddItem, onDeleteItem, onEditItem }: EditableNestedTableProps) {
  if (!Array.isArray(data) || data.length === 0) return null;
  const allKeys = [...new Set<string>(data.flatMap(item => Object.keys(item)))];
  return (
    <div>
      <div className={styles["rm-nested-add-bar"]}>
        <button onClick={() => onAddItem(rowIndex, cellIndex)} className={styles["rm-nested-add-btn"]}>
          + Add Item
        </button>
      </div>
      <table className={styles["rm-nested-table"]}>
        <thead>
          <tr>
            <th className={styles["rm-nested-th"]}>Actions</th>
            {allKeys.map(key => (
              <th key={key} className={styles["rm-nested-th"]}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td className={styles["rm-nested-td"]}>
                <button
                  onClick={() => onDeleteItem(rowIndex, cellIndex, idx)}
                  className={styles["rm-nested-del-btn"]}
                  title="Delete this item"
                >×</button>
              </td>
              {allKeys.map(key => (
                <td key={key} className={styles["rm-nested-td"]}>
                  {Array.isArray(item[key]) ? (
                    <div
                      contentEditable suppressContentEditableWarning
                      onBlur={e => {
                        const values = ((e.target as HTMLDivElement).textContent || '')
                          .split(',').map(v => v.trim()).filter(v => v);
                        onEditItem(rowIndex, cellIndex, idx, key, values);
                      }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLDivElement).blur(); } }}
                      className={styles["rm-editable-cell"]}
                    >
                      {item[key].join(', ')}
                    </div>
                  ) : (
                    <div
                      contentEditable suppressContentEditableWarning
                      onBlur={e => onEditItem(rowIndex, cellIndex, idx, key, (e.target as HTMLDivElement).textContent || '')}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLDivElement).blur(); } }}
                      className={styles["rm-editable-cell"]}
                    >
                      {item[key] || ''}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ResultsModal({ s, handlers }: ResultsModalProps) {
  const { resultsAgent, resultsValidated, file, responsibleName, tenderId, agentName } = s;
  const { onClose, onReRunAI, onUpdateDocs, onFeedback, onValidate, openSrc } = handlers;

  const [isEditing, setIsEditing] = useState(false);

  const excel = useExcelData({ resultsAgent, file, tenderId, agentName });

  // Reset edit mode when the agent or file changes
  useEffect(() => { setIsEditing(false); }, [file, resultsAgent]);

  const handleReRunAI = () => { if (onReRunAI) onReRunAI(); onClose(); };
  const handleEdit    = () => setIsEditing(v => !v);
  const handleValidate = () => { if (onValidate) onValidate(resultsAgent); onClose(); };

  const isResponsible = !responsibleName;
  const hasExcel = resultsAgent === 'a1' || resultsAgent === 'a2' || resultsAgent === 'a3' || !!file;
  const hasData  = excel.sheetData.length > 0;

  // ─── Cell renderer ────────────────────────────────────────────────────────

  const renderCellContent = (cell: any, rowIndex: number, cellIndex: number): React.ReactNode => {
    const cellValue = cell !== null && cell !== undefined ? String(cell) : '';

    if (rowIndex === 0) return cellValue;

    const header = (excel.sheetData[0]?.[cellIndex] ? String(excel.sheetData[0][cellIndex]) : '').toLowerCase().trim();

    if (header === 'page') {
      return cellValue
        ? <NJLink href="#" onClick={e => { e.preventDefault(); openSrc(`p.${cellValue}`); }}>p.{cellValue} ↗</NJLink>
        : <span className={styles["rm-cell-empty"]}>—</span>;
    }

    if (header === 'safety_impact') {
      return cellValue === 'YES' ? <span className={styles["rm-badge-yes"]}>YES</span>
        : cellValue === 'NO'    ? <span className={styles["rm-badge-no"]}>NO</span>
        : <span className={styles["rm-cell-empty"]}>—</span>;
    }

    if (header === 'risk_score') {
      const cls: Record<string, string> = { HIGH: styles["rm-risk-high"], MEDIUM: styles["rm-risk-medium"], LOW: styles["rm-risk-low"] };
      const rc = cls[cellValue];
      return rc
        ? <span className={`${styles["rm-risk-badge"]} ${rc}`}>{cellValue}</span>
        : <span className={styles["rm-cell-empty"]}>—</span>;
    }

    const structuredData = parseStructuredData(cellValue);
    const cellKey = `${rowIndex}-${cellIndex}`;

    if (structuredData) {
      const isExpanded = excel.expandedCells[cellKey];
      return (
        <div>
          {structuredData.length > 1 && (
            <button onClick={() => excel.toggleCellExpansion(rowIndex, cellIndex)} className={styles["rm-toggle-btn"]}>
              {isExpanded ? '▼' : '▶'} {isEditing ? 'Edit Details' : 'View Details'} ({structuredData.length} items)
            </button>
          )}
          {(isExpanded || structuredData.length <= 1) && (
            isEditing
              ? <EditableNestedTable
                  data={structuredData}
                  rowIndex={rowIndex}
                  cellIndex={cellIndex}
                  onAddItem={excel.addNestedItem}
                  onDeleteItem={excel.deleteNestedItem}
                  onEditItem={excel.handleNestedDataEdit}
                />
              : <NestedTable data={structuredData} cellKey={cellKey} openSrc={openSrc} />
          )}
        </div>
      );
    }

    if (cellValue.length > 100) {
      const isExpanded = excel.expandedCells[cellKey];
      const displayVal = isExpanded ? cellValue : `${cellValue.substring(0, 100)}...`;
      const toggleBtn = (
        <button onClick={() => excel.toggleCellExpansion(rowIndex, cellIndex)} className={styles["rm-show-more-btn"]}>
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      );
      if (isEditing) {
        return (
          <div>
            <div
              contentEditable suppressContentEditableWarning
              onBlur={e => { const v = (e.target as HTMLDivElement).textContent || ''; if (v !== cellValue) excel.handleCellEdit(rowIndex, cellIndex, v); }}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLDivElement).blur(); } }}
              className={styles["rm-editable-cell-wide"]}
            >
              {displayVal}
            </div>
            {toggleBtn}
          </div>
        );
      }
      return (
        <div>
          <span className={styles["rm-cell-text"]}>
            {/p\.\s*\d+/.test(displayVal) ? renderWithPageRefs(displayVal, openSrc) : displayVal}
          </span>{' '}
          {toggleBtn}
        </div>
      );
    }

    if (isEditing && rowIndex > 0) {
      return (
        <div
          contentEditable suppressContentEditableWarning
          onBlur={e => { const v = (e.target as HTMLDivElement).textContent || ''; if (v !== cellValue) excel.handleCellEdit(rowIndex, cellIndex, v); }}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLDivElement).blur(); } }}
          className={styles["rm-editable-cell"]}
        >
          {cellValue}
        </div>
      );
    }

    return /p\.\s*\d+/.test(cellValue)
      ? renderWithPageRefs(cellValue, openSrc)
      : cellValue || <span className={styles["rm-cell-empty"]}>—</span>;
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  const agentPlaceholder = (
    <div className={styles["rm-placeholder"]}>
      <div className={styles["rm-placeholder-title"]}>Agent's results</div>
      <div className={styles["rm-placeholder-desc"]}>
        The extracted results for this agent are available in the downloaded Excel file.<br />
        Use the <strong>Download Excel</strong> button below to access the full output.
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`${styles["rm-modal-box"]} ${styles["rm-modal-fullscreen"]}`}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className={styles["rm-header"]}>
          <div>
            <div className={styles["rm-header-title"]}>
              {AGENT_TITLES[resultsAgent] || 'Agent Results'}
              {isEditing && <span className={styles["rm-edit-badge"]}>— Edit mode</span>}
              {excel.hasChanges && <span className={styles["rm-changes-badge"]}>— Unsaved changes</span>}
            </div>
            <div className={styles["rm-header-meta"]}>
              {excel.displayFileName || `agent${(resultsAgent || 'a1').slice(1)}_results.xlsx`}
              {!isEditing && ' — Read-only'}
            </div>
          </div>
          <div className={styles["rm-header-actions"]}>
            <button aria-label="Close" onClick={onClose} className={styles["rm-close-btn"]}>✕</button>
          </div>
        </div>

        {/* ── Sheet tabs ── */}
        {!excel.isCsvFile && excel.sheetNames.length > 1 && (
          <div className={styles["rm-tabs"]}>
            {excel.sheetNames.map(name => (
              <button
                key={name}
                onClick={() => excel.handleSheetChange(name)}
                className={`${styles["rm-tab"]}${excel.activeSheet === name ? ` ${styles["rm-tab-active"]}` : ''}`}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {/* ── Content ── */}
        <div className={styles["rm-content"]}>
          {excel.loading ? (
            <div className={styles["rm-loading"]}>Loading data…</div>
          ) : excel.error ? (
            <div className={styles["rm-error"]}>{excel.error}</div>
          ) : !hasExcel ? agentPlaceholder
          : !hasData ? (
            <div className={styles["rm-no-data"]}>No data.</div>
          ) : (
            <>
              <div className={styles["rm-row-count"]}>
                Showing {excel.sheetData.length - 1} rows
                {excel.hasChanges && <span className={styles["rm-row-count-changes"]}>— Unsaved changes</span>}
              </div>
              <div className={styles["rm-table-scroll"]}>
                <table className={styles["rm-table"]}>
                  <thead>
                    {isEditing && isResponsible && excel.sheetData.length > 0 && (
                      <tr>
                        <th className={styles["rm-col-del-th"]}></th>
                        {(Array.isArray(excel.sheetData[0]) ? excel.sheetData[0] : Object.keys(excel.sheetData[0])).map((_: any, ci: number) => (
                          <th key={ci} className={styles["rm-col-del-th-center"]}>
                            <button onClick={() => excel.deleteColumn(ci)} className={styles["rm-delete-ctrl"]} title={`Delete column ${ci + 1}`}>×</button>
                          </th>
                        ))}
                      </tr>
                    )}
                    <tr>
                      {isEditing && isResponsible && <th className={`${styles["rm-th"]} ${styles["rm-th-narrow"]}`}></th>}
                      {(Array.isArray(excel.sheetData[0]) ? excel.sheetData[0] : Object.values(excel.sheetData[0])).map((h: any, i: number) => (
                        <th key={i} className={styles["rm-th"]}>{String(h ?? '').toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {excel.sheetData.slice(1).map((row: any[], ri: number) => (
                      <tr key={ri}
                        onMouseOver={e => (e.currentTarget.style.background = 'var(--nj-semantic-color-background-neutral-secondary-default)')}
                        onMouseOut={e => (e.currentTarget.style.background = '')}
                      >
                        {isEditing && isResponsible && (
                          <td className={styles["rm-row-delete-td"]}>
                            <button onClick={() => excel.deleteRow(ri + 1)} className={styles["rm-delete-ctrl"]} title={`Delete row ${ri + 1}`}>×</button>
                          </td>
                        )}
                        {(Array.isArray(row) ? row : Object.values(row)).map((cell: any, ci: number) => (
                          <td key={ci} className={styles["rm-data-td"]}>
                            {renderCellContent(cell, ri + 1, ci)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isEditing && isResponsible && (
                <div className={styles["rm-edit-actions"]}>
                  <button onClick={excel.addRow} className={styles["rm-add-btn"]}>+ Add Row</button>
                  <button onClick={excel.addColumn} className={styles["rm-add-btn"]}>+ Add Column</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className={styles["rm-footer"]}>
          <div className={styles["rm-footer-left"]}>
            {isResponsible && isEditing ? (
              <>
                <NJButton variant="primary"   emphasis="subtle" scale="sm" icon="save"  label="Save"       onClick={excel.handleSave}    disabled={!excel.hasChanges} />
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="undo"  label="Reset"      onClick={excel.resetChanges}  disabled={!excel.hasChanges} />
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="close" label="Close Edit" onClick={handleEdit} />
              </>
            ) : isResponsible ? (
              <>
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="edit"          label="Edit"              onClick={handleEdit} />
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="download"      label="Download Excel"    onClick={excel.saveAsExcel} />
                {file && <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="download" label="Download Original" onClick={excel.handleDownload} />}
                {onFeedback && <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="thumb_up" label="Feedback" onClick={onFeedback} />}
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="refresh"       label="Re-run Agent"      onClick={handleReRunAI} />
                <NJButton variant="primary"   emphasis="subtle" scale="sm" icon="upload_file"   label="Update Documents"  onClick={onUpdateDocs} />
              </>
            ) : (
              <>
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="download" label="Download Excel" onClick={file ? excel.handleDownload : excel.saveAsExcel} />
                {onFeedback && <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="thumb_up" label="Feedback" onClick={onFeedback} />}
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="close"    label="Close"         onClick={onClose} />
              </>
            )}
          </div>
          {resultsValidated?.[resultsAgent] ? (
            <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="check_circle" label="Validated" disabled />
          ) : (
            isResponsible && (
              <NJButton
                variant="primary" scale="sm" icon="check_circle" label="Validate Results"
                style={{ background: 'var(--nj-core-color-reference-status-success-500)', borderColor: 'var(--nj-core-color-reference-status-success-500)' }}
                onClick={handleValidate}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

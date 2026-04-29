import { useState } from 'react';
import { NJButton, NJIconButton, NJLink } from '@engie-group/fluid-design-system-react';
import agent1Data from '../data/Agent1.xlsx';
import agent2Data from '../data/Agent2.xlsx';

// ─── Data ─────────────────────────────────────────────────────────────────────

const AGENT_DATA: Record<string, Record<string, any[][]>> = { a1: agent1Data, a2: agent2Data };
const AGENT_TITLES: Record<string, string> = {
  a1: 'Tender Key Information',
  a2: 'Technical Requirements — Results',
  a3: 'Project Risks — Results',
};

// ─── Python-dict parser ───────────────────────────────────────────────────────

function pyDictToJson(str: string): string {
  let result = '';
  let inString = false;
  let delimiter = '';
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    const prev = i > 0 ? str[i - 1] : '';
    if (prev === '\\') { result += c; continue; }
    if ((c === "'" || c === '"') && !inString) {
      inString = true; delimiter = c; result += '"';
    } else if (c === delimiter && inString) {
      inString = false; delimiter = ''; result += '"';
    } else if (c === '"' && inString) {
      result += '\\"';
    } else {
      result += c;
    }
  }
  return result;
}

function parsePyList(raw: string): any[] | null {
  if (!raw || typeof raw !== 'string') return null;
  const s = raw.trim();
  if (!s.startsWith('[')) return null;
  try { const p = JSON.parse(s); if (Array.isArray(p)) return p; } catch {}
  try {
    const clean = s.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ');
    const p = JSON.parse(pyDictToJson(clean));
    if (Array.isArray(p)) return p;
  } catch {}
  return null;
}

// ─── Source utilities ─────────────────────────────────────────────────────────

function extractPageRefs(source: string): string[] {
  if (!source) return [];
  const m = source.match(/p\.\s*\d+/g);
  return m ? [...new Set(m.map(r => r.replace(/\s+/, '')))] : [];
}

function isNotSpecified(s: string) {
  return !s || s.toLowerCase().includes('not specified');
}

// ─── Nested table (Agent 1 right column) ──────────────────────────────────────

function NestedTable({ items, onOpenSrc }: { items: any[]; onOpenSrc: (p: string) => void }) {
  const allKeys = [...new Set(items.flatMap(it => Object.keys(it)))];

  const thSt: React.CSSProperties = {
    textAlign: 'left', padding: '4px 8px',
    background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
    borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
    fontSize: 10, fontWeight: 700, color: 'var(--nj-core-color-reference-neutral-500)',
    whiteSpace: 'nowrap',
  };
  const tdSt: React.CSSProperties = {
    padding: '5px 8px', verticalAlign: 'top', fontSize: 12, wordBreak: 'break-word',
    borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {allKeys.map(k => (
            <th key={k} style={thSt}>{k.charAt(0).toUpperCase() + k.slice(1)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={idx}
            onMouseOver={e => (e.currentTarget.style.background = 'var(--nj-semantic-color-background-neutral-secondary-default)')}
            onMouseOut={e => (e.currentTarget.style.background = '')}
          >
            {allKeys.map(k => {
              const val = String(item[k] ?? '');
              if (k === 'source') {
                const refs = extractPageRefs(val);
                return (
                  <td key={k} style={tdSt}>
                    {refs.length > 0
                      ? <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {refs.map(ref => (
                            <NJLink key={ref} href="#" onClick={e => { e.preventDefault(); onOpenSrc(ref); }}>
                              {ref} ↗
                            </NJLink>
                          ))}
                        </span>
                      : <span style={{ fontStyle: 'italic', color: 'var(--nj-core-color-reference-neutral-300)' }}>
                          {isNotSpecified(val) ? '—' : val}
                        </span>
                    }
                  </td>
                );
              }
              return (
                <td key={k} style={tdSt}>
                  {isNotSpecified(val)
                    ? <span style={{ fontStyle: 'italic', color: 'var(--nj-core-color-reference-neutral-300)' }}>—</span>
                    : val}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Agent 1 view ─────────────────────────────────────────────────────────────

function Agent1View({ rows, onOpenSrc }: { rows: any[][]; onOpenSrc: (p: string) => void }) {
  const [headerRow, ...dataRows] = rows;
  const col0Label = String(headerRow?.[0] ?? 'Key Information');

  // Auto-expand all structured-data rows on mount
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const s = new Set<string>();
    dataRows.forEach((row, ri) => {
      if (parsePyList(String(row[1] ?? ''))) s.add(String(ri));
    });
    return s;
  });
  const toggle = (key: string) => setExpanded(p => {
    const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n;
  });

  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-400)', marginBottom: 12 }}>
        Showing {dataRows.length} rows
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <colgroup>
          <col style={{ width: '38%' }} />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th style={{
              textAlign: 'left', padding: '7px 12px',
              background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
              borderBottom: '2px solid var(--nj-semantic-color-border-neutral-minimal-default)',
              fontSize: 10, fontWeight: 700, color: 'var(--nj-core-color-reference-neutral-500)',
              letterSpacing: '.08em',
            }}>
              {col0Label.toUpperCase()}
            </th>
            <th style={{
              padding: '7px 12px',
              background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
              borderBottom: '2px solid var(--nj-semantic-color-border-neutral-minimal-default)',
            }} />
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, ri) => {
            const label = String(row[0] ?? '');
            const rawVal = String(row[1] ?? '').trim();
            const items = parsePyList(rawVal);
            const cellKey = String(ri);
            const isExp = expanded.has(cellKey);

            // Section header: no list value, col[1] empty or not a list
            if (!items) {
              if (rawVal && !isNotSpecified(rawVal)) {
                return (
                  <tr key={ri}>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', fontSize: 13, fontWeight: 500, verticalAlign: 'top' }}>
                      {label}
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', fontSize: 13 }}>
                      {rawVal}
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={ri}>
                  <td colSpan={2} style={{
                    padding: '7px 12px',
                    background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
                    borderTop: '2px solid var(--nj-semantic-color-border-neutral-minimal-default)',
                    borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
                    fontSize: 11, fontWeight: 700, letterSpacing: '.06em',
                    color: 'var(--nj-semantic-color-text-neutral-primary-default)',
                  }}>
                    {label}
                  </td>
                </tr>
              );
            }

            // Row with structured data
            return (
              <tr key={ri} style={{ verticalAlign: 'top' }}>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', fontSize: 13, fontWeight: 500 }}>
                  {label}
                </td>
                <td style={{ padding: '6px 12px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)' }}>
                  {items.length > 1 && (
                    <button
                      onClick={() => toggle(cellKey)}
                      style={{
                        background: 'var(--nj-core-color-reference-brand-500)',
                        border: 'none', cursor: 'pointer',
                        padding: '4px 12px', borderRadius: 4,
                        fontSize: 12, color: '#fff', fontWeight: 600,
                        marginBottom: 8, display: 'inline-block',
                      }}
                    >
                      {isExp ? '▼' : '▶'} View Details ({items.length} items)
                    </button>
                  )}
                  {(isExp || items.length <= 1) && <NestedTable items={items} onOpenSrc={onOpenSrc} />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Agent 2 view ─────────────────────────────────────────────────────────────

type A2ColDef = {
  key: string; label: string; width: number;
  expandable?: boolean; truncate?: number;
  isDoc?: boolean; isSafety?: boolean;
};

const A2_COLS: A2ColDef[] = [
  { key: 'short_title',               label: 'short_title',               width: 140 },
  { key: 'unique_identifier',          label: 'unique_identifier',          width: 72 },
  { key: 'type_of_requirement',        label: 'type_of_requirement',        width: 100 },
  { key: 'main_concerned_discipline',  label: 'main_concerned_discipline',  width: 95 },
  { key: 'client_requirement_text',    label: 'client_requirement_text',    width: 210, expandable: true, truncate: 80 },
  { key: 're_formulated_requirement',  label: 're_formulated_requirement',  width: 210, expandable: true, truncate: 80 },
  { key: 'attributes',                 label: 'attributes',                 width: 160, expandable: true, truncate: 55 },
  { key: 'safety_impact',              label: 'safety_impact',              width: 52,  isSafety: true },
  { key: 'section',                    label: 'section',                    width: 130 },
  { key: 'document_name',              label: 'document_name',              width: 170, isDoc: true },
];

function Agent2View({ rows, onOpenSrc }: { rows: any[][]; onOpenSrc: (p: string) => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggleCell = (key: string) => setExpanded(p => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n; });

  if (!rows || rows.length < 2) return (
    <div style={{ padding: 32, textAlign: 'center', color: 'var(--nj-core-color-reference-neutral-400)' }}>No data.</div>
  );

  const [header, ...dataRows] = rows;
  const colIdx: Record<string, number> = {};
  header.forEach((h: any, i: number) => { colIdx[String(h)] = i; });

  const cellBase: React.CSSProperties = {
    padding: '5px 8px',
    borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
    verticalAlign: 'top', fontSize: 11, lineHeight: 1.45,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-400)', marginBottom: 8, flexShrink: 0 }}>
        Showing {dataRows.length} rows
      </div>
      {/* Table container with both scrollbars — horizontal always accessible at bottom */}
      <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
        <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: A2_COLS.reduce((s, c) => s + c.width, 0) }}>
          <colgroup>
            {A2_COLS.map(c => <col key={c.key} style={{ width: c.width }} />)}
          </colgroup>
          <thead>
            <tr>
              {A2_COLS.map(col => (
                <th key={col.key} style={{
                  textAlign: 'left', padding: '7px 8px',
                  background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
                  borderBottom: '2px solid var(--nj-semantic-color-border-neutral-minimal-default)',
                  fontWeight: 700, fontSize: 10,
                  color: 'var(--nj-core-color-reference-neutral-500)',
                  letterSpacing: '.05em', whiteSpace: 'nowrap',
                  position: 'sticky', top: 0, zIndex: 1,
                }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row: any[], ri: number) => {
              const pageVal = String(row[colIdx['page']] ?? '').trim();
              const pageRef = pageVal ? `p.${pageVal}` : '';

              return (
                <tr key={ri}
                  onMouseOver={e => (e.currentTarget.style.background = 'var(--nj-semantic-color-background-neutral-secondary-default)')}
                  onMouseOut={e => (e.currentTarget.style.background = '')}
                >
                  {A2_COLS.map(col => {
                    const raw = row[colIdx[col.key]];
                    const val = raw !== null && raw !== undefined ? String(raw).trim() : '';
                    const cellKey = `${ri}-${col.key}`;
                    const isExp = expanded.has(cellKey);

                    if (col.isDoc) {
                      const display = val.length > 32 ? val.substring(0, 32) + '…' : val;
                      return (
                        <td key={col.key} style={{ ...cellBase }}>
                          {val && pageRef
                            ? <NJLink href="#" title={val} onClick={e => { e.preventDefault(); onOpenSrc(pageRef); }}>
                                {display} ↗
                              </NJLink>
                            : <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                                {display || '—'}
                              </span>
                          }
                        </td>
                      );
                    }

                    if (col.isSafety) return (
                      <td key={col.key} style={{ ...cellBase, textAlign: 'center', fontWeight: 700, fontSize: 10 }}>
                        {val === 'YES'
                          ? <span style={{ color: 'var(--nj-core-color-reference-status-danger-500)' }}>YES</span>
                          : val === 'NO'
                          ? <span style={{ color: 'var(--nj-core-color-reference-neutral-400)' }}>NO</span>
                          : <span style={{ color: 'var(--nj-core-color-reference-neutral-300)', fontStyle: 'italic' }}>—</span>
                        }
                      </td>
                    );

                    if (col.expandable && col.truncate && val.length > col.truncate) return (
                      <td key={col.key} style={{ ...cellBase }}>
                        <span style={{ wordBreak: 'break-word' }}>
                          {isExp ? val : val.substring(0, col.truncate) + '…'}
                        </span>
                        {' '}
                        <button onClick={() => toggleCell(cellKey)} style={{
                          background: 'none', border: 'none', padding: 0,
                          fontSize: 10, color: 'var(--nj-core-color-reference-brand-500)',
                          cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap',
                        }}>
                          {isExp ? 'Show less' : 'Show more'}
                        </button>
                      </td>
                    );

                    return (
                      <td key={col.key} style={{ ...cellBase, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {val || <span style={{ color: 'var(--nj-core-color-reference-neutral-300)', fontStyle: 'italic' }}>—</span>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function ResultsModal({ s, handlers }) {
  const { resultsAgent, resultsValidated } = s;
  const { closeRes, openSrc, rerun, updateDocs, validateAgent } = handlers;
  const [fullscreen, setFullscreen] = useState(false);

  const hasExcel = resultsAgent === 'a1' || resultsAgent === 'a2';
  const sheets = hasExcel ? AGENT_DATA[resultsAgent] ?? {} : {};
  const sheetNames = Object.keys(sheets);
  const [activeSheet, setActiveSheet] = useState('');
  const currentSheet = activeSheet || sheetNames[0] || '';
  const rows: any[][] = sheets[currentSheet] ?? [];

  const agentPlaceholder = (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--nj-core-color-reference-neutral-500)' }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--nj-semantic-color-text-neutral-primary-default)', marginBottom: 8 }}>Agent's results</div>
      <div style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 360, margin: '0 auto' }}>
        The extracted results for this agent are available in the downloaded Excel file.<br />
        Use the <strong>Download Excel</strong> button below to access the full output.
      </div>
    </div>
  );

  // For Agent 2: content area must not scroll vertically (inner div handles it)
  const isA2 = resultsAgent === 'a2';

  return (
    <div className="overlay" onClick={closeRes}>
      <div
        className="modal-box"
        style={fullscreen
          ? { maxWidth: 'calc(100vw - 40px)', width: 'calc(100vw - 40px)', maxHeight: 'calc(100vh - 40px)', height: 'calc(100vh - 40px)' }
          : {}}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{AGENT_TITLES[resultsAgent] || 'Agent Results'}</div>
            <div style={{ fontSize: 11, color: 'var(--nj-core-color-reference-neutral-500)', marginTop: 2 }}>
              agent{(resultsAgent || 'a1').slice(1)}_2026_03_23_152534.xlsx — Read-only
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <NJIconButton icon={fullscreen ? 'fullscreen_exit' : 'fullscreen'} aria-label={fullscreen ? 'Reduce' : 'Expand'} scale="sm" variant="secondary" onClick={() => setFullscreen(v => !v)} />
            <NJIconButton icon="close" aria-label="Close" scale="sm" variant="secondary" onClick={closeRes} />
          </div>
        </div>

        {/* Sheet tabs */}
        {hasExcel && sheetNames.length > 1 && (
          <div style={{ display: 'flex', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', padding: '0 20px', flexShrink: 0, overflowX: 'auto' }}>
            {sheetNames.map(name => (
              <button key={name} onClick={() => setActiveSheet(name)} style={{
                padding: '10px 16px', border: 'none',
                borderBottom: currentSheet === name ? '2px solid var(--nj-core-color-reference-brand-500)' : '2px solid transparent',
                background: 'none', cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap',
                fontWeight: currentSheet === name ? 700 : 400,
                color: currentSheet === name ? 'var(--nj-core-color-reference-brand-500)' : 'var(--nj-core-color-reference-neutral-500)',
                marginBottom: -1, transition: 'color .15s',
              }}>
                {name}
              </button>
            ))}
          </div>
        )}

        {/* Content — Agent 2 uses flex+overflow:hidden so inner div handles both scrollbars */}
        <div style={{
          flex: 1,
          overflowY: isA2 ? 'hidden' : 'auto',
          padding: '16px 20px',
          display: isA2 ? 'flex' : undefined,
          flexDirection: isA2 ? 'column' : undefined,
        }}>
          {!hasExcel ? agentPlaceholder
            : sheetNames.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--nj-core-color-reference-neutral-400)', fontSize: 13 }}>No data.</div>
            )
            : resultsAgent === 'a1' ? <Agent1View rows={rows} onOpenSrc={openSrc} />
            : resultsAgent === 'a2' ? <Agent2View rows={rows} onOpenSrc={openSrc} />
            : agentPlaceholder
          }
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="refresh" label="Re-run Agent" onClick={rerun} />
            <NJButton variant="primary" emphasis="subtle" scale="sm" icon="upload_file" label="Update Documents" onClick={updateDocs} />
            <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="download" label="Download Excel" />
          </div>
          {resultsValidated?.[resultsAgent] ? (
            <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="check_circle" label="Validated" disabled />
          ) : (
            <NJButton variant="primary" scale="sm" icon="check_circle" label="Validate Results"
              style={{ background: 'var(--nj-core-color-reference-status-success-500)', borderColor: 'var(--nj-core-color-reference-status-success-500)' }}
              onClick={() => { validateAgent(resultsAgent); closeRes(); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

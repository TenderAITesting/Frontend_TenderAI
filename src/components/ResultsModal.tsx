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

// ─── Structured-data parser (ported from TenderExcelPreviewModal) ─────────────

function _smartQuotes(str: string): string {
  let r = '', inStr = false, delim = '';
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (i > 0 && str[i - 1] === '\\') { r += c; continue; }
    if (c === "'" || c === '"') {
      if (!inStr) { inStr = true; delim = c; r += '"'; }
      else if (c === delim) { inStr = false; delim = ''; r += '"'; }
      else { r += c === '"' ? '\\"' : c; }
    } else { r += c; }
  }
  return r;
}

function _colonIdx(str: string): number {
  let inStr = false, sc = '';
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (i > 0 && str[i - 1] === '\\') continue;
    if ((c === '"' || c === "'") && !inStr) { inStr = true; sc = c; }
    else if (c === sc && inStr) { inStr = false; sc = ''; }
    if (c === ':' && !inStr) return i;
  }
  return -1;
}

function _splitKV(content: string): string[] {
  const pairs: string[] = [];
  let cur = '', inStr = false, sc = '';
  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    if (i > 0 && content[i - 1] === '\\') { cur += c; continue; }
    if ((c === '"' || c === "'") && !inStr) { inStr = true; sc = c; }
    else if (c === sc && inStr) { inStr = false; sc = ''; }
    if (c === ',' && !inStr) { pairs.push(cur.trim()); cur = ''; } else { cur += c; }
  }
  if (cur.trim()) pairs.push(cur.trim());
  return pairs;
}

function _parseObj(s: string): any | null {
  if (!s.startsWith('{') || !s.endsWith('}')) return null;
  const obj: any = {};
  for (const pair of _splitKV(s.slice(1, -1).trim())) {
    const ci = _colonIdx(pair);
    if (ci === -1) continue;
    const k = pair.slice(0, ci).trim().replace(/^['"]|['"]$/g, '');
    const v = pair.slice(ci + 1).trim().replace(/^['"]|['"]$/g, '');
    obj[k] = v;
  }
  return Object.keys(obj).length > 0 ? obj : null;
}

function _splitObjs(content: string): string[] {
  const objs: string[] = [];
  let cur = '', depth = 0, inStr = false, sc = '';
  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    if (i > 0 && content[i - 1] === '\\') { cur += c; continue; }
    if ((c === '"' || c === "'") && !inStr) { inStr = true; sc = c; }
    else if (c === sc && inStr) { inStr = false; sc = ''; }
    if (!inStr) { if (c === '{') depth++; else if (c === '}') depth--; }
    cur += c;
    if (depth === 0 && c === '}' && !inStr) {
      objs.push(cur.trim()); cur = '';
      while (i + 1 < content.length && (content[i + 1] === ',' || /\s/.test(content[i + 1]))) i++;
    }
  }
  return objs;
}

function parseStructuredData(cellValue: any): any[] | null {
  if (!cellValue || typeof cellValue !== 'string') return null;
  const s = cellValue.trim();
  if (!s.startsWith('[')) return null;
  try { const p = JSON.parse(s); if (Array.isArray(p) && p.length > 0) return p; } catch {}
  try {
    const m = s.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (m) {
      const p = JSON.parse(_smartQuotes(m[0].replace(/\n/g, ' ').replace(/\s+/g, ' ')));
      if (Array.isArray(p) && p.length > 0) return p;
    }
  } catch {}
  try {
    const m = s.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (m) {
      const objs = _splitObjs(m[0].slice(1, -1).trim()).map(o => _parseObj(o)).filter(Boolean);
      if (objs.length > 0) return objs;
    }
  } catch {}
  return null;
}


// ─── Page-ref link helper ─────────────────────────────────────────────────────

function renderWithPageRefs(text: string, onOpenSrc: (p: string) => void): React.ReactNode {
  const parts = text.split(/(p\.\s*\d+)/g);
  if (parts.length === 1) return <span style={{ wordBreak: 'break-word' }}>{text}</span>;
  return (
    <span style={{ wordBreak: 'break-word' }}>
      {parts.map((part, i) =>
        /^p\.\s*\d+$/.test(part)
          ? <NJLink key={i} href="#" onClick={e => { e.preventDefault(); onOpenSrc(part.replace(/\s+/, '')); }}>{part.replace(/\s+/, '')} ↗</NJLink>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

// ─── Agent 1 — generic multi-column table (ported from TenderExcelPreviewModal) ─

function A1NestedTable({ items, onOpenSrc }: { items: any[]; onOpenSrc: (p: string) => void }) {
  const isPrimitive = items.length === 0 || typeof items[0] !== 'object' || items[0] === null;
  if (isPrimitive) {
    return (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {items.map((item, i) => (
          <li key={i} style={{ fontSize: 12, padding: '2px 0', lineHeight: 1.5 }}>{String(item)}</li>
        ))}
      </ul>
    );
  }
  const keys = [...new Set(items.flatMap(it => Object.keys(it)))];
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
      <thead><tr>{keys.map(k => <th key={k} style={thSt}>{k.charAt(0).toUpperCase() + k.slice(1)}</th>)}</tr></thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={i}>
            {keys.map(k => {
              const v = Array.isArray(item[k]) ? item[k].join(', ') : String(item[k] ?? '');
              return (
                <td key={k} style={tdSt}>
                  {/p\.\s*\d+/.test(v) ? renderWithPageRefs(v, onOpenSrc) : (v || '—')}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function A1Cell({ cell, cellKey, expanded, toggle, onOpenSrc }: {
  cell: any; cellKey: string; expanded: Set<string>;
  toggle: (k: string) => void; onOpenSrc: (p: string) => void;
}) {
  const val = cell !== null && cell !== undefined ? String(cell) : '';
  if (!val) return <span style={{ color: 'var(--nj-core-color-reference-neutral-300)', fontStyle: 'italic' }}>—</span>;

  const structured = parseStructuredData(val);
  if (structured) {
    const isExp = expanded.has(cellKey);
    return (
      <div>
        {structured.length > 1 && (
          <button onClick={() => toggle(cellKey)} style={{
            background: 'var(--nj-core-color-reference-brand-500)', border: 'none', cursor: 'pointer',
            padding: '3px 10px', borderRadius: 4, fontSize: 11, color: '#fff', fontWeight: 600,
            marginBottom: 6, display: 'inline-block',
          }}>
            {isExp ? '▼' : '▶'} View Details ({structured.length})
          </button>
        )}
        {(isExp || structured.length <= 1) && <A1NestedTable items={structured} onOpenSrc={onOpenSrc} />}
      </div>
    );
  }

  if (val.length > 120) {
    const isExp = expanded.has(cellKey);
    const displayVal = isExp ? val : val.substring(0, 120) + '…';
    return (
      <div>
        {renderWithPageRefs(displayVal, onOpenSrc)}
        {' '}
        <button onClick={() => toggle(cellKey)} style={{
          background: 'none', border: 'none', padding: 0,
          fontSize: 11, color: 'var(--nj-core-color-reference-brand-500)',
          cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap',
        }}>
          {isExp ? 'Show less' : 'Show more'}
        </button>
      </div>
    );
  }

  return renderWithPageRefs(val, onOpenSrc);
}

function Agent1View({ rows, onOpenSrc }: { rows: any[][]; onOpenSrc: (p: string) => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const s = new Set<string>();
    rows.forEach((row, ri) => {
      if (ri === 0) return;
      row.forEach((cell, ci) => {
        if (parseStructuredData(String(cell ?? ''))) s.add(`${ri}-${ci}`);
      });
    });
    return s;
  });
  const toggle = (key: string) => setExpanded(p => {
    const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n;
  });

  if (!rows || rows.length < 2) return (
    <div style={{ padding: 32, textAlign: 'center', color: 'var(--nj-core-color-reference-neutral-400)' }}>No data.</div>
  );

  const [headerRow, ...dataRows] = rows;
  const pageColIdx = headerRow.findIndex((h: any) => String(h).toLowerCase().trim() === 'page');

  const thSt: React.CSSProperties = {
    textAlign: 'left', padding: '7px 10px',
    background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
    borderBottom: '2px solid var(--nj-semantic-color-border-neutral-minimal-default)',
    fontSize: 10, fontWeight: 700, color: 'var(--nj-core-color-reference-neutral-500)',
    letterSpacing: '.07em', whiteSpace: 'nowrap',
    position: 'sticky', top: 0, zIndex: 1,
  };

  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-400)', marginBottom: 8 }}>
        Showing {dataRows.length} rows
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headerRow.map((h: any, i: number) => (
              <th key={i} style={thSt}>{String(h ?? '').toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row: any[], ri: number) => (
            <tr key={ri}
              onMouseOver={e => (e.currentTarget.style.background = 'var(--nj-semantic-color-background-neutral-secondary-default)')}
              onMouseOut={e => (e.currentTarget.style.background = '')}
            >
              {row.map((cell: any, ci: number) => {
                const cellKey = `${ri + 1}-${ci}`;
                const val = cell !== null && cell !== undefined ? String(cell).trim() : '';
                const isPageCol = pageColIdx !== -1 && ci === pageColIdx;
                return (
                  <td key={ci} style={{
                    padding: '8px 10px', verticalAlign: 'top', fontSize: 13,
                    borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
                  }}>
                    {isPageCol
                      ? val
                        ? <NJLink href="#" onClick={e => { e.preventDefault(); onOpenSrc(`p.${val}`); }}>p.{val} ↗</NJLink>
                        : <span style={{ color: 'var(--nj-core-color-reference-neutral-300)', fontStyle: 'italic' }}>—</span>
                      : <A1Cell cell={cell} cellKey={cellKey} expanded={expanded} toggle={toggle} onOpenSrc={onOpenSrc} />
                    }
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Agent 2 view ─────────────────────────────────────────────────────────────

function Agent2View({ rows, onOpenSrc }: { rows: any[][]; onOpenSrc: (p: string) => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (key: string) => setExpanded(p => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n; });

  if (!rows || rows.length < 2) return (
    <div style={{ padding: 32, textAlign: 'center', color: 'var(--nj-core-color-reference-neutral-400)' }}>No data.</div>
  );

  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map((h: any) => String(h ?? '').trim());
  const pageColIdx = headers.findIndex(h => h.toLowerCase() === 'page');
  const docColIdx  = headers.findIndex(h => h.toLowerCase() === 'document_name');

  const thSt: React.CSSProperties = {
    textAlign: 'left', padding: '7px 8px',
    background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
    borderBottom: '2px solid var(--nj-semantic-color-border-neutral-minimal-default)',
    fontWeight: 700, fontSize: 10, color: 'var(--nj-core-color-reference-neutral-500)',
    letterSpacing: '.05em', whiteSpace: 'nowrap',
    position: 'sticky', top: 0, zIndex: 1,
  };
  const cellBase: React.CSSProperties = {
    padding: '5px 8px',
    borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
    verticalAlign: 'top', fontSize: 11, lineHeight: 1.45,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-400)', marginBottom: 8, flexShrink: 0 }}>
        Showing {dataRows.length} rows
      </div>
      <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1, minHeight: 0 }}>
        <table style={{ borderCollapse: 'collapse', tableLayout: 'auto' }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={thSt}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row: any[], ri: number) => {

              return (
                <tr key={ri}
                  onMouseOver={e => (e.currentTarget.style.background = 'var(--nj-semantic-color-background-neutral-secondary-default)')}
                  onMouseOut={e => (e.currentTarget.style.background = '')}
                >
                  {row.map((cell: any, ci: number) => {
                    const val = cell !== null && cell !== undefined ? String(cell).trim() : '';
                    const cellKey = `${ri}-${ci}`;
                    const colName = headers[ci]?.toLowerCase() ?? '';

                    // Colonne page → lien cliquable
                    if (ci === pageColIdx) return (
                      <td key={ci} style={{ ...cellBase }}>
                        {val
                          ? <NJLink href="#" onClick={e => { e.preventDefault(); onOpenSrc(`p.${val}`); }}>p.{val} ↗</NJLink>
                          : <span style={{ color: 'var(--nj-core-color-reference-neutral-300)', fontStyle: 'italic' }}>—</span>}
                      </td>
                    );

                    // Colonne document_name → texte seul
                    if (ci === docColIdx) {
                      const display = val.length > 32 ? val.substring(0, 32) + '…' : val;
                      return (
                        <td key={ci} style={{ ...cellBase }}>
                          <span style={{ wordBreak: 'break-word' }} title={val}>{display || '—'}</span>
                        </td>
                      );
                    }

                    // Colonne safety_impact → YES/NO coloré
                    if (colName === 'safety_impact') return (
                      <td key={ci} style={{ ...cellBase, textAlign: 'center', fontWeight: 700, fontSize: 10 }}>
                        {val === 'YES'
                          ? <span style={{ color: 'var(--nj-core-color-reference-status-danger-500)' }}>YES</span>
                          : val === 'NO'
                          ? <span style={{ color: 'var(--nj-core-color-reference-neutral-400)' }}>NO</span>
                          : <span style={{ color: 'var(--nj-core-color-reference-neutral-300)', fontStyle: 'italic' }}>—</span>}
                      </td>
                    );

                    // Toutes les autres colonnes → A1Cell (texte long, données structurées, refs)
                    return (
                      <td key={ci} style={{ ...cellBase }}>
                        <A1Cell cell={cell} cellKey={cellKey} expanded={expanded} toggle={toggle} onOpenSrc={onOpenSrc} />
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
  const allSheetNames = Object.keys(sheets);
  const sheetNames = resultsAgent === 'a1'
    ? allSheetNames.filter(n => !n.toLowerCase().includes('post'))
    : allSheetNames;
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

        {/* Content */}
        <div style={{
          flex: 1,
          minHeight: 0,
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

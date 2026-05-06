import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { NJButton, NJLink } from '@engie-group/fluid-design-system-react';
import agent1Data from '../data/Agent1.xlsx';
import agent2Data from '../data/Agent2.xlsx';
import { A3_STATIC_DATA } from '../data/constants';
import { httpClient } from '../../libs/http-client';

// ─── Static fallback data ─────────────────────────────────────────────────────

const AGENT_DATA: Record<string, Record<string, any[][]>> = { a1: agent1Data, a2: agent2Data, a3: A3_STATIC_DATA };
const AGENT_TITLES: Record<string, string> = {
  a1: 'Tender Key Information',
  a2: 'Technical Requirements — Results',
  a3: 'Project Risks — Results',
};

// Maps the FE agent id (a1/a2) used by the modal to the backend agent name
// expected by GET /tenders/agent_output/{tender_id}?agent=...
const FE_AGENT_TO_BE: Record<string, string> = { a1: 'agent_1', a2: 'agent_2' };

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

// ─── Structured-data parser helpers ──────────────────────────────────────────

function smartQuoteReplacement(str: string): string {
  let result = '', inString = false, stringDelimiter = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (i > 0 && str[i - 1] === '\\') { result += char; continue; }
    if (char === "'" || char === '"') {
      if (!inString) { inString = true; stringDelimiter = char; result += '"'; }
      else if (char === stringDelimiter) { inString = false; stringDelimiter = ''; result += '"'; }
      else { result += char === '"' ? '\\"' : char; }
    } else { result += char; }
  }
  return result;
}

function findColonIndex(str: string): number {
  let inString = false, stringChar = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (i > 0 && str[i - 1] === '\\') continue;
    if ((char === '"' || char === "'") && !inString) { inString = true; stringChar = char; }
    else if (char === stringChar && inString) { inString = false; stringChar = ''; }
    if (char === ':' && !inString) return i;
  }
  return -1;
}

function splitKeyValuePairs(content: string): string[] {
  const pairs: string[] = [];
  let currentPair = '', inString = false, stringChar = '';
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (i > 0 && content[i - 1] === '\\') { currentPair += char; continue; }
    if ((char === '"' || char === "'") && !inString) { inString = true; stringChar = char; }
    else if (char === stringChar && inString) { inString = false; stringChar = ''; }
    if (char === ',' && !inString) { pairs.push(currentPair.trim()); currentPair = ''; } else { currentPair += char; }
  }
  if (currentPair.trim()) pairs.push(currentPair.trim());
  return pairs;
}

function parseObject(objStr: string): any | null {
  if (!objStr.startsWith('{') || !objStr.endsWith('}')) return null;
  const obj: any = {};
  for (const pair of splitKeyValuePairs(objStr.slice(1, -1).trim())) {
    const colonIndex = findColonIndex(pair);
    if (colonIndex === -1) continue;
    const key = pair.slice(0, colonIndex).trim().replace(/^['"]|['"]$/g, '');
    const value = pair.slice(colonIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    obj[key] = value;
  }
  return Object.keys(obj).length > 0 ? obj : null;
}

function splitObjects(content: string): string[] {
  const objects: string[] = [];
  let currentObject = '', braceCount = 0, inString = false, stringChar = '';
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (i > 0 && content[i - 1] === '\\') { currentObject += char; continue; }
    if ((char === '"' || char === "'") && !inString) { inString = true; stringChar = char; }
    else if (char === stringChar && inString) { inString = false; stringChar = ''; }
    if (!inString) { if (char === '{') braceCount++; else if (char === '}') braceCount--; }
    currentObject += char;
    if (braceCount === 0 && char === '}' && !inString) {
      objects.push(currentObject.trim()); currentObject = '';
      while (i + 1 < content.length && (content[i + 1] === ',' || /\s/.test(content[i + 1]))) i++;
    }
  }
  return objects;
}

function manualParseStructuredData(cellValue: string): any[] | null {
  const arrayMatch = cellValue.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (!arrayMatch) return null;
  const objects = splitObjects(arrayMatch[0].slice(1, -1).trim())
    .map(o => parseObject(o.trim()))
    .filter(Boolean);
  return objects.length > 0 ? objects : null;
}

function parseStructuredData(cellValue: any): any[] | null {
  if (!cellValue || typeof cellValue !== 'string') return null;
  const s = cellValue.trim();
  if (!s.startsWith('[')) return null;

  try {
    const parsed = JSON.parse(s);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}

  try {
    const arrayMatch = s.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
      const cleanedString = smartQuoteReplacement(
        arrayMatch[0].replace(/\n/g, ' ').replace(/\s+/g, ' ')
      );
      const parsed = JSON.parse(cleanedString);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  try {
    const manualParsed = manualParseStructuredData(s);
    if (manualParsed && manualParsed.length > 0) return manualParsed;
  } catch (e) {
    console.log('Could not parse structured data:', e);
  }

  return null;
}

// ─── Page-ref link helper ─────────────────────────────────────────────────────

function renderWithPageRefs(text: string, openSrc: (p: string) => void): React.ReactNode {
  const parts = text.split(/(p\.\s*\d+)/g);
  if (parts.length === 1) return <span style={{ wordBreak: 'break-word' }}>{text}</span>;
  return (
    <span style={{ wordBreak: 'break-word' }}>
      {parts.map((part, i) =>
        /^p\.\s*\d+$/.test(part)
          ? <NJLink key={i} href="#" onClick={e => { e.preventDefault(); openSrc(part.replace(/\s+/, '')); }}>{part.replace(/\s+/, '')} ↗</NJLink>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ResultsModal({ s, handlers }: ResultsModalProps) {
  const { resultsAgent, resultsValidated, file, responsibleName, tenderId, agentName } = s;
  const { onClose, onReRunAI, onUpdateDocs, onFeedback, onValidate, openSrc } = handlers;

  // ── UI state ──
  const [fullscreen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCells, setExpandedCells] = useState<{ [key: string]: boolean }>({});
  const [displayFileName, setDisplayFileName] = useState('');

  // ── Data state ──
  const [sheetData, setSheetData] = useState<any[][]>([]);
  const [originalSheetData, setOriginalSheetData] = useState<any[][]>([]);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState('');
  const [isCsvFile, setIsCsvFile] = useState(false);
  const [delimiter] = useState(',');
  const [encoding] = useState('UTF-8');

  // ── Load data when agent or file changes ──
  useEffect(() => {
    setIsEditing(false);
    setHasChanges(false);
    setError(null);

    if (file) {
      setDisplayFileName(file.name);
      const isCSV = file.type.includes('csv') || file.name.endsWith('.csv');
      setIsCsvFile(isCSV);
      loadFile(file, isCSV);
      return;
    }

    // Try fetching the latest agent output from the backend (DEBUG mode serves
    // fake xlsx blobs uploaded by scripts/seed_db.py).
    const beAgent = FE_AGENT_TO_BE[resultsAgent];
    if (tenderId && beAgent) {
      let cancelled = false;
      (async () => {
        try {
          setLoading(true);
          const resp = await httpClient.get<{
            xlsx_filename: string;
            xlsx_file: string; // base64
          }>(`/tenders/agent_output/${tenderId}?agent=${beAgent}`);
          if (cancelled) return;

          const bin = atob(resp.xlsx_file);
          const buf = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
          const wb = XLSX.read(buf, { type: 'array' });

          const sheets: Record<string, any[][]> = {};
          wb.SheetNames.forEach(n => {
            sheets[n] = XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: '' }) as any[][];
          });

          setIsCsvFile(false);
          setSheetNames(wb.SheetNames);
          const first = wb.SheetNames[0] || '';
          setActiveSheet(first);
          const data = normalizeRowLengths(sheets[first] ?? []);
          setSheetData(data);
          setOriginalSheetData(JSON.parse(JSON.stringify(data)));
          setDisplayFileName(resp.xlsx_filename);
          setLoading(false);
          setTimeout(() => autoExpandStructuredCells(data), 100);
          // Stash sheets for tab switching
          (AGENT_DATA as any)[`${resultsAgent}__be`] = sheets;
        } catch (e) {
          if (cancelled) return;
          console.warn('[ResultsModal] backend fetch failed, falling back to bundled data', e);
          setLoading(false);
          loadFromStatic();
        }
      })();
      return () => { cancelled = true; };
    }

    loadFromStatic();

    function loadFromStatic() {
      if (resultsAgent && AGENT_DATA[resultsAgent]) {
        const allSheets = AGENT_DATA[resultsAgent];
        let names = Object.keys(allSheets);
        if (resultsAgent === 'a1') names = names.filter(n => !n.toLowerCase().includes('post'));
        setIsCsvFile(false);
        setSheetNames(names);
        const first = names[0] || '';
        setActiveSheet(first);
        const data = normalizeRowLengths(allSheets[first] ?? []);
        setSheetData(data);
        setOriginalSheetData(JSON.parse(JSON.stringify(data)));
        setDisplayFileName(`agent${resultsAgent.slice(1)}_results.xlsx`);
        setTimeout(() => autoExpandStructuredCells(data), 100);
      }
    }
  }, [file, resultsAgent, tenderId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── File reading utilities ──

  const readFileAsArrayBuffer = (f: File): Promise<ArrayBuffer> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => e.target?.result ? resolve(e.target.result as ArrayBuffer) : reject(new Error('Failed to read file'));
      reader.onerror = error => reject(error);
      reader.readAsArrayBuffer(f);
    });

  const readFileAsText = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => e.target?.result ? resolve(e.target.result as string) : reject(new Error('Failed to read file'));
      reader.onerror = error => reject(error);
      reader.readAsText(f, encoding);
    });

  const parseCSV = (text: string, delim: string): any[][] => {
    const rows: string[] = text.split(/\r?\n/);
    let maxColumns = 0;

    for (let i = 0; i < rows.length; i++) {
      if (!rows[i].trim()) continue;
      let columnCount = 0, inQuote = false;
      for (let j = 0; j < rows[i].length; j++) {
        const char = rows[i][j];
        if (char === '"') {
          if (j + 1 < rows[i].length && rows[i][j + 1] === '"') j++;
          else inQuote = !inQuote;
        } else if (char === delim && !inQuote) columnCount++;
      }
      maxColumns = Math.max(maxColumns, columnCount + 1);
    }

    const data: any[][] = [];
    for (let i = 0; i < rows.length; i++) {
      if (!rows[i].trim()) continue;
      const row: any[] = [];
      let inQuote = false, currentValue = '';
      for (let j = 0; j < rows[i].length; j++) {
        const char = rows[i][j];
        if (char === '"') {
          if (j + 1 < rows[i].length && rows[i][j + 1] === '"') { currentValue += '"'; j++; }
          else inQuote = !inQuote;
        } else if (char === delim && !inQuote) {
          row.push(!isNaN(Number(currentValue)) && currentValue.trim() !== '' ? Number(currentValue) : currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      row.push(!isNaN(Number(currentValue)) && currentValue.trim() !== '' ? Number(currentValue) : currentValue);
      while (row.length < maxColumns) row.push('');
      data.push(row);
    }
    return data;
  };

  const normalizeRowLengths = (data: any[][]): any[][] => {
    if (!data || data.length === 0) return data;
    const maxLength = Math.max(...data.map(row => Array.isArray(row) ? row.length : 0));
    return data.map(row => {
      if (!Array.isArray(row)) return row;
      const normalizedRow = [...row];
      while (normalizedRow.length < maxLength) normalizedRow.push('');
      return normalizedRow;
    });
  };

  const autoExpandStructuredCells = (data: any[][]) => {
    const newExpandedCells: { [key: string]: boolean } = {};
    data.forEach((row, rowIndex) => {
      if (rowIndex === 0) return;
      row.forEach((cell, cellIndex) => {
        const cellValue = cell !== null && cell !== undefined ? String(cell) : '';
        if (parseStructuredData(cellValue)) newExpandedCells[`${rowIndex}-${cellIndex}`] = true;
      });
    });
    setExpandedCells(newExpandedCells);
  };

  const loadFile = async (f: File, isCSV: boolean) => {
    setLoading(true);
    setError(null);
    setExpandedCells({});
    try {
      if (isCSV) {
        const csvText = await readFileAsText(f);
        const data = normalizeRowLengths(parseCSV(csvText, delimiter));
        setSheetData(data);
        setOriginalSheetData(JSON.parse(JSON.stringify(data)));
        setSheetNames(['Data']);
        setActiveSheet('Data');
        setTimeout(() => autoExpandStructuredCells(data), 100);
      } else {
        const buffer = await readFileAsArrayBuffer(f);
        const workbook = XLSX.read(buffer, { type: 'array' });
        setSheetNames(workbook.SheetNames);
        if (workbook.SheetNames.length > 0) {
          setActiveSheet(workbook.SheetNames[0]);
          const data = normalizeRowLengths(
            XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1, defval: '', raw: false }) as any[][]
          );
          setSheetData(data);
          setOriginalSheetData(JSON.parse(JSON.stringify(data)));
          setTimeout(() => autoExpandStructuredCells(data), 100);
        }
      }
    } catch (err) {
      setError(`Error reading file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSheetChange = async (sheetName: string) => {
    if (isCsvFile) return;
    setActiveSheet(sheetName);
    setExpandedCells({});
    if (file) {
      setLoading(true);
      try {
        const buffer = await readFileAsArrayBuffer(file);
        const workbook = XLSX.read(buffer, { type: 'array' });
        const data = normalizeRowLengths(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '', raw: false }) as any[][]
        );
        setSheetData(data);
        setOriginalSheetData(JSON.parse(JSON.stringify(data)));
        setTimeout(() => autoExpandStructuredCells(data), 100);
      } catch (err) {
        setError(`Error changing sheets: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    } else if (resultsAgent && AGENT_DATA[resultsAgent]) {
      const data = normalizeRowLengths(AGENT_DATA[resultsAgent][sheetName] ?? []);
      setSheetData(data);
      setOriginalSheetData(JSON.parse(JSON.stringify(data)));
      setTimeout(() => autoExpandStructuredCells(data), 100);
    }
  };

  // ── Edit functions ──

  const handleCellEdit = (rowIndex: number, cellIndex: number, value: string) => {
    const newData = [...sheetData];
    if (!newData[rowIndex]) newData[rowIndex] = [];
    newData[rowIndex][cellIndex] = !isNaN(Number(value)) && value.trim() !== '' ? Number(value) : value;
    setSheetData(newData);
    setHasChanges(true);
  };

  const handleNestedDataEdit = (rowIndex: number, cellIndex: number, itemIndex: number, field: string, value: string | string[]) => {
    const newData = [...sheetData];
    try {
      const parsedData = parseStructuredData(newData[rowIndex][cellIndex]);
      if (parsedData && parsedData[itemIndex]) {
        parsedData[itemIndex][field] = value;
        newData[rowIndex][cellIndex] = JSON.stringify(parsedData);
        setSheetData(newData);
        setHasChanges(true);
      }
    } catch (e) { console.error('Error editing nested data:', e); }
  };

  const addNestedItem = (rowIndex: number, cellIndex: number) => {
    const newData = [...sheetData];
    try {
      const parsedData = parseStructuredData(newData[rowIndex][cellIndex]) || [];
      const newItem: any = {};
      if (parsedData.length > 0) Object.keys(parsedData[0]).forEach(key => { newItem[key] = Array.isArray(parsedData[0][key]) ? [] : ''; });
      parsedData.push(newItem);
      newData[rowIndex][cellIndex] = JSON.stringify(parsedData);
      setSheetData(newData);
      setHasChanges(true);
    } catch (e) { console.error('Error adding nested item:', e); }
  };

  const deleteNestedItem = (rowIndex: number, cellIndex: number, itemIndex: number) => {
    const newData = [...sheetData];
    try {
      const parsedData = parseStructuredData(newData[rowIndex][cellIndex]);
      if (parsedData && itemIndex < parsedData.length) {
        parsedData.splice(itemIndex, 1);
        newData[rowIndex][cellIndex] = JSON.stringify(parsedData);
        setSheetData(newData);
        setHasChanges(true);
      }
    } catch (e) { console.error('Error deleting nested item:', e); }
  };

  const addRow = () => {
    const columnCount = sheetData.length > 0 ? Math.max(...sheetData.map(row => row.length)) : 1;
    setSheetData([...sheetData, new Array(columnCount).fill('')]);
    setHasChanges(true);
  };

  const deleteRow = (rowIndex: number) => {
    setSheetData(sheetData.filter((_, index) => index !== rowIndex));
    setHasChanges(true);
    const newExpandedCells = { ...expandedCells };
    Object.keys(newExpandedCells).forEach(key => {
      const parts = key.split('-');
      if (parseInt(parts[0]) === rowIndex) delete newExpandedCells[key];
      else if (parseInt(parts[0]) > rowIndex) {
        newExpandedCells[`${parseInt(parts[0]) - 1}-${parts[1]}`] = newExpandedCells[key];
        delete newExpandedCells[key];
      }
    });
    setExpandedCells(newExpandedCells);
  };

  const addColumn = () => {
    setSheetData(sheetData.map(row => [...row, '']));
    setHasChanges(true);
  };

  const deleteColumn = (columnIndex: number) => {
    setSheetData(sheetData.map(row => Array.isArray(row) ? row.filter((_, index) => index !== columnIndex) : row));
    setHasChanges(true);
    const newExpandedCells = { ...expandedCells };
    Object.keys(newExpandedCells).forEach(key => {
      const parts = key.split('-');
      if (parseInt(parts[1]) === columnIndex) delete newExpandedCells[key];
      else if (parseInt(parts[1]) > columnIndex) {
        newExpandedCells[`${parts[0]}-${parseInt(parts[1]) - 1}`] = newExpandedCells[key];
        delete newExpandedCells[key];
      }
    });
    setExpandedCells(newExpandedCells);
  };

  const resetChanges = () => {
    setSheetData(JSON.parse(JSON.stringify(originalSheetData)));
    setHasChanges(false);
    setExpandedCells({});
    setIsEditing(true);
  };

  const toggleCellExpansion = (rowIndex: number, cellIndex: number) => {
    const key = `${rowIndex}-${cellIndex}`;
    setExpandedCells(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setOriginalSheetData(JSON.parse(JSON.stringify(sheetData)));
    setHasChanges(false);
  };

  // ── Download functions ──

  const saveAsExcel = async () => {
    try {
      const workbook = XLSX.utils.book_new();
      if (file && !isCsvFile) {
        const originalData = await readFileAsArrayBuffer(file);
        const originalWorkbook = XLSX.read(originalData, { type: 'array' });
        originalWorkbook.SheetNames.forEach(sheetName => {
          XLSX.utils.book_append_sheet(
            workbook,
            sheetName === activeSheet ? XLSX.utils.aoa_to_sheet(sheetData) : originalWorkbook.Sheets[sheetName],
            sheetName
          );
        });
      } else {
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(sheetData), activeSheet || 'Sheet1');
      }
      const now = new Date();
      const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, '').replace('T', '_');
      const baseName = tenderId && agentName ? `${tenderId}_${agentName}_${timestamp}` : (file?.name || displayFileName || 'results').replace(/\.[^/.]+$/, `_${timestamp}`);
      XLSX.writeFile(workbook, `${baseName}.xlsx`);
    } catch (e) {
      console.error('Error downloading Excel file:', e);
    }
  };

  const handleDownload = () => {
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReRunAI = () => {
    if (onReRunAI) onReRunAI();
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleValidate = () => {
    if (onValidate) onValidate(resultsAgent);
    onClose();
  };

  // ── Render helpers ──

  const renderEditableNestedTable = (data: any[], rowIndex: number, cellIndex: number) => {
    if (!Array.isArray(data) || data.length === 0) return null;
    const allKeys = [...new Set<string>(data.flatMap(item => Object.keys(item)))];
    const thSt: React.CSSProperties = {
      textAlign: 'left', padding: '4px 8px',
      background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
      borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
      fontSize: 10, fontWeight: 700, color: 'var(--nj-core-color-reference-neutral-500)', whiteSpace: 'nowrap',
    };
    const tdSt: React.CSSProperties = {
      padding: '5px 8px', verticalAlign: 'top', fontSize: 12, wordBreak: 'break-word',
      borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
    };
    return (
      <div>
        <div style={{ marginBottom: 4 }}>
          <button
            onClick={() => addNestedItem(rowIndex, cellIndex)}
            style={{ background: 'none', border: '1px solid var(--nj-core-color-reference-brand-500)', cursor: 'pointer', padding: '2px 8px', borderRadius: 4, fontSize: 11, color: 'var(--nj-core-color-reference-brand-500)', fontWeight: 600 }}
          >
            + Add Item
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thSt}>Actions</th>
              {allKeys.map(key => <th key={key} style={thSt}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td style={tdSt}>
                  <button
                    onClick={() => deleteNestedItem(rowIndex, cellIndex, idx)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nj-core-color-reference-status-danger-500)', fontSize: 14, fontWeight: 700, padding: '0 4px', lineHeight: 1 }}
                    title="Delete this item"
                  >×</button>
                </td>
                {allKeys.map(key => (
                  <td key={key} style={tdSt}>
                    {Array.isArray(item[key]) ? (
                      <div
                        contentEditable suppressContentEditableWarning
                        onBlur={e => {
                          const values = ((e.target as HTMLDivElement).textContent || '').split(',').map(v => v.trim()).filter(v => v);
                          handleNestedDataEdit(rowIndex, cellIndex, idx, key, values);
                        }}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLDivElement).blur(); } }}
                        style={{ minHeight: 20, outline: 'none' }}
                      >
                        {item[key].join(', ')}
                      </div>
                    ) : (
                      <div
                        contentEditable suppressContentEditableWarning
                        onBlur={e => handleNestedDataEdit(rowIndex, cellIndex, idx, key, (e.target as HTMLDivElement).textContent || '')}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLDivElement).blur(); } }}
                        style={{ minHeight: 20, outline: 'none' }}
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
  };

  const renderNestedTable = (data: any[], cellKey: string) => {
    if (!Array.isArray(data) || data.length === 0) return null;
    const allKeys = [...new Set<string>(data.flatMap(item => Object.keys(item)))];
    const thSt: React.CSSProperties = {
      textAlign: 'left', padding: '4px 8px',
      background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
      borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
      fontSize: 10, fontWeight: 700, color: 'var(--nj-core-color-reference-neutral-500)', whiteSpace: 'nowrap',
    };
    const tdSt: React.CSSProperties = {
      padding: '5px 8px', verticalAlign: 'top', fontSize: 12, wordBreak: 'break-word',
      borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)',
    };
    return (
      <table key={cellKey} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>{allKeys.map(key => <th key={key} style={thSt}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              {allKeys.map(key => {
                const v = Array.isArray(item[key]) ? item[key].join(', ') : String(item[key] ?? '');
                return <td key={key} style={tdSt}>{/p\.\s*\d+/.test(v) ? renderWithPageRefs(v, openSrc) : v || '—'}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderCellContent = (cell: any, rowIndex: number, cellIndex: number): React.ReactNode => {
    const cellValue = cell !== null && cell !== undefined ? String(cell) : '';

    if (rowIndex === 0) return cellValue;

    const headerRow = sheetData[0] || [];
    const header = (headerRow[cellIndex] ? String(headerRow[cellIndex]) : '').toLowerCase().trim();

    // Page column → clickable link
    if (header === 'page') {
      return cellValue
        ? <NJLink href="#" onClick={e => { e.preventDefault(); openSrc(`p.${cellValue}`); }}>p.{cellValue} ↗</NJLink>
        : <span style={{ color: 'var(--nj-core-color-reference-neutral-300)', fontStyle: 'italic' }}>—</span>;
    }

    // Safety impact column → colored YES / NO badge
    if (header === 'safety_impact') {
      return cellValue === 'YES'
        ? <span style={{ color: 'var(--nj-core-color-reference-status-danger-500)', fontWeight: 700, fontSize: 10 }}>YES</span>
        : cellValue === 'NO'
        ? <span style={{ color: 'var(--nj-core-color-reference-neutral-400)', fontWeight: 700, fontSize: 10 }}>NO</span>
        : <span style={{ color: 'var(--nj-core-color-reference-neutral-300)', fontStyle: 'italic' }}>—</span>;
    }

    // Risk score column → colored HIGH / MEDIUM / LOW badge
    if (header === 'risk_score') {
      const scoreStyles: Record<string, React.CSSProperties> = {
        HIGH:   { color: 'var(--nj-core-color-reference-status-danger-700)',  background: 'var(--nj-core-color-reference-status-danger-100)',  border: '1px solid var(--nj-core-color-reference-status-danger-200)'  },
        MEDIUM: { color: 'var(--nj-core-color-reference-status-warning-600)', background: 'var(--nj-core-color-reference-status-warning-100)', border: '1px solid var(--nj-core-color-reference-status-warning-300)' },
        LOW:    { color: 'var(--nj-core-color-reference-status-success-700)', background: 'var(--nj-core-color-reference-status-success-100)', border: '1px solid var(--nj-core-color-reference-status-success-300)' },
      };
      const st = scoreStyles[cellValue];
      return st
        ? <span style={{ fontWeight: 700, fontSize: 11, padding: '3px 10px', borderRadius: 12, whiteSpace: 'nowrap', ...st }}>{cellValue}</span>
        : <span style={{ color: 'var(--nj-core-color-reference-neutral-300)', fontStyle: 'italic' }}>—</span>;
    }

    const structuredData = parseStructuredData(cellValue);
    const cellKey = `${rowIndex}-${cellIndex}`;

    if (structuredData) {
      const isExpanded = expandedCells[cellKey];
      return (
        <div>
          {structuredData.length > 1 && (
            <button
              onClick={() => toggleCellExpansion(rowIndex, cellIndex)}
              style={{ background: 'var(--nj-core-color-reference-brand-500)', border: 'none', cursor: 'pointer', padding: '3px 10px', borderRadius: 4, fontSize: 11, color: '#fff', fontWeight: 600, marginBottom: 6, display: 'inline-block' }}
            >
              {isExpanded ? '▼' : '▶'} {isEditing ? 'Edit Details' : 'View Details'} ({structuredData.length} items)
            </button>
          )}
          {(isExpanded || structuredData.length <= 1) && (
            isEditing
              ? renderEditableNestedTable(structuredData, rowIndex, cellIndex)
              : renderNestedTable(structuredData, cellKey)
          )}
        </div>
      );
    }

    if (cellValue.length > 100) {
      const isExpanded = expandedCells[cellKey];
      const displayVal = isExpanded ? cellValue : `${cellValue.substring(0, 100)}...`;
      const toggleBtn = (
        <button
          onClick={() => toggleCellExpansion(rowIndex, cellIndex)}
          style={{ background: 'none', border: 'none', padding: 0, fontSize: 11, color: 'var(--nj-core-color-reference-brand-500)', cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap' }}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      );
      if (isEditing) {
        return (
          <div>
            <div
              contentEditable suppressContentEditableWarning
              onBlur={e => { const v = (e.target as HTMLDivElement).textContent || ''; if (v !== cellValue) handleCellEdit(rowIndex, cellIndex, v); }}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLDivElement).blur(); } }}
              style={{ minHeight: 20, outline: 'none', wordBreak: 'break-word', lineHeight: 1.5 }}
            >
              {displayVal}
            </div>
            {toggleBtn}
          </div>
        );
      }
      return (
        <div>
          <span style={{ wordBreak: 'break-word' }}>
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
          onBlur={e => { const v = (e.target as HTMLDivElement).textContent || ''; if (v !== cellValue) handleCellEdit(rowIndex, cellIndex, v); }}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLDivElement).blur(); } }}
          style={{ minHeight: 20, outline: 'none' }}
        >
          {cellValue}
        </div>
      );
    }

    return /p\.\s*\d+/.test(cellValue)
      ? renderWithPageRefs(cellValue, openSrc)
      : cellValue || <span style={{ color: 'var(--nj-core-color-reference-neutral-300)', fontStyle: 'italic' }}>—</span>;
  };

  // ── Shared styles ──
  const thSt: React.CSSProperties = {
    textAlign: 'left', padding: '7px 10px',
    background: 'var(--nj-semantic-color-background-neutral-secondary-default)',
    borderBottom: '2px solid var(--nj-semantic-color-border-neutral-minimal-default)',
    fontSize: 10, fontWeight: 700, color: 'var(--nj-core-color-reference-neutral-500)',
    letterSpacing: '.07em', whiteSpace: 'nowrap',
    position: 'sticky', top: 0, zIndex: 1,
  };
  const deleteCtrlSt: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--nj-core-color-reference-status-danger-500)',
    fontSize: 13, fontWeight: 700, padding: '0 2px', lineHeight: 1,
  };

  const hasExcel = resultsAgent === 'a1' || resultsAgent === 'a2' || resultsAgent === 'a3' || !!file;
  const hasData = sheetData.length > 0;
  const isResponsible = !responsibleName; // En l'absence d'auth, tout le monde peut éditer

  const agentPlaceholder = (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--nj-core-color-reference-neutral-500)' }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--nj-semantic-color-text-neutral-primary-default)', marginBottom: 8 }}>Agent's results</div>
      <div style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 360, margin: '0 auto' }}>
        The extracted results for this agent are available in the downloaded Excel file.<br />
        Use the <strong>Download Excel</strong> button below to access the full output.
      </div>
    </div>
  );

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal-box"
        style={fullscreen ? { maxWidth: 'calc(100vw - 40px)', width: 'calc(100vw - 40px)', maxHeight: 'calc(100vh - 40px)', height: 'calc(100vh - 40px)' } : {}}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              {AGENT_TITLES[resultsAgent] || 'Agent Results'}
              {isEditing && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--nj-core-color-reference-brand-500)', fontWeight: 400 }}>— Edit mode</span>}
              {hasChanges && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--nj-core-color-reference-status-warning-500)', fontWeight: 400 }}>— Unsaved changes</span>}
            </div>
            <div style={{ fontSize: 11, color: 'var(--nj-core-color-reference-neutral-500)', marginTop: 2 }}>
              {displayFileName || `agent${(resultsAgent || 'a1').slice(1)}_results.xlsx`}
              {!isEditing && ' — Read-only'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              aria-label="Close"
              onClick={onClose}
              style={{
                background: 'none', border: '1px solid var(--nj-semantic-color-border-neutral-subtle-default)',
                borderRadius: 6, width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 15, lineHeight: 1,
                color: 'var(--nj-semantic-color-text-neutral-primary-default)',
              }}
            >✕</button>
          </div>
        </div>

        {/* ── Sheet tabs ── */}
        {!isCsvFile && sheetNames.length > 1 && (
          <div style={{ display: 'flex', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', padding: '0 20px', flexShrink: 0, overflowX: 'auto' }}>
            {sheetNames.map(name => (
              <button key={name} onClick={() => handleSheetChange(name)} style={{
                padding: '10px 16px', border: 'none',
                borderBottom: activeSheet === name ? '2px solid var(--nj-core-color-reference-brand-500)' : '2px solid transparent',
                background: 'none', cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap',
                fontWeight: activeSheet === name ? 700 : 400,
                color: activeSheet === name ? 'var(--nj-core-color-reference-brand-500)' : 'var(--nj-core-color-reference-neutral-500)',
                marginBottom: -1, transition: 'color .15s',
              }}>
                {name}
              </button>
            ))}
          </div>
        )}

        {/* ── Content ── */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--nj-core-color-reference-neutral-400)' }}>Loading data…</div>
          ) : error ? (
            <div style={{ padding: 16, color: 'var(--nj-core-color-reference-status-danger-500)', fontSize: 13 }}>{error}</div>
          ) : !hasExcel ? agentPlaceholder
          : !hasData ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--nj-core-color-reference-neutral-400)', fontSize: 13 }}>No data.</div>
          ) : (
            <>
              <div style={{ fontSize: 12, color: 'var(--nj-core-color-reference-neutral-400)', marginBottom: 8, flexShrink: 0 }}>
                Showing {sheetData.length - 1} rows
                {hasChanges && <span style={{ marginLeft: 8, color: 'var(--nj-core-color-reference-status-warning-500)' }}>— Unsaved changes</span>}
              </div>
              <div style={{ overflowX: 'auto', flex: 1, minHeight: 0 }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    {/* Column-delete row (edit mode only) */}
                    {isEditing && isResponsible && sheetData.length > 0 && (
                      <tr>
                        <th style={{ padding: '2px 4px', background: 'var(--nj-semantic-color-background-neutral-secondary-default)' }}></th>
                        {(Array.isArray(sheetData[0]) ? sheetData[0] : Object.keys(sheetData[0])).map((_: any, ci: number) => (
                          <th key={ci} style={{ padding: '2px 4px', background: 'var(--nj-semantic-color-background-neutral-secondary-default)', textAlign: 'center' }}>
                            <button onClick={() => deleteColumn(ci)} style={deleteCtrlSt} title={`Delete column ${ci + 1}`}>×</button>
                          </th>
                        ))}
                      </tr>
                    )}
                    {/* Header row */}
                    <tr>
                      {isEditing && isResponsible && <th style={{ ...thSt, width: 28 }}></th>}
                      {(Array.isArray(sheetData[0]) ? sheetData[0] : Object.values(sheetData[0])).map((h: any, i: number) => (
                        <th key={i} style={thSt}>{String(h ?? '').toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sheetData.slice(1).map((row: any[], ri: number) => (
                      <tr key={ri}
                        onMouseOver={e => (e.currentTarget.style.background = 'var(--nj-semantic-color-background-neutral-secondary-default)')}
                        onMouseOut={e => (e.currentTarget.style.background = '')}
                      >
                        {/* Row-delete button (edit mode) */}
                        {isEditing && isResponsible && (
                          <td style={{ padding: '4px', borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', verticalAlign: 'top', textAlign: 'center' }}>
                            <button onClick={() => deleteRow(ri + 1)} style={deleteCtrlSt} title={`Delete row ${ri + 1}`}>×</button>
                          </td>
                        )}
                        {(Array.isArray(row) ? row : Object.values(row)).map((cell: any, ci: number) => (
                          <td key={ci} style={{ padding: '8px 10px', verticalAlign: 'top', fontSize: 13, borderBottom: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)' }}>
                            {renderCellContent(cell, ri + 1, ci)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add row / column buttons (edit mode) */}
              {isEditing && isResponsible && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexShrink: 0 }}>
                  <button onClick={addRow} style={{ background: 'none', border: '1px solid var(--nj-core-color-reference-brand-500)', borderRadius: 4, padding: '4px 12px', fontSize: 12, color: 'var(--nj-core-color-reference-brand-500)', cursor: 'pointer', fontWeight: 600 }}>+ Add Row</button>
                  <button onClick={addColumn} style={{ background: 'none', border: '1px solid var(--nj-core-color-reference-brand-500)', borderRadius: 4, padding: '4px 12px', fontSize: 12, color: 'var(--nj-core-color-reference-brand-500)', cursor: 'pointer', fontWeight: 600 }}>+ Add Column</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--nj-semantic-color-border-neutral-minimal-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', rowGap: 8 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {isResponsible && isEditing ? (
              <>
                <NJButton variant="primary" emphasis="subtle" scale="sm" icon="save" label="Save" onClick={handleSave} disabled={!hasChanges} />
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="undo" label="Reset" onClick={resetChanges} disabled={!hasChanges} />
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="close" label="Close Edit" onClick={handleEdit} />
              </>
            ) : isResponsible ? (
              <>
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="edit" label="Edit" onClick={handleEdit} />
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="download" label="Download Excel" onClick={saveAsExcel} />
                {file && <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="download" label="Download Original" onClick={handleDownload} />}
                {onFeedback && <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="thumb_up" label="Feedback" onClick={onFeedback} />}
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="refresh" label="Re-run Agent" onClick={handleReRunAI} />
                <NJButton variant="primary" emphasis="subtle" scale="sm" icon="upload_file" label="Update Documents" onClick={onUpdateDocs} />
              </>
            ) : (
              <>
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="download" label="Download Excel" onClick={file ? handleDownload : saveAsExcel} />
                {onFeedback && <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="thumb_up" label="Feedback" onClick={onFeedback} />}
                <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="close" label="Close" onClick={onClose} />
              </>
            )}
          </div>
          {resultsValidated?.[resultsAgent] ? (
            <NJButton variant="secondary" emphasis="subtle" scale="sm" icon="check_circle" label="Validated" disabled />
          ) : (
            isResponsible && (
              <NJButton variant="primary" scale="sm" icon="check_circle" label="Validate Results"
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

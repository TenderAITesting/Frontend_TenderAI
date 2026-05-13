import React, { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import { NJButton, NJLink } from '@engie-group/fluid-design-system-react';
import agent1Data from '../data/Agent1.xlsx';
import agent2Data from '../data/Agent2.xlsx';
import { A3_STATIC_DATA } from '../data/constants';
import styles from './ResultsModal.module.css';

// ─── Static fallback data ─────────────────────────────────────────────────────

const AGENT_DATA: Record<string, Record<string, any[][]>> = { a1: agent1Data, a2: agent2Data, a3: A3_STATIC_DATA };
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
  } catch {
    // both JSON and manual parse failed — return null to show raw cell value
  }

  return null;
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

// ─── ExcelJS helper ──────────────────────────────────────────────────────────

async function loadWorkbook(buffer: ArrayBuffer): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  return wb;
}

function worksheetToAoa(ws: ExcelJS.Worksheet): any[][] {
  const rows: any[][] = [];
  let maxCols = 0;
  ws.eachRow({ includeEmpty: false }, (row) => {
    const cells: any[] = [];
    row.eachCell({ includeEmpty: true }, (cell, colNum) => {
      cells[colNum - 1] = cell.text ?? '';
    });
    maxCols = Math.max(maxCols, cells.length);
    rows.push(cells);
  });
  return rows.map(r => { while (r.length < maxCols) r.push(''); return r; });
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ResultsModal({ s, handlers }: ResultsModalProps) {
  const { resultsAgent, resultsValidated, file, responsibleName, tenderId, agentName } = s;
  const { onClose, onReRunAI, onUpdateDocs, onFeedback, onValidate, openSrc } = handlers;

  // ── UI state ──
  const fullscreen = true;
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
  const delimiter = ',';
  const encoding = 'UTF-8';

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
    } else if (resultsAgent && AGENT_DATA[resultsAgent]) {
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
  }, [file, resultsAgent]); // eslint-disable-line react-hooks/exhaustive-deps

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
        const workbook = await loadWorkbook(buffer);
        const names = workbook.worksheets.map(ws => ws.name);
        setSheetNames(names);
        if (names.length > 0) {
          setActiveSheet(names[0]);
          const ws = workbook.getWorksheet(names[0]);
          const data = normalizeRowLengths(ws ? worksheetToAoa(ws) : []);
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
        const workbook = await loadWorkbook(buffer);
        const ws = workbook.getWorksheet(sheetName);
        const data = normalizeRowLengths(ws ? worksheetToAoa(ws) : []);
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
    } catch (e) { setError(`Failed to edit cell: ${e instanceof Error ? e.message : String(e)}`); }
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
    } catch (e) { setError(`Failed to add item: ${e instanceof Error ? e.message : String(e)}`); }
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
    } catch (e) { setError(`Failed to delete item: ${e instanceof Error ? e.message : String(e)}`); }
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
      const wb = new ExcelJS.Workbook();
      if (file && !isCsvFile) {
        const originalBuffer = await readFileAsArrayBuffer(file);
        const originalWb = await loadWorkbook(originalBuffer);
        originalWb.worksheets.forEach(originalWs => {
          const ws = wb.addWorksheet(originalWs.name);
          if (originalWs.name === activeSheet) {
            sheetData.forEach(row => ws.addRow(row));
          } else {
            originalWs.eachRow({ includeEmpty: false }, (row, rowNum) => {
              const newRow = ws.getRow(rowNum);
              row.eachCell({ includeEmpty: true }, (cell, colNum) => {
                newRow.getCell(colNum).value = cell.value;
              });
              newRow.commit();
            });
          }
        });
      } else {
        const ws = wb.addWorksheet(activeSheet || 'Sheet1');
        sheetData.forEach(row => ws.addRow(row));
      }
      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer as ArrayBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const now = new Date();
      const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, '').replace('T', '_');
      const baseName = tenderId && agentName
        ? `${tenderId}_${agentName}_${timestamp}`
        : (file?.name || displayFileName || 'results').replace(/\.[^/.]+$/, `_${timestamp}`);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(`Failed to download Excel: ${e instanceof Error ? e.message : String(e)}`);
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
    URL.revokeObjectURL(fileUrl);
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
    return (
      <div>
        <div className={styles["rm-nested-add-bar"]}>
          <button onClick={() => addNestedItem(rowIndex, cellIndex)} className={styles["rm-nested-add-btn"]}>
            + Add Item
          </button>
        </div>
        <table className={styles["rm-nested-table"]}>
          <thead>
            <tr>
              <th className={styles["rm-nested-th"]}>Actions</th>
              {allKeys.map(key => <th key={key} className={styles["rm-nested-th"]}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td className={styles["rm-nested-td"]}>
                  <button
                    onClick={() => deleteNestedItem(rowIndex, cellIndex, idx)}
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
                          const values = ((e.target as HTMLDivElement).textContent || '').split(',').map(v => v.trim()).filter(v => v);
                          handleNestedDataEdit(rowIndex, cellIndex, idx, key, values);
                        }}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLDivElement).blur(); } }}
                        className={styles["rm-editable-cell"]}
                      >
                        {item[key].join(', ')}
                      </div>
                    ) : (
                      <div
                        contentEditable suppressContentEditableWarning
                        onBlur={e => handleNestedDataEdit(rowIndex, cellIndex, idx, key, (e.target as HTMLDivElement).textContent || '')}
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
  };

  const renderNestedTable = (data: any[], cellKey: string) => {
    if (!Array.isArray(data) || data.length === 0) return null;
    const allKeys = [...new Set<string>(data.flatMap(item => Object.keys(item)))];
    return (
      <table key={cellKey} className={styles["rm-nested-table"]}>
        <thead>
          <tr>{allKeys.map(key => <th key={key} className={styles["rm-nested-th"]}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              {allKeys.map(key => {
                const v = Array.isArray(item[key]) ? item[key].join(', ') : String(item[key] ?? '');
                return <td key={key} className={styles["rm-nested-td"]}>{/p\.\s*\d+/.test(v) ? renderWithPageRefs(v, openSrc) : v || '—'}</td>;
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
        : <span className={styles["rm-cell-empty"]}>—</span>;
    }

    // Safety impact column → colored YES / NO badge
    if (header === 'safety_impact') {
      return cellValue === 'YES'
        ? <span className={styles["rm-badge-yes"]}>YES</span>
        : cellValue === 'NO'
        ? <span className={styles["rm-badge-no"]}>NO</span>
        : <span className={styles["rm-cell-empty"]}>—</span>;
    }

    // Risk score column → colored HIGH / MEDIUM / LOW badge
    if (header === 'risk_score') {
      const riskClass: Record<string, string> = {
        HIGH:   styles["rm-risk-high"],
        MEDIUM: styles["rm-risk-medium"],
        LOW:    styles["rm-risk-low"],
      };
      const rc = riskClass[cellValue];
      return rc
        ? <span className={`${styles["rm-risk-badge"]} ${rc}`}>{cellValue}</span>
        : <span className={styles["rm-cell-empty"]}>—</span>;
    }

    const structuredData = parseStructuredData(cellValue);
    const cellKey = `${rowIndex}-${cellIndex}`;

    if (structuredData) {
      const isExpanded = expandedCells[cellKey];
      return (
        <div>
          {structuredData.length > 1 && (
            <button onClick={() => toggleCellExpansion(rowIndex, cellIndex)} className={styles["rm-toggle-btn"]}>
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
        <button onClick={() => toggleCellExpansion(rowIndex, cellIndex)} className={styles["rm-show-more-btn"]}>
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
          onBlur={e => { const v = (e.target as HTMLDivElement).textContent || ''; if (v !== cellValue) handleCellEdit(rowIndex, cellIndex, v); }}
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

  const hasExcel = resultsAgent === 'a1' || resultsAgent === 'a2' || resultsAgent === 'a3' || !!file;
  const hasData = sheetData.length > 0;
  const isResponsible = !responsibleName; // En l'absence d'auth, tout le monde peut éditer

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
    <div className={styles["rm-overlay"]} onClick={onClose}>
      <div
        className={`${styles["rm-modal-box"]}${fullscreen ? ` ${styles["rm-modal-fullscreen"]}` : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className={styles["rm-header"]}>
          <div>
            <div className={styles["rm-header-title"]}>
              {AGENT_TITLES[resultsAgent] || 'Agent Results'}
              {isEditing && <span className={styles["rm-edit-badge"]}>— Edit mode</span>}
              {hasChanges && <span className={styles["rm-changes-badge"]}>— Unsaved changes</span>}
            </div>
            <div className={styles["rm-header-meta"]}>
              {displayFileName || `agent${(resultsAgent || 'a1').slice(1)}_results.xlsx`}
              {!isEditing && ' — Read-only'}
            </div>
          </div>
          <div className={styles["rm-header-actions"]}>
            <button aria-label="Close" onClick={onClose} className={styles["rm-close-btn"]}>✕</button>
          </div>
        </div>

        {/* ── Sheet tabs ── */}
        {!isCsvFile && sheetNames.length > 1 && (
          <div className={styles["rm-tabs"]}>
            {sheetNames.map(name => (
              <button
                key={name}
                onClick={() => handleSheetChange(name)}
                className={`${styles["rm-tab"]}${activeSheet === name ? ` ${styles["rm-tab-active"]}` : ''}`}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {/* ── Content ── */}
        <div className={styles["rm-content"]}>
          {loading ? (
            <div className={styles["rm-loading"]}>Loading data…</div>
          ) : error ? (
            <div className={styles["rm-error"]}>{error}</div>
          ) : !hasExcel ? agentPlaceholder
          : !hasData ? (
            <div className={styles["rm-no-data"]}>No data.</div>
          ) : (
            <>
              <div className={styles["rm-row-count"]}>
                Showing {sheetData.length - 1} rows
                {hasChanges && <span className={styles["rm-row-count-changes"]}>— Unsaved changes</span>}
              </div>
              <div className={styles["rm-table-scroll"]}>
                <table className={styles["rm-table"]}>
                  <thead>
                    {/* Column-delete row (edit mode only) */}
                    {isEditing && isResponsible && sheetData.length > 0 && (
                      <tr>
                        <th className={styles["rm-col-del-th"]}></th>
                        {(Array.isArray(sheetData[0]) ? sheetData[0] : Object.keys(sheetData[0])).map((_: any, ci: number) => (
                          <th key={ci} className={styles["rm-col-del-th-center"]}>
                            <button onClick={() => deleteColumn(ci)} className={styles["rm-delete-ctrl"]} title={`Delete column ${ci + 1}`}>×</button>
                          </th>
                        ))}
                      </tr>
                    )}
                    {/* Header row */}
                    <tr>
                      {isEditing && isResponsible && <th className={`${styles["rm-th"]} ${styles["rm-th-narrow"]}`}></th>}
                      {(Array.isArray(sheetData[0]) ? sheetData[0] : Object.values(sheetData[0])).map((h: any, i: number) => (
                        <th key={i} className={styles["rm-th"]}>{String(h ?? '').toUpperCase()}</th>
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
                          <td className={styles["rm-row-delete-td"]}>
                            <button onClick={() => deleteRow(ri + 1)} className={styles["rm-delete-ctrl"]} title={`Delete row ${ri + 1}`}>×</button>
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

              {/* Add row / column buttons (edit mode) */}
              {isEditing && isResponsible && (
                <div className={styles["rm-edit-actions"]}>
                  <button onClick={addRow} className={styles["rm-add-btn"]}>+ Add Row</button>
                  <button onClick={addColumn} className={styles["rm-add-btn"]}>+ Add Column</button>
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

import { useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import ExcelJS from 'exceljs';
import { parseStructuredData } from '../utils/parseResultsData';
import { A3_STATIC_DATA } from '../data/seed';
import agent1Data from '../data/Agent1.xlsx';
import agent2Data from '../data/Agent2.xlsx';

const AGENT_DATA: Record<string, Record<string, any[][]>> = {
  a1: agent1Data,
  a2: agent2Data,
  a3: A3_STATIC_DATA,
};

export const ENCODING = 'UTF-8';

export async function loadWorkbook(buffer: ArrayBuffer): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  return wb;
}

export function worksheetToAoa(ws: ExcelJS.Worksheet): any[][] {
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

export function normalizeRowLengths(data: any[][]): any[][] {
  if (!data || data.length === 0) return data;
  const maxLen = Math.max(...data.map(row => Array.isArray(row) ? row.length : 0));
  return data.map(row => {
    if (!Array.isArray(row)) return row;
    const r = [...row];
    while (r.length < maxLen) r.push('');
    return r;
  });
}

export function readFileAsArrayBuffer(f: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => e.target?.result ? resolve(e.target.result as ArrayBuffer) : reject(new Error('Failed to read file'));
    reader.onerror = err => reject(err);
    reader.readAsArrayBuffer(f);
  });
}

export function readFileAsText(f: File, encoding: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => e.target?.result ? resolve(e.target.result as string) : reject(new Error('Failed to read file'));
    reader.onerror = err => reject(err);
    reader.readAsText(f, encoding);
  });
}

const DELIMITER = ',';

export function parseCSV(text: string): any[][] {
  const rows = text.split(/\r?\n/);
  let maxCols = 0;
  for (const row of rows) {
    if (!row.trim()) continue;
    let count = 0, inQuote = false;
    for (let j = 0; j < row.length; j++) {
      const c = row[j];
      if (c === '"') { if (j + 1 < row.length && row[j + 1] === '"') j++; else inQuote = !inQuote; }
      else if (c === DELIMITER && !inQuote) count++;
    }
    maxCols = Math.max(maxCols, count + 1);
  }
  const data: any[][] = [];
  for (const row of rows) {
    if (!row.trim()) continue;
    const cells: any[] = [];
    let inQuote = false, cur = '';
    for (let j = 0; j < row.length; j++) {
      const c = row[j];
      if (c === '"') {
        if (j + 1 < row.length && row[j + 1] === '"') { cur += '"'; j++; }
        else inQuote = !inQuote;
      } else if (c === DELIMITER && !inQuote) {
        cells.push(!isNaN(Number(cur)) && cur.trim() !== '' ? Number(cur) : cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    cells.push(!isNaN(Number(cur)) && cur.trim() !== '' ? Number(cur) : cur);
    while (cells.length < maxCols) cells.push('');
    data.push(cells);
  }
  return data;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseExcelParserInput {
  resultsAgent: string;
  file?: File | null;
  isCsvFile: boolean;
  setSheetData: Dispatch<SetStateAction<any[][]>>;
  setOriginalSheetData: Dispatch<SetStateAction<any[][]>>;
  setSheetNames: Dispatch<SetStateAction<string[]>>;
  setActiveSheet: Dispatch<SetStateAction<string>>;
  setIsCsvFile: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setExpandedCells: Dispatch<SetStateAction<Record<string, boolean>>>;
  setDisplayFileName: Dispatch<SetStateAction<string>>;
  setHasChanges: Dispatch<SetStateAction<boolean>>;
}

export function useExcelParser({
  resultsAgent, file, isCsvFile,
  setSheetData, setOriginalSheetData, setSheetNames, setActiveSheet,
  setIsCsvFile, setLoading, setError, setExpandedCells, setDisplayFileName, setHasChanges,
}: UseExcelParserInput) {
  const autoExpand = (data: any[][]) => {
    const expanded: Record<string, boolean> = {};
    data.forEach((row, ri) => {
      if (ri === 0) return;
      row.forEach((cell, ci) => {
        const v = cell !== null && cell !== undefined ? String(cell) : '';
        if (parseStructuredData(v)) expanded[`${ri}-${ci}`] = true;
      });
    });
    setExpandedCells(expanded);
  };

  const loadFile = async (f: File, isCSV: boolean) => {
    setLoading(true);
    setError(null);
    setExpandedCells({});
    try {
      if (isCSV) {
        const text = await readFileAsText(f, ENCODING);
        const data = normalizeRowLengths(parseCSV(text));
        setSheetData(data);
        setOriginalSheetData(JSON.parse(JSON.stringify(data)));
        setSheetNames(['Data']);
        setActiveSheet('Data');
        setTimeout(() => autoExpand(data), 100);
      } else {
        const buffer = await readFileAsArrayBuffer(f);
        const wb = await loadWorkbook(buffer);
        const names = wb.worksheets.map(ws => ws.name);
        setSheetNames(names);
        if (names.length > 0) {
          setActiveSheet(names[0]);
          const ws = wb.getWorksheet(names[0]);
          const data = normalizeRowLengths(ws ? worksheetToAoa(ws) : []);
          setSheetData(data);
          setOriginalSheetData(JSON.parse(JSON.stringify(data)));
          setTimeout(() => autoExpand(data), 100);
        }
      }
    } catch (err) {
      setError(`Error reading file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError(null);
    setHasChanges(false);
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
      setTimeout(() => autoExpand(data), 100);
    }
  }, [file, resultsAgent]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSheetChange = async (sheetName: string) => {
    if (isCsvFile) return;
    setActiveSheet(sheetName);
    setExpandedCells({});
    if (file) {
      setLoading(true);
      try {
        const buffer = await readFileAsArrayBuffer(file);
        const wb = await loadWorkbook(buffer);
        const ws = wb.getWorksheet(sheetName);
        const data = normalizeRowLengths(ws ? worksheetToAoa(ws) : []);
        setSheetData(data);
        setOriginalSheetData(JSON.parse(JSON.stringify(data)));
        setTimeout(() => autoExpand(data), 100);
      } catch (err) {
        setError(`Error changing sheets: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    } else if (resultsAgent && AGENT_DATA[resultsAgent]) {
      const data = normalizeRowLengths(AGENT_DATA[resultsAgent][sheetName] ?? []);
      setSheetData(data);
      setOriginalSheetData(JSON.parse(JSON.stringify(data)));
      setTimeout(() => autoExpand(data), 100);
    }
  };

  return { handleSheetChange };
}

import type { Dispatch, SetStateAction } from 'react';
import { parseStructuredData } from '../utils/parseResultsData';

interface UseExcelEditorInput {
  sheetData: any[][];
  setSheetData: Dispatch<SetStateAction<any[][]>>;
  originalSheetData: any[][];
  setOriginalSheetData: Dispatch<SetStateAction<any[][]>>;
  setExpandedCells: Dispatch<SetStateAction<Record<string, boolean>>>;
  setHasChanges: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

export function useExcelEditor({
  sheetData, setSheetData,
  originalSheetData, setOriginalSheetData,
  setExpandedCells, setHasChanges, setError,
}: UseExcelEditorInput) {
  const handleCellEdit = (rowIndex: number, cellIndex: number, value: string) => {
    setSheetData(prev => {
      const data = [...prev];
      if (!data[rowIndex]) data[rowIndex] = [];
      data[rowIndex][cellIndex] = !isNaN(Number(value)) && value.trim() !== '' ? Number(value) : value;
      return data;
    });
    setHasChanges(true);
  };

  const handleNestedDataEdit = (rowIndex: number, cellIndex: number, itemIndex: number, field: string, value: string | string[]) => {
    setSheetData(prev => {
      const data = [...prev];
      try {
        const parsed = parseStructuredData(data[rowIndex][cellIndex]);
        if (parsed && parsed[itemIndex]) {
          parsed[itemIndex][field] = value;
          data[rowIndex][cellIndex] = JSON.stringify(parsed);
        }
      } catch (e) { setError(`Failed to edit cell: ${e instanceof Error ? e.message : String(e)}`); }
      return data;
    });
    setHasChanges(true);
  };

  const addNestedItem = (rowIndex: number, cellIndex: number) => {
    setSheetData(prev => {
      const data = [...prev];
      try {
        const parsed = parseStructuredData(data[rowIndex][cellIndex]) || [];
        const newItem: Record<string, any> = {};
        if (parsed.length > 0) Object.keys(parsed[0]).forEach(key => { newItem[key] = Array.isArray(parsed[0][key]) ? [] : ''; });
        parsed.push(newItem);
        data[rowIndex][cellIndex] = JSON.stringify(parsed);
      } catch (e) { setError(`Failed to add item: ${e instanceof Error ? e.message : String(e)}`); }
      return data;
    });
    setHasChanges(true);
  };

  const deleteNestedItem = (rowIndex: number, cellIndex: number, itemIndex: number) => {
    setSheetData(prev => {
      const data = [...prev];
      try {
        const parsed = parseStructuredData(data[rowIndex][cellIndex]);
        if (parsed && itemIndex < parsed.length) {
          parsed.splice(itemIndex, 1);
          data[rowIndex][cellIndex] = JSON.stringify(parsed);
        }
      } catch (e) { setError(`Failed to delete item: ${e instanceof Error ? e.message : String(e)}`); }
      return data;
    });
    setHasChanges(true);
  };

  const addRow = () => {
    setSheetData(prev => {
      const colCount = prev.length > 0 ? Math.max(...prev.map(r => r.length)) : 1;
      return [...prev, new Array(colCount).fill('')];
    });
    setHasChanges(true);
  };

  const deleteRow = (rowIndex: number) => {
    setSheetData(prev => prev.filter((_, i) => i !== rowIndex));
    setHasChanges(true);
    setExpandedCells(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        const [r, c] = key.split('-').map(Number);
        if (r === rowIndex) delete next[key];
        else if (r > rowIndex) { next[`${r - 1}-${c}`] = next[key]; delete next[key]; }
      });
      return next;
    });
  };

  const addColumn = () => {
    setSheetData(prev => prev.map(row => [...row, '']));
    setHasChanges(true);
  };

  const deleteColumn = (columnIndex: number) => {
    setSheetData(prev => prev.map(row => Array.isArray(row) ? row.filter((_, i) => i !== columnIndex) : row));
    setHasChanges(true);
    setExpandedCells(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        const [r, c] = key.split('-').map(Number);
        if (c === columnIndex) delete next[key];
        else if (c > columnIndex) { next[`${r}-${c - 1}`] = next[key]; delete next[key]; }
      });
      return next;
    });
  };

  const resetChanges = () => {
    setSheetData(JSON.parse(JSON.stringify(originalSheetData)));
    setHasChanges(false);
    setExpandedCells({});
  };

  const toggleCellExpansion = (rowIndex: number, cellIndex: number) => {
    const key = `${rowIndex}-${cellIndex}`;
    setExpandedCells(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setOriginalSheetData(JSON.parse(JSON.stringify(sheetData)));
    setHasChanges(false);
  };

  return {
    handleCellEdit, handleNestedDataEdit,
    addNestedItem, deleteNestedItem,
    addRow, deleteRow, addColumn, deleteColumn,
    resetChanges, toggleCellExpansion, handleSave,
  };
}

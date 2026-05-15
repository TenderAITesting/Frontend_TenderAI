import { useState } from 'react';
import { useExcelParser } from './useExcelParser';
import { useExcelEditor } from './useExcelEditor';
import { useExcelExporter } from './useExcelExporter';

export interface UseExcelDataParams {
  resultsAgent: string;
  file?: File | null;
  tenderId?: string;
  agentName?: string;
}

export function useExcelData({ resultsAgent, file, tenderId, agentName }: UseExcelDataParams) {
  const [sheetData, setSheetData] = useState<any[][]>([]);
  const [originalSheetData, setOriginalSheetData] = useState<any[][]>([]);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState('');
  const [isCsvFile, setIsCsvFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCells, setExpandedCells] = useState<Record<string, boolean>>({});
  const [displayFileName, setDisplayFileName] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const { handleSheetChange } = useExcelParser({
    resultsAgent, file, isCsvFile,
    setSheetData, setOriginalSheetData, setSheetNames, setActiveSheet,
    setIsCsvFile, setLoading, setError, setExpandedCells, setDisplayFileName, setHasChanges,
  });

  const editorHandlers = useExcelEditor({
    sheetData, setSheetData,
    originalSheetData, setOriginalSheetData,
    setExpandedCells, setHasChanges, setError,
  });

  const exporterHandlers = useExcelExporter({
    sheetData, activeSheet, isCsvFile, file, tenderId, agentName, displayFileName, setError,
  });

  return {
    sheetData, sheetNames, activeSheet, isCsvFile,
    loading, error, expandedCells, displayFileName, hasChanges,
    handleSheetChange,
    ...editorHandlers,
    ...exporterHandlers,
  };
}

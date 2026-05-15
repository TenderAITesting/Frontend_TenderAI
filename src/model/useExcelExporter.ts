import type { Dispatch, SetStateAction } from 'react';
import ExcelJS from 'exceljs';
import { loadWorkbook, readFileAsArrayBuffer } from './useExcelParser';

interface UseExcelExporterInput {
  sheetData: any[][];
  activeSheet: string;
  isCsvFile: boolean;
  file?: File | null;
  tenderId?: string;
  agentName?: string;
  displayFileName: string;
  setError: Dispatch<SetStateAction<string | null>>;
}

export function useExcelExporter({
  sheetData, activeSheet, isCsvFile, file, tenderId, agentName, displayFileName, setError,
}: UseExcelExporterInput) {
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
              row.eachCell({ includeEmpty: true }, (cell, colNum) => { newRow.getCell(colNum).value = cell.value; });
              newRow.commit();
            });
          }
        });
      } else {
        const ws = wb.addWorksheet(activeSheet || 'Sheet1');
        sheetData.forEach(row => ws.addRow(row));
      }
      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer as ArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const now = new Date();
      const ts = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, '').replace('T', '_');
      const baseName = tenderId && agentName
        ? `${tenderId}_${agentName}_${ts}`
        : (file?.name || displayFileName || 'results').replace(/\.[^/.]+$/, `_${ts}`);
      const a = document.createElement('a');
      a.href = url; a.download = `${baseName}.xlsx`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(`Failed to download Excel: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleDownload = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url; link.download = file.name;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return { saveAsExcel, handleDownload };
}

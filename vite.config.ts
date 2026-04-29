import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import ExcelJS from 'exceljs'

// Parse xlsx files at build time (Node.js) via ExcelJS and expose as JSON modules.
// ExcelJS handles both standard and legacy CFBF Excel formats.
function xlsxJsonPlugin() {
  return {
    name: 'vite-plugin-xlsx-json',
    enforce: 'pre' as const,
    resolveId(id: string, importer?: string) {
      if (!id.match(/\.xlsx?$/i)) return null;
      if (importer && !path.isAbsolute(id)) {
        return path.resolve(path.dirname(importer), id);
      }
      return id;
    },
    async load(id: string) {
      if (!id.match(/\.xlsx?$/i)) return null;

      const wb = new ExcelJS.Workbook();
      try {
        await wb.xlsx.readFile(id);
      } catch (e) {
        // File may be DRM/IRM encrypted — return empty workbook so the build succeeds.
        // To fix: open in Excel, remove IRM protection (File → Info → Restrict Access → No Restrictions),
        // then save as a plain .xlsx without password.
        console.warn(`[xlsx-plugin] Could not parse "${path.basename(id)}" (${e}). Returning empty data.`);
        return `export default {}`;
      }

      const result: Record<string, any[][]> = {};
      wb.eachSheet(ws => {
        const rows: any[][] = [];
        let maxCols = 0;

        ws.eachRow({ includeEmpty: false }, row => {
          const cells: any[] = [];
          row.eachCell({ includeEmpty: true }, (cell, colNum) => {
            cells[colNum - 1] = cell.text ?? '';
          });
          maxCols = Math.max(maxCols, cells.length);
          rows.push(cells);
        });

        // Normalize row lengths
        result[ws.name] = rows.map(r => {
          const row = [...r];
          while (row.length < maxCols) row.push('');
          return row;
        });
      });

      return `export default ${JSON.stringify(result)}`;
    },
  };
}

export default defineConfig({
  plugins: [react(), xlsxJsonPlugin()],
  resolve: {
    alias: {
      '@libs': path.resolve(__dirname, 'libs'),
      '@src': path.resolve(__dirname, 'src'),
    },
  },
})

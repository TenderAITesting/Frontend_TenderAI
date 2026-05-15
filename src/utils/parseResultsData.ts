// Structured-data parser for agent result cells (JSON arrays encoded as strings).
// All functions are pure — no React, no side effects.

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
  let cur = '', inString = false, stringChar = '';
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (i > 0 && content[i - 1] === '\\') { cur += char; continue; }
    if ((char === '"' || char === "'") && !inString) { inString = true; stringChar = char; }
    else if (char === stringChar && inString) { inString = false; stringChar = ''; }
    if (char === ',' && !inString) { pairs.push(cur.trim()); cur = ''; }
    else { cur += char; }
  }
  if (cur.trim()) pairs.push(cur.trim());
  return pairs;
}

function parseObject(objStr: string): Record<string, string> | null {
  if (!objStr.startsWith('{') || !objStr.endsWith('}')) return null;
  const obj: Record<string, string> = {};
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
  let cur = '', braceCount = 0, inString = false, stringChar = '';
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (i > 0 && content[i - 1] === '\\') { cur += char; continue; }
    if ((char === '"' || char === "'") && !inString) { inString = true; stringChar = char; }
    else if (char === stringChar && inString) { inString = false; stringChar = ''; }
    if (!inString) { if (char === '{') braceCount++; else if (char === '}') braceCount--; }
    cur += char;
    if (braceCount === 0 && char === '}' && !inString) {
      objects.push(cur.trim());
      cur = '';
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

/**
 * Parses a cell value that may be a JSON array of objects (possibly with non-standard quoting).
 * Returns the parsed array, or null if the cell is not structured data.
 */
export function parseStructuredData(cellValue: any): any[] | null {
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
      const cleaned = smartQuoteReplacement(arrayMatch[0].replace(/\n/g, ' ').replace(/\s+/g, ' '));
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  try {
    const manual = manualParseStructuredData(s);
    if (manual && manual.length > 0) return manual;
  } catch {}

  return null;
}

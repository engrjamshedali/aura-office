import { CellValue } from '../../types/office';

// Helper: Convert column letter to 0-based index e.g. "A" -> 0, "B" -> 1, "Z" -> 25, "AA" -> 26
export function colLetterToIndex(letters: string): number {
  let index = 0;
  const upper = letters.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    index = index * 26 + (upper.charCodeAt(i) - 64);
  }
  return index - 1;
}

// Helper: Convert 0-based index to column letter e.g. 0 -> "A", 25 -> "Z", 26 -> "AA"
export function indexToColLetter(index: number): string {
  let temp = index + 1;
  let col = '';
  while (temp > 0) {
    const rem = (temp - 1) % 26;
    col = String.fromCharCode(65 + rem) + col;
    temp = Math.floor((temp - 1) / 26);
  }
  return col;
}

// Parse "B5" into { col: 1, row: 4 }
export function parseCellAddress(addr: string): { col: number; row: number; valid: boolean } {
  const match = addr.trim().match(/^([A-Za-z]+)([0-9]+)$/);
  if (!match) return { col: -1, row: -1, valid: false };
  return {
    col: colLetterToIndex(match[1]),
    row: parseInt(match[2], 10) - 1,
    valid: true,
  };
}

// Expand "A1:B3" into ["A1", "A2", "A3", "B1", "B2", "B3"]
export function expandRange(rangeStr: string): string[] {
  const parts = rangeStr.split(':');
  if (parts.length === 1) return [parts[0].toUpperCase().trim()];
  const start = parseCellAddress(parts[0]);
  const end = parseCellAddress(parts[1]);
  if (!start.valid || !end.valid) return [];

  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);
  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);

  const result: string[] = [];
  for (let c = minCol; c <= maxCol; c++) {
    const colStr = indexToColLetter(c);
    for (let r = minRow; r <= maxRow; r++) {
      result.push(`${colStr}${r + 1}`);
    }
  }
  return result;
}

// Get the computed numeric or primitive value of a cell
export function getCellValue(cellKey: string, cells: Record<string, CellValue>, visiting: Set<string>): any {
  const upperKey = cellKey.toUpperCase().trim();
  if (visiting.has(upperKey)) {
    return '#CIRCULAR!';
  }

  const cell = cells[upperKey];
  if (!cell || cell.raw === undefined || cell.raw === '') return 0;

  const raw = String(cell.raw).trim();
  if (!raw.startsWith('=')) {
    const num = Number(raw);
    return isNaN(num) ? raw : num;
  }

  // It's a formula, evaluate recursively
  visiting.add(upperKey);
  const val = evaluateFormula(raw, cells, visiting);
  visiting.delete(upperKey);
  return val;
}

// Main formula evaluator
export function evaluateFormula(
  formulaStr: string,
  cells: Record<string, CellValue>,
  visiting: Set<string> = new Set()
): any {
  let clean = formulaStr.trim();
  if (clean.startsWith('=')) {
    clean = clean.substring(1).trim();
  }

  if (!clean) return '';

  try {
    return evaluateExpression(clean, cells, visiting);
  } catch (err: any) {
    return '#ERROR!';
  }
}

function evaluateExpression(expr: string, cells: Record<string, CellValue>, visiting: Set<string>): any {
  let s = expr.trim();

  // Check if expression is a function call like SUM(...) or IF(...)
  const fnMatch = s.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*\((.*)\)$/s);
  if (fnMatch) {
    const fnName = fnMatch[1].toUpperCase();
    const argString = fnMatch[2];
    const args = splitArgs(argString);
    return executeFunction(fnName, args, cells, visiting);
  }

  // Handle binary arithmetic operators +, -, *, /, ^ with precedence
  // Handle comparisons: >=, <=, <>, !=, =, >, <
  // First evaluate comparisons if at top level outside parentheses
  const compOp = findTopLevelOperator(s, ['>=', '<=', '<>', '!=', '=', '>', '<']);
  if (compOp) {
    const leftVal = evaluateExpression(s.substring(0, compOp.index), cells, visiting);
    const rightVal = evaluateExpression(s.substring(compOp.index + compOp.op.length), cells, visiting);
    switch (compOp.op) {
      case '>=': return leftVal >= rightVal;
      case '<=': return leftVal <= rightVal;
      case '<>':
      case '!=': return leftVal != rightVal;
      case '=': return leftVal == rightVal;
      case '>': return leftVal > rightVal;
      case '<': return leftVal < rightVal;
    }
  }

  // Addition & Subtraction (+, -)
  const addSubOp = findTopLevelOperator(s, ['+', '-']);
  if (addSubOp && addSubOp.index > 0) { // ensure not unary minus at index 0
    const leftVal = evaluateExpression(s.substring(0, addSubOp.index), cells, visiting);
    const rightVal = evaluateExpression(s.substring(addSubOp.index + 1), cells, visiting);
    const lNum = typeof leftVal === 'number' ? leftVal : Number(leftVal) || 0;
    const rNum = typeof rightVal === 'number' ? rightVal : Number(rightVal) || 0;
    return addSubOp.op === '+' ? lNum + rNum : lNum - rNum;
  }

  // Multiplication & Division (*, /)
  const mulDivOp = findTopLevelOperator(s, ['*', '/']);
  if (mulDivOp) {
    const leftVal = evaluateExpression(s.substring(0, mulDivOp.index), cells, visiting);
    const rightVal = evaluateExpression(s.substring(mulDivOp.index + 1), cells, visiting);
    const lNum = typeof leftVal === 'number' ? leftVal : Number(leftVal) || 0;
    const rNum = typeof rightVal === 'number' ? rightVal : Number(rightVal) || 0;
    if (mulDivOp.op === '/') {
      if (rNum === 0) return '#DIV/0!';
      return lNum / rNum;
    }
    return lNum * rNum;
  }

  // Exponentiation (^)
  const powOp = findTopLevelOperator(s, ['^']);
  if (powOp) {
    const leftVal = evaluateExpression(s.substring(0, powOp.index), cells, visiting);
    const rightVal = evaluateExpression(s.substring(powOp.index + 1), cells, visiting);
    return Math.pow(Number(leftVal) || 0, Number(rightVal) || 0);
  }

  // Quoted string literal e.g. "Pass"
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.substring(1, s.length - 1);
  }

  // Boolean literals
  if (s.toUpperCase() === 'TRUE') return true;
  if (s.toUpperCase() === 'FALSE') return false;

  // Number literal
  if (!isNaN(Number(s))) {
    return Number(s);
  }

  // Cell reference e.g. A1, B10
  const cellMatch = s.match(/^([A-Za-z]+[0-9]+)$/);
  if (cellMatch) {
    return getCellValue(s, cells, visiting);
  }

  return s;
}

function findTopLevelOperator(str: string, ops: string[]): { op: string; index: number } | null {
  let parenDepth = 0;
  let inQuotes = false;
  let quoteChar = '';

  for (let i = str.length - 1; i >= 0; i--) {
    const char = str[i];
    if (char === '"' || char === "'") {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
      }
      continue;
    }
    if (inQuotes) continue;

    if (char === ')') parenDepth++;
    else if (char === '(') parenDepth--;

    if (parenDepth === 0) {
      for (const op of ops) {
        if (str.substring(i, i + op.length) === op) {
          return { op, index: i };
        }
      }
    }
  }
  return null;
}

function splitArgs(argStr: string): string[] {
  const args: string[] = [];
  let current = '';
  let parenDepth = 0;
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < argStr.length; i++) {
    const char = argStr[i];
    if (char === '"' || char === "'") {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
      }
      current += char;
      continue;
    }
    if (inQuotes) {
      current += char;
      continue;
    }

    if (char === '(') parenDepth++;
    else if (char === ')') parenDepth--;

    if (char === ',' && parenDepth === 0) {
      args.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim().length > 0) {
    args.push(current.trim());
  }
  return args;
}

// Function implementations
function executeFunction(fnName: string, rawArgs: string[], cells: Record<string, CellValue>, visiting: Set<string>): any {
  // Helper to expand all items in args (including ranges like A1:A10)
  const getFlatValues = (args: string[]) => {
    const values: any[] = [];
    for (const arg of args) {
      if (arg.includes(':')) {
        const cellList = expandRange(arg);
        for (const cellKey of cellList) {
          values.push(getCellValue(cellKey, cells, visiting));
        }
      } else {
        values.push(evaluateExpression(arg, cells, visiting));
      }
    }
    return values;
  };

  const getNumericValues = (args: string[]) => {
    return getFlatValues(args)
      .map(v => typeof v === 'number' ? v : Number(v))
      .filter(v => !isNaN(v));
  };

  switch (fnName) {
    case 'SUM': {
      const nums = getNumericValues(rawArgs);
      return nums.reduce((acc, curr) => acc + curr, 0);
    }
    case 'AVERAGE': {
      const nums = getNumericValues(rawArgs);
      if (nums.length === 0) return 0;
      return nums.reduce((acc, curr) => acc + curr, 0) / nums.length;
    }
    case 'MIN': {
      const nums = getNumericValues(rawArgs);
      if (nums.length === 0) return 0;
      return Math.min(...nums);
    }
    case 'MAX': {
      const nums = getNumericValues(rawArgs);
      if (nums.length === 0) return 0;
      return Math.max(...nums);
    }
    case 'COUNT': {
      const nums = getNumericValues(rawArgs);
      return nums.length;
    }
    case 'COUNTA': {
      const vals = getFlatValues(rawArgs);
      return vals.filter(v => v !== undefined && v !== null && v !== '').length;
    }
    case 'IF': {
      if (rawArgs.length < 2) return '#N/A';
      const condition = evaluateExpression(rawArgs[0], cells, visiting);
      const isTruthy = condition === true || (typeof condition === 'number' && condition !== 0) || (typeof condition === 'string' && condition !== '' && condition !== '0');
      if (isTruthy) {
        return evaluateExpression(rawArgs[1], cells, visiting);
      } else {
        return rawArgs[2] ? evaluateExpression(rawArgs[2], cells, visiting) : false;
      }
    }
    case 'IFS': {
      for (let i = 0; i < rawArgs.length; i += 2) {
        const cond = evaluateExpression(rawArgs[i], cells, visiting);
        if (cond) {
          return evaluateExpression(rawArgs[i + 1], cells, visiting);
        }
      }
      return '#N/A';
    }
    case 'AND': {
      const vals = getFlatValues(rawArgs);
      return vals.every(v => Boolean(v));
    }
    case 'OR': {
      const vals = getFlatValues(rawArgs);
      return vals.some(v => Boolean(v));
    }
    case 'NOT': {
      if (rawArgs.length === 0) return true;
      const val = evaluateExpression(rawArgs[0], cells, visiting);
      return !val;
    }
    case 'ROUND': {
      const num = Number(evaluateExpression(rawArgs[0], cells, visiting)) || 0;
      const decimals = rawArgs[1] ? Number(evaluateExpression(rawArgs[1], cells, visiting)) || 0 : 0;
      const factor = Math.pow(10, decimals);
      return Math.round(num * factor) / factor;
    }
    case 'ROUNDUP': {
      const num = Number(evaluateExpression(rawArgs[0], cells, visiting)) || 0;
      const decimals = rawArgs[1] ? Number(evaluateExpression(rawArgs[1], cells, visiting)) || 0 : 0;
      const factor = Math.pow(10, decimals);
      return Math.ceil(num * factor) / factor;
    }
    case 'ROUNDDOWN': {
      const num = Number(evaluateExpression(rawArgs[0], cells, visiting)) || 0;
      const decimals = rawArgs[1] ? Number(evaluateExpression(rawArgs[1], cells, visiting)) || 0 : 0;
      const factor = Math.pow(10, decimals);
      return Math.floor(num * factor) / factor;
    }
    case 'ABS': {
      const num = Number(evaluateExpression(rawArgs[0], cells, visiting)) || 0;
      return Math.abs(num);
    }
    case 'POWER': {
      const base = Number(evaluateExpression(rawArgs[0], cells, visiting)) || 0;
      const exp = Number(evaluateExpression(rawArgs[1], cells, visiting)) || 0;
      return Math.pow(base, exp);
    }
    case 'SQRT': {
      const num = Number(evaluateExpression(rawArgs[0], cells, visiting)) || 0;
      return num < 0 ? '#NUM!' : Math.sqrt(num);
    }
    case 'MOD': {
      const n = Number(evaluateExpression(rawArgs[0], cells, visiting)) || 0;
      const d = Number(evaluateExpression(rawArgs[1], cells, visiting)) || 1;
      return n % d;
    }
    case 'CONCAT':
    case 'CONCATENATE': {
      const vals = getFlatValues(rawArgs);
      return vals.join('');
    }
    case 'UPPER': {
      const str = String(evaluateExpression(rawArgs[0], cells, visiting) || '');
      return str.toUpperCase();
    }
    case 'LOWER': {
      const str = String(evaluateExpression(rawArgs[0], cells, visiting) || '');
      return str.toLowerCase();
    }
    case 'TRIM': {
      const str = String(evaluateExpression(rawArgs[0], cells, visiting) || '');
      return str.trim();
    }
    case 'LEN': {
      const str = String(evaluateExpression(rawArgs[0], cells, visiting) || '');
      return str.length;
    }
    case 'LEFT': {
      const str = String(evaluateExpression(rawArgs[0], cells, visiting) || '');
      const num = rawArgs[1] ? Number(evaluateExpression(rawArgs[1], cells, visiting)) : 1;
      return str.substring(0, num);
    }
    case 'RIGHT': {
      const str = String(evaluateExpression(rawArgs[0], cells, visiting) || '');
      const num = rawArgs[1] ? Number(evaluateExpression(rawArgs[1], cells, visiting)) : 1;
      return str.substring(Math.max(0, str.length - num));
    }
    case 'MID': {
      const str = String(evaluateExpression(rawArgs[0], cells, visiting) || '');
      const start = Number(evaluateExpression(rawArgs[1], cells, visiting)) || 1;
      const length = Number(evaluateExpression(rawArgs[2], cells, visiting)) || 0;
      return str.substring(start - 1, start - 1 + length);
    }
    case 'TODAY': {
      return new Date().toISOString().split('T')[0];
    }
    case 'NOW': {
      return new Date().toLocaleString();
    }
    case 'YEAR': {
      const dateStr = String(evaluateExpression(rawArgs[0], cells, visiting) || '');
      return new Date(dateStr).getFullYear() || 2026;
    }
    case 'MONTH': {
      const dateStr = String(evaluateExpression(rawArgs[0], cells, visiting) || '');
      return new Date(dateStr).getMonth() + 1 || 1;
    }
    case 'DAY': {
      const dateStr = String(evaluateExpression(rawArgs[0], cells, visiting) || '');
      return new Date(dateStr).getDate() || 1;
    }
    case 'VLOOKUP': {
      if (rawArgs.length < 3) return '#N/A';
      const searchKey = evaluateExpression(rawArgs[0], cells, visiting);
      const rangeStr = rawArgs[1];
      const colIndex = Number(evaluateExpression(rawArgs[2], cells, visiting)) || 1;

      const rangeCells = expandRange(rangeStr);
      if (rangeCells.length === 0) return '#N/A';

      // Group by row
      const rowMap: Record<number, { firstColVal: any; targetColVal: any }> = {};
      const start = parseCellAddress(rangeStr.split(':')[0]);

      for (const cKey of rangeCells) {
        const addr = parseCellAddress(cKey);
        if (!rowMap[addr.row]) {
          rowMap[addr.row] = { firstColVal: null, targetColVal: null };
        }
        if (addr.col === start.col) {
          rowMap[addr.row].firstColVal = getCellValue(cKey, cells, visiting);
        }
        if (addr.col === start.col + colIndex - 1) {
          rowMap[addr.row].targetColVal = getCellValue(cKey, cells, visiting);
        }
      }

      for (const rowNum of Object.keys(rowMap)) {
        const item = rowMap[Number(rowNum)];
        if (String(item.firstColVal).toLowerCase() === String(searchKey).toLowerCase()) {
          return item.targetColVal;
        }
      }
      return '#N/A';
    }
    case 'SUMIF': {
      if (rawArgs.length < 2) return 0;
      const criteriaRange = expandRange(rawArgs[0]);
      const criterion = evaluateExpression(rawArgs[1], cells, visiting);
      const sumRange = rawArgs[2] ? expandRange(rawArgs[2]) : criteriaRange;

      let sum = 0;
      for (let i = 0; i < criteriaRange.length; i++) {
        const cellVal = getCellValue(criteriaRange[i], cells, visiting);
        if (String(cellVal).toLowerCase() === String(criterion).toLowerCase()) {
          const sumVal = Number(getCellValue(sumRange[i], cells, visiting)) || 0;
          sum += sumVal;
        }
      }
      return sum;
    }
    case 'COUNTIF': {
      if (rawArgs.length < 2) return 0;
      const criteriaRange = expandRange(rawArgs[0]);
      const criterion = evaluateExpression(rawArgs[1], cells, visiting);
      let count = 0;
      for (const cKey of criteriaRange) {
        const cellVal = getCellValue(cKey, cells, visiting);
        if (String(cellVal).toLowerCase() === String(criterion).toLowerCase()) {
          count++;
        }
      }
      return count;
    }
    default:
      return `#NAME? (${fnName})`;
  }
}

// Recalculate all formulas in a sheet
export function recalculateSheetCells(cells: Record<string, CellValue>): Record<string, CellValue> {
  const updated: Record<string, CellValue> = {};
  for (const [key, cell] of Object.entries(cells)) {
    if (cell.raw && String(cell.raw).startsWith('=')) {
      const computed = evaluateFormula(cell.raw, cells);
      updated[key] = {
        ...cell,
        computed,
      };
    } else {
      updated[key] = {
        ...cell,
        computed: cell.raw !== '' && !isNaN(Number(cell.raw)) ? Number(cell.raw) : cell.raw,
      };
    }
  }
  return updated;
}

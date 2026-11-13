import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  DollarSign, 
  Percent, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  BarChart3, 
  LineChart, 
  PieChart as PieChartIcon, 
  Sparkles, 
  ArrowDownAZ, 
  ArrowUpZA, 
  Search, 
  X, 
  Check, 
  RefreshCw,
  Sigma,
  ChevronDown
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart as ReLineChart, Line, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { AuraSheetContent, SheetData, CellValue } from '../../types/office';
import { 
  colLetterToIndex, 
  indexToColLetter, 
  recalculateSheetCells, 
  evaluateFormula 
} from './formulaEngine';
import { AuraStorageService } from '../../services/storage';

interface AuraSheetsEditorProps {
  sheetDoc: AuraSheetContent;
  onSave: (doc: AuraSheetContent) => void;
  onOpenAI: (contextText?: string) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export function AuraSheetsEditor({
  sheetDoc,
  onSave,
  onOpenAI,
}: AuraSheetsEditorProps) {
  const [data, setData] = useState<AuraSheetContent>(sheetDoc);
  const [activeTabId, setActiveTabId] = useState<string>(sheetDoc.activeSheetId || sheetDoc.sheets[0]?.id || 'sheet-1');
  const [selectedCell, setSelectedCell] = useState<string>('A1');
  const [formulaInput, setFormulaInput] = useState<string>('');
  const [isEditingCell, setIsEditingCell] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [chartRange, setChartRange] = useState('A1:B6');
  
  const currentSheet = useMemo(() => {
    return data.sheets.find((s) => s.id === activeTabId) || data.sheets[0];
  }, [data, activeTabId]);

  // Sync selected cell raw value to formula bar
  useEffect(() => {
    if (!currentSheet) return;
    const cell = currentSheet.cells[selectedCell];
    setFormulaInput(cell?.raw ? String(cell.raw) : '');
  }, [selectedCell, currentSheet]);

  // Auto-save on data change
  useEffect(() => {
    const timer = setTimeout(() => {
      onSave(data);
    }, 700);
    return () => clearTimeout(timer);
  }, [data]);

  // Update a single cell value
  const setCellValue = (cellKey: string, rawVal: string) => {
    if (!currentSheet) return;

    const newCells = {
      ...currentSheet.cells,
      [cellKey]: {
        ...currentSheet.cells[cellKey],
        raw: rawVal,
      },
    };

    const calculatedCells = recalculateSheetCells(newCells);

    const updatedSheets = data.sheets.map((s) =>
      s.id === currentSheet.id ? { ...s, cells: calculatedCells } : s
    );

    setData({ ...data, sheets: updatedSheets });
  };

  // Update formatting on selected cell
  const setCellStyle = (patch: Partial<CellValue['style']>) => {
    if (!currentSheet) return;
    const existing = currentSheet.cells[selectedCell] || { raw: '' };
    const newStyle = { ...(existing.style || {}), ...patch };

    const newCells = {
      ...currentSheet.cells,
      [selectedCell]: {
        ...existing,
        style: newStyle,
      },
    };

    const updatedSheets = data.sheets.map((s) =>
      s.id === currentSheet.id ? { ...s, cells: newCells } : s
    );

    setData({ ...data, sheets: updatedSheets });
  };

  // Formula input submit
  const handleFormulaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCellValue(selectedCell, formulaInput);
    setIsEditingCell(false);
  };

  // Add new sheet tab
  const handleAddSheet = () => {
    const newId = `sheet-${Date.now()}`;
    const newSheet: SheetData = {
      id: newId,
      name: `Sheet${data.sheets.length + 1}`,
      rowCount: 30,
      colCount: 15,
      cells: {},
    };
    const updated = {
      ...data,
      sheets: [...data.sheets, newSheet],
      activeSheetId: newId,
    };
    setData(updated);
    setActiveTabId(newId);
  };

  // Rename sheet tab
  const handleRenameSheet = (tabId: string) => {
    const tab = data.sheets.find(s => s.id === tabId);
    if (!tab) return;
    const newName = prompt('Enter sheet name:', tab.name);
    if (newName && newName.trim()) {
      const updated = {
        ...data,
        sheets: data.sheets.map(s => s.id === tabId ? { ...s, name: newName.trim() } : s),
      };
      setData(updated);
    }
  };

  // Delete sheet tab
  const handleDeleteSheet = (tabId: string) => {
    if (data.sheets.length <= 1) {
      alert('Spreadsheet must have at least one sheet tab.');
      return;
    }
    const updatedSheets = data.sheets.filter(s => s.id !== tabId);
    const newActive = updatedSheets[0].id;
    setData({
      ...data,
      sheets: updatedSheets,
      activeSheetId: newActive,
    });
    setActiveTabId(newActive);
  };

  // Quick Formula insertion
  const insertQuickFormula = (fnName: string) => {
    const cell = selectedCell;
    const colMatch = cell.match(/^([A-Z]+)([0-9]+)$/);
    if (!colMatch) return;
    const col = colMatch[1];
    const row = parseInt(colMatch[2], 10);
    const formula = row > 1 ? `=${fnName}(${col}1:${col}${row - 1})` : `=${fnName}(A1:A10)`;
    setFormulaInput(formula);
    setCellValue(cell, formula);
  };

  // Sort active column
  const handleSortColumn = (ascending: boolean) => {
    if (!currentSheet) return;
    const colMatch = selectedCell.match(/^([A-Z]+)/);
    if (!colMatch) return;
    const col = colMatch[1];

    // Collect all rows and their values for this column
    const rowsData: { rowIdx: number; val: any }[] = [];
    for (let r = 1; r <= currentSheet.rowCount; r++) {
      const cell = currentSheet.cells[`${col}${r}`];
      rowsData.push({
        rowIdx: r,
        val: cell?.computed !== undefined ? cell.computed : (cell?.raw || ''),
      });
    }

    // Sort excluding header (row 1)
    const header = rowsData[0];
    const body = rowsData.slice(1);
    body.sort((a, b) => {
      const aNum = Number(a.val);
      const bNum = Number(b.val);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return ascending ? aNum - bNum : bNum - aNum;
      }
      return ascending 
        ? String(a.val).localeCompare(String(b.val))
        : String(b.val).localeCompare(String(a.val));
    });

    const sortedRows = [header, ...body];
    const newCells = { ...currentSheet.cells };

    // Remap all columns along these rows
    for (let newRowIdx = 1; newRowIdx <= sortedRows.length; newRowIdx++) {
      const oldRowIdx = sortedRows[newRowIdx - 1].rowIdx;
      if (newRowIdx !== oldRowIdx) {
        for (let c = 0; c < currentSheet.colCount; c++) {
          const cLetter = indexToColLetter(c);
          const oldKey = `${cLetter}${oldRowIdx}`;
          const newKey = `${cLetter}${newRowIdx}`;
          newCells[newKey] = currentSheet.cells[oldKey] || { raw: '' };
        }
      }
    }

    const updated = {
      ...data,
      sheets: data.sheets.map(s => s.id === currentSheet.id ? { ...s, cells: recalculateSheetCells(newCells) } : s),
    };
    setData(updated);
  };

  // Export CSV
  const handleExportCsv = () => {
    AuraStorageService.exportSheetAsCsv(data);
  };

  // Import CSV
  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentSheet) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/);
      const newCells: Record<string, CellValue> = {};

      lines.forEach((line, rIdx) => {
        if (!line.trim()) return;
        const cols = line.split(',');
        cols.forEach((val, cIdx) => {
          const cleanVal = val.replace(/^"(.*)"$/, '$1').trim();
          const key = `${indexToColLetter(cIdx)}${rIdx + 1}`;
          newCells[key] = { raw: cleanVal };
        });
      });

      const updated = {
        ...data,
        sheets: data.sheets.map(s => s.id === currentSheet.id ? {
          ...s,
          rowCount: Math.max(s.rowCount, lines.length + 5),
          cells: recalculateSheetCells(newCells),
        } : s),
      };
      setData(updated);
    };
    reader.readAsText(file);
  };

  // Chart data extraction
  const chartData = useMemo(() => {
    if (!currentSheet) return [];
    // Parse range e.g. A1:B6
    const parts = chartRange.split(':');
    if (parts.length < 2) return [];
    const startCol = parts[0].match(/^[A-Z]+/)?.[0] || 'A';
    const endCol = parts[1].match(/^[A-Z]+/)?.[0] || 'B';
    const startRow = parseInt(parts[0].match(/[0-9]+/)?.[0] || '1', 10);
    const endRow = parseInt(parts[1].match(/[0-9]+/)?.[0] || '6', 10);

    const items: any[] = [];
    for (let r = startRow; r <= endRow; r++) {
      const labelCell = currentSheet.cells[`${startCol}${r}`];
      const valCell = currentSheet.cells[`${endCol}${r}`];
      const name = String(labelCell?.computed || labelCell?.raw || `Item ${r}`);
      const value = Number(valCell?.computed !== undefined ? valCell.computed : valCell?.raw) || 0;
      items.push({ name, value });
    }
    return items;
  }, [currentSheet, chartRange]);

  const activeCellData = currentSheet?.cells[selectedCell];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100/70 dark:bg-slate-950 overflow-hidden select-none">
      {/* 1. Sheets Toolbar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shadow-xs shrink-0 z-20">
        <div className="flex items-center flex-wrap gap-1">
          {/* Text Styling */}
          <button
            onClick={() => setCellStyle({ bold: !activeCellData?.style?.bold })}
            className={`p-1.5 rounded font-bold text-xs ${
              activeCellData?.style?.bold ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCellStyle({ italic: !activeCellData?.style?.italic })}
            className={`p-1.5 rounded text-xs ${
              activeCellData?.style?.italic ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCellStyle({ underline: !activeCellData?.style?.underline })}
            className={`p-1.5 rounded text-xs ${
              activeCellData?.style?.underline ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Text and Cell Color */}
          <div className="flex items-center gap-1">
            <label className="text-[10px] text-slate-400 font-bold">Text</label>
            <input
              type="color"
              onChange={(e) => setCellStyle({ color: e.target.value })}
              className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
              title="Font Color"
              defaultValue="#0f172a"
            />
            <label className="text-[10px] text-slate-400 font-bold ml-1">Fill</label>
            <input
              type="color"
              onChange={(e) => setCellStyle({ bgColor: e.target.value })}
              className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
              title="Background Fill Color"
              defaultValue="#ffffff"
            />
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Alignment */}
          <button
            onClick={() => setCellStyle({ align: 'left' })}
            className={`p-1.5 rounded text-xs ${activeCellData?.style?.align === 'left' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCellStyle({ align: 'center' })}
            className={`p-1.5 rounded text-xs ${activeCellData?.style?.align === 'center' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCellStyle({ align: 'right' })}
            className={`p-1.5 rounded text-xs ${activeCellData?.style?.align === 'right' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Number Formats */}
          <button
            onClick={() => setCellStyle({ format: 'currency', align: 'right' })}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-0.5"
            title="Format as Currency ($)"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          </button>
          <button
            onClick={() => setCellStyle({ format: 'percent', align: 'right' })}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-0.5"
            title="Format as Percentage (%)"
          >
            <Percent className="w-3.5 h-3.5 text-indigo-600" />
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Quick Functions Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">
              <Sigma className="w-3.5 h-3.5 text-indigo-500" />
              <span>Functions</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            <div className="hidden group-hover:block absolute left-0 top-full mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-1 z-50 text-xs">
              {['SUM', 'AVERAGE', 'COUNT', 'MAX', 'MIN'].map((fn) => (
                <button
                  key={fn}
                  onClick={() => insertQuickFormula(fn)}
                  className="w-full text-left px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 font-mono"
                >
                  ={fn}()
                </button>
              ))}
            </div>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Sort Buttons */}
          <button
            onClick={() => handleSortColumn(true)}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
            title="Sort Column A-Z"
          >
            <ArrowDownAZ className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleSortColumn(false)}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
            title="Sort Column Z-A"
          >
            <ArrowUpZA className="w-3.5 h-3.5" />
          </button>

          {/* Insert Chart */}
          <button
            onClick={() => setShowChartModal(true)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-semibold"
            title="Create Visual Chart"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Chart</span>
          </button>
        </div>

        {/* Right Tools: AI Formula helper, CSV export/import */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenAI(`Spreadsheet context: Active cell ${selectedCell}, current formula: ${formulaInput}`)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 text-xs font-semibold"
            title="Ask Aura AI for spreadsheet insights or formulas"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Formulas</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <label
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer"
            title="Import CSV into sheet"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
            <input type="file" accept=".csv" onChange={handleImportCsv} className="hidden" />
          </label>
        </div>
      </div>

      {/* 2. Formula Bar */}
      <div className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center gap-2 text-xs shrink-0">
        <div className="w-14 font-mono font-bold text-center py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
          {selectedCell}
        </div>
        <div className="font-serif italic font-bold text-slate-400 select-none">
          fx
        </div>
        <form onSubmit={handleFormulaSubmit} className="flex-1 flex gap-1">
          <input
            type="text"
            value={formulaInput}
            onChange={(e) => setFormulaInput(e.target.value)}
            placeholder="Enter a value or formula e.g. =SUM(A1:A5)"
            className="flex-1 px-3 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium text-xs"
          >
            Apply
          </button>
        </form>
      </div>

      {/* 3. Main SpreadSheet Grid Canvas */}
      <div className="flex-1 overflow-auto bg-slate-200 dark:bg-slate-950 p-2">
        <div className="inline-block min-w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
          <table className="border-collapse text-xs w-full">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono select-none">
                <th className="w-10 p-1 border border-slate-200 dark:border-slate-700 text-center font-normal">#</th>
                {Array.from({ length: currentSheet?.colCount || 12 }).map((_, cIdx) => (
                  <th
                    key={cIdx}
                    className="min-w-[90px] px-2 py-1.5 border border-slate-200 dark:border-slate-700 text-center font-semibold"
                  >
                    {indexToColLetter(cIdx)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: currentSheet?.rowCount || 25 }).map((_, rIdx) => {
                const rowNum = rIdx + 1;
                return (
                  <tr key={rowNum} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    {/* Row Header Index */}
                    <td className="w-10 px-1 py-1 border border-slate-200 dark:border-slate-700 text-center font-mono text-slate-400 bg-slate-50 dark:bg-slate-800/60 select-none">
                      {rowNum}
                    </td>

                    {/* Columns */}
                    {Array.from({ length: currentSheet?.colCount || 12 }).map((_, cIdx) => {
                      const colLetter = indexToColLetter(cIdx);
                      const cellKey = `${colLetter}${rowNum}`;
                      const cell = currentSheet?.cells[cellKey];
                      const isSelected = selectedCell === cellKey;
                      const displayVal = formatDisplayValue(cell);

                      return (
                        <td
                          key={cellKey}
                          onClick={() => {
                            setSelectedCell(cellKey);
                          }}
                          onDoubleClick={() => {
                            setSelectedCell(cellKey);
                            setIsEditingCell(true);
                          }}
                          style={{
                            backgroundColor: cell?.style?.bgColor || (isSelected ? undefined : undefined),
                            color: cell?.style?.color || undefined,
                            textAlign: cell?.style?.align || (typeof cell?.computed === 'number' ? 'right' : 'left'),
                            fontWeight: cell?.style?.bold ? 'bold' : 'normal',
                            fontStyle: cell?.style?.italic ? 'italic' : 'normal',
                            textDecoration: cell?.style?.underline ? 'underline' : 'none',
                          }}
                          className={`min-w-[90px] h-7 px-2 py-1 border border-slate-200 dark:border-slate-800 font-mono text-slate-800 dark:text-slate-200 truncate cursor-cell transition-colors ${
                            isSelected
                              ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-50/40 dark:bg-indigo-950/40 z-10'
                              : ''
                          }`}
                        >
                          {isSelected && isEditingCell ? (
                            <input
                              type="text"
                              autoFocus
                              value={formulaInput}
                              onChange={(e) => setFormulaInput(e.target.value)}
                              onBlur={() => {
                                setCellValue(cellKey, formulaInput);
                                setIsEditingCell(false);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setCellValue(cellKey, formulaInput);
                                  setIsEditingCell(false);
                                }
                                if (e.key === 'Escape') {
                                  setIsEditingCell(false);
                                }
                              }}
                              className="w-full h-full bg-white dark:bg-slate-800 text-xs px-1 outline-none border border-indigo-500 rounded-xs"
                            />
                          ) : (
                            displayVal
                          )}
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

      {/* 4. Bottom Sheet Tabs Bar */}
      <div className="h-9 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-3 flex items-center justify-between text-xs shrink-0 select-none">
        <div className="flex items-center gap-1 overflow-x-auto">
          {data.sheets.map((s) => (
            <div
              key={s.id}
              onClick={() => setActiveTabId(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-t-lg font-medium cursor-pointer border-t-2 transition-colors ${
                s.id === activeTabId
                  ? 'border-indigo-600 bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span onDoubleClick={() => handleRenameSheet(s.id)}>{s.name}</span>
              {data.sheets.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSheet(s.id);
                  }}
                  className="opacity-40 hover:opacity-100 hover:text-red-500 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleAddSheet}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            title="Add new sheet"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          {currentSheet?.rowCount} rows × {currentSheet?.colCount} cols
        </div>
      </div>

      {/* 5. Chart Visualization Modal */}
      {showChartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                  Spreadsheet Chart Visualizer
                </h3>
              </div>
              <button onClick={() => setShowChartModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Chart Type
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-3 py-1 text-xs rounded-lg font-medium ${chartType === 'bar' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                  >
                    Bar Chart
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-3 py-1 text-xs rounded-lg font-medium ${chartType === 'line' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                  >
                    Line Chart
                  </button>
                  <button
                    onClick={() => setChartType('pie')}
                    className={`px-3 py-1 text-xs rounded-lg font-medium ${chartType === 'pie' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                  >
                    Pie Chart
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Data Range (Labels:Values)
                </label>
                <input
                  type="text"
                  value={chartRange}
                  onChange={(e) => setChartRange(e.target.value.toUpperCase())}
                  placeholder="A1:B6"
                  className="px-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Rendered Chart */}
            <div className="h-64 w-full bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : chartType === 'line' ? (
                    <ReLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} />
                    </ReLineChart>
                  ) : (
                    <RePieChart>
                      <Tooltip />
                      <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </RePieChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No numerical data in selected range {chartRange}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowChartModal(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Close Visualizer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDisplayValue(cell?: CellValue): string {
  if (!cell) return '';
  const val = cell.computed !== undefined ? cell.computed : cell.raw;
  if (val === undefined || val === null) return '';

  if (typeof val === 'number') {
    if (cell.style?.format === 'currency') {
      return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (cell.style?.format === 'percent') {
      return `${(val * 100).toFixed(1)}%`;
    }
    return val.toLocaleString('en-US');
  }

  return String(val);
}

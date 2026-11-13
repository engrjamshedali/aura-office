import { useState, useMemo } from 'react';
import {
  Database,
  Table as TableIcon,
  Layout,
  Code2,
  Network,
  Plus,
  Trash2,
  Search,
  Download,
  Upload,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Key,
  ArrowUpDown,
  Check,
  Play,
  FileSpreadsheet
} from 'lucide-react';
import {
  AuraDatabaseContent,
  DbTable,
  DbColumn,
  DbColumnType,
  DbRecord,
  DbQuery
} from '../../types/office';
import { AuraStorageService } from '../../services/storage';

interface AuraDatabaseViewProps {
  databaseDoc: AuraDatabaseContent;
  onSave: (doc: AuraDatabaseContent) => void;
  onOpenAI: (context: string) => void;
}

type DbViewMode = 'datasheet' | 'form' | 'design' | 'queries' | 'relationships';

export function AuraDatabaseView({
  databaseDoc,
  onSave,
  onOpenAI,
}: AuraDatabaseViewProps) {
  const [data, setData] = useState<AuraDatabaseContent>(databaseDoc);
  const [viewMode, setViewMode] = useState<DbViewMode>('datasheet');
  const [activeTableId, setActiveTableId] = useState<string>(
    databaseDoc.activeTableId || databaseDoc.tables[0]?.id || 'tbl-1'
  );

  // Search & sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Form View state
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);

  // New Table / New Column modal states
  const [showNewTableModal, setShowNewTableModal] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableDesc, setNewTableDesc] = useState('');

  const [showNewColumnModal, setShowNewColumnModal] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColType, setNewColType] = useState<DbColumnType>('text');
  const [newColRequired, setNewColRequired] = useState(false);
  const [newColOptions, setNewColOptions] = useState('');

  // Query state
  const [activeQueryId, setActiveQueryId] = useState<string>(databaseDoc.queries[0]?.id || '');
  const [querySql, setQuerySql] = useState<string>(
    databaseDoc.queries[0]?.sql || 'SELECT * FROM Customers'
  );
  const [queryResults, setQueryResults] = useState<{ columns: string[]; rows: any[] } | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  // Active table reference
  const currentTable = data.tables.find((t) => t.id === activeTableId) || data.tables[0];

  // Helper to commit changes and auto-save
  const updateData = (newData: AuraDatabaseContent) => {
    setData(newData);
    onSave(newData);
  };

  // Filtered & Sorted records
  const processedRecords = useMemo(() => {
    if (!currentTable) return [];
    let records = [...currentTable.records];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      records = records.filter((rec) =>
        Object.values(rec).some((val) =>
          val !== null && val !== undefined && String(val).toLowerCase().includes(q)
        )
      );
    }

    if (sortColumn) {
      records.sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }
        return sortDirection === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return records;
  }, [currentTable, searchQuery, sortColumn, sortDirection]);

  // Toggle sorting
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  // Inline Cell Edit
  const handleUpdateCell = (recordId: string, columnId: string, value: any) => {
    if (!currentTable) return;
    const updatedTables = data.tables.map((t) => {
      if (t.id !== currentTable.id) return t;
      const updatedRecords = t.records.map((r) => {
        if (r.id !== recordId) return r;
        return { ...r, [columnId]: value };
      });
      return { ...t, records: updatedRecords };
    });
    updateData({ ...data, tables: updatedTables });
  };

  // Add new record
  const handleAddRecord = () => {
    if (!currentTable) return;
    const newId = `REC-${String(currentTable.records.length + 1).padStart(3, '0')}`;
    const newRecord: DbRecord = { id: newId };
    currentTable.columns.forEach((col) => {
      if (col.id === 'id') return;
      if (col.type === 'number' || col.type === 'currency') newRecord[col.id] = 0;
      else if (col.type === 'boolean') newRecord[col.id] = false;
      else if (col.type === 'date') newRecord[col.id] = new Date().toISOString().slice(0, 10);
      else if (col.type === 'select' && col.options && col.options.length > 0)
        newRecord[col.id] = col.options[0];
      else newRecord[col.id] = '';
    });

    const updatedTables = data.tables.map((t) => {
      if (t.id !== currentTable.id) return t;
      return { ...t, records: [...t.records, newRecord] };
    });
    updateData({ ...data, tables: updatedTables });
    setCurrentRecordIndex(currentTable.records.length);
  };

  // Delete record
  const handleDeleteRecord = (recordId: string) => {
    if (!currentTable) return;
    const updatedTables = data.tables.map((t) => {
      if (t.id !== currentTable.id) return t;
      return { ...t, records: t.records.filter((r) => r.id !== recordId) };
    });
    updateData({ ...data, tables: updatedTables });
    if (currentRecordIndex >= currentTable.records.length - 1) {
      setCurrentRecordIndex(Math.max(0, currentTable.records.length - 2));
    }
  };

  // Create Table
  const handleCreateTable = () => {
    if (!newTableName.trim()) return;
    const tableId = `tbl-${Date.now()}`;
    const newTable: DbTable = {
      id: tableId,
      name: newTableName.trim(),
      description: newTableDesc.trim(),
      columns: [
        { id: 'id', name: 'ID', type: 'text', primaryKey: true, required: true },
        { id: 'name', name: 'Name', type: 'text', required: true },
        { id: 'created', name: 'Created Date', type: 'date' },
      ],
      records: [
        { id: 'REC-001', name: 'First Record', created: new Date().toISOString().slice(0, 10) },
      ],
    };

    updateData({
      ...data,
      tables: [...data.tables, newTable],
      activeTableId: tableId,
    });
    setActiveTableId(tableId);
    setShowNewTableModal(false);
    setNewTableName('');
    setNewTableDesc('');
  };

  // Delete Table
  const handleDeleteTable = (tableId: string) => {
    if (data.tables.length <= 1) return;
    const updatedTables = data.tables.filter((t) => t.id !== tableId);
    const nextActive = updatedTables[0].id;
    updateData({
      ...data,
      tables: updatedTables,
      activeTableId: nextActive,
    });
    setActiveTableId(nextActive);
  };

  // Add Column
  const handleAddColumn = () => {
    if (!currentTable || !newColName.trim()) return;
    const colId = newColName.toLowerCase().replace(/\s+/g, '_');
    const optionsArray = newColOptions
      ? newColOptions.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined;

    const newColumn: DbColumn = {
      id: colId,
      name: newColName.trim(),
      type: newColType,
      required: newColRequired,
      options: optionsArray,
    };

    const updatedTables = data.tables.map((t) => {
      if (t.id !== currentTable.id) return t;
      return {
        ...t,
        columns: [...t.columns, newColumn],
        records: t.records.map((r) => ({
          ...r,
          [colId]:
            newColType === 'boolean'
              ? false
              : newColType === 'number' || newColType === 'currency'
              ? 0
              : '',
        })),
      };
    });

    updateData({ ...data, tables: updatedTables });
    setShowNewColumnModal(false);
    setNewColName('');
    setNewColOptions('');
  };

  // Delete Column
  const handleDeleteColumn = (columnId: string) => {
    if (!currentTable || columnId === 'id') return;
    const updatedTables = data.tables.map((t) => {
      if (t.id !== currentTable.id) return t;
      return {
        ...t,
        columns: t.columns.filter((c) => c.id !== columnId),
        records: t.records.map((r) => {
          const cloned = { ...r };
          delete cloned[columnId];
          return cloned;
        }),
      };
    });
    updateData({ ...data, tables: updatedTables });
  };

  // SQL Query Execution Engine
  const executeQuery = () => {
    setQueryError(null);
    try {
      const trimmed = querySql.trim();
      const match = trimmed.match(/^SELECT\s+(.*?)\s+FROM\s+([a-zA-Z0-9_-]+)(?:\s+WHERE\s+(.*?))?(?:\s+ORDER\s+BY\s+(.*?))?$/i);

      if (!match) {
        throw new Error("Syntax Error: AuraDatabase SQL parser supports queries formatted as: SELECT <columns|*> FROM <TableName> [WHERE <condition>] [ORDER BY <field> [ASC|DESC]]");
      }

      const [, selectClause, fromClause, whereClause, orderClause] = match;
      const targetTable = data.tables.find(
        (t) => t.name.toLowerCase() === fromClause.toLowerCase() || t.id.toLowerCase() === fromClause.toLowerCase()
      );

      if (!targetTable) {
        throw new Error(`Table '${fromClause}' does not exist in database.`);
      }

      let rows = [...targetTable.records];

      // Simple WHERE parser
      if (whereClause) {
        // support conditions like: field = 'value', field >= 1000, field <= 30
        const condMatch = whereClause.match(/([a-zA-Z0-9_]+)\s*(=|>=|<=|>|<|!=)\s*(?:'([^']*)'|([0-9.]+))/);
        if (condMatch) {
          const [, field, op, strVal, numVal] = condMatch;
          const targetVal = strVal !== undefined ? strVal : Number(numVal);

          rows = rows.filter((r) => {
            const val = r[field];
            if (val === undefined) return false;
            if (op === '=') return String(val).toLowerCase() === String(targetVal).toLowerCase();
            if (op === '!=') return String(val).toLowerCase() !== String(targetVal).toLowerCase();
            if (op === '>=') return Number(val) >= Number(targetVal);
            if (op === '<=') return Number(val) <= Number(targetVal);
            if (op === '>') return Number(val) > Number(targetVal);
            if (op === '<') return Number(val) < Number(targetVal);
            return true;
          });
        }
      }

      // Simple ORDER BY parser
      if (orderClause) {
        const [orderField, dir] = orderClause.trim().split(/\s+/);
        const isDesc = dir && dir.toUpperCase() === 'DESC';
        rows.sort((a, b) => {
          const vA = a[orderField];
          const vB = b[orderField];
          if (vA === vB) return 0;
          if (vA === null || vA === undefined) return 1;
          if (vB === null || vB === undefined) return -1;
          if (typeof vA === 'number' && typeof vB === 'number') {
            return isDesc ? vB - vA : vA - vB;
          }
          return isDesc
            ? String(vB).localeCompare(String(vA))
            : String(vA).localeCompare(String(vB));
        });
      }

      // SELECT columns projection
      let selectedCols: string[];
      if (selectClause.trim() === '*') {
        selectedCols = targetTable.columns.map((c) => c.id);
      } else {
        selectedCols = selectClause.split(',').map((s) => s.trim());
      }

      setQueryResults({
        columns: selectedCols,
        rows: rows.map((r) => {
          const projected: Record<string, any> = {};
          selectedCols.forEach((c) => {
            projected[c] = r[c] !== undefined ? r[c] : '—';
          });
          return projected;
        }),
      });
    } catch (err: any) {
      setQueryError(err.message || 'Error executing SQL query.');
      setQueryResults(null);
    }
  };

  // Export Table as CSV
  const handleExportCSV = () => {
    if (!currentTable) return;
    const header = currentTable.columns.map((c) => `"${c.name}"`).join(',');
    const rows = currentTable.records.map((r) =>
      currentTable.columns
        .map((c) => {
          const val = r[c.id];
          return val === undefined || val === null ? '""' : `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const csvContent = [header, ...rows].join('\n');
    AuraStorageService.downloadFile(`${currentTable.name}.csv`, csvContent, 'text/csv');
  };

  // Export Whole Database as JSON
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    AuraStorageService.downloadFile(`${data.title}.json`, jsonStr, 'application/json');
  };

  // Ask AI for SQL Query
  const handleAskAIQuery = () => {
    const schemaSummary = data.tables
      .map((t) => `${t.name} (${t.columns.map((c) => `${c.id}:${c.type}`).join(', ')})`)
      .join('\n');
    onOpenAI(
      `I am designing SQL queries for AuraDatabase (Microsoft Access alternative).\nHere is my database schema:\n${schemaSummary}\n\nPlease generate a query or assist in querying this data.`
    );
  };

  // Form View Navigation
  const activeRecord = currentTable?.records[currentRecordIndex] || null;

  return (
    <div id="aura-database-root" className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden select-none">
      {/* Top Application Bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-600/10 dark:bg-red-500/20 text-red-600 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{data.title}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 dark:bg-red-950/50 text-red-600 border border-red-200 dark:border-red-900">
                AuraDatabase
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {data.tables.length} Tables • {data.relationships.length} Relationships • Access Alternative
            </p>
          </div>
        </div>

        {/* View Switcher Tabs (Datasheet, Form, Query, Schema, Relationships) */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
          <button
            onClick={() => setViewMode('datasheet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'datasheet'
                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Datasheet</span>
          </button>
          <button
            onClick={() => setViewMode('form')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'form'
                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Form View</span>
          </button>
          <button
            onClick={() => setViewMode('queries')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'queries'
                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>SQL Query</span>
          </button>
          <button
            onClick={() => setViewMode('design')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'design'
                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Schema Design</span>
          </button>
          <button
            onClick={() => setViewMode('relationships')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'relationships'
                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>ER Relationships</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAskAIQuery}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold hover:bg-indigo-100 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Copilot</span>
          </button>

          <button
            onClick={handleExportCSV}
            title="Export Active Table as CSV"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            title="Export Entire Database as JSON"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Table Navigation Sidebar */}
        <div className="w-56 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Tables
            </span>
            <button
              onClick={() => setShowNewTableModal(true)}
              className="p-1 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Create New Table"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Table List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {data.tables.map((table) => {
              const isActive = table.id === activeTableId;
              return (
                <div
                  key={table.id}
                  onClick={() => {
                    setActiveTableId(table.id);
                    setCurrentRecordIndex(0);
                  }}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 font-semibold border border-red-200 dark:border-red-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <TableIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                    <span className="truncate">{table.name}</span>
                  </div>
                  <span className="text-[10px] bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded-full font-mono text-slate-500">
                    {table.records.length}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pre-saved Queries in left bar */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
              Saved Queries
            </span>
            <div className="space-y-1">
              {data.queries.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQueryId(q.id);
                    setQuerySql(q.sql);
                    setViewMode('queries');
                  }}
                  className={`w-full text-left truncate px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center gap-2 ${
                    activeQueryId === q.id && viewMode === 'queries'
                      ? 'bg-slate-100 dark:bg-slate-800 text-red-600 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Code2 className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{q.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Central Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
          {/* View 1: Datasheet View (Grid) */}
          {viewMode === 'datasheet' && currentTable && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Table Action Bar */}
              <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {currentTable.name}
                  </h2>
                  <span className="text-xs text-slate-400">
                    {processedRecords.length} records
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter records..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs w-48 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <button
                    onClick={handleAddRecord}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Record</span>
                  </button>

                  <button
                    onClick={() => setShowNewColumnModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Column</span>
                  </button>
                </div>
              </div>

              {/* Data Grid */}
              <div className="flex-1 overflow-auto bg-white dark:bg-slate-900">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10 border-b border-slate-200 dark:border-slate-700 shadow-xs">
                    <tr>
                      <th className="w-12 px-3 py-2.5 text-center text-[11px] font-semibold text-slate-500 border-r border-slate-200 dark:border-slate-700">
                        #
                      </th>
                      {currentTable.columns.map((col) => (
                        <th
                          key={col.id}
                          className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                          onClick={() => handleSort(col.id)}
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5">
                              {col.primaryKey && <Key className="w-3 h-3 text-amber-500" />}
                              <span>{col.name}</span>
                            </div>
                            <ArrowUpDown className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>
                      ))}
                      <th className="w-16 px-3 py-2.5 text-center text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {processedRecords.map((rec, idx) => (
                      <tr
                        key={rec.id || idx}
                        className="hover:bg-red-50/40 dark:hover:bg-red-950/20 transition-colors group"
                      >
                        <td className="px-3 py-2 text-center text-[11px] font-mono text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800">
                          {idx + 1}
                        </td>
                        {currentTable.columns.map((col) => {
                          const val = rec[col.id];
                          return (
                            <td
                              key={col.id}
                              className="px-4 py-1.5 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                            >
                              {col.type === 'boolean' ? (
                                <input
                                  type="checkbox"
                                  checked={Boolean(val)}
                                  onChange={(e) => handleUpdateCell(rec.id, col.id, e.target.checked)}
                                  className="w-4 h-4 rounded-sm text-red-600 focus:ring-red-500"
                                />
                              ) : col.type === 'select' && col.options ? (
                                <select
                                  value={val || ''}
                                  onChange={(e) => handleUpdateCell(rec.id, col.id, e.target.value)}
                                  className="w-full bg-transparent border-none py-1 text-xs focus:ring-0 focus:outline-hidden"
                                >
                                  {col.options.map((opt) => (
                                    <option key={opt} value={opt} className="dark:bg-slate-900">
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={col.type === 'number' || col.type === 'currency' ? 'number' : 'text'}
                                  value={val !== undefined && val !== null ? val : ''}
                                  onChange={(e) =>
                                    handleUpdateCell(
                                      rec.id,
                                      col.id,
                                      col.type === 'number' || col.type === 'currency'
                                        ? Number(e.target.value)
                                        : e.target.value
                                    )
                                  }
                                  className="w-full bg-transparent border-none py-1 text-xs focus:ring-1 focus:ring-red-500 rounded-sm px-1"
                                />
                              )}
                            </td>
                          );
                        })}
                        <td className="px-3 py-1.5 text-center">
                          <button
                            onClick={() => handleDeleteRecord(rec.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* View 2: Form View (Access Single-Record Card Interface) */}
          {viewMode === 'form' && currentTable && (
            <div className="flex-1 flex flex-col p-6 items-center justify-center overflow-y-auto">
              <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                {/* Form Header */}
                <div className="bg-red-600 px-6 py-4 flex items-center justify-between text-white">
                  <div>
                    <h3 className="font-bold text-base">{currentTable.name} Record Details</h3>
                    <p className="text-xs text-red-100">Microsoft Access Record Form</p>
                  </div>
                  <span className="text-xs font-mono bg-red-700/60 px-2.5 py-1 rounded-full">
                    Record {currentTable.records.length > 0 ? currentRecordIndex + 1 : 0} of {currentTable.records.length}
                  </span>
                </div>

                {/* Form Fields */}
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                  {activeRecord ? (
                    currentTable.columns.map((col) => {
                      const val = activeRecord[col.id];
                      return (
                        <div key={col.id} className="grid grid-cols-3 gap-4 items-center">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            {col.primaryKey && <Key className="w-3 h-3 text-amber-500" />}
                            <span>{col.name}</span>
                            {col.required && <span className="text-red-500">*</span>}
                          </label>

                          <div className="col-span-2">
                            {col.type === 'boolean' ? (
                              <input
                                type="checkbox"
                                checked={Boolean(val)}
                                onChange={(e) => handleUpdateCell(activeRecord.id, col.id, e.target.checked)}
                                className="w-4 h-4 rounded-sm text-red-600 focus:ring-red-500"
                              />
                            ) : col.type === 'select' && col.options ? (
                              <select
                                value={val || ''}
                                onChange={(e) => handleUpdateCell(activeRecord.id, col.id, e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-red-500"
                              >
                                {col.options.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={col.type === 'number' || col.type === 'currency' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                                value={val !== undefined && val !== null ? val : ''}
                                onChange={(e) =>
                                  handleUpdateCell(
                                    activeRecord.id,
                                    col.id,
                                    col.type === 'number' || col.type === 'currency'
                                      ? Number(e.target.value)
                                      : e.target.value
                                  )
                                }
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-red-500"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No records exist in this table. Click "New Record" to add one.
                    </div>
                  )}
                </div>

                {/* Form Access-Style Navigation Bar */}
                <div className="bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentRecordIndex(0)}
                      disabled={currentRecordIndex === 0}
                      className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-600 dark:text-slate-300"
                      title="First Record"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentRecordIndex(Math.max(0, currentRecordIndex - 1))}
                      disabled={currentRecordIndex === 0}
                      className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-600 dark:text-slate-300"
                      title="Previous Record"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs px-2 font-mono text-slate-500">
                      {currentTable.records.length > 0 ? currentRecordIndex + 1 : 0} of {currentTable.records.length}
                    </span>
                    <button
                      onClick={() => setCurrentRecordIndex(Math.min(currentTable.records.length - 1, currentRecordIndex + 1))}
                      disabled={currentRecordIndex >= currentTable.records.length - 1}
                      className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-600 dark:text-slate-300"
                      title="Next Record"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentRecordIndex(Math.max(0, currentTable.records.length - 1))}
                      disabled={currentRecordIndex >= currentTable.records.length - 1}
                      className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-600 dark:text-slate-300"
                      title="Last Record"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeRecord && (
                      <button
                        onClick={() => handleDeleteRecord(activeRecord.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Record</span>
                      </button>
                    )}
                    <button
                      onClick={handleAddRecord}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Record</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View 3: SQL Query Runner */}
          {viewMode === 'queries' && (
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      SQL Query Console
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAskAIQuery}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 rounded-md font-semibold hover:bg-indigo-100"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Ask AI Query</span>
                    </button>
                    <button
                      onClick={executeQuery}
                      className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Execute</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={querySql}
                  onChange={(e) => setQuerySql(e.target.value)}
                  rows={4}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-lg border border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                  placeholder="SELECT * FROM Customers WHERE status = 'Active'"
                />

                {queryError && (
                  <div className="mt-2 text-xs text-red-500 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg border border-red-200 dark:border-red-900 font-mono">
                    {queryError}
                  </div>
                )}
              </div>

              {/* Query Results Data Table */}
              <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Results Output {queryResults ? `(${queryResults.rows.length} records)` : ''}
                  </span>
                </div>

                <div className="flex-1 overflow-auto">
                  {queryResults ? (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                        <tr>
                          {queryResults.columns.map((c) => (
                            <th key={c} className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {queryResults.rows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            {queryResults.columns.map((c) => (
                              <td key={c} className="px-4 py-2 text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800">
                                {String(row[c])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400">
                      Write an SQL query above and click "Execute" to view result sets.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* View 4: Schema Designer */}
          {viewMode === 'design' && currentTable && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                  <div>
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                      Table Schema: {currentTable.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Define field properties, data types, constraints, and validation rules.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowNewColumnModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Field</span>
                    </button>
                    {data.tables.length > 1 && (
                      <button
                        onClick={() => handleDeleteTable(currentTable.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-xs font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Table</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Field List Table */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300">Field Name</th>
                      <th className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300">Data Type</th>
                      <th className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300 text-center">Primary Key</th>
                      <th className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300 text-center">Required</th>
                      <th className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300">Options / Metadata</th>
                      <th className="px-4 py-2.5 text-center text-slate-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {currentTable.columns.map((col) => (
                      <tr key={col.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                          {col.name}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            {col.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {col.primaryKey ? (
                            <Key className="w-4 h-4 text-amber-500 mx-auto" />
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {col.required ? (
                            <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-[11px]">
                          {col.options ? col.options.join(', ') : 'None'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {!col.primaryKey && (
                            <button
                              onClick={() => handleDeleteColumn(col.id)}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1"
                              title="Delete Field"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* View 5: ER Relationships Diagram */}
          {viewMode === 'relationships' && (
            <div className="flex-1 p-8 overflow-auto bg-radial from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 flex flex-wrap gap-8 items-start justify-center">
              {data.tables.map((tbl) => (
                <div
                  key={tbl.id}
                  className="w-72 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden shrink-0"
                >
                  <div className="bg-red-600 px-4 py-2.5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <TableIcon className="w-4 h-4" />
                      <span className="font-bold text-xs">{tbl.name}</span>
                    </div>
                    <span className="text-[10px] font-mono bg-red-700/60 px-1.5 py-0.5 rounded">
                      {tbl.records.length} rows
                    </span>
                  </div>

                  <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800">
                    {tbl.columns.map((col) => (
                      <div key={col.id} className="py-1.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          {col.primaryKey && <Key className="w-3 h-3 text-amber-500" />}
                          <span className={col.primaryKey ? 'font-bold text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}>
                            {col.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {col.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Relationship connections overview card */}
              <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 mt-6">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Configured Foreign Key Relationships
                </h4>
                <div className="space-y-2">
                  {data.relationships.map((rel) => {
                    const fromTbl = data.tables.find((t) => t.id === rel.fromTableId);
                    const toTbl = data.tables.find((t) => t.id === rel.toTableId);
                    return (
                      <div key={rel.id} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{fromTbl?.name}</span>
                          <span className="text-slate-400 font-mono">({rel.fromColumnId})</span>
                          <span className="text-red-500 font-bold">──▶</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{toTbl?.name}</span>
                          <span className="text-slate-400 font-mono">({rel.toColumnId})</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {rel.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create New Table */}
      {showNewTableModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-4">
              Create New Database Table
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Table Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Invoices, Employees, Inventory"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Records of customer monthly invoices"
                  value={newTableDesc}
                  onChange={(e) => setNewTableDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowNewTableModal(false)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTable}
                className="px-4 py-2 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xs"
              >
                Create Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Field/Column */}
      {showNewColumnModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-4">
              Add Field to {currentTable?.name}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Field / Column Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Unit Price, Status, Billing Address"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Data Type
                </label>
                <select
                  value={newColType}
                  onChange={(e) => setNewColType(e.target.value as DbColumnType)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                >
                  <option value="text">Short Text</option>
                  <option value="number">Number</option>
                  <option value="currency">Currency ($)</option>
                  <option value="date">Date</option>
                  <option value="boolean">Boolean (Yes/No)</option>
                  <option value="select">Dropdown / Single Select</option>
                  <option value="email">Email Address</option>
                </select>
              </div>

              {newColType === 'select' && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Options (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., High, Medium, Low"
                    value={newColOptions}
                    onChange={(e) => setNewColOptions(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="req-checkbox"
                  checked={newColRequired}
                  onChange={(e) => setNewColRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                />
                <label htmlFor="req-checkbox" className="text-xs text-slate-700 dark:text-slate-300">
                  Required field
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowNewColumnModal(false)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddColumn}
                className="px-4 py-2 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xs"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

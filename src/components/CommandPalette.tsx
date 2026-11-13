import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  Table, 
  Presentation, 
  BookOpen, 
  Mail, 
  Database,
  FormInput, 
  Palette, 
  FileCheck, 
  HardDrive, 
  Plus, 
  Moon, 
  Sun, 
  LayoutGrid, 
  Sparkles,
  X,
  Clock,
  ExternalLink
} from 'lucide-react';
import { FileItem, OfficeAppId, FileType } from '../types/office';
import { AuraStorageService } from '../services/storage';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileItem[];
  onOpenFile: (file: FileItem) => void;
  onSwitchApp: (appId: OfficeAppId) => void;
  onCreateNew: (type: FileType) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenAI: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  files,
  onOpenFile,
  onSwitchApp,
  onCreateNew,
  theme,
  onToggleTheme,
  onOpenAI,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredFiles = useMemo(() => {
    if (!query.trim()) return files.slice(0, 5);
    const q = query.toLowerCase();
    return files.filter(f => f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q));
  }, [files, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search documents, sheets, slides..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Scrollable Command / Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Quick Create Actions */}
          {!query && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Create New
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1">
                <button
                  onClick={() => { onCreateNew('doc'); onClose(); }}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>New Document</span>
                </button>
                <button
                  onClick={() => { onCreateNew('sheet'); onClose(); }}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <Table className="w-4 h-4 text-emerald-500" />
                  <span>New Sheet</span>
                </button>
                <button
                  onClick={() => { onCreateNew('slide'); onClose(); }}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <Presentation className="w-4 h-4 text-amber-500" />
                  <span>New Presentation</span>
                </button>
                <button
                  onClick={() => { onCreateNew('database'); onClose(); }}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Database className="w-4 h-4 text-red-500" />
                  <span>New Database</span>
                </button>
              </div>
            </div>
          )}

          {/* Files section */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>{query ? 'Matching Files' : 'Recent Files'}</span>
              {!query && <Clock className="w-3 h-3 text-slate-400" />}
            </div>
            {filteredFiles.length > 0 ? (
              <div className="space-y-0.5">
                {filteredFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => { onOpenFile(file); onClose(); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {getFileIcon(file.type)}
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {file.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      {file.type}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-400">
                No matching files found for "{query}"
              </div>
            )}
          </div>

          {/* Suite Navigation Commands */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Applications & Tools
            </div>
            <div className="grid grid-cols-2 gap-1 p-1">
              <button
                onClick={() => { onSwitchApp('drive'); onClose(); }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
                <span>AuraDrive (Files)</span>
              </button>
              <button
                onClick={() => { onSwitchApp('mail'); onClose(); }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Mail className="w-3.5 h-3.5 text-sky-500" />
                <span>AuraMail (Inbox)</span>
              </button>
              <button
                onClick={() => { onSwitchApp('notes'); onClose(); }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                <span>AuraNotes (Notebooks)</span>
              </button>
              <button
                onClick={() => { onSwitchApp('database'); onClose(); }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Database className="w-3.5 h-3.5 text-red-500" />
                <span>AuraDatabase (Access)</span>
              </button>
              <button
                onClick={() => { onSwitchApp('forms'); onClose(); }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <FormInput className="w-3.5 h-3.5 text-teal-500" />
                <span>AuraForms (Surveys)</span>
              </button>
              <button
                onClick={() => { onSwitchApp('design'); onClose(); }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Palette className="w-3.5 h-3.5 text-pink-500" />
                <span>AuraDesign (Graphics)</span>
              </button>
              <button
                onClick={() => { onSwitchApp('pdf'); onClose(); }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <FileCheck className="w-3.5 h-3.5 text-red-500" />
                <span>AuraPDF (Tools)</span>
              </button>
              <button
                onClick={() => { onSwitchApp('templates'); onClose(); }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-amber-500" />
                <span>Templates Gallery</span>
              </button>
              <button
                onClick={() => { onToggleTheme(); }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer shortcuts tip */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono">↑↓</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono">Enter</kbd>
          </div>
          <button 
            onClick={() => { onOpenAI(); onClose(); }}
            className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            <Sparkles className="w-3 h-3" />
            Launch Aura AI
          </button>
        </div>
      </div>
    </div>
  );
}

function getFileIcon(type: string) {
  switch (type) {
    case 'doc':
      return <FileText className="w-4 h-4 text-blue-500" />;
    case 'sheet':
      return <Table className="w-4 h-4 text-emerald-500" />;
    case 'slide':
      return <Presentation className="w-4 h-4 text-amber-500" />;
    case 'note':
      return <BookOpen className="w-4 h-4 text-purple-500" />;
    case 'database':
      return <Database className="w-4 h-4 text-red-500" />;
    case 'form':
      return <FormInput className="w-4 h-4 text-teal-500" />;
    case 'design':
      return <Palette className="w-4 h-4 text-pink-500" />;
    case 'pdf':
      return <FileCheck className="w-4 h-4 text-red-500" />;
    default:
      return <FileText className="w-4 h-4 text-slate-400" />;
  }
}

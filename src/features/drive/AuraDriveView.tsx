import { useState, useMemo } from 'react';
import { 
  HardDrive, 
  Grid, 
  List as ListIcon, 
  Search, 
  Plus, 
  FolderPlus, 
  Upload, 
  FileText, 
  Table, 
  Presentation, 
  BookOpen, 
  FormInput, 
  Palette, 
  FileCheck, 
  Star, 
  Trash2, 
  Clock, 
  MoreVertical, 
  Download, 
  Edit2, 
  Check, 
  Folder, 
  ChevronRight,
  ArrowUpDown,
  Filter,
  Sparkles
} from 'lucide-react';
import { FileItem, FileType, OfficeAppId } from '../../types/office';
import { AuraStorageService } from '../../services/storage';

interface AuraDriveViewProps {
  files: FileItem[];
  activeNavTab: string;
  onOpenFile: (file: FileItem) => void;
  onCreateNewFile: (type: FileType) => void;
  onRefreshFiles: () => void;
  onOpenAI: (contextText?: string) => void;
}

export function AuraDriveView({
  files,
  activeNavTab,
  onOpenFile,
  onCreateNewFile,
  onRefreshFiles,
  onOpenAI,
}: AuraDriveViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'name' | 'size'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // Rename modal
  const [renamingFile, setRenamingFile] = useState<FileItem | null>(null);
  const [renameInput, setRenameInput] = useState('');

  // Context menu / active file dropdown
  const [openMenuFileId, setOpenMenuFileId] = useState<string | null>(null);

  // Filter and sort files
  const displayedFiles = useMemo(() => {
    return files
      .filter((f) => {
        // Tab check
        if (activeNavTab === 'trash') {
          if (!f.isTrash) return false;
        } else {
          if (f.isTrash) return false;
          if (activeNavTab === 'favorites' && !f.isStarred) return false;
          if (activeNavTab === 'recent') {
            // Recent files
          }
        }

        // Folder check
        if (activeNavTab === 'drive' || activeNavTab === 'home') {
          if (f.parentId !== currentFolderId) return false;
        }

        // Type filter
        if (filterType !== 'all' && f.type !== filterType) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q);
        }

        return true;
      })
      .sort((a, b) => {
        // Folders always first
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;

        let diff = 0;
        if (sortBy === 'name') {
          diff = a.name.localeCompare(b.name);
        } else if (sortBy === 'size') {
          diff = a.sizeBytes - b.sizeBytes;
        } else {
          diff = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        return sortOrder === 'asc' ? -diff : diff;
      });
  }, [files, activeNavTab, currentFolderId, filterType, searchQuery, sortBy, sortOrder]);

  const handleToggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    AuraStorageService.toggleStar(id);
    onRefreshFiles();
  };

  const handleTrashFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    AuraStorageService.moveToTrash(id);
    onRefreshFiles();
  };

  const handleRestoreFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    AuraStorageService.restoreFromTrash(id);
    onRefreshFiles();
  };

  const handlePermanentDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Permanently delete this file? This action cannot be undone.')) {
      AuraStorageService.permanentlyDelete(id);
      onRefreshFiles();
    }
  };

  const handleStartRename = (e: React.MouseEvent, file: FileItem) => {
    e.stopPropagation();
    setRenamingFile(file);
    setRenameInput(file.name);
    setOpenMenuFileId(null);
  };

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingFile || !renameInput.trim()) return;
    AuraStorageService.renameFile(renamingFile.id, renameInput.trim());
    setRenamingFile(null);
    onRefreshFiles();
  };

  // Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    const ext = uploadedFile.name.split('.').pop()?.toLowerCase();
    let type: FileType = 'doc';
    if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') type = 'sheet';
    else if (ext === 'pptx' || ext === 'ppt') type = 'slide';
    else if (ext === 'pdf') type = 'pdf';

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      const newFile = AuraStorageService.createFile(uploadedFile.name, type, currentFolderId);

      if (type === 'doc') {
        AuraStorageService.saveDocContent({
          id: newFile.id,
          title: uploadedFile.name,
          pageSize: 'Letter',
          orientation: 'portrait',
          margins: { top: 25, right: 25, bottom: 25, left: 25 },
          includePageNumbers: true,
          version: 1,
          updatedAt: new Date().toISOString(),
          htmlContent: `<p>${text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`,
        });
      }
      onRefreshFiles();
    };
    reader.readAsText(uploadedFile);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950 overflow-hidden select-none">
      {/* 1. Top Controls Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 z-10">
        {/* Left: View title & Breadcrumbs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold text-base text-slate-900 dark:text-slate-100">
            <HardDrive className="w-5 h-5 text-indigo-600" />
            <span className="capitalize">{activeNavTab === 'drive' ? 'My Files' : activeNavTab}</span>
          </div>

          {currentFolderId && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <ChevronRight className="w-3.5 h-3.5" />
              <button
                onClick={() => setCurrentFolderId(null)}
                className="hover:underline text-indigo-600"
              >
                Root
              </button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Current Folder</span>
            </div>
          )}
        </div>

        {/* Middle: Search input */}
        <div className="flex-1 max-w-md relative min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, sheets, slides, forms..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Right: Filters, Sorter, View toggle, Upload */}
        <div className="flex items-center gap-2">
          {/* File type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="all">All Types</option>
            <option value="doc">Documents (AuraWrite)</option>
            <option value="sheet">Spreadsheets (AuraSheets)</option>
            <option value="slide">Presentations (AuraSlides)</option>
            <option value="note">Notes (AuraNotes)</option>
            <option value="form">Forms (AuraForms)</option>
            <option value="design">Designs (AuraDesign)</option>
            <option value="folder">Folders</option>
          </select>

          {/* Sorter */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>

          {/* View mode toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs' : 'text-slate-400'}`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs' : 'text-slate-400'}`}
              title="List View"
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Upload Button */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-semibold cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* 2. Main Files Grid or List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {displayedFiles.length > 0 ? (
          viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {displayedFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => {
                    if (file.type === 'folder') {
                      setCurrentFolderId(file.id);
                    } else {
                      onOpenFile(file);
                    }
                  }}
                  className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer flex flex-col justify-between relative"
                >
                  {/* Top card bar: File Icon + Star + Options */}
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:scale-105 transition-transform">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleToggleStar(e, file.id)}
                        className={`p-1 rounded-md transition-colors ${
                          file.isStarred ? 'text-amber-400 fill-current' : 'text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100'
                        }`}
                        title="Star File"
                      >
                        <Star className={`w-4 h-4 ${file.isStarred ? 'fill-current' : ''}`} />
                      </button>

                      {/* Dropdown menu trigger */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuFileId(openMenuFileId === file.id ? null : file.id);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {openMenuFileId === file.id && (
                    <div
                      className="absolute right-3 top-12 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-30 text-xs animate-in fade-in zoom-in-95"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => handleStartRename(e, file)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-left"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Rename</span>
                      </button>
                      {file.isTrash ? (
                        <>
                          <button
                            onClick={(e) => handleRestoreFile(e, file.id)}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 text-left"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Restore File</span>
                          </button>
                          <button
                            onClick={(e) => handlePermanentDelete(e, file.id)}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-red-600 text-left"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Forever</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => handleTrashFile(e, file.id)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-red-600 text-left"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Move to Trash</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* File Name & Details */}
                  <div className="mt-4">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {file.name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-mono">
                      <span>{new Date(file.updatedAt).toLocaleDateString()}</span>
                      <span>{formatBytes(file.sizeBytes)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Last Modified</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {displayedFiles.map((file) => (
                    <tr
                      key={file.id}
                      onClick={() => {
                        if (file.type === 'folder') setCurrentFolderId(file.id);
                        else onOpenFile(file);
                      }}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 flex items-center gap-3 font-semibold text-slate-900 dark:text-slate-100">
                        {getFileIcon(file.type)}
                        <span className="truncate max-w-xs">{file.name}</span>
                        {file.isStarred && <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />}
                      </td>
                      <td className="py-3 px-4 text-slate-500 uppercase font-mono text-[10px]">
                        {file.type}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {file.ownerName}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono">
                        {new Date(file.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono">
                        {formatBytes(file.sizeBytes)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => handleTrashFile(e, file.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <HardDrive className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">No files found</h4>
            <p className="text-xs text-slate-400">Create a new document or upload existing files to get started.</p>
          </div>
        )}
      </div>

      {/* Rename File Modal */}
      {renamingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleSaveRename}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3"
          >
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Rename File</h4>
            <input
              type="text"
              autoFocus
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRenamingFile(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function getFileIcon(type: FileType) {
  switch (type) {
    case 'doc':
      return <FileText className="w-4 h-4 text-blue-500" />;
    case 'sheet':
      return <Table className="w-4 h-4 text-emerald-500" />;
    case 'slide':
      return <Presentation className="w-4 h-4 text-amber-500" />;
    case 'note':
      return <BookOpen className="w-4 h-4 text-purple-500" />;
    case 'form':
      return <FormInput className="w-4 h-4 text-teal-500" />;
    case 'design':
      return <Palette className="w-4 h-4 text-pink-500" />;
    case 'pdf':
      return <FileCheck className="w-4 h-4 text-red-500" />;
    case 'folder':
      return <Folder className="w-4 h-4 text-amber-400 fill-current" />;
    default:
      return <FileText className="w-4 h-4 text-slate-400" />;
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

import { useState } from 'react';
import { 
  Plus, 
  Home, 
  HardDrive, 
  Clock, 
  Users, 
  Star, 
  Trash2, 
  LayoutGrid, 
  FileText, 
  Table, 
  Presentation, 
  BookOpen, 
  Mail, 
  Database,
  FormInput, 
  Palette, 
  FileCheck, 
  Shield, 
  Settings, 
  ChevronRight,
  Upload,
  Layers,
  GraduationCap
} from 'lucide-react';
import { OfficeAppId, FileType, UserRole } from '../types/office';

interface GlobalSidebarProps {
  currentApp: OfficeAppId;
  activeNavTab: string;
  onSelectNavTab: (tab: string) => void;
  onSwitchApp: (app: OfficeAppId) => void;
  onCreateNewFile: (type: FileType) => void;
  userRole: UserRole;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function GlobalSidebar({
  currentApp,
  activeNavTab,
  onSelectNavTab,
  onSwitchApp,
  onCreateNewFile,
  userRole,
  isCollapsed,
  onToggleCollapse,
}: GlobalSidebarProps) {
  const [showNewMenu, setShowNewMenu] = useState(false);

  return (
    <aside 
      className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transition-all duration-200 z-20 select-none ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top New Button */}
      <div className="p-3 relative">
        <button
          onClick={() => setShowNewMenu(!showNewMenu)}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all group ${
            isCollapsed ? 'px-0' : 'px-4'
          }`}
          title="Create New Document or File"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          {!isCollapsed && <span>New</span>}
        </button>

        {/* New Item Dropdown Menu */}
        {showNewMenu && (
          <div 
            className="absolute left-3 top-14 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
            onClick={() => setShowNewMenu(false)}
          >
            <button
              onClick={() => onCreateNewFile('doc')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 rounded-lg transition-colors text-left"
            >
              <FileText className="w-4 h-4 text-blue-500" />
              <span>AuraWrite Document</span>
            </button>
            <button
              onClick={() => onCreateNewFile('sheet')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 rounded-lg transition-colors text-left"
            >
              <Table className="w-4 h-4 text-emerald-500" />
              <span>AuraSheets Spreadsheet</span>
            </button>
            <button
              onClick={() => onCreateNewFile('slide')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600 rounded-lg transition-colors text-left"
            >
              <Presentation className="w-4 h-4 text-amber-500" />
              <span>AuraSlides Presentation</span>
            </button>
            <button
              onClick={() => onCreateNewFile('note')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 rounded-lg transition-colors text-left"
            >
              <BookOpen className="w-4 h-4 text-purple-500" />
              <span>AuraNotes Notebook</span>
            </button>
            <button
              onClick={() => onCreateNewFile('database')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 rounded-lg transition-colors text-left"
            >
              <Database className="w-4 h-4 text-red-500" />
              <span>AuraDatabase (Access)</span>
            </button>
            <button
              onClick={() => onCreateNewFile('form')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-600 rounded-lg transition-colors text-left"
            >
              <FormInput className="w-4 h-4 text-teal-500" />
              <span>AuraForms Survey</span>
            </button>
            <button
              onClick={() => onCreateNewFile('design')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-pink-50 dark:hover:bg-pink-950/40 hover:text-pink-600 rounded-lg transition-colors text-left"
            >
              <Palette className="w-4 h-4 text-pink-500" />
              <span>AuraDesign Graphic</span>
            </button>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
            <button
              onClick={() => onCreateNewFile('folder')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
            >
              <HardDrive className="w-4 h-4 text-slate-400" />
              <span>New Folder</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4">
        {/* Core Storage Navigation */}
        <div className="space-y-0.5">
          <NavItem
            icon={<Home className="w-4 h-4" />}
            label="Home"
            active={activeNavTab === 'home'}
            onClick={() => onSelectNavTab('home')}
            collapsed={isCollapsed}
          />
          <NavItem
            icon={<HardDrive className="w-4 h-4" />}
            label="My Files (Drive)"
            active={activeNavTab === 'drive' || currentApp === 'drive'}
            onClick={() => {
              onSelectNavTab('drive');
              onSwitchApp('drive');
            }}
            collapsed={isCollapsed}
          />
          <NavItem
            icon={<Clock className="w-4 h-4" />}
            label="Recent"
            active={activeNavTab === 'recent'}
            onClick={() => onSelectNavTab('recent')}
            collapsed={isCollapsed}
          />
          <NavItem
            icon={<Users className="w-4 h-4" />}
            label="Shared With Me"
            active={activeNavTab === 'shared'}
            onClick={() => onSelectNavTab('shared')}
            collapsed={isCollapsed}
          />
          <NavItem
            icon={<Star className="w-4 h-4" />}
            label="Favorites"
            active={activeNavTab === 'favorites'}
            onClick={() => onSelectNavTab('favorites')}
            collapsed={isCollapsed}
          />
          <NavItem
            icon={<Trash2 className="w-4 h-4" />}
            label="Trash"
            active={activeNavTab === 'trash'}
            onClick={() => onSelectNavTab('trash')}
            collapsed={isCollapsed}
          />
          <NavItem
            icon={<LayoutGrid className="w-4 h-4" />}
            label="Templates"
            active={activeNavTab === 'templates' || currentApp === 'templates'}
            onClick={() => {
              onSelectNavTab('templates');
              onSwitchApp('templates');
            }}
            collapsed={isCollapsed}
          />
        </div>

        {/* Dedicated Productivity Apps Section */}
        <div>
          {!isCollapsed && (
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Applications
            </div>
          )}
          <div className="space-y-0.5 mt-1">
            <NavItem
              icon={<FileText className="w-4 h-4 text-blue-500" />}
              label="AuraWrite"
              active={currentApp === 'write'}
              onClick={() => onSwitchApp('write')}
              collapsed={isCollapsed}
            />
            <NavItem
              icon={<Table className="w-4 h-4 text-emerald-500" />}
              label="AuraSheets"
              active={currentApp === 'sheets'}
              onClick={() => onSwitchApp('sheets')}
              collapsed={isCollapsed}
            />
            <NavItem
              icon={<Presentation className="w-4 h-4 text-amber-500" />}
              label="AuraSlides"
              active={currentApp === 'slides'}
              onClick={() => onSwitchApp('slides')}
              collapsed={isCollapsed}
            />
            <NavItem
              icon={<BookOpen className="w-4 h-4 text-purple-500" />}
              label="AuraNotes"
              active={currentApp === 'notes'}
              onClick={() => onSwitchApp('notes')}
              collapsed={isCollapsed}
            />
            <NavItem
              icon={<Mail className="w-4 h-4 text-sky-500" />}
              label="AuraMail"
              active={currentApp === 'mail'}
              onClick={() => onSwitchApp('mail')}
              collapsed={isCollapsed}
            />
            <NavItem
              icon={<Database className="w-4 h-4 text-red-500" />}
              label="AuraDatabase"
              active={currentApp === 'database'}
              onClick={() => onSwitchApp('database')}
              collapsed={isCollapsed}
            />
            <NavItem
              icon={<FormInput className="w-4 h-4 text-teal-500" />}
              label="AuraForms"
              active={currentApp === 'forms'}
              onClick={() => onSwitchApp('forms')}
              collapsed={isCollapsed}
            />
            <NavItem
              icon={<Palette className="w-4 h-4 text-pink-500" />}
              label="AuraDesign"
              active={currentApp === 'design'}
              onClick={() => onSwitchApp('design')}
              collapsed={isCollapsed}
            />
            <NavItem
              icon={<FileCheck className="w-4 h-4 text-red-500" />}
              label="AuraPDF"
              active={currentApp === 'pdf'}
              onClick={() => onSwitchApp('pdf')}
              collapsed={isCollapsed}
            />
          </div>
        </div>

        {/* Administration / Enterprise */}
        <div>
          {!isCollapsed && (
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Management
            </div>
          )}
          <div className="space-y-0.5 mt-1">
            <NavItem
              icon={<Shield className="w-4 h-4 text-indigo-500" />}
              label="Admin & Education"
              active={currentApp === 'admin' || activeNavTab === 'admin'}
              onClick={() => {
                onSelectNavTab('admin');
                onSwitchApp('admin');
              }}
              collapsed={isCollapsed}
            />
            <NavItem
              icon={<Settings className="w-4 h-4 text-slate-400" />}
              label="Settings"
              active={currentApp === 'settings' || activeNavTab === 'settings'}
              onClick={() => {
                onSelectNavTab('settings');
                onSwitchApp('settings');
              }}
              collapsed={isCollapsed}
            />
          </div>
        </div>
      </div>

      {/* Bottom Collapse Toggle */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${!isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  collapsed,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
        active
          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
      } ${collapsed ? 'justify-center px-0' : ''}`}
      title={collapsed ? label : undefined}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}

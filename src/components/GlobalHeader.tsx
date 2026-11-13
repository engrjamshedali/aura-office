import { useState } from 'react';
import { 
  Sparkles, 
  Share2, 
  MessageSquare, 
  Undo2, 
  Redo2, 
  Moon, 
  Sun, 
  Check, 
  Cloud, 
  CloudOff, 
  Loader2, 
  User as UserIcon, 
  LogOut, 
  Shield, 
  Settings, 
  GraduationCap, 
  Copy, 
  X,
  Search,
  ChevronDown
} from 'lucide-react';
import { OfficeAppId, User, UserRole } from '../types/office';

interface GlobalHeaderProps {
  appId: OfficeAppId;
  fileName: string;
  onRenameFile?: (newName: string) => void;
  saveStatus: 'saved' | 'saving' | 'offline' | 'restored';
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onToggleAI: () => void;
  onToggleComments?: () => void;
  unreadCommentsCount?: number;
  user: User;
  onUpdateUserRole: (role: UserRole) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
  onNavigateHome: () => void;
}

export function GlobalHeader({
  appId,
  fileName,
  onRenameFile,
  saveStatus,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onToggleAI,
  onToggleComments,
  unreadCommentsCount = 0,
  user,
  onUpdateUserRole,
  theme,
  onToggleTheme,
  onOpenCommandPalette,
  onNavigateHome,
}: GlobalHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(fileName);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [collaborators, setCollaborators] = useState([
    { email: 'alex.rivera@auraoffice.io', role: 'Owner' },
    { email: 'evelyn.reed@apexlabs.org', role: 'Editor' },
    { email: 'marcus.vance@auracloud.net', role: 'Viewer' }
  ]);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && onRenameFile) {
      onRenameFile(titleInput.trim());
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setCollaborators([...collaborators, { email: inviteEmail.trim(), role: 'Editor' }]);
    setInviteEmail('');
  };

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Suite Logo + Document Title + Save Status */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 focus:outline-none group"
          title="Return to AuraOffice Hub"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-sm tracking-tighter">AO</span>
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100 hidden md:inline-block">
            AuraOffice
          </span>
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

        {/* File Name Editor */}
        <div className="flex items-center gap-2 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              autoFocus
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setTitleInput(fileName);
                  setIsEditingTitle(false);
                }
              }}
              className="px-2 py-0.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 rounded border border-indigo-400 focus:outline-none"
            />
          ) : (
            <button
              onClick={() => {
                setTitleInput(fileName);
                setIsEditingTitle(true);
              }}
              className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors truncate max-w-[140px] sm:max-w-xs text-left"
              title="Click to rename document"
            >
              {fileName || 'Untitled Document'}
            </button>
          )}

          {/* Save Status Badge */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {saveStatus === 'saving' && (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1 text-slate-400">
                <Check className="w-3 h-3 text-emerald-500" />
                Saved
              </span>
            )}
            {saveStatus === 'offline' && (
              <span className="flex items-center gap-1 text-amber-500">
                <CloudOff className="w-3 h-3" />
                Offline
              </span>
            )}
            {saveStatus === 'restored' && (
              <span className="flex items-center gap-1 text-blue-500">
                <Cloud className="w-3 h-3" />
                Changes restored
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Middle: Undo / Redo + Quick Search trigger */}
      <div className="flex items-center gap-1 sm:gap-2">
        {onUndo && (
          <div className="hidden md:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 transition-colors"
          title="Search or commands (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden lg:inline text-[10px] font-mono px-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Share, Comments, AI, Theme, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Share Button */}
        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
          title="Share document and manage permissions"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Comments Button */}
        {onToggleComments && (
          <button
            onClick={onToggleComments}
            className="relative p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Comments & Annotations"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadCommentsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {unreadCommentsCount}
              </span>
            )}
          </button>
        )}

        {/* Aura AI Copilot Button */}
        <button
          onClick={onToggleAI}
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/30 hover:opacity-90 transition-opacity"
          title="Open Aura AI Copilot"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Aura AI</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Account & Role settings"
          >
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div 
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User info */}
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  <div className="text-[10px] uppercase font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {user.role.replace('_', ' ')} • {user.organization}
                  </div>
                </div>
              </div>

              {/* Role Switcher */}
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Active Mode / Role
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['user', 'admin', 'org_admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onUpdateUserRole(r);
                        setShowUserDropdown(false);
                      }}
                      className={`px-1.5 py-1 rounded text-[11px] font-medium text-center capitalize transition-colors ${
                        user.role === r
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {r === 'org_admin' ? 'Org Admin' : r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Cloud Storage</span>
                  <span className="font-mono">
                    {Math.round(user.storageUsedBytes / 1024 / 1024)} MB / {Math.round(user.storageLimitBytes / 1024 / 1024 / 1024)} GB
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${Math.min(100, (user.storageUsedBytes / user.storageLimitBytes) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setShowUserDropdown(false)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onNavigateHome();
                  }}
                  className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:underline"
                >
                  <LogOut className="w-3 h-3" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Document Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Share "{fileName}"</h3>
                  <p className="text-xs text-slate-400">Collaborate securely with team members</p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Invite Form */}
            <form onSubmit={handleAddCollaborator} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter collaborator email..."
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Invite
              </button>
            </form>

            {/* Collaborators List */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                People with access
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {collaborators.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{c.email}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                      {c.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy Link Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={handleCopyShareLink}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {linkCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {linkCopied ? 'Link Copied to Clipboard!' : 'Copy Document Link'}
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

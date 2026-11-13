import { useState } from 'react';
import { 
  Settings, 
  User, 
  Moon, 
  Sun, 
  HardDrive, 
  Download, 
  RotateCcw, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Globe 
} from 'lucide-react';
import { AuraStorageService } from '../../services/storage';

interface SettingsViewProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function SettingsView({ darkMode, onToggleDarkMode }: SettingsViewProps) {
  const [userName, setUserName] = useState('Alex Rivera');
  const [userEmail, setUserEmail] = useState('alex.rivera@auraoffice.io');
  const [autoSaveInterval, setAutoSaveInterval] = useState('1000');
  const [defaultFont, setDefaultFont] = useState('Inter');
  const [aiSystemPrompt, setAiSystemPrompt] = useState('Executive Assistant and Research Partner');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportWorkspace = () => {
    const backup = {
      files: AuraStorageService.getFiles(),
      notes: AuraStorageService.getNotes(),
      emails: AuraStorageService.getEmails(),
      exportDate: new Date().toISOString(),
      platform: 'AuraOffice Enterprise Suite',
    };
    AuraStorageService.downloadFile('AuraOffice_Workspace_Backup.json', JSON.stringify(backup, null, 2), 'application/json');
  };

  const handleResetData = () => {
    if (confirm('Reset workspace to factory default templates? All unsaved custom notes and files will be re-seeded.')) {
      AuraStorageService.resetSeedData();
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950 select-none">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Suite Settings & Preferences
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure appearance, storage management, defaults, and AI assistant behavior.
          </p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-5">
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">User Profile</h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                AR
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{userName}</h4>
                <p className="text-xs text-slate-400">{userEmail}</p>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  Enterprise License
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Appearance & Workspace Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sun className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Display & Typography</h3>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">Dark Mode</div>
                <div className="text-[11px] text-slate-400">Toggle dark luxury theme across all editors</div>
              </div>
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
                <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Default Document Font
                </label>
                <select
                  value={defaultFont}
                  onChange={(e) => setDefaultFont(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                >
                  <option value="Inter">Inter (Modern Clean)</option>
                  <option value="Georgia">Georgia (Editorial Serif)</option>
                  <option value="JetBrains Mono">JetBrains Mono (Technical)</option>
                  <option value="Arial">Arial (Standard Sans)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Auto-Save Delay
                </label>
                <select
                  value={autoSaveInterval}
                  onChange={(e) => setAutoSaveInterval(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                >
                  <option value="500">Realtime (500 ms)</option>
                  <option value="1000">Standard (1 second)</option>
                  <option value="3000">Relaxed (3 seconds)</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Intelligence Assistant Config */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Aura AI Persona</h3>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Custom Assistant Role & Tone
              </label>
              <input
                type="text"
                value={aiSystemPrompt}
                onChange={(e) => setAiSystemPrompt(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                placeholder="e.g. Senior Financial Analyst or Legal Specialist"
              />
            </div>
          </div>

          {/* Storage & Reset */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <HardDrive className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Data Management</h3>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">Export All Workspace Data</div>
                <div className="text-[11px] text-slate-400">Download complete JSON archive of all docs, sheets, notes, and emails</div>
              </div>
              <button
                type="button"
                onClick={handleExportWorkspace}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Backup</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <div className="font-semibold text-xs text-red-600">Reset Demo Data</div>
                <div className="text-[11px] text-slate-400">Restore default demo templates and sample files</div>
              </div>
              <button
                type="button"
                onClick={handleResetData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-xs font-semibold text-red-600"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {isSaved && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-4 h-4" /> Preferences saved
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

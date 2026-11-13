import { useState, useEffect, useCallback } from 'react';
import { OfficeAppId, FileItem, FileType, User, UserRole } from './types/office';
import { AuraStorageService } from './services/storage';

// Global Navigation & Components
import { GlobalHeader } from './components/GlobalHeader';
import { GlobalSidebar } from './components/GlobalSidebar';
import { CommandPalette } from './components/CommandPalette';
import { AuraAIPanel } from './features/ai/AuraAIPanel';

// 10 Suite Applications
import { AuraWriteEditor } from './features/writer/AuraWriteEditor';
import { AuraSheetsEditor } from './features/sheets/AuraSheetsEditor';
import { AuraSlidesEditor } from './features/slides/AuraSlidesEditor';
import { AuraNotesView } from './features/notes/AuraNotesView';
import { AuraMailView } from './features/mail/AuraMailView';
import { AuraFormsView } from './features/forms/AuraFormsView';
import { AuraDesignView } from './features/design/AuraDesignView';
import { AuraPdfView } from './features/pdf/AuraPdfView';
import { AuraDatabaseView } from './features/database/AuraDatabaseView';
import { AuraDriveView } from './features/drive/AuraDriveView';
import { TemplatesGalleryView } from './features/templates/TemplatesGalleryView';
import { SettingsView } from './features/settings/SettingsView';

export default function App() {
  // 1. Core State
  const [files, setFiles] = useState<FileItem[]>(() => AuraStorageService.getFiles());
  const [currentApp, setCurrentApp] = useState<OfficeAppId>('drive');
  const [activeNavTab, setActiveNavTab] = useState<string>('drive');
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [user, setUser] = useState<User>(() => AuraStorageService.getUser());
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'offline' | 'restored'>('saved');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // AI Panel & Command Palette state
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [aiContextText, setAIContextText] = useState<string>('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Sync theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Refresh files from storage
  const refreshFiles = useCallback(() => {
    setFiles(AuraStorageService.getFiles());
  }, []);

  // Keyboard Shortcuts: Ctrl+K (Command Palette), Ctrl+J (AI), Ctrl+S (Save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsAIOpen((prev) => !prev);
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setSaveStatus('saving');
        setTimeout(() => setSaveStatus('saved'), 400);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Open a file into its native editor
  const handleOpenFile = useCallback((file: FileItem) => {
    setCurrentFile(file);
    AuraStorageService.touchFile(file.id);
    refreshFiles();

    switch (file.type) {
      case 'doc':
        setCurrentApp('write');
        setActiveNavTab('write');
        break;
      case 'sheet':
        setCurrentApp('sheets');
        setActiveNavTab('sheets');
        break;
      case 'slide':
        setCurrentApp('slides');
        setActiveNavTab('slides');
        break;
      case 'note':
        setCurrentApp('notes');
        setActiveNavTab('notes');
        break;
      case 'database':
        setCurrentApp('database');
        setActiveNavTab('database');
        break;
      case 'form':
        setCurrentApp('forms');
        setActiveNavTab('forms');
        break;
      case 'design':
        setCurrentApp('design');
        setActiveNavTab('design');
        break;
      case 'pdf':
        setCurrentApp('pdf');
        setActiveNavTab('pdf');
        break;
      default:
        setCurrentApp('drive');
        setActiveNavTab('drive');
        break;
    }
  }, [refreshFiles]);

  // Create new file and open it
  const handleCreateNewFile = useCallback((type: FileType) => {
    const defaultNames: Record<FileType, string> = {
      doc: 'Untitled Document',
      sheet: 'Untitled Spreadsheet',
      slide: 'Untitled Presentation',
      note: 'Untitled Note',
      database: 'Operations Relational Database',
      form: 'Untitled Survey',
      design: 'Untitled Graphic',
      pdf: 'Imported Document.pdf',
      folder: 'New Folder',
    };

    const newFile = AuraStorageService.createFile(defaultNames[type] || 'Untitled', type);
    refreshFiles();
    handleOpenFile(newFile);
  }, [handleOpenFile, refreshFiles]);

  // Switch app via sidebar or palette
  const handleSwitchApp = useCallback((appId: OfficeAppId) => {
    setCurrentApp(appId);
    setActiveNavTab(appId);

    // If switching to standalone apps (mail, notes, forms, design, pdf, database), find or prepare file
    if (appId === 'mail') {
      setCurrentFile(null);
    } else if (appId === 'notes') {
      const noteFiles = files.filter((f) => f.type === 'note' && !f.isTrash);
      if (noteFiles.length > 0) setCurrentFile(noteFiles[0]);
    } else if (appId === 'database') {
      const dbFiles = files.filter((f) => f.type === 'database' && !f.isTrash);
      if (dbFiles.length > 0 && !currentFile) setCurrentFile(dbFiles[0]);
      else if (!currentFile || currentFile.type !== 'database') handleCreateNewFile('database');
    } else if (appId === 'write') {
      const docFiles = files.filter((f) => f.type === 'doc' && !f.isTrash);
      if (docFiles.length > 0 && !currentFile) setCurrentFile(docFiles[0]);
      else if (!currentFile || currentFile.type !== 'doc') handleCreateNewFile('doc');
    } else if (appId === 'sheets') {
      const sheetFiles = files.filter((f) => f.type === 'sheet' && !f.isTrash);
      if (sheetFiles.length > 0 && !currentFile) setCurrentFile(sheetFiles[0]);
      else if (!currentFile || currentFile.type !== 'sheet') handleCreateNewFile('sheet');
    } else if (appId === 'slides') {
      const slideFiles = files.filter((f) => f.type === 'slide' && !f.isTrash);
      if (slideFiles.length > 0 && !currentFile) setCurrentFile(slideFiles[0]);
      else if (!currentFile || currentFile.type !== 'slide') handleCreateNewFile('slide');
    } else if (appId === 'forms') {
      const formFiles = files.filter((f) => f.type === 'form' && !f.isTrash);
      if (formFiles.length > 0 && !currentFile) setCurrentFile(formFiles[0]);
      else if (!currentFile || currentFile.type !== 'form') handleCreateNewFile('form');
    } else if (appId === 'design') {
      const designFiles = files.filter((f) => f.type === 'design' && !f.isTrash);
      if (designFiles.length > 0 && !currentFile) setCurrentFile(designFiles[0]);
      else if (!currentFile || currentFile.type !== 'design') handleCreateNewFile('design');
    } else if (appId === 'pdf') {
      const pdfFiles = files.filter((f) => f.type === 'pdf' && !f.isTrash);
      if (pdfFiles.length > 0) setCurrentFile(pdfFiles[0]);
    } else if (appId === 'drive') {
      setCurrentFile(null);
    }
  }, [files, currentFile, handleCreateNewFile]);

  // Sidebar navigation tabs
  const handleSelectNavTab = (tab: string) => {
    setActiveNavTab(tab);
    if (['home', 'drive', 'recent', 'favorites', 'trash'].includes(tab)) {
      setCurrentApp('drive');
      setCurrentFile(null);
    } else if (tab === 'templates') {
      setCurrentApp('drive');
      setCurrentFile(null);
    } else if (tab === 'settings') {
      setCurrentApp('drive');
      setCurrentFile(null);
    } else {
      handleSwitchApp(tab as OfficeAppId);
    }
  };

  // Trigger AI assistant with context
  const handleOpenAIWithContext = (contextText?: string) => {
    if (contextText) setAIContextText(contextText);
    setIsAIOpen(true);
  };

  // Rename current active file
  const handleRenameCurrentFile = (newName: string) => {
    if (!currentFile) return;
    AuraStorageService.renameFile(currentFile.id, newName);
    setCurrentFile({ ...currentFile, name: newName });
    refreshFiles();
  };

  // Render the appropriate main workspace view
  const renderWorkspaceContent = () => {
    // 1. Templates Gallery
    if (activeNavTab === 'templates') {
      return (
        <TemplatesGalleryView
          onOpenFile={handleOpenFile}
          onRefreshFiles={refreshFiles}
        />
      );
    }

    // 2. Settings View
    if (activeNavTab === 'settings') {
      return (
        <SettingsView
          darkMode={theme === 'dark'}
          onToggleDarkMode={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        />
      );
    }

    // 3. AuraDrive / File Manager
    if (currentApp === 'drive' || ['home', 'drive', 'recent', 'favorites', 'trash'].includes(activeNavTab)) {
      return (
        <AuraDriveView
          files={files}
          activeNavTab={activeNavTab}
          onOpenFile={handleOpenFile}
          onCreateNewFile={handleCreateNewFile}
          onRefreshFiles={refreshFiles}
          onOpenAI={handleOpenAIWithContext}
        />
      );
    }

    // 4. AuraWrite (Word Processor)
    if (currentApp === 'write' && currentFile) {
      const docContent = AuraStorageService.getDocContent(currentFile.id);
      return (
        <AuraWriteEditor
          doc={docContent}
          onSave={(updatedDoc) => {
            setSaveStatus('saving');
            AuraStorageService.saveDocContent(updatedDoc);
            setTimeout(() => setSaveStatus('saved'), 300);
          }}
          onOpenAI={handleOpenAIWithContext}
        />
      );
    }

    // 5. AuraSheets (Spreadsheet)
    if (currentApp === 'sheets' && currentFile) {
      const sheetContent = AuraStorageService.getSheetContent(currentFile.id);
      return (
        <AuraSheetsEditor
          sheetDoc={sheetContent}
          onSave={(updatedSheet) => {
            setSaveStatus('saving');
            AuraStorageService.saveSheetContent(updatedSheet);
            setTimeout(() => setSaveStatus('saved'), 300);
          }}
          onOpenAI={handleOpenAIWithContext}
        />
      );
    }

    // 6. AuraSlides (Presentations)
    if (currentApp === 'slides' && currentFile) {
      const slideContent = AuraStorageService.getSlideContent(currentFile.id);
      return (
        <AuraSlidesEditor
          slideDoc={slideContent}
          onSave={(updatedSlide) => {
            setSaveStatus('saving');
            AuraStorageService.saveSlideContent(updatedSlide);
            setTimeout(() => setSaveStatus('saved'), 300);
          }}
          onOpenAI={handleOpenAIWithContext}
        />
      );
    }

    // 7. AuraNotes (Notebooks)
    if (currentApp === 'notes') {
      return (
        <AuraNotesView
          onOpenAI={handleOpenAIWithContext}
        />
      );
    }

    // 8. AuraMail (Email Client)
    if (currentApp === 'mail') {
      return (
        <AuraMailView
          onOpenAI={handleOpenAIWithContext}
        />
      );
    }

    // 9. AuraDatabase (Microsoft Access Relational Database Alternative)
    if (currentApp === 'database' && currentFile) {
      const dbContent = AuraStorageService.getDatabaseContent(currentFile.id);
      return (
        <AuraDatabaseView
          databaseDoc={dbContent}
          onSave={(updatedDb) => {
            setSaveStatus('saving');
            AuraStorageService.saveDatabaseContent(updatedDb);
            setTimeout(() => setSaveStatus('saved'), 300);
          }}
          onOpenAI={handleOpenAIWithContext}
        />
      );
    }

    // 10. AuraForms (Forms Builder & Response Collector)
    if (currentApp === 'forms' && currentFile) {
      const formContent = AuraStorageService.getFormContent(currentFile.id);
      return (
        <AuraFormsView
          formDoc={formContent}
          onSave={(updatedForm) => {
            setSaveStatus('saving');
            AuraStorageService.saveFormContent(updatedForm);
            setTimeout(() => setSaveStatus('saved'), 300);
          }}
          onOpenAI={handleOpenAIWithContext}
        />
      );
    }

    // 10. AuraDesign (Publisher / Marketing Graphic Studio)
    if (currentApp === 'design' && currentFile) {
      const designContent = AuraStorageService.getDesignContent(currentFile.id);
      return (
        <AuraDesignView
          designDoc={designContent}
          onSave={(updatedDesign) => {
            setSaveStatus('saving');
            AuraStorageService.saveDesignContent(updatedDesign);
            setTimeout(() => setSaveStatus('saved'), 300);
          }}
          onOpenAI={handleOpenAIWithContext}
        />
      );
    }

    // 11. AuraPDF (PDF Inspector & Signature Studio)
    if (currentApp === 'pdf') {
      return (
        <AuraPdfView />
      );
    }

    // Fallback: Drive View
    return (
      <AuraDriveView
        files={files}
        activeNavTab="drive"
        onOpenFile={handleOpenFile}
        onCreateNewFile={handleCreateNewFile}
        onRefreshFiles={refreshFiles}
        onOpenAI={handleOpenAIWithContext}
      />
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* 1. Global Header */}
      <GlobalHeader
        appId={currentApp}
        fileName={currentFile ? currentFile.name : 'AuraDrive'}
        onRenameFile={currentFile ? handleRenameCurrentFile : undefined}
        saveStatus={saveStatus}
        onToggleAI={() => setIsAIOpen(!isAIOpen)}
        user={user}
        onUpdateUserRole={(newRole: UserRole) => {
          AuraStorageService.updateUserRole(newRole);
          setUser(AuraStorageService.getUser());
        }}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onNavigateHome={() => {
          setCurrentApp('drive');
          setActiveNavTab('drive');
          setCurrentFile(null);
        }}
      />

      {/* 2. Main Suite Layout: Sidebar + Canvas */}
      <div className="flex-1 flex overflow-hidden">
        <GlobalSidebar
          currentApp={currentApp}
          activeNavTab={activeNavTab}
          onSelectNavTab={handleSelectNavTab}
          onSwitchApp={handleSwitchApp}
          onCreateNewFile={handleCreateNewFile}
          userRole={user.role}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Dynamic Center Work Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {renderWorkspaceContent()}
        </main>
      </div>

      {/* 3. Aura AI Copilot Drawer */}
      <AuraAIPanel
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        appType={
          currentApp === 'write' ? 'write' :
          currentApp === 'sheets' ? 'sheets' :
          currentApp === 'slides' ? 'slides' :
          currentApp === 'notes' ? 'notes' :
          currentApp === 'forms' ? 'forms' : 'general'
        }
        activeContextText={aiContextText}
      />

      {/* 4. Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        files={files}
        onOpenFile={(file) => {
          handleOpenFile(file);
          setIsCommandPaletteOpen(false);
        }}
        onSwitchApp={(appId) => {
          handleSwitchApp(appId);
          setIsCommandPaletteOpen(false);
        }}
        onCreateNew={(type) => {
          handleCreateNewFile(type);
          setIsCommandPaletteOpen(false);
        }}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onOpenAI={() => {
          setIsCommandPaletteOpen(false);
          setIsAIOpen(true);
        }}
      />
    </div>
  );
}

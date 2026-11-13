import { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Search, 
  Tag, 
  Pin, 
  CheckSquare, 
  Square, 
  Download, 
  Sparkles, 
  FolderPlus, 
  Clock, 
  Code2, 
  Check,
  ChevronRight
} from 'lucide-react';
import { Notebook, AuraNoteItem } from '../../types/office';
import { AuraStorageService } from '../../services/storage';

interface AuraNotesViewProps {
  onOpenAI: (contextText?: string) => void;
}

export function AuraNotesView({ onOpenAI }: AuraNotesViewProps) {
  const [notebooks, setNotebooks] = useState<Notebook[]>(AuraStorageService.getNotebooks());
  const [notes, setNotes] = useState<AuraNoteItem[]>(AuraStorageService.getNotes());
  const [selectedNotebookId, setSelectedNotebookId] = useState<string>(notebooks[0]?.id || 'nb-1');
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || 'note-1');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist state
  useEffect(() => {
    AuraStorageService.saveNotebooks(notebooks);
  }, [notebooks]);

  useEffect(() => {
    AuraStorageService.saveNotes(notes);
  }, [notes]);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchNotebook = !selectedNotebookId || n.notebookId === selectedNotebookId;
      const matchSearch = !searchQuery || 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchNotebook && matchSearch;
    });
  }, [notes, selectedNotebookId, searchQuery]);

  // Create Note
  const handleCreateNote = () => {
    const newNote: AuraNoteItem = {
      id: `note-${Date.now()}`,
      notebookId: selectedNotebookId,
      section: 'General',
      title: 'Untitled Note',
      content: 'Start capturing your thoughts, task lists, or meeting notes here...',
      tags: ['Personal'],
      isPinned: false,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      checklist: [
        { id: `c-1`, text: 'Initial preparation', done: false },
        { id: `c-2`, text: 'Review findings', done: false }
      ]
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  // Create Notebook
  const handleCreateNotebook = () => {
    const name = prompt('Enter Notebook Name:');
    if (!name || !name.trim()) return;
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
    const newNb: Notebook = {
      id: `nb-${Date.now()}`,
      name: name.trim(),
      color: colors[notebooks.length % colors.length],
      sections: ['General'],
    };
    setNotebooks([...notebooks, newNb]);
    setSelectedNotebookId(newNb.id);
  };

  // Update active note
  const updateActiveNote = (patch: Partial<AuraNoteItem>) => {
    if (!selectedNote) return;
    setNotes(notes.map((n) => (n.id === selectedNote.id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n)));
  };

  // Toggle checklist item
  const toggleChecklist = (checkId: string) => {
    if (!selectedNote || !selectedNote.checklist) return;
    const updated = selectedNote.checklist.map((c: { id: string; text: string; done: boolean }) =>
      c.id === checkId ? { ...c, done: !c.done } : c
    );
    updateActiveNote({ checklist: updated });
  };

  // Add checklist item
  const addChecklistItem = () => {
    if (!selectedNote) return;
    const current = selectedNote.checklist || [];
    const itemText = prompt('Enter checklist item text:');
    if (!itemText || !itemText.trim()) return;
    updateActiveNote({
      checklist: [...current, { id: `c-${Date.now()}`, text: itemText.trim(), done: false }],
    });
  };

  // Delete note
  const handleDeleteNote = (id: string) => {
    if (notes.length <= 1) return;
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    setSelectedNoteId(next[0].id);
  };

  return (
    <div className="flex-1 flex h-full bg-slate-100 dark:bg-slate-950 overflow-hidden select-none">
      {/* 1. Notebooks Directory Column */}
      <div className="w-56 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-purple-600" />
            Notebooks
          </span>
          <button
            onClick={handleCreateNotebook}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Create Notebook"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notebooks.map((nb) => (
            <button
              key={nb.id}
              onClick={() => setSelectedNotebookId(nb.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                selectedNotebookId === nb.id
                  ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: nb.color }}
              />
              <span className="truncate flex-1">{nb.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Notes List in Active Notebook */}
      <div className="w-72 bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Notes ({filteredNotes.length})
            </span>
            <button
              onClick={handleCreateNote}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>New Note</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes or #tags..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>

        {/* List of note cards */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`p-3 rounded-xl cursor-pointer text-left transition-all border ${
                selectedNoteId === note.id
                  ? 'bg-white dark:bg-slate-800 border-purple-400 dark:border-purple-600 shadow-sm'
                  : 'bg-white/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                  {note.title || 'Untitled Note'}
                </h5>
                {note.isPinned && <Pin className="w-3 h-3 text-purple-600 fill-current shrink-0" />}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                {note.content}
              </p>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {note.tags?.map((t, idx) => (
                  <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Note Content Active Canvas */}
      {selectedNote ? (
        <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col overflow-hidden">
          {/* Top Bar for Note */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <input
              type="text"
              value={selectedNote.title}
              onChange={(e) => updateActiveNote({ title: e.target.value })}
              className="text-lg font-bold text-slate-900 dark:text-slate-100 bg-transparent outline-none w-1/2"
              placeholder="Note Title"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateActiveNote({ isPinned: !selectedNote.isPinned })}
                className={`p-1.5 rounded-lg text-xs ${
                  selectedNote.isPinned ? 'text-purple-600 bg-purple-50 dark:bg-purple-950' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Pin Note"
              >
                <Pin className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenAI(`Extract key action items and structure these notes:\n${selectedNote.content}`)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-600 dark:text-purple-300 text-xs font-semibold"
                title="Aura AI Note Copilot"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Action Items</span>
              </button>
              <button
                onClick={() => handleDeleteNote(selectedNote.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                title="Delete Note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Editor & Checklists */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Note Text */}
            <textarea
              value={selectedNote.content}
              onChange={(e) => updateActiveNote({ content: e.target.value })}
              placeholder="Type your note content here..."
              className="w-full h-64 bg-transparent outline-none resize-none text-sm leading-relaxed text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
            />

            {/* Interactive Checklists */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <CheckSquare className="w-3.5 h-3.5 text-purple-500" />
                  Action Items Checklist
                </span>
                <button
                  onClick={addChecklistItem}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add task
                </button>
              </div>

              <div className="space-y-1.5">
                {selectedNote.checklist?.map((item: { id: string; text: string; done: boolean }) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 cursor-pointer text-xs"
                  >
                    {item.done ? (
                      <CheckSquare className="w-4 h-4 text-purple-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className={`flex-1 ${item.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          No note selected
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { 
  Mail, 
  Inbox, 
  Send, 
  Star, 
  Archive, 
  Trash2, 
  Search, 
  Plus, 
  Reply, 
  Forward, 
  Sparkles, 
  X, 
  Paperclip, 
  Check, 
  Clock,
  User,
  CornerUpLeft
} from 'lucide-react';
import { AuraEmailItem } from '../../types/office';
import { AuraStorageService } from '../../services/storage';

interface AuraMailViewProps {
  onOpenAI: (contextText?: string) => void;
}

export function AuraMailView({ onOpenAI }: AuraMailViewProps) {
  const [emails, setEmails] = useState<AuraEmailItem[]>(AuraStorageService.getEmails());
  const [activeFolder, setActiveFolder] = useState<string>('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string>(emails[0]?.id || 'em-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  useEffect(() => {
    AuraStorageService.saveEmails(emails);
  }, [emails]);

  const filteredEmails = useMemo(() => {
    return emails.filter((em) => {
      const matchFolder = activeFolder === 'starred' ? em.isStarred : em.folder === activeFolder;
      const matchSearch = !searchQuery || 
        em.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
        em.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        em.from.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        em.body.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFolder && matchSearch;
    });
  }, [emails, activeFolder, searchQuery]);

  const selectedEmail = emails.find((em) => em.id === selectedEmailId) || filteredEmails[0];

  const handleToggleStar = (id: string) => {
    setEmails(emails.map((e) => (e.id === id ? { ...e, isStarred: !e.isStarred } : e)));
  };

  const handleDeleteEmail = (id: string) => {
    setEmails(emails.map((e) => (e.id === id ? { ...e, folder: 'trash' } : e)));
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim()) return;

    AuraStorageService.sendEmail({
      from: { name: 'Alex Rivera', email: 'alex.rivera@auraoffice.io' },
      to: [composeTo.trim()],
      subject: composeSubject.trim(),
      preview: composeBody.slice(0, 80),
      body: composeBody,
      labels: ['Sent'],
    });

    setEmails(AuraStorageService.getEmails());
    setShowCompose(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
  };

  return (
    <div className="flex-1 flex h-full bg-slate-100 dark:bg-slate-950 overflow-hidden select-none">
      {/* 1. Email Folders Sidebar */}
      <div className="w-52 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-3">
          <button
            onClick={() => setShowCompose(true)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-md shadow-sky-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Message</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
          <FolderButton
            icon={<Inbox className="w-4 h-4" />}
            label="Inbox"
            count={emails.filter((e) => e.folder === 'inbox' && !e.isRead).length}
            active={activeFolder === 'inbox'}
            onClick={() => setActiveFolder('inbox')}
          />
          <FolderButton
            icon={<Star className="w-4 h-4" />}
            label="Starred"
            active={activeFolder === 'starred'}
            onClick={() => setActiveFolder('starred')}
          />
          <FolderButton
            icon={<Send className="w-4 h-4" />}
            label="Sent"
            active={activeFolder === 'sent'}
            onClick={() => setActiveFolder('sent')}
          />
          <FolderButton
            icon={<Archive className="w-4 h-4" />}
            label="Archive"
            active={activeFolder === 'archive'}
            onClick={() => setActiveFolder('archive')}
          />
          <FolderButton
            icon={<Trash2 className="w-4 h-4" />}
            label="Trash"
            active={activeFolder === 'trash'}
            onClick={() => setActiveFolder('trash')}
          />
        </div>
      </div>

      {/* 2. Messages List */}
      <div className="w-80 bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        {/* Search */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mail..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>

        {/* Message Items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredEmails.length > 0 ? (
            filteredEmails.map((em) => (
              <div
                key={em.id}
                onClick={() => {
                  setSelectedEmailId(em.id);
                  setEmails(emails.map(e => e.id === em.id ? { ...e, isRead: true } : e));
                }}
                className={`p-3 rounded-xl cursor-pointer text-left transition-all border ${
                  selectedEmailId === em.id
                    ? 'bg-white dark:bg-slate-800 border-sky-400 dark:border-sky-600 shadow-sm'
                    : 'bg-white/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-xs truncate ${!em.isRead ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                    {em.from.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{em.date}</span>
                </div>
                <h5 className={`text-xs mb-1 truncate ${!em.isRead ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                  {em.subject}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {em.preview}
                </p>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              No emails in {activeFolder}
            </div>
          )}
        </div>
      </div>

      {/* 3. Message Reader Canvas */}
      {selectedEmail ? (
        <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col overflow-hidden">
          {/* Email Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {selectedEmail.subject}
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleToggleStar(selectedEmail.id)}
                className={`p-1.5 rounded-lg ${selectedEmail.isStarred ? 'text-amber-500 fill-current' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Star className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteEmail(selectedEmail.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenAI(`Draft a professional reply to this email:\nSubject: ${selectedEmail.subject}\nBody: ${selectedEmail.body}`)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-600 dark:text-sky-300 text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Draft Reply</span>
              </button>
            </div>
          </div>

          {/* Sender & Recipient Bar */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center">
                {(selectedEmail.from.name || selectedEmail.from.email).slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">{selectedEmail.from.name} ({selectedEmail.from.email})</div>
                <div className="text-[11px] text-slate-400">To: {Array.isArray(selectedEmail.to) ? selectedEmail.to.join(', ') : selectedEmail.to || 'alex.rivera@auraoffice.io'}</div>
              </div>
            </div>
            <div className="text-slate-400 text-[11px] font-mono">{selectedEmail.date}</div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
            {selectedEmail.body}
          </div>

          {/* Bottom Reply Bar */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={() => {
                setComposeTo(selectedEmail.from.email);
                setComposeSubject(`Re: ${selectedEmail.subject}`);
                setShowCompose(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold"
            >
              <CornerUpLeft className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
            <button
              onClick={() => {
                setComposeSubject(`Fwd: ${selectedEmail.subject}`);
                setComposeBody(`\n\n--- Forwarded Message ---\n${selectedEmail.body}`);
                setShowCompose(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold"
            >
              <Forward className="w-3.5 h-3.5" />
              <span>Forward</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
          No email selected
        </div>
      )}

      {/* Compose Email Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleSendEmail}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 flex flex-col"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Compose Message</h4>
              <button onClick={() => setShowCompose(false)} type="button" className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="To: (email address)"
              value={composeTo}
              onChange={(e) => setComposeTo(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
              required
            />

            <input
              type="text"
              placeholder="Subject:"
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
              required
            />

            <textarea
              rows={8}
              placeholder="Write your email here..."
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              className="p-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none resize-none"
              required
            />

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onOpenAI(`Help me refine and write this email draft:\nSubject: ${composeSubject}\nBody: ${composeBody}`)}
                className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 font-medium hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Polish Draft</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-sm"
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function FolderButton({
  icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
        active
          ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-600 text-white">
          {count}
        </span>
      )}
    </button>
  );
}

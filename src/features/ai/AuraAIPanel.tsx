import { useState } from 'react';
import { Sparkles, Send, X, Copy, Check, RefreshCw, Wand2, Lightbulb, FileText, CheckCircle2 } from 'lucide-react';
import { requestAuraAI, AIAssistParams } from '../../services/aiService';

interface AuraAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  appType: 'write' | 'sheets' | 'slides' | 'notes' | 'forms' | 'general';
  activeContextText?: string;
  onApplyResult?: (resultText: string) => void;
}

export function AuraAIPanel({
  isOpen,
  onClose,
  appType,
  activeContextText = '',
  onApplyResult,
}: AuraAIPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = getQuickPromptsForApp(appType);

  const handleRunAI = async (customPrompt?: string, actionType?: string) => {
    const query = customPrompt || prompt;
    if (!query && !actionType) return;

    setLoading(true);
    setResponse(null);
    setNote(null);

    const params: AIAssistParams = {
      prompt: query,
      action: actionType,
      context: activeContextText,
      appType,
    };

    const res = await requestAuraAI(params);
    setLoading(false);

    if (res.error) {
      setResponse(`Error: ${res.error}`);
    } else {
      setResponse(res.result);
      if (res.note) setNote(res.note);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (response && onApplyResult) {
      onApplyResult(response);
      onClose();
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-transform animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/60 to-purple-50/60 dark:from-indigo-950/30 dark:to-purple-950/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              Aura AI
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                {appType}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Context-Aware Copilot</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Close AI Assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body / Chat Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Context indicator */}
        {activeContextText && (
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200 mb-1">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Active Document Context Attached:
            </div>
            <div className="line-clamp-2 italic text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              "{activeContextText.replace(/<[^>]*>/g, '').trim().slice(0, 160)}..."
            </div>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div>
          <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            Quick AI Actions
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleRunAI(qp.prompt, qp.action)}
                disabled={loading}
                className="flex items-center justify-between text-left p-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
              >
                <span className="font-medium">{qp.label}</span>
                <Wand2 className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="p-6 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Generating with Gemini 3.8 Flash...
            </p>
          </div>
        )}

        {/* Response Box */}
        {response && (
          <div className="p-3.5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Aura AI Result
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className="p-1 rounded text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                {onApplyResult && (
                  <button
                    onClick={handleApply}
                    className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Insert
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto font-sans pr-1">
              {response}
            </div>

            {note && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                {note}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Input Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunAI();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Ask Aura AI about this ${appType}...`}
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-sm"
            title="Send prompt to Aura AI"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

function getQuickPromptsForApp(appType: string) {
  switch (appType) {
    case 'write':
      return [
        { label: 'Improve Grammar & Tone', prompt: 'Polish the grammar, flow, and clarity while maintaining professional tone.', action: 'grammar' },
        { label: 'Executive Summary', prompt: 'Create a concise, high-impact 3-bullet executive summary of this text.', action: 'summarize' },
        { label: 'Expand Section', prompt: 'Expand upon the arguments and provide detailed operational specifications.', action: 'expand' },
        { label: 'Shorten & Condense', prompt: 'Shorten this content by 40% while preserving all critical takeaways.', action: 'shorten' },
        { label: 'Generate Formal Outline', prompt: 'Generate a structured table of contents outline based on these topics.', action: 'outline' },
      ];
    case 'sheets':
      return [
        { label: 'Suggest Formula for Growth', prompt: 'Write a spreadsheet formula to calculate percentage revenue growth between Column B and Column C.', action: 'formula' },
        { label: 'Explain Active Formula', prompt: 'Explain how the formulas in this financial model work and point out any edge cases.', action: 'explain_formula' },
        { label: 'Identify Trends & Outliers', prompt: 'Analyze the numerical variance in this spreadsheet and summarize top 3 findings.', action: 'sheet_insights' },
        { label: 'Generate VLOOKUP Template', prompt: 'Provide a clean =VLOOKUP formula structure for searching user data in another table.', action: 'formula' },
      ];
    case 'slides':
      return [
        { label: 'Generate Slide Outline', prompt: 'Draft a 5-slide executive presentation outline based on this content.', action: 'slides_outline' },
        { label: 'Refine Speaker Notes', prompt: 'Write compelling, conversational speaker talking points for this slide.', action: 'speaker_notes' },
        { label: 'Rewrite into Impact Bullets', prompt: 'Convert this paragraph into 3 punchy, high-impact slide bullet points.', action: 'bullet_points' },
      ];
    case 'notes':
      return [
        { label: 'Extract Action Items', prompt: 'Read these notes and extract a numbered list of concrete action items and deadlines.', action: 'action_items' },
        { label: 'Format into Markdown', prompt: 'Structure these raw notes into clean Markdown with headers and checklists.', action: 'markdown' },
      ];
    case 'forms':
      return [
        { label: 'Suggest Feedback Questions', prompt: 'Suggest 5 best-practice survey questions for customer satisfaction evaluation.', action: 'form_questions' },
      ];
    default:
      return [
        { label: 'General Assistance', prompt: 'How can AuraOffice streamline this workflow?', action: 'general' },
      ];
  }
}

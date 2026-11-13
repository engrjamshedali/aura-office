import { useState, useEffect } from 'react';
import { 
  FormInput, 
  Plus, 
  Trash2, 
  Copy, 
  Star, 
  CheckSquare, 
  BarChart2, 
  Eye, 
  Send, 
  Sparkles, 
  Download, 
  Check, 
  Share2,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import { AuraFormContent, FormField } from '../../types/office';
import { AuraStorageService } from '../../services/storage';

interface AuraFormsViewProps {
  formDoc: AuraFormContent;
  onSave: (doc: AuraFormContent) => void;
  onOpenAI: (contextText?: string) => void;
}

export function AuraFormsView({ formDoc, onSave, onOpenAI }: AuraFormsViewProps) {
  const [data, setData] = useState<AuraFormContent>(formDoc);
  const [activeTab, setActiveTab] = useState<'editor' | 'responses' | 'preview'>('editor');
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, any>>({});
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  useEffect(() => {
    onSave(data);
  }, [data]);

  // Add question field
  const handleAddField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `f-${Date.now()}`,
      type,
      label: `Question ${data.fields.length + 1}`,
      required: false,
      options: type === 'radio' || type === 'dropdown' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
    };
    setData({ ...data, fields: [...data.fields, newField] });
  };

  // Update field
  const updateField = (id: string, patch: Partial<FormField>) => {
    setData({
      ...data,
      fields: data.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    });
  };

  // Delete field
  const deleteField = (id: string) => {
    setData({
      ...data,
      fields: data.fields.filter((f) => f.id !== id),
    });
  };

  // Submit test response in Preview mode
  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    AuraStorageService.submitFormResponse(data.id, previewAnswers);
    const updated = AuraStorageService.getFormContent(data.id);
    setData(updated);
    setSubmittedMessage('Thank you! Your response has been recorded.');
    setTimeout(() => {
      setSubmittedMessage(null);
      setPreviewAnswers({});
    }, 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 dark:bg-slate-950 overflow-hidden select-none">
      {/* 1. Forms Top Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2">
          <FormInput className="w-5 h-5 text-teal-600" />
          <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
            AuraForms
          </span>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
          {/* Tab buttons: Questions, Responses, Preview */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'editor' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Questions ({data.fields.length})
            </button>
            <button
              onClick={() => setActiveTab('responses')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'responses' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Responses ({data.responses?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'preview' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Preview & Test
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAI(`Suggest high-conversion survey questions for: ${data.title}`)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Suggest Questions</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content View */}
      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        {activeTab === 'editor' && (
          <div className="w-full max-w-2xl space-y-4">
            {/* Header Card */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border-t-4 border-t-teal-500 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full text-xl font-bold bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                placeholder="Form Title"
              />
              <textarea
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                className="w-full text-xs bg-transparent outline-none text-slate-600 dark:text-slate-300 placeholder:text-slate-400 resize-none"
                placeholder="Form description or instructions for respondents..."
                rows={2}
              />
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {data.fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-mono text-teal-600 font-bold">{idx + 1}.</span>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="flex-1 text-sm font-semibold bg-transparent outline-none text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                      className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200"
                    >
                      <option value="text">Short Answer</option>
                      <option value="textarea">Paragraph</option>
                      <option value="radio">Multiple Choice</option>
                      <option value="dropdown">Dropdown</option>
                      <option value="rating">Rating (1-5)</option>
                      <option value="email">Email</option>
                      <option value="date">Date</option>
                    </select>
                  </div>

                  {/* Options for Choice questions */}
                  {(field.type === 'radio' || field.type === 'dropdown') && (
                    <div className="space-y-1.5 pl-6">
                      {(field.options || ['Option 1']).map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2 text-xs">
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...(field.options || [])];
                              newOpts[optIdx] = e.target.value;
                              updateField(field.id, { options: newOpts });
                            }}
                            className="bg-transparent outline-none text-slate-800 dark:text-slate-200 flex-1"
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newOpts = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                          updateField(field.id, { options: newOpts });
                        }}
                        className="text-xs text-teal-600 hover:underline pt-1"
                      >
                        + Add option
                      </button>
                    </div>
                  )}

                  {/* Rating preview */}
                  {field.type === 'rating' && (
                    <div className="flex gap-2 pl-6 py-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-5 h-5 text-amber-400" />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <label className="flex items-center gap-1.5 text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        className="rounded text-teal-600"
                      />
                      <span>Required question</span>
                    </label>
                    <button
                      onClick={() => deleteField(field.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add question toolbar */}
            <div className="flex items-center justify-center gap-2 py-3">
              <button
                onClick={() => handleAddField('text')}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-medium text-slate-700 dark:text-slate-200"
              >
                <Plus className="w-3.5 h-3.5 text-teal-500" />
                <span>Text Field</span>
              </button>
              <button
                onClick={() => handleAddField('radio')}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-medium text-slate-700 dark:text-slate-200"
              >
                <Plus className="w-3.5 h-3.5 text-teal-500" />
                <span>Choice</span>
              </button>
              <button
                onClick={() => handleAddField('rating')}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-medium text-slate-700 dark:text-slate-200"
              >
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span>Rating</span>
              </button>
            </div>
          </div>
        )}

        {/* Responses View */}
        {activeTab === 'responses' && (
          <div className="w-full max-w-3xl space-y-4">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  {data.responses?.length || 0} Submissions
                </h4>
                <p className="text-xs text-slate-400">Accepting responses</p>
              </div>
              <button
                onClick={() => {
                  const csv = JSON.stringify(data.responses, null, 2);
                  AuraStorageService.downloadFile(`${data.title}_responses.json`, csv, 'application/json');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>

            {/* Individual Responses List */}
            <div className="space-y-2">
              {data.responses?.map((resp, i) => (
                <div
                  key={resp.id}
                  className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span>Response #{i + 1}</span>
                    <span>{new Date(resp.submittedAt).toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {Object.entries(resp.answers).map(([fId, ans]) => {
                      const f = data.fields.find((x) => x.id === fId);
                      return (
                        <div key={fId}>
                          <div className="font-semibold text-slate-700 dark:text-slate-300">{f?.label || fId}:</div>
                          <div className="text-slate-900 dark:text-slate-100 font-medium">{String(ans)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Preview / Response Submission View */}
        {activeTab === 'preview' && (
          <form onSubmit={handleSubmitResponse} className="w-full max-w-xl space-y-4">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border-t-4 border-t-teal-500 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{data.title}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">{data.description}</p>
            </div>

            {submittedMessage ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-2xl text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-200">{submittedMessage}</h4>
              </div>
            ) : (
              <>
                {data.fields.map((f) => (
                  <div
                    key={f.id}
                    className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
                  >
                    <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      {f.label} {f.required && <span className="text-red-500">*</span>}
                    </label>

                    {f.type === 'text' && (
                      <input
                        type="text"
                        required={f.required}
                        value={previewAnswers[f.id] || ''}
                        onChange={(e) => setPreviewAnswers({ ...previewAnswers, [f.id]: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                        placeholder="Your answer"
                      />
                    )}

                    {f.type === 'email' && (
                      <input
                        type="email"
                        required={f.required}
                        value={previewAnswers[f.id] || ''}
                        onChange={(e) => setPreviewAnswers({ ...previewAnswers, [f.id]: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                        placeholder="user@example.com"
                      />
                    )}

                    {f.type === 'textarea' && (
                      <textarea
                        rows={3}
                        required={f.required}
                        value={previewAnswers[f.id] || ''}
                        onChange={(e) => setPreviewAnswers({ ...previewAnswers, [f.id]: e.target.value })}
                        className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                        placeholder="Your answer"
                      />
                    )}

                    {(f.type === 'radio' || f.type === 'dropdown') && (
                      <div className="space-y-1.5">
                        {f.options?.map((opt, i) => (
                          <label key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                            <input
                              type="radio"
                              name={f.id}
                              value={opt}
                              checked={previewAnswers[f.id] === opt}
                              onChange={(e) => setPreviewAnswers({ ...previewAnswers, [f.id]: e.target.value })}
                              className="text-teal-600"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {f.type === 'rating' && (
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setPreviewAnswers({ ...previewAnswers, [f.id]: star })}
                            className={`p-1 rounded ${previewAnswers[f.id] >= star ? 'text-amber-400' : 'text-slate-300'}`}
                          >
                            <Star className="w-6 h-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
                >
                  Submit Form Response
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { 
  LayoutGrid, 
  FileText, 
  Table, 
  Presentation, 
  FormInput, 
  Palette, 
  ArrowRight, 
  Sparkles, 
  Check 
} from 'lucide-react';
import { FileType, FileItem } from '../../types/office';
import { AuraStorageService } from '../../services/storage';

interface TemplatesGalleryViewProps {
  onOpenFile: (file: FileItem) => void;
  onRefreshFiles: () => void;
}

interface TemplateItem {
  id: string;
  title: string;
  type: FileType;
  category: 'Business' | 'Finance' | 'Education' | 'Creative' | 'Productivity';
  description: string;
  badge: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: 'tpl-1',
    title: 'Enterprise Project Proposal',
    type: 'doc',
    category: 'Business',
    description: 'Executive summary, operational phases, risk matrix, and technical budget deliverables.',
    badge: 'Popular',
  },
  {
    id: 'tpl-2',
    title: 'Modern Executive Resume',
    type: 'doc',
    category: 'Education',
    description: 'Crisp two-column curriculum vitae showcasing technical accomplishments and leadership.',
    badge: 'Career',
  },
  {
    id: 'tpl-3',
    title: 'FY2026 SaaS Financial Model',
    type: 'sheet',
    category: 'Finance',
    description: 'Quarterly ARR forecast, burn rate, runway calculator, and unit economics summary.',
    badge: 'Finance',
  },
  {
    id: 'tpl-4',
    title: 'Project Roadmap & Milestones',
    type: 'sheet',
    category: 'Productivity',
    description: 'Sprint allocations, team capacity, status metrics, and completion percentage.',
    badge: 'Operations',
  },
  {
    id: 'tpl-5',
    title: 'VC Investor Pitch Deck',
    type: 'slide',
    category: 'Business',
    description: '10-slide executive pitch deck: Problem, Market, Solution, Traction, and Ask.',
    badge: 'Startup',
  },
  {
    id: 'tpl-6',
    title: 'Customer Satisfaction Survey (CSAT)',
    type: 'form',
    category: 'Business',
    description: 'NPS rating, multi-attribute feedback scale, and open-ended customer comments.',
    badge: 'Feedback',
  },
  {
    id: 'tpl-7',
    title: 'Tech Conference Launch Poster',
    type: 'design',
    category: 'Creative',
    description: 'High-impact dark luxury event poster with typography hierarchy and QR badge placeholder.',
    badge: 'Marketing',
  },
];

export function TemplatesGalleryView({ onOpenFile, onRefreshFiles }: TemplatesGalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredTemplates = TEMPLATES.filter((t) =>
    selectedCategory === 'All' ? true : t.category === selectedCategory
  );

  const handleUseTemplate = (tpl: TemplateItem) => {
    const newFile = AuraStorageService.createFile(tpl.title, tpl.type);
    onRefreshFiles();
    onOpenFile(newFile);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950 select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-indigo-600" />
              Templates Gallery
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Start fast with pre-built documents, models, pitch decks, and surveys.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'Business', 'Finance', 'Education', 'Creative', 'Productivity'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                    {getTemplateIcon(tpl.type)}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    {tpl.badge}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1.5">
                  {tpl.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {tpl.category}
                </span>
                <button
                  onClick={() => handleUseTemplate(tpl)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors group"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getTemplateIcon(type: FileType) {
  switch (type) {
    case 'doc':
      return <FileText className="w-5 h-5 text-blue-500" />;
    case 'sheet':
      return <Table className="w-5 h-5 text-emerald-500" />;
    case 'slide':
      return <Presentation className="w-5 h-5 text-amber-500" />;
    case 'form':
      return <FormInput className="w-5 h-5 text-teal-500" />;
    case 'design':
      return <Palette className="w-5 h-5 text-pink-500" />;
    default:
      return <FileText className="w-5 h-5 text-slate-400" />;
  }
}

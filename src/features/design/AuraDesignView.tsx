import { useState, useEffect } from 'react';
import { 
  Palette, 
  Type, 
  Square, 
  Image as ImageIcon, 
  Download, 
  Sparkles, 
  Plus, 
  Trash2, 
  Layers,
  Check,
  Maximize2
} from 'lucide-react';
import { AuraDesignContent, DesignElement } from '../../types/office';
import { AuraStorageService } from '../../services/storage';

interface AuraDesignViewProps {
  designDoc: AuraDesignContent;
  onSave: (doc: AuraDesignContent) => void;
  onOpenAI: (contextText?: string) => void;
}

const FORMAT_PRESETS: Record<string, { label: string; width: number; height: number }> = {
  poster: { label: 'Poster / Flyer', width: 600, height: 750 },
  social: { label: 'Social Square (1:1)', width: 600, height: 600 },
  banner: { label: 'Web Banner (16:9)', width: 800, height: 450 },
  card: { label: 'Business Card', width: 600, height: 350 },
};

export function AuraDesignView({ designDoc, onSave, onOpenAI }: AuraDesignViewProps) {
  const [data, setData] = useState<AuraDesignContent>(designDoc);
  const [selectedElId, setSelectedElId] = useState<string | null>(null);

  useEffect(() => {
    onSave(data);
  }, [data]);

  const handleAddElement = (type: DesignElement['type']) => {
    const newEl: DesignElement = {
      id: `del-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: type === 'shape' ? 120 : 360,
      height: type === 'shape' ? 120 : 60,
      text: type === 'text' ? 'HEADLINE TEXT' : undefined,
      fontSize: 28,
      color: '#ffffff',
      bgColor: type === 'shape' ? '#ec4899' : undefined,
      borderRadius: type === 'shape' ? 12 : 4,
    };
    setData({ ...data, elements: [...data.elements, newEl] });
    setSelectedElId(newEl.id);
  };

  const updateElement = (id: string, patch: Partial<DesignElement>) => {
    setData({
      ...data,
      elements: data.elements.map((el) => (el.id === id ? { ...el, ...patch } : el)),
    });
  };

  const deleteElement = (id: string) => {
    setData({
      ...data,
      elements: data.elements.filter((el) => el.id !== id),
    });
    setSelectedElId(null);
  };

  const selectedElement = data.elements.find((el) => el.id === selectedElId);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 dark:bg-slate-950 overflow-hidden select-none">
      {/* Top Toolbar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-pink-600" />
          <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
            AuraDesign
          </span>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Format selector */}
          <select
            value={data.format}
            onChange={(e) => {
              const preset = FORMAT_PRESETS[e.target.value] || FORMAT_PRESETS.poster;
              setData({ ...data, format: e.target.value as any, width: preset.width, height: preset.height });
            }}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200"
          >
            {Object.entries(FORMAT_PRESETS).map(([key, p]) => (
              <option key={key} value={key}>
                {p.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleAddElement('text')}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
          >
            <Type className="w-3.5 h-3.5" />
            <span>Add Text</span>
          </button>
          <button
            onClick={() => handleAddElement('shape')}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
          >
            <Square className="w-3.5 h-3.5" />
            <span>Add Badge</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAI(`Generate marketing copy and slogans for this design: ${data.title}`)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 text-pink-700 dark:text-pink-300 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copy</span>
          </button>
          <button
            onClick={() => AuraStorageService.exportAsPdfPrint()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Graphic</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-slate-200/80 dark:bg-slate-950">
          <div
            id="printable-document"
            style={{
              width: `${data.width}px`,
              height: `${data.height}px`,
              backgroundColor: data.background || '#0f172a',
            }}
            onClick={() => setSelectedElId(null)}
            className="relative shadow-2xl rounded-2xl overflow-hidden border border-slate-700/50 select-none"
          >
            {data.elements.map((el) => {
              const isSelected = el.id === selectedElId;
              return (
                <div
                  key={el.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElId(el.id);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    color: el.color || '#ffffff',
                    backgroundColor: el.bgColor || 'transparent',
                    fontSize: `${el.fontSize}px`,
                    borderRadius: `${el.borderRadius || 4}px`,
                  }}
                  className={`cursor-move p-2 flex items-center justify-center text-center font-bold tracking-tight transition-all ${
                    isSelected ? 'ring-2 ring-pink-500 shadow-xl' : 'hover:ring-1 hover:ring-pink-300'
                  }`}
                >
                  {el.type === 'text' && (
                    <textarea
                      value={el.text || ''}
                      onChange={(e) => updateElement(el.id, { text: e.target.value })}
                      className="w-full h-full bg-transparent border-none outline-none resize-none overflow-hidden text-center"
                      style={{ color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit' }}
                    />
                  )}
                  {el.type === 'shape' && (
                    <span className="text-xs uppercase tracking-widest text-white/90">Promo Badge</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Element Inspector */}
        {selectedElement && (
          <div className="w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-4 space-y-4 shrink-0 overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Style Element
              </span>
              <button onClick={() => deleteElement(selectedElement.id)} className="text-red-500 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Font Size ({selectedElement.fontSize}px)</label>
              <input
                type="range"
                min="12"
                max="80"
                value={selectedElement.fontSize || 28}
                onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value, 10) })}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">Text Color</label>
                <input
                  type="color"
                  value={selectedElement.color || '#ffffff'}
                  onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                  className="w-full h-8 rounded cursor-pointer border"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Background</label>
                <input
                  type="color"
                  value={selectedElement.bgColor || '#ec4899'}
                  onChange={(e) => updateElement(selectedElement.id, { bgColor: e.target.value })}
                  className="w-full h-8 rounded cursor-pointer border"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

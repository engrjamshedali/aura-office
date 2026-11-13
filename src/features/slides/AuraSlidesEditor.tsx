import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Plus, 
  Trash2, 
  Copy, 
  Type, 
  Square, 
  Circle, 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  Palette, 
  Layers,
  FileText
} from 'lucide-react';
import { AuraSlideContent, Slide, SlideElement } from '../../types/office';
import { AuraStorageService } from '../../services/storage';

interface AuraSlidesEditorProps {
  slideDoc: AuraSlideContent;
  onSave: (doc: AuraSlideContent) => void;
  onOpenAI: (contextText?: string) => void;
}

const THEME_PRESETS: Record<string, { bg: string; text: string; accent: string }> = {
  modern: { bg: '#0f172a', text: '#ffffff', accent: '#6366f1' },
  light: { bg: '#ffffff', text: '#0f172a', accent: '#3b82f6' },
  ocean: { bg: 'linear-gradient(135deg, #03254c 0%, #1167b1 100%)', text: '#ffffff', accent: '#38bdf8' },
  sunset: { bg: 'linear-gradient(135deg, #4c0519 0%, #881337 100%)', text: '#ffffff', accent: '#f43f5e' },
  minimal: { bg: '#f8fafc', text: '#1e293b', accent: '#475569' },
};

export function AuraSlidesEditor({
  slideDoc,
  onSave,
  onOpenAI,
}: AuraSlidesEditorProps) {
  const [data, setData] = useState<AuraSlideContent>(slideDoc);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isPresenting, setIsPresenting] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(true);

  const currentSlide = data.slides[activeSlideIndex] || data.slides[0];

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      onSave(data);
    }, 700);
    return () => clearTimeout(timer);
  }, [data]);

  // Keyboard navigation for presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPresenting) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setActiveSlideIndex((prev) => Math.min(data.slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        setIsPresenting(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresenting, data.slides.length]);

  // Add Slide
  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: `Slide ${data.slides.length + 1}`,
      bgColor: currentSlide.bgColor || '#0f172a',
      elements: [
        {
          id: `el-${Date.now()}-1`,
          type: 'text',
          x: 80,
          y: 80,
          width: 700,
          height: 80,
          text: 'New Slide Heading',
          fontSize: 36,
          fontWeight: 'bold',
          color: '#ffffff',
          zIndex: 1,
        },
        {
          id: `el-${Date.now()}-2`,
          type: 'text',
          x: 80,
          y: 180,
          width: 650,
          height: 120,
          text: '• Key takeaway point one\n• Supporting detail and performance metric\n• Next strategic actions',
          fontSize: 18,
          color: '#cbd5e1',
          zIndex: 1,
        },
      ],
      speakerNotes: 'Talking points for slide ' + (data.slides.length + 1),
    };

    const updated = {
      ...data,
      slides: [...data.slides, newSlide],
    };
    setData(updated);
    setActiveSlideIndex(data.slides.length);
  };

  // Duplicate Slide
  const handleDuplicateSlide = (idx: number) => {
    const slideToClone = data.slides[idx];
    const cloned: Slide = {
      ...slideToClone,
      id: `slide-${Date.now()}`,
      title: `${slideToClone.title} (Copy)`,
      elements: slideToClone.elements.map((el) => ({ ...el, id: `el-${Date.now()}-${Math.random()}` })),
    };
    const newSlides = [...data.slides];
    newSlides.splice(idx + 1, 0, cloned);
    setData({ ...data, slides: newSlides });
    setActiveSlideIndex(idx + 1);
  };

  // Delete Slide
  const handleDeleteSlide = (idx: number) => {
    if (data.slides.length <= 1) {
      alert('Presentation must have at least one slide.');
      return;
    }
    const newSlides = data.slides.filter((_, i) => i !== idx);
    setData({ ...data, slides: newSlides });
    setActiveSlideIndex(Math.max(0, idx - 1));
  };

  // Add Element to Current Slide
  const handleAddElement = (type: SlideElement['type']) => {
    if (!currentSlide) return;
    const newEl: SlideElement = {
      id: `el-${Date.now()}`,
      type,
      x: 150,
      y: 150,
      width: type === 'shape' ? 120 : 320,
      height: type === 'shape' ? 120 : 80,
      text: type === 'text' ? 'Click to edit text' : undefined,
      fontSize: 20,
      color: '#ffffff',
      bgColor: type === 'shape' ? '#6366f1' : undefined,
      shapeType: type === 'shape' ? 'rectangle' : undefined,
      zIndex: currentSlide.elements.length + 1,
      imageUrl: type === 'image' ? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80' : undefined,
    };

    const updatedSlides = data.slides.map((s, idx) =>
      idx === activeSlideIndex ? { ...s, elements: [...s.elements, newEl] } : s
    );
    setData({ ...data, slides: updatedSlides });
    setSelectedElementId(newEl.id);
  };

  // Update an element property
  const updateElement = (id: string, patch: Partial<SlideElement>) => {
    const updatedSlides = data.slides.map((s, idx) => {
      if (idx !== activeSlideIndex) return s;
      return {
        ...s,
        elements: s.elements.map((el) => (el.id === id ? { ...el, ...patch } : el)),
      };
    });
    setData({ ...data, slides: updatedSlides });
  };

  // Delete Element
  const handleDeleteElement = (id: string) => {
    const updatedSlides = data.slides.map((s, idx) => {
      if (idx !== activeSlideIndex) return s;
      return {
        ...s,
        elements: s.elements.filter((el) => el.id !== id),
      };
    });
    setData({ ...data, slides: updatedSlides });
    setSelectedElementId(null);
  };

  // Apply Theme
  const handleApplyTheme = (themeKey: string) => {
    const preset = THEME_PRESETS[themeKey];
    if (!preset) return;
    const updatedSlides = data.slides.map((s) => ({
      ...s,
      bgColor: preset.bg,
    }));
    setData({ ...data, theme: (['modern', 'minimal', 'executive', 'creative', 'midnight'].includes(themeKey) ? themeKey : 'modern') as AuraSlideContent['theme'], slides: updatedSlides });
  };

  const selectedElement = currentSlide?.elements.find((el) => el.id === selectedElementId);

  // Present Mode Fullscreen Component
  if (isPresenting) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none">
        {/* Top Presenter Bar */}
        <div className="p-4 flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm">
          <span className="text-white text-sm font-semibold font-mono">
            Slide {activeSlideIndex + 1} of {data.slides.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSlideIndex((p) => Math.max(0, p - 1))}
              className="p-2 rounded bg-white/20 hover:bg-white/30 text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveSlideIndex((p) => Math.min(data.slides.length - 1, p + 1))}
              className="p-2 rounded bg-white/20 hover:bg-white/30 text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPresenting(false)}
              className="p-2 rounded bg-red-600/80 hover:bg-red-600 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scaled Slide Canvas */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div
            style={{
              background: currentSlide.bgColor || '#0f172a',
              width: '1000px',
              height: '562.5px', // 16:9
            }}
            className="relative rounded-xl shadow-2xl overflow-hidden"
          >
            {currentSlide.elements.map((el) => (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  fontSize: `${el.fontSize}px`,
                  fontWeight: el.fontWeight || 'normal',
                  color: el.color || '#ffffff',
                  backgroundColor: el.bgColor || 'transparent',
                  borderRadius: el.shapeType === 'circle' ? '9999px' : '6px',
                  zIndex: el.zIndex || 1,
                }}
                className="whitespace-pre-wrap leading-tight"
              >
                {el.type === 'text' && el.text}
                {el.type === 'image' && el.imageUrl && (
                  <img src={el.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="p-2 text-center text-xs text-white/40 font-mono">
          Press Space or Arrows to navigate • Esc to exit
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100/70 dark:bg-slate-950 overflow-hidden select-none">
      {/* 1. Slides Toolbar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shadow-xs shrink-0 z-20">
        <div className="flex items-center flex-wrap gap-1.5">
          {/* Present Button */}
          <button
            onClick={() => setIsPresenting(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-colors"
            title="Start Fullscreen Slideshow"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Present</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Add Slide */}
          <button
            onClick={handleAddSlide}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-500" />
            <span>New Slide</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Insert Element Buttons */}
          <button
            onClick={() => handleAddElement('text')}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1"
            title="Add Text Box"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Text</span>
          </button>
          <button
            onClick={() => handleAddElement('shape')}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1"
            title="Add Rectangle Shape"
          >
            <Square className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shape</span>
          </button>
          <button
            onClick={() => handleAddElement('image')}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1"
            title="Add Image"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Image</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Themes Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-xs px-2 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <Palette className="w-3.5 h-3.5 text-pink-500" />
              <span>Theme</span>
            </button>
            <div className="hidden group-hover:block absolute left-0 top-full mt-1 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-1 z-50 text-xs">
              {Object.keys(THEME_PRESETS).map((tKey) => (
                <button
                  key={tKey}
                  onClick={() => handleApplyTheme(tKey)}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/50 capitalize"
                >
                  {tKey} Theme
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right side AI & notes toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-1.5 rounded text-xs flex items-center gap-1 ${
              showNotes ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600'
            }`}
            title="Speaker Notes"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Notes</span>
          </button>

          <button
            onClick={() => onOpenAI(`Presentation outline and content for slide: ${currentSlide?.title}`)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 text-xs font-semibold"
            title="Aura AI Slide Copilot"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Outline</span>
          </button>

          <button
            onClick={() => AuraStorageService.exportAsPdfPrint()}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 text-xs"
            title="Export / Print Slides"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main Slides Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Thumbnails Sidebar */}
        <div className="w-48 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-3 overflow-y-auto space-y-3 shrink-0">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Slides ({data.slides.length})
          </div>
          <div className="space-y-2">
            {data.slides.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => {
                  setActiveSlideIndex(idx);
                  setSelectedElementId(null);
                }}
                className={`group relative rounded-lg border-2 p-1.5 cursor-pointer transition-all ${
                  idx === activeSlideIndex
                    ? 'border-indigo-600 shadow-md bg-indigo-50/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Micro Thumbnail Canvas */}
                <div
                  style={{ background: s.bgColor || '#0f172a' }}
                  className="w-full aspect-video rounded overflow-hidden p-1.5 relative flex flex-col justify-center items-center text-center"
                >
                  <span className="text-[9px] font-bold text-white line-clamp-1">
                    {s.title || `Slide ${idx + 1}`}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1 px-1">
                  <span className="text-[10px] text-slate-400 font-mono">{idx + 1}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateSlide(idx);
                      }}
                      className="text-slate-400 hover:text-slate-600"
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {data.slides.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlide(idx);
                        }}
                        className="text-slate-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Stage & Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-200/80 dark:bg-slate-950">
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
            {/* 16:9 Canvas */}
            <div
              style={{
                background: currentSlide?.bgColor || '#0f172a',
                width: '840px',
                height: '472.5px', // 16:9 ratio
              }}
              onClick={() => setSelectedElementId(null)}
              className="relative shadow-2xl rounded-xl overflow-hidden border border-slate-700/40 select-none"
            >
              {currentSlide?.elements.map((el) => {
                const isSelected = el.id === selectedElementId;
                return (
                  <div
                    key={el.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElementId(el.id);
                    }}
                    style={{
                      position: 'absolute',
                      left: `${el.x}px`,
                      top: `${el.y}px`,
                      width: `${el.width}px`,
                      height: `${el.height}px`,
                      fontSize: `${el.fontSize}px`,
                      fontWeight: el.fontWeight || 'normal',
                      color: el.color || '#ffffff',
                      backgroundColor: el.bgColor || 'transparent',
                      borderRadius: el.shapeType === 'circle' ? '9999px' : '6px',
                      zIndex: el.zIndex || 1,
                    }}
                    className={`cursor-move whitespace-pre-wrap leading-tight p-2 transition-shadow ${
                      isSelected
                        ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 shadow-lg'
                        : 'hover:ring-1 hover:ring-indigo-300'
                    }`}
                  >
                    {el.type === 'text' && (
                      <textarea
                        value={el.text || ''}
                        onChange={(e) => updateElement(el.id, { text: e.target.value })}
                        className="w-full h-full bg-transparent border-none outline-none resize-none overflow-hidden"
                        style={{ color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit' }}
                      />
                    )}
                    {el.type === 'image' && el.imageUrl && (
                      <img src={el.imageUrl} alt="" className="w-full h-full object-cover rounded pointer-events-none" />
                    )}
                    {el.type === 'shape' && (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs opacity-70">
                        {el.shapeType}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Speaker Notes Drawer */}
          {showNotes && (
            <div className="h-32 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 shrink-0 flex flex-col">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  Speaker Notes (Presenter View)
                </span>
                <button
                  onClick={() => onOpenAI(`Polish talking points for slide: ${currentSlide?.speakerNotes}`)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Enhance Talking Points
                </button>
              </div>
              <textarea
                value={currentSlide?.speakerNotes || ''}
                onChange={(e) => {
                  const updated = data.slides.map((s, idx) =>
                    idx === activeSlideIndex ? { ...s, speakerNotes: e.target.value } : s
                  );
                  setData({ ...data, slides: updated });
                }}
                placeholder="Click to type speaker notes for this slide..."
                className="flex-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 outline-none resize-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Right Element Property Inspector */}
        {selectedElement && (
          <div className="w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-4 space-y-4 shrink-0 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Element Properties
              </h4>
              <button
                onClick={() => handleDeleteElement(selectedElement.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Delete Element"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Font size */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Font Size: {selectedElement.fontSize}px</label>
              <input
                type="range"
                min="12"
                max="72"
                value={selectedElement.fontSize || 20}
                onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value, 10) })}
                className="w-full"
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Text Color</label>
                <input
                  type="color"
                  value={selectedElement.color || '#ffffff'}
                  onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                  className="w-full h-8 rounded cursor-pointer border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Fill Color</label>
                <input
                  type="color"
                  value={selectedElement.bgColor || '#6366f1'}
                  onChange={(e) => updateElement(selectedElement.id, { bgColor: e.target.value })}
                  className="w-full h-8 rounded cursor-pointer border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Width (px)</label>
                <input
                  type="number"
                  value={selectedElement.width}
                  onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value, 10) || 50 })}
                  className="w-full px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Height (px)</label>
                <input
                  type="number"
                  value={selectedElement.height}
                  onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value, 10) || 30 })}
                  className="w-full px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

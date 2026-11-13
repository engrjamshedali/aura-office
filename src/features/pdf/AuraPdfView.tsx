import { useState } from 'react';
import { 
  FileCheck, 
  RotateCw, 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  Stamp, 
  PenTool, 
  ShieldAlert, 
  FileText,
  Sparkles,
  Upload,
  Check
} from 'lucide-react';
import { AuraStorageService } from '../../services/storage';

export function AuraPdfView() {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [watermark, setWatermark] = useState<string | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureName, setSignatureName] = useState('Alex Rivera');
  const [pdfText, setPdfText] = useState(
    `AURACONNECT PARTNERSHIP AGREEMENT\n\nThis Partnership Agreement ("Agreement") is entered into as of September 2026, by and between AuraOffice Systems Inc. and Apex Laboratory Technologies.\n\n1. PURPOSE & SCOPE\nThe parties desire to collaborate on developing enterprise productivity infrastructure and cloud microservices.\n\n2. CONFIDENTIALITY\nAll proprietary code, intellectual property, and research data shared under this Agreement shall remain strictly confidential.\n\n3. SIGNATURES & VALIDATION\nIN WITNESS WHEREOF, the parties hereto have executed this Agreement on the date set forth below.`
  );

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleApplySignature = () => {
    setHasSignature(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 dark:bg-slate-950 overflow-hidden select-none">
      {/* PDF Action Toolbar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 z-20">
        <div className="flex items-center gap-1.5 flex-wrap">
          <FileCheck className="w-5 h-5 text-red-500" />
          <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
            AuraPDF
          </span>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Zoom controls */}
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-500">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Rotate */}
          <button
            onClick={handleRotate}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs"
            title="Rotate 90 degrees"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Rotate ({rotation}°)</span>
          </button>

          {/* Watermark */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Watermark</span>
            </button>
            <div className="hidden group-hover:block absolute left-0 top-full mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-1 z-50 text-xs">
              {['CONFIDENTIAL', 'DRAFT', 'APPROVED', 'FINAL'].map((w) => (
                <button
                  key={w}
                  onClick={() => setWatermark(w)}
                  className="w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {w}
                </button>
              ))}
              <button
                onClick={() => setWatermark(null)}
                className="w-full text-left px-2 py-1 rounded text-red-500 hover:bg-slate-100"
              >
                Clear Watermark
              </button>
            </div>
          </div>

          {/* Digital Signature */}
          <button
            onClick={handleApplySignature}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-medium"
          >
            <PenTool className="w-3.5 h-3.5 text-indigo-500" />
            <span>Sign Document</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => AuraStorageService.exportAsPdfPrint()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* PDF Render Preview Canvas */}
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-300/80 dark:bg-slate-950">
        <div
          id="printable-document"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease',
            width: '800px',
            minHeight: '1000px',
          }}
          className="bg-white text-slate-900 shadow-2xl p-14 rounded-sm relative flex flex-col justify-between"
        >
          {/* Watermark overlay if active */}
          {watermark && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
              <span className="text-7xl font-extrabold text-red-500/15 rotate-[-35deg] tracking-widest border-4 border-red-500/20 px-8 py-4 rounded-2xl">
                {watermark}
              </span>
            </div>
          )}

          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">AURA LEGAL & ENTERPRISE PDF</h2>
              <p className="text-xs text-slate-500">Doc Ref: AO-PDF-2026-X941</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              Page 1 of 1
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 whitespace-pre-wrap font-serif text-sm leading-loose text-slate-800">
            {pdfText}
          </div>

          {/* Digital Signature Box */}
          <div className="mt-12 pt-6 border-t border-slate-300 flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 block uppercase font-mono">Digitally Authorized By:</span>
              {hasSignature ? (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs space-y-1">
                  <div className="font-serif italic font-bold text-indigo-900 text-lg">
                    {signatureName}
                  </div>
                  <div className="text-[10px] text-indigo-700 font-mono flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Verified Cryptographic Signature • AuraPKI
                  </div>
                </div>
              ) : (
                <div className="w-48 h-12 border-b-2 border-slate-400 flex items-end pb-1 text-xs text-slate-400 italic">
                  (Signature pending)
                </div>
              )}
            </div>

            <div className="text-right text-[11px] text-slate-400 font-mono">
              Timestamp: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

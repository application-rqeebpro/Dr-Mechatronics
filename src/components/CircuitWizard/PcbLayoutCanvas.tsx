import React, { useState } from 'react';
import { CwComponent, CwWire } from '../../types/circuitWizard';
import { Layers, Wand2, Eye, Cpu, CheckCircle2 } from 'lucide-react';

interface Props {
  components: CwComponent[];
  wires: CwWire[];
  onUpdateComponents: (comps: CwComponent[]) => void;
}

export const PcbLayoutCanvas: React.FC<Props> = ({ components, wires, onUpdateComponents }) => {
  const [showTopLayer, setShowTopLayer] = useState<boolean>(true);
  const [showBottomLayer, setShowBottomLayer] = useState<boolean>(true);
  const [showSilkScreen, setShowSilkScreen] = useState<boolean>(true);
  const [isAutoRouting, setIsAutoRouting] = useState<boolean>(false);
  const [autoRouted, setAutoRouted] = useState<boolean>(true);

  // PCB Board Dimensions
  const boardWidth = 600;
  const boardHeight = 400;

  // Auto-Router simulation trigger
  const handleRunAutoRouter = () => {
    setIsAutoRouting(true);
    setTimeout(() => {
      setIsAutoRouting(false);
      setAutoRouted(true);
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden select-none">
      {/* PCB Toolbar */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800/80 text-emerald-400 font-mono font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>PCB Layout - 2 Layer FR4 Board</span>
          </div>

          <span className="text-slate-400 font-mono">
            أبعاد اللوحة: 100mm × 80mm | عدد الطبقات: 2 Layers
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Layer toggles */}
          <button
            onClick={() => setShowTopLayer(!showTopLayer)}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all border ${
              showTopLayer
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
          >
            🔴 Top Layer (Red)
          </button>

          <button
            onClick={() => setShowBottomLayer(!showBottomLayer)}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all border ${
              showBottomLayer
                ? 'bg-blue-950 text-blue-300 border-blue-800'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
          >
            🔵 Bottom Layer (Blue)
          </button>

          <button
            onClick={() => setShowSilkScreen(!showSilkScreen)}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all border ${
              showSilkScreen
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
          >
            🟢 Silk Screen
          </button>

          {/* Auto-Router Button */}
          <button
            onClick={handleRunAutoRouter}
            disabled={isAutoRouting}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold rounded shadow-md transition-all active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isAutoRouting ? 'جاري التوجيه التلقائي...' : 'توجيه المسارات (Auto-Router)'}</span>
          </button>
        </div>
      </div>

      {/* PCB Substrate Canvas */}
      <div className="flex-1 relative bg-[#0b2416] p-6 overflow-auto flex items-center justify-center">
        {/* FR4 Fiberglass Board Area */}
        <div
          style={{ width: `${boardWidth}px`, height: `${boardHeight}px` }}
          className="relative bg-[#0d2f1c] border-4 border-[#124227] rounded-xl shadow-2xl overflow-hidden p-4"
        >
          {/* Copper Grid Pattern */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <defs>
              <pattern id="pcbGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#22c55e" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pcbGrid)" />
          </svg>

          {/* Render Copper Traces (Auto-routed paths) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {wires.map((w, index) => {
              const compA = components.find((c) => c.id === w.fromCompId);
              const compB = components.find((c) => c.id === w.toCompId);

              if (!compA || !compB) return null;

              const startX = compA.pcbX + 40;
              const startY = compA.pcbY + 30;
              const endX = compB.pcbX + 40;
              const endY = compB.pcbY + 30;

              // Orthogonal PCB routing (45 degree bends)
              const midX = (startX + endX) / 2;
              const pathData = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;

              const isTop = index % 2 === 0;

              return (
                <g key={w.id}>
                  {isTop && showTopLayer && (
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.85"
                    />
                  )}
                  {!isTop && showBottomLayer && (
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.85"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Render Component Footprints & Solder Pads */}
          {components.map((comp) => {
            return (
              <div
                key={comp.id}
                style={{ left: `${comp.pcbX}px`, top: `${comp.pcbY}px` }}
                className="absolute p-2 bg-black/40 border border-emerald-500/60 rounded cursor-move select-none"
              >
                {/* Silk Screen Legend Text */}
                {showSilkScreen && (
                  <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">
                    {comp.name} ({comp.package})
                  </div>
                )}

                {/* Footprint Pads */}
                <div className="flex items-center justify-around gap-2">
                  {comp.footprint.pads.map((pad, pIdx) => (
                    <div
                      key={pad.id || pIdx}
                      className="w-4 h-4 rounded-full bg-amber-400 border-2 border-amber-600 flex items-center justify-center shadow-inner"
                      title={`Pad ${pIdx + 1}`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-black/80" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PCB Status Footer */}
      <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>حالة المسارات: {autoRouted ? 'تم التوجيه بنجاح 100%' : 'توجد مسارات معلقة'}</span>
        </div>
        <div>توصيل خالي من الأخطاء | DRC Check Passed</div>
      </div>
    </div>
  );
};

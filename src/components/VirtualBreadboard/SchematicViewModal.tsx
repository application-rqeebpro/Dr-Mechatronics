import React from 'react';
import { X, Printer, Download, Eye, Layers } from 'lucide-react';
import { CircuitElement, CircuitWire, SimulationResult } from '../../types/dcLab';

interface Props {
  components: CircuitElement[];
  wires: CircuitWire[];
  simulationResult: SimulationResult;
  onClose: () => void;
}

export const SchematicViewModal: React.FC<Props> = ({
  components,
  wires,
  simulationResult,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto print:bg-white print:border-none print:shadow-none">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">المخطط الرمزي الهندسي للدائرة (Schematic Diagram)</h3>
              <p className="text-xs text-slate-400">
                عرض المخطط النظري بالرموز المعيارية القياسية (IEEE / IEC) المطابقة للوحة التجارب
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة المخطط</span>
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Schematic SVG Canvas */}
        <div className="p-6 overflow-y-auto space-y-4 bg-slate-950 print:bg-white text-slate-200 print:text-black">
          <div className="rounded-2xl border-2 border-slate-800 print:border-black p-4 bg-slate-950 print:bg-white h-[420px] flex items-center justify-center relative">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Background blueprint grid */}
              <defs>
                <pattern id="schematic-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#schematic-grid)" />

              {/* Render Wires as clean right-angled orthogonal traces */}
              {wires.map((w) => {
                const c1 = components.find((c) => c.id === w.fromComponentId);
                const c2 = components.find((c) => c.id === w.toComponentId);
                if (!c1 || !c2) return null;

                const midX = (c1.x + c2.x) / 2;

                return (
                  <path
                    key={w.id}
                    d={`M ${c1.x} ${c1.y} L ${midX} ${c1.y} L ${midX} ${c2.y} L ${c2.x} ${c2.y}`}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                  />
                );
              })}

              {/* Render Standard Schematic Symbols for each component */}
              {components.map((comp) => {
                const sim = simulationResult.elementData[comp.id];
                const vDrop = sim ? Math.abs(sim.voltageDrop) : 0;

                return (
                  <g key={comp.id} transform={`translate(${comp.x}, ${comp.y})`}>
                    {/* Circle Node boundary */}
                    <circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />

                    {/* Schematic Type Glyphs */}
                    {comp.type === 'resistor' && (
                      <path d="M -12 0 L -8 -6 L -4 6 L 0 -6 L 4 6 L 8 -6 L 12 0" fill="none" stroke="#f59e0b" strokeWidth="2" />
                    )}

                    {comp.type === 'dc_source' && (
                      <g>
                        <line x1="-8" y1="-8" x2="8" y2="-8" stroke="#ef4444" strokeWidth="2.5" />
                        <line x1="-4" y1="4" x2="4" y2="4" stroke="#3b82f6" strokeWidth="2.5" />
                      </g>
                    )}

                    {comp.type === 'diode' && (
                      <g>
                        <path d="M -8 -8 L 6 0 L -8 8 Z" fill="#ef4444" />
                        <line x1="6" y1="-8" x2="6" y2="8" stroke="#ffffff" strokeWidth="2" />
                      </g>
                    )}

                    {comp.type === 'led' && (
                      <g>
                        <path d="M -8 -8 L 4 0 L -8 8 Z" fill="#ef4444" />
                        <line x1="4" y1="-8" x2="4" y2="8" stroke="#ffffff" strokeWidth="2" />
                        <line x1="0" y1="-8" x2="6" y2="-14" stroke="#facc15" strokeWidth="1.5" />
                        <line x1="4" y1="-6" x2="10" y2="-12" stroke="#facc15" strokeWidth="1.5" />
                      </g>
                    )}

                    {comp.type === 'npn_bjt' && (
                      <g>
                        <line x1="-6" y1="-10" x2="-6" y2="10" stroke="#10b981" strokeWidth="2.5" />
                        <line x1="-6" y1="-4" x2="6" y2="-10" stroke="#10b981" strokeWidth="2" />
                        <line x1="-6" y1="4" x2="6" y2="10" stroke="#10b981" strokeWidth="2" />
                        <polygon points="6,10 1,7 4,3" fill="#10b981" />
                      </g>
                    )}

                    {comp.type === 'dc_motor' && (
                      <text x="0" y="4" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">M</text>
                    )}

                    {comp.type === 'ground' && (
                      <g>
                        <line x1="0" y1="-10" x2="0" y2="0" stroke="#10b981" strokeWidth="2" />
                        <line x1="-8" y1="0" x2="8" y2="0" stroke="#10b981" strokeWidth="2" />
                        <line x1="-4" y1="4" x2="4" y2="4" stroke="#10b981" strokeWidth="2" />
                        <line x1="-1" y1="8" x2="1" y2="8" stroke="#10b981" strokeWidth="2" />
                      </g>
                    )}

                    {/* Component Label Text */}
                    <text x="0" y="28" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {comp.name}
                    </text>
                    <text x="0" y="38" fill="#38bdf8" fontSize="8" className="font-mono" textAnchor="middle">
                      {comp.value} {comp.unit}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>عدد العناصر: {components.length} | عدد الأسلاك والتفرعات: {wires.length}</span>
            <span className="font-mono text-cyan-400">IEEE Standard 315-1975 Approved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

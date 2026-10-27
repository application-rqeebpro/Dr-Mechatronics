import React from 'react';

interface WhiteboardDiagramProps {
  type: 'circuit_ohm' | 'circuit_rlc' | 'kinematics_graph' | 'vectors_force' | 'capacitor' | string;
  labels?: Record<string, string>;
  isAnimated?: boolean;
}

export const WhiteboardDiagram: React.FC<WhiteboardDiagramProps> = ({
  type,
  labels = {},
  isAnimated = true,
}) => {
  if (type === 'circuit_ohm' || type === 'circuit') {
    return (
      <div className="bg-white/95 rounded-xl border border-sky-200/80 p-3 shadow-inner max-w-md mx-auto my-2">
        <div className="text-[11px] font-mono text-sky-900 font-bold mb-1 flex items-center justify-between border-b border-sky-100 pb-1">
          <span>دائرة قانون أوم البسيطة (Ohm's Law Circuit)</span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">V = I · R</span>
        </div>
        <svg
          viewBox="0 0 420 180"
          className="w-full h-auto text-slate-800"
          style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
        >
          {/* Grid lines on whiteboard */}
          <defs>
            <pattern id="wb-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0f2fe" strokeWidth="0.8" />
            </pattern>
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0284c7" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#e11d48" />
            </marker>
          </defs>
          <rect width="420" height="180" fill="url(#wb-grid)" rx="8" />

          {/* Circuit wire loop */}
          <path
            d="M 60 90 L 60 40 L 160 40"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3.5"
            className={isAnimated ? 'animate-pulse' : ''}
          />
          {/* DC Voltage Source (Battery) on left: long line (+), short line (-) */}
          <g transform="translate(60, 90)">
            <circle cx="0" cy="0" r="18" fill="#f8fafc" stroke="#0284c7" strokeWidth="2.5" />
            <line x1="-12" y1="-5" x2="12" y2="-5" stroke="#0284c7" strokeWidth="3" />
            <line x1="-7" y1="5" x2="7" y2="5" stroke="#0284c7" strokeWidth="3" />
            <text x="24" y="-3" fill="#0284c7" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              +{labels.voltage || 'V = 12V'}
            </text>
            <text x="24" y="14" fill="#64748b" fontSize="11" fontFamily="sans-serif">-</text>
          </g>
          <path d="M 60 108 L 60 150 L 360 150 L 360 90" fill="none" stroke="#0f172a" strokeWidth="3.5" />

          {/* Current arrows */}
          <line x1="85" y1="40" x2="125" y2="40" stroke="#0284c7" strokeWidth="2.5" markerEnd="url(#arrow-blue)" />
          <text x="95" y="32" fill="#0284c7" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
            I (التيار)
          </text>

          {/* Ammeter in series */}
          <g transform="translate(190, 40)">
            <circle cx="0" cy="0" r="16" fill="#f8fafc" stroke="#475569" strokeWidth="2.5" />
            <text x="0" y="5" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">A</text>
            <text x="0" y="30" textAnchor="middle" fill="#475569" fontSize="10">Ammeter</text>
          </g>

          <line x1="206" y1="40" x2="250" y2="40" fill="none" stroke="#0f172a" strokeWidth="3.5" />

          {/* Resistor zig-zag */}
          <g transform="translate(250, 40)">
            <path
              d="M 0 0 L 10 -15 L 25 15 L 40 -15 L 55 15 L 70 -15 L 80 0 L 95 0"
              fill="none"
              stroke="#e11d48"
              strokeWidth="3.5"
            />
            <text x="45" y="-22" textAnchor="middle" fill="#e11d48" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              {labels.resistance || 'R = 4 Ω'}
            </text>
          </g>

          <path d="M 345 40 L 360 40 L 360 90" fill="none" stroke="#0f172a" strokeWidth="3.5" />

          {/* Voltmeter across resistor in parallel */}
          <g transform="translate(295, 95)">
            <path d="M -50 -55 L -50 0 L -20 0" fill="none" stroke="#64748b" strokeWidth="1.8" strokeDasharray="4 3" />
            <circle cx="0" cy="0" r="15" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
            <text x="0" y="5" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="bold">V</text>
            <path d="M 20 0 L 50 0 L 50 -55" fill="none" stroke="#64748b" strokeWidth="1.8" strokeDasharray="4 3" />
            <text x="0" y="24" textAnchor="middle" fill="#64748b" fontSize="10">Voltmeter</text>
          </g>
        </svg>
      </div>
    );
  }

  if (type === 'circuit_rlc') {
    return (
      <div className="bg-white/95 rounded-xl border border-sky-200/80 p-3 shadow-inner max-w-md mx-auto my-2">
        <div className="text-[11px] font-mono text-sky-900 font-bold mb-1 flex items-center justify-between border-b border-sky-100 pb-1">
          <span>دائرة التيار المتردد RLC المتوالية</span>
          <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded text-[10px]">Z = √(R² + (XL - XC)²)</span>
        </div>
        <svg viewBox="0 0 420 160" className="w-full h-auto text-slate-800">
          <defs>
            <marker id="arrow-ac" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0284c7" />
            </marker>
          </defs>
          <rect width="420" height="160" fill="#f8fafc" rx="8" />

          {/* Loop */}
          <path d="M 60 80 L 60 30 L 110 30" fill="none" stroke="#0f172a" strokeWidth="3" />
          {/* AC source */}
          <g transform="translate(60, 80)">
            <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
            <path d="M -8 0 Q -4 -8 0 0 T 8 0" fill="none" stroke="#0284c7" strokeWidth="2.5" />
            <text x="24" y="5" fill="#0284c7" fontSize="12" fontWeight="bold">v(t) = Vm sin(ωt)</text>
          </g>
          <path d="M 60 98 L 60 135 L 370 135 L 370 30" fill="none" stroke="#0f172a" strokeWidth="3" />

          {/* R */}
          <g transform="translate(110, 30)">
            <path d="M 0 0 L 8 -12 L 20 12 L 32 -12 L 44 12 L 54 -12 L 62 0" fill="none" stroke="#e11d48" strokeWidth="3" />
            <text x="31" y="-18" textAnchor="middle" fill="#e11d48" fontSize="12" fontWeight="bold">R (مقاومة)</text>
          </g>
          <line x1="172" y1="30" x2="200" y2="30" stroke="#0f172a" strokeWidth="3" />

          {/* L (Inductor loops) */}
          <g transform="translate(200, 30)">
            <path d="M 0 0 C 5 -15 15 -15 20 0 C 25 -15 35 -15 40 0 C 45 -15 55 -15 60 0" fill="none" stroke="#0284c7" strokeWidth="3" />
            <text x="30" y="-18" textAnchor="middle" fill="#0284c7" fontSize="12" fontWeight="bold">L (ملف)</text>
          </g>
          <line x1="260" y1="30" x2="290" y2="30" stroke="#0f172a" strokeWidth="3" />

          {/* C (Capacitor parallel plates) */}
          <g transform="translate(290, 30)">
            <line x1="0" y1="0" x2="16" y2="0" stroke="#0f172a" strokeWidth="3" />
            <line x1="16" y1="-14" x2="16" y2="14" stroke="#0d9488" strokeWidth="3.5" />
            <line x1="26" y1="-14" x2="26" y2="14" stroke="#0d9488" strokeWidth="3.5" />
            <line x1="26" y1="0" x2="42" y2="0" stroke="#0f172a" strokeWidth="3" />
            <text x="21" y="-18" textAnchor="middle" fill="#0d9488" fontSize="12" fontWeight="bold">C (مكثف)</text>
          </g>
          <line x1="332" y1="30" x2="370" y2="30" stroke="#0f172a" strokeWidth="3" />
        </svg>
      </div>
    );
  }

  if (type === 'kinematics_graph' || type === 'kinematics') {
    return (
      <div className="bg-white/95 rounded-xl border border-sky-200/80 p-3 shadow-inner max-w-md mx-auto my-2">
        <div className="text-[11px] font-mono text-sky-900 font-bold mb-1 flex items-center justify-between border-b border-sky-100 pb-1">
          <span>منحنى السرعة مع الزمن (v-t Graph) بتسارع منتظم</span>
          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px]">v = v₀ + a·t</span>
        </div>
        <svg viewBox="0 0 380 160" className="w-full h-auto text-slate-800">
          <rect width="380" height="160" fill="#f8fafc" rx="8" />
          {/* Axes */}
          <line x1="50" y1="130" x2="350" y2="130" stroke="#334155" strokeWidth="2.5" />
          <line x1="50" y1="130" x2="50" y2="20" stroke="#334155" strokeWidth="2.5" />
          <text x="350" y="145" fill="#334155" fontSize="11" fontWeight="bold">الزمن t (s)</text>
          <text x="25" y="25" fill="#334155" fontSize="11" fontWeight="bold">v (m/s)</text>

          {/* Area under curve (displacement Δx) */}
          <polygon points="50,90 280,35 280,130 50,130" fill="#bae6fd" opacity="0.4" />
          <text x="145" y="105" fill="#0284c7" fontSize="11" fontWeight="bold">المساحة = الإزاحة Δx</text>

          {/* Motion line */}
          <line x1="50" y1="90" x2="280" y2="35" stroke="#e11d48" strokeWidth="3.5" />
          <circle cx="50" cy="90" r="4" fill="#e11d48" />
          <text x="25" y="94" fill="#e11d48" fontSize="11" fontWeight="bold">v₀</text>

          <circle cx="280" cy="35" r="4" fill="#e11d48" />
          <line x1="280" y1="35" x2="280" y2="130" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="275" y="145" fill="#334155" fontSize="11">t</text>
          <text x="288" y="38" fill="#e11d48" fontSize="11" fontWeight="bold">v</text>

          {/* Slope text */}
          <text x="180" y="55" fill="#be123c" fontSize="11" fontWeight="bold">الميل = التسارع a</text>
        </svg>
      </div>
    );
  }

  // Default: Force & Newton free body diagram
  return (
    <div className="bg-white/95 rounded-xl border border-sky-200/80 p-3 shadow-inner max-w-md mx-auto my-2">
      <div className="text-[11px] font-mono text-sky-900 font-bold mb-1 flex items-center justify-between border-b border-sky-100 pb-1">
        <span>مخطط الجسم الحر وتحليل القوى (Free-Body Diagram)</span>
        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Σ F = m · a</span>
      </div>
      <svg viewBox="0 0 380 160" className="w-full h-auto text-slate-800">
        <defs>
          <marker id="arr-force" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0284c7" />
          </marker>
          <marker id="arr-weight" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#e11d48" />
          </marker>
        </defs>
        <rect width="380" height="160" fill="#f8fafc" rx="8" />

        {/* Floor */}
        <line x1="40" y1="125" x2="340" y2="125" stroke="#475569" strokeWidth="3" />
        {/* Box */}
        <rect x="150" y="65" width="80" height="60" fill="#e2e8f0" stroke="#334155" strokeWidth="2.5" rx="4" />
        <text x="190" y="100" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="bold">m = 5kg</text>

        {/* Normal force N (up) */}
        <line x1="190" y1="65" x2="190" y2="20" stroke="#0284c7" strokeWidth="3" markerEnd="url(#arr-force)" />
        <text x="200" y="28" fill="#0284c7" fontSize="12" fontWeight="bold">N (القوة العمودية)</text>

        {/* Weight mg (down) */}
        <line x1="190" y1="125" x2="190" y2="155" stroke="#e11d48" strokeWidth="3" markerEnd="url(#arr-weight)" />
        <text x="200" y="152" fill="#e11d48" fontSize="12" fontWeight="bold">W = m·g</text>

        {/* Applied force F (right) */}
        <line x1="230" y1="95" x2="300" y2="95" stroke="#0284c7" strokeWidth="3" markerEnd="url(#arr-force)" />
        <text x="305" y="99" fill="#0284c7" fontSize="12" fontWeight="bold">F = 20 N</text>

        {/* Friction force fk (left) */}
        <line x1="150" y1="110" x2="90" y2="110" stroke="#d97706" strokeWidth="2.5" markerEnd="url(#arr-force)" />
        <text x="60" y="105" fill="#d97706" fontSize="11" fontWeight="bold">fk (احتكاك)</text>
      </svg>
    </div>
  );
};

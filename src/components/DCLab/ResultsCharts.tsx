import React, { useState } from 'react';
import { SimulationResult, CircuitElement } from '../../types/dcLab';
import { LineChart, BarChart3, Activity, Zap, TrendingUp, Layers } from 'lucide-react';

interface Props {
  simulationResult: SimulationResult;
  components: CircuitElement[];
  experimentNumber?: number;
}

export const ResultsCharts: React.FC<Props> = ({
  simulationResult,
  components,
  experimentNumber = 4
}) => {
  const [chartMode, setChartMode] = useState<'v-i' | 'power-rl' | 'transient' | 'branch-bar'>(() => {
    if (experimentNumber === 15) return 'transient';
    if (experimentNumber === 12) return 'power-rl';
    return 'v-i';
  });

  const primaryR = components.find(c => c.type === 'resistor');
  const dcSource = components.find(c => c.type === 'dc_source' || c.type === 'battery');
  const rVal = primaryR ? primaryR.value || 1000 : 1000;
  const currentV = dcSource ? dcSource.value || 10 : 10;

  // Generate V-I points (from 0V to 20V)
  const viPoints: { v: number; i: number }[] = [];
  for (let v = 0; v <= 20; v += 2) {
    viPoints.push({ v, i: (v / rVal) * 1000 }); // i in mA
  }

  // Generate Power vs RL points for Maximum Power Transfer
  const rth = 1000;
  const vth = 10;
  const prlPoints: { rl: number; p: number }[] = [];
  const testRls = [100, 250, 500, 750, 1000, 1250, 1500, 2000, 3000, 4000, 5000];
  for (const rl of testRls) {
    const p = Math.pow(vth / (rth + rl), 2) * rl * 1000; // in mW
    prlPoints.push({ rl, p });
  }

  // Transient points from simulationResult if available
  const transient = simulationResult.transientCurve;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
      {/* Header and selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base">الرسوم البيانية الهندسية الحية (Dynamic Plots)</h4>
            <p className="text-[11px] text-slate-400">تحليل المنحنيات الكهربائية ومقارنتها بالقوانين الرياضية لحظياً</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setChartMode('v-i')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              chartMode === 'v-i' ? 'bg-purple-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            منحنى V-I (قانون أوم)
          </button>
          <button
            onClick={() => setChartMode('power-rl')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              chartMode === 'power-rl' ? 'bg-purple-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            القدرة P مقابل RL
          </button>
          <button
            onClick={() => setChartMode('transient')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              chartMode === 'transient' ? 'bg-purple-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            شحن وتفريغ المكثف والملف
          </button>
          <button
            onClick={() => setChartMode('branch-bar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              chartMode === 'branch-bar' ? 'bg-purple-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            توزيع الجهد والقدرة بالفروع
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="bg-slate-950 rounded-2xl p-4 sm:p-6 border border-slate-800">
        {/* 1. V-I Curve */}
        {chartMode === 'v-i' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-400">العلاقة الخطية بين الجهد V (فولت) والتيار I (مللي أمبير)</span>
              <span className="font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                الميل Slope = R = {rVal} Ω
              </span>
            </div>

            <div className="h-64 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 500 240">
                {/* Grid lines */}
                {[0, 60, 120, 180].map((y) => (
                  <line key={y} x1="50" y1={y + 20} x2="480" y2={y + 20} stroke="#1e293b" strokeDasharray="3 3" />
                ))}
                {[50, 150, 250, 350, 450].map((x) => (
                  <line key={x} x1={x} y1="20" x2={x} y2="200" stroke="#1e293b" strokeDasharray="3 3" />
                ))}

                {/* Axes */}
                <line x1="50" y1="200" x2="480" y2="200" stroke="#64748b" strokeWidth="2" />
                <line x1="50" y1="20" x2="50" y2="200" stroke="#64748b" strokeWidth="2" />

                {/* Labels */}
                <text x="470" y="218" fill="#94a3b8" fontSize="11" textAnchor="end">الجهد V (Volts)</text>
                <text x="20" y="25" fill="#94a3b8" fontSize="11">I (mA)</text>

                {/* Line Plot */}
                <polyline
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3.5"
                  points={viPoints.map(p => `${50 + (p.v / 20) * 400},${200 - (p.i / ((20 / rVal) * 1000 || 1)) * 170}`).join(' ')}
                />

                {/* Operating Point */}
                {(() => {
                  const currentI = (currentV / rVal) * 1000;
                  const cx = 50 + (currentV / 20) * 400;
                  const cy = 200 - (currentI / ((20 / rVal) * 1000 || 1)) * 170;
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r="6" fill="#f59e0b" className="animate-pulse" />
                      <circle cx={cx} cy={cy} r="12" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                      <text x={cx + 10} y={cy - 10} fill="#f59e0b" fontSize="10" fontWeight="bold">
                        نقطة التشغيل ({currentV}V, {currentI.toFixed(1)}mA)
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>
          </div>
        )}

        {/* 2. Power vs RL */}
        {chartMode === 'power-rl' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400">منحنى نقل القدرة العظمى P_L (mW) مقابل مقاومة الحمل R_L (Ω)</span>
              <span className="font-mono text-emerald-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                الذروة عند RL = Rth = {rth} Ω (Pmax = 25 mW)
              </span>
            </div>

            <div className="h-64 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 500 240">
                {/* Grid */}
                {[0, 60, 120, 180].map((y) => (
                  <line key={y} x1="50" y1={y + 20} x2="480" y2={y + 20} stroke="#1e293b" strokeDasharray="3 3" />
                ))}
                {/* Axes */}
                <line x1="50" y1="200" x2="480" y2="200" stroke="#64748b" strokeWidth="2" />
                <line x1="50" y1="20" x2="50" y2="200" stroke="#64748b" strokeWidth="2" />

                <text x="470" y="218" fill="#94a3b8" fontSize="11" textAnchor="end">مقاومة الحمل R_L (Ω)</text>
                <text x="15" y="25" fill="#94a3b8" fontSize="11">P (mW)</text>

                {/* Curve */}
                <path
                  d={`M ${prlPoints.map((p, idx) => {
                    const x = 50 + (p.rl / 5000) * 400;
                    const y = 200 - (p.p / 28) * 170;
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                />

                {/* Peak Point Indicator */}
                <g>
                  <circle cx={50 + (1000 / 5000) * 400} cy={200 - (25 / 28) * 170} r="7" fill="#10b981" />
                  <line x1={50 + (1000 / 5000) * 400} y1={200 - (25 / 28) * 170} x2={50 + (1000 / 5000) * 400} y2="200" stroke="#10b981" strokeDasharray="2 2" />
                  <text x={50 + (1000 / 5000) * 400} y={200 - (25 / 28) * 170 - 10} fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">
                    P_max = 25 mW عند RL = 1kΩ
                  </text>
                </g>
              </svg>
            </div>
          </div>
        )}

        {/* 3. Transient RC / RL curve */}
        {chartMode === 'transient' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-400">استجابة شحن المكثف/الملف مع الزمن v(t) و i(t)</span>
              <span className="font-mono text-cyan-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                ثابت الوقت τ = {transient ? transient.tau.toFixed(2) : '4.70'} ثانية
              </span>
            </div>

            <div className="h-64 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 500 240">
                {/* Grid */}
                {[0, 60, 120, 180].map((y) => (
                  <line key={y} x1="50" y1={y + 20} x2="480" y2={y + 20} stroke="#1e293b" strokeDasharray="3 3" />
                ))}
                <line x1="50" y1="200" x2="480" y2="200" stroke="#64748b" strokeWidth="2" />
                <line x1="50" y1="20" x2="50" y2="200" stroke="#64748b" strokeWidth="2" />

                <text x="470" y="218" fill="#94a3b8" fontSize="11" textAnchor="end">الزمن t (ثوانٍ / τ)</text>
                <text x="15" y="25" fill="#94a3b8" fontSize="11">Vc (V)</text>

                {/* Exponential Charging Curve */}
                {transient && transient.timePoints.length > 0 ? (
                  <path
                    d={`M ${transient.timePoints.map((t, idx) => {
                      const maxT = transient.timePoints[transient.timePoints.length - 1] || 1;
                      const x = 50 + (t / maxT) * 400;
                      const y = 200 - (transient.voltages[idx] / 10) * 170;
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}`}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3.5"
                  />
                ) : (
                  /* Fallback standard RC curve */
                  <path
                    d="M 50 200 Q 130 50, 450 35"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3.5"
                  />
                )}

                {/* 1 Tau mark (63.2%) */}
                <circle cx={50 + 80} cy={200 - 0.632 * 170} r="5" fill="#f59e0b" />
                <text x={50 + 85} y={200 - 0.632 * 170 + 4} fill="#f59e0b" fontSize="10">
                  عند 1τ (63.2% = 6.32V)
                </text>

                {/* 5 Tau mark (99.3%) */}
                <circle cx={50 + 400} cy={200 - 0.993 * 170} r="5" fill="#10b981" />
                <text x={50 + 390} y={200 - 0.993 * 170 - 8} fill="#10b981" fontSize="10" textAnchor="end">
                  عند 5τ (الاستقرار 99.3%)
                </text>
              </svg>
            </div>
          </div>
        )}

        {/* 4. Branch Breakdown */}
        {chartMode === 'branch-bar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400">توزيع هبوط الجهد والقدرة عبر عناصر الدائرة الحالية</span>
            </div>

            <div className="space-y-3 pt-2">
              {components.filter(c => c.type === 'resistor' || c.type === 'potentiometer' || c.type === 'led').map((c) => {
                const sim = simulationResult.elementData[c.id];
                const v = Math.abs(sim?.voltageDrop ?? 0);
                const p = (sim?.power ?? 0) * 1000; // in mW
                const vPercent = Math.min(100, (v / (currentV || 1)) * 100);

                return (
                  <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="font-bold">{c.name} ({c.value} {c.unit})</span>
                      <span className="font-mono text-cyan-400">{v.toFixed(2)} V • {p.toFixed(1)} mW</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${vPercent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

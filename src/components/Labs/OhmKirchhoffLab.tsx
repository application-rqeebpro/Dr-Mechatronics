import React, { useState, useEffect, useRef } from 'react';
import { Zap, Flame, Info, GitFork, Gauge } from 'lucide-react';

export const OhmKirchhoffLab: React.FC = () => {
  const [mode, setMode] = useState<'ohm' | 'kirchhoff'>('ohm');
  const [voltage, setVoltage] = useState<number>(12); // Volts
  const [resistance, setResistance] = useState<number>(10); // Ohms
  const [r2, setR2] = useState<number>(20); // Ohms for Kirchhoff parallel

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<{ x: number; y: number; speed: number; branch: number }[]>([]);

  // Ohm Calculations
  const current = resistance > 0 ? voltage / resistance : 0;
  const power = voltage * current;

  // Kirchhoff Calculations (Parallel Branches)
  const current1 = resistance > 0 ? voltage / resistance : 0;
  const current2 = r2 > 0 ? voltage / r2 : 0;
  const totalCurrent = current1 + current2;
  const req = (resistance * r2) / (resistance + r2);

  // Initialize electron flow particles
  useEffect(() => {
    const particles: { x: number; y: number; speed: number; branch: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * 500,
        y: 80,
        speed: 1 + Math.random(),
        branch: Math.random() > 0.5 ? 1 : 2,
      });
    }
    particlesRef.current = particles;
  }, [mode]);

  // Render circuit schematic with moving electrons
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#060d17';
      ctx.fillRect(0, 0, w, h);

      // Draw wire paths
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#38bdf8'; // Blue wire
      ctx.lineCap = 'round';

      if (mode === 'ohm') {
        // Single rectangular loop
        ctx.strokeRect(60, 40, w - 120, h - 80);

        // Power Source (Left)
        ctx.fillStyle = '#060d17';
        ctx.fillRect(45, h / 2 - 25, 30, 50);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(50, h / 2 - 18);
        ctx.lineTo(70, h / 2 - 18); // Long plate (+)
        ctx.moveTo(56, h / 2 + 18);
        ctx.lineTo(64, h / 2 + 18); // Short plate (-)
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 12px JetBrains Mono';
        ctx.fillText(`+ ${voltage}V -`, 25, h / 2 + 35);

        // Resistor (Right) - glowing with heat
        ctx.fillStyle = '#060d17';
        ctx.fillRect(w - 75, h / 2 - 35, 30, 70);

        // Heating color: from grey to bright orange/red
        const heatFactor = Math.min(power / 100, 1);
        const rColor = heatFactor > 0.5 ? '#ef4444' : heatFactor > 0.2 ? '#f97316' : '#64748b';
        ctx.strokeStyle = rColor;
        ctx.lineWidth = 3.5;

        // Zigzag resistor
        ctx.beginPath();
        const rx = w - 60;
        ctx.moveTo(rx, h / 2 - 30);
        ctx.lineTo(rx - 8, h / 2 - 20);
        ctx.lineTo(rx + 8, h / 2 - 10);
        ctx.lineTo(rx - 8, h / 2);
        ctx.lineTo(rx + 8, h / 2 + 10);
        ctx.lineTo(rx - 8, h / 2 + 20);
        ctx.lineTo(rx, h / 2 + 30);
        ctx.stroke();

        ctx.fillStyle = rColor;
        ctx.fillText(`${resistance} Ω`, w - 110, h / 2 + 5);

        // Animate electron dots around the loop
        const flowSpeed = Math.min(Math.max(current * 0.8, 0.2), 8);
        ctx.fillStyle = '#38bdf8';

        particlesRef.current.forEach((p) => {
          // move along rectangle: perimeter = 2*(w-120) + 2*(h-80)
          p.x = (p.x + flowSpeed) % (2 * (w - 120) + 2 * (h - 80));

          // map linear position to rectangular coordinates
          let px = 60;
          let py = 40;
          const topLen = w - 120;
          const rightLen = h - 80;
          const bottomLen = topLen;

          if (p.x < topLen) {
            px = 60 + p.x;
            py = 40;
          } else if (p.x < topLen + rightLen) {
            px = 60 + topLen;
            py = 40 + (p.x - topLen);
          } else if (p.x < topLen + rightLen + bottomLen) {
            px = 60 + topLen - (p.x - (topLen + rightLen));
            py = 40 + rightLen;
          } else {
            px = 60;
            py = 40 + rightLen - (p.x - (topLen + rightLen + bottomLen));
          }

          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Kirchhoff Parallel circuit
        ctx.strokeRect(60, 40, w - 240, h - 80);
        // Middle parallel wire
        ctx.beginPath();
        ctx.moveTo(w - 240 + 60, 40);
        ctx.lineTo(w - 100, 40);
        ctx.lineTo(w - 100, h - 40);
        ctx.lineTo(w - 240 + 60, h - 40);
        ctx.stroke();

        // Node dots
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(w - 180, 40, 5, 0, Math.PI * 2);
        ctx.arc(w - 180, h - 40, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '11px JetBrains Mono';
        ctx.fillText(`العقدة A (Node)`, w - 230, 28);
        ctx.fillText(`Itotal = I1 + I2`, w - 220, h - 15);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [mode, voltage, resistance, r2, current, power]);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 text-slate-100 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              مختبر قانون أوم وقوانين كيرشوف (Ohm & Kirchhoff Lab)
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              محاكاة تدفق الإلكترونات، تبديد القدرة الحرارية، وتفرع التيارات عند العقد
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('ohm')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'ohm' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            قانون أوم (Ohm's Law)
          </button>
          <button
            onClick={() => setMode('kirchhoff')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'kirchhoff' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            قانون كيرشوف للتيار (KCL)
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Schematic Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
            <canvas ref={canvasRef} width={580} height={260} className="w-full h-auto block" />
          </div>

          {/* Real-time Cards */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">التيار الإجمالي (I)</span>
              <span className="text-lg font-mono font-bold text-cyan-400">
                {mode === 'ohm' ? current.toFixed(2) : totalCurrent.toFixed(2)}{' '}
                <span className="text-xs">A</span>
              </span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">القدرة المبددة (P)</span>
              <span className="text-lg font-mono font-bold text-amber-400">
                {power.toFixed(1)} <span className="text-xs">W</span>
              </span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">
                {mode === 'ohm' ? 'المقاومة الكلية' : 'المقاومة المكافئة Req'}
              </span>
              <span className="text-lg font-mono font-bold text-emerald-400">
                {mode === 'ohm' ? resistance : req.toFixed(2)} <span className="text-xs">Ω</span>
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block pb-2 border-b border-slate-800">
              التحكم في الجهد والمقاومات
            </span>

            {/* Voltage */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">جهد المصدر (V)</span>
                <span className="font-mono text-amber-400 font-bold">{voltage} Volts</span>
              </div>
              <input
                type="range"
                min="1"
                max="36"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Resistance R1 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">
                  {mode === 'ohm' ? 'قيمة المقاومة R' : 'مقاومة الفرع الأول R1'}
                </span>
                <span className="font-mono text-cyan-400 font-bold">{resistance} Ω</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Resistance R2 for Kirchhoff */}
            {mode === 'kirchhoff' && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">مقاومة الفرع الثاني R2</span>
                  <span className="font-mono text-emerald-400 font-bold">{r2} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={r2}
                  onChange={(e) => setR2(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Formula summary */}
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 space-y-1 mt-4">
            <div className="text-amber-400 font-bold">
              {mode === 'ohm' ? 'قانون أوم وقانون جول:' : 'قانون كيرشوف للتيار (KCL):'}
            </div>
            {mode === 'ohm' ? (
              <>
                <div>• I = V / R = {voltage} / {resistance} = {current.toFixed(2)} A</div>
                <div>• P = V · I = I² · R = {power.toFixed(1)} Watts</div>
              </>
            ) : (
              <>
                <div>• I1 = V / R1 = {current1.toFixed(2)} A</div>
                <div>• I2 = V / R2 = {current2.toFixed(2)} A</div>
                <div>• I_total = I1 + I2 = {totalCurrent.toFixed(2)} A</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

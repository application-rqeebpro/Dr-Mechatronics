import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity, Zap, Waves, Info } from 'lucide-react';

export const RLCCircuitLab: React.FC = () => {
  const [circuitType, setCircuitType] = useState<'RL' | 'RC' | 'RLC'>('RLC');
  const [resistance, setResistance] = useState<number>(25); // Ohms
  const [inductance, setInductance] = useState<number>(50); // mH
  const [capacitance, setCapacitance] = useState<number>(20); // uF
  const [frequency, setFrequency] = useState<number>(100); // Hz
  const [vin, setVin] = useState<number>(12); // Volts peak
  const [isRunning, setIsRunning] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Calculations
  const omega = 2 * Math.PI * frequency; // rad/s
  const L_H = inductance * 1e-3; // Henries
  const C_F = capacitance * 1e-6; // Farads

  let XL = 0;
  let XC = 0;

  if (circuitType === 'RL' || circuitType === 'RLC') {
    XL = omega * L_H;
  }
  if (circuitType === 'RC' || circuitType === 'RLC') {
    XC = 1 / (omega * C_F);
  }

  const X_net = XL - XC;
  const Z = Math.sqrt(resistance * resistance + X_net * X_net);
  const Im = Z > 0 ? vin / Z : 0;
  const phaseRad = Math.atan2(X_net, resistance);
  const phaseDeg = (phaseRad * 180) / Math.PI;

  // Resonance frequency for RLC
  const f0 = circuitType === 'RLC' ? 1 / (2 * Math.PI * Math.sqrt(L_H * C_F)) : null;
  const isAtResonance = f0 !== null && Math.abs(frequency - f0) < 5;

  // Draw oscilloscope waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localTime = timeRef.current;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Clear with dark oscilloscope grid
      ctx.fillStyle = '#060d17';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = '#10233d';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center crosshair
      ctx.strokeStyle = '#1e3a5f';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      // Plot Voltage V(t) - Cyan Wave
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#38bdf8'; // Sky cyan
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        // map x to time
        const t = (x / width) * (4 / frequency) + localTime;
        const v = vin * Math.sin(omega * t);
        const y = centerY - (v / 25) * (height * 0.38);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Plot Current I(t) - Emerald / Amber Wave (scaled for visibility)
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#34d399'; // Emerald
      ctx.beginPath();
      const currentScale = Im > 0 ? (height * 0.35) / Math.max(Im, 0.5) : 1;
      for (let x = 0; x < width; x++) {
        const t = (x / width) * (4 / frequency) + localTime;
        const i = Im * Math.sin(omega * t - phaseRad);
        const y = centerY - i * currentScale;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (isRunning) {
        localTime += 0.0003;
        timeRef.current = localTime;
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [circuitType, resistance, inductance, capacitance, frequency, vin, isRunning, omega, Im, phaseRad]);

  const snapToResonance = () => {
    if (f0) {
      setFrequency(Math.round(f0));
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 text-slate-100 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              مختبر دوائر التيار المتردد (RL - RC - RLC AC Lab)
              {isAtResonance && (
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full animate-pulse">
                  ⚡ حالة رنين كهربائي (Resonance)
                </span>
              )}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              محاكاة استجابة التردد، زاوية الطور، والمعاوقة مع راسم إشارة تفاعلي
            </p>
          </div>
        </div>

        {/* Circuit Type selector */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['RL', 'RC', 'RLC'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setCircuitType(type)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                circuitType === type
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              دائرة {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Visualizer + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Oscilloscope Canvas & Waveform Legends */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
            <canvas
              ref={canvasRef}
              width={640}
              height={300}
              className="w-full h-auto block"
            />
            {/* Waveform Labels Overlay */}
            <div className="absolute top-3 start-3 flex items-center gap-4 bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-sm shadow-cyan-400" />
                V(t) الجهد [{vin} V]
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400" />
                I(t) التيار [{Im.toFixed(3)} A]
              </span>
            </div>

            {/* Play/Pause controls */}
            <div className="absolute bottom-3 end-3 flex items-center gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title={isRunning ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  timeRef.current = 0;
                }}
                className="p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title="إعادة ضبط الموجة"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Circuit Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1">المعاوقة الكلية Z</span>
              <span className="text-base sm:text-lg font-mono font-bold text-cyan-400">
                {Z.toFixed(2)} <span className="text-xs">Ω</span>
              </span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1">قمة التيار Im</span>
              <span className="text-base sm:text-lg font-mono font-bold text-emerald-400">
                {(Im * 1000).toFixed(1)} <span className="text-xs">mA</span>
              </span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1">زاوية الطور φ</span>
              <span className={`text-base sm:text-lg font-mono font-bold ${phaseDeg > 0 ? 'text-amber-400' : 'text-blue-400'}`}>
                {phaseDeg.toFixed(1)}°
              </span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1">تردد الرنين f₀</span>
              <span className="text-base sm:text-lg font-mono font-bold text-purple-400">
                {f0 ? `${f0.toFixed(1)} Hz` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Phase Nature Explanation */}
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              {circuitType === 'RL' && (
                <span>
                  <strong>سلوك حثي (Inductive):</strong> الجهد يسبق التيار بزاوية طور موجبة (+{phaseDeg.toFixed(1)}°). الملف يقاوم تزايد التيار بالحث الذاتي.
                </span>
              )}
              {circuitType === 'RC' && (
                <span>
                  <strong>سلوك سعوي (Capacitive):</strong> التيار يسبق الجهد بزاوية طور سالبة ({phaseDeg.toFixed(1)}°). الشحنات تتراكم على لوحي المكثف أولاً.
                </span>
              )}
              {circuitType === 'RLC' && (
                <span>
                  {isAtResonance ? (
                    <strong className="text-amber-300">
                      ⚡ الدائرة في حالة رنين تام! XL = XC = {XL.toFixed(1)} Ω. المعاوقة تساوي المقاومة R = {resistance} Ω فقط والتيار في أقصى قيمة!
                    </strong>
                  ) : phaseDeg > 0 ? (
                    <span>
                      <strong>الغلبة للحث (XL &gt; XC):</strong> الجهد يسبق التيار بزاوية +{phaseDeg.toFixed(1)}°.
                    </span>
                  ) : (
                    <span>
                      <strong>الغلبة للسعة (XC &gt; XL):</strong> التيار يسبق الجهد بزاوية {phaseDeg.toFixed(1)}°.
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Sliders & Parameter Tuner */}
        <div className="lg:col-span-5 bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                معايير الدائرة (Circuit Parameters)
              </span>
              {circuitType === 'RLC' && f0 && (
                <button
                  onClick={snapToResonance}
                  className="text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors"
                >
                  اضبط على الرنين ({Math.round(f0)} Hz)
                </button>
              )}
            </div>

            {/* Frequency Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">تردد المصدر (Frequency f)</span>
                <span className="font-mono text-cyan-400 font-bold">{frequency} Hz</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>10 Hz</span>
                <span>ω = {omega.toFixed(1)} rad/s</span>
                <span>500 Hz</span>
              </div>
            </div>

            {/* Voltage Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">جهد القمة (Peak Voltage Vm)</span>
                <span className="font-mono text-cyan-400 font-bold">{vin} V</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={vin}
                onChange={(e) => setVin(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Resistance R */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">المقاومة (Resistance R)</span>
                <span className="font-mono text-cyan-400 font-bold">{resistance} Ω</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Inductance L (if applicable) */}
            {(circuitType === 'RL' || circuitType === 'RLC') && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">معامل الحث (Inductance L)</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {inductance} mH <span className="text-[10px] text-slate-500">(XL = {XL.toFixed(1)} Ω)</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={inductance}
                  onChange={(e) => setInductance(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            )}

            {/* Capacitance C (if applicable) */}
            {(circuitType === 'RC' || circuitType === 'RLC') && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">السعة الكهربائية (Capacitance C)</span>
                  <span className="font-mono text-purple-400 font-bold">
                    {capacitance} μF <span className="text-[10px] text-slate-500">(XC = {XC.toFixed(1)} Ω)</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={capacitance}
                  onChange={(e) => setCapacitance(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Quick Mathematical Summary */}
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
            <div className="text-cyan-400 font-bold">المعادلات المطبقة في المحاكاة:</div>
            <div>• Z = √(R² + ({circuitType === 'RL' ? 'ωL' : circuitType === 'RC' ? '1/ωC' : 'ωL - 1/ωC'})²)</div>
            <div>• I(t) = Im · sin(ωt - φ)</div>
            <div>• Im = {vin} / {Z.toFixed(1)} = {(Im * 1000).toFixed(1)} mA</div>
          </div>
        </div>
      </div>
    </div>
  );
};

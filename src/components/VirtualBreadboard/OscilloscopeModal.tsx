import React, { useState, useEffect, useRef } from 'react';
import { X, Activity, Sliders, Play, Square, RefreshCw, Zap } from 'lucide-react';

interface Props {
  ch1Voltage: number; // Volts
  ch2Voltage: number; // Volts
  freq?: number;      // Hz
  isSimulating: boolean;
  onClose: () => void;
}

export const OscilloscopeModal: React.FC<Props> = ({
  ch1Voltage,
  ch2Voltage,
  freq = 50,
  isSimulating,
  onClose,
}) => {
  const [voltsPerDivCH1, setVoltsPerDivCH1] = useState<number>(2.0); // 2V / div
  const [voltsPerDivCH2, setVoltsPerDivCH2] = useState<number>(2.0);
  const [timePerDiv, setTimePerDiv] = useState<number>(5.0); // 5ms / div
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [triggerLevel, setTriggerLevel] = useState<number>(0.0);
  const [timeOffset, setTimeOffset] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation frame loop for continuous waveform rendering
  useEffect(() => {
    let animId: number;
    let t = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Clear CRT Dark Background
      ctx.fillStyle = '#05131e';
      ctx.fillRect(0, 0, w, h);

      // 2. Draw 10x8 Phosphor Grid Lines
      ctx.strokeStyle = '#0e3a4e';
      ctx.lineWidth = 1;

      const numCols = 10;
      const numRows = 8;
      const colWidth = w / numCols;
      const rowHeight = h / numRows;

      for (let c = 0; c <= numCols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * colWidth, 0);
        ctx.lineTo(c * colWidth, h);
        ctx.stroke();
      }

      for (let r = 0; r <= numRows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * rowHeight);
        ctx.lineTo(w, r * rowHeight);
        ctx.stroke();
      }

      // Center crosshairs tick marks
      ctx.strokeStyle = '#155e75';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();

      if (isSimulating && !isPaused) {
        t += 0.05;
      }

      // 3. Draw Channel 1 Waveform (Neon Yellow / Amber)
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      const centerY = h / 2;
      const vPeak1 = Math.max(0.1, Math.abs(ch1Voltage) || 5.0);
      const effectiveFreq = Math.max(1, freq || 50);

      for (let x = 0; x < w; x++) {
        // Calculate instantaneous time in ms
        const timeMs = (x / colWidth) * timePerDiv;
        const wave = Math.sin((2 * Math.PI * effectiveFreq * (timeMs / 1000)) + t);
        const vInstant = vPeak1 * wave;
        const y = centerY - (vInstant / voltsPerDivCH1) * rowHeight;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 4. Draw Channel 2 Waveform (Cyan)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      const vPeak2 = Math.max(0.1, Math.abs(ch2Voltage) || 3.3);
      for (let x = 0; x < w; x++) {
        const timeMs = (x / colWidth) * timePerDiv;
        // Phase-shifted wave
        const wave2 = Math.sin((2 * Math.PI * effectiveFreq * (timeMs / 1000)) + t - Math.PI / 3);
        const vInstant2 = vPeak2 * wave2;
        const y2 = centerY - (vInstant2 / voltsPerDivCH2) * rowHeight;

        if (x === 0) ctx.moveTo(x, y2);
        else ctx.lineTo(x, y2);
      }
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [ch1Voltage, ch2Voltage, freq, isSimulating, isPaused, voltsPerDivCH1, voltsPerDivCH2, timePerDiv]);

  const vppCH1 = ((Math.abs(ch1Voltage) || 5.0) * 2).toFixed(2);
  const vrmsCH1 = ((Math.abs(ch1Voltage) || 5.0) * 0.707).toFixed(2);
  const periodMs = (1000 / (freq || 50)).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-4xl w-full flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                راسم الإشارة الرقمي ثنائي القناة (Dual-Channel Digital Storage Oscilloscope)
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  DSO-50MHz
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                مراقبة تغيرات الجهد اللحظية مع الزمن $v(t)$، التردد، وفرق الطور بدقة معملية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isPaused ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-200 hover:text-white'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'استئناف (Run)' : 'تجميد (Hold)'}</span>
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Oscilloscope Body & Controls */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Phosphor CRT Screen */}
          <div className="relative rounded-2xl overflow-hidden border-4 border-slate-950 shadow-2xl bg-slate-950">
            <canvas ref={canvasRef} width={760} height={360} className="w-full h-64 sm:h-80 block" />

            {/* Live Measurements OSD Overlay */}
            <div className="absolute top-2 start-3 flex flex-wrap gap-3 text-[11px] font-mono">
              <span className="bg-yellow-950/80 text-yellow-300 border border-yellow-500/40 px-2 py-0.5 rounded font-bold">
                CH1: {voltsPerDivCH1}V/div • Vpp: {vppCH1}V • Vrms: {vrmsCH1}V
              </span>
              <span className="bg-sky-950/80 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded font-bold">
                CH2: {voltsPerDivCH2}V/div
              </span>
              <span className="bg-slate-950/80 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
                TIME: {timePerDiv}ms/div • Freq: {freq || 50} Hz • T: {periodMs}ms
              </span>
            </div>
          </div>

          {/* Knobs & Adjustment Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Channel 1 Controls */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-yellow-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-yellow-400">القناة 1 (CH1 - الأصفر):</span>
                <span className="font-mono text-yellow-300">{voltsPerDivCH1} V/div</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={voltsPerDivCH1}
                onChange={(e) => setVoltsPerDivCH1(Number(e.target.value))}
                className="w-full accent-yellow-400"
              />
              <span className="text-[10px] text-slate-400 block">معايرة مقياس الجهد الرأسي Volts/Div</span>
            </div>

            {/* Channel 2 Controls */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-sky-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-400">القناة 2 (CH2 - الأزرق السماوي):</span>
                <span className="font-mono text-sky-300">{voltsPerDivCH2} V/div</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={voltsPerDivCH2}
                onChange={(e) => setVoltsPerDivCH2(Number(e.target.value))}
                className="w-full accent-sky-400"
              />
              <span className="text-[10px] text-slate-400 block">معايرة مقياس الجهد الرأسي Volts/Div</span>
            </div>

            {/* Time Base (Horizontal) Controls */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">القاعدة الزمنية (Time Base):</span>
                <span className="font-mono text-cyan-400">{timePerDiv} ms/div</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={timePerDiv}
                onChange={(e) => setTimePerDiv(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <span className="text-[10px] text-slate-400 block">معايرة سرعة المسح الأفقي Time/Div</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Activity, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const PIDControlLab: React.FC = () => {
  const [kp, setKp] = useState<number>(2.5);
  const [ki, setKi] = useState<number>(0.8);
  const [kd, setKd] = useState<number>(0.3);
  const [setpoint, setSetpoint] = useState<number>(1.0); // Target value

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulate closed-loop 2nd order plant step response
  // Plant: G(s) = 1 / (s^2 + 2*zeta*wn*s + wn^2)
  const computeStepResponse = () => {
    const dt = 0.02;
    const totalTime = 6.0; // seconds
    const steps = Math.floor(totalTime / dt);

    const times: number[] = [];
    const outputs: number[] = [];

    // State variables of physical plant (e.g. DC Motor position)
    let y = 0; // position
    let v = 0; // velocity
    let integralError = 0;
    let prevError = 0;

    let peakValue = 0;
    let riseTime = 0;
    let hasCrossed90 = false;

    for (let i = 0; i < steps; i++) {
      const t = i * dt;
      times.push(t);

      const error = setpoint - y;
      integralError += error * dt;
      // Clamp integral to simulate anti-windup
      integralError = Math.max(-2, Math.min(2, integralError));
      const derivativeError = (error - prevError) / dt;
      prevError = error;

      // PID Control Law
      const u = kp * error + ki * integralError + kd * derivativeError;
      // Actuator saturation clamp
      const uClamped = Math.max(-10, Math.min(10, u));

      // Physical system dynamic acceleration:
      // a = u - damping*v - stiffness*y
      const damping = 1.2;
      const a = (uClamped - damping * v) / 1.0;

      // Euler integration
      v += a * dt;
      y += v * dt;

      outputs.push(y);

      if (y > peakValue) peakValue = y;
      if (!hasCrossed90 && y >= setpoint * 0.9) {
        riseTime = t;
        hasCrossed90 = true;
      }
    }

    const steadyStateOutput = outputs[outputs.length - 1];
    const overshootPercent =
      peakValue > setpoint ? ((peakValue - setpoint) / setpoint) * 100 : 0;
    const steadyStateError = Math.abs(setpoint - steadyStateOutput);

    return { times, outputs, peakValue, overshootPercent, riseTime, steadyStateError };
  };

  const responseData = computeStepResponse();

  // Draw response graph on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const pad = 40;

    ctx.fillStyle = '#060d17';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#10233d';
    ctx.lineWidth = 1;
    for (let x = pad; x < w - 20; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, pad);
      ctx.lineTo(x, h - pad);
      ctx.stroke();
    }
    for (let y = pad; y < h - pad; y += 30) {
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad, pad);
    ctx.lineTo(pad, h - pad);
    ctx.lineTo(w - 20, h - pad);
    ctx.stroke();

    // Scale mappings
    const maxVal = Math.max(1.8, responseData.peakValue * 1.1);
    const scaleX = (w - pad - 20) / 6.0;
    const scaleY = (h - 2 * pad) / maxVal;

    // Draw Setpoint Target Line (Dashed Yellow)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    const setpointY = h - pad - setpoint * scaleY;
    ctx.beginPath();
    ctx.moveTo(pad, setpointY);
    ctx.lineTo(w - 20, setpointY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '11px JetBrains Mono';
    ctx.fillText(`الهدف = ${setpoint}`, w - 100, setpointY - 6);

    // Draw Response curve Y(t) (Cyan line with gradient)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    responseData.outputs.forEach((yVal, i) => {
      const t = responseData.times[i];
      const px = pad + t * scaleX;
      const py = h - pad - yVal * scaleY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // X Axis Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px JetBrains Mono';
    for (let t = 0; t <= 6; t += 1) {
      const px = pad + t * scaleX;
      ctx.fillText(`${t}s`, px - 6, h - pad + 15);
    }
  }, [kp, ki, kd, setpoint, responseData]);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 text-slate-100 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold">
              مختبر التحكم التلقائي والاستجابة الزمنية (PID Control Lab)
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              تعديل معاملات Kp, Ki, Kd ومراقبة التجاوز وزمن الصعود واستقرار النظام
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setKp(2.5);
            setKi(0.8);
            setKd(0.3);
            setSetpoint(1.0);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          ضبط مثالي
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Graph Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <canvas ref={canvasRef} width={580} height={280} className="w-full h-auto block" />
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-0.5">نسبة التجاوز (Overshoot)</span>
              <span
                className={`font-mono text-sm font-bold ${
                  responseData.overshootPercent > 25
                    ? 'text-rose-400'
                    : responseData.overshootPercent > 10
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {responseData.overshootPercent.toFixed(1)}%
              </span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-0.5">زمن الصعود (Rise Time)</span>
              <span className="font-mono text-sm font-bold text-cyan-400">
                {responseData.riseTime > 0 ? `${responseData.riseTime.toFixed(2)}s` : 'سريع جدًا'}
              </span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-0.5">خطأ الاستقرار (Steady Error)</span>
              <span className="font-mono text-sm font-bold text-emerald-400">
                {(responseData.steadyStateError * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* PID Sliders */}
        <div className="lg:col-span-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block pb-2 border-b border-slate-800">
              معاملات الكسب (Controller Gains)
            </span>

            {/* Kp */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">المعامل التناسبي (Kp - Proportional)</span>
                <span className="font-mono text-cyan-400 font-bold">{kp.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="8.0"
                step="0.1"
                value={kp}
                onChange={(e) => setKp(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">يزيد سرعة الاستجابة ويقلل الخطأ.</span>
            </div>

            {/* Ki */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">المعامل التكاملي (Ki - Integral)</span>
                <span className="font-mono text-amber-400 font-bold">{ki.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="4.0"
                step="0.1"
                value={ki}
                onChange={(e) => setKi(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">يلغي خطأ الحالة المستقرة تمامًا.</span>
            </div>

            {/* Kd */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">المعامل التفاضلي (Kd - Derivative)</span>
                <span className="font-mono text-purple-400 font-bold">{kd.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.5"
                step="0.05"
                value={kd}
                onChange={(e) => setKd(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">يثبط التذبذبات ويقلل التجاوز.</span>
            </div>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 mt-4 font-mono">
            <strong>معادلة الخرج: </strong> u(t) = {kp}·e(t) + {ki}·∫e(t)dt + {kd}·de(t)/dt
          </div>
        </div>
      </div>
    </div>
  );
};

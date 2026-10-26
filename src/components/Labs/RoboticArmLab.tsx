import React, { useState, useEffect, useRef } from 'react';
import { Bot, Crosshair, RefreshCw, Layers } from 'lucide-react';

export const RoboticArmLab: React.FC = () => {
  // Joint Angles (degrees)
  const [theta1, setTheta1] = useState<number>(45); // Shoulder
  const [theta2, setTheta2] = useState<number>(-30); // Elbow
  const [theta3, setTheta3] = useState<number>(20); // Wrist

  // Link Lengths (pixels)
  const L1 = 90;
  const L2 = 80;
  const L3 = 50;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Forward Kinematics calculation
  const rad1 = (theta1 * Math.PI) / 180;
  const rad2 = ((theta1 + theta2) * Math.PI) / 180;
  const rad3 = ((theta1 + theta2 + theta3) * Math.PI) / 180;

  // Joint 1 position (Base is at center bottom)
  const j1x = L1 * Math.cos(rad1);
  const j1y = L1 * Math.sin(rad1);

  // Joint 2 position
  const j2x = j1x + L2 * Math.cos(rad2);
  const j2y = j1y + L2 * Math.sin(rad2);

  // End Effector position
  const eeX = j2x + L3 * Math.cos(rad3);
  const eeY = j2y + L3 * Math.sin(rad3);

  // Total reach
  const maxReach = L1 + L2 + L3;
  const currentDistance = Math.sqrt(eeX * eeX + eeY * eeY);

  // Draw Arm
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const originX = w / 2;
    const originY = h - 40;

    ctx.fillStyle = '#060d17';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#0f1f33';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Reach boundary arc
    ctx.strokeStyle = '#0284c725';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(originX, originY, maxReach, Math.PI, 0, false);
    ctx.stroke();
    ctx.setLineDash([]);

    // Base Pedestal
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(originX - 30, originY, 60, 25);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.strokeRect(originX - 30, originY, 60, 25);

    // Compute screen coordinates (Y inverted)
    const p0 = { x: originX, y: originY };
    const p1 = { x: originX + j1x, y: originY - j1y };
    const p2 = { x: originX + j2x, y: originY - j2y };
    const p3 = { x: originX + eeX, y: originY - eeY };

    // Link 1 (Base to Joint 1)
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#0284c7'; // Sky Blue
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();

    // Link 2 (Joint 1 to Joint 2)
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#0ea5e9'; // Cyan
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // Link 3 (Joint 2 to End Effector)
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#38bdf8'; // Light cyan
    ctx.beginPath();
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.stroke();

    // Joint circles
    [p0, p1, p2].forEach((p, idx) => {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = idx === 0 ? '#f59e0b' : '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    // End Effector Gripper (Gripper claw)
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(p3.x, p3.y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw little claws
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p3.x, p3.y, 10, rad3 - 0.8, rad3 + 0.8);
    ctx.stroke();
  }, [theta1, theta2, theta3, j1x, j1y, j2x, j2y, eeX, eeY, maxReach]);

  // Click on canvas to calculate 2-link Inverse Kinematics
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left - canvas.width / 2;
    const clickY = canvas.height - 40 - (e.clientY - rect.top);

    // 2-DOF analytical IK approximation
    const distSq = clickX * clickX + clickY * clickY;
    const D = (distSq - L1 * L1 - L2 * L2) / (2 * L1 * L2);

    if (D >= -1 && D <= 1) {
      const q2 = Math.atan2(-Math.sqrt(1 - D * D), D);
      const q1 = Math.atan2(clickY, clickX) - Math.atan2(L2 * Math.sin(q2), L1 + L2 * Math.cos(q2));

      setTheta1(Math.round((q1 * 180) / Math.PI));
      setTheta2(Math.round((q2 * 180) / Math.PI));
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 text-slate-100 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold">
              مختبر الذراع الروبوتية والحركيات (Robotic Arm Kinematics Lab)
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              حسابات الحركيات المباشرة والعكسية (Forward & Inverse Kinematics) مع مساحة العمل (Workspace)
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setTheta1(45);
            setTheta2(-30);
            setTheta3(20);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          إعادة الضبط
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={560}
              height={300}
              onClick={handleCanvasClick}
              className="w-full h-auto block"
            />
            <div className="absolute top-3 start-3 text-[11px] bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              انقر على الفضاء لتحريك المنفذ النهائي عكسيًا (Inverse Kinematics)
            </div>
          </div>

          {/* Coordinates readout */}
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-0.5">الإحداثي X</span>
              <span className="font-mono text-sm font-bold text-cyan-400">{eeX.toFixed(1)} px</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-0.5">الإحداثي Y</span>
              <span className="font-mono text-sm font-bold text-cyan-400">{eeY.toFixed(1)} px</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-0.5">مسافة الوصول R</span>
              <span className="font-mono text-sm font-bold text-emerald-400">
                {currentDistance.toFixed(1)} / {maxReach} px
              </span>
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="lg:col-span-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block pb-2 border-b border-slate-800">
              زوايا المفاصل (Joint Angles)
            </span>

            {/* Joint 1 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">مفصل الكتف (Joint 1 - θ₁)</span>
                <span className="font-mono text-cyan-400 font-bold">{theta1}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                value={theta1}
                onChange={(e) => setTheta1(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Joint 2 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">مفصل الكوع (Joint 2 - θ₂)</span>
                <span className="font-mono text-sky-400 font-bold">{theta2}°</span>
              </div>
              <input
                type="range"
                min="-150"
                max="150"
                value={theta2}
                onChange={(e) => setTheta2(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            {/* Joint 3 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">مفصل المعصم (Joint 3 - θ₃)</span>
                <span className="font-mono text-blue-400 font-bold">{theta3}°</span>
              </div>
              <input
                type="range"
                min="-90"
                max="90"
                value={theta3}
                onChange={(e) => setTheta3(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 mt-4 font-mono space-y-1">
            <div className="text-cyan-400 font-bold font-sans">معادلات الحركيات المباشرة (FK):</div>
            <div>• X = L₁·cos(θ₁) + L₂·cos(θ₁+θ₂) + L₃·cos(θ₁+θ₂+θ₃)</div>
            <div>• Y = L₁·sin(θ₁) + L₂·sin(θ₁+θ₂) + L₃·sin(θ₁+θ₂+θ₃)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

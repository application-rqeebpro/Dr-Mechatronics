import React, { useEffect, useState } from 'react';
import { Sparkles, Volume2, Mic, Pause, Play, Edit3, CheckCircle2 } from 'lucide-react';

interface AnimeProfessorBoardProps {
  isSpeaking: boolean;
  isWriting: boolean;
  isPaused: boolean;
  currentSpokenText: string;
  activeStepTitle: string;
  doctorName?: string;
  speed?: number;
  compact?: boolean;
  penTarget?: { x: number; y: number };
}

export const AnimeProfessorBoard: React.FC<AnimeProfessorBoardProps> = ({
  isSpeaking,
  isWriting,
  isPaused,
  currentSpokenText,
  activeStepTitle,
  doctorName = 'د. محمد الحبابي',
  speed = 1.0,
  compact = false,
  penTarget,
}) => {
  // Eye blink cycle
  const [isBlinking, setIsBlinking] = useState(false);
  // Writing arm micro-movement offset
  const [armOffset, setArmOffset] = useState({ x: 0, y: 0 });
  // Speech volume meter simulation
  const [audioLevel, setAudioLevel] = useState(0);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Arm and marker oscillation when writing
  useEffect(() => {
    if (!isWriting || isPaused) {
      setArmOffset({ x: 0, y: 0 });
      return;
    }

    const interval = setInterval(() => {
      setArmOffset({
        x: Math.sin(Date.now() / 120) * 8,
        y: Math.cos(Date.now() / 90) * 6,
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isWriting, isPaused]);

  // Audio level simulation for lip-sync and equalizer
  useEffect(() => {
    if (!isSpeaking || isPaused) {
      setAudioLevel(0);
      return;
    }

    const interval = setInterval(() => {
      setAudioLevel(Math.random() * 0.8 + 0.2);
    }, 120);

    return () => clearInterval(interval);
  }, [isSpeaking, isPaused]);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between transition-all select-none ${
        compact ? 'h-full min-h-[220px]' : 'h-full min-h-[380px] lg:min-h-[500px]'
      }`}
    >
      {/* Top Identity Header */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-white text-xs truncate max-w-[150px] sm:max-w-[180px]">
            {doctorName}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
            أستاذ أنمي ذكي
          </span>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          {isWriting ? (
            <span className="flex items-center gap-1 text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60 animate-pulse">
              <Edit3 className="w-3 h-3" />
              يكتب بالقلم
            </span>
          ) : isSpeaking ? (
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 animate-pulse">
              <Mic className="w-3 h-3" />
              يشرح بصوت يمني
            </span>
          ) : (
            <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
              متوقف مؤقتًا
            </span>
          )}
        </div>
      </div>

      {/* Main Anime Professor Visual Canvas */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Base Character Illustration (Smart Mechatronics Anime Professor) */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src="/assets/aistudio/Meta_AI_865483842_1438288071613716_6052109500696896818_n_20261026_214130.webp_9aa9edb5.jpg"
            alt={doctorName}
            className={`w-full h-full object-cover object-top transition-transform duration-300 ${
              isSpeaking ? 'scale-[1.01]' : 'scale-100'
            }`}
          />

          {/* Dynamic Lighting & Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-transparent pointer-events-none" />

          {/* Animated SVG Overlay for Professor's Arm, Pen, Lip Sync, and Laser Pointer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            viewBox="0 0 400 500"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="markerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="50%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Simulated Eye Blink Overlay (subtle anime eyelids) */}
            {isBlinking && (
              <g opacity="0.9">
                <ellipse cx="195" cy="180" rx="14" ry="2" fill="#5c3a21" />
                <ellipse cx="230" cy="180" rx="14" ry="2" fill="#5c3a21" />
              </g>
            )}

            {/* Dynamic Lip-Sync Mouth Animation */}
            {isSpeaking && (
              <g transform="translate(210, 224)">
                <ellipse
                  cx="0"
                  cy="0"
                  rx={6 + audioLevel * 2}
                  ry={2 + audioLevel * 4}
                  fill="#7f1d1d"
                  opacity="0.85"
                />
                <ellipse
                  cx="0"
                  cy="0"
                  rx={5 + audioLevel * 1.5}
                  ry={1.5 + audioLevel * 3}
                  fill="#dc2626"
                  opacity="0.9"
                />
              </g>
            )}

            {/* Animated Hand with Whiteboard Marker Pen */}
            <g
              transform={`translate(${isWriting ? 230 + armOffset.x : 215}, ${
                isWriting ? 330 + armOffset.y : 340
              })`}
              className="transition-transform duration-75"
            >
              {/* Professor's Sleeve / Forearm */}
              <path
                d="M -30 90 L 10 20 L 40 35 L 0 110 Z"
                fill="#f1ede4"
                stroke="#d1c7b7"
                strokeWidth="2"
              />

              {/* Professor's Hand holding marker */}
              <ellipse cx="20" cy="15" rx="14" ry="12" fill="#fcd3a1" stroke="#e0a96d" strokeWidth="1.5" />
              <path d="M 12 12 Q 22 5 30 18" stroke="#e0a96d" strokeWidth="2" fill="none" />

              {/* The Whiteboard Marker Pen (Angle pointing toward the board) */}
              <g transform="rotate(-35, 25, 10)">
                {/* Marker Body */}
                <rect
                  x="15"
                  y="-40"
                  width="14"
                  height="50"
                  rx="3"
                  fill="url(#markerGrad)"
                  stroke="#38bdf8"
                  strokeWidth="1"
                />
                {/* Marker Cap Grip */}
                <rect x="14" y="-30" width="16" height="6" fill="#0284c7" />
                {/* Marker Chisel / Bullet Tip */}
                <polygon points="17,-40 27,-40 22,-52" fill="#0284c7" />

                {/* Glowing Laser / Active Ink Tip */}
                {isWriting && (
                  <circle
                    cx="22"
                    cy="-54"
                    r="5"
                    fill="#38bdf8"
                    filter="url(#glowEffect)"
                    className="animate-ping opacity-90"
                  />
                )}
                {isWriting && (
                  <circle cx="22" cy="-54" r="3.5" fill="#ffffff" />
                )}
              </g>

              {/* Dynamic Laser Pointer Line from marker to the board when writing */}
              {isWriting && (
                <line
                  x1="35"
                  y1="-15"
                  x2="160"
                  y2="-40"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  opacity="0.6"
                  className="animate-pulse"
                />
              )}
            </g>
          </svg>

          {/* Real-time Voice Audio Visualizer Waves */}
          {isSpeaking && (
            <div className="absolute top-4 start-4 flex items-end gap-1 h-6 bg-slate-950/75 backdrop-blur-md px-2.5 py-1 rounded-xl border border-cyan-500/30 z-30">
              <span className="text-[10px] text-cyan-300 font-mono me-1">صوت حي</span>
              <div
                className="w-1 bg-cyan-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(4, audioLevel * 20)}px` }}
              />
              <div
                className="w-1 bg-sky-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(6, (1 - audioLevel) * 22)}px` }}
              />
              <div
                className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(4, audioLevel * 18)}px` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Spoken Subtitle / Speech Bubble at Bottom of Professor Pane */}
      <div className="p-3 bg-slate-950/95 border-t border-slate-800 z-10 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-bold text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            شرح الأستاذ (نبرة يمنية جامعية):
          </span>
          <span className="text-[10px] font-mono text-slate-500">{activeStepTitle}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed min-h-[48px] max-h-[72px] overflow-y-auto">
          {currentSpokenText ? (
            <p className="animate-fade-in">«{currentSpokenText}»</p>
          ) : (
            <p className="text-slate-500 italic">اضغط «تشغيل الشرح» لبدء المحاضرة والكتابة الحية...</p>
          )}
        </div>
      </div>
    </div>
  );
};

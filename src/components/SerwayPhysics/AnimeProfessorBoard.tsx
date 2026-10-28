import React, { useEffect, useState } from 'react';
import { Sparkles, Volume2, Mic, Pause, Play, Edit3, CheckCircle2, User } from 'lucide-react';

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
  // Audio level simulation for lip-sync and visualizer
  const [audioLevel, setAudioLevel] = useState(0);

  // Natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 4200);
    return () => clearInterval(blinkInterval);
  }, []);

  // Audio level simulation for speaking animation
  useEffect(() => {
    if (!isSpeaking || isPaused) {
      setAudioLevel(0);
      return;
    }

    const interval = setInterval(() => {
      setAudioLevel(Math.random() * 0.7 + 0.3);
    }, 110);

    return () => clearInterval(interval);
  }, [isSpeaking, isPaused]);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between transition-all select-none ${
        compact ? 'h-auto p-3 space-y-2' : 'h-full min-h-[320px] lg:min-h-[460px]'
      }`}
    >
      {/* Top Identity Header */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white text-xs truncate max-w-[150px] sm:max-w-[180px]">
            {doctorName}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80">
            أستاذ الميكاترونكس
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
              صوت ذكر يمني
            </span>
          ) : (
            <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
              متوقف
            </span>
          )}
        </div>
      </div>

      {/* Main Anime Professor Visual Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-4 bg-slate-950/60 overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute w-56 h-56 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

        {/* Teacher Persona Avatar (User Uploaded Anime Teacher) */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 shadow-2xl shadow-cyan-500/30 group">
            <img
              src="/assets/aistudio/file_00000000d6648210a5de34ab1bae4073_9f4c464e.png"
              alt="أستاذ الميكاترونكس الأنمي"
              className={`w-full h-full object-cover rounded-full transition-transform duration-300 ${
                isSpeaking ? 'scale-105' : 'scale-100'
              }`}
            />

            {/* Speaking Audio Waves Halo */}
            {isSpeaking && (
              <div className="absolute -inset-2 rounded-full border-2 border-cyan-400/60 animate-ping pointer-events-none" />
            )}

            {/* Writing Marker badge indicator */}
            {isWriting && (
              <div className="absolute -bottom-1 -end-1 bg-cyan-600 text-white p-2 rounded-full shadow-lg border-2 border-slate-900 animate-bounce">
                <Edit3 className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Soundwave Bars when Speaking */}
          {isSpeaking && (
            <div className="mt-3 flex items-end justify-center gap-1 h-5">
              <div
                className="w-1 bg-cyan-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(4, audioLevel * 18)}px` }}
              />
              <div
                className="w-1 bg-sky-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(6, (1 - audioLevel) * 20)}px` }}
              />
              <div
                className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(4, audioLevel * 16)}px` }}
              />
              <div
                className="w-1 bg-blue-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(5, (1 - audioLevel) * 14)}px` }}
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
            شرح الأستاذ الأكاديمي (نبرة ذكورية يمنية):
          </span>
          <span className="text-[10px] font-mono text-slate-500">{activeStepTitle}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed min-h-[46px] max-h-[68px] overflow-y-auto">
          {currentSpokenText ? (
            <p className="animate-fade-in leading-relaxed">«{currentSpokenText}»</p>
          ) : (
            <p className="text-slate-500 italic">جاهز لبدء كتابة الدرس والشرح الصوتي...</p>
          )}
        </div>
      </div>
    </div>
  );
};

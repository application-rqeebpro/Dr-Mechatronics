import React, { useState, useEffect } from 'react';
import { WhiteboardScene } from '../../types';
import { MathView } from '../SerwayPhysics/MathView';
import { WhiteboardDiagram } from '../SerwayPhysics/WhiteboardDiagram';
import { VoiceSettingsControl } from '../VoiceSettings/VoiceSettingsControl';
import { AudioSpeechEngine, VoicePersona } from '../../utils/audioSpeechEngine';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Building2,
  Layers,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Info,
  Square,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface Props {
  onNavigateToStudio?: (course?: string, profName?: string) => void;
}

export const VirtualWhiteboard: React.FC<Props> = ({ onNavigateToStudio }) => {
  const audioEngine = AudioSpeechEngine.getInstance();

  // Dynamic user-driven professor and course fields (empty by default)
  const [doctorName, setDoctorName] = useState<string>('');
  const [specialty, setSpecialty] = useState<string>('');
  const [university, setUniversity] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [topic, setTopic] = useState<string>('');

  // Voice settings state
  const [voicePersona, setVoicePersona] = useState<VoicePersona>('male');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Whiteboard scenes state
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [scenes, setScenes] = useState<WhiteboardScene[]>([
    {
      title: 'المفهوم الأساسي والتعريف الهندسي',
      whiteboardText: `## مرحبًا بكم في السبورة الذكية\n\n* اكتب اسم دكتورك والمادة وعنوان الدرس في الحقول أعلاه.\n* اضغط على **«تحديث وتوليد الشرح على السبورة»**.\n\n$$Z = \\sqrt{R^2 + (X_L - X_C)^2}, \\quad \\Sigma \\vec{F} = m \\vec{a}$$`,
      professorSpeech: 'أهلاً بكم في السبورة التفاعلية الذكية. يمكنك كتابة اسم دكتورك ومادتك وموضوع الدرس في الحقول أعلاه لبدء الشرح بصوت وتفاعل كامل.',
      diagramType: 'circuit',
    },
  ]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stop();
    };
  }, []);

  // Fetch or generate dynamic lecture for the entered doctor & subject
  const handleGenerateLecture = async () => {
    setIsGenerating(true);
    audioEngine.stop();
    setIsSpeaking(false);
    setIsPaused(false);

    try {
      const res = await fetch('/api/ai/universal-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorName: doctorName.trim(),
          specialty: specialty.trim(),
          university: university.trim(),
          subject: subject.trim() || 'الهندسة العامة',
          topic: topic.trim() || 'المفاهيم الهندسية الأساسية',
          level: 'university',
          length: 'medium',
          actionIntent: 'detailed',
        }),
      });

      const data = await res.json();
      if (data.lesson && data.lesson.scenes && data.lesson.scenes.length > 0) {
        setScenes(data.lesson.scenes);
        setCurrentSceneIndex(0);
      }
    } catch (err) {
      console.error('Failed to generate lecture in VirtualWhiteboard:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentScene = scenes[currentSceneIndex] || scenes[0];

  // Speech control
  const handleTogglePlaySpeech = () => {
    if (isSpeaking) {
      if (isPaused) {
        audioEngine.resume();
        setIsPaused(false);
      } else {
        audioEngine.pause();
        setIsPaused(true);
      }
      return;
    }

    if (!currentScene) return;

    const textToSpeak = `${currentScene.title}. ${currentScene.professorSpeech}`;
    audioEngine.speak(textToSpeak, {
      persona: voicePersona,
      voiceId: selectedVoiceId,
      rate: speechRate,
      onStart: () => {
        setIsSpeaking(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setIsPaused(false);
      },
      onError: () => {
        setIsSpeaking(false);
        setIsPaused(false);
      },
    });
  };

  const handleStopSpeech = () => {
    audioEngine.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Title formatted dynamically
  const displayTitle = doctorName.trim()
    ? `شرح الدكتور ${doctorName.trim()} - ${topic.trim() || subject.trim() || 'المحاضرة التفاعلية'}`
    : topic.trim()
    ? `${topic.trim()} - ${subject.trim() || 'الهندسة'}`
    : 'السبورة التفاعلية الذكية';

  return (
    <div className="space-y-6">
      {/* Header & Configuration Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>الأستاذ الافتراضي والسبورة التفاعلية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              شرح تفاعلي مباشر مع أي دكتور وجامعة
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              أدخل اسم دكتورك ومادتك وعنوان الدرس؛ وسيتم إنشاء الشرح التفاعلي وكتابته على السبورة فورًا.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                showVoiceSettings
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>إعدادات الصوت والنبرة</span>
            </button>

            {onNavigateToStudio && (
              <button
                onClick={() => onNavigateToStudio(subject, doctorName)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
              >
                <span>استوديو رفع الملفات</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Voice Settings Panel */}
        {showVoiceSettings && (
          <div className="mt-4 animate-fadeIn">
            <VoiceSettingsControl
              persona={voicePersona}
              selectedVoiceId={selectedVoiceId}
              rate={speechRate}
              onPersonaChange={setVoicePersona}
              onVoiceIdChange={setSelectedVoiceId}
              onRateChange={setSpeechRate}
            />
          </div>
        )}

        {/* Inputs: Empty by default */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">اسم الدكتور (فارغ):</label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="اكتب اسم أي دكتور تريده..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">التخصص:</label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="مثال: هندسة ميكاترونكس، كهرباء..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">الجامعة (اختياري):</label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="اسم الجامعة أو الكلية..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">اسم المادة:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="اكتب اسم المادة..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">عنوان الدرس:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="عنوان الموضوع أو المسألة..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Generate / Update Button */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            {doctorName.trim()
              ? `الاسم المعتمد للشرح: د. ${doctorName.trim()}`
              : 'شرح الأستاذ الافتراضي الذكي'}
          </div>

          <button
            disabled={isGenerating}
            onClick={handleGenerateLecture}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'جاري بناء الشرح...' : 'تحديث وتوليد الشرح على السبورة'}</span>
          </button>
        </div>
      </div>

      {/* The Whiteboard Frame */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Controls Header */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 text-xs gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="font-bold text-white text-sm truncate max-w-md">
              {displayTitle}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlaySpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                isSpeaking
                  ? isPaused
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
              }`}
            >
              {isSpeaking ? (isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />) : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeaking ? (isPaused ? 'استئناف' : 'إيقاف مؤقت') : 'استمع إلى الشرح'}</span>
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopSpeech}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                title="إيقاف تام"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Whiteboard Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-5">
          {/* Virtual Doctor Avatar Card */}
          <div className="lg:col-span-3 flex flex-col items-center justify-start text-center border-b lg:border-b-0 lg:border-l border-slate-800/80 pb-4 lg:pb-0 lg:pl-4">
            <div className="relative group">
              <img
                src="/assets/aistudio/855835000_1444226130442451_3607535876634852799_n__1__65712c61.webp"
                alt="Doctor Avatar"
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/10"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-cyan-600 text-white shadow">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>

            <h4 className="font-bold text-sm text-white mt-3">
              {doctorName.trim() ? `د. ${doctorName.trim()}` : 'الأستاذ الافتراضي'}
            </h4>
            <span className="text-[10px] text-slate-400 block font-mono">
              (شخصية أكاديمية افتراضية)
            </span>

            <p className="text-[11px] text-cyan-400 font-semibold mt-1">
              {specialty.trim() || subject.trim() || 'الهندسة والميكاترونكس'}
            </p>
            {university.trim() && (
              <p className="text-[10px] text-slate-400 mt-0.5">{university.trim()}</p>
            )}

            <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 text-start leading-relaxed w-full">
              <div className="flex items-center gap-1 text-slate-300 font-bold mb-0.5">
                <Info className="w-3 h-3 text-cyan-400" />
                <span>توضيح أكاديمي:</span>
              </div>
              هذه الشخصية تمثيل افتراضي ذكي لشرح المحاضرة، وليست الدكتور الحقيقي، ولا تنسب إليه أقوالًا أو تسجيلات فعلية.
            </div>

            {currentScene?.professorSpeech && (
              <div className="mt-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200 text-start leading-relaxed shadow w-full">
                <div className="text-[10px] font-bold text-cyan-400 mb-1 flex items-center justify-between">
                  <span>شرح الأستاذ:</span>
                  <Volume2 className="w-3 h-3 text-cyan-400" />
                </div>
                <p className="italic">"{currentScene.professorSpeech}"</p>
              </div>
            )}
          </div>

          {/* Whiteboard Math & Content */}
          <div className="lg:col-span-9 space-y-4">
            <div className="bg-slate-950 p-6 rounded-2xl border-2 border-slate-800 shadow-inner min-h-[300px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs mb-4">
                <span className="font-bold text-cyan-400">
                  المشهد {currentSceneIndex + 1} من {scenes.length}: {currentScene.title}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {voicePersona === 'female' ? 'صوت أنثوي' : voicePersona === 'male' ? 'صوت ذكوري' : 'صوت قياسي'}
                </span>
              </div>

              <div className="space-y-4 font-mono text-xs sm:text-sm leading-relaxed text-slate-100">
                {(currentScene.whiteboardText || '').split('\n\n').map((paragraph, pIdx) => {
                  const trimmed = paragraph.trim();
                  if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
                    const cleanFormula = trimmed.slice(2, -2).trim();
                    return (
                      <div key={pIdx} className="my-3 p-3 bg-slate-900 rounded-xl border border-cyan-500/30 text-center overflow-x-auto">
                        <MathView math={cleanFormula} block={true} className="text-cyan-300 text-base sm:text-lg" />
                      </div>
                    );
                  }
                  return (
                    <div key={pIdx} className="whitespace-pre-wrap text-slate-200">
                      {trimmed}
                    </div>
                  );
                })}
              </div>

              {currentScene.diagramType && (
                <div className="mt-5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <WhiteboardDiagram
                    type={
                      currentScene.diagramType === 'circuit'
                        ? 'circuit_rlc'
                        : currentScene.diagramType === 'response'
                        ? 'kinematics_graph'
                        : 'circuit_ohm'
                    }
                  />
                </div>
              )}
            </div>

            {/* Stepped Controls */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                disabled={currentSceneIndex === 0}
                onClick={() => {
                  handleStopSpeech();
                  setCurrentSceneIndex((p) => Math.max(0, p - 1));
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-200 border border-slate-800 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                المشهد السابق
              </button>

              <div className="flex items-center gap-1.5">
                {scenes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleStopSpeech();
                      setCurrentSceneIndex(idx);
                    }}
                    className={`h-2.5 rounded-full transition-all ${
                      currentSceneIndex === idx
                        ? 'w-8 bg-cyan-400 shadow-sm shadow-cyan-400/50'
                        : 'w-2.5 bg-slate-800 hover:bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <button
                disabled={currentSceneIndex === scenes.length - 1}
                onClick={() => {
                  handleStopSpeech();
                  setCurrentSceneIndex((p) => Math.min(scenes.length - 1, p + 1));
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-200 border border-slate-800 transition-colors"
              >
                المشهد التالي
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

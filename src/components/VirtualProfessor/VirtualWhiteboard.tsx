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
      console.warn('Network issue or offline mode, generating local interactive scenes:', err);
      const profTitle = doctorName.trim() ? `شرح الدكتور ${doctorName.trim()}` : 'المحاضرة الجامعية التفاعلية';
      const cleanSub = subject.trim() || 'الهندسة العامة';
      const cleanTop = topic.trim() || 'المفاهيم الهندسية الأساسية';
      setScenes([
        {
          title: `[1] المفهوم الأساسي: ${cleanTop}`,
          whiteboardText: `## ${profTitle}\n**المادة:** ${cleanSub}\n**الموضوع:** ${cleanTop}\n\n* نرحب بجميع الطلاب الكرام في هذه المحاضرة الهندسية التفاعلية.\n* سنقوم بتفكيك المسألة واستعراض القوانين الحاكمة خطوة بخطوة وفق أرقى المعايير الأكاديمية.\n\n$$V = I \\cdot R, \\quad P = V \\cdot I = I^2 R$$`,
          professorSpeech: `أهلاً بكم يا شباب في هذه المحاضرة. معكم ${profTitle}، وموضوعنا اليوم هو ${cleanTop}. ركّزوا معي جيداً في العلاقات والقوانين المعروضة على السبورة.`,
          diagramType: 'circuit',
        },
        {
          title: `[2] القوانين الحاكمة والرموز الهندسية`,
          whiteboardText: `### القوانين والمعادلات الرياضية الحاكمة:\n\n$$\\begin{aligned} Z &= \\sqrt{R^2 + (X_L - X_C)^2} \\\\[6pt] I &= \\frac{V}{Z}, \\quad \\cos(\\phi) = \\frac{R}{Z} \\end{aligned}$$\n\n* **تنبيه:** تأكد دائماً من مطابقة وحدات القياس للنظام الدولي (SI Units).`,
          professorSpeech: `هذه القوانين الحاكمة التي نعتمد عليها في التحليل. انتبهوا جيداً للوحدات والزوايا الطورية.`,
          diagramType: 'formula',
        },
        {
          title: `[3] مثال تطبيقي محلول بالخطوات`,
          whiteboardText: `### مثال تطبيقي وحل نموذجي:\n\n1. استخراج المعطيات وتحديد المطلوب.\n2. التعويض في المعادلة الأساسية:\n$$I = \\frac{220}{50} = 4.4\\text{ A}$$\n3. التحقق من الدلالة الفيزيائية للناتج والتأكد من توافقه مع شروط التشغيل.`,
          professorSpeech: `في هذا المثال نطبق القوانين بشكل مباشر. لاحظوا كيف رتبنا المعطيات قبل الحساب لنصل إلى النتيجة الدقيقة.`,
          diagramType: 'circuit',
        },
      ]);
      setCurrentSceneIndex(0);
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

    let studentPref: any = null;
    try {
      const saved = localStorage.getItem('mechatronics_student_profile');
      if (saved) studentPref = JSON.parse(saved);
    } catch {}

    const dialect = studentPref?.preferredDialect || 'yemeni';
    const engine = studentPref?.preferredVoiceEngine || 'native_hd';
    const persona = studentPref?.voicePersona || voicePersona;
    const voiceId = studentPref?.selectedVoiceId || selectedVoiceId;
    const rate = studentPref?.speechRate || speechRate;

    const textToSpeak = `${currentScene.title}. ${currentScene.professorSpeech}`;
    audioEngine.speak(textToSpeak, {
      persona,
      voiceId,
      rate,
      dialect,
      engine,
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
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header & Configuration Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden w-full max-w-full">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>الأستاذ الافتراضي والسبورة التفاعلية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              شرح تفاعلي مباشر مع أي دكتور وجامعة
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              أدخل اسم دكتورك ومادتك وعنوان الدرس؛ وسيتم إنشاء الشرح التفاعلي وكتابته على السبورة فورًا.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                showVoiceSettings
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>إعدادات الصوت والنبرة</span>
            </button>

            {onNavigateToStudio && (
              <button
                onClick={() => onNavigateToStudio(subject, doctorName)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
              >
                <span>استوديو رفع الملفات</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
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

        {/* Inputs: Empty by default - dynamic grid that scales cleanly */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full min-w-0">
          <div className="space-y-1 min-w-0">
            <label className="text-[11px] font-semibold text-slate-300 block">اسم الدكتور (فارغ):</label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="اكتب اسم أي دكتور تريده..."
              className="w-full min-w-0 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1 min-w-0">
            <label className="text-[11px] font-semibold text-slate-300 block">التخصص:</label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="مثال: هندسة ميكاترونكس، كهرباء..."
              className="w-full min-w-0 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1 min-w-0">
            <label className="text-[11px] font-semibold text-slate-300 block">الجامعة (اختياري):</label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="اسم الجامعة أو الكلية..."
              className="w-full min-w-0 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1 min-w-0">
            <label className="text-[11px] font-semibold text-slate-300 block">اسم المادة:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="اكتب اسم المادة..."
              className="w-full min-w-0 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1 min-w-0">
            <label className="text-[11px] font-semibold text-slate-300 block">عنوان الدرس:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="عنوان الموضوع أو المسألة..."
              className="w-full min-w-0 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Generate / Update Button */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800 w-full">
          <div className="text-xs text-slate-400 truncate max-w-full">
            {doctorName.trim()
              ? `الاسم المعتمد للشرح: د. ${doctorName.trim()}`
              : 'شرح الأستاذ الافتراضي الذكي'}
          </div>

          <button
            disabled={isGenerating}
            onClick={handleGenerateLecture}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/20 transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{isGenerating ? 'جاري بناء الشرح...' : 'تحديث وتوليد الشرح على السبورة'}</span>
          </button>
        </div>
      </div>

      {/* The Whiteboard Frame */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-3.5 sm:p-6 shadow-2xl relative overflow-hidden w-full max-w-full">
        {/* Controls Header */}
        <div className="flex flex-wrap items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 text-xs gap-3 w-full">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <h3 className="font-bold text-white text-xs sm:text-sm truncate">
              {displayTitle}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTogglePlaySpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all min-h-[38px] ${
                isSpeaking
                  ? isPaused
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
              }`}
            >
              {isSpeaking ? (isPaused ? <Play className="w-3.5 h-3.5 fill-current shrink-0" /> : <Pause className="w-3.5 h-3.5 shrink-0" />) : <Volume2 className="w-3.5 h-3.5 shrink-0" />}
              <span>{isSpeaking ? (isPaused ? 'استئناف' : 'إيقاف مؤقت') : 'استمع إلى الشرح'}</span>
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopSpeech}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors shrink-0"
                title="إيقاف تام"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Whiteboard Workspace - Dynamic Grid & Responsive Flexbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-4 sm:my-5 w-full min-w-0">
          {/* Virtual Doctor Avatar Card */}
          <div className="lg:col-span-3 flex flex-col items-center justify-start text-center border-b lg:border-b-0 lg:border-l border-slate-800/80 pb-5 lg:pb-0 lg:pl-5 min-w-0 w-full">
            <div className="relative group shrink-0">
              <img
                src="/assets/aistudio/file_00000000d6648210a5de34ab1bae4073_9f4c464e.png"
                alt="Doctor Avatar"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/10"
              />
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-cyan-600 text-white shadow">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>

            <h4 className="font-bold text-sm sm:text-base text-white mt-3 truncate max-w-full">
              {doctorName.trim() ? `د. ${doctorName.trim()}` : 'الأستاذ الافتراضي'}
            </h4>
            <span className="text-[10px] text-slate-400 block font-mono">
              (شخصية أكاديمية افتراضية)
            </span>

            <p className="text-[11px] text-cyan-400 font-semibold mt-1 truncate max-w-full">
              {specialty.trim() || subject.trim() || 'الهندسة والميكاترونكس'}
            </p>
            {university.trim() && (
              <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-full">{university.trim()}</p>
            )}

            <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 text-start leading-relaxed w-full">
              <div className="flex items-center gap-1 text-slate-300 font-bold mb-0.5">
                <Info className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>توضيح أكاديمي:</span>
              </div>
              هذه الشخصية تمثيل افتراضي ذكي لشرح المحاضرة، وليست الدكتور الحقيقي، وتعتمد أسلوب الإلقاء والشرح الأكاديمي.
            </div>

            {currentScene?.professorSpeech && (
              <div className="mt-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200 text-start leading-relaxed shadow w-full">
                <div className="text-[10px] font-bold text-cyan-400 mb-1 flex items-center justify-between">
                  <span>شرح الأستاذ:</span>
                  <Volume2 className="w-3 h-3 text-cyan-400 shrink-0" />
                </div>
                <p className="italic">"{currentScene.professorSpeech}"</p>
              </div>
            )}
          </div>

          {/* Whiteboard Math & Content Surface */}
          <div className="lg:col-span-9 space-y-4 min-w-0 w-full">
            <div className="bg-slate-950 p-3.5 sm:p-6 rounded-2xl border-2 border-slate-800 shadow-inner min-h-[300px] w-full min-w-0 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800/80 text-xs mb-4 gap-2">
                <span className="font-bold text-cyan-400 text-xs sm:text-sm truncate max-w-[280px] sm:max-w-md">
                  المشهد {currentSceneIndex + 1} من {scenes.length}: {currentScene.title}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {voicePersona === 'female' ? 'صوت أنثوي' : voicePersona === 'male' ? 'صوت ذكوري' : 'صوت قياسي'}
                </span>
              </div>

              <div className="space-y-4 font-mono text-xs sm:text-sm leading-relaxed text-slate-100 break-words whiteboard-text select-text">
                {(currentScene.whiteboardText || '').split('\n\n').map((paragraph, pIdx) => {
                  const trimmed = paragraph.trim();
                  if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
                    const cleanFormula = trimmed.slice(2, -2).trim();
                    return (
                      <div key={pIdx} className="my-3 p-2.5 sm:p-3 bg-slate-900 rounded-xl border border-cyan-500/30 text-center overflow-x-auto max-w-full">
                        <MathView math={cleanFormula} block={true} className="text-cyan-300 text-sm sm:text-base md:text-lg max-w-full" />
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
                <div className="mt-5 p-3 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto max-w-full">
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

            {/* Stepped Controls with dynamic wrap & touch-friendly sizing */}
            <div className="flex items-center justify-between pt-2 text-xs gap-2 w-full">
              <button
                disabled={currentSceneIndex === 0}
                onClick={() => {
                  handleStopSpeech();
                  setCurrentSceneIndex((p) => Math.max(0, p - 1));
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-200 border border-slate-800 transition-colors shrink-0 min-h-[38px] text-xs sm:text-sm"
              >
                <ArrowRight className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">المشهد</span> السابق
              </button>

              <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 max-w-[160px] sm:max-w-none">
                {scenes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleStopSpeech();
                      setCurrentSceneIndex(idx);
                    }}
                    className={`h-2.5 rounded-full transition-all shrink-0 ${
                      currentSceneIndex === idx
                        ? 'w-6 sm:w-8 bg-cyan-400 shadow-sm shadow-cyan-400/50'
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-200 border border-slate-800 transition-colors shrink-0 min-h-[38px] text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">المشهد</span> التالي
                <ArrowLeft className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

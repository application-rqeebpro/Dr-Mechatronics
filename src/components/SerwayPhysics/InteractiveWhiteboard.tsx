import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MathView } from './MathView';
import { WhiteboardDiagram } from './WhiteboardDiagram';
import { AnimeProfessorBoard } from './AnimeProfessorBoard';
import { VoiceSettingsControl } from '../VoiceSettings/VoiceSettingsControl';
import { AudioSpeechEngine, VoicePersona } from '../../utils/audioSpeechEngine';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  FastForward,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  BookOpen,
  Eye,
  EyeOff,
  Sparkles,
  Award,
  Layers,
  Video,
  FileCheck,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Maximize2,
  Minimize2,
  Info,
} from 'lucide-react';

export interface BoardStep {
  id: number;
  title: string;
  type: 'title' | 'concept' | 'formula' | 'symbols' | 'diagram' | 'example' | 'caution' | 'quiz';
  text: string;
  mathKatex?: string;
  subItems?: string[];
  diagramType?: string;
  diagramLabels?: Record<string, string>;
  cautionNote?: string;
  quizQuestion?: string;
  quizSolution?: string;
  spokenExplanation: string;
}

interface InteractiveWhiteboardProps {
  lessonTitle: string;
  chapter?: string;
  page?: string;
  verifiedSourceFile?: string;
  verifiedPage?: string;
  concept: string;
  formulas: {
    formula: string;
    symbols: string;
    whenToUse: string;
  }[];
  solvedExample: {
    problem: string;
    steps: string[];
    finalAnswer: string;
  };
  caution: string;
  quiz: {
    question: string;
    solution: string;
  };
  disclaimer?: string;
  voiceMetrics?: {
    speaker: string;
    cadence: string;
    referenceVideoUrl: string;
    consentStatus: string;
  };
  onOpenVoiceModal?: () => void;
}

export const InteractiveWhiteboard: React.FC<InteractiveWhiteboardProps> = ({
  lessonTitle,
  chapter,
  page,
  verifiedSourceFile,
  verifiedPage,
  concept,
  formulas,
  solvedExample,
  caution,
  quiz,
  disclaimer,
  voiceMetrics,
  onOpenVoiceModal,
}) => {
  const audioEngine = AudioSpeechEngine.getInstance();

  // Voice Engine State (Default to MALE Arabic & Yemeni University Style)
  const [voicePersona, setVoicePersona] = useState<VoicePersona>('male');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState<boolean>(false);

  // Layout View State: Side-by-side or Full Whiteboard
  const [layoutMode, setLayoutMode] = useState<'side_by_side' | 'full_board'>('side_by_side');

  // Diagnostic info
  const [diagnosticInfo, setDiagnosticInfo] = useState(() => audioEngine.getVoiceDiagnosticInfo());

  // Board animation & playback states
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [revealedCharCount, setRevealedCharCount] = useState<number>(0);
  const [showFullSolution, setShowFullSolution] = useState<boolean>(false);
  const [showQuizAns, setShowQuizAns] = useState<boolean>(false);

  // Pen position for drawing indicator
  const [penPos, setPenPos] = useState<{ x: number; y: number }>({ x: 25, y: 30 });
  const [isPenWriting, setIsPenWriting] = useState<boolean>(false);

  const whiteboardContainerRef = useRef<HTMLDivElement | null>(null);

  // Check lesson category
  const isOhmLesson = useMemo(() => {
    const l = lessonTitle.toLowerCase();
    return l.includes('أوم') || l.includes('ohm') || l.includes('مقاوم') || l.includes('دوائر');
  }, [lessonTitle]);

  const isRLCLesson = useMemo(() => {
    const l = lessonTitle.toLowerCase();
    return l.includes('rlc') || l.includes('متردد') || l.includes('رنين');
  }, [lessonTitle]);

  // Build authentic structured steps with Yemeni academic university tone
  const steps: BoardStep[] = useMemo(() => {
    const primaryFormula =
      formulas[0]?.formula || (isOhmLesson ? 'V = I \\cdot R' : 'Z = \\sqrt{R^2 + (X_L - X_C)^2}');
    const cleanKatex = primaryFormula
      .replace(/·/g, '\\cdot ')
      .replace(/Ω/g, '\\Omega ')
      .replace(/Δ/g, '\\Delta ')
      .replace(/Σ/g, '\\sum ');

    const fileRef = verifiedSourceFile
      ? `المقرر الرسمي المعتمد (${verifiedSourceFile} صفحة ${verifiedPage || page || '24'})`
      : 'كتاب Serway المعتمد';

    return [
      {
        id: 1,
        title: 'عنوان وموضوع المحاضرة',
        type: 'title',
        text: lessonTitle,
        spokenExplanation: `بسم الله الرحمن الرحيم، حياكم الله يا شباب ويا باشمهندسين في جامعاتنا اليمنية والعربية. اليوم بنشرح في هذا الدرس المعتمد من ${fileRef} موضوع: ${lessonTitle}. ركزوا معي خطوة بخطوة عشان نفهم كل القوانين والمسائل التطبيقية.`,
      },
      {
        id: 2,
        title: 'المفهوم الفيزيائي والهندسي الأساسي',
        type: 'concept',
        text: concept,
        spokenExplanation: `خلونا نبدأ بفهم فكرة الدرس الأساسية: ${concept.replace(/\n/g, ' ')}. وتذكروا دائمًا العلاقة الطردية والعكسية بين المتغيرات.`,
      },
      {
        id: 3,
        title: 'القوانين والمعادلات الحاكمة',
        type: 'formula',
        text: 'المعادلات الفيزيائية الحاكمة المعتمدة في التحليل:',
        mathKatex: cleanKatex,
        subItems: formulas.map((f) => f.formula),
        spokenExplanation: `ركزوا معي تمام يا باشمهندسين، وبنكتب على السبورة المعادلات الحاكمة الأساسية: ${
          formulas[0]?.formula || primaryFormula
        }. لاحظوا كيف نربط الجهد والتيار والمقاومة في تحليل الشبكة.`,
      },
      {
        id: 4,
        title: 'تفسير الرموز ووحدات القياس وشروط الاستخدام',
        type: 'symbols',
        text: formulas[0]?.symbols || 'شرح الرموز والوحدات المعيارية في النظام الدولي (SI Units)',
        subItems: [
          ...(formulas[0]?.symbols ? formulas[0].symbols.split('|').map((s) => s.trim()) : []),
          formulas[0]?.whenToUse ? `شروط تطبيق القانون: ${formulas[0].whenToUse}` : '',
        ].filter(Boolean),
        spokenExplanation: `انتبهوا يا باشمهندسين عشان ما تغلطوش في معاني الرموز ووحدات القياس الدولية: ${
          formulas[0]?.symbols || ''
        }. وشروط تطبيق القانون: ${formulas[0]?.whenToUse || 'توافر شروط الاتزان والخطية'}.`,
      },
      {
        id: 5,
        title: 'المخطط العلمي والتوضيحي للدارة',
        type: 'diagram',
        text: 'رسم توضيحي لعناصر الدائرة ومسار التيار الكهربائي',
        diagramType: isOhmLesson
          ? 'circuit_ohm'
          : isRLCLesson
          ? 'circuit_rlc'
          : 'vectors_force',
        spokenExplanation: `وهذا هو المخطط العلمي التوضيحي... نرسم هنا مصدر الجهد، وتيار الدائرة الكلي، ومقاومات التوالي والتوازي وهبوط الجهد المقاس عبر كل عنصر.`,
      },
      {
        id: 6,
        title: 'مثال تطبيقي محلول خطوة بخطوة',
        type: 'example',
        text: solvedExample.problem,
        subItems: [...solvedExample.steps, `الناتج النهائي المعتمد: ${solvedExample.finalAnswer}`],
        spokenExplanation: `يلا نشوف هذا المثال المحلول سوا خطوة بخطوة... ${solvedExample.problem}. لاحظوا معي تسلسل الحسابات والتعويض المنطقي وصولاً إلى الناتج النهائي المعتمد.`,
      },
      {
        id: 7,
        title: 'تنبيه مهم وخطأ شائع في الاختبارات',
        type: 'caution',
        text: caution,
        cautionNote: caution,
        spokenExplanation: `انتبهوا يا مهندسين، هذا خطأ شائع يقع فيه أغلب الطلاب في الامتحانات: ${caution}`,
      },
      {
        id: 8,
        title: 'اختبر نفسك وتدريب فوري',
        type: 'quiz',
        text: quiz.question,
        quizQuestion: quiz.question,
        quizSolution: quiz.solution,
        spokenExplanation: `والآن يا شباب اختبروا معلوماتكم في هذا السؤال السريع: ${quiz.question}. فكروا في الناتج وسنعرض الحل النموذجي بالتفصيل!`,
      },
    ];
  }, [lessonTitle, concept, formulas, solvedExample, caution, quiz, verifiedSourceFile, verifiedPage, page, isOhmLesson, isRLCLesson]);

  const activeStep = steps[currentStepIndex] || steps[0];
  const fullTextToAnimate = useMemo(() => {
    return `${activeStep.title}: ${activeStep.text}`;
  }, [activeStep]);

  // Voice Speech execution using AudioSpeechEngine
  const playCurrentSpokenStep = (text: string) => {
    if (!voiceEnabled) return;

    audioEngine.speak(text, {
      persona: voicePersona,
      voiceId: selectedVoiceId,
      rate: speed,
      dialect: 'yemeni',
      onStart: () => setIsSpeakingAudio(true),
      onEnd: () => setIsSpeakingAudio(false),
      onError: () => setIsSpeakingAudio(false),
    });
  };

  // Sync speech and reset writing character count when active step changes
  useEffect(() => {
    if (showFullSolution) {
      setRevealedCharCount(fullTextToAnimate.length);
      setIsPenWriting(false);
      return;
    }

    setRevealedCharCount(0);
    setIsPenWriting(true);

    if (isPlaying) {
      playCurrentSpokenStep(activeStep.spokenExplanation);
    }

    // Dynamic pen position on whiteboard surface
    const targetY = 22 + (currentStepIndex % 5) * 12;
    setPenPos({ x: 75, y: Math.min(targetY, 82) });
  }, [currentStepIndex, showFullSolution, isPlaying]);

  // Writing progression timer
  useEffect(() => {
    if (!isPlaying || showFullSolution) {
      setIsPenWriting(false);
      return;
    }

    if (revealedCharCount < fullTextToAnimate.length) {
      setIsPenWriting(true);
      const delay = Math.max(12, Math.floor(40 / speed));
      const timer = setTimeout(() => {
        setRevealedCharCount((prev) => prev + 1);
        setPenPos({
          x: Math.min(85, Math.max(22, 26 + (revealedCharCount % 42) * 1.3)),
          y: Math.min(88, 22 + (currentStepIndex % 5) * 11 + Math.sin(revealedCharCount * 0.4) * 1.5),
        });
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsPenWriting(false);
      // Auto-advance after step narration completes
      const pauseDuration = Math.floor(3000 / speed);
      const nextTimer = setTimeout(() => {
        if (isPlaying && currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else if (currentStepIndex === steps.length - 1) {
          setIsPlaying(false);
        }
      }, pauseDuration);
      return () => clearTimeout(nextTimer);
    }
  }, [revealedCharCount, isPlaying, speed, fullTextToAnimate.length, currentStepIndex, steps.length, showFullSolution]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stop();
    };
  }, []);

  // Update diagnostic info when voice engine loads
  useEffect(() => {
    const unsub = audioEngine.onVoicesUpdated(() => {
      setDiagnosticInfo(audioEngine.getVoiceDiagnosticInfo());
    });
    return () => unsub();
  }, []);

  // Control Handlers
  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioEngine.pause();
      setIsSpeakingAudio(false);
    } else {
      setIsPlaying(true);
      audioEngine.resume();
      playCurrentSpokenStep(activeStep.spokenExplanation);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReplayCurrentStep = () => {
    setShowFullSolution(false);
    setRevealedCharCount(0);
    setIsPlaying(true);
    playCurrentSpokenStep(activeStep.spokenExplanation);
  };

  const handleResetBoard = () => {
    setShowFullSolution(false);
    setCurrentStepIndex(0);
    setRevealedCharCount(0);
    setIsPlaying(true);
  };

  const handleShowAll = () => {
    setShowFullSolution(true);
    setCurrentStepIndex(steps.length - 1);
    setIsPlaying(false);
    audioEngine.stop();
    setIsSpeakingAudio(false);
  };

  const handleToggleVoice = () => {
    if (voiceEnabled) {
      setVoiceEnabled(false);
      audioEngine.stop();
      setIsSpeakingAudio(false);
    } else {
      setVoiceEnabled(true);
      playCurrentSpokenStep(activeStep.spokenExplanation);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Classroom Top Navigation & Subject Bar */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-white text-sm sm:text-base">{lessonTitle}</h2>
              {verifiedSourceFile ? (
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <FileCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">{verifiedSourceFile}</span>
                  <span>• ص {verifiedPage || page || '24'}</span>
                </span>
              ) : (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {chapter || 'Serway 9th Ed'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
              <span className="text-cyan-300 font-medium">قاعة المحاضرات الذكية</span>
              <span className="text-slate-600">•</span>
              <span>أستاذ أنمي ذكوري بلهجة يمنية جامعية</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono text-[10px]">كتابة تفاعلية على السبورة</span>
            </p>
          </div>
        </div>

        {/* Action Controls in Header Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layout Toggle (Side-by-Side vs Full Board) */}
          <button
            onClick={() => setLayoutMode((prev) => (prev === 'side_by_side' ? 'full_board' : 'side_by_side'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            title="تبديل وضع العرض"
          >
            {layoutMode === 'side_by_side' ? <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> : <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="hidden sm:inline">
              {layoutMode === 'side_by_side' ? 'عرض السبورة الموسع' : 'الأستاذ بجانب السبورة'}
            </span>
          </button>

          {/* Voice Settings Modal Toggle */}
          <button
            onClick={() => setShowVoiceSettings((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              showVoiceSettings
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-950 border border-slate-800 text-cyan-400 hover:border-cyan-500/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>إعدادات الصوت اليمني</span>
          </button>

          {/* Mute / Unmute Voice */}
          <button
            onClick={handleToggleVoice}
            title={voiceEnabled ? 'كتم الصوت' : 'تفعيل صوت الأستاذ'}
            className={`p-2 rounded-xl border transition-all ${
              voiceEnabled
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Voice Settings Popover Drawer if Open */}
      {showVoiceSettings && (
        <div className="animate-fade-in">
          <VoiceSettingsControl
            persona={voicePersona}
            selectedVoiceId={selectedVoiceId}
            rate={speed}
            onPersonaChange={setVoicePersona}
            onVoiceIdChange={setSelectedVoiceId}
            onRateChange={setSpeed}
          />
        </div>
      )}

      {/* 2. Main Whiteboard Classroom Stage */}
      <div className="rounded-3xl bg-slate-300/90 p-2 sm:p-4 shadow-2xl border-4 border-slate-400">
        {/* Whiteboard Chrome Frame Header */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-slate-300 pb-2 mb-3 px-1 text-xs text-slate-700">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            </div>
            <span className="font-bold text-slate-800 font-mono text-[11px] ps-1 truncate">
              {verifiedSourceFile ? `📄 ${verifiedSourceFile} (ص ${verifiedPage || page || '24'})` : 'SMART MECHATRONICS WHITEBOARD'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-slate-700 shrink-0">
            <span>المشهد: {currentStepIndex + 1}/{steps.length}</span>
            <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-sans border border-slate-300">
              {activeStep.title}
            </span>
          </div>
        </div>

        {/* The Classroom Body: Split between Animated Anime Professor & Whiteboard Surface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
          {/* Anime Professor Column (Visible when side-by-side or stacked on mobile) */}
          {layoutMode === 'side_by_side' && (
            <div className="lg:col-span-4 flex flex-col">
              <AnimeProfessorBoard
                isSpeaking={isSpeakingAudio}
                isWriting={isPenWriting}
                isPaused={!isPlaying}
                currentSpokenText={activeStep.spokenExplanation}
                activeStepTitle={activeStep.title}
                speed={speed}
                penTarget={penPos}
              />
            </div>
          )}

          {/* Whiteboard Writing Surface */}
          <div
            className={`relative rounded-2xl bg-white p-4 sm:p-6 shadow-inner text-slate-900 select-text overflow-hidden flex flex-col justify-between ${
              layoutMode === 'side_by_side' ? 'lg:col-span-8' : 'lg:col-span-12'
            }`}
            style={{
              backgroundImage: 'radial-gradient(#cbd5e1 0.85px, transparent 0.85px)',
              backgroundSize: '24px 24px',
            }}
          >
            {/* Dynamic Active Writing Pen Tip (glides over the words currently being written) */}
            {isPenWriting && (
              <div
                className="absolute pointer-events-none transition-all duration-75 z-20 flex items-center gap-1"
                style={{
                  left: `${penPos.x}%`,
                  top: `${penPos.y}%`,
                }}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-sky-500 shadow-md shadow-sky-400 animate-ping" />
                <div className="w-2.5 h-2.5 rounded-full bg-sky-600 absolute top-0.5 start-0.5" />
              </div>
            )}

            {/* Whiteboard Step-by-Step Writing Content (Scrollable on long lessons) */}
            <div
              ref={whiteboardContainerRef}
              className="space-y-4 font-sans leading-relaxed overflow-y-auto max-h-[580px] pe-2 select-text"
              dir="rtl"
            >
              {/* Step 1: Lesson Title on Board */}
              {(currentStepIndex >= 0 || showFullSolution) && (
                <div className="border-b-2 border-sky-600/30 pb-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-black text-sky-950 font-serif tracking-tight">
                        {lessonTitle}
                      </h1>
                      <span className="text-xs font-mono text-slate-500 block mt-0.5" dir="ltr">
                        {isOhmLesson ? "Ohm's Law & Circuit Analysis (Sadiku & Boylestad)" : 'Smart Mechatronics Engineering'}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-900 bg-sky-100 px-3 py-1 rounded-xl border border-sky-300 shrink-0">
                      {verifiedSourceFile ? `ص ${verifiedPage || page || '24'}` : (chapter || 'Ch. 1')}
                    </span>
                  </div>
                </div>
              )}

              {/* Step 2: Concept Definition */}
              {(currentStepIndex >= 1 || showFullSolution) && (
                <div className="bg-sky-50/80 border-s-4 border-sky-600 p-3 sm:p-4 rounded-r-xl transition-all shadow-sm">
                  <span className="text-xs font-bold text-sky-900 block font-mono mb-1">
                    [1] المفهوم الفيزيائي والهندسي الأساسي:
                  </span>
                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-serif">
                    {currentStepIndex === 1 && !showFullSolution
                      ? concept.slice(0, revealedCharCount)
                      : concept}
                  </p>
                </div>
              )}

              {/* Step 3: Formulas with KaTeX Typography */}
              {(currentStepIndex >= 2 || showFullSolution) && (
                <div className="bg-white border-2 border-blue-400 p-3 sm:p-4 rounded-xl shadow-sm my-2">
                  <div className="flex items-center justify-between text-xs font-mono text-blue-900 font-bold mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      [2] القوانين والمعادلات الحاكمة (Governing Equations):
                    </span>
                    <span className="text-slate-500 font-serif text-[11px]">
                      {verifiedSourceFile ? 'مرجع المقرر' : 'Serway 9th Ed'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 bg-blue-50/50 rounded-lg border border-blue-100 p-3 text-center" dir="ltr">
                    {/* Ohm's Law core formulas or general lesson formulas */}
                    {isOhmLesson ? (
                      <>
                        <div className="p-2 bg-white rounded-lg border border-blue-200">
                          <MathView math="V = I \cdot R \iff I = \frac{V}{R} \iff R = \frac{V}{I}" block={true} className="text-lg sm:text-xl text-blue-950 font-bold" />
                          <span className="text-[11px] font-sans text-slate-600 mt-1 block">قانون أوم الأساسي</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-blue-200">
                          <MathView math="V_1 = V_{in} \cdot \frac{R_1}{R_1 + R_2}" block={true} className="text-lg sm:text-xl text-blue-950 font-bold" />
                          <span className="text-[11px] font-sans text-slate-600 mt-1 block">قانون مجزئ الجهد (Voltage Divider)</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-blue-200">
                          <MathView math="I_1 = I_{total} \cdot \frac{R_2}{R_1 + R_2}" block={true} className="text-lg sm:text-xl text-blue-950 font-bold" />
                          <span className="text-[11px] font-sans text-slate-600 mt-1 block">قانون مجزئ التيار (Current Divider)</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-blue-200">
                          <MathView math="P = V \cdot I = I^2 \cdot R = \frac{V^2}{R}" block={true} className="text-lg sm:text-xl text-blue-950 font-bold" />
                          <span className="text-[11px] font-sans text-slate-600 mt-1 block">القدرة الكهربائية المستهلكة (Power)</span>
                        </div>
                      </>
                    ) : (
                      formulas.map((item, idx) => (
                        <div key={idx} className="p-2 bg-white rounded-lg border border-blue-200">
                          <MathView
                            math={item.formula.replace(/·/g, '\\cdot ').replace(/Ω/g, '\\Omega ')}
                            block={true}
                            className="text-lg sm:text-xl text-blue-950 font-bold"
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Symbols & SI Units */}
              {(currentStepIndex >= 3 || showFullSolution) && (
                <div className="bg-emerald-50/80 border-s-4 border-emerald-600 p-3 sm:p-4 rounded-r-xl">
                  <span className="text-xs font-bold text-emerald-900 block font-mono mb-1">
                    [3] تفسير الرموز ووحدات القياس المعيارية (SI Units):
                  </span>
                  <div className="text-xs sm:text-sm text-slate-800 space-y-1">
                    <div className="font-mono text-slate-700 bg-white/80 p-2.5 rounded border border-emerald-200" dir="ltr">
                      {isOhmLesson ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                          <div><strong>V:</strong> Volt (V) - الجهد</div>
                          <div><strong>I:</strong> Ampere (A) - التيار</div>
                          <div><strong>R:</strong> Ohm (Ω) - المقاومة</div>
                          <div><strong>P:</strong> Watt (W) - القدرة</div>
                        </div>
                      ) : (
                        formulas[0]?.symbols || 'الوحدات المعيارية المعتمدة'
                      )}
                    </div>
                    {formulas[0]?.whenToUse && (
                      <div className="text-xs text-emerald-950 pt-1 font-serif">
                        <span className="font-bold">شروط التطبيق: </span>
                        {formulas[0].whenToUse}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Scientific Diagram / Circuit Schematic */}
              {(currentStepIndex >= 4 || showFullSolution) && (
                <div className="my-2">
                  <span className="text-xs font-bold text-slate-700 block font-mono mb-1">
                    [4] المخطط العلمي التوضيحي للدرس:
                  </span>
                  <WhiteboardDiagram
                    type={
                      isOhmLesson
                        ? 'circuit_ohm'
                        : isRLCLesson
                        ? 'circuit_rlc'
                        : 'vectors_force'
                    }
                  />
                </div>
              )}

              {/* Step 6: Stepped Solved Example */}
              {(currentStepIndex >= 5 || showFullSolution) && (
                <div className="bg-amber-50/90 border-2 border-amber-300 p-3.5 sm:p-4 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900 font-mono mb-1.5">
                    <span>[5] مثال تطبيقي محلول خطوة بخطوة (Worked Example):</span>
                    <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded text-amber-900">سنة أولى هندسة</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-900 font-serif font-bold mb-2">
                    {solvedExample.problem}
                  </p>
                  <div className="space-y-1 text-xs text-slate-800 bg-white/90 p-3 rounded-lg border border-amber-200">
                    {solvedExample.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-amber-700 font-mono font-bold shrink-0">•</span>
                        <span>{step}</span>
                      </div>
                    ))}
                    <div className="pt-2 mt-2 border-t border-amber-200 font-bold text-emerald-800 text-sm flex items-center justify-between">
                      <span>النتيجة النهائية المعتمدة:</span>
                      <span className="font-mono bg-emerald-100 text-emerald-900 px-3 py-1 rounded-md border border-emerald-300 text-xs sm:text-sm">
                        {solvedExample.finalAnswer}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Caution & Pitfall */}
              {(currentStepIndex >= 6 || showFullSolution) && (
                <div className="bg-red-50 border-s-4 border-red-500 p-3 rounded-r-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-900 font-mono mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>[6] تنبيه أكاديمي وخطأ شائع في الاختبارات:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-red-950 font-serif leading-relaxed">
                    {caution}
                  </p>
                </div>
              )}

              {/* Step 8: Test Yourself Quiz */}
              {(currentStepIndex >= 7 || showFullSolution) && (
                <div className="bg-purple-50/80 border-2 border-purple-300 p-3.5 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-900 font-mono mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-purple-600" />
                      [7] اختبر نفسك (Quick Quiz):
                    </span>
                    <button
                      onClick={() => setShowQuizAns((prev) => !prev)}
                      className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow-sm"
                    >
                      {showQuizAns ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {showQuizAns ? 'إخفاء الحل' : 'إظهار الحل النموذجي'}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-900 font-serif mb-2">
                    {quiz.question}
                  </p>
                  {showQuizAns && (
                    <div className="bg-white p-2.5 rounded-lg border border-purple-200 text-xs text-purple-950 font-serif leading-relaxed animate-fade-in">
                      <span className="font-bold block text-purple-900 mb-0.5">الحل النموذجي:</span>
                      {quiz.solution}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Whiteboard Bottom Pen Tray */}
            <div className="mt-3 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold">أقلام السبورة:</span>
                <span className="w-4 h-2 rounded-full bg-blue-600 shadow-sm inline-block" title="قلم أزرق" />
                <span className="w-4 h-2 rounded-full bg-red-600 shadow-sm inline-block" title="قلم أحمر" />
                <span className="w-4 h-2 rounded-full bg-emerald-600 shadow-sm inline-block" title="قلم أخضر" />
                <span className="w-4 h-2 rounded-full bg-slate-900 shadow-sm inline-block" title="قلم أسود" />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                <span>الصوت: أستاذ عربي (لهجة يمنية)</span>
                <span>•</span>
                <span>السبورة الذكية التفاعلية</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Player Timeline & Controls Bar */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl space-y-3">
        {/* Timeline Scrubber */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
            <span>المشهد: {currentStepIndex + 1} / {steps.length}</span>
            <span className="text-cyan-400 font-sans font-bold">{activeStep.title}</span>
            <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex cursor-pointer">
            {steps.map((st, i) => (
              <div
                key={st.id}
                onClick={() => {
                  setCurrentStepIndex(i);
                  setShowFullSolution(false);
                }}
                className={`h-full flex-1 border-r border-slate-950 transition-all ${
                  i < currentStepIndex
                    ? 'bg-cyan-500'
                    : i === currentStepIndex
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={st.title}
              />
            ))}
          </div>
        </div>

        {/* Player Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Main Controls (Play/Pause, Next, Prev, Replay) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'إيقاف مؤقت' : 'متابعة الشرح'}</span>
            </button>

            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              title="المشهد السابق"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleNextStep}
              disabled={currentStepIndex === steps.length - 1}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              title="المشهد التالي"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handleReplayCurrentStep}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs"
              title="إعادة نطق وكتابة المقطع الحالي"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إعادة المقطع</span>
            </button>
          </div>

          {/* Speed & Solution View Toggles */}
          <div className="flex items-center gap-2">
            {/* Speed Buttons */}
            <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-1 text-xs">
              {[0.75, 1.0, 1.25, 1.5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                    speed === s ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Show All Steps Toggle */}
            <button
              onClick={showFullSolution ? handleResetBoard : handleShowAll}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                showFullSolution
                  ? 'bg-purple-600 text-white shadow-purple-600/30'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {showFullSolution ? 'إعادة الشرح التدريجي' : 'إظهار كامل السبورة دفعة واحدة'}
            </button>
          </div>
        </div>

        {/* Voice & Deployment Notice */}
        <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong>معايرة الصوت الذكوري واللهجة اليمنية:</strong> يعتمد النظام على صوت أستاذ عربي ذكوري بمعايرة ترددية (Pitch 0.82x) مع صياغة يمنية جامعة مألوفة لطلاب كليات الهندسة باليمن. للربط مع مزودات الصوت السحابية الخارجية (مثل ElevenLabs) على Vercel، يمكنك إضافة متغيرات البيئة الآمنة `ELEVENLABS_API_KEY` و `GEMINI_API_KEY` في لوحة إعدادات Vercel.
          </span>
        </div>
      </div>
    </div>
  );
};

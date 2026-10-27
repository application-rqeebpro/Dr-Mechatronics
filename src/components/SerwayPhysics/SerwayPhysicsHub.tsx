import React, { useState, useRef, useEffect } from 'react';
import { APPROVED_COURSE_MATERIALS, CourseMaterialFile } from '../../data/approvedCourseMaterials';
import { InteractiveWhiteboard } from './InteractiveWhiteboard';
import { ReferenceVoiceModal } from './ReferenceVoiceModal';
import { SubscriptionGateModal } from './SubscriptionGateModal';
import { VoiceConsentSettings } from '../../types';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Calculator,
  Search,
  Upload,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  Layers,
  ArrowRight,
  Eye,
  EyeOff,
  Send,
  Loader2,
  RotateCcw,
  Radio,
  Tv,
  FileCheck,
  Lock,
  Unlock,
  ShieldCheck,
  Video,
} from 'lucide-react';

interface SerwayResultData {
  lessonTitle: string;
  chapter?: string;
  page?: string;
  verifiedSourceFile?: string;
  verifiedPage?: string;
  concept: string;
  spokenIntro?: string;
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
}

export const SerwayPhysicsHub: React.FC = () => {
  // Input fields - default to Ohm's Law
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('mat-circuits-theory');
  const [lessonTitle, setLessonTitle] = useState<string>('قانون أوم وتحليل الدوائر المقاومية (Ohm\'s Law & Divider Circuits)');
  const [chapterNumber, setChapterNumber] = useState<string>('1');
  const [pageNumber, setPageNumber] = useState<string>('24');
  const [studentNotes, setStudentNotes] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Student subscription tier state
  const [studentSubscription, setStudentSubscription] = useState<'free' | 'basic' | 'premium_pro'>(() => {
    const saved = localStorage.getItem('mechatronics_student_profile');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        return p.subscriptionTier || 'premium_pro';
      } catch (e) {
        return 'premium_pro';
      }
    }
    return 'premium_pro';
  });

  // Reference Voice & Consent Modal state
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceConsentSettings>({
    consentStatus: 'academic_simulation',
    authorizedByName: 'د. محمد الحبابي',
    authorizedDate: '2025-05-18',
    voiceCloningProvider: 'browser_speech',
    referenceVideoUrl: '/assets/aistudio/lv_0________________3749a237.mp4',
    referenceSpeakerName: 'د. محمد الحبابي',
    referenceCadence: 'نبرة أكاديمية يمنية هادئة (~115-125 كلمة/دقيقة، وقفات إيضاحية 500ms، ومزج دقيق للمصطلحات الإنجليزية بالرموز)',
    targetPaceWordsPerMin: 120,
  });

  // Subscription Gate Modal state
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);
  const [gateRequiredTier, setGateRequiredTier] = useState<'basic' | 'premium_pro'>('basic');
  const [gateMaterialTitle, setGateMaterialTitle] = useState<string>('');

  // Course Materials Modal / picker
  const [showMaterialPicker, setShowMaterialPicker] = useState<boolean>(false);
  const [materialSearch, setMaterialSearch] = useState<string>('');

  // Execution & AI states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<
    'concise' | 'detailed' | 'formulas' | 'example' | 'quiz'
  >('concise');
  const [viewMode, setViewMode] = useState<'whiteboard' | 'summary'>('whiteboard');
  const [resultData, setResultData] = useState<SerwayResultData | null>(null);
  const [disclaimer, setDisclaimer] = useState<string>(
    'شرح أكاديمي تم توليده استنادًا إلى الملفات التعليمية المعتمدة ونبرة وإلقاء الفيديو المرجعي لـ د. محمد الحبابي.'
  );
  const [source, setSource] = useState<string>('محرك الميكاترونكس الذكي');
  const [showQuizSolution, setShowQuizSolution] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedMaterial = APPROVED_COURSE_MATERIALS.find((m) => m.id === selectedMaterialId) || APPROVED_COURSE_MATERIALS[0];

  // Specific 2 test lessons explicitly requested to verify dynamic switching
  const verifiedTestLessons = [
    {
      id: 'test-lesson-1',
      title: 'الدرس الأول: قانون أوم وتحليل الدوائر المقاومية',
      materialId: 'mat-circuits-theory',
      lessonQuery: 'قانون أوم وتحليل الدوائر المقاومية (Ohm\'s Law & Divider Circuits)',
      chapter: '1',
      page: '24',
      fileName: 'Electrical_Circuits_1_Theory_Notes_AlHababi.pdf',
      tier: 'basic' as const,
      badge: 'الدوائر الكهربائية 1 (نظري)',
      formulaSample: 'V = I · R',
    },
    {
      id: 'test-lesson-2',
      title: 'الدرس الثاني: دوائر التيار المتردد RL و RC و RLC والرنين',
      materialId: 'mat-circuits-lab',
      lessonQuery: 'دوائر التيار المتردد RL و RC و RLC والرنين (RL, RC & RLC AC Circuits)',
      chapter: '5',
      page: '47',
      fileName: 'Electrical_Circuits_Lab_Manual_AlHababi_2025.pdf',
      tier: 'premium_pro' as const,
      badge: 'مختبر الدوائر (تطابق تام مع الفيديو المرجعي)',
      formulaSample: 'Z = √(R² + (XL - XC)²)',
    },
    {
      id: 'test-lesson-3',
      title: 'الدرس الثالث: معادلات الحركة بتسارع منتظم والسقوط الحر',
      materialId: 'mat-serway-physics',
      lessonQuery: 'معادلات الحركة بتسارع منتظم والسقوط الحر',
      chapter: '2',
      page: '35',
      fileName: 'Serway_Jewett_Physics_9th_Edition_ModernPhysics.pdf',
      tier: 'free' as const,
      badge: 'فيزياء سيرواي 9th Ed',
      formulaSample: 'v = v0 + a·t',
    },
  ];

  // Fetch initial voice settings from server
  useEffect(() => {
    fetch('/api/voice-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setVoiceSettings(data.settings);
        }
      })
      .catch((err) => console.warn('Could not load voice settings:', err));
  }, []);

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Main Call to API with subscription check
  const handleFetchExplanation = async (
    mode: 'concise' | 'detailed' | 'formulas' | 'example' | 'quiz' = activeMode,
    overrideTitle?: string,
    overrideChapter?: string,
    overridePage?: string,
    overrideMaterialId?: string
  ) => {
    const targetTitle = overrideTitle || lessonTitle;
    const targetMaterialId = overrideMaterialId || selectedMaterialId;
    if (!targetTitle.trim()) return;

    // Check material tier vs student subscription tier
    const mat = APPROVED_COURSE_MATERIALS.find((m) => m.id === targetMaterialId);
    if (mat) {
      const tierRank: Record<string, number> = { free: 0, basic: 1, premium_pro: 2 };
      const requiredRank = tierRank[mat.accessTier] || 0;
      const currentRank = tierRank[studentSubscription] || 0;

      if (currentRank < requiredRank) {
        setGateRequiredTier(mat.accessTier as 'basic' | 'premium_pro');
        setGateMaterialTitle(mat.title);
        setIsGateModalOpen(true);
        return;
      }
    }

    setActiveMode(mode);
    setIsLoading(true);
    setShowQuizSolution(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    try {
      const res = await fetch('/api/ai/serway-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle: targetTitle,
          chapterNumber: overrideChapter || chapterNumber,
          pageNumber: overridePage || pageNumber,
          mode,
          materialId: targetMaterialId,
          studentSubscription,
          imageBase64: selectedImage,
          studentNotes,
        }),
      });

      const data = await res.json();
      if (data.accessDenied) {
        setGateRequiredTier(data.requiredTier || 'basic');
        setGateMaterialTitle(mat?.title || 'المرجع المدفوع');
        setIsGateModalOpen(true);
        return;
      }

      if (data.data) {
        setResultData(data.data);
        if (data.disclaimer) setDisclaimer(data.disclaimer);
        setSource(data.source === 'gemini' ? 'Gemini 3.8 Flash' : 'محرك الميكاترونكس المعتمد');
      }
    } catch (err: any) {
      console.error('Error fetching Serway explanation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load default Ohm's Law lesson on first render so students immediately see the live whiteboard
  useEffect(() => {
    handleFetchExplanation(
      'concise',
      'قانون أوم وتحليل الدوائر المقاومية (Ohm\'s Law & Divider Circuits)',
      '1',
      '24',
      'mat-circuits-theory'
    );
  }, []);

  const handleUpgradeSubscription = (tier: 'basic' | 'premium_pro') => {
    setStudentSubscription(tier);
    const saved = localStorage.getItem('mechatronics_student_profile');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        p.subscriptionTier = tier;
        p.subscriptionStatus = 'active';
        localStorage.setItem('mechatronics_student_profile', JSON.stringify(p));
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-6">
      {/* Reference Voice & Consent Modal */}
      <ReferenceVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        voiceSettings={voiceSettings}
        onUpdateSettings={(updated) => setVoiceSettings((prev) => ({ ...prev, ...updated }))}
      />

      {/* Subscription Paywall Modal */}
      <SubscriptionGateModal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        requiredTier={gateRequiredTier}
        materialTitle={gateMaterialTitle}
        onUpgradeTier={handleUpgradeSubscription}
      />

      {/* Header Banner with Dr. Mohammed Al-Hababi and Serway Reference */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden bg-blueprint">
        <div className="absolute top-0 end-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Text and Title */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
                <Tv className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>السبورة الذكية التفاعلية | أسلوب المحاضرة المرجعية</span>
              </span>

              {/* Reference Audio Inspector Trigger */}
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all shadow-sm"
              >
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span>معاينة الصوت المرجعي الأصلي والتفويض</span>
              </button>

              {/* Student subscription pill */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>اشتراكك: {studentSubscription === 'premium_pro' ? 'باقة Pro كاملة' : studentSubscription === 'basic' ? 'باقة أساسية' : 'باقة مجانية'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              شرح المناهج والملفات المعتمدة
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 mt-1">
                مع د. محمد الحبابي
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              تعتمد المحاضرة على محتوى الملفات والكتب التعليمية المرفوعة، مع محاكاة متقنة لصوت وطريقة إلقاء د. محمد الحبابي في الفيديو المرجعي (نبرة هادئة، وقفات تعليلية، وشرح عنصرًا عنصرًا مع رسومات حية متزامنة على السبورة).
            </p>

            {/* Book Reference Badge */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 font-mono flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                المرجع الحالي: {selectedMaterial.fileName}
              </span>
              <span className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-cyan-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                أرقام صفحات حقيقية وموثقة
              </span>
            </div>
          </div>

          {/* Dr. Mohammed Al-Hababi Card with Reference Video Trigger */}
          <div className="lg:col-span-4">
            <div className="bg-slate-950 rounded-2xl border-2 border-cyan-500/40 p-3.5 shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <span className="font-bold text-cyan-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  الأستاذ المعتمد للشرح
                </span>
                <span className="text-slate-400 font-mono text-[11px]">د. محمد الحبابي</span>
              </div>

              {/* Real Whiteboard Photo */}
              <div className="mt-2.5 rounded-xl overflow-hidden border border-slate-800 aspect-16/10 relative">
                <img
                  src="/assets/aistudio/Meta_AI_865483842_1438288071613716_6052109500696896818_n_20261026_214130.webp_9aa9edb5.jpg"
                  alt="Dr. Mohammed Al-Hababi Whiteboard"
                  className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-2 start-2 end-2 flex items-center justify-between">
                  <span className="text-[11px] text-cyan-300 font-bold bg-slate-950/90 px-2 py-1 rounded-lg border border-slate-800">
                    د. محمد الحبابي • أستاذ الدوائر
                  </span>
                  <button
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    استمع للفيديو الأصلي
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Practical Test Lessons as explicitly instructed */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>اختبار تغيير المحتوى والمزامنة الصوتية (درسين مختلفين من الملفات المعتمدة):</span>
          </div>
          <span className="text-[11px] text-slate-400">انقر للتبديل الفوري بين المذكرات والتحقق من اختلاف المحتوى</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {verifiedTestLessons.map((item) => {
            const isSelected = lessonTitle === item.lessonQuery;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedMaterialId(item.materialId);
                  setLessonTitle(item.lessonQuery);
                  setChapterNumber(item.chapter);
                  setPageNumber(item.page);
                  handleFetchExplanation('concise', item.lessonQuery, item.chapter, item.page, item.materialId);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 group ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-900">
                      {item.badge}
                    </span>
                    <span className={`px-2 py-0.5 rounded border ${
                      item.tier === 'premium_pro'
                        ? 'bg-purple-950 text-purple-300 border-purple-800'
                        : item.tier === 'basic'
                        ? 'bg-blue-950 text-blue-300 border-blue-800'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}>
                      {item.tier === 'premium_pro' ? 'باقة Pro' : item.tier === 'basic' ? 'باقة أساسية' : 'مجاني'}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                    <FileCheck className="w-3 h-3 text-emerald-400" />
                    <span>{item.fileName} • ص {item.page}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-amber-300 font-bold">{item.formulaSample}</span>
                  <span className="text-cyan-400 font-bold group-hover:translate-x-[-2px] transition-transform">
                    {isSelected ? 'المحاضرة الحالية ✓' : 'بدء الشرح ←'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1. Lesson Selection Form & Course Materials Registry */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              1. اختيار المادة والدرس من الملفات المعتمدة
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ابحث في المذكرات المرفوعة وكتب المنهج لاستخراج المحتوى العلمي الدقيق وتوثيق أرقام الصفحات
            </p>
          </div>

          <button
            onClick={() => setShowMaterialPicker(!showMaterialPicker)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-slate-900 transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            {showMaterialPicker ? 'إغلاق فهرس الملفات' : 'تصفح الملفات والكتب المعتمدة'}
          </button>
        </div>

        {/* Course Materials Modal / Accordion */}
        {showMaterialPicker && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-300">
                الملفات والكتب التعليمية المعتمدة في النظام:
              </span>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute start-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="ابحث في الملفات..."
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg ps-8 pe-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Materials List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {APPROVED_COURSE_MATERIALS.map((mat) => {
                const isSelected = selectedMaterialId === mat.id;
                return (
                  <div
                    key={mat.id}
                    className={`p-3.5 bg-slate-900/90 border rounded-2xl space-y-2 text-xs transition-all ${
                      isSelected ? 'border-cyan-500' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                      <span className="font-bold text-cyan-300 truncate">{mat.courseNameAr}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                        {mat.accessTier}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 font-mono leading-tight">{mat.fileName}</p>

                    <div className="space-y-1 pt-1">
                      {mat.chapters.map((ch) => (
                        <div key={ch.chapterNumber} className="border-t border-slate-800/40 pt-1">
                          <span className="text-[10px] text-slate-500 font-bold block">
                            فصل {ch.chapterNumber}: {ch.titleAr}
                          </span>
                          {ch.lessons.map((lesson) => (
                            <button
                              key={lesson.lessonId}
                              onClick={() => {
                                setSelectedMaterialId(mat.id);
                                setLessonTitle(lesson.titleAr);
                                setChapterNumber(String(ch.chapterNumber));
                                setPageNumber(String(lesson.page));
                                setShowMaterialPicker(false);
                                handleFetchExplanation('concise', lesson.titleAr, String(ch.chapterNumber), String(lesson.page), mat.id);
                              }}
                              className="w-full text-start p-1 rounded hover:bg-cyan-950/40 hover:text-cyan-200 transition-colors flex items-center justify-between gap-1 text-[11px]"
                            >
                              <span className="truncate">{lesson.titleAr}</span>
                              <span className="text-[9px] font-mono text-slate-500 shrink-0">ص {lesson.page}</span>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Material Picker dropdown */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-slate-300">المرجع / الملف التعليمي المعتمد:</label>
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-cyan-200 focus:outline-none focus:border-cyan-500"
            >
              {APPROVED_COURSE_MATERIALS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.courseNameAr} - {m.fileName} ({m.accessTier === 'free' ? 'مجاني' : m.accessTier === 'basic' ? 'باقة أساسية' : 'باقة Pro'})
                </option>
              ))}
            </select>
          </div>

          {/* Lesson Title */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-slate-300">اسم الدرس أو الموضوع المطلوب:</label>
            <input
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="مثال: قانون أوم، دوائر التيار المتردد RLC، نظرية ثيفينين..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Page Number (Verifiable) */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              رقم الصفحة في الملف:
            </label>
            <input
              type="text"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              placeholder="مثال: 24 أو 47..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Student Notes / image */}
          <div className="md:col-span-12 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                نص إضافي أو مسألة معينة من الملف المرفوع:
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>رفع صورة مسألة من الملف</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <textarea
              rows={2}
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              placeholder="ألصق أي نص أو مسألة معينة من المرجع المعتمد للتركيز عليها في شرح الدكتور والسبورة..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
            <div className="text-xs text-slate-400 font-semibold">
              خيارات الشرح المباشر مع د. محمد الحبابي (بنبرة وإلقاء الفيديو المرجعي):
            </div>
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-1 text-xs">
              <button
                onClick={() => setViewMode('whiteboard')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'whiteboard'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                السبورة الذكية الحية
              </button>
              <button
                onClick={() => setViewMode('summary')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'summary'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                ملخص الدرس المنظم
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleFetchExplanation('concise')}
              disabled={isLoading || !lessonTitle.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-cyan-600/20"
            >
              <Sparkles className="w-4 h-4" />
              اشرح الدرس باختصار
            </button>

            <button
              onClick={() => handleFetchExplanation('formulas')}
              disabled={isLoading || !lessonTitle.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white font-bold rounded-xl text-xs transition-all border border-slate-700"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              أظهر القوانين
            </button>

            <button
              onClick={() => handleFetchExplanation('example')}
              disabled={isLoading || !lessonTitle.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white font-bold rounded-xl text-xs transition-all border border-slate-700"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              حل مثال
            </button>

            <button
              onClick={() => handleFetchExplanation('detailed')}
              disabled={isLoading || !lessonTitle.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white font-bold rounded-xl text-xs transition-all border border-slate-700"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              اشرح بالتفصيل
            </button>

            <button
              onClick={() => handleFetchExplanation('quiz')}
              disabled={isLoading || !lessonTitle.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white font-bold rounded-xl text-xs transition-all border border-slate-700"
            >
              <HelpCircle className="w-4 h-4 text-rose-400" />
              اختبرني
            </button>
          </div>
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-10 bg-slate-900/80 border border-slate-800 rounded-3xl text-center space-y-3 shadow-xl">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-slate-200">
            جاري استخراج المفهوم من ملف «{selectedMaterial.fileName}» وتجهيز السبورة بنبرة الفيديو المرجعي لـ د. محمد الحبابي...
          </h4>
          <p className="text-xs text-slate-400">
            صياغة المعادلات الرياضية وتنسيق الإلقاء خطوة بخطوة
          </p>
        </div>
      )}

      {/* Interactive Whiteboard Display (Live Animated Writing + Reference Voice Diction + Sync) */}
      {resultData && !isLoading && viewMode === 'whiteboard' && (
        <InteractiveWhiteboard
          lessonTitle={resultData.lessonTitle}
          chapter={resultData.chapter}
          page={resultData.page}
          verifiedSourceFile={resultData.verifiedSourceFile}
          verifiedPage={resultData.verifiedPage}
          concept={resultData.concept}
          formulas={resultData.formulas}
          solvedExample={resultData.solvedExample}
          caution={resultData.caution}
          quiz={resultData.quiz}
          disclaimer={disclaimer}
          voiceMetrics={{
            speaker: voiceSettings.referenceSpeakerName,
            cadence: voiceSettings.referenceCadence,
            referenceVideoUrl: voiceSettings.referenceVideoUrl,
            consentStatus: voiceSettings.consentStatus,
          }}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        />
      )}

      {/* Structured Card Breakdown View (Summary View) */}
      {resultData && !isLoading && viewMode === 'summary' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 block uppercase">
                {resultData.verifiedSourceFile || resultData.chapter} {resultData.verifiedPage && `• Page ${resultData.verifiedPage}`}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                {resultData.lessonTitle}
              </h2>
            </div>
            <button
              onClick={() => setViewMode('whiteboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow"
            >
              <Tv className="w-3.5 h-3.5" />
              العودة إلى السبورة الحية
            </button>
          </div>

          {/* Section 1: فكرة الدرس */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              1. فكرة الدرس (Lesson Concept)
            </h4>
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {resultData.concept}
            </div>
          </div>

          {/* Section 2: أهم القوانين & 3. متى نستخدم القانون؟ */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              2. أهم القوانين ومعاني الرموز & 3. متى نستخدم القانون؟
            </h4>
            <div className="space-y-3">
              {resultData.formulas.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-900/90 border border-slate-800/80 rounded-xl space-y-2">
                  <div className="p-2.5 bg-black/60 rounded-lg border border-slate-800 font-mono text-sm sm:text-base text-cyan-300 font-bold text-center">
                    {item.formula}
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div>
                      <strong className="text-slate-400">معاني الرموز والوحدات: </strong>
                      {item.symbols}
                    </div>
                    <div>
                      <strong className="text-amber-400">متى يُستخدم القانون؟ </strong>
                      {item.whenToUse}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: مثال محلول خطوة بخطوة */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              4. مثال محلول لطلاب السنة الأولى (Worked Example)
            </h4>
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
              <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed">
                {resultData.solvedExample.problem}
              </p>
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  خطوات الحل النموذجية:
                </span>
                {resultData.solvedExample.steps.map((step, sIdx) => (
                  <div key={sIdx} className="p-2 bg-slate-950/70 rounded-lg text-xs font-mono text-cyan-200 border border-slate-800/60">
                    • {step}
                  </div>
                ))}
              </div>
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-300 font-bold text-center">
                الناتج النهائي: {resultData.solvedExample.finalAnswer}
              </div>
            </div>
          </div>

          {/* Section 5: تنبيه مهم */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              5. تنبيه مهم (Common Pitfall & Critical Warning)
            </h4>
            <p className="text-xs sm:text-sm text-amber-200 leading-relaxed font-sans">
              {resultData.caution}
            </p>
          </div>

          {/* Section 6: اختبر نفسك */}
          <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                6. اختبر نفسك (Test Yourself)
              </h4>
              <button
                onClick={() => setShowQuizSolution(!showQuizSolution)}
                className="flex items-center gap-1.5 px-3 py-1 bg-purple-900/60 hover:bg-purple-900 text-purple-200 text-xs font-bold rounded-lg border border-purple-500/30 transition-colors"
              >
                {showQuizSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showQuizSolution ? 'إخفاء الحل' : 'إظهار الحل'}
              </button>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 font-medium">
              {resultData.quiz.question}
            </div>
            {showQuizSolution && (
              <div className="p-3 bg-purple-950/60 border border-purple-500/30 rounded-xl text-xs text-purple-200 leading-relaxed font-sans">
                <strong className="block text-purple-300 mb-1">الحل النموذجي والتفسير:</strong>
                {resultData.quiz.solution}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

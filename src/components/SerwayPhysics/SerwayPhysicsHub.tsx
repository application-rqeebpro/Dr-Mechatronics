import React, { useState, useRef } from 'react';
import { SERWAY_CHAPTERS, SerwayChapter } from '../../data/serwayChapters';
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
} from 'lucide-react';

interface SerwayResultData {
  lessonTitle: string;
  chapter?: string;
  page?: string;
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
}

export const SerwayPhysicsHub: React.FC = () => {
  // Input fields
  const [lessonTitle, setLessonTitle] = useState<string>(
    'معادلات الحركة بتسارع منتظم والسقوط الحر'
  );
  const [chapterNumber, setChapterNumber] = useState<string>('2');
  const [pageNumber, setPageNumber] = useState<string>('35');
  const [studentNotes, setStudentNotes] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Chapters modal / picker
  const [showChapterPicker, setShowChapterPicker] = useState<boolean>(false);
  const [activeChapterFilter, setActiveChapterFilter] = useState<number | 'all'>('all');
  const [chapterSearch, setChapterSearch] = useState<string>('');

  // Execution & AI states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<
    'concise' | 'detailed' | 'formulas' | 'example' | 'quiz'
  >('concise');
  const [resultData, setResultData] = useState<SerwayResultData | null>(null);
  const [disclaimer, setDisclaimer] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [showQuizSolution, setShowQuizSolution] = useState<boolean>(false);

  // Audio speech
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  // Main Call to API
  const handleFetchExplanation = async (
    mode: 'concise' | 'detailed' | 'formulas' | 'example' | 'quiz' = activeMode
  ) => {
    if (!lessonTitle.trim()) return;

    setActiveMode(mode);
    setIsLoading(true);
    setShowQuizSolution(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }

    try {
      const res = await fetch('/api/ai/serway-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle,
          chapterNumber,
          pageNumber,
          mode,
          imageBase64: selectedImage,
          studentNotes,
        }),
      });

      const data = await res.json();
      if (data.data) {
        setResultData(data.data);
        setDisclaimer(data.disclaimer || '');
        setSource(data.source === 'gemini' ? 'Gemini 3.8 Flash' : 'محرك الميكاترونكس الذكي');
      }
    } catch (err: any) {
      console.error('Error fetching Serway explanation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Audio Speech function using Web Speech API
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('خدمة النطق الصوتي غير مدعومة في متصفحك.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!resultData) return;

    window.speechSynthesis.cancel();

    // Prepare speech script
    const speechText = `
محاضرة فيزياء كتاب سيرويه مع الدكتور محمد الحبابي.
درس: ${resultData.lessonTitle}.
فكرة الدرس: ${resultData.concept}.
أهم القوانين: ${resultData.formulas.map((f) => f.formula).join(', ')}.
مثال محلول: ${resultData.solvedExample.problem}. الناتج النهائي: ${resultData.solvedExample.finalAnswer}.
تنبيه مهم: ${resultData.caution}
    `;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'ar-SA';
    utterance.rate = speechRate;

    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arVoice) {
      utterance.voice = arVoice;
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Filtered Serway chapters
  const filteredChapters = SERWAY_CHAPTERS.filter((ch) => {
    if (activeChapterFilter !== 'all' && ch.chapterNumber !== activeChapterFilter) {
      return false;
    }
    if (!chapterSearch.trim()) return true;
    const q = chapterSearch.toLowerCase();
    return (
      ch.titleAr.toLowerCase().includes(q) ||
      ch.titleEn.toLowerCase().includes(q) ||
      ch.lessons.some(
        (l) => l.titleAr.toLowerCase().includes(q) || l.titleEn.toLowerCase().includes(q)
      )
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner with Dr. Mohammed Al-Hababi and Serway Reference */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden bg-blueprint">
        {/* Glow orb */}
        <div className="absolute top-0 end-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Text and Title */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              <BookOpen className="w-4 h-4" />
              <span>خدمة أكاديمية تخصصية | Serway Physics 9th Edition</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              شرح كتاب الفيزياء الهندسية
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 mt-1">
                مع د. محمد الحبابي
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              شرح منهجي منظم ومبسط لدروس وفصول كتاب <strong>Physics for Scientists and Engineers (Serway & Jewett)</strong>، يشمل فكرة الدرس، أهم القوانين والوحدات، متى يُستخدم القانون، أمثلة محلولة لطلاب السنة الأولى، وتنبيهات الأخطاء الشائعة واختبارات الفهم.
            </p>

            {/* Book Reference Badge */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 font-mono flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                الكتاب المرجعي: Serway & Jewett, 9th Ed.
              </span>
              <span className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                منهج معتمد لطلاب الهندسة
              </span>
            </div>
          </div>

          {/* Dr. Mohammed Al-Hababi Card with New Whiteboard Image */}
          <div className="lg:col-span-4">
            <div className="bg-slate-950 rounded-2xl border-2 border-cyan-500/40 p-4 shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-xs">
                <span className="font-bold text-cyan-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  الأستاذ المعتمد للشرح
                </span>
                <span className="text-slate-400 font-mono text-[11px]">د. محمد الحبابي</span>
              </div>

              {/* Real Whiteboard Photo */}
              <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 aspect-16/10 relative">
                <img
                  src="/assets/aistudio/Meta_AI_865483842_1438288071613716_6052109500696896818_n_20261026_214130.webp_9aa9edb5.jpg"
                  alt="Dr. Mohammed Al-Hababi Whiteboard"
                  className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 start-2.5 end-2.5 text-xs text-cyan-300 font-bold bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 text-center">
                  د. محمد الحبابي • أستاذ الفيزياء والدوائر الكهربائية
                </div>
              </div>

              <p className="mt-2.5 text-[11px] text-slate-400 leading-relaxed text-center">
                شرح أكاديمي منظم يركز على التطبيق المباشر وحل مسائل الامتحانات.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Lesson Selection Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              1. اختيار الدرس من كتاب Serway
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              اكتب اسم الدرس الذي تريده أو اختره مباشرة من الفهرس المعتمد لكتاب الفيزياء الهندسية
            </p>
          </div>

          <button
            onClick={() => setShowChapterPicker(!showChapterPicker)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-slate-900 transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            {showChapterPicker ? 'إغلاق فهرس الكتاب' : 'تصفح فهرس فصول ودروس Serway'}
          </button>
        </div>

        {/* Serway Chapters Picker Modal / Accordion */}
        {showChapterPicker && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-300">
                فهرس فصول كتاب Physics for Scientists and Engineers:
              </span>

              {/* Search in index */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute start-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="ابحث في الفهرس..."
                  value={chapterSearch}
                  onChange={(e) => setChapterSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg ps-8 pe-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Chapters list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pe-1">
              {filteredChapters.map((ch) => (
                <div
                  key={ch.chapterNumber}
                  className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="font-bold text-cyan-300">
                      الفصل {ch.chapterNumber}: {ch.titleAr}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{ch.titleEn}</span>
                  </div>

                  <div className="space-y-1">
                    {ch.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setLessonTitle(lesson.titleAr);
                          setChapterNumber(String(ch.chapterNumber));
                          if (lesson.suggestedPage) {
                            setPageNumber(String(lesson.suggestedPage));
                          }
                          setShowChapterPicker(false);
                        }}
                        className="w-full text-start p-1.5 rounded-lg hover:bg-cyan-950/50 hover:text-cyan-200 transition-colors flex items-center justify-between gap-2 group"
                      >
                        <span className="truncate">
                          {lesson.lessonNumber && (
                            <span className="text-[10px] text-slate-500 font-mono me-1">
                              [{lesson.lessonNumber}]
                            </span>
                          )}
                          {lesson.titleAr}
                        </span>
                        <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 font-mono shrink-0">
                          ص {lesson.suggestedPage}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Lesson Title */}
          <div className="md:col-span-6 space-y-1.5">
            <label className="text-xs font-bold text-slate-300">اسم الدرس أو الموضوع الفيزيائي:</label>
            <input
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="مثال: معادلات الحركة بتسارع منتظم، الشغل وطاقة الحركة، قانون كولوم..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Chapter Number (Optional) */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              رقم الفصل (Chapter) <span className="text-slate-500 font-normal">اختياري</span>:
            </label>
            <input
              type="text"
              value={chapterNumber}
              onChange={(e) => setChapterNumber(e.target.value)}
              placeholder="مثال: 2 أو 5 أو 23..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Page Number (Optional) */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              رقم الصفحة (Page) <span className="text-slate-500 font-normal">اختياري</span>:
            </label>
            <input
              type="text"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              placeholder="مثال: 35 أو 720..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Additional text or image snippet from textbook */}
          <div className="md:col-span-12 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                نص من الدرس أو صورة من الكتاب (اختياري لتحديد المسألة بدقة):
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                {selectedImage ? 'تغيير الصورة المرفوعة' : 'رفع لقطة من الكتاب'}
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
              placeholder="ألصق أي نص أو مسألة معينة من كتاب Serway هنا إذا أردت التركيز عليها..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          {selectedImage && (
            <div className="md:col-span-12 relative inline-block border border-cyan-500/30 rounded-xl overflow-hidden bg-slate-950 p-1">
              <img src={selectedImage} alt="Uploaded textbook snippet" className="h-28 object-contain rounded-lg" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 end-2 bg-rose-600 text-white rounded-full p-1 text-[10px]"
                title="إزالة الصورة"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* 2. Action Buttons as explicitly requested */}
        <div className="pt-2 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-semibold mb-2.5">
            خيارات وأزرار الشرح المباشر مع د. محمد الحبابي:
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* زر: اشرح الدرس باختصار */}
            <button
              onClick={() => handleFetchExplanation('concise')}
              disabled={isLoading || !lessonTitle.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-cyan-600/20"
            >
              <Sparkles className="w-4 h-4" />
              اشرح الدرس باختصار
            </button>

            {/* زر: أظهر القوانين */}
            <button
              onClick={() => handleFetchExplanation('formulas')}
              disabled={isLoading || !lessonTitle.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white font-bold rounded-xl text-xs transition-all border border-slate-700"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              أظهر القوانين
            </button>

            {/* زر: حل مثال */}
            <button
              onClick={() => handleFetchExplanation('example')}
              disabled={isLoading || !lessonTitle.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white font-bold rounded-xl text-xs transition-all border border-slate-700"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              حل مثال
            </button>

            {/* زر: اشرح بالتفصيل */}
            <button
              onClick={() => handleFetchExplanation('detailed')}
              disabled={isLoading || !lessonTitle.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white font-bold rounded-xl text-xs transition-all border border-slate-700"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              اشرح بالتفصيل
            </button>

            {/* زر: اختبرني */}
            <button
              onClick={() => handleFetchExplanation('quiz')}
              disabled={isLoading || !lessonTitle.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white font-bold rounded-xl text-xs transition-all border border-slate-700"
            >
              <HelpCircle className="w-4 h-4 text-rose-400" />
              اختبرني
            </button>

            {/* زر: استمع إلى الشرح */}
            {resultData && (
              <button
                onClick={toggleSpeech}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ms-auto ${
                  isPlayingAudio
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md animate-pulse'
                    : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60'
                }`}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isPlayingAudio ? 'إيقاف الشرح الصوتي' : 'استمع إلى الشرح'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-10 bg-slate-900/80 border border-slate-800 rounded-3xl text-center space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-slate-200">
            جاري تحضير شرح الدرس مع د. محمد الحبابي طبقًا لكتاب Serway...
          </h4>
          <p className="text-xs text-slate-400">
            استخراج فكرة الدرس والقوانين وحساب خطوات المثال النموذجي
          </p>
        </div>
      )}

      {/* 3. Structured Output Display (Ordered as required) */}
      {resultData && !isLoading && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          {/* Lecture Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 block uppercase">
                {resultData.chapter} {resultData.page && `• Page ${resultData.page}`}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                {resultData.lessonTitle}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg">
                المصدر: {source}
              </span>
            </div>
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
                <div
                  key={idx}
                  className="p-3.5 bg-slate-900/90 border border-slate-800/80 rounded-xl space-y-2"
                >
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
              4. مثال محلول لطلاب السنة الأولى (Solved Engineering Example)
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
                  <div
                    key={sIdx}
                    className="p-2 bg-slate-950/70 rounded-lg text-xs font-mono text-cyan-200 border border-slate-800/60"
                  >
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

          {/* Academic Disclaimer */}
          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
};

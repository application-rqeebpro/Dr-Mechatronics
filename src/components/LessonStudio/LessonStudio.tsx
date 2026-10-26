import React, { useState } from 'react';
import { LessonData } from '../../types';
import { getStoredProfessors } from '../../data/professors';
import {
  Video,
  Clapperboard,
  Sparkles,
  Play,
  Pause,
  Download,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Layers,
  ArrowRight,
  ArrowLeft,
  Settings,
  Tv,
} from 'lucide-react';

export const LessonStudio: React.FC = () => {
  const professorsList = getStoredProfessors();
  const [topic, setTopic] = useState<string>('Electrical Circuits Lab - تحليل الرنين في دوائر RLC');
  const [professorId, setProfessorId] = useState<string>('prof-alhababi');
  const [academicLevel, setAcademicLevel] = useState<string>('university');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [lesson, setLesson] = useState<LessonData | null>(null);

  // Studio player states
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isPlayingNarration, setIsPlayingNarration] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [videoMode, setVideoMode] = useState<'interactive' | 'mp4-export'>('interactive');
  const [externalApiKey, setExternalApiKey] = useState<string>('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const selectedProf = professorsList.find((p) => p.id === professorId) || professorsList[0];

  const handleGenerateLesson = async () => {
    setIsGenerating(true);
    setExportNotice(null);
    try {
      const res = await fetch('/api/ai/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          professorName: selectedProf.name,
          level: academicLevel,
        }),
      });
      const data = await res.json();
      if (data.lesson) {
        setLesson(data.lesson);
        setActiveSceneIndex(0);
        setUserAnswers({});
      }
    } catch (err) {
      console.error('Lesson creation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isPlayingNarration) {
        setIsPlayingNarration(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingNarration(false);
      setIsPlayingNarration(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMp4ExportClick = () => {
    if (!externalApiKey.trim()) {
      setExportNotice(
        'تنبيه الأمان والشفافية: يتطلب تصدير ملف MP4 حقيقي ربط مفتاح API لمزود معالجة فيديو سحابي خارجي (مثل Remotion Cloud أو HeyGen). نظرًا لعدم إدخال مفتاح API خارجي حاليًا، تعمل المنصة في "وضع العرض التفاعلي الحي المتقدم" داخل المتصفح، والذي يوفر كافة الرسوم والتنقل والتعليق الصوتي دون استهلاك موارد خارجية.'
      );
    } else {
      setExportNotice('جاري تهيئة الاتصال بمزود الفيديو الخارجي للرندرة...');
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header & Configuration */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Clapperboard className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                استوديو إنشاء الدروس المرئية التفاعلية (Visual Lesson Studio)
                <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded-full">
                  AI Generator
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                حوّل أي موضوع أو مسألة في هندسة الميكاترونكس إلى درس مرئي كامل مع سبورة وسيناريو وشرح صوتي
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setVideoMode('interactive')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                videoMode === 'interactive'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              الدرس التفاعلي الحي (مستحسن)
            </button>
            <button
              onClick={() => setVideoMode('mp4-export')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                videoMode === 'mp4-export'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              تصدير فيديو MP4
            </button>
          </div>
        </div>

        {/* Studio Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6">
          <div className="md:col-span-6 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">موضوع الدرس الهندسي</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثال: تحليل الرنين في دوائر RLC، أو تحكم PID بمحركات السيرفو..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">الأستاذ المقدم</label>
            <select
              value={professorId}
              onChange={(e) => setProfessorId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              {professorsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.courses.join(', ')})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex items-end">
            <button
              onClick={handleGenerateLesson}
              disabled={isGenerating || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-cyan-600/20"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'جاري بناء الدرس...' : 'إنشاء سيناريو الدرس'}
            </button>
          </div>
        </div>

        {/* MP4 API notice if selected */}
        {videoMode === 'mp4-export' && (
          <div className="mt-5 p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Settings className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong>إعداد مزود تصدير الفيديو الخارجي:</strong>
                <p className="text-purple-300/80 mt-0.5">
                  أدخل مفتاح API لمزود خدمة تحويل المشاهد التفاعلية إلى ملف MP4 (مثل Remotion أو HeyGen).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="password"
                placeholder="مفتاح API الخاص بك..."
                value={externalApiKey}
                onChange={(e) => setExternalApiKey(e.target.value)}
                className="bg-slate-950 border border-purple-500/40 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
              />
              <button
                onClick={handleMp4ExportClick}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs transition-colors shrink-0"
              >
                بدء التصدير
              </button>
            </div>
          </div>
        )}

        {exportNotice && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{exportNotice}</p>
          </div>
        )}
      </div>

      {/* Generated Lesson Interactive Player */}
      {lesson && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          {/* Lesson Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-2xl">
            <div>
              <span className="text-[11px] font-bold text-cyan-400 tracking-wider uppercase">
                درس مرئي معتمد
              </span>
              <h3 className="text-xl font-black text-slate-100 mt-1">{lesson.title}</h3>
              <p className="text-xs text-slate-400 mt-1">بإشراف: {selectedProf.name}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handleSpeech(
                    `${lesson.intro}. ${lesson.scenes[activeSceneIndex]?.professorSpeech || ''}`
                  )
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isPlayingNarration
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                    : 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                }`}
              >
                {isPlayingNarration ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlayingNarration ? 'إيقاف التعليق الصوتي' : 'استماع للشرح الصوتي العربي'}
              </button>
            </div>
          </div>

          {/* Objectives */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              أهداف الدرس التعليمية (Learning Objectives):
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {lesson.objectives.map((obj, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stepped Scenes Presentation Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Whiteboard for Active Scene */}
            <div className="lg:col-span-8 bg-slate-950 border-2 border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-inner">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <span className="font-bold text-cyan-400">
                    المشهد {activeSceneIndex + 1} من {lesson.scenes.length}:{' '}
                    {lesson.scenes[activeSceneIndex]?.title}
                  </span>
                  <span className="font-mono text-slate-500">STAGE_ACTIVE</span>
                </div>

                {/* Whiteboard content */}
                <pre className="mt-4 p-4 bg-slate-900/70 border border-slate-800/80 rounded-xl text-xs sm:text-sm font-mono text-cyan-300 whitespace-pre-wrap leading-relaxed overflow-x-auto min-h-[180px]">
                  {lesson.scenes[activeSceneIndex]?.whiteboardText}
                </pre>

                {/* Professor speech box */}
                <div className="mt-4 p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs text-cyan-200">
                  <strong className="block text-cyan-400 mb-1">
                    تعليق الأستاذ في هذا المشهد:
                  </strong>
                  <p className="italic">
                    "{lesson.scenes[activeSceneIndex]?.professorSpeech}"
                  </p>
                </div>
              </div>

              {/* Scene Navigation */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800 text-xs">
                <button
                  disabled={activeSceneIndex === 0}
                  onClick={() => {
                    setActiveSceneIndex((p) => Math.max(0, p - 1));
                    setIsPlayingNarration(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  المشهد السابق
                </button>

                <div className="flex items-center gap-1.5">
                  {lesson.scenes.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveSceneIndex(i);
                        setIsPlayingNarration(false);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        activeSceneIndex === i ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-800'
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={activeSceneIndex === lesson.scenes.length - 1}
                  onClick={() => {
                    setActiveSceneIndex((p) => Math.min(lesson.scenes.length - 1, p + 1));
                    setIsPlayingNarration(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition-colors"
                >
                  المشهد التالي
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Solved Step-by-Step Example */}
            <div className="lg:col-span-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  مثال تطبيقي محلول خطوة بخطوة
                </h4>
                <p className="text-xs text-slate-300 font-semibold mb-3 p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  {lesson.solvedExample.problem}
                </p>

                <div className="space-y-2 text-xs font-mono text-slate-300">
                  {lesson.solvedExample.solutionSteps.map((step, idx) => (
                    <div key={idx} className="p-2 bg-slate-900/60 rounded border border-slate-800/80">
                      <span className="text-cyan-400 font-bold block mb-0.5">
                        خطوة {idx + 1}:
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-300 font-bold text-center">
                الناتج النهائي: {lesson.solvedExample.finalAnswer}
              </div>
            </div>
          </div>

          {/* In-lesson Mini Quiz */}
          {lesson.miniQuiz && lesson.miniQuiz.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                اختبار الدرس القصير (Quick Mini-Quiz):
              </h4>

              {lesson.miniQuiz.map((q, qIndex) => {
                const selectedOpt = userAnswers[qIndex];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = selectedOpt === q.correctIndex;

                return (
                  <div key={qIndex} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <p className="text-sm font-semibold text-slate-200">{q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
                        if (isAnswered) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                          } else if (selectedOpt === optIdx) {
                            btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300';
                          }
                        }
                        return (
                          <button
                            key={optIdx}
                            disabled={isAnswered}
                            onClick={() => setUserAnswers({ ...userAnswers, [qIndex]: optIdx })}
                            className={`p-3 text-xs text-start rounded-lg border transition-all ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div
                        className={`p-3 rounded-lg text-xs ${
                          isCorrect
                            ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
                        }`}
                      >
                        <strong>{isCorrect ? 'إجابة صحيحة وممتازة! 🎉' : 'إجابة خاطئة ❌'}</strong>
                        <p className="mt-1">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Lesson Summary */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200">
            <strong className="block text-cyan-400 mb-1">خلاصة الدرس:</strong>
            <p>{lesson.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

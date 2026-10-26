import React, { useState } from 'react';
import { CURATED_QUIZZES } from '../../data/curatedQuizzes';
import { QuizQuestion } from '../../types';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Printer,
  ChevronRight,
} from 'lucide-react';

export const QuizzesHub: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(CURATED_QUIZZES);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (selectedAnswers[qId] !== undefined) return; // already answered
    const updated = { ...selectedAnswers, [qId]: optIdx };
    setSelectedAnswers(updated);

    // If all answered, trigger completion
    if (Object.keys(updated).length === totalQuestions) {
      setTimeout(() => {
        setIsCompleted(true);
        // calculate score
        let correct = 0;
        questions.forEach((q) => {
          if (updated[q.id] === q.correctIndex) correct++;
        });
        if (correct >= totalQuestions * 0.7) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }, 800);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) correct++;
    });
    return {
      correct,
      total: totalQuestions,
      percentage: Math.round((correct / totalQuestions) * 100),
    };
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsCompleted(false);
  };

  const scoreData = calculateScore();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">الاختبارات والتقييم الأكاديمي (Quizzes & Assessment)</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              اختبارات تفاعلية مصممة لقياس الاستيعاب الهندسي مع تصحيح فوري وشرح أسباب الإجابات
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          إعادة تعيين الاختبار
        </button>
      </div>

      {!isCompleted ? (
        /* Question View */
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>السؤال {currentIdx + 1} من {totalQuestions}</span>
              <span>تمت الإجابة على {answeredCount} من {totalQuestions}</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-purple-500 h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300">
                {currentQ.category}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-mono">
                مستوى: {currentQ.difficulty}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
              {currentQ.questionAr}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {currentQ.optionsAr.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                const isAnswered = selectedAnswers[currentQ.id] !== undefined;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300';
                  } else {
                    btnStyle = 'bg-slate-950 border-slate-900 text-slate-600 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(currentQ.id, idx)}
                    className={`p-4 rounded-xl border text-start text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card appears once answered */}
            {selectedAnswers[currentQ.id] !== undefined && (
              <div
                className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed mt-4 border ${
                  selectedAnswers[currentQ.id] === currentQ.correctIndex
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                }`}
              >
                <strong className="block mb-1">
                  {selectedAnswers[currentQ.id] === currentQ.correctIndex
                    ? 'إجابة نموذجية صحيحة! 🎉'
                    : 'إجابة غير دقيقة ❌'}
                </strong>
                <p>{currentQ.explanationAr}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-900 text-xs text-slate-300 disabled:opacity-40 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              السؤال السابق
            </button>

            <button
              disabled={currentIdx === totalQuestions - 1}
              onClick={() => setCurrentIdx((p) => Math.min(totalQuestions - 1, p + 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-900 text-xs text-slate-300 disabled:opacity-40 transition-colors"
            >
              السؤال التالي
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 mx-auto flex items-center justify-center text-3xl font-black">
            {scoreData.percentage}%
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-100">
              {scoreData.percentage >= 80
                ? 'أداء هندسي ممتاز ومبهر!'
                : scoreData.percentage >= 60
                ? 'مستوى جيد مع حاجة لتدقيق بعض القوانين'
                : 'تحتاج إلى مراجعة شروحات الأستاذ الافتراضي والمختبرات'}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              أجبت إجابة صحيحة على {scoreData.correct} من أصل {scoreData.total} أسئلة
            </p>
          </div>

          {/* Performance Breakdown */}
          <div className="max-w-md mx-auto grid grid-cols-2 gap-3 text-start text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">نقاط القوة:</span>
              <span className="text-emerald-400 font-bold">الدوائر الكهربائية وقوانين الحركة</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">الموضوعات الموصى بمراجعتها:</span>
              <span className="text-amber-400 font-bold">حسابات معامل Ki في PID والحركيات</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة الاختبار من البداية
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700"
            >
              <Printer className="w-4 h-4" />
              طباعة / تصدير تقرير التقييم
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

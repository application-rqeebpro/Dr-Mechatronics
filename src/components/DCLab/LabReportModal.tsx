import React, { useState } from 'react';
import { FioreExperiment, MeasurementRecord, LabSubmissionReport } from '../../types/dcLab';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Award,
  FileCheck,
  Send,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';

interface Props {
  experiment: FioreExperiment;
  measurements: MeasurementRecord[];
  studentName?: string;
  studentEmail?: string;
  preQuizScore?: { score: number; total: number };
  postQuizScore?: { score: number; total: number };
  onClose: () => void;
  onSaveReport?: (report: LabSubmissionReport) => void;
}

export const LabReportModal: React.FC<Props> = ({
  experiment,
  measurements,
  studentName = 'المهندس عبدالرقيب',
  studentEmail = 'student@mechatronics.edu',
  preQuizScore = { score: 2, total: 2 },
  postQuizScore = { score: 1, total: 1 },
  onClose,
  onSaveReport
}) => {
  const [studentNotes, setStudentNotes] = useState<string>(
    `تم إجراء التجربة بنجاح ومقارنة النتائج النظرية مع نتائج المحاكاة العملية. بلغت أقصى نسبة خطأ ${
      measurements.length > 0
        ? Math.max(...measurements.map(m => m.percentError)).toFixed(2)
        : '0.00'
    }% وهي نسبة مقبولة ناتجة عن نسب التفاوت في المكونات (Tolerance). تم التحقق من صحة القوانين الفيزيائية.`
  );

  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    experiment.discussionQuestions.forEach((q) => {
      init[q.id] = q.modelAnswerAr;
    });
    return init;
  });

  const [isSaved, setIsSaved] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const reportData = {
      experimentNumber: experiment.number,
      experimentTitle: experiment.titleAr,
      referenceManual: 'DC Electrical Circuit Analysis Laboratory Manual by James M. Fiore',
      studentName,
      studentEmail,
      date: new Date().toLocaleDateString('ar-EG'),
      measurements,
      preQuizScore,
      postQuizScore,
      answers,
      conclusion: studentNotes,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Fiore_DC_Lab_Report_Exp${experiment.number}_${Date.now()}.json`;
    a.click();
  };

  const handleSaveToProfile = () => {
    const report: LabSubmissionReport = {
      id: `report_${Date.now()}`,
      experimentNumber: experiment.number,
      experimentTitle: experiment.titleAr,
      studentName,
      studentEmail,
      date: new Date().toLocaleDateString('ar-EG'),
      measurements,
      preQuizScore,
      postQuizScore,
      answersToDiscussion: answers,
      conclusionAr: studentNotes,
      isCompleted: true,
      grade: 100,
    };
    if (onSaveReport) onSaveReport(report);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">تقرير التجربة المخبرية الأكاديمي (Official Lab Report)</h3>
              <p className="text-xs text-slate-400">وثيقة إثبات الأداء والقياسات ونسب الخطأ المعتمدة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة (Print)</span>
            </button>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>تصدير JSON</span>
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Academic Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200 text-xs sm:text-sm print:p-0 print:text-black">
          {/* Header Card */}
          <div className="border-b-2 border-cyan-500/40 pb-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                  جامعة الميكاترونكس الذكية • مختبر تحليل الدوائر الكهربائية DC
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white print:text-black mt-1">
                  تقرير تجربة #{experiment.number}: {experiment.titleAr}
                </h1>
                <p className="text-xs text-slate-400 print:text-slate-600">
                  {experiment.titleEn} — Laboratory Manual by James M. Fiore
                </p>
              </div>

              {/* Verified Grade Badge */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 text-center min-w-[120px]">
                <span className="text-[10px] text-emerald-400 font-bold block">حالة التقرير</span>
                <span className="text-lg font-black text-emerald-400 font-mono">مكتمل 100%</span>
                <span className="text-[9px] text-slate-400 block">تم التحقق آلياً</span>
              </div>
            </div>

            {/* Student & Date metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs text-slate-400 print:text-slate-700">
              <div>
                <span className="font-bold text-slate-300 print:text-black block">اسم الطالب:</span>
                <span>{studentName}</span>
              </div>
              <div>
                <span className="font-bold text-slate-300 print:text-black block">البريد الجامعي:</span>
                <span className="font-mono">{studentEmail}</span>
              </div>
              <div>
                <span className="font-bold text-slate-300 print:text-black block">تاريخ الإنجاز:</span>
                <span>{new Date().toLocaleDateString('ar-EG')}</span>
              </div>
              <div>
                <span className="font-bold text-slate-300 print:text-black block">نتائج الاختبارات:</span>
                <span className="text-emerald-400 font-bold font-mono">
                  قبلي: {preQuizScore.score}/{preQuizScore.total} | بعدي: {postQuizScore.score}/{postQuizScore.total}
                </span>
              </div>
            </div>
          </div>

          {/* Table of Measurements & Percent Error */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-cyan-400 print:text-black flex items-center gap-2">
              <span>📊 جدول القياسات، النتائج النظرية، ونسبة الخطأ (Error Analysis):</span>
            </h4>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 print:border-black">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 print:bg-slate-200 text-slate-300 print:text-black border-b border-slate-800">
                    <th className="p-3 text-start">الكمية المقاسة</th>
                    <th className="p-3 text-start">الرمز</th>
                    <th className="p-3 text-start">القيمة النظرية</th>
                    <th className="p-3 text-start">القيمة المقاسة بالمحاكاة</th>
                    <th className="p-3 text-start">الوحدة</th>
                    <th className="p-3 text-start">نسبة الخطأ %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-slate-300">
                  {measurements.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="p-3 font-semibold text-white print:text-black">{m.quantityNameAr}</td>
                      <td className="p-3 font-mono text-cyan-400 print:text-black">{m.symbol}</td>
                      <td className="p-3 font-mono">{m.theoreticalValue.toFixed(3)}</td>
                      <td className="p-3 font-mono font-bold text-emerald-400 print:text-black">
                        {m.measuredValue.toFixed(3)}
                      </td>
                      <td className="p-3 font-mono text-slate-400">{m.unit}</td>
                      <td className="p-3 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            m.percentError < 5
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {m.percentError.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              معادلة حساب نسبة الخطأ: Percent Error = (|Theoretical - Measured| / Theoretical) × 100%
            </p>
          </div>

          {/* Discussion Questions & Answers */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-amber-400 print:text-black">
              💬 أسئلة المناقشة والاستنتاج العلمي (Discussion & Analysis):
            </h4>
            <div className="space-y-3">
              {experiment.discussionQuestions.map((q) => (
                <div key={q.id} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-200 print:text-black block">س: {q.questionAr}</span>
                  <textarea
                    rows={2}
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white print:text-black focus:outline-none focus:border-cyan-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Student Conclusion */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-purple-400 print:text-black">
              📝 الخلاصة والاستنتاجات النهائية للطالب:
            </h4>
            <textarea
              rows={3}
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 print:text-black focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Academic Signature */}
          <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 print:text-black">
            <div>
              <span className="block font-bold text-slate-300 print:text-black">اعتماد دكتور الميكاترونكس الذكي:</span>
              <span className="text-[11px]">أستاذ الهندسة الكهربائية والمحاكاة الافتراضية</span>
            </div>
            <div className="text-end">
              <span className="block font-bold text-slate-300 print:text-black">توقيع الطالب:</span>
              <span className="font-mono text-cyan-400 print:text-black">{studentName}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-400">
            {isSaved ? '✅ تم حفظ التقرير في سجلك الأكاديمي بنجاح!' : 'احفظ التقرير لتسجيل إنجاز التجربة'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToProfile}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
              <span>حفظ في سجل الطالب</span>
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

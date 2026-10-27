import React, { useState, useEffect } from 'react';
import { SavedLecture } from '../../types';
import {
  BookOpen,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
  Trash2,
  Play,
  FileText,
  Search,
  FolderOpen,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface Props {
  onOpenLecture: (lecture: SavedLecture) => void;
}

export const MyLecturesHub: React.FC<Props> = ({ onOpenLecture }) => {
  const [lectures, setLectures] = useState<SavedLecture[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Load saved lectures from localStorage
  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = () => {
    try {
      const saved = localStorage.getItem('mechatronics_saved_lectures');
      if (saved) {
        const parsed: SavedLecture[] = JSON.parse(saved);
        setLectures(parsed);
      } else {
        // Seed default sample lecture if empty so student sees value immediately
        const sampleLecture: SavedLecture = {
          id: 'lec-sample-rlc',
          createdAt: new Date().toLocaleDateString('ar-EG', { dateStyle: 'medium' }),
          doctorName: 'د. محمد الحبابي',
          specialty: 'الدوائر الكهربائية والإلكترونيات',
          university: 'كلية الهندسة',
          subject: 'Electrical Circuits 1',
          topic: 'تحليل الرنين ومعاوقة دوائر RLC المتوالية',
          level: 'university',
          length: 'medium',
          sourceType: 'general',
          scenes: [
            {
              title: 'المفهوم الأساسي لدائرة RLC المتوالية',
              whiteboardText: `## دائرة RLC Series AC Circuit\n\n* **المعادلة:** $Z = \\sqrt{R^2 + (X_L - X_C)^2}$\n* **شرط الرنين:** $X_L = X_C \\implies \\omega L = \\frac{1}{\\omega C}$\n* **تردد الرنين:** $f_0 = \\frac{1}{2\\pi \\sqrt{LC}}$`,
              professorSpeech: 'مرحبًا بكم في هذه المحاضرة. نناقش هنا دائرة RLC المتوالية في التيار المتردد، حيث تكون المعاوقة عند أدنى مستوياتها ومساوية للمقاومة الأومية R عند الرنين.',
              diagramType: 'circuit',
              circuitParams: { R: 47, L: 0.1, C: 47, freq: 50, Vin: 12 },
            },
          ],
          solvedExample: {
            problem: 'دائرة RLC متوالية فيها R = 100 Ω, L = 0.5 H, C = 10 μF متصلة بجهد 220V بتردد 50Hz. احسب المعاوقة Z والتيار I.',
            solutionSteps: [
              'التردد الزاوي: ω = 2π × 50 ≈ 314.16 rad/s.',
              'المفاعلة الحثية: XL = ω·L = 314.16 × 0.5 = 157.08 Ω.',
              'المفاعلة السعوية: XC = 1/(ω·C) = 1/(314.16 × 10×10^-6) = 318.31 Ω.',
              'المعاوقة الكلية: Z = √[100² + (157.08 - 318.31)²] = √[10000 + 25995] ≈ 189.72 Ω.',
              'التيار الكلي: I = V/Z = 220 / 189.72 ≈ 1.16 A.',
            ],
            finalAnswer: 'المعاوقة Z = 189.72 Ω | التيار I = 1.16 A',
          },
          summary: 'عند الرنين يتلاشى فرق الطور وتكون زاوية الطور صفرًا وتصبح الدائرة في قمة توصيلها للتيار.',
        };
        setLectures([sampleLecture]);
        localStorage.setItem('mechatronics_saved_lectures', JSON.stringify([sampleLecture]));
      }
    } catch (e) {
      console.error('Error loading saved lectures:', e);
    }
  };

  const handleDelete = (id: string) => {
    const updated = lectures.filter((l) => l.id !== id);
    setLectures(updated);
    localStorage.setItem('mechatronics_saved_lectures', JSON.stringify(updated));
    setDeleteConfirmId(null);
  };

  const subjects = ['all', ...Array.from(new Set(lectures.map((l) => l.subject)))];

  const filteredLectures = lectures.filter((lec) => {
    const matchQuery =
      lec.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lec.doctorName && lec.doctorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lec.university && lec.university.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchSubject = selectedSubject === 'all' || lec.subject === selectedSubject;
    return matchQuery && matchSubject;
  });

  const exportLecturesBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(lectures, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mechatronics_my_lectures_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              <FolderOpen className="w-3.5 h-3.5" />
              أرشيف المحاضرات الشخصية
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              محاضراتي المحفوظة | My Saved Lectures
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              جميع المحاضرات التي أنشأتها أو شرحتها مسبقًا محفوظة محليًا على جهازك بأمان. يمكنك إعادة فتح أي محاضرة على السبورة التفاعلية واستئناف الشرح في أي وقت.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportLecturesBackup}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
              title="تصدير نسخة احتياطية من محاضراتك"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              تصدير المحاضرات (JSON)
            </button>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالدرس، المادة، اسم الدكتور، أو الجامعة..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-cyan-500 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {subjects.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedSubject === sub
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      : 'bg-slate-950/50 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {sub === 'all' ? 'جميع المواد' : sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lectures Grid */}
      {filteredLectures.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">لا توجد محاضرات محفوظة مطابقة للبحث</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            يمكنك إنشاء محاضرة جديدة من تبويب «استوديو الدروس» والضغط على زر «حفظ المحاضرة» لتظهر هنا دائمًا.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLectures.map((lec) => (
            <div
              key={lec.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all group"
            >
              <div className="space-y-3">
                {/* Header tags */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-bold">
                      {lec.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 text-[10px]">
                      {lec.level === 'beginner' ? 'مبتدئ' : lec.level === 'advanced' ? 'متقدم' : 'جامعي'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    {lec.createdAt}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {lec.topic}
                </h3>

                {/* Instructor / University details */}
                <div className="text-xs text-slate-400 space-y-1 pt-1">
                  {lec.doctorName && (
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{lec.doctorName}</span>
                    </div>
                  )}
                  {lec.university && (
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <GraduationCap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{lec.university}</span>
                    </div>
                  )}
                  {lec.sourceFileName && (
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate max-w-[200px]">{lec.sourceFileName}</span>
                    </div>
                  )}
                </div>

                {/* Brief Summary preview */}
                {lec.summary && (
                  <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 line-clamp-2">
                    {lec.summary}
                  </p>
                )}

                {/* Stats badge */}
                <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                  <span>{lec.scenes.length} مشاهد سبورة</span>
                  <span>•</span>
                  <span>{lec.solvedExample ? 'يحتوي مثالًا محلولًا' : 'بدون مثال'}</span>
                  {lec.miniQuiz && lec.miniQuiz.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{lec.miniQuiz.length} أسئلة اختبار</span>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenLecture(lec)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  إعادة فتح المحاضرة على السبورة
                </button>

                {deleteConfirmId === lec.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(lec.id)}
                      className="px-2 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold"
                    >
                      تأكيد
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-2 rounded-xl bg-slate-800 text-slate-400 text-[10px]"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(lec.id)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    title="حذف المحاضرة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

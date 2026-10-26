import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import {
  User,
  GraduationCap,
  Award,
  BookOpen,
  Bookmark,
  FileText,
  Settings,
  Volume2,
  Gauge,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';

interface Props {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
}

export const StudentDashboard: React.FC<Props> = ({ profile, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'settings'>('overview');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAddNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      title: newNoteTitle,
      content: newNoteContent,
      category: 'عام',
      date: new Date().toISOString().split('T')[0],
    };
    onUpdateProfile({
      ...profile,
      savedNotes: [newNote, ...profile.savedNotes],
    });
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const handleDeleteNote = (id: string) => {
    onUpdateProfile({
      ...profile,
      savedNotes: profile.savedNotes.filter((n) => n.id !== id),
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Profile Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-2xl shadow-lg shadow-cyan-600/10">
            {profile.name ? profile.name[0] : 'ط'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              {profile.name || 'طالب هندسة الميكاترونكس'}
              <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded-full font-mono">
                {profile.academicLevel === 'year-3' ? 'السنة الثالثة' : 'طالب جامعي'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              تخصص: {profile.specialty === 'mechatronics' ? 'هندسة الميكاترونكس والأنظمة الذكية' : profile.specialty}
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'overview' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            نظرة عامة والتقدم
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'notes' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            الملاحظات الهندسية ({profile.savedNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'settings' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            الإعدادات
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">المختبرات المكتملة</span>
              <span className="text-2xl font-mono font-bold text-cyan-400">
                {profile.completedLabs.length} / 6
              </span>
              <span className="text-[10px] text-emerald-400 block mt-1">نشاط تجريبي متميز</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">متوسط درجات الاختبارات</span>
              <span className="text-2xl font-mono font-bold text-purple-400">88%</span>
              <span className="text-[10px] text-slate-500 block mt-1">3 اختبارات مجتازة</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">الملاحظات المحفوظة</span>
              <span className="text-2xl font-mono font-bold text-amber-400">
                {profile.savedNotes.length}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">أفكار ومعادلات</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">ساعات التعلم والتدريب</span>
              <span className="text-2xl font-mono font-bold text-emerald-400">14.5</span>
              <span className="text-[10px] text-slate-500 block mt-1">ساعة تفاعلية</span>
            </div>
          </div>

          {/* Recent Quiz Scores */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              سجل الاختبارات والتقييمات الأخيرة:
            </h4>
            <div className="divide-y divide-slate-800/80">
              {profile.quizScores.map((score, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200 block">{score.title}</span>
                    <span className="text-[10px] text-slate-500">{score.date}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                    {score.score} / {score.total} ({(score.score / score.total) * 100}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-6">
          {/* Add note form */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              تدوين ملاحظة هندسية جديدة:
            </h4>
            <input
              type="text"
              placeholder="عنوان الملاحظة (مثال: اشتقاق قانون الرنين RLC)"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
            <textarea
              rows={3}
              placeholder="اكتب الملاحظات والقوانين أو ملحوظة التجربة المعملية..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddNote}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all"
              >
                <Plus className="w-4 h-4" />
                حفظ الملاحظة
              </button>
            </div>
          </div>

          {/* Notes List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.savedNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-200">{note.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{note.date}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-900 flex justify-end">
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 text-xs"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl max-w-xl mx-auto space-y-5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800">
            تفضيلات التعلم وسرعة الشرح الصوتي
          </h4>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">اسم الطالب المهندس:</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => onUpdateProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">التخصص الأكاديمي:</label>
              <select
                value={profile.specialty}
                onChange={(e: any) => onUpdateProfile({ ...profile, specialty: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="mechatronics">هندسة الميكاترونكس (Mechatronics)</option>
                <option value="robotics">هندسة الروبوتات والذكاء الاصطناعي</option>
                <option value="electronics">الهندسة الكهربائية والإلكترونية</option>
                <option value="mechanical">الهندسة الميكانيكية</option>
                <option value="automation">الأتمتة والتحكم الصناعي</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs">
                <span className="font-bold text-slate-200 block">المؤثرات الصوتية والتعليق الصوتي</span>
                <span className="text-[10px] text-slate-500">تمكين الشرح الصوتي في الدروس</span>
              </div>
              <input
                type="checkbox"
                checked={profile.soundEnabled}
                onChange={(e) => onUpdateProfile({ ...profile, soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

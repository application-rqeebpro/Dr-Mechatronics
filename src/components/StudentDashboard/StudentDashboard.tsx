import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../../types';
import {
  AudioSpeechEngine,
  ArabicDialect,
  VoiceEngineType,
  VoicePersona,
  SystemVoiceOption,
} from '../../utils/audioSpeechEngine';
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
  Play,
  Square,
  Sparkles,
  Languages,
  Check,
  Zap,
  Radio,
  Sliders,
  ShieldCheck,
  CheckCheck,
} from 'lucide-react';

interface Props {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
}

export const StudentDashboard: React.FC<Props> = ({ profile, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'settings'>('overview');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Voice testing & engine state
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [testNotice, setTestNotice] = useState<string | null>(null);
  const [systemVoices, setSystemVoices] = useState<SystemVoiceOption[]>([]);

  useEffect(() => {
    const engine = AudioSpeechEngine.getInstance();
    setSystemVoices(engine.getAvailableVoices());
    const unsub = engine.onVoicesUpdated(() => {
      setSystemVoices(engine.getAvailableVoices());
    });
    return () => {
      unsub();
      engine.stop();
    };
  }, []);

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

  // Dialect options for virtual professor
  const DIALECT_OPTIONS: {
    id: ArabicDialect;
    name: string;
    flag: string;
    badge: string;
    desc: string;
    example: string;
  }[] = [
    {
      id: 'yemeni',
      name: 'اللهجة اليمنية الأكاديمية (جامعية)',
      flag: '🇾🇪',
      badge: 'موصى به لطلاب اليمن',
      desc: 'أسلوب ودود ومحفز مع عبارات تشجيعية (يا باشمهندسين، خلونا نبدأ سوا، ركزوا معي تمام)',
      example: '«حياكم الله يا شباب ويا باشمهندسين في منصة دكتور الميكاترونكس الذكي...»',
    },
    {
      id: 'standard',
      name: 'اللغة العربية الفصحى المعيارية',
      flag: '📖',
      badge: 'معتمد أكاديمياً ورسمياً',
      desc: 'نطق فصيح ومخارج حروف واضحة جداً مطابقة للمصطلحات الهندسية المعتمدة',
      example: '«أهلاً ومرحباً بكم أعزائي المهندسين، نبدأ الآن دراسة المفاهيم الهندسية...»',
    },
    {
      id: 'egyptian',
      name: 'اللهجة المصرية الهندسية المبسطة',
      flag: '🇪🇬',
      badge: 'شرح هندسي سلس وشائع',
      desc: 'الأسلوب الدارج المحبوب لتبسيط مفاهيم الإلكترونيات والدوائر (يلا بينا، خلوا بالكم)',
      example: '«أهلاً بيكم يا باشمهندسين ومنورين، يلا بينا نفهم فكرة الدرس خطوة بخطوة...»',
    },
    {
      id: 'gulf',
      name: 'اللهجة الخليجية الأكاديمية',
      flag: '🇸🇦',
      badge: 'نبرة رصينة ومحترمة',
      desc: 'إلقاء هادئ ومفردات خليجية مهذبة (يا هلا ومرحبابكم، خلونا نشوف هالمثال)',
      example: '«يا هلا ومرحبابكم يا مهندسي المستقبل، ونسعد بشرح الدروس الهندسية بإتقان...»',
    },
    {
      id: 'levantine',
      name: 'اللهجة الشامية التعليمية',
      flag: '🇸🇾',
      badge: 'إلقاء واضح وهادئ',
      desc: 'شرح دقيق وسلس ومريح للمستمع (مية أهلاً، رح نبلش سوا، بكل وضوح)',
      example: '«مية أهلاً وسهلاً فيكم يا مهندسين، وجاهزين لنبلش سوا بشرح المحاضرات...»',
    },
  ];

  // AI Voice Persona & Engine options
  const VOICE_OPTIONS: {
    id: VoiceEngineType;
    persona: VoicePersona;
    name: string;
    badge: string;
    desc: string;
    tagColor: string;
  }[] = [
    {
      id: 'native_hd',
      persona: 'male',
      name: '✨ الصوت العربي الأصلي الطبيعي فائق النقاء HD (أستاذ ذكر)',
      badge: 'الأعلى نقاءً (بدون روبوت وبدون تكسير)',
      desc: 'صوت بشري أصلي ذكوري معرب بالكامل عبر محرك Google Neural بدون أي تكسير في اللغة أو تشويه روبوتي',
      tagColor: 'from-cyan-500/20 to-sky-500/20 border-cyan-500/40 text-cyan-300',
    },
    {
      id: 'fenrir_male',
      persona: 'male',
      name: '🎙️ أستاذ جامعي ذكوري وقور (Deep Academic Male)',
      badge: 'أستاذ ذكوري معتمد',
      desc: 'نبرة أستاذ جامعي ذكوري عميقة وواثقة مناسبة للمحاضرات النظرية والفيزيائية المعقدة',
      tagColor: 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-300',
    },
    {
      id: 'device_tts',
      persona: 'male',
      name: '📱 أصوات الجهاز والنظام المدمجة (Local OS Speech - ذكر)',
      badge: 'محرك محلي',
      desc: 'استخدام صوت الجهاز المحلي المخصص بنبرة ذكورية للأستاذ الافتراضي',
      tagColor: 'from-slate-500/20 to-slate-600/20 border-slate-500/40 text-slate-300',
    },
  ];

  // Active configurations with safe defaults (Strictly male Arabic voice)
  const activeDialect: ArabicDialect = profile.preferredDialect || 'yemeni';
  const activeEngine: VoiceEngineType = profile.preferredVoiceEngine || 'native_hd';
  const activePersona: VoicePersona = 'male';
  const activeRate: number = profile.speechRate || 1.0;
  const activeVoiceId: string = profile.selectedVoiceId || '';

  // Test Voice Function
  const handleTestVoice = () => {
    const engine = AudioSpeechEngine.getInstance();
    if (isTestingVoice) {
      engine.stop();
      setIsTestingVoice(false);
      setTestNotice(null);
      return;
    }

    setIsTestingVoice(true);
    setTestNotice('جاري تشغيل تجربة الصوت العربي الأصلي واللهجة المختارة الآن...');

    const started = engine.testSample(
      activePersona,
      activeVoiceId,
      activeRate,
      activeDialect,
      activeEngine,
      {
        onStart: () => {
          setIsTestingVoice(true);
          setTestNotice('الصوت العربي الأصلي يعمل الآن بنقاء تام وبدون أي تكسير.');
        },
        onEnd: () => {
          setIsTestingVoice(false);
          setTestNotice('اكتمل اختبار الصوت بنجاح.');
          setTimeout(() => setTestNotice(null), 3500);
        },
        onError: () => {
          setIsTestingVoice(false);
          setTestNotice('تنبيه: تعذر تشغيل الصوت. تأكد من تفعيل الصوت في متصفحك.');
          setTimeout(() => setTestNotice(null), 4000);
        },
      }
    );

    if (!started) {
      setIsTestingVoice(false);
      setTestNotice('تنبيه: لم يتمكن المتصفح من بدء الصوت، جرب خيار الصوت العربي الأصلي HD.');
    }
  };

  const handleSelectDialect = (d: ArabicDialect) => {
    onUpdateProfile({
      ...profile,
      preferredDialect: d,
    });
    if (isTestingVoice) AudioSpeechEngine.getInstance().stop();
  };

  const handleSelectEngine = (eng: VoiceEngineType, persona: VoicePersona) => {
    onUpdateProfile({
      ...profile,
      preferredVoiceEngine: eng,
      voicePersona: persona,
    });
    if (isTestingVoice) AudioSpeechEngine.getInstance().stop();
  };

  const handleRateChange = (r: number) => {
    onUpdateProfile({
      ...profile,
      speechRate: r,
    });
  };

  const arabicSystemVoices = systemVoices.filter((v) => v.isArabic);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Profile Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-2xl shadow-lg shadow-cyan-600/10 shrink-0">
            {profile.name ? profile.name[0] : 'ط'}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              {profile.name || 'طالب هندسة الميكاترونكس'}
              <span className="text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded-full font-mono">
                {profile.academicLevel === 'year-3' ? 'السنة الثالثة' : 'طالب جامعي'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
              تخصص: {profile.specialty === 'mechatronics' ? 'هندسة الميكاترونكس والأنظمة الذكية' : profile.specialty}
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto justify-center">
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
            الملاحظات ({profile.savedNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'settings' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>إعدادات الصوت واللهجة</span>
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">المختبرات المكتملة</span>
                <span className="text-lg font-bold text-slate-100 font-mono">
                  {profile.completedLabs.length} / 5
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">الاختبارات المجتازة</span>
                <span className="text-lg font-bold text-slate-100 font-mono">
                  {profile.quizScores.length} اختبارات
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">اللهجة الصوتية المعتمدة</span>
                <span className="text-xs font-bold text-emerald-300 truncate block">
                  {DIALECT_OPTIONS.find((d) => d.id === activeDialect)?.name || 'يمنية أكاديمية'}
                </span>
              </div>
            </div>
          </div>

          {/* DC Circuit Analysis Lab Progress & Certificate Badge */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h4 className="font-bold text-sm text-white">
                  مختبر تحليل الدوائر الكهربائية DC (دليل James M. Fiore)
                </h4>
              </div>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800">
                15 تجربة جامعية
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              يشمل تجارب السلامة، قانون أوم، التوالي والتوازي، الجسور، مقاييس الجهد، نظرية التراكب، ثيفينن، أقصى قدرة، العقد والمسارات، وشحن وتفريغ المكثفات والملفات.
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-300">
                الشهادة الأكاديمية: <strong className="text-emerald-400">متاحة فور إكمال تقارير التجارب</strong>
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                تم التحقق وفق معايير كتاب DC Circuit Analysis Laboratory Manual
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <h4 className="font-bold text-sm text-slate-200">إضافة ملاحظة هندسية جديدة</h4>
            <input
              type="text"
              placeholder="عنوان الملاحظة (مثال: قانون أوم أو رنين RLC)..."
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
            <textarea
              placeholder="اكتب تفاصيل الملاحظة والقوانين هنا..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddNote}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-600/20"
              >
                <Plus className="w-4 h-4" />
                حفظ الملاحظة
              </button>
            </div>
          </div>

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

      {/* Settings Tab: Complete Voice, Dialect & Student Configurations */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Section 1: Virtual Professor Voice & Dialect Settings */}
          <div className="p-5 sm:p-6 bg-slate-950 border border-cyan-500/30 rounded-2xl space-y-6 shadow-xl">
            {/* Header with Test Voice Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-cyan-400" />
                  إعدادات صوت الأستاذ الافتراضي واللهجات العربية
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                    Active Tuning
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  اختر اللهجة العربية المفضلة ونوع صوت الذكاء الاصطناعي مع ضمان جودة النطق العربي الأصلي بدون أي تكسير.
                </p>
              </div>

              {/* Direct Voice Test Button */}
              <button
                onClick={handleTestVoice}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  isTestingVoice
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                    : 'bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white shadow-md shadow-cyan-600/25'
                }`}
              >
                {isTestingVoice ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isTestingVoice ? 'إيقاف تجربة الصوت' : 'زر تجربة الصوت والاستماع المباشر'}</span>
              </button>
            </div>

            {/* Test Notice Banner */}
            {testNotice && (
              <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-xs text-cyan-200 flex items-center gap-2.5 animate-fadeIn">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-spin" />
                <span className="font-medium">{testNotice}</span>
              </div>
            )}

            {/* Sub-section: Arabic Dialect Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-cyan-400" />
                  اختر اللهجة العربية المعتمدة لشرح الأستاذ الافتراضي:
                </label>
                <span className="text-[11px] text-cyan-400 font-medium">
                  المحددة حالياً: {DIALECT_OPTIONS.find((d) => d.id === activeDialect)?.name}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {DIALECT_OPTIONS.map((d) => {
                  const isSelected = activeDialect === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => handleSelectDialect(d.id)}
                      className={`p-3.5 rounded-xl border text-start transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500 text-slate-100 shadow-md shadow-cyan-950/30 ring-1 ring-cyan-500/30'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-bold text-xs text-white flex items-center gap-1.5">
                            <span className="text-base">{d.flag}</span>
                            {d.name}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                          {d.desc}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                        <span className="text-cyan-400/90 font-mono truncate max-w-[200px]">{d.example}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] shrink-0">
                          {d.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-section: AI Voice Persona & Engine */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                اختر نوع صوت الذكاء الاصطناعي للأستاذ الافتراضي:
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {VOICE_OPTIONS.map((v) => {
                  const isSelected = activeEngine === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleSelectEngine(v.id, v.persona)}
                      className={`p-3.5 rounded-xl border text-start transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                          : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-xs text-white flex items-center gap-2">
                            {v.name}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                          {v.desc}
                        </p>
                      </div>
                      <div className="pt-2.5 mt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          عربي أصلي نقي
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                          {v.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Device Voices Selector (If Device TTS chosen) */}
            {activeEngine === 'device_tts' && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 animate-fadeIn">
                <label className="text-xs font-semibold text-slate-200 block">
                  اختر الصوت من حزم نظام التشغيل / المتصفح:
                </label>
                <select
                  value={activeVoiceId}
                  onChange={(e) => onUpdateProfile({ ...profile, selectedVoiceId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="">تلقائي حسب لغة النظام</option>
                  {systemVoices.map((v, idx) => (
                    <option key={`${v.id}_${idx}`} value={v.id}>
                      {v.isArabic ? '🟢 ' : '🌐 '} {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">
                  {arabicSystemVoices.length > 0
                    ? `تم اكتشاف ${arabicSystemVoices.length} أصوات عربية مثبتة على جهازك.`
                    : 'لم يتم العثور على حزم أصوات عربية محلية على جهازك، نوصي باختيار الصوت العربي الأصلي HD.'}
                </p>
              </div>
            )}

            {/* Sub-section: Speed and Enunciation Tuning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Speed */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    سرعة الإلقاء الصوتي:
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{activeRate}x</span>
                </label>
                <div className="flex items-center gap-1.5 pt-1">
                  {[0.8, 0.9, 1.0, 1.15, 1.25].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleRateChange(speed)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        activeRate === speed
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality & Transliteration Assurance Badge */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ميزات الصوت العربي الأصلي المضبوطة:
                </span>
                <ul className="text-[10.5px] text-slate-300 space-y-1 pt-1 leading-relaxed">
                  <li className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCheck className="w-3.5 h-3.5" />
                    تعريب صوتي تلقائي لكافة الرموز والمعادلات (V=I*R, RLC, Ohm's Law).
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCheck className="w-3.5 h-3.5" />
                    منع أي تلعثم أو تكسير في الكلمات الإنجليزية والتقنية.
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCheck className="w-3.5 h-3.5" />
                    مزامنة صوتية فورية مع السبورة الذكية واستوديو المحاضرات.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: General Profile & Specialty */}
          <div className="p-5 sm:p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800">
              بيانات الطالب والتخصص الجامعي
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <option value="robotics">هندسة الروبوتات والأنظمة الذكية</option>
                  <option value="electronics">الهندسة الكهربائية والإلكترونية</option>
                  <option value="mechanical">الهندسة الميكانيكية</option>
                  <option value="automation">الأتمتة والتحكم الصناعي</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs">
                <span className="font-bold text-slate-200 block">تشغيل الشرح الصوتي التلقائي</span>
                <span className="text-[10px] text-slate-400">نطق الشرح والمعادلات عند الانتقال بين خطوات الدرس</span>
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

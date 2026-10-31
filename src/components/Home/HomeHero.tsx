import React, { useState } from 'react';
import { MainTab, Language } from '../../types';
import {
  GraduationCap,
  Clapperboard,
  FlaskConical,
  Calculator,
  Sparkles,
  BookOpen,
  Award,
  ArrowRight,
  ArrowLeft,
  Search,
  Zap,
  Waves,
  Smartphone,
  Download,
  Layers,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onNavigate: (tab: MainTab) => void;
  lang: Language;
}

export const HomeHero: React.FC<Props> = ({ onNavigate, lang }) => {
  const [searchVal, setSearchVal] = useState('');

  const services = [
    {
      id: 'circuit-wizard' as MainTab,
      title: 'بيئة المختبر الذكي Circuit Wizard Studio',
      titleEn: 'Circuit Wizard CAD & PCB Simulation Suite',
      desc: 'بيئة هندسية متكاملة تحاكي برنامج Circuit Wizard بكامل تفاصيله: وضع مستويات الجهد Voltage Levels، سريان التيار Current Flow، طباعة اللوحات المطبوعة PCB، المخطط المنطقي Flowchart لبرمجة GENIE PIC، ومكتبة القطع كاملة.',
      icon: Sparkles,
      color: 'from-purple-500/20 to-indigo-600/20 text-purple-400 border-purple-500/30',
      badge: 'جديد: Circuit Wizard CAD & PCB',
    },
    {
      id: 'virtual-breadboard' as MainTab,
      title: 'لوحة التجارب العملية الافتراضية (Breadboard)',
      titleEn: 'Virtual Breadboard & Electronics Lab',
      desc: 'مساحة عمل تفاعلية تحاكي لوحة التجارب الإلكترونية الحقيقية (830 نقطة): سحب وإفلات العناصر، مد وتوصيل الأسلاك بحرية، محاكاة كهربائية حقيقية بـ MNA، راسم إشارة Oscilloscope، وميزة حوّل محاضرتك إلى تجربة.',
      icon: Cpu,
      color: 'from-emerald-500/20 to-teal-600/20 text-emerald-400 border-emerald-500/30',
      badge: 'جديد: Breadboard 830 نقطة + راسم إشارة',
    },
    {
      id: 'dc-lab' as MainTab,
      title: 'المختبر الكهربائي الافتراضي DC (دليل James M. Fiore)',
      titleEn: 'DC Circuit Analysis Virtual Lab',
      desc: 'مختبر هندسي تفاعلي يحاكي 15 تجربة جامعية: قانون أوم، كيرشوف، التوالي والتوازي، الجسور، ثيفينن، التراكب، نقل القدرة العظمى، والتحليل بالعقد والمسارات.',
      icon: Zap,
      color: 'from-cyan-500/20 to-blue-600/20 text-cyan-400 border-cyan-500/30',
      badge: 'جديد: 15 تجربة حقيقية + تقارير',
    },
    {
      id: 'serway-physics' as MainTab,
      title: 'شرح كتاب Serway مع د. محمد الحبابي',
      titleEn: 'Serway Physics with Dr. Al-Hababi',
      desc: 'خدمة أكاديمية متخصصة لشرح كتاب Serway & Jewett 9th Edition مع فكرة الدرس، القوانين، متى يُستخدم، مثال محلول، تنبيه، واختبر نفسك.',
      icon: BookOpen,
      color: 'from-amber-500/20 to-yellow-600/20 text-amber-400 border-amber-500/30',
      badge: 'جديد: كتاب Serway 9th Ed',
    },
    {
      id: 'professors' as MainTab,
      title: 'الأستاذ الافتراضي والسبورة الذكية',
      titleEn: 'Virtual Professor & Whiteboard',
      desc: 'شرح تفاعلي ذكي على السبورة البيضاء؛ يتيح لك إدخال اسم أي دكتور وجامعتك وتخصصك ومادتك لشرحها بصوت تفاعلي ومعادلات حية.',
      icon: GraduationCap,
      color: 'from-sky-500/20 to-blue-600/20 text-sky-400 border-sky-500/30',
      badge: 'اسم دكتورك وتخصصك الحر',
    },
    {
      id: 'labs' as MainTab,
      title: 'مختبرات المحاكاة التفاعلية',
      titleEn: 'Interactive Simulation Labs',
      desc: 'محاكاة دوائر التيار المتردد RLC مع راسم إشارة، قانون أوم، البوابات المنطقية، الأذرع الروبوتية، وتحكم PID.',
      icon: FlaskConical,
      color: 'from-cyan-500/20 to-teal-600/20 text-cyan-400 border-cyan-500/30',
      badge: '6 مختبرات حية',
    },
    {
      id: 'lesson-studio' as MainTab,
      title: 'استوديو شرح الدروس الذكي',
      titleEn: 'Universal Smart Lesson Studio',
      desc: 'شرح فوري لأي درس أو ملف مرفوع (PDF/صور/مذكرات) لأي طالب وأي جامعة مع سبورة تفاعلية تدريجية وصوت وإجراءات عملية.',
      icon: Clapperboard,
      color: 'from-purple-500/20 to-indigo-600/20 text-purple-400 border-purple-500/30',
      badge: 'توليد ذكي + رفع ملفات + OCR',
    },
    {
      id: 'my-lectures' as MainTab,
      title: 'محاضراتي المحفوظة',
      titleEn: 'My Saved Lectures',
      desc: 'سجل كامل لجميع المحاضرات والمسائل التي أنشأتها، مع إمكانية إعادة فتح المحاضرة ومراجعة السبورة والاختبارات في أي وقت.',
      icon: BookOpen,
      color: 'from-cyan-500/20 to-sky-600/20 text-cyan-400 border-cyan-500/30',
      badge: 'أرشيف محلي آمن',
    },
    {
      id: 'calculators' as MainTab,
      title: 'الحاسبات الهندسية الدقيقة',
      titleEn: 'Engineering Calculators',
      desc: 'حاسبات قانون أوم، مقاومات التوالي والتوازي، العزم والقدرة و RPM، نسب التروس، وثابت الوقت RC.',
      icon: Calculator,
      color: 'from-amber-500/20 to-orange-600/20 text-amber-400 border-amber-500/30',
      badge: 'معادلات ووحدات SI',
    },
    {
      id: 'ai-toolkit' as MainTab,
      title: 'أدوات الذكاء الاصطناعي الهندسية',
      titleEn: 'AI Engineering Toolkit',
      desc: '12 أداة تشمل: اشرح لي، حل المسألة مع رفع الصور، لماذا هذا القانون؟، اشتقاق المعادلات، وقاموس المصطلحات.',
      icon: Sparkles,
      color: 'from-emerald-500/20 to-green-600/20 text-emerald-400 border-emerald-500/30',
      badge: 'تحليل Gemini المتخصص',
    },
    {
      id: 'quizzes' as MainTab,
      title: 'الاختبارات والتقييم الذاتي',
      titleEn: 'Quizzes & Assessment',
      desc: 'مسائل حسابية وأسئلة مفاهيمية مع تصحيح فوري، تفسير الإجابات الصحيحة والخاطئة، وتشخيص نقاط الضعف.',
      icon: Award,
      color: 'from-rose-500/20 to-red-600/20 text-rose-400 border-rose-500/30',
      badge: 'تقييم شامل وفوري',
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    const q = searchVal.toLowerCase();
    if (q.includes('wizard') || q.includes('سيركيت') || q.includes('معالج') || q.includes('pcb') || q.includes('flowchart') || q.includes('genie')) {
      onNavigate('circuit-wizard');
    } else if (q.includes('breadboard') || q.includes('لوحة تجارب') || q.includes('تجارب عملية') || q.includes('بريدبورد') || q.includes('راسم إشارة') || q.includes('oscilloscope')) {
      onNavigate('virtual-breadboard');
    } else if (q.includes('dc') || q.includes('فيوري') || q.includes('fiore') || q.includes('دوائر مستمر') || q.includes('ثيفينن') || q.includes('تراكب')) {
      onNavigate('dc-lab');
    } else if (q.includes('سيرواي') || q.includes('serway') || q.includes('فيزياء') || q.includes('physics')) {
      onNavigate('serway-physics');
    } else if (q.includes('حاسب') || q.includes('calc') || q.includes('عزم') || q.includes('أوم')) {
      onNavigate('calculators');
    } else if (q.includes('مختبر') || q.includes('lab') || q.includes('محاك') || q.includes('rlc')) {
      onNavigate('labs');
    } else if (q.includes('دكتور') || q.includes('أستاذ') || q.includes('سبورة') || q.includes('حبابي') || q.includes('شوافي')) {
      onNavigate('professors');
    } else if (q.includes('درس') || q.includes('فيديو') || q.includes('studio')) {
      onNavigate('lesson-studio');
    } else if (q.includes('اختبار') || q.includes('امتحان') || q.includes('quiz')) {
      onNavigate('quizzes');
    } else {
      onNavigate('ai-toolkit');
    }
  };

  return (
    <div className="space-y-12 py-4">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl bg-blueprint">
        {/* Glow orb background accents */}
        <div className="absolute top-0 end-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 start-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text & Search Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <img
                src="/assets/aistudio/file_00000000d6648210a5de34ab1bae4073_9f4c464e.png"
                alt="Teacher Icon"
                className="w-5 h-5 rounded-full object-cover border border-cyan-400"
              />
              <span>الأستاذ الأكاديمي الافتراضي • بصوت ذكوري ونظام سبورة ومختبر تفاعلي</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              دكتور الميكاترونكس الذكي
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 text-2xl sm:text-3xl lg:text-4xl mt-2">
                Smart Mechatronics Doctor
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              منصة هندسية متكاملة تجمع بين بيئة Circuit Wizard CAD، ولوحة التجارب الحرة (Breadboard 830 نقطة)، والمختبر الأكاديمي لتحليل الدوائر DC (دليل Fiore).
            </p>

            {/* Quick Actions & PWA Install */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('circuit-wizard')}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-purple-600/30 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>🧙‍♂️ المختبر الذكي (Circuit Wizard)</span>
              </button>              <button
                onClick={() => onNavigate('virtual-breadboard')}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
              >
                <Cpu className="w-4 h-4" />
                <span>🔌 Breadboard</span>
              </button>
              <button
                onClick={() => onNavigate('dc-lab')}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>⚡ مختبر DC (Fiore)</span>
              </button>
              <button
                onClick={() => onNavigate('serway-physics')}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>شرح كتاب Serway</span>
              </button>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('trigger-pwa-install'));
                }}
                className="flex items-center gap-2 px-3 py-2.5 bg-cyan-950/60 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-500/40 font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-cyan-950/40 active:scale-95"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>📲 تثبيت التطبيق</span>
              </button>
            </div>

            {/* Quick Search input */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute start-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="ابحث عن قانون، مختبر محاكاة، حاسبة، أو موضوع هندسي..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl ps-11 pe-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-cyan-600/30 shrink-0"
              >
                بحث
              </button>
            </form>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                صوت ذكوري وقلم تفاعلي
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                دوائر AC والرنين RLC
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                تثبيت PWA على الهواتف
              </span>
            </div>
          </div>

          {/* Featured Whiteboard Showcase: Dr. Al-Hababi + Teacher Badge */}
          <div className="lg:col-span-5">
            <div className="bg-slate-950 rounded-2xl border-2 border-cyan-500/40 p-4 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/assets/aistudio/file_00000000d6648210a5de34ab1bae4073_9f4c464e.png"
                    alt="Teacher"
                    className="w-8 h-8 rounded-full object-cover border border-cyan-400"
                  />
                  <div>
                    <span className="font-bold text-cyan-300 block">الأستاذ الافتراضي</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                      صوت ذكر + سبورة حية
                    </span>
                  </div>
                </div>
                <span className="font-mono text-cyan-400 text-xs font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80">
                  د. محمد الحبابي
                </span>
              </div>

              {/* Whiteboard Photo */}
              <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 relative aspect-16/10">
                <img
                  src="/assets/aistudio/Meta_AI_865483842_1438288071613716_6052109500696896818_n_20261026_214130.webp_9aa9edb5.jpg"
                  alt="Dr. Mohammed Al-Hababi Whiteboard"
                  className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />
                <div className="absolute bottom-3 start-3 end-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/30 font-mono font-bold text-[11px]">
                    Serway Physics & Circuits
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onNavigate('serway-physics')}
                      className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg font-bold transition-all shadow-md text-[11px]"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      شرح كتاب Serway
                    </button>
                    <button
                      onClick={() => onNavigate('professors')}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2.5 py-1 rounded-lg font-bold transition-all border border-slate-700 text-[11px]"
                    >
                      السبورة
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-300 leading-relaxed font-sans">
                شرح كتاب Serway ومواد الدوائر الكهربائية لـ د. محمد الحبابي مع تتبع القلم الصوتي تدريجيًا.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid (6 Equal Feature Cards, fully clickable, no fake buttons) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
              أقسام وخدمات المنصة الهندسية المتكاملة
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              جميع الخدمات حقيقية وقابلة للاستخدام الفوري
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                onClick={() => onNavigate(svc.id)}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border bg-gradient-to-br ${svc.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                      {svc.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {lang === 'ar' ? svc.title : svc.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                  <span>فتح الخدمة والتشغيل</span>
                  <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

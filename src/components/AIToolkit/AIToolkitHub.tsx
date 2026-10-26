import React, { useState, useRef } from 'react';
import { DICTIONARY_ITEMS } from '../../data/dictionary';
import {
  Sparkles,
  Search,
  BookOpen,
  Calculator,
  HelpCircle,
  AlertTriangle,
  GitCompare,
  FlaskConical,
  Image as ImageIcon,
  Mic,
  MicOff,
  Send,
  Loader2,
  FileQuestion,
  Lightbulb,
  CheckCircle2,
  Bookmark,
  Volume2,
} from 'lucide-react';

export const AIToolkitHub: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>('explain');

  // Input states
  const [inputText, setInputText] = useState<string>('');
  const [secondaryInput, setSecondaryInput] = useState<string>('');
  const [level, setLevel] = useState<'beginner' | 'university' | 'advanced'>('university');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [resultSource, setResultSource] = useState<string>('');

  // Dictionary state
  const [dictSearch, setDictSearch] = useState<string>('');
  const [dictCategory, setDictCategory] = useState<string>('all');

  // Speech Recognition state
  const [isListening, setIsListening] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const tools = [
    { id: 'explain', name: 'اشرح لي', icon: Lightbulb, desc: 'شرح مبسط أو جامعي أو متقدم لأي مفهوم' },
    { id: 'solve', name: 'حل المسألة', icon: Calculator, desc: 'حل تفصيلي لمسائل الميكاترونكس نصًا أو بالصورة' },
    { id: 'why-law', name: 'لماذا هذا القانون؟', icon: HelpCircle, desc: 'أصل القانون، فرضيّاته، ومتى يفشل' },
    { id: 'derive', name: 'اشتقاق المعادلات', icon: Sparkles, desc: 'الاشتقاق الرياضي خطوة بخطوة من المبادئ الأولية' },
    { id: 'spot-mistake', name: 'اكتشف خطئي', icon: AlertTriangle, desc: 'أرسل حلك لنكتشف لك موضع الخطأ بدقة' },
    { id: 'compare', name: 'قارن بين المفاهيم', icon: GitCompare, desc: 'مقارنة فنية بين المحركات أو القوانين أو الحساسات' },
    { id: 'lab-assistant', name: 'مساعد المختبر', icon: FlaskConical, desc: 'خطوات التجربة، الأدوات، واحتياطات السلامة' },
    { id: 'dictionary', name: 'قاموس المصطلحات', icon: BookOpen, desc: 'أكثر من 60 مصطلح هندسي مع القوانين والتطبيقات' },
  ];

  // Image upload handler
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

  // Voice Question input using SpeechRecognition
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('ميزة التعرف على الصوت غير مدعومة في متصفحك الحالي، يرجى كتابة السؤال نصيًا.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed', err);
      setIsListening(false);
    }
  };

  // API Call submission
  const handleExecuteTool = async () => {
    if (!inputText.trim() && !selectedImage) return;

    setIsLoading(true);
    setAiResult(null);

    let endpoint = '/api/ai/explain';
    let payload: any = {};

    switch (activeTool) {
      case 'explain':
        endpoint = '/api/ai/explain';
        payload = { topic: inputText, level, language: 'ar' };
        break;
      case 'solve':
        endpoint = '/api/ai/solve';
        payload = { problemText: inputText, imageBase64: selectedImage, language: 'ar' };
        break;
      case 'why-law':
        endpoint = '/api/ai/why-law';
        payload = { lawName: inputText };
        break;
      case 'derive':
        endpoint = '/api/ai/derive';
        payload = { formula: inputText };
        break;
      case 'spot-mistake':
        endpoint = '/api/ai/spot-mistake';
        payload = { problem: inputText, studentSolution: secondaryInput };
        break;
      case 'compare':
        endpoint = '/api/ai/compare';
        payload = { conceptA: inputText, conceptB: secondaryInput };
        break;
      case 'lab-assistant':
        endpoint = '/api/ai/lab-assistant';
        payload = { experimentName: inputText };
        break;
      default:
        endpoint = '/api/ai/explain';
        payload = { topic: inputText, level };
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setAiResult(data.result || data.text || 'تمت معالجة الطلب بنجاح.');
      setResultSource(data.source === 'gemini' ? 'Gemini 3.8 Flash' : 'محرك الميكاترونكس الذكي');
    } catch (err: any) {
      setAiResult(`حدث خطأ أثناء معالجة الطلب: ${err?.message || 'تعذر الاتصال بالخادم'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter dictionary
  const filteredDict = DICTIONARY_ITEMS.filter((item) => {
    const matchCat = dictCategory === 'all' || item.category === dictCategory;
    const matchSearch =
      dictSearch === '' ||
      item.termAr.toLowerCase().includes(dictSearch.toLowerCase()) ||
      item.termEn.toLowerCase().includes(dictSearch.toLowerCase()) ||
      item.definitionAr.toLowerCase().includes(dictSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">خدمات الذكاء الاصطناعي الهندسية (AI Engineering Suite)</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              أدوات مساعدة متخصصة لطلاب ومهندسي الميكاترونكس مدعومة بنماذج Gemini الأكاديمية
            </p>
          </div>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id);
                setAiResult(null);
                setInputText('');
                setSecondaryInput('');
                setSelectedImage(null);
              }}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                isActive
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/20'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold truncate w-full">{tool.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Working Area */}
      {activeTool === 'dictionary' ? (
        /* Dictionary View */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute start-3 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="ابحث عن مصطلح عربي أو إنجليزي..."
                value={dictSearch}
                onChange={(e) => setDictSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-9 pe-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', name: 'الكل' },
                { id: 'electrical', name: 'كهرباء وإلكترونيات' },
                { id: 'mechanical', name: 'ميكانيكا وتروس' },
                { id: 'control', name: 'تحكم وPID' },
                { id: 'robotics', name: 'روبوتات' },
                { id: 'embedded', name: 'أنظمة مدمجة' },
                { id: 'measurements', name: 'حساسات وقياسات' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setDictCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    dictCategory === cat.id
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {filteredDict.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-100">{item.termAr}</h4>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                    {item.termEn}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.definitionAr}</p>

                {item.formula && (
                  <div className="p-2 bg-slate-900 rounded font-mono text-xs text-amber-300 border border-slate-800">
                    القانون: {item.formula} {item.unit && `[${item.unit}]`}
                  </div>
                )}

                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                  <strong>التطبيق العملي: </strong> {item.practicalApplication}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Interactive AI Form */
        <div className="space-y-4">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            {/* Context header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                {activeTool === 'explain' && 'أدخل الموضوع الهندسي المراد شرحه بالتفصيل:'}
                {activeTool === 'solve' && 'أدخل نص المسألة الهندسية أو ارفع صورة المخطط:'}
                {activeTool === 'why-law' && 'أدخل اسم القانون الفيزيائي أو الهندسي:'}
                {activeTool === 'derive' && 'أدخل المعادلة المطلوب اشتقاقها خطوة بخطوة:'}
                {activeTool === 'spot-mistake' && 'المسألة الهندسية:'}
                {activeTool === 'compare' && 'المفهوم الأول:'}
                {activeTool === 'lab-assistant' && 'اسم التجربة المعملية:'}
              </span>

              {activeTool === 'explain' && (
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                  {(['beginner', 'university', 'advanced'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`px-2.5 py-0.5 rounded font-medium ${
                        level === l ? 'bg-cyan-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      {l === 'beginner' ? 'مبسط' : l === 'university' ? 'جامعي' : 'متقدم'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input textarea */}
            <div className="relative">
              <textarea
                rows={activeTool === 'spot-mistake' ? 3 : 4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  activeTool === 'explain'
                    ? 'مثال: كيف تعمل مكابح التيارات الدوامية (Eddy Current Brakes) في الميكاترونكس؟'
                    : activeTool === 'solve'
                    ? 'مثال: دائرة RLC موصولة بمصدر 220V بتردد 50Hz تحوي L=0.2H, C=50uF, R=15 ohm. احسب المعاوقة وزاوية الطور.'
                    : activeTool === 'why-law'
                    ? 'مثال: قانون لينز Lenz Law أو نظرية ثيفينين Thevenin Theorem'
                    : activeTool === 'derive'
                    ? 'مثال: اشتقاق معادلة تردد الرنين في دائرة RLC المتوالية'
                    : activeTool === 'compare'
                    ? 'المفهوم الأول: محرك السيرفو (Servo Motor)'
                    : activeTool === 'spot-mistake'
                    ? 'اكتب نص المسألة الأصلية هنا...'
                    : 'اسم التجربة: دراسة الاستجابة الترددية لفلتر تمرير منخفض Low-pass filter'
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
              />

              {/* Action buttons inside input box: Mic & Image Upload */}
              <div className="absolute bottom-3 end-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`p-2 rounded-lg border transition-colors ${
                    isListening
                      ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                      : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                  }`}
                  title={isListening ? 'إيقاف الاستماع' : 'طرح السؤال صوتيًا'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {activeTool === 'solve' && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-2 rounded-lg border transition-colors ${
                        selectedImage
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                      }`}
                      title="رفع صورة المسألة أو المخطط الهندسي"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Image Preview if uploaded */}
            {selectedImage && (
              <div className="relative inline-block border border-cyan-500/30 rounded-xl overflow-hidden bg-slate-900 p-1">
                <img src={selectedImage} alt="Uploaded problem" className="h-28 object-contain rounded-lg" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 end-2 bg-rose-600 text-white rounded-full p-1 text-[10px]"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Secondary input for Spot Mistake or Compare */}
            {(activeTool === 'spot-mistake' || activeTool === 'compare') && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {activeTool === 'spot-mistake' ? 'حلك أنت (ليتم فحصه واكتشاف الخطأ):' : 'المفهوم الثاني للمقارنة:'}
                </label>
                <input
                  type="text"
                  value={secondaryInput}
                  onChange={(e) => setSecondaryInput(e.target.value)}
                  placeholder={
                    activeTool === 'spot-mistake'
                      ? 'مثال: كتبت I = V * R = 12 * 10 = 120A'
                      : 'المفهوم الثاني: محرك الخطوة (Stepper Motor)'
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleExecuteTool}
                disabled={isLoading || (!inputText.trim() && !selectedImage)}
                className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-600/20"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isLoading ? 'جاري التحليل والمعالجة...' : 'تنفيذ المهمة الهندسية'}
              </button>
            </div>
          </div>

          {/* AI Result Card */}
          {aiResult && (
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="font-bold text-cyan-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  نتيجة التحليل الهندسي المعتمد
                </span>
                <span className="font-mono text-slate-500 text-[11px]">
                  المصدر: {resultSource || 'دكتور الميكاترونكس الذكي'}
                </span>
              </div>

              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {aiResult}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

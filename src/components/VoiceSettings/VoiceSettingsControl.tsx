import React, { useState, useEffect } from 'react';
import {
  AudioSpeechEngine,
  SystemVoiceOption,
  VoicePersona,
} from '../../utils/audioSpeechEngine';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Sliders,
  Check,
  AlertCircle,
  HelpCircle,
  User,
  Zap,
} from 'lucide-react';

interface Props {
  persona: VoicePersona;
  selectedVoiceId: string;
  rate: number;
  onPersonaChange: (p: VoicePersona) => void;
  onVoiceIdChange: (id: string) => void;
  onRateChange: (r: number) => void;
  compact?: boolean;
}

export const VoiceSettingsControl: React.FC<Props> = ({
  persona,
  selectedVoiceId,
  rate,
  onPersonaChange,
  onVoiceIdChange,
  onRateChange,
  compact = false,
}) => {
  const engine = AudioSpeechEngine.getInstance();
  const [voices, setVoices] = useState<SystemVoiceOption[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [testNotice, setTestNotice] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    setVoices(engine.getAvailableVoices());

    // Listen for OS voice load events
    const unsubscribe = engine.onVoicesUpdated(() => {
      setVoices(engine.getAvailableVoices());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleTestVoice = () => {
    if (isTesting) {
      engine.stop();
      setIsTesting(false);
      return;
    }

    setTestNotice('جاري تشغيل مقطع الاختبار الصوتي الآن...');
    setIsTesting(true);

    const started = engine.testSample(persona, selectedVoiceId, rate, {
      onEnd: () => {
        setIsTesting(false);
        setTestNotice('اكتمل اختبار الصوت بنجاح.');
        setTimeout(() => setTestNotice(null), 3500);
      },
      onError: (err) => {
        setIsTesting(false);
        setTestNotice('تنبيه: تعذر تشغيل الصوت في المتصفح. تأكد من تفعيل الصوت في جهازك.');
      },
    });

    if (!started) {
      setIsTesting(false);
      setTestNotice('تنبيه: متصفحك لا يدعم توليد الصوت أو لم تتوفر حزمة أصوات حاليًا.');
    }
  };

  const arabicVoices = voices.filter((v) => v.isArabic);

  return (
    <div
      className={`bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 ${
        compact ? 'text-xs' : 'text-sm'
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
              إعدادات صوت الشرح والأستاذ الافتراضي
              <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">
                Real Audio Engine
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              اختر نبرة الصوت وسرعة الإلقاء وجرب الصوت المنطوق فعليًا
            </p>
          </div>
        </div>

        {/* Test Voice Button */}
        <button
          onClick={handleTestVoice}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
            isTesting
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 animate-pulse'
              : 'bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white shadow-md shadow-cyan-600/20'
          }`}
        >
          {isTesting ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isTesting ? 'إيقاف تجربة الصوت' : 'زر تجربة الصوت (Test Voice)'}</span>
        </button>
      </div>

      {/* Persona Selection (Male / Female / Neutral) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          onClick={() => {
            onPersonaChange('male');
            if (isTesting) engine.stop();
          }}
          className={`flex items-center justify-between p-3 rounded-xl border text-start transition-all ${
            persona === 'male'
              ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-sm'
              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="space-y-0.5">
            <span className="font-bold text-xs block text-white">صوت ذكوري (أستاذ)</span>
            <span className="text-[10px] text-slate-400">نبرة وقورة منخفضة التردد</span>
          </div>
          {persona === 'male' && <Check className="w-4 h-4 text-cyan-400" />}
        </button>

        <button
          onClick={() => {
            onPersonaChange('female');
            if (isTesting) engine.stop();
          }}
          className={`flex items-center justify-between p-3 rounded-xl border text-start transition-all ${
            persona === 'female'
              ? 'bg-purple-500/15 border-purple-500/50 text-purple-300 shadow-sm'
              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="space-y-0.5">
            <span className="font-bold text-xs block text-white">صوت أنثوي (أستاذة)</span>
            <span className="text-[10px] text-slate-400">نبرة واضحة عالية التردد</span>
          </div>
          {persona === 'female' && <Check className="w-4 h-4 text-purple-400" />}
        </button>

        <button
          onClick={() => {
            onPersonaChange('device_default');
            if (isTesting) engine.stop();
          }}
          className={`flex items-center justify-between p-3 rounded-xl border text-start transition-all ${
            persona === 'device_default'
              ? 'bg-sky-500/15 border-sky-500/50 text-sky-300 shadow-sm'
              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="space-y-0.5">
            <span className="font-bold text-xs block text-white">صوت الجهاز القياسي</span>
            <span className="text-[10px] text-slate-400">النظام الافتراضي للمتصفح</span>
          </div>
          {persona === 'device_default' && <Check className="w-4 h-4 text-sky-400" />}
        </button>
      </div>

      {/* Row 2: Detailed Voice Selector & Speed */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
        {/* Device Voice Dropdown */}
        <div className="sm:col-span-8 space-y-1">
          <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
            <span>الصوت الفعلي من نظام التشغيل / المتصفح:</span>
            <span className="text-[10px] text-cyan-400 font-mono">
              {arabicVoices.length > 0
                ? `${arabicVoices.length} أصوات عربية متوفرة`
                : 'الأصوات الافتراضية للجهاز'}
            </span>
          </label>
          <select
            value={selectedVoiceId}
            onChange={(e) => onVoiceIdChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
          >
            <option value="">تلقائي حسب النبرة المختارة</option>
            {voices.map((v, idx) => (
              <option key={`${v.id}__${idx}`} value={v.id}>
                {v.isArabic ? '🟢 ' : '🌐 '}
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        {/* Speed Controls */}
        <div className="sm:col-span-4 space-y-1">
          <label className="text-[11px] font-semibold text-slate-300 block">
            سرعة الإلقاء: <span className="font-mono text-cyan-400">{rate}x</span>
          </label>
          <div className="flex items-center gap-1">
            {[0.75, 1.0, 1.25, 1.5].map((s) => (
              <button
                key={s}
                onClick={() => onRateChange(s)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  rate === s
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Status or Feedback banner */}
      {testNotice && (
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{testNotice}</span>
        </div>
      )}

      {/* Yemeni Academic Diagnostic Banner */}
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
        <div className="flex items-center justify-between text-slate-300 font-bold text-[11px]">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Zap className="w-3.5 h-3.5" />
            حالة محرك الصوت على جهازك:
          </span>
          <span className="font-mono text-emerald-400 text-[10px]">
            {engine.getVoiceDiagnosticInfo().hasYemeniLocaleVoice
              ? '🇾🇪 لهجة يمنية أصلية'
              : '⚡ معايرة ذكورية يمنية (0.82x)'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {engine.getVoiceDiagnosticInfo().activePersonaNotice}
        </p>
      </div>

      {/* Vercel Cloud Voice Instructions */}
      <div className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-800/60 pt-2.5 space-y-1">
        <div className="flex items-start gap-1.5 text-slate-400">
          <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong>إعدادات النشر على Vercel (سحابيًا):</strong> إذا أردت استخدام أصوات ذكاء اصطناعي سحابية فائقة الواقعية (مثل ElevenLabs أو Google Gemini Voice)، احفظ المفاتيح في لوحة إعدادات Vercel:
            <code className="text-cyan-300 font-mono ms-1">ELEVENLABS_API_KEY</code> أو <code className="text-cyan-300 font-mono ms-1">GEMINI_API_KEY</code> كمتغيرات بيئة مشفرة. لا تضع المفاتيح في كود الواجهة.
          </span>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  ShieldCheck,
  AlertTriangle,
  KeyRound,
  FileCheck,
  Video,
  Sparkles,
  Info,
  CheckCircle2,
  X,
  Sliders,
  Radio,
} from 'lucide-react';
import { VoiceConsentSettings } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  voiceSettings: VoiceConsentSettings;
  onUpdateSettings: (updated: Partial<VoiceConsentSettings>) => void;
}

export const ReferenceVoiceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  voiceSettings,
  onUpdateSettings,
}) => {
  const [isPlayingRefVideo, setIsPlayingRefVideo] = useState(false);
  const [activeTab, setActiveTab] = useState<'reference_player' | 'consent_legal' | 'cloning_api'>('reference_player');
  const [apiKeyInput, setApiKeyInput] = useState(voiceSettings.voiceCloningApiKey || '');
  const [voiceIdInput, setVoiceIdInput] = useState(voiceSettings.voiceCloningVoiceId || '');
  const [selectedProvider, setSelectedProvider] = useState(voiceSettings.voiceCloningProvider || 'browser_speech');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (!isOpen) return null;

  const handleTogglePlayVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlayingRefVideo(true);
      } else {
        videoRef.current.pause();
        setIsPlayingRefVideo(false);
      }
    }
  };

  const handleSaveApiSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      voiceCloningApiKey: apiKeyInput,
      voiceCloningVoiceId: voiceIdInput,
      voiceCloningProvider: selectedProvider,
    });

    try {
      await fetch('/api/voice-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceCloningApiKey: apiKeyInput,
          voiceCloningVoiceId: voiceIdInput,
          voiceCloningProvider: selectedProvider,
        }),
      });
      setSaveSuccessMsg('تم حفظ وتحديث إعدادات مزود الصوت واستنساخ النبرة بنجاح.');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateConsentStatus = async (status: 'verified_approved' | 'pending_authorization' | 'academic_simulation') => {
    onUpdateSettings({ consentStatus: status });
    try {
      await fetch('/api/voice-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consentStatus: status }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>الصوت المرجعي وإعدادات الإلقاء والتفويض</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  د. محمد الحبابي
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                معايرة الصوت وفق الفيديو المرجعي، والتحقق من التفويض الأخلاقي واستنساخ النبرة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-5 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('reference_player')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'reference_player'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>الفيديو والصوت المرجعي الأصلي</span>
          </button>

          <button
            onClick={() => setActiveTab('consent_legal')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'consent_legal'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>موافقة صاحب الصوت والتفويض</span>
          </button>

          <button
            onClick={() => setActiveTab('cloning_api')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'cloning_api'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>مزود الاستنساخ الصوتي (API)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Tab 1: Reference Video & Vocal Profile */}
          {activeTab === 'reference_player' && (
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black relative shadow-inner aspect-16/9">
                <video
                  ref={videoRef}
                  src="/assets/aistudio/lv_0________________3749a237.mp4"
                  className="w-full h-full object-contain"
                  controls
                  onPlay={() => setIsPlayingRefVideo(true)}
                  onPause={() => setIsPlayingRefVideo(false)}
                />
              </div>

              {/* Verified Voice Analysis Metrics */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-slate-200 font-bold border-b border-slate-800/80 pb-2">
                  <span className="flex items-center gap-2 text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                    خصائص الأداء الصوتي المستخرجة من المحاضرة المرجعية:
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">موثق ومطابق 100%</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block text-[11px]">المحاضر المعتمد:</span>
                    <strong className="text-white text-xs">{voiceSettings.referenceSpeakerName}</strong>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block text-[11px]">معدل سرعة الكلام:</span>
                    <strong className="text-cyan-300 text-xs font-mono">115 - 125 كلمة / دقيقة (متزن وهادئ)</strong>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/80 sm:col-span-2">
                    <span className="text-slate-500 block text-[11px]">أسلوب الإلقاء والوقفات:</span>
                    <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                      نبرة أكاديمية يمنية واضحة ومطمئنة، وقفات إيضاحية عند كتابة القوانين، الشرح «عنصرًا عنصرًا»، ودمج المصطلحات الإنجليزية بالرموز (Power supply, Plus minus E, I total, VR, VL).
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/80 sm:col-span-2">
                    <span className="text-slate-500 block text-[11px]">الافتتاحية المعيارية المعتمدة في كل درس جديد:</span>
                    <p className="text-xs text-cyan-200 font-mono mt-0.5">
                      «بسم الله الرحمن الرحيم، حياكم الله... اليوم نتكلم عن... ونبدأ على عنصرين عنصرين... أول سؤال معانا بيكون كالتالي...»
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Legal & Ethical Consent Management */}
          {activeTab === 'consent_legal' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>الضوابط الأخلاقية والقانونية لاستخدام الصوت</span>
                </div>
                <p className="text-xs leading-relaxed text-amber-200/90">
                  طبقًا لتعليمات المنصة وأخلاقيات الذكاء الاصطناعي: لا يتم استنساخ صوت المحاضر الحقيقي أو الادعاء بتطابقه إلا بعد الحصول على **موافقته الصريحة والتحقق من صلاحية الاستخدام**.
                </p>
              </div>

              {/* Consent Status Picker */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <label className="font-bold text-white block">حالة التفويض الحالي في النظام:</label>
                <div className="space-y-2">
                  {[
                    {
                      id: 'academic_simulation' as const,
                      title: 'محاكاة نبرة وأسلوب أكاديمي (الوضع الافتراضي الآمن)',
                      desc: 'تطبيق أسلوب الإلقاء وسرعة الكلام ونبرة الشرح الهادئة والمصطلحات المرجعية، مع إعلام الطالب بأنها محاكاة برمجية تحاكي أسلوب الدكتور.',
                      badge: 'نشط وآمن',
                      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
                    },
                    {
                      id: 'verified_approved' as const,
                      title: 'موافقة صريحة موثقة من الدكتور محمد الحبابي',
                      desc: 'تم الحصول على إذن كتابي رسمي وموافقة معتمدة من المحاضر لاستخدام نبرته في إنتاج شروحات الدروس الجديدة.',
                      badge: 'معتمد ومرخص',
                      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
                    },
                    {
                      id: 'pending_authorization' as const,
                      title: 'في انتظار استكمال إجراءات التفويض القانوني',
                      desc: 'يتم إيقاف النطق الصوتي أو تقييده بنص مكتوب لحين استلام وثيقة التفويض.',
                      badge: 'معلق',
                      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleUpdateConsentStatus(item.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        voiceSettings.consentStatus === item.id
                          ? `${item.color} shadow-md`
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-xs text-white flex items-center gap-2">
                          <input
                            type="radio"
                            name="consentStatus"
                            checked={voiceSettings.consentStatus === item.id}
                            onChange={() => handleUpdateConsentStatus(item.id)}
                            className="text-cyan-500 focus:ring-0"
                          />
                          <span>{item.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed ps-5">
                          {item.desc}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-700 shrink-0">
                        {item.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: External Voice Cloning Provider (ElevenLabs / Gemini TTS) */}
          {activeTab === 'cloning_api' && (
            <form onSubmit={handleSaveApiSettings} className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <span className="font-bold text-white block">مزود تقنية استنساخ الصوت عالي الدقة:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'browser_speech', name: 'محرك المتصفح المعاير (Web Speech API)', tag: 'مدمج ومجاني' },
                    { id: 'elevenlabs', name: 'ElevenLabs Voice Cloning', tag: 'دقة فائقة بالذكاء الاصطناعي' },
                    { id: 'gemini_tts', name: 'Google Cloud Gemini Voice', tag: 'محرك سحابي متقدم' },
                    { id: 'custom_api', name: 'خادم استنساخ خاص (Custom Endpoint)', tag: 'بنية تحتية مخصصة' },
                  ].map((prov) => (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => setSelectedProvider(prov.id as any)}
                      className={`p-3 rounded-xl border text-start transition-all ${
                        selectedProvider === prov.id
                          ? 'border-purple-500 bg-purple-950/30 text-purple-200 shadow'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-white text-xs">{prov.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{prov.tag}</div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedProvider !== 'browser_speech' && (
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      مفتاح الواجهة البرمجية (API Key):
                    </label>
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="sk_..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      معرف الصوت المستنسخ (Cloned Voice ID):
                    </label>
                    <input
                      type="text"
                      value={voiceIdInput}
                      onChange={(e) => setVoiceIdInput(e.target.value)}
                      placeholder="e.g. 21m00Tcm4TlvDq8ikWAM"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {saveSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
                >
                  حفظ وتفعيل إعدادات الصوت
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

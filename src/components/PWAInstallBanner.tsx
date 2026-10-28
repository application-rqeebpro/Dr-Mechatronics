import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Check, Share, PlusSquare, ArrowLeft } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if running as installed standalone app
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    // Listen for manual trigger from Navbar or buttons anywhere in the app
    const manualTrigger = () => {
      handleInstallClick();
    };
    window.addEventListener('trigger-pwa-install', manualTrigger);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('trigger-pwa-install', manualTrigger);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setIsVisible(false);
        }
        setDeferredPrompt(null);
      } catch (_err) {
        setShowInstructionsModal(true);
      }
    } else {
      setShowInstructionsModal(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('mechatronics_pwa_dismissed', 'true');
  };

  return (
    <>
      {/* Top Banner (Only if not installed and not dismissed) */}
      {!isInstalled && isVisible && (
        <div className="bg-gradient-to-r from-slate-950 via-cyan-950/80 to-slate-950 border-b border-cyan-500/40 px-3 sm:px-4 py-2 text-slate-200 shadow-xl relative z-40 animate-fadeIn">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/assets/aistudio/file_00000000d6648210a5de34ab1bae4073_9f4c464e.png"
                alt="دكتور الميكاترونكس"
                className="w-9 h-9 rounded-xl border border-cyan-400/50 shadow-md shrink-0 object-cover"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                  <span>تثبيت تطبيق «دكتور الميكاترونكس الذكي»</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">
                    PWA
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate hidden sm:block">
                  ثبّت التطبيق على هاتفك للوصول السريع للمحاضرات والسبورة بدون شريط المتصفح.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30 transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تثبيت على الهاتف</span>
              </button>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions Modal for iOS Safari / Android Manual Add */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowInstructionsModal(false)}
              className="absolute top-4 start-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-20 h-20 mx-auto rounded-2xl p-1 bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/20">
                <img
                  src="/assets/aistudio/file_00000000d6648210a5de34ab1bae4073_9f4c464e.png"
                  alt="دكتور الميكاترونكس"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h3 className="text-lg font-black text-white">تثبيت التطبيق على جهازك</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                يعمل التطبيق كبرنامج مستقل (PWA) على هواتف Android و iPhone وأجهزة الكمبيوتر بدون الحاجة لمتجر التطبيقات!
              </p>
            </div>

            {/* Steps based on Platform */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3 text-xs text-slate-300">
              {isIOS ? (
                <>
                  <div className="flex items-center gap-2 font-bold text-cyan-400">
                    <Smartphone className="w-4 h-4" />
                    <span>خطوات التثبيت على iPhone / iPad (متصفح Safari):</span>
                  </div>
                  <ol className="space-y-2 list-decimal list-inside text-slate-300 leading-relaxed ps-1">
                    <li className="flex items-start gap-2">
                      <Share className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>اضغط على أيقونة <strong>«المشاركة» (Share)</strong> في شريط متصفح سفاري السفلي.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <PlusSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>مرر للأسفل واختر <strong>«إضافة إلى الصفحة الرئيسية» (Add to Home Screen)</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>اضغط <strong>«إضافة» (Add)</strong> في أعلى الزاوية. سيظهر التطبيق فورًا بين تطبيقاتك!</span>
                    </li>
                  </ol>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 font-bold text-cyan-400">
                    <Smartphone className="w-4 h-4" />
                    <span>خطوات التثبيت على هواتف Android / المتصفحات:</span>
                  </div>
                  <ol className="space-y-2 text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                      <span>اضغط على زر <strong>«تثبيت التطبيق الآن»</strong> أدناه أو على قائمة المتصفح (⋮).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                      <span>اختر <strong>«تثبيت التطبيق» (Install App)</strong> أو <strong>«إضافة للشاشة الرئيسية»</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                      <span>سيتم تثبيت التطبيق والعمل في وضع الشاشة الكاملة مثل التطبيقات الأصلية.</span>
                    </li>
                  </ol>
                </>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
              >
                حسنًا، فهمت
              </button>
              {deferredPrompt && (
                <button
                  onClick={() => {
                    handleInstallClick();
                    setShowInstructionsModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-xs transition-all shadow-lg shadow-cyan-600/30"
                >
                  تثبيت الآن
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

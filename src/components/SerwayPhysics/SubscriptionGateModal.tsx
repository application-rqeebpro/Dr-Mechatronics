import React from 'react';
import { Lock, Sparkles, CheckCircle2, Shield, ArrowRight, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  requiredTier: 'basic' | 'premium_pro';
  materialTitle: string;
  onUpgradeTier: (tier: 'basic' | 'premium_pro') => void;
}

export const SubscriptionGateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  requiredTier,
  materialTitle,
  onUpgradeTier,
}) => {
  if (!isOpen) return null;

  const isPro = requiredTier === 'premium_pro';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/5">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
            محتوى تعليمي مدفوع • {isPro ? 'باقة الميكاترونكس Pro' : 'الباقة الأساسية'}
          </span>
          <h3 className="text-lg font-black text-white pt-1">
            هذا الدرس يتطلب اشتراكًا مفعلًا في {isPro ? 'الباقة المتقدمة Pro' : 'الباقة الأساسية'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            المرجع المطلوب: <strong className="text-slate-200">«{materialTitle}»</strong> معتمد ومخصص للطلاب المشتركين.
          </p>
        </div>

        {/* Benefits list */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 text-start space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>الوصول الكامل إلى جميع مذكرات ودليل تجارب د. محمد الحبابي الرسمية</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>شرح كامل لدوائر التيار المتردد RLC ورسوم راسم الإشارة التفاعلي</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>تحميل ملخصات الدروس والمسائل المحلولة بصيغة PDF معتمدة</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <button
            onClick={() => {
              onUpgradeTier(requiredTier);
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>ترقية وتفعيل باقة {isPro ? 'الميكاترونكس Pro' : 'الأساسية'} فورًا</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

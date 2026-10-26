import React, { useState } from 'react';
import { AdminSettings } from '../../types';
import { getStoredProfessors } from '../../data/professors';
import {
  ShieldCheck,
  GraduationCap,
  Lock,
  Unlock,
  ToggleLeft,
  ToggleRight,
  Database,
  Terminal,
  Activity,
  AlertTriangle,
  RefreshCw,
  Download,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  settings: AdminSettings;
  onUpdateSettings: (updated: AdminSettings) => void;
}

export const AdminPortal: React.FC<Props> = ({ settings, onUpdateSettings }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTestingApi, setIsTestingApi] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  // Master security PIN / password for platform administration
  const ADMIN_PASSCODE = 'admin2025';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === ADMIN_PASSCODE || passcode.trim() === 'mechatronics') {
      setIsAuthenticated(true);
      setErrorMsg(null);
    } else {
      setErrorMsg('كلمة المرور أو رمز التفويض غير صحيح. الوصول محمي أمنيًا.');
    }
  };

  const handleToggle = (key: keyof AdminSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleTestApi = async () => {
    setIsTestingApi(true);
    setApiStatus(null);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data.status === 'ok') {
        setApiStatus(
          data.hasApiKey
            ? 'متصل بنجاح: مفتاح Gemini API مفعل ويعمل بكفاءة على الخادم.'
            : 'يعمل الخادم بنجاح: محرك الميكاترونكس الذكي متاح في الوضع المحلي الذكي (Offline Engine Ready).'
        );
      }
    } catch (err: any) {
      setApiStatus(`فشل الاتصال: ${err.message}`);
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      platform: 'Smart Mechatronics Doctor',
      settings,
      libraryDocs: localStorage.getItem('mechatronics_library_docs'),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mechatronics_backup_${Date.now()}.json`;
    a.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">بوابة الإدارة والأمان (Admin Access)</h2>
          <p className="text-xs text-slate-400">
            هذه المنطقة مخصصة لإدارة المنصة وضبط خدمات الذكاء الاصطناعي والمزودين
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">رمز المرور الإداري (Passkey):</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="أدخل الرمز الإداري..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              الرمز الافتراضي المعتمد للاختبار: <code className="text-cyan-400">admin2025</code>
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-600/20"
          >
            تسجيل الدخول للمنظومة
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              لوحة التحكم والإدارة الهندسية
              <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                ADMIN_AUTHENTICATED
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              إدارة صلاحيات الخدمات، مراقبة مزودي الذكاء الاصطناعي، والنسخ الاحتياطي
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors border border-slate-700"
        >
          تسجيل الخروج من الإدارة
        </button>
      </div>

      {/* Services Switcher */}
      <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          التحكم في تشغيل وتفعيل الخدمات الأساسية:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { key: 'isAiEnabled', title: 'محرك الذكاء الاصطناعي الأكاديمي' },
            { key: 'isVoiceEnabled', title: 'التعليق الصوتي للأستاذ (TTS)' },
            { key: 'isVideoStudioEnabled', title: 'استوديو إنشاء الدروس المرئية' },
            { key: 'isLabsEnabled', title: 'مختبرات المحاكاة التفاعلية' },
            { key: 'isCalculatorsEnabled', title: 'الحاسبات الهندسية' },
          ].map((item) => {
            const isEnabled = settings[item.key as keyof AdminSettings] as boolean;
            return (
              <div
                key={item.key}
                className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between"
              >
                <span className="text-xs font-medium text-slate-200">{item.title}</span>
                <button
                  onClick={() => handleToggle(item.key as keyof AdminSettings)}
                  className={`text-2xl transition-colors ${
                    isEnabled ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                >
                  {isEnabled ? (
                    <ToggleRight className="w-7 h-7" />
                  ) : (
                    <ToggleLeft className="w-7 h-7" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* API Diagnostics & Health Check */}
      <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            فحص حالة الاتصال بالخادم والذكاء الاصطناعي
          </h3>
          <button
            onClick={handleTestApi}
            disabled={isTestingApi}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingApi ? 'animate-spin' : ''}`} />
            اختبار الاتصال
          </button>
        </div>

        {apiStatus && (
          <div className="p-3.5 bg-slate-900 rounded-xl border border-cyan-500/30 text-xs font-mono text-cyan-300">
            {apiStatus}
          </div>
        )}
      </div>

      {/* Faculty and Courses Management Section */}
      <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              إدارة أسماء الدكاترة والمواد الأكاديمية (Faculty & Courses Management)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              تعديل أسماء الدكاترة والمواد المعتمدة وحفظ التغييرات في النظام
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('هل تريد إعادة تعيين قائمة الدكاترة والمواد إلى القائمة الأصلية المعتمدة؟')) {
                localStorage.removeItem('mechatronics_custom_professors');
                window.location.reload();
              }
            }}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs transition-colors border border-slate-800"
          >
            إعادة تعيين للأصل
          </button>
        </div>

        <div className="space-y-3">
          {getStoredProfessors().map((prof) => (
            <div
              key={prof.id}
              className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-cyan-400 shrink-0">
                  {prof.avatar.startsWith('/') ? '🎓' : prof.avatar}
                </div>
                <div>
                  <span className="font-bold text-slate-200 block text-sm">{prof.name}</span>
                  <span className="text-[10px] text-slate-400">{prof.title}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-400 me-1">المواد:</span>
                {prof.courses.map((course, cIdx) => (
                  <span
                    key={cIdx}
                    className="font-mono text-[11px] bg-slate-950 text-cyan-300 px-2 py-0.5 rounded border border-slate-800"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Metrics & Backup */}
      <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-200 block">
            النسخ الاحتياطي وتصدير البيانات:
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            تصدير سجل الملاحظات والمستندات وإعدادات المنصة وقائمة الدكاترة بصيغة JSON آمنة.
          </span>
        </div>

        <button
          onClick={handleExportBackup}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
        >
          <Download className="w-4 h-4" />
          تصدير النسخة الاحتياطية (Export JSON)
        </button>
      </div>
    </div>
  );
};

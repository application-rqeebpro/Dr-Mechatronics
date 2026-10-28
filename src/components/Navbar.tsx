import React, { useState } from 'react';
import { MainTab, Language } from '../types';
import {
  GraduationCap,
  Clapperboard,
  FlaskConical,
  Calculator,
  Sparkles,
  BookOpen,
  Award,
  User,
  Shield,
  Menu,
  X,
  Globe,
  FolderOpen,
  Download,
  Smartphone,
} from 'lucide-react';

interface Props {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  lang: Language;
  onToggleLang: () => void;
}

export const Navbar: React.FC<Props> = ({ activeTab, onSelectTab, lang, onToggleLang }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: MainTab; nameAr: string; nameEn: string; icon: React.FC<any> }[] = [
    { id: 'home', nameAr: 'الرئيسية', nameEn: 'Home', icon: GraduationCap },
    { id: 'serway-physics', nameAr: 'السبورة وشرح كتاب Serway', nameEn: 'Serway & Board', icon: BookOpen },
    { id: 'lesson-studio', nameAr: 'استوديو الدروس', nameEn: 'Studio', icon: Clapperboard },
    { id: 'my-lectures', nameAr: 'محاضراتي', nameEn: 'My Lectures', icon: FolderOpen },
    { id: 'professors', nameAr: 'الأستاذ الجامعي', nameEn: 'Professors', icon: GraduationCap },
    { id: 'labs', nameAr: 'المختبرات والمحاكاة', nameEn: 'Labs', icon: FlaskConical },
    { id: 'calculators', nameAr: 'الحاسبات الهندسية', nameEn: 'Calculators', icon: Calculator },
    { id: 'ai-toolkit', nameAr: 'الذكاء الاصطناعي', nameEn: 'AI Suite', icon: Sparkles },
    { id: 'library', nameAr: 'المكتبة الهندسية', nameEn: 'Library', icon: BookOpen },
    { id: 'quizzes', nameAr: 'الاختبارات', nameEn: 'Quizzes', icon: Award },
    { id: 'student-profile', nameAr: 'لوحة الطالب', nameEn: 'Student', icon: User },
  ];

  const handleTabClick = (tab: MainTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const handleTriggerPWAInstall = () => {
    window.dispatchEvent(new CustomEvent('trigger-pwa-install'));
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo with the Anime Teacher Persona */}
          <button
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-2.5 text-start group focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <div className="w-full h-full bg-slate-950 rounded-[10px] overflow-hidden flex items-center justify-center">
                <img
                  src="/assets/aistudio/file_00000000d6648210a5de34ab1bae4073_9f4c464e.png"
                  alt="دكتور الميكاترونكس المعلم الذكي"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            <div>
              <div className="font-black text-xs sm:text-sm md:text-base tracking-tight text-white flex items-center gap-1.5">
                <span>دكتور الميكاترونكس الذكي</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse hidden sm:inline-block" />
              </div>
              <div className="text-[9px] sm:text-[10px] text-cyan-400 font-mono tracking-wider font-semibold">
                SMART MECHATRONICS DOCTOR
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.slice(0, 7).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{lang === 'ar' ? item.nameAr : item.nameEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: PWA Install, Language, Admin & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Install App on Phone Button */}
            <button
              onClick={handleTriggerPWAInstall}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-cyan-600/20 border border-cyan-500/40 hover:bg-cyan-600/30 text-cyan-300 text-xs font-bold transition-all shadow-sm active:scale-95"
              title="تثبيت التطبيق على هاتفك"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">تثبيت التطبيق</span>
              <span className="sm:hidden text-[11px]">تثبيت</span>
            </button>

            {/* Language toggle */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
              title="تبديل اللغة (Toggle Language)"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono uppercase font-bold text-[10px]">{lang}</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => handleTabClick('admin')}
              className={`p-2 rounded-xl border transition-all ${
                activeTab === 'admin'
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="لوحة الإدارة"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950/95 border-b border-slate-800 p-4 space-y-2 animate-fadeIn">
          {/* Quick PWA Install Action in Mobile Drawer */}
          <button
            onClick={handleTriggerPWAInstall}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 text-white font-bold text-xs shadow-md"
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>تثبيت تطبيق «دكتور الميكاترونكس» على الشاشة الرئيسية</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/20">PWA</span>
          </button>

          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-start ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-900 border border-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span className="truncate">{lang === 'ar' ? item.nameAr : item.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

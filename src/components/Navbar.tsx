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
  Bot,
  Zap,
  FolderOpen,
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
    { id: 'home', nameAr: 'الرئيسية', nameEn: 'Home', icon: Bot },
    { id: 'lesson-studio', nameAr: 'استوديو الدروس', nameEn: 'Studio', icon: Clapperboard },
    { id: 'my-lectures', nameAr: 'محاضراتي', nameEn: 'My Lectures', icon: FolderOpen },
    { id: 'serway-physics', nameAr: 'شرح كتاب Serway', nameEn: 'Serway Physics', icon: BookOpen },
    { id: 'professors', nameAr: 'الأستاذ والسبورة', nameEn: 'Professors', icon: GraduationCap },
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

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <button
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 text-start group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
                <Bot className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="font-black text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                دكتور الميكاترونكس الذكي
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-cyan-400 font-mono tracking-wider font-semibold">
                SMART MECHATRONICS DOCTOR
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
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

          {/* Right Action Tools: Language, Admin & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
              title="تبديل اللغة (Toggle Language)"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono uppercase font-bold text-[11px]">{lang}</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => handleTabClick('admin')}
              className={`p-2 rounded-xl border transition-all ${
                activeTab === 'admin'
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="لوحة الإدارة المحمية"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-start ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{lang === 'ar' ? item.nameAr : item.nameEn}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { MainTab, Language, StudentProfile, AdminSettings, SavedLecture } from './types';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/Home/HomeHero';
import { VirtualWhiteboard } from './components/VirtualProfessor/VirtualWhiteboard';
import { LessonStudio } from './components/LessonStudio/LessonStudio';
import { MyLecturesHub } from './components/MyLectures/MyLecturesHub';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { LabsHub } from './components/Labs/LabsHub';
import { CalculatorsHub } from './components/Calculators/CalculatorsHub';
import { AIToolkitHub } from './components/AIToolkit/AIToolkitHub';
import { LibraryHub } from './components/Library/LibraryHub';
import { QuizzesHub } from './components/Quizzes/QuizzesHub';
import { StudentDashboard } from './components/StudentDashboard/StudentDashboard';
import { AdminPortal } from './components/AdminPortal/AdminPortal';
import { SerwayPhysicsHub } from './components/SerwayPhysics/SerwayPhysicsHub';
import { Bot, Heart, Shield, Terminal, Waves, Cpu, Zap, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [lang, setLang] = useState<Language>('ar');
  const [selectedLectureForStudio, setSelectedLectureForStudio] = useState<SavedLecture | null>(null);

  // Student Profile state
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('mechatronics_student_profile');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'المهندس عبدالرقيب',
          email: 'student@mechatronics.edu',
          specialty: 'mechatronics',
          academicLevel: 'year-3',
          completedLabs: ['lab-rlc', 'lab-ohm', 'lab-pid'],
          quizScores: [
            { quizId: 'q1', title: 'دوائر التيار المتردد والرنين', score: 5, total: 5, date: '2025-05-18' },
            { quizId: 'q2', title: 'عزم المحركات والتروس', score: 4, total: 5, date: '2025-05-20' },
          ],
          savedNotes: [
            {
              id: 'n1',
              title: 'ملحوظة رنين RLC',
              content: 'عند الرنين يتلاشى فرق الطور بين الجهد والتيار وتكون المعاوقة Z = R.',
              category: 'دوائر كهربائية',
              date: '2025-05-19',
            },
          ],
          bookmarks: [],
          soundEnabled: true,
          speechRate: 1.0,
        };
  });

  // Admin settings state
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('mechatronics_admin_settings');
    return saved
      ? JSON.parse(saved)
      : {
          isAiEnabled: true,
          isVoiceEnabled: true,
          isVideoStudioEnabled: true,
          isLabsEnabled: true,
          isCalculatorsEnabled: true,
          maintenanceMode: false,
          registeredUsersCount: 142,
          systemLogs: [
            { timestamp: '2025-05-21 10:00', action: 'تم بدء تشغيل الخادم وتأمين مسارات API', level: 'info' },
          ],
        };
  });

  // Update HTML dir & lang attribute when language changes
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [lang]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleUpdateProfile = (updated: StudentProfile) => {
    setProfile(updated);
    localStorage.setItem('mechatronics_student_profile', JSON.stringify(updated));
  };

  const handleUpdateAdminSettings = (updated: AdminSettings) => {
    setAdminSettings(updated);
    localStorage.setItem('mechatronics_admin_settings', JSON.stringify(updated));
  };

  const handleOpenLectureInStudio = (lecture: SavedLecture) => {
    setSelectedLectureForStudio(lecture);
    setActiveTab('lesson-studio');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && <HomeHero onNavigate={setActiveTab} lang={lang} />}
        {activeTab === 'serway-physics' && <SerwayPhysicsHub />}
        {activeTab === 'professors' && (
          <VirtualWhiteboard onNavigateToStudio={() => setActiveTab('lesson-studio')} />
        )}
        {activeTab === 'lesson-studio' && (
          <LessonStudio
            initialLectureToOpen={selectedLectureForStudio}
            onClearInitialLecture={() => setSelectedLectureForStudio(null)}
          />
        )}
        {activeTab === 'my-lectures' && (
          <MyLecturesHub onOpenLecture={handleOpenLectureInStudio} />
        )}
        {activeTab === 'labs' && <LabsHub />}
        {activeTab === 'calculators' && <CalculatorsHub />}
        {activeTab === 'ai-toolkit' && <AIToolkitHub />}
        {activeTab === 'library' && <LibraryHub />}
        {activeTab === 'quizzes' && <QuizzesHub />}
        {activeTab === 'student-profile' && (
          <StudentDashboard profile={profile} onUpdateProfile={handleUpdateProfile} />
        )}
        {activeTab === 'admin' && (
          <AdminPortal settings={adminSettings} onUpdateSettings={handleUpdateAdminSettings} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-slate-950 border-t border-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-slate-400">
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Bot className="w-5 h-5 text-cyan-400" />
                دكتور الميكاترونكس الذكي
              </div>
              <p className="leading-relaxed text-slate-400">
                منصة هندسية تعليمية ذكية متكاملة تجمع بين الرياضيات والميكانيكا والكهرباء والبرمجة والروبوتات.
              </p>
            </div>

            {/* Quick links */}
            <div className="space-y-2">
              <span className="font-bold text-slate-200 block uppercase">الخدمات الأساسية</span>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setActiveTab('serway-physics')} className="hover:text-cyan-400 transition-colors font-medium text-cyan-300">
                    شرح كتاب Serway (د. محمد الحبابي)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('professors')} className="hover:text-cyan-400 transition-colors">
                    قائمة الدكاترة والمواد الرسمية
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('labs')} className="hover:text-cyan-400 transition-colors">
                    مختبرات الدوائر والروبوتات
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('calculators')} className="hover:text-cyan-400 transition-colors">
                    الحاسبات الهندسية
                  </button>
                </li>
              </ul>
            </div>

            {/* AI Tools */}
            <div className="space-y-2">
              <span className="font-bold text-slate-200 block uppercase">الذكاء الاصطناعي</span>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setActiveTab('ai-toolkit')} className="hover:text-cyan-400 transition-colors">
                    اشرح لي وحل المسألة
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('lesson-studio')} className="hover:text-cyan-400 transition-colors">
                    استوديو إنشاء الدروس المرئية
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('quizzes')} className="hover:text-cyan-400 transition-colors">
                    الاختبارات الذكية والتقييم
                  </button>
                </li>
              </ul>
            </div>

            {/* Tech Specs */}
            <div className="space-y-2">
              <span className="font-bold text-slate-200 block uppercase">المعايير التقنية</span>
              <p className="text-slate-500 leading-relaxed font-mono text-[11px]">
                Built with React 19, TypeScript, Tailwind CSS, Express Full-Stack, and Google Gemini 3.8 Flash.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('admin')}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  منطقة الإدارة المحمية
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              جميع الحقوق محفوظة © {new Date().getFullYear()} دكتور الميكاترونكس الذكي | Smart Mechatronics Doctor
            </div>
            <div className="flex items-center gap-1">
              <span>صُممت لخدمة مهندسي وطلاب الميكاترونكس بأعلى المعايير الأكاديمية</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

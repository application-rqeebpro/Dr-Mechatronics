import React, { useState, useEffect } from 'react';
import { Professor, WhiteboardScene } from '../../types';
import { getStoredProfessors } from '../../data/professors';
import { getCourseLectureScenes } from '../../data/courseLectures';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  GraduationCap,
  MessageSquare,
  Search,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  Tv,
} from 'lucide-react';

interface Props {
  initialProfessorId?: string;
  initialCourse?: string;
  onNavigateToStudio?: (course: string, profName: string) => void;
  onAskAiAboutCourse?: (course: string) => void;
}

export const VirtualWhiteboard: React.FC<Props> = ({
  initialProfessorId = 'prof-alhababi',
  initialCourse,
  onNavigateToStudio,
  onAskAiAboutCourse,
}) => {
  const [professorsList] = useState<Professor[]>(() => getStoredProfessors());
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedProf, setSelectedProf] = useState<Professor>(() => {
    return (
      professorsList.find((p) => p.id === initialProfessorId) ||
      professorsList[0]
    );
  });

  const [selectedCourse, setSelectedCourse] = useState<string>(() => {
    if (initialCourse && selectedProf.courses.includes(initialCourse)) {
      return initialCourse;
    }
    return selectedProf.courses[0] || '';
  });

  const [level, setLevel] = useState<'beginner' | 'university' | 'advanced'>('university');
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [drawnLength, setDrawnLength] = useState<number>(0);

  // Filtered professors by Doctor Name or Course Name
  const filteredProfessors = professorsList.filter((prof) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const matchName =
      prof.name.toLowerCase().includes(q) ||
      prof.nameEn.toLowerCase().includes(q);
    const matchCourse = prof.courses.some((c) =>
      c.toLowerCase().includes(q)
    );
    return matchName || matchCourse;
  });

  // Dynamic lecture scenes for the selected doctor & course
  const activeScenes: WhiteboardScene[] = React.useMemo(() => {
    return getCourseLectureScenes(selectedCourse, selectedProf.name);
  }, [selectedCourse, selectedProf.name]);

  const currentScene = activeScenes[currentSceneIndex] || activeScenes[0];

  // When selected professor changes, update course to their first bound course
  const handleSelectProfessor = (prof: Professor) => {
    setSelectedProf(prof);
    setSelectedCourse(prof.courses[0]);
    setCurrentSceneIndex(0);
    setIsPlaying(false);
  };

  // When a course is selected
  const handleSelectCourse = (courseName: string) => {
    setSelectedCourse(courseName);
    setCurrentSceneIndex(0);
    setIsPlaying(false);
  };

  // Marker drawing animation for whiteboard text
  useEffect(() => {
    setDrawnLength(0);
    if (!currentScene?.whiteboardText) return;
    const textLength = currentScene.whiteboardText.length;
    let current = 0;
    const interval = setInterval(() => {
      current += 8;
      if (current >= textLength) {
        setDrawnLength(textLength);
        clearInterval(interval);
      } else {
        setDrawnLength(current);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [currentScene]);

  // Web Speech API for Arabic voice narration
  useEffect(() => {
    if (!isPlaying || isMuted || !currentScene?.professorSpeech) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentScene.professorSpeech);
      utterance.rate = speechRate;

      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find((v) => v.lang.startsWith('ar'));
      if (arVoice) {
        utterance.voice = arVoice;
      }
      utterance.lang = 'ar-SA';

      utterance.onend = () => {
        if (currentSceneIndex < activeScenes.length - 1) {
          setTimeout(() => {
            setCurrentSceneIndex((prev) => prev + 1);
          }, 1400);
        } else {
          setIsPlaying(false);
        }
      };

      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, currentSceneIndex, speechRate, isMuted, currentScene, activeScenes.length]);

  return (
    <div className="space-y-6">
      {/* Search & Header Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>هيئة التدريس الأكاديمية والمقررات الدراسية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              قائمة الدكاترة والمواد المعتمدة (Faculty & Courses)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              اختر الدكتور لعرض المواد الخاصة به، ثم اختر المادة للانتقال إلى الشرح التفاعلي والسبورة الذكية
            </p>
          </div>

          {/* Search by Doctor or Course */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute start-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الدكتور أو اسم المادة..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-10 pe-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-2.5 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 10 Equal-sized Doctor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-5">
          {filteredProfessors.map((prof) => {
            const isSelected = selectedProf.id === prof.id;
            return (
              <div
                key={prof.id}
                onClick={() => handleSelectProfessor(prof)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950/60 to-slate-950 border-cyan-500 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 end-3 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400 animate-pulse" />
                )}

                <div>
                  {/* Doctor Avatar / Badge */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-inner">
                      {prof.isCustomImage ? (
                        <img
                          src={prof.avatar}
                          alt={prof.name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span className="text-2xl">{prof.avatar}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-slate-400 block truncate">
                        {prof.title.split(' ')[0]}
                      </span>
                      <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                        {prof.name}
                      </h3>
                    </div>
                  </div>

                  {/* Doctor's Bound Courses List */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      المواد المرتبطة ({prof.courses.length}):
                    </span>
                    <div className="flex flex-col gap-1">
                      {prof.courses.map((courseName, idx) => (
                        <div
                          key={idx}
                          className={`px-2 py-1 rounded-lg text-[11px] font-mono truncate transition-colors ${
                            isSelected && selectedCourse === courseName
                              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                              : 'bg-slate-900 text-slate-300 border border-slate-800/60'
                          }`}
                        >
                          • {courseName}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-900 text-[10px] text-cyan-400 font-medium flex items-center justify-between">
                  <span>{isSelected ? 'المحدد حاليًا' : 'عرض المواد والشرح'}</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {filteredProfessors.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500">
            لم يتم العثور على أي دكتور أو مادة تطابق بحثك: "{searchQuery}"
          </div>
        )}
      </div>

      {/* Selected Doctor & Course Controller */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-cyan-500/30 flex items-center justify-center">
              {selectedProf.isCustomImage ? (
                <img
                  src={selectedProf.avatar}
                  alt={selectedProf.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">{selectedProf.avatar}</span>
              )}
            </div>
            <div>
              <span className="text-[11px] text-cyan-400 font-bold block uppercase">
                الأستاذ المختار حاليًا
              </span>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                {selectedProf.name}
                <span className="text-xs font-normal text-slate-400">({selectedProf.title})</span>
              </h2>
            </div>
          </div>

          {/* Quick Course Selector Tabs for this Doctor ONLY */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold me-1">اختر المادة للشرح:</span>
            {selectedProf.courses.map((course) => (
              <button
                key={course}
                onClick={() => handleSelectCourse(course)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedCourse === course
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400 scale-105'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {course}
              </button>
            ))}
          </div>
        </div>

        {/* Whiteboard Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
          {/* Left: Doctor Profile & Audio Speech */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
            <div>
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-16/10 flex items-center justify-center group">
                {selectedProf.isCustomImage ? (
                  <img
                    src={selectedProf.avatar}
                    alt={selectedProf.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-5xl">{selectedProf.avatar}</span>
                    <h4 className="text-sm font-bold text-slate-200 mt-2">{selectedProf.name}</h4>
                    <p className="text-xs text-slate-400">{selectedProf.specialty}</p>
                  </div>
                )}

                {isPlaying && (
                  <div className="absolute bottom-2.5 start-2.5 bg-cyan-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    شرح صوتي نشط الآن
                  </div>
                )}
              </div>

              {/* Current Active Course Badge */}
              <div className="mt-3.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">المادة المشروحة:</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">{selectedCourse}</span>
                </div>
                <span className="text-[10px] font-bold bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/50">
                  معتمدة
                </span>
              </div>

              {/* Speech transcript */}
              <div className="mt-3 p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs leading-relaxed text-slate-300 flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cyan-400 block mb-0.5">شرح الدكتور:</strong>
                  <p className="italic font-sans">"{currentScene?.professorSpeech}"</p>
                </div>
              </div>
            </div>

            {/* Doctor Bio quote */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-500">
              <strong>رسالة الدكتور: </strong> {selectedProf.sampleQuote}
            </div>
          </div>

          {/* Right: Interactive Whiteboard Canvas */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-slate-950 border-2 border-slate-800 rounded-2xl p-5 shadow-inner">
            <div>
              {/* Whiteboard Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="font-mono text-slate-300 ps-2 font-bold truncate">
                    {currentScene?.title || selectedCourse}
                  </span>
                </div>

                {/* Voice Speed Controls */}
                <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs">
                  <span className="text-slate-500 text-[10px]">السرعة:</span>
                  {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setSpeechRate(rate)}
                      className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${
                        speechRate === rate ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Whiteboard Drawing Canvas Content */}
              <div className="py-4 font-mono text-xs sm:text-sm leading-relaxed text-cyan-300 min-h-[260px] whitespace-pre-wrap select-none overflow-x-auto">
                {currentScene?.whiteboardText.slice(0, drawnLength)}
                {drawnLength < (currentScene?.whiteboardText.length || 0) && (
                  <span className="inline-block w-2.5 h-4 bg-cyan-400 animate-pulse ms-1" />
                )}
              </div>
            </div>

            {/* Whiteboard Footer Playback Controls */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  disabled={currentSceneIndex === 0}
                  onClick={() => {
                    setCurrentSceneIndex((prev) => Math.max(0, prev - 1));
                    setIsPlaying(false);
                  }}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-40 transition-colors"
                  title="المشهد السابق"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-lg ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'إيقاف الشرح الصوتي' : 'استماع لشرح الدكتور'}
                </button>

                <button
                  disabled={currentSceneIndex === activeScenes.length - 1}
                  onClick={() => {
                    setCurrentSceneIndex((prev) => Math.min(activeScenes.length - 1, prev + 1));
                    setIsPlaying(false);
                  }}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-40 transition-colors"
                  title="المشهد التالي"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isMuted
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Scenes dots */}
              <div className="flex items-center gap-1.5">
                {activeScenes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentSceneIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      currentSceneIndex === idx ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

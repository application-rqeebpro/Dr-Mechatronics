import React, { useState, useEffect, useRef } from 'react';
import { WhiteboardScene, SavedLecture } from '../../types';
import { MathView } from '../SerwayPhysics/MathView';
import { WhiteboardDiagram } from '../SerwayPhysics/WhiteboardDiagram';
import { VoiceSettingsControl } from '../VoiceSettings/VoiceSettingsControl';
import { AudioSpeechEngine, VoicePersona } from '../../utils/audioSpeechEngine';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Building2,
  FileText,
  Upload,
  Image as ImageIcon,
  FileUp,
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator,
  Layers,
  ArrowRight,
  ArrowLeft,
  Square,
  Sliders,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface Props {
  initialLectureToOpen?: SavedLecture | null;
  onClearInitialLecture?: () => void;
}

export const LessonStudio: React.FC<Props> = ({ initialLectureToOpen, onClearInitialLecture }) => {
  const audioEngine = AudioSpeechEngine.getInstance();

  // 1. Required and completely empty defaults according to requirements
  const [doctorName, setDoctorName] = useState<string>('');
  const [specialty, setSpecialty] = useState<string>('');
  const [university, setUniversity] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [level, setLevel] = useState<'beginner' | 'university' | 'advanced'>('university');
  const [length, setLength] = useState<'brief' | 'medium' | 'detailed'>('medium');

  // 2. Voice Settings State
  const [voicePersona, setVoicePersona] = useState<VoicePersona>('male');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);
  const [isAudioSpeaking, setIsAudioSpeaking] = useState<boolean>(false);
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false);

  // 3. File Upload State
  const [uploadedFile, setUploadedFile] = useState<{
    file: File | null;
    name: string;
    size: number;
    type: string;
    base64Data?: string;
    extractedText?: string;
    selectedPages?: string;
  } | null>(null);

  const [selectedPages, setSelectedPages] = useState<string>('');
  const [directNotes, setDirectNotes] = useState<string>('');
  const [fileParsingStatus, setFileParsingStatus] = useState<'idle' | 'parsing' | 'ready' | 'error'>('idle');
  const [fileParsingError, setFileParsingError] = useState<string | null>(null);

  // 4. Lecture Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [lectureData, setLectureData] = useState<{
    title: string;
    intro: string;
    scenes: WhiteboardScene[];
    solvedExample?: {
      problem: string;
      solutionSteps: string[];
      finalAnswer: string;
    };
    miniQuiz?: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }[];
    summary: string;
  } | null>(null);

  // 5. Whiteboard Player State
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial lecture if reopened from "محاضراتي"
  useEffect(() => {
    if (initialLectureToOpen) {
      setDoctorName(initialLectureToOpen.doctorName || '');
      setSpecialty(initialLectureToOpen.specialty || '');
      setUniversity(initialLectureToOpen.university || '');
      setSubject(initialLectureToOpen.subject || '');
      setTopic(initialLectureToOpen.topic || '');
      setLevel((initialLectureToOpen.level as any) || 'university');
      setLength((initialLectureToOpen.length as any) || 'medium');
      setLectureData({
        title: initialLectureToOpen.doctorName
          ? `شرح الدكتور ${initialLectureToOpen.doctorName} - ${initialLectureToOpen.topic}`
          : initialLectureToOpen.topic,
        intro: initialLectureToOpen.doctorName
          ? `أهلًا بكم طلابنا، معكم الأستاذ الافتراضي بأسلوب الدكتور ${initialLectureToOpen.doctorName}. نستكمل استعراض درس "${initialLectureToOpen.topic}".`
          : `أهلًا بكم مجددًا في محاضرة ${initialLectureToOpen.topic}. سنستكمل استعراض السبورة والمسائل.`,
        scenes: initialLectureToOpen.scenes,
        solvedExample: initialLectureToOpen.solvedExample,
        miniQuiz: initialLectureToOpen.miniQuiz,
        summary: initialLectureToOpen.summary || '',
      });
      setActiveSceneIndex(initialLectureToOpen.lastProgressStep || 0);
      if (onClearInitialLecture) {
        onClearInitialLecture();
      }
    }
  }, [initialLectureToOpen, onClearInitialLecture]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stop();
    };
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileParsingError(null);
    setFileParsingStatus('parsing');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        setUploadedFile({
          file,
          name: file.name,
          size: file.size,
          type: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain'),
          base64Data,
          selectedPages,
        });

        const res = await fetch('/api/ai/parse-material', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileBase64: base64Data,
            selectedPages,
            directText: directNotes,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setUploadedFile((prev) =>
            prev ? { ...prev, extractedText: data.extractedText } : null
          );
          setFileParsingStatus('ready');
        } else {
          setFileParsingStatus('ready');
        }
      } catch (err: any) {
        console.warn('File parse warning:', err);
        setFileParsingStatus('error');
        setFileParsingError('تعذر استخراج بعض تفاصيل الملف تلقائيًا، وسيتم الاعتماد على محرك الشرح للموضوع المحدد.');
      }
    };

    reader.onerror = () => {
      setFileParsingStatus('error');
      setFileParsingError('حدث خطأ أثناء قراءة الملف من الجهاز. يرجى إعادة المحاولة.');
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileParsingStatus('idle');
    setFileParsingError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Main Generator Call
  const handleGenerate = async (intent: 'brief' | 'detailed' | 'laws' | 'solve_example' | 'explain_page' | 'quiz_me') => {
    const finalSubject = subject.trim() || 'الهندسة العامة';
    const finalTopic = topic.trim() || 'مقدمة في الميكاترونكس';

    setIsGenerating(true);
    setSaveSuccessMsg(null);
    audioEngine.stop();
    setIsAudioSpeaking(false);
    setIsAudioPaused(false);

    try {
      const res = await fetch('/api/ai/universal-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorName: doctorName.trim(),
          specialty: specialty.trim(),
          university: university.trim(),
          subject: finalSubject,
          topic: finalTopic,
          level,
          length: intent === 'brief' ? 'brief' : length,
          actionIntent: intent,
          uploadedFile: uploadedFile
            ? {
                name: uploadedFile.name,
                size: uploadedFile.size,
                type: uploadedFile.type,
                extractedText: uploadedFile.extractedText,
                selectedPages,
              }
            : undefined,
          directNotes,
        }),
      });

      const data = await res.json();
      if (data.lesson) {
        setLectureData(data.lesson);
        setActiveSceneIndex(0);
        setQuizAnswers({});
      }
    } catch (err) {
      console.error('Universal lecture generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Audio Control Methods using AudioSpeechEngine
  const handleTogglePlaySpeech = () => {
    if (isAudioSpeaking) {
      if (isAudioPaused) {
        audioEngine.resume();
        setIsAudioPaused(false);
      } else {
        audioEngine.pause();
        setIsAudioPaused(true);
      }
      return;
    }

    if (!lectureData || !lectureData.scenes[activeSceneIndex]) return;

    const currentScene = lectureData.scenes[activeSceneIndex];
    const textToSpeak = `${currentScene.title}. ${currentScene.professorSpeech}`;

    audioEngine.speak(textToSpeak, {
      persona: voicePersona,
      voiceId: selectedVoiceId,
      rate: playbackSpeed,
      onStart: () => {
        setIsAudioSpeaking(true);
        setIsAudioPaused(false);
      },
      onEnd: () => {
        setIsAudioSpeaking(false);
        setIsAudioPaused(false);
      },
      onError: () => {
        setIsAudioSpeaking(false);
        setIsAudioPaused(false);
      },
    });
  };

  const handleStopSpeech = () => {
    audioEngine.stop();
    setIsAudioSpeaking(false);
    setIsAudioPaused(false);
  };

  const handleReplayCurrentStep = () => {
    handleStopSpeech();
    if (!lectureData || !lectureData.scenes[activeSceneIndex]) return;

    const currentScene = lectureData.scenes[activeSceneIndex];
    const textToSpeak = `إعادة شرح الخطوة: ${currentScene.title}. ${currentScene.professorSpeech}`;

    audioEngine.speak(textToSpeak, {
      persona: voicePersona,
      voiceId: selectedVoiceId,
      rate: playbackSpeed,
      onStart: () => {
        setIsAudioSpeaking(true);
        setIsAudioPaused(false);
      },
      onEnd: () => {
        setIsAudioSpeaking(false);
        setIsAudioPaused(false);
      },
      onError: () => {
        setIsAudioSpeaking(false);
        setIsAudioPaused(false);
      },
    });
  };

  // Save lecture to local storage
  const handleSaveLecture = () => {
    if (!lectureData) return;

    const newSaved: SavedLecture = {
      id: `lec-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('ar-EG', { dateStyle: 'medium' }),
      doctorName: doctorName.trim() || undefined,
      specialty: specialty.trim() || undefined,
      university: university.trim() || undefined,
      subject: subject.trim() || 'الهندسة العامة',
      topic: topic.trim() || 'شرح تفاعلي',
      level,
      length,
      sourceType: uploadedFile ? (uploadedFile.type.startsWith('image/') ? 'image' : 'pdf') : 'general',
      sourceFileName: uploadedFile?.name,
      sourceFileSize: uploadedFile?.size,
      scenes: lectureData.scenes,
      solvedExample: lectureData.solvedExample,
      miniQuiz: lectureData.miniQuiz,
      summary: lectureData.summary,
      studentNotes: directNotes,
      lastProgressStep: activeSceneIndex,
    };

    try {
      const existing = localStorage.getItem('mechatronics_saved_lectures');
      const list: SavedLecture[] = existing ? JSON.parse(existing) : [];
      list.unshift(newSaved);
      localStorage.setItem('mechatronics_saved_lectures', JSON.stringify(list));
      setSaveSuccessMsg('تم حفظ المحاضرة بنجاح في تبويب "محاضراتي"!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (e) {
      console.error('Failed to save lecture:', e);
    }
  };

  const activeScene = lectureData?.scenes[activeSceneIndex];

  // Dynamic lecture title that reflects doctor's name live
  const dynamicLessonTitle = doctorName.trim()
    ? `شرح الدكتور ${doctorName.trim()} - ${topic.trim() || 'المحاضرة الذكية'}`
    : topic.trim()
    ? `${topic.trim()} - ${subject.trim() || 'الهندسة'}`
    : 'استوديو شرح الدروس الهندسية';

  return (
    <div className="space-y-6">
      {/* Studio Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              الاستوديو التعليمي الحر لجميع الطلاب والجامعات
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              استوديو شرح الدروس الذكي | Smart Lecture Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              اكتب اسم دكتورك أو مادتك بحرية تامة، وارفع مذكراتك أو صور السبورة والمسائل، ليقوم الأستاذ الافتراضي بشرحها تدريجيًا على السبورة البيضاء مع صوت حقيقي.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                showVoiceSettings
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>إعدادات الصوت والنبرة</span>
            </button>
          </div>
        </div>

        {/* Collapsible Voice Settings Control */}
        {showVoiceSettings && (
          <div className="mt-5 animate-fadeIn">
            <VoiceSettingsControl
              persona={voicePersona}
              selectedVoiceId={selectedVoiceId}
              rate={playbackSpeed}
              onPersonaChange={setVoicePersona}
              onVoiceIdChange={setSelectedVoiceId}
              onRateChange={setPlaybackSpeed}
            />
          </div>
        )}

        {/* Input Configuration Form */}
        <div className="mt-6 space-y-5">
          {/* Row 1: Doctor (Empty by default), Specialty (Empty by default), University (Empty by default) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  اسم الدكتور:
                </span>
                <span className="text-[10px] text-slate-400">(فارغ - اكتب اسم دكتورك)</span>
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="اكتب اسم أي دكتور تريده هنا..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  التخصص:
                </span>
                <span className="text-[10px] text-slate-400">(فارغ - اختياري)</span>
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="مثال: هندسة ميكاترونكس، قوى كهربائية، ميكانيكا..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  اسم الجامعة:
                </span>
                <span className="text-[10px] text-slate-400">(اختياري وفارغ)</span>
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="مثال: جامعة صنعاء، الملك فهد، أو اتركها فارغة"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Row 2: Subject, Topic, Level & Length */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4 space-y-1.5">
              <label className="text-xs font-bold text-white flex items-center gap-1">
                اسم المادة:
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="اكتب اسم المادة (مثال: دوائر كهربائية، ديناميكا حرارية، رياضيات...)"
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-4 space-y-1.5">
              <label className="text-xs font-bold text-white flex items-center gap-1">
                عنوان الدرس أو المسألة:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="اكتب عنوان الدرس أو موضوع الشرح..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">مستوى الشرح:</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="beginner">مبتدئ (Beginner)</option>
                <option value="university">جامعي (University)</option>
                <option value="advanced">متقدم (Advanced)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">طول الشرح:</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="brief">مختصر (Brief)</option>
                <option value="medium">متوسط (Medium)</option>
                <option value="detailed">مفصل وشامل (Detailed)</option>
              </select>
            </div>
          </div>

          {/* Educational File Uploads Dropzone */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <FileUp className="w-4 h-4 text-cyan-400" />
                رفع مذكرات المحاضرة، صفحات الكتب، وصور السبورة والمسائل (اختياري):
              </span>
              <span className="text-[11px] text-slate-400">
                يدعم PDF، صور السبورة والكتب (JPG/PNG)، أو نصوص المذكرات
              </span>
            </div>

            {!uploadedFile ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-800 hover:border-cyan-500/60 rounded-xl p-4 text-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all flex flex-col items-center justify-center gap-2"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/*,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-300">
                    اضغط هنا لرفع ملف PDF أو صورة المسألة والسبورة
                  </span>
                  <span className="text-[10px] text-slate-500">الحد الأقصى للحجم: 20MB</span>
                </div>

                <div className="space-y-1">
                  <textarea
                    value={directNotes}
                    onChange={(e) => setDirectNotes(e.target.value)}
                    rows={3}
                    placeholder="أو الصق نص المسألة أو الملاحظات التي تريد من الدكتور الافتراضي التركيز عليها..."
                    className="w-full h-full min-h-[85px] bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    {uploadedFile.type.startsWith('image/') ? (
                      <ImageIcon className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      {uploadedFile.name}
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {fileParsingStatus === 'parsing'
                          ? 'جاري استخراج المحتوى...'
                          : 'جاهز للاستخدام في الشرح'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                      <span>•</span>
                      <span>{uploadedFile.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {uploadedFile.type.includes('pdf') && (
                    <input
                      type="text"
                      value={selectedPages}
                      onChange={(e) => setSelectedPages(e.target.value)}
                      placeholder="الصفحات (مثال: 12-15)"
                      className="w-32 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                    />
                  )}
                  <button
                    onClick={handleRemoveFile}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 text-xs transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    حذف / استبدال الملف
                  </button>
                </div>
              </div>
            )}

            {fileParsingError && (
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{fileParsingError}</span>
              </div>
            )}
          </div>

          {/* Action Buttons Bar */}
          <div className="pt-2">
            <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span>اختر نوع الشرح المطلوب للبدء:</span>
              <span className="text-[11px] text-cyan-400 font-normal">
                {doctorName.trim()
                  ? `سيتم إنشاء الشرح باسم: د. ${doctorName.trim()}`
                  : 'سيتم إنشاء الشرح بواسطة الأستاذ الافتراضي الذكي'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              <button
                disabled={isGenerating}
                onClick={() => handleGenerate('brief')}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-cyan-600 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                اشرح باختصار
              </button>

              <button
                disabled={isGenerating}
                onClick={() => handleGenerate('detailed')}
                className="py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                اشرح بالتفصيل
              </button>

              <button
                disabled={isGenerating}
                onClick={() => handleGenerate('laws')}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                أظهر القوانين
              </button>

              <button
                disabled={isGenerating}
                onClick={() => handleGenerate('solve_example')}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                حل مثالًا
              </button>

              <button
                disabled={isGenerating}
                onClick={() => handleGenerate('explain_page')}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-purple-600 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                فسّر هذه الصفحة
              </button>

              <button
                disabled={isGenerating}
                onClick={() => handleGenerate('quiz_me')}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                اختبرني
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save success toast */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold">{saveSuccessMsg}</span>
          </div>
          <span className="text-[11px] text-emerald-400/80">متاحة في تبويب «محاضراتي»</span>
        </div>
      )}

      {/* Loading Indicator */}
      {isGenerating && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-white">
            جاري إعداد مشاهد السبورة والشرح الأكاديمي...
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {doctorName.trim()
              ? `يتم الآن تنظيم المحتوى والمعادلات بأسلوب الشرح الافتراضي للدكتور ${doctorName.trim()}`
              : 'يتم الآن تحليل المفاهيم وصياغة سيناريو الشرح خطوة بخطوة مع الرسوم التخطيطية.'}
          </p>
        </div>
      )}

      {/* Interactive Whiteboard Display Canvas */}
      {lectureData && !isGenerating && (
        <div className="space-y-6">
          {/* Lecture Controls Bar */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold">
                {subject.trim() || 'الهندسة العامة'}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                {dynamicLessonTitle}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Audio Listen / Pause Button */}
              <button
                onClick={handleTogglePlaySpeech}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isAudioSpeaking
                    ? isAudioPaused
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-md shadow-cyan-600/20'
                }`}
              >
                {isAudioSpeaking ? (
                  isAudioPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
                <span>
                  {isAudioSpeaking
                    ? isAudioPaused
                      ? 'استئناف الصوت'
                      : 'إيقاف مؤقت'
                    : 'استمع إلى الشرح'}
                </span>
              </button>

              {/* Stop audio button */}
              {isAudioSpeaking && (
                <button
                  onClick={handleStopSpeech}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                  title="إيقاف الصوت تمامًا"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Re-explain Step */}
              <button
                onClick={handleReplayCurrentStep}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                title="أعد شرح الخطوة الحالية"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                أعد شرح الخطوة
              </button>

              {/* Save lecture button */}
              <button
                onClick={handleSaveLecture}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold shadow transition-colors"
                title="حفظ المحاضرة في أرشيف محاضراتي"
              >
                <Save className="w-3.5 h-3.5" />
                حفظ المحاضرة
              </button>
            </div>
          </div>

          {/* Whiteboard Canvas Frame with Virtual Doctor Persona */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="relative rounded-2xl border-4 border-slate-700 bg-slate-950 p-5 sm:p-7 shadow-inner min-h-[460px] flex flex-col justify-between">
              {/* Whiteboard Top Marker Tray */}
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800/80 text-xs gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-bold text-cyan-400">
                    السبورة التفاعلية - المشهد {activeSceneIndex + 1} من {lectureData.scenes.length}
                  </span>
                  <span className="text-slate-500 font-mono">
                    | {activeScene?.title || ''}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>الصوت المختار:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-400 font-bold border border-slate-800">
                    {voicePersona === 'female' ? 'أنثوي' : voicePersona === 'male' ? 'ذكوري' : 'افتراضي'}
                  </span>
                  <span>السرعة:</span>
                  <span className="font-mono text-cyan-300">{playbackSpeed}x</span>
                </div>
              </div>

              {/* Whiteboard Content Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-4">
                {/* Virtual Professor Avatar Column */}
                <div className="lg:col-span-3 flex flex-col items-center justify-start text-center border-b lg:border-b-0 lg:border-l border-slate-800/80 pb-4 lg:pb-0 lg:pl-4">
                  <div className="relative group">
                    <img
                      src="/assets/aistudio/855835000_1444226130442451_3607535876634852799_n__1__65712c61.webp"
                      alt="Virtual Doctor Avatar"
                      className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-cyan-600 text-white shadow">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Doctor Name - Displays exactly what student entered */}
                  <h4 className="font-bold text-sm text-white mt-3 flex items-center justify-center gap-1.5">
                    <span>{doctorName.trim() ? `د. ${doctorName.trim()}` : 'الأستاذ الافتراضي'}</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    (شخصية أكاديمية افتراضية)
                  </span>

                  <p className="text-[11px] text-cyan-400 font-semibold mt-1">
                    {specialty.trim() || subject.trim() || 'الهندسة والميكاترونكس'}
                  </p>
                  {university.trim() && (
                    <p className="text-[10px] text-slate-400 mt-0.5">{university.trim()}</p>
                  )}

                  {/* Clarification Disclaimer */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 text-start leading-relaxed">
                    <div className="flex items-center gap-1 text-slate-300 font-bold mb-0.5">
                      <Info className="w-3 h-3 text-cyan-400" />
                      <span>توضيح أكاديمي:</span>
                    </div>
                    هذه الشخصية تمثيل افتراضي ذكي لشرح المحاضرة، وليست الدكتور الحقيقي، ولا تنسب إليه أقوالًا أو تسجيلات فعلية.
                  </div>

                  {/* Professor Speech Bubble */}
                  {activeScene?.professorSpeech && (
                    <div className="mt-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200 text-start leading-relaxed shadow w-full">
                      <div className="text-[10px] font-bold text-cyan-400 mb-1 flex items-center justify-between">
                        <span>شرح الأستاذ في هذا المشهد:</span>
                        <Volume2 className="w-3 h-3 text-cyan-400" />
                      </div>
                      <p className="italic">"{activeScene.professorSpeech}"</p>
                    </div>
                  )}
                </div>

                {/* Whiteboard Math & Handwriting Scene */}
                <div className="lg:col-span-9 space-y-4">
                  <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="space-y-3 font-mono text-xs sm:text-sm leading-relaxed text-slate-100">
                      {(activeScene?.whiteboardText || '').split('\n\n').map((paragraph, pIdx) => {
                        const trimmed = paragraph.trim();
                        if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
                          const cleanFormula = trimmed.slice(2, -2).trim();
                          return (
                            <div key={pIdx} className="my-3 p-3 bg-slate-950 rounded-xl border border-cyan-500/30 text-center overflow-x-auto">
                              <MathView math={cleanFormula} block={true} className="text-cyan-300 text-base sm:text-lg" />
                            </div>
                          );
                        }
                        return (
                          <div key={pIdx} className="whitespace-pre-wrap text-slate-200">
                            {trimmed}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional SVG Diagram */}
                  {activeScene?.diagramType && (
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        المخطط التوضيحي للدرس (Engineering Diagram):
                      </span>
                      <WhiteboardDiagram
                        type={
                          activeScene.diagramType === 'circuit'
                            ? 'circuit_rlc'
                            : activeScene.diagramType === 'response'
                            ? 'kinematics_graph'
                            : 'circuit_ohm'
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Stepped Navigation Controls */}
              <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-800 text-xs gap-3">
                <button
                  disabled={activeSceneIndex === 0}
                  onClick={() => {
                    handleStopSpeech();
                    setActiveSceneIndex((p) => Math.max(0, p - 1));
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-200 border border-slate-800 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  المشهد السابق
                </button>

                {/* Progress Scene Dots */}
                <div className="flex items-center gap-1.5">
                  {lectureData.scenes.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleStopSpeech();
                        setActiveSceneIndex(idx);
                      }}
                      className={`h-2.5 rounded-full transition-all ${
                        activeSceneIndex === idx
                          ? 'w-8 bg-cyan-400 shadow-sm shadow-cyan-400/50'
                          : 'w-2.5 bg-slate-800 hover:bg-slate-700'
                      }`}
                      title={`المشهد ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  disabled={activeSceneIndex === lectureData.scenes.length - 1}
                  onClick={() => {
                    handleStopSpeech();
                    setActiveSceneIndex((p) => Math.min(lectureData.scenes.length - 1, p + 1));
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-200 border border-slate-800 transition-colors"
                >
                  المشهد التالي
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Solved Example Box if present */}
          {lectureData.solvedExample && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    مثال تطبيقي محلول خطوة بخطوة (Solved Engineering Example)
                  </h3>
                  <p className="text-xs text-slate-400">
                    تطبيق مباشر على القوانين المستعرضة في السبورة
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed">
                {lectureData.solvedExample.problem}
              </div>

              <div className="space-y-2 text-xs font-mono">
                {lectureData.solvedExample.solutionSteps.map((step, sIdx) => (
                  <div key={sIdx} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
                    <span className="text-cyan-400 font-bold block mb-1">
                      الخطوة {sIdx + 1}:
                    </span>
                    <span className="text-slate-300">{step}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono text-center">
                {lectureData.solvedExample.finalAnswer}
              </div>
            </div>
          )}

          {/* Mini-Quiz */}
          {lectureData.miniQuiz && lectureData.miniQuiz.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">اختبر نفسك على الدرس</h3>
                  <p className="text-xs text-slate-400">
                    أسئلة سريعة لقياس مدى استيعابك للقوانين والمفاهيم
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {lectureData.miniQuiz.map((q, qIdx) => {
                  const userChoice = quizAnswers[qIdx];
                  const hasAnswered = userChoice !== undefined;
                  const isCorrect = userChoice === q.correctIndex;

                  return (
                    <div key={qIdx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <p className="text-xs sm:text-sm font-semibold text-white">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          let optStyle = 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800';
                          if (hasAnswered) {
                            if (optIdx === q.correctIndex) {
                              optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                            } else if (userChoice === optIdx) {
                              optStyle = 'bg-rose-950/60 border-rose-500 text-rose-300';
                            }
                          }
                          return (
                            <button
                              key={optIdx}
                              disabled={hasAnswered}
                              onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx })}
                              className={`p-3 rounded-xl border text-xs text-start transition-all ${optStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div
                          className={`p-3 rounded-xl text-xs ${
                            isCorrect
                              ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                              : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
                          }`}
                        >
                          <strong>{isCorrect ? 'إجابة صحيحة وممتازة! 🎉' : 'إجابة خاطئة ❌'}</strong>
                          <p className="mt-1">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lesson Summary */}
          {lectureData.summary && (
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200">
              <strong className="block text-cyan-400 font-bold mb-1">خلاصة المحاضرة والتوصيات:</strong>
              <p className="leading-relaxed">{lectureData.summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

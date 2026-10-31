import React, { useState, useEffect } from 'react';
import { FIORE_DC_EXPERIMENTS } from '../../data/fioreDcExperiments';
import {
  FioreExperiment,
  CircuitElement,
  CircuitWire,
  SimulationResult,
  MeasurementRecord,
  LabSubmissionReport
} from '../../types/dcLab';
import { DcCircuitSolver } from '../../utils/dcCircuitSolver';
import { AudioSpeechEngine } from '../../utils/audioSpeechEngine';
import { CircuitCanvas } from './CircuitCanvas';
import { InstrumentsRack } from './InstrumentsRack';
import { ResultsCharts } from './ResultsCharts';
import { ResistorColorCodeTool } from './ResistorColorCodeTool';
import { ExperimentGuideModal } from './ExperimentGuideModal';
import { LabReportModal } from './LabReportModal';
import {
  Zap,
  Play,
  Square,
  RotateCcw,
  BookOpen,
  Gauge,
  BarChart3,
  FileText,
  Award,
  History,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Save,
  Download,
  FolderOpen,
  Cpu
} from 'lucide-react';

interface Props {
  onNavigateToBreadboard?: () => void;
}

export const DCLabHub: React.FC<Props> = ({ onNavigateToBreadboard }) => {
  // Current active experiment (default Exp 4: Ohm's Law)
  const [selectedExpId, setSelectedExpId] = useState<string>('exp-4');
  const currentExp = FIORE_DC_EXPERIMENTS.find(e => e.id === selectedExpId) || FIORE_DC_EXPERIMENTS[3];

  // Active lab view tab
  const [activeLabTab, setActiveLabTab] = useState<
    'workbench' | 'meters' | 'table' | 'charts' | 'colorcode' | 'quizzes' | 'history'
  >('workbench');

  // Circuit state
  const [components, setComponents] = useState<CircuitElement[]>(currentExp.defaultCircuit.components);
  const [wires, setWires] = useState<CircuitWire[]>(currentExp.defaultCircuit.wires);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Simulation Results
  const [simResult, setSimResult] = useState<SimulationResult>(() =>
    DcCircuitSolver.solve(currentExp.defaultCircuit.components, currentExp.defaultCircuit.wires)
  );

  // Measurements recorded by student
  const [measurements, setMeasurements] = useState<MeasurementRecord[]>([]);

  // Modals state
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Quiz state
  const [preQuizAnswers, setPreQuizAnswers] = useState<Record<string, number>>({});
  const [postQuizAnswers, setPostQuizAnswers] = useState<Record<string, number>>({});
  const [preQuizSubmitted, setPreQuizSubmitted] = useState<boolean>(false);
  const [postQuizSubmitted, setPostQuizSubmitted] = useState<boolean>(false);

  // Audio Speech state
  const [isDoctorSpeaking, setIsDoctorSpeaking] = useState<boolean>(false);
  const audioEngine = AudioSpeechEngine.getInstance();

  // Saved reports history from localStorage
  const [savedReports, setSavedReports] = useState<LabSubmissionReport[]>(() => {
    const raw = localStorage.getItem('mechatronics_dc_lab_reports');
    return raw ? JSON.parse(raw) : [];
  });

  // When experiment changes, load its default circuit and reset measurement records
  const handleSelectExperiment = (exp: FioreExperiment) => {
    setSelectedExpId(exp.id);
    setComponents(exp.defaultCircuit.components);
    setWires(exp.defaultCircuit.wires);
    setIsSimulating(true);

    // Populate initial measurement templates
    const initialMeas: MeasurementRecord[] = exp.expectedMeasurements.map((m, idx) => ({
      id: `m_${idx}`,
      stepNumber: idx + 1,
      quantityNameAr: m.parameter,
      quantityNameEn: m.parameter,
      symbol: m.symbol,
      theoreticalValue: m.typicalTheoretical,
      measuredValue: m.typicalTheoretical, // matches theoretical in ideal simulation
      unit: m.unit,
      percentError: 0.0,
      notes: 'قراءة أولية متطابقة مع نموذج المحاكاة',
    }));
    setMeasurements(initialMeas);

    setPreQuizAnswers({});
    setPostQuizAnswers({});
    setPreQuizSubmitted(false);
    setPostQuizSubmitted(false);

    if (exp.number === 3) {
      setActiveLabTab('colorcode');
    }
  };

  // Run solver whenever components, wires, or simulation toggle change
  useEffect(() => {
    if (isSimulating) {
      const res = DcCircuitSolver.solve(components, wires);
      setSimResult(res);

      // Auto update measurements if corresponding elements exist
      setMeasurements(prev =>
        prev.map(item => {
          let actualVal = item.theoreticalValue;

          // Estimate based on current circuit elements
          const dcSource = components.find(c => c.type === 'dc_source' || c.type === 'battery');
          const r1 = components.find(c => c.type === 'resistor');

          if (item.symbol.includes('E') && dcSource) {
            actualVal = dcSource.value;
          } else if (item.symbol.includes('I') && r1 && res.elementData[r1.id]) {
            actualVal = Math.abs(res.elementData[r1.id].current) * 1000; // in mA
          } else if (item.symbol.includes('V') && r1 && res.elementData[r1.id]) {
            actualVal = Math.abs(res.elementData[r1.id].voltageDrop);
          } else if (item.symbol.includes('R') && r1) {
            actualVal = r1.value;
          }

          const err =
            item.theoreticalValue !== 0
              ? (Math.abs(item.theoreticalValue - actualVal) / Math.abs(item.theoreticalValue)) * 100
              : 0;

          return {
            ...item,
            measuredValue: actualVal,
            percentError: Math.min(100, err),
          };
        })
      );
    }
  }, [components, wires, isSimulating]);

  // Reset circuit to experiment defaults
  const handleResetCircuit = () => {
    setComponents(currentExp.defaultCircuit.components);
    setWires(currentExp.defaultCircuit.wires);
    setIsSimulating(true);
  };

  // Save current circuit to localStorage
  const handleSaveCircuit = () => {
    const circuitData = { components, wires, timestamp: Date.now(), expId: selectedExpId };
    localStorage.setItem(`mechatronics_circuit_${selectedExpId}`, JSON.stringify(circuitData));
    alert('تم حفظ الدائرة الحالية بنجاح في متصفحك.');
  };

  // Load saved circuit
  const handleLoadCircuit = () => {
    const saved = localStorage.getItem(`mechatronics_circuit_${selectedExpId}`);
    if (saved) {
      const data = JSON.parse(saved);
      setComponents(data.components);
      setWires(data.wires);
      alert('تم استعادة الدائرة المحفوظة.');
    } else {
      alert('لا توجد دائرة محفوظة مسبقاً لهذه التجربة.');
    }
  };

  // Handle Smart Professor audio advice
  const handleToggleDoctorSpeech = async () => {
    if (isDoctorSpeaking) {
      audioEngine.stop();
      setIsDoctorSpeaking(false);
    } else {
      setIsDoctorSpeaking(true);
      const speech = `أهلاً بك يا مهندس في ${currentExp.titleAr}. ${currentExp.subtitleAr}. القاعدة الأساسية: ${currentExp.formulas[0]?.descriptionAr || ''}. يمكنك استخدام أجهزة القياس لتأكيد قانون كيرشوف وأوم. انتبه لأخطاء التوصيل وتجنب قصر الدائرة.`;
      await audioEngine.speak(speech, { persona: 'male', engine: 'native_hd' });
      setIsDoctorSpeaking(false);
    }
  };

  // Save lab report to profile
  const handleSaveReport = (report: LabSubmissionReport) => {
    const updated = [report, ...savedReports.filter(r => r.experimentNumber !== report.experimentNumber)];
    setSavedReports(updated);
    localStorage.setItem('mechatronics_dc_lab_reports', JSON.stringify(updated));

    // Also update student completed labs in profile
    const profileRaw = localStorage.getItem('mechatronics_student_profile');
    if (profileRaw) {
      const profile = JSON.parse(profileRaw);
      const completed = new Set(profile.completedLabs || []);
      completed.add(`fiore-dc-exp-${report.experimentNumber}`);
      profile.completedLabs = Array.from(completed);
      localStorage.setItem('mechatronics_student_profile', JSON.stringify(profile));
    }
  };

  // Calculate pre/post quiz score
  const preScore = Object.entries(preQuizAnswers).reduce((acc, [qId, ans]) => {
    const q = currentExp.preQuiz.find(item => item.id === qId);
    return q && q.correctIndex === ans ? acc + 1 : acc;
  }, 0);

  const postScore = Object.entries(postQuizAnswers).reduce((acc, [qId, ans]) => {
    const q = currentExp.postQuiz.find(item => item.id === qId);
    return q && q.correctIndex === ans ? acc + 1 : acc;
  }, 0);

  return (
    <div className="space-y-6 py-4">
      {/* Hero Header with Doctor Avatar */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 p-5 sm:p-7 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/20 shrink-0">
              <img
                src="/assets/aistudio/file_00000000d6648210a5de34ab1bae4073_9f4c464e.png"
                alt="Smart Doctor"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>المختبر الكهربائي الافتراضي DC • جيمس فيوري</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mt-1">
                دكتور الميكاترونكس الذكي: مختبر الدوائر الكهربائية DC
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                محاكاة حاسوبية دقيقة لـ 15 تجربة وفق دليل James M. Fiore، بمحرك تحليلي Modified Nodal Analysis
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleToggleDoctorSpeech}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md ${
                isDoctorSpeaking
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              {isDoctorSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              <span>{isDoctorSpeaking ? 'إيقاف صوت المعلم' : 'شرح صوتي من المعلم الذكي'}</span>
            </button>

            <button
              onClick={() => setShowGuideModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs sm:text-sm border border-slate-700 shadow-md"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>دليل التجربة والخطوات</span>
            </button>

            {onNavigateToBreadboard && (
              <button
                onClick={onNavigateToBreadboard}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              >
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>🔌 لوحة التجارب (Breadboard)</span>
              </button>
            )}

            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/20"
            >
              <FileText className="w-4 h-4" />
              <span>تقرير التجربة الأكاديمي</span>
            </button>
          </div>
        </div>
      </div>

      {/* 15 Experiments Horizontal Carousel / Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>قائمة التجارب الخمس عشرة (James M. Fiore DC Manual):</span>
          </span>
          <span className="text-slate-400 font-mono">
            التجربة الحالية: #{currentExp.number} من 15
          </span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
          {FIORE_DC_EXPERIMENTS.map((exp) => {
            const isSelected = exp.id === selectedExpId;
            const isDone = savedReports.some(r => r.experimentNumber === exp.number);

            return (
              <button
                key={exp.id}
                onClick={() => handleSelectExperiment(exp)}
                className={`flex flex-col text-start p-3 rounded-2xl min-w-[210px] sm:min-w-[230px] border transition-all shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    تجربة #{exp.number}
                  </span>
                  {isDone && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      مكتملة
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold truncate block">{exp.titleAr}</span>
                <span className="text-[10px] text-slate-400 truncate block mt-0.5">{exp.titleEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Lab Tabs Nav */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-2">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveLabTab('workbench')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeLabTab === 'workbench'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>لوحة تركيب الدائرة</span>
          </button>

          <button
            onClick={() => setActiveLabTab('meters')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeLabTab === 'meters'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>أجهزة القياس DMM</span>
          </button>

          <button
            onClick={() => setActiveLabTab('table')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeLabTab === 'table'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>جدول القياسات ونسبة الخطأ</span>
          </button>

          <button
            onClick={() => setActiveLabTab('charts')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeLabTab === 'charts'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>الرسوم البيانية الحية</span>
          </button>

          <button
            onClick={() => setActiveLabTab('colorcode')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeLabTab === 'colorcode'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>شفرة ألوان المقاومات</span>
          </button>

          <button
            onClick={() => setActiveLabTab('quizzes')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeLabTab === 'quizzes'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Award className="w-4 h-4 text-purple-400" />
            <span>الاختبار القبلي والبعدي</span>
          </button>

          <button
            onClick={() => setActiveLabTab('history')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeLabTab === 'history'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>سجل التجارب ({savedReports.length})</span>
          </button>
        </div>

        {/* Global Simulation & Circuit Persistence Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
              isSimulating
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-rose-500 text-white'
            }`}
          >
            {isSimulating ? <Play className="w-3.5 h-3.5 fill-current" /> : <Square className="w-3.5 h-3.5 fill-current" />}
            <span>{isSimulating ? 'المحاكاة نشطة' : 'المحاكاة متوقفة'}</span>
          </button>

          <button
            onClick={handleResetCircuit}
            className="p-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs"
            title="إعادة ضبط الدائرة لمخطط التجربة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSaveCircuit}
            className="p-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-cyan-400 rounded-xl text-xs"
            title="حفظ الدائرة"
          >
            <Save className="w-4 h-4" />
          </button>

          <button
            onClick={handleLoadCircuit}
            className="p-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-purple-400 rounded-xl text-xs"
            title="استرجاع الدائرة المحفوظة"
          >
            <FolderOpen className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Solver Diagnostics Banner */}
      {simResult.diagnosticMessages.length > 0 && (
        <div className="space-y-1.5">
          {simResult.diagnosticMessages.map((diag, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                diag.type === 'error'
                  ? 'bg-rose-950/70 border-rose-500/50 text-rose-200'
                  : diag.type === 'warning'
                  ? 'bg-amber-950/70 border-amber-500/50 text-amber-200'
                  : diag.type === 'success'
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {diag.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                {diag.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                {diag.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                <span>{diag.messageAr}</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400 hidden sm:inline-block">MNA Solved</span>
            </div>
          ))}
        </div>
      )}

      {/* Tab 1: Workbench Canvas */}
      {activeLabTab === 'workbench' && (
        <CircuitCanvas
          components={components}
          wires={wires}
          simulationResult={simResult}
          isSimulating={isSimulating}
          onUpdateComponents={setComponents}
          onUpdateWires={setWires}
        />
      )}

      {/* Tab 2: Instruments Rack */}
      {activeLabTab === 'meters' && (
        <InstrumentsRack
          components={components}
          simulationResult={simResult}
          isSimulating={isSimulating}
        />
      )}

      {/* Tab 3: Table of Measurements & Percent Error */}
      {activeLabTab === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">جدول القياسات الحقيقية والمقارنة النظرية</h4>
              <p className="text-xs text-slate-400">حساب فوري لنسبة الخطأ % بناءً على نموذج المحاكاة والأجهزة</p>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow"
            >
              <FileText className="w-4 h-4" />
              <span>تضمين في تقرير التجربة</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-300 border-b border-slate-800">
                  <th className="p-3 text-start">#</th>
                  <th className="p-3 text-start">الكمية المقاسة</th>
                  <th className="p-3 text-start">الرمز</th>
                  <th className="p-3 text-start">القيمة النظرية</th>
                  <th className="p-3 text-start">المقاس بالمحاكاة</th>
                  <th className="p-3 text-start">الوحدة</th>
                  <th className="p-3 text-start">نسبة الخطأ %</th>
                  <th className="p-3 text-start">ملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {measurements.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3 font-bold text-white">{m.quantityNameAr}</td>
                    <td className="p-3 font-mono text-cyan-400">{m.symbol}</td>
                    <td className="p-3 font-mono">{m.theoreticalValue.toFixed(3)}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{m.measuredValue.toFixed(3)}</td>
                    <td className="p-3 font-mono text-slate-400">{m.unit}</td>
                    <td className="p-3 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          m.percentError < 5
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {m.percentError.toFixed(2)}%
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-slate-400">{m.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Charts */}
      {activeLabTab === 'charts' && (
        <ResultsCharts
          simulationResult={simResult}
          components={components}
          experimentNumber={currentExp.number}
        />
      )}

      {/* Tab 5: Resistor Color Code Tool (Experiment 3) */}
      {activeLabTab === 'colorcode' && <ResistorColorCodeTool />}

      {/* Tab 6: Pre-Quiz & Post-Quiz */}
      {activeLabTab === 'quizzes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pre-Quiz */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                الاختبار القبلي (Pre-Lab Assessment)
              </h4>
              {preQuizSubmitted && (
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                  النتيجة: {preScore} / {currentExp.preQuiz.length}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {currentExp.preQuiz.map((q, idx) => (
                <div key={q.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                  <span className="font-bold text-slate-200 block">
                    {idx + 1}. {q.questionAr}
                  </span>
                  <div className="space-y-1.5">
                    {q.optionsAr.map((opt, oIdx) => {
                      const isSelected = preQuizAnswers[q.id] === oIdx;
                      const isCorrect = q.correctIndex === oIdx;
                      return (
                        <button
                          key={oIdx}
                          disabled={preQuizSubmitted}
                          onClick={() => setPreQuizAnswers({ ...preQuizAnswers, [q.id]: oIdx })}
                          className={`w-full text-start p-2.5 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          } ${
                            preQuizSubmitted && isCorrect
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                              : ''
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {preQuizSubmitted && (
                    <p className="text-[11px] text-cyan-400 bg-slate-900 p-2 rounded-lg mt-2">
                      💡 {q.explanationAr}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {!preQuizSubmitted && (
              <button
                onClick={() => setPreQuizSubmitted(true)}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow"
              >
                تسليم إجابات الاختبار القبلي
              </button>
            )}
          </div>

          {/* Post-Quiz */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                الاختبار البعدي وتأكيد المفاهيم (Post-Lab Quiz)
              </h4>
              {postQuizSubmitted && (
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                  النتيجة: {postScore} / {currentExp.postQuiz.length}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {currentExp.postQuiz.map((q, idx) => (
                <div key={q.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                  <span className="font-bold text-slate-200 block">
                    {idx + 1}. {q.questionAr}
                  </span>
                  <div className="space-y-1.5">
                    {q.optionsAr.map((opt, oIdx) => {
                      const isSelected = postQuizAnswers[q.id] === oIdx;
                      const isCorrect = q.correctIndex === oIdx;
                      return (
                        <button
                          key={oIdx}
                          disabled={postQuizSubmitted}
                          onClick={() => setPostQuizAnswers({ ...postQuizAnswers, [q.id]: oIdx })}
                          className={`w-full text-start p-2.5 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-purple-500/20 border-purple-400 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          } ${
                            postQuizSubmitted && isCorrect
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                              : ''
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {postQuizSubmitted && (
                    <p className="text-[11px] text-purple-400 bg-slate-900 p-2 rounded-lg mt-2">
                      💡 {q.explanationAr}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {!postQuizSubmitted && (
              <button
                onClick={() => setPostQuizSubmitted(true)}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow"
              >
                تسليم إجابات الاختبار البعدي
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 7: History of Saved Reports */}
      {activeLabTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">سجل تقارير التجارب المنجزة</h4>
              <p className="text-xs text-slate-400">جميع تقاريرك المحفوظة مع الدرجات والنتائج المخبرية</p>
            </div>
            <span className="text-xs text-cyan-400 font-mono">{savedReports.length} تقارير محفوظة</span>
          </div>

          {savedReports.length === 0 ? (
            <div className="text-center py-10 space-y-2 text-slate-500 text-xs">
              <History className="w-8 h-8 mx-auto text-slate-600" />
              <p>لم تحفظ أي تقارير تجارب بعد. قم بإجراء التجربة ثم اضغط "تقرير التجربة الأكاديمي" لحفظه.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedReports.map((r) => (
                <div key={r.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">تجربة #{r.experimentNumber}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{r.date}</span>
                  </div>
                  <h5 className="font-bold text-white text-xs leading-snug">{r.experimentTitle}</h5>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>عدد القياسات: {r.measurements.length}</span>
                    <span className="text-emerald-400 font-bold">الدرجة: {r.grade ?? 100}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showGuideModal && (
        <ExperimentGuideModal
          experiment={currentExp}
          onClose={() => setShowGuideModal(false)}
          onOpenReport={() => {
            setShowGuideModal(false);
            setShowReportModal(true);
          }}
        />
      )}

      {showReportModal && (
        <LabReportModal
          experiment={currentExp}
          measurements={measurements}
          preQuizScore={{ score: preScore, total: currentExp.preQuiz.length }}
          postQuizScore={{ score: postScore, total: currentExp.postQuiz.length }}
          onClose={() => setShowReportModal(false)}
          onSaveReport={handleSaveReport}
        />
      )}
    </div>
  );
};

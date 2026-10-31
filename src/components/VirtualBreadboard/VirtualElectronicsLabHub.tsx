import React, { useState, useEffect } from 'react';
import { CircuitElement, CircuitWire, ComponentType, SimulationResult } from '../../types/dcLab';
import { DcCircuitSolver } from '../../utils/dcCircuitSolver';
import { AudioSpeechEngine } from '../../utils/audioSpeechEngine';
import { BreadboardCanvas } from './BreadboardCanvas';
import { ElectronicsLibraryDrawer } from './ElectronicsLibraryDrawer';
import { OscilloscopeModal } from './OscilloscopeModal';
import { LectureToLabModal } from './LectureToLabModal';
import { SchematicViewModal } from './SchematicViewModal';
import {
  Zap,
  Play,
  Square,
  RotateCcw,
  Save,
  FolderOpen,
  Sparkles,
  Activity,
  Eye,
  FileText,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Camera,
  Trash2,
  X
} from 'lucide-react';

interface SavedCircuitRecord {
  id: string;
  name: string;
  date: string;
  components: CircuitElement[];
  wires: CircuitWire[];
}

interface Props {
  onNavigateToFioreLab?: () => void;
}

export const VirtualElectronicsLabHub: React.FC<Props> = ({ onNavigateToFioreLab }) => {
  // Initial default circuit: 9V battery with switch, resistor, and LED on breadboard
  const defaultComponents: CircuitElement[] = [
    {
      id: 'bat_1',
      type: 'battery',
      name: 'BAT1',
      value: 9,
      unit: 'V',
      x: 100,
      y: 110,
      rotation: 0,
      terminals: [
        { id: 't1', x: 0, y: -25, label: '+' },
        { id: 't2', x: 0, y: 25, label: '-' },
      ],
    },
    {
      id: 'sw_1',
      type: 'switch',
      name: 'SW1',
      value: 1,
      unit: '',
      isOpen: false,
      x: 230,
      y: 90,
      rotation: 0,
      terminals: [
        { id: 't1', x: -30, y: 0 },
        { id: 't2', x: 30, y: 0 },
      ],
    },
    {
      id: 'res_1',
      type: 'resistor',
      name: 'R1',
      value: 470,
      unit: 'Ω',
      x: 360,
      y: 90,
      rotation: 0,
      terminals: [
        { id: 't1', x: -30, y: 0 },
        { id: 't2', x: 30, y: 0 },
      ],
    },
    {
      id: 'led_1',
      type: 'led',
      name: 'LED1',
      value: 2.0,
      unit: 'V',
      forwardDrop: 1.8,
      x: 480,
      y: 140,
      rotation: 90,
      terminals: [
        { id: 't1', x: 0, y: -20, label: 'A' },
        { id: 't2', x: 0, y: 20, label: 'K' },
      ],
    },
    {
      id: 'gnd_1',
      type: 'ground',
      name: 'GND',
      value: 0,
      unit: '',
      x: 100,
      y: 240,
      rotation: 0,
      terminals: [{ id: 't1', x: 0, y: -15 }],
    },
  ];

  const defaultWires: CircuitWire[] = [
    { id: 'w1', fromComponentId: 'bat_1', fromTerminalId: 't1', toComponentId: 'sw_1', toTerminalId: 't1', color: '#ef4444' },
    { id: 'w2', fromComponentId: 'sw_1', fromTerminalId: 't2', toComponentId: 'res_1', toTerminalId: 't1', color: '#ef4444' },
    { id: 'w3', fromComponentId: 'res_1', fromTerminalId: 't2', toComponentId: 'led_1', toTerminalId: 't1', color: '#ef4444' },
    { id: 'w4', fromComponentId: 'led_1', fromTerminalId: 't2', toComponentId: 'bat_1', toTerminalId: 't2', color: '#3b82f6' },
    { id: 'w5', fromComponentId: 'bat_1', fromTerminalId: 't2', toComponentId: 'gnd_1', toTerminalId: 't1', color: '#10b981' },
  ];

  const [components, setComponents] = useState<CircuitElement[]>(defaultComponents);
  const [wires, setWires] = useState<CircuitWire[]>(defaultWires);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [selectedWireColor, setSelectedWireColor] = useState<string>('#ef4444');

  // Simulation result
  const [simResult, setSimResult] = useState<SimulationResult>(() =>
    DcCircuitSolver.solve(defaultComponents, defaultWires)
  );

  // Modals state
  const [showOscilloscope, setShowOscilloscope] = useState<boolean>(false);
  const [showLectureModal, setShowLectureModal] = useState<boolean>(false);
  const [showSchematic, setShowSchematic] = useState<boolean>(false);
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [saveCircuitName, setSaveCircuitName] = useState<string>('دائرتي المخصصة');
  const [showSavedList, setShowSavedList] = useState<boolean>(false);

  // Voice narration state
  const [isDoctorSpeaking, setIsDoctorSpeaking] = useState<boolean>(false);
  const audioEngine = AudioSpeechEngine.getInstance();

  // Saved circuits in localStorage
  const [savedCircuits, setSavedCircuits] = useState<SavedCircuitRecord[]>(() => {
    const raw = localStorage.getItem('mechatronics_saved_breadboards');
    return raw ? JSON.parse(raw) : [];
  });

  // Solve circuit whenever elements change
  useEffect(() => {
    if (isSimulating) {
      const res = DcCircuitSolver.solve(components, wires);
      setSimResult(res);
    }
  }, [components, wires, isSimulating]);

  // Add component handler
  const handleAddComponent = (type: ComponentType) => {
    const id = `${type}_${Date.now().toString(36)}`;
    let name = type.toUpperCase();
    let value = 1000;
    let unit = 'Ω';
    let terminals = [
      { id: 't1', x: -30, y: 0, label: '1' },
      { id: 't2', x: 30, y: 0, label: '2' },
    ];

    if (type === 'dc_source') {
      name = `V${components.filter((c) => c.type === 'dc_source').length + 1}`;
      value = 12;
      unit = 'V';
      terminals = [
        { id: 't1', x: -20, y: 0, label: '+' },
        { id: 't2', x: 20, y: 0, label: '-' },
      ];
    } else if (type === 'battery') {
      name = `BAT${components.filter((c) => c.type === 'battery').length + 1}`;
      value = 9;
      unit = 'V';
      terminals = [
        { id: 't1', x: 0, y: -25, label: '+' },
        { id: 't2', x: 0, y: 25, label: '-' },
      ];
    } else if (type === 'resistor') {
      name = `R${components.filter((c) => c.type === 'resistor').length + 1}`;
      value = 1000;
      unit = 'Ω';
    } else if (type === 'potentiometer') {
      name = `POT${components.filter((c) => c.type === 'potentiometer').length + 1}`;
      value = 10000;
      unit = 'Ω';
      terminals = [
        { id: 't1', x: -30, y: -15, label: '1' },
        { id: 't2', x: -30, y: 15, label: '2' },
        { id: 't3', x: 30, y: 0, label: 'W' },
      ];
    } else if (type === 'diode') {
      name = `D${components.filter((c) => c.type === 'diode').length + 1}`;
      value = 0.7;
      unit = 'V';
      terminals = [
        { id: 't1', x: -25, y: 0, label: 'A' },
        { id: 't2', x: 25, y: 0, label: 'K' },
      ];
    } else if (type === 'led') {
      name = `LED${components.filter((c) => c.type === 'led').length + 1}`;
      value = 2.0;
      unit = 'V';
      terminals = [
        { id: 't1', x: -20, y: 0, label: 'A' },
        { id: 't2', x: 20, y: 0, label: 'K' },
      ];
    } else if (type === 'npn_bjt') {
      name = `Q${components.filter((c) => c.type === 'npn_bjt').length + 1}`;
      value = 100;
      unit = 'hFE';
      terminals = [
        { id: 't1', x: -20, y: 0, label: 'B' },
        { id: 't2', x: 0, y: -25, label: 'C' },
        { id: 't3', x: 0, y: 25, label: 'E' },
      ];
    } else if (type === 'pnp_bjt') {
      name = `Q_pnp${components.filter((c) => c.type === 'pnp_bjt').length + 1}`;
      value = 100;
      unit = 'hFE';
      terminals = [
        { id: 't1', x: -20, y: 0, label: 'B' },
        { id: 't2', x: 0, y: -25, label: 'C' },
        { id: 't3', x: 0, y: 25, label: 'E' },
      ];
    } else if (type === 'n_mosfet') {
      name = `M_fet${components.filter((c) => c.type === 'n_mosfet').length + 1}`;
      value = 2.0; // Vth
      unit = 'Vth';
      terminals = [
        { id: 't1', x: -25, y: 0, label: 'G' },
        { id: 't2', x: 0, y: -25, label: 'D' },
        { id: 't3', x: 0, y: 25, label: 'S' },
      ];
    } else if (type === 'dc_motor') {
      name = `M${components.filter((c) => c.type === 'dc_motor').length + 1}`;
      value = 12;
      unit = 'V';
    } else if (type === 'relay') {
      name = `RLY${components.filter((c) => c.type === 'relay').length + 1}`;
      value = 5;
      unit = 'V';
      terminals = [
        { id: 't1', x: -25, y: -15, label: 'Coil1' },
        { id: 't2', x: -25, y: 15, label: 'Coil2' },
        { id: 't3', x: 25, y: -15, label: 'COM' },
        { id: 't4', x: 25, y: 15, label: 'NO' },
      ];
    } else if (type === 'bulb') {
      name = `LAMP${components.filter((c) => c.type === 'bulb').length + 1}`;
      value = 12;
      unit = 'V';
    } else if (type === 'buzzer') {
      name = `BUZZ${components.filter((c) => c.type === 'buzzer').length + 1}`;
      value = 5;
      unit = 'V';
    } else if (type === 'switch') {
      name = `SW${components.filter((c) => c.type === 'switch').length + 1}`;
      value = 1;
      unit = '';
    } else if (type === 'pushbutton') {
      name = `PB${components.filter((c) => c.type === 'pushbutton').length + 1}`;
      value = 1;
      unit = '';
    } else if (type === 'ground') {
      name = 'GND';
      value = 0;
      unit = '';
      terminals = [{ id: 't1', x: 0, y: -15, label: 'GND' }];
    }

    const newComp: CircuitElement = {
      id,
      type,
      name,
      value,
      unit,
      x: 180 + (components.length % 6) * 50,
      y: 120 + (components.length % 3) * 60,
      rotation: 0,
      terminals,
    };

    setComponents([...components, newComp]);
  };

  // Reset breadboard
  const handleResetBreadboard = () => {
    setComponents(defaultComponents);
    setWires(defaultWires);
    setIsSimulating(true);
  };

  // Save circuit
  const handleSaveCircuit = () => {
    if (!saveCircuitName.trim()) return;
    const record: SavedCircuitRecord = {
      id: `circuit_${Date.now()}`,
      name: saveCircuitName,
      date: new Date().toLocaleDateString('ar-EG'),
      components,
      wires,
    };
    const updated = [record, ...savedCircuits];
    setSavedCircuits(updated);
    localStorage.setItem('mechatronics_saved_breadboards', JSON.stringify(updated));
    setShowSaveDialog(false);
    alert(`تم حفظ الدائرة «${saveCircuitName}» بنجاح.`);
  };

  // Load a saved circuit
  const handleLoadSavedCircuit = (circuit: SavedCircuitRecord) => {
    setComponents(circuit.components);
    setWires(circuit.wires);
    setShowSavedList(false);
  };

  // Doctor Mechatronics voice guidance
  const handleToggleDoctorSpeech = async () => {
    if (isDoctorSpeaking) {
      audioEngine.stop();
      setIsDoctorSpeaking(false);
    } else {
      setIsDoctorSpeaking(true);
      const text =
        'مرحباً بك يا مهندس في لوحة التجارب العملية الافتراضية. يمكنك سحب أي عنصر كهربائي أو إلكتروني وتركيبه بحرية على اللوحة، وتوصيل الأسلاك بين نقاط التوصيل. المحرك الرياضي يحسب الجهد والتيار اللحظي بدقة، وسينبهك عند حدوث أي قصر أو توصيل خاطئ.';
      await audioEngine.speak(text, { persona: 'male', engine: 'native_hd' });
      setIsDoctorSpeaking(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-5 sm:p-7 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/20 shrink-0">
              <img
                src="/assets/aistudio/file_00000000d6648210a5de34ab1bae4073_9f4c464e.png"
                alt="Doctor Mechatronics"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold">
                <Cpu className="w-3.5 h-3.5" />
                <span>المختبر الإلكتروني الشامل • لوحة تجارب Breadboard حقيقية</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mt-1">
                لوحة التجارب العملية الافتراضية (Virtual Electronics Lab)
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                بناء وتوصيل دوائر المحاضرات بحرية تامة على لوحة Breadboard واقعية، مع محاكاة MNA حقيقية ورسم المخطط الرمزي
              </p>
            </div>
          </div>

          {/* Quick Top Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleToggleDoctorSpeech}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                isDoctorSpeaking
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              {isDoctorSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              <span>{isDoctorSpeaking ? 'إيقاف صوت المعلم' : 'شرح صوتي تفاعلي'}</span>
            </button>

            <button
              onClick={() => setShowLectureModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>حوّل محاضرتك إلى تجربة</span>
            </button>

            <button
              onClick={() => setShowOscilloscope(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-yellow-500/30 rounded-xl text-xs font-bold"
            >
              <Activity className="w-4 h-4" />
              <span>راسم الإشارة (Oscilloscope)</span>
            </button>

            <button
              onClick={() => setShowSchematic(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold"
            >
              <Eye className="w-4 h-4" />
              <span>المخطط الرمزي للدائرة</span>
            </button>

            {onNavigateToFioreLab && (
              <button
                onClick={onNavigateToFioreLab}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition-all"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>تجارب DC (Fiore)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Simulation Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md ${
              isSimulating
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                : 'bg-rose-500 text-white shadow-rose-500/20'
            }`}
          >
            {isSimulating ? <Play className="w-3.5 h-3.5 fill-current" /> : <Square className="w-3.5 h-3.5 fill-current" />}
            <span>{isSimulating ? 'المحاكاة نشطة (Running)' : 'المحاكاة متوقفة (Paused)'}</span>
          </button>

          <button
            onClick={handleResetBreadboard}
            className="flex items-center gap-1 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold"
            title="إعادة ضبط اللوحة"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط اللوحة</span>
          </button>
        </div>

        {/* Persistence Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold"
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ الدائرة باسم</span>
          </button>

          <button
            onClick={() => setShowSavedList(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-purple-400 border border-purple-500/30 rounded-xl text-xs font-bold"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>الدوائر المحفوظة ({savedCircuits.length})</span>
          </button>
        </div>
      </div>

      {/* Diagnostics Banner */}
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
              <span className="font-mono text-[10px] text-slate-400 hidden sm:inline-block">MNA Real Solver</span>
            </div>
          ))}
        </div>
      )}

      {/* Breadboard Visual Canvas */}
      <BreadboardCanvas
        components={components}
        wires={wires}
        simulationResult={simResult}
        isSimulating={isSimulating}
        selectedWireColor={selectedWireColor}
        onUpdateComponents={setComponents}
        onUpdateWires={setWires}
      />

      {/* Expandable Electronics Component Palette */}
      <ElectronicsLibraryDrawer
        onAddComponent={handleAddComponent}
        selectedWireColor={selectedWireColor}
        onSelectWireColor={setSelectedWireColor}
        onOpenOscilloscope={() => setShowOscilloscope(true)}
        onOpenLectureModal={() => setShowLectureModal(true)}
      />

      {/* Live Measurements & Results Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h4 className="font-bold text-white text-sm sm:text-base">
              جدول الحسابات والقياسات الحقيقية للفروع (Calculations Table)
            </h4>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            القدرة الكلية المستهلكة: {(simResult.totalPowerDissipated * 1000).toFixed(1)} mW
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-300 border-b border-slate-800">
                <th className="p-3 text-start">المكون</th>
                <th className="p-3 text-start">النوع</th>
                <th className="p-3 text-start">القيمة الاسمية</th>
                <th className="p-3 text-start">فرق الجهد (V)</th>
                <th className="p-3 text-start">التيار المار (mA)</th>
                <th className="p-3 text-start">القدرة (mW)</th>
                <th className="p-3 text-start">الحالة التشغيلية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {components.map((c) => {
                const sim = simResult.elementData[c.id];
                const v = sim ? Math.abs(sim.voltageDrop) : 0;
                const i = sim ? Math.abs(sim.current) * 1000 : 0;
                const p = sim ? sim.power * 1000 : 0;

                return (
                  <tr key={c.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-white">{c.name}</td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{c.type}</td>
                    <td className="p-3 font-mono text-cyan-400">{c.value} {c.unit}</td>
                    <td className="p-3 font-mono">{v.toFixed(3)} V</td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">{i.toFixed(2)} mA</td>
                    <td className="p-3 font-mono">{p.toFixed(2)} mW</td>
                    <td className="p-3 text-[11px]">
                      {c.isGlowing ? (
                        <span className="text-amber-400 font-bold">💡 مضيء</span>
                      ) : c.motorRpm && c.motorRpm > 10 ? (
                        <span className="text-cyan-400 font-bold">⚙️ يدور ({c.motorRpm} RPM)</span>
                      ) : c.isEnergized ? (
                        <span className="text-purple-400 font-bold">🔀 مفعّل</span>
                      ) : (
                        <span className="text-slate-500">جاهز</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Oscilloscope Modal */}
      {showOscilloscope && (
        <OscilloscopeModal
          ch1Voltage={components[0]?.value || 5.0}
          ch2Voltage={simResult.elementData[components[1]?.id]?.voltageDrop || 2.5}
          freq={50}
          isSimulating={isSimulating}
          onClose={() => setShowOscilloscope(false)}
        />
      )}

      {/* Lecture-to-Lab Modal */}
      {showLectureModal && (
        <LectureToLabModal
          onLoadExtractedCircuit={(comps, w, topicName) => {
            setComponents(comps);
            setWires(w);
            setIsSimulating(true);
            alert(`تم تركيب تجربة «${topicName}» على لوحة التجارب بنجاح!`);
          }}
          onClose={() => setShowLectureModal(false)}
        />
      )}

      {/* Schematic View Modal */}
      {showSchematic && (
        <SchematicViewModal
          components={components}
          wires={wires}
          simulationResult={simResult}
          onClose={() => setShowSchematic(false)}
        />
      )}

      {/* Save Circuit Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h5 className="font-bold text-white text-sm">حفظ دائرة لوحة التجارب باسم</h5>
            <input
              type="text"
              value={saveCircuitName}
              onChange={(e) => setSaveCircuitName(e.target.value)}
              placeholder="اسم الدائرة..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveCircuit}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Circuits List Modal */}
      {showSavedList && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h5 className="font-bold text-white text-sm">الدوائر المحفوظة مسبقاً</h5>
              <button onClick={() => setShowSavedList(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {savedCircuits.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">لا توجد دوائر محفوظة بعد.</p>
              ) : (
                savedCircuits.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-white block">{c.name}</strong>
                      <span className="text-[10px] text-slate-500 font-mono">{c.date} • {c.components.length} عناصر</span>
                    </div>
                    <button
                      onClick={() => handleLoadSavedCircuit(c)}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs"
                    >
                      فتح وتطبيق
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

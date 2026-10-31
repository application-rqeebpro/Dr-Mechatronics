import React, { useState, useEffect } from 'react';
import {
  CwComponent,
  CwWire,
  CwFlowchartNode,
  ViewMode,
  WorkspaceTab,
  ComponentCategory,
  SampleCircuitProject
} from '../../types/circuitWizard';
import { SAMPLE_CIRCUIT_PROJECTS } from '../../data/circuitWizardSamples';
import { CircuitWizardSolver } from '../../utils/circuitWizardSolver';
import { AudioSpeechEngine } from '../../utils/audioSpeechEngine';
import { ComponentGalleryTree } from './ComponentGalleryTree';
import { SchematicCanvas } from './SchematicCanvas';
import { PcbLayoutCanvas } from './PcbLayoutCanvas';
import { FlowchartCanvas } from './FlowchartCanvas';
import { BillOfMaterialsView } from './BillOfMaterialsView';
import { AssistantPanel } from './AssistantPanel';
import {
  Zap,
  Play,
  Pause,
  Square,
  RotateCcw,
  FilePlus,
  FolderOpen,
  Save,
  Printer,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Layers,
  Activity,
  Cpu,
  HelpCircle,
  Sparkles,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  Wand2,
  Eye
} from 'lucide-react';

interface Props {
  onNavigateToBreadboard?: () => void;
  onNavigateToFioreLab?: () => void;
}

export const CircuitWizardHub: React.FC<Props> = ({
  onNavigateToBreadboard,
  onNavigateToFioreLab,
}) => {
  // Active Project State
  const [activeProject, setActiveProject] = useState<SampleCircuitProject>(
    SAMPLE_CIRCUIT_PROJECTS[0]
  );

  const [components, setComponents] = useState<CwComponent[]>(activeProject.components);
  const [wires, setWires] = useState<CwWire[]>(activeProject.wires);
  const [flowchartNodes, setFlowchartNodes] = useState<CwFlowchartNode[]>(
    activeProject.flowchart || []
  );

  // Simulation Active State
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Active View Mode (Normal, Voltage Levels, Current Flow, Logic Levels, Breadboard)
  const [viewMode, setViewMode] = useState<ViewMode>('normal');

  // Active Workspace Tab (Circuit Diagram, PCB Layout, Flowchart, Bill of Materials)
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('circuit_diagram');

  // Active Right Sidebar Tab (Gallery, Assistant, Program)
  const [rightSidebarTab, setRightSidebarTab] = useState<'gallery' | 'assistant' | 'program'>(
    'gallery'
  );

  // Menu Dropdown Open State
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Audio Guidance
  const [isDoctorSpeaking, setIsDoctorSpeaking] = useState<boolean>(false);
  const audioEngine = AudioSpeechEngine.getInstance();

  // Run Solver on Components/Wires change
  const solverResult = CircuitWizardSolver.solve(components, wires);

  // Handle Load Project from Assistant / Sample Circuits
  const handleLoadProject = (proj: SampleCircuitProject) => {
    setActiveProject(proj);
    setComponents(proj.components);
    setWires(proj.wires);
    if (proj.flowchart) setFlowchartNodes(proj.flowchart);
    setIsSimulating(true);
  };

  // Add Component from Gallery Tree
  const handleAddComponent = (type: string, category: ComponentCategory) => {
    const id = `comp_${Date.now()}`;
    const name = `${type.toUpperCase()}_${components.length + 1}`;

    const newComp: CwComponent = {
      id,
      type,
      category,
      name,
      value: type === 'resistor' ? 10 : type === 'capacitor' ? 100 : 9,
      unit: type === 'resistor' ? 'kΩ' : type === 'capacitor' ? 'μF' : 'V',
      x: 200 + (components.length % 5) * 40,
      y: 150 + (components.length % 3) * 40,
      pcbX: 100 + (components.length % 4) * 50,
      pcbY: 80 + (components.length % 3) * 50,
      rotation: 0,
      pins: [
        { id: 'p1', name: '1', x: -25, y: 0, pcbX: -15, pcbY: 0 },
        { id: 'p2', name: '2', x: 25, y: 0, pcbX: 15, pcbY: 0 },
      ],
      package: 'DIP-8',
      footprint: {
        width: 30,
        height: 20,
        pads: [
          { id: 'p1', x: -10, y: 0, holeRadius: 2.5, padRadius: 5 },
          { id: 'p2', x: 10, y: 0, holeRadius: 2.5, padRadius: 5 },
        ],
      },
      costEst: 0.25,
      descriptionAr: 'قطعة مضافة من مكتبة Circuit Wizard',
      descriptionEn: 'Added component',
    };

    setComponents([...components, newComp]);
  };

  // Speech Explanation
  const handleToggleDoctorSpeech = async () => {
    if (isDoctorSpeaking) {
      audioEngine.stop();
      setIsDoctorSpeaking(false);
    } else {
      setIsDoctorSpeaking(true);
      const speech = `أهلاً بك يا مهندس في بيئة Circuit Wizard. مشروعك الحالي هو ${activeProject.titleAr}. يمكنك التبديل بين وضع الجهد Voltage Levels، سريان التيار Current Flow، المخطط المنطقي، وطباعة اللوحة المطبوعة PCB بكل سهولة.`;
      await audioEngine.speak(speech, { persona: 'male', engine: 'native_hd' });
      setIsDoctorSpeaking(false);
    }
  };

  return (
    <div className="space-y-4 py-2 font-sans select-none">
      {/* Circuit Wizard Title Bar & Window Header matching Photos 1, 2, 3! */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Window Title Bar */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-mono font-bold text-slate-200">
            <span className="text-cyan-400">Circuit Wizard</span>
            <span className="text-slate-500">-</span>
            <span className="text-slate-300">[{activeProject.titleAr}]</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Student Edition Badge matching photo 1,2,3! */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 text-[10px] font-bold">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>Home Use - Student Edition</span>
            </div>

            <button
              onClick={handleToggleDoctorSpeech}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                isDoctorSpeaking
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
              }`}
            >
              {isDoctorSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isDoctorSpeaking ? 'إيقاف الصوت' : 'شرح المعلم الذكي'}</span>
            </button>
          </div>
        </div>

        {/* Desktop Classic Menu Bar: File | Edit | View | Project | Window | Help */}
        <div className="bg-slate-900 px-3 py-1 border-b border-slate-800 flex items-center gap-4 text-xs font-medium text-slate-300 relative">
          {['File', 'Edit', 'View', 'Project', 'Simulation', 'Window', 'Help'].map((menu) => (
            <div key={menu} className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                className={`px-2 py-1 rounded hover:bg-slate-800 transition-colors ${
                  activeMenu === menu ? 'bg-slate-800 text-cyan-400 font-bold' : ''
                }`}
              >
                {menu}
              </button>

              {/* Dropdown Menu Items */}
              {activeMenu === menu && (
                <div className="absolute top-full start-0 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 text-xs">
                  {menu === 'File' && (
                    <>
                      <button onClick={() => setActiveMenu(null)} className="w-full text-start px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between">
                        <span>New Project</span> <span className="font-mono text-[10px] text-slate-500">Ctrl+N</span>
                      </button>
                      <button onClick={() => setActiveMenu(null)} className="w-full text-start px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between">
                        <span>Open Sample Circuit</span> <span className="font-mono text-[10px] text-slate-500">Ctrl+O</span>
                      </button>
                      <button onClick={() => setActiveMenu(null)} className="w-full text-start px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between">
                        <span>Save Design</span> <span className="font-mono text-[10px] text-slate-500">Ctrl+S</span>
                      </button>
                    </>
                  )}
                  {menu === 'Simulation' && (
                    <>
                      <button onClick={() => { setIsSimulating(true); setActiveMenu(null); }} className="w-full text-start px-3 py-1.5 hover:bg-slate-800 text-emerald-400">
                        ▶️ Run Simulation
                      </button>
                      <button onClick={() => { setIsSimulating(false); setActiveMenu(null); }} className="w-full text-start px-3 py-1.5 hover:bg-slate-800 text-rose-400">
                        ⏹️ Stop Simulation
                      </button>
                    </>
                  )}
                  {menu === 'Help' && (
                    <button onClick={() => { setRightSidebarTab('assistant'); setActiveMenu(null); }} className="w-full text-start px-3 py-1.5 hover:bg-slate-800 text-cyan-400">
                      💡 Guided Tour & Help
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Top Main Toolbar Icon Bar */}
        <div className="bg-slate-900/90 p-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Left Actions: New, Open, Save, Print */}
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200" title="New">
              <FilePlus className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200" title="Open">
              <FolderOpen className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200" title="Save">
              <Save className="w-4 h-4" />
            </button>
            <button onClick={() => window.print()} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200" title="Print">
              <Printer className="w-4 h-4" />
            </button>

            <span className="w-px h-5 bg-slate-800 mx-1" />

            {/* Simulation Play / Pause / Stop Buttons */}
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex items-center gap-1 px-3 py-1 rounded font-bold transition-all ${
                isSimulating ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
              }`}
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isSimulating ? 'تشغيل' : 'إيقاف'}</span>
            </button>

            <span className="w-px h-5 bg-slate-800 mx-1" />

            {/* Convert to PCB & Auto-Router Quick Buttons */}
            <button
              onClick={() => setWorkspaceTab('pcb_layout')}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-950 border border-purple-800 hover:bg-purple-900 text-purple-300 font-bold text-[11px]"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Convert to PCB Layout</span>
            </button>

            {onNavigateToBreadboard && (
              <button
                onClick={onNavigateToBreadboard}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800 hover:bg-emerald-900 text-emerald-300 font-bold text-[11px]"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>لوحة التجارب (Breadboard)</span>
              </button>
            )}
          </div>

          {/* Right quick status info */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span>Nodes: {Object.keys(solverResult.nodeVoltages).length}</span>
            <span>|</span>
            <span className={solverResult.hasShortCircuit ? 'text-rose-400 font-bold animate-pulse' : 'text-emerald-400'}>
              {solverResult.hasShortCircuit ? '🚨 SHORT CIRCUIT DETECTED' : 'Circuit Normal'}
            </span>
          </div>
        </div>

        {/* Studio Main Workspace Grid (Left Mode Bar + Main Canvas + Right Sidebar) */}
        <div className="grid grid-cols-12 h-[600px] w-full bg-slate-950 relative">
          {/* Left View Mode Bar matching Photo 1, 2, 3! */}
          <div className="col-span-1 bg-slate-900 border-e border-slate-800 flex flex-col items-center py-2 space-y-3 text-[10px] font-semibold text-slate-400">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Modes</span>

            <button
              onClick={() => setViewMode('normal')}
              className={`w-full py-2 flex flex-col items-center gap-1 transition-colors border-s-2 ${
                viewMode === 'normal'
                  ? 'bg-slate-800 text-cyan-400 border-cyan-400 font-bold'
                  : 'hover:bg-slate-800/60 border-transparent'
              }`}
              title="Normal Schematic View"
            >
              <Eye className="w-4 h-4" />
              <span>Normal</span>
            </button>

            <button
              onClick={() => setViewMode('voltage_levels')}
              className={`w-full py-2 flex flex-col items-center gap-1 transition-colors border-s-2 ${
                viewMode === 'voltage_levels'
                  ? 'bg-slate-800 text-amber-400 border-amber-400 font-bold'
                  : 'hover:bg-slate-800/60 border-transparent'
              }`}
              title="Voltage Levels Heat Map View"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Voltage</span>
            </button>

            <button
              onClick={() => setViewMode('current_flow')}
              className={`w-full py-2 flex flex-col items-center gap-1 transition-colors border-s-2 ${
                viewMode === 'current_flow'
                  ? 'bg-slate-800 text-sky-400 border-sky-400 font-bold'
                  : 'hover:bg-slate-800/60 border-transparent'
              }`}
              title="Current Flow Animated Electrons"
            >
              <Activity className="w-4 h-4 text-sky-400" />
              <span>Current</span>
            </button>

            <button
              onClick={() => setViewMode('logic_levels')}
              className={`w-full py-2 flex flex-col items-center gap-1 transition-colors border-s-2 ${
                viewMode === 'logic_levels'
                  ? 'bg-slate-800 text-emerald-400 border-emerald-400 font-bold'
                  : 'hover:bg-slate-800/60 border-transparent'
              }`}
              title="Logic Levels 0 / 1 Badges"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Logic</span>
            </button>
          </div>

          {/* Center Main Canvas Area (9 Columns) */}
          <div className="col-span-8 flex flex-col h-full overflow-hidden p-2">
            {/* Active Workspace View */}
            <div className="flex-1 h-full relative">
              {workspaceTab === 'circuit_diagram' && (
                <SchematicCanvas
                  components={components}
                  wires={wires}
                  viewMode={viewMode}
                  onUpdateComponents={setComponents}
                  onUpdateWires={setWires}
                  nodeVoltages={solverResult.nodeVoltages}
                  logicStates={solverResult.logicStates}
                />
              )}

              {workspaceTab === 'pcb_layout' && (
                <PcbLayoutCanvas
                  components={components}
                  wires={wires}
                  onUpdateComponents={setComponents}
                />
              )}

              {workspaceTab === 'flowchart' && <FlowchartCanvas initialNodes={flowchartNodes} />}

              {workspaceTab === 'bill_of_materials' && (
                <BillOfMaterialsView components={components} />
              )}
            </div>

            {/* Bottom Workspace Tabs matching Photo 1, 2, 3! */}
            <div className="mt-2 bg-slate-900 border border-slate-800 rounded-lg p-1 flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setWorkspaceTab('circuit_diagram')}
                className={`flex-1 py-1.5 rounded transition-colors text-center ${
                  workspaceTab === 'circuit_diagram'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                Circuit Diagram (المخطط الرمزي)
              </button>

              <button
                onClick={() => setWorkspaceTab('pcb_layout')}
                className={`flex-1 py-1.5 rounded transition-colors text-center ${
                  workspaceTab === 'pcb_layout'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                PCB Layout (اللوحة المطبوعة)
              </button>

              <button
                onClick={() => setWorkspaceTab('flowchart')}
                className={`flex-1 py-1.5 rounded transition-colors text-center ${
                  workspaceTab === 'flowchart'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                Flowchart (برمجة GENIE)
              </button>

              <button
                onClick={() => setWorkspaceTab('bill_of_materials')}
                className={`flex-1 py-1.5 rounded transition-colors text-center ${
                  workspaceTab === 'bill_of_materials'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                Bill of Materials (جدول التكلفة)
              </button>
            </div>
          </div>

          {/* Right Sidebar Drawer Area (3 Columns) matching Photo 1, 2, 3! */}
          <div className="col-span-3 h-full border-s border-slate-800 flex flex-col bg-slate-900">
            {/* Right Sidebar Tab Switcher */}
            <div className="flex items-center border-b border-slate-800 bg-slate-950 text-xs font-bold">
              <button
                onClick={() => setRightSidebarTab('gallery')}
                className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                  rightSidebarTab === 'gallery'
                    ? 'border-cyan-400 text-cyan-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Gallery (المكتبة)
              </button>

              <button
                onClick={() => setRightSidebarTab('assistant')}
                className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                  rightSidebarTab === 'assistant'
                    ? 'border-amber-400 text-amber-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Assistant (المساعد)
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-hidden">
              {rightSidebarTab === 'gallery' && (
                <ComponentGalleryTree onAddComponent={handleAddComponent} />
              )}

              {rightSidebarTab === 'assistant' && (
                <AssistantPanel onLoadProject={handleLoadProject} />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Classic Status Bar matching Photo 1, 2, 3! */}
        <div className="bg-slate-950 px-4 py-1.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div>Press F1 for help</div>
          <div className="flex items-center gap-4">
            <span>Zoom: 100%</span>
            <span>(None)</span>
            <span className="text-emerald-400 font-bold">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

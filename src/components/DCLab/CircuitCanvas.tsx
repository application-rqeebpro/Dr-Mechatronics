import React, { useState, useRef } from 'react';
import { CircuitElement, CircuitWire, ComponentType, SimulationResult } from '../../types/dcLab';
import {
  RotateCw,
  Trash2,
  Sliders,
  Plus,
  Minus,
  Maximize2,
  Zap,
  Power,
  RefreshCw,
  X,
  Check,
  MousePointer,
  ArrowRight
} from 'lucide-react';

interface Props {
  components: CircuitElement[];
  wires: CircuitWire[];
  simulationResult: SimulationResult;
  isSimulating: boolean;
  onUpdateComponents: (components: CircuitElement[]) => void;
  onUpdateWires: (wires: CircuitWire[]) => void;
  onSelectComponentForInspection?: (comp: CircuitElement) => void;
}

export const CircuitCanvas: React.FC<Props> = ({
  components,
  wires,
  simulationResult,
  isSimulating,
  onUpdateComponents,
  onUpdateWires,
  onSelectComponentForInspection,
}) => {
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [connectingTerminal, setConnectingTerminal] = useState<{ compId: string; termId: string } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [editingComp, setEditingComp] = useState<CircuitElement | null>(null);
  const [editValueStr, setEditValueStr] = useState<string>('1000');
  const [editWiperStr, setEditWiperStr] = useState<number>(50);

  // Dragging state
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<SVGSVGElement | null>(null);

  // Handle click on terminal to connect wire
  const handleTerminalClick = (compId: string, termId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    if (!connectingTerminal) {
      // Start connecting wire
      setConnectingTerminal({ compId, termId });
    } else {
      // Complete connecting wire
      if (connectingTerminal.compId !== compId || connectingTerminal.termId !== termId) {
        // Prevent duplicate wires between same two terminals
        const exists = wires.some(
          w =>
            (w.fromComponentId === connectingTerminal.compId &&
              w.fromTerminalId === connectingTerminal.termId &&
              w.toComponentId === compId &&
              w.toTerminalId === termId) ||
            (w.fromComponentId === compId &&
              w.fromTerminalId === termId &&
              w.toComponentId === connectingTerminal.compId &&
              w.toTerminalId === connectingTerminal.termId)
        );

        if (!exists) {
          const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
          const wireColor = colors[wires.length % colors.length];
          const newWire: CircuitWire = {
            id: `w_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            fromComponentId: connectingTerminal.compId,
            fromTerminalId: connectingTerminal.termId,
            toComponentId: compId,
            toTerminalId: termId,
            color: wireColor,
          };
          onUpdateWires([...wires, newWire]);
        }
      }
      setConnectingTerminal(null);
    }
  };

  // Rotate selected component
  const handleRotate = (compId: string) => {
    onUpdateComponents(
      components.map(c => {
        if (c.id === compId) {
          const nextRot: 0 | 90 | 180 | 270 =
            c.rotation === 0 ? 90 : c.rotation === 90 ? 180 : c.rotation === 180 ? 270 : 0;
          return { ...c, rotation: nextRot };
        }
        return c;
      })
    );
  };

  // Delete component & associated wires
  const handleDeleteComp = (compId: string) => {
    onUpdateComponents(components.filter(c => c.id !== compId));
    onUpdateWires(wires.filter(w => w.fromComponentId !== compId && w.toComponentId !== compId));
    if (selectedCompId === compId) setSelectedCompId(null);
  };

  // Delete a wire
  const handleDeleteWire = (wireId: string) => {
    onUpdateWires(wires.filter(w => w.id !== wireId));
  };

  // Toggle switch
  const handleToggleSwitch = (compId: string) => {
    onUpdateComponents(
      components.map(c => {
        if (c.id === compId && c.type === 'switch') {
          return { ...c, isOpen: !c.isOpen };
        }
        return c;
      })
    );
  };

  // Open Edit Dialog
  const handleOpenEdit = (comp: CircuitElement) => {
    setEditingComp(comp);
    setEditValueStr(String(comp.value));
    setEditWiperStr(comp.wiperPercent ?? 50);
  };

  const handleSaveEdit = () => {
    if (!editingComp) return;
    const val = parseFloat(editValueStr) || 1;
    onUpdateComponents(
      components.map(c => {
        if (c.id === editingComp.id) {
          return {
            ...c,
            value: Math.max(0.001, val),
            wiperPercent: editWiperStr,
          };
        }
        return c;
      })
    );
    setEditingComp(null);
  };

  // Add new component from palette
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
      name = `E${components.filter(c => c.type === 'dc_source').length + 1}`;
      value = 12;
      unit = 'V';
      terminals = [
        { id: 't1', x: 0, y: -30, label: '+' },
        { id: 't2', x: 0, y: 30, label: '-' },
      ];
    } else if (type === 'battery') {
      name = `BAT${components.filter(c => c.type === 'battery').length + 1}`;
      value = 9;
      unit = 'V';
      terminals = [
        { id: 't1', x: 0, y: -30, label: '+' },
        { id: 't2', x: 0, y: 30, label: '-' },
      ];
    } else if (type === 'resistor') {
      name = `R${components.filter(c => c.type === 'resistor').length + 1}`;
      value = 1000;
      unit = 'Ω';
    } else if (type === 'potentiometer') {
      name = `POT${components.filter(c => c.type === 'potentiometer').length + 1}`;
      value = 10000;
      unit = 'Ω';
      terminals = [
        { id: 't1', x: -30, y: -20, label: '1' },
        { id: 't2', x: -30, y: 20, label: '2' },
        { id: 't3', x: 30, y: 0, label: 'W' },
      ];
    } else if (type === 'switch') {
      name = `SW${components.filter(c => c.type === 'switch').length + 1}`;
      value = 1;
      unit = '';
    } else if (type === 'ground') {
      name = 'GND';
      value = 0;
      unit = '';
      terminals = [{ id: 't1', x: 0, y: -15, label: '⏚' }];
    } else if (type === 'led') {
      name = `LED${components.filter(c => c.type === 'led').length + 1}`;
      value = 2.0;
      unit = 'V';
      terminals = [
        { id: 't1', x: -30, y: 0, label: '+' },
        { id: 't2', x: 30, y: 0, label: '-' },
      ];
    } else if (type === 'capacitor') {
      name = `C${components.filter(c => c.type === 'capacitor').length + 1}`;
      value = 0.0001; // 100 uF
      unit = 'μF';
    } else if (type === 'inductor') {
      name = `L${components.filter(c => c.type === 'inductor').length + 1}`;
      value = 0.05; // 50 mH
      unit = 'mH';
    }

    const newComp: CircuitElement = {
      id,
      type,
      name,
      value,
      unit,
      x: 140 + (components.length % 5) * 60,
      y: 120 + (components.length % 3) * 50,
      rotation: 0,
      terminals,
    };

    onUpdateComponents([...components, newComp]);
    setSelectedCompId(id);
  };

  // Helper to compute absolute terminal coordinate
  const getTerminalCoord = (compId: string, termId: string): { x: number; y: number } => {
    const comp = components.find(c => c.id === compId);
    if (!comp) return { x: 0, y: 0 };
    const term = comp.terminals.find(t => t.id === termId) || comp.terminals[0];
    if (!term) return { x: comp.x, y: comp.y };

    // Apply rotation
    const rad = (comp.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rx = term.x * cos - term.y * sin;
    const ry = term.x * sin + term.y * cos;

    return { x: comp.x + rx, y: comp.y + ry };
  };

  // Mouse / Touch Dragging
  const handlePointerDown = (compId: string, e: React.PointerEvent) => {
    setDraggingCompId(compId);
    setSelectedCompId(compId);
    const comp = components.find(c => c.id === compId);
    if (comp) {
      setDragOffset({ x: e.clientX - comp.x, y: e.clientY - comp.y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingCompId) return;
    const newX = Math.round((e.clientX - dragOffset.x) / 10) * 10;
    const newY = Math.round((e.clientY - dragOffset.y) / 10) * 10;

    onUpdateComponents(
      components.map(c => {
        if (c.id === draggingCompId) {
          return { ...c, x: Math.max(40, Math.min(800, newX)), y: Math.max(40, Math.min(500, newY)) };
        }
        return c;
      })
    );
  };

  const handlePointerUp = () => {
    setDraggingCompId(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 relative select-none">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white text-xs sm:text-sm block">لوحة تركيب وتوصيل الدوائر (Virtual Breadboard)</span>
            <span className="text-[10px] text-slate-400">انقر على طرفين لتوصيل سلك، أو اسحب المكون لتحريكه</span>
          </div>
        </div>

        {/* Zoom & Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
            className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white"
            title="تصغير"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-xs text-slate-300 px-1">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))}
            className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white"
            title="تكبير"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {connectingTerminal && (
            <button
              onClick={() => setConnectingTerminal(null)}
              className="flex items-center gap-1 px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs"
            >
              <X className="w-3 h-3" />
              <span>إلغاء التوصيل</span>
            </button>
          )}

          <button
            onClick={() => onUpdateWires([])}
            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-lg text-xs font-semibold"
          >
            مسح الأسلاك
          </button>
        </div>
      </div>

      {/* SVG Canvas Area with Grid */}
      <div
        className="w-full h-[380px] sm:h-[450px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <svg
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          viewBox={`0 0 ${850 / zoomLevel} ${500 / zoomLevel}`}
          onClick={() => {
            setSelectedCompId(null);
            setConnectingTerminal(null);
          }}
        >
          {/* Breadboard Dot Matrix Grid Pattern */}
          <defs>
            <pattern id="dc-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.2" fill="#334155" />
            </pattern>
            {/* Animated Flow Pattern for Active Currents */}
            <linearGradient id="wire-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#dc-grid)" />

          {/* Render Connecting Wires */}
          {wires.map((wire) => {
            const start = getTerminalCoord(wire.fromComponentId, wire.fromTerminalId);
            const end = getTerminalCoord(wire.toComponentId, wire.toTerminalId);
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;

            return (
              <g key={wire.id} className="group cursor-pointer">
                {/* Background fat stroke for easy clicking/touching */}
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="transparent"
                  strokeWidth="16"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteWire(wire.id);
                  }}
                />

                {/* Main wire line */}
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={wire.color || '#38bdf8'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="transition-colors group-hover:stroke-rose-500"
                />

                {/* Animated Current Flow Dash when Simulating */}
                {isSimulating && (
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="4 6"
                    className="animate-pulse"
                  />
                )}

                {/* Delete wire tag on hover/click */}
                <circle
                  cx={midX}
                  cy={midY}
                  r="7"
                  fill="#ef4444"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteWire(wire.id);
                  }}
                />
              </g>
            );
          })}

          {/* Render Temporary Wire when connecting */}
          {connectingTerminal && (
            <circle
              cx={getTerminalCoord(connectingTerminal.compId, connectingTerminal.termId).x}
              cy={getTerminalCoord(connectingTerminal.compId, connectingTerminal.termId).y}
              r="8"
              fill="#ef4444"
              className="animate-ping"
            />
          )}

          {/* Render Components */}
          {components.map((comp) => {
            const isSelected = selectedCompId === comp.id;
            const sim = simulationResult.elementData[comp.id];
            const vDrop = sim ? Math.abs(sim.voltageDrop) : 0;
            const currentMa = sim ? sim.current * 1000 : 0;

            return (
              <g
                key={comp.id}
                transform={`translate(${comp.x}, ${comp.y}) rotate(${comp.rotation})`}
                onPointerDown={(e) => handlePointerDown(comp.id, e)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCompId(comp.id);
                  if (onSelectComponentForInspection) onSelectComponentForInspection(comp);
                }}
                className="cursor-move"
              >
                {/* Selection boundary box */}
                {isSelected && (
                  <rect
                    x="-45"
                    y="-35"
                    width="90"
                    height="70"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    rx="8"
                  />
                )}

                {/* Component Body Graphics based on Type */}
                {comp.type === 'dc_source' && (
                  <g>
                    <circle cx="0" cy="0" r="26" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x="0" y="-8" fill="#ef4444" fontSize="13" fontWeight="bold" textAnchor="middle">+</text>
                    <text x="0" y="16" fill="#3b82f6" fontSize="15" fontWeight="bold" textAnchor="middle">-</text>
                  </g>
                )}

                {comp.type === 'battery' && (
                  <g>
                    <rect x="-18" y="-24" width="36" height="48" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                    <rect x="-8" y="-28" width="16" height="4" fill="#f59e0b" rx="2" />
                    <text x="0" y="5" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">9V</text>
                  </g>
                )}

                {comp.type === 'resistor' && (
                  <g>
                    {/* Resistor Lead wires */}
                    <line x1="-30" y1="0" x2="-20" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                    <line x1="20" y1="0" x2="30" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                    {/* Body */}
                    <rect x="-20" y="-12" width="40" height="24" rx="4" fill="#334155" stroke="#0ea5e9" strokeWidth="2" />
                    {/* Color bands inside resistor */}
                    <rect x="-14" y="-12" width="3" height="24" fill="#92400e" />
                    <rect x="-6" y="-12" width="3" height="24" fill="#000000" />
                    <rect x="2" y="-12" width="3" height="24" fill="#dc2626" />
                    <rect x="11" y="-12" width="3" height="24" fill="#f59e0b" />
                  </g>
                )}

                {comp.type === 'potentiometer' && (
                  <g>
                    <circle cx="0" cy="0" r="24" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="0" cy="0" r="8" fill="#f59e0b" />
                    <line x1="0" y1="0" x2="16" y2="0" stroke="#f59e0b" strokeWidth="2" />
                  </g>
                )}

                {comp.type === 'switch' && (
                  <g onClick={(e) => { e.stopPropagation(); handleToggleSwitch(comp.id); }}>
                    <circle cx="-16" cy="0" r="4" fill="#94a3b8" />
                    <circle cx="16" cy="0" r="4" fill="#94a3b8" />
                    <line
                      x1="-16"
                      y1="0"
                      x2={comp.isOpen ? "8" : "16"}
                      y2={comp.isOpen ? "-16" : "0"}
                      stroke={comp.isOpen ? "#ef4444" : "#10b981"}
                      strokeWidth="3"
                    />
                  </g>
                )}

                {comp.type === 'ground' && (
                  <g>
                    <line x1="0" y1="-15" x2="0" y2="0" stroke="#10b981" strokeWidth="2.5" />
                    <line x1="-16" y1="0" x2="16" y2="0" stroke="#10b981" strokeWidth="3" />
                    <line x1="-10" y1="6" x2="10" y2="6" stroke="#10b981" strokeWidth="2.5" />
                    <line x1="-4" y1="12" x2="4" y2="12" stroke="#10b981" strokeWidth="2" />
                  </g>
                )}

                {comp.type === 'capacitor' && (
                  <g>
                    <line x1="-30" y1="0" x2="-8" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                    <line x1="8" y1="0" x2="30" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                    <line x1="-8" y1="-16" x2="-8" y2="16" stroke="#38bdf8" strokeWidth="3" />
                    <line x1="8" y1="-16" x2="8" y2="16" stroke="#38bdf8" strokeWidth="3" />
                  </g>
                )}

                {comp.type === 'inductor' && (
                  <g>
                    <line x1="-30" y1="0" x2="-20" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                    <line x1="20" y1="0" x2="30" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                    <path
                      d="M -20 0 Q -15 -16 -10 0 Q -5 -16 0 0 Q 5 -16 10 0 Q 15 -16 20 0"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />
                  </g>
                )}

                {comp.type === 'led' && (
                  <g>
                    <circle cx="0" cy="0" r="16" fill={currentMa > 1 ? "#ef4444" : "#475569"} stroke="#ef4444" strokeWidth="2" />
                    <text x="0" y="4" fill="#ffffff" fontSize="9" textAnchor="middle">LED</text>
                  </g>
                )}

                {/* Terminals (Connection Pins) */}
                {comp.terminals.map((term) => (
                  <circle
                    key={term.id}
                    cx={term.x}
                    cy={term.y}
                    r="5"
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="hover:scale-150 transition-transform cursor-pointer"
                    onClick={(e) => handleTerminalClick(comp.id, term.id, e)}
                  />
                ))}

                {/* Label & Value Text */}
                <g transform={`rotate(${-comp.rotation})`}>
                  <text x="0" y="32" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {comp.name} ({comp.value} {comp.unit})
                  </text>
                  {isSimulating && sim && (
                    <text x="0" y="44" fill="#38bdf8" fontSize="9" fontStyle="italic" textAnchor="middle">
                      {vDrop.toFixed(2)}V • {currentMa.toFixed(1)}mA
                    </text>
                  )}
                </g>
              </g>
            );
          })}
        </svg>

        {/* Selected Component Quick Action Bar Overlay */}
        {selectedCompId && (
          <div className="absolute bottom-3 start-3 end-3 flex flex-wrap items-center justify-between gap-2 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-2.5 rounded-2xl shadow-xl z-20">
            {(() => {
              const comp = components.find(c => c.id === selectedCompId);
              if (!comp) return null;
              return (
                <>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">{comp.name}</span>
                    <span className="text-cyan-400 font-mono">({comp.value} {comp.unit})</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleRotate(comp.id)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                      title="تدوير 90 درجة"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>تدوير</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(comp)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>تعديل القيمة</span>
                    </button>

                    <button
                      onClick={() => handleDeleteComp(comp.id)}
                      className="p-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 rounded-lg"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Component Library Palette (Mobile-First Touch Bar) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 block">مكتبة المكونات الكهربائية (إضافة للمختبر):</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleAddComponent('dc_source')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span>⚡ مصدر جهد DC</span>
          </button>
          <button
            onClick={() => handleAddComponent('resistor')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span>⏛ مقاومة (Resistor)</span>
          </button>
          <button
            onClick={() => handleAddComponent('potentiometer')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-purple-400 border border-slate-800 hover:border-purple-500/40 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span>🎛️ مقاومة متغيرة (Pot)</span>
          </button>
          <button
            onClick={() => handleAddComponent('switch')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span>🔌 مفتاح (Switch)</span>
          </button>
          <button
            onClick={() => handleAddComponent('ground')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-teal-400 border border-slate-800 hover:border-teal-500/40 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span>⏚ تأريض (Ground)</span>
          </button>
          <button
            onClick={() => handleAddComponent('capacitor')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-sky-400 border border-slate-800 hover:border-sky-500/40 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span>⏸️ مكثف (Capacitor)</span>
          </button>
          <button
            onClick={() => handleAddComponent('inductor')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-orange-400 border border-slate-800 hover:border-orange-500/40 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span>〰️ ملف (Inductor)</span>
          </button>
          <button
            onClick={() => handleAddComponent('led')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-rose-400 border border-slate-800 hover:border-rose-500/40 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span>💡 دايود ضوئي LED</span>
          </button>
        </div>
      </div>

      {/* Edit Component Modal */}
      {editingComp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h5 className="font-bold text-white text-sm">تعديل قيمة {editingComp.name}</h5>
              <button onClick={() => setEditingComp(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">
                  القيمة ({editingComp.unit || 'القيمة الأساسية'}):
                </label>
                <input
                  type="number"
                  step="any"
                  value={editValueStr}
                  onChange={(e) => setEditValueStr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              {editingComp.type === 'potentiometer' && (
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>موضع المنزلق (Wiper):</span>
                    <span className="font-mono text-amber-400">{editWiperStr}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editWiperStr}
                    onChange={(e) => setEditWiperStr(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingComp(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs"
              >
                حفظ القيمة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

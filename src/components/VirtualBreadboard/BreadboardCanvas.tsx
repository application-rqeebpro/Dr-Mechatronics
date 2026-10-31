import React, { useState, useRef } from 'react';
import { CircuitElement, CircuitWire, SimulationResult } from '../../types/dcLab';
import {
  RotateCw,
  Trash2,
  Sliders,
  Plus,
  Minus,
  Zap,
  Power,
  RefreshCw,
  X,
  Eye,
  Info
} from 'lucide-react';

interface Props {
  components: CircuitElement[];
  wires: CircuitWire[];
  simulationResult: SimulationResult;
  isSimulating: boolean;
  selectedWireColor: string;
  onUpdateComponents: (components: CircuitElement[]) => void;
  onUpdateWires: (wires: CircuitWire[]) => void;
  onSelectComponent?: (comp: CircuitElement) => void;
}

// 30 Rows breadboard geometry constants
const NUM_ROWS = 30;
const ROW_SPACING = 24; // px
const COL_SPACING = 20; // px
const BOARD_START_X = 60;
const BOARD_START_Y = 50;

export const BreadboardCanvas: React.FC<Props> = ({
  components,
  wires,
  simulationResult,
  isSimulating,
  selectedWireColor,
  onUpdateComponents,
  onUpdateWires,
  onSelectComponent,
}) => {
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [connectingHole, setConnectingHole] = useState<{ id: string; x: number; y: number } | null>(null);
  const [hoveredStrip, setHoveredStrip] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Dragging state
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Helper to calculate exact coordinates of breadboard holes
  // Columns: top_pos, top_neg, A, B, C, D, E, (gap), F, G, H, I, J, bot_pos, bot_neg
  const getHoleCoord = (row: number, col: string): { x: number; y: number; stripId: string } => {
    const x = BOARD_START_X + (row - 1) * ROW_SPACING;
    let y = BOARD_START_Y;
    let stripId = '';

    if (col === 'top_pos') {
      y = BOARD_START_Y + 14;
      stripId = 'rail_top_plus';
    } else if (col === 'top_neg') {
      y = BOARD_START_Y + 34;
      stripId = 'rail_top_minus';
    } else if (['A', 'B', 'C', 'D', 'E'].includes(col)) {
      const idx = ['A', 'B', 'C', 'D', 'E'].indexOf(col);
      y = BOARD_START_Y + 70 + idx * COL_SPACING;
      stripId = `strip_row_${row}_top`;
    } else if (['F', 'G', 'H', 'I', 'J'].includes(col)) {
      const idx = ['F', 'G', 'H', 'I', 'J'].indexOf(col);
      y = BOARD_START_Y + 195 + idx * COL_SPACING; // with central trench gap
      stripId = `strip_row_${row}_bot`;
    } else if (col === 'bot_pos') {
      y = BOARD_START_Y + 310;
      stripId = 'rail_bot_plus';
    } else if (col === 'bot_neg') {
      y = BOARD_START_Y + 330;
      stripId = 'rail_bot_minus';
    }

    return { x, y, stripId };
  };

  // Generate all breadboard holes data
  const holes: { id: string; x: number; y: number; stripId: string; label: string }[] = [];

  for (let r = 1; r <= NUM_ROWS; r++) {
    // Top Power Rails (+ and -)
    const tPlus = getHoleCoord(r, 'top_pos');
    holes.push({ id: `rail_top_plus_${r}`, x: tPlus.x, y: tPlus.y, stripId: tPlus.stripId, label: `+ Row ${r}` });

    const tMinus = getHoleCoord(r, 'top_neg');
    holes.push({ id: `rail_top_minus_${r}`, x: tMinus.x, y: tMinus.y, stripId: tMinus.stripId, label: `- Row ${r}` });

    // Terminal strips A-E (top half)
    ['A', 'B', 'C', 'D', 'E'].forEach((col) => {
      const coord = getHoleCoord(r, col);
      holes.push({ id: `row_${r}_${col}`, x: coord.x, y: coord.y, stripId: coord.stripId, label: `Row ${r} Col ${col}` });
    });

    // Terminal strips F-J (bottom half)
    ['F', 'G', 'H', 'I', 'J'].forEach((col) => {
      const coord = getHoleCoord(r, col);
      holes.push({ id: `row_${r}_${col}`, x: coord.x, y: coord.y, stripId: coord.stripId, label: `Row ${r} Col ${col}` });
    });

    // Bottom Power Rails (+ and -)
    const bPlus = getHoleCoord(r, 'bot_pos');
    holes.push({ id: `rail_bot_plus_${r}`, x: bPlus.x, y: bPlus.y, stripId: bPlus.stripId, label: `+ Row ${r}` });

    const bMinus = getHoleCoord(r, 'bot_neg');
    holes.push({ id: `rail_bot_minus_${r}`, x: bMinus.x, y: bMinus.y, stripId: bMinus.stripId, label: `- Row ${r}` });
  }

  // Handle clicking a hole to draw a jumper wire
  const handleHoleClick = (hole: { id: string; x: number; y: number; stripId: string }) => {
    if (!connectingHole) {
      setConnectingHole(hole);
    } else {
      if (connectingHole.id !== hole.id) {
        // Create a jumper wire between these two holes
        const newWire: CircuitWire = {
          id: `w_bb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          fromComponentId: connectingHole.id,
          fromTerminalId: 'hole',
          toComponentId: hole.id,
          toTerminalId: 'hole',
          color: selectedWireColor || '#ef4444',
        };
        onUpdateWires([...wires, newWire]);
      }
      setConnectingHole(null);
    }
  };

  // Helper to get coordinates for wire endpoints
  const getWirePoint = (endpointId: string): { x: number; y: number } => {
    // Check if it's a breadboard hole ID
    const foundHole = holes.find((h) => h.id === endpointId);
    if (foundHole) return { x: foundHole.x, y: foundHole.y };

    // Otherwise check if it's a component ID
    const comp = components.find((c) => c.id === endpointId);
    if (comp) return { x: comp.x, y: comp.y };

    return { x: 100, y: 100 };
  };

  // Rotate component
  const handleRotate = (compId: string) => {
    onUpdateComponents(
      components.map((c) => {
        if (c.id === compId) {
          const nextRot: 0 | 90 | 180 | 270 =
            c.rotation === 0 ? 90 : c.rotation === 90 ? 180 : c.rotation === 180 ? 270 : 0;
          return { ...c, rotation: nextRot };
        }
        return c;
      })
    );
  };

  // Delete component
  const handleDeleteComp = (compId: string) => {
    onUpdateComponents(components.filter((c) => c.id !== compId));
    onUpdateWires(wires.filter((w) => w.fromComponentId !== compId && w.toComponentId !== compId));
    if (selectedCompId === compId) setSelectedCompId(null);
  };

  // Pointer dragging
  const handlePointerDown = (compId: string, e: React.PointerEvent) => {
    setDraggingCompId(compId);
    setSelectedCompId(compId);
    const comp = components.find((c) => c.id === compId);
    if (comp) {
      setDragOffset({ x: e.clientX - comp.x, y: e.clientY - comp.y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingCompId) return;
    const newX = Math.round((e.clientX - dragOffset.x) / 10) * 10;
    const newY = Math.round((e.clientY - dragOffset.y) / 10) * 10;

    onUpdateComponents(
      components.map((c) => {
        if (c.id === draggingCompId) {
          return { ...c, x: Math.max(30, Math.min(840, newX)), y: Math.max(30, Math.min(460, newY)) };
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
      {/* Top Breadboard Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white text-xs sm:text-sm block">
              لوحة التجارب الإلكترونية الواقعية (Solderless Breadboard - 830 Points)
            </span>
            <span className="text-[10px] text-slate-400">
              المسارات الداخلية متصلة عمودياً (A-E و F-J)، وخطوط التغذية (+ و -) متصلة أفقياً
            </span>
          </div>
        </div>

        {/* Toolbar & Wire connecting actions */}
        <div className="flex items-center gap-2">
          {connectingHole && (
            <button
              onClick={() => setConnectingHole(null)}
              className="flex items-center gap-1 px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold"
            >
              <X className="w-3.5 h-3.5" />
              <span>إلغاء السلك</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(0.7, prev - 0.1))}
              className="p-1.5 text-slate-400 hover:text-white"
              title="تصغير"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs text-slate-300 px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(1.4, prev + 0.1))}
              className="p-1.5 text-slate-400 hover:text-white"
              title="تكبير"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onUpdateWires([])}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-xl text-xs font-semibold"
          >
            مسح جميع الأسلاك
          </button>
        </div>
      </div>

      {/* Breadboard Visual Canvas */}
      <div
        className="w-full h-[460px] sm:h-[520px] bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden relative touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <svg
          className="w-full h-full cursor-crosshair"
          viewBox={`0 0 ${880 / zoomLevel} ${480 / zoomLevel}`}
          onClick={() => {
            setSelectedCompId(null);
            setConnectingHole(null);
          }}
        >
          {/* Breadboard Body Housing */}
          <rect
            x={BOARD_START_X - 25}
            y={BOARD_START_Y - 15}
            width={NUM_ROWS * ROW_SPACING + 45}
            height={375}
            rx={16}
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth={3}
            filter="drop-shadow(0 20px 25px rgba(0,0,0,0.5))"
          />

          {/* Central IC Isolation Divider Trough */}
          <rect
            x={BOARD_START_X - 15}
            y={BOARD_START_Y + 168}
            width={NUM_ROWS * ROW_SPACING + 30}
            height={16}
            fill="#e2e8f0"
            rx={4}
          />
          <text
            x={BOARD_START_X + (NUM_ROWS * ROW_SPACING) / 2}
            y={BOARD_START_Y + 180}
            fill="#94a3b8"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="middle"
            letterSpacing="4"
          >
            SMART MECHATRONICS VIRTUAL BREADBOARD
          </text>

          {/* Power Bus Lines Indicator Stripes */}
          {/* Top + Line (Red) */}
          <line
            x1={BOARD_START_X - 10}
            y1={BOARD_START_Y + 8}
            x2={BOARD_START_X + NUM_ROWS * ROW_SPACING + 10}
            y2={BOARD_START_Y + 8}
            stroke="#ef4444"
            strokeWidth={2}
          />
          <text x={BOARD_START_X - 18} y={BOARD_START_Y + 16} fill="#ef4444" fontSize="13" fontWeight="bold">+</text>

          {/* Top - Line (Blue) */}
          <line
            x1={BOARD_START_X - 10}
            y1={BOARD_START_Y + 46}
            x2={BOARD_START_X + NUM_ROWS * ROW_SPACING + 10}
            y2={BOARD_START_Y + 46}
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <text x={BOARD_START_X - 18} y={BOARD_START_Y + 38} fill="#3b82f6" fontSize="15" fontWeight="bold">-</text>

          {/* Bottom + Line (Red) */}
          <line
            x1={BOARD_START_X - 10}
            y1={BOARD_START_Y + 302}
            x2={BOARD_START_X + NUM_ROWS * ROW_SPACING + 10}
            y2={BOARD_START_Y + 302}
            stroke="#ef4444"
            strokeWidth={2}
          />
          <text x={BOARD_START_X - 18} y={BOARD_START_Y + 314} fill="#ef4444" fontSize="13" fontWeight="bold">+</text>

          {/* Bottom - Line (Blue) */}
          <line
            x1={BOARD_START_X - 10}
            y1={BOARD_START_Y + 342}
            x2={BOARD_START_X + NUM_ROWS * ROW_SPACING + 10}
            y2={BOARD_START_Y + 342}
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <text x={BOARD_START_X - 18} y={BOARD_START_Y + 334} fill="#3b82f6" fontSize="15" fontWeight="bold">-</text>

          {/* Row Numbering (1, 5, 10, 15, 20, 25, 30) */}
          {Array.from({ length: NUM_ROWS }, (_, i) => i + 1).map((r) => {
            const x = BOARD_START_X + (r - 1) * ROW_SPACING;
            return (
              <g key={`num_${r}`}>
                <text x={x} y={BOARD_START_Y + 62} fill="#64748b" fontSize="8" textAnchor="middle" fontWeight="bold">
                  {r % 5 === 0 || r === 1 ? r : '·'}
                </text>
                <text x={x} y={BOARD_START_Y + 295} fill="#64748b" fontSize="8" textAnchor="middle" fontWeight="bold">
                  {r % 5 === 0 || r === 1 ? r : '·'}
                </text>
              </g>
            );
          })}

          {/* Column letters on left and right (A B C D E and F G H I J) */}
          {['A', 'B', 'C', 'D', 'E'].map((col, idx) => (
            <text
              key={`col_${col}`}
              x={BOARD_START_X - 12}
              y={BOARD_START_Y + 74 + idx * COL_SPACING}
              fill="#64748b"
              fontSize="9"
              fontWeight="bold"
            >
              {col}
            </text>
          ))}
          {['F', 'G', 'H', 'I', 'J'].map((col, idx) => (
            <text
              key={`col_${col}`}
              x={BOARD_START_X - 12}
              y={BOARD_START_Y + 199 + idx * COL_SPACING}
              fill="#64748b"
              fontSize="9"
              fontWeight="bold"
            >
              {col}
            </text>
          ))}

          {/* Render All Breadboard Holes & Internal Strip Highlighting */}
          {holes.map((h) => {
            const isStripHovered = hoveredStrip === h.stripId;
            const isConnectingSource = connectingHole?.id === h.id;

            return (
              <g key={h.id}>
                {/* Strip Glow highlight */}
                {isStripHovered && (
                  <circle cx={h.x} cy={h.y} r="8" fill="#38bdf8" opacity="0.35" className="animate-pulse" />
                )}

                {/* Hole Rim & Socket Socket Metal Clip */}
                <circle
                  cx={h.x}
                  cy={h.y}
                  r="4.2"
                  fill="#0f172a"
                  stroke={isConnectingSource ? '#ef4444' : isStripHovered ? '#0ea5e9' : '#94a3b8'}
                  strokeWidth={isConnectingSource ? 2 : 1}
                  className="cursor-pointer transition-all hover:scale-125"
                  onPointerEnter={() => setHoveredStrip(h.stripId)}
                  onPointerLeave={() => setHoveredStrip(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHoleClick(h);
                  }}
                />
                {/* Hole Center Point */}
                <rect x={h.x - 1.2} y={h.y - 1.2} width={2.4} height={2.4} fill="#020617" />
              </g>
            );
          })}

          {/* Render Connecting Jumper Wires with Curved Bezier Curves */}
          {wires.map((wire) => {
            const p1 = getWirePoint(wire.fromComponentId);
            const p2 = getWirePoint(wire.toComponentId);
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // Curve offset upward or sideways
            const curveOffset = Math.min(60, dist * 0.25);
            const cx = (p1.x + p2.x) / 2;
            const cy = (p1.y + p2.y) / 2 - curveOffset;

            return (
              <g key={wire.id} className="group cursor-pointer">
                {/* Click target */}
                <path
                  d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="14"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateWires(wires.filter((w) => w.id !== wire.id));
                  }}
                />

                {/* Visible Wire Arc */}
                <path
                  d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`}
                  fill="none"
                  stroke={wire.color || '#ef4444'}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  className="transition-colors group-hover:stroke-rose-500"
                />

                {/* Animated Current Particle Flow when Active */}
                {isSimulating && (
                  <path
                    d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeDasharray="4 6"
                    className="animate-pulse"
                  />
                )}

                {/* Terminal Pin Plugs */}
                <circle cx={p1.x} cy={p1.y} r="3.5" fill="#475569" stroke="#ffffff" strokeWidth="1" />
                <circle cx={p2.x} cy={p2.y} r="3.5" fill="#475569" stroke="#ffffff" strokeWidth="1" />
              </g>
            );
          })}

          {/* Render Active Components placed on or above the Breadboard */}
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
                  if (onSelectComponent) onSelectComponent(comp);
                }}
                className="cursor-move"
              >
                {/* Selection Ring */}
                {isSelected && (
                  <rect
                    x="-42"
                    y="-32"
                    width="84"
                    height="64"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    rx="8"
                  />
                )}

                {/* Component Graphics by Type */}
                {comp.type === 'dc_source' && (
                  <g>
                    <rect x="-35" y="-22" width="70" height="44" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x="0" y="-4" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">{comp.value}V</text>
                    <text x="-18" y="14" fill="#ef4444" fontSize="11" fontWeight="bold">+</text>
                    <text x="14" y="14" fill="#3b82f6" fontSize="11" fontWeight="bold">-</text>
                  </g>
                )}

                {comp.type === 'resistor' && (
                  <g>
                    <line x1="-30" y1="0" x2="-20" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                    <line x1="20" y1="0" x2="30" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                    <rect x="-20" y="-10" width="40" height="20" rx="4" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />
                    <rect x="-14" y="-10" width="3" height="20" fill="#78350f" />
                    <rect x="-6" y="-10" width="3" height="20" fill="#000000" />
                    <rect x="2" y="-10" width="3" height="20" fill="#dc2626" />
                    <rect x="11" y="-10" width="3" height="20" fill="#f59e0b" />
                  </g>
                )}

                {comp.type === 'led' && (
                  <g>
                    {/* Glowing Aura if Powered */}
                    {comp.isGlowing && (
                      <circle cx="0" cy="0" r="28" fill="#ef4444" opacity="0.4" className="animate-ping" />
                    )}
                    <circle
                      cx="0"
                      cy="0"
                      r="16"
                      fill={comp.isGlowing ? '#ef4444' : '#7f1d1d'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <line x1="-24" y1="0" x2="-16" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                    <line x1="16" y1="0" x2="24" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                  </g>
                )}

                {comp.type === 'bulb' && (
                  <g>
                    {comp.isGlowing && (
                      <circle cx="0" cy="0" r="32" fill="#facc15" opacity="0.3" className="animate-pulse" />
                    )}
                    <circle cx="0" cy="0" r="18" fill={comp.isGlowing ? '#fef08a' : '#334155'} stroke="#eab308" strokeWidth="2" />
                    <text x="0" y="4" fill="#000" fontSize="9" textAnchor="middle">💡</text>
                  </g>
                )}

                {comp.type === 'dc_motor' && (
                  <g>
                    <circle cx="0" cy="0" r="24" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                    <circle cx="0" cy="0" r="6" fill="#38bdf8" />
                    {/* Rotating Propeller Blades */}
                    <g className={comp.motorRpm && comp.motorRpm > 50 ? 'animate-spin' : ''}>
                      <line x1="-18" y1="0" x2="18" y2="0" stroke="#f59e0b" strokeWidth="3" />
                      <line x1="0" y1="-18" x2="0" y2="18" stroke="#f59e0b" strokeWidth="3" />
                    </g>
                    {comp.motorRpm ? (
                      <text x="0" y="34" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
                        {comp.motorRpm} RPM
                      </text>
                    ) : null}
                  </g>
                )}

                {comp.type === 'buzzer' && (
                  <g>
                    <circle cx="0" cy="0" r="20" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" />
                    <circle cx="0" cy="0" r="8" fill="#8b5cf6" />
                    {comp.isBeeping && (
                      <circle cx="0" cy="0" r="30" fill="none" stroke="#a855f7" strokeWidth="1.5" className="animate-ping" />
                    )}
                  </g>
                )}

                {comp.type === 'npn_bjt' && (
                  <g>
                    <circle cx="0" cy="0" r="20" fill="#020617" stroke="#10b981" strokeWidth="2" />
                    <text x="0" y="4" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">NPN</text>
                  </g>
                )}

                {comp.type === 'n_mosfet' && (
                  <g>
                    <rect x="-18" y="-16" width="36" height="32" rx="4" fill="#0f172a" stroke="#6366f1" strokeWidth="2" />
                    <text x="0" y="4" fill="#6366f1" fontSize="9" fontWeight="bold" textAnchor="middle">MOS</text>
                  </g>
                )}

                {/* Terminals (Connection Pins) */}
                {comp.terminals.map((t) => (
                  <circle
                    key={t.id}
                    cx={t.x}
                    cy={t.y}
                    r="4.5"
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="hover:scale-150 transition-transform cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Start or finish wire from this component terminal
                      const holeObj = { id: comp.id, x: comp.x + t.x, y: comp.y + t.y, stripId: comp.id };
                      handleHoleClick(holeObj);
                    }}
                  />
                ))}

                {/* Label text */}
                <g transform={`rotate(${-comp.rotation})`}>
                  <text x="0" y="32" fill="#334155" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {comp.name} ({comp.value} {comp.unit})
                  </text>
                  {isSimulating && sim && (
                    <text x="0" y="44" fill="#0284c7" fontSize="9" fontStyle="italic" textAnchor="middle">
                      {vDrop.toFixed(2)}V • {currentMa.toFixed(1)}mA
                    </text>
                  )}
                </g>
              </g>
            );
          })}
        </svg>

        {/* Selected Component Quick Action Bar */}
        {selectedCompId && (
          <div className="absolute bottom-3 start-3 end-3 flex flex-wrap items-center justify-between gap-2 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-2.5 rounded-2xl shadow-xl z-20">
            {(() => {
              const comp = components.find((c) => c.id === selectedCompId);
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
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>تدوير 90°</span>
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
    </div>
  );
};

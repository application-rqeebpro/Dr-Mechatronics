import React, { useState, useRef } from 'react';
import { CwComponent, CwWire, ViewMode } from '../../types/circuitWizard';
import { CircuitWizardSolver } from '../../utils/circuitWizardSolver';
import { RotateCw, Trash2, Zap, Play, Eye } from 'lucide-react';

interface Props {
  components: CwComponent[];
  wires: CwWire[];
  viewMode: ViewMode;
  onUpdateComponents: (comps: CwComponent[]) => void;
  onUpdateWires: (wires: CwWire[]) => void;
  nodeVoltages: Record<string, number>;
  logicStates: Record<string, '0' | '1' | 'X'>;
}

export const SchematicCanvas: React.FC<Props> = ({
  components,
  wires,
  viewMode,
  onUpdateComponents,
  onUpdateWires,
  nodeVoltages,
  logicStates,
}) => {
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Wire drawing state
  const [drawingWirePin, setDrawingWirePin] = useState<{ compId: string; pinId: string } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Handle Dragging
  const handleMouseDownComp = (e: React.MouseEvent, comp: CwComponent) => {
    e.stopPropagation();
    setSelectedCompId(comp.id);
    setDraggingCompId(comp.id);
    setDragOffset({ x: e.clientX - comp.x, y: e.clientY - comp.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (draggingCompId) {
      const updated = components.map((c) => {
        if (c.id === draggingCompId) {
          return {
            ...c,
            x: Math.round((e.clientX - dragOffset.x) / 10) * 10,
            y: Math.round((e.clientY - dragOffset.y) / 10) * 10,
          };
        }
        return c;
      });
      onUpdateComponents(updated);
    }
  };

  const handleMouseUp = () => {
    setDraggingCompId(null);
  };

  // Pin Click for Wiring
  const handlePinClick = (e: React.MouseEvent, compId: string, pinId: string) => {
    e.stopPropagation();
    if (!drawingWirePin) {
      setDrawingWirePin({ compId, pinId });
    } else {
      if (drawingWirePin.compId !== compId || drawingWirePin.pinId !== pinId) {
        const newWire: CwWire = {
          id: `w_${Date.now()}`,
          fromCompId: drawingWirePin.compId,
          fromPinId: drawingWirePin.pinId,
          toCompId: compId,
          toPinId: pinId,
          color: '#38bdf8',
          wireType: 'signal',
        };
        onUpdateWires([...wires, newWire]);
      }
      setDrawingWirePin(null);
    }
  };

  // Rotate component
  const handleRotate = (id: string) => {
    const updated = components.map((c) => (c.id === id ? { ...c, rotation: (c.rotation + 90) % 360 } : c));
    onUpdateComponents(updated);
  };

  // Delete component
  const handleDeleteComp = (id: string) => {
    onUpdateComponents(components.filter((c) => c.id !== id));
    onUpdateWires(wires.filter((w) => w.fromCompId !== id && w.toCompId !== id));
    setSelectedCompId(null);
  };

  // Helper to get global pin coordinates
  const getPinCoords = (compId: string, pinId: string) => {
    const comp = components.find((c) => c.id === compId);
    if (!comp) return { x: 0, y: 0 };
    const pin = comp.pins.find((p) => p.id === pinId);
    if (!pin) return { x: comp.x, y: comp.y };

    // Apply rotation
    const rad = (comp.rotation * Math.PI) / 180;
    const rx = pin.x * Math.cos(rad) - pin.y * Math.sin(rad);
    const ry = pin.x * Math.sin(rad) + pin.y * Math.cos(rad);

    return { x: comp.x + rx, y: comp.y + ry };
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none border border-slate-800 rounded-xl">
      {/* CAD Grid Overlay */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => {
          setSelectedCompId(null);
          setDrawingWirePin(null);
        }}
      >
        <defs>
          <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#334155" opacity="0.6" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#cadGrid)" />

        {/* Wires */}
        {wires.map((w) => {
          const start = getPinCoords(w.fromCompId, w.fromPinId);
          const end = getPinCoords(w.toCompId, w.toPinId);

          // Determine wire color based on view mode
          let wireStroke = w.color;
          if (viewMode === 'voltage_levels') {
            wireStroke = CircuitWizardSolver.getVoltageColor(nodeVoltages[`${w.fromCompId}_${w.fromPinId}`] || 9);
          } else if (viewMode === 'logic_levels') {
            wireStroke = logicStates[w.fromCompId] === '1' ? '#ef4444' : '#3b82f6';
          }

          return (
            <g key={w.id} className="group cursor-pointer">
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={wireStroke}
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Current Flow View Mode Animated Electrons */}
              {viewMode === 'current_flow' && (
                <circle r="4" fill="#38bdf8" className="animate-ping opacity-75">
                  <animateMotion
                    path={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Active Drawing Wire Line */}
        {drawingWirePin && (
          <line
            x1={getPinCoords(drawingWirePin.compId, drawingWirePin.pinId).x}
            y1={getPinCoords(drawingWirePin.compId, drawingWirePin.pinId).y}
            x2={mousePos.x}
            y2={mousePos.y}
            stroke="#eab308"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        )}

        {/* Components */}
        {components.map((comp) => {
          const isSelected = selectedCompId === comp.id;

          return (
            <g
              key={comp.id}
              transform={`translate(${comp.x}, ${comp.y}) rotate(${comp.rotation})`}
              onMouseDown={(e) => handleMouseDownComp(e, comp)}
              className="cursor-move"
            >
              {/* Component Selection Highlight Box */}
              {isSelected && (
                <rect
                  x="-35"
                  y="-35"
                  width="70"
                  height="70"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  rx="4"
                />
              )}

              {/* Render Component Graphic Symbols */}
              {comp.type === 'battery' && (
                <g>
                  <rect x="-20" y="-15" width="40" height="30" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="4" />
                  <line x1="-10" y1="-8" x2="10" y2="-8" stroke="#ef4444" strokeWidth="2" />
                  <line x1="-6" y1="8" x2="6" y2="8" stroke="#3b82f6" strokeWidth="2" />
                </g>
              )}

              {comp.type === 'resistor' && (
                <g>
                  <rect x="-20" y="-8" width="40" height="16" fill="#1e293b" stroke="#e2e8f0" strokeWidth="2" rx="2" />
                  <line x1="-10" y1="-8" x2="-10" y2="8" stroke="#ef4444" strokeWidth="2" />
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#eab308" strokeWidth="2" />
                  <line x1="10" y1="-8" x2="10" y2="8" stroke="#10b981" strokeWidth="2" />
                </g>
              )}

              {comp.type === 'led' && (
                <g>
                  <circle
                    r="14"
                    fill={comp.state?.isGlow ? '#ef4444' : '#1e293b'}
                    stroke="#ef4444"
                    strokeWidth="2"
                    className={comp.state?.isGlow ? 'shadow-lg shadow-red-500 animate-pulse' : ''}
                  />
                  <path d="M -6 -6 L 6 0 L -6 6 Z" fill="#ef4444" />
                </g>
              )}

              {comp.type === 'ic_555' && (
                <g>
                  <rect x="-35" y="-35" width="70" height="70" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" rx="6" />
                  <text x="0" y="-15" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">
                    NE555
                  </text>
                  <circle cx="-25" cy="-25" r="3" fill="#8b5cf6" />
                </g>
              )}

              {comp.type === 'nand_gate' && (
                <g>
                  <path d="M -25 -20 L -5 -20 A 20 20 0 0 1 -5 20 L -25 20 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="18" cy="0" r="3" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                </g>
              )}

              {comp.type === 'xor_gate' && (
                <g>
                  <path d="M -25 -20 Q -10 0 -25 20 Q 0 20 15 0 Q 0 -20 -25 -20 Z" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
                </g>
              )}

              {/* Default generic box symbol */}
              {comp.type !== 'battery' &&
                comp.type !== 'resistor' &&
                comp.type !== 'led' &&
                comp.type !== 'ic_555' &&
                comp.type !== 'nand_gate' &&
                comp.type !== 'xor_gate' && (
                  <g>
                    <rect x="-25" y="-20" width="50" height="40" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="4" />
                    <text x="0" y="4" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {comp.name}
                    </text>
                  </g>
                )}

              {/* Component Label Text */}
              <text x="0" y="28" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">
                {comp.name} ({comp.value}
                {comp.unit})
              </text>

              {/* Pins */}
              {comp.pins.map((pin) => (
                <g key={pin.id} onClick={(e) => handlePinClick(e, comp.id, pin.id)} className="group/pin">
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r="5"
                    fill="#38bdf8"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                    className="hover:scale-150 transition-transform cursor-pointer"
                  />
                  <text x={pin.x + 8} y={pin.y + 3} fill="#94a3b8" fontSize="8" className="font-mono">
                    {pin.name}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
      </svg>

      {/* Selected Component Quick Floating Controls */}
      {selectedCompId && (
        <div className="absolute top-4 start-4 flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl shadow-xl z-20">
          <span className="text-xs font-bold text-slate-200">
            القطعة: {components.find((c) => c.id === selectedCompId)?.name}
          </span>
          <button
            onClick={() => handleRotate(selectedCompId)}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400"
            title="تدوير"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteComp(selectedCompId)}
            className="p-1.5 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-300"
            title="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

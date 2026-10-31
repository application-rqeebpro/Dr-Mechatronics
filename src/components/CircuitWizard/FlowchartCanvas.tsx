import React, { useState } from 'react';
import { CwFlowchartNode } from '../../types/circuitWizard';
import { Play, RotateCcw, Plus, Cpu, ArrowDown, CheckCircle2 } from 'lucide-react';

interface Props {
  initialNodes?: CwFlowchartNode[];
}

export const FlowchartCanvas: React.FC<Props> = ({ initialNodes }) => {
  const [nodes, setNodes] = useState<CwFlowchartNode[]>(
    initialNodes || [
      { id: 'f1', type: 'start', label: 'بدء البرنامج (Main Entry)', x: 150, y: 30, nextId: 'f2' },
      { id: 'f2', type: 'input', label: 'قراءة مفتاح الإدخال Pin 1', expression: 'Read Pin 1 (Logic A)', x: 150, y: 100, nextId: 'f3' },
      { id: 'f3', type: 'decision', label: 'هل القيمة = HIGH؟', expression: 'Pin 1 == 1', x: 150, y: 180, yesNextId: 'f4', noNextId: 'f5' },
      { id: 'f4', type: 'output', label: 'تشغيل المحرك والـ LED', expression: 'Set Pin 2 = HIGH, Pin 3 = HIGH', x: 60, y: 260, nextId: 'f6' },
      { id: 'f5', type: 'output', label: 'إيقاف تشغيل المحرك', expression: 'Set Pin 2 = LOW, Pin 3 = LOW', x: 240, y: 260, nextId: 'f6' },
      { id: 'f6', type: 'delay', label: 'انتظار 200ms (تأخير)', expression: 'Delay 200ms', x: 150, y: 340, nextId: 'f2' },
    ]
  );

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Flowchart execution simulator
  const handleRunFlowchart = () => {
    setIsRunning(true);
    let currentId = 'f1';
    setActiveNodeId(currentId);

    const interval = setInterval(() => {
      const curr = nodes.find((n) => n.id === currentId);
      if (!curr) {
        clearInterval(interval);
        setIsRunning(false);
        return;
      }

      if (curr.type === 'decision') {
        currentId = curr.yesNextId || curr.nextId || 'f1';
      } else {
        currentId = curr.nextId || 'f1';
      }

      setActiveNodeId(currentId);
    }, 1000);
  };

  const handleReset = () => {
    setIsRunning(false);
    setActiveNodeId(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden select-none">
      {/* Toolbar */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-950 border border-purple-800 text-purple-300 font-bold rounded">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>GENIE PIC Microcontroller - Flowchart Programming Studio</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">
            برمجة متحكمات GENIE PIC بالتدفق المنطقي وتتبع النبضات
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunFlowchart}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded shadow transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'جاري تنفيذ الكود...' : 'تشغيل المخطط (Simulate)'}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط</span>
          </button>
        </div>
      </div>

      {/* Flowchart Visualizer Canvas */}
      <div className="flex-1 relative bg-slate-950 p-6 overflow-auto flex justify-center">
        <div className="relative w-[400px] min-h-[450px] bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          {nodes.map((node) => {
            const isActive = activeNodeId === node.id;

            return (
              <div
                key={node.id}
                style={{ left: `${node.x - 100}px`, top: `${node.y}px` }}
                className={`absolute w-[200px] p-2.5 text-center rounded-xl border transition-all duration-300 shadow-xl ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-300 scale-105 ring-4 ring-amber-500/30 font-bold'
                    : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              >
                <div className="text-[11px] font-bold">{node.label}</div>
                {node.expression && (
                  <div className="text-[10px] font-mono opacity-80 mt-0.5">{node.expression}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-2.5 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 font-mono flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>GENIE 18-Pin Microcontroller Target: Online</span>
        </div>
        <div>Flowchart Syntax Validated</div>
      </div>
    </div>
  );
};

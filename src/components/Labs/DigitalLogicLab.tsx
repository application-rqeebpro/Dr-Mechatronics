import React, { useState } from 'react';
import { Cpu, Power, ToggleLeft, ToggleRight, CheckCircle2, XCircle } from 'lucide-react';

type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

export const DigitalLogicLab: React.FC = () => {
  const [gate, setGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState<boolean>(false);
  const [inputB, setInputB] = useState<boolean>(false);

  const calculateOutput = (g: GateType, a: boolean, b: boolean): boolean => {
    switch (g) {
      case 'AND':
        return a && b;
      case 'OR':
        return a || b;
      case 'NOT':
        return !a;
      case 'NAND':
        return !(a && b);
      case 'NOR':
        return !(a || b);
      case 'XOR':
        return a !== b;
      case 'XNOR':
        return a === b;
    }
  };

  const output = calculateOutput(gate, inputA, inputB);

  // Truth table generator
  const truthRows =
    gate === 'NOT'
      ? [
          { a: false, b: false, out: calculateOutput('NOT', false, false) },
          { a: true, b: false, out: calculateOutput('NOT', true, false) },
        ]
      : [
          { a: false, b: false, out: calculateOutput(gate, false, false) },
          { a: false, b: true, out: calculateOutput(gate, false, true) },
          { a: true, b: false, out: calculateOutput(gate, true, false) },
          { a: true, b: true, out: calculateOutput(gate, true, true) },
        ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 text-slate-100 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold">
              مختبر المنطق الرقمي والبوابات المنطقية (Digital Logic Simulator)
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              اختبر عمل البوابات المنطقية الأساسية والجدول الحقيقي (Truth Table) وتفاعل المفاتيح مع المصباح
            </p>
          </div>
        </div>

        {/* Gate Selectors */}
        <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'] as GateType[]).map((g) => (
            <button
              key={g}
              onClick={() => setGate(g)}
              className={`px-2.5 py-1 text-xs font-bold font-mono rounded-lg transition-all ${
                gate === g ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Visual Circuit Canvas with Gate Symbol & LED */}
        <div className="lg:col-span-7 bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
          {/* Subtle circuit line graphics */}
          <div className="w-full flex items-center justify-between max-w-md px-4">
            {/* Inputs Column */}
            <div className="flex flex-col gap-8 z-10">
              {/* Input A Switch */}
              <button
                onClick={() => setInputA(!inputA)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                  inputA
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Power className="w-4 h-4" />
                <span className="font-mono text-sm font-bold">A = {inputA ? '1' : '0'}</span>
              </button>

              {/* Input B Switch (hidden for NOT) */}
              {gate !== 'NOT' && (
                <button
                  onClick={() => setInputB(!inputB)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                    inputB
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  <span className="font-mono text-sm font-bold">B = {inputB ? '1' : '0'}</span>
                </button>
              )}
            </div>

            {/* Gate Symbol in Center */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border-2 border-purple-500/40 text-center shadow-xl shadow-purple-950/30">
              <span className="text-2xl font-black font-mono tracking-widest text-purple-400 block">
                {gate}
              </span>
              <span className="text-[10px] text-slate-400 font-sans block mt-1">بوابة منطقية</span>
            </div>

            {/* Output LED */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  output
                    ? 'bg-emerald-500/30 border-emerald-400 shadow-xl shadow-emerald-500/50 scale-105'
                    : 'bg-slate-900 border-slate-700 shadow-none'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full transition-all ${
                    output ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'
                  }`}
                />
              </div>
              <span className="font-mono text-xs font-bold text-slate-300">
                OUT = {output ? '1 (HIGH)' : '0 (LOW)'}
              </span>
            </div>
          </div>
        </div>

        {/* Truth Table */}
        <div className="lg:col-span-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-3 border-b border-slate-800">
              جدول الحقيقة (Truth Table) - بوابة {gate}
            </h4>
            <div className="mt-3 overflow-hidden rounded-lg border border-slate-800">
              <table className="w-full text-center text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">المدخل A</th>
                    {gate !== 'NOT' && <th className="py-2 px-3">المدخل B</th>}
                    <th className="py-2 px-3 text-purple-400 font-bold">المخرج (Y)</th>
                    <th className="py-2 px-3">الحالة الحالية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {truthRows.map((row, idx) => {
                    const isCurrent =
                      gate === 'NOT'
                        ? row.a === inputA
                        : row.a === inputA && row.b === inputB;
                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          isCurrent ? 'bg-cyan-950/40 text-cyan-300 font-bold' : 'text-slate-300'
                        }`}
                      >
                        <td className="py-2">{row.a ? '1' : '0'}</td>
                        {gate !== 'NOT' && <td className="py-2">{row.b ? '1' : '0'}</td>}
                        <td className="py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              row.out ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {row.out ? '1' : '0'}
                          </span>
                        </td>
                        <td className="py-2">
                          {isCurrent ? (
                            <span className="text-cyan-400 text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                              نشط الآن ◀
                            </span>
                          ) : (
                            <span className="text-slate-600 text-[10px]">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 mt-4">
            <strong>القاعدة المنطقية: </strong>
            {gate === 'AND' && 'يخرج 1 فقط عندما تكون جميع المداخل 1.'}
            {gate === 'OR' && 'يخرج 1 إذا كان أي مدخل على الأقل 1.'}
            {gate === 'NOT' && 'عاكس منطقي، يقلب الـ 1 إلى 0 والـ 0 إلى 1.'}
            {gate === 'NAND' && 'عكس بوابة AND، يخرج 0 فقط عندما تكون جميع المداخل 1.'}
            {gate === 'NOR' && 'عكس بوابة OR، يخرج 1 فقط عندما تكون جميع المداخل 0.'}
            {gate === 'XOR' && 'بوابة عدم التطابق، يخرج 1 عندما يختلف المدخلان عن بعضهما.'}
            {gate === 'XNOR' && 'بوابة التطابق، يخرج 1 عندما يتطابق المدخلان.'}
          </div>
        </div>
      </div>
    </div>
  );
};

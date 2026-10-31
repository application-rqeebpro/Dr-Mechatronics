import React, { useState } from 'react';
import { CircuitElement, MeterMode, SimulationResult } from '../../types/dcLab';
import { Gauge, AlertTriangle, CheckCircle2, RotateCw, Zap, ShieldAlert, Info } from 'lucide-react';

interface Props {
  components: CircuitElement[];
  simulationResult: SimulationResult;
  isSimulating: boolean;
  onProbeElement?: (componentId: string, terminalId: string, probeColor: 'red' | 'black') => void;
}

export const InstrumentsRack: React.FC<Props> = ({
  components,
  simulationResult,
  isSimulating,
}) => {
  const [selectedMeter, setSelectedMeter] = useState<MeterMode>('voltmeter');
  const [probeRedComponent, setProbeRedComponent] = useState<string>('');
  const [probeBlackComponent, setProbeBlackComponent] = useState<string>('');
  const [probeRedTerminal, setProbeRedTerminal] = useState<string>('t1');
  const [probeBlackTerminal, setProbeBlackTerminal] = useState<string>('t2');

  // Auto initialize probes with primary elements if available
  React.useEffect(() => {
    if (components.length > 0 && !probeRedComponent) {
      const target = components.find(c => c.type === 'resistor' || c.type === 'dc_source') || components[0];
      setProbeRedComponent(target.id);
      setProbeRedTerminal(target.terminals[0]?.id || 't1');
      setProbeBlackComponent(target.id);
      setProbeBlackTerminal(target.terminals[1]?.id || 't2');
    }
  }, [components]);

  // Compute instrument reading based on selected terminals & mode
  let reading = 0;
  let unit = 'V';
  let isReversePolarity = false;
  let isOverload = false;
  let warningMessage: string | null = null;
  let warningSeverity: 'danger' | 'warning' | 'info' | null = null;

  const redElem = components.find(c => c.id === probeRedComponent);
  const blackElem = components.find(c => c.id === probeBlackComponent);

  if (isSimulating && simulationResult && redElem && blackElem) {
    const redSim = simulationResult.elementData[redElem.id];
    const blackSim = simulationResult.elementData[blackElem.id];

    // Determine node voltages
    const vRed = probeRedTerminal === 't1' ? (redSim?.node1Voltage ?? 0) : (redSim?.node2Voltage ?? 0);
    const vBlack = probeBlackTerminal === 't1' ? (blackSim?.node1Voltage ?? 0) : (blackSim?.node2Voltage ?? 0);

    const deltaV = vRed - vBlack;

    if (selectedMeter === 'voltmeter') {
      unit = 'V';
      reading = deltaV;
      if (reading < 0) {
        isReversePolarity = true;
      }

      // Check if user accidentally tried putting voltmeter in series in a high-impedance loop
      if (Math.abs(deltaV) > 0.001) {
        // normal reading
      }
    } else if (selectedMeter === 'ammeter') {
      unit = 'mA';
      // If measuring across the same component
      if (redElem.id === blackElem.id) {
        reading = (redSim?.current ?? 0) * 1000;
      } else {
        reading = 0;
      }

      // AMMETER SAFETY CHECK: Did student connect ammeter directly across a voltage source?
      const isAcrossSource = (redElem.type === 'dc_source' || redElem.type === 'battery') &&
                            probeRedComponent === probeBlackComponent &&
                            probeRedTerminal !== probeBlackTerminal;
      if (isAcrossSource) {
        warningSeverity = 'danger';
        warningMessage = '⚡ خطأ فادح: توصيل مقياس التيار (الأميتر) مباشرة على التوازي مع طرفي مصدر الجهد! هذا يؤدي إلى دائرة قصر خطيرة واحتراق مصهر الأميتر (Blows Fuse). الأميتر يوصل على التوالي بعد قطع المسار.';
        isOverload = true;
      }
    } else if (selectedMeter === 'ohmmeter') {
      unit = 'Ω';
      // OHMMETER SAFETY CHECK: Is the power supply active?
      const dcSource = components.find(c => c.type === 'dc_source' || c.type === 'battery');
      const hasPower = dcSource && dcSource.value > 0;

      if (hasPower && isSimulating) {
        warningSeverity = 'danger';
        warningMessage = '⚠️ تحذير تلف الجهاز: لا تقم بقياس المقاومة أثناء تشغيل مصدر الجهد! وجود تيار خارجي يشوه القراءة وقد يحرق دائرة القياس الداخلية للأوميتر. افصل مصدر الجهد أولاً.';
        reading = 0;
        isOverload = true;
      } else if (redElem.id === blackElem.id && (redElem.type === 'resistor' || redElem.type === 'potentiometer')) {
        reading = redElem.value || 1000;
      } else {
        reading = 0;
      }
    } else if (selectedMeter === 'wattmeter') {
      unit = 'mW';
      if (redElem.id === blackElem.id) {
        reading = (redSim?.power ?? 0) * 1000;
      }
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base">حامل أجهزة القياس المخبرية (Digital Test Bench)</h4>
            <p className="text-[11px] text-slate-400">ملتيميتر رقمي (DMM) عالي الدقة مزود بمجسات افتراضية ونظام كشف أخطاء التوصيل</p>
          </div>
        </div>

        {/* Meter Mode Selector */}
        <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedMeter('voltmeter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMeter === 'voltmeter' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            فولتميتر (DC V)
          </button>
          <button
            onClick={() => setSelectedMeter('ammeter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMeter === 'ammeter' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            أميتر (DC mA)
          </button>
          <button
            onClick={() => setSelectedMeter('ohmmeter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMeter === 'ohmmeter' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            أوميتر (Ω Ohms)
          </button>
          <button
            onClick={() => setSelectedMeter('wattmeter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMeter === 'wattmeter' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            واطميتر (Power mW)
          </button>
        </div>
      </div>

      {/* DMM Hardware Mockup */}
      <div className="max-w-xl mx-auto bg-gradient-to-b from-amber-500 to-amber-600 p-3 sm:p-4 rounded-3xl shadow-2xl border-4 border-amber-700">
        <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4">
          {/* Top Label */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono font-bold tracking-widest text-amber-400">FIORE DMM-3000 PRO</span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
              {isSimulating ? 'ON (ACTIVE)' : 'OFF (STANDBY)'}
            </span>
          </div>

          {/* LCD Digital Display */}
          <div className="bg-emerald-950/40 border-2 border-emerald-500/40 rounded-xl p-4 sm:p-6 text-center font-mono shadow-inner relative overflow-hidden">
            <div className="absolute top-2 start-3 text-[10px] text-emerald-400/70 font-sans flex items-center gap-1">
              <span>AUTO RANGE</span>
              {isReversePolarity && <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/40">عكس قطبية (-)</span>}
            </div>

            <div className="text-3xl sm:text-5xl font-black text-emerald-400 tracking-wider">
              {isOverload ? (
                <span className="text-rose-400">O . L</span>
              ) : !isSimulating ? (
                <span className="text-slate-600">0.000</span>
              ) : (
                <>
                  {reading.toFixed(3)}
                  <span className="text-lg sm:text-2xl ms-2 text-emerald-300 font-sans">{unit}</span>
                </>
              )}
            </div>

            <div className="mt-2 text-[10px] text-emerald-400/60 uppercase">
              {selectedMeter === 'voltmeter' && 'DC Voltage Potential Difference (V)'}
              {selectedMeter === 'ammeter' && 'DC Branch Loop Current (mA)'}
              {selectedMeter === 'ohmmeter' && 'Component Resistance (Ω)'}
              {selectedMeter === 'wattmeter' && 'Dissipated Power (mW)'}
            </div>
          </div>

          {/* Probe Assignment Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            {/* Red Probe (+) */}
            <div className="bg-slate-900 border border-red-500/40 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-red-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span>المجس الموجب الأحمر (Red Probe +)</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={probeRedComponent}
                  onChange={(e) => setProbeRedComponent(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-[11px]"
                >
                  <option value="">اختر المكون...</option>
                  {components.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
                <select
                  value={probeRedTerminal}
                  onChange={(e) => setProbeRedTerminal(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-[11px]"
                >
                  <option value="t1">الطرف الأول (1)</option>
                  <option value="t2">الطرف الثاني (2)</option>
                  <option value="t3">المنزلق Wiper (3)</option>
                </select>
              </div>
            </div>

            {/* Black Probe (-) */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                <span>المجس السالب الأسود (COM / Black Probe -)</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={probeBlackComponent}
                  onChange={(e) => setProbeBlackComponent(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-[11px]"
                >
                  <option value="">اختر المكون...</option>
                  {components.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
                <select
                  value={probeBlackTerminal}
                  onChange={(e) => setProbeBlackTerminal(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-[11px]"
                >
                  <option value="t1">الطرف الأول (1)</option>
                  <option value="t2">الطرف الثاني (2)</option>
                  <option value="t3">المنزلق Wiper (3)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Connection Warning Banner */}
      {warningMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 ${
            warningSeverity === 'danger'
              ? 'bg-rose-950/80 border-rose-500/60 text-rose-200'
              : 'bg-amber-950/80 border-amber-500/60 text-amber-200'
          }`}
        >
          <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold block">تحذير أخطاء القياس المخبري:</span>
            <p className="leading-relaxed">{warningMessage}</p>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="font-bold text-cyan-400 block mb-1">قياس الجهد (V):</span>
          يوصل الفولتميتر دائماً <strong className="text-white">على التوازي</strong> عبر طرفي العنصر دون فتح الدائرة.
        </div>
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="font-bold text-amber-400 block mb-1">قياس التيار (I):</span>
          يوصل الأميتر <strong className="text-white">على التوالي</strong>؛ يجب كسر المسار ووضع الجهاز داخله.
        </div>
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="font-bold text-emerald-400 block mb-1">قياس المقاومة (R):</span>
          يجب فصل مصدر الطاقة تماماً قبل التوصيل لتفادي حرق الجهاز أو إعطاء نتائج خاطئة.
        </div>
      </div>
    </div>
  );
};

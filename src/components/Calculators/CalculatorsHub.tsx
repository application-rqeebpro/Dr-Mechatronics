import React, { useState } from 'react';
import {
  Calculator,
  Zap,
  RotateCw,
  Gauge,
  Cpu,
  Layers,
  ArrowRightLeft,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const CalculatorsHub: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<string>('ohm');

  // 1. Ohm & Power State
  const [ohmV, setOhmV] = useState<string>('12');
  const [ohmR, setOhmR] = useState<string>('10');

  // 2. Resistors Series & Parallel
  const [rValues, setRValues] = useState<string>('10, 20, 30');

  // 3. Torque, Power & RPM
  const [motorPower, setMotorPower] = useState<string>('750'); // Watts
  const [motorRpm, setMotorRpm] = useState<string>('1500'); // RPM

  // 4. Gear Ratio
  const [teethDriver, setTeethDriver] = useState<string>('15');
  const [teethDriven, setTeethDriven] = useState<string>('60');

  // 5. RC Time Constant & Cutoff
  const [rcR, setRcR] = useState<string>('10000'); // Ohms (10k)
  const [rcC, setRcC] = useState<string>('0.1'); // uF

  // 6. Stepper Motor Calculator
  const [stepperStepsPerRev, setStepperStepsPerRev] = useState<string>('200'); // 1.8 deg
  const [stepperTargetRpm, setStepperTargetRpm] = useState<string>('300');

  // 7. Unit Converter
  const [unitType, setUnitType] = useState<'torque' | 'pressure' | 'power' | 'angle'>('torque');
  const [unitInputVal, setUnitInputVal] = useState<string>('10');

  // CALCULATIONS:
  // Ohm's
  const vNum = parseFloat(ohmV) || 0;
  const rNum = parseFloat(ohmR) || 0;
  const ohmI = rNum > 0 ? vNum / rNum : 0;
  const ohmP = vNum * ohmI;

  // Series & Parallel
  const rList = rValues
    .split(',')
    .map((s) => parseFloat(s.trim()))
    .filter((n) => !isNaN(n) && n > 0);
  const rSeries = rList.reduce((acc, val) => acc + val, 0);
  const rParallel =
    rList.length > 0
      ? 1 / rList.reduce((acc, val) => acc + (val > 0 ? 1 / val : 0), 0)
      : 0;

  // Torque & RPM
  const pNum = parseFloat(motorPower) || 0;
  const rpmNum = parseFloat(motorRpm) || 0;
  const omega = (rpmNum * 2 * Math.PI) / 60; // rad/s
  const torque = omega > 0 ? pNum / omega : 0;

  // Gear Ratio
  const tDriver = parseFloat(teethDriver) || 1;
  const tDriven = parseFloat(teethDriven) || 1;
  const gearRatio = tDriven / tDriver;

  // RC Time Constant
  const rOhms = parseFloat(rcR) || 0;
  const cFarads = (parseFloat(rcC) || 0) * 1e-6;
  const tauSeconds = rOhms * cFarads;
  const cutoffFreq = tauSeconds > 0 ? 1 / (2 * Math.PI * tauSeconds) : 0;

  // Stepper Pulse Frequency
  const spr = parseFloat(stepperStepsPerRev) || 200;
  const trpm = parseFloat(stepperTargetRpm) || 0;
  const stepAngle = spr > 0 ? 360 / spr : 1.8;
  const pulseFreqHz = (trpm * spr) / 60;

  // Unit conversion
  const inputN = parseFloat(unitInputVal) || 0;
  let convResult = '';
  if (unitType === 'torque') {
    convResult = `${inputN} N·m = ${(inputN * 0.737562).toFixed(3)} lb·ft`;
  } else if (unitType === 'pressure') {
    convResult = `${inputN} bar = ${(inputN * 100).toFixed(1)} kPa = ${(inputN * 14.5038).toFixed(2)} psi`;
  } else if (unitType === 'power') {
    convResult = `${inputN} Watts = ${(inputN / 745.7).toFixed(3)} HP (حصان ميكانيكي)`;
  } else if (unitType === 'angle') {
    convResult = `${inputN}° = ${((inputN * Math.PI) / 180).toFixed(4)} rad`;
  }

  const calcTabs = [
    { id: 'ohm', name: 'قانون أوم والقدرة', icon: Zap },
    { id: 'resistors', name: 'المقاومات توالي وتوازي', icon: Layers },
    { id: 'torque', name: 'العزم والقدرة والسرعة', icon: RotateCw },
    { id: 'gears', name: 'التروس ونسب التخفيض', icon: Gauge },
    { id: 'rc', name: 'دوائر RC وثابت الوقت', icon: Cpu },
    { id: 'stepper', name: 'محركات الخطوة والسيرفو', icon: Cpu },
    { id: 'units', name: 'تحويل الوحدات الهندسية', icon: ArrowRightLeft },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Calculator className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">الحاسبات الهندسية التفاعلية (Engineering Calculators)</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              حسابات فورية دقيقة مع تفصيل القوانين والوحدات وتنبيهات المدخلات غير المنطقية
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Tab Switcher */}
      <div className="flex flex-wrap gap-2">
        {calcTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCalc === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCalc(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/20'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Active Calculator Box */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mt-4">
        {/* 1. Ohm's Law Calculator */}
        {activeCalc === 'ohm' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-slate-200">حاسبة قانون أوم والقدرة الكهربائية</span>
              <span className="text-xs font-mono text-cyan-400">P = V · I = I² · R</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">الجهد الكهربائي (V) بالفولت</label>
                <input
                  type="number"
                  value={ohmV}
                  onChange={(e) => setOhmV(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">المقاومة الكهربائية (R) بالأوم</label>
                <input
                  type="number"
                  value={ohmR}
                  onChange={(e) => setOhmR(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {rNum <= 0 && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                تحذير: المقاومة يجب أن تكون أكبر من الصفر لتفادي قصر الدائرة (Short Circuit) والقسمة على صفر!
              </div>
            )}

            {/* Results */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">شدة التيار المار (I)</span>
                <span className="text-xl font-mono font-bold text-cyan-400">
                  {ohmI.toFixed(3)} <span className="text-xs">أمبير (A)</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">({(ohmI * 1000).toFixed(1)} mA)</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">القدرة الكهربائية المبددة (P)</span>
                <span className="text-xl font-mono font-bold text-amber-400">
                  {ohmP.toFixed(2)} <span className="text-xs">واط (Watts)</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">طاقة حرارية مبددة</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Series & Parallel Resistors */}
        {activeCalc === 'resistors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-slate-200">حاسبة المقاومات على التوالي والتوازي</span>
              <span className="text-xs font-mono text-cyan-400">R_series = Σ R_i | 1/R_parallel = Σ 1/R_i</span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                قيم المقاومات بالأوم (مفصولة بفاصلة comma):
              </label>
              <input
                type="text"
                value={rValues}
                onChange={(e) => setRValues(e.target.value)}
                placeholder="مثال: 10, 22, 47, 100"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                تم التعرف على {rList.length} مقاومات صالحة في الحساب.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">المقاومة المكافئة على التوالي (R_eq Series)</span>
                <span className="text-xl font-mono font-bold text-cyan-400">
                  {rSeries.toFixed(2)} <span className="text-xs">Ω</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">تجمع القيم جمعًا مباشرًا</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">المقاومة المكافئة على التوازي (R_eq Parallel)</span>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {rParallel.toFixed(2)} <span className="text-xs">Ω</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">أصغر من أصغر مقاومة متصلة</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. Torque, Power & RPM */}
        {activeCalc === 'torque' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-slate-200">حاسبة العزم والقدرة الميكانيكية وسرعة الدوران</span>
              <span className="text-xs font-mono text-cyan-400">P = τ · ω | ω = 2πN/60</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">قدرة المحرك (Power P) بالواط</label>
                <input
                  type="number"
                  value={motorPower}
                  onChange={(e) => setMotorPower(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">سرعة الدوران (RPM - دقيقة/لفة)</label>
                <input
                  type="number"
                  value={motorRpm}
                  onChange={(e) => setMotorRpm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">السرعة الزاوية (ω)</span>
                <span className="text-xl font-mono font-bold text-sky-400">
                  {omega.toFixed(2)} <span className="text-xs">rad/s</span>
                </span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">عزم الدوران المتولد (Torque τ)</span>
                <span className="text-xl font-mono font-bold text-amber-400">
                  {torque.toFixed(3)} <span className="text-xs">N·m</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">({(torque * 141.6).toFixed(1)} oz·in)</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Gear Ratio */}
        {activeCalc === 'gears' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-slate-200">حاسبة نسب التروس ونقل العزم</span>
              <span className="text-xs font-mono text-cyan-400">GR = N_driven / N_driver = τ_out / τ_in</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">عدد أسنان الترس القائد (Driver N1)</label>
                <input
                  type="number"
                  value={teethDriver}
                  onChange={(e) => setTeethDriver(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">عدد أسنان الترس المقاد (Driven N2)</label>
                <input
                  type="number"
                  value={teethDriven}
                  onChange={(e) => setTeethDriven(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block mb-1">نسبة التخفيض (Gear Ratio):</span>
                <span className="text-2xl font-mono font-bold text-cyan-400">
                  {gearRatio.toFixed(2)} : 1
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>• العزم الخارج يتضاعف بمقدار: <strong className="text-amber-400">{gearRatio.toFixed(2)}x</strong></div>
                <div>• السرعة الدورانية الخارجة تنخفض بمقدار: <strong className="text-rose-400">{(1 / gearRatio).toFixed(2)}x</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* 5. RC Circuit Time Constant */}
        {activeCalc === 'rc' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-slate-200">حاسبة دوائر RC وثابت الوقت وتردد القطع</span>
              <span className="text-xs font-mono text-cyan-400">τ = R · C | fc = 1 / (2π · R · C)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">المقاومة R (أوم)</label>
                <input
                  type="number"
                  value={rcR}
                  onChange={(e) => setRcR(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">السعة C (ميكروفاراد μF)</label>
                <input
                  type="number"
                  value={rcC}
                  onChange={(e) => setRcC(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">ثابت الوقت (τ - Tau)</span>
                <span className="text-xl font-mono font-bold text-cyan-400">
                  {(tauSeconds * 1000).toFixed(2)} <span className="text-xs">ms</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">يصل إلى 63.2% من الجهد خلال τ</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">تردد القطع (Cutoff Frequency fc)</span>
                <span className="text-xl font-mono font-bold text-purple-400">
                  {cutoffFreq.toFixed(1)} <span className="text-xs">Hz</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">نقطة هبوط -3dB في الفلتر</span>
              </div>
            </div>
          </div>
        )}

        {/* 6. Stepper Motor Sizing */}
        {activeCalc === 'stepper' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-slate-200">حاسبة محركات الخطوة ومعدل النبضات</span>
              <span className="text-xs font-mono text-cyan-400">Pulse Freq = (RPM · Steps/Rev) / 60</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">عدد الخطوات للدورة (Steps Per Rev)</label>
                <input
                  type="number"
                  value={stepperStepsPerRev}
                  onChange={(e) => setStepperStepsPerRev(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">السرعة المستهدفة (Target RPM)</label>
                <input
                  type="number"
                  value={stepperTargetRpm}
                  onChange={(e) => setStepperTargetRpm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">زاوية الخطوة الواحدة (Step Angle)</span>
                <span className="text-xl font-mono font-bold text-cyan-400">
                  {stepAngle.toFixed(2)}°
                </span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">تردد نبضات التحكم المطلوب</span>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {pulseFreqHz.toFixed(1)} <span className="text-xs">Hz (نبضة/ثانية)</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 7. Engineering Unit Converter */}
        {activeCalc === 'units' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-slate-200">تحويل الوحدات الهندسية للميكاترونكس</span>
              <span className="text-xs font-mono text-cyan-400">SI & Imperial Precision</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(['torque', 'pressure', 'power', 'angle'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setUnitType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    unitType === t ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {t === 'torque' && 'العزم (Torque)'}
                  {t === 'pressure' && 'الضغط (Pressure)'}
                  {t === 'power' && 'القدرة (Power)'}
                  {t === 'angle' && 'الزوايا (Angles)'}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">القيمة المراد تحويلها:</label>
              <input
                type="number"
                value={unitInputVal}
                onChange={(e) => setUnitInputVal(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">النتيجة بعد التحويل:</span>
              <span className="text-lg font-mono font-bold text-cyan-400">{convResult}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

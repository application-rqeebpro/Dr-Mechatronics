import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, HelpCircle, Sparkles } from 'lucide-react';

interface ColorBand {
  color: string;
  nameAr: string;
  nameEn: string;
  digit: number;
  multiplier: number;
  tolerance?: number;
  bgClass: string;
  textClass: string;
}

const COLOR_BANDS: ColorBand[] = [
  { color: 'black', nameAr: 'أسود', nameEn: 'Black', digit: 0, multiplier: 1, bgClass: 'bg-black', textClass: 'text-white' },
  { color: 'brown', nameAr: 'بني', nameEn: 'Brown', digit: 1, multiplier: 10, tolerance: 1, bgClass: 'bg-amber-900', textClass: 'text-amber-100' },
  { color: 'red', nameAr: 'أحمر', nameEn: 'Red', digit: 2, multiplier: 100, tolerance: 2, bgClass: 'bg-red-600', textClass: 'text-white' },
  { color: 'orange', nameAr: 'برتقالي', nameEn: 'Orange', digit: 3, multiplier: 1000, bgClass: 'bg-orange-500', textClass: 'text-white' },
  { color: 'yellow', nameAr: 'أصفر', nameEn: 'Yellow', digit: 4, multiplier: 10000, bgClass: 'bg-yellow-400', textClass: 'text-black' },
  { color: 'green', nameAr: 'أخضر', nameEn: 'Green', digit: 5, multiplier: 100000, tolerance: 0.5, bgClass: 'bg-emerald-600', textClass: 'text-white' },
  { color: 'blue', nameAr: 'أزرق', nameEn: 'Blue', digit: 6, multiplier: 1000000, tolerance: 0.25, bgClass: 'bg-blue-600', textClass: 'text-white' },
  { color: 'violet', nameAr: 'بنفسجي', nameEn: 'Violet', digit: 7, multiplier: 10000000, tolerance: 0.1, bgClass: 'bg-purple-600', textClass: 'text-white' },
  { color: 'gray', nameAr: 'رمادي', nameEn: 'Gray', digit: 8, multiplier: 100000000, tolerance: 0.05, bgClass: 'bg-slate-400', textClass: 'text-black' },
  { color: 'white', nameAr: 'أبيض', nameEn: 'White', digit: 9, multiplier: 1000000000, bgClass: 'bg-white', textClass: 'text-black' },
  { color: 'gold', nameAr: 'ذهبي', nameEn: 'Gold', digit: -1, multiplier: 0.1, tolerance: 5, bgClass: 'bg-amber-400', textClass: 'text-black' },
  { color: 'silver', nameAr: 'فضي', nameEn: 'Silver', digit: -2, multiplier: 0.01, tolerance: 10, bgClass: 'bg-slate-300', textClass: 'text-black' },
];

export const ResistorColorCodeTool: React.FC = () => {
  const [bandType, setBandType] = useState<'4-band' | '5-band'>('4-band');
  const [b1, setB1] = useState<number>(1); // Brown (1)
  const [b2, setB2] = useState<number>(0); // Black (0)
  const [b3, setB3] = useState<number>(2); // Red (x100) -> 1kΩ default
  const [b4, setB4] = useState<number>(10); // Gold (±5%)
  const [bThirdDigit, setBThirdDigit] = useState<number>(0); // for 5-band

  // Calculate nominal resistance
  let nominalValue = 0;
  let toleranceVal = 5;

  if (bandType === '4-band') {
    const digit1 = COLOR_BANDS[b1].digit;
    const digit2 = COLOR_BANDS[b2].digit;
    const mult = COLOR_BANDS[b3].multiplier;
    nominalValue = (digit1 * 10 + digit2) * mult;
    toleranceVal = COLOR_BANDS[b4].tolerance ?? 5;
  } else {
    const digit1 = COLOR_BANDS[b1].digit;
    const digit2 = COLOR_BANDS[b2].digit;
    const digit3 = COLOR_BANDS[bThirdDigit].digit;
    const mult = COLOR_BANDS[b3].multiplier;
    nominalValue = (digit1 * 100 + digit2 * 10 + digit3) * mult;
    toleranceVal = COLOR_BANDS[b4].tolerance ?? 1;
  }

  const minVal = nominalValue * (1 - toleranceVal / 100);
  const maxVal = nominalValue * (1 + toleranceVal / 100);

  const formatOhms = (ohms: number) => {
    if (ohms >= 1e6) return `${(ohms / 1e6).toFixed(2)} MΩ`;
    if (ohms >= 1e3) return `${(ohms / 1e3).toFixed(2)} kΩ`;
    return `${ohms.toFixed(1)} Ω`;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            أداة محاكاة شفرة ألوان المقاومات (Resistor Color Code Simulator)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            التجربة 3 من دليل جيمس فيوري — حدد ألوان الأشرطة لتحديد المقاومة الاسمية ونطاق التفاوت
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setBandType('4-band')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              bandType === '4-band' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            نظام 4 نطاقات (Standard 5%)
          </button>
          <button
            onClick={() => setBandType('5-band')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              bandType === '5-band' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            نظام 5 نطاقات (Precision 1%)
          </button>
        </div>
      </div>

      {/* Visual Resistor Graphic */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center space-y-4">
        <div className="relative w-full max-w-md h-24 flex items-center justify-center">
          {/* Resistor Lead Left */}
          <div className="absolute left-4 w-24 h-2 bg-slate-400 rounded-full" />
          {/* Resistor Lead Right */}
          <div className="absolute right-4 w-24 h-2 bg-slate-400 rounded-full" />

          {/* Resistor Body */}
          <div className="relative z-10 w-64 h-16 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 rounded-full border-2 border-amber-300 shadow-xl flex items-center justify-around px-8">
            {/* Band 1 */}
            <div className={`w-4 h-16 ${COLOR_BANDS[b1].bgClass} border-x border-black/20 shadow`} />
            {/* Band 2 */}
            <div className={`w-4 h-16 ${COLOR_BANDS[b2].bgClass} border-x border-black/20 shadow`} />
            {/* Optional Band 3 for 5-band */}
            {bandType === '5-band' && (
              <div className={`w-4 h-16 ${COLOR_BANDS[bThirdDigit].bgClass} border-x border-black/20 shadow`} />
            )}
            {/* Multiplier Band */}
            <div className={`w-4 h-16 ${COLOR_BANDS[b3].bgClass} border-x border-black/20 shadow`} />
            {/* Spacing gap */}
            <div className="w-6" />
            {/* Tolerance Band */}
            <div className={`w-4 h-16 ${COLOR_BANDS[b4].bgClass} border-x border-black/20 shadow`} />
          </div>
        </div>

        {/* Readout Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg mt-4 text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
            <span className="text-[11px] text-slate-400 block">القيمة الاسمية (Nominal)</span>
            <span className="text-xl font-black text-cyan-400 font-mono">{formatOhms(nominalValue)}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
            <span className="text-[11px] text-slate-400 block">نسبة التفاوت (Tolerance)</span>
            <span className="text-xl font-black text-amber-400 font-mono">±{toleranceVal}%</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
            <span className="text-[11px] text-slate-400 block">المدى المقبول (Min - Max)</span>
            <span className="text-xs font-bold text-emerald-400 font-mono block mt-1">
              {formatOhms(minVal)} - {formatOhms(maxVal)}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Selectors for Each Band */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Band 1 */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">النطاق 1: الرقم الأول</label>
          <select
            value={b1}
            onChange={(e) => setB1(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            {COLOR_BANDS.slice(1, 10).map((b, idx) => (
              <option key={b.color} value={idx + 1}>
                {b.nameAr} ({b.nameEn}) - {b.digit}
              </option>
            ))}
          </select>
        </div>

        {/* Band 2 */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">النطاق 2: الرقم الثاني</label>
          <select
            value={b2}
            onChange={(e) => setB2(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            {COLOR_BANDS.slice(0, 10).map((b, idx) => (
              <option key={b.color} value={idx}>
                {b.nameAr} ({b.nameEn}) - {b.digit}
              </option>
            ))}
          </select>
        </div>

        {/* 5-Band 3rd digit */}
        {bandType === '5-band' && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">النطاق 3: الرقم الثالث</label>
            <select
              value={bThirdDigit}
              onChange={(e) => setBThirdDigit(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {COLOR_BANDS.slice(0, 10).map((b, idx) => (
                <option key={b.color} value={idx}>
                  {b.nameAr} ({b.nameEn}) - {b.digit}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Multiplier */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">النطاق: المضاعف (Multiplier)</label>
          <select
            value={b3}
            onChange={(e) => setB3(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            {COLOR_BANDS.map((b, idx) => (
              <option key={b.color} value={idx}>
                {b.nameAr} (×{b.multiplier >= 1 ? b.multiplier : b.multiplier})
              </option>
            ))}
          </select>
        </div>

        {/* Tolerance */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">نطاق التفاوت (Tolerance)</label>
          <select
            value={b4}
            onChange={(e) => setB4(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            {COLOR_BANDS.filter((b) => b.tolerance !== undefined).map((b) => (
              <option key={b.color} value={COLOR_BANDS.indexOf(b)}>
                {b.nameAr} (±{b.tolerance}%)
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

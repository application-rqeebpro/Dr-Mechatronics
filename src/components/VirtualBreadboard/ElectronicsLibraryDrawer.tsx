import React, { useState } from 'react';
import { ComponentType } from '../../types/dcLab';
import {
  Zap,
  Battery,
  Sliders,
  Radio,
  Power,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Cpu,
  Flame,
  Volume2
} from 'lucide-react';

interface Props {
  onAddComponent: (type: ComponentType) => void;
  selectedWireColor: string;
  onSelectWireColor: (color: string) => void;
  onOpenOscilloscope: () => void;
  onOpenLectureModal: () => void;
}

export const ElectronicsLibraryDrawer: React.FC<Props> = ({
  onAddComponent,
  selectedWireColor,
  onSelectWireColor,
  onOpenOscilloscope,
  onOpenLectureModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'sources' | 'passives' | 'semiconductors' | 'actuators'
  >('sources');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const wireColors = [
    { color: '#ef4444', label: 'أحمر (موجب +)' },
    { color: '#3b82f6', label: 'أزرق (سالب -)' },
    { color: '#10b981', label: 'أخضر (تأريض GND)' },
    { color: '#f59e0b', label: 'أصفر (إشارة)' },
    { color: '#1e293b', label: 'أسود (أرضي/مشترك)' },
    { color: '#8b5cf6', label: 'بنفسجي (قاعدة/بوابة)' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4">
      {/* Drawer Toggle & Wire Color Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-cyan-400"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>مكتبة العناصر والأجهزة الإلكترونية (Component Palette)</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Wire Color Chooser */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">لون سلك التوصيل:</span>
          <div className="flex items-center gap-1.5">
            {wireColors.map((w) => (
              <button
                key={w.color}
                onClick={() => onSelectWireColor(w.color)}
                style={{ backgroundColor: w.color }}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${
                  selectedWireColor === w.color
                    ? 'border-white scale-125 shadow-md shadow-cyan-500/30'
                    : 'border-transparent hover:scale-110 opacity-80'
                }`}
                title={w.label}
              />
            ))}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveCategory('sources')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeCategory === 'sources'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              التغذية وأجهزة القياس
            </button>
            <button
              onClick={() => setActiveCategory('passives')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeCategory === 'passives'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              المكونات الخاملة (R, C, L)
            </button>
            <button
              onClick={() => setActiveCategory('semiconductors')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeCategory === 'semiconductors'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              أشباه الموصلات والترانزستور
            </button>
            <button
              onClick={() => setActiveCategory('actuators')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeCategory === 'actuators'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              المحركات والمشغلات والمفاتيح
            </button>
          </div>

          {/* Category Items Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {activeCategory === 'sources' && (
              <>
                <button
                  onClick={() => onAddComponent('dc_source')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-cyan-400 font-bold block">⚡ مصدر جهد DC</span>
                  <span className="text-[10px] text-slate-400 block">قابل للضبط 0-30V</span>
                </button>
                <button
                  onClick={() => onAddComponent('battery')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-amber-400 font-bold block">🔋 بطارية 9V</span>
                  <span className="text-[10px] text-slate-400 block">تغذية قياسية مستمرة</span>
                </button>
                <button
                  onClick={() => onAddComponent('current_source')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-blue-400 font-bold block">⮁ مصدر تيار مستمر</span>
                  <span className="text-[10px] text-slate-400 block">تيار ثابت 10mA</span>
                </button>
                <button
                  onClick={onOpenOscilloscope}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-yellow-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-yellow-400 font-bold block">📊 راسم إشارة (DSO)</span>
                  <span className="text-[10px] text-slate-400 block">Oscilloscope ثنائي القناة</span>
                </button>
                <button
                  onClick={() => onAddComponent('ground')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-emerald-400 font-bold block">⏚ تأريض مرجعي GND</span>
                  <span className="text-[10px] text-slate-400 block">نقطة مرجعية 0V</span>
                </button>
              </>
            )}

            {activeCategory === 'passives' && (
              <>
                <button
                  onClick={() => onAddComponent('resistor')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-amber-400 font-bold block">⏛ مقاومة كربونية</span>
                  <span className="text-[10px] text-slate-400 block">1kΩ, 10kΩ, 100Ω</span>
                </button>
                <button
                  onClick={() => onAddComponent('potentiometer')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-purple-400 font-bold block">🎛️ مقاومة متغيرة (Pot)</span>
                  <span className="text-[10px] text-slate-400 block">10kΩ مع منزلق Wiper</span>
                </button>
                <button
                  onClick={() => onAddComponent('capacitor')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-sky-400 font-bold block">⏸️ مكثف كيميائي</span>
                  <span className="text-[10px] text-slate-400 block">100μF, 470μF قطبي</span>
                </button>
                <button
                  onClick={() => onAddComponent('inductor')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-orange-400 font-bold block">〰️ ملف محاثة (Coil)</span>
                  <span className="text-[10px] text-slate-400 block">50mH ملف مغناطيسي</span>
                </button>
              </>
            )}

            {activeCategory === 'semiconductors' && (
              <>
                <button
                  onClick={() => onAddComponent('diode')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-rose-400 font-bold block">▷| دايود سيليكون 1N4007</span>
                  <span className="text-[10px] text-slate-400 block">انحياز أمامي 0.7V</span>
                </button>
                <button
                  onClick={() => onAddComponent('led')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-red-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-red-400 font-bold block">💡 دايود ضوئي LED</span>
                  <span className="text-[10px] text-slate-400 block">يضيء عند انسياب التيار</span>
                </button>
                <button
                  onClick={() => onAddComponent('npn_bjt')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-emerald-400 font-bold block">⎋ ترانزستور NPN (2N2222)</span>
                  <span className="text-[10px] text-slate-400 block">مكبر ومفتاح إلكتروني</span>
                </button>
                <button
                  onClick={() => onAddComponent('pnp_bjt')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-teal-400 font-bold block">⎋ ترانزستور PNP (2N3906)</span>
                  <span className="text-[10px] text-slate-400 block">انحياز سالب</span>
                </button>
                <button
                  onClick={() => onAddComponent('n_mosfet')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-indigo-400 font-bold block">⎐ ترانزستور N-MOSFET</span>
                  <span className="text-[10px] text-slate-400 block">تحكم بالجهد Vth=2V</span>
                </button>
              </>
            )}

            {activeCategory === 'actuators' && (
              <>
                <button
                  onClick={() => onAddComponent('dc_motor')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-cyan-400 font-bold block">⚙️ محرك DC Motor</span>
                  <span className="text-[10px] text-slate-400 block">يدور مع عداد RPM حقيقي</span>
                </button>
                <button
                  onClick={() => onAddComponent('relay')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-purple-400 font-bold block">🔀 مرحل Relay كهرومغناطيسي</span>
                  <span className="text-[10px] text-slate-400 block">ملف 5V وتلامس COM/NO</span>
                </button>
                <button
                  onClick={() => onAddComponent('bulb')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-yellow-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-yellow-400 font-bold block">💡 مصباح إشارة 12V</span>
                  <span className="text-[10px] text-slate-400 block">مقاومة فتيل تتوهج</span>
                </button>
                <button
                  onClick={() => onAddComponent('buzzer')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-rose-400 font-bold block">🔔 جرس / طنان Buzzer</span>
                  <span className="text-[10px] text-slate-400 block">تنبيه صوتي واهتزاز</span>
                </button>
                <button
                  onClick={() => onAddComponent('switch')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-emerald-400 font-bold block">🔌 مفتاح تبديل SPST</span>
                  <span className="text-[10px] text-slate-400 block">فتح وإغلاق الدائرة</span>
                </button>
                <button
                  onClick={() => onAddComponent('pushbutton')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 rounded-xl text-start text-xs space-y-1 transition-all"
                >
                  <span className="text-teal-400 font-bold block">🔘 زر ضاغط Pushbutton</span>
                  <span className="text-[10px] text-slate-400 block">توصيل لحظي بالضغط</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

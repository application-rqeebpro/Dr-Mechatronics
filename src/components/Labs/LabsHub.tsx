import React, { useState } from 'react';
import { RLCCircuitLab } from './RLCCircuitLab';
import { OhmKirchhoffLab } from './OhmKirchhoffLab';
import { DigitalLogicLab } from './DigitalLogicLab';
import { RoboticArmLab } from './RoboticArmLab';
import { PIDControlLab } from './PIDControlLab';
import { ArduinoSimLab } from './ArduinoSimLab';
import {
  Waves,
  Zap,
  Cpu,
  Bot,
  Sliders,
  Terminal,
  FlaskConical,
  Info,
} from 'lucide-react';

export const LabsHub: React.FC = () => {
  const [activeLab, setActiveLab] = useState<
    'rlc' | 'ohm' | 'logic' | 'robotics' | 'pid' | 'arduino'
  >('rlc');

  const labTabs = [
    {
      id: 'rlc' as const,
      name: 'دوائر التيار المتردد RLC',
      subtitle: 'راسم إشارة ورنين كهربائي',
      icon: Waves,
    },
    {
      id: 'ohm' as const,
      name: 'قانون أوم وكيرشوف',
      subtitle: 'تدفق إلكترونات وتبديد حراري',
      icon: Zap,
    },
    {
      id: 'logic' as const,
      name: 'البوابات والمنطق الرقمي',
      subtitle: 'مفاتيح، مصابيح، وجدول الحقيقة',
      icon: Cpu,
    },
    {
      id: 'robotics' as const,
      name: 'الذراع الروبوتية الحركية',
      subtitle: 'حركيات مباشرة وعكسية IK',
      icon: Bot,
    },
    {
      id: 'pid' as const,
      name: 'أنظمة التحكم واستجابة PID',
      subtitle: 'تجاوز، استقرار، وضبط الكسب',
      icon: Sliders,
    },
    {
      id: 'arduino' as const,
      name: 'الأردوينو والمتحكمات',
      subtitle: 'سيرفو، حساس مسافة، وكود C++',
      icon: Terminal,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Labs Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FlaskConical className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                مختبرات المحاكاة التفاعلية (Interactive Simulation Labs)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                بيئات افتراضية حية لاختبار وتعديل قيم المكونات ومشاهدة الرسوم البيانية في الزمن الحقيقي
              </p>
            </div>
          </div>
        </div>

        {/* Labs Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-5">
          {labTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeLab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveLab(tab.id)}
                className={`p-3 rounded-2xl border text-start transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-cyan-950/50 border-cyan-500 text-white shadow-lg shadow-cyan-500/15 scale-102'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                </div>
                <div>
                  <div className="font-bold text-xs line-clamp-1">{tab.name}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                    {tab.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Real Lab vs Simulation Notice */}
        <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>تنويه أكاديمي: </strong> هذه محاكاة برمجية رياضية دقيقة لمعادلات الميكاترونكس
            المعيارية؛ تساعدك في فهم السلوك النظري قبل الشروع في التوصيل الفيزيائي الحقيقي داخل المختبر.
          </span>
        </div>
      </div>

      {/* Render Active Lab */}
      <div>
        {activeLab === 'rlc' && <RLCCircuitLab />}
        {activeLab === 'ohm' && <OhmKirchhoffLab />}
        {activeLab === 'logic' && <DigitalLogicLab />}
        {activeLab === 'robotics' && <RoboticArmLab />}
        {activeLab === 'pid' && <PIDControlLab />}
        {activeLab === 'arduino' && <ArduinoSimLab />}
      </div>
    </div>
  );
};

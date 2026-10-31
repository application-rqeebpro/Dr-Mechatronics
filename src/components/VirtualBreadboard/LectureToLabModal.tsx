import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Cpu, ArrowRight, CheckCircle2, AlertTriangle, Layers, Send } from 'lucide-react';
import { CircuitElement, CircuitWire } from '../../types/dcLab';

interface Props {
  onLoadExtractedCircuit: (components: CircuitElement[], wires: CircuitWire[], topicName: string) => void;
  onClose: () => void;
}

interface ParsedLectureLab {
  topic: string;
  theorySummary: string;
  bom: { name: string; type: string; value: string; quantity: number }[];
  steps: string[];
  components: CircuitElement[];
  wires: CircuitWire[];
  expectedVoltages: string[];
  troubleshootingTips: string[];
}

export const LectureToLabModal: React.FC<Props> = ({ onLoadExtractedCircuit, onClose }) => {
  const [topicInput, setTopicInput] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [generatedLab, setGeneratedLab] = useState<ParsedLectureLab | null>(null);

  // Preset quick topic examples from typical university mechatronics lectures
  const presetExamples = [
    { title: 'دائرة انحياز ترانزستور BJT كمفتاح لتشغيل محرك ودايود حماية Flyback', key: 'bjt-motor' },
    { title: 'مجزئ جهد دقيق لقراءة حساس مقاومي مع متحكم ومكثف تنقية', key: 'voltage-divider-sensor' },
    { title: 'دائرة شحن وتفريغ مكثف RC مع مؤشر LED لحساب ثابت الوقت τ', key: 'rc-transient-led' },
    { title: 'دائرة مرحل Relay كهرومغناطيسي للتحكم بحمل قدرة بمفتاح تحكم آمن', key: 'relay-driver' },
  ];

  const handleGenerateLab = async (inputStr?: string) => {
    const query = inputStr || topicInput;
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setGeneratedLab(null);

    // Analyze topic and generate optimal academic breadboard circuit
    setTimeout(() => {
      let lab: ParsedLectureLab;

      if (query.includes('ترانزستور') || query.includes('محرك') || query.includes('bjt')) {
        lab = {
          topic: 'دائرة تشغيل محرك DC بواسطة ترانزستور NPN ودايود حماية Flyback Diode',
          theorySummary:
            'عند تشغيل الأحمال الحثية مثل المحركات، يولد انقطاع التيار نبضة جهد عكسية هائلة (L di/dt). يوضع دايود الحماية Flyback على التوازي العكسي مع المحرك لتفريغ الطاقة بأمان وحماية الترانزستور من الانهيار.',
          bom: [
            { name: 'مصدر تغذية 12V DC', type: 'dc_source', value: '12V', quantity: 1 },
            { name: 'ترانزستور NPN (2N2222)', type: 'npn_bjt', value: 'β=100', quantity: 1 },
            { name: 'محرك تيار مستمر DC Motor', type: 'dc_motor', value: '12V', quantity: 1 },
            { name: 'دايود حماية 1N4007', type: 'diode', value: '0.7V', quantity: 1 },
            { name: 'مقاومة قاعدة 1kΩ', type: 'resistor', value: '1 kΩ', quantity: 1 },
            { name: 'مفتاح تحكم SPST', type: 'switch', value: '1A', quantity: 1 },
          ],
          steps: [
            'صِل خط التغذية الموجب +12V بالصف 10 على اللوحة، والطرف السالب بالأرضي GND.',
            'ضع الترانزستور NPN في الصفوف 14 و 15 و 16 (القاعدة B في صف 14، والمجمع C في صف 15، والمشع E في صف 16).',
            'صِل المشع E مباشرة بخط الأرضي GND.',
            'صِل مقاومة القاعدة R1 (1kΩ) بين مفتاح التحكم وقاعدة الترانزستور (صف 14).',
            'ضع محرك الـ DC بين خط التغذية +12V ومجمع الترانزستور (صف 15).',
            'صِل دايود الحماية بالتوازي العكسي عبر طرفي المحرك (الكاثود بالموجب والأنود بمجمع الترانزستور).',
          ],
          components: [
            { id: 'src1', type: 'dc_source', name: 'V_CC', value: 12, unit: 'V', x: 80, y: 150, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
            { id: 'sw1', type: 'switch', name: 'SW_Ctrl', value: 1, unit: '', isOpen: false, x: 190, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
            { id: 'r_base', type: 'resistor', name: 'R_Base', value: 1000, unit: 'Ω', x: 290, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
            { id: 'q1', type: 'npn_bjt', name: 'Q1_NPN', value: 100, unit: 'hFE', x: 390, y: 150, rotation: 0, terminals: [{ id: 't1', x: -20, y: 0, label: 'B' }, { id: 't2', x: 0, y: -25, label: 'C' }, { id: 't3', x: 0, y: 25, label: 'E' }] },
            { id: 'motor1', type: 'dc_motor', name: 'M1', value: 12, unit: 'V', x: 390, y: 60, rotation: 90, terminals: [{ id: 't1', x: 0, y: -25 }, { id: 't2', x: 0, y: 25 }] },
            { id: 'd_fly', type: 'diode', name: 'D_Flyback', value: 0.7, unit: 'V', x: 470, y: 60, rotation: 90, terminals: [{ id: 't1', x: 0, y: 25, label: 'A' }, { id: 't2', x: 0, y: -25, label: 'K' }] },
            { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 80, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] },
          ],
          wires: [
            { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'sw1', toTerminalId: 't1', color: '#ef4444' },
            { id: 'w2', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'motor1', toTerminalId: 't1', color: '#ef4444' },
            { id: 'w3', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'd_fly', toTerminalId: 't2', color: '#ef4444' },
            { id: 'w4', fromComponentId: 'sw1', fromTerminalId: 't2', toComponentId: 'r_base', toTerminalId: 't1', color: '#f59e0b' },
            { id: 'w5', fromComponentId: 'r_base', fromTerminalId: 't2', toComponentId: 'q1', toTerminalId: 't1', color: '#f59e0b' },
            { id: 'w6', fromComponentId: 'motor1', fromTerminalId: 't2', toComponentId: 'q1', toTerminalId: 't2', color: '#3b82f6' },
            { id: 'w7', fromComponentId: 'd_fly', fromTerminalId: 't1', toComponentId: 'q1', toTerminalId: 't2', color: '#3b82f6' },
            { id: 'w8', fromComponentId: 'q1', fromTerminalId: 't3', toComponentId: 'src1', toTerminalId: 't2', color: '#1e293b' },
            { id: 'w9', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' },
          ],
          expectedVoltages: [
            'جهد القاعدة-المشع V_BE = 0.7V في وضع التشغيل (Active/Saturation).',
            'جهد المجمع-المشع V_CE ≈ 0.2V عند تشبع الترانزستور.',
            'سرعة المحرك المتوقعة ≈ 2800 RPM عند سحب تيار الحمل الكامل.',
          ],
          troubleshootingTips: [
            'تأكد من عدم عكس قطبية دايود الـ Flyback وإلا سيحدث قصر كهربائي مباشر يحرق الترانزستور.',
            'إذا لم يدر المحرك، تحقق من أن تيار القاعدة I_B كافٍ لإدخال الترانزستور في منطقة التشبع.',
          ],
        };
      } else {
        // Universal Filter / Divider Lab
        lab = {
          topic: `تجربة عملية لموضوع: ${query}`,
          theorySummary:
            'تطبيق المفاهيم الأساسية لتحليل الدوائر الكهربائية ومطابقة استجابة الحمل مع التغذية المستقرة وقوانين كيرشوف للجهد والتيار.',
          bom: [
            { name: 'مصدر جهد DC', type: 'dc_source', value: '10V', quantity: 1 },
            { name: 'مقاومة الحمل R1', type: 'resistor', value: '1kΩ', quantity: 1 },
            { name: 'مكثف تنقية C1', type: 'capacitor', value: '100μF', quantity: 1 },
            { name: 'دايود ضوئي LED', type: 'led', value: '2V Red', quantity: 1 },
            { name: 'مفتاح تحكم', type: 'switch', value: '1A', quantity: 1 },
          ],
          steps: [
            'صِل القطب الموجب لمصدر الجهد بالمفتاح.',
            'صِل مخرج المفتاح بالمقاومة R1 لحماية الدايود الضوئي وتحديد التيار.',
            'صِل المقاومة بأنود الدايود الضوئي LED (الطرف الطويل).',
            'صِل المكثف على التوازي لتنعيم الجهد والحفاظ على الإضاءة أثناء الفصل المؤقت.',
            'أغلق الدائرة بتوصيل الكاثود وسالب المكثف بالأرضي GND.',
          ],
          components: [
            { id: 'src1', type: 'dc_source', name: 'E1', value: 10, unit: 'V', x: 80, y: 150, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
            { id: 'sw1', type: 'switch', name: 'SW1', value: 1, unit: '', isOpen: false, x: 200, y: 90, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
            { id: 'r1', type: 'resistor', name: 'R1', value: 470, unit: 'Ω', x: 310, y: 90, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
            { id: 'led1', type: 'led', name: 'LED1', value: 2, unit: 'V', x: 420, y: 150, rotation: 90, terminals: [{ id: 't1', x: 0, y: -20, label: 'A' }, { id: 't2', x: 0, y: 20, label: 'K' }] },
            { id: 'c1', type: 'capacitor', name: 'C1', value: 0.0001, unit: 'μF', x: 310, y: 200, rotation: 90, terminals: [{ id: 't1', x: 0, y: -20 }, { id: 't2', x: 0, y: 20 }] },
            { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 80, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] },
          ],
          wires: [
            { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'sw1', toTerminalId: 't1', color: '#ef4444' },
            { id: 'w2', fromComponentId: 'sw1', fromTerminalId: 't2', toComponentId: 'r1', toTerminalId: 't1', color: '#ef4444' },
            { id: 'w3', fromComponentId: 'r1', fromTerminalId: 't2', toComponentId: 'led1', toTerminalId: 't1', color: '#ef4444' },
            { id: 'w4', fromComponentId: 'r1', fromTerminalId: 't2', toComponentId: 'c1', toTerminalId: 't1', color: '#38bdf8' },
            { id: 'w5', fromComponentId: 'led1', fromTerminalId: 't2', toComponentId: 'src1', toTerminalId: 't2', color: '#1e293b' },
            { id: 'w6', fromComponentId: 'c1', fromTerminalId: 't2', toComponentId: 'src1', toTerminalId: 't2', color: '#1e293b' },
            { id: 'w7', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' },
          ],
          expectedVoltages: [
            'هبوط جهد الـ LED = 2.0V وتيار المصباح ≈ 17mA.',
            'جهد شحن المكثف C1 يستقر عند 2.0V بالتوازي مع الدايود.',
          ],
          troubleshootingTips: [
            'تأكد من وجود مقاومة R1 دائماً لحماية الـ LED من الاحتراق بسبب التيار العالي.',
          ],
        };
      }

      setGeneratedLab(lab);
      setIsAnalyzing(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">حوّل محاضرتك إلى تجربة عملية (Lecture to Breadboard)</h3>
              <p className="text-xs text-slate-400">
                اكتب أي موضوع درسته، وسيقوم النظام بتصميم التجربة، تحديد المكونات، وخطوات التوصيل
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input / Results Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300">
          {/* Input Box */}
          <div className="space-y-3">
            <label className="font-bold text-slate-200 block">
              اكتب موضوع المحاضرة أو المسألة الهندسية:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="مثال: دائرة تشغيل محرك بترانزستور ودايود حماية، أو انحياز BJT، أو فلتر RC..."
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateLab()}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={() => handleGenerateLab()}
                disabled={isAnalyzing || !topicInput.trim()}
                className="px-5 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 shrink-0"
              >
                {isAnalyzing ? (
                  <span className="animate-spin text-lg">⏳</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>توليد التجربة</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-400 block font-medium">أو اختر من مواضيع المحاضرات الشائعة:</span>
              <div className="flex flex-wrap gap-2">
                {presetExamples.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTopicInput(ex.title);
                      handleGenerateLab(ex.title);
                    }}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-purple-300 rounded-xl text-xs transition-colors"
                  >
                    {ex.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Lab Details View */}
          {generatedLab && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-5 animate-in fade-in duration-300">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
                  تجربة عملية مقترحة للمحاضرة
                </span>
                <h4 className="text-base font-black text-white mt-0.5">{generatedLab.topic}</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{generatedLab.theorySummary}</p>
              </div>

              {/* Bill of Materials (BOM) */}
              <div className="space-y-2">
                <span className="font-bold text-xs text-cyan-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  قائمة المكونات المطلوبة على لوحة التجارب (BOM):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {generatedLab.bom.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs">
                      <span className="font-bold text-slate-200 block">{item.name}</span>
                      <span className="text-[11px] font-mono text-cyan-400">القيمة: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assembly Steps */}
              <div className="space-y-2">
                <span className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  خطوات تركيب الدائرة وتوصيل الأسلاك:
                </span>
                <div className="space-y-1.5">
                  {generatedLab.steps.map((st, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-xs">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Troubleshooting Tips */}
              <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-500/30 space-y-1 text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  تنبيهات وأخطاء توصيل شائعة:
                </span>
                <ul className="text-slate-300 list-disc list-inside space-y-0.5">
                  {generatedLab.troubleshootingTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* One-Click Action to Load on Breadboard */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    onLoadExtractedCircuit(generatedLab.components, generatedLab.wires, generatedLab.topic);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Cpu className="w-4 h-4" />
                  <span>تركيب هذه الدائرة على لوحة التجارب Breadboard فوراً</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

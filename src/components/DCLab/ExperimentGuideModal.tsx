import React, { useState } from 'react';
import { FioreExperiment } from '../../types/dcLab';
import {
  X,
  BookOpen,
  Volume2,
  VolumeX,
  Target,
  ListOrdered,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { AudioSpeechEngine } from '../../utils/audioSpeechEngine';

interface Props {
  experiment: FioreExperiment;
  onClose: () => void;
  onOpenReport: () => void;
}

export const ExperimentGuideModal: React.FC<Props> = ({ experiment, onClose, onOpenReport }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioEngine = AudioSpeechEngine.getInstance();

  const handleToggleVoice = async () => {
    if (isPlayingAudio) {
      audioEngine.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = `مرحباً بكم في تجربة ${experiment.titleAr}. الهدف من التجربة: ${experiment.objectivesAr.join('. ')}. النظرية العلمية: ${experiment.theoryAr}. خطوات العمل: ${experiment.procedureStepsAr.slice(0, 3).join('. ')}.`;
      await audioEngine.speak(textToSpeak, { persona: 'male', engine: 'native_hd' });
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header with Professor avatar & Audio button */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/file_00000000d6648210a5de34ab1bae4073_9f4c464e.png"
              alt="Teacher"
              className="w-12 h-12 rounded-2xl object-cover border-2 border-cyan-400 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[11px] font-bold">
                  تجربة #{experiment.number}
                </span>
                <span className="text-[11px] text-slate-400">James M. Fiore Lab Manual</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">{experiment.titleAr}</h3>
              <p className="text-xs text-slate-400">{experiment.titleEn}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleVoice}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isPlayingAudio
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'إيقاف الشرح' : 'استمع لشرح الأستاذ'}</span>
            </button>

            <button
              onClick={() => {
                audioEngine.stop();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed">
          {/* Objectives */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>الأهداف التعليمية للتجربة (Educational Objectives):</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              {experiment.objectivesAr.map((obj, idx) => (
                <li key={idx} className="leading-relaxed">{obj}</li>
              ))}
            </ul>
          </div>

          {/* Theory */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>النظرية العلمية والفيزيائية (Scientific Theory):</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
              {experiment.theoryAr}
            </p>
          </div>

          {/* Formulas */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
              <span>📐 القوانين والمعادلات المستخدمة:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {experiment.formulas.map((f, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-200 block">{f.name}</span>
                  <div className="font-mono text-cyan-400 text-xs py-1 px-2 bg-slate-900 rounded border border-slate-800">
                    {f.formula}
                  </div>
                  <span className="text-[10px] text-slate-400 block">{f.descriptionAr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Procedure */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <ListOrdered className="w-4 h-4" />
              <span>خطوات إجراء التجربة بالمختبر (Laboratory Procedure):</span>
            </h4>
            <div className="space-y-2 text-xs">
              {experiment.procedureStepsAr.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Application & Common Mistakes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
                <Lightbulb className="w-4 h-4" />
                <span>التطبيق العملي الميداني:</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{experiment.practicalApplicationAr}</p>
            </div>

            <div className="bg-rose-950/30 p-4 rounded-2xl border border-rose-500/30 space-y-1.5">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                <span>أخطاء شائعة يجب تجنبها:</span>
              </span>
              <ul className="text-xs text-rose-200 space-y-1 list-disc list-inside">
                {experiment.commonMistakesAr.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onOpenReport}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
          >
            <FileText className="w-4 h-4" />
            <span>عرض وإعداد تقرير التجربة</span>
          </button>

          <button
            onClick={() => {
              audioEngine.stop();
              onClose();
            }}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md"
          >
            بدء التجربة الآن
          </button>
        </div>
      </div>
    </div>
  );
};

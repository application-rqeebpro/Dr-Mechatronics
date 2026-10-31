import React from 'react';
import { SAMPLE_CIRCUIT_PROJECTS } from '../../data/circuitWizardSamples';
import { SampleCircuitProject } from '../../types/circuitWizard';
import { BookOpen, Compass, Folder, HelpCircle, Lightbulb, Play, Sparkles } from 'lucide-react';

interface Props {
  onLoadProject: (project: SampleCircuitProject) => void;
}

export const AssistantPanel: React.FC<Props> = ({ onLoadProject }) => {
  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border-s border-slate-800 text-slate-200 select-none text-xs">
      {/* Header */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-100">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Assistant - دليل المساعد الذكي</span>
        </div>
        <span className="text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded">
          Student Edition
        </span>
      </div>

      {/* Main Assistant Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Getting Started Box matching Photo 3! */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Compass className="w-4 h-4" />
            <h3 className="text-sm">Getting Started (الترحاب والبدء)</h3>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            مرحباً بك في برنامج **Circuit Wizard Student Edition**. صُمم هـذا المختبر لتبسيط تصميم
            الدوائر، المحاكاة الفورية، وتحويل الدوائر الإلكترونية إلى لوحات مطبوعة PCB وبرمجة المتحكمات.
          </p>
        </div>

        {/* Guided Tour Links */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            جولة تعليمية ومبادئ أساسية (Guided Tour)
          </span>

          <div className="space-y-1.5">
            <div className="p-2.5 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-2 cursor-pointer group">
              <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <div className="font-bold text-slate-200 group-hover:text-sky-300">Guided Tour</div>
                <div className="text-[10px] text-slate-400">تعلم أساسيات تصميم المحاكاة والتوصيل</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Circuits Gallery matching Photo 3! */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-amber-400" />
            <span>مشاريع وتجارب جاهزة (Sample Circuits)</span>
          </span>

          <div className="space-y-2">
            {SAMPLE_CIRCUIT_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onLoadProject(proj)}
                className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all cursor-pointer group space-y-1.5 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 group-hover:text-cyan-300 text-xs">
                    {proj.titleAr}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    تحميل
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                  {proj.descriptionAr}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Did You Know... section matching Photo 3! */}
        <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
            <Lightbulb className="w-4 h-4" />
            <span>Did you know... هل تعلم؟</span>
          </div>
          <p className="text-[10px] text-amber-200/90 leading-relaxed">
            برنامج Circuit Wizard يدعم برمجة متحكمات **GENIE PIC** عبر مخطط التدفق (Flowchart)، مع
            إمكانية محاكاة نبضات التايمر وترسيم مسارات الـ PCB تلقائياً!
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ComponentCategory, CwComponent } from '../../types/circuitWizard';
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronLeft,
  Zap,
  Cpu,
  Layers,
  Radio,
  Sliders,
  Tv,
  Activity,
  Plus
} from 'lucide-react';

interface Props {
  onAddComponent: (type: string, category: ComponentCategory) => void;
}

interface TreeCategory {
  id: string;
  name: string;
  category: ComponentCategory;
  icon: React.FC<any>;
  items: { id: string; name: string; type: string; package: string }[];
  subCategories?: {
    id: string;
    name: string;
    items: { id: string; name: string; type: string; package: string }[];
  }[];
}

export const ComponentGalleryTree: React.FC<Props> = ({ onAddComponent }) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    power_supplies: true,
    input_components: true,
    passive_components: true,
    discrete_semiconductors: true,
    logic_gates: true,
    integrated_circuits: true,
    output_components: true,
  });

  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
    type: string;
    category: ComponentCategory;
    package: string;
  } | null>({
    id: 'dc_supply',
    name: 'Power Supplies (DC Supply)',
    type: 'battery',
    category: 'power_supplies',
    package: 'Terminal-2P',
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const categories: TreeCategory[] = [
    {
      id: 'power_supplies',
      name: 'Power Supplies (مصادر التغذية)',
      category: 'power_supplies',
      icon: Zap,
      items: [
        { id: 'dc_supply', name: 'DC Supply (مصدر جهد مستمر)', type: 'battery', package: 'Terminal-2P' },
        { id: 'ac_supply', name: 'AC Supply (مصدر جهد متردد)', type: 'ac_supply', package: 'Terminal-2P' },
        { id: 'vcc_rail', name: 'Rail +V (خط التغذية الموجب)', type: 'battery', package: 'Terminal-1P' },
        { id: 'ground', name: 'Ground (نقطة التأريض 0V)', type: 'ground', package: 'Terminal-1P' },
        { id: 'vol_reg', name: 'Voltage Regulator (منظم جهد 7805)', type: 'vol_reg', package: 'TO-220' },
      ],
      subCategories: [
        {
          id: 'connectors',
          name: 'Connectors (الموصلات والوصلات)',
          items: [
            { id: 'sil_conn', name: 'Single-In-Line (SIL)', type: 'connector', package: 'SIL-4' },
            { id: 'dil_conn', name: 'Dual-In-Line (DIL)', type: 'connector', package: 'DIL-8' },
            { id: 'term_block', name: 'Terminal Blocks', type: 'connector', package: 'Terminal-2P' },
            { id: 'socket', name: 'Sockets', type: 'connector', package: 'DIP-8' },
          ],
        },
      ],
    },
    {
      id: 'input_components',
      name: 'Input Components (عناصر الإدخال والتقاط البيانات)',
      category: 'input_components',
      icon: Sliders,
      items: [
        { id: 'spst_sw', name: 'Switches (مفتاح SPST)', type: 'switch', package: 'Switch-2P' },
        { id: 'pushbutton', name: 'Pushbutton (زر ضاغط)', type: 'pushbutton', package: 'Push-4P' },
        { id: 'potentiometer', name: 'Potentiometers (مقاومة متغيرة)', type: 'potentiometer', package: 'POT-3P' },
        { id: 'ldr_sensor', name: 'Sensors (حساس ضوئي LDR)', type: 'ldr', package: 'LDR-5mm' },
      ],
    },
    {
      id: 'passive_components',
      name: 'Passive Components (العناصر الخاملة)',
      category: 'passive_components',
      icon: Layers,
      items: [
        { id: 'resistor', name: 'Resistors (المقاومات الخضية)', type: 'resistor', package: 'Axial-0.4' },
        { id: 'capacitor', name: 'Capacitors (المكثفات الكهربائية)', type: 'capacitor', package: 'Radial-0.2' },
        { id: 'inductor', name: 'Inductors (الملفات والمحاثات)', type: 'inductor', package: 'Axial-0.4' },
      ],
    },
    {
      id: 'discrete_semiconductors',
      name: 'Discrete Semiconductors (أشباه الموصلات المنفصلة)',
      category: 'discrete_semiconductors',
      icon: Cpu,
      items: [
        { id: 'diode_1n4007', name: 'Diodes (دايود سيليكون 1N4007)', type: 'diode', package: 'DO-41' },
        { id: 'zener_diode', name: 'Zener Diode (دايود زنر)', type: 'diode', package: 'DO-35' },
        { id: 'transistor_npn', name: 'Transistors NPN (2N3904)', type: 'npn_bjt', package: 'TO-92' },
        { id: 'transistor_pnp', name: 'Transistors PNP (2N3906)', type: 'pnp_bjt', package: 'TO-92' },
        { id: 'mosfet_n', name: 'N-MOSFET (ترانزستور موسفت)', type: 'n_mosfet', package: 'TO-220' },
      ],
    },
    {
      id: 'logic_gates',
      name: 'Logic Gates (البوابات المنطقية الرقمية)',
      category: 'logic_gates',
      icon: Radio,
      items: [
        { id: 'and_gate', name: 'AND Gate (بوابة العطف)', type: 'and_gate', package: 'DIP-14' },
        { id: 'or_gate', name: 'OR Gate (بوابة أو)', type: 'or_gate', package: 'DIP-14' },
        { id: 'nand_gate', name: 'NAND Gate (بوابة نفي العطف)', type: 'nand_gate', package: 'DIP-14' },
        { id: 'nor_gate', name: 'NOR Gate (بوابة نفي أو)', type: 'nor_gate', package: 'DIP-14' },
        { id: 'xor_gate', name: 'XOR Gate (بوابة أو الحصرية)', type: 'xor_gate', package: 'DIP-14' },
      ],
    },
    {
      id: 'integrated_circuits',
      name: 'Integrated Circuits (الدوائر المتكاملة ICs)',
      category: 'integrated_circuits',
      icon: Cpu,
      items: [
        { id: 'ic_555', name: 'NE555 Timer (مؤقت متكامل)', type: 'ic_555', package: 'DIP-8' },
        { id: 'opamp_741', name: 'Op-Amp 741 (مكبر عمليات)', type: 'opamp', package: 'DIP-8' },
        { id: 'micro_genie', name: 'Microcontrollers (GENIE PIC)', type: 'genie_pic', package: 'DIP-18' },
        { id: 'series_7400', name: '7400 Series Logic ICs', type: 'and_gate', package: 'DIP-14' },
        { id: 'series_4000', name: '4000B Series CMOS ICs', type: 'nand_gate', package: 'DIP-14' },
      ],
    },
    {
      id: 'output_components',
      name: 'Output Components (عناصر الإخراج والتنبيه)',
      category: 'output_components',
      icon: Tv,
      items: [
        { id: 'led_out', name: 'Light Emitting Diodes (LED)', type: 'led', package: 'LED-5mm' },
        { id: 'lamp_out', name: 'Illumination (مصابيح إضاءة)', type: 'bulb', package: 'Terminal-2P' },
        { id: 'buzzer_out', name: 'Audio (جرس صوتي Buzzer)', type: 'buzzer', package: 'Radial-0.3' },
        { id: 'relay_out', name: 'Electromagnetic (مرحل Relay)', type: 'relay', package: 'Relay-5P' },
        { id: 'dc_motor_out', name: 'DC Motor (محرك تيار مستمر)', type: 'dc_motor', package: 'Terminal-2P' },
      ],
    },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border-s border-slate-800 text-slate-200 select-none text-xs">
      {/* Gallery Header */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-100">
          <Folder className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
          <span>Gallery - مكتبة القطع</span>
        </div>
        <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/80 px-2 py-0.5 rounded">
          Circuit Wizard v3.5
        </span>
      </div>

      {/* Tree Folders Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 font-sans">
        {categories.map((cat) => {
          const isExpanded = !!expandedFolders[cat.id];
          const Icon = cat.icon;

          return (
            <div key={cat.id} className="space-y-0.5">
              {/* Category Folder Header */}
              <button
                onClick={() => toggleFolder(cat.id)}
                className="w-full flex items-center justify-between p-1.5 rounded hover:bg-slate-800 text-slate-200 transition-colors text-start"
              >
                <div className="flex items-center gap-1.5 truncate">
                  {isExpanded ? (
                    <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span className="font-semibold text-slate-100 truncate">{cat.name}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </button>

              {/* Folder Items */}
              {isExpanded && (
                <div className="ms-4 space-y-0.5 border-s border-slate-800 ps-2">
                  {cat.items.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() =>
                          setSelectedItem({
                            id: item.id,
                            name: item.name,
                            type: item.type,
                            category: cat.category,
                            package: item.package,
                          })
                        }
                        className={`group flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-cyan-600/30 border border-cyan-500/50 text-cyan-200 font-bold'
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddComponent(item.type, cat.category);
                          }}
                          className="px-1.5 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5"
                          title="إضافة للسبورة"
                        >
                          <Plus className="w-3 h-3" />
                          <span>إضافة</span>
                        </button>
                      </div>
                    );
                  })}

                  {/* Subcategories if any */}
                  {cat.subCategories?.map((sub) => (
                    <div key={sub.id} className="pt-1 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 px-1 py-0.5">
                        <Folder className="w-3.5 h-3.5 text-amber-600" />
                        <span>{sub.name}</span>
                      </div>
                      <div className="ms-3 space-y-0.5 border-s border-slate-800/60 ps-2">
                        {sub.items.map((item) => (
                          <div
                            key={item.id}
                            onClick={() =>
                              setSelectedItem({
                                id: item.id,
                                name: item.name,
                                type: item.type,
                                category: cat.category,
                                package: item.package,
                              })
                            }
                            className="group flex items-center justify-between p-1 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
                          >
                            <span className="truncate">{item.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddComponent(item.type, cat.category);
                              }}
                              className="px-1.5 py-0.5 rounded bg-cyan-600 text-white text-[10px] opacity-0 group-hover:opacity-100"
                            >
                              + إضافة
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Component Inspector Box matching Circuit Wizard Photo! */}
      {selectedItem && (
        <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-200">{selectedItem.name}</span>
            <span className="font-mono text-cyan-400">{selectedItem.package}</span>
          </div>

          {/* Graphical Symbol Box */}
          <div className="h-20 bg-slate-900 border border-slate-800 rounded flex items-center justify-center p-2 relative">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]">
                <span className="text-emerald-400 font-bold">IN</span>
                <span className="text-slate-500">|</span>
                <span className="text-amber-400 font-bold">OUT</span>
                <span className="text-slate-500">|</span>
                <span className="text-sky-400 font-bold">REF</span>
              </div>
              <div className="text-[10px] text-slate-400">{selectedItem.package} Component Model</div>
            </div>
          </div>

          <button
            onClick={() => onAddComponent(selectedItem.type, selectedItem.category)}
            className="w-full py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة القطعة لمساحة العمل (Place Component)</span>
          </button>
        </div>
      )}
    </div>
  );
};

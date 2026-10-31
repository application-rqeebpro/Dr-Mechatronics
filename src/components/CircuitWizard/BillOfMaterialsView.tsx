import React, { useState } from 'react';
import { CwComponent } from '../../types/circuitWizard';
import { FileText, Download, Printer, Search, DollarSign, Package } from 'lucide-react';

interface Props {
  components: CwComponent[];
}

export const BillOfMaterialsView: React.FC<Props> = ({ components }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Group identical components by type/value/package
  const groupedPartsMap = new Map<
    string,
    {
      designations: string[];
      name: string;
      value: number;
      unit: string;
      package: string;
      costEst: number;
      descAr: string;
    }
  >();

  components.forEach((c) => {
    const key = `${c.type}_${c.value}_${c.unit}_${c.package}`;
    if (!groupedPartsMap.has(key)) {
      groupedPartsMap.set(key, {
        designations: [c.name],
        name: c.name,
        value: c.value,
        unit: c.unit,
        package: c.package,
        costEst: c.costEst || 0.1,
        descAr: c.descriptionAr || 'قطعة إلكترونية قياسية',
      });
    } else {
      groupedPartsMap.get(key)!.designations.push(c.name);
    }
  });

  const bomRows = Array.from(groupedPartsMap.values()).filter((item) =>
    `${item.name} ${item.descAr} ${item.package}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProjectCost = bomRows.reduce((acc, row) => acc + row.costEst * row.designations.length, 0);

  const handleExportCSV = () => {
    let csv = 'Part Designations,Quantity,Description,Package,Unit Price ($),Total Price ($)\n';
    bomRows.forEach((row) => {
      csv += `"${row.designations.join(', ')}",${row.designations.length},"${row.descAr}",${row.package},${row.costEst},${(row.costEst * row.designations.length).toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Circuit_Wizard_Bill_Of_Materials.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-slate-100 select-none">
      {/* Header */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-100">Bill of Materials (جدول المكونات والتكلفة)</span>
          <span className="text-slate-400 font-mono">
            إجمالي الأصناف: {bomRows.length} | إجمالي القطع: {components.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute start-2.5 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="تصفية الأصناف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded ps-8 pe-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto p-4">
        <table className="w-full text-start text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
              <th className="p-2.5 text-start">الرموز (Designations)</th>
              <th className="p-2.5 text-start">الكمية (Qty)</th>
              <th className="p-2.5 text-start">الوصف والخصائص (Description)</th>
              <th className="p-2.5 text-start">الغلاف (Package)</th>
              <th className="p-2.5 text-start">سعر القطعة ($)</th>
              <th className="p-2.5 text-start">الإجمالي ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {bomRows.map((row, idx) => {
              const qty = row.designations.length;
              const subtotal = row.costEst * qty;

              return (
                <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-2.5 font-bold text-cyan-300 font-mono">
                    {row.designations.join(', ')}
                  </td>
                  <td className="p-2.5 font-mono font-bold text-emerald-400">{qty}</td>
                  <td className="p-2.5 text-slate-200">
                    {row.descAr} ({row.value} {row.unit})
                  </td>
                  <td className="p-2.5 font-mono text-slate-400">{row.package}</td>
                  <td className="p-2.5 font-mono text-slate-300">${row.costEst.toFixed(2)}</td>
                  <td className="p-2.5 font-mono font-bold text-amber-400">${subtotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Total Summary */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="text-slate-400">Circuit Wizard Automatic BOM Calculation Engine</div>
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-bold">التكلفة التقديرية الكلية للمشروع:</span>
          <span className="text-base font-black text-amber-400 bg-amber-950/80 px-3 py-1 rounded border border-amber-800">
            ${totalProjectCost.toFixed(2)} USD
          </span>
        </div>
      </div>
    </div>
  );
};

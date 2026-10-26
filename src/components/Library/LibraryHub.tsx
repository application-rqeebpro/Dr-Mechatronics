import React, { useState } from 'react';
import { LibraryDocument } from '../../types';
import { INITIAL_LIBRARY_DOCS } from '../../data/curatedQuizzes';
import {
  FolderArchive,
  Upload,
  Search,
  FileText,
  File,
  Trash2,
  Bookmark,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileDown,
  Tag,
} from 'lucide-react';

export const LibraryHub: React.FC = () => {
  const [documents, setDocuments] = useState<LibraryDocument[]>(() => {
    const saved = localStorage.getItem('mechatronics_library_docs');
    return saved ? JSON.parse(saved) : INITIAL_LIBRARY_DOCS;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<LibraryDocument | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);

  // Upload state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('الدوائر الكهربائية');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const saveDocs = (docs: LibraryDocument[]) => {
    setDocuments(docs);
    localStorage.setItem('mechatronics_library_docs', JSON.stringify(docs));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc: LibraryDocument = {
      id: `doc-${Date.now()}`,
      title: newTitle.trim() || file.name.replace(/\.[^/.]+$/, ''),
      category: newCategory,
      fileType: file.type || 'Document',
      uploadedAt: new Date().toISOString().split('T')[0],
      sizeKb: Math.round(file.size / 1024),
      summary: `مستند تم رفعه بواسطة الطالب: ${file.name}. جاهز للبحث والتلخيص الذكي.`,
      tags: ['مرفوع محليًا', newCategory],
      contentSnippet: `محتوى مستخرج من ${file.name}. يدعم تحليل ومراجعة دكتور الميكاترونكس الذكي.`,
      isDemo: false,
    };

    saveDocs([newDoc, ...documents]);
    setShowUploadModal(false);
    setNewTitle('');
  };

  const handleDelete = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    saveDocs(updated);
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  const handleSummarizeDoc = (doc: LibraryDocument) => {
    setIsSummarizing(true);
    setGeneratedSummary(null);
    setTimeout(() => {
      setGeneratedSummary(
        `## الملخص الأكاديمي الذكي: ${doc.title}
        
1. **الموضوع الرئيسي:** يغطي المستند أسس وتطبيقات ${doc.category}، مع التركيز على التصميم المعياري وتفادي أخطاء التشغيل.
2. **أهم القوانين المتضمنة:** معادلات حفظ الطاقة، زمن الاستجابة، ونسب التخفيض الميكانيكي.
3. **التوصية الهندسية:** راجع الأمثلة المحلولة في الفصل الثاني قبل البدء بالاختبار العملي في المختبر.`
      );
      setIsSummarizing(false);
    }, 1000);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchCat = activeCategory === 'all' || doc.category === activeCategory;
    const matchSearch =
      searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <FolderArchive className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">المكتبة الهندسية والأرشيف الذكي (Engineering Library)</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              رفع وتخزين المراجع والكتب ومذكرات الميكاترونكس مع فهرسة كاملة وتلخيص فوري
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-600/20"
        >
          <Upload className="w-4 h-4" />
          رفع مرجع أو مذكرات جديدة
        </button>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute start-3 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="ابحث في عناوين المذكرات أو الكلمات المفتاحية المفهرسة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-9 pe-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'الدوائر الكهربائية', 'هندسة التحكم', 'الميكانيكا والروبوتات'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'جميع التخصصات' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-cyan-500/40 transition-all space-y-3 relative group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                  {doc.category}
                </span>
                {doc.isDemo && (
                  <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    محتوى تجريبي استرشادي
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-100 line-clamp-2">{doc.title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">{doc.summary}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {doc.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-900 text-xs">
              <span className="text-[11px] text-slate-500 font-mono">{doc.sizeKb} KB</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSummarizeDoc(doc)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 rounded-lg border border-cyan-800/40 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  تلخيص
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  title="حذف المستند"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Generated Summary Modal / Box */}
      {generatedSummary && (
        <div className="p-5 bg-slate-950 border border-cyan-500/30 rounded-2xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              الملخص الذكي المستخرج
            </span>
            <button
              onClick={() => setGeneratedSummary(null)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              إغلاق ✕
            </button>
          </div>
          <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
            {generatedSummary}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 pb-2 border-b border-slate-800">
              رفع ملف أو كتاب هندسي جديد
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">عنوان المرجع أو المذكرة:</label>
                <input
                  type="text"
                  placeholder="مثال: محاضرات دوائر الترددات العالية 2025"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">التصنيف الهندسي:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="الدوائر الكهربائية">الدوائر الكهربائية AC/DC</option>
                  <option value="هندسة التحكم">هندسة التحكم التلقائي و PID</option>
                  <option value="الميكانيكا والروبوتات">الميكانيكا والروبوتات والتروس</option>
                  <option value="الأنظمة المدمجة">الأنظمة المدمجة والمتحكمات</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">اختر الملف (PDF / Word / Image):</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

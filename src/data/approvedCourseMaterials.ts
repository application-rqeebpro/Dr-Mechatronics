export interface CourseMaterialFile {
  id: string;
  courseCode: string;
  courseNameAr: string;
  courseNameEn: string;
  doctorName: string;
  title: string;
  fileName: string;
  fileFormat: string;
  sizeKb: number;
  uploadedAt: string;
  accessTier: 'free' | 'basic' | 'premium_pro';
  isOwnerApproved: boolean;
  totalPages: number;
  description: string;
  chapters: {
    chapterNumber: number;
    titleAr: string;
    titleEn: string;
    pageRange: string;
    accessTier: 'free' | 'basic' | 'premium_pro';
    lessons: {
      lessonId: string;
      titleAr: string;
      titleEn: string;
      page: number;
      governingEquations: string[];
      summary: string;
      exampleProblem: string;
      accessTier: 'free' | 'basic' | 'premium_pro';
    }[];
  }[];
}

export const APPROVED_COURSE_MATERIALS: CourseMaterialFile[] = [
  {
    id: 'mat-serway-physics',
    courseCode: 'PHYS101',
    courseNameAr: 'الفيزياء الهندسية',
    courseNameEn: 'Physics for Scientists and Engineers',
    doctorName: 'د. محمد الحبابي',
    title: 'كتاب فيزياء سيرواي للعلماء والمهندسين - الطبعة التاسعة المعتمدة',
    fileName: 'Serway_Jewett_Physics_9th_Edition_ModernPhysics.pdf',
    fileFormat: 'PDF',
    sizeKb: 48500,
    uploadedAt: '2025-01-15',
    accessTier: 'free',
    isOwnerApproved: true,
    totalPages: 1482,
    description: 'المرجع الرسمي المعتمد في الفيزياء الهندسية لطلاب كليات الهندسة، يغطي الميكانيكا، الكهرومغناطيسية، ودوائر التيار المتردد.',
    chapters: [
      {
        chapterNumber: 2,
        titleAr: 'الحركة في بعد واحد والتسارع المنتظم',
        titleEn: 'Motion in One Dimension',
        pageRange: '23-56',
        accessTier: 'free',
        lessons: [
          {
            lessonId: 'serway-ch2-l1',
            titleAr: 'معادلات الحركة بتسارع منتظم والسقوط الحر',
            titleEn: 'One-Dimensional Motion with Constant Acceleration',
            page: 35,
            governingEquations: ['v = v_0 + a \\cdot t', '\\Delta x = v_0 \\cdot t + \\frac{1}{2} a \\cdot t^2', 'v^2 = v_0^2 + 2a \\cdot \\Delta x'],
            summary: 'العلاقات الحركية المستقيمة عندما يكون التسارع a ثابتًا مع الزمن.',
            exampleProblem: 'تسقط كرة من سكون من قمة مبنى ارتفاعه h = 45 m. احسب سرعتها قبل ملامسة الأرض وزمن السقوط (اعتبر g = 9.8 m/s²).',
            accessTier: 'free',
          },
        ],
      },
      {
        chapterNumber: 27,
        titleAr: 'التيار الكهربائي والمقاومة وقانون أوم',
        titleEn: 'Current and Resistance',
        pageRange: '752-780',
        accessTier: 'free',
        lessons: [
          {
            lessonId: 'serway-ch27-l1',
            titleAr: 'قانون أوم والمقاومة النوعية للمواد',
            titleEn: 'Resistance and Ohm\'s Law',
            page: 756,
            governingEquations: ['V = I \\cdot R', 'R = \\rho \\cdot \\frac{L}{A}', 'J = \\sigma \\cdot E'],
            summary: 'تناسب فرق الجهد خطيًا مع شدة التيار في المواد الأومية عند ثبوت درجة الحرارة.',
            exampleProblem: 'سلك نحاسي طوله L = 2 m ومساحة مقطعه A = 1 mm²، إذا كان الجهد المطبق V = 12 V ومقاومته R = 4 Ω، احسب التيار المار وكثافة التيار.',
            accessTier: 'free',
          },
        ],
      },
      {
        chapterNumber: 33,
        titleAr: 'دوائر التيار المتردد والرنين',
        titleEn: 'Alternating-Current Circuits',
        pageRange: '970-1005',
        accessTier: 'basic',
        lessons: [
          {
            lessonId: 'serway-ch33-l1',
            titleAr: 'دوائر التيار المتردد RL و RC و RLC المتوالية والرنين',
            titleEn: 'The RLC Series Circuit and Resonance',
            page: 985,
            governingEquations: ['Z = \\sqrt{R^2 + (X_L - X_C)^2}', 'X_L = \\omega L = 2\\pi f L', 'X_C = \\frac{1}{\\omega C}', 'f_0 = \\frac{1}{2\\pi\\sqrt{LC}}'],
            summary: 'استجابة الدائرة للتردد الزاوي ω، وتلاشي الممانعات التفاعلية عند تردد الرنين f0.',
            exampleProblem: 'دائرة RLC متوالية فيها R = 100 Ω، L = 150 mH، C = 2.2 μF متصلة بمصدر AC تردده f = 50 Hz وجهده Vrms = 220 V. احسب المعاوقة Z وتردد الرنين f0.',
            accessTier: 'basic',
          },
        ],
      },
    ],
  },
  {
    id: 'mat-circuits-theory',
    courseCode: 'EE211',
    courseNameAr: 'Electrical Circuits 1 T',
    courseNameEn: 'Electrical Circuits 1 Theory',
    doctorName: 'د. محمد الحبابي',
    title: 'مذكرة المقرر المعتمدة: نظريات تحليل الدوائر الكهربائية (Sadiku & Boylestad Syllabus)',
    fileName: 'Electrical_Circuits_1_Theory_Notes_AlHababi.pdf',
    fileFormat: 'PDF',
    sizeKb: 18200,
    uploadedAt: '2025-02-01',
    accessTier: 'basic',
    isOwnerApproved: true,
    totalPages: 248,
    description: 'المذكرة الرسمية المعتمدة لمادة Electrical Circuits 1 T لـ د. محمد الحبابي، تشمل كيرشوف، العقد، والمش ونظريات ثيفينين ونورتون.',
    chapters: [
      {
        chapterNumber: 1,
        titleAr: 'قوانين كيرشوف وتطبيقات الدوائر المقاومية',
        titleEn: 'Kirchhoff\'s Laws & Resistive Networks',
        pageRange: '12-45',
        accessTier: 'free',
        lessons: [
          {
            lessonId: 'circ1t-ch1-l1',
            titleAr: 'قانون أوم ومجزئات الجهد والتيار في الدوائر المستمرة',
            titleEn: 'Ohm\'s Law, Voltage & Current Dividers',
            page: 24,
            governingEquations: ['V_1 = V_{in} \\cdot \\frac{R_1}{R_1 + R_2}', 'I_1 = I_{total} \\cdot \\frac{R_2}{R_1 + R_2}', 'P = V \\cdot I = I^2 \\cdot R'],
            summary: 'حساب توزيع الجهود والتيارات في المقاومات المتوالية والمتوازية بدقة.',
            exampleProblem: 'دائرة تحتوي على مصدر جهد 12V ومقاومتين على التوالي R1=4Ω و R2=8Ω. احسب التيار الكلي وهبوط الجهد عبر كل مقاومة.',
            accessTier: 'free',
          },
        ],
      },
      {
        chapterNumber: 3,
        titleAr: 'تحليل العقد والمش ونظرية ثيفينين',
        titleEn: 'Nodal, Mesh & Thevenin Theorem',
        pageRange: '68-112',
        accessTier: 'basic',
        lessons: [
          {
            lessonId: 'circ1t-ch3-l1',
            titleAr: 'نظرية ثيفينين ونقل أقصى قدرة للحمل (Max Power Transfer)',
            titleEn: 'Thevenin\'s Theorem & Maximum Power Transfer',
            page: 89,
            governingEquations: ['V_{th} = V_{oc}', 'R_{th} = \\frac{V_{oc}}{I_{sc}}', 'R_L = R_{th} \\implies P_{max} = \\frac{V_{th}^2}{4 R_{th}}'],
            summary: 'تبسيط الشبكات الخطية المعقدة إلى مصدر واحد ومقاومة واحدة مكافئة.',
            exampleProblem: 'أوجد دائرة ثيفينين المكافئة عند أطراف الحمل RL لشبكة ذات مصدرين ومقاومات تفرع، واحسب قيمة الحمل RL لنقل أقصى قدرة.',
            accessTier: 'basic',
          },
        ],
      },
    ],
  },
  {
    id: 'mat-circuits-lab',
    courseCode: 'EE211L',
    courseNameAr: 'Electrical Circuits Lab',
    courseNameEn: 'Electrical Circuits Laboratory Manual',
    doctorName: 'د. محمد الحبابي',
    title: 'دليل التجارب المعملية الرسمي: مختبر الدوائر الكهربائية 2025',
    fileName: 'Electrical_Circuits_Lab_Manual_AlHababi_2025.pdf',
    fileFormat: 'PDF',
    sizeKb: 12400,
    uploadedAt: '2025-02-10',
    accessTier: 'premium_pro',
    isOwnerApproved: true,
    totalPages: 160,
    description: 'الدليل المعملي المعتمد للتجارب الحية لـ د. محمد الحبابي، يتطابق مع الفيديو المرجعي لشرح دوائر RL و RC و RLC AC مع راسم الإشارة.',
    chapters: [
      {
        chapterNumber: 5,
        titleAr: 'الدوائر الكهربائية ذات التيار المتردد RL و RC و RLC',
        titleEn: 'AC Circuits: RL, RC and RLC Analysis',
        pageRange: '42-68',
        accessTier: 'premium_pro',
        lessons: [
          {
            lessonId: 'lab-exp5-rlc',
            titleAr: 'دوائر التيار المتردد RL و RC و RLC (التجربة المرجعية)',
            titleEn: 'RL, RC & RLC AC Circuits Experiment',
            page: 47,
            governingEquations: ['v(t) = V_m \\sin(\\omega t)', 'I_{total} = \\frac{E}{Z}', 'Z = \\sqrt{R^2 + X_L^2}', 'V_R = I \\cdot R', 'V_L = I \\cdot X_L'],
            summary: 'التحقق المعملي من طور الجهد والتيار في المقاومة والملف وحساب هبوط الجهد على كل عنصر.',
            exampleProblem: 'وصلت مقاومة R = 10 Ω وملف L = 50 mH على التوالي بمصدر AC جهده E = 20 V بتردد f = 60 Hz. احسب الممانعة XL والمعاوقة الكلية Z وجهد المقاومة VR وجهد الملف VL.',
            accessTier: 'premium_pro',
          },
        ],
      },
    ],
  },
];

import { Professor } from '../types';

export const PROFESSORS: Professor[] = [
  {
    id: 'prof-alhababi',
    name: 'د. محمد الحبابي',
    nameEn: 'Dr. Mohammed Al-Hababi',
    title: 'أستاذ الدوائر الكهربائية والمختبرات',
    titleEn: 'Professor of Electrical Circuits & Labs',
    specialty: 'Electrical Circuits',
    specialtyEn: 'Electrical Circuits',
    avatar: '/assets/aistudio/Meta_AI_865483842_1438288071613716_6052109500696896818_n_20261026_214130.webp_9aa9edb5.jpg',
    isCustomImage: true,
    accentColor: '#0284c7', // Sky blue
    bio: 'أستاذ متخصص في تدريس وتحليل الدوائر الكهربائية النظرية والتطبيقية، ومختبرات الدوائر مع الشرح المباشر على السبورة الذكية.',
    bioEn: 'Specialist in theoretical and practical electrical circuits analysis and electrical laboratory experimentation.',
    style: 'تحليلي دقيق، يربط القوانين النظرية بالتجارب المعملية وراسم الإشارة.',
    styleEn: 'Rigorous analytical style connecting theoretical laws with laboratory instrumentation.',
    courses: [
      'Electrical Circuits 1 T',
      'Electrical Circuits 1 P',
      'Electrical Circuits Lab',
    ],
    signatureTopics: [
      'Electrical Circuits 1 T',
      'Electrical Circuits 1 P',
      'Electrical Circuits Lab',
    ],
    sampleQuote: 'فهم سلوك الدائرة الكهربائية يبدأ من التحليل الرياضي السليم وينتهي بالتحقق العملي في المختبر.',
    sampleQuoteEn: 'Understanding circuit behavior starts with sound mathematical analysis and ends with hands-on lab validation.',
  },
  {
    id: 'prof-alshawafi',
    name: 'أ. الخلود الشوافي',
    nameEn: 'Lecturer Al-Kholoud Al-Shawafi',
    title: 'أستاذة الفيزياء والفيزياء الهندسية',
    titleEn: 'Lecturer of Physics & Engineering Physics',
    specialty: 'Physics & Engineering Physics',
    specialtyEn: 'Physics & Engineering Physics',
    avatar: '⚡',
    isCustomImage: false,
    accentColor: '#f59e0b', // Amber
    bio: 'متخصصة في تبسيط المفاهيم الفيزيائية وتطبيقات الفيزياء الهندسية لطلاب الهندسة والميكاترونكس.',
    bioEn: 'Specialized in physics fundamentals and applied engineering physics for engineering students.',
    style: 'فيزيائي حسي وواضح، يركز على التطبيقات الفيزيائية المباشرة والقوانين الأساسية.',
    styleEn: 'Clear intuitive physical approach focusing on fundamental laws and engineering applications.',
    courses: [
      'Physics',
      'Engineering Physics',
    ],
    signatureTopics: [
      'Physics',
      'Engineering Physics',
    ],
    sampleQuote: 'الفيزياء هي أساس كل ابتكار هندسي؛ من الحركة والموجات إلى الطاقة الكهرومغناطيسية.',
    sampleQuoteEn: 'Physics is the bedrock of engineering innovation; from motion and waves to electromagnetism.',
  },
  {
    id: 'prof-alkebsi',
    name: 'أ. أسيدة الكبسي',
    nameEn: 'Lecturer Osaidah Al-Kebsi',
    title: 'أستاذة مادة الفيزياء والفيزياء النظرية',
    titleEn: 'Lecturer of Physics & Theoretical Physics',
    specialty: 'Physics & Physics T',
    specialtyEn: 'Physics & Physics T',
    avatar: '🔬',
    isCustomImage: false,
    accentColor: '#38bdf8', // Light blue
    bio: 'أستاذة متميزة في تدريس أسس الفيزياء والمفاهيم النظرية ومسائل التحليل الفيزيائي المتدرج.',
    bioEn: 'Dedicated instructor for physics principles, problem solving, and theoretical foundations.',
    style: 'منظم وتدريجي في حل المسائل الفيزيائية وتوضيح وحدات القياس واستنتاج النتائج.',
    styleEn: 'Step-by-step problem solver emphasizing dimensional consistency and scientific derivation.',
    courses: [
      'Physics',
      'Physics T',
    ],
    signatureTopics: [
      'Physics',
      'Physics T',
    ],
    sampleQuote: 'الدقة في كتابة المعطيات وتحديد الوحدات هي نصف الطريق إلى الحل الفيزيائي الصحيح.',
    sampleQuoteEn: 'Precision in stating given parameters and units is half the path to the correct solution.',
  },
  {
    id: 'prof-albaidaji',
    name: 'د. رمضان البيدجي',
    nameEn: 'Dr. Ramadan Al-Baidaji',
    title: 'أستاذ الدوائر الكهربائية 1',
    titleEn: 'Professor of Electrical Circuits 1',
    specialty: 'Electrical Circuits 1',
    specialtyEn: 'Electrical Circuits 1',
    avatar: '🔌',
    isCustomImage: false,
    accentColor: '#06b6d4', // Cyan
    bio: 'خبير في نظريات الدوائر الكهربائية، تحليل العقد والمش، وقوانين كيرشوف، والاستجابة للتيار المستمر والمتردد.',
    bioEn: 'Expert in network theorems, nodal and mesh analysis, Kirchhoff laws, and circuit transients.',
    style: 'هندسي منهجي، يركز على طرق التحليل الشبكي السريعة وتقليل معادلات الدائرة.',
    styleEn: 'Methodical engineering approach emphasizing circuit simplification and network theorems.',
    courses: [
      'Electrical Circuits 1',
    ],
    signatureTopics: [
      'Electrical Circuits 1',
    ],
    sampleQuote: 'كل عقدة كهربائية وكل مسار مغلق يخضع لمبدأ التوازن وحفظ الشحنة والطاقة.',
    sampleQuoteEn: 'Every electrical node and closed loop obeys fundamental laws of energy and charge conservation.',
  },
  {
    id: 'prof-shujaa-aldeen',
    name: 'د. زياد شجاع الدين',
    nameEn: 'Dr. Ziyad Shujaa Al-Deen',
    title: 'أستاذ الميكانيكا الهندسية - إستاتيكا',
    titleEn: 'Professor of Engineering Mechanics Statics',
    specialty: 'Engineering Mechanics Statics',
    specialtyEn: 'Engineering Mechanics Statics',
    avatar: '⚙️',
    isCustomImage: false,
    accentColor: '#ec4899', // Pink
    bio: 'أستاذ الميكانيكا الإستاتيكية وتحليل القوى والعزوم وتوازن الجسيمات والأجسام الجاسئة والهياكل الجمالونية (Trusses).',
    bioEn: 'Specialist in statics, force systems, moment equilibrium, rigid body mechanics, and structural trusses.',
    style: 'ميكانيكي وتخطيطي، يعتمد على مخطط الجسم الحر (Free Body Diagram) والتحليل الاتجاهي الدقيق.',
    styleEn: 'Rigorous structural approach built on Free Body Diagrams and vector equilibrium equations.',
    courses: [
      'Engineering Mechanics Statics',
      'Engineering Mechanics Statics T',
    ],
    signatureTopics: [
      'Engineering Mechanics Statics',
      'Engineering Mechanics Statics T',
    ],
    sampleQuote: 'ارسم مخطط الجسم الحر (FBD) بدقة، وستجد أن معادلات الاتزان تحل نفسها تلقائيًا.',
    sampleQuoteEn: 'Draw your Free Body Diagram precisely, and equilibrium equations will solve themselves.',
  },
  {
    id: 'prof-salama',
    name: 'د. إياد سلامة',
    nameEn: 'Dr. Iyad Salama',
    title: 'أستاذ الرياضيات الهندسية 1',
    titleEn: 'Professor of Engineering Mathematics 1',
    specialty: 'Mathematics 1',
    specialtyEn: 'Mathematics 1',
    avatar: '📐',
    isCustomImage: false,
    accentColor: '#8b5cf6', // Violet
    bio: 'أستاذ متخصص في التفاضل والتكامل المتقدم، والمتسلسلات، والدوال الخاصة وتطبيقاتها في الأنظمة الهندسية.',
    bioEn: 'Professor specializing in calculus, limits, derivatives, integrals, series, and engineering math applications.',
    style: 'برهاني عميق، يوضح الأساس المنطقي لكل قاعدة رياضية وكيفية استخدامها في الهندسة.',
    styleEn: 'Deep rigorous reasoning explaining mathematical derivations and their engineering utility.',
    courses: [
      'Mathematics 1',
    ],
    signatureTopics: [
      'Mathematics 1',
    ],
    sampleQuote: 'الرياضيات هي العمود الفقري للهندسة، وبها نصيغ قوانين الطبيعة في معادلات محكمة.',
    sampleQuoteEn: 'Mathematics is the backbone of engineering, turning physical laws into solvable formulas.',
  },
  {
    id: 'prof-alwathaf',
    name: 'أ. سارة الوظاف',
    nameEn: 'Lecturer Sara Al-Wathaf',
    title: 'أستاذة الرياضيات 1 T',
    titleEn: 'Lecturer of Mathematics 1 T',
    specialty: 'Mathematics 1 T',
    specialtyEn: 'Mathematics 1 T',
    avatar: '📊',
    isCustomImage: false,
    accentColor: '#10b981', // Emerald
    bio: 'متخصصة في التدريب الرياضي التماريني وحل المسائل المكثفة في مقرر الرياضيات 1 T للطلاب.',
    bioEn: 'Specialist in tutorial math sessions, intensive problem solving, and exercise walkthroughs for Mathematics 1 T.',
    style: 'تفاعلي تطبيقي، يقدم استراتيجيات سريعة للتعامل مع تمارين الامتحانات والمشتقات والتكاملات.',
    styleEn: 'Practical interactive style with fast exam strategies and stepped calculus workouts.',
    courses: [
      'Mathematics 1 T',
    ],
    signatureTopics: [
      'Mathematics 1 T',
    ],
    sampleQuote: 'الممارسة اليومية لحل التمارين الرياضية هي السبيل الوحيد لبناء الذهن الهندسي السريع والواثق.',
    sampleQuoteEn: 'Daily exercise practice is the only way to build a swift and confident engineering mindset.',
  },
  {
    id: 'prof-alghorabi',
    name: 'د. خالد الغرابي',
    nameEn: 'Dr. Khaled Al-Ghorabi',
    title: 'أستاذ مهارات اللغة العربية',
    titleEn: 'Professor of Arabic Language Skills',
    specialty: 'Arabic Language Skills I',
    specialtyEn: 'Arabic Language Skills I',
    avatar: '📖',
    isCustomImage: false,
    accentColor: '#6366f1', // Indigo
    bio: 'أستاذ مهارات الاتصال اللغوي، التعبير الأكاديمي، الصياغة العلمية والتقارير الفنية باللغة العربية الفصيحة.',
    bioEn: 'Professor of Arabic communication skills, technical report writing, and academic Arabic prose.',
    style: 'فصيح وبليغ، يعزز قدرة المهندس على كتابة التقارير وعرض المشاريع بلغة رصينة وجذابة.',
    styleEn: 'Eloquent and practical, empowering engineers to craft impactful technical reports and presentations.',
    courses: [
      'Arabic Language Skills I',
    ],
    signatureTopics: [
      'Arabic Language Skills I',
    ],
    sampleQuote: 'المهندس الناجح لا يكتفي بإتقان الحسابات، بل يمتلك لسانًا وبيانًا ينقل بهما أفكاره للعالم بوضوح.',
    sampleQuoteEn: 'A successful engineer not only masters formulas but also articulates concepts with clarity and impact.',
  },
  {
    id: 'prof-amin',
    name: 'أ. دعاء أمين',
    nameEn: 'Lecturer Doaa Ameen',
    title: 'أستاذة مهارات اللغة الإنجليزية',
    titleEn: 'Lecturer of English Language Skills',
    specialty: 'English Language Skills 1',
    specialtyEn: 'English Language Skills 1',
    avatar: '🌐',
    isCustomImage: false,
    accentColor: '#14b8a6', // Teal
    bio: 'متخصصة في تدريس اللغة الإنجليزية الأكاديمية والمهنية والمصطلحات التقنية الخاصة بالتخصصات الهندسية.',
    bioEn: 'Specialist in academic and professional English communication, grammar, and technical engineering terminology.',
    style: 'تفاعلي عالمي، يركز على القراءة الأكاديمية، كتابة الأوراق العلمية، والمصطلحات الهندسية المعيارية.',
    styleEn: 'Interactive and modern, focusing on academic reading, writing, and standard technical vocabulary.',
    courses: [
      'English Language Skills 1',
    ],
    signatureTopics: [
      'English Language Skills 1',
    ],
    sampleQuote: 'English is the global passport of modern engineering research, data sheets, and technological collaboration.',
    sampleQuoteEn: 'English is the global passport of modern engineering research, data sheets, and technological collaboration.',
  },
  {
    id: 'prof-sharhan',
    name: 'د. فؤاد شرهان',
    nameEn: 'Dr. Fouad Sharhan',
    title: 'أستاذ الثقافة العامة',
    titleEn: 'Professor of General Culture',
    specialty: 'Culture 1',
    specialtyEn: 'Culture 1',
    avatar: '🏛️',
    isCustomImage: false,
    accentColor: '#f97316', // Orange
    bio: 'أستاذ مادة الثقافة 1، يعنى ببناء الوعي الفكري والمسؤولية الأخلاقية والمهنية للمهندس في المجتمع.',
    bioEn: 'Professor of Culture 1, fostering intellectual awareness, ethics, and civic responsibility for future engineers.',
    style: 'حواري تأملي، يربط التطور التكنولوجي بالقيم الإنسانية والمسؤولية المجتمعية والنهضة الحضارية.',
    styleEn: 'Thoughtful and dialogue-driven, connecting technology with ethics and societal advancement.',
    courses: [
      'Culture 1',
    ],
    signatureTopics: [
      'Culture 1',
    ],
    sampleQuote: 'الهندسة أداة بناء، والثقافة هي البوصلة التي توجه هذا البناء لخير الإنسان والمجتمع.',
    sampleQuoteEn: 'Engineering is the tool of construction, while culture is the moral compass guiding it for humanity.',
  },
];

export const getStoredProfessors = (): Professor[] => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('mechatronics_custom_professors');
    if (custom) {
      try {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  return PROFESSORS;
};

export const saveStoredProfessors = (list: Professor[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mechatronics_custom_professors', JSON.stringify(list));
  }
};

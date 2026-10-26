export interface SerwayChapter {
  chapterNumber: number;
  titleAr: string;
  titleEn: string;
  part: string;
  lessons: {
    id: string;
    lessonNumber?: string;
    titleAr: string;
    titleEn: string;
    suggestedPage?: number;
    keyConcepts: string[];
  }[];
}

export const SERWAY_CHAPTERS: SerwayChapter[] = [
  {
    chapterNumber: 1,
    part: 'Part 1: Mechanics',
    titleAr: 'الفيزياء والقياس',
    titleEn: 'Physics and Measurement',
    lessons: [
      {
        id: 'serway-1-1',
        lessonNumber: '1.1 - 1.4',
        titleAr: 'معايير الطول والكتلة والزمن والتحليل البعدي',
        titleEn: 'Standards of Length, Mass, Time & Dimensional Analysis',
        suggestedPage: 2,
        keyConcepts: ['SI Units', 'Dimensional Analysis', 'Significant Figures'],
      },
    ],
  },
  {
    chapterNumber: 2,
    part: 'Part 1: Mechanics',
    titleAr: 'الحركة في بعد واحد',
    titleEn: 'Motion in One Dimension',
    lessons: [
      {
        id: 'serway-2-1',
        lessonNumber: '2.1 - 2.3',
        titleAr: 'الموضع والسرعة المتجهة المتوسطة واللحظية والتسارع',
        titleEn: 'Position, Velocity, and Acceleration in 1D',
        suggestedPage: 21,
        keyConcepts: ['Displacement', 'Average vs Instantaneous Velocity', 'Acceleration'],
      },
      {
        id: 'serway-2-2',
        lessonNumber: '2.5 - 2.6',
        titleAr: 'معادلات الحركة بتسارع منتظم والسقوط الحر',
        titleEn: 'Kinematic Equations with Constant Acceleration & Free Fall',
        suggestedPage: 35,
        keyConcepts: ['v = v0 + at', 'x = v0·t + (1/2)at²', 'Free Fall under Gravity g'],
      },
    ],
  },
  {
    chapterNumber: 3,
    part: 'Part 1: Mechanics',
    titleAr: 'المتجهات',
    titleEn: 'Vectors',
    lessons: [
      {
        id: 'serway-3-1',
        lessonNumber: '3.1 - 3.4',
        titleAr: 'أنظمة الإحداثيات ومركبات المتجهات والضرب القياسي',
        titleEn: 'Coordinate Systems, Vector Components & Unit Vectors',
        suggestedPage: 59,
        keyConcepts: ['Vector Addition', 'Components (Ax, Ay)', 'Dot Product A · B'],
      },
    ],
  },
  {
    chapterNumber: 4,
    part: 'Part 1: Mechanics',
    titleAr: 'الحركة في بعدين',
    titleEn: 'Motion in Two Dimensions',
    lessons: [
      {
        id: 'serway-4-1',
        lessonNumber: '4.1 - 4.3',
        titleAr: 'حركة المقذوفات بزاوية والمدى وأقصى ارتفاع',
        titleEn: 'Projectile Motion, Horizontal Range, and Maximum Height',
        suggestedPage: 84,
        keyConcepts: ['Parabolic Trajectory', 'Horizontal Range R', 'Max Height H'],
      },
      {
        id: 'serway-4-2',
        lessonNumber: '4.4',
        titleAr: 'الحركة الدائرية المنتظمة والتسارع المركزي',
        titleEn: 'Uniform Circular Motion & Centripetal Acceleration',
        suggestedPage: 94,
        keyConcepts: ['ac = v² / r', 'Period T = 2πr / v', 'Tangential Acceleration'],
      },
    ],
  },
  {
    chapterNumber: 5,
    part: 'Part 1: Mechanics',
    titleAr: 'قوانين الحركة لنيوتن',
    titleEn: 'The Laws of Motion',
    lessons: [
      {
        id: 'serway-5-1',
        lessonNumber: '5.1 - 5.6',
        titleAr: 'قوانين نيوتن الثلاثة ومخطط الجسم الحر (FBD)',
        titleEn: "Newton's Three Laws & Free-Body Diagrams",
        suggestedPage: 111,
        keyConcepts: ['Inertia', 'ΣF = m·a', 'Action-Reaction', 'Equilibrium'],
      },
      {
        id: 'serway-5-2',
        lessonNumber: '5.8',
        titleAr: 'قوى الاحتكاك السكوني والحركي على المستويات',
        titleEn: 'Forces of Friction (Static & Kinetic Friction)',
        suggestedPage: 130,
        keyConcepts: ['fs_max = μs · N', 'fk = μk · N', 'Inclined Plane Dynamics'],
      },
    ],
  },
  {
    chapterNumber: 7,
    part: 'Part 1: Mechanics',
    titleAr: 'طاقة النظام والشغل الميكانيكي',
    titleEn: 'Energy of a System & Work',
    lessons: [
      {
        id: 'serway-7-1',
        lessonNumber: '7.2 - 7.5',
        titleAr: 'الشغل المنجز بقوة ثابتة وقوة متغيرة وطاقة الحركة',
        titleEn: 'Work Done by Constant/Varying Force & Kinetic Energy',
        suggestedPage: 180,
        keyConcepts: ['W = F · d · cos(θ)', 'W = ∫ F dx', 'K = (1/2)mv²'],
      },
      {
        id: 'serway-7-2',
        lessonNumber: '7.6 - 7.8',
        titleAr: 'طاقة الوضع الثقالية والمرونية والقدرة الميكانيكية',
        titleEn: 'Potential Energy (Gravitational & Elastic) and Power',
        suggestedPage: 195,
        keyConcepts: ['Ug = mgh', 'Us = (1/2)kx²', 'Power P = dW/dt = F · v'],
      },
    ],
  },
  {
    chapterNumber: 8,
    part: 'Part 1: Mechanics',
    titleAr: 'حفظ الطاقة الميكانيكية',
    titleEn: 'Conservation of Energy',
    lessons: [
      {
        id: 'serway-8-1',
        lessonNumber: '8.1 - 8.3',
        titleAr: 'القوى المحافظة ومبدأ حفظ الطاقة الميكانيكية',
        titleEn: 'Conservative Forces & Principle of Energy Conservation',
        suggestedPage: 212,
        keyConcepts: ['ΔK + ΔU = 0', 'Mechanical Energy Conservation', 'Nonconservative Work'],
      },
    ],
  },
  {
    chapterNumber: 23,
    part: 'Part 4: Electricity & Magnetism',
    titleAr: 'المجالات الكهربائية وقانون كولوم',
    titleEn: 'Electric Fields & Coulomb’s Law',
    lessons: [
      {
        id: 'serway-23-1',
        lessonNumber: '23.1 - 23.4',
        titleAr: 'قانون كولوم بين الشحنات النقطية وشدة المجال الكهربائي',
        titleEn: 'Coulomb’s Law, Superposition & Electric Field Vector',
        suggestedPage: 690,
        keyConcepts: ['Fe = ke · |q1·q2| / r²', 'Electric Field E = Fe / q0', 'Point Charge Field'],
      },
    ],
  },
  {
    chapterNumber: 24,
    part: 'Part 4: Electricity & Magnetism',
    titleAr: 'قانون غاوس والتدفق الكهربائي',
    titleEn: 'Gauss’s Law',
    lessons: [
      {
        id: 'serway-24-1',
        lessonNumber: '24.1 - 24.3',
        titleAr: 'التدفق الكهربائي وصيغة قانون غاوس والتناظر',
        titleEn: 'Electric Flux & Gauss’s Law for Symmetric Charge Distributions',
        suggestedPage: 725,
        keyConcepts: ['ΦE = ∮ E · dA', 'ΦE = q_in / ε0', 'Spherical & Cylindrical Symmetry'],
      },
    ],
  },
  {
    chapterNumber: 25,
    part: 'Part 4: Electricity & Magnetism',
    titleAr: 'الجهد الكهربائي',
    titleEn: 'Electric Potential',
    lessons: [
      {
        id: 'serway-25-1',
        lessonNumber: '25.1 - 25.5',
        titleAr: 'فرق الجهد وطاقة الوضع الكهربائية وسطوح تساوي الجهد',
        titleEn: 'Potential Difference, Electric Potential V, and Equipotential Surfaces',
        suggestedPage: 746,
        keyConcepts: ['ΔV = -∫ E · ds', 'V = ke · q / r', 'E = -∇V'],
      },
    ],
  },
  {
    chapterNumber: 26,
    part: 'Part 4: Electricity & Magnetism',
    titleAr: 'السعة والمكثفات والمواد العازلة',
    titleEn: 'Capacitance and Dielectrics',
    lessons: [
      {
        id: 'serway-26-1',
        lessonNumber: '26.1 - 26.4',
        titleAr: 'تعريف السعة ومكثف اللوحين المتوازيين وتوصيل المكثفات',
        titleEn: 'Capacitance C = Q/V, Parallel-Plate Capacitor & Combinations',
        suggestedPage: 777,
        keyConcepts: ['C = ε0·A / d', 'Parallel: Ceq = ΣCi', 'Series: 1/Ceq = Σ(1/Ci)'],
      },
    ],
  },
  {
    chapterNumber: 27,
    part: 'Part 4: Electricity & Magnetism',
    titleAr: 'التيار الكهربائي والمقاومة وقانون أوم',
    titleEn: 'Current and Resistance',
    lessons: [
      {
        id: 'serway-27-1',
        lessonNumber: '27.1 - 27.6',
        titleAr: 'كثافة التيار، قانون أوم المجهري والمجهري، والقدرة الكهربائية',
        titleEn: 'Electric Current I, Ohm’s Law, Resistivity ρ, and Electrical Power',
        suggestedPage: 808,
        keyConcepts: ['I = dQ/dt', 'V = I · R', 'R = ρ · L / A', 'P = I · V'],
      },
    ],
  },
  {
    chapterNumber: 28,
    part: 'Part 4: Electricity & Magnetism',
    titleAr: 'دوائر التيار المستمر وقوانين كيرشوف',
    titleEn: 'Direct-Current Circuits',
    lessons: [
      {
        id: 'serway-28-1',
        lessonNumber: '28.1 - 28.3',
        titleAr: 'القوة الدافعة الكهربائية (emf)، المقاومة الداخلية، وقوانين كيرشوف',
        titleEn: 'Electromotive Force (emf), Resistor Networks & Kirchhoff’s Rules',
        suggestedPage: 833,
        keyConcepts: ['Terminal Voltage', 'KCL: Junction Rule', 'KVL: Loop Rule'],
      },
      {
        id: 'serway-28-2',
        lessonNumber: '28.4',
        titleAr: 'دوائر RC للشحن والتفريغ وثابت الوقت',
        titleEn: 'RC Circuits (Charging, Discharging & Time Constant τ)',
        suggestedPage: 846,
        keyConcepts: ['q(t) = Q_max·(1 - e^(-t/RC))', 'Time Constant τ = RC', 'Discharging'],
      },
    ],
  },
  {
    chapterNumber: 31,
    part: 'Part 4: Electricity & Magnetism',
    titleAr: 'قانون فاراداي والحث الكهرومغناطيسي',
    titleEn: 'Faraday’s Law of Induction',
    lessons: [
      {
        id: 'serway-31-1',
        lessonNumber: '31.1 - 31.4',
        titleAr: 'التدفق المغناطيسي، قانون فاراداي، وقانون لينز للقوة الدافعة الحثية',
        titleEn: 'Magnetic Flux, Faraday’s Law, Lenz’s Law & Motional emf',
        suggestedPage: 935,
        keyConcepts: ['ΦB = ∫ B · dA', 'ε = -N · dΦB/dt', 'Lenz Law Opposition'],
      },
    ],
  },
  {
    chapterNumber: 33,
    part: 'Part 4: Electricity & Magnetism',
    titleAr: 'دوائر التيار المتردد والرنين',
    titleEn: 'Alternating-Current Circuits',
    lessons: [
      {
        id: 'serway-33-1',
        lessonNumber: '33.1 - 33.7',
        titleAr: 'دوائر RL و RC و RLC المتوالية وظاهرة الرنين الكهربائي',
        titleEn: 'Series RLC Circuits, Phasors, Impedance Z, and Resonance',
        suggestedPage: 998,
        keyConcepts: ['Z = √(R² + (XL - XC)²)', 'Resonance ω0 = 1/√(LC)', 'Power Factor cos(φ)'],
      },
    ],
  },
];

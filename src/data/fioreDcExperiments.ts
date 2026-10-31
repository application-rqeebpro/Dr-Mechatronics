import { FioreExperiment } from '../types/dcLab';

export const FIORE_DC_EXPERIMENTS: FioreExperiment[] = [
  // 1. The Electrical Laboratory
  {
    id: 'exp-1',
    number: 1,
    titleAr: 'المختبر الكهربائي وإجراءات السلامة',
    titleEn: 'The Electrical Laboratory & Safety',
    subtitleAr: 'التعرف على بيئة المختبر، قواعد السلامة، ومصادر الطاقة وأجهزة القياس المرجعية',
    objectivesAr: [
      'التعرف على معدات وأجهزة مختبر الدوائر الكهربائية (DMM، مصدر الجهد، أسلاك التوصيل، لوحة التجارب).',
      'فهم قواعد السلامة المهنية ومخاطر الصعق الكهربائي وقصر الدوائر (Short Circuits).',
      'تعلم كيفية قراءة مواصفات الأجهزة وضبط حدود الجهد والتيار الآمنة.'
    ],
    objectivesEn: [
      'Familiarize with electrical laboratory equipment and power supplies.',
      'Understand electrical safety rules, hazards, and fuse protection.',
      'Learn proper equipment operation and safe connection practices.'
    ],
    theoryAr: `يعد المختبر الكهربائي بيئة تطبيقية لاختبار المفاهيم الفيزيائية والهندسية. السلامة هي الأولوية القصوى: التيار الكهربائي المار في جسم الإنسان الذي يتجاوز 10mA يمكن أن يسبب انقباضاً عضلياً مؤلماً، وفوق 100mA يمكن أن يؤدي إلى الرجفان البطيني القاتل.
لذلك، يجب دائماً فحص الدوائر قبل توصيل الطاقة، والتأكد من عدم وجود أسلاك عارية، واستخدام مقاييس الجهد والتيار ضمن الحدود المقننة لتجنب احتراق المصاهر (Fuses) أو تلف الأجهزة.`,
    theoryEn: 'The electrical lab provides hands-on verification of circuit theory. Safety is paramount: currents above 10mA cause painful shocks, while currents over 100mA can be fatal. Circuits must be thoroughly inspected before applying power.',
    formulas: [
      { name: 'قانون القدرة الكهربائية', formula: 'P = V \\cdot I', descriptionAr: 'حساب القدرة المستهلكة للتأكد من عدم تجاوز قدرة المكونات' },
      { name: 'قانون أوم لتيار الصدمة', formula: 'I_{shock} = \\frac{V}{R_{body}}', descriptionAr: 'مقاومة جسم الإنسان تتراوح بين 1kΩ (جلد مبلل) إلى 100kΩ (جلد جاف)' }
    ],
    requiredEquipmentAr: [
      'مصدر جهد مستمر منظم (0-30V DC Power Supply)',
      'مقياس رقمي متعدد (Digital Multimeter - DMM)',
      'لوحة تجارب مثقبة (Breadboard)',
      'مجموعة مقاومات كربونية 1/4W و 1/2W',
      'أسلاك توصيل مع أطراف تمساح (Alligator clips)'
    ],
    requiredEquipmentEn: [
      'Adjustable DC Power Supply (0-30V)',
      'Digital Multimeter (DMM)',
      'Solderless Breadboard',
      'Assorted Carbon Film Resistors (1/4W, 1/2W)',
      'Connecting Jumper Wires'
    ],
    schematicSvgOrKey: 'lab-bench-safety',
    procedureStepsAr: [
      'تأكد من إيقاف تشغيل مصدر الجهد DC وضبط مفتاح الجهد على الحد الأدنى (0V).',
      'افحص لوحة التجارب (Breadboard) وتعرف على خطوط التغذية (Power Rails) ومصفوفات التوصيل العمودية.',
      'ركّب دائرة تجريبية بسيطة مكونة من مقاومة 1kΩ متصلة بمصدر الجهد 10V.',
      'استخدم الملتيميتر كمقياس جهد (Voltmeter) واقترب من طرفي المقاومة للتأكد من القراءة دون لمس الأسلاك الحية.',
      'قم بتسجيل الملاحظات حول كيفية تأثير رفع الجهد تدريجياً على حرارة المقاومة والقدرة.'
    ],
    procedureStepsEn: [
      'Ensure DC supply is switched OFF and voltage knob set to 0V.',
      'Inspect breadboard internal tie strips and power distribution rails.',
      'Construct a test circuit with a 1kΩ resistor and 10V source.',
      'Measure terminal voltage using DMM voltmeter mode.',
      'Record observations regarding resistor temperature and dissipated power.'
    ],
    defaultCircuit: {
      components: [
        { id: 'src1', type: 'dc_source', name: 'E1', value: 10, unit: 'V', x: 80, y: 150, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'sw1', type: 'switch', name: 'SW1', value: 1, unit: '', isOpen: false, x: 220, y: 90, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r1', type: 'resistor', name: 'R1', value: 1000, unit: 'Ω', x: 350, y: 150, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 80, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'sw1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'sw1', fromTerminalId: 't2', toComponentId: 'r1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'r1', fromTerminalId: 't2', toComponentId: 'src1', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w4', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' }
      ]
    },
    expectedMeasurements: [
      { parameter: 'جهد المصدر المقاس', symbol: 'E_{meas}', theoreticalFormula: 'E = 10.0\\text{ V}', typicalTheoretical: 10.0, unit: 'V' },
      { parameter: 'مقاومة الحمل', symbol: 'R_1', theoreticalFormula: 'R_1 = 1000\\, \\Omega', typicalTheoretical: 1000, unit: 'Ω' },
      { parameter: 'التيار المار في الدائرة', symbol: 'I_{total}', theoreticalFormula: 'I = \\frac{E}{R_1}', typicalTheoretical: 10.0, unit: 'mA' },
      { parameter: 'القدرة المستهلكة في R1', symbol: 'P_{R1}', theoreticalFormula: 'P = E \\cdot I', typicalTheoretical: 100.0, unit: 'mW' }
    ],
    discussionQuestions: [
      {
        id: 'dq-1',
        questionAr: 'ما الخطر المترتب على توصيل مقياس التيار (الأميتر) مباشرة على التوازي مع أطراف مصدر الجهد؟',
        questionEn: 'What is the danger of connecting an ammeter directly across a voltage source?',
        modelAnswerAr: 'الأميتر يتميز بمقاومة داخلية متناهية في الصغر (تقريباً 0Ω)، لذا فتوصيله على التوازي يسبب دائرة قصر شديدة (Short Circuit) تؤدي إلى سحب تيار هائل واحتراق منصهر الحماية (Fuse) فوراً.',
        modelAnswerEn: 'An ammeter has very low internal impedance. Connecting it in parallel causes a severe short circuit, blowing its internal fuse.'
      },
      {
        id: 'dq-2',
        questionAr: 'كيف تختار القدرة المقننة (Power Rating) للمقاومة عند تصميم الدائرة؟',
        questionEn: 'How do you select the appropriate power rating for a resistor?',
        modelAnswerAr: 'يتم حساب القدرة الفعلية P = I²R، ثم اختيار مقاومة بقدرة مقننة لا تقل عن ضعف القدرة المحسوبة (Safety factor of 2) لمنع ارتفاع الحرارة والتلف.',
        modelAnswerEn: 'Calculate actual power P = I^2*R, then choose a resistor rated for at least twice that value for thermal safety.'
      }
    ],
    preQuiz: [
      {
        id: 'pq-1',
        questionAr: 'ما القيمة التقريبية للمقاومة الداخلية لمقياس الفولتميتر المثالي؟',
        questionEn: 'What is the internal resistance of an ideal voltmeter?',
        optionsAr: ['صفر أوم (0Ω)', 'لا نهائية (∞Ω)', '100 أوم', '1 أوم'],
        optionsEn: ['0 ohms', 'Infinite (∞)', '100 ohms', '1 ohm'],
        correctIndex: 1,
        explanationAr: 'الفولتميتر المثالي له مقاومة لا نهائية حتى لا يسحب أي تيار من الدائرة عند قياس الجهد على التوازي.'
      },
      {
        id: 'pq-2',
        questionAr: 'عند حدوث قصر كهربائي (Short Circuit)، ما الذي يحدث للتيار؟',
        questionEn: 'In the event of a short circuit, what happens to current?',
        optionsAr: ['ينخفض إلى الصفر', 'يبقى ثابتاً', 'يرتفع إلى أقصى حد قد يؤدي للاحتراق', 'يتذبذب'],
        optionsEn: ['Drops to zero', 'Remains constant', 'Spikes to dangerous levels', 'Oscillates'],
        correctIndex: 2,
        explanationAr: 'لأن المقاومة تصبح شبه معدومة، يرتفع التيار إلى أقصى حد متاح من المصدر مسبباً خطراً جسيماً.'
      }
    ],
    postQuiz: [
      {
        id: 'poq-1',
        questionAr: 'إذا كانت مقاومة 220Ω متصلة بجهد 12V، فما أدنى قدرة مقننة مناسبة للمقاومة بأمان؟',
        questionEn: 'If a 220Ω resistor is connected across 12V, what is a safe power rating?',
        optionsAr: ['1/8 Watt (0.125W)', '1/4 Watt (0.25W)', '1 Watt أو أعلى', '50 milliWatt'],
        optionsEn: ['1/8 W', '1/4 W', '1 W or higher', '50 mW'],
        correctIndex: 2,
        explanationAr: 'القدرة P = V²/R = 144 / 220 = 0.65W. المقاومة 0.25W أو 0.5W ستحترق، لذلك يجب اختيار مقاومة 1W على الأقل.'
      }
    ],
    practicalApplicationAr: 'تطبيق إجراءات الأمان في ورش التصنيع الإلكتروني وصيانة بوردات السيارات الهجينة والروبوتات الصناعية.',
    commonMistakesAr: [
      'توصيل الأميتر على التوازي مع مصدر الجهد بدلاً من توصيله على التوالي.',
      'نسيان التأريض المرجعي (Ground) مما يسبب قراءات عائمة غير دقيقة.'
    ]
  },

  // 2. DC Sources and Metering
  {
    id: 'exp-2',
    number: 2,
    titleAr: 'مصادر التيار المستمر وأجهزة القياس',
    titleEn: 'DC Sources and Metering',
    subtitleAr: 'قياس دقة مصادر الجهد، استجابة التحميل (Loading Effect)، والمقاومة الداخلية للأجهزة',
    objectivesAr: [
      'التحقق من جهد الدائرة المفتوحة (Open Circuit Voltage) والجهد تحت الحمل لمصادر DC.',
      'دراسة تأثير تحميل الفولتميتر (Voltmeter Loading Effect) على الدوائر ذات المقاومات العالية.',
      'مقارنة دقة الملتيميتر الرقمي مع القيم الاسمية لمصادر التغذية والبطاريات.'
    ],
    objectivesEn: [
      'Measure open-circuit and loaded terminal voltages of DC sources.',
      'Investigate voltmeter loading effect in high-resistance circuits.',
      'Compare digital multimeter precision against nominal source ratings.'
    ],
    theoryAr: `المصدر المثالي للجهد المستمر يحافظ على جهد ثابت مهما تغير تيار الحمل (مقاومته الداخلية R_s = 0). لكن في الواقع، تمتلك البطاريات ومصادر الطاقة مقاومة داخلية صغيرة تسبب هبوطاً في جهد الأطراف عند سحب تيار: V_L = E - I R_s.
بالمثل، يمتلك الفولتميتر مقاومة داخلية R_m (عادة 10MΩ في أجهزة DMM الحديثة). إذا تم القياس عبر مقاومة كبيرة مقارنة بـ R_m، يتفرع تيار القياس وتظهر قراءة أقل من الجهد الحقيقي، وهو ما يسمى بتأثير التحميل (Loading Effect).`,
    theoryEn: 'An ideal voltage source maintains a constant terminal voltage regardless of load current (internal resistance Rs = 0). Real sources exhibit internal resistance Rs resulting in terminal voltage drop VL = E - I*Rs. In addition, meters with finite resistance introduce loading errors.',
    formulas: [
      { name: 'جهد أطراف المصدر الفعلي', formula: 'V_L = E - I \\cdot R_s', descriptionAr: 'هبوط الجهد الداخلي في المصدر عند سحب تيار الحمل I' },
      { name: 'المقاومة المكافئة مع الفولتميتر', formula: 'R_{eq} = R_L \\parallel R_{meter} = \\frac{R_L \\cdot R_m}{R_L + R_m}', descriptionAr: 'تأثير التحميل عند وضع الفولتميتر على التوازي مع المقاومة' }
    ],
    requiredEquipmentAr: [
      'مصدر جهد DC قابل للضبط (0-15V)',
      'مقياس متعدد رقمي (DMM)',
      'بطارية 9V قياسية',
      'مقاومات: 1kΩ, 10kΩ, 100kΩ, 1MΩ',
      'لوحة تجارب وأسلاك'
    ],
    requiredEquipmentEn: [
      'Variable DC Power Supply (0-15V)',
      'Digital Multimeter (DMM)',
      'Standard 9V Battery',
      'Resistors: 1kΩ, 10kΩ, 100kΩ, 1MΩ',
      'Breadboard and jumper wires'
    ],
    schematicSvgOrKey: 'dc-metering-schematic',
    procedureStepsAr: [
      'اضبط مصدر الجهد على 12V واقس جهده في وضع الدائرة المفتوحة (بدون حمل) وسجل القيمة V_oc.',
      'صِل مقاومة حمل R_L = 1kΩ ثم اقس جهد الأطراف V_L والتيار المار.',
      'كرر القياس مع مقاومات كبيرة (100kΩ و 1MΩ) لملاحظة تأثير تحميل الملتيميتر.',
      'احسب المقاومة الداخلية الفعالة للمصدر R_s = (V_oc - V_L) / I_L.'
    ],
    procedureStepsEn: [
      'Set DC source to 12V and measure open-circuit terminal voltage Voc.',
      'Connect a 1kΩ load resistor and measure terminal voltage VL and load current.',
      'Repeat with high-value resistors (100kΩ, 1MΩ) to observe meter loading.',
      'Compute effective internal resistance Rs = (Voc - VL) / IL.'
    ],
    defaultCircuit: {
      components: [
        { id: 'src1', type: 'dc_source', name: 'E1', value: 12, unit: 'V', x: 80, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'r_int', type: 'resistor', name: 'R_internal', value: 10, unit: 'Ω', x: 190, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r_load', type: 'resistor', name: 'R_Load', value: 100, unit: 'Ω', x: 340, y: 160, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 80, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'r_int', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'r_int', fromTerminalId: 't2', toComponentId: 'r_load', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'r_load', fromTerminalId: 't2', toComponentId: 'src1', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w4', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' }
      ]
    },
    expectedMeasurements: [
      { parameter: 'جهد المصدر في اللاحمل', symbol: 'V_{oc}', theoreticalFormula: 'V_{oc} = 12.0\\text{ V}', typicalTheoretical: 12.0, unit: 'V' },
      { parameter: 'جهد الحمل', symbol: 'V_{load}', theoreticalFormula: 'V_L = E \\cdot \\frac{R_L}{R_s + R_L}', typicalTheoretical: 10.91, unit: 'V' },
      { parameter: 'تيار الحمل', symbol: 'I_{load}', theoreticalFormula: 'I_L = \\frac{E}{R_s + R_L}', typicalTheoretical: 109.1, unit: 'mA' }
    ],
    discussionQuestions: [
      {
        id: 'dq-2-1',
        questionAr: 'لماذا ينخفض جهد أطراف البطارية عندما يتم سحب تيار كبير منها؟',
        questionEn: 'Why does terminal voltage decrease when high current is drawn?',
        modelAnswerAr: 'بسبب وجود مقاومة داخلية في البطارية ناتجة عن التفاعلات الكيميائية والموصلات، حيث ينشأ هبوط في الجهد V_drop = I * R_int يخصم من القوة الدافعة الكهربائية EMF.',
        modelAnswerEn: 'Due to internal chemical and ohmic resistance Rs, yielding a voltage drop I*Rs subtracted from EMF.'
      }
    ],
    preQuiz: [
      {
        id: 'pq-2-1',
        questionAr: 'تأثير التحميل (Loading Effect) يكون أكثر وضوحاً عند قياس الجهد عبر:',
        questionEn: 'Voltmeter loading effect is most pronounced when measuring across:',
        optionsAr: ['مقاومة صغيرة جداً (10Ω)', 'مقاومة كبيرة جداً قريبة من مقاومة الجهاز (1MΩ)', 'سلك موصل', 'مكثف مفرغ'],
        optionsEn: ['Very low resistance (10Ω)', 'Very high resistance close to meter impedance (1MΩ)', 'Ideal wire', 'Discharged capacitor'],
        correctIndex: 1,
        explanationAr: 'عندما تكون مقاومة الدائرة قريبة من مقاومة الفولتميتر، يسحب الفولتميتر جزءاً ملموساً من التيار مما يخفض الجهد المقاس.'
      }
    ],
    postQuiz: [
      {
        id: 'poq-2-1',
        questionAr: 'مصدر DC جهده في اللاحمل 10V، وعند توصيل حمل 100Ω أصبح الجهد 9.5V. ما قيمة المقاومة الداخلية للمصدر؟',
        questionEn: 'A source has Voc = 10V. When loaded with 100Ω, Vload is 9.5V. What is Rs?',
        optionsAr: ['5.26 Ω', '0.5 Ω', '10 Ω', '50 Ω'],
        optionsEn: ['5.26 Ω', '0.5 Ω', '10 Ω', '50 Ω'],
        correctIndex: 0,
        explanationAr: 'I = 9.5 / 100 = 0.095A. هبوط الجهد = 10 - 9.5 = 0.5V. إذن Rs = 0.5 / 0.095 = 5.26Ω.'
      }
    ],
    practicalApplicationAr: 'فحص شحن بطاريات السيارات والمتحكمات الدقيقة تحت أحمال المحركات دون التعرض لانهيار الجهد.',
    commonMistakesAr: ['افتراض أن جهد البطارية ثابت تحت كل ظروف الأحمال.']
  },

  // 3. Resistor Color Code
  {
    id: 'exp-3',
    number: 3,
    titleAr: 'شفرة ألوان المقاومات',
    titleEn: 'Resistor Color Code',
    subtitleAr: 'قراءة النطاقات اللونية الرباعية والخماسية، نسبة التفاوت (Tolerance)، والتحقق بالأوميتر',
    objectivesAr: [
      'إتقان قراءة المقاومات ذات 4 و 5 نطاقات ألوان بسرعة ودقة.',
      'تحديد القيمة الاسمية، المضاعف، ونسبة التفاوت المسموحة (Tolerance).',
      'قياس المقاومات الفعلية باستخدام مقياس الأوميتر والتحقق مما إذا كانت ضمن المدى المسموح.'
    ],
    objectivesEn: [
      'Master 4-band and 5-band resistor color codes.',
      'Calculate nominal resistance, multiplier, and tolerance range.',
      'Measure physical resistors using an ohmmeter and verify tolerance limits.'
    ],
    theoryAr: `تُطبع حلقات ملونة على المقاومات الكربونية ومقاومات الغشاء المعدني لترميز قيمتها الاسمية وفق النظام القياسي الدولي EIA.
في النظام رباعي النطاقات (4-Band):
- النطاق الأول والثاني: الرقمان المعنويان.
- النطاق الثالث: المضاعف العشري (Multiplier = 10^n).
- النطاق الرابع: نسبة التفاوت (Tolerance)، مثل: ذهبي (±5%)، فضي (±10%).
في النظام خماسي النطاقات (5-Band)، يُضاف رقم معنوي ثالث لمزيد من الدقة (مقاومات دقيقة 1%).
المدى المسموح: R_min = R_nom * (1 - Tol%) و R_max = R_nom * (1 + Tol%).`,
    theoryEn: 'Resistors use standard color bands to indicate nominal value and tolerance. In a 4-band resistor: band 1 & 2 are significant digits, band 3 is multiplier (10^n), band 4 is tolerance (gold ±5%, silver ±10%). Precision 5-band resistors add a 3rd significant digit.',
    formulas: [
      { name: 'القيمة الاسمية (4 نطاقات)', formula: 'R = (Digit_1 \\times 10 + Digit_2) \\times 10^{Multiplier}', descriptionAr: 'حساب المقاومة الاسمية بالأوم' },
      { name: 'الحد الأدنى للتفاوت', formula: 'R_{min} = R_{nom} \\times (1 - \\frac{\\text{Tol}}{100})', descriptionAr: 'أدنى قيمة مقبولة للمقاومة' },
      { name: 'الحد الأعلى للتفاوت', formula: 'R_{max} = R_{nom} \\times (1 + \\frac{\\text{Tol}}{100})', descriptionAr: 'أعلى قيمة مقبولة للمقاومة' }
    ],
    requiredEquipmentAr: [
      'مقياس DMM مضبوط على وضع قياس المقاومة (Ohmmeter)',
      'عينة من 10 مقاومات مختلفة (قيم بين 100Ω و 1MΩ)',
      'جدول شفرة ألوان المقاومات القياسي'
    ],
    requiredEquipmentEn: [
      'Digital Multimeter (DMM) set to Ohms',
      'Assortment of 10 carbon and metal film resistors',
      'Standard EIA resistor color code chart'
    ],
    schematicSvgOrKey: 'resistor-color-bands',
    procedureStepsAr: [
      'اختر مقاومة وضعها بحيث يكون شريط التفاوت (الذهبي أو الفضي) على اليمين.',
      'حدد ألوان الأشرطة من اليسار إلى اليمين واقرأ الأرقام المقابلة من جدول الألوان.',
      'احسب القيمة الاسمية (Nominal) وحدد مدى التفاوت (R_min إلى R_max).',
      'صِل طرفي الملتيميتر (الأوميتر) بالمقاومة مع التأكد من عدم لمس أسلاك القياس بأصابعك لتفادي إضافة مقاومة جسمك.',
      'قارن القيمة المقاسة مع المدى، وتحقق مما إذا كانت المقاومة صالحة أم تالفة.'
    ],
    procedureStepsEn: [
      'Orient resistor so tolerance band (gold/silver) is on the right.',
      'Read colors left to right and deduce significant digits and multiplier.',
      'Calculate nominal resistance and acceptable min/max tolerance boundaries.',
      'Measure physical resistance using DMM ohmmeter probes (without touching leads with fingers).',
      'Verify if measured value falls safely within theoretical tolerance.'
    ],
    defaultCircuit: {
      components: [
        { id: 'r_sample', type: 'resistor', name: 'R_dut', value: 4700, unit: 'Ω', x: 220, y: 150, rotation: 0, tolerance: 5, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'ohm_meter', type: 'ohmmeter', name: 'Ohmmeter', value: 0, unit: 'Ω', x: 220, y: 60, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'ohm_meter', fromTerminalId: 't1', toComponentId: 'r_sample', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'ohm_meter', fromTerminalId: 't2', toComponentId: 'r_sample', toTerminalId: 't2', color: '#1e293b' }
      ]
    },
    expectedMeasurements: [
      { parameter: 'مقاومة بني-أسود-أحمر-ذهبي', symbol: 'R_{nom}', theoreticalFormula: '10 \\times 10^2 = 1000\\, \\Omega', typicalTheoretical: 1000, unit: 'Ω' },
      { parameter: 'مقاومة أصفر-بنفسجي-أحمر-ذهبي', symbol: 'R_{nom}', theoreticalFormula: '47 \\times 10^2 = 4700\\, \\Omega', typicalTheoretical: 4700, unit: 'Ω' },
      { parameter: 'الحد الأدنى (4.7kΩ ±5%)', symbol: 'R_{min}', theoreticalFormula: '4700 \\times 0.95', typicalTheoretical: 4465, unit: 'Ω' },
      { parameter: 'الحد الأعلى (4.7kΩ ±5%)', symbol: 'R_{max}', theoreticalFormula: '4700 \\times 1.05', typicalTheoretical: 4935, unit: 'Ω' }
    ],
    discussionQuestions: [
      {
        id: 'dq-3-1',
        questionAr: 'لماذا يجب فصل المقاومة تماماً عن أي مصدر طاقة قبل قياسها بالأوميتر؟',
        questionEn: 'Why must a resistor be completely disconnected from power before ohmmeter measurement?',
        modelAnswerAr: 'لأن الأوميتر يضخ تياراً داخلياً صغيراً جداً ويقيس فرق الجهد الناتج ليحسب R = V/I. وجود أي جهد خارجي سيشوه القراءة تماماً وقد يدمر دائرة قياس الأوميتر الداخلية.',
        modelAnswerEn: 'Because ohmmeters apply their own tiny reference current and measure voltage drop. External voltages corrupt readings and blow meter circuitry.'
      }
    ],
    preQuiz: [
      {
        id: 'pq-3-1',
        questionAr: 'مقاومة ألوانها: أحمر، أحمر، برتقالي، ذهبي. ما قيمتها الاسمية وتفاوتها؟',
        questionEn: 'A resistor with bands: Red, Red, Orange, Gold has value:',
        optionsAr: ['22 kΩ ±5%', '2.2 kΩ ±10%', '220 Ω ±5%', '22 MΩ ±1%'],
        optionsEn: ['22 kΩ ±5%', '2.2 kΩ ±10%', '220 Ω ±5%', '22 MΩ ±1%'],
        correctIndex: 0,
        explanationAr: 'أحمر = 2، أحمر = 2، برتقالي = 10³ (1,000)، ذهبي = ±5%. إذن 22 × 10³ = 22,000Ω = 22 kΩ ±5%.'
      }
    ],
    postQuiz: [
      {
        id: 'poq-3-1',
        questionAr: 'إذا كانت قيمة مقاومة اسمية 1kΩ بنسبة تفاوت ±5%، وقستها بالأوميتر فوجدت 930Ω، هل هي مقبولة؟',
        questionEn: 'If a 1kΩ ±5% resistor measures 930Ω, is it within tolerance?',
        optionsAr: ['نعم، مقبولة', 'لا، خارج المدى المسموح (المقبول بين 950Ω و 1050Ω)', 'نعم لأن نسبة الخطأ أقل من 10%', 'لا يمكن التحديد'],
        optionsEn: ['Yes, acceptable', 'No, outside allowable 950Ω - 1050Ω range', 'Yes, error is under 10%', 'Cannot be determined'],
        correctIndex: 1,
        explanationAr: 'المدى المسموح لـ ±5% هو 950Ω إلى 1050Ω. القيمة 930Ω تقع تحت الحد الأدنى وبالتالي المقاومة تالفة أو غير مطابقة.'
      }
    ],
    practicalApplicationAr: 'فرز وتأكيد قيم المكونات قبل تلحيمها على بوردات الدوائر المطبوعة (PCBs).',
    commonMistakesAr: [
      'لمس طرفي مجسات الأوميتر بأصابع اليدين فيمر تيار عبر جسم القائس ويخفض القراءة المقاسة.',
      'البدء بقراءة الألوان من شريط التفاوت بدلاً من الشريط الأول.'
    ]
  },

  // 4. Ohm’s Law
  {
    id: 'exp-4',
    number: 4,
    titleAr: 'قانون أوم',
    titleEn: 'Ohm’s Law',
    subtitleAr: 'التحقق التجريبي من العلاقة الخطية بين الجهد والتيار (منحنى V-I) وحساب المقاومة الثابتة',
    objectivesAr: [
      'التحقق من العلاقة الخطية المباشرة بين الجهد المطبق والتيار المار في موصل مقاومي.',
      'رسم منحنى V-I واستنتاج قيمة المقاومة من ميل الخط المستقيم (Slope = R).',
      'دراسة العلاقة العكسية بين التيار والمقاومة عند ثبوت الجهد.'
    ],
    objectivesEn: [
      'Verify linear V-I relationship in resistive conductors.',
      'Plot V-I characteristic curve and derive resistance from slope (Slope = R).',
      'Examine inverse relationship between current and resistance at constant voltage.'
    ],
    theoryAr: `ينص قانون أوم، الذي صاغه الفيزيائي جورج أوم عام 1827، على أن شدة التيار الكهربائي (I) المار في موصل بين نقطتين تتناسب طردياً مع فرق الجهد (V) بينهما، بشرط ثبات درجة الحرارة: V = I * R.
تمثل المقاومة R ثابت التناسب وتقاس بالأوم (Ω). عند رسم الجهد V على المحور الرأسي والتيار I على المحور الأفقي، ينتج خط مستقيم يمر بنقطة الأصل وميله يساوي قيمة المقاومة R.`,
    theoryEn: 'Ohm’s Law establishes that current through a linear conductor between two points is directly proportional to the applied voltage at constant temperature: V = I*R. A plot of V vs. I yields a straight line through the origin whose slope represents resistance R.',
    formulas: [
      { name: 'قانون أوم', formula: 'V = I \\cdot R', descriptionAr: 'فرق الجهد يساوي حاصل ضرب التيار في المقاومة' },
      { name: 'حساب التيار', formula: 'I = \\frac{V}{R}', descriptionAr: 'التيار يتناسب طردياً مع الجهد وعكسياً مع المقاومة' },
      { name: 'حساب المقاومة من المنحنى', formula: 'R = \\frac{\\Delta V}{\\Delta I}', descriptionAr: 'المقاومة هي ميل منحنى الجهد والتيار' }
    ],
    requiredEquipmentAr: [
      'مصدر جهد مستمر قابل للتعديل (0-15V DC)',
      'جهازا ملتيميتر (أحدهما كفولتميتر والآخر كأميتير)',
      'مقاومات مختلفة: 1kΩ, 2.2kΩ, 3.3kΩ',
      'لوحة تجارب وأسلاك'
    ],
    requiredEquipmentEn: [
      'Adjustable DC Power Supply (0-15V)',
      'Two DMMs (one voltmeter, one ammeter)',
      'Resistors: 1kΩ, 2.2kΩ, 3.3kΩ',
      'Breadboard & wires'
    ],
    schematicSvgOrKey: 'ohms-law-schematic',
    procedureStepsAr: [
      'صِل الدائرة: مصدر الجهد متصل على التوالي مع الأميتر والمقاومة R = 1kΩ، والفولتميتر متصل على التوازي عبر المقاومة.',
      'غير جهد المصدر تدريجياً: 2V, 4V, 6V, 8V, 10V, 12V.',
      'في كل خطوة، سجل قراءة الفولتميتر بدقة وقراءة الأميتر المقابلة بالمللي أمبير.',
      'ارسم العلاقة البيانية بين V و I ولاحظ الخط المستقيم.',
      'كرر التجربة مع مقاومة R = 2.2kΩ وقارن ميل الخطين.'
    ],
    procedureStepsEn: [
      'Connect circuit: DC supply in series with ammeter and 1kΩ resistor; voltmeter in parallel across resistor.',
      'Vary source voltage in steps: 2V, 4V, 6V, 8V, 10V, 12V.',
      'Record exact voltmeter readings and corresponding ammeter readings (mA).',
      'Plot V versus I curve and verify straight line linearity.',
      'Repeat with 2.2kΩ resistor and compare curve slopes.'
    ],
    defaultCircuit: {
      components: [
        { id: 'src1', type: 'dc_source', name: 'E1', value: 10, unit: 'V', x: 80, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'ammeter1', type: 'ammeter', name: 'Ammeter', value: 0, unit: 'mA', x: 220, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0, label: '+' }, { id: 't2', x: 30, y: 0, label: '-' }] },
        { id: 'r1', type: 'resistor', name: 'R1', value: 1000, unit: 'Ω', x: 350, y: 160, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 80, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'ammeter1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'ammeter1', fromTerminalId: 't2', toComponentId: 'r1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'r1', fromTerminalId: 't2', toComponentId: 'src1', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w4', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' }
      ]
    },
    expectedMeasurements: [
      { parameter: 'التيار عند 2V', symbol: 'I_{2V}', theoreticalFormula: 'I = 2 / 1000', typicalTheoretical: 2.0, unit: 'mA' },
      { parameter: 'التيار عند 6V', symbol: 'I_{6V}', theoreticalFormula: 'I = 6 / 1000', typicalTheoretical: 6.0, unit: 'mA' },
      { parameter: 'التيار عند 10V', symbol: 'I_{10V}', theoreticalFormula: 'I = 10 / 1000', typicalTheoretical: 10.0, unit: 'mA' },
      { parameter: 'ميل المنحنى (المقاومة المستنتجة)', symbol: 'R_{calc}', theoreticalFormula: '\\Delta V / \\Delta I', typicalTheoretical: 1000, unit: 'Ω' }
    ],
    discussionQuestions: [
      {
        id: 'dq-4-1',
        questionAr: 'إذا تضاعف الجهد المطبق على مقاومة خطية، فماذا يحدث للتيار وللقدرة المستهلكة؟',
        questionEn: 'If voltage across a linear resistor doubles, what happens to current and power?',
        modelAnswerAr: 'يتضاعف التيار (2×)، بينما تتضاعف القدرة أربع مرات (4×) لأن القدرة تتناسب مع مربع الجهد: P = V² / R.',
        modelAnswerEn: 'Current doubles (2x), while dissipated power quadruples (4x) since P = V^2 / R.'
      }
    ],
    preQuiz: [
      {
        id: 'pq-4-1',
        questionAr: 'ما وحدة قياس المواصلة الكهربائية (Conductance)؟',
        questionEn: 'What is the SI unit of electrical conductance?',
        optionsAr: ['أوم (Ω)', 'سيمنز (Siemens - S)', 'فولت (V)', 'هنري (H)'],
        optionsEn: ['Ohm (Ω)', 'Siemens (S)', 'Volt (V)', 'Henry (H)'],
        correctIndex: 1,
        explanationAr: 'المواصلة G = 1/R وتقاس بالسيمنز (S) أو mho.'
      }
    ],
    postQuiz: [
      {
        id: 'poq-4-1',
        questionAr: 'تم تطبيق جهد 15V على مقاومة وسحب تيار مقداره 4.54mA. ما قيمة المقاومة؟',
        questionEn: 'A 15V voltage yields 4.54mA current. What is the resistance?',
        optionsAr: ['3.3 kΩ', '330 Ω', '68 kΩ', '1.5 kΩ'],
        optionsEn: ['3.3 kΩ', '330 Ω', '68 kΩ', '1.5 kΩ'],
        correctIndex: 0,
        explanationAr: 'R = V / I = 15V / 0.00454A = 3303.9Ω ≈ 3.3 kΩ.'
      }
    ],
    practicalApplicationAr: 'حساب مقاومات تحديد تيار مصابيح الـ LED وتصميم دارات التغذية للأنظمة الإلكترونية.',
    commonMistakesAr: ['توصيل الأميتر على التوازي مع المقاومة بدلاً من كسر المسار ووضعه على التوالي.']
  },

  // 5. Series DC Circuits
  {
    id: 'exp-5',
    number: 5,
    titleAr: 'دوائر التوالي',
    titleEn: 'Series DC Circuits',
    subtitleAr: 'التحقق من قانون كيرشوف للجهد (KVL)، وتجزئة الجهد، والمقاومة الكلية R_total',
    objectivesAr: [
      'التحقق من أن التيار متساوٍ في جميع أجزاء دائرة التوالي.',
      'التحقق من قانون كيرشوف للجهد (KVL): مجموع فروق الجهد يساوي جهد المصدر.',
      'تطبيق قاعدة مجزئ الجهد (Voltage Divider Rule - VDR).'
    ],
    objectivesEn: [
      'Verify that current is identical through all series elements.',
      'Verify Kirchhoff’s Voltage Law (KVL): sum of voltage drops equals source voltage.',
      'Apply and verify the Voltage Divider Rule (VDR).'
    ],
    theoryAr: `في دائرة التوالي (Series Circuit)، تترتب المكونات بحيث لا يوجد سوى مسار واحد لتدفق الشحنات، مما يجعل التيار ثابتاً في كل عنصر: I_total = I_1 = I_2 = I_3.
المقاومة الكلية تساوي المجموع الجبري لجميع المقاومات: R_total = R_1 + R_2 + ... + R_n.
ينص قانون كيرشوف للجهد (KVL) على أن المجموع الجبري لفروق الجهد حول أي مسار مغلق يساوي صفراً: E = V_1 + V_2 + V_3.
وتحدد قاعدة مجزئ الجهد هبوط الجهد على أي مقاومة مباشرة: V_x = E * (R_x / R_total).`,
    theoryEn: 'In a series circuit, components share a single continuous loop, so current is uniform throughout: It = I1 = I2 = I3. Total resistance is Rt = R1 + R2 + ... + Rn. Kirchhoff’s Voltage Law (KVL) dictates that the algebraic sum of voltages in any closed loop is zero: E = V1 + V2 + V3. Voltage Divider Rule states Vx = E * (Rx / Rt).',
    formulas: [
      { name: 'المقاومة الكلية على التوالي', formula: 'R_{total} = R_1 + R_2 + R_3', descriptionAr: 'جمع المقاومات على التوالي' },
      { name: 'قانون كيرشوف للجهد (KVL)', formula: 'E = V_{R1} + V_{R2} + V_{R3}', descriptionAr: 'جهد المصدر يساوي مجموع هبوط الجهود' },
      { name: 'قاعدة مجزئ الجهد (VDR)', formula: 'V_{Rx} = E \\cdot \\frac{R_x}{R_{total}}', descriptionAr: 'حساب الجهد على أي مقاومة في التوالي مباشرة' }
    ],
    requiredEquipmentAr: [
      'مصدر جهد مستمر (0-15V)',
      'مقياس DMM لقياس V و I',
      'مقاومات: R1 = 1kΩ, R2 = 2.2kΩ, R3 = 4.7kΩ',
      'لوحة تجارب وأسلاك'
    ],
    requiredEquipmentEn: [
      'Variable DC Source (0-15V)',
      'Digital Multimeter',
      'Resistors: R1=1kΩ, R2=2.2kΩ, R3=4.7kΩ',
      'Breadboard and leads'
    ],
    schematicSvgOrKey: 'series-dc-schematic',
    procedureStepsAr: [
      'ركّب 3 مقاومات (1kΩ, 2.2kΩ, 4.7kΩ) على التوالي مع مصدر جهد 12V.',
      'احسب المقاومة الكلية نظرياً: R_t = 1 + 2.2 + 4.7 = 7.9 kΩ.',
      'افصل المصدر وقس R_t بالأوميتر وقارنها مع الحساب النظري.',
      'وصّل الطاقة، وقس هبوط الجهد عبر كل مقاومة على حدة: V_R1, V_R2, V_R3.',
      'اجمع الجهود المقاسة وتحقق هل مجموعها يساوي 12V تماماً وفق KVL.',
      'قس التيار الكلي في أول الدائرة، ووسطها، ونهايتها وتأكد من ثباته.'
    ],
    procedureStepsEn: [
      'Construct a 3-resistor series circuit (1k, 2.2k, 4.7k) with a 12V source.',
      'Calculate theoretical Rt = 1 + 2.2 + 4.7 = 7.9 kΩ.',
      'Disconnect power and measure Rt with an ohmmeter.',
      'Power on and measure individual drops VR1, VR2, VR3.',
      'Sum voltages and verify KVL compliance: VR1 + VR2 + VR3 = E.',
      'Verify current equality at multiple loop points.'
    ],
    defaultCircuit: {
      components: [
        { id: 'src1', type: 'dc_source', name: 'E1', value: 12, unit: 'V', x: 80, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'r1', type: 'resistor', name: 'R1', value: 1000, unit: 'Ω', x: 190, y: 90, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r2', type: 'resistor', name: 'R2', value: 2200, unit: 'Ω', x: 310, y: 90, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r3', type: 'resistor', name: 'R3', value: 4700, unit: 'Ω', x: 420, y: 160, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 80, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'r1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'r1', fromTerminalId: 't2', toComponentId: 'r2', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'r2', fromTerminalId: 't2', toComponentId: 'r3', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w4', fromComponentId: 'r3', fromTerminalId: 't2', toComponentId: 'src1', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w5', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' }
      ]
    },
    expectedMeasurements: [
      { parameter: 'المقاومة الكلية', symbol: 'R_{total}', theoreticalFormula: '1k + 2.2k + 4.7k', typicalTheoretical: 7900, unit: 'Ω' },
      { parameter: 'التيار الكلي', symbol: 'I_{total}', theoreticalFormula: '12 / 7900', typicalTheoretical: 1.519, unit: 'mA' },
      { parameter: 'جهد المقاومة R1', symbol: 'V_{R1}', theoreticalFormula: '12 \\times (1 / 7.9)', typicalTheoretical: 1.519, unit: 'V' },
      { parameter: 'جهد المقاومة R2', symbol: 'V_{R2}', theoreticalFormula: '12 \\times (2.2 / 7.9)', typicalTheoretical: 3.342, unit: 'V' },
      { parameter: 'جهد المقاومة R3', symbol: 'V_{R3}', theoreticalFormula: '12 \\times (4.7 / 7.9)', typicalTheoretical: 7.139, unit: 'V' }
    ],
    discussionQuestions: [
      {
        id: 'dq-5-1',
        questionAr: 'إذا حدث انقطاع (Open Circuit) في المقاومة R2، فكم ستكون قراءة الفولتميتر المقاس عبر طرفي R2؟',
        questionEn: 'If resistor R2 opens, what will a voltmeter across R2 read?',
        modelAnswerAr: 'ستكون القراءة مساوية لجهد المصدر كاملاً (12V) لأن الدائرة أصبحت مفتوحة والتيار أصبح صفراً، فلا يوجد أي هبوط جهد على R1 و R3.',
        modelAnswerEn: 'It will read the full source voltage (12V) because current drops to zero, producing zero drop across R1 and R3.'
      }
    ],
    preQuiz: [
      {
        id: 'pq-5-1',
        questionAr: 'عند إضافة مقاومة رابعة على التوالي، ماذا يحدث للتيار الكلي للدائرة؟',
        questionEn: 'When adding a 4th resistor in series, what happens to total current?',
        optionsAr: ['يزداد', 'يقل', 'يبقى ثابتاً', 'ينعكس اتجاهه'],
        optionsEn: ['Increases', 'Decreases', 'Remains unchanged', 'Reverses direction'],
        correctIndex: 1,
        explanationAr: 'إضافة مقاومة على التوالي تزيد المقاومة الكلية R_total، وبالتالي يقل التيار I = E / R_total.'
      }
    ],
    postQuiz: [
      {
        id: 'poq-5-1',
        questionAr: 'في دائرة توالي مكونة من مقاومتين متساويتين متصلتين بجهد 10V، كم جهد كل مقاومة؟',
        questionEn: 'Two identical series resistors across 10V will each drop:',
        optionsAr: ['10V', '5V', '2.5V', '0V'],
        optionsEn: ['10V', '5V', '2.5V', '0V'],
        correctIndex: 1,
        explanationAr: 'وفق قاعدة مجزئ الجهد، الجهد ينقسم بالتساوي بين المقاومتين: 10 / 2 = 5V.'
      }
    ],
    practicalApplicationAr: 'دوائر التحكم في شدة الإضاءة ومجزئات الجهد لقراءة الحساسات التناظرية مع متحكمات الأردوينو.',
    commonMistakesAr: ['قياس المقاومة الكلية أثناء عمل الدائرة وتشغيل مصدر الجهد.']
  },

  // 6. Parallel DC Circuits
  {
    id: 'exp-6',
    number: 6,
    titleAr: 'دوائر التوازي',
    titleEn: 'Parallel DC Circuits',
    subtitleAr: 'التحقق من قانون كيرشوف للتيار (KCL)، وتجزئة التيار، وتكافؤ الجهد عبر التفرعات',
    objectivesAr: [
      'إثبات أن الجهد الكهربائي متساوٍ تماماً عبر جميع التفرعات المتصلة على التوازي.',
      'التحقق من قانون كيرشوف للتيار (KCL): مجموع التيارات الداخلة لعقدة يساوي الخارجة منها.',
      'حساب المقاومة المكافئة للتوازي وتطبيق قاعدة مجزئ التيار (CDR).'
    ],
    objectivesEn: [
      'Verify that voltage is identical across all parallel branches.',
      'Verify Kirchhoff’s Current Law (KCL): sum of currents entering a node equals sum leaving.',
      'Calculate equivalent parallel resistance and verify Current Divider Rule (CDR).'
    ],
    theoryAr: `في دائرة التوازي (Parallel Circuit)، تتصل جميع الفروع بين نفس النقطتين الكهربائيتين (العقدتين)، وبالتالي يكون فرق الجهد متطابقاً على كل عنصر: V_total = V_1 = V_2 = V_3 = E.
المقاومة المكافئة R_p تكون دائماً أصغر من أصغر مقاومة في الفروع: 1/R_p = 1/R_1 + 1/R_2 + 1/R_3.
ينص قانون كيرشوف للتيار (KCL) على أن المجموع الجبري للتيارات عند أي عقدة يساوي صفراً: I_total = I_1 + I_2 + I_3.
وقاعدة مجزئ التيار لمقاومتين على التوازي هي: I_1 = I_total * (R_2 / (R_1 + R_2)).`,
    theoryEn: 'In a parallel circuit, components connect across the exact same pair of electrical nodes, making voltage uniform: Vt = V1 = V2 = V3 = E. Equivalent resistance is smaller than the smallest branch: 1/Rp = 1/R1 + 1/R2 + 1/R3. Kirchhoff’s Current Law (KCL) states net nodal current is zero: It = I1 + I2 + I3.',
    formulas: [
      { name: 'المقاومة المكافئة للتوازي', formula: '\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}', descriptionAr: 'حساب المقاومة الكلية لدوائر التوازي' },
      { name: 'قانون كيرشوف للتيار (KCL)', formula: 'I_{total} = I_1 + I_2 + I_3', descriptionAr: 'التيار الكلي يساوي مجموع تيارات الفروع' },
      { name: 'قاعدة مجزئ التيار (لمقاومتين)', formula: 'I_1 = I_{total} \\cdot \\frac{R_2}{R_1 + R_2}', descriptionAr: 'حساب تيار الفرع الأول' }
    ],
    requiredEquipmentAr: [
      'مصدر جهد DC (0-15V)',
      'ملتيميتر رقمي DMM (لقياس V و mA)',
      'مقاومات: R1 = 1kΩ, R2 = 2.2kΩ, R3 = 3.3kΩ',
      'لوحة تجارب وأسلاك'
    ],
    requiredEquipmentEn: [
      'DC Power Supply (0-15V)',
      'Digital Multimeter (V & mA)',
      'Resistors: 1kΩ, 2.2kΩ, 3.3kΩ',
      'Breadboard & wires'
    ],
    schematicSvgOrKey: 'parallel-dc-schematic',
    procedureStepsAr: [
      'وصّل المقاومات الثلاث (1kΩ, 2.2kΩ, 3.3kΩ) على التوازي مع مصدر 10V.',
      'احسب المقاومة المكافئة نظرياً: 1/R_p = 1/1k + 1/2.2k + 1/3.3k => R_p ≈ 569.2 Ω.',
      'افصل المصدر وقس R_p عملياً بالأوميتر وتأكد أنها أقل من 1kΩ.',
      'أعد تشغيل المصدر، وقس الجهد عبر كل مقاومة وتأكد أنه 10V تماماً.',
      'قس تيار كل فرع: I_1, I_2, I_3 والتيار الكلي I_t من المصدر.',
      'اجمع تيارات الفروع وتحقق من انطباق قانون KCL: I_1 + I_2 + I_3 = I_t.'
    ],
    procedureStepsEn: [
      'Connect three resistors (1k, 2.2k, 3.3k) in parallel with 10V DC source.',
      'Calculate theoretical Rp = 569.2 Ω.',
      'Measure unpowered Rp with ohmmeter and confirm it is lower than the smallest branch.',
      'Measure branch voltages and verify each equals 10V.',
      'Measure individual branch currents I1, I2, I3 and total current It.',
      'Verify KCL: I1 + I2 + I3 = It.'
    ],
    defaultCircuit: {
      components: [
        { id: 'src1', type: 'dc_source', name: 'E1', value: 10, unit: 'V', x: 80, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'r1', type: 'resistor', name: 'R1', value: 1000, unit: 'Ω', x: 220, y: 160, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'r2', type: 'resistor', name: 'R2', value: 2200, unit: 'Ω', x: 320, y: 160, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'r3', type: 'resistor', name: 'R3', value: 3300, unit: 'Ω', x: 420, y: 160, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 80, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'r1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'r1', fromTerminalId: 't1', toComponentId: 'r2', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'r2', fromTerminalId: 't1', toComponentId: 'r3', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w4', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'r1', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w5', fromComponentId: 'r1', fromTerminalId: 't2', toComponentId: 'r2', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w6', fromComponentId: 'r2', fromTerminalId: 't2', toComponentId: 'r3', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w7', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' }
      ]
    },
    expectedMeasurements: [
      { parameter: 'المقاومة المكافئة', symbol: 'R_p', theoreticalFormula: '1/(1/1k + 1/2.2k + 1/3.3k)', typicalTheoretical: 569.2, unit: 'Ω' },
      { parameter: 'تيار الفرع 1 (1kΩ)', symbol: 'I_1', theoreticalFormula: '10 / 1000', typicalTheoretical: 10.0, unit: 'mA' },
      { parameter: 'تيار الفرع 2 (2.2kΩ)', symbol: 'I_2', theoreticalFormula: '10 / 2200', typicalTheoretical: 4.545, unit: 'mA' },
      { parameter: 'تيار الفرع 3 (3.3kΩ)', symbol: 'I_3', theoreticalFormula: '10 / 3300', typicalTheoretical: 3.030, unit: 'mA' },
      { parameter: 'التيار الكلي من المصدر', symbol: 'I_{total}', theoreticalFormula: 'I_1 + I_2 + I_3', typicalTheoretical: 17.575, unit: 'mA' }
    ],
    discussionQuestions: [
      {
        id: 'dq-6-1',
        questionAr: 'لماذا توصل الأجهزة الكهربائية والمصابيح في المنازل والسيارات على التوازي دائماً وليس على التوالي؟',
        questionEn: 'Why are household and automotive loads always connected in parallel?',
        modelAnswerAr: 'حتى يحصل كل جهاز على نفس الجهد المقنن للتشغيل الكامل، وإذا تعطل أو أُطفئ أحد الأجهزة تظل بقية الأجهزة تعمل دون انقطاع، بعكس التوالي.',
        modelAnswerEn: 'So each appliance receives full rated voltage, and opening one device does not disconnect the others.'
      }
    ],
    preQuiz: [
      {
        id: 'pq-6-1',
        questionAr: 'مقاومتان 100Ω متصلتان على التوازي. ما مقاومتهما المكافئة؟',
        questionEn: 'Two identical 100Ω resistors in parallel yield:',
        optionsAr: ['200 Ω', '50 Ω', '100 Ω', '25 Ω'],
        optionsEn: ['200 Ω', '50 Ω', '100 Ω', '25 Ω'],
        correctIndex: 1,
        explanationAr: 'لمقاومتين متساويتين على التوازي: R_p = R / 2 = 100 / 2 = 50Ω.'
      }
    ],
    postQuiz: [
      {
        id: 'poq-6-1',
        questionAr: 'إذا أضفت مقاومة إضافية على التوازي في دائرة قائمة، فماذا يحدث للتيار الإجمالي المسحوب من المصدر؟',
        questionEn: 'Adding another parallel resistor to an active circuit causes total current to:',
        optionsAr: ['ينخفض', 'يرتفع', 'يبقى كما هو', 'يصل للصفر'],
        optionsEn: ['Decrease', 'Increase', 'Remain unchanged', 'Reach zero'],
        correctIndex: 1,
        explanationAr: 'إضافة فرع توازي يوفر مساراً جديداً للتيار ويقلل المقاومة الكلية مما يزيد التيار الكلي المسحوب.'
      }
    ],
    practicalApplicationAr: 'شبكات توزيع الطاقة الكهربائية في المنشآت الصناعية والمنازل ودوائر التغذية المتوازية.',
    commonMistakesAr: ['محاولة قياس تيار الفرع دون فتح الدائرة ووضع الأميتر داخل الفرع.']
  },

  // 7. Series-Parallel DC Circuits
  {
    id: 'exp-7',
    number: 7,
    titleAr: 'دوائر التوالي والتوازي المركبة',
    titleEn: 'Series-Parallel DC Circuits',
    subtitleAr: 'تبسيط الدوائر المعقدة، التحليل التدريجي خطوة بخطوة، وحساب الجهود والتيارات في كل فرع',
    objectivesAr: [
      'تحديد الفروع المتصلة على التوالي والفروع المتصلة على التوازي في الدوائر المركبة.',
      'تبسيط الدائرة خطوة بخطوة للوصول إلى المقاومة المكافئة النهائية R_eq.',
      'تطبيق قانوني كيرشوف (KVL و KCL) في التحليل الشامل للجهد والتيار والقدرة.'
    ],
    objectivesEn: [
      'Identify series and parallel sub-blocks within composite networks.',
      'Reduce complex networks step-by-step to find single equivalent resistance Req.',
      'Apply KVL and KCL systematically across all nodes and loops.'
    ],
    theoryAr: `تحتوي معظم الدوائر الإلكترونية والعملية على مزيج من مقاومات التوالي والتوازي. لا يمكن تطبيق صيغة واحدة مباشرة، بل يلزم تبسيط الدائرة من أبعد نقطة عن المصدر باتجاه المصدر.
يتم استبدال كل مقاومتين على التوالي بمقاومة مكافئة واحدة (R_s = R_1 + R_2)، وكل مقاومتين على التوازي بمقاومة مكافئة واحدة (R_p = (R_1 * R_2)/(R_1 + R_2))، وتكرار هذه العملية حتى الحصول على مقاومة واحدة متصلة بمصدر الجهد.
بعدها يُحسب التيار الكلي، ثم يتم الرجوع عكسياً عبر الدائرة لحساب جهد وتيار كل مكون بالتفصيل.`,
    theoryEn: 'Most practical circuits blend series and parallel combinations. Analysis proceeds by systematically simplifying sub-networks starting farthest from the source back to source terminals. Once total current is determined, a reverse traversal using Ohm’s Law, VDR, and CDR resolves all branch voltages and currents.',
    formulas: [
      { name: 'المقاومة المكافئة المركبة', formula: 'R_{eq} = R_1 + (R_2 \\parallel R_3)', descriptionAr: 'R1 على التوالي مع توازي R2 و R3' },
      { name: 'التيار الكلي من المصدر', formula: 'I_{total} = \\frac{E}{R_{eq}}', descriptionAr: 'حساب التيار الرئيسي المغذي للدائرة' },
      { name: 'جهد التوازي', formula: 'V_p = E - I_{total} \\cdot R_1', descriptionAr: 'هبوط الجهد المتبقي لمجموعة التوازي' }
    ],
    requiredEquipmentAr: [
      'مصدر جهد DC (12V)',
      'ملتيميتر رقمي DMM',
      'مقاومات: R1 = 1kΩ, R2 = 2.2kΩ, R3 = 3.3kΩ, R4 = 4.7kΩ',
      'لوحة تجارب وأسلاك'
    ],
    requiredEquipmentEn: [
      'DC Power Supply (12V)',
      'Digital Multimeter',
      'Resistors: R1=1kΩ, R2=2.2kΩ, R3=3.3kΩ, R4=4.7kΩ',
      'Breadboard & wires'
    ],
    schematicSvgOrKey: 'series-parallel-schematic',
    procedureStepsAr: [
      'ركّب دائرة مركبة: R1 (1kΩ) على التوالي مع مجموعة التوازي المكونة من R2 (2.2kΩ) و R3 (3.3kΩ).',
      'احسب R_p = (2.2k * 3.3k) / (2.2k + 3.3k) = 1320 Ω.',
      'احسب R_eq = 1000 + 1320 = 2320 Ω.',
      'قس R_eq بالأوميتر بعد فصل المصدر وتحقق من نسبة الخطأ.',
      'صِل مصدر 12V، واقس الجهد على R1 والجهد المشترك على R2 و R3.',
      'تحقق من أن V_R1 + V_p = 12V (KVL) وأن I_total = I_R2 + I_R3 (KCL).'
    ],
    procedureStepsEn: [
      'Build circuit: R1 in series with parallel block (R2 || R3) fed by 12V.',
      'Compute parallel block equivalent Rp = 1320 Ω.',
      'Compute total equivalent Req = 1000 + 1320 = 2320 Ω.',
      'Measure unpowered Req and record error percentage.',
      'Energize with 12V and measure VR1 and parallel block voltage Vp.',
      'Verify KVL (VR1 + Vp = 12V) and KCL (It = IR2 + IR3).'
    ],
    defaultCircuit: {
      components: [
        { id: 'src1', type: 'dc_source', name: 'E1', value: 12, unit: 'V', x: 80, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'r1', type: 'resistor', name: 'R1', value: 1000, unit: 'Ω', x: 190, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r2', type: 'resistor', name: 'R2', value: 2200, unit: 'Ω', x: 310, y: 140, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'r3', type: 'resistor', name: 'R3', value: 3300, unit: 'Ω', x: 410, y: 140, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 80, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'r1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'r1', fromTerminalId: 't2', toComponentId: 'r2', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'r2', fromTerminalId: 't1', toComponentId: 'r3', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w4', fromComponentId: 'r2', fromTerminalId: 't2', toComponentId: 'r3', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w5', fromComponentId: 'r2', fromTerminalId: 't2', toComponentId: 'src1', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w6', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' }
      ]
    },
    expectedMeasurements: [
      { parameter: 'المقاومة المكافئة', symbol: 'R_{eq}', theoreticalFormula: '1k + (2.2k \\parallel 3.3k)', typicalTheoretical: 2320, unit: 'Ω' },
      { parameter: 'التيار الكلي', symbol: 'I_{total}', theoreticalFormula: '12 / 2320', typicalTheoretical: 5.172, unit: 'mA' },
      { parameter: 'جهد R1', symbol: 'V_{R1}', theoreticalFormula: '5.172mA \\times 1000', typicalTheoretical: 5.172, unit: 'V' },
      { parameter: 'جهد مجموعة التوازي', symbol: 'V_{parallel}', theoreticalFormula: '12 - 5.172', typicalTheoretical: 6.828, unit: 'V' },
      { parameter: 'تيار R2', symbol: 'I_{R2}', theoreticalFormula: '6.828 / 2200', typicalTheoretical: 3.104, unit: 'mA' },
      { parameter: 'تيار R3', symbol: 'I_{R3}', theoreticalFormula: '6.828 / 3300', typicalTheoretical: 2.069, unit: 'mA' }
    ],
    discussionQuestions: [
      {
        id: 'dq-7-1',
        questionAr: 'إذا حدث قصر (Short Circuit) عبر المقاومة R2، فماذا يحدث لجهد وتيار المقاومة R1؟',
        questionEn: 'If a short circuit develops across R2, what happens to VR1 and IR1?',
        modelAnswerAr: 'القصر سيلغي مجموعة التوازي تماماً، فتصبح المقاومة المكافئة هي R1 فقط (1kΩ). يرتفع الجهد عبر R1 إلى جهد المصدر كاملاً (12V) ويرتفع التيار إلى 12mA مما قد يسبب ارتفاع حرارتها.',
        modelAnswerEn: 'The short bypasses the parallel block; Req drops to R1 alone (1k). VR1 jumps to full 12V and IR1 increases to 12mA.'
      }
    ],
    preQuiz: [
      {
        id: 'pq-7-1',
        questionAr: 'في دائرة مكونة من R1 على التوالي مع (R2 || R3)، إذا زادت قيمة R3، ماذا يحدث للتيار الكلي؟',
        questionEn: 'In a circuit with R1 in series with (R2 || R3), if R3 increases, It will:',
        optionsAr: ['يزداد', 'يقل', 'يبقى ثابتاً تماماً', 'يصل إلى الصفر'],
        optionsEn: ['Increase', 'Decrease', 'Remain identical', 'Drop to zero'],
        correctIndex: 1,
        explanationAr: 'زيادة R3 ترفع المقاومة المكافئة للتوازي (R2 || R3)، وبالتالي تزيد R_eq الكلية وينخفض التيار الكلي.'
      }
    ],
    postQuiz: [
      {
        id: 'poq-7-1',
        questionAr: 'ما المقاومة المكافئة لدائرة تحتوي على مقاومة 500Ω على التوالي مع مقاومتين 1kΩ متصلتين على التوازي؟',
        questionEn: 'What is Req of a 500Ω resistor in series with two parallel 1kΩ resistors?',
        optionsAr: ['1500 Ω', '1000 Ω', '750 Ω', '2500 Ω'],
        optionsEn: ['1500 Ω', '1000 Ω', '750 Ω', '2500 Ω'],
        correctIndex: 1,
        explanationAr: 'توازي مقاومتين 1kΩ يعطي 500Ω. بجمعها مع المقاومة الأولى على التوالي: 500 + 500 = 1000Ω (1kΩ).'
      }
    ],
    practicalApplicationAr: 'تصميم شبكات توزيع الجهد ومخمدات الإشارة (Attenuators) في أجهزة الاتصالات والصوتيات.',
    commonMistakesAr: ['افتراض أن جميع المقاومات يمر بها نفس التيار قبل التحقق من التفرعات.']
  },

  // 8. Ladders and Bridges
  {
    id: 'exp-8',
    number: 8,
    titleAr: 'دوائر السلم والجسور',
    titleEn: 'Ladders and Bridges',
    subtitleAr: 'تحليل شبكات السلم المقاومية (R-2R Ladder) وجسر ويتستون (Wheatstone Bridge) المتزن وغير المتزن',
    objectivesAr: [
      'فهم وتحليل شبكات السلم المقاومية (Ladder Networks) المستخدمة في محولات DAC.',
      'دراسة جسر ويتستون والتحقق من شرط الاتزان: R1 / R2 = R3 / R4.',
      'استخدام الجسر لقياس التغيرات الدقيقة جداً في المقاومة (حساسات Strain Gauge و RTD).'
    ],
    objectivesEn: [
      'Analyze resistive ladder networks used in Digital-to-Analog Converters (DAC).',
      'Investigate the Wheatstone Bridge and verify balance condition: R1/R2 = R3/R4.',
      'Utilize bridge circuits for ultra-sensitive resistance sensing (strain gauges, RTDs).'
    ],
    theoryAr: `تتكون شبكة السلم (Ladder Network) من حلقات متكررة على شكل درجات السلم، مثل شبكة R-2R الشهيرة المستخدمة في تحويل الإشارات الرقمية إلى تناظرية (DAC).
أما جسر ويتستون فيتكون من فرعين متوازيين يضم كل منهما مقاومتين. الجهد بين النقطتين المركزيتين A و B يُعطى بالعلاقة: V_AB = V_A - V_B = E * [R2/(R1+R2) - R4/(R3+R4)].
يكون الجسر في حالة اتزان (Balanced) عندما يكون فرق الجهد V_AB = 0، ويحدث ذلك فقط عندما تكون النسبة R1/R2 = R3/R4. إذا تغيرت إحدى المقاومات ولو بنسبة 0.1%، يختل الاتزان ويظهر فرق جهد حساس يتناسب مع مقدار التغير.`,
    theoryEn: 'Ladder networks repeat series-parallel loops, prominent in R-2R DAC architectures. The Wheatstone bridge features two parallel branches. Midpoint voltage Vab = Va - Vb = E*[R2/(R1+R2) - R4/(R3+R4)]. The bridge is balanced (Vab = 0) when R1/R2 = R3/R4. Unbalanced bridges provide ultra-precise sensing for minute strain and temperature deviations.',
    formulas: [
      { name: 'شرط اتزان جسر ويتستون', formula: '\\frac{R_1}{R_2} = \\frac{R_3}{R_4}', descriptionAr: 'شرط انعدام فرق الجهد بين نقطتي الجسر V_AB = 0' },
      { name: 'جهد مخرج الجسر', formula: 'V_{AB} = E \\left( \\frac{R_2}{R_1 + R_2} - \\frac{R_4}{R_3 + R_4} \\right)', descriptionAr: 'فرق الجهد بين منتصفي الفرعين' },
      { name: 'حساب المقاومة المجهولة في الاتزان', formula: 'R_x = R_3 \\cdot \\frac{R_2}{R_1}', descriptionAr: 'تحديد قيمة مقاومة مجهولة بدقة عالية' }
    ],
    requiredEquipmentAr: [
      'مصدر جهد مستمر 10V',
      'ملتيميتر رقمي عالي الدقة (DMM mV mode)',
      'مقاومات: 4 مقاومات متطابقة 1kΩ, ومقاومات 2kΩ, 3kΩ',
      'مقاومة متغيرة دقيقة (Trimmer Potentiometer 1kΩ)',
      'لوحة تجارب وأسلاك'
    ],
    requiredEquipmentEn: [
      '10V DC Power Supply',
      'Precision DMM (mV resolution)',
      'Resistors: 1kΩ (x4), 2kΩ, 3kΩ',
      '1kΩ Precision Trimmer Potentiometer',
      'Breadboard & wires'
    ],
    schematicSvgOrKey: 'wheatstone-bridge-schematic',
    procedureStepsAr: [
      'ركّب جسر ويتستون: الفرع الأيسر مكون من R1 = 1kΩ و R2 = 1kΩ، والفرع الأيمن مكون من R3 = 1kΩ و R4 = 1kΩ.',
      'صِل مصدر 10V بين القمة والقاعدة.',
      'صِل الفولتميتر بين النقطة A (بين R1 و R2) والنقطة B (بين R3 و R4).',
      'لاحظ أن V_AB = 0.000V لأن الجسر في حالة اتزان مثالية (Balanced).',
      'استبدل R4 بمقاومة 1.2kΩ (اختلال الاتزان)، وسجل فرق الجهد V_AB الجديد وقارنه بالحساب النظري.'
    ],
    procedureStepsEn: [
      'Assemble Wheatstone bridge: R1=1k, R2=1k on left; R3=1k, R4=1k on right across 10V.',
      'Connect sensitive DMM between nodes A and B.',
      'Observe Vab = 0.000V in perfect balance.',
      'Replace R4 with 1.2kΩ to create imbalance.',
      'Measure resulting output voltage Vab and compare with theoretical formula.'
    ],
    defaultCircuit: {
      components: [
        { id: 'src1', type: 'dc_source', name: 'E1', value: 10, unit: 'V', x: 60, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'r1', type: 'resistor', name: 'R1', value: 1000, unit: 'Ω', x: 190, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r2', type: 'resistor', name: 'R2', value: 1000, unit: 'Ω', x: 190, y: 220, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r3', type: 'resistor', name: 'R3', value: 1000, unit: 'Ω', x: 340, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r4', type: 'resistor', name: 'R4', value: 1200, unit: 'Ω', x: 340, y: 220, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 60, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'r1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'r3', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'r1', fromTerminalId: 't2', toComponentId: 'r2', toTerminalId: 't1', color: '#f59e0b' },
        { id: 'w4', fromComponentId: 'r3', fromTerminalId: 't2', toComponentId: 'r4', toTerminalId: 't1', color: '#10b981' },
        { id: 'w5', fromComponentId: 'r2', fromTerminalId: 't2', toComponentId: 'src1', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w6', fromComponentId: 'r4', fromTerminalId: 't2', toComponentId: 'src1', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w7', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' }
      ]
    },
    expectedMeasurements: [
      { parameter: 'جهد النقطة A بالنسبة للأرضي', symbol: 'V_A', theoreticalFormula: '10 \\times (1000 / 2000)', typicalTheoretical: 5.0, unit: 'V' },
      { parameter: 'جهد النقطة B عند الاتزان (R4=1k)', symbol: 'V_{B,bal}', theoreticalFormula: '10 \\times (1000 / 2000)', typicalTheoretical: 5.0, unit: 'V' },
      { parameter: 'جهد المخرج المتزن V_AB', symbol: 'V_{AB,bal}', theoreticalFormula: '5.0 - 5.0', typicalTheoretical: 0.0, unit: 'V' },
      { parameter: 'جهد النقطة B عند اختلال الاتزان (R4=1.2k)', symbol: 'V_{B,unbal}', theoreticalFormula: '10 \\times (1200 / 2200)', typicalTheoretical: 5.455, unit: 'V' },
      { parameter: 'جهد مخرج الجسر غير المتزن', symbol: 'V_{AB,unbal}', theoreticalFormula: '5.0 - 5.455', typicalTheoretical: -0.455, unit: 'V' }
    ],
    discussionQuestions: [
      {
        id: 'dq-8-1',
        questionAr: 'لماذا يعتبر جسر ويتستون أكثر دقة في قياس المقاومات من مقياس الأوميتر المباشر؟',
        questionEn: 'Why is a Wheatstone bridge superior to direct ohmmeter readings for precision measurement?',
        modelAnswerAr: 'لأن الجسر يعتمد على طريقة التصفير (Null Method) حيث يتم رصد نقطة الصفر V=0 بدقة متناهية، مما يلغي أخطاء معايرة الأجهزة وهبوط الجهد في أسلاك التوصيل.',
        modelAnswerEn: 'It utilizes a null method where balance point V=0 is detected with extreme sensitivity, independent of lead resistances and calibration drift.'
      }
    ],
    preQuiz: [
      {
        id: 'pq-8-1',
        questionAr: 'في جسر ويتستون، إذا كانت R1=100Ω و R2=200Ω و R3=500Ω، فما قيمة R4 لتحقيق الاتزان؟',
        questionEn: 'In a Wheatstone bridge with R1=100Ω, R2=200Ω, R3=500Ω, what must R4 be for balance?',
        optionsAr: ['1000 Ω', '250 Ω', '500 Ω', '100 Ω'],
        optionsEn: ['1000 Ω', '250 Ω', '500 Ω', '100 Ω'],
        correctIndex: 0,
        explanationAr: 'شرط الاتزان: R1 / R2 = R3 / R4 => 100 / 200 = 500 / R4 => R4 = (200 × 500) / 100 = 1000Ω.'
      }
    ],
    postQuiz: [
      {
        id: 'poq-8-1',
        questionAr: 'أين يستخدم جسر ويتستون بشكل واسع في الصناعة؟',
        questionEn: 'Where are bridge circuits predominantly used industrially?',
        optionsAr: ['موازين الشاحنات الإلكترونية ومستشعرات الضغط والانفعال (Load Cells)', 'المحولات الكهربائية الضخمة', 'شواحن الهواتف الذكية', 'محركات الاحتراق الداخلي'],
        optionsEn: ['Electronic scales, load cells, and strain gauges', 'High power grid transformers', 'Smartphone fast chargers', 'Internal combustion engines'],
        correctIndex: 0,
        explanationAr: 'تستخدم في خلايا الوزن ومستشعرات الانفعال (Load Cells & Strain Gauges) لقياس التغيرات الميكرومترية بدقة هائلة.'
      }
    ],
    practicalApplicationAr: 'خلايا الوزن الدقيقة، مجسات قياس ضغط الدم، ومتحكمات أجهزة الفحص الميكانيكي الدقيق.',
    commonMistakesAr: ['افتراض أن الجسر غير المتزن يعطي جهداً خطياً تماماً لجميع التغيرات الكبيرة في المقاومة.']
  },

  // 9. Potentiometers and Rheostats
  {
    id: 'exp-9',
    number: 9,
    titleAr: 'مقاييس الجهد والمقاومات المتغيرة',
    titleEn: 'Potentiometers and Rheostats',
    subtitleAr: 'الفرق بين مقسم الجهد (Potentiometer ثلاثي الأطراف) ومعدل التيار (Rheostat ثنائي الأطراف)',
    objectivesAr: [
      'فهم الفرق الجوهري في التوصيل والوظيفة بين Potentiometer و Rheostat.',
      'معايرة مخرج الجهد القابل للتعديل من 0V إلى أقصى جهد V_in.',
      'التحكم في شدة التيار المار في الحمل باستخدام الريوستات وحساب القدرة الحرارية.'
    ],
    objectivesEn: [
      'Differentiate between 3-terminal Potentiometer and 2-terminal Rheostat.',
      'Calibrate variable output voltage continuously from 0V to Vin.',
      'Control load current using a rheostat and monitor heat dissipation.'
    ],
    theoryAr: `المقاومة المتغيرة جهاز كهروميكانيكي يحتوي على مسار مقاومي ونصل منزلق (Wiper).
1. مقسم الجهد (Potentiometer): يستخدم الأطراف الثلاثة (الطرفان الثابتان متصلان بجهد المصدر والأرضي، والنصل يخرج جهداً متغيراً بنسبة الموضع: V_out = V_in * (R_bottom / R_total)). يستخدم في ضبط الصوت والتحكم بالسرعة.
2. الريوستات (Rheostat): يستخدم طرفين فقط (طرف ثابت والمنزلق)، ليعمل كمقاومة متغيرة على التوالي مع الحمل للتحكم في شدة التيار I = E / (R_rheo + R_load).`,
    theoryEn: 'Variable resistors consist of a resistive track and a movable wiper. When connected as a 3-terminal Potentiometer, it functions as an adjustable voltage divider (Vout = Vin * wiper%). When wired as a 2-terminal Rheostat, it regulates current in series with a load (I = E / (Rrheo + Rload)).',
    formulas: [
      { name: 'جهد مخرج مقسم الجهد', formula: 'V_{out} = V_{in} \\cdot \\frac{R_{wiper}}{R_{total}}', descriptionAr: 'يتغير الجهد خطياً مع زاوية دوران المنزلق' },
      { name: 'تيار دائرة الريوستات', formula: 'I = \\frac{E}{R_{rheostat} + R_{load}}', descriptionAr: 'التحكم في التيار المتدفق للحمل' }
    ],
    requiredEquipmentAr: [
      'مصدر جهد DC (10V)',
      'مقاومة متغيرة (Potentiometer 10kΩ)',
      'مصباح إشارة LED أو مقاومة حمل 1kΩ',
      'ملتيميتر رقمي DMM',
      'لوحة تجارب وأسلاك'
    ],
    requiredEquipmentEn: [
      '10V DC Power Supply',
      '10kΩ Rotary Potentiometer',
      'LED indicator / 1kΩ load resistor',
      'Digital Multimeter',
      'Breadboard & wires'
    ],
    schematicSvgOrKey: 'potentiometer-rheostat-schematic',
    procedureStepsAr: [
      'صِل طرفي المقاومة المتغيرة الثابتين (1 و 3) بمصدر الجهد 10V والأرضي.',
      'صِل مسبار الفولتميتر بالطرف الأوسط (المنزلق Wiper).',
      'دوّر المحور من 0% إلى 100% ولاحظ تغير الجهد بسلاسة من 0V إلى 10V.',
      'الآن حوّل التوصيل إلى ريوستات: اترك أحد الطرفين الثابتين مفصولاً، وضع المقاومة المتغيرة على التوالي مع مقاومة حمل 500Ω.',
      'غير موضع المنزلق وقس التيار بالمللي أمبير ولاحظ كيف يتحكم في تدفق التيار.'
    ],
    procedureStepsEn: [
      'Connect outer terminals (1 & 3) of 10k potentiometer to 10V and GND.',
      'Probe center wiper terminal with DMM voltmeter.',
      'Rotate knob from 0% to 100% and observe voltage varying smoothly from 0V to 10V.',
      'Reconfigure as a 2-terminal Rheostat in series with a 500Ω load.',
      'Vary wiper and measure loop current regulating from minimum to maximum.'
    ],
    defaultCircuit: {
      components: [
        { id: 'src1', type: 'dc_source', name: 'E1', value: 10, unit: 'V', x: 80, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'pot1', type: 'potentiometer', name: 'POT1', value: 10000, wiperPercent: 50, unit: 'Ω', x: 230, y: 160, rotation: 0, terminals: [{ id: 't1', x: -30, y: -20, label: 'CW' }, { id: 't2', x: -30, y: 20, label: 'CCW' }, { id: 't3', x: 30, y: 0, label: 'W' }] },
        { id: 'r_load', type: 'resistor', name: 'R_Load', value: 2000, unit: 'Ω', x: 360, y: 160, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 80, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'pot1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'pot1', fromTerminalId: 't3', toComponentId: 'r_load', toTerminalId: 't1', color: '#f59e0b' },
        { id: 'w3', fromComponentId: 'pot1', fromTerminalId: 't2', toComponentId: 'src1', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w4', fromComponentId: 'r_load', fromTerminalId: 't2', toComponentId: 'src1', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w5', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' }
      ]
    },
    expectedMeasurements: [
      { parameter: 'جهد المخرج عند 25%', symbol: 'V_{out,25%}', theoreticalFormula: '10 \\times 0.25', typicalTheoretical: 2.5, unit: 'V' },
      { parameter: 'جهد المخرج عند 50%', symbol: 'V_{out,50%}', theoreticalFormula: '10 \\times 0.50', typicalTheoretical: 5.0, unit: 'V' },
      { parameter: 'جهد المخرج عند 75%', symbol: 'V_{out,75%}', theoreticalFormula: '10 \\times 0.75', typicalTheoretical: 7.5, unit: 'V' }
    ],
    discussionQuestions: [
      {
        id: 'dq-9-1',
        questionAr: 'ما الفرق الرئيسي بين التوصيل كـ Potentiometer والتوصيل كـ Rheostat؟',
        questionEn: 'What is the principal difference between potentiometer and rheostat configurations?',
        modelAnswerAr: 'مقسم الجهد يستخدم 3 أطراف ليعطي جهداً مجزأً قابلاً للتعديل من 0 إلى V_in، بينما الريوستات يستخدم طرفين ليعمل كمقاومة متغيرة على التوالي تتحكم في شدة التيار.',
        modelAnswerEn: 'Potentiometers use 3 terminals to yield an adjustable output voltage, whereas rheostats use 2 terminals in series to regulate current.'
      }
    ],
    preQuiz: [
      {
        id: 'pq-9-1',
        questionAr: 'كم عدداً من الأطراف يتم توصيله فعلياً عند استخدام المقاومة المتغيرة كـ Rheostat؟',
        questionEn: 'How many terminals are electrically connected when using a device as a rheostat?',
        optionsAr: ['طرفان فقط', 'ثلاثة أطراف', 'طرف واحد', 'أربعة أطراف'],
        optionsEn: ['Two terminals only', 'Three terminals', 'One terminal', 'Four terminals'],
        correctIndex: 0,
        explanationAr: 'في الريوستات يتم استخدام طرفين فقط: المنزلق (Wiper) وأحد الطرفين الطرفيين.'
      }
    ],
    postQuiz: [
      {
        id: 'poq-9-1',
        questionAr: 'عند تدوير مقسم الجهد إلى أقصى وضع، ما هي أقصى نسبة للجهد يمكن الحصول عليها؟',
        questionEn: 'At full rotation of a potentiometer, what is the maximum available voltage fraction?',
        optionsAr: ['100% من جهد الدخل', '50%', '200%', '0%'],
        optionsEn: ['100% of input voltage', '50%', '200%', '0%'],
        correctIndex: 0,
        explanationAr: 'عند أقصى دوران يتصل المنزلق مباشرة بالطرف الموجب فيصل المخرج إلى 100% من V_in.'
      }
    ],
    practicalApplicationAr: 'أذرع التحكم (Joysticks) في الروبوتات ومفاتيح التحكم في مستوى الصوت وسرعة محركات DC.',
    commonMistakesAr: ['توصيل مصدر الجهد عبر المنزلق وأحد الأطراف مما قد يسبب قصراً عند تدوير المقبض إلى الصفر.']
  },

  // 10. Superposition Theorem
  {
    id: 'exp-10',
    number: 10,
    titleAr: 'نظرية التراكب',
    titleEn: 'Superposition Theorem',
    subtitleAr: 'تحليل الدوائر الخطية متعددة المصادر عبر تفعيل مصدر واحد في كل مرة وإلغاء المصادر الأخرى',
    objectivesAr: [
      'التحقق التجريبي من نظرية التراكب في الدوائر الخطية متعددة مصادر DC.',
      'تعلم كيفية استبدال مصادر الجهد المستقلة بدائرة قصر (Short Circuit) أثناء تحليل المصادر الأخرى.',
      'إثبات أن الجهد أو التيار الكلي يساوي المجموع الجبري لتأثير كل مصدر على حدة.'
    ],
    objectivesEn: [
      'Experimentally verify Superposition Theorem in multi-source linear DC networks.',
      'Learn proper source deactivation (replacing independent voltage sources with short circuits).',
      'Demonstrate that total voltage and current equal the algebraic sum of individual contributions.'
    ],
    theoryAr: `تنص نظرية التراكب (Superposition Theorem) على أن الاستجابة (التيار أو الجهد) في أي عنصر داخل دائرة خطية تحتوي على عدة مصادر طاقة مستقلة تساوي المجموع الجبري للاستجابات الناتجة عن كل مصدر يعمل منفرداً، مع إلغاء بقية المصادر.
قواعد إلغاء المصادر:
1. مصدر الجهد المستقل: يُلغى باستبداله بدائرة قصر (Short Circuit / سلك 0Ω) بحيث يصبح جهده مساوياً للصفر.
2. مصدر التيار المستقل: يُلغى باستبداله بدائرة مفتوحة (Open Circuit) بحيث يصبح تياره مساوياً للصفر.
تحذير هندسي: نظرية التراكب تنطبق على الجهود والتيارات فقط، ولا تنطبق مباشرة على القدرة (P) لأن القدرة علاقة غير خطية تربيعية (P = I²R).`,
    theoryEn: 'The Superposition Theorem states that in any linear bilateral network containing multiple independent sources, the voltage or current through any element equals the algebraic sum of the individual responses generated by each source acting alone while all other sources are zeroed (voltage sources replaced by short circuits, current sources by open circuits). It does NOT apply directly to power due to its non-linear quadratic nature.',
    formulas: [
      { name: 'الجهد الكلي بالتراكب', formula: 'V_{total} = V_{(E_1 \\text{ alone})} + V_{(E_2 \\text{ alone})}', descriptionAr: 'المجموع الجبري للجهود الناتجة عن كل مصدر' },
      { name: 'التيار الكلي بالتراكب', formula: 'I_{total} = I_{(E_1 \\text{ alone})} + I_{(E_2 \\text{ alone})}', descriptionAr: 'المجموع الجبري للتيارات مع مراعاة الاتجاه' }
    ],
    requiredEquipmentAr: [
      'مصدرا جهد مستمر مستقلان (E1 = 12V, E2 = 6V)',
      'ملتيميتر رقمي DMM',
      'مقاومات: R1 = 1kΩ, R2 = 2.2kΩ, R3 = 1kΩ',
      'لوحة تجارب وأسلاك'
    ],
    requiredEquipmentEn: [
      'Two Independent DC Power Supplies (E1=12V, E2=6V)',
      'Digital Multimeter',
      'Resistors: R1=1kΩ, R2=2.2kΩ, R3=1kΩ',
      'Breadboard & wires'
    ],
    schematicSvgOrKey: 'superposition-schematic',
    procedureStepsAr: [
      'ركّب الدائرة التي تحتوي على مصدرين: E1 (12V) على اليسار، و E2 (6V) على اليمين، والمقاومة المشتركة R2 (2.2kΩ) في المنتصف.',
      'الخطوة 1: شغّل كلا المصدرين معاً، وقس الجهد V_R2 والتيار I_R2 وسجل القيم الحقيقية.',
      'الخطوة 2: ألغِ المصدر E2 (افصله واستبدله بسلك قصر إلى الأرضي)، وقس V_R2(E1).',
      'الخطوة 3: أعد المصدر E2، وألغِ المصدر E1 (استبدله بسلك قصر)، وقس V_R2(E2).',
      'اجمع القيمتين جبرياً: V_R2(calc) = V_R2(E1) + V_R2(E2) وقارنها مع القياس الفعلي بالخطوة 1.'
    ],
    procedureStepsEn: [
      'Assemble dual-source network: E1=12V on left branch, E2=6V on right branch, with R2=2.2kΩ as shared center branch.',
      'Step 1: Power both sources simultaneously; measure total VR2 and IR2.',
      'Step 2: Deactivate E2 (replace with short circuit jumper); measure VR2(E1 alone).',
      'Step 3: Restore E2 and deactivate E1 (replace with short circuit); measure VR2(E2 alone).',
      'Algebraically sum responses: VR2(calc) = VR2(E1) + VR2(E2) and compare against Step 1.'
    ],
    defaultCircuit: {
      components: [
        { id: 'src1', type: 'dc_source', name: 'E1', value: 12, unit: 'V', x: 80, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'r1', type: 'resistor', name: 'R1', value: 1000, unit: 'Ω', x: 190, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r2', type: 'resistor', name: 'R2', value: 2200, unit: 'Ω', x: 290, y: 160, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'r3', type: 'resistor', name: 'R3', value: 1000, unit: 'Ω', x: 390, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'src2', type: 'dc_source', name: 'E2', value: 6, unit: 'V', x: 490, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 80, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'r1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'r1', fromTerminalId: 't2', toComponentId: 'r2', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'r2', fromTerminalId: 't1', toComponentId: 'r3', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w4', fromComponentId: 'r3', fromTerminalId: 't2', toComponentId: 'src2', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w5', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'r2', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w6', fromComponentId: 'r2', fromTerminalId: 't2', toComponentId: 'src2', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w7', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' }
      ]
    },
    expectedMeasurements: [
      { parameter: 'جهد R2 من E1 فقط', symbol: 'V_{R2(E1)}', theoreticalFormula: '12 \\times \\frac{2.2k \\parallel 1k}{1k + (2.2k \\parallel 1k)}', typicalTheoretical: 5.056, unit: 'V' },
      { parameter: 'جهد R2 من E2 فقط', symbol: 'V_{R2(E2)}', theoreticalFormula: '6 \\times \\frac{2.2k \\parallel 1k}{1k + (2.2k \\parallel 1k)}', typicalTheoretical: 2.528, unit: 'V' },
      { parameter: 'الجهد الكلي المقاس عبر R2', symbol: 'V_{R2(total)}', theoreticalFormula: 'V_{R2(E1)} + V_{R2(E2)}', typicalTheoretical: 7.584, unit: 'V' }
    ],
    discussionQuestions: [
      {
        id: 'dq-10-1',
        questionAr: 'لماذا لا يمكن تطبيق نظرية التراكب مباشرة لحساب القدرة الكهربائية P_total = P1 + P2؟',
        questionEn: 'Why can Superposition NOT be applied directly to calculate total power Ptotal = P1 + P2?',
        modelAnswerAr: 'لأن القدرة علاقة تربيعية غير خطية: P = I²R = (I1 + I2)²R = I1²R + I2²R + 2*I1*I2*R. الحد المشترك (2*I1*I2*R) يمنع الجمع المباشر. يجب أولاً جمع التيارات بالتراكب، ثم حساب القدرة: P = I_total² * R.',
        modelAnswerEn: 'Because power is a non-linear quadratic function: P = (I1 + I2)^2 * R. One must first superimpose currents or voltages, then calculate power.'
      }
    ],
    preQuiz: [
      {
        id: 'pq-10-1',
        questionAr: 'عند تطبيق نظرية التراكب، كيف يُلغى مصدر الجهد المستقل؟',
        questionEn: 'When applying Superposition, an independent voltage source is deactivated by replacing it with:',
        optionsAr: ['دائرة قصر (Short Circuit / سلك)', 'دائرة مفتوحة (Open Circuit)', 'مقاومة 1MΩ', 'مكثف'],
        optionsEn: ['A short circuit (0Ω wire)', 'An open circuit', 'A 1MΩ resistor', 'A capacitor'],
        correctIndex: 0,
        explanationAr: 'إلغاء مصدر الجهد يعني جعل جهده صفراً (V=0)، وهو ما يتحقق بدائرة القصر.'
      }
    ],
    postQuiz: [
      {
        id: 'poq-10-1',
        questionAr: 'أنتج المصدر الأول تياراً 3mA من اليمين لليسار، وأنتج المصدر الثاني تياراً 5mA من اليسار لليمين. ما التيار الكلي واتجاهه؟',
        questionEn: 'Source 1 generates 3mA right-to-left, source 2 generates 5mA left-to-right. Net current is:',
        optionsAr: ['2mA من اليسار لليمين', '8mA من اليسار لليمين', '2mA من اليمين لليسار', '15mA'],
        optionsEn: ['2mA left-to-right', '8mA left-to-right', '2mA right-to-left', '15mA'],
        correctIndex: 0,
        explanationAr: 'نطرح التيارات المتعاكسة: 5mA - 3mA = 2mA باتجاه التيار الأكبر (من اليسار لليمين).'
      }
    ],
    practicalApplicationAr: 'تحليل الدوائر الإلكترونية التي تحتوي على إشارات AC متراكبة فوق انحياز مستمر (DC Bias).',
    commonMistakesAr: ['ترك مصدر الجهد مفتوحاً بدلاً من استبداله بسلك قصر عند إلغائه.']
  },

  // 11. Thévenin’s Theorem
  {
    id: 'exp-11',
    number: 11,
    titleAr: 'نظرية ثيفينن',
    titleEn: 'Thévenin’s Theorem',
    subtitleAr: 'استبدال أي شبكة خطية معقدة بمصدر جهد واحد V_th ومقاومة واحدة على التوالي R_th',
    objectivesAr: [
      'تحديد جهد ثيفينن المفتوح V_th عملياً ونظرياً.',
      'تحديد مقاومة ثيفينن المكافئة R_th باستخدام طريقتين مختلفتين.',
      'بناء دائرة ثيفينن المكافئة وإثبات أنها تسلك نفس سلوك الدائرة الأصلية مع أي حمل R_L.'
    ],
    objectivesEn: [
      'Determine open-circuit Thévenin voltage Vth analytically and experimentally.',
      'Determine Thévenin equivalent resistance Rth using multiple techniques.',
      'Construct equivalent circuit and prove identical load terminal behavior for any RL.'
    ],
    theoryAr: `تنص نظرية ثيفينن (صاغها المهندس الفرنسي ليون شارل ثيفينن عام 1883) على أنه يمكن استبدال أي شبكة خطية ثنائية الأطراف بدائرة مكافئة بسيطة جداً تتكون من:
1. مصدر جهد ثيفينن (V_th): وهو فرق الجهد المقاس بين الطرفين في وضع الدائرة المفتوحة (Open Circuit Voltage).
2. مقاومة ثيفينن (R_th): وهي المقاومة المقاسة بين الطرفين بعد إلغاء جميع المصادر المستقلة داخل الشبكة.
عند توصيل أي مقاومة حمل R_L بأطراف دائرة ثيفينن، يكون جهد الحمل وتياره متطابقين تماماً مع الدائرة المعقدة الأصلية: V_L = V_th * (R_L / (R_th + R_L)).`,
    theoryEn: 'Thévenin’s Theorem states that any linear two-terminal circuit can be replaced by an equivalent circuit consisting of a single voltage source Vth in series with a resistor Rth. Vth equals the open-circuit terminal voltage Voc, and Rth equals the input impedance with all independent sources replaced by their internal impedances.',
    formulas: [
      { name: 'جهد ثيفينن المكافئ', formula: 'V_{th} = V_{oc} = E \\cdot \\frac{R_2}{R_1 + R_2}', descriptionAr: 'جهد الدائرة المفتوحة بين طرفي الحمل' },
      { name: 'مقاومة ثيفينن المكافئة', formula: 'R_{th} = R_3 + (R_1 \\parallel R_2)', descriptionAr: 'المقاومة المنظورة من طرفي الحمل بعد إلغاء المصادر' },
      { name: 'جهد الحمل النهائي', formula: 'V_L = V_{th} \\cdot \\frac{R_L}{R_{th} + R_L}', descriptionAr: 'حساب استجابة أي حمل بسهولة' }
    ],
    requiredEquipmentAr: [
      'مصدر جهد مستمر (12V)',
      'ملتيميتر رقمي DMM',
      'مقاومات: R1 = 1kΩ, R2 = 2.2kΩ, R3 = 470Ω',
      'مقاومات حمل مختلفة: R_L = 470Ω, 1kΩ, 2.2kΩ',
      'لوحة تجارب وأسلاك'
    ],
    requiredEquipmentEn: [
      'DC Power Supply (12V)',
      'Digital Multimeter',
      'Resistors: R1=1kΩ, R2=2.2kΩ, R3=470Ω',
      'Assorted Load Resistors: RL = 470Ω, 1kΩ, 2.2kΩ',
      'Breadboard & wires'
    ],
    schematicSvgOrKey: 'thevenin-theorem-schematic',
    procedureStepsAr: [
      'ركّب الدائرة الأصلية: مصدر 12V مع مقسم جهد R1 (1kΩ) و R2 (2.2kΩ)، ثم مقاومة R3 (470Ω) متصلة بطرف الخرج A.',
      'افصل مقاومة الحمل R_L واقس جهد الأطراف المفتوحة V_oc وهو V_th.',
      'احسب نظرياً: V_th = 12 * (2.2k / 3.2k) = 8.25 V.',
      'افصل مصدر الطاقة واستبدله بسلك قصر، ثم اقس المقاومة بين الطرفين A و B بالأوميتر لتحصل على R_th.',
      'وصّل حملاً R_L = 1kΩ بالدائرة الأصلية واقس جهد الحمل V_L.',
      'ابنِ دائرة ثيفينن المكافئة (مصدر V_th ومقاومة R_th وحمل R_L) وتأكد أن قراءة V_L متطابقة تماماً.'
    ],
    procedureStepsEn: [
      'Construct prototype circuit: 12V source with R1=1k, R2=2.2k divider, and R3=470Ω leading to output terminal A.',
      'Disconnect load RL and measure open-circuit voltage Voc (this is Vth).',
      'Verify theoretical Vth = 12 * (2.2 / 3.2) = 8.25V.',
      'Deactivate power source and measure impedance between output terminals with ohmmeter to find Rth.',
      'Connect RL = 1kΩ and measure loaded terminal voltage VL.',
      'Build physical Thévenin equivalent (Vth + Rth in series with RL) and confirm identical VL.'
    ],
    defaultCircuit: {
      components: [
        { id: 'src1', type: 'dc_source', name: 'E1', value: 12, unit: 'V', x: 80, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'r1', type: 'resistor', name: 'R1', value: 1000, unit: 'Ω', x: 190, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r2', type: 'resistor', name: 'R2', value: 2200, unit: 'Ω', x: 260, y: 160, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'r3', type: 'resistor', name: 'R3', value: 470, unit: 'Ω', x: 340, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r_load', type: 'resistor', name: 'R_Load', value: 1000, unit: 'Ω', x: 440, y: 160, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 80, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'r1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'r1', fromTerminalId: 't2', toComponentId: 'r2', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'r1', fromTerminalId: 't2', toComponentId: 'r3', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w4', fromComponentId: 'r3', fromTerminalId: 't2', toComponentId: 'r_load', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w5', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'r2', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w6', fromComponentId: 'r2', fromTerminalId: 't2', toComponentId: 'r_load', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w7', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' }
      ]
    },
    expectedMeasurements: [
      { parameter: 'جهد ثيفينن النظري', symbol: 'V_{th}', theoreticalFormula: '12 \\times (2200 / 3200)', typicalTheoretical: 8.25, unit: 'V' },
      { parameter: 'مقاومة ثيفينن النظرية', symbol: 'R_{th}', theoreticalFormula: '470 + (1000 \\parallel 2200)', typicalTheoretical: 1157.5, unit: 'Ω' },
      { parameter: 'جهد الحمل (RL = 1kΩ)', symbol: 'V_{L}', theoreticalFormula: '8.25 \\times \\frac{1000}{1157.5 + 1000}', typicalTheoretical: 3.824, unit: 'V' }
    ],
    discussionQuestions: [
      {
        id: 'dq-11-1',
        questionAr: 'ما الفائدة العملية الكبرى لنظرية ثيفينن في هندسة الدوائر؟',
        questionEn: 'What is the principal engineering advantage of Thévenin’s Theorem?',
        modelAnswerAr: 'تسمح بتحليل أداء أي حمل متغير (مثل محرك أو مكبر صوت) في خطوة حسابية واحدة دون الحاجة إلى إعادة حل الدائرة الكهربائية المعقدة بأكملها في كل مرة يتغير فيها الحمل.',
        modelAnswerEn: 'It allows rapid analysis of varying loads without having to re-solve the complex entire network repeatedly.'
      }
    ],
    preQuiz: [
      {
        id: 'pq-11-1',
        questionAr: 'جهد ثيفينن V_th هو دائماً مساوٍ لـ:',
        questionEn: 'Thévenin voltage Vth is always equal to:',
        optionsAr: ['جهد الدائرة المفتوحة بين الطرفين (Voc)', 'جهد الدائرة القصيرة', 'جهد المصدر الأصلي دائماً', 'صفر فولت'],
        optionsEn: ['Open-circuit voltage (Voc)', 'Short-circuit voltage', 'Original source voltage always', 'Zero volts'],
        correctIndex: 0,
        explanationAr: 'جهد ثيفينن هو الجهد بين طرفي الخرج عندما يكون الحمل مفصولاً تماماً (الدائرة المفتوحة).'
      }
    ],
    postQuiz: [
      {
        id: 'poq-11-1',
        questionAr: 'إذا كانت دائرة مكافئ ثيفينن لها V_th = 10V و R_th = 500Ω، كم سيكون تيار قصر الخرج (I_sc)؟',
        questionEn: 'If a Thévenin circuit has Vth=10V and Rth=500Ω, what is the short-circuit current Isc?',
        optionsAr: ['20 mA', '5 A', '50 mA', '2 mA'],
        optionsEn: ['20 mA', '5 A', '50 mA', '2 mA'],
        correctIndex: 0,
        explanationAr: 'تيار القصر I_sc = V_th / R_th = 10 / 500 = 0.02 A = 20 mA (وهو تيار مكافئ نورتون).'
      }
    ],
    practicalApplicationAr: 'نمذجة شبكات الطاقة والبطاريات ومكبرات العمليات لدراسة استجابة الأحمال المختلفة.',
    commonMistakesAr: ['نسيان فصل مقاومة الحمل R_L قبل قياس جهد الدائرة المفتوحة V_oc.']
  },

  // 12. Maximum Power Transfer
  {
    id: 'exp-12',
    number: 12,
    titleAr: 'نظرية نقل القدرة العظمى',
    titleEn: 'Maximum Power Transfer Theorem',
    subtitleAr: 'إثبات أن أقصى قدرة تنتقل إلى الحمل عندما تتطابق مقاومته مع مقاومة ثيفينن للمصدر R_L = R_th',
    objectivesAr: [
      'التحقق التجريبي من شرط نقل أقصى قدرة: R_load = R_th.',
      'رسم منحنى القدرة المستهلكة في الحمل مقابل مقاومة الحمل (P_L vs R_L).',
      'فهم كفاءة نقل الطاقة عند نقطة القدرة العظمى (50%) ومقارنتها مع كفاءة منظومة القدرة.'
    ],
    objectivesEn: [
      'Experimentally verify Maximum Power Transfer condition: RL = Rth.',
      'Plot power vs. load resistance curve (PL vs. RL) and locate peak power point.',
      'Understand the 50% efficiency trade-off at maximum power transfer.'
    ],
    theoryAr: `تنص نظرية نقل القدرة العظمى (Maximum Power Transfer Theorem) على أن الحمل المقاومي R_L يسحب أقصى قدرة كهربائية ممكنة من شبكة خطية عندما تكون مقاومة الحمل مساوية تماماً للمقاومة الداخلية المكافئة للدائرة (مقاومة ثيفينن): R_L = R_th.
القدرة المستهلكة في الحمل تُعطى بالعلاقة: P_L = I_L² * R_L = [V_th / (R_th + R_L)]² * R_L.
باشتقاق هذه المعادلة بالنسبة لـ R_L ومساواتها بالصفر، نجد أن الذروة تحدث بدقة عند R_L = R_th، وتكون القدرة العظمى: P_max = V_th² / (4 * R_th).
ملاحظة هامة: عند نقل أقصى قدرة، تكون كفاءة النقل η = 50% فقط، لأن نصف القدرة الكلية يضيع كحرارة داخل مقاومة المصدر R_th. لذلك تطبق هذه النظرية في دوائر الاتصالات ونقل الإشارات، بينما تسعى شبكات القوى الكهربائية لتصغير R_s للحصول على كفاءة تقارب 100%.`,
    theoryEn: 'The Maximum Power Transfer Theorem asserts that a resistive load RL receives maximum power from a linear network when its resistance precisely matches the Thévenin source resistance: RL = Rth. At this optimal point, Pmax = Vth^2 / (4*Rth). System efficiency at maximum power transfer is exactly 50%. This principle governs RF communications and audio matching rather than utility power distribution.',
    formulas: [
      { name: 'شرط القدرة العظمى', formula: 'R_L = R_{th}', descriptionAr: 'تساوي مقاومة الحمل مع مقاومة ثيفينن' },
      { name: 'قيمة القدرة العظمى المنقولة', formula: 'P_{max} = \\frac{V_{th}^2}{4 \\cdot R_{th}}', descriptionAr: 'أقصى قدرة يمكن استخلاصها في الحمل' },
      { name: 'كفاءة نقل القدرة', formula: '\\eta = \\frac{P_L}{P_{total}} \\times 100\\% = \\frac{R_L}{R_{th} + R_L} \\times 100\\%', descriptionAr: 'الكفاءة تكون 50% فقط عند نقطة Pmax' }
    ],
    requiredEquipmentAr: [
      'مصدر جهد DC (10V)',
      'مقاومة ثيفينن محاكية (R_th = 1kΩ)',
      'صندوق مقاومات عقدية أو مقاومات مختلفة: 100Ω, 470Ω, 820Ω, 1kΩ, 1.5kΩ, 2.2kΩ, 4.7kΩ, 10kΩ',
      'ملتيميتر رقمي لقياس الجهد والتيار بدقة',
      'لوحة تجارب وأسلاك'
    ],
    requiredEquipmentEn: [
      '10V DC Power Supply',
      'Simulated Thévenin resistor (Rth = 1kΩ)',
      'Decade resistance box or discrete resistors: 100Ω to 10kΩ',
      'Digital Multimeter',
      'Breadboard & wires'
    ],
    schematicSvgOrKey: 'max-power-transfer-schematic',
    procedureStepsAr: [
      'أنشئ دائرة مكافئ ثيفينن: مصدر 10V متصل على التوالي مع R_th = 1kΩ.',
      'صِل قيماً مختلفة لمقاومة الحمل R_L (من 100Ω حتى 10kΩ).',
      'في كل خطوة، اقس جهد الحمل V_L والتيار I_L بدقة.',
      'احسب القدرة في كل حالة: P_L = V_L * I_L وسجلها في جدول النتائج.',
      'ارسم المنحنى البياني P_L مقابل R_L، ولاحظ القمة البارزة عند R_L = 1000Ω (1kΩ).',
      'احسب كفاءة النقل عند R_L = 1kΩ وتأكد أنها 50%.'
    ],
    procedureStepsEn: [
      'Build Thévenin model: 10V DC source in series with fixed Rth = 1kΩ.',
      'Substitute various load resistances RL ranging from 100Ω to 10kΩ.',
      'Measure load voltage VL and current IL for each RL value.',
      'Compute power PL = VL * IL and plot PL versus RL.',
      'Observe distinct peak precisely when RL = 1000Ω (1kΩ).',
      'Verify efficiency is exactly 50% at peak.'
    ],
    defaultCircuit: {
      components: [
        { id: 'src1', type: 'dc_source', name: 'E_th', value: 10, unit: 'V', x: 80, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'r_th', type: 'resistor', name: 'R_th', value: 1000, unit: 'Ω', x: 220, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r_load', type: 'resistor', name: 'R_Load', value: 1000, unit: 'Ω', x: 340, y: 160, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 80, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'r_th', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'r_th', fromTerminalId: 't2', toComponentId: 'r_load', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'r_load', fromTerminalId: 't2', toComponentId: 'src1', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w4', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' }
      ]
    },
    expectedMeasurements: [
      { parameter: 'القدرة عند RL = 200Ω', symbol: 'P_{200\\Omega}', theoreticalFormula: '(10/(1k+200))^2 \\times 200', typicalTheoretical: 13.88, unit: 'mW' },
      { parameter: 'القدرة عند RL = 1000Ω (الذروة)', symbol: 'P_{max}', theoreticalFormula: '\\frac{10^2}{4 \\times 1000}', typicalTheoretical: 25.0, unit: 'mW' },
      { parameter: 'القدرة عند RL = 5000Ω', symbol: 'P_{5k\\Omega}', theoreticalFormula: '(10/(1k+5k))^2 \\times 5000', typicalTheoretical: 13.88, unit: 'mW' }
    ],
    discussionQuestions: [
      {
        id: 'dq-12-1',
        questionAr: 'لماذا لا تصمم شركات الكهرباء الوطنية شبكات التوزيع لنقل أقصى قدرة؟',
        questionEn: 'Why do utility electric power grids NOT design for maximum power transfer?',
        modelAnswerAr: 'لأن نقل أقصى قدرة يعني كفاءة 50% فقط، وبالتالي سيضيع نصف الطاقة المولدة في صورة حرارة خطيرة داخل محطات التوليد وخطوط النقل. شبكات القوى تصمم لتكون مقاومة المصدر صغيرة جداً لتحقيق كفاءة تقارب 98%.',
        modelAnswerEn: 'Because efficiency is limited to 50%, wasting half of all generated energy as heat. Grids minimize internal resistance to maximize efficiency (~98%).'
      }
    ],
    preQuiz: [
      {
        id: 'pq-12-1',
        questionAr: 'إذا كانت مقاومة المصدر الداخلية R_th = 50Ω، فما قيمة مقاومة الحمل R_L المطلوبة لسحب أقصى قدرة؟',
        questionEn: 'If source internal resistance Rth = 50Ω, what load RL draws maximum power?',
        optionsAr: ['50 Ω', '25 Ω', '100 Ω', '0 Ω'],
        optionsEn: ['50 Ω', '25 Ω', '100 Ω', '0 Ω'],
        correctIndex: 0,
        explanationAr: 'تتحقق أقصى قدرة بدقة عندما R_L = R_th = 50Ω.'
      }
    ],
    postQuiz: [
      {
        id: 'poq-12-1',
        questionAr: 'ما هي كفاءة النقل الكهربائية عندما تكون R_L = R_th؟',
        questionEn: 'What is the electrical transmission efficiency when RL = Rth?',
        optionsAr: ['50%', '100%', '75%', '25%'],
        optionsEn: ['50%', '100%', '75%', '25%'],
        correctIndex: 0,
        explanationAr: 'الجهد ينقسم بالتساوي بين R_th و R_L، فتستهلك المقاومتان نفس القدرة، وتكون الكفاءة 50%.'
      }
    ],
    practicalApplicationAr: 'مواءمة المقاومة (Impedance Matching) بين مضخمات الصوت ومكبرات الصوت (8Ω)، وهوائيات اللاسلكي (50Ω).',
    commonMistakesAr: ['الخلط بين مفهوم أقصى قدرة (Maximum Power) ومفهوم أقصى كفاءة (Maximum Efficiency).']
  },

  // 13. Nodal Analysis
  {
    id: 'exp-13',
    number: 13,
    titleAr: 'التحليل بالعقد',
    titleEn: 'Nodal Analysis',
    subtitleAr: 'حل شبكات الدوائر عبر تحديد جهود العقد المجهولة باستخدام قانون كيرشوف للتيار KCL ومصفوفات الموصلية',
    objectivesAr: [
      'فهم واختيار العقدة المرجعية (Reference/Ground Node).',
      'كتابة معادلات KCL لكل عقدة غير مرجعية باستخدام الموصلات G = 1/R.',
      'حل نظام المعادلات خطياً وقياس جهود العقد الفعلية لمقارنتها بالنتائج النظرية.'
    ],
    objectivesEn: [
      'Identify essential nodes and establish ground reference.',
      'Formulate nodal KCL equations using branch conductances (G = 1/R).',
      'Solve linear nodal system and verify node voltages against physical measurements.'
    ],
    theoryAr: `التحليل بالعقد (Nodal Analysis) طريقة منهجية قوية تعتمد على قانون كيرشوف للتيار (KCL) لحساب جهود جميع العقد الأساسية في الدائرة.
خطوات الطريقة:
1. تحديد جميع العقد واختيار إحداها كمرجع (Reference / Ground = 0V).
2. تعيين أسماء لجهود العقد المتبقية: V1, V2, ... Vn.
3. كتابة معادلة KCL عند كل عقدة: مجموع التيارات الخارجة = مجموع التيارات الداخلة.
التيار الخارج من عقدة a إلى b يساوي: I_ab = (Va - Vb) / R_ab.
تُجمع المعادلات في مصفوفة: [G] * [V] = [I]، وتُحل للحصول على جهود العقد. بمجرد معرفة جهود العقد، يمكن حساب أي جهد أو تيار في الدائرة فوراً.`,
    theoryEn: 'Nodal Analysis is a matrix-based method based on KCL. An essential reference node (0V ground) is established. KCL equations are formulated at all non-reference nodes equating sum of outgoing currents to zero, with branch currents written as I = (Va - Vb) / R. The resulting [G][V] = [I] linear system directly resolves all node potentials.',
    formulas: [
      { name: 'معادلة التيار بين عقدتين', formula: 'I_{12} = \\frac{V_1 - V_2}{R_{12}}', descriptionAr: 'التيار من العقدة 1 إلى العقدة 2' },
      { name: 'معادلة KCL عند العقدة 1', formula: '\\frac{V_1 - E_1}{R_1} + \\frac{V_1}{R_2} + \\frac{V_1 - V_2}{R_3} = 0', descriptionAr: 'مجموع التيارات الخارجة من العقدة 1' }
    ],
    requiredEquipmentAr: [
      'مصدرا جهد مستمر (E1 = 15V, E2 = 10V)',
      'ملتيميتر رقمي DMM لقياس جهود العقد',
      'مقاومات: R1 = 1kΩ, R2 = 2.2kΩ, R3 = 3.3kΩ, R4 = 1.5kΩ',
      'لوحة تجارب وأسلاك'
    ],
    requiredEquipmentEn: [
      'Two DC Power Supplies (E1=15V, E2=10V)',
      'Digital Multimeter',
      'Resistors: R1=1kΩ, R2=2.2kΩ, R3=3.3kΩ, R4=1.5kΩ',
      'Breadboard & wires'
    ],
    schematicSvgOrKey: 'nodal-analysis-schematic',
    procedureStepsAr: [
      'ركّب دائرة بعقدتين رئيسيتين: العقدة A والعقدة B متصلتين عبر المقاومة R3 (3.3kΩ).',
      'صِل الطرف السالب لكلا المصدرين بالعقدة المرجعية المشتركة (الأرضي GND = 0V).',
      'اكتب معادلتي KCL للعقدتين A و B وحلهما رياضياً لإيجاد V_A و V_B نظرياً.',
      'شغّل الدائرة وضع المسبار الأسود للملتيميتر على الأرضي (GND).',
      'المس بالمسبار الأحمر العقدة A وسجل V_A، ثم العقدة B وسجل V_B.',
      'احسب نسبة الخطأ بين القيم النظرية والمقاسة.'
    ],
    procedureStepsEn: [
      'Construct a two-node network with essential nodes A and B coupled by R3=3.3kΩ.',
      'Tie common negative rails to ground reference (0V).',
      'Formulate theoretical nodal equations and solve for VA and VB.',
      'Anchor DMM black probe to GND, measure node voltages VA and VB with red probe.',
      'Compute error percentages and confirm KCL compliance.'
    ],
    defaultCircuit: {
      components: [
        { id: 'src1', type: 'dc_source', name: 'E1', value: 15, unit: 'V', x: 80, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'r1', type: 'resistor', name: 'R1', value: 1000, unit: 'Ω', x: 190, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r2', type: 'resistor', name: 'R2', value: 2200, unit: 'Ω', x: 260, y: 160, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'r3', type: 'resistor', name: 'R3', value: 3300, unit: 'Ω', x: 350, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r4', type: 'resistor', name: 'R4', value: 1500, unit: 'Ω', x: 440, y: 160, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'src2', type: 'dc_source', name: 'E2', value: 10, unit: 'V', x: 530, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 80, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'r1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'r1', fromTerminalId: 't2', toComponentId: 'r2', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'r2', fromTerminalId: 't1', toComponentId: 'r3', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w4', fromComponentId: 'r3', fromTerminalId: 't2', toComponentId: 'r4', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w5', fromComponentId: 'r4', fromTerminalId: 't1', toComponentId: 'src2', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w6', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'r2', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w7', fromComponentId: 'r2', fromTerminalId: 't2', toComponentId: 'r4', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w8', fromComponentId: 'r4', fromTerminalId: 't2', toComponentId: 'src2', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w9', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' }
      ]
    },
    expectedMeasurements: [
      { parameter: 'جهد العقدة A النظري', symbol: 'V_A', theoreticalFormula: 'حل نظام KCL للعقدة A', typicalTheoretical: 9.324, unit: 'V' },
      { parameter: 'جهد العقدة B النظري', symbol: 'V_B', theoreticalFormula: 'حل نظام KCL للعقدة B', typicalTheoretical: 7.915, unit: 'V' },
      { parameter: 'تيار المقاومة الرابطة R3', symbol: 'I_{R3}', theoreticalFormula: '(V_A - V_B) / 3300', typicalTheoretical: 0.427, unit: 'mA' }
    ],
    discussionQuestions: [
      {
        id: 'dq-13-1',
        questionAr: 'ما هي العقدة الفائقة (Supernode) ومتى نلجأ إليها في التحليل بالعقد؟',
        questionEn: 'What is a Supernode and when is it employed in Nodal Analysis?',
        modelAnswerAr: 'تتكون العقدة الفائقة عندما يوجد مصدر جهد مستقل أو معتمد متصل مباشرة بين عقدتين غير مرجعيتين دون وجود مقاومة على التوالي مع المصدر. نقوم بدمج العقدتين في عقدة واحدة كبيرة لكتابة معادلة KCL، واستخدام معادلة الجهد (V1 - V2 = E) كمعادلة مساعدة.',
        modelAnswerEn: 'A supernode is formed when a voltage source is connected directly between two non-reference nodes. The two nodes are enclosed in a single generalized boundary to formulate KCL.'
      }
    ],
    preQuiz: [
      {
        id: 'pq-13-1',
        questionAr: 'إذا كانت دائرة تحتوي على 5 عقد أساسية، فكم عدد معادلات KCL المستقلة المطلوبة لحلها؟',
        questionEn: 'In a circuit with 5 essential nodes, how many independent KCL equations are required?',
        optionsAr: ['4 معادلات (N - 1)', '5 معادلات', '6 معادلات', '3 معادلات'],
        optionsEn: ['4 equations (N - 1)', '5 equations', '6 equations', '3 equations'],
        correctIndex: 0,
        explanationAr: 'عدد المعادلات المستقلة يساوي دائماً N - 1 حيث يتم حجز عقدة واحدة كمرجع (GND).'
      }
    ],
    postQuiz: [
      {
        id: 'poq-13-1',
        questionAr: 'في التحليل بالعقد، يعتمد حل المعادلات بشكل أساسي على أي قانون؟',
        questionEn: 'Nodal analysis equations are formulated primarily using:',
        optionsAr: ['قانون كيرشوف للتيار (KCL)', 'قانون كيرشوف للجهد (KVL)', 'قانون فاراداي', 'قانون لينز'],
        optionsEn: ['Kirchhoff’s Current Law (KCL)', 'Kirchhoff’s Voltage Law (KVL)', 'Faraday’s Law', 'Lenz’s Law'],
        correctIndex: 0,
        explanationAr: 'التحليل بالعقد يعتمد كلياً على تطبيق KCL عند العقد لحساب التيارات بدلالة فروق الجهد.'
      }
    ],
    practicalApplicationAr: 'الخوارزمية الأساسية المستخدمة في محركات محاكاة الدوائر العالمية (SPICE).',
    commonMistakesAr: ['نسيان طرح جهد العقدة المجاورة عند حساب تيار المقاومة المشتركة.']
  },

  // 14. Mesh Analysis
  {
    id: 'exp-14',
    number: 14,
    titleAr: 'التحليل بالمسارات',
    titleEn: 'Mesh Analysis',
    subtitleAr: 'حل الشبكات المستوية وتحديد تيارات الحلقات المغلقة (Mesh Currents) باستخدام قانون كيرشوف للجهد KVL',
    objectivesAr: [
      'فهم مفهوم تيار المسار (Mesh Current) والفرق بينه وبين تيار الفرع الحقيقي.',
      'كتابة معادلات KVL لكل مسار مغلق باستخدام مصفوفة المقاومات [R].',
      'حل تيارات المسارات واستنتاج تيار وجهد كل عنصر في الدائرة.'
    ],
    objectivesEn: [
      'Distinguish fictitious loop/mesh currents from physical branch currents.',
      'Formulate loop KVL equations using resistance matrix [R].',
      'Solve mesh currents and determine actual branch currents and voltages.'
    ],
    theoryAr: `التحليل بالمسارات (Mesh Analysis) طريقة نظامية لحل الدوائر المستوية (Planar Circuits) باستخدام قانون كيرشوف للجهد (KVL).
المسار (Mesh) هو حلقة مغلقة لا تحتوي على أي حلقات داخلية أخرى.
خطوات الطريقة:
1. تحديد المسارات المستقلة وتعيين تيار حلقي فرضي لكل مسار في اتجاه عقارب الساعة: I1, I2, ... Im.
2. كتابة معادلة KVL لكل مسار: مجموع مصادر الجهد في المسار = هبوط الجهد عبر المقاومات.
3. المقاومة المشتركة بين مسارين يمر بها تياران متعاكسان، فيكون هبوط جهدها: V_shared = R * (I1 - I2).
تُرتب المعادلات في مصفوفة: [R] * [I_mesh] = [V_source]، وتُحل بسهولة باستخدام طريقة كرامر أو الحذف الغاوسي.`,
    theoryEn: 'Mesh Analysis applies KVL to planar circuits. Each non-overlapping window loop is assigned a circulating mesh current (I1, I2). Shared branch elements carry the difference of adjacent mesh currents: Ibranch = I1 - I2. The resulting matrix system [R][I] = [V] solves directly for all mesh variables.',
    formulas: [
      { name: 'معادلة KVL للمسار 1', formula: '(R_1 + R_2) I_1 - R_2 I_2 = E_1', descriptionAr: 'معادلة الحلقة الأولى' },
      { name: 'معادلة KVL للمسار 2', formula: '-R_2 I_1 + (R_2 + R_3) I_2 = -E_2', descriptionAr: 'معادلة الحلقة الثانية' },
      { name: 'تيار الفرع المشترك', formula: 'I_{branch} = I_1 - I_2', descriptionAr: 'محصلة تيار الفرع المشترك بين حلقتين' }
    ],
    requiredEquipmentAr: [
      'مصدرا جهد مستمر (E1 = 12V, E2 = 8V)',
      'ملتيميتر رقمي DMM لقياس التيارات والجهود',
      'مقاومات: R1 = 1kΩ, R2 = 2.2kΩ, R3 = 1.5kΩ',
      'لوحة تجارب وأسلاك'
    ],
    requiredEquipmentEn: [
      'Two DC Power Supplies (E1=12V, E2=8V)',
      'Digital Multimeter',
      'Resistors: R1=1kΩ, R2=2.2kΩ, R3=1.5kΩ',
      'Breadboard & wires'
    ],
    schematicSvgOrKey: 'mesh-analysis-schematic',
    procedureStepsAr: [
      'ركّب دائرة بحلقتين مغلقتين: الحلقة 1 تضم E1 (12V) و R1 (1kΩ)، والحلقة 2 تضم E2 (8V) و R3 (1.5kΩ)، والمقاومة المشتركة R2 (2.2kΩ) بينهما.',
      'اكتب معادلتي KVL للمسارين وحلهما لإيجاد I1 و I2 نظرياً.',
      'افتح المسار الأول وصِل الأميتر على التوالي لقياس تيار المسار الأول I1.',
      'افتح المسار الثاني وقس تيار المسار الثاني I2.',
      'قس تيار المقاومة المشتركة R2 وتحقق هل يساوي فعلاً فرق التيارين: I_R2 = |I1 - I2|.'
    ],
    procedureStepsEn: [
      'Assemble dual-loop planar network: Loop 1 with E1=12V & R1=1k, Loop 2 with E2=8V & R3=1.5k, sharing central R2=2.2k.',
      'Formulate matrix equations and compute theoretical I1 and I2.',
      'Break loop 1 and insert ammeter to measure I1.',
      'Break loop 2 and insert ammeter to measure I2.',
      'Measure physical current through common resistor R2 and verify I_R2 = |I1 - I2|.'
    ],
    defaultCircuit: {
      components: [
        { id: 'src1', type: 'dc_source', name: 'E1', value: 12, unit: 'V', x: 80, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'r1', type: 'resistor', name: 'R1', value: 1000, unit: 'Ω', x: 190, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r2', type: 'resistor', name: 'R2', value: 2200, unit: 'Ω', x: 280, y: 160, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30 }, { id: 't2', x: 0, y: 30 }] },
        { id: 'r3', type: 'resistor', name: 'R3', value: 1500, unit: 'Ω', x: 370, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'src2', type: 'dc_source', name: 'E2', value: 8, unit: 'V', x: 460, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 80, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'r1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'r1', fromTerminalId: 't2', toComponentId: 'r2', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'r2', fromTerminalId: 't1', toComponentId: 'r3', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w4', fromComponentId: 'r3', fromTerminalId: 't2', toComponentId: 'src2', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w5', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'r2', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w6', fromComponentId: 'r2', fromTerminalId: 't2', toComponentId: 'src2', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w7', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' }
      ]
    },
    expectedMeasurements: [
      { parameter: 'تيار المسار الأول النظري', symbol: 'I_1', theoreticalFormula: 'حل مصفوفة KVL للمسار 1', typicalTheoretical: 4.887, unit: 'mA' },
      { parameter: 'تيار المسار الثاني النظري', symbol: 'I_2', theoreticalFormula: 'حل مصفوفة KVL للمسار 2', typicalTheoretical: 0.744, unit: 'mA' },
      { parameter: 'تيار المقاومة المشتركة R2', symbol: 'I_{R2}', theoreticalFormula: 'I_1 - I_2', typicalTheoretical: 4.143, unit: 'mA' }
    ],
    discussionQuestions: [
      {
        id: 'dq-14-1',
        questionAr: 'ما هو المسار الفائق (Supermesh) ومتى نلجأ إليه؟',
        questionEn: 'What is a Supermesh and when is it required?',
        modelAnswerAr: 'يحدث المسار الفائق عندما يوجد مصدر تيار (مستقل أو معتمد) مشترك بين حلقتين. نظراً لأن جهد مصدر التيار غير معروف مسبقاً، نتجاهل مصدر التيار وننشئ مساراً كبيراً يحيط بالحلقتين لكتابة معادلة KVL واحدة، ونستخدم معادلة مصدر التيار (I1 - I2 = I_source) كمعادلة مساعدة.',
        modelAnswerEn: 'A supermesh is created when a current source is shared between two meshes. The branch with the current source is removed to form a larger composite loop for KVL.'
      }
    ],
    preQuiz: [
      {
        id: 'pq-14-1',
        questionAr: 'هل يمكن تطبيق التحليل بالمسارات (Mesh Analysis) على الدوائر غير المستوية (Non-Planar Circuits) التي تتقاطع أسلاكها ثلاثياً؟',
        questionEn: 'Can Mesh Analysis be applied to non-planar circuits with 3D overlapping branches?',
        optionsAr: ['لا، تنطبق فقط على الدوائر المستوية (Planar)', 'نعم، تنطبق على جميع الدوائر دون استثناء', 'فقط في دوائر التيار المتردد', 'نعم إذا كانت المقاومات متساوية'],
        optionsEn: ['No, restricted to planar circuits', 'Yes, universal to all circuits', 'Only in AC circuits', 'Yes if resistors are equal'],
        correctIndex: 0,
        explanationAr: 'التحليل بالمسارات يشترط أن تكون الدائرة مستوية (يمكن رسمها على سطح مستوٍ دون تقاطع أسلاك). للدوائر غير المستوية نلجأ للتحليل بالعقد.'
      }
    ],
    postQuiz: [
      {
        id: 'poq-14-1',
        questionAr: 'في مصفوفة المقاومات [R] للتحليل بالمسارات، ماذا تمثل عناصر القطر الرئيسي R_ii دائماً؟',
        questionEn: 'In the mesh resistance matrix [R], what do main diagonal elements Rii represent?',
        optionsAr: ['مجموع جميع المقاومات الموجودة في المسار i (تكون دائماً موجبة)', 'حاصل ضرب المقاومات', 'المقاومات المشتركة فقط (سالبة)', 'صفر دائماً'],
        optionsEn: ['Sum of all resistors in mesh i (always positive)', 'Product of resistors', 'Shared resistors only (negative)', 'Zero always'],
        correctIndex: 0,
        explanationAr: 'عناصر القطر الرئيسي تمثل مجموع كل المقاومات داخل المسار المعني وتكون دائماً موجبة.'
      }
    ],
    practicalApplicationAr: 'تحليل شبكات توزيع القدرة وحساب تيارات الأعطال الكهربائية في المحولات والمحركات.',
    commonMistakesAr: ['الخلط بين إشارة مصدر الجهد واتجاه دوران تيار المسار الافتراضي.']
  },

  // 15. Capacitors and Inductors
  {
    id: 'exp-15',
    number: 15,
    titleAr: 'المكثفات والملفات',
    titleEn: 'Capacitors and Inductors',
    subtitleAr: 'دراسة سلوك عناصر تخزين الطاقة في دوائر DC، ثابت الوقت (Time Constant τ)، واستجابة الشحن والتفريغ',
    objectivesAr: [
      'فهم سلوك المكثف والملف في الحالتين العابرة (Transient) والمستقرة (DC Steady State).',
      'قياس ثابت الوقت τ لدائرة RC (حيث τ = R*C) ولدائرة RL (حيث τ = L/R).',
      'رسم منحنيات الشحن والتفريغ للجهد والتيار مع الزمن ومقارنتها بالدوال الأسية النظرية.'
    ],
    objectivesEn: [
      'Examine reactive energy-storage behavior during transient and steady-state regimes.',
      'Measure time constant τ for RC networks (τ = R*C) and RL networks (τ = L/R).',
      'Plot exponential charge/discharge curves for voltage and current versus time.'
    ],
    theoryAr: `المكثفات والملفات عناصر تخزين طاقة غير خطية مع الزمن في دوائر التيار المستمر:
1. المكثف (Capacitor): يخزن الطاقة في مجال كهربائي (E = 0.5 C V²). يعارض التغير المفاجئ في الجهد (i = C dv/dt).
   - في اللحظة الأولى لتطبيق الجهد (t=0): يسلك المكثف المفرغ سلوك دائرة قصر (Short Circuit).
   - في حالة الاستقرار (Steady State t > 5τ): يشحن المكثف بالكامل ويسلك سلوك دائرة مفتوحة (Open Circuit / تيار = 0).
   - معادلة الشحن: v_C(t) = V_s * (1 - e^(-t / τ)) حيث τ = R * C.
2. الملف (Inductor): يخزن الطاقة في مجال مغناطيسي (E = 0.5 L I²). يعارض التغير المفاجئ في التيار (v = L di/dt).
   - في اللحظة الأولى (t=0): يسلك الملف سلوك دائرة مفتوحة (Open Circuit).
   - في حالة الاستقرار (Steady State): يسلك سلوك دائرة قصر بسلك ذي مقاومة مهملة (Short Circuit).
   - ثابت الوقت: τ = L / R.`,
    theoryEn: 'Capacitors store energy in electric fields (W = 1/2*C*V^2) and oppose instantaneous voltage changes (i = C*dv/dt). At t=0 uncharged, a capacitor acts as a short circuit; at DC steady state (t > 5τ), it acts as an open circuit. Inductors store energy in magnetic fields (W = 1/2*L*I^2) and oppose instantaneous current changes (v = L*di/dt). At t=0, an inductor acts as an open circuit; at DC steady state, it acts as a short circuit.',
    formulas: [
      { name: 'ثابت الوقت لدائرة RC', formula: '\\tau = R \\cdot C', descriptionAr: 'الوقت اللازم ليصل جهد المكثف إلى 63.2% من أقصى جهد' },
      { name: 'معادلة شحن المكثف', formula: 'v_C(t) = V_s \\left( 1 - e^{-t / \\tau} \\right)', descriptionAr: 'الجهد اللحظي عبر المكثف أثناء الشحن' },
      { name: 'معادلة تفريغ المكثف', formula: 'v_C(t) = V_0 \\cdot e^{-t / \\tau}', descriptionAr: 'الجهد اللحظي أثناء التفريغ' },
      { name: 'ثابت الوقت لدائرة RL', formula: '\\tau = \\frac{L}{R}', descriptionAr: 'ثابت الوقت للملف والمقاومة' }
    ],
    requiredEquipmentAr: [
      'مصدر جهد DC (10V)',
      'مفتاح ثنائي الاتجاه (SPDT Switch)',
      'مكثفات كهربائية: 100μF, 470μF (مؤكسدة Electrolytic)',
      'ملف محاثة (Inductor 50mH أو 100mH)',
      'مقاومات: 10kΩ, 47kΩ, 100kΩ',
      'ملتيميتر وساعة إيقاف (أو راسم إشارة Oscilloscope)',
      'لوحة تجارب وأسلاك'
    ],
    requiredEquipmentEn: [
      '10V DC Power Supply',
      'SPDT Switch',
      'Electrolytic Capacitors: 100μF, 470μF',
      'Inductor: 50mH to 100mH',
      'Resistors: 10kΩ, 47kΩ, 100kΩ',
      'DMM & Stopwatch / Storage Oscilloscope',
      'Breadboard & wires'
    ],
    schematicSvgOrKey: 'rc-transient-schematic',
    procedureStepsAr: [
      'ركّب دائرة RC: مصدر 10V مع مفتاح ومقاومة R = 47kΩ ومكثف C = 100μF متصلين على التوالي.',
      'احسب ثابت الوقت نظرياً: τ = R * C = 47,000 * 100e-6 = 4.7 ثوانٍ.',
      'تأكد من تفريغ المكثف تماماً (v_C = 0V).',
      'أغلق المفتاح وابدأ تشغيل ساعة الإيقاف، وسجل قراءة الجهد عبر المكثف كل ثانيتين (2s, 4s, 6s, 8s, 10s...).',
      'تحقق أن الجهد عند t = 4.7s (ثابت الوقت τ) يساوي 6.32V (أي 63.2% من 10V).',
      'ارسم المنحنى البياني للجهد مقابل الزمن ولاحظ الاستقرار بعد 5τ (حوالي 23.5 ثانية).'
    ],
    procedureStepsEn: [
      'Construct series RC circuit: 10V source, SPDT switch, R=47kΩ, and electrolytic C=100μF.',
      'Compute theoretical time constant: τ = R * C = 47,000 * 100e-6 = 4.7 seconds.',
      'Ensure capacitor is fully discharged (Vc = 0V).',
      'Close switch, initiate timer, and log Vc at regular intervals (2s, 4s, 6s...).',
      'Confirm that at t = τ (4.7s), Vc reaches exactly 6.32V (63.2% of 10V).',
      'Plot transient charging curve and observe DC steady state reached after 5τ (~23.5s).'
    ],
    defaultCircuit: {
      components: [
        { id: 'src1', type: 'dc_source', name: 'E1', value: 10, unit: 'V', x: 80, y: 160, rotation: 0, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'sw1', type: 'switch', name: 'SW1', value: 1, unit: '', isOpen: false, x: 190, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'r1', type: 'resistor', name: 'R1', value: 47000, unit: 'Ω', x: 290, y: 100, rotation: 0, terminals: [{ id: 't1', x: -30, y: 0 }, { id: 't2', x: 30, y: 0 }] },
        { id: 'c1', type: 'capacitor', name: 'C1', value: 0.0001, unit: 'μF', x: 390, y: 160, rotation: 90, terminals: [{ id: 't1', x: 0, y: -30, label: '+' }, { id: 't2', x: 0, y: 30, label: '-' }] },
        { id: 'gnd', type: 'ground', name: 'GND', value: 0, unit: '', x: 80, y: 260, rotation: 0, terminals: [{ id: 't1', x: 0, y: -15 }] }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'src1', fromTerminalId: 't1', toComponentId: 'sw1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'sw1', fromTerminalId: 't2', toComponentId: 'r1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'r1', fromTerminalId: 't2', toComponentId: 'c1', toTerminalId: 't1', color: '#ef4444' },
        { id: 'w4', fromComponentId: 'c1', fromTerminalId: 't2', toComponentId: 'src1', toTerminalId: 't2', color: '#3b82f6' },
        { id: 'w5', fromComponentId: 'src1', fromTerminalId: 't2', toComponentId: 'gnd', toTerminalId: 't1', color: '#10b981' }
      ]
    },
    expectedMeasurements: [
      { parameter: 'ثابت الوقت النظري τ', symbol: '\\tau', theoreticalFormula: '47k \\times 100\\mu F', typicalTheoretical: 4.7, unit: 's' },
      { parameter: 'الجهد عند t = τ', symbol: 'v_C(\\tau)', theoreticalFormula: '10 \\times (1 - e^{-1}) = 10 \\times 0.632', typicalTheoretical: 6.32, unit: 'V' },
      { parameter: 'الجهد عند t = 2τ', symbol: 'v_C(2\\tau)', theoreticalFormula: '10 \\times (1 - e^{-2}) = 10 \\times 0.865', typicalTheoretical: 8.65, unit: 'V' },
      { parameter: 'الجهد عند t = 5τ (الاستقرار الكامل)', symbol: 'v_C(5\\tau)', theoreticalFormula: '10 \\times (1 - e^{-5}) \\approx 10', typicalTheoretical: 9.93, unit: 'V' }
    ],
    discussionQuestions: [
      {
        id: 'dq-15-1',
        questionAr: 'ماذا يحدث إذا حاولت فصل مفتاح يمر فيه تيار ملف فجأة دون وجود دايود حماية (Flyback Diode)؟',
        questionEn: 'What happens when breaking current to an energized inductor without a flyback diode?',
        modelAnswerAr: 'الملف يعارض التغير المفاجئ في التيار (v = L di/dt). قطع التيار فجأة يجعل di/dt سالبة وكبيرة جداً مما يولد نبضة جهد عكسية هائلة (تصل لمئات أو آلاف الفولتات) تسبب شرارة كهربائية تحرق المفتاح أو تدمر الترانزستور المتصل.',
        modelAnswerEn: 'Because v = L*di/dt, an abrupt break forces di/dt to spike negatively, creating a massive inductive kick that can destroy driver transistors.'
      }
    ],
    preQuiz: [
      {
        id: 'pq-15-1',
        questionAr: 'في حالة استقرار التيار المستمر (DC Steady State بعد 5τ)، يسلك المكثف المثالي سلوك:',
        questionEn: 'At DC steady state (after 5τ), an ideal capacitor behaves as:',
        optionsAr: ['دائرة مفتوحة (Open Circuit - تيار منعدم)', 'دائرة قصر (Short Circuit)', 'مقاومة 100Ω', 'مصدر جهد مستقل'],
        optionsEn: ['An open circuit (zero current)', 'A short circuit', 'A 100Ω resistor', 'An independent voltage source'],
        correctIndex: 0,
        explanationAr: 'عند اكتمال شحن المكثف يصبح فرق جهده مساوياً لجهد المصدر فينعدم مرور أي تيار مستمر ويسلك سلوك دائرة مفتوحة.'
      }
    ],
    postQuiz: [
      {
        id: 'poq-15-1',
        questionAr: 'دائرة RC تحتوي على R = 10kΩ و C = 10μF. ما قيمة ثابت الوقت τ؟',
        questionEn: 'An RC circuit with R = 10kΩ and C = 10μF has a time constant τ of:',
        optionsAr: ['0.1 ثانية', '1 ثانية', '10 ثوانٍ', '100 مللي ثانية'],
        optionsEn: ['0.1 s', '1 s', '10 s', '100 ms'],
        correctIndex: 0,
        explanationAr: 'τ = R × C = 10,000 × 10×10⁻⁶ = 0.1 ثانية (100 مللي ثانية).'
      }
    ],
    practicalApplicationAr: 'دوائر المؤقتات (مثل مؤقت 555)، فلاتر تنقية موجات التغذية، ودوائر منع ارتداد أزرار التحكم (Debouncing).',
    commonMistakesAr: [
      'توصيل المكثف الكيميائي ذي القطبية (+/-) بالعكس مما قد يؤدي لانتفاخه أو انفجاره.',
      'نسيان تفريغ شحنة المكثف قبل بدء تجربة الشحن مما يؤدي لقراءات خاطئة لثابت الوقت.'
    ]
  }
];

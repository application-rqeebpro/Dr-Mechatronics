import { WhiteboardScene } from '../types';

export const getCourseLectureScenes = (course: string, doctorName: string): WhiteboardScene[] => {
  switch (course) {
    case 'Electrical Circuits 1 T':
      return [
        {
          title: `Electrical Circuits 1 T - تحليل العقد والمش (Nodal & Mesh Analysis)`,
          whiteboardText: `Course: Electrical Circuits 1 T\nInstructor: ${doctorName}\n=========================================\n1. قانون كيرشوف للتيار (KCL) عند كل عقدة أساسية:\n   Σ I_in = Σ I_out\n   (V1 - V2)/R1 + (V1 - V3)/R2 + I_source = 0\n\n2. قانون كيرشوف للجهد (KVL) لحلقات المش (Mesh):\n   Σ V_loop = 0\n   -Vs + I1·R1 + (I1 - I2)·R2 = 0\n\n3. تمثيل المصفوفات: [G] · [V] = [I] لحل الدوائر المعقدة`,
          professorSpeech: `مرحبًا بكم في محاضرة مادة Electrical Circuits 1 T. اليوم سنراجع طريقة تحليل العقد والمش، وكيف نكتب معادلات كيرشوف بصيغة المصفوفات لحساب الجهد والتيار عند كل نقطة في الدائرة الكهربائية بدقة وسرعة.`,
          diagramType: 'circuit',
        },
        {
          title: `Electrical Circuits 1 T - نظريات ثيفينين ونورتون (Thevenin & Norton)`,
          whiteboardText: `Thevenin & Norton Equivalent Circuits\n-------------------------------------\n• جهد الدائرة المفتوحة: V_th = V_oc (Open Circuit Voltage)\n• مقاومة ثيفينين المكافئة: R_th (إلغاء مصادر الجهد قصر ومصادر التيار قطع)\n• تيار نورتون: I_N = I_sc = V_th / R_th\n• شرط نقل أقصى قدرة للحمل (Max Power Transfer):\n  R_load = R_th  ==>  P_max = (V_th)² / (4 · R_th)`,
          professorSpeech: `تعتبر نظرية ثيفينين من أقوى النظريات الكهربائية، حيث تسمح لنا بتبسيط أي شبكة خطية معقدة إلى مصدر جهد واحد ومقاومة واحدة على التوالي، مما يسهل دراسة استجابة الحمل R_load.`,
          diagramType: 'circuit',
        },
      ];

    case 'Electrical Circuits 1 P':
      return [
        {
          title: `Electrical Circuits 1 P - التطبيق العملي والقياس (Practical Measurements)`,
          whiteboardText: `Course: Electrical Circuits 1 P\nInstructor: ${doctorName}\n=========================================\n• فحص قيم المقاومات بالشفرة اللونية (Color Code Band)\n  Black=0, Brown=1, Red=2, Orange=3, Yellow=4...\n• قياس الجهد: توصيل الفولتميتر على التوازي (High Impedance)\n• قياس التيار: فتح المسار وتوصيل الأميتر على التوالي (Low Impedance)\n• نسبة الخطأ العملي: Error% = |(Theoretical - Measured)| / Theoretical × 100%`,
          professorSpeech: `أهلاً بكم في جلسة مادة Electrical Circuits 1 P. سنركز اليوم على التوصيل السليم لأجهزة القياس DMM على لوحة التجارب (Breadboard) والتحقق من حسابات المقاومة ومعاملات الخطأ المعملية.`,
          diagramType: 'circuit',
        },
        {
          title: `Electrical Circuits 1 P - تحقيق قانون أوم والمجزئات (Voltage & Current Dividers)`,
          whiteboardText: `Divider Circuits in Practice\n----------------------------\n• مجزئ الجهد (Voltage Divider):\n  V_out = V_in · [ R2 / (R1 + R2) ]\n• مجزئ التيار (Current Divider):\n  I1 = I_total · [ R2 / (R1 + R2) ]\n• تأثير الحمل المقاومي (Loading Effect) على دقة الجهد المقاس`,
          professorSpeech: `في هذا التمرين التطبيقي، نقوم بقياس تأثير الحمل على دوائر مجزئ الجهد، والتأكد من كيفية اختيار قيم المقاومات المناسبة لتقليل الفاقد في الإشارة.`,
          diagramType: 'circuit',
        },
      ];

    case 'Electrical Circuits Lab':
      return [
        {
          title: `Electrical Circuits Lab - أجهزة المختبر وراسم الإشارة (Oscilloscope & AC Sources)`,
          whiteboardText: `Course: Electrical Circuits Lab\nInstructor: ${doctorName}\n=========================================\n• ضبط راسم الإشارة الرقمي (Digital Storage Oscilloscope - DSO):\n  - محور الجهد: Volts/Div\n  - محور الزمن: Time/Div\n• قياس جهد القمة لقمة (V_p-p) والجهد الفعال: V_rms = V_peak / √2\n• قياس فرق الطور الزمني بين موجتين: φ = (Δt / T) × 360°`,
          professorSpeech: `مرحبًا بكم في Electrical Circuits Lab! اليوم سنقوم بتشغيل راسم الإشارة ومولد الدالات ونضبط معايرة المجس (Probe Calibration 10X) لقياس الإشارات المترددة بدقة بالغة.`,
          diagramType: 'circuit',
        },
        {
          title: `Electrical Circuits Lab - تجربة دوائر الرنين (RLC Resonance Experiment)`,
          whiteboardText: `RL - RC - RLC Series AC Lab\n----------------------------\n• Impedance: Z = √(R² + (ωL - 1/ωC)²)\n• شرط الرنين العملي (Resonance): XL = XC ==> ωL = 1/ωC\n• تردد الرنين المقاس: f₀ = 1 / (2π · √(L · C))\n• عند الرنين: Z = R (التيار في أقصى قيمة وزاوية الطور φ = 0°)`,
          professorSpeech: `هذه التجربة المعملية الشهيرة تؤكد ظاهرة الرنين عمليًا على لوحة المختبر! نغير تردد المولد حتى نلاحظ انطباق طور الجهد مع التيار تمامًا وارتفاع التيار لأقصى مدى.`,
          diagramType: 'circuit',
        },
      ];

    case 'Physics':
      return [
        {
          title: `Physics - المتجهات وقوانين نيوتن للحركة (Vectors & Newton's Laws)`,
          whiteboardText: `Course: Physics\nInstructor: ${doctorName}\n=========================================\n1. تحليل المتجهات في بعدين (Vector Components):\n   F_x = F · cos(θ),   F_y = F · sin(θ)\n   |F| = √(F_x² + F_y²),   θ = arctan(F_y / F_x)\n\n2. قانون نيوتن الثاني:\n   Σ F = m · a\n3. الوزن وقوة الاحتكاك:\n   W = m · g,   f_s_max = μ_s · N,   f_k = μ_k · N`,
          professorSpeech: `أهلاً بكم في مقرر الفيزياء العامة Physics. اليوم سنؤسس للفهم الميكانيكي المتين من خلال تحليل متجهات القوى وتطبيق قوانين نيوتن على الأجسام المتحركة والمتزنة.`,
          diagramType: 'formula',
        },
        {
          title: `Physics - الشغل والطاقة وحفظ الطاقة الميكانيكية (Work & Energy)`,
          whiteboardText: `Work, Energy & Conservation\n---------------------------\n• الشغل الميكانيكي: W = F · d · cos(φ) = ∫ F · dx\n• طاقة الحركة: K = (1/2) · m · v²\n• طاقة الوضع الثقالية: U = m · g · h\n• مبدأ حفظ الطاقة الميكانيكية: E_initial = E_final  (في غياب الاحتكاك)`,
          professorSpeech: `مبدأ حفظ الطاقة هو جوهر الفيزياء. سنرى كيف تتحول طاقة الوضع إلى طاقة حركة، وكيف يتم حساب الشغل الناتج عن القوى المؤثرة في مختلف الأنظمة.`,
          diagramType: 'formula',
        },
      ];

    case 'Engineering Physics':
      return [
        {
          title: `Engineering Physics - الاهتزازات والموجات الميكانيكية (Oscillations & Waves)`,
          whiteboardText: `Course: Engineering Physics\nInstructor: ${doctorName}\n=========================================\n• الحركة التوافقية البسيطة (Simple Harmonic Motion - SHM):\n  x(t) = A · cos(ωt + φ)\n  v(t) = -A·ω · sin(ωt + φ),   a(t) = -ω² · x(t)\n• التردد الزاوي لنظام كتلة ونابض: ω = √(k / m)\n• طاقة النظام المهتز الكلية: E = (1/2) · k · A²`,
          professorSpeech: `مرحبًا بكم في مقرر الفيزياء الهندسية Engineering Physics. ندرس اليوم حركة الاهتزازات التوافقية، وهي الأساس النظري لفهم اهتزازات هياكل الميكاترونكس والمخمدات الميكانيكية.`,
          diagramType: 'formula',
        },
        {
          title: `Engineering Physics - الموجات الكهرومغناطيسية والضوء (Electromagnetic Waves)`,
          whiteboardText: `Waves & Optics in Engineering\n-----------------------------\n• سرعة الموجة: v = f · λ\n• قانون سنيل في الانكسار (Snell's Law): n1 · sin(θ1) = n2 · sin(θ2)\n• الانعكاس الكلي الداخلي وتطبيقات الألياف البصرية (Optical Fibers):\n  θ_critical = arcsin(n2 / n1)`,
          professorSpeech: `في هذا الجزء من الفيزياء الهندسية نربط بين الخصائص الموجية للضوء وتطبيقات الألياف البصرية والحساسات الضوئية المستخدمة في أنظمة القياس الحديثة.`,
          diagramType: 'formula',
        },
      ];

    case 'Physics T':
      return [
        {
          title: `Physics T - تمارين ومسائل الحركة في بعدين والمقذوفات (Projectile Motion)`,
          whiteboardText: `Course: Physics T (Tutorial)\nInstructor: ${doctorName}\n=========================================\n• معادلات حركة المقذوفات بزاوية θ:\n  - المحور الأفقي (a_x = 0):  x = (v₀ · cos θ) · t\n  - المحور الرأسي (a_y = -g): y = (v₀ · sin θ) · t - (1/2)·g·t²\n• أقصى ارتفاع (Max Height): H = (v₀² · sin² θ) / (2g)\n• المدى الأفقي (Range): R = (v₀² · sin 2θ) / g`,
          professorSpeech: `أهلاً بكم في جلسة التمارين لمقرر Physics T. سنحل اليوم مسائل المقذوفات وحساب المدى وأقصى ارتفاع بالخطوات التفصيلية مع تدقيق الوحدات الفيزيائية.`,
          diagramType: 'formula',
        },
        {
          title: `Physics T - مسائل الاتزان والديناميكا على المستويات المائلة (Inclined Planes)`,
          whiteboardText: `Problems on Inclined Plane with Friction\n----------------------------------------\n• تحليل الوزن على المستوى المائل:\n  W_parallel = m · g · sin(θ)\n  W_perpendicular = m · g · cos(θ) = N\n• معادلة الحركة مع الاحتكاك:\n  m · a = m·g·sin(θ) - μ_k · (m·g·cos(θ))\n  ==> a = g · (sin θ - μ_k · cos θ)`,
          professorSpeech: `في هذه المسألة التمرينية النموذجية، نتعلم كيفية تفكيك القوى على السطوح المائلة وكيف يؤثر معامل الاحتكاك الحركي μ_k على تسارع الأجسام المنزلقة.`,
          diagramType: 'formula',
        },
      ];

    case 'Electrical Circuits 1':
      return [
        {
          title: `Electrical Circuits 1 - الأسس والقوانين الأولية (Fundamentals & Laws)`,
          whiteboardText: `Course: Electrical Circuits 1\nInstructor: ${doctorName}\n=========================================\n• قانون أوم (Ohm's Law): V = I · R\n• القدرة الكهربائية وقانون جول: P = V · I = I² · R = V² / R\n• المقاومة المكافئة:\n  - على التوالي: R_eq = R1 + R2 + ... + Rn\n  - على التوازي: 1/R_eq = 1/R1 + 1/R2 + ... + 1/Rn`,
          professorSpeech: `أهلاً بكم في مقرر Electrical Circuits 1. اليوم نضع اللبنات الأساسية لتحليل الدوائر الكهربائية، وفهم علاقات الجهد والتيار والمقاومة والقدرة المستهلكة.`,
          diagramType: 'circuit',
        },
        {
          title: `Electrical Circuits 1 - تحويلات ستار-دلتا (Star-Delta Transformation)`,
          whiteboardText: `Star-Delta (Y - Δ) Transformation\n---------------------------------\n• من دلتا (Δ) إلى ستار (Y):\n  R1 = (Rb · Rc) / (Ra + Rb + Rc)\n  R2 = (Ra · Rc) / (Ra + Rb + Rc)\n  R3 = (Ra · Rb) / (Ra + Rb + Rc)\n• مفيدة لتبسيط جسور المقاومات (Bridge Circuits) غير المتزنة`,
          professorSpeech: `تساعدنا تحويلات ستار-دلتا في حل الدوائر التي لا تكون المقاومات فيها متوالية بشكل صريح ولا متوازية، مثل دوائر القناطر الكهربائية الحساسة.`,
          diagramType: 'circuit',
        },
      ];

    case 'Engineering Mechanics Statics':
      return [
        {
          title: `Engineering Mechanics Statics - توازن الجسيمات ومخطط الجسم الحر (FBD)`,
          whiteboardText: `Course: Engineering Mechanics Statics\nInstructor: ${doctorName}\n=========================================\n• شرط التوازن الاستاتيكي للجسيمات في 2D:\n  Σ F_x = 0   و   Σ F_y = 0\n• مخطط الجسم الحر (Free Body Diagram - FBD):\n  عزل الجسم وإظهار كافة قوى الشد (Tension) وقوى التلامس والوزن\n• قاعدة لامي (Lami's Theorem) لثلاث قوى متلاقية في نقطة:\n  F1/sin(α) = F2/sin(β) = F3/sin(γ)`,
          professorSpeech: `مرحبًا بكم في Engineering Mechanics Statics. أهم خطوة في علم الإستاتيكا هي رسم مخطط الجسم الحر (FBD) بدقة؛ فإذا عُزلت القوى بشكل صحيح، كان الحل الرياضي يسيرًا ومضمونًا.`,
          diagramType: 'formula',
        },
        {
          title: `Engineering Mechanics Statics - عزم القوة والاتزان للأجسام الجاسئة (Rigid Body Equilibrium)`,
          whiteboardText: `Moment of a Force & Rigid Body Equilibrium\n------------------------------------------\n• عزم القوة حول نقطة O: M_O = F · d  أو  M_O = r × F\n• شروط اتزان الجسم الجاسئ في المستوي:\n  1. Σ F_x = 0\n  2. Σ F_y = 0\n  3. Σ M_O = 0  (حول أي نقطة اختيارية)`,
          professorSpeech: `في هذا الدرس نتناول مفهوم عزم الدوران، وشروط اتزان الأجسام الصلبة الكبيرة المعرضة لقوى غير متلاقية، وكيف نختار نقطة حساب العزم لإلغاء أكبر عدد من ردود الأفعال المجهولة.`,
          diagramType: 'formula',
        },
      ];

    case 'Engineering Mechanics Statics T':
      return [
        {
          title: `Engineering Mechanics Statics T - تحليل الجمالونات (Truss Analysis - Method of Joints)`,
          whiteboardText: `Course: Engineering Mechanics Statics T\nInstructor: ${doctorName}\n=========================================\n• طريقة العقد (Method of Joints):\n  1. حساب ردود أفعال المساند (Reactions) لكامل الجمالون: ΣF_x=0, ΣF_y=0, ΣM=0\n  2. اختيار عقدة تحوي مجهولين على الأكثر.\n  3. كتابة معادلات الاتزان: ΣF_x = 0,  ΣF_y = 0\n  4. تحديد حالة العضو: شد (Tension) أو ضغط (Compression)`,
          professorSpeech: `أهلاً بكم في تمارين Statics T. سنتدرب عمليًا على حل الجمالونات بطريقة العقد خطوة بخطوة، مع تحديد الأعضاء المعرضة للشد والضغط بدقة.`,
          diagramType: 'formula',
        },
        {
          title: `Engineering Mechanics Statics T - طريقة المقاطع (Method of Sections)`,
          whiteboardText: `Method of Sections for Quick Force Determination\n------------------------------------------------\n• قطع الجمالون بمستوٍ وهمي يمر بـ 3 أعضاء على الأكثر.\n• أخذ اتزان أحد الجزأين المعزولين:\n  Σ F_x = 0,   Σ F_y = 0,   Σ M_section = 0\n• ميزة الطريقة: حساب القوة في عضو وسطي محدد دون المرور بكافة العقد!`,
          professorSpeech: `طريقة المقاطع هي أسلوب المهندس الذكي لحساب القوى في الأعضاء الداخلية للجسور والهياكل دون إضاعة الوقت في تحليل كل عقدة من البداية.`,
          diagramType: 'formula',
        },
      ];

    case 'Mathematics 1':
      return [
        {
          title: `Mathematics 1 - النهايات والاتصال والمشتقات (Limits & Derivatives)`,
          whiteboardText: `Course: Mathematics 1\nInstructor: ${doctorName}\n=========================================\n• تعريف المشتقة من المبادئ الأولية:\n  f'(x) = lim[h→0] [ f(x + h) - f(x) ] / h\n• قواعد الاشتقاق الأساسية:\n  - دالة القوة: d/dx (x^n) = n · x^(n-1)\n  - حاصل الضرب: (u · v)' = u'·v + u·v'\n  - خارج القسمة: (u / v)' = (u'·v - u·v') / v²\n  - قاعدة السلسلة (Chain Rule): dy/dx = (dy/du) · (du/dx)`,
          professorSpeech: `مرحبًا بكم في مقرر Mathematics 1. نبدأ اليوم بتثبيت قواعد الاشتقاق الأساسية وقاعدة السلسلة، التي تمثل حجر الزاوية في نمذجة معدلات التغير في الأنظمة الهندسية.`,
          diagramType: 'formula',
        },
        {
          title: `Mathematics 1 - التكامل الأساسي وتطبيقاته (Calculus & Integration)`,
          whiteboardText: `Indefinite & Definite Integrals\n-------------------------------\n• النظرية الأساسية للتفاضل والتكامل:\n  ∫[a→b] f(x) dx = F(b) - F(a)  حيث F'(x) = f(x)\n• طرق التكامل الشائعة:\n  - التكامل بالتعويض (Substitution): ∫ f(g(x)) · g'(x) dx\n  - التكامل بالتجزيء (Integration by Parts): ∫ u dv = u·v - ∫ v du`,
          professorSpeech: `التكامل هو العملية العكسية للتفاضل، ونستخدمه لحساب المساحات والكتل وإشارات الطاقة التراكمية في أنظمة الميكاترونكس المتطورة.`,
          diagramType: 'formula',
        },
      ];

    case 'Mathematics 1 T':
      return [
        {
          title: `Mathematics 1 T - تمارين التفاضل الضمني وقاعدة لوبيتال (L'Hôpital's Rule)`,
          whiteboardText: `Course: Mathematics 1 T (Tutorial)\nInstructor: ${doctorName}\n=========================================\n• قاعدة لوبيتال لحالات عدم التعيين (0/0 أو ∞/∞):\n  lim[x→c] [ f(x) / g(x) ] = lim[x→c] [ f'(x) / g'(x) ]\n• الاشتقاق الضمني (Implicit Differentiation):\n  اشتقاق معادلة المنحنى مثل: x² + y² = R²\n  2x + 2y · (dy/dx) = 0 ==> dy/dx = -x / y`,
          professorSpeech: `أهلاً بكم في جلسة التمارين Mathematics 1 T. سنحل مسائل امتحانية مكثفة على قاعدة لوبيتال لحساب النهايات المعقدة، وتقنيات الاشتقاق الضمني.`,
          diagramType: 'formula',
        },
        {
          title: `Mathematics 1 T - مسائل القيم القصوى والتقريب الخطي (Optimization Problems)`,
          whiteboardText: `Optimization & Curve Sketching Workout\n--------------------------------------\n• خطوات إيجاد القيم العظمى والصغرى:\n  1. إيجاد المشتقة الأولى: f'(x) = 0 للحصول على النقاط الحرجة (Critical Points).\n  2. اختبار المشتقة الثانية: f''(x) > 0 (صغرى محلية)، f''(x) < 0 (عظمى محلية).\n• مسألة هندسية: تصميم أسطوانة بأقل مساحة سطحية عند حجم ثابت V_0.`,
          professorSpeech: `مسائل الاستمثال (Optimization) من أهم تطبيقات التفاضل في الهندسة؛ لأنها تساعدنا على تصميم منتجات بأقل تكلفة وأعلى كفاءة في استهلاك المواد.`,
          diagramType: 'formula',
        },
      ];

    case 'Arabic Language Skills I':
      return [
        {
          title: `Arabic Language Skills I - مهارات الصياغة والتحرير الهندسي (Technical Arabic Writing)`,
          whiteboardText: `Course: Arabic Language Skills I\nInstructor: ${doctorName}\n=========================================\n1. خصائص الأسلوب العلمي والهندسي:\n   - الدقة والموضوعية وتجنب العبارات الفضفاضة.\n   - استخدام المصطلحات الهندسية الدقيقة المعربة أو الموحدة.\n   - التوثيق العلمي والمراجع المعتمدة.\n2. علامات الترقيم وأثرها في وضوح المعنى التقني:\n   - الفاصلة المنقوطة (؛) للتعليل وربط السبب بالنتيجة.\n   - النقطتان الرأسيتان (:) لتفصيل القوانين والمكونات.`,
          professorSpeech: `أهلاً بكم في مقرر مهارات اللغة العربية Arabic Language Skills I. المهندس المتميز يتقن التعبير عن حساباته وتصاميمه بلغة عربية فنية رصينة ودقيقة ومقروءة للجميع.`,
          diagramType: 'formula',
        },
        {
          title: `Arabic Language Skills I - إعداد التقارير الفنية والمراسلات الأكاديمية (Technical Reports)`,
          whiteboardText: `Technical Report Structure\n--------------------------\n• هيكل التقرير الهندسي:\n  1. صفحة الغلاف والبيانات الأساسية.\n  2. الملخص التنفيذي (Executive Summary).\n  3. المقدمة والأهداف الهندسية.\n  4. منهجية العمل والحسابات والتجارب.\n  5. مناقشة النتائج والتوصيات المستقبلية.`,
          professorSpeech: `في هذا الدرس نتعلم أصول كتابة التقارير الهندسية المهنية، وكيف تصيغ الملخص التنفيذي والنتائج بما يقنع جهات العمل الأكاديمية والصناعية.`,
          diagramType: 'formula',
        },
      ];

    case 'English Language Skills 1':
      return [
        {
          title: `English Language Skills 1 - المصطلحات الهندسية وقراءة الوثائق الفنية (Technical Terminology)`,
          whiteboardText: `Course: English Language Skills 1\nInstructor: ${doctorName}\n=========================================\n• Core Mechatronics Vocabulary:\n  - Actuator (مشغل ميكانيكي), Transducer (محول طاقة)\n  - Closed-loop feedback (تغذية راجعة مغلقة)\n  - Tolerance (نسبة السماحية), Voltage rating (الجهد الاسمي)\n• Reading Component Datasheets:\n  - Absolute Maximum Ratings, Electrical Characteristics, Typical Curves`,
          professorSpeech: `Welcome to English Language Skills 1. Today we master reading engineering datasheets and identifying technical keywords vital for mechatronic design and international specifications.`,
          diagramType: 'formula',
        },
        {
          title: `English Language Skills 1 - الكتابة الأكاديمية للمختبرات (Academic Lab Report Writing)`,
          whiteboardText: `Academic Writing & Grammar in Engineering\n-----------------------------------------\n• Using Passive Voice in Experimental Procedures:\n  - Active: "We connected the resistor across the terminal."\n  - Passive (Recommended): "The resistor was connected across the terminal."\n• Linking Words for Scientific Coherence:\n  - Furthermore, Consequently, In contrast, On the other hand`,
          professorSpeech: `In this session, we practice transforming everyday English into concise, passive-voice scientific prose suitable for research journals and engineering lab submissions.`,
          diagramType: 'formula',
        },
      ];

    case 'Culture 1':
      return [
        {
          title: `Culture 1 - أخلاقيات مهنة الهندسة والمسؤولية المهنية (Engineering Ethics)`,
          whiteboardText: `Course: Culture 1\nInstructor: ${doctorName}\n=========================================\n• ميثاق الشرف الأخلاقي للمهندس (Code of Ethics):\n  1. سلامة الإنسان وصحة المجتمع وحماية البيئة أولاً وقبل كل ربح مادي.\n  2. النزاهة العلمية وتجنب تضارب المصالح والانتحال العلمي.\n  3. مراعاة معايير الأمان (Safety Margins) في المنظومات الميكاترونية الحيوية.\n• البعد الإنساني والأخلاقي للثورة التكنولوجية والذكاء الاصطناعي.`,
          professorSpeech: `مرحبًا بكم في مقرر الثقافة 1 Culture 1. الهندسة ليست مجرد دوائر ومعادلات، بل هي أمانة إنسانية تهدف لعمارة الأرض وخدمة المجتمع بأعلى معايير النزاهة والأمان.`,
          diagramType: 'formula',
        },
        {
          title: `Culture 1 - التفكير النقدي وبناء الحضارة (Critical Thinking & Civic Role)`,
          whiteboardText: `Critical Thinking & Technological Renaissance\n---------------------------------------------\n• منهج التفكير النقدي في حل المشكلات المجتمعية.\n• استلهام التجارب الحضارية في النهضة والابتكار التكنولوجي المستدام.\n• دور المهندس القائد في تنمية الاقتصاد المعرفي وتوطين التقنيات الذكية.`,
          professorSpeech: `في هذا الدرس نناقش كيف يساهم المهندس بوعيه وثقافته في صناعة النهضة الحضارية، وقيادة المجتمع نحو حلول مستدامة تخدم الأجيال القادمة.`,
          diagramType: 'formula',
        },
      ];

    default:
      return [
        {
          title: `${course} - المحاضرة التفاعلية`,
          whiteboardText: `Course: ${course}\nInstructor: ${doctorName}\n=========================================\n• الشرح الهندسي النظري والمفاهيم الأساسية.\n• المعادلات والقوانين الحاكمة مع وحدات القياس.\n• التطبيقات العملية والتمارين المحلولة.`,
          professorSpeech: `أهلاً بكم في قاعة المحاضرات لمقرر ${course} بإشراف ${doctorName}. سنستعرض القوانين ونحل المسائل النموذجية معًا على السبورة التفاعلية.`,
          diagramType: 'formula',
        },
      ];
  }
};

// Speech Synthesis & Scientific Math Transliteration Engine
// Handles OS/Browser voices, male/female personas, rate/pitch modulation, and equation pronunciation

export interface SystemVoiceOption {
  id: string;
  name: string;
  lang: string;
  gender: 'male' | 'female' | 'neutral';
  isArabic: boolean;
  rawVoice?: SpeechSynthesisVoice;
}

export type VoicePersona = 'male' | 'female' | 'device_default';

export interface VoiceEngineSettings {
  persona: VoicePersona;
  selectedVoiceId: string;
  rate: number;
  pitch: number;
}

export class AudioSpeechEngine {
  private static instance: AudioSpeechEngine;
  private voices: SystemVoiceOption[] = [];
  private listeners: (() => void)[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };
    }
  }

  public static getInstance(): AudioSpeechEngine {
    if (!AudioSpeechEngine.instance) {
      AudioSpeechEngine.instance = new AudioSpeechEngine();
    }
    return AudioSpeechEngine.instance;
  }

  public initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const rawVoices = window.speechSynthesis.getVoices();
    if (!rawVoices || rawVoices.length === 0) return;

    const seenIds = new Map<string, number>();
    const mappedVoices: SystemVoiceOption[] = [];

    rawVoices.forEach((v, index) => {
      const lowerName = (v.name || '').toLowerCase();
      const lang = (v.lang || '').toLowerCase();
      const isArabic = lang.startsWith('ar') || lowerName.includes('arabic') || lowerName.includes('عربي');

      // Gender inference: Default Arabic voices to 'male' unless explicitly feminine
      let gender: 'male' | 'female' | 'neutral' = 'neutral';
      const femaleTokens = ['laila', 'salma', 'zariyah', 'hoda', 'zeina', 'maryam', 'sara', 'female', 'nour', 'fatima', 'samira', 'ayesha', 'wavenet-a', 'standard-a'];
      const maleTokens = ['maged', 'tarik', 'hamed', 'naayf', 'hamza', 'male', 'shakir', 'youssef', 'ali', 'omar', 'ahmed', 'khalid', 'george', 'bass', 'wavenet-b', 'standard-b'];

      if (femaleTokens.some((t) => lowerName.includes(t))) {
        gender = 'female';
      } else if (maleTokens.some((t) => lowerName.includes(t))) {
        gender = 'male';
      } else if (isArabic) {
        // Enforce male academic default for Arabic voices
        gender = 'male';
      }

      // Check if native Yemeni locale is detected
      const isYemeniLocale = lang.includes('ye') || lowerName.includes('yemen') || lowerName.includes('يمن');

      const baseKey = (v.voiceURI && v.voiceURI.trim()) || (v.name && v.name.trim()) || `voice_${lang}`;
      const count = seenIds.get(baseKey) || 0;
      seenIds.set(baseKey, count + 1);
      const uniqueId = count === 0 ? `${baseKey}#${lang}` : `${baseKey}#${lang}#${count}`;

      mappedVoices.push({
        id: uniqueId,
        name: isYemeniLocale ? `🇾🇪 ${v.name} (يمني)` : v.name || `Voice ${index + 1}`,
        lang: v.lang || 'ar-SA',
        gender,
        isArabic,
        rawVoice: v,
      });
    });

    // Sort voices: Yemeni first, then Arabic male, then other Arabic, then others
    this.voices = mappedVoices.sort((a, b) => {
      const aIsYem = a.lang.toLowerCase().includes('ye') || a.name.includes('يمن');
      const bIsYem = b.lang.toLowerCase().includes('ye') || b.name.includes('يمن');
      if (aIsYem && !bIsYem) return -1;
      if (!aIsYem && bIsYem) return 1;

      if (a.isArabic && a.gender === 'male' && (!b.isArabic || b.gender !== 'male')) return -1;
      if ((!a.isArabic || a.gender !== 'male') && b.isArabic && b.gender === 'male') return 1;

      if (a.isArabic && !b.isArabic) return -1;
      if (!a.isArabic && b.isArabic) return 1;

      return 0;
    });

    this.listeners.forEach((l) => l());
  }

  public onVoicesUpdated(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public getAvailableVoices(): SystemVoiceOption[] {
    return this.voices;
  }

  public getArabicVoices(): SystemVoiceOption[] {
    const ar = this.voices.filter((v) => v.isArabic);
    return ar.length > 0 ? ar : this.voices.slice(0, 5);
  }

  public getArabicMaleVoices(): SystemVoiceOption[] {
    return this.voices.filter((v) => v.isArabic && v.gender === 'male');
  }

  public getVoiceDiagnosticInfo() {
    const ar = this.getArabicVoices();
    const arMale = this.getArabicMaleVoices();
    const hasYemeni = ar.some((v) => v.lang.toLowerCase().includes('ye') || v.name.includes('يمن'));

    return {
      hasArabicVoice: ar.length > 0,
      hasMaleArabicVoice: arMale.length > 0,
      hasYemeniLocaleVoice: hasYemeni,
      totalArabicVoices: ar.length,
      recommendedMaleVoice: arMale[0] || ar[0] || null,
      activePersonaNotice: hasYemeni
        ? 'تم العثور على صوت يمني أصلي مسجل في نظام التشغيل.'
        : arMale.length > 0
        ? `صوت أستاذ عربي ذكوري معتمد (${arMale[0].name}) مع معايرة تردد نبرة الإلقاء وصياغة يمنية جامعية.`
        : 'يتم استخدام محرك المتصفح مع معايرة تردد الصوت (0.82x Pitch) لإنتاج صوت ذكوري أكاديمي وقور + صياغة يمنية.',
    };
  }

  /**
   * Transliterates mathematical equations and LaTeX symbols into natural spoken Arabic
   */
  public cleanTextForSpeech(rawText: string): string {
    if (!rawText) return '';

    let text = rawText;

    // Remove markdown code fences and JSON syntax
    text = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '');

    // Translate common engineering equations and laws to spoken Arabic
    text = text
      .replace(/Z\s*=\s*\\sqrt\{R\^2\s*\+\s*\(\\omega\s*L\s*-\s*\\frac\{1\}\{\\omega\s*C\}\)\^2\}/g, 'المعاوقة زد تساوي الجذر التربيعي لـ: آر تربيع زائد، أوميجا إل ناقص، واحد على أوميجا سي، الكل تربيع')
      .replace(/f_0\s*=\s*\\frac\{1\}\{2\\pi\s*\\sqrt\{LC\}\}/g, 'تردد الرنين إف زيرو يساوي: واحد مقسوم على اثنين باي في الجذر التربيعي لـ إل سي')
      .replace(/\\tan\(\\phi\)\s*=\s*\\frac\{\\omega\s*L\s*-\s*\\frac\{1\}\{\\omega\s*C\}\}\{R\}/g, 'ظل زاوية الطور تان فاي يساوي: أوميجا إل ناقص واحد على أوميجا سي، مقسومًا على المقاومة آر')
      .replace(/P\s*=\s*V_\{rms\}\s*\\cdot\s*I_\{rms\}\s*\\cdot\s*\\cos\(\\phi\)/g, 'القدرة الحقيقية بي تساوي: الجهد الفعال في التيار الفعال في معامل القدرة جيب تمام فاي')
      .replace(/PF\s*=\s*\\cos\(\\phi\)\s*=\s*\\frac\{R\}\{Z\}/g, 'معامل القدرة بي إف يساوي كوزين فاي، ويساوي نسبة المقاومة آر إلى المعاوقة زد')
      .replace(/V\s*=\s*I\s*\\cdot\s*R/g, 'الجهد فولت يساوي شدة التيار مضروبة في المقاومة')
      .replace(/I\s*=\s*\\frac\{V\}\{R\}/g, 'التيار يساوي الجهد مقسوماً على المقاومة')
      .replace(/\\Sigma\s*F\s*=\s*m\s*\\cdot\s*a/g, 'مجموع القوى يساوي الكتلة في التسارع طبقًا لقانون نيوتن الثاني')
      .replace(/\\Sigma\s*\\vec\{F\}\s*=\s*0/g, 'مجموع متجهات القوى يساوي صفرًا في حالة الاتزان')
      .replace(/\\Sigma\s*\\vec\{M\}\s*=\s*0/g, 'مجموع العزوم يساوي صفرًا');

    // General LaTeX replacements
    text = text
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, 'بسط $1 على مقام $2')
      .replace(/\\sqrt\{([^}]+)\}/g, 'الجذر التربيعي لـ $1')
      .replace(/\\omega_n/g, 'أوميجا إن')
      .replace(/\\omega/g, 'أوميجا')
      .replace(/\\zeta/g, 'معامل التخميد زيتا')
      .replace(/\\Delta\s*x/g, 'دلتا إكس')
      .replace(/\\Delta/g, 'دلتا')
      .replace(/\\Sigma/g, 'مجموع')
      .replace(/\\phi/g, 'فاي')
      .replace(/\\theta/g, 'ثيتا')
      .replace(/\\pi/g, 'باي')
      .replace(/\\alpha/g, 'ألفا')
      .replace(/\\beta/g, 'بيتا')
      .replace(/\\lambda/g, 'لامدا')
      .replace(/\\cdot/g, ' ضرب ')
      .replace(/\\times/g, ' ضرب ')
      .replace(/·/g, ' ضرب ')
      .replace(/\\approx/g, ' تقريبًا ')
      .replace(/≈/g, ' تقريبًا ')
      .replace(/\\neq/g, ' لا يساوي ')
      .replace(/\\le|\\leq/g, ' أصغر من أو يساوي ')
      .replace(/\\ge|\\geq/g, ' أكبر من أو يساوي ')
      .replace(/\\implies/g, ' ويؤدي ذلك إلى أن ')
      .replace(/\\rightarrow/g, ' يؤول إلى ')
      .replace(/\\in/g, ' ينتمي إلى ');

    // Units and Symbols
    text = text
      .replace(/\\Omega|Ω/g, ' أوم ')
      .replace(/\\mu F|μF/g, ' ميكروفاراد ')
      .replace(/\\mu|μ/g, ' ميكرو ')
      .replace(/mH/g, ' ملي هنري ')
      .replace(/kHz/g, ' كيلوهرتز ')
      .replace(/MHz/g, ' ميجاهرتز ')
      .replace(/Hz/g, ' هرتز ')
      .replace(/rad\/s/g, ' راديان لكل ثانية ')
      .replace(/m\/s\^2|m\/s²/g, ' متر لكل ثانية مربعة ')
      .replace(/m\/s/g, ' متر لكل ثانية ')
      .replace(/N\\cdot m|N\.m/g, ' نيوتن متر ')
      .replace(/\^2|²/g, ' تربيع ')
      .replace(/\^3|³/g, ' تكعيب ');

    // Clean remaining markup formatting
    text = text
      .replace(/\$\$|\$/g, '')
      .replace(/##|\*\*/g, '')
      .replace(/\[\d+\]/g, '')
      .replace(/[\\_{}]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return text;
  }

  /**
   * Applies authentic Yemeni academic university phrasing and pedagogical tone
   */
  public applyYemeniDialect(rawText: string): string {
    if (!rawText) return '';
    let text = rawText;

    // Transform greetings into friendly Yemeni university lecture tone
    text = text.replace(/بسم الله الرحمن الرحيم.*?(?:الطلاب|أبنائي)/, 'بسم الله الرحمن الرحيم، حياكم الله يا شباب ويا باشمهندسين');

    // Natural Yemeni academic phrases
    text = text
      .replace(/دعونا نبدأ بفهم فكرة/g, 'خلونا نبدأ سوا بفهم فكرة')
      .replace(/نكتب الآن على السبورة القانون/g, 'ركزوا معي تمام يا باشمهندسين، وبنكتب على السبورة القانون')
      .replace(/لاحظوا معي هذا القانون/g, 'ركزوا معي يا شباب كيف نطبق هذا القانون')
      .replace(/انتبهوا جيدًا لمعاني الرموز/g, 'انتبهوا يا باشمهندسين عشان ما تغلطوش في معاني الرموز')
      .replace(/أول سؤال معانا بيكون كالتالي/g, 'يلا نشوف هذا المثال المحلول سوا خطوة بخطوة')
      .replace(/تنبيه مهم جدًا في هذه النقطة/g, 'انتبهوا يا مهندسين، هذا خطأ شائع يقع فيه أغلب الطلاب في الاختبارات')
      .replace(/والآن مع سؤال اختبر نفسك/g, 'والآن يا شباب اختبروا معلوماتكم في هذا السؤال السريع');

    return text;
  }

  /**
   * Speaks the text with verified real voice, persona pitch adjustment, and rate
   */
  public speak(
    text: string,
    options: {
      persona?: VoicePersona;
      dialect?: 'yemeni' | 'standard';
      voiceId?: string;
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options.onError) options.onError(new Error('SpeechSynthesis not supported'));
      return false;
    }

    this.stop();

    // Default dialect is Yemeni university style
    const dialect = options.dialect || 'yemeni';
    const dialectText = dialect === 'yemeni' ? this.applyYemeniDialect(text) : text;

    const cleanedText = this.cleanTextForSpeech(dialectText);
    if (!cleanedText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanedText);

    // Rate
    utterance.rate = Math.max(0.5, Math.min(2.0, options.rate || 1.0));

    // Pitch & Persona: STRICT DEFAULT MALE
    const persona = options.persona || 'male';
    let basePitch = options.pitch !== undefined ? options.pitch : 0.82;

    // Actual pitch alteration between Male and Female
    if (persona === 'male') {
      basePitch = 0.82; // Deep authoritative academic male resonance
    } else if (persona === 'female') {
      basePitch = 1.25; // Bright clear feminine pitch
    } else {
      basePitch = 0.82; // Device default still calibrated for male professor
    }
    utterance.pitch = Math.max(0.5, Math.min(2.0, basePitch));

    // Voice selection
    const available = this.getAvailableVoices();
    let chosenVoice: SpeechSynthesisVoice | undefined;

    if (options.voiceId) {
      const found = available.find((v) => v.id === options.voiceId);
      if (found && found.rawVoice) {
        chosenVoice = found.rawVoice;
      }
    }

    if (!chosenVoice) {
      // Find voice matching requested persona
      const arVoices = available.filter((v) => v.isArabic);
      if (arVoices.length > 0) {
        if (persona === 'female') {
          const femaleAr = arVoices.find((v) => v.gender === 'female');
          chosenVoice = femaleAr?.rawVoice || arVoices[0].rawVoice;
        } else {
          // Default: Male Arabic voice prioritized
          const maleAr = arVoices.find((v) => v.gender === 'male');
          chosenVoice = maleAr?.rawVoice || arVoices[0].rawVoice;
        }
      }
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang || 'ar-SA';
    } else {
      utterance.lang = 'ar-SA';
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      if (options.onError) options.onError(e);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.isSpeaking) {
      window.speechSynthesis.pause();
      this.isPaused = true;
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.isPaused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
    }
  }

  public getStatus() {
    return {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
    };
  }

  /**
   * Dedicated Test Voice function
   */
  public testSample(
    persona: VoicePersona = 'male',
    voiceId: string = '',
    rate: number = 1.0,
    callbacks?: { onStart?: () => void; onEnd?: () => void; onError?: (err: any) => void }
  ) {
    const sampleText = `حياكم الله يا شباب ويا باشمهندسين في منصة دكتور الميكاترونكس الذكي. أنا أستاذكم الافتراضي. بنشرح اليوم قانون أوم: الجهد V بيساوي شدة التيار I ضرب المقاومة R. ركزوا معي في هذا المثال العملي!`;
    return this.speak(sampleText, {
      persona,
      voiceId,
      rate,
      dialect: 'yemeni',
      ...callbacks,
    });
  }
}

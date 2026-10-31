export type Language = 'ar' | 'en';

export type MainTab =
  | 'home'
  | 'circuit-wizard'
  | 'virtual-breadboard'
  | 'dc-lab'
  | 'serway-physics'
  | 'lesson-studio'
  | 'my-lectures'
  | 'professors'
  | 'labs'
  | 'calculators'
  | 'ai-toolkit'
  | 'library'
  | 'quizzes'
  | 'student-profile'
  | 'admin';

export interface Professor {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  specialty: string;
  specialtyEn: string;
  avatar: string;
  isCustomImage?: boolean;
  accentColor: string;
  bio: string;
  bioEn: string;
  style: string;
  styleEn: string;
  courses: string[];
  signatureTopics: string[];
  sampleQuote: string;
  sampleQuoteEn: string;
}

export interface WhiteboardScene {
  title: string;
  whiteboardText: string;
  professorSpeech: string;
  diagramType: 'circuit' | 'formula' | 'kinematics' | 'logic' | 'response';
  circuitParams?: {
    R?: number;
    L?: number;
    C?: number;
    freq?: number;
    Vin?: number;
  };
}

export interface LessonData {
  title: string;
  topic: string;
  intro: string;
  objectives: string[];
  scenes: WhiteboardScene[];
  solvedExample: {
    problem: string;
    solutionSteps: string[];
    finalAnswer: string;
  };
  miniQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  summary: string;
}

export interface DictionaryItem {
  id: string;
  termAr: string;
  termEn: string;
  category: 'electrical' | 'mechanical' | 'control' | 'robotics' | 'embedded' | 'measurements';
  definitionAr: string;
  definitionEn: string;
  formula?: string;
  unit?: string;
  practicalApplication: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'calculation';
  questionAr: string;
  questionEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationAr: string;
  explanationEn: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StudentProfile {
  name: string;
  email: string;
  specialty: 'mechatronics' | 'robotics' | 'electronics' | 'mechanical' | 'automation';
  academicLevel: 'year-1' | 'year-2' | 'year-3' | 'year-4' | 'graduate';
  completedLabs: string[];
  quizScores: { quizId: string; title: string; score: number; total: number; date: string }[];
  savedNotes: { id: string; title: string; content: string; date: string; category: string }[];
  bookmarks: { id: string; title: string; type: string; urlOrRef: string }[];
  soundEnabled: boolean;
  speechRate: number;
  voicePersona?: 'male' | 'female' | 'device_default';
  preferredDialect?: 'yemeni' | 'standard' | 'egyptian' | 'gulf' | 'levantine';
  preferredVoiceEngine?: 'native_hd' | 'fenrir_male' | 'neural_female' | 'device_tts';
  selectedVoiceId?: string;
  subscriptionTier?: 'free' | 'basic' | 'premium_pro';
  subscriptionStatus?: 'active' | 'expired' | 'trial';
  subscriptionExpiresAt?: string;
}

export interface VoiceConsentSettings {
  consentStatus: 'verified_approved' | 'pending_authorization' | 'academic_simulation';
  consentDocumentUrl?: string;
  authorizedByName?: string;
  authorizedDate?: string;
  voiceCloningProvider?: 'elevenlabs' | 'gemini_tts' | 'custom_api' | 'browser_speech';
  voiceCloningApiKey?: string;
  voiceCloningVoiceId?: string;
  referenceVideoUrl: string;
  referenceSpeakerName: string;
  referenceCadence: string;
  targetPaceWordsPerMin: number;
}

export interface AdminSettings {
  isAiEnabled: boolean;
  isVoiceEnabled: boolean;
  isVideoStudioEnabled: boolean;
  isLabsEnabled: boolean;
  isDcLabEnabled?: boolean;
  disabledDcExperiments?: number[];
  isCalculatorsEnabled: boolean;
  externalVideoApiKey?: string;
  externalVideoProvider?: string;
  maintenanceMode: boolean;
  registeredUsersCount: number;
  systemLogs: { timestamp: string; action: string; level: 'info' | 'warn' | 'error' }[];
  voiceSettings?: VoiceConsentSettings;
}

export interface LibraryDocument {
  id: string;
  title: string;
  category: string;
  fileType: string;
  uploadedAt: string;
  sizeKb: number;
  summary: string;
  tags: string[];
  contentSnippet?: string;
  isDemo?: boolean;
  accessTier?: 'free' | 'basic' | 'premium_pro';
  verifiedFileName?: string;
  verifiedPageRange?: string;
  courseId?: string;
  isOwnerApproved?: boolean;
}

export interface SavedLecture {
  id: string;
  createdAt: string;
  doctorName?: string;
  specialty?: string;
  university?: string;
  subject: string;
  topic: string;
  level: 'beginner' | 'university' | 'advanced' | string;
  length: 'brief' | 'medium' | 'detailed' | string;
  sourceType: 'general' | 'pdf' | 'image' | 'notes';
  sourceFileName?: string;
  sourceFileSize?: number;
  extractedSnippet?: string;
  scenes: WhiteboardScene[];
  solvedExample?: {
    problem: string;
    solutionSteps: string[];
    finalAnswer: string;
  };
  miniQuiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  summary?: string;
  studentNotes?: string;
  lastProgressStep?: number;
}

export interface UniversalLessonInput {
  doctorName?: string;
  specialty?: string;
  university?: string;
  subject: string;
  topic: string;
  level: 'beginner' | 'university' | 'advanced';
  length: 'brief' | 'medium' | 'detailed';
  actionIntent?: 'brief' | 'detailed' | 'laws' | 'solve_example' | 'explain_page' | 'quiz_me';
  uploadedFile?: {
    name: string;
    size: number;
    type: string;
    base64Data?: string;
    extractedText?: string;
    selectedPages?: string;
  };
  directNotes?: string;
}

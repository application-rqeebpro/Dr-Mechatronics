export type Language = 'ar' | 'en';

export type MainTab =
  | 'home'
  | 'serway-physics'
  | 'professors'
  | 'lesson-studio'
  | 'ai-toolkit'
  | 'labs'
  | 'calculators'
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
}

export interface AdminSettings {
  isAiEnabled: boolean;
  isVoiceEnabled: boolean;
  isVideoStudioEnabled: boolean;
  isLabsEnabled: boolean;
  isCalculatorsEnabled: boolean;
  externalVideoApiKey?: string;
  externalVideoProvider?: string;
  maintenanceMode: boolean;
  registeredUsersCount: number;
  systemLogs: { timestamp: string; action: string; level: 'info' | 'warn' | 'error' }[];
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
}

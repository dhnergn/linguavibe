export type LanguageCode = 'es' | 'ja' | 'fr' | 'it' | 'de';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  vibeCity: string;
  vibeQuote: string;
  accentCode: string;
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface AbilityScores {
  grammar: number; // 0 - 100
  vibeNuance: number; // 0 - 100
  conversationalConfidence: number; // 0 - 100
  comprehension: number; // 0 - 100
}

export interface MistakeRecord {
  id: string;
  tag: string;
  concept: string;
  userAnswer: string;
  correctAnswer: string;
  timestamp: number;
}

export interface LearnerProfile {
  name: string;
  targetLanguage: LanguageCode;
  level: CEFRLevel;
  xp: number;
  gems: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  streakFreezes: number;
  abilityScores: AbilityScores;
  mistakes: MistakeRecord[];
  completedLessonIds: string[];
  unlockedBadgeIds: string[];
  dailyGoalXp: number;
  todayXp: number;
  soundEnabled: boolean;
}

// Vibe Exercises
export type VibeExerciseType = 'read-the-room' | 'tone-dial' | 'text-slang' | 'cultural-dilemma';

export interface VibeExercise {
  id: string;
  type: VibeExerciseType;
  title: string;
  situation: string;
  culturalContext: string;
  audioPhrase?: string;
  options: {
    text: string;
    translation: string;
    vibeRating: 'awkward' | 'too-formal' | 'spot-on' | 'overly-casual';
    vibeFeedback: string;
    isBestChoice: boolean;
    xp: number;
  }[];
  nativeTip: string;
}

// Grammar Exercises
export type GrammarExerciseType = 'sentence-architect' | 'context-conjugation' | 'error-spotter';

export interface GrammarExercise {
  id: string;
  type: GrammarExerciseType;
  title: string;
  instruction: string;
  targetConcept: string; // e.g. "Indirect Object Pronoun", "Subjunctive Mood", "Particle は vs が"
  sentenceContext: string;
  englishMeaning: string;
  // For sentence-architect
  tokens?: string[];
  correctTokenOrder?: string[];
  // For context-conjugation
  fillInBlank?: {
    prefix: string;
    suffix: string;
    verbBase: string;
    correctForm: string;
    options: string[];
  };
  // For error-spotter
  sentenceWithSpotter?: {
    words: string[];
    errorIndex: number;
    correction: string;
    explanation: string;
  };
  explanation: string;
  xp: number;
}

// Story Mode
export interface StoryDialogueLine {
  speaker: string;
  speakerRole: string;
  avatarIcon?: string;
  text: string;
  translation: string;
  audioClip?: string;
  vocabularyHighlights?: {
    word: string;
    meaning: string;
    vibeNote?: string;
  }[];
}

export interface StoryChoiceOption {
  id: string;
  text: string;
  translation: string;
  vibeTag: string; // e.g., "Street Smart (+25 Vibe)", "Cautious Guest (+10 Vibe)"
  consequenceText: string;
  vibeScoreDelta: number;
}

export interface StoryChapter {
  id: string;
  language: LanguageCode;
  level: CEFRLevel;
  title: string;
  location: string;
  sceneBackdrop: string;
  atmosphericDescription: string;
  dialogue: StoryDialogueLine[];
  choices: StoryChoiceOption[];
  comprehensionQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

// Conversation Roleplay
export interface RoleplayPersona {
  id: string;
  language: LanguageCode;
  name: string;
  avatar: string;
  role: string;
  setting: string;
  personality: string;
  starterMessage: string;
  starterTranslation: string;
  vibeGuide: string;
}

export interface ConversationTurn {
  id: string;
  sender: 'user' | 'persona';
  text: string;
  translation?: string;
  timestamp: number;
  vibeScore?: number;
  vibeFeedback?: string;
  nativeAlternative?: string;
  grammarFix?: string | null;
}

// Gamification Badges
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'vibe' | 'streak' | 'story' | 'grammar';
  unlockedCondition: string;
}

// Adaptive Recommendation
export interface AdaptiveRecommendation {
  recommendedModuleType: 'vibe' | 'grammar' | 'story' | 'roleplay';
  moduleId: string;
  moduleTitle: string;
  rationale: string;
  focusConcept: string;
  predictedMasteryGain: number;
  urgency: 'high' | 'medium' | 'flow';
}

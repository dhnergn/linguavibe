import { LearnerProfile, LanguageCode, AdaptiveRecommendation, MistakeRecord } from '../types';
import { VIBE_EXERCISES, GRAMMAR_EXERCISES, STORY_CHAPTERS, ROLEPLAY_PERSONAS } from '../data/curriculum';

const STORAGE_KEY = 'linguavibe_learner_profile_v1';

export function getInitialLearnerProfile(): LearnerProfile {
  const todayStr = new Date().toISOString().split('T')[0];
  
  return {
    name: 'Language Explorer',
    targetLanguage: 'es',
    level: 'A2',
    xp: 120,
    gems: 45,
    streakDays: 3,
    lastActiveDate: todayStr,
    streakFreezes: 2,
    abilityScores: {
      grammar: 65,
      vibeNuance: 58,
      conversationalConfidence: 62,
      comprehension: 70,
    },
    mistakes: [
      {
        id: 'm-1',
        tag: 'indirect-pronouns',
        concept: 'Double Object Pronouns order (People before Things)',
        userAnswer: 'Él lo me dio',
        correctAnswer: 'Él me lo dio',
        timestamp: Date.now() - 3600000 * 24,
      }
    ],
    completedLessonIds: [],
    unlockedBadgeIds: ['first-vibe', 'streak-3'],
    dailyGoalXp: 50,
    todayXp: 20,
    soundEnabled: true,
  };
}

export function loadLearnerProfile(): LearnerProfile {
  if (typeof window === 'undefined') return getInitialLearnerProfile();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialLearnerProfile();
      saveLearnerProfile(initial);
      return initial;
    }
    const profile: LearnerProfile = JSON.parse(raw);
    
    // Check daily streak status on load
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (profile.lastActiveDate === today) {
      // Already active today
    } else if (profile.lastActiveDate === yesterday) {
      // Kept streak alive, reset todayXp for new day
      profile.todayXp = 0;
    } else {
      // Missed more than 1 day: check if streak freeze protects it
      const daysDiff = Math.round((new Date(today).getTime() - new Date(profile.lastActiveDate).getTime()) / 86400000);
      if (daysDiff === 2 && profile.streakFreezes > 0) {
        profile.streakFreezes -= 1;
        // Streak preserved thanks to freeze!
      } else if (daysDiff > 1) {
        profile.streakDays = 1; // Reset to 1 on return
      }
      profile.todayXp = 0;
    }

    return profile;
  } catch (e) {
    console.error('Failed to load profile from localStorage', e);
    return getInitialLearnerProfile();
  }
}

export function saveLearnerProfile(profile: LearnerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

/**
 * Adaptive Recommendation Engine
 * Analyzes the student's multi-vector cognitive model (Grammar, Vibe, Confidence, Comprehension)
 * plus mistake history to prescribe the exact next high-leverage lesson.
 */
export function getAdaptiveRecommendation(profile: LearnerProfile): AdaptiveRecommendation {
  const { abilityScores, mistakes, targetLanguage } = profile;
  const lang = targetLanguage;

  // 1. Check if recent mistake in grammar requires living contextual repair
  if (mistakes.length > 0 && abilityScores.grammar < 70) {
    const recentMistake = mistakes[mistakes.length - 1];
    const grammarExercises = GRAMMAR_EXERCISES[lang] || GRAMMAR_EXERCISES['es'];
    const matchingExercise = grammarExercises[0];
    
    return {
      recommendedModuleType: 'grammar',
      moduleId: matchingExercise.id,
      moduleTitle: matchingExercise.title,
      rationale: `Cognitive audit: You hesitated on ${recentMistake.concept}. The algorithm avoids dry rote repetition by prescribing an interactive syntax puzzle.`,
      focusConcept: matchingExercise.targetConcept,
      predictedMasteryGain: 12,
      urgency: 'high',
    };
  }

  // 2. Check for "Textbook Syndrome" (Grammar is high, but Vibe Nuance is lower)
  if (abilityScores.grammar >= 65 && abilityScores.vibeNuance < abilityScores.grammar) {
    const vibeList = VIBE_EXERCISES[lang] || VIBE_EXERCISES['es'];
    const chosen = vibeList.find(v => !profile.completedLessonIds.includes(v.id)) || vibeList[0];

    return {
      recommendedModuleType: 'vibe',
      moduleId: chosen.id,
      moduleTitle: chosen.title,
      rationale: 'Algorithm diagnosis: Your textbook grammar is solid, but native speakers rely on colloquial subtext. Vibe practice will eliminate robotic phrasing.',
      focusConcept: chosen.title,
      predictedMasteryGain: 15,
      urgency: 'medium',
    };
  }

  // 3. Conversational Fluency Deficit
  if (abilityScores.conversationalConfidence < 65) {
    const personas = ROLEPLAY_PERSONAS[lang] || ROLEPLAY_PERSONAS['es'];
    const persona = personas[0];

    return {
      recommendedModuleType: 'roleplay',
      moduleId: persona.id,
      moduleTitle: `Casual Banter with ${persona.name}`,
      rationale: 'Cognitive pacing: Low-pressure interactive dialogue helps convert passive knowledge into spontaneous real-time reflex.',
      focusConcept: 'Conversational Pacing & Local Slang',
      predictedMasteryGain: 18,
      urgency: 'flow',
    };
  }

  // 4. Narrative Immersion
  const stories = STORY_CHAPTERS[lang] || STORY_CHAPTERS['es'];
  const story = stories[0];

  return {
    recommendedModuleType: 'story',
    moduleId: story.id,
    moduleTitle: story.title,
    rationale: 'Flow recommendation: Interactive branching stories create memorable episodic memories, connecting grammar and vibe into lived experiences.',
    focusConcept: 'Contextual Comprehension & Decision Agility',
    predictedMasteryGain: 20,
    urgency: 'flow',
  };
}

/**
 * Updates profile state after completing an exercise
 */
export function recordExerciseCompletion(
  currentProfile: LearnerProfile,
  type: 'vibe' | 'grammar' | 'story' | 'roleplay',
  xpGained: number,
  lessonId: string,
  newMistake?: MistakeRecord
): { updatedProfile: LearnerProfile; streakIncreased: boolean; leveledUp: boolean } {
  const today = new Date().toISOString().split('T')[0];
  let streakIncreased = false;
  let newStreak = currentProfile.streakDays;

  if (currentProfile.lastActiveDate !== today) {
    newStreak += 1;
    streakIncreased = true;
  }

  const prevXp = currentProfile.xp;
  const newXp = prevXp + xpGained;
  const newGems = currentProfile.gems + Math.max(5, Math.floor(xpGained / 5));

  // Recalculate ability scores
  const newScores = { ...currentProfile.abilityScores };
  if (type === 'vibe') {
    newScores.vibeNuance = Math.min(100, newScores.vibeNuance + 4);
    newScores.conversationalConfidence = Math.min(100, newScores.conversationalConfidence + 2);
  } else if (type === 'grammar') {
    newScores.grammar = Math.min(100, newScores.grammar + 4);
  } else if (type === 'story') {
    newScores.comprehension = Math.min(100, newScores.comprehension + 4);
    newScores.vibeNuance = Math.min(100, newScores.vibeNuance + 2);
  } else if (type === 'roleplay') {
    newScores.conversationalConfidence = Math.min(100, newScores.conversationalConfidence + 5);
    newScores.vibeNuance = Math.min(100, newScores.vibeNuance + 3);
  }

  const updatedMistakes = newMistake 
    ? [...currentProfile.mistakes.slice(-9), newMistake] 
    : currentProfile.mistakes;

  const completedIds = Array.from(new Set([...currentProfile.completedLessonIds, lessonId]));

  // Check badges
  const unlockedBadges = [...currentProfile.unlockedBadgeIds];
  if (newStreak >= 3 && !unlockedBadges.includes('streak-3')) unlockedBadges.push('streak-3');
  if (newStreak >= 7 && !unlockedBadges.includes('streak-7')) unlockedBadges.push('streak-7');
  if (type === 'vibe' && !unlockedBadges.includes('first-vibe')) unlockedBadges.push('first-vibe');
  if (type === 'story' && !unlockedBadges.includes('story-explorer')) unlockedBadges.push('story-explorer');

  // Level determination: A1 (0-150), A2 (150-400), B1 (400-800), B2 (800+)
  const prevLevel = currentProfile.level;
  let newLevel = prevLevel;
  if (newXp >= 800) newLevel = 'B2';
  else if (newXp >= 400) newLevel = 'B1';
  else if (newXp >= 150) newLevel = 'A2';
  else newLevel = 'A1';

  const leveledUp = newLevel !== prevLevel;

  const updatedProfile: LearnerProfile = {
    ...currentProfile,
    xp: newXp,
    gems: newGems,
    streakDays: newStreak,
    lastActiveDate: today,
    todayXp: currentProfile.todayXp + xpGained,
    abilityScores: newScores,
    mistakes: updatedMistakes,
    completedLessonIds: completedIds,
    unlockedBadgeIds: unlockedBadges,
    level: newLevel,
  };

  saveLearnerProfile(updatedProfile);
  return { updatedProfile, streakIncreased, leveledUp };
}

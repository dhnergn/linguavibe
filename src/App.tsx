/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LearnerProfile, 
  LanguageCode, 
  AdaptiveRecommendation 
} from './types';
import { 
  loadLearnerProfile, 
  saveLearnerProfile, 
  getAdaptiveRecommendation, 
  recordExerciseCompletion 
} from './services/adaptiveEngine';
import { Header } from './components/Header';
import { AdaptiveHome } from './components/AdaptiveHome';
import { VibeLearningView } from './components/VibeLearningView';
import { GrammarLabView } from './components/GrammarLabView';
import { StoryModeView } from './components/StoryModeView';
import { ConversationView } from './components/ConversationView';
import { DiagnosticModal } from './components/DiagnosticModal';
import { RewardModal } from './components/RewardModal';

export default function App() {
  const [profile, setProfile] = useState<LearnerProfile>(() => loadLearnerProfile());
  const [currentView, setCurrentView] = useState<'home' | 'vibe' | 'grammar' | 'story' | 'roleplay'>('home');
  const [activeModuleId, setActiveModuleId] = useState<string | undefined>(undefined);
  
  // Modals
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [rewardData, setRewardData] = useState<{
    isOpen: boolean;
    xpGained: number;
    streakDays: number;
    streakIncreased: boolean;
    leveledUp: boolean;
    newLevel?: string;
  }>({
    isOpen: false,
    xpGained: 0,
    streakDays: profile.streakDays,
    streakIncreased: false,
    leveledUp: false,
  });

  // Calculate dynamic adaptive recommendation
  const recommendation: AdaptiveRecommendation = getAdaptiveRecommendation(profile);

  // Sync profile changes to localStorage
  useEffect(() => {
    saveLearnerProfile(profile);
  }, [profile]);

  const handleLanguageChange = (newLang: LanguageCode) => {
    setProfile(prev => ({
      ...prev,
      targetLanguage: newLang,
    }));
    setCurrentView('home');
    setActiveModuleId(undefined);
  };

  const handleToggleSound = () => {
    setProfile(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  const handleSelectModule = (type: 'vibe' | 'grammar' | 'story' | 'roleplay', moduleId?: string) => {
    setActiveModuleId(moduleId);
    setCurrentView(type);
  };

  const handleExerciseCompleted = (
    type: 'vibe' | 'grammar' | 'story' | 'roleplay',
    xp: number,
    lessonId: string,
    mistakeMade?: boolean
  ) => {
    const { updatedProfile, streakIncreased, leveledUp } = recordExerciseCompletion(
      profile,
      type,
      xp,
      lessonId,
      mistakeMade ? {
        id: `m-${Date.now()}`,
        tag: 'grammar-slip',
        concept: 'Word order and contextual syntax',
        userAnswer: 'Inverted word order',
        correctAnswer: 'Target sequence',
        timestamp: Date.now(),
      } : undefined
    );

    setProfile(updatedProfile);

    // Show celebration reward modal
    setRewardData({
      isOpen: true,
      xpGained: xp,
      streakDays: updatedProfile.streakDays,
      streakIncreased,
      leveledUp,
      newLevel: updatedProfile.level,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Header */}
      <Header
        profile={profile}
        onLanguageChange={handleLanguageChange}
        onToggleSound={handleToggleSound}
        onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        currentView={currentView}
        onNavigateHome={() => {
          setCurrentView('home');
          setActiveModuleId(undefined);
        }}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentView === 'home' && (
          <AdaptiveHome
            profile={profile}
            recommendation={recommendation}
            onSelectModule={handleSelectModule}
            onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
          />
        )}

        {currentView === 'vibe' && (
          <VibeLearningView
            profile={profile}
            initialExerciseId={activeModuleId}
            onBack={() => {
              setCurrentView('home');
              setActiveModuleId(undefined);
            }}
            onCompleteExercise={(xp, lessonId) => {
              handleExerciseCompleted('vibe', xp, lessonId);
            }}
          />
        )}

        {currentView === 'grammar' && (
          <GrammarLabView
            profile={profile}
            initialExerciseId={activeModuleId}
            onBack={() => {
              setCurrentView('home');
              setActiveModuleId(undefined);
            }}
            onCompleteExercise={(xp, lessonId, mistake) => {
              handleExerciseCompleted('grammar', xp, lessonId, mistake);
            }}
          />
        )}

        {currentView === 'story' && (
          <StoryModeView
            profile={profile}
            initialStoryId={activeModuleId}
            onBack={() => {
              setCurrentView('home');
              setActiveModuleId(undefined);
            }}
            onCompleteStory={(xp, storyId) => {
              handleExerciseCompleted('story', xp, storyId);
            }}
          />
        )}

        {currentView === 'roleplay' && (
          <ConversationView
            profile={profile}
            initialPersonaId={activeModuleId}
            onBack={() => {
              setCurrentView('home');
              setActiveModuleId(undefined);
            }}
            onCompleteSession={(xp, personaId) => {
              handleExerciseCompleted('roleplay', xp, personaId);
            }}
          />
        )}
      </main>

      {/* Footer info */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">LinguaVibe</span>
            <span>·</span>
            <span>Adaptive Cognitive Language Studio</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Dynamic Ability Calibration</span>
            <span>·</span>
            <span>Vibe Nuance & Living Context</span>
          </div>
        </div>
      </footer>

      {/* Transparent Cognitive Diagnostic Modal */}
      <DiagnosticModal
        profile={profile}
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onRecalibrate={(newDiagnosis) => {
          // Handled inside modal
        }}
      />

      {/* Gamified Rewards Modal */}
      <RewardModal
        isOpen={rewardData.isOpen}
        xpGained={rewardData.xpGained}
        streakDays={rewardData.streakDays}
        streakIncreased={rewardData.streakIncreased}
        leveledUp={rewardData.leveledUp}
        newLevel={rewardData.newLevel}
        soundEnabled={profile.soundEnabled}
        onClose={() => setRewardData(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

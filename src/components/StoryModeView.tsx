import React, { useState } from 'react';
import { 
  BookOpen, 
  Volume2, 
  ArrowLeft, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  HelpCircle, 
  MapPin, 
  ArrowRight,
  Loader2,
  GitBranch
} from 'lucide-react';
import { StoryChapter, LearnerProfile, StoryChoiceOption } from '../types';
import { STORY_CHAPTERS } from '../data/curriculum';
import { playProceduralSound, speakText } from '../utils/audio';

interface StoryModeViewProps {
  profile: LearnerProfile;
  initialStoryId?: string;
  onBack: () => void;
  onCompleteStory: (xp: number, storyId: string) => void;
}

export const StoryModeView: React.FC<StoryModeViewProps> = ({
  profile,
  initialStoryId,
  onBack,
  onCompleteStory,
}) => {
  const stories = STORY_CHAPTERS[profile.targetLanguage] || STORY_CHAPTERS['es'];
  const [currentChapter, setCurrentChapter] = useState<StoryChapter>(() => {
    if (initialStoryId) {
      const found = stories.find(s => s.id === initialStoryId);
      if (found) return found;
    }
    return stories[0];
  });

  const [selectedChoice, setSelectedChoice] = useState<StoryChoiceOption | null>(null);
  const [playingAudioIndex, setPlayingAudioIndex] = useState<number | null>(null);
  const [showTranslations, setShowTranslations] = useState(false);

  // Comprehension quiz state
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Dynamic continuation via Gemini API
  const [isGeneratingContinuation, setIsGeneratingContinuation] = useState(false);

  const handlePlayDialogue = (text: string, index: number) => {
    setPlayingAudioIndex(index);
    speakText(text, profile.targetLanguage, () => {
      setPlayingAudioIndex(null);
    });
  };

  const handleSelectChoice = (choice: StoryChoiceOption) => {
    playProceduralSound('tap', profile.soundEnabled);
    setSelectedChoice(choice);
    if (choice.vibeScoreDelta > 0) {
      playProceduralSound('vibe-sparkle', profile.soundEnabled);
    }
  };

  const handleQuizSubmit = () => {
    if (quizSelectedOption === null) return;
    setQuizSubmitted(true);
    if (quizSelectedOption === currentChapter.comprehensionQuiz.correctIndex) {
      playProceduralSound('success', profile.soundEnabled);
    } else {
      playProceduralSound('error', profile.soundEnabled);
    }
  };

  const handleGenerateNextBranch = async () => {
    if (!selectedChoice) return;
    setIsGeneratingContinuation(true);
    playProceduralSound('tap', profile.soundEnabled);

    try {
      const res = await fetch('/api/gemini/generate-story-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: profile.targetLanguage,
          level: profile.level,
          scenario: currentChapter.title,
          pastChoice: selectedChoice.text,
          pastOutcome: selectedChoice.consequenceText,
        }),
      });

      const data = await res.json();
      if (data.chapter) {
        const newChapter: StoryChapter = {
          id: `dyn-${Date.now()}`,
          language: profile.targetLanguage,
          level: profile.level,
          title: data.chapter.title || 'The Journey Continues',
          location: currentChapter.location,
          sceneBackdrop: 'Deeper into the neighborhood, local ambiance shifts.',
          atmosphericDescription: data.chapter.sceneDescription || 'The night unfolds with unexpected encounters.',
          dialogue: (data.chapter.dialogue || []).map((d: any) => ({
            speaker: d.speaker || 'Local',
            speakerRole: 'Character',
            text: d.text,
            translation: d.translation,
          })),
          choices: (data.chapter.choices || []).map((c: any) => ({
            id: c.id,
            text: c.label || c.text,
            translation: c.label || '',
            vibeTag: c.vibeImpact || 'Interactive Decision (+15 Vibe)',
            consequenceText: c.nextScenePreview || 'The dialogue shifts smoothly.',
            vibeScoreDelta: 15,
          })),
          comprehensionQuiz: data.chapter.challengeQuestion || currentChapter.comprehensionQuiz,
        };

        setCurrentChapter(newChapter);
        setSelectedChoice(null);
        setQuizSelectedOption(null);
        setQuizSubmitted(false);
      }
    } catch (e) {
      console.error('Failed to generate story branch', e);
    } finally {
      setIsGeneratingContinuation(false);
    }
  };

  const handleFinishStory = () => {
    playProceduralSound('success', profile.soundEnabled);
    onCompleteStory(35, currentChapter.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            playProceduralSound('tap', profile.soundEnabled);
            onBack();
          }}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Hub</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTranslations(!showTranslations)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
              showTranslations 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {showTranslations ? 'Translations On' : 'Translations Off'}
          </button>
          <span className="text-xs text-slate-400 font-mono">
            Story Mode · {profile.level}
          </span>
        </div>
      </div>

      {/* Atmospheric Story Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl space-y-6">
        {/* Scene Backdrop Header */}
        <div className="relative p-6 md:p-8 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{currentChapter.location}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
            {currentChapter.title}
          </h2>

          <p className="text-xs md:text-sm text-slate-300 mt-2 italic leading-relaxed">
            {currentChapter.atmosphericDescription}
          </p>
        </div>

        {/* Dialogue Flow */}
        <div className="px-6 md:px-8 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Live Scene Dialogue
          </div>

          <div className="space-y-3">
            {currentChapter.dialogue.map((line, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400">
                      {line.speaker}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({line.speakerRole})
                    </span>
                  </div>

                  <p className="text-sm md:text-base text-white font-medium">
                    {line.text}
                  </p>

                  {showTranslations && (
                    <p className="text-xs text-slate-400 italic">
                      {line.translation}
                    </p>
                  )}

                  {/* Vocabulary Highlights */}
                  {line.vocabularyHighlights && line.vocabularyHighlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1.5">
                      {line.vocabularyHighlights.map((vocab, vIdx) => (
                        <span 
                          key={vIdx}
                          className="text-[11px] px-2 py-0.5 rounded bg-slate-800/90 text-teal-300 border border-teal-500/20"
                          title={vocab.vibeNote || vocab.meaning}
                        >
                          <strong>{vocab.word}</strong>: {vocab.meaning}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handlePlayDialogue(line.text, idx)}
                  className={`p-2 rounded-lg shrink-0 transition ${
                    playingAudioIndex === idx
                      ? 'bg-emerald-500 text-slate-950 scale-105'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                  title="Speak line"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Branching Decision Choice */}
        <div className="px-6 md:px-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            <span>How do you respond? Choose your path:</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {currentChapter.choices.map((choice) => {
              const isSelected = selectedChoice?.id === choice.id;
              return (
                <button
                  key={choice.id}
                  onClick={() => handleSelectChoice(choice)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm md:text-base font-semibold text-white">
                      {choice.text}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                      {choice.vibeTag}
                    </span>
                  </div>

                  {showTranslations && (
                    <span className="text-xs text-slate-400 italic">
                      {choice.translation}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Consequence Reveal */}
          {selectedChoice && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 animate-in fade-in duration-200">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                Immediate Consequence
              </span>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                {selectedChoice.consequenceText}
              </p>
            </div>
          )}
        </div>

        {/* In-Scene Comprehension Quiz */}
        {selectedChoice && (
          <div className="px-6 md:px-8 space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <HelpCircle className="w-4 h-4" />
                <span>Scene Comprehension Check</span>
              </div>

              <p className="text-sm text-white font-medium">
                {currentChapter.comprehensionQuiz.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentChapter.comprehensionQuiz.options.map((opt, oIdx) => {
                  const isOptSelected = quizSelectedOption === oIdx;
                  let optStyle = 'border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-300';

                  if (quizSubmitted) {
                    if (oIdx === currentChapter.comprehensionQuiz.correctIndex) {
                      optStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold';
                    } else if (isOptSelected) {
                      optStyle = 'border-amber-500 bg-amber-500/15 text-amber-300';
                    } else {
                      optStyle = 'opacity-40 border-slate-800 text-slate-500';
                    }
                  } else if (isOptSelected) {
                    optStyle = 'border-emerald-500 bg-emerald-500/10 text-white';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => {
                        if (quizSubmitted) return;
                        playProceduralSound('tap', profile.soundEnabled);
                        setQuizSelectedOption(oIdx);
                      }}
                      disabled={quizSubmitted}
                      className={`p-3 rounded-lg border text-xs text-left transition ${optStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={quizSelectedOption === null}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify Comprehension
                </button>
              ) : (
                <div className="text-xs text-slate-300 p-2.5 rounded-lg bg-slate-900 border border-slate-800 leading-relaxed">
                  <strong className="text-white">Explanation: </strong>
                  {currentChapter.comprehensionQuiz.explanation}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-6 md:p-8 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleGenerateNextBranch}
            disabled={!selectedChoice || isGeneratingContinuation}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingContinuation ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Weaving Story Branch with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Explore Next Chapter Branch</span>
              </>
            )}
          </button>

          <button
            onClick={handleFinishStory}
            disabled={!selectedChoice}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-semibold text-xs tracking-wide shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Complete Chapter (+35 XP)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Compass, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { GrammarExercise, LearnerProfile } from '../types';
import { GRAMMAR_EXERCISES } from '../data/curriculum';
import { playProceduralSound } from '../utils/audio';

interface GrammarLabViewProps {
  profile: LearnerProfile;
  initialExerciseId?: string;
  onBack: () => void;
  onCompleteExercise: (xp: number, lessonId: string, mistakeMade?: boolean) => void;
}

export const GrammarLabView: React.FC<GrammarLabViewProps> = ({
  profile,
  initialExerciseId,
  onBack,
  onCompleteExercise,
}) => {
  const exercises = GRAMMAR_EXERCISES[profile.targetLanguage] || GRAMMAR_EXERCISES['es'];
  
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialExerciseId) {
      const idx = exercises.findIndex(e => e.id === initialExerciseId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const currentExercise = exercises[currentIndex] || exercises[0];

  // State for Sentence Architect
  const [placedTokens, setPlacedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>(() => {
    if (currentExercise.tokens) {
      // Shuffle slightly
      return [...currentExercise.tokens].sort(() => 0.5 - Math.random());
    }
    return [];
  });

  // State for Context Conjugation
  const [selectedConjugation, setSelectedConjugation] = useState<string | null>(null);

  // State for Error Spotter
  const [selectedErrorWordIndex, setSelectedErrorWordIndex] = useState<number | null>(null);

  // Submission state
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Reset exercise state when navigating to next exercise
  const resetForExercise = (exercise: GrammarExercise) => {
    setPlacedTokens([]);
    if (exercise.tokens) {
      setAvailableTokens([...exercise.tokens].sort(() => 0.5 - Math.random()));
    } else {
      setAvailableTokens([]);
    }
    setSelectedConjugation(null);
    setSelectedErrorWordIndex(null);
    setHasSubmitted(false);
    setIsCorrect(false);
  };

  // Sentence Architect handlers
  const handlePlaceToken = (token: string, fromIndex: number) => {
    if (hasSubmitted) return;
    playProceduralSound('tap', profile.soundEnabled);
    setPlacedTokens([...placedTokens, token]);
    const updated = [...availableTokens];
    updated.splice(fromIndex, 1);
    setAvailableTokens(updated);
  };

  const handleRemoveToken = (token: string, placedIndex: number) => {
    if (hasSubmitted) return;
    playProceduralSound('tap', profile.soundEnabled);
    const updatedPlaced = [...placedTokens];
    updatedPlaced.splice(placedIndex, 1);
    setPlacedTokens(updatedPlaced);
    setAvailableTokens([...availableTokens, token]);
  };

  const handleResetTokens = () => {
    if (hasSubmitted) return;
    playProceduralSound('tap', profile.soundEnabled);
    if (currentExercise.tokens) {
      setPlacedTokens([]);
      setAvailableTokens([...currentExercise.tokens]);
    }
  };

  const handleSubmit = () => {
    let correct = false;

    if (currentExercise.type === 'sentence-architect') {
      const targetOrder = currentExercise.correctTokenOrder || [];
      correct = placedTokens.length === targetOrder.length && placedTokens.every((t, i) => t === targetOrder[i]);
    } else if (currentExercise.type === 'context-conjugation') {
      correct = selectedConjugation === currentExercise.fillInBlank?.correctForm;
    } else if (currentExercise.type === 'error-spotter') {
      correct = selectedErrorWordIndex === currentExercise.sentenceWithSpotter?.errorIndex;
    }

    setIsCorrect(correct);
    setHasSubmitted(true);

    if (correct) {
      playProceduralSound('success', profile.soundEnabled);
    } else {
      playProceduralSound('error', profile.soundEnabled);
    }
  };

  const handleNext = () => {
    playProceduralSound('tap', profile.soundEnabled);
    onCompleteExercise(currentExercise.xp || 25, currentExercise.id, !isCorrect);

    if (currentIndex < exercises.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      resetForExercise(exercises[nextIdx]);
    } else {
      onBack();
    }
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

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span>Grammar Lab {currentIndex + 1} of {exercises.length}</span>
        </div>
      </div>

      {/* Main Exercise Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
              {currentExercise.type.replace('-', ' ')}
            </span>
            <span className="text-xs text-slate-400">· Focus: {currentExercise.targetConcept}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-white">
            {currentExercise.title}
          </h2>
          <p className="text-sm text-slate-300">
            {currentExercise.instruction}
          </p>
        </div>

        {/* English context prompt */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
            Contextual Meaning
          </div>
          <p className="text-base md:text-lg font-medium text-white italic">
            "{currentExercise.englishMeaning}"
          </p>
          <p className="text-xs text-slate-400">
            Situation: {currentExercise.sentenceContext}
          </p>
        </div>

        {/* 1. SENTENCE ARCHITECT INTERACTIVE AREA */}
        {currentExercise.type === 'sentence-architect' && (
          <div className="space-y-6 pt-2">
            {/* Construction Line */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Constructed Sentence:</span>
                {placedTokens.length > 0 && !hasSubmitted && (
                  <button
                    onClick={handleResetTokens}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              <div className="min-h-16 p-3 rounded-xl bg-slate-950/90 border border-slate-700/80 flex flex-wrap items-center gap-2.5">
                {placedTokens.length === 0 ? (
                  <span className="text-xs text-slate-500 italic pl-1">
                    Tap word tokens below in order to build your sentence...
                  </span>
                ) : (
                  placedTokens.map((token, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRemoveToken(token, idx)}
                      disabled={hasSubmitted}
                      className="px-3.5 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-sm font-semibold transition-all hover:scale-95 shadow-sm"
                    >
                      {token}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Available Tokens Pool */}
            <div className="space-y-2">
              <div className="text-xs text-slate-400">Available tokens:</div>
              <div className="flex flex-wrap gap-2.5 min-h-12 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                {availableTokens.map((token, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePlaceToken(token, idx)}
                    disabled={hasSubmitted}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-medium transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    {token}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. CONTEXTUAL CONJUGATION INTERACTIVE AREA */}
        {currentExercise.type === 'context-conjugation' && currentExercise.fillInBlank && (
          <div className="space-y-6 pt-2">
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 text-lg md:text-xl font-medium text-white flex flex-wrap items-center gap-2">
              <span>{currentExercise.fillInBlank.prefix}</span>
              <span className={`px-4 py-1 rounded-lg border min-w-28 text-center transition ${
                selectedConjugation
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500 font-bold'
                  : 'bg-slate-900 border-dashed border-slate-700 text-slate-500'
              }`}>
                {selectedConjugation || `[ ${currentExercise.fillInBlank.verbBase} ]`}
              </span>
              <span>{currentExercise.fillInBlank.suffix}</span>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-slate-400">Select the nuanced verb mood:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentExercise.fillInBlank.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (hasSubmitted) return;
                      playProceduralSound('tap', profile.soundEnabled);
                      setSelectedConjugation(opt);
                    }}
                    disabled={hasSubmitted}
                    className={`p-3 rounded-xl border text-sm font-medium transition ${
                      selectedConjugation === opt
                        ? 'bg-indigo-500/20 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. ERROR SPOTTER INTERACTIVE AREA */}
        {currentExercise.type === 'error-spotter' && currentExercise.sentenceWithSpotter && (
          <div className="space-y-6 pt-2">
            <div className="text-xs text-slate-400">
              Tap the word containing the grammatical slip:
            </div>
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap gap-2 text-base md:text-lg">
              {currentExercise.sentenceWithSpotter.words.map((word, idx) => {
                const isSelected = selectedErrorWordIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (hasSubmitted) return;
                      playProceduralSound('tap', profile.soundEnabled);
                      setSelectedErrorWordIndex(idx);
                    }}
                    disabled={hasSubmitted}
                    className={`px-2.5 py-1 rounded-md transition ${
                      isSelected
                        ? 'bg-amber-500/20 border border-amber-500 text-amber-200 font-bold underline'
                        : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Feedback Area upon submit */}
        {hasSubmitted && (
          <div className={`p-4 rounded-xl border space-y-2 animate-in fade-in duration-200 ${
            isCorrect 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
          }`}>
            <div className="flex items-center gap-2 font-semibold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Syntax Intact! Excellent Structural Grasp (+{currentExercise.xp} XP)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Grammar Slip Identified</span>
                </>
              )}
            </div>

            <p className="text-xs md:text-sm leading-relaxed text-slate-300">
              {currentExercise.explanation}
            </p>

            {currentExercise.correctTokenOrder && (
              <div className="pt-2 text-xs font-mono text-slate-400">
                Correct order: <strong className="text-white">{currentExercise.correctTokenOrder.join(' ')}</strong>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 flex items-center justify-end gap-3">
          {!hasSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={
                (currentExercise.type === 'sentence-architect' && placedTokens.length === 0) ||
                (currentExercise.type === 'context-conjugation' && !selectedConjugation) ||
                (currentExercise.type === 'error-spotter' && selectedErrorWordIndex === null)
              }
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-400 hover:to-emerald-400 text-white font-display font-semibold text-sm tracking-wide shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Grammar
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-semibold text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <span>{currentIndex < exercises.length - 1 ? 'Next Grammar Puzzle' : 'Finish Session'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

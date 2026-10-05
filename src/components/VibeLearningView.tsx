import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Info, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { VibeExercise, LearnerProfile, LanguageCode } from '../types';
import { VIBE_EXERCISES } from '../data/curriculum';
import { playProceduralSound, speakText } from '../utils/audio';

interface VibeLearningViewProps {
  profile: LearnerProfile;
  initialExerciseId?: string;
  onBack: () => void;
  onCompleteExercise: (xp: number, lessonId: string) => void;
}

export const VibeLearningView: React.FC<VibeLearningViewProps> = ({
  profile,
  initialExerciseId,
  onBack,
  onCompleteExercise,
}) => {
  const langExercises = VIBE_EXERCISES[profile.targetLanguage] || VIBE_EXERCISES['es'];
  
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialExerciseId) {
      const idx = langExercises.findIndex(e => e.id === initialExerciseId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentExercise = langExercises[currentIndex] || langExercises[0];
  const selectedOption = selectedOptionIndex !== null ? currentExercise.options[selectedOptionIndex] : null;

  const handlePlayAudio = (text: string) => {
    setIsPlayingAudio(true);
    speakText(text, profile.targetLanguage, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    playProceduralSound('tap', profile.soundEnabled);
    setSelectedOptionIndex(idx);
  };

  const handleSubmit = () => {
    if (selectedOptionIndex === null) return;
    setHasSubmitted(true);
    const chosen = currentExercise.options[selectedOptionIndex];
    if (chosen.isBestChoice) {
      playProceduralSound('vibe-sparkle', profile.soundEnabled);
    } else {
      playProceduralSound('error', profile.soundEnabled);
    }
  };

  const handleNext = () => {
    playProceduralSound('tap', profile.soundEnabled);
    const xp = selectedOption?.xp || 20;
    onCompleteExercise(xp, currentExercise.id);

    if (currentIndex < langExercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptionIndex(null);
      setHasSubmitted(false);
    } else {
      onBack();
    }
  };

  const getVibeBadge = (rating: string) => {
    switch (rating) {
      case 'spot-on':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Spot-on Vibe 🌟</span>;
      case 'too-formal':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">Too Formal 👔</span>;
      case 'awkward':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Awkward / Blunt 😬</span>;
      case 'overly-casual':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">Overly Casual / Impolite ⚠️</span>;
      default:
        return null;
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
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Vibe Challenge {currentIndex + 1} of {langExercises.length}</span>
        </div>
      </div>

      {/* Main Exercise Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
              {currentExercise.type.replace('-', ' ')}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-white">
            {currentExercise.title}
          </h2>
        </div>

        {/* Real-world Situation Box */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>The Situation</span>
          </div>
          <p className="text-sm md:text-base text-slate-200 leading-relaxed">
            {currentExercise.situation}
          </p>
        </div>

        {/* Cultural Context Brief */}
        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs md:text-sm text-amber-200/90 leading-relaxed flex items-start gap-2.5">
          <span className="text-base leading-none mt-0.5">💡</span>
          <div>
            <strong className="text-amber-300 font-semibold">Cultural Subtext: </strong>
            {currentExercise.culturalContext}
          </div>
        </div>

        {/* Audio phrase if present */}
        {currentExercise.audioPhrase && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400 font-mono">Native Acoustic Reference</span>
              <p className="text-sm font-medium text-white italic">
                "{currentExercise.audioPhrase}"
              </p>
            </div>
            <button
              onClick={() => handlePlayAudio(currentExercise.audioPhrase!)}
              className={`p-2.5 rounded-lg transition ${
                isPlayingAudio ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
              title="Listen to native pronunciation"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Choose what you say / your reading:
          </div>

          <div className="grid grid-cols-1 gap-3">
            {currentExercise.options.map((option, idx) => {
              const isSelected = selectedOptionIndex === idx;
              let borderStyle = 'border-slate-800 hover:border-slate-700 bg-slate-950/60';

              if (hasSubmitted) {
                if (option.isBestChoice) {
                  borderStyle = 'border-emerald-500/80 bg-emerald-500/10 text-emerald-200';
                } else if (isSelected && !option.isBestChoice) {
                  borderStyle = 'border-amber-500/80 bg-amber-500/10 text-amber-200';
                } else {
                  borderStyle = 'border-slate-800/50 bg-slate-950/30 opacity-50';
                }
              } else if (isSelected) {
                borderStyle = 'border-emerald-500 bg-emerald-500/5 text-white ring-1 ring-emerald-500/30';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasSubmitted}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between gap-2 ${borderStyle}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm md:text-base font-medium leading-snug">
                      {option.text}
                    </span>
                    {hasSubmitted && getVibeBadge(option.vibeRating)}
                  </div>
                  <span className="text-xs text-slate-400">
                    {option.translation}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Area upon submit */}
        {hasSubmitted && selectedOption && (
          <div className={`p-4 rounded-xl border space-y-2 animate-in fade-in duration-200 ${
            selectedOption.isBestChoice 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
          }`}>
            <div className="flex items-center gap-2 font-semibold text-sm">
              {selectedOption.isBestChoice ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Spot on! Natural Cultural Delivery (+{selectedOption.xp} XP)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Vibe Friction Detected (+{selectedOption.xp} XP)</span>
                </>
              )}
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-300">
              {selectedOption.vibeFeedback}
            </p>
            <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-400">
              <strong className="text-slate-200">Local Pro-Tip: </strong>
              {currentExercise.nativeTip}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 flex items-center justify-end gap-3">
          {!hasSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOptionIndex === null}
              className={`px-6 py-3 rounded-xl font-display font-semibold text-sm tracking-wide transition ${
                selectedOptionIndex !== null
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Verify Vibe
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-semibold text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <span>{currentIndex < langExercises.length - 1 ? 'Next Vibe Dilemma' : 'Complete Challenge'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

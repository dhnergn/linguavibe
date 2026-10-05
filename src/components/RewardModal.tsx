import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  Sparkles, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  X
} from 'lucide-react';
import { playProceduralSound } from '../utils/audio';

interface RewardModalProps {
  isOpen: boolean;
  xpGained: number;
  streakDays: number;
  streakIncreased: boolean;
  leveledUp: boolean;
  newLevel?: string;
  soundEnabled: boolean;
  onClose: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  xpGained,
  streakDays,
  streakIncreased,
  leveledUp,
  newLevel,
  soundEnabled,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      if (leveledUp) {
        playProceduralSound('level-up', soundEnabled);
      } else if (streakIncreased) {
        playProceduralSound('streak-fire', soundEnabled);
      } else {
        playProceduralSound('success', soundEnabled);
      }

      // Fire celebratory confetti blast
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#10b981', '#14b8a6', '#f59e0b', '#ec4899', '#6366f1'],
        });
      } catch (e) {
        console.warn('Confetti error', e);
      }
    }
  }, [isOpen, leveledUp, streakIncreased, soundEnabled]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 shadow-2xl p-6 md:p-8 text-center space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/30">
          {leveledUp ? (
            <Award className="w-8 h-8 text-slate-950 animate-bounce" />
          ) : streakIncreased ? (
            <Flame className="w-8 h-8 text-slate-950 animate-bounce" />
          ) : (
            <CheckCircle2 className="w-8 h-8 text-slate-950 animate-bounce" />
          )}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-extrabold text-white tracking-tight">
            {leveledUp ? 'Level Unlocked!' : streakIncreased ? 'Streak Multiplied!' : 'Lesson Complete!'}
          </h2>
          <p className="text-xs text-slate-400">
            {leveledUp
              ? `Congratulations! Your proficiency advanced to ${newLevel}.`
              : streakIncreased
              ? `You kept the momentum alive for ${streakDays} consecutive days!`
              : 'Great job staying consistent with adaptive learning.'}
          </p>
        </div>

        {/* Rewards Breakdown Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
              XP Earned
            </span>
            <div className="flex items-center justify-center gap-1 text-xl font-bold font-mono text-white">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>+{xpGained}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
              Streak
            </span>
            <div className="flex items-center justify-center gap-1 text-xl font-bold font-mono text-white">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30" />
              <span>{streakDays} Days</span>
            </div>
          </div>
        </div>

        {/* Gamified Motivation Note */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
          Daily active learning triggers deeper cognitive retention than passive repetition.
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>Continue Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

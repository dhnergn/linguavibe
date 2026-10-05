import React, { useState } from 'react';
import { 
  Brain, 
  X, 
  Target, 
  Zap, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Loader2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { LearnerProfile, LanguageCode } from '../types';
import { playProceduralSound } from '../utils/audio';

interface DiagnosticModalProps {
  profile: LearnerProfile;
  isOpen: boolean;
  onClose: () => void;
  onRecalibrate: (newScores: any) => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  profile,
  isOpen,
  onClose,
  onRecalibrate,
}) => {
  if (!isOpen) return null;

  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [diagnosticReport, setDiagnosticReport] = useState<any>(null);

  const handleRecalibrate = async () => {
    setIsRecalibrating(true);
    playProceduralSound('tap', profile.soundEnabled);

    try {
      const res = await fetch('/api/gemini/adaptive-diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: profile.targetLanguage,
          level: profile.level,
          abilityScores: profile.abilityScores,
          recentMistakes: profile.mistakes,
          completedCount: profile.completedLessonIds.length,
        }),
      });

      const data = await res.json();
      if (data.diagnosis) {
        setDiagnosticReport(data.diagnosis);
        playProceduralSound('success', profile.soundEnabled);
      }
    } catch (e) {
      console.error('Recalibrate error', e);
    } finally {
      setIsRecalibrating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-display font-bold text-white">
                Adaptive Cognitive Engine
              </h2>
              <p className="text-xs text-slate-400">
                Transparent inspection of how the algorithm personalizes your learning
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playProceduralSound('tap', profile.soundEnabled);
              onClose();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Why Not Rote Memorization? Principle Callout */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Anti-Rote Learning Philosophy</span>
          </div>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Language fluency is not an isolated database of vocabulary flashcards. LinguaVibe balances 
            <strong> Vibe Nuance</strong> (how locals actually express emotion and read social context), 
            <strong> Structural Grammar</strong> (living sentence architecture), and 
            <strong> Episodic Stories</strong> to trigger organic pattern-recognition.
          </p>
        </div>

        {/* Cognitive Vectors Grid */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Current Ability Vectors
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Grammar Logic</span>
                <span className="font-mono text-indigo-400 font-bold">{profile.abilityScores.grammar}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${profile.abilityScores.grammar}%` }} />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Vibe & Culture</span>
                <span className="font-mono text-amber-400 font-bold">{profile.abilityScores.vibeNuance}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${profile.abilityScores.vibeNuance}%` }} />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Spoken Confidence</span>
                <span className="font-mono text-pink-400 font-bold">{profile.abilityScores.conversationalConfidence}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full" style={{ width: `${profile.abilityScores.conversationalConfidence}%` }} />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Narrative Intuition</span>
                <span className="font-mono text-teal-400 font-bold">{profile.abilityScores.comprehension}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${profile.abilityScores.comprehension}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Report if generated */}
        {diagnosticReport && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in duration-150">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Algorithmic Diagnosis Summary</span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {diagnosticReport.summary}
            </p>
            <div className="text-xs text-slate-400 space-y-1 pt-1">
              <div><strong>Target growth area:</strong> <span className="text-amber-300">{diagnosticReport.weaknessDetected}</span></div>
              <div><strong>Pedagogical prescription:</strong> <span className="text-slate-300">{diagnosticReport.recommendation}</span></div>
            </div>
            {diagnosticReport.vibeTip && (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 italic">
                "{diagnosticReport.vibeTip}"
              </div>
            )}
          </div>
        )}

        {/* Recent Mistake Audit */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Mistake Memory (Organic Spaced Retention)
          </div>
          {profile.mistakes.length === 0 ? (
            <p className="text-xs text-slate-500 italic">
              No recent friction points recorded. The algorithm will introduce higher-complexity cultural idioms.
            </p>
          ) : (
            <div className="space-y-2">
              {profile.mistakes.slice(-3).map((m) => (
                <div key={m.id} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold text-amber-400">{m.concept}</span>
                    <span className="text-[10px] font-mono">{new Date(m.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="text-slate-300">
                    Attempt: <span className="line-through text-slate-500">{m.userAnswer}</span> → Target: <strong className="text-emerald-400">{m.correctAnswer}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <button
            onClick={handleRecalibrate}
            disabled={isRecalibrating}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
          >
            {isRecalibrating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Running Algorithmic Assessment...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Run Real-time AI Calibration</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

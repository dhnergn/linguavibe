import React from 'react';
import { 
  Sparkles, 
  Compass, 
  BookOpen, 
  MessageSquare, 
  Flame, 
  Brain, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  ShieldCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { LearnerProfile, AdaptiveRecommendation } from '../types';
import { SUPPORTED_LANGUAGES, INITIAL_BADGES } from '../data/languages';
import { playProceduralSound } from '../utils/audio';

interface AdaptiveHomeProps {
  profile: LearnerProfile;
  recommendation: AdaptiveRecommendation;
  onSelectModule: (moduleType: 'vibe' | 'grammar' | 'story' | 'roleplay', moduleId?: string) => void;
  onOpenDiagnostic: () => void;
}

export const AdaptiveHome: React.FC<AdaptiveHomeProps> = ({
  profile,
  recommendation,
  onSelectModule,
  onOpenDiagnostic,
}) => {
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === profile.targetLanguage) || SUPPORTED_LANGUAGES[0];

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'vibe':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'grammar':
        return <Compass className="w-5 h-5 text-indigo-400" />;
      case 'story':
        return <BookOpen className="w-5 h-5 text-emerald-400" />;
      case 'roleplay':
        return <MessageSquare className="w-5 h-5 text-pink-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getModuleBadgeColor = (type: string) => {
    switch (type) {
      case 'vibe': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'grammar': return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      case 'story': return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'roleplay': return 'bg-pink-500/10 text-pink-300 border-pink-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-10">
      {/* Hero: The Algorithm's Diagnostic Pick */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-emerald-500/25 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Brain className="w-3.5 h-3.5" />
                <span>The Algorithm's Next Recommendation</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {currentLang.name} · {profile.level} Proficiency
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              {recommendation.moduleTitle}
            </h1>

            {/* Rationale explanation: key requirement for explaining the algorithm */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs md:text-sm text-slate-300 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Why the algorithm picked this: </span>
                  <span className="text-slate-300">{recommendation.rationale}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span>Focus: <strong className="text-slate-200">{recommendation.focusConcept}</strong></span>
              <span>·</span>
              <span className="text-emerald-400 font-mono font-medium">+{recommendation.predictedMasteryGain}% Estimated Mastery</span>
              <span>·</span>
              <span>No rote memorization</span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
            <button
              onClick={() => {
                playProceduralSound('tap', profile.soundEnabled);
                onSelectModule(recommendation.recommendedModuleType, recommendation.moduleId);
              }}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Start Smart Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                playProceduralSound('tap', profile.soundEnabled);
                onOpenDiagnostic();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              <Brain className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspect Cognitive Model</span>
            </button>
          </div>
        </div>
      </section>

      {/* Fluency Vectors & Ability Model */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Contextual Grammar</span>
            <span className="font-mono text-indigo-400 font-semibold">{profile.abilityScores.grammar}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-700" 
              style={{ width: `${profile.abilityScores.grammar}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Organic syntax & living structures</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Vibe & Cultural Nuance</span>
            <span className="font-mono text-amber-400 font-semibold">{profile.abilityScores.vibeNuance}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-700" 
              style={{ width: `${profile.abilityScores.vibeNuance}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Slang, social registers & room reading</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Spoken Flow & Banter</span>
            <span className="font-mono text-pink-400 font-semibold">{profile.abilityScores.conversationalConfidence}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-pink-500 rounded-full transition-all duration-700" 
              style={{ width: `${profile.abilityScores.conversationalConfidence}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Spontaneous real-world confidence</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Story Comprehension</span>
            <span className="font-mono text-emerald-400 font-semibold">{profile.abilityScores.comprehension}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
              style={{ width: `${profile.abilityScores.comprehension}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Episodic memory & branching agility</p>
        </div>
      </section>

      {/* The 4 Core Pathways */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-white tracking-tight">
              Learning Pathways
            </h2>
            <p className="text-xs text-slate-400">
              Targeted modules balanced for cognitive variety, not monotonous flashcards
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Vibe Learning */}
          <div 
            onClick={() => {
              playProceduralSound('tap', profile.soundEnabled);
              onSelectModule('vibe');
            }}
            className="group relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 cursor-pointer transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-medium text-amber-400 uppercase tracking-wider">
                  Vibe Lab
                </span>
                <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors">
                  Vibe Learning
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Learn how locals actually speak. Read the room, tune conversational registers, and decode text slang.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-amber-400 transition-colors">
              <span>Read the Room & Tone Dial</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Grammar Lab */}
          <div 
            onClick={() => {
              playProceduralSound('tap', profile.soundEnabled);
              onSelectModule('grammar');
            }}
            className="group relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 cursor-pointer transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-medium text-indigo-400 uppercase tracking-wider">
                  Syntax Playground
                </span>
                <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  Grammar Lab
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Active sentence architecture and context-based verb moods without rote memorization charts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-indigo-400 transition-colors">
              <span>Sentence Architect & Conjugations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Story Mode */}
          <div 
            onClick={() => {
              playProceduralSound('tap', profile.soundEnabled);
              onSelectModule('story');
            }}
            className="group relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 cursor-pointer transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-medium text-emerald-400 uppercase tracking-wider">
                  Interactive Fiction
                </span>
                <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  Story Mode
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Branching narrative adventures where your dialogue choices steer the plot and test comprehension.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">
              <span>Branching Stories & Audio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Real-World Roleplay */}
          <div 
            onClick={() => {
              playProceduralSound('tap', profile.soundEnabled);
              onSelectModule('roleplay');
            }}
            className="group relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-900 cursor-pointer transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-medium text-pink-400 uppercase tracking-wider">
                  Simulated Real Life
                </span>
                <h3 className="text-base font-semibold text-white group-hover:text-pink-300 transition-colors">
                  Conversation Roleplay
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chat or speak with realistic local personas. Get instant Vibe feedback, grammar fixes, and native phrasing tips.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-pink-400 transition-colors">
              <span>Voice & Text Chat Roleplay</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Gamified Motivation: Streaks, Daily Goals & Badges */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak Motivation Card */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              <h3 className="font-semibold text-white text-sm">Streak Momentum</h3>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">
              {profile.streakDays} Days
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Consistent 5-minute immersion strengthens language neural pathways 4x faster than cramming once a week.
          </p>
          <div className="flex items-center gap-1.5 pt-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
              const active = i < Math.min(7, profile.streakDays);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                    active ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {active ? '✓' : day}
                  </div>
                  <span className="text-[10px] text-slate-500">{day}</span>
                </div>
              );
            })}
          </div>
          {profile.streakFreezes > 0 && (
            <div className="flex items-center gap-2 text-xs text-sky-400 bg-sky-950/40 p-2.5 rounded-xl border border-sky-800/40">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{profile.streakFreezes} Streak Freeze protection active if life gets busy!</span>
            </div>
          )}
        </div>

        {/* Daily XP Target */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white text-sm">Daily Immersion Goal</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {profile.todayXp} / {profile.dailyGoalXp} XP
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((profile.todayXp / profile.dailyGoalXp) * 100))}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Progress: {Math.min(100, Math.round((profile.todayXp / profile.dailyGoalXp) * 100))}%</span>
            <span>{profile.todayXp >= profile.dailyGoalXp ? '🎉 Goal Smashed!' : `${profile.dailyGoalXp - profile.todayXp} XP left`}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
            Completing any Vibe or Grammar exercise awards <strong>+25–30 XP</strong> and <strong>+5 Gems</strong>.
          </div>
        </div>

        {/* Badges / Milestones */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-400" />
              <h3 className="font-semibold text-white text-sm">Mastery Badges</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {profile.unlockedBadgeIds.length} / {INITIAL_BADGES.length}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {INITIAL_BADGES.slice(0, 6).map((badge) => {
              const unlocked = profile.unlockedBadgeIds.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  title={`${badge.title}: ${badge.description}`}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1.5 transition ${
                    unlocked
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-600 opacity-60'
                  }`}
                >
                  <Award className={`w-5 h-5 ${unlocked ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className="text-[10px] font-medium leading-tight truncate w-full">
                    {badge.title}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            Unlock badges through cultural mastery, streak milestones, and live roleplay.
          </p>
        </div>
      </section>
    </div>
  );
};

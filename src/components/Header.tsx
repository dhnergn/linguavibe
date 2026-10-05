import React, { useState } from 'react';
import { Flame, Sparkles, Volume2, VolumeX, Brain, Globe, ChevronDown, Shield } from 'lucide-react';
import { LearnerProfile, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { playProceduralSound } from '../utils/audio';

interface HeaderProps {
  profile: LearnerProfile;
  onLanguageChange: (lang: LanguageCode) => void;
  onToggleSound: () => void;
  onOpenDiagnostic: () => void;
  currentView: string;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onLanguageChange,
  onToggleSound,
  onOpenDiagnostic,
  currentView,
  onNavigateHome,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === profile.targetLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              playProceduralSound('tap', profile.soundEnabled);
              onNavigateHome();
            }}
            className="flex items-center gap-2.5 text-left group transition"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-slate-950 font-display font-extrabold text-lg">LV</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  LinguaVibe
                </span>
                <span className="text-[10px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-semibold border border-emerald-500/20">
                  Adaptive
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Intuitive & Vibe-Driven Language Learning
              </p>
            </div>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                playProceduralSound('tap', profile.soundEnabled);
                setLangMenuOpen(!langMenuOpen);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-xs font-medium text-slate-200 transition"
              aria-label="Select Target Language"
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.name}</span>
              <span className="text-slate-500 font-mono">({profile.level})</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Target Language
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      playProceduralSound('tap', profile.soundEnabled);
                      onLanguageChange(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition ${
                      lang.code === profile.targetLanguage
                        ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{lang.flag}</span>
                      <div>
                        <div>{lang.name}</div>
                        <div className="text-[10px] text-slate-500">{lang.vibeCity}</div>
                      </div>
                    </div>
                    {lang.code === profile.targetLanguage && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Gamification Bar */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Daily Streak */}
          <div 
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 group cursor-default"
            title={`${profile.streakDays} day streak! Keep it alive daily.`}
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono tabular-nums leading-none text-sm text-white">
                {profile.streakDays}
              </span>
              <span className="text-[10px] text-amber-400/80 font-normal">Day Streak</span>
            </div>
            {profile.streakFreezes > 0 && (
              <span 
                className="hidden lg:flex items-center gap-0.5 text-[10px] text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40 ml-1"
                title={`${profile.streakFreezes} streak freeze protections remaining`}
              >
                <Shield className="w-3 h-3 text-sky-400" />
                <span>{profile.streakFreezes}</span>
              </span>
            )}
          </div>

          {/* Fluency Gems */}
          <div 
            className="flex items-center gap-1.5 text-xs font-semibold text-teal-400"
            title={`${profile.gems} Fluency Gems unlocked`}
          >
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
              <Sparkles className="w-4 h-4 text-teal-400 fill-teal-400/20" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono tabular-nums leading-none text-sm text-white">
                {profile.gems}
              </span>
              <span className="text-[10px] text-teal-400/80 font-normal">Gems</span>
            </div>
          </div>

          {/* Algorithm Diagnostic Trigger */}
          <button
            onClick={() => {
              playProceduralSound('tap', profile.soundEnabled);
              onOpenDiagnostic();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200 transition text-xs font-medium"
            title="Inspect the Adaptive Cognitive Algorithm"
          >
            <Brain className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="hidden md:inline">Algorithm</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={() => {
              onToggleSound();
              playProceduralSound('tap', !profile.soundEnabled);
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label={profile.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            title={profile.soundEnabled ? 'Sound effects on' : 'Sound effects off'}
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

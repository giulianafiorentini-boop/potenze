import React from 'react';
import { Zap, Volume2, VolumeX, Shield, Globe } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/i18n';
import { soundManager } from '../utils/sound';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenTeacher: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenTeacher,
  isMuted,
  onToggleMute
}) => {
  const t = getTranslation(language);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/20 font-black text-xl">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">PowerQuest</span>
              <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
                MAT 1°
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Switcher */}
          <div className="flex items-center rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => {
                soundManager.playClick();
                onLanguageChange('it');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                language === 'it'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Italiano"
            >
              <span className="text-sm">🇮🇹</span>
              <span className="hidden sm:inline">IT</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onLanguageChange('en');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                language === 'en'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="English"
            >
              <span className="text-sm">🇬🇧</span>
              <span className="hidden sm:inline">EN</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
            title={isMuted ? 'Attiva Audio' : 'Disattiva Audio'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
          </button>

          {/* Teacher Area Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenTeacher();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-750 hover:text-amber-300 transition-all shadow-sm"
          >
            <Shield className="h-3.5 w-3.5 text-amber-400" />
            <span>{t.teacherArea}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

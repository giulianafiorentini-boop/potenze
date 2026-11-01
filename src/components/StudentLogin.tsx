import React, { useState } from 'react';
import { Play, Sparkles, Clock, Heart, Award, BookOpen, Shield, HelpCircle, Check } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/i18n';
import { soundManager } from '../utils/sound';

interface StudentLoginProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onStartGame: (name: string, surname: string) => void;
  onOpenTeacher: () => void;
  onOpenGuide: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({
  language,
  onLanguageChange,
  onStartGame,
  onOpenTeacher,
  onOpenGuide
}) => {
  const t = getTranslation(language);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !surname.trim()) {
      setErrorMessage(t.validationError);
      soundManager.playWrong();
      return;
    }
    setErrorMessage('');
    soundManager.playClick();
    onStartGame(name.trim(), surname.trim());
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* Hero Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 border border-amber-500/20 mb-3 shadow-inner">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{t.matBadge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
          {t.appTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          {t.loginSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Login Card */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl shadow-black/40 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <span>{t.loginTitle}</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              I tuoi risultati saranno salvati automaticamente per la valutazione del docente.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Field 1: Nome */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  1. {t.firstName} *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={t.firstNamePlaceholder}
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium text-sm"
                  autoFocus
                />
              </div>

              {/* Field 2: Cognome */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  2. {t.lastName} *
                </label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => {
                    setSurname(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={t.lastNamePlaceholder}
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium text-sm"
                />
              </div>

              {/* Field 3: Selezione Lingua (Italiano o Inglese) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  3. {t.languageSelect} *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      onLanguageChange('it');
                    }}
                    className={`flex items-center justify-center gap-2.5 rounded-xl border p-3 font-semibold text-sm transition-all ${
                      language === 'it'
                        ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-md ring-1 ring-amber-500'
                        : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xl">🇮🇹</span>
                    <span>{t.langItalian}</span>
                    {language === 'it' && <Check className="h-4 w-4 ml-auto text-amber-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      onLanguageChange('en');
                    }}
                    className={`flex items-center justify-center gap-2.5 rounded-xl border p-3 font-semibold text-sm transition-all ${
                      language === 'en'
                        ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-md ring-1 ring-amber-500'
                        : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xl">🇬🇧</span>
                    <span>{t.langEnglish}</span>
                    {language === 'en' && <Check className="h-4 w-4 ml-auto text-amber-400" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-xl bg-rose-950/50 border border-rose-800/80 px-4 py-2.5 text-xs text-rose-300 animate-shake">
                  {errorMessage}
                </div>
              )}

              {/* Start Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 px-6 py-3.5 text-base font-extrabold text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all transform active:scale-[0.99]"
              >
                <Play className="h-5 w-5 fill-current" />
                <span>{t.startButton}</span>
              </button>
            </form>

            {/* Quick helper links */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={onOpenGuide}
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition underline underline-offset-4"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Ripassa il Formulario Potenze</span>
              </button>

              <button
                type="button"
                onClick={onOpenTeacher}
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition"
              >
                <Shield className="h-3.5 w-3.5 text-slate-500" />
                <span>{t.teacherAccessLink}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Rules & Gamification Overview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-sm">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-amber-400" />
              <span>{t.rulesTitle}</span>
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0 mt-0.5">
                  <span className="font-bold text-xs">12</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">12 Domande Casuali</span>
                  <p className="text-xs text-slate-400">{t.rule1}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Timer da 2 Minuti (120s)</span>
                  <p className="text-xs text-slate-400">{t.rule2}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0 mt-0.5">
                  <Heart className="h-4 w-4 fill-rose-500/50" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">3 Vite a Disposizione</span>
                  <p className="text-xs text-slate-400">{t.rule3}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 mt-0.5">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Punteggio con Speed Bonus</span>
                  <p className="text-xs text-slate-400">{t.rule4}</p>
                </div>
              </div>
            </div>
          </div>

          {/* MAT curriculum context note */}
          <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-4 text-xs text-slate-300">
            <span className="font-bold text-amber-400 block mb-1">
              Orientamento Didattico MAT:
            </span>
            Gli esercizi coprono potenze fondamentali, proprietà per il calcolo rapido, potenze di 10 (prefissi kilo, mega usati in elettrotecnica e meccanica) ed errori tipici d'officina.
          </div>
        </div>
      </div>
    </div>
  );
};

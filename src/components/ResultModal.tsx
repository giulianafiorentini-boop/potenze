import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, AlertOctagon, RotateCcw, ListOrdered, CheckCircle2, XCircle, Clock, Heart, Award, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { StudentAnswer, Language } from '../types';
import { getTranslation } from '../utils/i18n';
import { soundManager } from '../utils/sound';

interface ResultModalProps {
  isVictory: boolean;
  score: number;
  answers: StudentAnswer[];
  livesLeft: number;
  studentName: string;
  studentSurname: string;
  language: Language;
  onPlayAgain: () => void;
  onOpenLeaderboard: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isVictory,
  score,
  answers,
  livesLeft,
  studentName,
  studentSurname,
  language,
  onPlayAgain,
  onOpenLeaderboard
}) => {
  const t = getTranslation(language);
  const isItalian = language === 'it';
  const [showDetails, setShowDetails] = useState(false);

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = 12;
  const totalSeconds = answers.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Determine technical badge
  let badgeTitle = 'Allievo in Addestramento MAT';
  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';

  if (correctCount === 12) {
    badgeTitle = isItalian ? 'Mastro Tecnico delle Potenze MAT' : 'Master Power Technician MAT';
    badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  } else if (correctCount >= 9) {
    badgeTitle = isItalian ? 'Operatore Esperto di Calcolo Tecnico' : 'Technical Calculation Specialist';
    badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  } else if (correctCount >= 6) {
    badgeTitle = isItalian ? 'Apprendista MAT Qualificato' : 'Qualified Apprentice MAT';
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  }

  // Trigger celebration on victory or dramatic audio on game over
  useEffect(() => {
    if (isVictory) {
      soundManager.playVictory();
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    } else {
      soundManager.playGameOver();
    }
  }, [isVictory]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 animate-fade-in">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow Header */}
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${
          isVictory ? 'from-amber-400 via-yellow-300 to-amber-500' : 'from-rose-500 via-rose-600 to-rose-700'
        }`} />

        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            {isVictory ? (
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/20 border-2 border-amber-500/40 text-amber-400 shadow-xl shadow-amber-500/20">
                <Trophy className="h-10 w-10 animate-bounce" />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/20 border-2 border-rose-500/40 text-rose-400 shadow-xl shadow-rose-500/20">
                <AlertOctagon className="h-10 w-10" />
              </div>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            {isVictory ? t.victoryTitle : t.gameOverTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto">
            {isVictory ? t.victorySubtitle : t.gameOverSubtitle}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="font-bold text-slate-200 text-sm">
              {studentName} {studentSurname}
            </span>
            <span className="text-slate-600">•</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
              <Award className="h-3.5 w-3.5" />
              {badgeTitle}
            </span>
          </div>

          {/* Automatic Server Save Badge */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs text-emerald-300 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>{t.savedAutomatically}</span>
          </div>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
          <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4 text-center">
            <Award className="h-5 w-5 text-amber-400 mx-auto mb-1.5" />
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.finalScore}
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono-math mt-1">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4 text-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto mb-1.5" />
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.accuracy}
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono-math mt-1">
              {correctCount} / {answers.length}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4 text-center">
            <Heart className="h-5 w-5 text-rose-400 mx-auto mb-1.5 fill-rose-500/40" />
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.lives}
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-300 font-mono-math mt-1">
              {livesLeft} / 3
            </div>
          </div>

          <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4 text-center">
            <Clock className="h-5 w-5 text-blue-400 mx-auto mb-1.5" />
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.totalTime}
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-300 font-mono-math mt-1">
              {minutes}m {seconds}s
            </div>
          </div>
        </div>

        {/* Detailed Question Review Accordion */}
        <div className="mb-8 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-4 bg-slate-850 hover:bg-slate-800 transition text-sm font-bold text-slate-200"
          >
            <span>{t.reviewAnswers} ({answers.length} {isItalian ? 'risposte' : 'answers'})</span>
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showDetails && (
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto divide-y divide-slate-800/80">
              {answers.map((ans, idx) => (
                <div key={idx} className="pt-3 first:pt-0">
                  <div className="flex items-start gap-2.5">
                    {ans.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 text-xs">
                      <div className="font-semibold text-white">
                        {idx + 1}. {ans.questionText}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2 text-slate-400">
                        <span>
                          {isItalian ? 'Tua risposta:' : 'Your answer:'}{' '}
                          <strong className={ans.isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                            {ans.selectedOption}
                          </strong>
                        </span>
                        {!ans.isCorrect && (
                          <span>
                            • {isItalian ? 'Corretta:' : 'Correct:'}{' '}
                            <strong className="text-emerald-300">{ans.correctOption}</strong>
                          </span>
                        )}
                        <span>• {ans.timeSpentSeconds}s</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400 italic">
                        {ans.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition transform active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t.playAgain}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenLeaderboard();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition transform active:scale-95"
          >
            <ListOrdered className="h-4 w-4 text-amber-400" />
            <span>{t.viewLeaderboard}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

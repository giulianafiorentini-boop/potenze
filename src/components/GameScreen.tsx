import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Clock, Award, Zap, AlertCircle, CheckCircle2, XCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { Question, StudentAnswer, Language } from '../types';
import { getTranslation } from '../utils/i18n';
import { soundManager } from '../utils/sound';
import { CATEGORY_LABELS } from '../data/questions';

interface GameScreenProps {
  questions: Question[];
  studentName: string;
  studentSurname: string;
  language: Language;
  onFinishGame: (finalScore: number, answers: StudentAnswer[], livesLeft: number, isVictory: boolean) => void;
  onProgressUpdate?: (score: number, answers: StudentAnswer[], livesLeft: number, isGameOver: boolean) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  questions,
  studentName,
  studentSurname,
  language,
  onFinishGame,
  onProgressUpdate
}) => {
  const t = getTranslation(language);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong' | 'timeout'>('idle');
  const [answersLog, setAnswersLog] = useState<StudentAnswer[]>([]);
  const [lastEarnedPoints, setLastEarnedPoints] = useState(0);
  const [isHeartShaking, setIsHeartShaking] = useState(false);

  const questionStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIndex];
  const isItalian = language === 'it';
  const categoryMeta = CATEGORY_LABELS[currentQuestion.category] || { it: 'Potenze', en: 'Powers' };

  // Trigger heart loss animation and sound
  const handleLifeLoss = useCallback(() => {
    setIsHeartShaking(true);
    soundManager.playHeartLost();
    setTimeout(() => setIsHeartShaking(false), 600);
  }, []);

  // Answer handling function
  const handleSelectOption = useCallback((optionIndex: number) => {
    if (feedbackState !== 'idle') return;

    setSelectedOption(optionIndex);
    soundManager.playClick();

    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    const isCorrect = optionIndex === currentQuestion.correctIndex;
    const currentOpts = isItalian ? currentQuestion.options.it : currentQuestion.options.en;
    const qText = isItalian ? currentQuestion.questionText.it : currentQuestion.questionText.en;
    const explanationText = isItalian ? currentQuestion.explanation.it : currentQuestion.explanation.en;

    const answerRecord: StudentAnswer = {
      questionId: currentQuestion.id,
      questionText: qText,
      selectedOption: currentOpts[optionIndex],
      correctOption: currentOpts[currentQuestion.correctIndex],
      isCorrect,
      timeSpentSeconds: timeSpent,
      explanation: explanationText
    };

    const nextAnswers = [...answersLog, answerRecord];
    setAnswersLog(nextAnswers);

    if (isCorrect) {
      // Points calculation: 100 base + speed bonus + streak bonus
      const speedBonus = timeLeft; // up to 120 points bonus
      const currentStreak = streak + 1;
      const streakMultiplier = currentStreak >= 3 ? 1.5 : currentStreak >= 2 ? 1.2 : 1.0;
      const earned = Math.round((100 + speedBonus) * streakMultiplier);
      const nextScore = score + earned;

      setScore(nextScore);
      setStreak(currentStreak);
      setLastEarnedPoints(earned);
      setFeedbackState('correct');
      soundManager.playCorrect();

      onProgressUpdate?.(nextScore, nextAnswers, lives, false);
    } else {
      const nextLives = lives - 1;
      setStreak(0);
      setFeedbackState('wrong');
      soundManager.playWrong();
      handleLifeLoss();
      setLives(nextLives);

      onProgressUpdate?.(score, nextAnswers, nextLives, nextLives <= 0);
    }
  }, [answersLog, currentQuestion, feedbackState, handleLifeLoss, isItalian, lives, onProgressUpdate, score, streak, timeLeft]);

  // Timeout handler when 120 seconds expire
  const handleTimeout = useCallback(() => {
    if (feedbackState !== 'idle') return;

    soundManager.playWrong();
    handleLifeLoss();
    setStreak(0);
    setFeedbackState('timeout');

    const currentOpts = isItalian ? currentQuestion.options.it : currentQuestion.options.en;
    const qText = isItalian ? currentQuestion.questionText.it : currentQuestion.questionText.en;
    const explanationText = isItalian ? currentQuestion.explanation.it : currentQuestion.explanation.en;

    const answerRecord: StudentAnswer = {
      questionId: currentQuestion.id,
      questionText: qText,
      selectedOption: isItalian ? 'Tempo scaduto' : 'Time expired',
      correctOption: currentOpts[currentQuestion.correctIndex],
      isCorrect: false,
      timeSpentSeconds: 120,
      explanation: explanationText
    };

    const nextLives = lives - 1;
    const nextAnswers = [...answersLog, answerRecord];
    setAnswersLog(nextAnswers);
    setLives(nextLives);

    onProgressUpdate?.(score, nextAnswers, nextLives, nextLives <= 0);
  }, [answersLog, currentQuestion, feedbackState, handleLifeLoss, isItalian, lives, onProgressUpdate, score]);

  // Countdown timer effect
  useEffect(() => {
    if (feedbackState !== 'idle') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          handleTimeout();
          return 0;
        }
        if (prev <= 15 && prev > 1) {
          soundManager.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [feedbackState, handleTimeout]);

  // Keyboard shortcut support (1, 2, 3, 4 or A, B, C, D or Enter/Space to advance)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (feedbackState === 'idle') {
        const key = e.key.toLowerCase();
        if (key === '1' || key === 'a') handleSelectOption(0);
        else if (key === '2' || key === 'b') handleSelectOption(1);
        else if (key === '3' || key === 'c') handleSelectOption(2);
        else if (key === '4' || key === 'd') handleSelectOption(3);
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Advance to next question or end game
  const handleNextQuestion = () => {
    soundManager.playClick();

    // Check game over
    if (lives <= 0) {
      onFinishGame(score, answersLog, 0, false);
      return;
    }

    // Check victory
    if (currentIndex + 1 >= questions.length) {
      onFinishGame(score, answersLog, lives, true);
      return;
    }

    // Next question setup
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setFeedbackState('idle');
    setTimeLeft(120);
    questionStartTimeRef.current = Date.now();
  };

  // Immediate check if lives reached 0 in current turn
  const isGameOverPending = lives <= 0;
  const isLastQuestion = currentIndex + 1 >= questions.length;

  // Visual timer percentage
  const timerPercentage = (timeLeft / 120) * 100;
  const isUrgentTimer = timeLeft <= 25;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      {/* HUD Header Bar */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 shadow-xl shadow-black/30 backdrop-blur-md mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Student & Progress */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-extrabold border border-amber-500/30 text-sm">
              {currentIndex + 1}
              <span className="text-[10px] text-slate-400 font-normal">/12</span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">
                {t.questionCount} {currentIndex + 1} {t.of} 12
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{studentName} {studentSurname}</span>
                {streak >= 2 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400 border border-orange-500/30 animate-pulse">
                    <Zap className="h-2.5 w-2.5 fill-current" />
                    {streak} in fila! (x{streak >= 3 ? '1.5' : '1.2'})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Lives (3 Hearts) */}
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 transition-transform ${
            isHeartShaking ? 'scale-110 border-rose-500 ring-2 ring-rose-500/50' : ''
          }`}>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mr-1 hidden sm:inline">
              {t.lives}:
            </span>
            {[1, 2, 3].map((heartIndex) => {
              const isActive = heartIndex <= lives;
              return (
                <div key={heartIndex} className="relative transition-transform duration-300">
                  <Heart
                    className={`h-6 w-6 transition-all duration-300 ${
                      isActive
                        ? 'fill-rose-500 text-rose-500 scale-100 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                        : 'fill-slate-700 text-slate-700 scale-90 opacity-40'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Score Counter */}
          <div className="flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-xl">
            <Award className="h-5 w-5 text-amber-400" />
            <div>
              <div className="text-[10px] font-bold uppercase text-amber-400/80 tracking-wider">
                {t.score}
              </div>
              <div className="text-base sm:text-lg font-black text-amber-300 font-mono-math">
                {score.toLocaleString()} pt
              </div>
            </div>
          </div>
        </div>

        {/* 120s Timer Bar with dynamic warning colors */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className={`h-3.5 w-3.5 ${isUrgentTimer ? 'text-rose-400 animate-spin' : 'text-slate-400'}`} />
              <span className={isUrgentTimer ? 'text-rose-400 font-bold' : ''}>
                {timeLeft} {t.secondsLeft}
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">
              {isUrgentTimer && (
                <span className="text-rose-400 font-bold animate-pulse mr-2">
                  {t.timeRunningOut}
                </span>
              )}
              {isItalian ? 'Tempo per domanda: 120s' : 'Time limit: 120s'}
            </div>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                isUrgentTimer
                  ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                  : timeLeft < 60
                  ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Category & Topic Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1 text-xs font-bold text-amber-300 border border-slate-700">
            <Zap className="h-3 w-3 text-amber-400" />
            {isItalian ? categoryMeta.it : categoryMeta.en}
          </span>

          {currentQuestion.formula && (
            <span className="font-mono-math text-xs bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-slate-400">
              {currentQuestion.formula}
            </span>
          )}
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-snug">
          {isItalian ? currentQuestion.questionText.it : currentQuestion.questionText.en}
        </h2>

        {/* 4 Interactive Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {(isItalian ? currentQuestion.options.it : currentQuestion.options.en).map((optionText, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correctIndex;

            let buttonStyle = 'bg-slate-800/80 hover:bg-slate-750 text-slate-200 border-slate-700 hover:border-slate-600';
            let badgeStyle = 'bg-slate-700 text-slate-300 border-slate-600';

            if (feedbackState !== 'idle') {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/50';
                badgeStyle = 'bg-emerald-500 text-slate-950 font-black';
              } else if (isSelected) {
                buttonStyle = 'bg-rose-950/70 border-rose-500 text-rose-100 ring-2 ring-rose-500/40';
                badgeStyle = 'bg-rose-500 text-white font-black';
              } else {
                buttonStyle = 'opacity-40 bg-slate-900 border-slate-800 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={feedbackState !== 'idle'}
                onClick={() => handleSelectOption(idx)}
                className={`group flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-150 transform active:scale-[0.98] ${buttonStyle}`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl border text-xs font-bold transition-all ${badgeStyle}`}>
                  {letter}
                </div>
                <div className="font-mono-math text-base font-semibold tracking-wide flex-1">
                  {optionText}
                </div>
                {feedbackState !== 'idle' && isCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                )}
                {feedbackState !== 'idle' && isSelected && !isCorrect && (
                  <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Keyboard helper hint */}
        {feedbackState === 'idle' && (
          <p className="text-center text-xs text-slate-500">
            {t.keyboardHint}
          </p>
        )}

        {/* Immediate Feedback Card after answer */}
        {feedbackState !== 'idle' && (
          <div className={`rounded-2xl p-5 border transition-all mt-4 animate-fade-in ${
            feedbackState === 'correct'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
          }`}>
            <div className="flex items-start gap-3.5 mb-3">
              {feedbackState === 'correct' ? (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500 text-white font-bold shrink-0">
                  <AlertCircle className="h-6 w-6" />
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold">
                    {feedbackState === 'correct'
                      ? t.correctHeading.replace('{points}', String(lastEarnedPoints))
                      : feedbackState === 'timeout'
                      ? t.timeOutHeading
                      : t.wrongHeading}
                  </h3>
                  {feedbackState !== 'correct' && (
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
                      -1 {isItalian ? 'Vita' : 'Life'} ({lives} {isItalian ? 'rimaste' : 'left'})
                    </span>
                  )}
                </div>

                {/* Didactic Explanation */}
                <div className="mt-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-400 block mb-0.5">
                      {t.explanationTitle}
                    </span>
                    <p>{isItalian ? currentQuestion.explanation.it : currentQuestion.explanation.en}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next / Finish Button */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-sm shadow-lg transition transform active:scale-95 ${
                  isGameOverPending
                    ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/30'
                    : isLastQuestion
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                }`}
              >
                <span>
                  {isGameOverPending
                    ? (isItalian ? 'Concludi Partita (Game Over) →' : 'Finish Game (Game Over) →')
                    : isLastQuestion
                    ? t.seeFinalResults
                    : t.nextQuestion}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

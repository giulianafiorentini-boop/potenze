/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { StudentLogin } from './components/StudentLogin';
import { GameScreen } from './components/GameScreen';
import { ResultModal } from './components/ResultModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { FormulaGuideModal } from './components/FormulaGuideModal';
import { Question, StudentAnswer, Language } from './types';
import { QUESTIONS_BANK } from './data/questions';
import { soundManager } from './utils/sound';

export default function App() {
  const [language, setLanguage] = useState<Language>('it');
  const [currentView, setCurrentView] = useState<'login' | 'game' | 'result' | 'teacher'>('login');
  const [studentName, setStudentName] = useState('');
  const [studentSurname, setStudentSurname] = useState('');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Result state
  const [lastResult, setLastResult] = useState<{
    isVictory: boolean;
    score: number;
    answers: StudentAnswer[];
    livesLeft: number;
  } | null>(null);

  // Toggle sound
  const handleToggleMute = () => {
    const nextState = soundManager.toggleMute();
    setIsMuted(nextState);
  };

  // Fisher-Yates shuffle to pick exactly 12 diverse questions
  const pick12RandomQuestions = (): Question[] => {
    const shuffled = [...QUESTIONS_BANK].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 12);
  };

  // Start game
  const handleStartGame = (name: string, surname: string) => {
    setStudentName(name);
    setStudentSurname(surname);
    const selected = pick12RandomQuestions();
    setActiveQuestions(selected);
    setCurrentView('game');
  };

  // Save attempt to server automatically
  const saveAttemptToServer = async (
    score: number,
    answers: StudentAnswer[],
    livesLeft: number,
    isVictory: boolean
  ) => {
    try {
      const correctAnswers = answers.filter((a) => a.isCorrect).length;
      const totalTimeSeconds = answers.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0);

      await fetch('/api/attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentName,
          studentSurname,
          language,
          score,
          correctAnswers,
          totalQuestions: 12,
          livesRemaining: livesLeft,
          totalTimeSeconds,
          completed: isVictory,
          answers
        })
      });
    } catch (err) {
      console.error('Auto-save error:', err);
    }
  };

  // Game completed (either all 12 questions cleared or 0 lives)
  const handleFinishGame = (
    finalScore: number,
    answers: StudentAnswer[],
    livesLeft: number,
    isVictory: boolean
  ) => {
    setLastResult({
      isVictory,
      score: finalScore,
      answers,
      livesLeft
    });

    // Auto-save immediately to server (No CSV download required for persistence)
    saveAttemptToServer(finalScore, answers, livesLeft, isVictory);

    setCurrentView('result');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Global Navigation Header */}
      <Header
        language={language}
        onLanguageChange={(lang) => setLanguage(lang)}
        onOpenTeacher={() => setCurrentView('teacher')}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main View Container */}
      <main className="flex-1 flex flex-col justify-center">
        {currentView === 'login' && (
          <StudentLogin
            language={language}
            onLanguageChange={(lang) => setLanguage(lang)}
            onStartGame={handleStartGame}
            onOpenTeacher={() => setCurrentView('teacher')}
            onOpenGuide={() => setShowGuideModal(true)}
          />
        )}

        {currentView === 'game' && (
          <GameScreen
            questions={activeQuestions}
            studentName={studentName}
            studentSurname={studentSurname}
            language={language}
            onFinishGame={handleFinishGame}
          />
        )}

        {currentView === 'result' && lastResult && (
          <ResultModal
            isVictory={lastResult.isVictory}
            score={lastResult.score}
            answers={lastResult.answers}
            livesLeft={lastResult.livesLeft}
            studentName={studentName}
            studentSurname={studentSurname}
            language={language}
            onPlayAgain={() => {
              const selected = pick12RandomQuestions();
              setActiveQuestions(selected);
              setCurrentView('game');
            }}
            onOpenLeaderboard={() => setCurrentView('teacher')}
          />
        )}

        {currentView === 'teacher' && (
          <TeacherDashboard
            language={language}
            onBackToHome={() => setCurrentView('login')}
          />
        )}
      </main>

      {/* Quick Formula Cheat Sheet Modal */}
      {showGuideModal && (
        <FormulaGuideModal
          language={language}
          onClose={() => setShowGuideModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            PowerQuest MAT &copy; 2026 • Didattica Digitale per gli Istituti Tecnici e Professionali
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowGuideModal(true)}
              className="hover:text-amber-400 transition underline underline-offset-2"
            >
              Formulario Potenze
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('teacher')}
              className="hover:text-amber-400 transition underline underline-offset-2"
            >
              Area Docente (DocenteMAT2026)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

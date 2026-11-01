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
  const [currentAttemptId, setCurrentAttemptId] = useState<string>('');

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

  // Save or update attempt on server automatically
  const saveAttemptToServer = async (
    attemptId: string,
    score: number,
    answers: StudentAnswer[],
    livesLeft: number,
    isVictory: boolean,
    statusText?: string
  ) => {
    try {
      const correctAnswers = answers.filter((a) => a.isCorrect).length;
      const questionsAnswered = answers.filter((a) => a.selectedOption !== 'Tempo scaduto' && a.selectedOption !== 'Time expired').length;
      const timeoutsCount = answers.filter((a) => a.selectedOption === 'Tempo scaduto' || a.selectedOption === 'Time expired').length;
      const totalTimeSeconds = answers.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0);

      await fetch('/api/attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: attemptId,
          studentName,
          studentSurname,
          language,
          score,
          correctAnswers,
          questionsAnswered,
          timeoutsCount,
          totalQuestions: 12,
          livesRemaining: livesLeft,
          totalTimeSeconds,
          completed: isVictory,
          status: statusText || (isVictory ? 'Completato 12/12 ✅' : livesLeft <= 0 ? `Vite esaurite (${questionsAnswered}/12 risposte)` : `In corso (${questionsAnswered}/12 risposte)`),
          answers
        })
      });
    } catch (err) {
      console.error('Auto-save error:', err);
    }
  };

  // Start game - Registra IMMEDIATAMENTE l'alunno fin dal primo secondo (anche se risponde a 0 domande)
  const handleStartGame = (name: string, surname: string) => {
    setStudentName(name);
    setStudentSurname(surname);
    const newAttemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setCurrentAttemptId(newAttemptId);
    const selected = pick12RandomQuestions();
    setActiveQuestions(selected);

    // Salvataggio immediato: presente nella dashboard docente fin dall'avvio
    saveAttemptToServer(newAttemptId, 0, [], 3, false, 'In corso (0/12 risposte date)');
    setCurrentView('game');
  };

  // Aggiornamento in tempo reale ad ogni domanda risposata o timeout
  const handleProgressUpdate = (
    currentScore: number,
    answers: StudentAnswer[],
    livesLeft: number,
    isGameOver: boolean
  ) => {
    if (!currentAttemptId) return;
    const questionsAnswered = answers.filter((a) => a.selectedOption !== 'Tempo scaduto' && a.selectedOption !== 'Time expired').length;
    const timeoutsCount = answers.filter((a) => a.selectedOption === 'Tempo scaduto' || a.selectedOption === 'Time expired').length;
    const statusText = isGameOver
      ? `Vite esaurite (${questionsAnswered}/12 risposte, ${timeoutsCount} timeout)`
      : `In corso (${questionsAnswered}/12 risposte)`;
    saveAttemptToServer(currentAttemptId, currentScore, answers, livesLeft, false, statusText);
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

    const questionsAnswered = answers.filter((a) => a.selectedOption !== 'Tempo scaduto' && a.selectedOption !== 'Time expired').length;
    const timeoutsCount = answers.filter((a) => a.selectedOption === 'Tempo scaduto' || a.selectedOption === 'Time expired').length;
    const statusText = isVictory
      ? 'Completato 12/12 ✅'
      : `Vite esaurite (${questionsAnswered}/12 risposte, ${timeoutsCount} timeout)`;

    saveAttemptToServer(currentAttemptId, finalScore, answers, livesLeft, isVictory, statusText);
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
            onProgressUpdate={handleProgressUpdate}
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

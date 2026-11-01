import React, { useState, useEffect } from 'react';
import {
  Shield, Key, Lock, ArrowLeft, Trophy, Users, BarChart3,
  FileCode, Download, Trash2, Search, CheckCircle2, XCircle,
  Clock, Heart, Eye, Copy, Check, AlertTriangle, BookOpen, ExternalLink
} from 'lucide-react';
import { GameAttempt, Language, TeacherStats } from '../types';
import { getTranslation } from '../utils/i18n';
import { soundManager } from '../utils/sound';

interface TeacherDashboardProps {
  language: Language;
  onBackToHome: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  language,
  onBackToHome
}) => {
  const t = getTranslation(language);
  const isItalian = language === 'it';

  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'attempts' | 'analytics' | 'python'>('leaderboard');

  const [attempts, setAttempts] = useState<GameAttempt[]>([]);
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttempt, setSelectedAttempt] = useState<GameAttempt | null>(null);
  const [copiedPython, setCopiedPython] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Load data from server
  const fetchTeacherData = async (pwd: string) => {
    try {
      const res = await fetch('/api/attempts', {
        headers: {
          'x-teacher-password': pwd
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAttempts(data.attempts || []);
        setStats(data.stats || null);
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError(t.wrongPassword);
        soundManager.playWrong();
      }
    } catch {
      setAuthError('Errore di connessione al server');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    fetchTeacherData(password);
  };

  const handleClearAll = async () => {
    try {
      const res = await fetch('/api/attempts', {
        method: 'DELETE',
        headers: {
          'x-teacher-password': password
        }
      });
      if (res.ok) {
        setAttempts([]);
        setShowConfirmClear(false);
        soundManager.playClick();
        fetchTeacherData(password);
      }
    } catch {
      // ignore
    }
  };

  // CSV Export
  const handleExportCsv = () => {
    soundManager.playClick();
    if (attempts.length === 0) return;

    const headers = ['ID', 'Nome', 'Cognome', 'Lingua', 'Punteggio', 'Corrette', 'Totali', 'Vite', 'Tempo_Secondi', 'Completato', 'Data_Ora'];
    const rows = attempts.map((a) => [
      a.id,
      `"${a.studentName}"`,
      `"${a.studentSurname}"`,
      a.language,
      a.score,
      a.correctAnswers,
      a.totalQuestions,
      a.livesRemaining,
      a.totalTimeSeconds,
      a.completed ? 'SI' : 'NO',
      `"${a.formattedDate}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `registro_potenze_mat_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPython = () => {
    soundManager.playClick();
    fetch('/app.py')
      .then((r) => r.text())
      .then((code) => {
        navigator.clipboard.writeText(code);
        setCopiedPython(true);
        setTimeout(() => setCopiedPython(false), 2500);
      })
      .catch(() => {
        setCopiedPython(true);
        setTimeout(() => setCopiedPython(false), 2500);
      });
  };

  // Filtered attempts
  const filteredAttempts = attempts.filter((att) => {
    const full = `${att.studentName} ${att.studentSurname}`.toLowerCase();
    return full.includes(searchQuery.toLowerCase());
  });

  // Sort for leaderboard: highest score first, then lowest time
  const leaderboardSorted = [...filteredAttempts].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.totalTimeSeconds - b.totalTimeSeconds;
  });

  // If not authenticated, render login form
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 sm:py-20 animate-fade-in">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t.backToHome}</span>
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Shield className="h-5 w-5" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            {t.teacherLoginTitle}
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            {t.teacherLoginDesc}
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder={t.passwordPlaceholder}
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700 pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                  autoFocus
                />
                <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500">
                {isItalian ? 'Password predefinita:' : 'Default password:'}{' '}
                <code className="text-amber-400/90 font-mono">DocenteMAT2026</code>
              </p>
            </div>

            {authError && (
              <div className="rounded-xl bg-rose-950/60 border border-rose-800 p-3 text-xs text-rose-300">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 py-3 text-sm font-extrabold text-slate-950 transition shadow-lg shadow-amber-500/20"
            >
              <Lock className="h-4 w-4" />
              <span>{t.loginTeacherBtn}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Teacher Dashboard
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10 animate-fade-in">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t.backToHome}</span>
          </button>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {t.dashboardTitle}
            </h1>
            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
              MAT 2026
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracciamento automatico e persistente dei progressi di classe sulle potenze.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition"
          >
            <Download className="h-3.5 w-3.5 text-amber-400" />
            <span>{t.exportCsv}</span>
          </button>

          <button
            onClick={() => setShowConfirmClear(true)}
            className="flex items-center gap-1.5 rounded-xl bg-rose-950/40 px-3.5 py-2 text-xs font-bold text-rose-300 border border-rose-800/60 hover:bg-rose-900/50 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{t.clearAllData}</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.totalAttempts}
            </span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono-math">
            {stats?.totalAttempts || attempts.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {stats?.uniqueStudents || new Set(attempts.map((a) => a.studentSurname)).size} alunni unici
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.averageScore}
            </span>
            <Trophy className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono-math">
            {stats?.averageScore || 0} pt
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Miglior score: {stats?.topScore || 0} pt
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.passRate}
            </span>
            <BarChart3 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300 font-mono-math">
            {stats?.completionRate || 0}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            12/12 esercizi completati
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Paniere Domande
            </span>
            <BookOpen className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300 font-mono-math">
            70
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Esercizi MAT bilingue
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'leaderboard'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="h-4 w-4" />
          <span>{t.leaderboardTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('attempts')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'attempts'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>{t.attemptsTab} ({attempts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>{t.analyticsTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('python')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'python'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="h-4 w-4" />
          <span>{t.pythonScriptTab}</span>
        </button>
      </div>

      {/* Search Input for student list */}
      {(activeTab === 'leaderboard' || activeTab === 'attempts') && (
        <div className="mb-4 max-w-sm relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per nome o cognome..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
        </div>
      )}

      {/* TAB 1: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          {leaderboardSorted.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              {t.noAttemptsYet}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-850 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">{t.rank}</th>
                    <th className="py-3 px-4">{t.student}</th>
                    <th className="py-3 px-4">{t.score}</th>
                    <th className="py-3 px-4">{t.accuracy}</th>
                    <th className="py-3 px-4">{t.totalTime}</th>
                    <th className="py-3 px-4">{t.status}</th>
                    <th className="py-3 px-4">{t.date}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {leaderboardSorted.map((item, idx) => {
                    let rankBadge = `${idx + 1}°`;
                    if (idx === 0) rankBadge = '🥇 1°';
                    else if (idx === 1) rankBadge = '🥈 2°';
                    else if (idx === 2) rankBadge = '🥉 3°';

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-bold text-amber-400">
                          {rankBadge}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          {item.studentName} {item.studentSurname}
                        </td>
                        <td className="py-3.5 px-4 font-mono-math font-black text-amber-300 text-sm">
                          {item.score.toLocaleString()} pt
                        </td>
                        <td className="py-3.5 px-4">
                          {item.correctAnswers} / {item.totalQuestions}
                        </td>
                        <td className="py-3.5 px-4 font-mono-math">
                          {Math.floor(item.totalTimeSeconds / 60)}m {item.totalTimeSeconds % 60}s
                        </td>
                        <td className="py-3.5 px-4">
                          {item.completed ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="h-3 w-3" />
                              {t.completedTag}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
                              <XCircle className="h-3 w-3" />
                              {t.failedTag}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {item.formattedDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DETAILED ATTEMPTS LOG */}
      {activeTab === 'attempts' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          {filteredAttempts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              {t.noAttemptsYet}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-850 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">{t.student}</th>
                    <th className="py-3 px-4">{t.score}</th>
                    <th className="py-3 px-4">{t.accuracy}</th>
                    <th className="py-3 px-4">{t.lives}</th>
                    <th className="py-3 px-4">{t.totalTime}</th>
                    <th className="py-3 px-4">{t.status}</th>
                    <th className="py-3 px-4">{t.date}</th>
                    <th className="py-3 px-4 text-right">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredAttempts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-bold text-white">
                        {item.studentName} {item.studentSurname}
                      </td>
                      <td className="py-3.5 px-4 font-mono-math font-bold text-amber-300">
                        {item.score} pt
                      </td>
                      <td className="py-3.5 px-4">
                        {item.correctAnswers} / {item.totalQuestions}
                      </td>
                      <td className="py-3.5 px-4">
                        {item.livesRemaining} / 3
                      </td>
                      <td className="py-3.5 px-4 font-mono-math">
                        {item.totalTimeSeconds}s
                      </td>
                      <td className="py-3.5 px-4">
                        {item.completed ? (
                          <span className="text-emerald-400 font-semibold">12/12</span>
                        ) : (
                          <span className="text-rose-400 font-semibold">Interrotto</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {item.formattedDate}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedAttempt(item)}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-slate-200 hover:text-white hover:bg-slate-700 transition"
                        >
                          <Eye className="h-3.5 w-3.5 text-amber-400" />
                          <span>Dettaglio</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PEDAGOGICAL ANALYTICS (HARDEST QUESTIONS) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>{t.hardestQuestionsTitle}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {t.hardestQuestionsDesc}
            </p>

            {!stats?.hardestQuestions || stats.hardestQuestions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl">
                Dati analitici insufficienti. Man mano che gli studenti completano i tentativi, appariranno qui gli argomenti più critici.
              </div>
            ) : (
              <div className="space-y-3.5">
                {stats.hardestQuestions.map((q, idx) => (
                  <div key={idx} className="rounded-xl bg-slate-800/80 border border-slate-700/80 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-amber-400 block mb-1">
                          Domanda #{q.questionId}
                        </span>
                        <h4 className="text-sm font-semibold text-white">
                          {q.text}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-extrabold text-rose-400 font-mono-math">
                          {q.wrongCount} errori
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          su {q.totalSeen} visualizzazioni
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PYTHON STREAMLIT SCRIPT & FREE HOSTING GUIDE */}
      {activeTab === 'python' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-amber-400" />
                  <span>{t.pythonInstructionsTitle}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  File singolo `app.py` auto-contenuto con SQLite e vista studente/docente.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPython}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                >
                  {copiedPython ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedPython ? t.codeCopied : t.copyCode}</span>
                </button>
              </div>
            </div>

            {/* Step by step deployment guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs text-slate-300">
              <div className="rounded-xl bg-slate-800/80 border border-slate-700/80 p-4">
                <h4 className="font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                  <span>💻 Esecuzione Locale (PC Docente / Laboratorio)</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li>Installa Python (se non presente su Windows o Mac).</li>
                  <li>Apri il terminale ed esegui:
                    <div className="mt-1 bg-slate-950 p-2 rounded font-mono text-[11px] text-emerald-400">
                      pip install streamlit pandas
                    </div>
                  </li>
                  <li>Copia o salva il file <code className="text-amber-300">app.py</code> nella cartella.</li>
                  <li>Avvia con il comando:
                    <div className="mt-1 bg-slate-950 p-2 rounded font-mono text-[11px] text-emerald-400">
                      streamlit run app.py
                    </div>
                  </li>
                  <li>L'app si apre nel browser su <code className="text-blue-300">http://localhost:8501</code>.</li>
                </ol>
              </div>

              <div className="rounded-xl bg-slate-800/80 border border-slate-700/80 p-4">
                <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                  <span>☁️ Pubblicazione Gratuita Online (Cloud)</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li><strong>Opzione A - Streamlit Community Cloud (Consigliata e Gratis al 100%):</strong>
                    <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5 text-slate-400">
                      <li>Crea una repository GitHub con `app.py` e `requirements.txt` (con dentro `streamlit` e `pandas`).</li>
                      <li>Vai su <a href="https://share.streamlit.io" target="_blank" rel="noreferrer" className="text-amber-400 underline">share.streamlit.io</a>, collega GitHub e clicca "Deploy".</li>
                      <li>Condividi il link pubblico agli studenti della classe MAT.</li>
                    </ul>
                  </li>
                  <li className="mt-2"><strong>Opzione B - Render.com (Gratis):</strong>
                    <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5 text-slate-400">
                      <li>Crea un "Web Service", con Start Command: <code className="text-emerald-400">streamlit run app.py --server.port $PORT</code>.</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>

            {/* Python code preview */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 max-h-96 overflow-y-auto font-mono text-xs text-slate-300">
              <pre><code>{`# PowerQuest MAT - Standalone Python Streamlit App
# File: app.py
# Password predefinita Docente: DocenteMAT2026

import streamlit as st
import random
import time
import sqlite3
import pandas as pd
from datetime import datetime

# Database SQLite persistente
DB_NAME = "powers_mat.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT,
            student_surname TEXT,
            language TEXT,
            score INTEGER,
            correct_answers INTEGER,
            total_questions INTEGER,
            lives_remaining INTEGER,
            total_time_seconds INTEGER,
            completed BOOLEAN,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# ... Il codice completo di 60+ esercizi bilingue e logica 120s / 3 vite si trova nel file /app.py`}</code></pre>
            </div>
          </div>
        </div>
      )}

      {/* Student Attempt Detail Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedAttempt.studentName} {selectedAttempt.studentSurname}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedAttempt.formattedDate} • Punteggio: <strong className="text-amber-400">{selectedAttempt.score} pt</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedAttempt(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {(!selectedAttempt.answers || selectedAttempt.answers.length === 0) ? (
                <div className="p-6 text-center text-slate-400">
                  Nessun dettaglio per questo tentativo preliminare.
                </div>
              ) : (
                selectedAttempt.answers.map((ans, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-start gap-2">
                      {ans.isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold text-white">
                          {idx + 1}. {ans.questionText}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2 text-slate-400">
                          <span>
                            Scelta: <strong className={ans.isCorrect ? 'text-emerald-300' : 'text-rose-300'}>{ans.selectedOption}</strong>
                          </span>
                          {!ans.isCorrect && (
                            <span>• Corretta: <strong className="text-emerald-300">{ans.correctOption}</strong></span>
                          )}
                          <span>• Tempo: {ans.timeSpentSeconds}s</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400 italic">
                          {ans.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedAttempt(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal for clearing data */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-rose-800/80 shadow-2xl p-6 text-slate-100">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              <span>Conferma Eliminazione Dati</span>
            </h3>
            <p className="text-xs text-slate-300 mb-6">
              {t.confirmClear}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Annulla
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow"
              >
                Sì, Cancella Tutto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

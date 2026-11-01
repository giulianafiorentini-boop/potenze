import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || 'DocenteMAT2026';
const DATA_FILE = path.join(__dirname, 'data', 'attempts.json');

app.use(express.json({ limit: '2mb' }));

// Helper to ensure data directory and file exist
function getAttempts(): any[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const dataDir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading attempts file:', err);
    return [];
  }
}

function saveAttempts(attempts: any[]): boolean {
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(attempts, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
    return true;
  } catch (err) {
    console.error('Error writing attempts file:', err);
    return false;
  }
}

// --- API Endpoints ---

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Teacher Authentication
app.post('/api/teacher/auth', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ success: false, error: 'Password required' });
    return;
  }
  if (password === TEACHER_PASSWORD) {
    res.json({ success: true, message: 'Authenticated' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid password' });
  }
});

// Submit a new game attempt
app.post('/api/attempts', (req: Request, res: Response) => {
  const {
    studentName,
    studentSurname,
    language = 'it',
    score = 0,
    correctAnswers = 0,
    totalQuestions = 12,
    livesRemaining = 0,
    totalTimeSeconds = 0,
    completed = false,
    answers = []
  } = req.body;

  if (!studentName || !studentSurname) {
    res.status(400).json({ error: 'studentName and studentSurname are required' });
    return;
  }

  const now = new Date();
  const attempt = {
    id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    studentName: String(studentName).trim(),
    studentSurname: String(studentSurname).trim(),
    language,
    score: Number(score) || 0,
    correctAnswers: Number(correctAnswers) || 0,
    totalQuestions: Number(totalQuestions) || 12,
    livesRemaining: Number(livesRemaining) || 0,
    totalTimeSeconds: Number(totalTimeSeconds) || 0,
    completed: Boolean(completed),
    timestamp: now.toISOString(),
    formattedDate: now.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    answers: Array.isArray(answers) ? answers : []
  };

  const attempts = getAttempts();
  attempts.unshift(attempt); // latest first
  const saved = saveAttempts(attempts);

  if (!saved) {
    res.status(500).json({ error: 'Failed to persist attempt data' });
    return;
  }

  res.status(201).json({ success: true, attempt });
});

// Public Leaderboard: returns top 50 ranked attempts
app.get('/api/leaderboard', (_req: Request, res: Response) => {
  const attempts = getAttempts();
  // Sort by score desc, then totalTimeSeconds asc (faster is better)
  const sorted = [...attempts].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.totalTimeSeconds - b.totalTimeSeconds;
  });

  // Provide sanitized records for public view
  const leaderboard = sorted.slice(0, 50).map((att, index) => ({
    rank: index + 1,
    id: att.id,
    studentName: att.studentName,
    studentSurname: att.studentSurname,
    score: att.score,
    correctAnswers: att.correctAnswers,
    totalQuestions: att.totalQuestions,
    livesRemaining: att.livesRemaining,
    totalTimeSeconds: att.totalTimeSeconds,
    completed: att.completed,
    formattedDate: att.formattedDate
  }));

  res.json({ success: true, leaderboard });
});

// Teacher: Get all attempts with full details and analytics
app.get('/api/attempts', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const password = req.headers['x-teacher-password'] || (authHeader ? authHeader.replace('Bearer ', '') : null);

  if (password !== TEACHER_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized. Teacher password required.' });
    return;
  }

  const attempts = getAttempts();

  // Compute analytics
  const totalAttempts = attempts.length;
  const uniqueStudents = new Set(attempts.map(a => `${a.studentName.toLowerCase()}_${a.studentSurname.toLowerCase()}`)).size;
  const averageScore = totalAttempts > 0 ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts) : 0;
  const completedAttempts = attempts.filter(a => a.completed).length;
  const completionRate = totalAttempts > 0 ? Math.round((completedAttempts / totalAttempts) * 100) : 0;
  const topScore = attempts.reduce((max, a) => Math.max(max, a.score), 0);

  // Question error analysis
  const questionMistakes: Record<number, { text: string; wrong: number; total: number }> = {};
  attempts.forEach(att => {
    if (Array.isArray(att.answers)) {
      att.answers.forEach((ans: any) => {
        if (!ans.questionId) return;
        if (!questionMistakes[ans.questionId]) {
          questionMistakes[ans.questionId] = {
            text: ans.questionText || `Domanda #${ans.questionId}`,
            wrong: 0,
            total: 0
          };
        }
        questionMistakes[ans.questionId].total += 1;
        if (!ans.isCorrect) {
          questionMistakes[ans.questionId].wrong += 1;
        }
      });
    }
  });

  const hardestQuestions = Object.entries(questionMistakes)
    .map(([id, data]) => ({
      questionId: Number(id),
      text: data.text,
      wrongCount: data.wrong,
      totalSeen: data.total,
      failRate: data.total > 0 ? Math.round((data.wrong / data.total) * 100) : 0
    }))
    .filter(q => q.wrongCount > 0)
    .sort((a, b) => b.failRate - a.failRate)
    .slice(0, 10);

  res.json({
    success: true,
    attempts,
    stats: {
      totalAttempts,
      uniqueStudents,
      averageScore,
      completionRate,
      topScore,
      hardestQuestions
    }
  });
});

// Teacher: Delete a specific attempt
app.delete('/api/attempts/:id', (req: Request, res: Response) => {
  const password = req.headers['x-teacher-password'];
  if (password !== TEACHER_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  const { id } = req.params;
  const attempts = getAttempts();
  const filtered = attempts.filter(a => a.id !== id);
  if (filtered.length === attempts.length) {
    res.status(404).json({ error: 'Attempt not found' });
    return;
  }

  saveAttempts(filtered);
  res.json({ success: true, message: 'Attempt deleted' });
});

// Teacher: Clear all attempts
app.delete('/api/attempts', (req: Request, res: Response) => {
  const password = req.headers['x-teacher-password'];
  if (password !== TEACHER_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  saveAttempts([]);
  res.json({ success: true, message: 'All attempts cleared' });
});

// --- Frontend Serving (Vite dev middleware or static dist) ---
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PowerQuest MAT server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});

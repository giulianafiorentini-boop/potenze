export type Language = 'it' | 'en';

export interface Question {
  id: number;
  category: 'calculation' | 'base_exponent' | 'properties_product' | 'properties_quotient' | 'properties_power_of_power' | 'properties_same_exponent' | 'special_cases' | 'powers_of_10_tech' | 'common_pitfalls';
  questionText: {
    it: string;
    en: string;
  };
  options: {
    it: string[];
    en: string[];
  };
  correctIndex: number;
  explanation: {
    it: string;
    en: string;
  };
  formula?: string;
  hint?: {
    it: string;
    en: string;
  };
}

export interface StudentAnswer {
  questionId: number;
  questionText: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  explanation: string;
}

export interface GameAttempt {
  id: string;
  studentName: string;
  studentSurname: string;
  language: Language;
  score: number;
  correctAnswers: number;
  questionsAnswered?: number;
  timeoutsCount?: number;
  totalQuestions: number;
  livesRemaining: number;
  totalTimeSeconds: number;
  completed: boolean; // true if finished all 12 questions, false if game over
  status?: string;
  timestamp: string; // ISO string
  formattedDate: string;
  answers: StudentAnswer[];
}

export interface TeacherStats {
  totalAttempts: number;
  uniqueStudents?: number;
  totalStudents?: number;
  averageScore: number;
  completionRate: number;
  topScore: number;
  hardestQuestions: {
    questionId: number;
    text: string;
    wrongCount: number;
    totalSeen: number;
  }[];
}

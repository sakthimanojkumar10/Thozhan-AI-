export type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
};

export type Role = 'student' | 'parent';

export type QuizAttempt = {
  userAnswers: string[];
  score: number;
  totalQuestions: number;
};

export type HistoryItem = {
  id:string;
  topic: string;
  contentType: string;
  content: string; // Raw generated content (markdown or quiz text)
  timestamp: number;
  quizAttempt?: QuizAttempt; // Details of a completed quiz
};

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface ParsedQuiz {
  topic: string;
  questions: QuizQuestion[];
}

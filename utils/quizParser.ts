import { ParsedQuiz } from '../types';

export const parseQuizContent = (content: string, topic: string): ParsedQuiz | null => {
  const questions = [];
  // Regex updated to be more robust against whitespace variations
  const questionRegex = /Q\d+:\s*(.*?)\s*A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*?)\s*Answer:\s*([A-D])/g;
  let match;
  
  while ((match = questionRegex.exec(content)) !== null) {
      const options = [match[2].trim(), match[3].trim(), match[4].trim(), match[5].trim()];
      const correctOptionLetter = match[6].trim();
      const correctIndex = ['A', 'B', 'C', 'D'].indexOf(correctOptionLetter);
      const correctAnswer = correctIndex !== -1 ? options[correctIndex] : '';

      questions.push({
          question: match[1].trim(),
          options: options,
          correctAnswer: correctAnswer,
      });
  }

  if (questions.length > 0) {
      return { topic: topic, questions: questions };
  }
  return null;
};

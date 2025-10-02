import React, { useState, useEffect } from 'react';
import { ParsedQuiz, QuizAttempt } from '../types';
import QuizResults from './QuizResults';

interface QuizProps {
  quizData: ParsedQuiz;
  onQuizComplete?: (attempt: QuizAttempt) => void;
  initialAttempt?: QuizAttempt;
}

const Quiz = ({ quizData, onQuizComplete, initialAttempt }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(initialAttempt?.userAnswers || []);
  const [showResults, setShowResults] = useState(!!initialAttempt);
  const [isCompleted, setIsCompleted] = useState(!!initialAttempt);

  // Reset state if quizData changes (e.g., new quiz is generated)
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers(initialAttempt?.userAnswers || []);
    setShowResults(!!initialAttempt);
    setIsCompleted(!!initialAttempt);
  }, [quizData, initialAttempt]);


  const currentQuestion = quizData.questions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (isCompleted) return; // Don't allow changing answers after completion
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
      if (onQuizComplete && !isCompleted) {
        const score = quizData.questions.reduce((acc, question, index) => {
          return userAnswers[index] === question.correctAnswer ? acc + 1 : acc;
        }, 0);
        
        onQuizComplete({
          score,
          totalQuestions: quizData.questions.length,
          userAnswers: userAnswers,
        });
      }
      setIsCompleted(true);
    }
  };

  if (showResults) {
    return (
      <div>
        <QuizResults quizData={quizData} userAnswers={userAnswers} />
        <button 
          onClick={() => { 
            setCurrentQuestionIndex(0); 
            setUserAnswers([]); 
            setShowResults(false);
            setIsCompleted(false);
          }} 
          className="w-full mt-6 p-3 font-semibold rounded-md btn-primary"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface p-6 rounded-lg border border-border">
      <p className="text-sm text-text-secondary mb-2">Question {currentQuestionIndex + 1} of {quizData.questions.length}</p>
      <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`w-full text-left p-3 rounded-md border-2 transition-colors ${selectedAnswer === option ? 'bg-primary border-primary-hover text-white' : 'bg-surface hover:bg-border border-border'}`}
          >
            <span className="font-mono mr-3">{String.fromCharCode(65 + index)}</span>{option}
          </button>
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={!selectedAnswer}
        className="w-full p-3 font-semibold rounded-md btn-primary"
      >
        {currentQuestionIndex === quizData.questions.length - 1 ? 'Show Results' : 'Next Question'}
      </button>
    </div>
  );
};

export default Quiz;

import React from 'react';
import { ParsedQuiz } from '../types';

interface QuizResultsProps {
    quizData: ParsedQuiz;
    userAnswers: string[];
}

const QuizResults = ({ quizData, userAnswers }: QuizResultsProps) => {
    const score = quizData.questions.reduce((acc, question, index) => {
        return userAnswers[index] === question.correctAnswer ? acc + 1 : acc;
    }, 0);
    const scorePercentage = Math.round((score / quizData.questions.length) * 100);

    return (
        <div className="bg-surface p-6 rounded-lg border border-border">
            <h3 className="text-2xl font-bold text-center mb-1">Quiz Results</h3>
            <p className="text-center text-text-secondary mb-4">Topic: {quizData.topic}</p>
            
            <div className="text-center mb-6">
                <p className="text-sm text-text-secondary">Your Score</p>
                <p className="text-5xl font-bold text-primary">{scorePercentage}%</p>
                <p className="text-text-secondary">({score} out of {quizData.questions.length} correct)</p>
            </div>

            <div className="space-y-4">
                <h4 className="text-lg font-semibold border-b border-border pb-2">Question Breakdown</h4>
                {quizData.questions.map((q, index) => {
                    const userAnswer = userAnswers[index] || "Not Answered";
                    const isCorrect = userAnswer === q.correctAnswer;
                    return (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                            <p className="font-semibold">{index + 1}. {q.question}</p>
                            <p className={`text-sm mt-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                Your answer: {userAnswer}
                            </p>
                            {!isCorrect && <p className="text-sm mt-1 text-green-400">Correct answer: {q.correctAnswer}</p>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizResults;

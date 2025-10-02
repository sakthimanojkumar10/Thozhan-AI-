import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { HistoryItem, ParsedQuiz, QuizQuestion } from '../types';
import { parseQuizContent } from '../utils/quizParser';
import QuizResults from './QuizResults';

const QuizResultsModal = ({ item, onClose }: { item: HistoryItem, onClose: () => void }) => {
    const quizData = parseQuizContent(item.content, item.topic);

    if (!quizData || !item.quizAttempt) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-surface border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">Quiz Results: {item.topic}</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">&times;</button>
                </header>
                <div className="p-6 overflow-y-auto">
                    <QuizResults quizData={quizData} userAnswers={item.quizAttempt.userAnswers} />
                </div>
            </div>
        </div>
    )
}

const ParentDashboard = () => {
  const { user, logout } = useAuth();
  // Assume student and parent use the same user ID for this simulation
  const [history] = useLocalStorage<HistoryItem[]>(`history_${user?.id || 'guest'}`, []);
  const [viewingQuiz, setViewingQuiz] = useState<HistoryItem | null>(null);

  const handleItemClick = (item: HistoryItem) => {
    if (item.quizAttempt) {
      setViewingQuiz(item);
    }
  };

  return (
    <>
      {viewingQuiz && <QuizResultsModal item={viewingQuiz} onClose={() => setViewingQuiz(null)} />}
      <div className="min-h-screen bg-background text-text-primary">
        <header className="bg-surface border-b border-border">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-brand font-bold">
              <i className="fas fa-user-shield text-primary mr-2"></i>
              Parent Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span>{user?.name}</span>
              <img src={user?.picture} alt={user?.name} className="h-8 w-8 rounded-full" />
              <button onClick={logout} className="text-text-secondary hover:text-primary" aria-label="Logout">
                <i className="fas fa-sign-out-alt text-xl"></i>
              </button>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-6 py-8">
          <h2 className="text-3xl font-bold mb-6">Student's Activity History</h2>
          
          {history.length > 0 ? (
            <div className="bg-surface border border-border rounded-lg shadow-lg">
              <ul className="divide-y divide-border">
                {history.map(item => (
                  <li key={item.id} 
                      className={`p-4 flex items-center justify-between ${item.quizAttempt ? 'cursor-pointer hover:bg-primary/10' : ''}`}
                      onClick={() => handleItemClick(item)}
                  >
                    <div>
                      <p className="font-semibold text-text-primary">{item.topic}</p>
                      <p className="text-sm text-text-secondary">{item.contentType}</p>
                      {item.quizAttempt && (
                        <p className="text-sm font-bold text-primary mt-1">
                          Score: {item.quizAttempt.score} / {item.quizAttempt.totalQuestions}
                          <span className="ml-2 text-text-secondary font-normal text-xs">(Click to view details)</span>
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-text-secondary text-right">
                      {new Date(item.timestamp).toLocaleDateString()}
                      <br />
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-16 bg-surface rounded-lg border border-border">
              <i className="fas fa-folder-open text-5xl text-text-secondary mb-4"></i>
              <h3 className="text-xl font-semibold">No Activity Yet</h3>
              <p className="text-text-secondary mt-2">Your child's generated content and quizzes will appear here.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ParentDashboard;

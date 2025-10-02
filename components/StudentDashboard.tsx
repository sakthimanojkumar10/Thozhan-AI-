import React, { useState, useRef } from 'react';
import { marked } from 'marked';
import { generateStudyContentStream } from '../services/geminiService';
import { LANGUAGES, SUBJECTS, CONTENT_TYPES } from '../constants';
import { HistoryItem, ParsedQuiz, QuizAttempt } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Quiz from './Quiz';
import { parseQuizContent } from '../utils/quizParser';


const FormInput = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
      {children}
  </div>
);

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [contentType, setContentType] = useState(CONTENT_TYPES[0]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [currentTopicTitle, setCurrentTopicTitle] = useState('');
  
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizData, setQuizData] = useState<ParsedQuiz | null>(null);
  const [initialQuizAttempt, setInitialQuizAttempt] = useState<QuizAttempt | undefined>(undefined);

  const [pendingQuizContent, setPendingQuizContent] = useState<string | null>(null);

  const [history, setHistory] = useLocalStorage<HistoryItem[]>(`history_${user?.id || 'guest'}`, []);
  
  const generateAndProcessContent = async (effectiveContentType: string) => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedContent('');
    setCurrentTopicTitle(`${effectiveContentType} for "${topic}"`);
    setIsQuizActive(false);
    setQuizData(null);
    setInitialQuizAttempt(undefined);
    setPendingQuizContent(null);

    try {
      const response = await generateStudyContentStream(topic, language, subject, effectiveContentType);
      let fullContent = '';
      for await (const chunk of response) {
        const chunkText = chunk.text;
        fullContent += chunkText;
        setGeneratedContent(prev => prev + chunkText);
      }
      
      if (effectiveContentType === 'Practice Questions') {
          const parsed = parseQuizContent(fullContent, topic);
          if (parsed) {
              setQuizData(parsed);
              setIsQuizActive(true);
              setPendingQuizContent(fullContent); // Store content, wait for quiz completion to save
          } else {
              // If parsing fails, treat it as regular content
              setHistory(prev => [{ id: Date.now().toString(), topic, contentType: effectiveContentType, content: fullContent, timestamp: Date.now() }, ...prev]);
          }
      } else {
         // Save non-quiz content to history immediately
         setHistory(prev => [{ id: Date.now().toString(), topic, contentType: effectiveContentType, content: fullContent, timestamp: Date.now() }, ...prev]);
      }
      
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
      setGeneratedContent('');
    } finally {
      setIsLoading(false);
      setTopic(''); // Clear input after generation
    }
  };

  const handleGenerate = () => {
    generateAndProcessContent(contentType);
  };

  const handleInstantQuiz = () => {
    generateAndProcessContent('Practice Questions');
  };
  
  const handleQuizComplete = (attempt: QuizAttempt) => {
    if (!pendingQuizContent) return;

    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      topic: quizData?.topic || 'Quiz',
      contentType: 'Practice Questions',
      content: pendingQuizContent,
      timestamp: Date.now(),
      quizAttempt: attempt,
    };

    setHistory(prev => [newHistoryItem, ...prev]);
    setPendingQuizContent(null);
  };

  const handleHistoryClick = (item: HistoryItem) => {
    setCurrentTopicTitle(`${item.contentType} for "${item.topic}"`);
    setGeneratedContent(item.content);
    setIsQuizActive(false);
    setQuizData(null);
    setInitialQuizAttempt(undefined);

    if (item.contentType === 'Practice Questions') {
        const parsed = parseQuizContent(item.content, item.topic);
        if (parsed) {
            setQuizData(parsed);
            setIsQuizActive(true);
            setInitialQuizAttempt(item.quizAttempt); // Pass previous attempt to Quiz component
        }
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-primary">
      {/* Control Panel */}
      <aside className="w-full md:w-1/3 max-w-sm p-6 bg-surface flex flex-col border-r border-border">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-3xl font-brand font-bold text-text-primary">
              Thozhan AI
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <img src={user?.picture} alt={user?.name} className="h-8 w-8 rounded-full" />
             <button onClick={logout} className="text-text-secondary hover:text-primary" aria-label="Logout">
              <i className="fas fa-sign-out-alt text-xl"></i>
            </button>
          </div>
        </header>
        
        <form className="space-y-6 flex-1 flex flex-col" onSubmit={e => { e.preventDefault(); handleGenerate(); }}>
           <FormInput label="Topic">
            <input id="topic-input" type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., Photosynthesis" className="w-full p-2 rounded-md form-input"/>
          </FormInput>
          <FormInput label="Language"><select id="language-select" value={language} onChange={e => setLanguage(e.target.value)} className="w-full p-2 rounded-md form-select">{LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}</select></FormInput>
          <FormInput label="Subject"><select id="subject-select" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 rounded-md form-select">{SUBJECTS.map(sub => <option key={sub} value={sub}>{sub}</option>)}</select></FormInput>
          <FormInput label="Content Type"><select id="content-type-select" value={contentType} onChange={e => setContentType(e.target.value)} className="w-full p-2 rounded-md form-select">{CONTENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}</select></FormInput>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface px-2 text-sm text-text-secondary">OR</span>
            </div>
          </div>

          <FormInput label="Instant Quiz">
            <button 
              type="button" 
              onClick={handleInstantQuiz}
              disabled={isLoading || !topic.trim()} 
              className="w-full p-3 font-semibold rounded-md bg-primary/20 text-primary border border-primary hover:bg-primary/30 flex items-center justify-center"
              aria-label="Create a 5-question quiz instantly based on the topic"
            >
              {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-bolt mr-2"></i> Create Quiz Instantly</>}
            </button>
          </FormInput>

          <div className="mt-auto pt-6"><button type="submit" disabled={isLoading || !topic.trim()} className="w-full p-3 font-semibold rounded-md btn-primary flex items-center justify-center">{isLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-cogs mr-2"></i> Generate Content</>}</button></div>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto" role="document">
          {generatedContent || isLoading || error ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">{currentTopicTitle}</h2>
              {isLoading && !generatedContent && <div className="flex items-center space-x-2 text-text-secondary" role="status"><i className="fas fa-circle-notch fa-spin"></i><span>Generating...</span></div>}
              {error && <div className="p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-md" role="alert">{error}</div>}
              
              {isQuizActive && quizData ? (
                  <Quiz 
                    quizData={quizData} 
                    onQuizComplete={pendingQuizContent ? handleQuizComplete : undefined}
                    initialAttempt={initialQuizAttempt}
                  />
              ) : (
                <article className="prose prose-invert max-w-none mt-4" dangerouslySetInnerHTML={{ __html: marked(generatedContent) }}/>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
              <i className="fas fa-book-open text-6xl mb-4"></i>
              <h2 className="text-2xl font-bold">Welcome, {user?.name}!</h2>
              <p className="max-w-md mt-2">Enter a topic on the left to get started.</p>
            </div>
          )}
        </div>
        
        {history.length > 0 && (
          <div className="h-48 p-4 border-t border-border bg-surface/50">
            <h3 className="text-lg font-semibold mb-2 text-text-secondary">Session History</h3>
            <div className="overflow-x-auto whitespace-nowrap pb-2">
              <div className="flex gap-3">
                {history.map(item => (
                  <button key={item.id} onClick={() => handleHistoryClick(item)} className="p-3 bg-surface rounded-lg text-left hover:bg-border transition-colors w-48 flex-shrink-0">
                    <p className="font-semibold text-sm truncate text-text-primary">{item.topic}</p>
                    <p className="text-xs text-text-secondary mt-1 truncate">{item.contentType}</p>
                    {item.quizAttempt && (
                       <p className="text-xs font-bold text-primary mt-1">
                          Score: {item.quizAttempt.score} / {item.quizAttempt.totalQuestions}
                       </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
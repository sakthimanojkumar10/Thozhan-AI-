import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login, loading } = useAuth();

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 text-center shadow-lg border border-border">
        <header className="mb-8">
          <h1 className="text-4xl font-brand font-bold text-text-primary flex items-center justify-center">
            <i className="fas fa-brain text-primary mr-3"></i>
            Thozhan AI
          </h1>
          <p className="text-text-secondary mt-2">Your AI-powered study companion.</p>
        </header>
        <button
          onClick={login}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 rounded-lg bg-white p-3 font-semibold text-gray-700 shadow-md transition-colors hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <>
              <svg className="h-6 w-6" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M24 9.5c3.9 0 6.8 1.6 8.4 3.1l6.3-6.3C34.9 2.5 30 .5 24 .5 14.9.5 7.7 5.8 4.4 13.5l7.1 5.5C13.1 13.4 18.1 9.5 24 9.5z"></path>
                <path fill="#34A853" d="M43.6 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11c-.5 2.8-2.1 5.1-4.6 6.7l6.5 5C41.1 36.6 43.6 31 43.6 24.5z"></path>
                <path fill="#FBBC05" d="M11.5 19C10.7 21.2 10.3 23.6 10.3 26s.4 4.8 1.2 7l-7.1 5.5C1.5 34.1.5 29.6.5 25s1-9.1 4.4-13.5l7.1 5.5z"></path>
                <path fill="#EA4335" d="M24 44.5c5.9 0 10.7-1.9 14.1-5.2l-6.5-5c-2 1.3-4.6 2.2-7.6 2.2-5.9 0-10.9-3.9-12.6-9.1L4.4 32.5C7.7 40.2 14.9 44.5 24 44.5z"></path>
                <path fill="none" d="M.5.5h47v47H.5z"></path>
              </svg>
              Sign in with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Login;
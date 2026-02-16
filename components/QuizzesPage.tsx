import React, { useState } from 'react';
import { MOCK_QUIZZES } from '../constants';
import QuizViewer from './QuizViewer';

const QuizzesPage: React.FC = () => {
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  const activeQuiz = MOCK_QUIZZES.find(q => q.id === activeQuizId);

  return (
    <div className="container mx-auto px-4 md:px-12 py-12 animate-fade-in min-h-[70vh]">
      {activeQuiz ? (
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setActiveQuizId(null)}
            className="mb-6 flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to All Quizzes
          </button>
          <QuizViewer quiz={activeQuiz} />
        </div>
      ) : (
        <>
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Self-Discovery Quizzes</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Short, educational check-ins to help you understand your habits and feelings. 
              <br/><span className="text-sm text-gray-400 italic">(Note: These are for educational purposes only and not a diagnosis.)</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {MOCK_QUIZZES.map(quiz => (
              <div key={quiz.id} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 flex flex-col items-start">
                <div className="bg-primary/10 text-primary p-3 rounded-lg mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1">
                  {quiz.summary}
                </p>
                <div className="w-full flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                  <span className="text-xs text-gray-400 font-mono">{quiz.estimatedTime} MIN</span>
                  <button 
                    onClick={() => setActiveQuizId(quiz.id)}
                    className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg font-medium transition-colors"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizzesPage;
import React, { useState } from 'react';
import { Quiz, QuizResult } from '../types';
import { Link } from 'react-router-dom';

interface QuizViewerProps {
  quiz: Quiz;
}

const QuizViewer: React.FC<QuizViewerProps> = ({ quiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Log completion when result is shown
  const logQuizCompletion = (result: QuizResult) => {
    try {
      const logs = JSON.parse(localStorage.getItem('mindbridge_quiz_logs') || '[]');
      logs.push({
        quizId: quiz.id,
        quizTitle: quiz.title,
        resultTitle: result.title,
        completedAt: new Date().toISOString()
      });
      localStorage.setItem('mindbridge_quiz_logs', JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to log quiz completion', e);
    }
  };

  const handleOptionSelect = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);

    // Auto-advance
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      setTimeout(() => finishQuiz(newAnswers), 300);
    }
  };

  const finishQuiz = (finalAnswers: number[]) => {
    setShowResult(true);
    const result = calculateResult(finalAnswers);
    if (result) logQuizCompletion(result);
  };

  const calculateResult = (currentAnswers: number[]): QuizResult | undefined => {
    const totalScore = currentAnswers.reduce((a, b) => a + b, 0);
    return quiz.results.find(r => totalScore >= r.minScore && totalScore <= r.maxScore);
  };

  const restartQuiz = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setShowResult(false);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (showResult) {
    const result = calculateResult(answers);
    if (!result) return <div>Result calculation error</div>;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden animate-pop border border-gray-100 dark:border-gray-700">
        <div className="bg-gradient-to-br from-primary to-mid p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <h2 className="text-3xl font-bold mb-2 relative z-10">Your Result</h2>
          <h3 className="text-2xl opacity-95 relative z-10">{result.title}</h3>
        </div>
        <div className="p-8 md:p-12">
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-medium">
            {result.description}
          </p>
          
          <div className="bg-blue-50 dark:bg-gray-900/50 rounded-2xl p-8 mb-8 border border-blue-100 dark:border-gray-800">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Recommended for you
            </h4>
            <div className="space-y-3">
              {result.recommendedTopicIds.map(id => (
                <Link 
                  key={id}
                  to={`/topic/${id}`} 
                  className="block p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-primary font-bold flex justify-between items-center group"
                >
                  View Suggested Strategy
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </div>
          
          <button 
            onClick={restartQuiz}
            className="w-full py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 transition-all font-bold"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col min-h-[600px] transition-all duration-300">
      {/* Header & Progress */}
      <div className="bg-gray-50/50 dark:bg-gray-900/50 p-6 border-b border-gray-100 dark:border-gray-700">
         <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
         </div>
         <div className="h-2 bg-gray-200 dark:bg-gray-700 w-full rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-mid transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
         </div>
      </div>

      <div className="p-6 md:p-12 flex-1 flex flex-col justify-center">
        {/* Animated Question Container */}
        <div key={currentQuestionIndex} className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
          <h3 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10 leading-tight">
            {question.text}
          </h3>

          <div className="space-y-4">
            {question.options.map((option, idx) => {
              const isSelected = answers[currentQuestionIndex] === option.value;
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 group flex items-center justify-between ${
                    isSelected 
                      ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md transform scale-[1.02]' 
                      : 'border-gray-100 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-sm'
                  }`}
                >
                  <span className={`font-medium text-lg ${isSelected ? 'text-primary' : 'text-gray-700 dark:text-gray-200'}`}>
                    {option.text}
                  </span>
                  {isSelected && (
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex items-center">
           {currentQuestionIndex > 0 && (
             <button 
               onClick={handleBack}
               className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors mr-auto"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
               Back
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default QuizViewer;
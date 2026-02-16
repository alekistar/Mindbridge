import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useParams, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import CrisisBanner from './components/CrisisBanner';
import Chatbot from './components/Chatbot';
import Carousel from './components/Carousel';
import Journal from './components/Journal';
import AboutPage from './components/AboutPage';
import QuizzesPage from './components/QuizzesPage';
import { AuthProvider } from './context/AuthContext';
import { COLLECTIONS, TOPICS } from './constants';
import { Topic, GuideStep } from './types';

// --- Utility Components ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Page Components ---

const HomePage: React.FC = () => {
  const featured = TOPICS.find(t => t.id === '1') || TOPICS[0];

  return (
    <div className="animate-fade-in pb-20 overflow-x-hidden">
      {/* 3D Animated Hero Section */}
      <div className="relative w-full h-[70vh] min-h-[600px] flex items-center overflow-hidden bg-gray-50 dark:bg-gray-900">
        
        {/* Animated 3D Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Blob 1 */}
          <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-blue-400/20 dark:bg-blue-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] animate-float opacity-70"></div>
          {/* Blob 2 */}
          <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] bg-purple-400/20 dark:bg-purple-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] animate-float-delayed opacity-70"></div>
          {/* Blob 3 */}
          <div className="absolute -bottom-[20%] left-[20%] w-[45vw] h-[45vw] bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] animate-breathe opacity-70"></div>
        </div>

        {/* Content Container */}
        <div className="container mx-auto px-4 md:px-12 relative z-20 flex flex-col justify-center h-full">
          <div className="max-w-3xl backdrop-blur-sm bg-white/30 dark:bg-black/20 p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-primary dark:text-blue-300 font-bold tracking-wide uppercase text-sm">Featured Strategy</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
              {featured.title}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-xl leading-relaxed">
              {featured.summary}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to={`/topic/${featured.slug}`} 
                className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/30 flex items-center gap-3 group"
              >
                <div className="bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                Watch Now
              </Link>
              <Link 
                to="/journal" 
                className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-md text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all border border-gray-200 dark:border-gray-700 hover:border-primary/50"
              >
                Open Journal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Carousels with negative margin to pull up */}
      <div className="-mt-20 relative z-30 space-y-12">
        {COLLECTIONS.map(collection => (
          <Carousel 
            key={collection.id} 
            title={collection.title} 
            items={collection.topicIds.map(id => TOPICS.find(t => t.id === id)).filter((t): t is Topic => !!t)}
          />
        ))}
      </div>
    </div>
  );
};

// Deck/Stack Style Guide Viewer
const GuideViewer: React.FC<{ steps: string[] }> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto min-h-[400px] perspective-1000">
      <div className="absolute top-0 right-0 z-10 font-mono text-sm text-gray-400 bg-white/80 dark:bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        Step {currentStep + 1} / {steps.length}
      </div>

      <div className="relative w-full h-[400px] flex items-center justify-center">
        {steps.map((step, index) => {
          // Logic for deck positioning
          const isCurrent = index === currentStep;
          const isPrev = index < currentStep;
          const isNext = index > currentStep;
          
          let cardStyle = {};
          if (isCurrent) {
            cardStyle = { zIndex: 30, opacity: 1, transform: 'translateZ(0) scale(1)' };
          } else if (isPrev) {
             // Thrown away to left
            cardStyle = { zIndex: 0, opacity: 0, transform: 'translateZ(-200px) translateX(-100%) rotate(-10deg)', pointerEvents: 'none' };
          } else if (isNext) {
             // Stacked behind
             const offset = index - currentStep;
            cardStyle = { 
              zIndex: 30 - offset, 
              opacity: 1 - (offset * 0.2), 
              transform: `translateZ(-${offset * 50}px) translateY(${offset * 10}px) scale(${1 - offset * 0.05})`,
              filter: `blur(${offset * 2}px)` 
            };
          }

          return (
            <div 
              key={index}
              className="absolute w-full h-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 md:p-12 flex flex-col justify-center items-center text-center transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) origin-bottom"
              style={cardStyle}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-primary dark:text-blue-300 font-bold text-2xl">
                {index + 1}
              </div>
              <h3 className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-white leading-relaxed">
                {step}
              </h3>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-8 px-4">
        <button 
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-6 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-all font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Previous
        </button>
        <div className="flex gap-1.5">
           {steps.map((_, i) => (
             <div key={i} className={`h-2 w-2 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
           ))}
        </div>
        <button 
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="bg-primary hover:bg-primary-dark disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:shadow-none flex items-center gap-2 hover:translate-x-1"
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

const TopicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const topic = TOPICS.find(t => t.slug === slug);
  
  if (!topic) return <div className="p-20 text-center text-gray-500">Topic not found</div>;

  const related = TOPICS.filter(t => t.id !== topic.id && t.tags.some(tag => topic.tags.includes(tag))).slice(0, 5);

  return (
    <div className="container mx-auto px-4 md:px-12 py-8 animate-fade-in pb-20">
      <Link to="/" className="text-sm text-gray-500 hover:text-primary mb-6 inline-flex items-center gap-1 group">
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Back to Home
      </Link>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* Content Player/Viewer */}
          <div className="mb-8 transform transition-all hover:scale-[1.005]">
            {topic.type === 'youtube' && topic.youtubeId && (
              <div className="rounded-2xl overflow-hidden bg-black shadow-2xl aspect-video w-full relative group border-4 border-gray-100 dark:border-gray-800 ring-1 ring-black/5">
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${topic.youtubeId}?rel=0&modestbranding=1&playsinline=1&origin=${encodeURIComponent(window.location.origin)}`} 
                  title={topic.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            {topic.type === 'article' && (
              <div className="p-8 md:p-12 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="bg-blue-50 dark:bg-blue-900/50 text-primary p-2.5 rounded-xl">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                  </div>
                  <span className="font-bold text-primary uppercase tracking-widest text-xs bg-primary/10 px-2 py-1 rounded">Article Summary</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight relative z-10">{topic.title}</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed font-serif relative z-10">
                  {topic.summary}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-gray-700 relative z-10">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Read the full article</p>
                    <p className="text-xs text-gray-500">Source: {new URL(topic.sourceUrl || '').hostname}</p>
                  </div>
                  <a 
                    href={topic.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:scale-105 transition-transform whitespace-nowrap shadow-lg"
                  >
                    Visit Source ↗
                  </a>
                </div>
              </div>
            )}

            {topic.type === 'guide' && topic.steps && (
               <GuideViewer steps={topic.steps} />
            )}
          </div>

          {/* Metadata for Video/Guide */}
          {topic.type !== 'article' && (
            <div className="mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{topic.title}</h1>
              
              {/* Video Specific Metadata */}
              {topic.type === 'youtube' && (
                <div className="flex items-center gap-4 mb-6 text-sm border-b border-gray-100 dark:border-gray-800 pb-6">
                  {topic.channelName && (
                    <div className="flex items-center gap-3 text-gray-900 dark:text-gray-200 font-bold">
                       <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-sm">
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                       </div>
                       {topic.channelName}
                    </div>
                  )}
                  {topic.sourceUrl && (
                    <a href={topic.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark font-medium hover:underline flex items-center gap-1.5 ml-auto md:ml-0">
                      Watch on YouTube
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    </a>
                  )}
                </div>
              )}

              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6 max-w-2xl">{topic.summary}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {topic.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
          
          {/* About this content Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
               <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-primary text-xs font-bold font-serif">i</div>
               <h3 className="font-bold text-gray-900 dark:text-white text-sm">About this content</h3>
            </div>
            <div className="p-4 space-y-2 text-sm">
               {/* Type */}
               <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Type</span>
                  <span className="font-bold text-gray-900 dark:text-white capitalize">{topic.type}</span>
               </div>
               {/* Published */}
               <div className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-800">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Published</span>
                  <span className="font-bold text-gray-900 dark:text-white">{new Date(topic.publishedAt).toLocaleDateString()}</span>
               </div>
               {/* Time */}
               {topic.estimatedTime && (
                 <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Est. Time</span>
                    <span className="font-bold text-gray-900 dark:text-white">{topic.estimatedTime} mins</span>
                 </div>
               )}
            </div>
          </div>
          
          {/* Reflect Card */}
          <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800 relative overflow-hidden">
             {/* Decorative Corner */}
             <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-blue-800/30 rounded-bl-full -mr-4 -mt-4"></div>
             
             <h3 className="font-bold text-primary mb-2 relative z-10">Reflect on this</h3>
             <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 relative z-10 leading-relaxed">
               How did this content make you feel? Write a quick private note.
             </p>
             <Link to="/journal" className="block w-full text-center bg-white dark:bg-gray-800 text-primary font-bold py-3 rounded-xl border border-blue-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative z-10">
               Open Journal
             </Link>
          </div>
        </div>
      </div>

      {/* Related Rows */}
      {related.length > 0 && (
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
           <Carousel title="Related Topics" items={related} />
        </div>
      )}
    </div>
  );
};

const DirectoryPage: React.FC<{ type: 'guide' | 'article', title: string }> = ({ type, title }) => {
  const items = TOPICS.filter(t => t.type === type);
  return (
    <div className="container mx-auto px-4 md:px-12 py-12 animate-fade-in min-h-[60vh]">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
      <p className="text-gray-500 mb-8">Curated resources for you.</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <Link key={item.id} to={`/topic/${item.slug}`} className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-700 flex flex-col">
            {type === 'guide' ? (
              <div className="h-48 bg-gradient-to-br from-primary to-mid p-6 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <svg className="w-16 h-16 text-white/50 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              </div>
            ) : (
              <div className="h-48 bg-gray-100 dark:bg-gray-900 p-8 flex flex-col justify-center relative overflow-hidden">
                 <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                 <h3 className="font-bold text-gray-400 text-xs tracking-widest uppercase mb-2 relative z-10">Source: {new URL(item.sourceUrl || 'http://web').hostname}</h3>
                 <p className="text-gray-900 dark:text-gray-100 font-serif italic relative z-10 group-hover:text-primary transition-colors">"{item.title}"</p>
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
               <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{item.title}</h2>
               <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">{item.summary}</p>
               <span className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                 {type === 'guide' ? 'Start Guide' : 'Read Summary'} 
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
               </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// --- App Root ---

const App: React.FC = () => {
  const [crisisMode, setCrisisMode] = useState(false);

  return (
    <AuthProvider>
      <HashRouter>
        <ScrollToTop />
        {crisisMode && <CrisisBanner fullScreen onDismiss={() => setCrisisMode(false)} />}
        
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/topic/:slug" element={<TopicPage />} />
            <Route path="/journal" element={<Journal triggerCrisis={() => setCrisisMode(true)} />} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/guides" element={<DirectoryPage type="guide" title="Coping Guides" />} />
            <Route path="/articles" element={<DirectoryPage type="article" title="Articles & Resources" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>

        <Chatbot triggerCrisis={() => setCrisisMode(true)} />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
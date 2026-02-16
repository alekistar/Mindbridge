import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Default to light theme as requested, unless user explicitly set dark
    const saved = localStorage.getItem('theme');
    
    // Only enable dark mode if explicitly saved as 'dark'
    if (saved === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const NavItem = ({ to, icon, label, exact = false }: { to: string; icon: React.ReactNode; label: string; exact?: boolean }) => {
    const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
          isActive 
            ? 'bg-gradient-to-r from-primary to-mid text-white shadow-lg shadow-blue-500/30 translate-x-1' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary'
        }`}
      >
        <div className={`p-1 relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
          {icon}
        </div>
        <span className={`font-medium tracking-wide relative z-10 ${isActive ? 'text-white' : ''} hidden lg:block`}>{label}</span>
      </Link>
    );
  };

  const MobileNavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className={`flex flex-col items-center justify-center w-full py-2 relative ${isActive ? 'text-primary' : 'text-gray-400'}`}>
        {isActive && (
          <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_10px_rgba(10,102,255,0.8)]"></div>
        )}
        <div className={`mb-1 transition-all duration-300 ${isActive ? 'transform -translate-y-1 scale-110' : ''}`}>
           {icon}
        </div>
        <span className="text-[10px] font-medium">{label}</span>
      </Link>
    );
  };

  // Icons
  const Icons = {
    Home: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    Journal: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    Quizzes: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
    Guides: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    About: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Articles: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* --- Desktop Sidebar --- */}
      <aside className="hidden md:flex flex-col w-20 lg:w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-30 shadow-lg">
        {/* Logo Area */}
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8">
          <Link to="/" className="flex items-center gap-3 group relative">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-lg opacity-40 rounded-full group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-mid rounded-xl shadow-inner flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform duration-300 border border-white/20">
                M
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white hidden lg:block group-hover:text-primary transition-colors bg-clip-text">
              MindBridge
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 lg:px-4 space-y-2 no-scrollbar">
          <NavItem to="/" icon={Icons.Home} label="Home" exact />
          <NavItem to="/journal" icon={Icons.Journal} label="Journal" />
          <NavItem to="/quizzes" icon={Icons.Quizzes} label="Quizzes" />
          <div className="pt-6 pb-2">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden lg:block mb-2 opacity-70">Discover</p>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mx-4 lg:hidden"></div>
          </div>
          <NavItem to="/guides" icon={Icons.Guides} label="Guides" />
          <NavItem to="/articles" icon={Icons.Articles} label="Articles" />
          <NavItem to="/about" icon={Icons.About} label="About & Help" />
        </nav>

        {/* User & Theme Section */}
        <div className="p-4 bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-900/50">
          <div className="flex flex-col gap-4">
            {/* Theme Toggle (Beautiful Animated Switch) */}
            <button 
              onClick={toggleTheme}
              className="relative w-full h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-between px-1.5 cursor-pointer shadow-inner transition-colors duration-300 group overflow-hidden"
              aria-label="Toggle Theme"
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`}></div>
              
              <div className="flex-1 flex justify-center z-10">
                 <svg className={`w-5 h-5 transition-colors duration-300 ${!isDark ? 'text-yellow-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div className="flex-1 flex justify-center z-10">
                 <svg className={`w-5 h-5 transition-colors duration-300 ${isDark ? 'text-blue-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              </div>
              
              {/* Sliding Pill */}
              <div 
                className={`absolute w-[calc(50%-6px)] h-9 bg-white dark:bg-gray-700 rounded-lg shadow-md transform transition-transform duration-300 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${isDark ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`}
              ></div>
            </button>

            {/* Auth Button */}
            {user ? (
               <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer group" onClick={() => { if(window.confirm('Log out?')) logout() }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      {user.name[0]}
                    </div>
                  )}
                  <div className="hidden lg:block overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500">View Profile</p>
                  </div>
               </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="w-full bg-primary hover:bg-primary-dark text-white p-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                <span className="hidden lg:block font-bold relative z-10">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-20">
          <Link to="/" className="font-bold text-xl text-primary flex items-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-br from-primary to-mid rounded-lg flex items-center justify-center text-white text-sm shadow-md">M</div>
             MindBridge
          </Link>
          <div className="flex items-center gap-3">
             <button onClick={toggleTheme} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400">
                {isDark ? (
                   <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                ) : (
                   <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                )}
             </button>
             {user ? (
               <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" onClick={() => { if(window.confirm('Log out?')) logout() }} />
             ) : (
               <button onClick={() => setAuthModalOpen(true)} className="text-sm font-bold text-primary">Login</button>
             )}
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          {children}
          
          {/* Footer inside scroll area */}
          <footer className="bg-white dark:bg-black py-16 border-t border-gray-200 dark:border-gray-800 mt-auto">
            <div className="container mx-auto px-4 md:px-12">
              <div className="grid md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                     <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">M</div>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white">MindBridge</h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                    A safe digital space for teenagers to explore mental wellness, designed with empathy, privacy, and evidence-based science.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-6">Resources</h4>
                  <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                    <li><a href="#" className="hover:text-primary transition-colors">Emergency Help</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Find a Therapist</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Community Guidelines</a></li>
                  </ul>
                </div>
                <div>
                   <h4 className="font-bold text-gray-900 dark:text-white mb-6">Legal</h4>
                  <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                    <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Terms of Use</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                <p>© {new Date().getFullYear()} MindBridge. Educational purposes only. Not medical advice.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                  <span>Made with ❤️ for mental health.</span>
                </div>
              </div>
            </div>
          </footer>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden h-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-start pt-3 px-2 pb-safe z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
           <MobileNavItem to="/" icon={Icons.Home} label="Home" />
           <MobileNavItem to="/journal" icon={Icons.Journal} label="Journal" />
           <MobileNavItem to="/quizzes" icon={Icons.Quizzes} label="Quizzes" />
           <MobileNavItem to="/guides" icon={Icons.Guides} label="Guides" />
        </nav>
      </div>
    </div>
  );
};

export default Layout;
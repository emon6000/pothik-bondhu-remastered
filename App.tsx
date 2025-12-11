import React, { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { districts } from './data/districts';
import TripView from './components/TripView';
import GuideFinder from './components/GuideFinder';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import ChatBot from './components/ChatBot';
import { District, User, Guide, Booking } from './types';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { translations } from './data/translations';

// Icons
const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const SystemIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: string }> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
      <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full ${maxWidth} overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]`}>
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6 dark:text-slate-300 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

type Theme = 'light' | 'dark' | 'system';

// Separate component to consume LanguageContext safely
const MainContent: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');
  
  const [trip, setTrip] = useState<{ start: District; end: District } | null>(null);
  const [bookedGuide, setBookedGuide] = useState<Guide | null>(null);
  const [error, setError] = useState('');

  // User State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Modal States
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGuideDashboardOpen, setIsGuideDashboardOpen] = useState(false);
  
  // State to track which district's guides to show initially
  const [guideSearchDistrict, setGuideSearchDistrict] = useState<string | null>(null);

  // Guide Dashboard Status
  const [guideStatus, setGuideStatus] = useState<boolean>(true);
  const [guideLocation, setGuideLocation] = useState<string>('');

  // Theme State
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  // Smart Navbar State
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        // Always show if near top
        if (currentScrollY < 50) {
            setIsHeaderVisible(true);
        } 
        // Hide if scrolling down
        else if (currentScrollY > lastScrollY) {
            setIsHeaderVisible(false);
        } 
        // Show if scrolling up
        else {
            setIsHeaderVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    if (user.role === 'guide') {
      setGuideStatus(user.isAvailable ?? true);
      setGuideLocation(user.currentLocation || user.district || districts[0].name);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setBookedGuide(null);
  };

  const handleGuideBooked = (guide: Guide) => {
    setBookedGuide(guide);
    if (currentUser) {
        const bookingsStr = localStorage.getItem('user_bookings');
        const bookings: Booking[] = bookingsStr ? JSON.parse(bookingsStr) : [];
        
        const newBooking: Booking = {
            id: `bk-${Date.now()}`,
            userId: currentUser.id,
            guideId: guide.id,
            guideName: guide.name,
            guidePhoto: guide.photo,
            guidePhone: guide.phone,
            guideEmail: guide.email,
            tripStart: trip ? trip.start.name : 'Unknown',
            tripEnd: trip ? trip.end.name : 'Unknown',
            bookingDate: new Date().toISOString(),
            status: 'active',
            isRated: false
        };
        
        bookings.push(newBooking);
        localStorage.setItem('user_bookings', JSON.stringify(bookings));
    }
    setIsGuideOpen(false);
  };

  const handleUpdateGuideStatus = () => {
    if (!currentUser || currentUser.role !== 'guide') return;

    const usersStr = localStorage.getItem('users');
    const users = usersStr ? JSON.parse(usersStr) : {};
    
    const updatedUser = { 
        ...currentUser, 
        isAvailable: guideStatus,
        currentLocation: guideLocation 
    };

    users[currentUser.id] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
    
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    const guidesStr = localStorage.getItem('custom_guides');
    if (guidesStr) {
        let guides: Guide[] = JSON.parse(guidesStr);
        const idx = guides.findIndex(g => g.id === currentUser.id);
        if (idx !== -1) {
            guides[idx] = { 
                ...guides[idx], 
                isAvailable: guideStatus,
                location: guideLocation
            };
            localStorage.setItem('custom_guides', JSON.stringify(guides));
        }
    }
    
    setIsGuideDashboardOpen(false);
    alert("Status Updated Successfully!");
  };

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark = 
        theme === 'dark' || 
        (theme === 'system' && mediaQuery.matches);

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const getThemeIcon = () => {
    if (theme === 'system') return <SystemIcon />;
    if (theme === 'dark') return <MoonIcon />;
    return <SunIcon />;
  };

  const fuse = useMemo(() => {
    return new Fuse(districts, {
      keys: ['name', 'aliases', 'bnName'],
      threshold: 0.45,
      ignoreLocation: true, 
      minMatchCharLength: 2,
    });
  }, []);

  const findDistrict = (input: string): District | null => {
    if (!input || input.trim() === '') return null;
    const result = fuse.search(input.trim());
    return result.length > 0 ? result[0].item : null;
  };

  const handlePlanTrip = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const start = findDistrict(fromInput);
    const end = findDistrict(toInput);

    if (!start) {
      setError(`${t.hero.errorNotFound} "${fromInput}".`);
      return;
    }
    if (!end) {
      setError(`${t.hero.errorNotFound} "${toInput}".`);
      return;
    }
    if (start.name === end.name) {
      setError(t.hero.errorSame);
      return;
    }

    setTrip({ start, end });
  };

  const resetTrip = () => {
    setTrip(null);
    setBookedGuide(null); 
    setFromInput('');
    setToInput('');
    setError('');
  };

  const handleOpenGuides = (districtName?: string) => {
    setGuideSearchDistrict(districtName || null);
    setIsGuideOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 relative transition-colors duration-300">
      
      {/* Header with Smart Hiding Logic */}
      <header className={`bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-6 fixed top-0 w-full z-30 shadow-sm transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={resetTrip}>
            <div className="text-indigo-600 dark:text-indigo-400">
              <MapIcon />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Pothik-<span className="text-indigo-600 dark:text-indigo-400">bondhu</span></span>
          </div>
          
          <nav className="flex items-center space-x-3 flex-wrap justify-center">
            
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage} 
              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-sm font-bold border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors mr-2 flex items-center gap-1"
            >
              {language === 'bn' ? '🇧🇩 বাংলা' : '🇺🇸 English'}
            </button>

            {currentUser ? (
              <div className="flex items-center mr-2 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-full">
                 {currentUser.role === 'guide' && (
                    <button 
                        onClick={() => setIsGuideDashboardOpen(true)}
                        className={`mr-3 px-2 py-0.5 rounded text-xs font-bold uppercase border ${currentUser.isAvailable ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}
                    >
                        {currentUser.isAvailable ? t.nav.available : t.nav.busy}
                    </button>
                 )}
                <div 
                  className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold mr-2 cursor-pointer hover:bg-indigo-700"
                  onClick={() => setIsProfileOpen(true)}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <span 
                  className="text-sm font-semibold mr-3 hidden sm:inline cursor-pointer hover:text-indigo-600"
                  onClick={() => setIsProfileOpen(true)}
                >
                  {currentUser.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-xs text-red-500 hover:text-red-700 font-bold"
                >
                  {t.nav.logout}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
              >
                {t.nav.login}
              </button>
            )}

            <button 
              onClick={() => handleOpenGuides()}
              className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center"
            >
              <span className="mr-2">🧭</span> <span className="hidden sm:inline">{t.nav.guides}</span>
            </button>
            <button 
              onClick={() => setIsAboutOpen(true)}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {t.nav.about}
            </button>
            
            <button 
              onClick={cycleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {getThemeIcon()}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content with top padding to account for fixed header */}
      <main className="flex-grow flex flex-col items-center justify-start pt-32 px-4">
        
        {!trip ? (
          <div className="w-full max-w-lg animate-fade-in-up">
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100 dark:border-indigo-800">
                {t.hero.version}
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                {t.hero.welcome} <br/> <span className="text-indigo-600 dark:text-indigo-400">{t.appTitle}</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-sm mx-auto">
                {t.hero.subtitle} <br/>
                <span className="text-sm opacity-80">{t.hero.features}</span>
              </p>
            </div>

            <form onSubmit={handlePlanTrip} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">{t.hero.fromLabel}</label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder={t.hero.fromPlaceholder}
                    value={fromInput}
                    onChange={(e) => setFromInput(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                   <div className="absolute left-1/2 -top-3 -translate-x-1/2 bg-white dark:bg-slate-900 p-1 rounded-full border border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">{t.hero.toLabel}</label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder={t.hero.toPlaceholder}
                    value={toInput}
                    onChange={(e) => setToInput(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {t.hero.startBtn}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <TripView 
            startDistrict={trip.start} 
            endDistrict={trip.end} 
            bookedGuide={bookedGuide}
            onBack={resetTrip}
            onViewGuides={handleOpenGuides}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-10 mt-auto transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 text-center">
            
            <div className="mb-6">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Pothik-<span className="text-indigo-600 dark:text-indigo-400">bondhu</span></span>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t.hero.subtitle}</p>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 my-6 w-1/2 mx-auto"></div>

            <div className="space-y-4">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">{t.footer.contact}</p>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Abdullah Al Mahmud Emon</h3>
                {/* Contact links remain same */}
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-8 mt-4">
                    <a href="mailto:abdullahemon6377@gmail.com" className="group flex items-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm">
                        <span className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-2 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </span>
                        <span>abdullahemon6377@gmail.com</span>
                    </a>
                    <a href="https://github.com/emon6000" target="_blank" rel="noopener noreferrer" className="group flex items-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm">
                        <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-2 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </span>
                        <span>GitHub</span>
                    </a>
                </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Pothik-bondhu. {t.footer.rights}
            </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <Modal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        title={language === 'en' ? "Welcome to Pothik-bondhu" : "পথিক-বন্ধুতে স্বাগতম"}
      >
        <AuthModal 
          onClose={() => setIsAuthOpen(false)}
          onLogin={handleLogin}
        />
      </Modal>

      {/* Profile Modal */}
      {currentUser && (
        <Modal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            title="My Profile"
        >
            <UserProfile 
                user={currentUser} 
                onClose={() => setIsProfileOpen(false)}
                onUpdate={() => {}}
            />
        </Modal>
      )}

      {/* Guide Finder Modal */}
      <Modal 
        isOpen={isGuideOpen} 
        onClose={() => setIsGuideOpen(false)} 
        title={t.nav.guides}
        maxWidth="max-w-4xl"
      >
        <GuideFinder 
          onClose={() => setIsGuideOpen(false)} 
          initialDistrict={guideSearchDistrict}
          currentUser={currentUser}
          onOpenAuth={() => {
            setIsGuideOpen(false); 
            setIsAuthOpen(true);
          }}
          onGuideBooked={handleGuideBooked}
        />
      </Modal>

      {/* Guide Dashboard Modal */}
      <Modal 
        isOpen={isGuideDashboardOpen} 
        onClose={() => setIsGuideDashboardOpen(false)} 
        title="Guide Dashboard"
      >
         <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-4">Availability Status</h4>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setGuideStatus(true)}
                        className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${guideStatus ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 text-slate-400'}`}
                    >
                        {t.nav.available}
                    </button>
                    <button 
                        onClick={() => setGuideStatus(false)}
                        className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${!guideStatus ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 text-slate-400'}`}
                    >
                        {t.nav.busy}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Current Location</label>
                <select 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                    value={guideLocation}
                    onChange={e => setGuideLocation(e.target.value)}
                >
                    {districts.map(d => (
                        <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                </select>
                <p className="text-xs text-slate-400 mt-2">Update this as you travel to help users find you in your current district.</p>
            </div>

            <button 
                onClick={handleUpdateGuideStatus}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg"
            >
                Update Status
            </button>
         </div>
      </Modal>

      {/* About Modal */}
      <Modal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
        title={t.nav.about}
      >
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          {language === 'en' ? (
              <>
              <strong>Pothik-bondhu</strong> (পথিক-বন্ধু) is an intelligent route planning application designed specifically for exploring the beautiful country of Bangladesh.
              </>
          ) : (
              <>
              <strong>পথিক-বন্ধু</strong> বাংলাদেশের পর্যটন শিল্পের প্রসারে এবং ভ্রমণকারীদের সুবিধার জন্য তৈরি একটি স্মার্ট ট্রাভেল অ্যাপ্লিকেশন।
              </>
          )}
        </p>
        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-sm text-indigo-800 dark:text-indigo-300">
          {t.hero.features}
        </div>
      </Modal>

      {/* Draggable ChatBot */}
      <ChatBot />
    </div>
  );
};

// Wrap App in Provider
const App: React.FC = () => {
    return (
        <LanguageProvider>
            <MainContent />
        </LanguageProvider>
    );
};

export default App;
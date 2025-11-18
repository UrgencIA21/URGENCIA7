
import React, { useState, useEffect } from 'react';
import type { Emergency, User } from './types';
import EmergencySelector from './components/EmergencySelector';
import ChatScreen from './components/ChatScreen';
import VideoLibrary from './components/VideoLibrary';
import LoginScreen from './components/LoginScreen';
import PremiumModal from './components/PremiumModal';
import PatientRecordScreen from './components/PatientRecordScreen';
import ProfileSetupModal from './components/ProfileSetupModal';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [isVideoLibraryOpen, setIsVideoLibraryOpen] = useState(false);
  const [isPatientRecordOpen, setIsPatientRecordOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // PWA Install State
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // SESSION STORAGE KEY: Used to keep user logged in on refresh
  const SESSION_KEY = 'urgencia_session';

  // Load active session from localStorage on mount
  useEffect(() => {
      const sessionUser = localStorage.getItem(SESSION_KEY);
      if (sessionUser) {
          try {
              const parsedUser = JSON.parse(sessionUser);
              setUser(parsedUser);
          } catch (e) {
              console.error("Failed to parse user from session storage");
              localStorage.removeItem(SESSION_KEY);
          }
      }
      
      // Check system preference for dark mode
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setIsDarkMode(true);
      }
  }, []);

  // PWA Install Event Listener
  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Toggle Dark Mode Class on HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // CHECK SUBSCRIPTION STATUS ENGINE (The Enforcer)
  useEffect(() => {
    if (user && (user.plan === 'premium' || user.plan === 'platinum') && user.subscriptionDate) {
        const now = new Date();
        const subDate = new Date(user.subscriptionDate);
        const diffTime = Math.abs(now.getTime() - subDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays > 30) {
            alert(`Sua assinatura ${user.plan.toUpperCase()} expirou há ${diffDays - 30} dia(s). Renove para continuar.`);
            const dowgradedUser: User = { ...user, plan: 'free', subscriptionDate: undefined };
            
            setUser(dowgradedUser);
            saveUserData(dowgradedUser); // Save updated status

            setIsPremiumModalOpen(true);
        }
    }
  }, [user]);

  // CHECK PROFILE COMPLETENESS ON LOGIN
  useEffect(() => {
      if (user) {
          const skipKey = `urgencia_skipped_profile_${user.email}`;
          const hasSkipped = localStorage.getItem(skipKey);
          
          // Se não tiver dados E não tiver pulado anteriormente, abre o modal
          if ((!user.age || !user.weight) && !hasSkipped) {
              setIsProfileSetupOpen(true);
          }
      }
  }, [user]);

  // Helper to save user data to both Session (active) and Persistent Storage (database simulation)
  const saveUserData = (userData: User) => {
      // 1. Update active session
      localStorage.setItem(SESSION_KEY, JSON.stringify(userData));

      // 2. Update persistent "Database" for this email
      const dbKey = `urgencia_data_${userData.email}`;
      localStorage.setItem(dbKey, JSON.stringify(userData));
  };

  const handleLogin = (loginData: User) => {
    // Check if we have persistent data for this email
    const dbKey = `urgencia_data_${loginData.email}`;
    const storedDataStr = localStorage.getItem(dbKey);
    
    let finalUser = loginData;
    
    if (storedDataStr) {
        try {
            const storedData = JSON.parse(storedDataStr);
            // Merge stored profile data with login info
            // This restores Age, Weight, Plan, etc.
            finalUser = { ...storedData, ...loginData };
        } catch (e) {
            console.error("Error parsing persistent data");
        }
    }

    setUser(finalUser);
    saveUserData(finalUser);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedEmergency(null);
    setIsVideoLibraryOpen(false);
    setIsPatientRecordOpen(false);
    
    // Remove ONLY the session key. 
    // The data in `urgencia_data_${email}` remains saved for next login.
    localStorage.removeItem(SESSION_KEY);
  };

  const handleSelectEmergency = (emergency: Emergency) => {
    // Check for Premium Lock
    if (emergency.isPremium && user?.plan === 'free') {
      setIsPremiumModalOpen(true);
      return;
    }

    // Check for Platinum Lock
    if (emergency.isPlatinum && user?.plan !== 'platinum') {
        setIsPremiumModalOpen(true);
        return;
    }

    if (emergency.id === 'videos_educativos') {
      setIsVideoLibraryOpen(true);
    } else if (emergency.id === 'prontuario_digital') {
      setIsPatientRecordOpen(true);
    } else {
      setSelectedEmergency(emergency);
    }
  };

  const handleGoBack = () => {
    setSelectedEmergency(null);
    setIsVideoLibraryOpen(false);
    setIsPatientRecordOpen(false);
  };

  const handleUpgrade = (plan: 'premium' | 'platinum') => {
    if (user) {
        const updatedUser: User = { 
            ...user, 
            plan: plan,
            subscriptionDate: new Date().toISOString() 
        };
        setUser(updatedUser);
        saveUserData(updatedUser); // Persist change
        setIsPremiumModalOpen(false);
    }
  };

  const handleUpdateProfile = (data: Partial<User>) => {
      if (user) {
          const updatedUser = { ...user, ...data };
          setUser(updatedUser);
          saveUserData(updatedUser); // Persist change
          setIsProfileSetupOpen(false);
      }
  };

  const handleCloseProfileModal = () => {
      setIsProfileSetupOpen(false);
      // Se o usuário fechar sem salvar (skip), marca no localStorage para não pedir de novo
      if (user) {
          localStorage.setItem(`urgencia_skipped_profile_${user.email}`, 'true');
      }
  };

  const handleInstallApp = () => {
      if (!installPrompt) return;
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt');
          } else {
              console.log('User dismissed the install prompt');
          }
          setInstallPrompt(null);
      });
  };
  
  const getDaysRemaining = () => {
      if (!user?.subscriptionDate) return 0;
      const now = new Date();
      const subDate = new Date(user.subscriptionDate);
      const diffTime = Math.abs(now.getTime() - subDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, 30 - diffDays);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-red-950' : 'bg-gradient-to-br from-slate-50 to-red-50/50'}`}>
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        onUpgrade={handleUpgrade}
        userEmail={user.email}
      />

      <ProfileSetupModal
        isOpen={isProfileSetupOpen}
        onClose={handleCloseProfileModal}
        onSubmit={handleUpdateProfile}
        initialData={user}
        // Removemos o isMandatory para sempre permitir fechar
      />

      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-30 glass shadow-sm border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleGoBack}>
            <div className="relative">
                <div className="absolute inset-0 bg-red-600 blur opacity-20 rounded-full group-hover:opacity-40 transition-opacity"></div>
                <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white p-2 rounded-xl shadow-lg shadow-red-500/20 relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M2 12h20" strokeOpacity="0.5" strokeWidth="1"/>
                    <path d="M7 12h3l2-4 4 8 2-4h4" />
                </svg>
                </div>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white hidden xs:block">
              Urgênc<span className="text-red-600 dark:text-red-500">IA</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Install App Button (Only shows if prompt is available) */}
             {installPrompt && (
                 <button 
                    onClick={handleInstallApp}
                    className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold px-3 py-2 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                 >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                     </svg>
                     <span className="hidden sm:inline">Instalar App</span>
                 </button>
             )}

            {/* Theme Toggle */}
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
                {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                )}
            </button>

             {user.plan !== 'platinum' && (
                <button 
                    onClick={() => setIsPremiumModalOpen(true)}
                    className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg shadow-slate-500/20"
                >
                    {user.plan === 'premium' ? 'UPGRADE' : 'SEJA PRO'}
                </button>
             )}
             <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-700 pl-3">
                 <button 
                    onClick={() => setIsProfileSetupOpen(true)}
                    className="flex flex-col items-end hidden sm:flex group"
                 >
                     <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{user.name}</span>
                     <div className="flex items-center gap-1">
                        <span className={`text-[10px] uppercase font-extrabold 
                            ${user.plan === 'premium' ? 'text-red-500' : 
                              user.plan === 'platinum' ? 'text-cyan-500' : 'text-slate-400'}`}>
                            {user.plan}
                        </span>
                        {user.plan !== 'free' && (
                            <span className="text-[8px] text-green-500 font-medium bg-green-100 dark:bg-green-900/30 px-1 rounded">Renova: {getDaysRemaining()}d</span>
                        )}
                     </div>
                 </button>
                 <button onClick={handleLogout} title="Sair" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                 </button>
             </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 md:p-6 flex flex-col max-w-5xl relative z-10">
        <div className="flex-grow flex flex-col">
          {isVideoLibraryOpen ? (
            <VideoLibrary onBack={handleGoBack} />
          ) : isPatientRecordOpen ? (
            <PatientRecordScreen onBack={handleGoBack} user={user} />
          ) : selectedEmergency ? (
            <ChatScreen emergency={selectedEmergency} onBack={handleGoBack} user={user} />
          ) : (
            <EmergencySelector 
                onSelectEmergency={handleSelectEmergency} 
                userPlan={user.plan}
            />
          )}
        </div>
      </main>

      <footer className="text-center p-6 text-xs text-slate-400 dark:text-slate-600 border-t border-slate-100 dark:border-slate-800 mt-auto">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="flex justify-center items-center gap-2 mb-2">
             <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-[10px] font-bold tracking-wider">PHTLS 10ª Ed</span>
             <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-[10px] font-bold tracking-wider">AHA 2025</span>
             <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-[10px] font-bold tracking-wider">SAMU/MS</span>
          </div>
          <p className="font-bold text-red-500 dark:text-red-400">⚠ AVISO LEGAL E DE SEGURANÇA</p>
          <p>O UrgêncIA utiliza Inteligência Artificial baseada em protocolos internacionais atualizados (2024/2025). Esta ferramenta é um suporte de decisão e NÃO substitui o julgamento clínico profissional ou o atendimento do SAMU (192) e Bombeiros (193). Em caso de risco de morte, ligue imediatamente para a emergência.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

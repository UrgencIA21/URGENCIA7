
import React, { useState } from 'react';
import type { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isDarkMode, toggleTheme }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Create a mock user
      const user: User = {
        name: name || 'Usuário',
        email: email,
        plan: 'free', // Default to free plan
      };
      onLogin(user);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in-up transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
        {/* Theme Toggle Absolute */}
        <div className="absolute top-6 right-6 z-10">
             {/* Se quiser colocar um toggle aqui também */}
        </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Header Area */}
        <div className="bg-gradient-to-br from-red-600 to-orange-600 p-8 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
           <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg border border-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M2 12h20" strokeOpacity="0.5" strokeWidth="1"/>
                    <path d="M7 12h3l2-4 4 8 2-4h4" />
                </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Urgênc<span className="text-red-200">IA</span>
            </h1>
            <p className="text-red-100 mt-2 text-sm font-medium">
                {isRegister ? 'Crie sua conta e esteja protegido.' : 'Acesse para salvar vidas.'}
            </p>
           </div>
        </div>

        {/* Form Area */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 outline-none transition-all font-medium text-slate-700 dark:text-slate-200"
                  placeholder="Seu nome"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 outline-none transition-all font-medium text-slate-700 dark:text-slate-200"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 outline-none transition-all font-medium text-slate-700 dark:text-slate-200"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-700 hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isRegister ? 'Criar Conta Gratuita' : 'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {isRegister ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="ml-2 text-red-600 dark:text-red-500 font-bold hover:underline"
              >
                {isRegister ? 'Fazer Login' : 'Cadastre-se'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

import React from 'react';
import type { Emergency } from '../types';
import { EMERGENCIES } from '../constants';

interface EmergencySelectorProps {
  onSelectEmergency: (emergency: Emergency) => void;
  userPlan: 'free' | 'premium' | 'platinum';
}

const EmergencySelector: React.FC<EmergencySelectorProps> = ({ onSelectEmergency, userPlan }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow py-6">
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-3 tracking-tight">
          Qual é a emergência?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-base md:text-lg leading-relaxed">
          Selecione abaixo para iniciar o atendimento imediato com IA.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full animate-fade-in-up" style={{animationDelay: '0.1s'}}>
        {EMERGENCIES.map((emergency) => {
          const isPremiumLocked = emergency.isPremium && userPlan === 'free';
          const isPlatinumLocked = emergency.isPlatinum && userPlan !== 'platinum';
          const isLocked = isPremiumLocked || isPlatinumLocked;
          
          return (
            <button
              key={emergency.id}
              onClick={() => onSelectEmergency(emergency)}
              className={`group relative flex flex-col items-center p-5 rounded-2xl shadow-sm border transition-all duration-300 ease-out transform hover:-translate-y-1 active:scale-95
                ${isLocked ? 'grayscale opacity-70' : ''}
                bg-white dark:bg-slate-800/50 
                border-slate-100 dark:border-slate-700
                hover:border-red-200 dark:hover:border-red-900
                hover:shadow-lg hover:shadow-red-200/40 dark:hover:shadow-red-900/20
              `}
            >
              {isLocked && (
                  <div className={`absolute top-3 right-3 p-1.5 rounded-lg z-10 ${emergency.isPlatinum ? 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                  </div>
              )}

              <div className={`p-3.5 rounded-2xl mb-3 transition-colors duration-300 
                ${
                emergency.isPlatinum ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white' :
                emergency.id === 'videos_educativos' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white' :
                emergency.id === 'triage_sinais' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white' :
                emergency.id === 'ansiedade' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white' :
                'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 group-hover:bg-red-600 group-hover:text-white'
                }`}
              >
                {emergency.icon}
              </div>
              
              <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors text-center leading-tight">
                {emergency.name}
              </h3>
              
              <p className="hidden sm:block mt-2 text-xs text-slate-500 dark:text-slate-400 text-center line-clamp-2 px-2">
                {emergency.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EmergencySelector;

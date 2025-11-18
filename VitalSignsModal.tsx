
import React, { useState } from 'react';
import type { VitalSigns } from '../types';

interface VitalSignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vitals: VitalSigns) => void;
}

const VitalSignsModal: React.FC<VitalSignsModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [vitals, setVitals] = useState<VitalSigns>({
    temperature: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    consciousness: 'Alerta',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    glucose: ''
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof VitalSigns, value: string) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(vitals);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl animate-fade-in-up overflow-hidden max-h-[90vh] flex flex-col transition-colors">
        <div className="bg-red-600 dark:bg-red-700 p-5 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-white font-bold text-xl">Monitor de Sinais Vitais</h3>
            <p className="text-red-100 text-xs">Preencha os dados para análise da IA</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Pressão Arterial Row */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Pressão Arterial (PA)</label>
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <input
                        type="number"
                        inputMode="numeric"
                        placeholder="120"
                        value={vitals.bloodPressureSystolic}
                        onChange={(e) => handleChange('bloodPressureSystolic', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-xl font-bold text-slate-700 dark:text-slate-100 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900 outline-none"
                    />
                    <span className="text-[10px] text-slate-400 block text-center mt-1">Máx (Sistólica)</span>
                </div>
                <span className="text-slate-300 dark:text-slate-600 text-2xl font-light">/</span>
                <div className="flex-1">
                    <input
                        type="number"
                        inputMode="numeric"
                        placeholder="80"
                        value={vitals.bloodPressureDiastolic}
                        onChange={(e) => handleChange('bloodPressureDiastolic', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-xl font-bold text-slate-700 dark:text-slate-100 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900 outline-none"
                    />
                    <span className="text-[10px] text-slate-400 block text-center mt-1">Mín (Diastólica)</span>
                </div>
                <span className="text-xs text-slate-400 font-medium pt-1">mmHg</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Glicemia (HGT)</label>
              <div className="relative">
                <input
                    type="number"
                    inputMode="numeric"
                    placeholder="98"
                    value={vitals.glucose}
                    onChange={(e) => handleChange('glucose', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700 focus:border-red-500 focus:bg-white dark:focus:bg-slate-700 outline-none text-xl font-bold text-slate-700 dark:text-white transition-all placeholder-slate-300 rounded-t-lg"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">mg/dL</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Temp (°C)</label>
              <input
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="36.5"
                value={vitals.temperature}
                onChange={(e) => handleChange('temperature', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700 focus:border-red-500 focus:bg-white dark:focus:bg-slate-700 outline-none text-xl font-bold text-slate-700 dark:text-white transition-all placeholder-slate-300 rounded-t-lg"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">BPM (Coração)</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="80"
                value={vitals.heartRate}
                onChange={(e) => handleChange('heartRate', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700 focus:border-red-500 focus:bg-white dark:focus:bg-slate-700 outline-none text-xl font-bold text-slate-700 dark:text-white transition-all placeholder-slate-300 rounded-t-lg"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sat O2 (%)</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="98"
                value={vitals.oxygenSaturation}
                onChange={(e) => handleChange('oxygenSaturation', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700 focus:border-red-500 focus:bg-white dark:focus:bg-slate-700 outline-none text-xl font-bold text-slate-700 dark:text-white transition-all placeholder-slate-300 rounded-t-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nível de Consciência</label>
            <div className="grid grid-cols-2 gap-2">
              {['Alerta', 'Sonolento', 'Confuso', 'Inconsciente'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleChange('consciousness', status)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                    vitals.consciousness === status
                      ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md transform scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-200 dark:shadow-red-900/30 hover:bg-red-700 hover:shadow-xl transition-all transform active:scale-95 text-lg flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Confirmar Dados
          </button>
        </form>
      </div>
    </div>
  );
};

export default VitalSignsModal;

import React, { useState, useEffect } from 'react';
import type { User } from '../types';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<User>) => void;
  initialData?: User;
  isMandatory?: boolean; // Prop mantida para compatibilidade, mas ignorada no render do botão fechar
}

const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'masculino' as 'masculino' | 'feminino' | 'outro',
    weight: '',
    height: '',
    bloodType: '',
    allergies: ''
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name || '',
        age: initialData.age || '',
        gender: initialData.gender || 'masculino',
        weight: initialData.weight || '',
        height: initialData.height || '',
        bloodType: initialData.bloodType || '',
        allergies: initialData.allergies || ''
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl animate-fade-in-up overflow-hidden max-h-[90vh] flex flex-col transition-colors">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-800 dark:to-black p-6 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-white font-bold text-xl">Seu Perfil Biométrico</h3>
            <p className="text-slate-300 text-xs mt-1">Para atendimentos mais precisos e personalizados.</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome Completo</label>
            <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all font-medium text-slate-700 dark:text-slate-200"
                placeholder="Seu nome"
                required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Idade (Anos)</label>
                <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all font-medium text-slate-700 dark:text-slate-200"
                    placeholder="Ex: 30"
                    required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gênero</label>
                <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 appearance-none"
                >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                </select>
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Peso (kg)</label>
                <div className="relative">
                    <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all font-medium text-slate-700 dark:text-slate-200"
                        placeholder="Ex: 75"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">kg</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Altura (cm)</label>
                <div className="relative">
                    <input
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData({...formData, height: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all font-medium text-slate-700 dark:text-slate-200"
                        placeholder="Ex: 175"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">cm</span>
                </div>
              </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipo Sanguíneo</label>
            <select
                value={formData.bloodType}
                onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 appearance-none"
            >
                <option value="">Selecione se souber...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
            </select>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alergias (Medicamentos/Alimentos)</label>
             <textarea
                value={formData.allergies}
                onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 resize-none"
                placeholder="Ex: Penicilina, Dipirona, Camarão..."
                rows={3}
             />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800">
              <div className="flex gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                      Esses dados ajudam a IA a calcular riscos cardíacos, anafilaxia e dosagens caso você seja a vítima.
                  </p>
              </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
                type="submit"
                className="w-full bg-slate-900 dark:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-slate-800 dark:hover:bg-blue-700 transition-all transform active:scale-95 text-lg"
            >
                Salvar Perfil
            </button>
            <button
                type="button"
                onClick={onClose}
                className="w-full text-slate-400 dark:text-slate-500 text-sm font-bold hover:text-slate-600 dark:hover:text-slate-300 py-2"
            >
                Pular por enquanto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupModal;

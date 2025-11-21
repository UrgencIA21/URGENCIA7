
import React, { useState } from 'react';
import type { User } from '../types';
import { generateHealthSummary } from '../services/geminiService';

interface PatientRecordScreenProps {
    onBack: () => void;
    user: User;
}

interface Medication {
    id: string;
    name: string;
    dosage: string;
    time: string;
    type: 'demand' | 'scheduled';
}

// --- Mini Chart Component ---
const MiniChart: React.FC<{ color: string; data: number[] }> = ({ color, data }) => {
    const max = Math.max(...data, 1); // Avoid div by zero
    const min = Math.min(...data);
    const range = max - min || 1;
    
    // Ensure we have points
    if (data.length < 2) {
        return (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                Dados insuficientes
            </div>
        );
    }

    const points = data.map((val, idx) => {
        const x = (idx / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 80 - 10; // Padding
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={`M0,100 L0,${100 - ((data[0] - min) / range) * 80 - 10} ${points} L100,100 Z`} fill={`url(#grad-${color})`} />
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            {data.map((val, idx) => {
                 const x = (idx / (data.length - 1)) * 100;
                 const y = 100 - ((val - min) / range) * 80 - 10;
                 return <circle key={idx} cx={x} cy={y} r="2.5" fill="white" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            })}
        </svg>
    );
}

const PatientRecordScreen: React.FC<PatientRecordScreenProps> = ({ onBack, user }) => {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState<'dashboard' | 'report'>('dashboard');
    const [heartRateData, setHeartRateData] = useState<number[]>([72, 75, 71, 82, 78, 74, 76]);
    const [bpSystolicData, setBpSystolicData] = useState<number[]>([120, 118, 122, 125, 119, 121, 120]);
    
    const [medications, setMedications] = useState<Medication[]>([
        { id: '1', name: 'Losartana', dosage: '50mg • 1 cp', time: '08:00', type: 'scheduled' },
        { id: '2', name: 'Dipirona', dosage: '500mg', time: '--:--', type: 'demand' }
    ]);

    const [isMedModalOpen, setIsMedModalOpen] = useState(false);
    const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);

    // Report State
    const [report, setReport] = useState<string | null>(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    // --- Form States ---
    const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '' });
    const [newVitals, setNewVitals] = useState({ hr: '', bp: '' });

    // --- Actions ---
    const handleAddMedication = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMed.name) return;
        const med: Medication = {
            id: Date.now().toString(),
            name: newMed.name,
            dosage: newMed.dosage || 'Dose padrão',
            time: newMed.time || '--:--',
            type: newMed.time ? 'scheduled' : 'demand'
        };
        setMedications([...medications, med]);
        setNewMed({ name: '', dosage: '', time: '' });
        setIsMedModalOpen(false);
    };

    const handleRemoveMedication = (id: string) => {
        setMedications(medications.filter(m => m.id !== id));
    };

    const handleUpdateVitals = (e: React.FormEvent) => {
        e.preventDefault();
        if (newVitals.hr) {
            setHeartRateData(prev => [...prev.slice(1), parseInt(newVitals.hr)]);
        }
        if (newVitals.bp) {
            setBpSystolicData(prev => [...prev.slice(1), parseInt(newVitals.bp)]);
        }
        setNewVitals({ hr: '', bp: '' });
        setIsVitalsModalOpen(false);
    };

    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        try {
            const summary = await generateHealthSummary(user, medications, { 
                heartRate: heartRateData, 
                bpSystolic: bpSystolicData 
            });
            setReport(summary);
        } catch (error) {
            console.error("Error generating report", error);
            setReport("Não foi possível gerar o relatório no momento. Tente novamente.");
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const getLast = (arr: number[]) => arr[arr.length - 1];

    return (
        <div className="flex flex-col bg-slate-50 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 dark:border-slate-800 h-[85vh] overflow-hidden transition-colors relative">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 sticky top-0 z-10">
                <div className="flex items-center justify-between p-5 pb-2">
                    <div className="flex items-center">
                        <button onClick={onBack} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Voltar
                        </button>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 p-1.5 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                </svg>
                            </span>
                            Prontuário Platinum
                        </h2>
                    </div>
                </div>
                
                {/* TABS */}
                <div className="flex px-6 gap-6">
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'dashboard' ? 'text-cyan-600 dark:text-cyan-400 border-cyan-600 dark:border-cyan-400' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                    >
                        Painel Geral
                    </button>
                    <button 
                        onClick={() => setActiveTab('report')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'report' ? 'text-cyan-600 dark:text-cyan-400 border-cyan-600 dark:border-cyan-400' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                    >
                        Relatório IA
                    </button>
                </div>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 pb-20 flex-grow">
                
                {activeTab === 'dashboard' ? (
                    <>
                        {/* 1. INFO CARD */}
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in-up">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center text-2xl font-bold uppercase shadow-lg shadow-cyan-200 dark:shadow-none">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{user.name}</h3>
                                    <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">Membro Platinum Ativo</p>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="flex-1 bg-red-50 dark:bg-red-900/20 py-2 px-4 rounded-xl border border-red-100 dark:border-red-800 text-center">
                                    <span className="text-[10px] text-red-500 block uppercase font-bold">Sangue</span>
                                    <span className="text-sm font-bold text-red-700 dark:text-red-300">{user.bloodType || '--'}</span>
                                </div>
                                <div className="flex-1 bg-slate-50 dark:bg-slate-900 py-2 px-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Idade</span>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.age ? `${user.age} Anos` : '--'}</span>
                                </div>
                                <div className="flex-1 bg-slate-50 dark:bg-slate-900 py-2 px-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Peso</span>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.weight ? `${user.weight}kg` : '--'}</span>
                                </div>
                            </div>
                        </div>

                        {/* ALLERGY ALERT */}
                        {user.allergies && (
                            <div className="bg-red-50 dark:bg-red-950/50 border-l-4 border-red-500 p-4 rounded-r-xl animate-fade-in-up">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-bold text-red-800 dark:text-red-200">
                                            ALERGIAS REGISTRADAS
                                        </p>
                                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                            {user.allergies}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. CHARTS SECTION */}
                        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-700 dark:text-slate-200">Monitoramento Recente</h4>
                                <button onClick={() => setIsVitalsModalOpen(true)} className="text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg font-bold hover:opacity-90 transition-opacity">
                                    + Novo Registro
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Heart Rate */}
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase">Frequência Cardíaca</p>
                                            <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{getLast(heartRateData)} <span className="text-sm font-medium text-slate-400">BPM</span></p>
                                        </div>
                                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="h-32">
                                        <MiniChart color="#ef4444" data={heartRateData} />
                                    </div>
                                </div>

                                {/* Blood Pressure */}
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase">Pressão Arterial</p>
                                            <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{getLast(bpSystolicData)} <span className="text-sm font-medium text-slate-400">mmHg</span></p>
                                        </div>
                                        <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg text-cyan-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="h-32">
                                        <MiniChart color="#06b6d4" data={bpSystolicData} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. MEDICATIONS SECTION */}
                        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-slate-700 dark:text-slate-200">Medicamentos em Uso</h4>
                                <button onClick={() => setIsMedModalOpen(true)} className="text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
                                    + Adicionar
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {medications.length === 0 ? (
                                    <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                                        <p className="text-slate-400 text-sm">Nenhum medicamento cadastrado.</p>
                                    </div>
                                ) : (
                                    medications.map((med) => (
                                        <div key={med.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${med.type === 'scheduled' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'}`}>
                                                    💊
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white text-sm">{med.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{med.dosage}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <span className="block text-xs font-bold text-slate-600 dark:text-slate-300">{med.time}</span>
                                                    <span className="text-[10px] text-slate-400">{med.type === 'scheduled' ? 'Diário' : 'S/N'}</span>
                                                </div>
                                                <button onClick={() => handleRemoveMedication(med.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    // --- AI REPORT TAB ---
                    <div className="flex flex-col h-full animate-fade-in-up">
                        {!report ? (
                             <div className="flex flex-col items-center justify-center flex-grow text-center p-8">
                                 <div className="w-24 h-24 bg-cyan-50 dark:bg-cyan-900/20 rounded-full flex items-center justify-center mb-6 text-cyan-500 dark:text-cyan-400">
                                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${isGeneratingReport ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                     </svg>
                                 </div>
                                 
                                 <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Análise Evolutiva Inteligente</h3>
                                 <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8">
                                     A IA analisará seus gráficos e medicamentos para identificar tendências de saúde.
                                 </p>
                                 
                                 <button 
                                    onClick={handleGenerateReport}
                                    disabled={isGeneratingReport}
                                    className="bg-cyan-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-cyan-200 dark:shadow-cyan-900/20 hover:bg-cyan-700 transition-all transform active:scale-95 disabled:opacity-50 flex items-center gap-3"
                                 >
                                    {isGeneratingReport ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processando Dados...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                            </svg>
                                            Gerar Relatório
                                        </>
                                    )}
                                 </button>
                             </div>
                        ) : (
                             <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                                 <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                                     <div>
                                         <h3 className="text-lg font-bold text-slate-800 dark:text-white">Relatório de Evolução Clínica</h3>
                                         <p className="text-xs text-slate-400">Gerado por UrgêncIA • {new Date().toLocaleDateString()}</p>
                                     </div>
                                     <button onClick={() => setReport(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-medium">
                                         Nova Análise
                                     </button>
                                 </div>
                                 <div className="prose prose-slate dark:prose-invert prose-sm max-w-none">
                                     {report.split('\n').map((line, idx) => (
                                         <p key={idx} className={`mb-2 ${line.startsWith('-') ? 'pl-4' : ''} ${line.includes(':') && !line.startsWith('-') ? 'font-bold text-cyan-700 dark:text-cyan-400 mt-4' : 'text-slate-600 dark:text-slate-300'}`}>
                                             {line}
                                         </p>
                                     ))}
                                 </div>
                             </div>
                        )}
                    </div>
                )}
            </div>

            {/* --- MODAL: ADD MEDICATION --- */}
            {isMedModalOpen && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4 animate-fade-in-up">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Adicionar Medicamento</h3>
                        <form onSubmit={handleAddMedication} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Nome</label>
                                <input 
                                    type="text" 
                                    value={newMed.name} 
                                    onChange={e => setNewMed({...newMed, name: e.target.value})}
                                    placeholder="Ex: Paracetamol" 
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mt-1 focus:border-cyan-500 outline-none dark:text-white"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Dose</label>
                                    <input 
                                        type="text" 
                                        value={newMed.dosage} 
                                        onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                                        placeholder="500mg" 
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mt-1 focus:border-cyan-500 outline-none dark:text-white"
                                    />
                                </div>
                                <div className="w-1/3">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Hora</label>
                                    <input 
                                        type="text" 
                                        value={newMed.time} 
                                        onChange={e => setNewMed({...newMed, time: e.target.value})}
                                        placeholder="08:00" 
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mt-1 focus:border-cyan-500 outline-none dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <button type="button" onClick={() => setIsMedModalOpen(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

             {/* --- MODAL: UPDATE VITALS --- */}
             {isVitalsModalOpen && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4 animate-fade-in-up">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Atualizar Gráficos</h3>
                        <form onSubmit={handleUpdateVitals} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Frequência Cardíaca (BPM)</label>
                                <input 
                                    type="number" 
                                    value={newVitals.hr} 
                                    onChange={e => setNewVitals({...newVitals, hr: e.target.value})}
                                    placeholder="Ex: 80" 
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mt-1 focus:border-red-500 outline-none dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Pressão Sistólica (mmHg)</label>
                                <input 
                                    type="number" 
                                    value={newVitals.bp} 
                                    onChange={e => setNewVitals({...newVitals, bp: e.target.value})}
                                    placeholder="Ex: 120" 
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mt-1 focus:border-cyan-500 outline-none dark:text-white"
                                />
                            </div>
                            <div className="flex gap-2 mt-6">
                                <button type="button" onClick={() => setIsVitalsModalOpen(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl">Atualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default PatientRecordScreen;

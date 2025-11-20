
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Emergency, Message, VitalSigns, PatientProfile, User } from '../types';
import { createChatSession } from '../services/geminiService';
import type { Chat } from '@google/genai';
import LoadingSpinner from './LoadingSpinner';
import ChatMessage from './ChatMessage';
import VitalSignsModal from './VitalSignsModal';

interface ChatScreenProps {
  emergency: Emergency;
  onBack: () => void;
  user: User; // Added User prop
}

const MicrophoneIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
        <path d="M5.5 9.5a.5.5 0 00-1 0v1a4.5 4.5 0 007 2.93V14h-.5a.5.5 0 000 1h1a.5.5 0 00.5-.5v-1.57A4.5 4.5 0 006.5 10.5v-1z" />
    </svg>
);

const SendIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const SpeakerIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 2.485.519 4.952 1.5 7.2.136.31.423.53.75.53h2.342l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.5 12a5.96 5.96 0 01-1.75 4.24l-1.42-1.42a3.98 3.98 0 000-5.66l1.42-1.42a5.96 5.96 0 011.75 4.26z" />
    <path d="M20.5 12a8 8 0 01-2.34 5.66l-1.42-1.42a5.98 5.98 0 000-8.48l1.42-1.42A7.96 7.96 0 0120.5 12z" />
  </svg>
);

const SpeakerMuteIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
     <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 2.485.519 4.952 1.5 7.2.136.31.423.53.75.53h2.342l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
  </svg>
);

const ProfileOption: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void }> = ({ label, icon, onClick }) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-xl shadow-slate-200 dark:shadow-none transition-all group h-48 w-full"
    >
        <div className="bg-slate-100 dark:bg-slate-800 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 text-slate-500 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 p-4 rounded-full mb-4 transition-colors">
            {icon}
        </div>
        <span className="text-lg font-extrabold text-slate-700 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">{label}</span>
    </button>
);

const TriageOption: React.FC<{ label: string; icon: React.ReactNode; isSelected: boolean; onClick: () => void }> = ({ label, icon, isSelected, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all group aspect-square relative overflow-hidden ${
            isSelected 
            ? 'bg-red-50 dark:bg-red-900/30 border-red-500 ring-2 ring-red-200 dark:ring-red-800' 
            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-700 hover:shadow-md'
        }`}
    >
        {isSelected && (
            <div className="absolute top-2 right-2 bg-red-500 rounded-full p-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </div>
        )}
        <div className={`${isSelected ? 'text-red-600 dark:text-red-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-red-500'} mb-2 transition-colors`}>{icon}</div>
        <span className={`text-xs md:text-sm font-bold text-center leading-tight ${isSelected ? 'text-red-700 dark:text-red-300' : 'text-slate-700 dark:text-slate-300'}`}>{label}</span>
    </button>
);

const VitalCard: React.FC<{ label: string; value?: string; unit?: string; onClick: () => void }> = ({ label, value, unit, onClick }) => (
    <button onClick={onClick} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center h-full min-h-[80px] hover:border-red-200 dark:hover:border-red-900 transition-all relative overflow-hidden group">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 group-hover:from-red-400 group-hover:to-orange-500 transition-all"></div>
        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">{label}</span>
        {value ? (
            <div className="flex items-baseline">
                <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{value}</span>
                {unit && <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-0.5">{unit}</span>}
            </div>
        ) : (
            <span className="text-2xl text-slate-200 dark:text-slate-700 font-light">+</span>
        )}
    </button>
);

const ChatScreen: React.FC<ChatScreenProps> = ({ emergency, onBack, user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  
  // Patient Profile State
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);

  // Triage Dashboard State
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [triageVitals, setTriageVitals] = useState<VitalSigns | null>(null);
  
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const isAudioEnabledRef = useRef(false);

  const chatSessionRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    isAudioEnabledRef.current = isAudioEnabled;
    if (!isAudioEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [isAudioEnabled]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, quickReplies]);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setInput(finalTranscript + interimTranscript);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      }

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API not supported.");
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleToggleRecording = () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();

      if (isRecording) {
          recognitionRef.current?.stop();
          setIsRecording(false);
      } else {
          recognitionRef.current?.start();
          setIsRecording(true);
      }
  }

  const speakText = (text: string) => {
    if (!isAudioEnabledRef.current || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    
    const cleanText = text
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .trim();

    if (!cleanText) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.6;
    window.speechSynthesis.speak(utterance);
  };

  const processStream = async (stream: AsyncIterable<any>) => {
    let responseText = '';
    let currentReplies: string[] = [];
    setQuickReplies([]);
    
    const placeholderIndex = messages.length;
    setMessages(prev => [...prev, { role: 'model', text: '' }]);
  
    for await (const chunk of stream) {
      responseText += chunk.text;
      const lines = responseText.split('\n');
      const mainText = lines.filter(line => !line.startsWith('[SUGGESTION]')).join('\n');
      currentReplies = lines
        .filter(line => line.startsWith('[SUGGESTION]'))
        .map(line => line.replace('[SUGGESTION]', '').trim());
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[placeholderIndex] = { role: 'model', text: mainText };
        return newMessages;
      });
    }
    setQuickReplies(currentReplies);
    
    const finalLines = responseText.split('\n');
    const textToSpeak = finalLines.filter(line => !line.startsWith('[SUGGESTION]')).join('\n');
    speakText(textToSpeak);
  }

  const startConversation = useCallback(async (profile: PatientProfile) => {
    if (!profile) return;

    // For Triage Dashboard, we don't start an active conversation text immediately
    if (emergency.id === 'triage_sinais') {
        chatSessionRef.current = createChatSession(emergency, profile, user);
        return;
    }

    setIsLoading(true);
    setMessages([]);
    setQuickReplies([]);
    // Pass user object to session creator
    chatSessionRef.current = createChatSession(emergency, profile, user);
    try {
      const resultStream = await chatSessionRef.current.sendMessageStream({
        message: `O usuário precisa de ajuda com: ${emergency.name}. Perfil do paciente: ${profile}. Inicie a anamnese.`,
      });
      await processStream(resultStream);
    } catch (error) {
      console.error("Error starting conversation:", error);
      const errorMsg = 'Erro ao conectar. Verifique sua internet.';
      setMessages([{ role: 'model', text: errorMsg }]);
      speakText(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [emergency, user]);
  
  const handleProfileSelect = (profile: PatientProfile) => {
      setPatientProfile(profile);
      startConversation(profile);
  };
  
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading || !chatSessionRef.current) return;

    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const userMessage: Message = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setQuickReplies([]);
    setInput('');
    setIsLoading(true);

    try {
      const resultStream = await chatSessionRef.current.sendMessageStream({ message: messageText });
      await processStream(resultStream);
    } catch (error) {
      console.error("Error sending message:", error);
       const errorMsg = 'Erro ao enviar. Tente novamente.';
       setMessages(prev => [...prev, { role: 'model', text: errorMsg}]);
       speakText(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const formatVitalsToString = (vitals: VitalSigns) => {
      const parts = [];
      if (vitals.bloodPressureSystolic && vitals.bloodPressureDiastolic) parts.push(`PA: ${vitals.bloodPressureSystolic}x${vitals.bloodPressureDiastolic} mmHg`);
      if (vitals.glucose) parts.push(`Glicemia (HGT): ${vitals.glucose} mg/dL`);
      if (vitals.temperature) parts.push(`Temp: ${vitals.temperature}°C`);
      if (vitals.heartRate) parts.push(`FC: ${vitals.heartRate} BPM`);
      if (vitals.oxygenSaturation) parts.push(`O2: ${vitals.oxygenSaturation}%`);
      if (vitals.respiratoryRate) parts.push(`Resp: ${vitals.respiratoryRate} RPM`);
      if (vitals.consciousness) parts.push(`Consciência: ${vitals.consciousness}`);
      return parts.join('\n');
  }

  const handleVitalsSubmit = (vitals: VitalSigns) => {
    // If in Triage Dashboard mode, just update the state
    if (emergency.id === 'triage_sinais' && messages.length === 0) {
        setTriageVitals(vitals);
    } else {
        // Otherwise send as message in chat
        const vitalsStr = formatVitalsToString(vitals);
        if (vitalsStr) {
            const msg = `[VITAIS ATUALIZADOS]\n${vitalsStr}\nAnalise esses dados clínicos imediatamente.`;
            sendMessage(msg);
        }
    }
  };

  const handleTriageSubmit = () => {
      if (selectedSymptoms.length === 0 && !triageVitals) return;

      let prompt = "INÍCIO DE TRIAGEM:\n";
      
      if (triageVitals) {
          prompt += `SINAIS VITAIS:\n${formatVitalsToString(triageVitals)}\n\n`;
      } else {
          prompt += "SINAIS VITAIS: Não informados.\n\n";
      }

      if (selectedSymptoms.length > 0) {
          prompt += `SINTOMAS RELATADOS:\n${selectedSymptoms.join(', ')}.\n`;
      }

      prompt += "\nCom base nisso, qual a prioridade e o que devo fazer?";
      
      sendMessage(prompt);
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickReplyClick = (reply: string) => {
    sendMessage(reply);
  };

  const handleBack = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    onBack();
  };

  // Triage options
  const triageOptions = [
      { label: 'Dor no Peito', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
      { label: 'Falta de Ar', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg> },
      { label: 'Tontura', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> },
      { label: 'Dor de Cabeça', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
      { label: 'Febre Alta', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg> },
      { label: 'Trauma', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
      { label: 'Dor Abdominal', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
      { label: 'Pressão Alta', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
      { label: 'Glicose Alterada', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg> },
      { label: 'Outros', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg> },
  ];

  const toggleSymptom = (label: string) => {
      setSelectedSymptoms(prev => {
          if (prev.includes(label)) {
              return prev.filter(s => s !== label);
          } else {
              return [...prev, label];
          }
      });
  };

  // Check if we should show the Triage Dashboard
  const showTriageDashboard = emergency.id === 'triage_sinais' && messages.length === 0;

  return (
    <div className="flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 dark:border-slate-800 h-[80vh] overflow-hidden relative transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 z-10">
        <button onClick={handleBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex flex-col items-center">
            <h2 className="font-bold text-slate-800 dark:text-white">{showTriageDashboard ? 'Painel de Controle Médico' : emergency.name}</h2>
            <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">IA Ativa</span>
            </div>
        </div>
        
        <div className="flex items-center space-x-1">
           <button 
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`p-2 rounded-full transition-all duration-300 ${
                isAudioEnabled 
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 shadow-inner' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500'
            }`}
          >
            {isAudioEnabled ? <SpeakerIcon className="h-5 w-5" /> : <SpeakerMuteIcon className="h-5 w-5" />}
          </button>
          {patientProfile && !showTriageDashboard && (
              <button 
                onClick={() => setIsVitalsModalOpen(true)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors relative group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
          )}
        </div>
      </div>

      <VitalSignsModal 
        isOpen={isVitalsModalOpen} 
        onClose={() => setIsVitalsModalOpen(false)} 
        onSubmit={handleVitalsSubmit} 
      />

      {/* PROFILE SELECTION OVERLAY */}
      {!patientProfile && (
          <div className="absolute inset-0 z-40 bg-white dark:bg-slate-950 p-6 flex flex-col items-center overflow-y-auto">
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2 mt-4">Quem é o paciente?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Selecione o perfil para protocolos específicos.</p>
              
              <div className="w-full max-w-sm space-y-4">
                  <ProfileOption 
                    label="Criança / Bebê" 
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                        </svg>
                    }
                    onClick={() => handleProfileSelect('crianca')} 
                  />
                  <ProfileOption 
                    label="Adulto" 
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    }
                    onClick={() => handleProfileSelect('adulto')} 
                  />
                  <ProfileOption 
                    label="Idoso" 
                    icon={
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    }
                    onClick={() => handleProfileSelect('idoso')} 
                  />
              </div>
          </div>
      )}

      {/* Messages Area OR Triage Dashboard */}
      <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto custom-scrollbar space-y-6 bg-slate-50/50 dark:bg-slate-950/50 relative transition-colors duration-300">
        
        {showTriageDashboard ? (
             <div className="flex flex-col min-h-full animate-fade-in-up pb-8">
                 
                 {/* 1. VITAL SIGNS SECTION (Destaque Premium) */}
                 <div className="mb-6">
                     <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 ml-1">1. Sinais Vitais (Obrigatório)</h3>
                     <div className="grid grid-cols-4 gap-2 h-24">
                         <VitalCard 
                            label="Pressão" 
                            value={triageVitals?.bloodPressureSystolic ? `${triageVitals.bloodPressureSystolic}/${triageVitals.bloodPressureDiastolic}` : ''} 
                            onClick={() => setIsVitalsModalOpen(true)}
                        />
                         <VitalCard 
                            label="HGT (Glicose)" 
                            value={triageVitals?.glucose} 
                            unit="mg/dL"
                            onClick={() => setIsVitalsModalOpen(true)}
                        />
                         <VitalCard 
                            label="Temp" 
                            value={triageVitals?.temperature} 
                            unit="°C"
                            onClick={() => setIsVitalsModalOpen(true)}
                        />
                         <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center justify-center cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors" onClick={() => setIsVitalsModalOpen(true)}>
                             <div className="text-center">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-red-500 dark:text-red-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                 </svg>
                                 <span className="text-[10px] font-bold text-red-700 dark:text-red-300">Editar</span>
                             </div>
                         </div>
                     </div>
                 </div>

                 {/* 2. SYMPTOMS SECTION */}
                 <div className="mb-8">
                     <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 ml-1">2. Sintomas (Selecione)</h3>
                     <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                         {triageOptions.map((option) => (
                             <TriageOption 
                                key={option.label} 
                                label={option.label} 
                                icon={option.icon} 
                                isSelected={selectedSymptoms.includes(option.label)}
                                onClick={() => toggleSymptom(option.label)}
                             />
                         ))}
                     </div>
                 </div>

                 {/* 3. ACTION SECTION */}
                 <div className="mt-auto">
                     <button 
                        onClick={handleTriageSubmit}
                        disabled={selectedSymptoms.length === 0 && !triageVitals}
                        className="w-full bg-slate-900 dark:bg-red-600 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-slate-800 dark:hover:bg-red-700 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                     >
                         <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 dark:bg-white"></span>
                         </span>
                         INICIAR ANÁLISE CLÍNICA
                     </button>
                     <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-3">A Inteligência Artificial analisará todos os dados combinados.</p>
                 </div>
             </div>
        ) : (
            <>
                {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
                ))}
                {isLoading && messages[messages.length -1]?.role === 'user' && (
                    <div className="flex justify-start animate-fade-in-up">
                        <LoadingSpinner />
                    </div>
                )}
            </>
        )}
      </div>

      {/* Floating Input Area (Hidden on Dashboard) */}
      {patientProfile && !showTriageDashboard && (
      <div className="p-4 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 dark:to-transparent pt-6">
        {quickReplies.length > 0 && !isLoading && (
            <div className="flex overflow-x-auto pb-3 gap-2 custom-scrollbar mb-2 px-1">
            {quickReplies.map((reply, index) => (
                <button
                key={index}
                onClick={() => handleQuickReplyClick(reply)}
                className="flex-shrink-0 px-4 py-2 bg-white dark:bg-slate-800 border border-red-100 dark:border-slate-700 text-red-600 dark:text-red-400 font-medium rounded-full text-sm shadow-sm hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white hover:shadow-md transition-all duration-300"
                >
                {reply}
                </button>
            ))}
            </div>
        )}

        <form onSubmit={handleFormSubmit} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 relative transition-colors">
          <div className="relative flex-grow">
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isRecording ? "Ouvindo..." : "Digite uma mensagem..."}
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3 bg-transparent focus:outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-medium"
              />
              {recognitionRef.current && (
                 <button 
                    type="button" 
                    onClick={handleToggleRecording} 
                    className={`absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
                        isRecording 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 animate-pulse' 
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                 >
                    <MicrophoneIcon className="h-5 w-5"/>
                 </button>
              )}
          </div>
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            className="bg-red-600 text-white rounded-full p-3 hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform active:scale-95 flex-shrink-0"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
      )}
    </div>
  );
};

export default ChatScreen;

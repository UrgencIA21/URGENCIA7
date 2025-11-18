
import React, { useState, useEffect } from 'react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: 'premium' | 'platinum') => void;
  userEmail: string;
}

type Step = 'offer' | 'payment' | 'verification' | 'success';
type PaymentMethod = 'pix' | 'card';
type PlanType = 'premium' | 'platinum';

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgrade, userEmail }) => {
  const [step, setStep] = useState<Step>('offer');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('premium');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [copied, setCopied] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [errorCode, setErrorCode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form States for Card
  const [cardData, setCardData] = useState({
      number: '',
      name: '',
      expiry: '',
      cvc: ''
  });

  // Configuração do Admin
  const ADMIN_WHATSAPP = "5555991924107";
  const SECRET_CODE = "SALVAVIDAS"; // O código que você enviará para o cliente

  const PLAN_PRICE = selectedPlan === 'premium' ? '9,99' : '19,99';

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('offer');
      setCopied(false);
      setAccessCode('');
      setErrorCode(false);
      setIsProcessing(false);
      setCardData({ number: '', name: '', expiry: '', cvc: '' });
      setSelectedPlan('premium'); // Default to premium
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: PlanType) => {
      setSelectedPlan(plan);
      setStep('payment');
  }

  const handleCopyPix = () => {
    navigator.clipboard.writeText('04027212096');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContactAdmin = () => {
    const message = `Olá! Realizei o pagamento da Assinatura Mensal UrgêncIA ${selectedPlan.toUpperCase()} (R$ ${PLAN_PRICE}).\n\nMeu email: ${userEmail}\n\nPoderia liberar meu acesso deste mês?`;
    const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setStep('verification');
  };

  const handleCardPayment = () => {
      // Simple validation
      if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvc) {
          alert("Preencha todos os dados do cartão.");
          return;
      }

      setIsProcessing(true);
      
      // Simulate API Delay
      setTimeout(() => {
          setIsProcessing(false);
          setStep('success');
      }, 3000);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.trim().toUpperCase() === SECRET_CODE) {
        setStep('success');
    } else {
        setErrorCode(true);
        setTimeout(() => setErrorCode(false), 2000);
    }
  };

  const PIX_KEY = "04027212096";
  const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${PIX_KEY}&color=${selectedPlan === 'platinum' ? '06b6d4' : 'be123c'}`; // Cyan for Platinum, Red for Premium

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 dark:bg-black/90 backdrop-blur-sm transition-opacity" onClick={step === 'success' ? undefined : onClose} />
      
      <div className={`relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl animate-fade-in-up overflow-hidden border ${selectedPlan === 'platinum' ? 'border-cyan-200 dark:border-cyan-900' : 'border-slate-100 dark:border-slate-800'} max-h-[90vh] flex flex-col transition-colors`}>
        
        {/* Banner */}
        <div className={`p-6 text-center relative flex-shrink-0 ${selectedPlan === 'platinum' ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600' : 'bg-gradient-to-r from-amber-300 via-orange-400 to-red-600'}`}>
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <span className="inline-block bg-white/20 backdrop-blur-md border border-white/40 rounded-full px-3 py-1 text-xs font-bold text-white mb-2 shadow-sm">
                {step === 'success' ? 'ASSINATURA ATIVA' : 'PLANOS MENSAIS'}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {step === 'offer' && 'Escolha seu Nível'}
                {step === 'payment' && (selectedPlan === 'platinum' ? 'Checkout Platinum' : 'Checkout Premium')}
                {step === 'verification' && 'Validar Pagamento'}
                {step === 'success' && `Bem-vindo ao ${selectedPlan.toUpperCase()}!`}
            </h2>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          
          {/* STEP: OFFER - PLAN SELECTION */}
          {step === 'offer' && (
            <div className="space-y-4">
                {/* Premium Card */}
                <button onClick={() => handleSelectPlan('premium')} className="w-full text-left p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-800 dark:to-slate-800 border-2 border-transparent hover:border-red-400 dark:hover:border-red-500 transition-all relative group shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">UrgêncIA <span className="text-red-600">PRO</span></h3>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">R$ 9,99<span className="text-xs font-normal text-slate-500">/mês</span></span>
                    </div>
                    <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mb-3">
                        <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Triagem Inteligente com IA</li>
                        <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Biblioteca de Vídeos</li>
                        <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Análise de Sinais Vitais</li>
                    </ul>
                    <div className="w-full py-2 bg-red-600 text-white text-center font-bold rounded-xl group-hover:bg-red-700 transition-colors">
                        Selecionar PRO
                    </div>
                </button>

                {/* Platinum Card */}
                <button onClick={() => handleSelectPlan('platinum')} className="w-full text-left p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 border-2 border-cyan-400 dark:border-cyan-700 shadow-lg shadow-cyan-100 dark:shadow-cyan-900/20 transition-all relative group">
                    <div className="absolute top-0 right-0 bg-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">RECOMENDADO</div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">UrgêncIA <span className="text-cyan-600">PLATINUM</span></h3>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">R$ 19,99<span className="text-xs font-normal text-slate-500">/mês</span></span>
                    </div>
                    <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mb-3">
                        <li className="flex items-center gap-2"><span className="text-cyan-500 font-bold">✓</span> Tudo do plano PRO</li>
                        <li className="flex items-center gap-2"><span className="text-cyan-500 font-bold">✓</span> Prontuário Digital Integrado</li>
                        <li className="flex items-center gap-2"><span className="text-cyan-500 font-bold">✓</span> Gráficos de Evolução de Saúde</li>
                        <li className="flex items-center gap-2"><span className="text-cyan-500 font-bold">✓</span> Gestão de Medicamentos</li>
                    </ul>
                    <div className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center font-bold rounded-xl group-hover:brightness-110 transition-all">
                        Selecionar PLATINUM
                    </div>
                </button>
                
                <button onClick={onClose} className="w-full text-center text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mt-2">
                    Continuar com plano Grátis
                </button>
            </div>
          )}

          {/* STEP: PAYMENT */}
          {step === 'payment' && (
            <div className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Plano Selecionado</p>
                        <p className={`font-bold text-lg ${selectedPlan === 'platinum' ? 'text-cyan-600' : 'text-red-600'}`}>
                            {selectedPlan === 'platinum' ? 'PLATINUM' : 'PRO'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase font-bold">Total a Pagar</p>
                        <p className="font-bold text-2xl text-slate-800 dark:text-white">R$ {PLAN_PRICE}</p>
                    </div>
                </div>

                <div className="flex gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button 
                        onClick={() => setPaymentMethod('pix')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'pix' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-400 hover:text-slate-600'}`}
                    >
                        PIX (Mensal)
                    </button>
                    <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'card' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-400 hover:text-slate-600'}`}
                    >
                        Cartão (Auto)
                    </button>
                </div>

                {paymentMethod === 'pix' ? (
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-inner">
                            <img src={QR_CODE_URL} alt="QR Code Pix" className="w-48 h-48 object-contain opacity-90" />
                        </div>
                        <div className="w-full">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-bold uppercase">Chave Pix</p>
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                                <code className="flex-grow text-sm font-mono text-slate-700 dark:text-slate-300 truncate px-2">{PIX_KEY}</code>
                                <button 
                                    onClick={handleCopyPix}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copied ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300'}`}
                                >
                                    {copied ? 'Copiado!' : 'Copiar'}
                                </button>
                            </div>
                        </div>
                         <div className="mt-4 w-full">
                            <button 
                                onClick={handleContactAdmin}
                                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 dark:shadow-green-900/30 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.376 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                Confirmar Pagamento
                            </button>
                            <button onClick={() => setStep('verification')} className="w-full text-center mt-3 text-sm text-slate-500 font-medium hover:underline">Já tenho o código</button>
                         </div>
                    </div>
                ) : (
                    // CARD PAYMENT FORM
                    <div className="space-y-4 animate-fade-in-up">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome no Cartão</label>
                            <input 
                                type="text" 
                                placeholder="COMO NO CARTAO" 
                                value={cardData.name}
                                onChange={(e) => setCardData({...cardData, name: e.target.value})}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-cyan-500 uppercase dark:text-white" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Número do Cartão</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="0000 0000 0000 0000" 
                                    value={cardData.number}
                                    onChange={(e) => setCardData({...cardData, number: e.target.value})}
                                    maxLength={19}
                                    className="w-full p-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-cyan-500 dark:text-white font-mono" 
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="space-y-1 flex-1">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Validade</label>
                                <input 
                                    type="text" 
                                    placeholder="MM/AA" 
                                    value={cardData.expiry}
                                    onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                                    maxLength={5}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-cyan-500 dark:text-white text-center" 
                                />
                            </div>
                            <div className="space-y-1 flex-1">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CVV</label>
                                <input 
                                    type="text" 
                                    placeholder="123" 
                                    value={cardData.cvc}
                                    onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                                    maxLength={3}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-cyan-500 dark:text-white text-center" 
                                />
                            </div>
                        </div>
                         <div className="mt-6">
                            <button 
                                onClick={handleCardPayment}
                                disabled={isProcessing}
                                className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${selectedPlan === 'platinum' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Pagar com Cartão
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-slate-400 mt-3 flex items-center justify-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Pagamento Seguro SSL
                            </p>
                        </div>
                    </div>
                )}
            </div>
          )}

          {/* STEP: VERIFICATION */}
          {step === 'verification' && (
              <div className="animate-fade-in-up py-4">
                 <div className="text-center mb-6">
                     <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Validar Acesso</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400">Digite o código enviado pelo administrador.</p>
                 </div>

                 <form onSubmit={handleVerifyCode} className="space-y-4">
                     <input 
                        type="text" 
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        placeholder="Digite seu código"
                        className={`w-full p-4 text-center text-2xl font-bold tracking-widest rounded-2xl border-2 outline-none transition-all uppercase ${errorCode ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:border-red-500 focus:bg-white dark:focus:bg-slate-900'}`}
                     />
                     {errorCode && <p className="text-red-500 text-sm text-center font-bold">Código inválido.</p>}
                     
                     <button 
                        type="submit"
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-2xl shadow-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all transform active:scale-95 mt-4"
                     >
                         Desbloquear App
                     </button>
                 </form>
                 <button onClick={() => setStep('payment')} className="w-full mt-4 text-sm font-bold text-slate-400">Voltar</button>
              </div>
          )}

          {/* STEP: SUCCESS */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-4 animate-fade-in-up text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${selectedPlan === 'platinum' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Assinatura {selectedPlan.toUpperCase()} Ativada!</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Seu acesso completo foi liberado por 30 dias.</p>
                <button onClick={() => onUpgrade(selectedPlan)} className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 ${selectedPlan === 'platinum' ? 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-200 dark:shadow-none' : 'bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none'}`}>
                    Acessar Agora
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;


import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex items-start gap-3 animate-fade-in-up ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && (
        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-red-600 dark:text-red-500">
            {/* Logo Icon simplified */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M2 12h20" strokeOpacity="0.5" strokeWidth="1"/>
            <path d="M7 12h3l2-4 4 8 2-4h4" />
          </svg>
        </div>
      )}
      
      <div
        className={`relative max-w-[85%] lg:max-w-[75%] px-5 py-4 text-sm md:text-base shadow-sm leading-relaxed ${
          isModel
            ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700'
            : 'bg-gradient-to-br from-red-600 to-orange-600 text-white rounded-2xl rounded-tr-none shadow-red-200 dark:shadow-none'
        }`}
      >
        {message.text.split('\n').map((line, index) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                return <div key={index} className="flex items-start mt-1 mb-1">
                    <span className="mr-2 opacity-60">•</span>
                    <span>{trimmed.substring(2)}</span>
                </div>;
            }
            if (trimmed.match(/^\d+\.\s/)) {
                 return <div key={index} className="flex items-start mt-2 mb-1 font-medium">
                     <span className="mr-2 opacity-80">{trimmed.match(/^\d+\./)?.[0]}</span>
                     <span>{trimmed.replace(/^\d+\.\s/, '')}</span>
                 </div>;
            }
            if (trimmed === '') return <div key={index} className="h-2"></div>;
            return <p key={index} className="mb-1 last:mb-0">{line}</p>;
        })}
      </div>
    </div>
  );
};

export default ChatMessage;


import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
};

export default LoadingSpinner;

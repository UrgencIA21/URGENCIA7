
import React from 'react';
import { VIDEO_RESOURCES, EMERGENCIES } from '../constants';
import type { VideoResource } from '../types';

interface VideoLibraryProps {
  onBack: () => void;
}

const VideoLibrary: React.FC<VideoLibraryProps> = ({ onBack }) => {
  const handleVideoClick = (resource: VideoResource) => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(resource.searchQuery)}`;
    window.open(url, '_blank');
  };

  const getIcon = (iconId?: string) => {
    if (!iconId) return null;
    const emergency = EMERGENCIES.find(e => e.id === iconId);
    return emergency ? emergency.icon : null;
  };

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 dark:border-slate-800 h-[80vh] overflow-hidden transition-colors">
      <div className="flex items-center p-5 border-b border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90">
        <button onClick={onBack} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Voltar
        </button>
        <h2 className="ml-4 text-lg font-bold text-slate-800 dark:text-white">Biblioteca de Vídeos</h2>
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-950/30 flex-grow">
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Aprenda Salvando Vidas</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Selecione um procedimento para ver tutoriais práticos</p>
            </div>

            <div className="space-y-3">
            {VIDEO_RESOURCES.map((video) => (
                <button
                key={video.id}
                onClick={() => handleVideoClick(video)}
                className="w-full flex items-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 hover:shadow-md transition-all group text-left"
                >
                <div className="flex-shrink-0 mr-4 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                    {getIcon(video.iconId) || (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{video.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{video.description}</p>
                </div>
                <div className="ml-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/50 group-hover:text-red-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                </button>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLibrary;

import React from 'react';
import type { Emergency, VideoResource } from './types';

// --- Icons ---

const HeartIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

const FireIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM10 18a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 4a1 1 0 000 2 1 1 0 011 1v1a1 1 0 102 0V8a1 1 0 011-1 1 1 0 100-2 3 3 0 00-3-3H7z" />
  </svg>
);

const BoneIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 8.25v-1.5a2.25 2.25 0 00-4.5 0v1.5m0 0v1.5a2.25 2.25 0 004.5 0v-1.5m-4.5 0h4.5m-4.5 0a2.25 2.25 0 00-2.25 2.25v1.5a2.25 2.25 0 002.25 2.25h4.5a2.25 2.25 0 002.25-2.25v-1.5a2.25 2.25 0 00-2.25-2.25h-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 8.25v8.25a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V8.25" />
    </svg>
);

const ChokingIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const BleedingIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.209-.138 2.43-.138 3.662v.512a48.678 48.678 0 007.324 0v-.512z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a6 6 0 01-6-6h12a6 6 0 01-6 6z" />
    </svg>
);

const AllergyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
);

const StethoscopeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const VideoIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
  </svg>
);

const BrainIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const SkullIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const SnakeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
  </svg>
);

const BoltIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const MindIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
  </svg>
);

const ClipboardIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
);

export const EMERGENCIES: Emergency[] = [
  {
    id: 'prontuario_digital',
    name: 'Prontuário Digital',
    description: 'Histórico, gráficos e gestão de saúde.',
    icon: <ClipboardIcon className="h-8 w-8" />,
    isPlatinum: true,
  },
  {
    id: 'triage_sinais',
    name: 'Triagem / Sinais Vitais',
    description: 'Avaliação avançada com IA.',
    icon: <StethoscopeIcon className="h-8 w-8" />,
    isPremium: true,
  },
  {
    id: 'videos_educativos',
    name: 'Vídeos Educativos',
    description: 'Biblioteca completa de tutoriais.',
    icon: <VideoIcon className="h-8 w-8" />,
    isPremium: true,
  },
  {
    id: 'ansiedade',
    name: 'Crise de Ansiedade',
    description: 'Suporte para pânico e stress.',
    icon: <MindIcon className="h-8 w-8" />,
    isPremium: true,
  },
  {
    id: 'parada_cardiaca',
    name: 'Parada Cardíaca',
    description: 'A pessoa não responde e não respira.',
    icon: <HeartIcon className="h-8 w-8" />,
  },
  {
    id: 'avc',
    name: 'AVC (Derrame)',
    description: 'Boca torta, fala enrolada, perda de força.',
    icon: <BrainIcon className="h-8 w-8" />,
    isPremium: true,
  },
  {
    id: 'engasgo',
    name: 'Engasgo',
    description: 'Vias aéreas bloqueadas.',
    icon: <ChokingIcon className="h-8 w-8" />,
  },
  {
    id: 'convulsao',
    name: 'Convulsão',
    description: 'Abalos musculares, perda de consciência.',
    icon: <BrainIcon className="h-8 w-8" />,
  },
  {
    id: 'queimaduras',
    name: 'Queimaduras',
    description: 'Lesões térmicas, químicas ou elétricas.',
    icon: <FireIcon className="h-8 w-8" />,
    isPremium: true,
  },
  {
    id: 'hemorragia',
    name: 'Hemorragia',
    description: 'Sangramento intenso.',
    icon: <BleedingIcon className="h-8 w-8" />,
  },
  {
    id: 'fraturas',
    name: 'Fraturas',
    description: 'Dor intensa e deformidade óssea.',
    icon: <BoneIcon className="h-8 w-8" />,
    isPremium: true,
  },
  {
    id: 'reacao_alergica',
    name: 'Reação Alérgica',
    description: 'Inchaço, urticária, falta de ar.',
    icon: <AllergyIcon className="h-8 w-8" />,
    isPremium: true,
  },
  {
    id: 'intoxicacao',
    name: 'Intoxicação',
    description: 'Ingestão de produtos tóxicos.',
    icon: <SkullIcon className="h-8 w-8" />,
    isPremium: true,
  },
  {
    id: 'picadas',
    name: 'Picadas',
    description: 'Aranhas, cobras, escorpiões.',
    icon: <SnakeIcon className="h-8 w-8" />,
    isPremium: true,
  },
  {
    id: 'choque_eletrico',
    name: 'Choque Elétrico',
    description: 'Descarga elétrica e queimaduras.',
    icon: <BoltIcon className="h-8 w-8" />,
    isPremium: true,
  },
];

export const VIDEO_RESOURCES: VideoResource[] = [
  {
    id: 'rcp_adulto',
    title: 'RCP (Ressuscitação) Adulto',
    description: 'Massagem cardíaca em adultos.',
    searchQuery: 'primeiros socorros rcp massagem cardiaca adulto passo a passo',
    iconId: 'parada_cardiaca'
  },
  {
    id: 'rcp_bebe',
    title: 'RCP em Bebês',
    description: 'Reanimação para bebês.',
    searchQuery: 'primeiros socorros rcp bebe recem nascido como fazer',
    iconId: 'parada_cardiaca'
  },
  {
    id: 'heimlich_adulto',
    title: 'Engasgo (Heimlich)',
    description: 'Desengasgar adulto consciente.',
    searchQuery: 'manobra de heimlich engasgo adulto como fazer',
    iconId: 'engasgo'
  },
  {
    id: 'engasgo_bebe',
    title: 'Engasgo em Bebês',
    description: 'Como desengasgar bebê (tapotagem).',
    searchQuery: 'como desengasgar bebe manobra heimlich lactente',
    iconId: 'engasgo'
  },
  {
    id: 'estancar_sangue',
    title: 'Estancar Sangramento',
    description: 'Compressão e torniquete.',
    searchQuery: 'primeiros socorros estancar sangramento hemorragia',
    iconId: 'hemorragia'
  },
  {
    id: 'avc_sinais',
    title: 'Identificar AVC (SAMU)',
    description: 'Como reconhecer um derrame.',
    searchQuery: 'sinais avc samu escala cincinnati',
    iconId: 'avc'
  },
  {
    id: 'convulsao_video',
    title: 'Convulsão: O que fazer',
    description: 'Procedimentos durante a crise.',
    searchQuery: 'primeiros socorros convulsão o que fazer',
    iconId: 'convulsao'
  },
  {
    id: 'queimadura_video',
    title: 'Tratar Queimaduras',
    description: 'Primeiros cuidados.',
    searchQuery: 'primeiros socorros queimadura o que fazer',
    iconId: 'queimaduras'
  }
];


import React from 'react';

export interface Emergency {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  isPremium?: boolean;
  isPlatinum?: boolean;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export type PatientProfile = 'crianca' | 'adulto' | 'idoso';

export interface VitalSigns {
  temperature?: string;
  heartRate?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  consciousness?: 'Alerta' | 'Confuso' | 'Sonolento' | 'Inconsciente';
  bloodPressureSystolic?: string;
  bloodPressureDiastolic?: string;
  glucose?: string;
}

export interface VideoResource {
  id: string;
  title: string;
  description: string;
  searchQuery: string; // Query otimizada para busca no YouTube
  iconId?: string; // Para reutilizar ícones existentes
}

export interface User {
  name: string;
  email: string;
  plan: 'free' | 'premium' | 'platinum';
  subscriptionDate?: string; // ISO Date string para controlar recorrência
  age?: string;
  gender?: 'masculino' | 'feminino' | 'outro';
  weight?: string;
  height?: string;
  bloodType?: string;
  allergies?: string;
}

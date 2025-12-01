export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PLANT_DOCTOR = 'PLANT_DOCTOR',
  ADVISOR = 'ADVISOR',
  MARKET = 'MARKET',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface MarketInsight {
  content: string;
  sources: GroundingSource[];
}

export interface PlantAnalysisResult {
  diagnosis: string;
  confidence: string;
  treatment: string;
  rawText: string;
}

export interface WeatherData {
  day: string;
  temp: number;
  rainfall: number;
}

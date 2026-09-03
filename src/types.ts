export interface DespesaExtra {
  tipo: string;
  valor: number;
}

export interface Jornada {
  id: number | string;
  data: string; // YYYY-MM-DD
  horasTrabalhadas: string; // HH:MM
  km: number;
  precoLitro?: number;
  mediaKml?: number;
  combustivelCalculado?: number;
  combustivel?: number;
  uber: number;
  pop: number;
  particular: number;
  gorjeta: number;
  outrasDespesas: DespesaExtra[];
  obs?: string;
}

export interface Objetivo {
  id: number;
  titulo: string;
  valor: number;
  pago?: number;
  porcentagem?: number;
}

export interface BackupData {
  versao: number;
  dataExportacao: string;
  registros: Jornada[];
  objetivos: Objetivo[];
}

export interface AppConfig {
  name: string;
  tagline: string;
  systemInstruction: string;
  starterPrompts: string[];
  temperature: number;
  themeColor: string;
  customApiKey?: string;
}

export interface PresetApp {
  id: string;
  name: string;
  tagline: string;
  iconName: string;
  systemInstruction: string;
  starterPrompts: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'assistant';
  text: string;
  timestamp: number;
}

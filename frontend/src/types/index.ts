export interface FormField {
  _id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea';
  options?: string[];
  required: boolean;
  order: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Participant {
  _id: string;
  formData: Record<string, string>;
  avatar: string;
  submittedAt: string;
  raffleEntry: boolean;
  hasWon: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RaffleSettings {
  _id?: string;
  prize: string;
  description: string;
  isActive?: boolean;
  drawDate?: string | null;
  numberOfWinners: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubmitFormResponse {
  success: boolean;
  message: string;
  participant: {
    id: string;
    avatar: string;
    submittedAt: string;
  };
}

export interface RaffleInfo {
  settings: RaffleSettings;
  totalEntries: number;
  winners: Participant[];
}

export interface DrawWinnersResponse {
  message: string;
  winners: Participant[];
}

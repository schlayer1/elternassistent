export type TabType = 'discover' | 'chat' | 'tools' | 'info';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestions?: string[];
  actionCard?: ActionCardData;
}

export interface ActionCardData {
  title: string;
  category: string;
  summary: string;
  bullets?: string[];
  contact?: {
    name: string;
    role: string;
    phone?: string;
    email?: string;
  };
  link?: {
    label: string;
    url: string;
  };
  actionType?: 'tool_navigate' | 'external_url' | 'checklist_open';
  actionPayload?: string;
}

export type SupportedLanguage = 'de' | 'en' | 'uk' | 'ru' | 'ar';

export interface LanguageConfig {
  code: SupportedLanguage;
  label: string;
  flag: string;
  greeting: string;
}

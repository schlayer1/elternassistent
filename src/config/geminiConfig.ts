// Google Gemini API Konfiguration gemäß dem offiziellen Heimbürgeschule-Standard

const decodeDefaultKey = (): string => {
  try {
    const b64 = 'QVEuQWI4Uk42SUpRQTM1V0ZScTRfLTdsUFAxQVU1Y1l5bkVTN3VmekZjdjlyZktHMjhhV2c=';
    if (typeof atob !== 'undefined') return atob(b64);
    const globalBuffer = (globalThis as any).Buffer;
    if (globalBuffer) return globalBuffer.from(b64, 'base64').toString('utf8');
  } catch (e) {
    console.warn('Fehler beim Dekodieren des Schulschlüssels:', e);
  }
  return '';
};

export const DEFAULT_SCHOOL_GEMINI_KEY = decodeDefaultKey();

// Kaskade aktueller, verifizierter Modelle (Stand 2026, absteigende Priorität)
// Schließt veraltete/eingestellte 1.5, 2.0 und 2.5 Modelle strikt aus!
export const CANDIDATE_FLASH_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite-preview',
];

export const getActiveApiKey = (): string => {
  // 1. Manuell hinterlegter Lehrkraft-/Nutzer-Key aus localStorage
  const customKey = localStorage.getItem('hbs_custom_gemini_api_key');
  if (customKey && customKey.trim().length > 10) {
    return customKey.trim();
  }

  // 2. Vercel / Vite Umgebungsvariable
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 10) {
    return envKey.trim();
  }

  // 3. Offizieller Schulschlüssel als Null-Hürden-Fallback
  return DEFAULT_SCHOOL_GEMINI_KEY;
};

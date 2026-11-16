// Google Gemini API Konfiguration gemäß dem offiziellen Heimbürgeschule-Standard
// Der Schul-API-Schlüssel liegt ausschließlich serverseitig in Vercel (GEMINI_API_KEY)
// und wird über /api/gemini aufgerufen.

export const CANDIDATE_FLASH_MODELS = [
  'gemini-4-hydrogen',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-flash-latest',
];

/**
 * Gibt ausschließlich einen optional vom Nutzer im Browser hinterlegten BYOK-Key zurück.
 * Leerstring bedeutet: sicherer Server-Schulschlüssel über /api/gemini.
 */
export const getActiveApiKey = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    const customKey = localStorage.getItem('hbs_custom_gemini_api_key');
    if (customKey && customKey.trim().length > 10) {
      return customKey.trim();
    }
  } catch {
    // ignore
  }
  return '';
};

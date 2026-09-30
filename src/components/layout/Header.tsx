import React, { useState } from 'react';
import { SupportedLanguage } from '../../types/assistant';
import { JarvisReactor } from '../jarvis/JarvisReactor';
import { Globe, Key, ShieldCheck, X } from 'lucide-react';

interface HeaderProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  jarvisStatus: 'idle' | 'thinking' | 'speaking';
  onNavigateToChat: () => void;
}

const LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'ar', label: 'العربية', flag: '🇸🇾' }
];

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  jarvisStatus,
  onNavigateToChat
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customKey, setCustomKey] = useState(
    () => localStorage.getItem('hbs_custom_gemini_api_key') || ''
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveKey = () => {
    if (customKey.trim()) {
      localStorage.setItem('hbs_custom_gemini_api_key', customKey.trim());
    } else {
      localStorage.removeItem('hbs_custom_gemini_api_key');
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowKeyModal(false);
    }, 1200);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FFFBF5]/90 backdrop-blur-md border-b border-[#F1E9DA] px-4 py-2.5 transition-all shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & School Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateToChat}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-school-blue to-school-blueDark flex items-center justify-center text-white shadow-soft">
                {/* Embedded Mini-Shield */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 8v4" />
                  <circle cx="12" cy="15" r="1" fill="currentColor" />
                </svg>
              </div>
              {/* Online Pulse Dot */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#FFFBF5]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight leading-none">
                  Heimbürgeschule Kahla
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-school-blueLight text-school-blue text-[10px] font-semibold rounded-full border border-school-blue/20">
                  Elternassistent
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-tight">
                Digitaler Wegweiser & Dialog ohne Login
              </p>
            </div>
          </div>

          {/* Right Area: JARVIS Core Indicator & Language Chooser */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Live JARVIS Hologram Reactor Widget */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#F1E9DA] rounded-xl shadow-soft cursor-pointer hover:border-school-blue/40 transition-colors"
              title={
                jarvisStatus === 'thinking'
                  ? 'JARVIS Kognitionskern analysiert die Anfrage...'
                  : jarvisStatus === 'speaking'
                  ? 'JARVIS Sprachausgabe aktiv'
                  : 'JARVIS Kognitionskern bereit'
              }
              onClick={onNavigateToChat}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <JarvisReactor status={jarvisStatus} size="sm" />
              </div>
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                {jarvisStatus === 'thinking'
                  ? 'Denkt nach...'
                  : jarvisStatus === 'speaking'
                  ? 'Spricht...'
                  : 'Bereit'}
              </span>
            </div>

            {/* Language Selector */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 bg-white border border-[#F1E9DA] px-2.5 py-1.5 rounded-xl shadow-soft cursor-pointer text-xs font-semibold text-slate-700 hover:border-school-blue/40 transition-colors">
                <Globe className="w-3.5 h-3.5 text-school-blue" />
                <span className="uppercase">{currentLanguage}</span>
              </div>
              <div className="absolute right-0 mt-1 w-36 bg-white border border-[#F1E9DA] rounded-xl shadow-float py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => onLanguageChange(l.code)}
                    className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between hover:bg-school-blueLight/50 transition-colors ${
                      currentLanguage === l.code ? 'text-school-blue font-bold bg-school-blueLight/30' : 'text-slate-700'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span>{l.flag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Key Icon */}
            <button
              onClick={() => setShowKeyModal(true)}
              className="p-2 text-slate-400 hover:text-school-blue bg-white border border-[#F1E9DA] rounded-xl hover:border-school-blue/40 shadow-soft transition-colors"
              title="API-Einstellungen (Optional)"
            >
              <Key className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Key / Settings Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-float border border-school-border relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 text-school-blue mb-3">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">
                KI-Verbindung & Schlüssel
              </h3>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Standardmäßig nutzt der Assistent den integrierten <strong className="text-school-blue">Heimbürgeschule-Schlüssel</strong> mit Google Gemini Flash. Weder Eltern noch Schüler müssen einen Key eingeben!
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Eigener Gemini API-Key (Optional für Lehrkräfte/Admins):
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-blue/30 focus:border-school-blue"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Wird nur lokal in Ihrem Browser gespeichert. Frei lassen für Standard-Schulzugang.
              </span>
            </div>

            {savedSuccess && (
              <div className="p-2 mb-3 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200 text-center">
                ✓ Einstellungen erfolgreich gespeichert!
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Schließen
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-school-blue hover:bg-school-blueDark rounded-lg shadow-sm"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState, useEffect } from 'react';
import { SupportedLanguage } from '../../types/assistant';
import { TRANSLATIONS } from '../../data/translations';
import { JarvisReactor } from '../jarvis/JarvisReactor';
import { liveSyncService, LiveDocData } from '../../services/liveSyncService';
import { feedbackService } from '../../services/feedbackService';
import { UnansweredQuestion } from '../../types/feedback';
import {
  Globe,
  Settings,
  ShieldCheck,
  X,
  FileText,
  RefreshCw,
  CheckCircle,
  ExternalLink,
  Lock,
  KeyRound,
  MessageSquareQuote,
  Table,
  Download,
  Copy,
  Trash2,
  Check,
  AlertCircle
} from 'lucide-react';

interface HeaderProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  jarvisStatus: 'idle' | 'thinking' | 'speaking';
  onNavigateToChat: () => void;
  onSyncUpdated?: () => void;
}

const SETTINGS_PASSWORD = 'Year2003?!%';

const LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
  { code: 'ar', label: 'العربية', flag: '🇸🇾' }
];

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  jarvisStatus,
  onNavigateToChat,
  onSyncUpdated
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState<'sync' | 'api' | 'feedback'>('sync');

  // Google Doc Sync State
  const [googleDocUrl, setGoogleDocUrl] = useState(() => liveSyncService.getDocUrl());
  const [syncStatus, setSyncStatus] = useState<LiveDocData | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Wissenslücken & Feedback State
  const [questionsList, setQuestionsList] = useState<UnansweredQuestion[]>(() =>
    feedbackService.getAllQuestions()
  );
  const [webhookUrl, setWebhookUrl] = useState(() => feedbackService.getWebhookUrl());
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);

  // Gemini Key State
  const [customKey, setCustomKey] = useState(
    () => localStorage.getItem('hbs_custom_gemini_api_key') || ''
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const t = TRANSLATIONS[currentLanguage]?.header || TRANSLATIONS.de.header;

  useEffect(() => {
    // Initialer Live-Sync Check
    if (googleDocUrl) {
      liveSyncService.fetchLiveKnowledge(false).then((data) => {
        setSyncStatus(data);
      });
    }
  }, []);

  const handleOpenSettingsClick = () => {
    setPasswordInput('');
    setPasswordError(false);
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === SETTINGS_PASSWORD) {
      setShowPasswordPrompt(false);
      setPasswordError(false);
      setQuestionsList(feedbackService.getAllQuestions());
      setWebhookUrl(feedbackService.getWebhookUrl());
      setShowSettingsModal(true);
    } else {
      setPasswordError(true);
    }
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    setWebhookTestResult(null);
    feedbackService.setWebhookUrl(webhookUrl);
    const res = await feedbackService.testWebhookConnection(webhookUrl);
    setTestingWebhook(false);
    setWebhookTestResult(res);
  };

  const handleSaveWebhook = () => {
    feedbackService.setWebhookUrl(webhookUrl);
    setWebhookTestResult({ success: true, message: '✓ Webhook-URL erfolgreich gespeichert!' });
    setTimeout(() => setWebhookTestResult(null), 3000);
  };

  const handleCopyQuestion = (item: UnansweredQuestion) => {
    feedbackService.copyForGoogleDoc(item);
    setCopiedQuestionId(item.id);
    setTimeout(() => setCopiedQuestionId(null), 2500);
  };

  const handleDeleteQuestion = (id: string) => {
    const updated = feedbackService.deleteQuestion(id);
    setQuestionsList(updated);
  };

  const handleToggleResolved = (id: string) => {
    const updated = feedbackService.toggleResolved(id);
    setQuestionsList(updated);
  };

  const handleClearAllQuestions = () => {
    if (window.confirm('Möchten Sie wirklich alle bisher erfassten offenen Fragen aus der lokalen Ansicht löschen?')) {
      feedbackService.clearAllQuestions();
      setQuestionsList([]);
    }
  };

  const handleExportCsv = () => {
    feedbackService.exportToCsv();
  };

  const handleTestAndSaveDocSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    liveSyncService.setDocUrl(googleDocUrl);

    try {
      const data = await liveSyncService.fetchLiveKnowledge(true);
      setSyncStatus(data);
      if (data.isOnline && data.rawText) {
        setSyncFeedback(`✓ Erfolgreich synchronisiert! ${data.rawText.length} Zeichen geladen.`);
        onSyncUpdated?.();
      } else if (googleDocUrl.trim()) {
        setSyncFeedback('Hinweis: Dokument gespeichert. Bitte sicherstellen, dass die Freigabe auf "Jeder mit dem Link kann lesen" steht.');
      } else {
        setSyncFeedback('Live-Sync deaktiviert (Standard-Wissensbasis aktiv).');
      }
    } catch (e) {
      setSyncFeedback('Fehler beim Abruf. Bitte Link prüfen.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveKey = () => {
    if (customKey.trim()) {
      localStorage.setItem('hbs_custom_gemini_api_key', customKey.trim());
    } else {
      localStorage.removeItem('hbs_custom_gemini_api_key');
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 1500);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FFFBF5]/95 backdrop-blur-md border-b border-[#F1E9DA] transition-all shadow-xs">
        {/* Responsive-School-Apps Fluid Container */}
        <div className="w-full max-w-[2100px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Brand & School Logo */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onNavigateToChat}>
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white border border-[#F1E9DA] flex items-center justify-center p-1 shadow-soft overflow-hidden">
                {/* Official School Seal */}
                <img
                  src="/siegel_bunt.png"
                  alt="Heimbürgeschule Kahla Siegel"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Online Pulse Dot */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#FFFBF5]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                  Heimbürgeschule Kahla
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-school-blueLight text-school-blue text-[10px] font-bold rounded-full border border-school-blue/20">
                  Elternassistent
                </span>
                {syncStatus?.isOnline && (
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200" title="Live-Sync über Google Docs aktiv">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Live-Sync
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium leading-tight mt-0.5">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Right Area: JARVIS Core Indicator, Language Chooser & Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live JARVIS Hologram Reactor Widget */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#F1E9DA] rounded-xl shadow-soft cursor-pointer hover:border-school-blue/40 transition-colors h-10 select-none"
              title={
                jarvisStatus === 'thinking'
                  ? t.thinking
                  : jarvisStatus === 'speaking'
                  ? t.speaking
                  : t.ready
              }
              onClick={onNavigateToChat}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <JarvisReactor status={jarvisStatus} size="sm" />
              </div>
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                {jarvisStatus === 'thinking'
                  ? t.thinking
                  : jarvisStatus === 'speaking'
                  ? t.speaking
                  : t.ready}
              </span>
            </div>

            {/* Language Selector */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 bg-white border border-[#F1E9DA] px-3 py-2 rounded-xl shadow-soft cursor-pointer text-xs font-bold text-slate-700 hover:border-school-blue/40 transition-colors h-10 select-none">
                <Globe className="w-4 h-4 text-school-blue" />
                <span className="uppercase">{currentLanguage}</span>
              </div>
              <div className="absolute right-0 mt-1 w-40 bg-white border border-[#F1E9DA] rounded-2xl shadow-float py-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => onLanguageChange(l.code)}
                    className={`w-full px-3.5 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-school-blueLight/50 transition-colors min-h-[40px] ${
                      currentLanguage === l.code ? 'text-school-blue font-bold bg-school-blueLight/30' : 'text-slate-700'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-base">{l.flag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Settings & Live Sync Modal Button (Passwortgeschützt) */}
            <button
              onClick={handleOpenSettingsClick}
              className="p-2.5 text-slate-500 hover:text-school-blue bg-white border border-[#F1E9DA] rounded-xl hover:border-school-blue/40 shadow-soft transition-colors h-10 w-10 flex items-center justify-center relative"
              title="Schulverwaltung (Passwortgeschützt)"
            >
              <Settings className="w-4 h-4" />
              {syncStatus?.isOnline && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-float border border-[#F1E9DA] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 text-school-blue">
                <div className="w-9 h-9 rounded-xl bg-school-blueLight flex items-center justify-center text-school-blue">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Schulverwaltung
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Zugang nur für Lehrkräfte & Schulleitung
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordPrompt(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>Passwort eingeben:</span>
                </label>
                <input
                  type="password"
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError(false);
                  }}
                  placeholder="Passwort..."
                  className={`w-full text-sm px-3.5 py-2.5 border rounded-xl focus:outline-none transition-all ${
                    passwordError
                      ? 'border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-200 text-red-900'
                      : 'border-slate-300 focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue'
                  }`}
                />
                {passwordError && (
                  <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                    <span>Ungültiges Passwort. Bitte erneut versuchen.</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPasswordPrompt(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors h-10"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-school-blue hover:bg-school-blueDark rounded-xl shadow-soft transition-all h-10"
                >
                  Entsperren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings & Live Sync Modal (Responsive-School-Apps Standard) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] sm:max-h-[85vh] shadow-float border border-school-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
              <div className="flex items-center gap-2.5 text-school-blue">
                <ShieldCheck className="w-6 h-6" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    Schulverwaltung & Live-Synchronisation
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Heimbürgeschule Kahla • Daten tagesaktuell halten
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex border-b border-slate-100 bg-[#FFFBF5] px-4 sm:px-6 shrink-0 gap-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab('sync')}
                className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === 'sync'
                    ? 'border-school-blue text-school-blue'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Weg 1: Google Doc</span>
                {syncStatus?.isOnline && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('feedback');
                  setQuestionsList(feedbackService.getAllQuestions());
                }}
                className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === 'feedback'
                    ? 'border-school-blue text-school-blue'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquareQuote className="w-4 h-4" />
                <span>Wissenslücken & Feedback</span>
                {questionsList.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold leading-none">
                    {questionsList.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('api')}
                className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === 'api'
                    ? 'border-school-blue text-school-blue'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>KI-Schlüssel (Optional)</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {activeTab === 'sync' && (
                <div className="space-y-4">
                  <div className="bg-school-blueLight/40 p-4 rounded-2xl border border-school-blue/20">
                    <h4 className="text-xs font-bold text-school-blueDark flex items-center gap-1.5 mb-1">
                      <FileText className="w-4 h-4" />
                      <span>Wie funktioniert Weg 1 (Google Doc Live-Sync)?</span>
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Erstelle ein Google Doc (z. B. <em>„HBS Aktuelle Schulinformationen“</em>) mit der Freigabe <strong>„Jeder mit dem Link kann lesen“</strong>. Trage dort geänderte Klassenleitungen, Schülerzahlen, Elternabende oder Eilmeldungen ein.
                      Der Assistent liest dieses Dokument live im Hintergrund bei allen Eltern ein – ohne dass Vercel neu gebaut werden muss!
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Link zu deinem freigegebenen Google Doc:
                    </label>
                    <input
                      type="url"
                      placeholder="https://docs.google.com/document/d/.../edit"
                      value={googleDocUrl}
                      onChange={(e) => setGoogleDocUrl(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Tipp: Für Eilmeldungen schreibe in das Dokument einfach: <code>[EILMELDUNG]: Hier der Text</code>
                    </span>
                  </div>

                  {syncFeedback && (
                    <div className="p-3 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl">
                      {syncFeedback}
                    </div>
                  )}

                  {syncStatus && syncStatus.isOnline && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Live-Verbindung aktiv (Zuletzt: {syncStatus.lastUpdated})</span>
                      </div>
                      {syncStatus.sourceUrl && (
                        <a
                          href={syncStatus.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 underline font-semibold flex items-center gap-1"
                        >
                          Öffnen <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'feedback' && (
                <div className="space-y-4">
                  {/* Google Sheet Webhook Sync Box */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 p-4 rounded-2xl border border-amber-200/80 shadow-xs space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Table className="w-4 h-4 text-amber-700" />
                        <h4 className="text-xs font-bold text-slate-900">
                          Zentrales Google Sheet (Apps Script Webhook)
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        Geräteübergreifend
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Offene Fragen von allen Eltern-Smartphones werden automatisch und geräteübergreifend an diesen Webhook gesendet und in Ihre Google-Tabelle eingetragen:
                    </p>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://script.google.com/macros/s/.../exec"
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          className="flex-1 text-xs font-mono px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                        />
                        <button
                          onClick={handleSaveWebhook}
                          className="px-3 py-2 bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold transition-colors"
                        >
                          Speichern
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          onClick={handleTestWebhook}
                          disabled={testingWebhook}
                          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <RefreshCw className={`w-3 h-3 ${testingWebhook ? 'animate-spin' : ''}`} />
                          <span>{testingWebhook ? 'Sende Testzeile...' : 'Verbindung testen'}</span>
                        </button>

                        <a
                          href="https://script.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-amber-800 underline font-semibold flex items-center gap-1"
                        >
                          Apps Script Konsole <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {webhookTestResult && (
                        <div
                          className={`p-2.5 rounded-xl text-xs font-medium border animate-in fade-in ${
                            webhookTestResult.success
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : 'bg-rose-50 border-rose-200 text-rose-800'
                          }`}
                        >
                          {webhookTestResult.message}
                        </div>
                      )}

                      <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60 text-[11px] text-slate-600 space-y-1">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Executive Dashboard aktiv:</span>
                        </div>
                        <p className="leading-relaxed">
                          • Neueste Fragen erscheinen automatisch in <strong>Zeile 2 ganz oben</strong>.<br />
                          • Farbcodiertes Status-Dropdown (🔴 Offen, 🟡 In Bearbeitung, 🟢 Im Google Doc ergänzt, ⚪ Erledigt).<br />
                          • Automatische E-Mail-Benachrichtigung an <code>schlayer1@hotmail.com</code> bei jeder neuen Frage.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fragen-Liste Header mit Aktionen */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        Erfasste offene Fragen ({questionsList.length})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {questionsList.length > 0 && (
                        <>
                          <button
                            onClick={handleExportCsv}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Als CSV-Datei herunterladen"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>CSV</span>
                          </button>
                          <button
                            onClick={handleClearAllQuestions}
                            className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Liste leeren"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Leeren</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Fragen Feed */}
                  {questionsList.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                      <p className="text-xs font-bold text-slate-700">Aktuell keine Wissenslücken erfasst!</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Sobald ein Elternteil eine unbeantwortete Frage stellt oder Daumen-runter klickt, erscheint sie hier und in Ihrem Google Sheet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                      {questionsList.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 text-xs transition-all hover:border-slate-300"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                                {item.dateIso} • {item.timestamp}
                              </span>
                              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                {item.language}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                                  item.reason === 'user_downvote'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {item.reasonLabel}
                              </span>
                            </div>

                            <button
                              onClick={() => handleDeleteQuestion(item.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                              title="Löschen"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-semibold text-slate-900">
                            „{item.question}“
                          </div>

                          {item.answerSnippet && (
                            <p className="text-[11px] text-slate-500 italic line-clamp-2">
                              KI-Antwort: {item.answerSnippet}
                            </p>
                          )}

                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                            <button
                              onClick={() => handleCopyQuestion(item)}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
                                copiedQuestionId === item.id
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-school-blue hover:bg-school-blueDark text-white'
                              }`}
                            >
                              {copiedQuestionId === item.id ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Kopiert für Google Doc!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Für Google Doc kopieren</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleToggleResolved(item.id)}
                              className={`text-[11px] font-semibold px-2 py-1 rounded-lg transition-colors ${
                                item.resolved
                                  ? 'text-emerald-700 bg-emerald-50'
                                  : 'text-slate-500 hover:bg-slate-100'
                              }`}
                            >
                              {item.resolved ? '✓ Erledigt' : 'Als erledigt markieren'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'api' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Standardmäßig nutzt der Assistent den integrierten <strong className="text-school-blue">Heimbürgeschule-Schlüssel</strong> mit Google Gemini Flash. Weder Eltern noch Schüler müssen einen Key eingeben!
                  </p>

                  <div>
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
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-xl border border-emerald-200 text-center">
                      ✓ Einstellungen erfolgreich gespeichert!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Sticky Footer (Thumb-friendly on mobile) */}
            <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors h-11"
              >
                Schließen
              </button>

              {activeTab === 'sync' ? (
                <button
                  onClick={handleTestAndSaveDocSync}
                  disabled={isSyncing}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-school-blue hover:bg-school-blueDark rounded-xl shadow-soft flex items-center gap-2 h-11 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Synchronisiere...' : 'Jetzt testen & synchronisieren'}</span>
                </button>
              ) : activeTab === 'feedback' ? (
                <button
                  onClick={handleExportCsv}
                  disabled={questionsList.length === 0}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-soft flex items-center gap-2 h-11 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Als CSV exportieren</span>
                </button>
              ) : (
                <button
                  onClick={handleSaveKey}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-school-blue hover:bg-school-blueDark rounded-xl shadow-soft h-11 transition-all"
                >
                  Speichern
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

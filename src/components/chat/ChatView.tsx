import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, SupportedLanguage, ActionCardData } from '../../types/assistant';
import { executeGeminiCascade } from '../../services/geminiService';
import { SpeechService } from '../../services/speechService';
import { storageService } from '../../services/storageService';
import { QUICK_STARTER_QUESTIONS } from '../../data/topicCategories';
import { TRANSLATIONS } from '../../data/translations';
import { renderFormattedMarkdown } from '../../utils/formatText';
import { JarvisReactor } from '../jarvis/JarvisReactor';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle,
  HelpCircle,
  Languages
} from 'lucide-react';

interface ChatViewProps {
  currentLanguage: SupportedLanguage;
  jarvisStatus: 'idle' | 'thinking' | 'speaking';
  setJarvisStatus: (status: 'idle' | 'thinking' | 'speaking') => void;
  initialQuestion?: string | null;
  onClearInitialQuestion?: () => void;
  onNavigateToTools?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentLanguage,
  jarvisStatus,
  setJarvisStatus,
  initialQuestion,
  onClearInitialQuestion,
  onNavigateToTools
}) => {
  const t = TRANSLATIONS[currentLanguage]?.chat || TRANSLATIONS.de.chat;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = storageService.getChatHistory();
    if (saved.length > 0) return saved;
    const initialT = TRANSLATIONS[currentLanguage]?.chat || TRANSLATIONS.de.chat;
    return [
      {
        id: 'welcome_' + currentLanguage,
        sender: 'assistant',
        text: initialT.welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: initialT.welcomeSuggestions
      }
    ];
  });

  // When language switches: If conversation only consists of the welcome message, adapt it to the new language!
  useEffect(() => {
    if (messages.length === 1 && messages[0].id.startsWith('welcome')) {
      setMessages([
        {
          id: 'welcome_' + currentLanguage,
          sender: 'assistant',
          text: t.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: t.welcomeSuggestions
        }
      ]);
    }
  }, [currentLanguage]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    storageService.saveChatHistory(messages);
  }, [messages, jarvisStatus]);

  // Handle passed initial question (e.g. from Discover or Quick chips)
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      handleSendMessage(initialQuestion.trim());
      onClearInitialQuestion?.();
    }
  }, [initialQuestion]);

  // Handle text-to-speech toggle
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (speakingMessageId === msgId) {
      SpeechService.stopSpeaking();
      setSpeakingMessageId(null);
      setJarvisStatus('idle');
    } else {
      setJarvisStatus('speaking');
      setSpeakingMessageId(msgId);
      SpeechService.speak(
        text,
        currentLanguage,
        () => setJarvisStatus('speaking'),
        () => {
          setSpeakingMessageId(null);
          setJarvisStatus('idle');
        }
      );
    }
  };

  // Handle voice speech-to-text
  const handleToggleVoiceInput = () => {
    if (isListening) {
      SpeechService.stopListening();
      setIsListening(false);
      return;
    }

    setSpeechError(null);
    const started = SpeechService.startListening(
      currentLanguage,
      (transcript) => {
        setInputText(transcript);
      },
      (error) => {
        setSpeechError('Mikrofonzugriff nicht möglich oder keine Sprache erkannt.');
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (started) {
      setIsListening(true);
    } else {
      setSpeechError('Spracheingabe wird in diesem Browser leider nicht unterstützt.');
    }
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || jarvisStatus === 'thinking') return;

    // Stop ongoing speech
    SpeechService.stopSpeaking();
    setSpeakingMessageId(null);

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setJarvisStatus('thinking');

    try {
      // Build conversation history for context
      const history = messages
        .filter((m) => m.sender === 'user' || m.sender === 'assistant')
        .map((m) => ({
          role: m.sender === 'assistant' ? ('model' as const) : ('user' as const),
          text: m.text
        }));

      const res = await executeGeminiCascade(query, currentLanguage, history);

      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: res.suggestions,
        actionCard: res.actionCard
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'system',
        text: `Entschuldigung, die Antwort konnte gerade nicht generiert werden: ${err.message || 'Verbindungsfehler'}. Bitte versuchen Sie es gleich erneut.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Sekretariat der Schule anrufen', 'Hauptthemen anzeigen']
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setJarvisStatus('idle');
    }
  };

  const handleClearChat = () => {
    if (window.confirm(t.clearConfirm)) {
      SpeechService.stopSpeaking();
      storageService.clearChatHistory();
      setMessages([
        {
          id: 'welcome_' + currentLanguage,
          sender: 'assistant',
          text: t.resetMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: t.welcomeSuggestions
        }
      ]);
      setJarvisStatus('idle');
    }
  };

  return (
    <div className="w-full max-w-[2100px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-3 sm:py-4 flex flex-col h-[calc(100vh-130px)] md:h-[calc(100vh-145px)]">
      {/* Top Chat Bar with Clear and Status */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-school-border mb-3 shadow-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-slate-700">
            {t.topBarTitle}
          </span>
        </div>
        <button
          onClick={handleClearChat}
          className="text-xs font-semibold text-slate-500 hover:text-school-orange flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-xl hover:bg-orange-50 min-h-[36px]"
          title={t.newChatBtn}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.newChatBtn}</span>
        </button>
      </div>

      {/* Main Content Area: Asymmetric Dual-Column Workbench on Laptop/iMac (responsive-school-apps) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-h-0 overflow-hidden">
        {/* Left Side Panel on iMac & Laptop (Col-Span 4 / 3) */}
        <div className="hidden lg:flex lg:col-span-4 xl:col-span-4 2xl:col-span-3 flex-col gap-4 overflow-y-auto pr-1">
          {/* JARVIS Kognitionskern Card */}
          <div className="bg-white rounded-3xl p-5 border border-school-border shadow-soft flex flex-col items-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-school-blue bg-school-blueLight px-2.5 py-0.5 rounded-full border border-school-blue/20 mb-3">
              {t.jarvisLabel}
            </span>
            <div className="w-36 h-36 flex items-center justify-center my-1">
              <JarvisReactor
                status={jarvisStatus}
                size="md"
                label={
                  jarvisStatus === 'thinking'
                    ? 'Analysiere Wissensbasis...'
                    : jarvisStatus === 'speaking'
                    ? 'Sprachausgabe aktiv'
                    : 'System bereit'
                }
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {t.jarvisDesc}
            </p>
          </div>

          {/* Quick Questions Card for Rapid Exploration */}
          <div className="bg-white rounded-3xl p-5 border border-school-border shadow-soft flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3 text-slate-800">
              <HelpCircle className="w-4 h-4 text-school-orange" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                {t.directTopicsTitle}
              </h4>
            </div>
            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {t.quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left text-xs p-2.5 rounded-xl border border-slate-100 hover:border-school-blue/30 hover:bg-school-blueLight/30 text-slate-700 transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-2">{q}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-school-blue group-hover:translate-x-0.5 shrink-0 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side / Mobile Full: Active Chat Messages & Sticky Input */}
        <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 flex flex-col h-full min-h-0 bg-transparent">
          {/* Multilingual Assistance Banner for non-German speaking parents */}
          {currentLanguage !== 'de' && (
            <div className="bg-gradient-to-r from-teal-900 to-school-blueDark text-white p-3.5 sm:p-4 rounded-2xl shadow-soft border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0 mb-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/20 rounded-xl border border-teal-400/30 text-teal-300">
                  <Languages className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">
                    {t.bannerTitle}
                  </span>
                  <span className="text-[11px] text-teal-100/90 leading-tight block">
                    {t.bannerDesc}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
                <button
                  onClick={onNavigateToTools}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-white text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  {TRANSLATIONS[currentLanguage]?.tools?.tabMultilingual || 'Brief-Dolmetscher'}
                </button>
                <a
                  href="https://translator-hbs.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-teal-400 hover:bg-teal-300 text-slate-900 rounded-lg text-xs font-extrabold transition-all shadow-xs inline-flex items-center justify-center gap-1"
                >
                  <span>{t.openTranslatorBtn}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 scroll-smooth">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isAssistant = msg.sender === 'assistant';
          const isSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
            >
              {/* Message Bubble Container */}
              <div className="flex items-start gap-2.5 max-w-[92%] md:max-w-[85%]">
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-school-blue to-school-teal flex items-center justify-center text-white shrink-0 mt-1 shadow-soft">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`p-4 md:p-5 rounded-2xl text-xs md:text-sm shadow-soft transition-all ${
                    isUser
                      ? 'bg-gradient-to-r from-school-blue to-school-blueDark text-white rounded-tr-none'
                      : 'bg-white border border-[#F1E9DA] text-slate-800 rounded-tl-none'
                  }`}
                >
                  {/* Bubble Content */}
                  <div className="leading-relaxed">
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div>{renderFormattedMarkdown(msg.text)}</div>
                    )}
                  </div>

                  {/* Action Card (If Gemini suggested concrete action) */}
                  {msg.actionCard && (
                    <div className="mt-3.5 p-3.5 bg-[#FFFBF5] rounded-xl border border-school-orange/30 shadow-xs">
                      <div className="flex items-center gap-2 mb-1 text-school-orangeDark font-bold text-xs">
                        <CheckCircle className="w-4 h-4 text-school-orange" />
                        <span>{msg.actionCard.title}</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2.5">
                        {msg.actionCard.summary}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {msg.actionCard.contact?.phone && (
                          <a
                            href={`tel:${msg.actionCard.contact.phone.replace(/[\s/]/g, '')}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold text-xs shadow-xs hover:bg-emerald-700 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{msg.actionCard.contact.phone}</span>
                          </a>
                        )}
                        {msg.actionCard.link?.url && (
                          <a
                            href={msg.actionCard.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-school-blue text-white rounded-lg font-semibold text-xs shadow-xs hover:bg-school-blueDark transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>{msg.actionCard.link.label || 'Website öffnen'}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bottom Controls of Bubble */}
                  <div className="flex items-center justify-between gap-3 mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                    <span>{msg.timestamp}</span>

                    {isAssistant && (
                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.text)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isSpeaking
                            ? 'bg-orange-100 text-school-orange animate-pulse'
                            : 'hover:bg-slate-100 text-slate-500 hover:text-school-blue'
                        }`}
                        title={isSpeaking ? t.stopSpeaking : t.readAloud}
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-school-orange" />
                            <span>{t.stopSpeaking}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{t.readAloud}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Suggestions / Follow-up Chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-11 max-w-[95%]">
                  {msg.suggestions.map((sug, si) => (
                    <button
                      key={si}
                      onClick={() => handleSendMessage(sug)}
                      className="text-left text-xs font-medium text-slate-700 bg-white hover:bg-school-blueLight hover:text-school-blue border border-[#F1E9DA] hover:border-school-blue/40 px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 group"
                    >
                      <span>{sug}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-school-blue group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Spectacular JARVIS Thinking Arc-Reactor Animation */}
        {jarvisStatus === 'thinking' && (
          <div className="flex items-start gap-2.5 max-w-[85%] animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-xl bg-school-blue flex items-center justify-center text-white shrink-0 mt-1 shadow-soft">
              <Sparkles className="w-4 h-4 text-white" />
            </div>

            <div className="p-5 bg-white border border-[#0B7BA7]/30 rounded-2xl shadow-jarvis flex flex-col items-center justify-center w-full max-w-sm">
              <JarvisReactor
                status="thinking"
                size="md"
                label="HBS Kognitionskern aktiv"
              />
              <p className="text-xs text-slate-500 font-medium text-center mt-3 animate-pulse">
                Heimbürgeschule Wissensbasis wird durchsucht...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Speech Error Banner */}
      {speechError && (
        <div className="p-2 mb-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center justify-between">
          <span>{speechError}</span>
          <button onClick={() => setSpeechError(null)} className="font-bold ml-2">✕</button>
        </div>
      )}

      {/* Input Area */}
      <div className="pt-2 bg-[#FFFBF5]">
        <div className="relative bg-white rounded-2xl border border-school-border shadow-soft focus-within:border-school-blue focus-within:ring-2 focus-within:ring-school-blue/15 transition-all p-2">
          {/* Text Area */}
          <textarea
            ref={inputRef}
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              isListening
                ? (currentLanguage === 'ro' ? 'Vorbiți acum... (microfon activ)' : currentLanguage === 'uk' ? 'Говоріть зараз... (мікрофон активний)' : currentLanguage === 'ru' ? 'Говорите сейчас... (микрофон включен)' : 'Sprechen Sie jetzt... (Mikrofon aktiv)')
                : t.placeholder
            }
            className="w-full text-xs md:text-sm text-slate-800 placeholder:text-slate-400 resize-none outline-none px-2 py-1 max-h-32 bg-transparent"
          />

          {/* Action Buttons Bar */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 px-1">
            <div className="flex items-center gap-1.5">
              {/* Microphone Button (Speech-to-Text) */}
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`p-2 rounded-xl transition-all flex items-center gap-1 text-xs font-semibold ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md ring-2 ring-rose-300'
                    : 'text-slate-500 hover:text-school-blue hover:bg-school-blueLight/50'
                }`}
                title={isListening ? 'Mikrofon stoppen' : 'Frage einsprechen (Mikrofon)'}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span className="hidden sm:inline">Höre zu...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span className="hidden sm:inline text-slate-600 font-normal">Sprechen</span>
                  </>
                )}
              </button>

              <span className="text-[11px] text-slate-400 hidden md:inline">
                Enter zum Absenden
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Send Button */}
              <button
                type="button"
                disabled={!inputText.trim() || jarvisStatus === 'thinking'}
                onClick={() => handleSendMessage()}
                className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center shadow-soft ${
                  inputText.trim() && jarvisStatus !== 'thinking'
                    ? 'bg-gradient-to-r from-school-blue to-school-blueDark text-white hover:scale-105 active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                title="Nachricht senden"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { TabType, SupportedLanguage } from './types/assistant';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { DiscoverView } from './components/discover/DiscoverView';
import { ChatView } from './components/chat/ChatView';
import { ToolsView } from './components/tools/ToolsView';
import { InfoView } from './components/info/InfoView';
import { liveSyncService } from './services/liveSyncService';
import { AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('discover');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('de');
  const [jarvisStatus, setJarvisStatus] = useState<'idle' | 'thinking' | 'speaking'>('idle');
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [urgentNotice, setUrgentNotice] = useState<string | null>(null);
  const [showNoticeBanner, setShowNoticeBanner] = useState<boolean>(true);

  useEffect(() => {
    // Check for urgent live updates on startup
    const checkUrgentNotice = async () => {
      const data = await liveSyncService.fetchLiveKnowledge();
      if (data && data.urgentNotice) {
        setUrgentNotice(data.urgentNotice);
      }
    };
    checkUrgentNotice();
  }, []);

  const handleAskQuestion = (question: string) => {
    setPendingQuestion(question);
    setCurrentTab('chat');
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-slate-800 flex flex-col font-sans selection:bg-orange-200">
      {/* Top Urgent Alert Banner (if set in Google Doc) */}
      {urgentNotice && showNoticeBanner && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-md transition-all">
          <div className="max-w-[2100px] mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-amber-400 rounded-full animate-pulse text-amber-950">
                <AlertTriangle size={15} />
              </span>
              <span>
                <strong className="underline decoration-slate-900/40">Eilmeldung:</strong> {urgentNotice}
              </span>
            </div>
            <button
              onClick={() => setShowNoticeBanner(false)}
              className="p-1 hover:bg-amber-600/30 rounded-lg transition-colors text-slate-900"
              title="Meldung schließen"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Top Application Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        jarvisStatus={jarvisStatus}
        onNavigateToChat={() => setCurrentTab('chat')}
      />

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col relative w-full pb-20 md:pb-6">
        {currentTab === 'discover' && (
          <DiscoverView
            onAskQuestion={handleAskQuestion}
            onOpenChecklist={() => setCurrentTab('tools')}
            onOpenCareerCompass={() => setCurrentTab('tools')}
          />
        )}

        {currentTab === 'chat' && (
          <ChatView
            currentLanguage={currentLanguage}
            jarvisStatus={jarvisStatus}
            setJarvisStatus={setJarvisStatus}
            initialQuestion={pendingQuestion}
            onClearInitialQuestion={() => setPendingQuestion(null)}
            onNavigateToTools={() => setCurrentTab('tools')}
          />
        )}

        {currentTab === 'tools' && (
          <ToolsView onAskQuestion={handleAskQuestion} />
        )}

        {currentTab === 'info' && (
          <InfoView />
        )}
      </main>

      {/* Persistent Navigation (Desktop top pills / Mobile bottom island) */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />
    </div>
  );
}

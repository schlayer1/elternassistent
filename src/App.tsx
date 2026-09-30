import React, { useState } from 'react';
import { TabType, SupportedLanguage } from './types/assistant';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { DiscoverView } from './components/discover/DiscoverView';
import { ChatView } from './components/chat/ChatView';
import { ToolsView } from './components/tools/ToolsView';
import { InfoView } from './components/info/InfoView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('discover');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('de');
  const [jarvisStatus, setJarvisStatus] = useState<'idle' | 'thinking' | 'speaking'>('idle');
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  const handleAskQuestion = (question: string) => {
    setPendingQuestion(question);
    setCurrentTab('chat');
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-slate-800 flex flex-col font-sans selection:bg-orange-200">
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

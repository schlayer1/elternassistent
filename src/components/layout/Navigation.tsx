import React from 'react';
import { TabType } from '../../types/assistant';
import { Compass, MessageSquareCode, Wrench, Info } from 'lucide-react';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unreadCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab
}) => {
  const tabs = [
    {
      id: 'discover' as TabType,
      label: 'Themen',
      icon: Compass,
      desc: 'Themenwelten & Einblicke'
    },
    {
      id: 'chat' as TabType,
      label: 'KI-Assistent',
      icon: MessageSquareCode,
      desc: 'Fragen stellen & Vorlesen'
    },
    {
      id: 'tools' as TabType,
      label: 'Eltern-Tools',
      icon: Wrench,
      desc: 'Abschlüsse & Checklisten'
    },
    {
      id: 'info' as TabType,
      label: 'Schule & Notfall',
      icon: Info,
      desc: 'Kontakte & Zeiten'
    }
  ];

  return (
    <>
      {/* Desktop Navigation Bar (centered below header) */}
      <div className="hidden md:block max-w-5xl mx-auto px-4 pt-3 pb-1">
        <div className="flex items-center justify-center p-1 bg-white/80 backdrop-blur-md rounded-2xl border border-[#F1E9DA] shadow-soft gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-tight transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-school-blue to-school-blueDark text-white shadow-soft scale-[1.02]'
                    : 'text-slate-600 hover:text-school-blue hover:bg-school-blueLight/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Sticky Bottom Navigation (Floating island style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFBF5]/95 backdrop-blur-lg border-t border-[#F1E9DA] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                  isActive ? 'text-school-blue' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {/* Active Indicator Top Pill */}
                {isActive && (
                  <span className="absolute -top-1 w-6 h-1 bg-school-blue rounded-full" />
                )}
                <div
                  className={`p-1 rounded-xl transition-transform ${
                    isActive ? 'scale-110 bg-school-blueLight/70' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] tracking-tight font-medium mt-0.5 ${isActive ? 'font-bold' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

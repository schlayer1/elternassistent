import React, { useState } from 'react';
import { CAREER_PATHS } from '../../data/careerPathsData';
import { SCHEDULE_BLOCKS } from '../../data/contactsData';
import { storageService } from '../../services/storageService';
import { ChecklistGroup } from '../../types/school';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  CheckSquare,
  Clock,
  ChevronRight,
  Sparkles,
  Award,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface ToolsViewProps {
  onAskQuestion: (question: string) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ onAskQuestion }) => {
  const [activeSubTab, setActiveSubTab] = useState<'careers' | 'checklists' | 'schedule'>('careers');
  const [selectedCareerId, setSelectedCareerId] = useState<string>(CAREER_PATHS[2].id); // Realschulabschluss default

  // Checklists state from local storage
  const [checklists, setChecklists] = useState<ChecklistGroup[]>(() =>
    storageService.getChecklists()
  );

  const selectedCareer = CAREER_PATHS.find((c) => c.id === selectedCareerId) || CAREER_PATHS[2];

  // Handle checklist checkbox toggle
  const handleToggleItem = (groupId: string, itemId: string) => {
    const updated = storageService.toggleChecklistItem(groupId, itemId);
    setChecklists(updated);

    // Check if group is now 100% completed
    const currentGroup = updated.find((g) => g.id === groupId);
    if (currentGroup && currentGroup.items.every((it) => it.completed)) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleResetGroup = (groupId: string) => {
    if (window.confirm('Möchten Sie alle Häkchen dieser Checkliste zurücksetzen?')) {
      const updated = storageService.resetChecklistGroup(groupId);
      setChecklists(updated);
    }
  };

  // Determine current active schedule period based on local time
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const isBlockActive = (timeStr: string) => {
    try {
      const [startStr, endStr] = timeStr.split('–').map((s) => s.trim());
      const [sh, sm] = startStr.split(':').map(Number);
      const [eh, em] = endStr.split(':').map(Number);
      const startMin = sh * 60 + sm;
      const endMin = eh * 60 + em;
      return currentMinutes >= startMin && currentMinutes <= endMin;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="w-full max-w-[2100px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-4 sm:py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-school-border shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-school-tealLight text-school-tealDark rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-school-teal" />
              <span>Interaktive Helfer für den Schulalltag</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900">
              Eltern-Werkzeuge & Schullaufbahn
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Erkunden Sie Thüringer Schulabschlüsse, haken Sie wichtige Vorbereitungen ab und behalten Sie die Schultakt-Zeiten im Blick.
            </p>
          </div>

          {/* Sub-Tabs Selector with touch-friendly >=44px targets */}
          <div className="flex flex-wrap sm:flex-nowrap bg-[#FFFBF5] p-1.5 rounded-2xl border border-school-border self-start md:self-center gap-1">
            <button
              onClick={() => setActiveSubTab('careers')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold min-h-[44px] transition-all ${
                activeSubTab === 'careers'
                  ? 'bg-school-blue text-white shadow-soft'
                  : 'text-slate-600 hover:text-school-blue'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Abschluss-Kompass</span>
            </button>
            <button
              onClick={() => setActiveSubTab('checklists')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold min-h-[44px] transition-all ${
                activeSubTab === 'checklists'
                  ? 'bg-school-orange text-white shadow-soft'
                  : 'text-slate-600 hover:text-school-orange'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Checklisten</span>
            </button>
            <button
              onClick={() => setActiveSubTab('schedule')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold min-h-[44px] transition-all ${
                activeSubTab === 'schedule'
                  ? 'bg-school-teal text-white shadow-soft'
                  : 'text-slate-600 hover:text-school-teal'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Schulzeit-Takt</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. CAREER COMPASS VIEW */}
      {activeSubTab === 'careers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Pathway Selector Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CAREER_PATHS.map((path) => {
              const isSelected = path.id === selectedCareerId;
              return (
                <button
                  key={path.id}
                  onClick={() => setSelectedCareerId(path.id)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'bg-white border-school-blue ring-2 ring-school-blue/20 shadow-float -translate-y-0.5'
                      : 'bg-white/70 border-school-border hover:bg-white hover:border-slate-300 shadow-soft'
                  }`}
                >
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white mb-2"
                    style={{ backgroundColor: path.color }}
                  >
                    {path.badge}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {path.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {path.grade}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Career Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-school-border shadow-float space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white inline-block mb-2"
                  style={{ backgroundColor: selectedCareer.color }}
                >
                  {selectedCareer.grade} • {selectedCareer.badge}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                  {selectedCareer.title}
                </h3>
                <p className="text-xs md:text-sm font-semibold text-slate-600 mt-1">
                  Ziel: {selectedCareer.target}
                </p>
              </div>

              <button
                onClick={() =>
                  onAskQuestion(`Welche genauen Voraussetzungen gelten für den ${selectedCareer.title}?`)
                }
                className="px-4 py-2.5 bg-school-blue text-white font-bold text-xs rounded-xl shadow-soft hover:bg-school-blueDark transition-colors flex items-center gap-1.5 self-start md:self-center"
              >
                <span>Im KI-Assistenten vertiefen</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed bg-[#FFFBF5] p-4 rounded-2xl border border-school-border">
              {selectedCareer.description}
            </p>

            {/* 3 Grid Boxes: Voraussetzungen, Prüfungen, Zukunftschancen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Voraussetzungen</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {selectedCareer.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-school-blue" />
                  <span>Prüfungsbestandteile</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {selectedCareer.exams.map((ex, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-school-blue font-bold">•</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4 text-school-orange" />
                  <span>Anschluss & Zukunft</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {selectedCareer.nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-school-orange font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CHECKLISTS VIEW */}
      {activeSubTab === 'checklists' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {checklists.map((group) => {
            const completedCount = group.items.filter((it) => it.completed).length;
            const progress = Math.round((completedCount / group.items.length) * 100);
            const isAllDone = completedCount === group.items.length;

            return (
              <div
                key={group.id}
                className="bg-white rounded-3xl p-6 border border-school-border shadow-soft space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-slate-900">
                      {group.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {group.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs font-bold text-slate-700">
                      {completedCount} von {group.items.length} erledigt ({progress}%)
                    </span>
                    <button
                      onClick={() => handleResetGroup(group.id)}
                      className="p-1.5 text-slate-400 hover:text-school-orange rounded-lg hover:bg-orange-50 transition-colors"
                      title="Häkchen zurücksetzen"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isAllDone
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-school-blue to-school-teal'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Checklist Items */}
                <div className="space-y-2 pt-2">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleItem(group.id, item.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        item.completed
                          ? 'bg-emerald-50/60 border-emerald-200 text-slate-500'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {}} // Controlled by div onClick
                        className="mt-1 w-4 h-4 text-school-blue rounded border-slate-300 focus:ring-school-blue pointer-events-none"
                      />
                      <div className="flex-1 text-xs">
                        <span
                          className={`font-semibold text-slate-800 block ${
                            item.completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {item.text}
                        </span>
                        {item.detail && (
                          <span className="text-[11px] text-slate-500 mt-0.5 block leading-normal">
                            {item.detail}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. SCHEDULE / TIMETABLE VIEW */}
      {activeSubTab === 'schedule' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-school-border shadow-float space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Schultakt & Doppelstunden-Rhythmus
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                An der Heimbürgeschule Kahla lernen die Kinder in ruhigen 80-Minuten-Blöcken.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 block">Aktuelle Uhrzeit:</span>
              <span className="text-sm font-bold text-school-blue">
                {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Uhr
              </span>
            </div>
          </div>

          {/* Timeline Blocks */}
          <div className="space-y-2.5">
            {SCHEDULE_BLOCKS.map((block, idx) => {
              const active = isBlockActive(block.time);
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    active
                      ? 'bg-school-blueLight/60 border-school-blue ring-2 ring-school-blue/20 shadow-soft'
                      : block.isBreak
                      ? 'bg-[#FFFBF5] border-amber-200/70 text-amber-900'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${
                        active
                          ? 'bg-school-blue text-white shadow-xs'
                          : block.isBreak
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {block.period}
                    </span>
                    <span className="text-xs md:text-sm font-semibold text-slate-800">
                      {block.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {active && (
                      <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                        Jetzt aktiv
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-slate-600">
                      {block.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

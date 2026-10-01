import React, { useState } from 'react';
import { TOPIC_ITEMS, QUICK_STARTER_QUESTIONS } from '../../data/topicCategories';
import { TopicItem } from '../../types/school';
import {
  GraduationCap,
  Briefcase,
  Clock,
  Smartphone,
  TrendingUp,
  Utensils,
  ChevronRight,
  Sparkles,
  HelpCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface DiscoverViewProps {
  onAskQuestion: (question: string) => void;
  onOpenChecklist: () => void;
  onOpenCareerCompass: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  onAskQuestion,
  onOpenChecklist,
  onOpenCareerCompass
}) => {
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const getIcon = (name: string) => {
    switch (name) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-school-blue" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-school-orange" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-school-teal" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-indigo-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-amber-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-school-blue" />;
    }
  };

  const filteredTopics = activeFilter === 'all'
    ? TOPIC_ITEMS
    : TOPIC_ITEMS.filter((t) => t.category === activeFilter);

  return (
    <div className="w-full max-w-[2100px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-4 sm:py-6 space-y-6">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-school-blue via-school-blueDark to-[#064259] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-float border border-school-blueLight/20">
        {/* Decorative background circles */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/5 rounded-full pointer-events-none blur-2xl" />
        <div className="absolute right-20 top-0 w-60 h-60 bg-school-teal/20 rounded-full pointer-events-none blur-xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-white/90 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-school-yellow" />
            <span>Offizieller Digitaler Schulbegleiter</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
            Willkommen an der Heimbürgeschule Kahla
          </h2>

          <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
            Für Eltern, Schüler:innen und interessierte Familien. Erfragen Sie alles rund um den Übergang in Klasse 5, unser Praxis-Profil „Fit fürs Leben“, Schullaufbahnen und den Schulalltag – direkt im Browser, ohne Login.
          </p>

          {/* Quick Action Badges with >=44px Touch-Targets */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onAskQuestion('Wie läuft die Kennenlernwoche für neue 5.-Klässler ab?')}
              className="px-4 py-2.5 min-h-[44px] bg-white text-school-blue font-bold text-xs sm:text-sm rounded-xl shadow-soft hover:bg-school-blueLight hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Übergang Klasse 5</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenCareerCompass}
              className="px-4 py-2.5 min-h-[44px] bg-school-teal text-white font-bold text-xs sm:text-sm rounded-xl shadow-soft hover:bg-school-tealDark hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Abschluss-Kompass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenChecklist}
              className="px-4 py-2.5 min-h-[44px] bg-school-orange text-white font-bold text-xs sm:text-sm rounded-xl shadow-soft hover:bg-school-orangeDark hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Eltern-Checklisten</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Questions Chips with touch-friendly paddings */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-school-orange" />
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Häufige Elternfragen (1-Klick-Antwort)
          </h3>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {QUICK_STARTER_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onAskQuestion(q)}
              className="min-h-[42px] text-left text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-school-blueLight hover:text-school-blue border border-[#F1E9DA] hover:border-school-blue/40 px-4 py-2.5 rounded-xl shadow-soft transition-all duration-150 flex items-center gap-2.5 group"
            >
              <span>{q}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-school-blue group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs with touch-pan-x */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none touch-pan-x text-xs sm:text-sm font-semibold">
        {[
          { id: 'all', label: 'Alle Themen' },
          { id: 'grade5', label: 'Klasse 5 / Neu an HBS' },
          { id: 'careers', label: 'TiP & Berufe' },
          { id: 'daily', label: 'Schulalltag & Zeiten' },
          { id: 'digital', label: 'Digitales & EduPage' },
          { id: 'formal', label: 'Essen & Formales' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`min-h-[40px] px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeFilter === f.id
                ? 'bg-school-blue text-white shadow-soft font-bold'
                : 'bg-white text-slate-600 border border-[#F1E9DA] hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Dynamic Bento & Card Grid (1 bis 5 Spalten gemäß responsive-school-apps) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
        {filteredTopics.map((topic) => {
          const isExpanded = selectedTopic?.id === topic.id;
          return (
            <div
              key={topic.id}
              className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                isExpanded
                  ? 'border-school-blue ring-2 ring-school-blue/15 shadow-float'
                  : 'border-[#F1E9DA] hover:border-school-blue/40 shadow-soft hover:-translate-y-0.5'
              }`}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-school-blueLight/50 border border-school-blue/10">
                    {getIcon(topic.iconName)}
                  </div>
                  <span className="px-2.5 py-0.5 text-[11px] font-bold text-school-blue bg-school-blueLight rounded-full border border-school-blue/20">
                    {topic.badge}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {topic.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {topic.shortDesc}
                </p>

                {/* Key Points */}
                <div className="space-y-1.5 mb-4">
                  {topic.keyPoints.slice(0, 3).map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-school-teal mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                {/* Expanded Details when clicked */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
                    <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-[#FFFBF5] p-3 rounded-xl border border-school-border">
                      {topic.fullAnswer}
                    </p>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        Vertiefende Fragen:
                      </span>
                      {topic.relatedQuestions.map((rq, ri) => (
                        <button
                          key={ri}
                          onClick={() => onAskQuestion(rq)}
                          className="w-full text-left text-xs font-medium text-school-blue hover:text-school-blueDark p-1.5 rounded-lg hover:bg-school-blueLight/40 transition-colors flex items-center justify-between"
                        >
                          <span>• {rq}</span>
                          <ChevronRight className="w-3 h-3 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedTopic(isExpanded ? null : topic)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {isExpanded ? 'Weniger anzeigen' : 'Mehr erfahren'}
                </button>
                <button
                  onClick={() => onAskQuestion(topic.relatedQuestions[0] || topic.title)}
                  className="px-3 py-1.5 bg-school-blue text-white font-semibold text-xs rounded-xl shadow-sm hover:bg-school-blueDark transition-colors flex items-center gap-1"
                >
                  <span>Im Chat fragen</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { TOPIC_ITEMS, QUICK_STARTER_QUESTIONS } from '../../data/topicCategories';
import { TopicItem } from '../../types/school';
import { SupportedLanguage } from '../../types/assistant';
import { TRANSLATIONS } from '../../data/translations';
import { renderFormattedMarkdown } from '../../utils/formatText';
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
  ExternalLink,
  Award
} from 'lucide-react';

interface DiscoverViewProps {
  currentLanguage: SupportedLanguage;
  onAskQuestion: (question: string) => void;
  onOpenChecklist: () => void;
  onOpenCareerCompass: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  currentLanguage,
  onAskQuestion,
  onOpenChecklist,
  onOpenCareerCompass
}) => {
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const t = TRANSLATIONS[currentLanguage]?.discover || TRANSLATIONS.de.discover;
  const toolsT = TRANSLATIONS[currentLanguage]?.tools || TRANSLATIONS.de.tools;

  const grade5BtnLabel =
    currentLanguage === 'ro' ? 'Trecerea în clasa a 5-a' :
    currentLanguage === 'uk' ? 'Перехід до 5 класу' :
    currentLanguage === 'ru' ? 'Переход в 5 класс' :
    currentLanguage === 'ar' ? 'الانتقال للصف الخامس' :
    currentLanguage === 'en' ? 'Grade 5 Transition' :
    'Übergang Klasse 5';

  const quickQuestionsHeader =
    currentLanguage === 'ro' ? 'Întrebări frecvente ale părinților (Răspuns cu 1 clic)' :
    currentLanguage === 'uk' ? 'Часті запитання батьків (Відповідь в 1 клік)' :
    currentLanguage === 'ru' ? 'Частые вопросы родителей (Ответ в 1 клик)' :
    currentLanguage === 'ar' ? 'أسئلة شائعة لأولياء الأمور (إجابة بنقرة واحدة)' :
    currentLanguage === 'en' ? 'Frequent Parent Questions (1-Click Answer)' :
    'Häufige Elternfragen (1-Klick-Antwort)';

  const askInChatLabel =
    currentLanguage === 'ro' ? 'Întreabă în chat' :
    currentLanguage === 'uk' ? 'Запитати в чаті' :
    currentLanguage === 'ru' ? 'Спросить в чате' :
    currentLanguage === 'ar' ? 'اسأل في المحادثة' :
    currentLanguage === 'en' ? 'Ask in Chat' :
    'Im Chat fragen';

  const quickQuestionsList = TRANSLATIONS[currentLanguage]?.chat?.quickQuestions || QUICK_STARTER_QUESTIONS;

  const filterOptions = [
    { id: 'all', label: t.filterAll },
    { id: 'grade5', label: t.filterGrade5 },
    { id: 'careers', label: t.filterCareers },
    { id: 'daily', label: t.filterDaily },
    { id: 'digital', label: t.filterDigital },
    { id: 'formal', label: t.filterFormal },
  ];

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
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Award':
        return <Award className="w-5 h-5 text-school-orange" />;
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
            <span>{t.heroBadge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
            {t.heroTitle}
          </h2>

          <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
            {t.heroSubtitle}
          </p>

          {/* Quick Action Badges with >=44px Touch-Targets */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onAskQuestion(quickQuestionsList[0] || 'Wie läuft die Kennenlernwoche für neue 5.-Klässler ab?')}
              className="px-4 py-2.5 min-h-[44px] bg-white text-school-blue font-bold text-xs sm:text-sm rounded-xl shadow-soft hover:bg-school-blueLight hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>{grade5BtnLabel}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenCareerCompass}
              className="px-4 py-2.5 min-h-[44px] bg-school-teal text-white font-bold text-xs sm:text-sm rounded-xl shadow-soft hover:bg-school-tealDark hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>{toolsT.tabCareers}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenChecklist}
              className="px-4 py-2.5 min-h-[44px] bg-school-orange text-white font-bold text-xs sm:text-sm rounded-xl shadow-soft hover:bg-school-orangeDark hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>{toolsT.tabChecklists}</span>
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
            {quickQuestionsHeader}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {quickQuestionsList.map((q, idx) => (
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
        {filterOptions.map((f) => (
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
          const toggleDetailsLabel = isExpanded
            ? (currentLanguage === 'ro' ? 'Mai puțin' : currentLanguage === 'uk' ? 'Згорнути' : currentLanguage === 'ru' ? 'Свернуть' : currentLanguage === 'ar' ? 'عرض أقل' : currentLanguage === 'en' ? 'Show less' : 'Weniger anzeigen')
            : (currentLanguage === 'ro' ? 'Află mai multe' : currentLanguage === 'uk' ? 'Дізнатися більше' : currentLanguage === 'ru' ? 'Узнать больше' : currentLanguage === 'ar' ? 'معرفة المزيد' : currentLanguage === 'en' ? 'Learn more' : 'Mehr erfahren');

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
                    <div className="text-xs text-slate-700 leading-relaxed bg-[#FFFBF5] p-3 rounded-xl border border-school-border space-y-1">
                      {renderFormattedMarkdown(topic.fullAnswer)}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        {t.relatedQuestionsTitle}
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
                  {toggleDetailsLabel}
                </button>
                <button
                  onClick={() => onAskQuestion(topic.relatedQuestions[0] || topic.title)}
                  className="px-3 py-1.5 bg-school-blue text-white font-semibold text-xs rounded-xl shadow-sm hover:bg-school-blueDark transition-colors flex items-center gap-1"
                >
                  <span>{askInChatLabel}</span>
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

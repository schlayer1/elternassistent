import React from 'react';
import { SCHOOL_CONTACTS } from '../../data/contactsData';
import { SupportedLanguage } from '../../types/assistant';
import { TRANSLATIONS } from '../../data/translations';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  ShieldAlert,
  Building2,
  HeartHandshake,
  UserCheck,
  Award,
  Utensils,
  CreditCard,
  Download
} from 'lucide-react';

interface InfoViewProps {
  currentLanguage: SupportedLanguage;
}

export const InfoView: React.FC<InfoViewProps> = ({ currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage]?.info || TRANSLATIONS.de.info;

  const callBtnLabel = 
    currentLanguage === 'ro' ? 'Sună' :
    currentLanguage === 'uk' ? 'Подзвонити' :
    currentLanguage === 'ru' ? 'Позвонить' :
    currentLanguage === 'ar' ? 'اتصال' :
    currentLanguage === 'en' ? 'Call' : 'Anrufen';

  const systemsTitle =
    currentLanguage === 'ro' ? 'Linkuri directe către sistemele școlare & parteneri' :
    currentLanguage === 'uk' ? 'Прямі посилання на шкільні платформи та партнерів' :
    currentLanguage === 'ru' ? 'Прямые ссылки на школьные платформы и партнеров' :
    currentLanguage === 'ar' ? 'روابط مباشرة للأنظمة المدرسية والشركاء' :
    currentLanguage === 'en' ? 'Direct Links to School Systems & Partners' :
    'Direkte Links zu Schulsystemen & Partnern';

  const addressTitle =
    currentLanguage === 'ro' ? 'Adresa școlii & Cum ajungeți' :
    currentLanguage === 'uk' ? 'Адреса школи та проїзд' :
    currentLanguage === 'ru' ? 'Адрес школы и проезд' :
    currentLanguage === 'ar' ? 'عنوان المدرسة والوصول' :
    currentLanguage === 'en' ? 'School Address & Directions' :
    'Schulanschrift & Anreise';

  const addressDesc =
    currentLanguage === 'ro' ? 'Am Langen Bürgel 19, 07768 Kahla\nAutobuzele școlare opresc direct în fața intrării principale.' :
    currentLanguage === 'uk' ? 'Am Langen Bürgel 19, 07768 Kahla\nШкільні автобуси зупиняються прямо перед головним входом.' :
    currentLanguage === 'ru' ? 'Am Langen Bürgel 19, 07768 Kahla\nШкольные автобусы останавливаются прямо перед главным входом.' :
    currentLanguage === 'ar' ? 'Am Langen Bürgel 19, 07768 Kahla\nتتوقف حافلات المدارس مباشرة أمام المدخل الرئيسي.' :
    currentLanguage === 'en' ? 'Am Langen Bürgel 19, 07768 Kahla\nSchool buses stop directly in front of the main entrance.' :
    'Am Langen Bürgel 19, 07768 Kahla\nSchulbusse halten direkt auf dem Vorplatz vor dem Haupteingang.';

  const bankTitle =
    currentLanguage === 'ro' ? 'Cont bancar oficial al școlii' :
    currentLanguage === 'uk' ? 'Офіційний банківський рахунок школи' :
    currentLanguage === 'ru' ? 'Официальный банковский счет школы' :
    currentLanguage === 'ar' ? 'الحساب المصرفي الرسمي للمدرسة' :
    currentLanguage === 'en' ? 'Official School Bank Account' :
    'Offizielles Schulkonto';

  const bankDesc =
    currentLanguage === 'ro' ? 'Pentru plăți oficiale (fondul de copiere, caiete de lucru, excursii):' :
    currentLanguage === 'uk' ? 'Для офіційних шкільних платежів (копіювання, робочі зошити, екскурсії):' :
    currentLanguage === 'ru' ? 'Для официальных школьных платежей (копирование, рабочие тетради, экскурсии):' :
    currentLanguage === 'ar' ? 'للمدفوعات المدرسية الرسمية (رسوم النسخ، دفاتر التمارين، الرحلات المدرسية):' :
    currentLanguage === 'en' ? 'For official school payments (copying fees, workbooks, excursions):' :
    'Für offizielle Schulzahlungen (Kopiergeld, Arbeitshefte, Exkursionen):';

  const getContactIcon = (name: string) => {
    switch (name) {
      case 'Building':
        return <Building2 className="w-5 h-5 text-school-blue" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-school-teal" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-rose-500" />;
      case 'Award':
        return <Award className="w-5 h-5 text-school-orange" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-amber-600" />;
      default:
        return <Building2 className="w-5 h-5 text-school-blue" />;
    }
  };

  return (
    <div className="w-full max-w-[2100px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-4 sm:py-6 space-y-6">
      {/* Emergency & Krankmelde-Banner */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 rounded-3xl p-5 sm:p-6 lg:p-7 shadow-soft">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-500 text-white shrink-0 shadow-soft">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-rose-950">
                  {t.emergencyTitle}
                </h3>
                <span className="px-2.5 py-0.5 bg-rose-200/80 text-rose-900 text-[10px] sm:text-xs font-bold rounded-full">
                  {t.emergencyBadge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-800 mt-1 leading-relaxed max-w-2xl">
                {t.emergencyDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto">
            <a
              href="tel:03642422400"
              className="w-full sm:w-auto px-5 py-3 min-h-[44px] bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-soft transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>036424 / 22 400</span>
            </a>
          </div>
        </div>
      </div>

      {/* Contacts Grid (1 bis 5 Spalten gemäß responsive-school-apps) */}
      <div className="space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
          {t.contactsTitle}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
          {SCHOOL_CONTACTS.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl p-5 border border-school-border shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2.5 rounded-xl bg-school-blueLight/50 border border-school-blue/10">
                    {getContactIcon(contact.iconName)}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {contact.role}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 mb-1">
                  {contact.name}
                </h4>

                {contact.detail && (
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {contact.detail}
                  </p>
                )}

                <div className="space-y-1.5 text-xs text-slate-600">
                  {contact.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{contact.location}</span>
                    </div>
                  )}
                  {contact.officeHours && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{contact.officeHours}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100">
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone.replace(/[\s/]/g, '')}`}
                    className="flex-1 py-2 px-3 bg-school-blue hover:bg-school-blueDark text-white rounded-xl font-semibold text-xs shadow-xs text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{callBtnLabel}</span>
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs shadow-xs text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>E-Mail</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* External Portals & Services */}
      <div className="bg-white rounded-3xl p-6 border border-school-border shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          {systemsTitle}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="https://regelschule-kahla.edupage.org"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-school-blue hover:bg-school-blueLight/20 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-900 group-hover:text-school-blue">
                  EduPage Portal
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-school-blue" />
              </div>
              <p className="text-xs text-slate-500">
                Noten, Vertretungsplan, Klassenbuch & Termine
              </p>
            </div>
            <span className="text-[11px] font-semibold text-school-blue mt-3 block">
              regelschule-kahla.edupage.org ↗
            </span>
          </a>

          <a
            href="https://bestellung-diakonie-apolda.de/#/register-form/107956-apoldav2097166894"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-school-orange hover:bg-school-orangeLight/40 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-900 group-hover:text-school-orangeDark">
                  Mittagessen Diakonie
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-school-orange" />
              </div>
              <p className="text-xs text-slate-500">
                Online-Registrierung & Essensbestellung mit Transponder
              </p>
            </div>
            <span className="text-[11px] font-semibold text-school-orangeDark mt-3 block">
              bestellung-diakonie-apolda.de ↗
            </span>
          </a>

          <a
            href="https://www.astradirect.de/fach-mieten/schule-waehlen"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-school-teal hover:bg-school-tealLight/40 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-900 group-hover:text-school-tealDark">
                  Schließfach mieten
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-school-teal" />
              </div>
              <p className="text-xs text-slate-500">
                AstraDirect Schließfachfach-Reservierung an der HBS
              </p>
            </div>
            <span className="text-[11px] font-semibold text-school-tealDark mt-3 block">
              astradirect.de ↗
            </span>
          </a>
        </div>
      </div>

      {/* Address & Bank Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-school-border shadow-soft space-y-2">
          <div className="flex items-center gap-2 text-school-blue font-bold text-xs uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>{addressTitle}</span>
          </div>
          <p className="text-sm font-semibold text-slate-900">
            Staatliche Regelschule „Johann Wilhelm Heimbürge“
          </p>
          <p className="text-xs text-slate-600 whitespace-pre-line">
            {addressDesc}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-school-border shadow-soft space-y-2">
          <div className="flex items-center gap-2 text-school-orange font-bold text-xs uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            <span>{bankTitle}</span>
          </div>
          <p className="text-xs text-slate-600">
            {bankDesc}
          </p>
          <p className="text-xs font-mono font-bold text-slate-900 bg-[#FFFBF5] p-2 rounded-xl border border-school-border select-all">
            IBAN: DE29 8309 4454 0348 2956 08<br />
            <span className="font-sans text-[11px] text-slate-500 font-normal">Volksbank Saaletal eG</span>
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { SCHOOL_CONTACTS } from '../../data/contactsData';
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

export const InfoView: React.FC = () => {
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
    <div className="max-w-5xl mx-auto px-4 py-4 md:py-6 space-y-6">
      {/* Emergency & Krankmelde-Banner */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 rounded-3xl p-5 md:p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-500 text-white shrink-0 shadow-soft">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-rose-950">
                  Krankmeldung & Dringende Notfälle
                </h3>
                <span className="px-2 py-0.5 bg-rose-200/80 text-rose-900 text-[10px] font-bold rounded-full">
                  Vor 07:45 Uhr
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                Melden Sie Fehlzeiten bitte morgens direkt per <strong>EduPage-App</strong> oder telefonisch im Sekretariat. Ab dem 3. Fehltag ist eine schriftliche Entschuldigung einzureichen.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:03642422400"
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-soft transition-all flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>036424 / 22 400</span>
            </a>
          </div>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Wichtige Ansprechpartner der Heimbürgeschule
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <span>Anrufen</span>
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
          Direkte Links zu Schulsystemen & Partnern
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
            <span>Schulanschrift & Anreise</span>
          </div>
          <p className="text-sm font-semibold text-slate-900">
            Staatliche Regelschule „Johann Wilhelm Heimbürge“
          </p>
          <p className="text-xs text-slate-600">
            Am Langen Bürgel 19, 07768 Kahla<br />
            Schulbusse halten direkt auf dem Vorplatz vor dem Haupteingang.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-school-border shadow-soft space-y-2">
          <div className="flex items-center gap-2 text-school-orange font-bold text-xs uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            <span>Offizielles Schulkonto</span>
          </div>
          <p className="text-xs text-slate-600">
            Für offizielle Schulzahlungen (Kopiergeld, Arbeitshefte, Exkursionen):
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

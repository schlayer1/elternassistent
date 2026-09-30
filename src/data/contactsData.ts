import { SchoolContact, ScheduleBlock } from '../types/school';

export const SCHOOL_CONTACTS: SchoolContact[] = [
  {
    id: 'sekretariat',
    role: 'Sekretariat & Krankmeldungen',
    name: 'Schulverwaltung HBS',
    detail: 'Erste Anlaufstelle für Eltern, Krankmeldungen, Bescheinigungen und Schülerangelegenheiten.',
    phone: '036424 / 22 400',
    email: 'rs.kahla@sv.lrashk.de',
    officeHours: 'Mo – Fr: 07:15 – 14:30 Uhr',
    location: 'Hauptgebäude, 1. OG, Zimmer 102',
    iconName: 'Building'
  },
  {
    id: 'schulleitung',
    role: 'Schulleiterin',
    name: 'Frau Sabine Herold',
    detail: 'Pädagogische Gesamtleitung, Schulkonzept, Kooperationen und offizielle Schulentscheidungen.',
    phone: '036424 / 22 400',
    email: 'rs.kahla@sv.lrashk.de',
    officeHours: 'Nach vorheriger Vereinbarung über das Sekretariat',
    location: 'Schulleitungsbüro',
    iconName: 'UserCheck'
  },
  {
    id: 'sozialarbeit',
    role: 'Schulsozialarbeit',
    name: 'Frau Horn',
    detail: 'Vertrauliche Beratung und Unterstützung für Schüler:innen und Eltern bei Sorgen, Konflikten und Teambuilding.',
    phone: '036424 / 22 400',
    email: 'schulsozialarbeit@heimbuerge.de',
    officeHours: 'Täglich an Schultagen: 08:00 – 14:00 Uhr',
    location: 'Raum der Schulsozialarbeit',
    iconName: 'HeartHandshake'
  },
  {
    id: 'foerderverein',
    role: 'Schulförderverein e.V.',
    name: 'Förderverein Heimbürgeschule',
    detail: 'Unterstützung von Projekten, Klassenfahrten, Schulfesten und Anschaffung moderner Lernmittel.',
    email: 'foerderverein@regelschule-kahla.de',
    detailExtra: 'Spendenkonto bei der Volksbank Saaletal eG',
    iconName: 'Award'
  },
  {
    id: 'essen',
    role: 'Mittagsversorgung',
    name: 'Diakoniewerk Apolda gGmbH',
    detail: 'Frische Zubereitung und Speisenversorgung der Heimbürgeschule.',
    phone: '03644 / 56 31 00',
    email: 'speisen@diakonie-apolda.de',
    officeHours: 'Mo – Fr: 07:30 – 14:00 Uhr',
    iconName: 'Utensils'
  }
];

export const SCHEDULE_BLOCKS: ScheduleBlock[] = [
  { period: 'Vorlauf', time: '07:30 – 07:45', label: 'Einlass & Frühaufsicht' },
  { period: '1. Block', time: '07:45 – 09:05', label: '1. & 2. Unterrichtsstunde (Doppelstunde)' },
  { period: 'Frühstückspause', time: '09:05 – 09:25', label: 'Gemeinsames Frühstück & Hofpause', isBreak: true },
  { period: '2. Block', time: '09:25 – 10:45', label: '3. & 4. Unterrichtsstunde (Doppelstunde)' },
  { period: 'Große Pause', time: '10:45 – 11:15', label: 'Bewegungspause auf dem grünen Schulhof', isBreak: true },
  { period: '3. Block', time: '11:15 – 12:35', label: '5. & 6. Unterrichtsstunde (Doppelstunde)' },
  { period: 'Mittagspause', time: '12:35 – 13:15', label: 'Warmes Mittagessen & Entspannung', isBreak: true },
  { period: '4. Block / GTS', time: '13:15 – 14:35', label: '7. & 8. Stunde / ILZ / AGs & GTS' },
  { period: 'Freizeit & AGs', time: '14:35 – 16:00', label: 'Arbeitsgemeinschaften & Sport' }
];

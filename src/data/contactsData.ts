import { SchoolContact, ScheduleBlock } from '../types/school';

export const SCHOOL_CONTACTS: SchoolContact[] = [
  {
    id: 'sekretariat',
    role: 'Sekretariat & Schulverwaltung',
    name: 'Frau Wittmann',
    detail: 'Zentrale Ansprechpartnerin für Eltern: Krankmeldungen, Schulanmeldungen, Schulwechsel, Bescheinigungen und Auskünfte.',
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
    detail: 'Pädagogische Gesamtleitung, Schulkonzept, Partnerschaften und offizielle Schulangelegenheiten.',
    phone: '036424 / 22 400',
    email: 'rs.kahla@sv.lrashk.de',
    officeHours: 'Termine nach Vereinbarung über das Sekretariat',
    location: 'Schulleitungsbüro',
    iconName: 'UserCheck'
  },
  {
    id: 'stellv_schulleitung',
    role: 'Stellvertretender Schulleiter',
    name: 'Herr Tim Könitzer',
    detail: 'Stunden- und Vertretungsplanung, Schulentwicklung, digitale Organisation.',
    phone: '036424 / 22 400',
    email: 'rs.kahla@sv.lrashk.de',
    officeHours: 'Termine nach Vereinbarung über das Sekretariat',
    location: 'Schulleitungsbüro',
    iconName: 'UserCheck'
  },
  {
    id: 'sozialarbeit',
    role: 'Schulsozialarbeit',
    name: 'Frau Horn',
    detail: 'Vertrauliche Beratung und Unterstützung für Schüler:innen und Eltern bei persönlichen Fragen, Konflikten und Teambuilding.',
    phone: '036424 / 22 400',
    email: 'schulsozialarbeit@heimbuerge.de',
    officeHours: 'Täglich an Schultagen: 08:00 – 14:00 Uhr',
    location: 'Hauptgebäude, Zimmer 103 (Raum der Schulsozialarbeit)',
    iconName: 'HeartHandshake'
  },
  {
    id: 'foerderverein',
    role: 'Schulförderverein e.V.',
    name: 'Förderverein Heimbürgeschule',
    detail: 'Unterstützung von Projekten, Schülerpreisen, Schulfesten und Anschaffung moderner Lernmittel.',
    email: 'foerderverein@regelschule-kahla.de',
    detailExtra: 'Spendenkonto bei der Volksbank Saaletal eG',
    iconName: 'Award'
  },
  {
    id: 'essen',
    role: 'Mittagsversorgung',
    name: 'Diakoniewerk Apolda gGmbH',
    detail: 'Frische Zubereitung und Speisenversorgung der Heimbürgeschule mit Online-Bestellportal.',
    phone: '03644 / 56 31 00',
    email: 'speisen@diakonie-apolda.de',
    officeHours: 'Mo – Fr: 07:30 – 14:00 Uhr',
    iconName: 'Utensils'
  }
];

export const SCHEDULE_BLOCKS: ScheduleBlock[] = [
  { period: 'Vorlauf', time: '07:30 – 07:45', label: 'Einlass & Frühaufsicht' },
  { period: '1. Stunde', time: '07:45 – 08:30', label: '1. Unterrichtsstunde' },
  { period: '2. Stunde', time: '08:35 – 09:20', label: '2. Unterrichtsstunde' },
  { period: 'Große Hofpause', time: '09:20 – 09:45', label: '25 min Bewegung & Frischluft auf dem grünen Campus', isBreak: true },
  { period: '3. Stunde', time: '09:45 – 10:30', label: '3. Unterrichtsstunde' },
  { period: '4. Stunde', time: '10:35 – 11:20', label: '4. Unterrichtsstunde' },
  { period: 'Mittagsband', time: '11:20 – 11:50', label: '30 min warmes Mittagessen in der Mensa & Erholung', isBreak: true },
  { period: '5. Stunde', time: '11:50 – 12:35', label: '5. Unterrichtsstunde' },
  { period: '6. Stunde', time: '12:40 – 13:25', label: '6. Unterrichtsstunde' },
  { period: '7. Stunde', time: '13:35 – 14:20', label: '7. Unterrichtsstunde' },
  { period: 'Ganztag & AGs', time: '14:30 – 15:30', label: 'Individuelle Hausaufgabenförderung, Lernzeit & AGs' }
];

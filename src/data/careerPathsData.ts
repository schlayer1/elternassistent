import { CareerPath } from '../types/school';

export const CAREER_PATHS: CareerPath[] = [
  {
    id: 'hauptschule',
    title: 'Hauptschulabschluss',
    grade: 'Klasse 9',
    target: 'Direkter Einstieg in eine betriebliche Ausbildung',
    badge: 'Klasse 9 Basis',
    color: '#00A896',
    legalReference: '§ 62 ThürSchulO',
    description: 'Wird am Ende der Klassenstufe 9 der Thüringer Regelschule erworben. Ein gesondertes Prüfungsverfahren ist gesetzlich nicht erforderlich – der Abschluss wird bei erfolgreicher Versetzung zuerkannt.',
    requirements: [
      'Erfolgreicher Besuch der Klassenstufe 9 (§ 62 ThürSchulO)',
      'Erfüllung der allgemeinen Versetzungsbestimmungen (§ 56 ThürSchulO)',
      'Keine Note 6 und höchstens eine unentschuldigte bzw. unausgeglichene Note 5',
      'Teilnahme an allen Pflichtfächern der Stundentafel'
    ],
    exams: [
      'Keine zusätzlichen zentralen Abschlussprüfungen erforderlich (§ 62 ThürSchulO)',
      'Abschluss wird auf Basis der Jahresnoten des Zeugnisses Klasse 9 zuerkannt'
    ],
    nextSteps: [
      'Duale betriebliche Berufsausbildung im Handwerk, Industrie oder Dienstleistung',
      'Einjähriges Berufsvorbereitungsjahr (BVJ)',
      'Freiwilliges 10. Schuljahr zum Nachholen des Realschulabschlusses bei entsprechendem Leistungsbild'
    ]
  },
  {
    id: 'qualifizierend',
    title: 'Qualifizierender Hauptschulabschluss',
    grade: 'Klasse 9 + BLF',
    target: 'Erhöhte Ausbildungs-Chancen & Zugang zu Klasse 10',
    badge: 'Klasse 9 Plus',
    color: '#E67E22',
    legalReference: '§ 63 ThürSchulO',
    description: 'Für Schüler:innen der 9. Klasse, die ihre Bewerbungschancen für anspruchsvolle Berufe verbessern oder bei knappem Zeugnis die Berechtigung für die 10. Klasse sichern möchten.',
    requirements: [
      'Freiwillige Meldung zur Besonderen Leistungsfeststellung (BLF) im 1. Halbjahr der Klasse 9 (§ 63 Abs. 1 ThürSchulO)',
      'Bestehen der Prüfungen mit dem vorgeschriebenen Notenmaßstab',
      'Erfüllung der Versetzungsanforderungen der Klasse 9'
    ],
    exams: [
      'Zentrale schriftliche Prüfung in Deutsch (§ 63 ThürSchulO)',
      'Zentrale schriftliche Prüfung in Mathematik (§ 63 ThürSchulO)',
      'Schriftliche Prüfung nach Schülerwahl in Englisch oder einer Naturwissenschaft (Biologie, Physik oder Chemie)'
    ],
    nextSteps: [
      'Bevorzugte Ausbildungsplatzvergabe in kaufmännischen und technischen Ausbildungsberufen',
      'Sichere Aufnahme in die Klassenstufe 10 zum Erwerb des Realschulabschlusses'
    ]
  },
  {
    id: 'realschule',
    title: 'Realschulabschluss (Mittlere Reife)',
    grade: 'Klasse 10 Prüfungen',
    target: 'Volle Ausbildungsreife & gymnasiale Oberstufenberechtigung',
    badge: 'Klasse 10 Standard',
    color: '#0B7BA7',
    legalReference: '§ 67 & § 47a ThürSchulO',
    description: 'Der reguläre, bundesweit anerkannte Abschluss der Thüringer Regelschule nach erfolgreicher 10. Klasse und bestandenen schriftlichen sowie mündlichen Prüfungen.',
    requirements: [
      'Versetzung in die Klassenstufe 10 (§ 56 ThürSchulO)',
      'Erfüllung der Kurseinstufungen (§§ 28–30 ThürSchulO: mindestens 2 Fächer auf E-Kurs-Niveau)',
      'Zulassung zu den zentralen Abschlussprüfungen',
      'Erfolgreiche Erstellung und Präsentation der Projektarbeit (§ 47a ThürSchulO)'
    ],
    exams: [
      'Zentrale landesweite schriftliche Prüfungen: Deutsch, Mathematik, 1. Fremdsprache (Englisch) nach § 67 ThürSchulO',
      'Mündliche Prüfung in mindestens einem naturwissenschaftlichen oder gesellschaftswissenschaftlichen Fach',
      'Projektarbeit in Kleingruppen mit schriftlicher Ausarbeitung, Arbeitsergebnis und Kolloquiumspräsentation (§ 47a ThürSchulO)'
    ],
    nextSteps: [
      'Hochwertige duale Ausbildung in Industrie, IT, Verwaltung, Handwerk oder Pflege',
      'Übergang an eine Fachoberschule (FOS, 2 Jahre bis zur Fachhochschulreife)',
      'Übergang an ein Berufliches Gymnasium (3 Jahre bis zur Allgemeinen Hochschulreife / Abitur)'
    ]
  },
  {
    id: 'weiterfuehrend',
    title: 'Wechsel zum Abitur / FOS',
    grade: 'Nach Klasse 10',
    target: 'Fachhochschulreife oder Allgemeine Hochschulreife',
    badge: 'Studienqualifikation',
    color: '#8B5CF6',
    legalReference: '§ 68 ThürSchulO & ThürSchG',
    description: 'Mit einem qualifizierten Realschulabschluss der Heimbürgeschule stehen alle Wege zur Fachhochschul- und Hochschulreife im Thüringer Bildungssystem offen.',
    requirements: [
      'Realschulabschluss mit Notendurchschnitt von in der Regel 2,5 oder besser in den Kernfächern Deutsch, Mathematik, Englisch (§ 68 ThürSchulO)',
      'Befürwortende Bildungsempfehlung der Klassenkonferenz',
      'Fristgerechte Anmeldung an der weiterführenden Schule (meist bis zum 1. März)'
    ],
    exams: [
      'Fachoberschule (FOS, 2 Jahre): Landesweite Fachabitur-Prüfungen',
      'Berufliches Gymnasium (3 Jahre): Zentrales Thüringer Landesabitur'
    ],
    nextSteps: [
      'Studium an allen Universitäten und Fachhochschulen in Deutschland',
      'Duales Studium mit renommierten Praxisunternehmen der Region'
    ]
  }
];

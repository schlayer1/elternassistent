import { CareerPath } from '../types/school';

export const CAREER_PATHS: CareerPath[] = [
  {
    id: 'hauptschule',
    title: 'Hauptschulabschluss',
    grade: 'Klasse 9',
    target: 'Direkter Einstieg in eine betriebliche Ausbildung',
    badge: 'Klasse 9 Basis',
    color: '#00A896',
    description: 'Wird nach erfolgreichem Abschluss der 9. Klasse automatisch erworben, sofern die Versetzungsbedingungen erfüllt sind.',
    requirements: [
      'Erfolgreicher Besuch der Klassenstufe 9',
      'Versetzungsbestimmungen der Thüringer Regelschulordnung erfüllt (keine unzulässigen Fünfen/Sechsen)',
      'Teilnahme an allen Pflichtfächern'
    ],
    exams: [
      'Keine zusätzlichen zentralen Abschlussprüfungen erforderlich',
      'Versetzung erfolgt auf Basis der Jahresnoten'
    ],
    nextSteps: [
      'Betriebliche duale Berufsausbildung',
      'Einjähriges Berufsvorbereitungsjahr (BVJ)',
      'Freiwilliges 10. Schuljahr zum Nachholen des Realschulabschlusses (bei geeignetem Notendurchschnitt)'
    ]
  },
  {
    id: 'qualifizierend',
    title: 'Qualifizierender Hauptschulabschluss',
    grade: 'Klasse 9 + BLF',
    target: 'Erhöhte Ausbildungs-Chancen & 10. Klasse',
    badge: 'Klasse 9 Plus',
    color: '#E67E22',
    description: 'Für Schüler:innen der 9. Klasse, die ihre Chancen bei Bewerbungen verbessern oder die Berechtigung für die 10. Klasse sichern möchten.',
    requirements: [
      'Freiwillige Meldung zur Besonderen Leistungsfeststellung (BLF) im 1. Halbjahr der Klasse 9',
      'Erreichen des vorgegebenen Notendurchschnitts in den Prüfungen'
    ],
    exams: [
      'Schriftliche Prüfungen in Deutsch und Mathematik',
      'Prüfung in Englisch oder Biologie / Physik / Chemie'
    ],
    nextSteps: [
      'Gezielte Bewerbung für anspruchsvolle handwerkliche und kaufmännische Ausbildungen',
      'Erleichterter Übergang in die 10. Klasse zur Erlangung des Realschulabschlusses'
    ]
  },
  {
    id: 'realschule',
    title: 'Realschulabschluss (Mittlere Reife)',
    grade: 'Klasse 10 Prüfungen',
    target: 'Volle Ausbildungsreife & Übergang Gymnasiale Oberstufe',
    badge: 'Klasse 10 Standard',
    color: '#0B7BA7',
    description: 'Der reguläre, bundesweit anerkannte Abschluss der Staatlichen Regelschule nach erfolgreicher 10. Klasse und bestandener Abschlussprüfung.',
    requirements: [
      'Versetzung in die Klassenstufe 10',
      'Erfüllung der Kurseinstufungen (mindestens 2 Erweiterungskurse in den Kernfächern)',
      'Zulassung zu den Abschlussprüfungen'
    ],
    exams: [
      'Zentrale schriftliche Prüfungen: Deutsch, Mathematik, 1. Fremdsprache (Englisch)',
      'Mündliche Prüfung in mindestens einem naturwissenschaftlichen oder gesellschaftswissenschaftlichen Fach',
      'Projektarbeit mit Präsentation in Klasse 10'
    ],
    nextSteps: [
      'Hochwertige duale Berufsausbildung in Industrie, Handwerk, IT, Verwaltung oder Gesundheitswesen',
      'Übergang an eine Fachoberschule (FOS, 2 Jahre zur Fachhochschulreife)',
      'Übergang an ein Berufliches Gymnasium (3 Jahre zum Abitur)'
    ]
  },
  {
    id: 'weiterfuehrend',
    title: 'Wechsel zum Abitur / FOS',
    grade: 'Nach Klasse 10',
    target: 'Fachhochschulreife oder Allgemeine Hochschulreife',
    badge: 'Studienqualifikation',
    color: '#8B5CF6',
    description: 'Mit einem guten Realschulabschluss der Heimbürgeschule stehen alle Türen zur Hochschulreife in Thüringen offen.',
    requirements: [
      'Realschulabschluss mit Notendurchschnitt von 2,5 oder besser in den Kernfächern',
      'Positive Bildungsempfehlung der Klassenkonferenz'
    ],
    exams: [
      'Nach 2 Jahren an der FOS: Fachabitur-Prüfungen',
      'Nach 3 Jahren am Beruflichen Gymnasium: Zentrales Abitur Thüringen'
    ],
    nextSteps: [
      'Studium an Universitäten und Fachhochschulen in ganz Deutschland',
      'Duales Studium mit Praxisunternehmen'
    ]
  }
];

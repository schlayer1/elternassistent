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
    description: 'Wird am Ende der Klassenstufe 9 der Thüringer Regelschule erworben. Ein gesondertes Prüfungsverfahren ist gesetzlich nicht erforderlich – der Abschluss wird bei erfolgreicher Erfüllung der Versetzungsbestimmungen zuerkannt.',
    requirements: [
      'Erfolgreicher Besuch der Klassenstufe 9 der Regelschule (§ 62 ThürSchulO)',
      'Erfüllung der allgemeinen und schulartspezifischen Versetzungsbestimmungen (§ 51 und § 52 ThürSchulO)',
      'Keine Note 6 und höchstens eine unentschuldigte bzw. nicht ausgleichbare Note 5',
      'Teilnahme an allen Pflichtfächern der Stundentafel'
    ],
    exams: [
      'Keine gesonderte Abschlussprüfung erforderlich (§ 62 ThürSchulO)',
      'Der Abschluss wird auf Basis der Jahresnoten des Zeugnisses Klasse 9 zuerkannt'
    ],
    nextSteps: [
      'Duale betriebliche Berufsausbildung im Handwerk, Industrie oder Dienstleistung',
      'Einjähriges Berufsvorbereitungsjahr (BVJ)',
      'Freiwilliges 10. Schuljahr zum nachträglichen Erwerb des Realschulabschlusses bei entsprechendem Leistungsbild (§ 53 ThürSchulO)'
    ]
  },
  {
    id: 'qualifizierend',
    title: 'Qualifizierender Hauptschulabschluss',
    grade: 'Klasse 9 + Prüfung',
    target: 'Erhöhte Ausbildungs-Chancen & Zugang zu Klasse 10',
    badge: 'Klasse 9 Plus',
    color: '#E67E22',
    legalReference: '§ 63 ThürSchulO',
    description: 'Für Schüler:innen der 9. Klasse, die ihre Bewerbungschancen verbessern oder bei knappem Notenbild die Berechtigung zur Aufnahme in die Klassenstufe 10 der Regelschule sichern möchten. (Wichtiger Hinweis: Es handelt sich um eine freiwillige Prüfung nach § 63 ThürSchulO – die sogenannte „BLF“ gibt es in Thüringen nur am Gymnasium!)',
    requirements: [
      'Freiwillige Meldung zur Prüfung zum Erwerb des qualifizierenden Hauptschulabschlusses im 1. Schulhalbjahr der Klasse 9 (§ 63 Abs. 1 ThürSchulO)',
      'Erreichen eines Gesamtergebnisses mit einem Notendurchschnitt von 3,50 oder besser über die Prüfungsfächer',
      'Keine Note schlechter als „ausreichend“ (Note 4) in den relevanten Prüfungsbestandteilen',
      'Erfüllung der Versetzungsanforderungen der Klasse 9'
    ],
    exams: [
      'Schriftliche Prüfung im Fach Deutsch (§ 63 Abs. 2 ThürSchulO)',
      'Schriftliche Prüfung im Fach Mathematik (§ 63 Abs. 2 ThürSchulO)',
      'Praktische Prüfung im Fach Wirtschaft-Recht-Technik (WRT) oder im gewählten Wahlpflichtfach (§ 63 Abs. 2 ThürSchulO)',
      'Mündliche Prüfung in einem weiteren Fach nach Wahl des Prüflings (§ 63 Abs. 2 ThürSchulO)'
    ],
    nextSteps: [
      'Bevorzugte Ausbildungsplatzvergabe in kaufmännischen, technischen und handwerklichen Ausbildungsberufen',
      'Berechtigung zur Aufnahme in die Klassenstufe 10 der Regelschule zum Erwerb des Realschulabschlusses (§ 53 ThürSchulO)'
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
    description: 'Der reguläre, bundesweit anerkannte Abschluss der Thüringer Regelschule nach erfolgreichem Besuch der 10. Klasse und bestandener zentraler Realschulabschlussprüfung.',
    requirements: [
      'Versetzung und Aufnahme in die Klassenstufe 10 der Regelschule (§ 53 ThürSchulO)',
      'Erfüllung der Leistungsdifferenzierung nach § 45 Abs. 2 und § 54 ThürSchulO (erforderliche Kurseinstufung auf Kurs-II-Niveau / Realschulanspruchsebene)',
      'Zulassung zu den Realschulabschlussprüfungen',
      'Erfolgreiche Erstellung, Abgabe und Kolloquiumspräsentation der Projektarbeit (§ 47a ThürSchulO)'
    ],
    exams: [
      'Zentrale landesweite schriftliche Prüfungen: Deutsch, Mathematik, erste Fremdsprache (Englisch) nach § 67 ThürSchulO',
      'Mündliche Prüfung in mindestens einem naturwissenschaftlichen oder gesellschaftswissenschaftlichen Fach',
      'Projektarbeit in Kleingruppen (3–5 Personen) mit schriftlichem PA-Tagebuch, praktischem Produkt und Kolloquiumspräsentation (§ 47a ThürSchulO)'
    ],
    nextSteps: [
      'Hochwertige duale Ausbildung in Industrie, IT, Verwaltung, Handwerk oder Pflege',
      'Übergang an eine Fachoberschule (FOS, 2 Jahre bis zur Fachhochschulreife nach § 68 ThürSchulO)',
      'Übergang an ein Berufliches Gymnasium (3 Jahre bis zur Allgemeinen Hochschulreife / Vollabitur nach § 68 ThürSchulO)'
    ]
  },
  {
    id: 'weiterfuehrend',
    title: 'Wechsel zum Abitur / FOS',
    grade: 'Nach Klasse 10',
    target: 'Fachhochschulreife oder Allgemeine Hochschulreife',
    badge: 'Studienqualifikation',
    color: '#8B5CF6',
    legalReference: '§ 68 ThürSchulO & § 14 ThürSchG',
    description: 'Mit einem qualifizierten Realschulabschluss der Heimbürgeschule stehen alle Bildungswege zur Fachhochschul- und Hochschulreife im Thüringer Schulsystem offen.',
    requirements: [
      'Realschulabschluss mit einem Notendurchschnitt von in der Regel 2,5 oder besser in den Kernfächern Deutsch, Mathematik, Englisch (§ 68 ThürSchulO)',
      'Befürwortende Bildungsempfehlung der Klassenkonferenz',
      'Fristgerechte Anmeldung an der weiterführenden Schule (in der Regel bis zum 1. März des Abschlussjahres)'
    ],
    exams: [
      'Fachoberschule (FOS, 2 Jahre): Landesweite Fachabitur-Prüfungen zur Fachhochschulreife',
      'Berufliches Gymnasium (3 Jahre): Zentrales Thüringer Landesabitur zur Allgemeinen Hochschulreife'
    ],
    nextSteps: [
      'Studium an allen Universitäten und Fachhochschulen in Deutschland',
      'Duales Studium in Partnerschaft mit Unternehmen der Region'
    ]
  }
];

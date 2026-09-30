import { ChecklistGroup } from '../types/school';

export const DEFAULT_CHECKLISTS: ChecklistGroup[] = [
  {
    id: 'einschulung-5',
    title: 'Start in Klasse 5: Bereit für die Heimbürgeschule?',
    subtitle: 'Wichtige Vorbereitungen für die neuen 5.-Klässler vor Schuljahresbeginn.',
    iconName: 'Sparkles',
    items: [
      {
        id: 'c1_1',
        text: 'Schulbuchzettel ausgefüllt & fristgerecht abgegeben',
        detail: 'Entweder über den Schulträger zur Leihe angemeldet oder privat bestellt.',
        completed: false
      },
      {
        id: 'c1_2',
        text: 'Mittagessen beim Diakoniewerk Apolda online registriert',
        detail: 'Über bestellung-diakonie-apolda.de registrieren und Startguthaben überweisen.',
        completed: false
      },
      {
        id: 'c1_3',
        text: 'Schließfach bei AstraDirect beantragt (optional, aber empfohlen)',
        detail: 'Schont den Rücken und bewahrt schwere Bücher sicher im Schulhaus auf.',
        completed: false
      },
      {
        id: 'c1_4',
        text: 'Busfahrkarte / Schülerbeförderung geprüft',
        detail: 'Schulbusse halten direkt am Vorplatz der Heimbürgeschule.',
        completed: false
      },
      {
        id: 'c1_5',
        text: 'Grundmaterialien & Federmappe gepackt',
        detail: 'Stifte, Lineal, Schere, Klebestift. Fachhefte werden mit Klassenleitung besprochen.',
        completed: false
      },
      {
        id: 'c1_6',
        text: 'Sportbeutel & Schwimmsachen für die Kennenlernwoche bereitgelegt',
        detail: 'Freibadbesuch in Kahla zur Schwimmüberprüfung in der 1. Woche.',
        completed: false
      },
      {
        id: 'c1_7',
        text: 'Material- & Werkgeld bereitgelegt (ca. 10 €)',
        detail: 'Wird in der ersten Schulwoche von der Klassenleitung eingesammelt.',
        completed: false
      },
      {
        id: 'c1_8',
        text: 'EduPage Zugangsdaten in der ersten Woche aktiviert',
        detail: 'Erhalten Sie als Elternbrief. App auf dem Smartphone installieren.',
        completed: false
      }
    ]
  },
  {
    id: 'krankmeldung-ablauf',
    title: 'Kind krank: Leitfaden für Eltern',
    subtitle: 'Schnell und ordnungsgemäß Fehlzeiten melden, damit alles reibungslos läuft.',
    iconName: 'ShieldAlert',
    items: [
      {
        id: 'c2_1',
        text: 'Schule vor 07:45 Uhr benachrichtigen',
        detail: 'Am besten direkt per EduPage App oder telefonisch unter 036424 / 22 400.',
        completed: false
      },
      {
        id: 'c2_2',
        text: 'Schulessen beim Diakoniewerk Apolda abbestellen',
        detail: 'Bis zur morgendlichen Frist im Online-Portal stornieren, damit keine Kosten anfallen.',
        completed: false
      },
      {
        id: 'c2_3',
        text: 'Hausaufgaben & Tagesstoff erfragen',
        detail: 'In EduPage nachsehen oder Kontakt zu Mitschülern / Klassenleitung aufnehmen.',
        completed: false
      },
      {
        id: 'c2_4',
        text: 'Schriftliche Entschuldigung ab dem 3. Fehltag abgeben',
        detail: 'Vordruck oder formloses Schreiben mit Unterschrift der Eltern beim Klassenlehrer.',
        completed: false
      },
      {
        id: 'c2_5',
        text: 'Ärztliches Attest bei Prüfungen / Leistungsnachweisen vorlegen',
        detail: 'Insbesondere in Klasse 9 und 10 bei angekündigten Klassenarbeiten erforderlich.',
        completed: false
      }
    ]
  },
  {
    id: 'tip-check',
    title: 'Praxistag-Check (Klasse 8 & 9 TiP)',
    subtitle: 'Vorbereitung für den wöchentlichen Einsatz im Ausbildungsbetrieb.',
    iconName: 'Briefcase',
    items: [
      {
        id: 'c3_1',
        text: 'Praktikumsvertrag ausgefüllt & von Betrieb und Eltern unterschrieben',
        detail: 'Rechtzeitig vor Beginn des Praxisdurchgangs beim TiP-Koordinator abgeben.',
        completed: false
      },
      {
        id: 'c3_2',
        text: 'Arbeitskleidung & Sicherheitsausrüstung (PSA) bereit',
        detail: 'Je nach Betrieb z. B. Sicherheitsschuhe S3 oder passende Arbeitskleidung.',
        completed: false
      },
      {
        id: 'c3_3',
        text: 'Fahrtweg zum Betrieb geplant',
        detail: 'Bus- oder Bahnverbindung prüfen, damit pünktlicher Arbeitsbeginn gewährleistet ist.',
        completed: false
      },
      {
        id: 'c3_4',
        text: 'Digitalen Reflexionsbogen ausgefüllt',
        detail: 'Immer nach dem Praxistag die Erfahrungen und Tätigkeiten online festhalten.',
        completed: false
      }
    ]
  }
];

import { CANDIDATE_FLASH_MODELS, getActiveApiKey } from '../config/geminiConfig';
import { SCHOOL_KNOWLEDGE_BASE } from '../data/schoolKnowledge';
import { ActionCardData } from '../types/assistant';
import { liveSyncService } from './liveSyncService';

let cachedWorkingModel = CANDIDATE_FLASH_MODELS[0];

export interface GeminiResponse {
  text: string;
  modelUsed: string;
  suggestions: string[];
  actionCard?: ActionCardData;
}

export const executeGeminiCascade = async (
  prompt: string,
  language: string = 'de',
  chatHistory: { role: 'user' | 'model'; text: string }[] = []
): Promise<GeminiResponse> => {
  const activeKey = getActiveApiKey();
  if (!activeKey) {
    throw new Error('Kein gültiger Google Gemini API-Schlüssel gefunden. Bitte hinterlegen Sie einen Schlüssel.');
  }

  // Live-Wissensdaten aus Google Docs abrufen (falls konfiguriert)
  let liveKnowledgeSection = '';
  try {
    const liveDoc = await liveSyncService.fetchLiveKnowledge();
    if (liveDoc.rawText) {
      liveKnowledgeSection = `
## 0. TAGESAKTUELLE LIVE-MITTEILUNGEN & SCHUL-UPDATES (Stand: ${liveDoc.lastUpdated})
Folgende tagesaktuelle Mitteilungen und Notizen wurden soeben live von der Schule hinterlegt:
${liveDoc.rawText}

WICHTIGER HINWEIS ZUR PRIORITÄT:
Falls Angaben in diesen tagesaktuellen Live-Mitteilungen (z. B. Klassenleitungen, Termine, kurzfristige Ausfälle) von der allgemeinen Wissensbasis abweichen, haben IMMER DIESE LIVE-ANGABEN VORRANG!
`;
    }
  } catch (e) {
    console.warn('Live knowledge sync skip:', e);
  }

  const systemInstruction = `
Du bist der offizielle, hochkompetente und herzliche Digitale Schul- und Elternassistent der Staatlichen Regelschule „Johann Wilhelm Heimbürge“ Kahla (HBS).
Dein Ziel ist es, Eltern, Schüler:innen und interessierten Familien wertschätzend, verständlich, barrierefrei und präzise Auskunft zu geben.
${liveKnowledgeSection}

Nutze für alle Antworten die folgende verifizierte Wissensbasis der Heimbürgeschule:
${SCHOOL_KNOWLEDGE_BASE}

Wichtige Verhaltens- und Usability-Regeln:
1. Grundhaltung: Sei stets freundlich, ermutigend, empathisch, lösungsorientiert und absolut faktengetreu.
2. Ansprechpartner & Fakten: Wenn nach Kontakten, Zeiten, Krankmeldungen, Schulanmeldungen, TiP, Verfassungsviertelstunde (Hr. Illesy & Fr. Thum), ZDF Partnerschule oder Thüringer Schulrecht gefragt wird, nenne die konkreten Namen, Telefonnummern, Paragraphen und Abläufe aus der Wissensbasis.
3. Klare Formatierung: Formatiere deine Antworten übersichtlich mit kurzen Absätzen, Aufzählungspunkten und Fettungen für Kernbegriffe, sodass sie auch auf Smartphones leicht lesbar sind.
4. Passgenaue & 100% beantwortbare Anschlussfragen:
   Schließe deine Antwort IMMER mit 2 bis 3 passenden, kurzen Folgefragen ab.
   STRIKTE USABILITY-REGELN FÜR FOLGEFRAGEN:
   - Die Fragen müssen STRENG THEMATISCH an das aktuelle Anliegen anknüpfen (z. B. bei Fragen zu AGs nur Fragen zu AGs, Zeiten oder Kosten; bei Fragen zu Abschlüssen nur Fragen zu Prüfungen, FOS oder Ausgleich).
   - Schlage AUSSCHLIESSLICH Fragen vor, die in unserer Wissensbasis oder den Live-Notizen VOLLSTÄNDIG und zweifelsfrei beantwortet werden können! Schlage NIEMALS Fragen vor, bei denen du spekulieren müsstest.
   - Formatiere jede dieser Folgefragen in einer eigenen Zeile am Ende der Nachricht genau im Format:
     >>> VORSCHLAG: Hier steht die konkrete Folgefrage?

5. Sekretariats-Fallback bei individuellen Sonderfragen:
   Falls eine Frage ein persönliches Schülerschicksal, Einzelfallprüfungen, offizielle Beurlaubungsanträge vor Ferien oder ungespeicherte Daten betrifft, verweise sofort verlässlich auf unsere Sekretärin:
   Frau Wittmann – Telefon: 036424 / 22 400 | E-Mail: rs.kahla@sv.lrashk.de (Zimmer 102, Mo–Fr 07:15–14:30 Uhr).

6. Aktionskarten:
   Falls die Anfrage eine konkrete Handlung betrifft (z. B. Krankmeldung, Essensanmeldung bei Diakonie Apolda, Schließfachbuchung bei AstraDirect, TiP-Kontakt oder Anruf im Sekretariat), kannst du zusätzlich eine Aktionskarte am Ende einfügen im Format:
   >>> AKTION: {"title":"Krankmeldung melden","category":"Sofort-Aktion","summary":"Melden Sie Ihr Kind vor 07:45 Uhr ab.","contactRole":"Sekretariat Frau Wittmann","contactPhone":"036424 / 22 400","url":"https://regelschule-kahla.edupage.org"}

7. Termine & Fristen:
   Beantworte Fragen zu Anmeldungen stets anhand der allgemeinen Abläufe (Anmeldebogen, optionales Aufnahmegespräch, Schnuppertage, unterjähriger Schulwechsel jederzeit unbürokratisch möglich). Ignoriere historische, in der Vergangenheit liegende Einzeldaten für frühere Schuljahre.

8. Sprachregelung:
   Antworte in der vom Nutzer gewählten Zielsprache (Sprachcode: ${language}). Bei Deutsch antworte auf Deutsch. Bei anderen Sprachen (z. B. Ukrainisch uk, Russisch ru, Arabisch ar, Englisch en) übersetze freundlich und verständlich, behalte Eigennamen („Heimbürgeschule“, „Diakoniewerk Apolda“, „Frau Wittmann“, „Frau Herold“) jedoch im Original bei.
`;

  // Start with the cached working model, followed by the rest
  const candidateModels = [
    cachedWorkingModel,
    ...CANDIDATE_FLASH_MODELS.filter((m) => m !== cachedWorkingModel)
  ];

  let lastError: Error | null = null;

  // Build message history
  const contents = [
    ...chatHistory.slice(-6).map((msg) => ({
      role: msg.role === 'model' ? ('model' as const) : ('user' as const),
      parts: [{ text: msg.text }]
    })),
    {
      role: 'user' as const,
      parts: [{ text: prompt }]
    }
  ];

  for (const model of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          contents,
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 2048,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText && candidateText.trim().length > 0) {
          cachedWorkingModel = model;

          // Parse suggestions and action cards
          const suggestions: string[] = [];
          let actionCard: ActionCardData | undefined = undefined;
          let cleanedText = candidateText;

          // Extract >>> VORSCHLAG: ...
          const suggestionRegex = />>>\s*VORSCHLAG:\s*(.+)$/gim;
          let match: RegExpExecArray | null;
          while ((match = suggestionRegex.exec(candidateText)) !== null) {
            if (match[1] && match[1].trim()) {
              suggestions.push(match[1].trim());
            }
          }
          cleanedText = cleanedText.replace(/>>>\s*VORSCHLAG:\s*.+$/gim, '').trim();

          // Extract >>> AKTION: { ... }
          const actionRegex = />>>\s*AKTION:\s*(\{.*\})/im;
          const actionMatch = cleanedText.match(actionRegex);
          if (actionMatch && actionMatch[1]) {
            try {
              const parsed = JSON.parse(actionMatch[1]);
              actionCard = {
                title: parsed.title || 'Aktion',
                category: parsed.category || 'Information',
                summary: parsed.summary || '',
                contact: parsed.contactRole ? {
                  name: parsed.contactName || '',
                  role: parsed.contactRole,
                  phone: parsed.contactPhone,
                  email: parsed.contactEmail
                } : undefined,
                link: parsed.url ? {
                  label: parsed.urlLabel || 'Zur Website',
                  url: parsed.url
                } : undefined
              };
            } catch (e) {
              console.warn('ActionCard JSON parse error:', e);
            }
            cleanedText = cleanedText.replace(actionRegex, '').trim();
          }

          // Fallback suggestions if none were generated
          if (suggestions.length === 0) {
            suggestions.push(
              'Gibt es weitere Fragen dazu?',
              'An wen kann ich mich an der Schule wenden?'
            );
          }

          return {
            text: cleanedText,
            modelUsed: model,
            suggestions: suggestions.slice(0, 3),
            actionCard
          };
        }
      }

      console.warn(`Modell ${model} antwortete mit Status ${response.status}. Schalte um...`);
    } catch (err: any) {
      console.warn(`Fehler bei Modell ${model}:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('Leider konnte keine Verbindung zum KI-Dienst hergestellt werden. Bitte versuchen Sie es in wenigen Sekunden erneut.');
};

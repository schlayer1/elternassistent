import { CANDIDATE_FLASH_MODELS, getActiveApiKey } from '../config/geminiConfig';
import { SCHOOL_KNOWLEDGE_BASE } from '../data/schoolKnowledge';
import { ActionCardData } from '../types/assistant';

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

  const systemInstruction = `
Du bist der offizielle, hochkompetente und herzliche Digitale Schul- und Elternassistent der Staatlichen Regelschule „Johann Wilhelm Heimbürge“ Kahla (HBS).
Dein Ziel ist es, Eltern, Schüler:innen und interessierten Familien wertschätzend, verständlich, barrierefrei und präzise Auskunft zu geben.

Nutze für alle Antworten die folgende verifizierte Wissensbasis der Heimbürgeschule:
${SCHOOL_KNOWLEDGE_BASE}

Wichtige Verhaltensregeln:
1. Sei stets freundlich, ermutigend, empathisch und lösungsorientiert.
2. Wenn nach Kontakten, Zeiten, Krankmeldungen, Schulanmeldung Klasse 5, TiP oder Essen gefragt wird, nenne die konkreten Ansprechpartner, Nummern, Links und Abläufe aus der Wissensbasis.
3. Formatiere deine Antwort übersichtlich mit Absätzen, Aufzählungspunkten und Fettungen für wichtige Begriffe. Halte Antworten auf Mobilgeräten gut lesbar.
4. Schließe deine Antwort IMMER mit 2 bis 3 passenden, kurzen Folgefragen ab, die für Eltern an dieser Stelle naheliegend sind.
Formatiere jede dieser Folgefragen in einer eigenen Zeile am Ende der Nachricht genau in diesem Format:
>>> VORSCHLAG: Hier steht die Frage?

5. Falls die Anfrage eine konkrete Handlung betrifft (z. B. Krankmeldung, Essensanmeldung, Schließfach, TiP-Vertrag, Kontakt zum Sekretariat), kannst du zusätzlich eine Aktionskarte am Ende einfügen im Format:
>>> AKTION: {"title":"Krankmeldung melden","category":"Sofort-Aktion","summary":"Melden Sie Ihr Kind vor 07:45 Uhr ab.","contactRole":"Sekretariat","contactPhone":"036424 / 22 400","url":"https://regelschule-kahla.edupage.org"}

6. Sprachregelung: Antworte in der vom Nutzer gewählten Zielsprache (Sprachcode: ${language}). Wenn die Sprache Deutsch ist, antworte auf Deutsch. Wenn Englisch, Ukrainisch (uk), Russisch (ru) oder Arabisch (ar) gewählt ist, übersetze deine Erklärung freundlich und verständlich in diese Sprache, behalte Eigennamen wie „Heimbürgeschule“, „Diakoniewerk Apolda“ oder Adressen jedoch im Original bei.
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

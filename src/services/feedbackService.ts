import { UnansweredQuestion, FeedbackLogPayload, FeedbackReason } from '../types/feedback';

const STORAGE_KEY = 'hbs_unanswered_questions_log';
const WEBHOOK_URL_KEY = 'hbs_feedback_webhook_url';
export const DEFAULT_FEEDBACK_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbwsvweNLO7p71mrWDWZ0JXlNwMRwgq1O2EOSPF6sOzBERka1y0CzcwD0_Hm5wpnWrQ2/exec';

const MAX_STORED_ITEMS = 200;

export const feedbackService = {
  // Webhook-URL abrufen (1. localStorage, 2. Vercel Env, 3. Default)
  getWebhookUrl: (): string => {
    const local = localStorage.getItem(WEBHOOK_URL_KEY);
    if (local && local.trim().length > 0) {
      return local.trim();
    }
    const envUrl = (import.meta as any).env?.VITE_FEEDBACK_WEBHOOK_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
      return envUrl.trim();
    }
    return DEFAULT_FEEDBACK_WEBHOOK_URL;
  },

  // Webhook-URL speichern
  setWebhookUrl: (url: string): void => {
    if (url.trim()) {
      localStorage.setItem(WEBHOOK_URL_KEY, url.trim());
    } else {
      localStorage.removeItem(WEBHOOK_URL_KEY);
    }
  },

  // Alle lokal gespeicherten Fragen abrufen
  getAllQuestions: (): UnansweredQuestion[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      console.warn('Fehler beim Laden des Feedback-Speichers:', e);
      return [];
    }
  },

  // Einzelne Frage löschen
  deleteQuestion: (id: string): UnansweredQuestion[] => {
    const current = feedbackService.getAllQuestions();
    const updated = current.filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  // Alle Fragen leeren
  clearAllQuestions: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Status als erledigt/offen umschalten
  toggleResolved: (id: string): UnansweredQuestion[] => {
    const current = feedbackService.getAllQuestions();
    const updated = current.map((q) => (q.id === id ? { ...q, resolved: !q.resolved } : q));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  // Erkennt automatisch, ob die KI-Antwort auf eine Wissenslücke hinweist
  detectKnowledgeGap: (answerText: string): boolean => {
    if (!answerText) return false;
    const lower = answerText.toLowerCase();

    const gapPhrases = [
      'dazu liegen mir aktuell keine genauen daten vor',
      'dazu liegen mir aktuell keine daten vor',
      'dazu liegen mir keine genauen daten vor',
      'dazu liegen mir keine daten vor',
      'keine genauen daten vor',
      'keine informationen vor',
      'dazu habe ich keine informationen',
      'kann ich leider nicht beantworten',
      'liegen mir hierzu keine daten vor',
      // Fallback-Sekretariatshinweis kombiniert mit Nicht-Wissen
      'wenden sie sich direkt an unser sekretariat bei frau wittmann',
      // Englisch
      'do not have exact data',
      "don't have information",
      'no data available',
      // Rumänisch
      'nu am aceste informații',
      'nu dețin date exacte',
      // Ukrainisch / Russisch
      'у мене наразі немає',
      'у меня сейчас нет',
      // Arabisch
      'لا تتوfer لدي معلومات'
    ];

    return gapPhrases.some((phrase) => lower.includes(phrase));
  },

  // Hauptfunktion: Unbeantwortete Frage protokollieren (Lokal + Google Sheet)
  logUnansweredQuestion: async (payload: FeedbackLogPayload): Promise<UnansweredQuestion> => {
    const reasonLabel =
      payload.reason === 'user_downvote'
        ? 'Eltern-Feedback (Daumen runter)'
        : 'Automatisch erkannt (Wissenslücke)';

    const newEntry: UnansweredQuestion = {
      id: `gap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      dateIso: new Date().toLocaleDateString('de-DE'),
      language: (payload.language || 'de').toUpperCase(),
      question: payload.question.trim(),
      answerSnippet: payload.answer.slice(0, 300).trim(),
      reason: payload.reason,
      reasonLabel,
      resolved: false
    };

    // 1. Im lokalen Admin-Speicher ablegen (Duplikate innerhalb 1 Min vermeiden)
    try {
      const existing = feedbackService.getAllQuestions();
      const isDuplicate = existing.some(
        (item) =>
          item.question.toLowerCase() === newEntry.question.toLowerCase() &&
          Date.now() - Number(item.id.split('_')[1] || 0) < 60000
      );

      if (!isDuplicate) {
        const updated = [newEntry, ...existing].slice(0, MAX_STORED_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Lokaler Log-Fehler:', e);
    }

    // 2. An Google Apps Script Webhook senden (asynchron im Hintergrund)
    const webhookUrl = feedbackService.getWebhookUrl();
    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        const bodyData = {
          timestamp: `${new Date().toLocaleDateString('de-DE')} ${new Date().toLocaleTimeString('de-DE')}`,
          language: newEntry.language,
          question: newEntry.question,
          answer: newEntry.answerSnippet,
          reason: reasonLabel
        };

        // 'text/plain' verhindert CORS-Preflight-Blockaden im Browser; 'no-cors' sendet auch über Cross-Origins
        fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(bodyData)
        }).catch((err) => {
          console.warn('Webhook-Übertragung fehlgeschlagen (im Hintergrund):', err);
        });
      } catch (err) {
        console.warn('Webhook-Fehler:', err);
      }
    }

    return newEntry;
  },

  // Webhook-Verbindung aktiv prüfen
  testWebhookConnection: async (
    targetUrl?: string
  ): Promise<{ success: boolean; message: string; httpStatus?: number }> => {
    const url = (targetUrl || feedbackService.getWebhookUrl()).trim();
    if (!url || !url.startsWith('http')) {
      return { success: false, message: 'Ungültige Webhook-URL angegeben.' };
    }

    const testPayload = {
      timestamp: `${new Date().toLocaleDateString('de-DE')} ${new Date().toLocaleTimeString('de-DE')}`,
      language: 'DE',
      question: 'Verbindungstest Elternassistent (Systemprüfung)',
      answer: 'Erfolgreich empfangen. Das Logging funktioniert einwandfrei!',
      reason: 'Manueller Test'
    };

    try {
      // 1. Zuerst mit no-cors senden (so wie es der Browser produktiv tut)
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(testPayload)
      });

      return {
        success: true,
        message: '✓ Testzeile wurde an das Google Sheet übertragen! Bitte Tabelle prüfen.'
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Verbindungsfehler: ${e.message || 'Netzwerkfehler'}`
      };
    }
  },

  // Als CSV exportieren (z. B. für Excel oder manuellen Import in Google Sheets)
  exportToCsv: (): void => {
    const list = feedbackService.getAllQuestions();
    if (list.length === 0) {
      alert('Keine offenen Fragen vorhanden zum Exportieren.');
      return;
    }

    const headers = ['Datum', 'Uhrzeit', 'Sprache', 'Frage', 'KI-Antwort', 'Auslöser', 'Status'];
    const rows = list.map((item) => [
      `"${item.dateIso}"`,
      `"${item.timestamp}"`,
      `"${item.language}"`,
      `"${item.question.replace(/"/g, '""')}"`,
      `"${item.answerSnippet.replace(/"/g, '""')}"`,
      `"${item.reasonLabel}"`,
      `"${item.resolved ? 'Erledigt' : 'Offen'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `hbs_elternassistent_offene_fragen_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Vorlage zum schnellen Einfügen ins Google Doc in die Zwischenablage kopieren
  copyForGoogleDoc: (item: UnansweredQuestion): Promise<void> => {
    const text = `[THEMA: ${item.question}]\nDatum: ${item.dateIso} (${item.language})\nAntwort/Notiz der Schule hier eintragen:\n`;
    return navigator.clipboard.writeText(text);
  }
};

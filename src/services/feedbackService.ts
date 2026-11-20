import { UnansweredQuestion, FeedbackLogPayload, FeedbackReason } from '../types/feedback';

const STORAGE_KEY = 'hbs_unanswered_questions_log';
const WEBHOOK_URL_KEY = 'hbs_feedback_webhook_url';
export const DEFAULT_FEEDBACK_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbwsvweNLO7p71mrWDWZ0JXlNwMRwgq1O2EOSPF6sOzBERka1y0CzcwD0_Hm5wpnWrQ2/exec';

const MAX_STORED_ITEMS = 200;

interface WebhookResult {
  ok: boolean;
  viaProxy: boolean;
  httpStatus?: number;
  error?: string;
}

async function sendToWebhook(
  webhookUrl: string,
  payload: Record<string, string>,
  isTest: boolean = false
): Promise<WebhookResult> {
  try {
    const proxyRes = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: !isTest,
      body: JSON.stringify({ webhookUrl, payload }),
    });

    if (proxyRes.status !== 404) {
      const data = await proxyRes.json().catch(() => ({}));
      if (proxyRes.ok && data?.ok) {
        return { ok: true, viaProxy: true, httpStatus: data.httpStatus || proxyRes.status };
      }
      return {
        ok: false,
        viaProxy: true,
        httpStatus: data?.httpStatus || proxyRes.status,
        error: data?.error || `HTTP ${proxyRes.status} vom Webhook-Proxy`,
      };
    }
  } catch (err) {
    // Proxy nicht erreichbar (z. B. reines statisches Hosting) -> Fallback auf Direkt-POST
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: !isTest,
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    return { ok: true, viaProxy: false };
  } catch (err: any) {
    return {
      ok: false,
      viaProxy: false,
      error: `Verbindungsfehler: ${err?.message || 'Netzwerkfehler'}`,
    };
  }
}

export const feedbackService = {
  // Webhook-URL abrufen (1. localStorage, 2. Vercel Env, 3. Default)
  getWebhookUrl: (): string => {
    try {
      const local = localStorage.getItem(WEBHOOK_URL_KEY);
      if (local && local.trim().length > 0) {
        return local.trim();
      }
    } catch {
      // ignore storage errors
    }
    const envUrl = (import.meta as any).env?.VITE_FEEDBACK_WEBHOOK_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
      return envUrl.trim();
    }
    return DEFAULT_FEEDBACK_WEBHOOK_URL;
  },

  // Webhook-URL speichern
  setWebhookUrl: (url: string): void => {
    try {
      if (url.trim()) {
        localStorage.setItem(WEBHOOK_URL_KEY, url.trim());
      } else {
        localStorage.removeItem(WEBHOOK_URL_KEY);
      }
    } catch {
      // ignore storage errors
    }
  },

  // Alle lokal gespeicherten Fragen abrufen
  getAllQuestions: (): UnansweredQuestion[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Fehler beim Laden des Feedback-Speichers:', e);
      return [];
    }
  },

  // Einzelne Frage löschen
  deleteQuestion: (id: string): UnansweredQuestion[] => {
    const current = feedbackService.getAllQuestions();
    const updated = current.filter((q) => q.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
    return updated;
  },

  // Alle Fragen leeren
  clearAllQuestions: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  },

  // Status als erledigt/offen umschalten
  toggleResolved: (id: string): UnansweredQuestion[] => {
    const current = feedbackService.getAllQuestions();
    const updated = current.map((q) => (q.id === id ? { ...q, resolved: !q.resolved } : q));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
    return updated;
  },

  // Erkennt automatisch, ob die KI-Antwort auf eine Wissenslücke hinweist
  detectKnowledgeGap: (answerText: string): boolean => {
    if (!answerText) return false;

    // Markdown-Formatierungen (**Fett**, *Kursiv*, `Code`) entfernen, damit Phrasen nicht zerrissen werden
    const normalized = answerText
      .replace(/[*_`~#>]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

    const gapPhrases = [
      'dazu liegen mir aktuell keine genauen daten vor',
      'dazu liegen mir keine genauen daten vor',
      'dazu liegen mir keine daten vor',
      'keine genauen daten vor',
      'keine informationen vor',
      'dazu habe ich keine informationen',
      'kann ich leider nicht beantworten',
      'liegen mir hierzu keine daten vor',
      'liegen mir dazu keine informationen vor',
      'habe ich leider keine angaben',
      'habe ich leider keine auskunft',
      'in meiner wissensbasis nicht',
      'in meinen unterlagen nicht',
      'wenden sie sich direkt an unser sekretariat',
      'wenden sie sich direkt an frau wittmann',
      'wenden sie sich bitte direkt an das sekretariat',
      'wenden sie sich bitte direkt an frau wittmann',
      // Englisch
      'do not have exact data',
      "don't have exact data",
      "don't have information",
      'do not have information',
      'no exact data available',
      'no data available',
      'cannot answer this',
      // Rumänisch
      'nu am aceste informații',
      'nu am informații exacte',
      'nu dețin date exacte',
      'nu am date exacte',
      // Ukrainisch / Russisch
      'у мене наразі немає',
      'у мене немає точних даних',
      'у меня сейчас нет',
      'у меня нет точных данных',
      // Arabisch
      'لا تتوفر لدي معلومات',
      'لا توجد لدي معلومات',
      'ليس لدي معلومات دقيقة'
    ];

    if (gapPhrases.some((phrase) => normalized.includes(phrase))) {
      return true;
    }

    const gapPatterns = [
      /\b(?:keine|nicht)\s+(?:genauen|konkreten|näheren|aktuellen|weiteren|verifizierten)?\s*(?:daten|informationen|infos|angaben|auskunft|unterlagen|hinweise)\b/i,
      /\b(?:liegen|stehen)\s+(?:mir\s+)?(?:dazu|hierzu|aktuell|derzeit|leider|momentan)?\s*(?:leider\s+)?keine\b/i,
      /\b(?:kann|vermag)\s+(?:ich\s+)?(?:ihnen\s+)?(?:dazu\s+|hierzu\s+)?(?:leider\s+)?nicht\s+(?:sicher\s+|abschließend\s+|genau\s+)?beantworten\b/i,
      /\b(?:nicht\s+in\s+(?:meiner|der)\s+wissensbasis|nicht\s+hinterlegt|nicht\s+gespeichert|nicht\s+vorhanden)\b/i,
    ];

    if (gapPatterns.some((re) => re.test(normalized))) {
      return true;
    }

    // Sekretariats-Verweis (Frau Wittmann / Sekretariat) nur bei expliziter Weiterverweisung / fehlender Auskunft
    const mentionsOffice =
      normalized.includes('frau wittmann') || normalized.includes('sekretariat');
    const indicatesMissingOrReferral =
      /(?:wenden sie sich\s+(?:bitte\s+)?direkt an|einzelfall|individuelle[rn]?\s+(?:anfrage|prüfung|fall|klärung)|kann\s+ich\s+(?:dazu|hierzu|ihnen)?\s*(?:leider\s+)?nicht\s+(?:abschließend\s+)?(?:sagen|beantworten|klären)|liegen\s+(?:mir\s+)?(?:dazu|hierzu)?\s*keine)/i.test(
        normalized
      );

    return mentionsOffice && indicatesMissingOrReferral;
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

    // 2. An Google Apps Script Webhook senden (primär über /api/feedback Proxy, Fallback direct no-cors)
    const webhookUrl = feedbackService.getWebhookUrl();
    if (webhookUrl && webhookUrl.startsWith('http')) {
      const bodyData = {
        timestamp: `${new Date().toLocaleDateString('de-DE')} ${new Date().toLocaleTimeString('de-DE')}`,
        language: newEntry.language,
        question: newEntry.question,
        answer: newEntry.answerSnippet,
        reason: reasonLabel
      };

      void sendToWebhook(webhookUrl, bodyData).then((res) => {
        if (!res.ok) {
          console.warn('Webhook-Übertragung fehlgeschlagen:', res.error);
        }
      });
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

    const result = await sendToWebhook(url, testPayload, true);
    if (result.ok) {
      return {
        success: true,
        httpStatus: result.httpStatus,
        message: result.viaProxy
          ? '✓ Webhook hat mit HTTP 200 geantwortet! Testzeile & E-Mail wurden ausgelöst – bitte Tabelle und Posteingang (auch Spam) prüfen.'
          : '✓ Testzeile wurde im Direktmodus gesendet. Bitte Google-Tabelle und E-Mail-Postfach prüfen.'
      };
    }

    return {
      success: false,
      httpStatus: result.httpStatus,
      message: result.error || 'Webhook-Verbindung fehlgeschlagen.'
    };
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

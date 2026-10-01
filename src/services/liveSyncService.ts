// Live-Sync-Service für Google Docs / Sheets
// Ermöglicht der Schulleitung/Nicole, Daten tagesaktuell ohne Code-Änderung oder Vercel-Neubau einzupflegen.

const GOOGLE_DOC_STORAGE_KEY = 'hbs_live_google_doc_url';
const LIVE_DATA_CACHE_KEY = 'hbs_live_doc_cache_data';
const LIVE_DATA_CACHE_TIMESTAMP = 'hbs_live_doc_cache_time';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 Minuten Cache

export interface LiveDocData {
  rawText: string;
  urgentNotice?: string;
  lastUpdated: string;
  sourceUrl: string;
  isOnline: boolean;
}

export const liveSyncService = {
  // Gespeicherte Google Doc URL/ID abrufen
  getDocUrl: (): string => {
    return localStorage.getItem(GOOGLE_DOC_STORAGE_KEY) || '';
  },

  // Neue Google Doc URL/ID speichern
  setDocUrl: (url: string): void => {
    localStorage.setItem(GOOGLE_DOC_STORAGE_KEY, url.trim());
    localStorage.removeItem(LIVE_DATA_CACHE_TIMESTAMP); // Cache invalidieren
  },

  // Extrahiert die Dokument-ID aus einer beliebigen Google Doc URL
  extractDocId: (urlOrId: string): string => {
    const trimmed = urlOrId.trim();
    if (!trimmed) return '';
    // Format: https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit...
    const match = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return match[1];
    }
    // Falls nur die ID direkt eingegeben wurde:
    if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) {
      return trimmed;
    }
    return trimmed;
  },

  // Holt den aktuellen Text aus dem freigegebenen Google Doc
  fetchLiveKnowledge: async (forceRefresh: boolean = false): Promise<LiveDocData> => {
    const docUrl = liveSyncService.getDocUrl();
    const docId = liveSyncService.extractDocId(docUrl);

    if (!docId) {
      return {
        rawText: '',
        lastUpdated: '',
        sourceUrl: '',
        isOnline: false
      };
    }

    // Cache-Prüfung
    const cachedTime = localStorage.getItem(LIVE_DATA_CACHE_TIMESTAMP);
    const cachedData = localStorage.getItem(LIVE_DATA_CACHE_KEY);
    const now = Date.now();

    if (!forceRefresh && cachedTime && cachedData && now - Number(cachedTime) < CACHE_TTL_MS) {
      try {
        const parsed = JSON.parse(cachedData);
        return parsed;
      } catch (e) {}
    }

    // Google Docs Text-Export Endpunkt
    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;

    try {
      // Direkter Abruf (funktioniert bei öffentlich freigegebenen Google Docs)
      let text = '';
      try {
        const res = await fetch(exportUrl);
        if (res.ok) {
          text = await res.text();
        }
      } catch (corsErr) {
        // Fallback über Google Docs Viewer oder CORS-Proxy falls nötig
        try {
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(exportUrl)}`;
          const proxyRes = await fetch(proxyUrl);
          if (proxyRes.ok) {
            text = await proxyRes.text();
          }
        } catch (e) {
          console.warn('Proxy-Abruf fehlgeschlagen:', e);
        }
      }

      if (text && text.trim().length > 0) {
        // Bereinige eventuelle Steuerzeichen
        const cleanText = text.replace(/\r\n/g, '\n').trim();

        // Prüfe auf [EILMELDUNG] oder [WICHTIG]
        let urgentNotice: string | undefined = undefined;
        const urgentMatch = cleanText.match(/\[(?:EILMELDUNG|WICHTIG|ACHTUNG)\]:?\s*(.+?)(?=\n\n|\n\[|$)/i);
        if (urgentMatch && urgentMatch[1]) {
          urgentNotice = urgentMatch[1].trim();
        }

        const result: LiveDocData = {
          rawText: cleanText,
          urgentNotice,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
          sourceUrl: `https://docs.google.com/document/d/${docId}/edit`,
          isOnline: true
        };

        // Im Cache speichern
        localStorage.setItem(LIVE_DATA_CACHE_KEY, JSON.stringify(result));
        localStorage.setItem(LIVE_DATA_CACHE_TIMESTAMP, String(now));

        return result;
      }
    } catch (err) {
      console.warn('Fehler beim Abruf des Live-Google-Docs:', err);
    }

    // Falls Offline oder Fehler, nimm gecachten Stand wenn vorhanden
    if (cachedData) {
      try {
        return JSON.parse(cachedData);
      } catch (e) {}
    }

    return {
      rawText: '',
      lastUpdated: 'Offline',
      sourceUrl: docUrl,
      isOnline: false
    };
  }
};

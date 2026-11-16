/**
 * Vercel Serverless Function: /api/feedback
 * Leitet unbeantwortete Elternfragen serverseitig an den Google Apps Script Webhook weiter
 * und prüft echte HTTP-Antworten/Fehler von Apps Script (statt blindem Browser-no-cors).
 */

const REQUEST_TIMEOUT_MS = 20000;
const ALLOWED_WEBHOOK_HOSTS = new Set([
  'script.google.com',
  'script.googleusercontent.com',
]);

function isOriginAllowed(urlStr: string, requestHost: string): boolean {
  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();
    const host = parsed.host.toLowerCase();
    if (requestHost && host === requestHost.toLowerCase()) return true;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    return extraOrigins.includes(parsed.origin.toLowerCase());
  } catch {
    return false;
  }
}

function applyOriginProtection(req: any, res: any): boolean {
  const rawHost = req.headers?.['x-forwarded-host'] || req.headers?.host || '';
  const requestHost = (Array.isArray(rawHost) ? rawHost[0] : String(rawHost)).split(',')[0].trim();
  const rawOrigin = req.headers?.origin;
  const origin = Array.isArray(rawOrigin) ? rawOrigin[0] : (rawOrigin || '');
  const rawReferer = req.headers?.referer;
  const referer = Array.isArray(rawReferer) ? rawReferer[0] : (rawReferer || '');

  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Vary', 'Origin');

  if (origin && isOriginAllowed(origin, requestHost)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  if (req.method === 'OPTIONS') {
    if (origin && !isOriginAllowed(origin, requestHost)) {
      res.status(403).json({ error: 'CORS: Herkunft nicht erlaubt.' });
      return false;
    }
    res.status(200).end();
    return false;
  }

  if (origin) {
    if (!isOriginAllowed(origin, requestHost)) {
      res.status(403).json({ error: 'Zugriff verweigert: Unzulässige Herkunft (Origin).' });
      return false;
    }
    return true;
  }

  if (referer && isOriginAllowed(referer, requestHost)) {
    return true;
  }

  res.status(403).json({ error: 'Zugriff verweigert: Fehlender Origin-Header.' });
  return false;
}

function isAllowedWebhookUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === 'https:' && ALLOWED_WEBHOOK_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function detectAppsScriptError(finalUrl: string, bodyText: string): string | null {
  const lower = bodyText.toLowerCase();
  if (
    finalUrl.includes('accounts.google.com') ||
    lower.includes('accounts.google.com') ||
    lower.includes('servicelogin')
  ) {
    return 'Google Apps Script verlangt eine Anmeldung. Bitte in Apps Script unter "Bereitstellen" den Zugriff auf "Jeder" setzen.';
  }
  if (
    lower.includes('authorization is required') ||
    lower.includes('authorisierung erforderlich') ||
    lower.includes('zugriff verweigert')
  ) {
    return 'Google Apps Script hat fehlende Berechtigungen (z. B. für MailApp/GmailApp). Bitte Script im Editor einmal ausführen, Berechtigungen bestätigen und als NEUE Version bereitstellen.';
  }
  if (
    lower.includes('script function not found') ||
    lower.includes('skriptfunktion nicht gefunden')
  ) {
    return 'Im Google Apps Script fehlt die Funktion doPost(e) oder es wurde noch keine neue Bereitstellungs-Version veröffentlicht.';
  }
  if (
    lower.includes('typeerror:') ||
    lower.includes('referenceerror:') ||
    lower.includes('syntaxerror:') ||
    lower.includes('exception:') ||
    (lower.includes('<html') && lower.includes('error'))
  ) {
    const stripped = bodyText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);
    return `Apps Script Laufzeitfehler: ${stripped}`;
  }
  return null;
}

export default async function handler(req: any, res: any) {
  if (!applyOriginProtection(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST-Anfragen sind für /api/feedback zulässig.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Ungültiges JSON im Request-Body.' });
      }
    }
    body = body || {};

    const webhookUrl = String(
      body.webhookUrl || process.env.FEEDBACK_WEBHOOK_URL || process.env.VITE_FEEDBACK_WEBHOOK_URL || ''
    ).trim();
    const payload = body.payload;

    if (!webhookUrl || !isAllowedWebhookUrl(webhookUrl)) {
      return res.status(400).json({
        error: 'Ungültige Google Apps Script Webhook-URL.',
      });
    }

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Fehlende payload-Daten.' });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
        redirect: 'follow',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseText = await response.text().catch(() => '');
      const scriptError = detectAppsScriptError(response.url || '', responseText);

      if (scriptError) {
        return res.status(502).json({
          ok: false,
          error: scriptError,
          httpStatus: response.status,
        });
      }

      if (!response.ok) {
        return res.status(502).json({
          ok: false,
          error: `Google Apps Script antwortete mit HTTP ${response.status}.`,
          httpStatus: response.status,
        });
      }

      return res.status(200).json({
        ok: true,
        httpStatus: response.status,
        responseText: responseText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300),
      });
    } catch (err: any) {
      clearTimeout(timeoutId);
      const msg =
        err?.name === 'AbortError'
          ? `Zeitüberschreitung nach ${REQUEST_TIMEOUT_MS / 1000}s beim Google Webhook.`
          : err?.message || String(err);
      return res.status(502).json({ ok: false, error: msg });
    }
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Interner Serverfehler.' });
  }
}

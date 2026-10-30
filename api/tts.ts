import { EdgeTTS } from 'node-edge-tts';

const VOICE_MAP: Record<string, string> = {
  de: 'de-DE-KillianNeural',
  en: 'en-US-JennyNeural',
  uk: 'uk-UA-PolinaNeural',
  ru: 'ru-RU-SvetlanaNeural',
  ar: 'ar-SA-ZariyahNeural'
};

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const text = (req.query?.text || req.body?.text || '').toString().trim();
    const lang = (req.query?.lang || req.body?.lang || 'de').toString().toLowerCase();
    const voiceParam = (req.query?.voice || req.body?.voice || '').toString().trim();

    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    // Limit length to avoid serverless function timeouts
    const sanitizedText = text.slice(0, 2500);
    const voice = voiceParam || VOICE_MAP[lang] || VOICE_MAP['de'];

    const tts = new EdgeTTS({
      voice,
      lang: voice.slice(0, 5),
      outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
      timeout: 10000
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');

    for await (const chunk of tts.streamAudio(sanitizedText)) {
      if (Buffer.isBuffer(chunk)) {
        res.write(chunk);
      }
    }
    return res.end();
  } catch (error: any) {
    console.error('Edge TTS server error:', error);
    if (!res.headersSent) {
      return res.status(502).json({ error: 'TTS Synthesis failed', details: error?.message || String(error) });
    }
    return res.end();
  }
}

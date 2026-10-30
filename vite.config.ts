import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { EdgeTTS } from 'node-edge-tts';

function edgeTtsDevPlugin(): Plugin {
  return {
    name: 'vite-plugin-edge-tts',
    configureServer(server) {
      server.middlewares.use('/api/tts', async (req, res) => {
        const url = new URL(req.url || '', 'http://localhost:3000');
        const text = url.searchParams.get('text') || '';
        const lang = url.searchParams.get('lang') || 'de';
        const voiceParam = url.searchParams.get('voice') || '';

        if (!text) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Text parameter is required' }));
          return;
        }

        const voiceMap: Record<string, string> = {
          de: 'de-DE-KillianNeural',
          en: 'en-US-JennyNeural',
          uk: 'uk-UA-PolinaNeural',
          ru: 'ru-RU-SvetlanaNeural',
          ar: 'ar-SA-ZariyahNeural'
        };

        const voice = voiceParam || voiceMap[lang] || voiceMap['de'];

        try {
          const tts = new EdgeTTS({
            voice,
            lang: voice.slice(0, 5),
            outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
            timeout: 10000
          });

          res.setHeader('Content-Type', 'audio/mpeg');
          for await (const chunk of tts.streamAudio(text.slice(0, 2500))) {
            if (Buffer.isBuffer(chunk)) {
              res.write(chunk);
            }
          }
          res.end();
        } catch (e: any) {
          console.error('Vite dev Edge TTS error:', e);
          if (!res.headersSent) {
            res.statusCode = 502;
            res.end(JSON.stringify({ error: e?.message || 'TTS Error' }));
          } else {
            res.end();
          }
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), edgeTtsDevPlugin()],
  server: {
    port: 3000,
    open: true
  }
});

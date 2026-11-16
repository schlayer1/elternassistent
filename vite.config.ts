import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { EdgeTTS } from 'node-edge-tts';
import geminiHandler from './api/gemini';

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
          ro: 'ro-RO-AlinaNeural',
          ar: 'ar-SA-ZariyahNeural',
        };

        const voice = voiceParam || voiceMap[lang] || voiceMap['de'];

        try {
          const tts = new EdgeTTS({
            voice,
            lang: voice.slice(0, 5),
            outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
            timeout: 10000,
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
    },
  };
}

function geminiLocalProxyPlugin(): Plugin {
  const attach = (server: any) => {
    server.middlewares.use('/api/gemini', async (req: any, res: any) => {
      try {
        let rawBody = '';
        for await (const chunk of req) {
          rawBody += typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
        }
        let body: any = {};
        if (rawBody) {
          try {
            body = JSON.parse(rawBody);
          } catch {
            body = rawBody;
          }
        }
        const mockReq = { method: req.method, headers: req.headers, body };
        const mockRes = {
          setHeader: (k: string, v: string) => res.setHeader(k, v),
          status: (code: number) => {
            res.statusCode = code;
            return {
              json: (data: any) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              },
              end: () => res.end(),
            };
          },
        };
        await geminiHandler(mockReq, mockRes);
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err?.message || 'Server error' }));
      }
    });
  };

  return {
    name: 'gemini-local-proxy',
    configureServer: attach,
    configurePreviewServer: attach,
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const [k, v] of Object.entries(env)) {
    if (process.env[k] === undefined) {
      process.env[k] = v;
    }
  }

  return {
    plugins: [react(), edgeTtsDevPlugin(), geminiLocalProxyPlugin()],
    server: {
      port: 3000,
      open: true,
    },
  };
});

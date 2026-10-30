// Speech Service: Microsoft Edge TTS (Neural Voices) mit automatischem Web Speech API Fallback & Mikrofon-Spracheingabe (STT)

export class SpeechService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static currentAudio: HTMLAudioElement | null = null;
  private static recognition: any = null;
  private static isExplicitlyStopped: boolean = false;

  // Vorlesefunktion (Text-to-Speech) mit Edge TTS & Fallback
  public static speak(
    text: string,
    lang: string = 'de',
    onStart?: () => void,
    onEnd?: () => void
  ): boolean {
    this.stopSpeaking();
    this.isExplicitlyStopped = false;

    // Bereinige Markdown für flüssiges Vorlesen
    const plainText = text
      .replace(/[*#_~`>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n+/g, '. ')
      .trim();

    if (!plainText) return false;

    // 1. Primärer Pfad: Microsoft Edge Neural TTS über unseren Serverless Endpunkt
    try {
      const audioUrl = `/api/tts?text=${encodeURIComponent(plainText)}&lang=${encodeURIComponent(lang)}`;
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      let hasEnded = false;
      const safeEnd = () => {
        if (!hasEnded) {
          hasEnded = true;
          this.currentAudio = null;
          if (!this.isExplicitlyStopped) {
            onEnd?.();
          }
        }
      };

      audio.onplay = () => {
        if (!this.isExplicitlyStopped) {
          onStart?.();
        }
      };

      audio.onended = () => {
        safeEnd();
      };

      audio.onerror = (e) => {
        // Falls der Nutzer bewusst auf "Stopp" geklickt hat: NIEMALS Fallback starten!
        if (this.isExplicitlyStopped) {
          this.currentAudio = null;
          return;
        }
        console.warn('Edge TTS nicht verfügbar oder Netzwerkfehler, schalte auf Web Speech API um:', e);
        this.currentAudio = null;
        this.speakWithWebSpeech(plainText, lang, onStart, onEnd);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((playErr) => {
          // Falls bewusst gestoppt oder pausiert wurde (z.B. AbortError durch Stopp-Klick): Ignorieren!
          if (this.isExplicitlyStopped) {
            this.currentAudio = null;
            return;
          }
          console.warn('Audio Playback abgefangen, Fallback auf Web Speech API:', playErr);
          this.currentAudio = null;
          this.speakWithWebSpeech(plainText, lang, onStart, onEnd);
        });
      }

      return true;
    } catch (err) {
      if (this.isExplicitlyStopped) return false;
      console.warn('Edge TTS Aufruf fehlgeschlagen, nutze Web Speech API Fallback:', err);
      return this.speakWithWebSpeech(plainText, lang, onStart, onEnd);
    }
  }

  // Fallback: Lokale Browser-Sprachausgabe (Web Speech API)
  private static speakWithWebSpeech(
    plainText: string,
    lang: string = 'de',
    onStart?: () => void,
    onEnd?: () => void
  ): boolean {
    if (this.isExplicitlyStopped || !this.synth) {
      onEnd?.();
      return false;
    }

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Sprache zuordnen
    const langMap: Record<string, string> = {
      de: 'de-DE',
      en: 'en-US',
      uk: 'uk-UA',
      ru: 'ru-RU',
      ar: 'ar-SA'
    };
    utterance.lang = langMap[lang] || 'de-DE';

    // Beste passende Stimme suchen
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      if (!this.isExplicitlyStopped) {
        onStart?.();
      }
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (!this.isExplicitlyStopped) {
        onEnd?.();
      }
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (!this.isExplicitlyStopped) {
        console.warn('SpeechSynthesis Fehler:', e);
        onEnd?.();
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    return true;
  }

  public static stopSpeaking(): void {
    this.isExplicitlyStopped = true;

    // Laufendes Audio sicher und ohne Event-Triggers stoppen
    if (this.currentAudio) {
      const audio = this.currentAudio;
      this.currentAudio = null;

      audio.onplay = null;
      audio.onended = null;
      audio.onerror = null;
      audio.onpause = null;

      try {
        audio.pause();
        audio.currentTime = 0;
        audio.removeAttribute('src');
        audio.load();
      } catch (e) {}
    }

    // Lokale Web Speech API stoppen
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.currentUtterance = null;
  }

  public static isSpeaking(): boolean {
    const isAudioPlaying = !!(this.currentAudio && !this.currentAudio.paused && !this.currentAudio.ended);
    const isSynthSpeaking = !!(this.synth && this.synth.speaking);
    return isAudioPlaying || isSynthSpeaking;
  }

  // Spracheingabe (Speech-to-Text)
  public static isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  public static startListening(
    lang: string = 'de',
    onResult: (transcript: string) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ): boolean {
    if (!this.isSpeechRecognitionSupported()) return false;

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;

      const langMap: Record<string, string> = {
        de: 'de-DE',
        en: 'en-US',
        uk: 'uk-UA',
        ru: 'ru-RU',
        ar: 'ar-SA'
      };
      this.recognition.lang = langMap[lang] || 'de-DE';

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          onResult(finalTranscript.trim());
        }
      };

      this.recognition.onerror = (event: any) => {
        onError(event.error);
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch (e) {
      onError(e);
      return false;
    }
  }

  public static stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.recognition = null;
    }
  }
}

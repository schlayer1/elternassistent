// Speech Service: Vorlesefunktion (TTS) & Mikrofon-Spracheingabe (STT)

export class SpeechService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static recognition: any = null;

  // Vorlesefunktion (Text-to-Speech)
  public static speak(
    text: string,
    lang: string = 'de',
    onStart?: () => void,
    onEnd?: () => void
  ): boolean {
    if (!this.synth) return false;

    this.stopSpeaking();

    // Bereinige Markdown für flüssiges Vorlesen
    const plainText = text
      .replace(/[*#_~`>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n+/g, '. ')
      .trim();

    if (!plainText) return false;

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
      onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis Fehler:', e);
      this.currentUtterance = null;
      onEnd?.();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    return true;
  }

  public static stopSpeaking(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  public static isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking);
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
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();
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
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition Fehler:', event.error);
        onError(event.error);
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err) {
      console.error('Fehler beim Starten der Spracherkennung:', err);
      onError(err);
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

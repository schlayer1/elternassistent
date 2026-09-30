# Heimbürgeschule Kahla • Digitaler Eltern- & Schulassistent

Ein moderner, barrierefreier und interaktiver Assistent für Eltern, Schüler:innen und interessierte Familien der Staatlichen Regelschule „Johann Wilhelm Heimbürge“ Kahla.

---

## Highlights

- 🔓 **Zero-Login**: Sofort im Browser nutzbar – kein MagicSchool-Raum, kein Account-Zwang, 100 % DSGVO-konform.
- 🎨 **Design**: Farbschema und UI abgestimmt auf [translator-hbs.vercel.app](https://translator-hbs.vercel.app) (`#FFFBF5`, HBS-Blau, Türkis, Orange, Plus Jakarta Sans).
- ⚛️ **JARVIS Kognitions-Reaktor**: Animierter Arc-Reactor im Schullogo-Stil mit pulsierenden Energieringen und Frequenzwellen während der Bearbeitung und beim Vorlesen.
- 🎙️ **Spracheingabe & Vorlesefunktion**: Fragen per Mikrofon einsprechen (Speech-to-Text) und Antworten natürlich vorlesen lassen (Text-to-Speech).
- 🧭 **Themenwelten**: Übergang Klasse 5, Vorzeigeprojekt „Tag in der Praxis“ (TiP), Schultakt, Digitales & EduPage, Schulessen Diakoniewerk Apolda.
- 🛠️ **Eltern-Tools**: Thüringer Abschluss- & Bildungswege-Kompass, interaktive Checklisten mit Konfetti-Effekt und Schultakt-Uhr.
- 🌐 **Mehrsprachigkeit**: Unterstützt Deutsch, Englisch, Ukrainisch, Russisch und Arabisch.
- ⚡ **Schul-API-Kaskade**: Schnelle Google Gemini Flash Kaskade (`gemini-flash-lite-latest`) mit integriertem Fallback.

---

## Lokale Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktions-Build erstellen
npm run build
```

---

## Vercel Deployment

1. Repository auf [Vercel](https://vercel.com) importieren.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. (Optional) Umgebungsvariable hinzufügen: `VITE_GEMINI_API_KEY` (Standardmäßig ist der offizielle Heimbürgeschule-Schlüssel als Fallback hinterlegt).

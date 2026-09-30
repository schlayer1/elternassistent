# Design- und Stylesystem: Heimbürgeschule Elternassistent
*Basierend auf dem Farbschema und Design von https://translator-hbs.vercel.app*

## 1. Farbpalette (School / HBS Theme)

```javascript
colors: {
  school: {
    // Primärfarben (Vertrauen, Bildung, Ruhe)
    blue: '#0B7BA7',        // Hauptmarke / HBS Primärblau
    blueDark: '#085a7a',    // Hover-Zustände, Header-Highlights
    blueLight: '#e1f3fa',   // Kacheln, sanfte Badges, Hover-Flächen
    
    // Akzentfarbe 1 (Lebendigkeit, Freundlichkeit)
    teal: '#00A896',        // Erfolgsmeldungen, Sekundärbuttons, Akzente
    tealDark: '#007a6d',    // Hover für Teal
    tealLight: '#e0f7f4',   // Sanfter Hintergrund für Erfolgsboxen
    
    // Akzentfarbe 2 (Aufmerksamkeit, Herzlichkeit, Wärme)
    orange: '#E67E22',      // Wichtige Hinweise, Call-to-Actions, Termine
    orangeDark: '#c26210',  // Hover Orange
    orangeLight: '#fdf2e9', // Kärtchenhintergrund für Tipps / Notizen
    
    // Status & Hervorhebungen
    yellow: '#F59E0B',      // Warnungen, Fristen, Sterne
    
    // neutrale & Layout-Flächen
    bg: '#FFFBF5',          // Warmer, augenfreundlicher Grundton (kein steriles Weiß)
    surface: '#FFFFFF',     // Kartenoberflächen, Modals
    card: '#F8FAFC',        // Eingebettete Container
    border: '#F1E9DA',      // Sanfte Rahmenlinie passend zu #FFFBF5
    
    // Textfarben
    text: {
      primary: '#1E293B',   // Slate-800 für optimale Lesbarkeit
      secondary: '#64748B', // Slate-500 für Hilfstexte und Metadaten
      muted: '#94A3B8',     // Deaktivierte Zustände
    }
  }
}
```

## 2. Typografie
- **Schriftfamilie**: `'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`
- **Hierarchie**:
  - H1: `text-2xl md:text-3xl font-bold tracking-tight text-slate-900`
  - H2: `text-xl md:text-2xl font-semibold text-slate-800`
  - H3: `text-lg font-semibold text-slate-800`
  - Body: `text-base text-slate-700 leading-relaxed`
  - Small / Captions: `text-xs md:text-sm text-slate-500`

## 3. Schatten & Kanten
- **Border Radius**: `rounded-2xl` für Cards und Dialoge, `rounded-xl` für Buttons und Inputs, `rounded-full` für Chips/Badges.
- **Schatten**:
  - `shadow-soft`: `0 2px 12px -2px rgba(11, 123, 167, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)`
  - `shadow-float`: `0 10px 25px -5px rgba(11, 123, 167, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.05)`

## 4. UI-Grundsätze für Eltern & Interessierte
- **Keine Barrieren**: Null Login, sofortige Lauffähigkeit auf Smartphone und Tablet.
- **Visuelle Klarheit**: Kärtchen mit Piktogrammen, Schnellwahl-Chips statt leerer Textbox.
- **Fehlerverzeihend & Ermutigend**: Warmherziger Tonfall, klare Handlungsoptionen ("Wer hilft mir?", "Was muss ich tun?").

import React, { useState, useRef } from 'react';
import { SupportedLanguage } from '../../types/assistant';
import { analyzeLetterWithGemini, LetterAnalysisResult } from '../../services/geminiService';
import { SpeechService } from '../../services/speechService';
import {
  Languages,
  Upload,
  Camera,
  FileText,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Mail,
  Printer,
  Calendar,
  DollarSign,
  PenTool,
  User,
  Volume2,
  VolumeX,
  AlertCircle,
  Clock,
  Send
} from 'lucide-react';

interface MultilingualHubProps {
  currentLanguage: SupportedLanguage;
  onNavigateToChat: () => void;
}

const CLASSES_LIST = [
  { id: '5a', label: 'Klasse 5a – Herr Bastian Illesy' },
  { id: '5b', label: 'Klasse 5b – Frau Fuhrmann' },
  { id: '6a', label: 'Klasse 6a – Herr Hanke' },
  { id: '6b', label: 'Klasse 6b – Frau Rosenkranz' },
  { id: '6c', label: 'Klasse 6c – Frau Stiebritz' },
  { id: '7a', label: 'Klasse 7a – Herr Richter' },
  { id: '7b', label: 'Klasse 7b – Frau Seifert' },
  { id: '7c', label: 'Klasse 7c – Herr Göthe' },
  { id: '8a', label: 'Klasse 8a – Herr Schau' },
  { id: '8b', label: 'Klasse 8b – Frau Marie-Christin Thum' },
  { id: '8c', label: 'Klasse 8c – Herr Schmidt' },
  { id: '9a', label: 'Klasse 9a – Herr Streit' },
  { id: '9b', label: 'Klasse 9b – Frau Weiland' },
  { id: '9c', label: 'Klasse 9c – Herr Schirmer' },
  { id: '10a', label: 'Klasse 10a – Frau Schädlich' },
  { id: '10b', label: 'Klasse 10b – Frau Oehring' }
];

export const MultilingualHub: React.FC<MultilingualHubProps> = ({
  currentLanguage,
  onNavigateToChat
}) => {
  const [activeMode, setActiveMode] = useState<'translator' | 'excuse'>('translator');

  // Translator state
  const [inputTab, setInputTab] = useState<'photo' | 'text'>('photo');
  const [letterText, setLetterText] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ base64: string; mimeType: string; preview: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LetterAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isSpeakingTranslation, setIsSpeakingTranslation] = useState(false);

  // Excuse generator state
  const todayStr = new Date().toISOString().split('T')[0];
  const [childName, setChildName] = useState('');
  const [selectedClass, setSelectedClass] = useState(CLASSES_LIST[0].id);
  const [reason, setReason] = useState<'illness' | 'doctor' | 'family'>('illness');
  const [fromDate, setFromDate] = useState(todayStr);
  const [toDate, setToDate] = useState(todayStr);
  const [parentName, setParentName] = useState('');
  const [copiedState, setCopiedState] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Labels based on language
  const getUIText = () => {
    switch (currentLanguage) {
      case 'uk':
        return {
          title: 'Шкільний перекладач та помічник із листів',
          subtitle: 'Перекладайте листи від школи та створюйте пояснювальні записки німецькою мовою для пані Віттманн.',
          appLinkTitle: 'Офіційний HBS Translator для особистих розмов',
          appLinkDesc: 'Для розмов з учителями та секретаріатом у школі використовуйте наш безкоштовний онлайн-перекладач у режимі реального часу.',
          appLinkBtn: 'Відкрити Translator App',
          tabTranslator: 'Перекладач листів (фото/текст)',
          tabExcuse: 'Генератор пояснювальних записок',
          photoTab: 'Сфотографувати / завантажити фото',
          textTab: 'Вставити текст із EduPage',
          analyzeBtn: 'Перекласти та пояснити лист',
          analyzing: 'Аналізую лист та виділяю важливе...',
          todoTitle: 'Що потрібно зробити?',
          copySuccess: 'Скопійовано!',
          copyBtn: 'Копіювати для EduPage',
          emailBtn: 'Надіслати електронною поштою пані Віттманн',
          printBtn: 'Роздрукувати / зберегти як PDF'
        };
      case 'ru':
        return {
          title: 'Школьный переводчик и помощник по письмам',
          subtitle: 'Переводите школьные письма и составляйте объяснительные записки на немецком языке для госпожи Виттманн.',
          appLinkTitle: 'Официальный HBS Translator для личных бесед',
          appLinkDesc: 'Для личного общения с учителями и секретариатом в школе используйте наше приложение для голосового перевода в реальном времени.',
          appLinkBtn: 'Открыть Translator App',
          tabTranslator: 'Переводчик писем (фото/текст)',
          tabExcuse: 'Генератор объяснительных записок',
          photoTab: 'Сфотографировать / загрузить фото',
          textTab: 'Вставить текст из EduPage',
          analyzeBtn: 'Перевести и разобрать письмо',
          analyzing: 'Анализирую письмо и выделяю главное...',
          todoTitle: 'Что необходимо сделать?',
          copySuccess: 'Скопировано!',
          copyBtn: 'Копировать для EduPage',
          emailBtn: 'Отправить по почте г-же Виттманн',
          printBtn: 'Распечатать / PDF'
        };
      case 'ro':
        return {
          title: 'Traducător școlar & Generator de motivări',
          subtitle: 'Traduceți scrisorile primite de la școală și generați motivări oficiale în limba germană pentru doamna Wittmann.',
          appLinkTitle: 'Aplicația oficială HBS Translator pentru discuții la școală',
          appLinkDesc: 'Pentru discuții directe cu profesorii și secretariatul școlii, folosiți aplicația noastră de traducere vocală în timp real.',
          appLinkBtn: 'Deschide Translator App',
          tabTranslator: 'Traducător scrisori (Poză / Text)',
          tabExcuse: 'Generator de motivare absență',
          photoTab: 'Fă o poză / Încarcă poză',
          textTab: 'Lipește text din EduPage',
          analyzeBtn: 'Tradu și extrage acțiunile necesare',
          analyzing: 'Se analizează scrisoarea și cerințele...',
          todoTitle: 'Ce trebuie să faceți?',
          copySuccess: 'Copiat!',
          copyBtn: 'Copiază pentru EduPage',
          emailBtn: 'Trimite e-mail dnei Wittmann',
          printBtn: 'Tipărește / Salvează PDF'
        };
      case 'ar':
        return {
          title: 'مترجم الرسائل المدرسية ومولد الأعذار',
          subtitle: 'ترجمة الرسائل المدرسية وإنشاء إشعارات غياب رسمية بالألمانية للسيدة فيتمان.',
          appLinkTitle: 'تطبيق HBS Translator للمحادثات الشخصية في المدرسة',
          appLinkDesc: 'للتحدث المباشر مع المعلمين وسكرتارية المدرسة، استخدم تطبيقنا للترجمة الصوتية الفورية.',
          appLinkBtn: 'فتح تطبيق الترجمة',
          tabTranslator: 'ترجمة الرسائل (صورة / نص)',
          tabExcuse: 'إنشاء عذر غياب رسمي',
          photoTab: 'التقاط صورة / تحميل ملف',
          textTab: 'لصق نص من EduPage',
          analyzeBtn: 'ترجمة وتوضيح المطلوب',
          analyzing: 'جاري تحليل الرسالة وتحديد المهام...',
          todoTitle: 'ما الذي يجب عليك فعله؟',
          copySuccess: 'تم النسخ!',
          copyBtn: 'نسخ لـ EduPage',
          emailBtn: 'إرسال بريد للسيدة فيتمان',
          printBtn: 'طباعة / حفظ كـ PDF'
        };
      default:
        return {
          title: 'School Letter Translator & Absence Note Helper',
          subtitle: 'Translate official school notices and generate formal German excuse notes for Ms. Wittmann.',
          appLinkTitle: 'Official HBS Translator for In-Person School Meetings',
          appLinkDesc: 'For live spoken translation with teachers or front office staff at school, use our official voice translator web app.',
          appLinkBtn: 'Open Translator App',
          tabTranslator: 'Notice Translator (Photo / Text)',
          tabExcuse: 'Absence Note Generator',
          photoTab: 'Take photo / Upload image',
          textTab: 'Paste text from EduPage',
          analyzeBtn: 'Translate & Extract Actions',
          analyzing: 'Analyzing school letter...',
          todoTitle: 'What do you need to do?',
          copySuccess: 'Copied!',
          copyBtn: 'Copy for EduPage',
          emailBtn: 'Email to Ms. Wittmann',
          printBtn: 'Print / Save as PDF'
        };
    }
  };

  const ui = getUIText();

  // Handle image upload / camera
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Bitte wählen Sie eine Bilddatei (JPG, PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      const base64Data = resultStr.split(',')[1];
      setSelectedImage({
        base64: base64Data,
        mimeType: file.type,
        preview: resultStr
      });
      setAnalysisResult(null);
      setAnalysisError(null);
    };
    reader.readAsDataURL(file);
  };

  // Run analysis via Gemini
  const handleAnalyzeLetter = async () => {
    if (!selectedImage && !letterText.trim()) {
      setAnalysisError('Bitte laden Sie ein Foto hoch oder fügen Sie den Text des Briefes ein.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const res = await analyzeLetterWithGemini({
        fileBase64: selectedImage?.base64,
        mimeType: selectedImage?.mimeType,
        rawText: letterText.trim(),
        targetLanguage: currentLanguage
      });
      setAnalysisResult(res);
    } catch (err: any) {
      setAnalysisError(err?.message || 'Fehler bei der Übersetzung des Briefes.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle voice playback of translation
  const handleToggleSpeakTranslation = () => {
    if (!analysisResult) return;

    if (isSpeakingTranslation) {
      SpeechService.stopSpeaking();
      setIsSpeakingTranslation(false);
    } else {
      setIsSpeakingTranslation(true);
      const textToRead = `${analysisResult.title}. ${analysisResult.translation}. ${analysisResult.actionItems.join('. ')}`;
      SpeechService.speak(
        textToRead,
        currentLanguage,
        () => setIsSpeakingTranslation(true),
        () => setIsSpeakingTranslation(false)
      );
    }
  };

  // Build German Excuse Letter Text
  const currentClassObj = CLASSES_LIST.find((c) => c.id === selectedClass) || CLASSES_LIST[0];
  const teacherName = currentClassObj.label.split('–')[1]?.trim() || 'Klassenleitung';

  const reasonGerman =
    reason === 'illness'
      ? 'aufgrund einer akuten Erkrankung'
      : reason === 'doctor'
      ? 'aufgrund eines unaufschiebbaren Facharzttermins'
      : 'aus einem dringenden familiären Anlass';

  const dateSpanGerman =
    fromDate === toDate
      ? `am ${new Date(fromDate).toLocaleDateString('de-DE')}`
      : `im Zeitraum vom ${new Date(fromDate).toLocaleDateString('de-DE')} bis zum ${new Date(toDate).toLocaleDateString('de-DE')}`;

  const generatedGermanLetter = `Staatliche Regelschule „Johann Wilhelm Heimbürge“ Kahla
Am Langen Bürgel 19, 07768 Kahla
Sekretariat: Frau Wittmann | Klassenleitung: ${teacherName}

Krankmeldung / Entschuldigung des Schulversäumnisses

Sehr geehrte Frau Wittmann,
sehr geehrte(r) ${teacherName},

hiermit entschuldige ich das Fehlen meines Kindes ${childName.trim() || '[Vorname Nachname]'}, Schüler/in der ${currentClassObj.label.split('–')[0].trim()}, ${dateSpanGerman} ${reasonGerman}.

Sobald mein Kind wieder gesund ist, wird es den versäumten Unterrichtsstoff eigenverantwortlich bei Mitschüler:innen erfragen und nachholen.

Datum: ${new Date().toLocaleDateString('de-DE')}

Mit freundlichen Grüßen,
${parentName.trim() || '[Name des/der Erziehungsberechtigten]'}
___________________________________________
(Unterschrift der/des Erziehungsberechtigten)`;

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedGermanLetter);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2500);
  };

  // Send Email via mailto
  const handleMailto = () => {
    const subject = encodeURIComponent(`Krankmeldung: ${childName || 'Schüler'} (${currentClassObj.id})`);
    const body = encodeURIComponent(generatedGermanLetter);
    window.location.href = `mailto:rs.kahla@sv.lrashk.de?subject=${subject}&body=${body}`;
  };

  // Print Letter
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Entschuldigung - ${childName || 'Heimbürgeschule Kahla'}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { border-bottom: 2px solid #0B7BA7; padding-bottom: 15px; margin-bottom: 30px; }
            .school-name { font-size: 18px; font-weight: bold; color: #0B7BA7; }
            .meta { font-size: 12px; color: #64748b; margin-top: 5px; }
            .title { font-size: 20px; font-weight: bold; margin: 30px 0 20px 0; }
            .content { font-size: 14px; white-space: pre-line; }
            .signature { margin-top: 60px; }
            .signature-line { border-top: 1px solid #94a3b8; width: 280px; margin-top: 40px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school-name">Staatliche Regelschule „Johann Wilhelm Heimbürge“ Kahla</div>
            <div class="meta">Am Langen Bürgel 19, 07768 Kahla • Tel: 036424 / 22 400 • E-Mail: rs.kahla@sv.lrashk.de</div>
          </div>
          <div class="title">Entschuldigung des Schulversäumnisses</div>
          <div class="content">${generatedGermanLetter.replace(/Staatliche Regelschule.*\n.*\n.*\n\nKrankmeldung.*\n\n/, '')}</div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Official HBS Translator App Recommendation Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-school-blueDark to-[#064259] text-white rounded-3xl p-5 sm:p-6 shadow-float border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-teal-500/20 rounded-2xl border border-teal-400/30 text-teal-300 shrink-0">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-400/20 text-teal-200 border border-teal-400/30 uppercase tracking-wider">
                Live Vor-Ort-Gespräche
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold mt-1 text-white">
              {ui.appLinkTitle}
            </h3>
            <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-2xl leading-relaxed">
              {ui.appLinkDesc}
            </p>
          </div>
        </div>

        <a
          href="https://translator-hbs.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] bg-teal-400 hover:bg-teal-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-soft transition-all shrink-0 self-stretch sm:self-auto justify-center"
        >
          <span>{ui.appLinkBtn}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* 2. Sub-Tab Switcher: Brief-Dolmetscher vs. Entschuldigungs-Generator */}
      <div className="bg-white rounded-3xl p-6 border border-school-border shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Mehrsprachiger Elternservice</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {ui.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              {ui.subtitle}
            </p>
          </div>

          <div className="flex bg-[#FFFBF5] p-1.5 rounded-2xl border border-school-border gap-1 self-start sm:self-center">
            <button
              onClick={() => setActiveMode('translator')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold min-h-[44px] transition-all ${
                activeMode === 'translator'
                  ? 'bg-school-blue text-white shadow-soft'
                  : 'text-slate-600 hover:text-school-blue'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{ui.tabTranslator}</span>
            </button>
            <button
              onClick={() => setActiveMode('excuse')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold min-h-[44px] transition-all ${
                activeMode === 'excuse'
                  ? 'bg-school-orange text-white shadow-soft'
                  : 'text-slate-600 hover:text-school-orange'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>{ui.tabExcuse}</span>
            </button>
          </div>
        </div>

        {/* 3. MODE A: ELTERNBRIEF-DOLMETSCHER */}
        {activeMode === 'translator' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Input Method Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <button
                onClick={() => setInputTab('photo')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                  inputTab === 'photo'
                    ? 'bg-school-blueLight text-school-blueDark border border-school-blue/20'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{ui.photoTab}</span>
              </button>
              <button
                onClick={() => setInputTab('text')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                  inputTab === 'text'
                    ? 'bg-school-blueLight text-school-blueDark border border-school-blue/20'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{ui.textTab}</span>
              </button>
            </div>

            {/* Photo / Camera Upload Box */}
            {inputTab === 'photo' && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-school-blue hover:bg-school-blueLight/20 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 bg-slate-50/60"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-school-blue">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      Brief abfotografieren oder Bilddatei auswählen
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Unterstützt Smartphone-Kamera & Fotos von Zetteln aus dem Ranzen (JPG, PNG)
                    </p>
                  </div>
                </div>

                {selectedImage && (
                  <div className="p-3 bg-[#FFFBF5] rounded-2xl border border-school-border flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedImage.preview}
                        alt="Vorschau"
                        className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Bild erfolgreich geladen
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Bereit zur multimodalen Textanalyse
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setAnalysisResult(null);
                      }}
                      className="text-xs text-rose-600 hover:underline font-semibold px-2 py-1"
                    >
                      Entfernen
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Textarea for EduPage / Digital Letters */}
            {inputTab === 'text' && (
              <div>
                <textarea
                  value={letterText}
                  onChange={(e) => {
                    setLetterText(e.target.value);
                    setAnalysisResult(null);
                  }}
                  rows={5}
                  placeholder="Kopieren Sie hier den Text der EduPage-Mitteilung oder der Schul-E-Mail hinein..."
                  className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue bg-white"
                />
              </div>
            )}

            {/* Error Message */}
            {analysisError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{analysisError}</span>
              </div>
            )}

            {/* Action Trigger Button */}
            <button
              onClick={handleAnalyzeLetter}
              disabled={isAnalyzing || (!selectedImage && !letterText.trim())}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 min-h-[48px] transition-all shadow-soft ${
                isAnalyzing || (!selectedImage && !letterText.trim())
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-school-blue hover:bg-school-blueDark text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? ui.analyzing : ui.analyzeBtn}</span>
            </button>

            {/* Analysis Result Display */}
            {analysisResult && (
              <div className="mt-6 p-6 rounded-3xl bg-[#FFFBF5] border border-school-border space-y-5 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-school-border">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {analysisResult.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {analysisResult.originalSummary}
                    </p>
                  </div>

                  <button
                    onClick={handleToggleSpeakTranslation}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs self-start sm:self-center ${
                      isSpeakingTranslation
                        ? 'bg-orange-100 text-school-orange animate-pulse'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isSpeakingTranslation ? (
                      <>
                        <VolumeX className="w-4 h-4 text-school-orange" />
                        <span>Stopp</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-school-blue" />
                        <span>Vorlesen (TTS)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* What do I have to do? (Aktions-Box) */}
                <div className="bg-white rounded-2xl p-5 border border-school-border shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-school-orangeDark font-bold text-xs sm:text-sm uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-school-orange" />
                    <span>{ui.todoTitle}</span>
                  </div>

                  {/* Badges: Frist, Geld, Unterschrift */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {analysisResult.deadline && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-700" />
                        <span>Frist: {analysisResult.deadline}</span>
                      </span>
                    )}
                    {analysisResult.cost && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 inline-flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Kosten: {analysisResult.cost}</span>
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 border ${
                        analysisResult.signatureRequired
                          ? 'bg-rose-100 text-rose-900 border-rose-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>
                        Unterschrift nötig: {analysisResult.signatureRequired ? 'JA' : 'Nein'}
                      </span>
                    </span>
                    {analysisResult.contactPerson && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200 inline-flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-700" />
                        <span>Kontakt: {analysisResult.contactPerson}</span>
                      </span>
                    )}
                  </div>

                  {/* Specific Action items */}
                  {analysisResult.actionItems.length > 0 && (
                    <ul className="space-y-1.5 pt-2 text-xs sm:text-sm text-slate-700">
                      {analysisResult.actionItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-school-orange mt-2 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Complete Translation */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Vollständige Übersetzung:
                  </span>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                    {analysisResult.translation}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. MODE B: ZWEISPRACHIGER ENTSCHULDIGUNGS-GENERATOR */}
        {activeMode === 'excuse' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kind-Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Name des Kindes:
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="z. B. Maxim Schmidt"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-school-blue/20 bg-white"
                />
              </div>

              {/* Klasse auswählen */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Klasse des Kindes:
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-school-blue/20 bg-white"
                >
                  {CLASSES_LIST.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grund auswählen */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Grund des Fehlens:
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-school-blue/20 bg-white"
                >
                  <option value="illness">Krankheit (Erkrankung des Kindes)</option>
                  <option value="doctor">Arzttermin (Facharzt / Untersuchung)</option>
                  <option value="family">Dringender familiärer Anlass</option>
                </select>
              </div>

              {/* Name des Elternteils */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Ihr Name (Erziehungsberechtigte/r):
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="z. B. Elena Schmidt"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-school-blue/20 bg-white"
                />
              </div>

              {/* Zeitraum Von Datum */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Fehltag / Beginn ab:
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    if (e.target.value > toDate) setToDate(e.target.value);
                  }}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-school-blue/20 bg-white"
                />
              </div>

              {/* Zeitraum Bis Datum */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Fehltag / Voraussichtlich bis:
                </label>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-school-blue/20 bg-white"
                />
              </div>
            </div>

            {/* Live-Vorschau des deutschen Schreibens */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Offizielle deutsche Krankmeldung (für Frau Wittmann & Klassenleitung):
                </span>
                <span className="text-[11px] text-slate-500">
                  Automatisch formatiert
                </span>
              </div>

              <div className="bg-[#FFFBF5] rounded-2xl p-5 border border-school-border font-mono text-xs text-slate-800 whitespace-pre-line leading-relaxed shadow-xs">
                {generatedGermanLetter}
              </div>

              {/* 3 Export Actions: Copy, Email, Print */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 hover:border-school-blue hover:text-school-blue rounded-xl text-xs font-bold text-slate-700 transition-all shadow-xs min-h-[44px]"
                >
                  {copiedState ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">{ui.copySuccess}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>{ui.copyBtn}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleMailto}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-school-blue hover:bg-school-blueDark text-white rounded-xl text-xs font-bold transition-all shadow-soft min-h-[44px]"
                >
                  <Mail className="w-4 h-4" />
                  <span>{ui.emailBtn}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-school-teal hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-soft min-h-[44px]"
                >
                  <Printer className="w-4 h-4" />
                  <span>{ui.printBtn}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

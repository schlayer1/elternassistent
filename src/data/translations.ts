import { SupportedLanguage } from '../types/assistant';

export interface UIStrings {
  nav: {
    discover: string;
    discoverDesc: string;
    chat: string;
    chatDesc: string;
    tools: string;
    toolsDesc: string;
    info: string;
    infoDesc: string;
  };
  header: {
    title: string;
    subtitle: string;
    thinking: string;
    speaking: string;
    ready: string;
    settingsTitle: string;
  };
  chat: {
    topBarTitle: string;
    newChatBtn: string;
    clearConfirm: string;
    resetMessage: string;
    placeholder: string;
    sendBtn: string;
    readAloud: string;
    stopSpeaking: string;
    micTooltipStart: string;
    micTooltipStop: string;
    speechErrorPrefix: string;
    directTopicsTitle: string;
    jarvisLabel: string;
    jarvisDesc: string;
    bannerTitle: string;
    bannerDesc: string;
    openTranslatorBtn: string;
    welcomeMessage: string;
    welcomeSuggestions: string[];
    quickQuestions: string[];
  };
  discover: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    askAiBtn: string;
    filterAll: string;
    filterGrade5: string;
    filterCareers: string;
    filterDaily: string;
    filterDigital: string;
    filterFormal: string;
    filterProspective: string;
    keyPointsTitle: string;
    deepenInChat: string;
    relatedQuestionsTitle: string;
  };
  tools: {
    badge: string;
    title: string;
    subtitle: string;
    tabCareers: string;
    tabChecklists: string;
    tabSchedule: string;
    tabMultilingual: string;
    deepenInChat: string;
    targetLabel: string;
    requirementsTitle: string;
    examsTitle: string;
    nextStepsTitle: string;
    legalNoticeTitle: string;
    legalNoticeDesc: string;
    activeNow: string;
    resetChecklistConfirm: string;
  };
  info: {
    emergencyTitle: string;
    emergencyBadge: string;
    emergencyDesc: string;
    contactsTitle: string;
    callNow: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, UIStrings> = {
  de: {
    nav: {
      discover: 'Themen',
      discoverDesc: 'Themenwelten & Einblicke',
      chat: 'KI-Assistent',
      chatDesc: 'Fragen stellen & Vorlesen',
      tools: 'Eltern-Tools',
      toolsDesc: 'Abschlüsse & Checklisten',
      info: 'Schule & Notfall',
      infoDesc: 'Kontakte & Zeiten'
    },
    header: {
      title: 'Staatliche Regelschule „Johann Wilhelm Heimbürge“ Kahla',
      subtitle: 'Digitaler Elternassistent & Wegweiser ohne Login',
      thinking: 'Denkt nach...',
      speaking: 'Spricht...',
      ready: 'Bereit',
      settingsTitle: 'Schulverwaltung (Passwortgeschützt)'
    },
    chat: {
      topBarTitle: 'HBS Wissensassistent • Sofortauskunft ohne Login',
      newChatBtn: 'Neuer Dialog',
      clearConfirm: 'Möchten Sie den bisherigen Gesprächsverlauf wirklich zurücksetzen?',
      resetMessage: 'Der Verlauf wurde geleert. Was kann ich für Sie tun?',
      placeholder: 'Stellen Sie Ihre Frage zur Heimbürgeschule (z. B. Kennenlernwoche, Krankmeldung, TiP)...',
      sendBtn: 'Senden',
      readAloud: 'Vorlesen',
      stopSpeaking: 'Stopp',
      micTooltipStart: 'Spracheingabe starten',
      micTooltipStop: 'Spracheingabe stoppen',
      speechErrorPrefix: 'Fehler bei der Spracheingabe',
      directTopicsTitle: 'Direkt-Themen',
      jarvisLabel: 'HBS Kognitionskern',
      jarvisDesc: 'Verarbeitet Schulkonzept, TiP-Praxistage, Doppelstundentakt und Live-Google-Doc-Notizen.',
      bannerTitle: 'HBS Translator App & Brief-Dolmetscher',
      bannerDesc: 'Gedruckte Briefe übersetzen oder Live-Sprachübersetzung für Elterngespräche in der Schule nutzen.',
      openTranslatorBtn: 'Translator App öffnen',
      welcomeMessage: `Guten Tag! Ich bin der digitale Assistent der Staatlichen Regelschule „Johann Wilhelm Heimbürge“ Kahla.

Gerne beantworte ich Ihre Fragen rund um unsere Schule – beispielsweise zum **Übergang in die neue 5. Klasse**, zu unserem Praxiskonzept **„Tag in der Praxis“ (TiP)**, zu **Unterrichtszeiten**, **Schulessen**, **EduPage** oder den **Thüringer Schulabschlüssen**.

Wobei darf ich Ihnen heute helfen?`,
      welcomeSuggestions: [
        'Wie läuft die Kennenlernwoche für Klasse 5 ab?',
        'Was bedeutet es, dass die Schule ZDF Partnerschule ist?',
        'Wie melde ich mein Kind morgens bei Frau Wittmann krank?'
      ],
      quickQuestions: [
        'Wie läuft die Kennenlernwoche für neue 5.-Klässler ab?',
        'Was bedeutet es, dass die Schule ZDF Partnerschule ist?',
        'Wie funktioniert das Projekt „Tag in der Praxis“ (TiP)?',
        'Wie melde ich mein Kind morgens bei Frau Wittmann krank?',
        'Welche Arbeitsgemeinschaften (AGs) gibt es an der Schule?',
        'Welche Schulabschlüsse kann mein Kind nach Thüringer Schulordnung machen?'
      ]
    },
    discover: {
      heroBadge: 'Offizielles Schulportal',
      heroTitle: 'Willkommen an der Heimbürgeschule Kahla',
      heroSubtitle: 'Entdecken Sie unser Schulkonzept „Fit fürs Leben“, praktische Berufsorientierung (TiP) und alles Wichtige für Eltern und Kinder.',
      askAiBtn: 'Direkt im KI-Assistenten fragen',
      filterAll: 'Alle Themen',
      filterGrade5: 'Klasse 5 & Start',
      filterCareers: 'TiP & Berufe',
      filterDaily: 'Alltag & Ganztag',
      filterDigital: 'Digital & EduPage',
      filterFormal: 'Essen & Formales',
      filterProspective: 'Profile & ZDF',
      keyPointsTitle: 'Das Wichtigste im Überblick',
      deepenInChat: 'Frage an die KI stellen',
      relatedQuestionsTitle: 'Vertiefende Fragen:'
    },
    tools: {
      badge: 'Interaktive Helfer für den Schulalltag',
      title: 'Eltern-Werkzeuge & Schullaufbahn',
      subtitle: 'Erkunden Sie Thüringer Schulabschlüsse, haken Sie wichtige Vorbereitungen ab und behalten Sie die Schultakt-Zeiten im Blick.',
      tabCareers: 'Abschluss-Kompass',
      tabChecklists: 'Checklisten',
      tabSchedule: 'Schulzeit-Takt',
      tabMultilingual: 'Dolmetscher & Briefe',
      deepenInChat: 'Im KI-Assistenten vertiefen',
      targetLabel: 'Ziel:',
      requirementsTitle: 'Voraussetzungen',
      examsTitle: 'Prüfungsbestandteile',
      nextStepsTitle: 'Anschluss & Zukunft',
      legalNoticeTitle: 'Wichtiger rechtlicher Hinweis & KI-Transparenz:',
      legalNoticeDesc: 'Die dargestellten Schullaufbahn-Empfehlungen und generierten Antworten sind KI-gestützt und basieren auf den Regelungen der Thüringer Schulordnung (ThürSchulO). Sie dienen ausschließlich der ersten Information und Orientierung. Eine eigenständige Information sowie die offiziellen Auskünfte und Konferenzbeschlüsse der Schule (Schulleitung, Klassen- und Versetzungskonferenz) haben inhaltlich stets Vorrang.',
      activeNow: 'Jetzt aktiv',
      resetChecklistConfirm: 'Möchten Sie alle Häkchen dieser Checkliste zurücksetzen?'
    },
    info: {
      emergencyTitle: 'Krankmeldung & Dringende Notfälle',
      emergencyBadge: 'Vor 07:45 Uhr',
      emergencyDesc: 'Melden Sie Fehlzeiten bitte morgens direkt per EduPage-App oder telefonisch im Sekretariat bei Frau Wittmann (036424 / 22 400). Ab dem 3. Fehltag ist eine schriftliche Entschuldigung einzureichen.',
      contactsTitle: 'Wichtige Ansprechpartner der Heimbürgeschule',
      callNow: 'Anrufen: 036424 / 22 400'
    }
  },

  ro: {
    nav: {
      discover: 'Teme',
      discoverDesc: 'Prezentare generală & informații',
      chat: 'Asistent AI',
      chatDesc: 'Întrebări & redare vocală',
      tools: 'Instrumente',
      toolsDesc: 'Diplome & liste utile',
      info: 'Școală & Urgențe',
      infoDesc: 'Contacte & orar'
    },
    header: {
      title: 'Școala Gimnazială de Stat „Johann Wilhelm Heimbürge” Kahla',
      subtitle: 'Ghid digital pentru părinți & asistent fără autentificare',
      thinking: 'Gândește...',
      speaking: 'Vorbește...',
      ready: 'Gata',
      settingsTitle: 'Administrație școlară (protejat prin parolă)'
    },
    chat: {
      topBarTitle: 'Asistentul HBS • Informații imediate fără autentificare',
      newChatBtn: 'Dialog nou',
      clearConfirm: 'Doriți să ștergeți istoricul conversației de până acum?',
      resetMessage: 'Istoricul a fost șters. Cu ce vă pot ajuta?',
      placeholder: 'Puneți o întrebare despre școala Heimbürge (ex. săptămâna de acomodare, motivare absență, TiP)...',
      sendBtn: 'Trimite',
      readAloud: 'Citește',
      stopSpeaking: 'Stop',
      micTooltipStart: 'Porniți intrarea vocală',
      micTooltipStop: 'Opriți intrarea vocală',
      speechErrorPrefix: 'Eroare la introducerea vocală',
      directTopicsTitle: 'Subiecte rapide',
      jarvisLabel: 'Nucleul cognitiv HBS',
      jarvisDesc: 'Procesează conceptul școlii, practica TiP, orarul și actualizările transmise de școală.',
      bannerTitle: 'Aplicația HBS Translator & Traducător scrisori',
      bannerDesc: 'Traduceți scrisori tipărite sau folosiți traducerea vocală live pentru discuții la școală.',
      openTranslatorBtn: 'Deschide Translator App',
      welcomeMessage: `Bună ziua! Sunt asistentul digital oficial al Școlii Gimnaziale de Stat „Johann Wilhelm Heimbürge” Kahla.

Vă răspund cu plăcere la întrebări despre școală – de exemplu despre **trecerea în clasa a 5-a**, conceptul practic **„Ziua în Practică” (TiP)**, **orarul școlar**, **cantină**, **EduPage** sau **diplomele școlare din Turingia**.

Cu ce vă pot fi de folos astăzi?`,
      welcomeSuggestions: [
        'Cum decurge săptămâna de acomodare pentru clasa a 5-a?',
        'Ce înseamnă că școala este parteneră ZDF?',
        'Cum anunț dimineața copilul bolnav la doamna Wittmann?'
      ],
      quickQuestions: [
        'Cum decurge săptămâna de acomodare pentru clasa a 5-a?',
        'Ce înseamnă că școala este parteneră ZDF?',
        'Cum funcționează proiectul „Ziua în Practică” (TiP)?',
        'Cum anunț dimineața copilul bolnav la doamna Wittmann?',
        'Ce activități extracurriculare (AG-uri) există la școală?',
        'Ce diplome școlare poate obține copilul meu la HBS?'
      ]
    },
    discover: {
      heroBadge: 'Portalul oficial al școlii',
      heroTitle: 'Bun venit la Școala Heimbürge Kahla',
      heroSubtitle: 'Descoperiți conceptul educațional „Pregătit pentru viață”, orientarea profesională practică (TiP) și tot ce este important pentru părinți și elevi.',
      askAiBtn: 'Întreabă asistentul AI',
      filterAll: 'Toate temele',
      filterGrade5: 'Clasa a 5-a & Debut',
      filterCareers: 'TiP & Cariere',
      filterDaily: 'Viața școlară & Program prelungit',
      filterDigital: 'Digital & EduPage',
      filterFormal: 'Masa & Formalități',
      filterProspective: 'Profil & ZDF',
      keyPointsTitle: 'Cele mai importante aspecte',
      deepenInChat: 'Întreabă AI despre acest subiect',
      relatedQuestionsTitle: 'Întrebări aprofundate:'
    },
    tools: {
      badge: 'Ajutoare interactive pentru viața școlară',
      title: 'Instrumente pentru părinți & Parcurs școlar',
      subtitle: 'Explorați diplomele din Turingia, bifați pregătirile necesare și urmăriți orarul cursurilor.',
      tabCareers: 'Ghidul diplomelor',
      tabChecklists: 'Liste de verificare',
      tabSchedule: 'Orarul cursurilor',
      tabMultilingual: 'Traducător & Scrisori',
      deepenInChat: 'Aprofundează cu asistentul AI',
      targetLabel: 'Obiectiv:',
      requirementsTitle: 'Cerințe',
      examsTitle: 'Componentele examenului',
      nextStepsTitle: 'Perspective & Viitor',
      legalNoticeTitle: 'Notă juridică importantă & transparență AI:',
      legalNoticeDesc: 'Recomandările privind parcursul școlar și răspunsurile generate sunt asistate de AI și se bazează pe Regulamentul școlar din Turingia (ThürSchulO). Ele au doar rol informativ și de orientare inițială. Informarea directă și deciziile oficiale ale școlii (conducerea școlii, conferința clasei) au întotdeauna prioritate.',
      activeNow: 'Activ acum',
      resetChecklistConfirm: 'Doriți să resetați toate bifările din această listă?'
    },
    info: {
      emergencyTitle: 'Anunțarea absențelor & Urgențe',
      emergencyBadge: 'Înainte de 07:45',
      emergencyDesc: 'Vă rugăm să anunțați absențele dimineața direct prin aplicația EduPage sau telefonic la secretariat, la doamna Wittmann (036424 / 22 400). Începând cu a 3-a zi de absență, este necesară o motivare scrisă.',
      contactsTitle: 'Persoane importante de contact la Școala Heimbürge',
      callNow: 'Sună acum: 036424 / 22 400'
    }
  },

  uk: {
    nav: {
      discover: 'Теми',
      discoverDesc: 'Огляд та шкільне життя',
      chat: 'ШІ-Асистент',
      chatDesc: 'Запитання та озвучення',
      tools: 'Інструменти',
      toolsDesc: 'Атестати та чеклісти',
      info: 'Школа & Контакти',
      infoDesc: 'Контакти та розклад'
    },
    header: {
      title: 'Державна школа «Йоганн Вільгельм Гаймбюрге» Кала',
      subtitle: 'Цифровий асистент для батьків без необхідності входу',
      thinking: 'Аналізує...',
      speaking: 'Говорить...',
      ready: 'Готовий',
      settingsTitle: 'Керівництво школи (захищено паролем)'
    },
    chat: {
      topBarTitle: 'Асистент HBS • Швидка довідка без авторизації',
      newChatBtn: 'Новий діалог',
      clearConfirm: 'Ви дійсно бажаєте очистити історію листування?',
      resetMessage: 'Історію очищено. Чим я можу вам допомогти?',
      placeholder: 'Задайте запитання про школу (наприклад, про знайомство, лікарняний, практику TiP)...',
      sendBtn: 'Надіслати',
      readAloud: 'Озвучити',
      stopSpeaking: 'Стоп',
      micTooltipStart: 'Увімкнути голосове введення',
      micTooltipStop: 'Зупинити голосове введення',
      speechErrorPrefix: 'Помилка голосового введення',
      directTopicsTitle: 'Швидкі теми',
      jarvisLabel: 'Когнітивне ядро HBS',
      jarvisDesc: 'Обробляє шкільну концепцію, практику TiP, розклад уроків та повідомлення від школи.',
      bannerTitle: 'Додаток HBS Translator та перекладач листів',
      bannerDesc: 'Перекладайте друковані листи або використовуйте голосовий переклад для розмов у школі.',
      openTranslatorBtn: 'Відкрити Translator App',
      welcomeMessage: `Доброго дня! Я офіційний цифровий асистент Державної школи «Йоганн Вільгельм Гаймбюрге» Кала (HBS).

Я з радістю відповім на ваші запитання про нашу школу – наприклад, про **перехід до 5-го класу**, практичну програму **„День на практиці“ (TiP)**, **розклад уроків**, **харчування**, **EduPage** або **шкільні атестати Тюрингії**.

Чим я можу допомогти вам сьогодні?`,
      welcomeSuggestions: [
        'Як проходить тиждень знайомства у 5 класі?',
        'Що означає партнерство школи з телеканалом ZDF?',
        'Як повідомити пані Віттманн про хворобу дитини вранці?'
      ],
      quickQuestions: [
        'Як проходить тиждень знайомства для нових 5-класників?',
        'Що означає, що школа є партнерською школою ZDF?',
        'Як працює проєкт „День на практиці“ (TiP)?',
        'Як вранці правильно повідомити про хворобу дитини?',
        'Які гуртки (AG) працюють у школі?',
        'Які атестати про освіту можна отримати в HBS?'
      ]
    },
    discover: {
      heroBadge: 'Офіційний шкільний портал',
      heroTitle: 'Ласкаво просимо до школи Гаймбюрге Кала',
      heroSubtitle: 'Відкрийте для себе нашу концепцію „Готові до життя“, практичну профорієнтацію (TiP) та все необхідне для батьків та учнів.',
      askAiBtn: 'Запитати у ШІ-асистента',
      filterAll: 'Усі теми',
      filterGrade5: '5 клас & Старт',
      filterCareers: 'TiP & Професії',
      filterDaily: 'Будні & Подовжений день',
      filterDigital: 'Цифровізація & EduPage',
      filterFormal: 'Харчування & Формальності',
      filterProspective: 'Профіль & ZDF',
      keyPointsTitle: 'Головне коротко',
      deepenInChat: 'Запитати ШІ детальніше',
      relatedQuestionsTitle: 'Додаткові запитання:'
    },
    tools: {
      badge: 'Інтерактивні помічники на щодень',
      title: 'Інструменти для батьків та шкільні шляхи',
      subtitle: 'Дізнавайтеся про рівні атестатів Тюрингії, відмічайте підготовку та перевіряйте розклад уроків.',
      tabCareers: 'Компас атестатів',
      tabChecklists: 'Чеклісти',
      tabSchedule: 'Розклад дзвінків',
      tabMultilingual: 'Перекладач & Листи',
      deepenInChat: 'Поглибити у ШІ-асистенті',
      targetLabel: 'Мета:',
      requirementsTitle: 'Вимоги для отримання',
      examsTitle: 'Складові іспитів',
      nextStepsTitle: 'Перспективи та майбутнє',
      legalNoticeTitle: 'Важлива юридична примітка та прозорість ШІ:',
      legalNoticeDesc: 'Представлені рекомендації щодо атестатів базуються на Шкільному положенні Тюрингії (ThürSchulO) та мають виключно орієнтовний характер. Офіційні рішення та роз’яснення керівництва школи та педагогічної ради мають безумовний пріоритет.',
      activeNow: 'Зараз триває',
      resetChecklistConfirm: 'Бажаєте скинути всі позначки у цьому списку?'
    },
    info: {
      emergencyTitle: 'Повідомлення про хворобу та термінові випадки',
      emergencyBadge: 'До 07:45',
      emergencyDesc: 'Будь ласка, повідомляйте про пропуск вранці безпосередньо через додаток EduPage або телефоном у секретаріат пані Віттманн (036424 / 22 400). Починаючи з 3-го дня пропуску, обов’язково надається письмова пояснювальна записка.',
      contactsTitle: 'Важливі контакти школи Гаймбюрге',
      callNow: 'Зателефонувати: 036424 / 22 400'
    }
  },

  ru: {
    nav: {
      discover: 'Темы',
      discoverDesc: 'Обзор и жизнь школы',
      chat: 'ИИ-Ассистент',
      chatDesc: 'Вопросы и озвучивание',
      tools: 'Инструменты',
      toolsDesc: 'Аттестаты и чек-листы',
      info: 'Школа & Контакты',
      infoDesc: 'Контакты и расписание'
    },
    header: {
      title: 'Государственная школа «Иоганн Вильгельм Хаймбюрге» Кала',
      subtitle: 'Цифровой помощник для родителей без входа в систему',
      thinking: 'Думает...',
      speaking: 'Говорит...',
      ready: 'Готов',
      settingsTitle: 'Руководство школы (защищено паролем)'
    },
    chat: {
      topBarTitle: 'Помощник HBS • Быстрая справка без входа',
      newChatBtn: 'Новый диалог',
      clearConfirm: 'Вы действительно хотите очистить историю сообщений?',
      resetMessage: 'История очищена. Чем я могу вам помочь?',
      placeholder: 'Задайте вопрос о школе Хаймбюрге (например, о начале года, больничном, практике TiP)...',
      sendBtn: 'Отправить',
      readAloud: 'Озвучить',
      stopSpeaking: 'Стоп',
      micTooltipStart: 'Начать голосовой ввод',
      micTooltipStop: 'Остановить голосовой ввод',
      speechErrorPrefix: 'Ошибка голосового ввода',
      directTopicsTitle: 'Быстрые темы',
      jarvisLabel: 'Когнитивное ядро HBS',
      jarvisDesc: 'Обрабатывает концепцию школы, практику TiP, расписание уроков и свежие объявления школы.',
      bannerTitle: 'Приложение HBS Translator и переводчик писем',
      bannerDesc: 'Переводите бумажные письма или используйте голосовой перевод для бесед в школе.',
      openTranslatorBtn: 'Открыть Translator App',
      welcomeMessage: `Здравствуйте! Я официальный цифровой помощник Государственной школы «Иоганн Вильгельм Хаймбюрге» Кала (HBS).

Я с удовольствием отвечу на ваши вопросы о нашей школе – например, о **переходе в 5-й класс**, практической программе **„День на практике“ (TiP)**, **расписании уроков**, **школьном питании**, **EduPage** или **аттестатах Тюрингии**.

Чем я могу помочь вам сегодня?`,
      welcomeSuggestions: [
        'Как проходит ознакомительная неделя в 5 классе?',
        'Что означает партнерство школы с телеканалом ZDF?',
        'Как утром сообщить госпоже Виттманн о болезни ребенка?'
      ],
      quickQuestions: [
        'Как проходит ознакомительная неделя для новых 5-классников?',
        'Что означает, что школа является партнерской школой ZDF?',
        'Как работает проект „День на практике“ (TiP)?',
        'Как утром правильно сообщить о болезни ребенка?',
        'Какие кружки (AG) есть в школе?',
        'Какие аттестаты можно получить в HBS?'
      ]
    },
    discover: {
      heroBadge: 'Официальный школьный портал',
      heroTitle: 'Добро пожаловать в школу Хаймбюрге Кала',
      heroSubtitle: 'Узнайте о нашей концепции «Готовы к жизни», практической профориентации (TiP) и обо всем важном для родителей и детей.',
      askAiBtn: 'Спросить у ИИ-помощника',
      filterAll: 'Все темы',
      filterGrade5: '5 класс & Старт',
      filterCareers: 'TiP & Профессии',
      filterDaily: 'Будни & Продленка',
      filterDigital: 'Цифровизация & EduPage',
      filterFormal: 'Питание & Формальности',
      filterProspective: 'Профиль & ZDF',
      keyPointsTitle: 'Главное кратко',
      deepenInChat: 'Задать вопрос ИИ',
      relatedQuestionsTitle: 'Дополнительные вопросы:'
    },
    tools: {
      badge: 'Интерактивные помощники на каждый день',
      title: 'Инструменты для родителей и учебные пути',
      subtitle: 'Узнайте об аттестатах Тюрингии, отмечайте этапы подготовки и следите за расписанием уроков.',
      tabCareers: 'Компас аттестатов',
      tabChecklists: 'Чек-листы',
      tabSchedule: 'Расписание звонков',
      tabMultilingual: 'Переводчик & Письма',
      deepenInChat: 'Углубить с помощью ИИ',
      targetLabel: 'Цель:',
      requirementsTitle: 'Требования',
      examsTitle: 'Экзамены',
      nextStepsTitle: 'Перспективы и будущее',
      legalNoticeTitle: 'Важное правовое уведомление и прозрачность ИИ:',
      legalNoticeDesc: 'Представленные рекомендации основаны на Школьном положении Тюрингии (ThürSchulO) и носят исключительно ориентировочный характер. Официальные решения руководства школы и педагогического совета имеют приоритет.',
      activeNow: 'Сейчас идет',
      resetChecklistConfirm: 'Вы хотите сбросить все галочки в этом списке?'
    },
    info: {
      emergencyTitle: 'Сообщение о болезни и срочные случаи',
      emergencyBadge: 'До 07:45',
      emergencyDesc: 'Пожалуйста, сообщайте о пропусках утром через приложение EduPage или по телефону секретарю госпоже Виттманн (036424 / 22 400). Начиная с 3-го дня болезни необходимо предоставить письменную объяснительную.',
      contactsTitle: 'Важные контакты школы Хаймбюрге',
      callNow: 'Позвонить: 036424 / 22 400'
    }
  },

  en: {
    nav: {
      discover: 'Topics',
      discoverDesc: 'School life & Insights',
      chat: 'AI Assistant',
      chatDesc: 'Ask questions & Listen',
      tools: 'Parent Tools',
      toolsDesc: 'Graduation & Checklists',
      info: 'School & Info',
      infoDesc: 'Contacts & Timetable'
    },
    header: {
      title: 'State Secondary School “Johann Wilhelm Heimbürge” Kahla',
      subtitle: 'Digital Parent Assistant & School Guide without Login',
      thinking: 'Thinking...',
      speaking: 'Speaking...',
      ready: 'Ready',
      settingsTitle: 'School Administration (Password protected)'
    },
    chat: {
      topBarTitle: 'HBS Knowledge Assistant • Instant guidance without login',
      newChatBtn: 'New Chat',
      clearConfirm: 'Do you really want to clear the conversation history?',
      resetMessage: 'The history has been cleared. How can I help you today?',
      placeholder: 'Ask any question about Heimbürge School (e.g., orientation week, sick leave, TiP)...',
      sendBtn: 'Send',
      readAloud: 'Read aloud',
      stopSpeaking: 'Stop',
      micTooltipStart: 'Start voice input',
      micTooltipStop: 'Stop voice input',
      speechErrorPrefix: 'Voice input error',
      directTopicsTitle: 'Quick Topics',
      jarvisLabel: 'HBS Cognition Core',
      jarvisDesc: 'Processes school curriculum, TiP work experience, timetable blocks, and live notices.',
      bannerTitle: 'HBS Translator App & Letter Helper',
      bannerDesc: 'Translate printed letters or use live spoken translation for in-person meetings at school.',
      openTranslatorBtn: 'Open Translator App',
      welcomeMessage: `Hello! I am the official digital assistant of the State Secondary School “Johann Wilhelm Heimbürge” in Kahla.

I am glad to help answer your questions – such as the **transition to 5th grade**, our hands-on vocational program **“Day in Practice” (TiP)**, **daily schedule**, **school lunches**, **EduPage**, or **Thuringian school qualifications**.

How may I assist you today?`,
      welcomeSuggestions: [
        'How does the orientation week for 5th grade work?',
        'What does being a ZDF partner school mean?',
        'How do I report my child sick in the morning to Ms. Wittmann?'
      ],
      quickQuestions: [
        'How does the orientation week for new 5th graders work?',
        'What does being a ZDF partner school mean?',
        'How does the “Day in Practice” (TiP) work?',
        'How do I report my child sick in the morning to Ms. Wittmann?',
        'What extracurricular clubs (AGs) are offered?',
        'What qualifications can my child achieve at HBS?'
      ]
    },
    discover: {
      heroBadge: 'Official School Portal',
      heroTitle: 'Welcome to Heimbürge School Kahla',
      heroSubtitle: 'Explore our educational ethos “Fit for Life”, vocational career training (TiP), and essential information for parents and children.',
      askAiBtn: 'Ask the AI Assistant',
      filterAll: 'All Topics',
      filterGrade5: 'Grade 5 & Start',
      filterCareers: 'TiP & Careers',
      filterDaily: 'Daily Life & All-Day',
      filterDigital: 'Digital & EduPage',
      filterFormal: 'Lunch & Formalities',
      filterProspective: 'Profiles & ZDF',
      keyPointsTitle: 'Key Takeaways',
      deepenInChat: 'Ask AI about this topic',
      relatedQuestionsTitle: 'Follow-up questions:'
    },
    tools: {
      badge: 'Interactive helpers for school life',
      title: 'Parent Tools & Career Pathways',
      subtitle: 'Explore Thuringian qualifications, tick off preparatory checklists, and check the daily timetable.',
      tabCareers: 'Graduation Compass',
      tabChecklists: 'Checklists',
      tabSchedule: 'Timetable',
      tabMultilingual: 'Translator & Letters',
      deepenInChat: 'Deepen in AI Assistant',
      targetLabel: 'Goal:',
      requirementsTitle: 'Requirements',
      examsTitle: 'Exam Components',
      nextStepsTitle: 'Future Pathways',
      legalNoticeTitle: 'Important legal notice & AI transparency:',
      legalNoticeDesc: 'The qualification pathways and answers shown are AI-assisted and based on the Thuringian School Regulations (ThürSchulO). They serve solely for initial information and orientation. Official school decisions and regulations by the school administration and class conferences always take precedence.',
      activeNow: 'Active now',
      resetChecklistConfirm: 'Do you want to reset all checked items in this list?'
    },
    info: {
      emergencyTitle: 'Sick Leave & Urgent Inquiries',
      emergencyBadge: 'Before 07:45 AM',
      emergencyDesc: 'Please report any absence in the morning via the EduPage app or by calling the secretary Ms. Wittmann (036424 / 22 400). A written excuse note is required starting on the 3rd consecutive day of absence.',
      contactsTitle: 'Important Contacts at Heimbürge School',
      callNow: 'Call: 036424 / 22 400'
    }
  },

  ar: {
    nav: {
      discover: 'المواضيع',
      discoverDesc: 'نظرة عامة والحياة المدرسية',
      chat: 'المساعد الذكي',
      chatDesc: 'طرح الأسئلة والقراءة الصوتية',
      tools: 'أدوات أولياء الأمور',
      toolsDesc: 'الشهادات وقوائم المراجعة',
      info: 'المدرسة والطوارئ',
      infoDesc: 'جهات الاتصال والجدول'
    },
    header: {
      title: 'مدرسة يوهان فيلهلم هايمبورغه الحكومية في كاهلا',
      subtitle: 'الدليل الرقمي ومساعد أولياء الأمور دون تسجيل دخول',
      thinking: 'يفكر...',
      speaking: 'يتحدث...',
      ready: 'جاهز',
      settingsTitle: 'إدارة المدرسة (محمي بكلمة مرور)'
    },
    chat: {
      topBarTitle: 'مساعد مدرسة هايمبورغه • معلومات فورية دون تسجيل دخول',
      newChatBtn: 'محادثة جديدة',
      clearConfirm: 'هل ترغب حقًا في مسح سجل المحادثة الحالي؟',
      resetMessage: 'تم مسح سجل المحادثة. كيف يمكنني مساعدتك؟',
      placeholder: 'اطرح سؤالاً عن المدرسة (مثل أسبوع التعارف، الإبلاغ عن المرض، التدريب العملي TiP)...',
      sendBtn: 'إرسال',
      readAloud: 'قراءة',
      stopSpeaking: 'توقف',
      micTooltipStart: 'بدء الإدخال الصوتي',
      micTooltipStop: 'إيقاف الإدخال الصوتي',
      speechErrorPrefix: 'خطأ في الإدخال الصوتي',
      directTopicsTitle: 'مواضيع سريعة',
      jarvisLabel: 'نواة المعالجة المدرسية',
      jarvisDesc: 'يعالج المنهج المدرسي، والتدريب العملي، وجدول الحصص، والمستجدات المدرسية.',
      bannerTitle: 'تطبيق الترجمة HBS ومترجم الرسائل',
      bannerDesc: 'ترجمة الرسائل الورقية أو استخدام الترجمة الصوتية الفورية للمحادثات في المدرسة.',
      openTranslatorBtn: 'فتح تطبيق الترجمة',
      welcomeMessage: `مرحبًا بك! أنا المساعد الرقمي الرسمي لمدرسة „يوهان فيلهلم هايمبورغه“ في كاهلا.

يسعدني جدًا الإجابة عن استفساراتكم حول المدرسة – مثل **الانتقال إلى الصف الخامس**، وبرنامج **„يوم في التدريب العملي“ (TiP)**، و**أوقات الحصص**، و**الوجبات المدرسية**، وتطبيق **EduPage**، أو **الشهادات المدرسية في ولاية تورينغن**.

كيف يمكنني مساعدتك اليوم؟`,
      welcomeSuggestions: [
        'كيف يجري أسبوع التعارف للصف الخامس؟',
        'ماذا يعني أن المدرسة شريكة لقناة ZDF؟',
        'كيف أبلغ صباحًا عن مرض طفلي للسيدة فيتمان؟'
      ],
      quickQuestions: [
        'كيف يجري أسبوع التعارف لطلاب الصف الخامس الجدد؟',
        'ماذا يعني أن المدرسة شريكة لقناة ZDF؟',
        'كيف يعمل مشروع „يوم في التدريب العملي“ (TiP)؟',
        'كيف أبلغ صباحًا عن مرض طفلي للسيدة فيتمان؟',
        'ما هي الأنشطة والنوادي المدرسية المتاحة؟',
        'ما هي الشهادات الدراسية التي يمكن الحصول عليها؟'
      ]
    },
    discover: {
      heroBadge: 'البوابة المدرسية الرسمية',
      heroTitle: 'أهلاً بكم في مدرسة هايمبورغه كاهلا',
      heroSubtitle: 'تعرف على مفهومنا التعليمي „مستعدون للحياة“، والتوجيه المهني العملي (TiP)، وكل ما يهم أولياء الأمور والطلاب.',
      askAiBtn: 'اسأل المساعد الذكي',
      filterAll: 'جميع المواضيع',
      filterGrade5: 'الصف 5 والبداية',
      filterCareers: 'TiP والمهن',
      filterDaily: 'اليوميات والدوام الكامل',
      filterDigital: 'التعليم الرقمي وEduPage',
      filterFormal: 'الطعام والمعاملات',
      filterProspective: 'الملف التعريفي وZDF',
      keyPointsTitle: 'أهم النقاط بإيجاز',
      deepenInChat: 'اسأل المساعد الذكي عن هذا الموضوع',
      relatedQuestionsTitle: 'أسئلة تفصيلية:'
    },
    tools: {
      badge: 'أدوات مساعدة لليوميات المدرسية',
      title: 'أدوات أولياء الأمور والمسار الدراسي',
      subtitle: 'استكشف الشهادات المدرسية في تورينغن، وتحقق من قوائم الاستعداد، وتابع أوقات الحصص.',
      tabCareers: 'دليل الشهادات',
      tabChecklists: 'قوائم المراجعة',
      tabSchedule: 'جدول الحصص',
      tabMultilingual: 'المترجم والرسائل',
      deepenInChat: 'تعمق مع المساعد الذكي',
      targetLabel: 'الهدف:',
      requirementsTitle: 'المتطلبات',
      examsTitle: 'أقسام الامتحانات',
      nextStepsTitle: 'المستقبل والمسارات التالية',
      legalNoticeTitle: 'ملاحظة قانونية هامة وشفافية الذكاء الاصطناعي:',
      legalNoticeDesc: 'التوصيات المتعلقة بالمسارات الدراسية تستند إلى اللائحة المدرسية في تورينغن (ThürSchulO) وتهدف إلى التوجيه الأولي فقط. القرارات الرسمية الصادرة عن إدارة المدرسة ومجلس المعلمين لها الأولوية دائمًا.',
      activeNow: 'نشط الآن',
      resetChecklistConfirm: 'هل ترغب في إعادة ضبط جميع العلامات في هذه القائمة؟'
    },
    info: {
      emergencyTitle: 'الإبلاغ عن المرض وحالات الطوارئ',
      emergencyBadge: 'قبل الساعة 07:45 صباحًا',
      emergencyDesc: 'يرجى الإبلاغ عن الغياب صباحًا مباشرة عبر تطبيق EduPage أو هاتفيًا في السكرتارية لدى السيدة فيتمان (036424 / 22 400). بدءًا من اليوم الثالث للغياب، يجب تقديم عذر خطي موقع.',
      contactsTitle: 'جهات الاتصال الرئيسية بمدرسة هايمبورغه',
      callNow: 'اتصل الآن: 036424 / 22 400'
    }
  }
};

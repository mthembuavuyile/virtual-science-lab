/**
 * VyLab Language Store
 * Supports the 6 official South African languages used across the app:
 * English, isiZulu, isiXhosa, Afrikaans, Setswana, Sepedi
 */

export type SupportedLanguage = 'en' | 'zu' | 'xh' | 'af' | 'tn' | 'nso';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;          // Native name
  englishName: string;   // English label
  flag: string;          // South Africa flag emoji (common to all)
  shortCode: string;     // Short display code
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en',  name: 'English',    englishName: 'English',   flag: '🇿🇦', shortCode: 'EN' },
  { code: 'zu',  name: 'isiZulu',    englishName: 'isiZulu',   flag: '🇿🇦', shortCode: 'ZU' },
  { code: 'xh',  name: 'isiXhosa',   englishName: 'isiXhosa',  flag: '🇿🇦', shortCode: 'XH' },
  { code: 'af',  name: 'Afrikaans',  englishName: 'Afrikaans', flag: '🇿🇦', shortCode: 'AF' },
  { code: 'tn',  name: 'Setswana',   englishName: 'Setswana',  flag: '🇿🇦', shortCode: 'TN' },
  { code: 'nso', name: 'Sepedi',     englishName: 'Sepedi',    flag: '🇿🇦', shortCode: 'NS' },
];

const STORAGE_KEY = 'vylab_language';

export function getSavedLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) return saved;
  } catch {}
  return 'en';
}

export function saveLanguage(code: SupportedLanguage): void {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {}
}

// ─── UI Translations ────────────────────────────────────────────────────────

export interface UITranslations {
  // Navigation
  nav_dashboard: string;
  nav_sba: string;
  nav_labs: string;
  nav_tutor: string;
  nav_sandbox: string;
  nav_sba_guide: string;
  nav_notebook: string;
  nav_syllabus: string;

  // SBA Runner
  sba_launch: string;
  sba_unlock: string;
  sba_export_pdf: string;
  sba_step_theory: string;
  sba_step_apparatus: string;
  sba_step_data: string;
  sba_step_graph: string;
  sba_step_moderation: string;
  sba_previous: string;
  sba_next: string;
  sba_finish: string;
  sba_step_of: string;

  // StepTheory
  theory_candidate_title: string;
  theory_full_name: string;
  theory_id_number: string;
  theory_school: string;
  theory_date: string;
  theory_prescribed_aim: string;
  theory_question_label: string;
  theory_question_hint: string;
  theory_hypothesis_label: string;
  theory_hypothesis_hint: string;
  theory_variables_title: string;
  theory_independent: string;
  theory_dependent: string;
  theory_controlled: string;
  theory_add_variable: string;
  theory_hint: string;

  // SBA Hub
  hub_title: string;
  hub_subtitle: string;
  hub_filter_subject: string;
  hub_all: string;
  hub_all_grades: string;
  hub_free_trial: string;
  hub_unlocked: string;
  hub_unlock_all: string;
  hub_try_free: string;
  hub_marks: string;

  // Common
  common_loading: string;
  common_save: string;
  common_cancel: string;
  common_close: string;
  common_grade: string;
  common_download: string;
}

const translations: Record<SupportedLanguage, UITranslations> = {
  en: {
    nav_dashboard: 'Dashboard',
    nav_sba: 'CAPS SBA Practicals',
    nav_labs: 'All Labs',
    nav_tutor: 'AI Tutor',
    nav_sandbox: 'AI Sandbox',
    nav_sba_guide: 'SBA Lab Guide',
    nav_notebook: 'My Notebook',
    nav_syllabus: 'Syllabus Hub',

    sba_launch: 'Launch SBA Practical',
    sba_unlock: 'Unlock SBA Dossier',
    sba_export_pdf: 'Export SBA PDF',
    sba_step_theory: 'Theory & Variables',
    sba_step_apparatus: 'Digital Apparatus',
    sba_step_data: 'Data Table',
    sba_step_graph: 'Graphical Analysis',
    sba_step_moderation: 'Moderation & PDF',
    sba_previous: 'Previous Step',
    sba_next: 'Next Step',
    sba_finish: 'Finish & Download PDF',
    sba_step_of: 'Step {current} of {total}',

    theory_candidate_title: 'Candidate & Moderation Metadata (Page 1 Details)',
    theory_full_name: 'Learner Full Name *',
    theory_id_number: 'ID / SACAI / Matric Number *',
    theory_school: 'School / Distance Learning Center',
    theory_date: 'Assessment Date',
    theory_prescribed_aim: 'Prescribed DBE Aim',
    theory_question_label: '1. Investigative Question * (2 Marks)',
    theory_question_hint: 'Must be phrased as a question (?)',
    theory_hypothesis_label: '2. Scientific Hypothesis * (2 Marks)',
    theory_hypothesis_hint: 'State expected relationship with scientific rationale',
    theory_variables_title: '3. Identification of Variables (3 Marks)',
    theory_independent: 'Independent Variable (What you manipulate) *',
    theory_dependent: 'Dependent Variable (What you measure) *',
    theory_controlled: 'Controlled / Fixed Variables (Minimum 2 required)',
    theory_add_variable: '+ Add another controlled variable',
    theory_hint: 'Hint',

    hub_title: 'Prescribed Formal SBA Practicals & Moderation',
    hub_subtitle: 'Complete mandatory Grade 10–12 Physical Sciences practical tasks online.',
    hub_filter_subject: 'Filter by Subject:',
    hub_all: 'All',
    hub_all_grades: 'All Grades',
    hub_free_trial: 'Free Trial Lab',
    hub_unlocked: 'Unlocked',
    hub_unlock_all: 'Unlock All Practical Packs (R349)',
    hub_try_free: 'Try Free Practical Demo',
    hub_marks: 'Marks',

    common_loading: 'Loading...',
    common_save: 'Save',
    common_cancel: 'Cancel',
    common_close: 'Close',
    common_grade: 'Grade',
    common_download: 'Download',
  },

  zu: {
    nav_dashboard: 'Ibhodi',
    nav_sba: 'Izivivinyo ze-SBA',
    nav_labs: 'Wonke Amabhulogu',
    nav_tutor: 'UMfundisi we-AI',
    nav_sandbox: 'Indawo ye-AI',
    nav_sba_guide: 'Umhlahlandlela we-SBA',
    nav_notebook: 'Inotibhuku Lami',
    nav_syllabus: 'Inhloko Yesifundo',

    sba_launch: 'Qala Ukuvivinyo kwe-SBA',
    sba_unlock: 'Vula Ikhasi le-SBA',
    sba_export_pdf: 'Thumela i-PDF ye-SBA',
    sba_step_theory: 'Ithiyori & Izinguquzo',
    sba_step_apparatus: 'Izinsiza Zedijithali',
    sba_step_data: 'Ithebula Ledatha',
    sba_step_graph: 'Ukuhlaziya Ngemigqa',
    sba_step_moderation: 'Ukuhlola & i-PDF',
    sba_previous: 'Isinyathelo Esedlule',
    sba_next: 'Isinyathelo Esilandelayo',
    sba_finish: 'Qeda & Layisha i-PDF',
    sba_step_of: 'Isinyathelo {current} kwa-{total}',

    theory_candidate_title: 'Imininingwane Yomfundi (Ikhasi 1)',
    theory_full_name: 'Igama Eligcwele Lomfundi *',
    theory_id_number: 'Inombolo Ye-ID / SACAI / Umatikuletsheni *',
    theory_school: 'Isikole / Isikhungo Sokufunda',
    theory_date: 'Usuku Lokuhlola',
    theory_prescribed_aim: 'Inhloso ye-DBE Esetshenziswa',
    theory_question_label: '1. Umbuzo Wocwaningo * (Amaphoyinti Amabili)',
    theory_question_hint: 'Kufanele ibuzwe njengombuzo (?)',
    theory_hypothesis_label: '2. Isicabango Sesayensi * (Amaphoyinti Amabili)',
    theory_hypothesis_hint: 'Chaza ubudlelwano obulindelekile nesizathu sesayensi',
    theory_variables_title: '3. Ukuhlonza Izinguquzo (Amaphoyinti Amathathu)',
    theory_independent: 'Inguquzo Ezimele (Okuguqulayo) *',
    theory_dependent: 'Inguquzo Encike (Okulinganisayo) *',
    theory_controlled: 'Izinguquzo Ezilalelisiwe (Okungenani Ezimbili Ziyadingeka)',
    theory_add_variable: '+ Engeza enye inguquzo elalelisiwe',
    theory_hint: 'Isiqondiso',

    hub_title: 'Izivivinyo Ezisemthethweni ze-SBA & Ukuhlola',
    hub_subtitle: 'Qedela izivivinyo ezidingekayo ze-Physical Sciences kumaGrade 10-12 ku-inthanethi.',
    hub_filter_subject: 'Hlunga Ngesifundo:',
    hub_all: 'Konke',
    hub_all_grades: 'Wonke Amakilasi',
    hub_free_trial: 'Isivivinyo Samahhala',
    hub_unlocked: 'Sichazulukile',
    hub_unlock_all: 'Vula Wonke Amaphakheji (R349)',
    hub_try_free: 'Zama Isividinyo Samahhala',
    hub_marks: 'Amaphoyinti',

    common_loading: 'Iyalayisha...',
    common_save: 'Gcina',
    common_cancel: 'Khansela',
    common_close: 'Vala',
    common_grade: 'Ikilasi',
    common_download: 'Layisha',
  },

  xh: {
    nav_dashboard: 'Ibhodi',
    nav_sba: 'Ukuhlolwa kwe-SBA',
    nav_labs: 'Zonke iLabhwe',
    nav_tutor: 'Umfundisi we-AI',
    nav_sandbox: 'Indawo ye-AI',
    nav_sba_guide: 'Umhlahlandlela we-SBA',
    nav_notebook: 'Incwadi Yam',
    nav_syllabus: 'Isigqibo Sekharikhulamu',

    sba_launch: 'Qala uHlolo lwe-SBA',
    sba_unlock: 'Vula i-Dossier ye-SBA',
    sba_export_pdf: 'Thumela i-PDF ye-SBA',
    sba_step_theory: 'Ithiyori & Iinguqu',
    sba_step_apparatus: 'Izixhobo Zekhompyutha',
    sba_step_data: 'Itheyibhile Yedatha',
    sba_step_graph: 'Uhlalutyo Lwezingraph',
    sba_step_moderation: 'Ukuhlola & i-PDF',
    sba_previous: 'Isinyathelo Esidlulileyo',
    sba_next: 'Isinyathelo Esilandelayo',
    sba_finish: 'Gqiba & Khuphela i-PDF',
    sba_step_of: 'Isinyathelo {current} kwe-{total}',

    theory_candidate_title: 'Iinkcukacha Zomfundi (Iphepha 1)',
    theory_full_name: 'Igama Elipheleleyo Lomfundi *',
    theory_id_number: 'Inombolo ye-ID / SACAI / Umatikuletsheni *',
    theory_school: 'Isikolo / Iziko Lokufunda',
    theory_date: 'Umhla Wokuhlolwa',
    theory_prescribed_aim: 'Injongo ye-DBE Esetyenzisiwe',
    theory_question_label: '1. Umbuzo Wophando * (Iipoyinti Ezibini)',
    theory_question_hint: 'Kufuneka ibuzwe njengombuzo (?)',
    theory_hypothesis_label: '2. Ithiyori Yesayensi * (Iipoyinti Ezibini)',
    theory_hypothesis_hint: 'Chaza ubudlelwano obulindelekileyo nesizathu sesayensi',
    theory_variables_title: '3. Ukuchonga Iinguqu (Iipoyinti Ezintathu)',
    theory_independent: 'Inguqu Ezimeleyo (Oyiguqulayo) *',
    theory_dependent: 'Inguqu Encike (Oyilinganisayo) *',
    theory_controlled: 'Iinguqu Ezilalelisiweyo (Ubuncinane Zimbini Ziyafuneka)',
    theory_add_variable: '+ Yongeza enye inguqu elalelisiweyo',
    theory_hint: 'Isalathiso',

    hub_title: 'Uhlolo Lwesemthethweni we-SBA & Ukujonga',
    hub_subtitle: 'Gqiba iimvavanyo ezifunekayo ze-Physical Sciences ze-Grade 10-12 kwiintanethi.',
    hub_filter_subject: 'Hlela Ngomzantsi:',
    hub_all: 'Konke',
    hub_all_grades: 'Wonke Amabakala',
    hub_free_trial: 'Uvavanyo Lwasimahla',
    hub_unlocked: 'Ivulekile',
    hub_unlock_all: 'Vula Onke Amaphakheji (R349)',
    hub_try_free: 'Zama Uvavanyo Lwasimahla',
    hub_marks: 'Iipoyinti',

    common_loading: 'Iyalayisha...',
    common_save: 'Gcina',
    common_cancel: 'Rhoxisa',
    common_close: 'Vala',
    common_grade: 'Ibakala',
    common_download: 'Khuphela',
  },

  af: {
    nav_dashboard: 'Paneelbord',
    nav_sba: 'CAPS SBA-Praktiese',
    nav_labs: 'Alle Laboratoriums',
    nav_tutor: 'KI-Tutor',
    nav_sandbox: 'KI-Sandbak',
    nav_sba_guide: 'SBA-Laboratoriumgids',
    nav_notebook: 'My Notaboek',
    nav_syllabus: 'Sillabusskuif',

    sba_launch: 'Begin SBA-Praktikum',
    sba_unlock: 'Ontsluit SBA-Dossier',
    sba_export_pdf: 'Voer SBA-PDF Uit',
    sba_step_theory: 'Teorie & Veranderlikes',
    sba_step_apparatus: 'Digitale Apparaat',
    sba_step_data: 'Datatabel',
    sba_step_graph: 'Grafiese Analise',
    sba_step_moderation: 'Moderering & PDF',
    sba_previous: 'Vorige Stap',
    sba_next: 'Volgende Stap',
    sba_finish: 'Klaar & Laai PDF Af',
    sba_step_of: 'Stap {current} van {total}',

    theory_candidate_title: 'Kandidaat & Moderingsmetadata (Bladsy 1)',
    theory_full_name: "Leerder se Volle Naam *",
    theory_id_number: 'ID / SACAI / Matrikulasienommer *',
    theory_school: 'Skool / Afstandsleringsentrum',
    theory_date: 'Assesseringsdatum',
    theory_prescribed_aim: 'Voorgeskrewe DBE-Doelstelling',
    theory_question_label: '1. Ondersoekende Vraag * (2 Punte)',
    theory_question_hint: "Moet as 'n vraag geformuleer word (?)",
    theory_hypothesis_label: '2. Wetenskaplike Hipotese * (2 Punte)',
    theory_hypothesis_hint: 'Verklaar die verwagte verhouding met wetenskaplike rede',
    theory_variables_title: '3. Identifisering van Veranderlikes (3 Punte)',
    theory_independent: 'Onafhanklike Veranderlike (Wat jy manipuleer) *',
    theory_dependent: 'Afhanklike Veranderlike (Wat jy meet) *',
    theory_controlled: 'Beheerde / Vaste Veranderlikes (Minimum 2 vereis)',
    theory_add_variable: "+ Voeg nog 'n beheerde veranderlike by",
    theory_hint: 'Wenk',

    hub_title: 'Voorgeskrewe Formele SBA-Praktiese & Moderering',
    hub_subtitle: 'Voltooi verpligte Graad 10-12 Fisiese Wetenskappe praktiese take aanlyn.',
    hub_filter_subject: 'Filter op Vak:',
    hub_all: 'Alles',
    hub_all_grades: 'Alle Grade',
    hub_free_trial: 'Gratis Proef-Laboratorium',
    hub_unlocked: 'Ontsluit',
    hub_unlock_all: 'Ontsluit Alle Pakkette (R349)',
    hub_try_free: 'Probeer Gratis Demo',
    hub_marks: 'Punte',

    common_loading: 'Laai tans...',
    common_save: 'Stoor',
    common_cancel: 'Kanselleer',
    common_close: 'Sluit',
    common_grade: 'Graad',
    common_download: 'Aflaai',
  },

  tn: {
    nav_dashboard: 'Sefahlelo',
    nav_sba: 'Dikgetsi tsa SBA',
    nav_labs: 'Diphuphamedi Tsotlhe',
    nav_tutor: 'Morutisi wa AI',
    nav_sandbox: 'Lefelo la AI',
    nav_sba_guide: 'Kaedi ya SBA',
    nav_notebook: 'Bukana Ya Me',
    nav_syllabus: 'Karolotlotlo ya Gape',

    sba_launch: 'Simolola Dikgetsi tsa SBA',
    sba_unlock: 'Bula Diphephadikgang tsa SBA',
    sba_export_pdf: 'Romela PDF ya SBA',
    sba_step_theory: 'Tiori & Diphetogo',
    sba_step_apparatus: 'Didirisiwa tsa Dijithale',
    sba_step_data: 'Tafole ya Tlhahlobo',
    sba_step_graph: 'Tlhahlobo ya Difegara',
    sba_step_moderation: 'Tlhokomeló & PDF',
    sba_previous: 'Ntlha e e Fetileng',
    sba_next: 'Ntlha e e Latelang',
    sba_finish: 'Fedisa & Laotlha PDF',
    sba_step_of: 'Ntlha {current} ya {total}',

    theory_candidate_title: 'Tlhahlobo ya Moithuti (Tsebe 1)',
    theory_full_name: 'Leina la Moithuti *',
    theory_id_number: 'Nambere ya ID / SACAI / Matikuleshene *',
    theory_school: 'Sekole / Sekhuduthamaga sa Thuto',
    theory_date: 'Letlha la Tlhatlhoso',
    theory_prescribed_aim: 'Maikaelelo a a Laetsiweng a DBE',
    theory_question_label: '1. Potso ya Dipatlisiso * (Manqwe a Mabedi)',
    theory_question_hint: 'E tshwanetse go bidiwa jaaka potso (?)',
    theory_hypothesis_label: '2. Kakanyo ya Saense * (Manqwe a Mabedi)',
    theory_hypothesis_hint: 'Bua ka kamano e e solofetsweng le lebaka la saense',
    theory_variables_title: '3. Tlhologelo ya Diphetogo (Manqwe a Mararo)',
    theory_independent: 'Phetogo e e Ikemetseng (Se o se fetolang) *',
    theory_dependent: 'Phetogo e e Itshetlang (Se o se lekanyang) *',
    theory_controlled: 'Diphetogo tse di Laolwang (Bonyonnye tsa Pedi di a Bewa)',
    theory_add_variable: '+ Tsenya phetogo e nngwe e e laolwang',
    theory_hint: 'Kaedi',

    hub_title: 'Dikgetsi tse di Tshwanelang tsa SBA & Tlhokomeló',
    hub_subtitle: 'Diragatsa dikgetsi tse di tlhokegang tsa Saense ya Tlhago ya Grade 10-12 kwa inthaneteng.',
    hub_filter_subject: 'Sefa ka Setlhogo:',
    hub_all: 'Tsotlhe',
    hub_all_grades: 'Makalana Otlhe',
    hub_free_trial: 'Thusolafelo ya Mahala',
    hub_unlocked: 'E Buwitswe',
    hub_unlock_all: 'Bula Dipasetsheke Tsotlhe (R349)',
    hub_try_free: 'Leka Thusolafelo ya Mahala',
    hub_marks: 'Manqwe',

    common_loading: 'E isa go...',
    common_save: 'Boloka',
    common_cancel: 'Phimola',
    common_close: 'Tswala',
    common_grade: 'Kereiti',
    common_download: 'Laotlha',
  },

  nso: {
    nav_dashboard: 'Phethelo',
    nav_sba: 'Dihlahlobo tsha SBA',
    nav_labs: 'Diphuphamedi Tsotlhe',
    nav_tutor: 'Morutishi wa AI',
    nav_sandbox: 'Lefelo la AI',
    nav_sba_guide: 'Kaedi ya SBA',
    nav_notebook: 'Buka Ya Ka',
    nav_syllabus: 'Hlongwa ya Thuto',

    sba_launch: 'Thoma Hlahlobo ya SBA',
    sba_unlock: 'Bula Diphephadikgang tsha SBA',
    sba_export_pdf: 'Romela PDF ya SBA',
    sba_step_theory: 'Tiori & Diphetosho',
    sba_step_apparatus: 'Didirishwa tsha Dijitale',
    sba_step_data: 'Tafola ya Tshedimosho',
    sba_step_graph: 'Tlhahlisho ya Difegara',
    sba_step_moderation: 'Tlhokomelo & PDF',
    sba_previous: 'Kgato ya Pejana',
    sba_next: 'Kgato ya go Latela',
    sba_finish: 'Feleletsha & Laotlha PDF',
    sba_step_of: 'Kgato {current} ya {total}',

    theory_candidate_title: 'Tshedimosho ya Morutwi (Letlakala 1)',
    theory_full_name: 'Leina la Morutwi *',
    theory_id_number: 'Nambara ya ID / SACAI / Matikuleshene *',
    theory_school: 'Sekolo / Setshaba sa Thuto',
    theory_date: 'Letsatshi la Hlahlobo',
    theory_prescribed_aim: 'Maikaelelo a Laetswego a DBE',
    theory_question_label: '1. Potshisho ya Patlishisho * (Manqwe a Mabedi)',
    theory_question_hint: 'E swanetse go botshishwa bjalo ka potshisho (?)',
    theory_hypothesis_label: '2. Kgopolo ya Saense * (Manqwe a Mabedi)',
    theory_hypothesis_hint: 'Bolela kamano ye e lebeletswego le lebaka la saense',
    theory_variables_title: '3. Tlholomelo ya Diphetosho (Manqwe a Mararo)',
    theory_independent: 'Phetosho ye e Ikemeletswego (Se o se fetolago) *',
    theory_dependent: 'Phetosho ye e Itshetlilego (Se o se lekanyang) *',
    theory_controlled: 'Diphetosho tshe di Laolwago (Bonyonnye tsha Pedi di a Hlokwa)',
    theory_add_variable: '+ Tsenya phetosho ye ngwe ye e laolwago',
    theory_hint: 'Kaedi',

    hub_title: 'Dihlahlobo tshe di Swanetswego tsha SBA & Tlhokomelo',
    hub_subtitle: 'Phethela dihlahlobo tshe di hlokegilego tsha Saense ya Tlhago ya Grade 10-12 ka inthanete.',
    hub_filter_subject: 'Hlompha ka Thuto:',
    hub_all: 'Tsotlhe',
    hub_all_grades: 'Makalana Otlhe',
    hub_free_trial: 'Hlahlobo ya Mahala',
    hub_unlocked: 'E Buwilwe',
    hub_unlock_all: 'Bula Diphatshete Tsotlhe (R349)',
    hub_try_free: 'Leka Hlahlobo ya Mahala',
    hub_marks: 'Manqwe',

    common_loading: 'E laotlha...',
    common_save: 'Boloka',
    common_cancel: 'Khansela',
    common_close: 'Kgwatha',
    common_grade: 'Kreite',
    common_download: 'Laotlha',
  },
};

export function getTranslations(lang: SupportedLanguage): UITranslations {
  return translations[lang] || translations.en;
}

export function t(lang: SupportedLanguage, key: keyof UITranslations, vars?: Record<string, string | number>): string {
  const tr = getTranslations(lang);
  let text = tr[key] as string;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}

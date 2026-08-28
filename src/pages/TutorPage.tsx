import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  MessageSquare, 
  RefreshCw, 
  Check, 
  X, 
  Award, 
  FileText, 
  Languages, 
  ShieldCheck, 
  BookOpen, 
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import { askTutor, generateMatricExamChallenge, evaluateExamAnswer, ChatMessage } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';

// Dynamic temporal greeting helper
function getTemporalGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 22) return 'Good evening';
  return 'Working late?';
}

// Formatter to render Markdown output from LLM nicely
function renderMarkdown(text: string) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let content = line;
    
    // Headers: ###, ##, #
    if (content.startsWith('### ')) {
      return <h4 key={idx} className="text-sm font-bold text-slate-900 mt-3 mb-1">{parseInlineStyles(content.slice(4))}</h4>;
    }
    if (content.startsWith('## ')) {
      return <h3 key={idx} className="text-base font-extrabold text-slate-900 mt-4 mb-2">{parseInlineStyles(content.slice(3))}</h3>;
    }
    if (content.startsWith('# ')) {
      return <h2 key={idx} className="text-lg font-black text-slate-900 mt-5 mb-3">{parseInlineStyles(content.slice(2))}</h2>;
    }
    
    // Bullet points
    if (content.startsWith('- ') || content.startsWith('* ')) {
      return (
        <ul key={idx} className="list-disc pl-5 my-1 text-slate-700 text-xs md:text-sm">
          <li>{parseInlineStyles(content.slice(2))}</li>
        </ul>
      );
    }
    
    // Ordered lists
    const matchOrdered = content.match(/^(\d+)\.\s(.*)/);
    if (matchOrdered) {
      return (
        <ol key={idx} className="list-decimal pl-5 my-1 text-slate-700 text-xs md:text-sm">
          <li value={parseInt(matchOrdered[1])}>{parseInlineStyles(matchOrdered[2])}</li>
        </ol>
      );
    }
    
    // Empty lines
    if (!content.trim()) {
      return <div key={idx} className="h-2" />;
    }
    
    return <p key={idx} className="text-slate-700 text-xs md:text-sm leading-relaxed my-1">{parseInlineStyles(content)}</p>;
  });
}

function parseInlineStyles(text: string) {
  const parts = [];
  const boldRegex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;
  
  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(<strong key={match.index} className="font-extrabold text-slate-900">{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
}

interface DisplayMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

// CAPS formula definition
interface FormulaItem {
  formula: string;
  name: string;
  category: string;
  variables: string[];
  units: string[];
  explanation: string;
  paper: 'Physics' | 'Chemistry';
  matricTopic: string;
}

const FORMULAS: FormulaItem[] = [
  // Physics - Dynamics
  {
    formula: 'F_net = ma',
    name: "Newton's Second Law",
    category: 'Dynamics',
    variables: ['F_net = Net Force', 'm = mass of object', 'a = acceleration'],
    units: ['Force: Newtons (N)', 'mass: kilograms (kg)', 'acceleration: m·s⁻²'],
    explanation: 'When a net force acts on an object, the object accelerates in the direction of the force. Acceleration is directly proportional to net force and inversely proportional to mass.',
    paper: 'Physics',
    matricTopic: "Newton's Laws & Dynamics"
  },
  {
    formula: 'p = mv',
    name: 'Linear Momentum',
    category: 'Dynamics',
    variables: ['p = momentum vector', 'm = mass', 'v = velocity'],
    units: ['momentum: kg·m·s⁻¹', 'mass: kg', 'velocity: m·s⁻¹'],
    explanation: 'A vector quantity defined as the product of an object\'s mass and its velocity, describing the quantity of motion.',
    paper: 'Physics',
    matricTopic: "Newton's Laws & Dynamics"
  },
  {
    formula: 'J = F_net Δt = Δp',
    name: 'Impulse-Momentum Theorem',
    category: 'Dynamics',
    variables: ['J = Impulse', 'F_net = Average Net Force', 'Δt = time interval', 'Δp = change in momentum'],
    units: ['Impulse: N·s or kg·m·s⁻¹', 'Force: N', 'time: s', 'momentum change: kg·m·s⁻¹'],
    explanation: 'The product of the net force acting on an object and the time the force acts is equal to the change in momentum of the object.',
    paper: 'Physics',
    matricTopic: "Newton's Laws & Dynamics"
  },
  // Physics - Kinematics
  {
    formula: 'v_f = v_i + aΔt',
    name: 'Equations of Motion: Velocity',
    category: 'Kinematics',
    variables: ['v_f = final velocity', 'v_i = initial velocity', 'a = acceleration', 'Δt = change in time'],
    units: ['velocity: m·s⁻¹', 'acceleration: m·s⁻²', 'time: s'],
    explanation: 'Calculates the final velocity of an object experiencing constant acceleration after a given time interval.',
    paper: 'Physics',
    matricTopic: 'Vertical Projectile Motion'
  },
  {
    formula: 'Δy = v_i Δt + ½ a Δt²',
    name: 'Equations of Motion: Displacement',
    category: 'Kinematics',
    variables: ['Δy = vertical displacement', 'v_i = initial velocity', 'Δt = time duration', 'a = acceleration (g = -9.8 m·s⁻²)'],
    units: ['displacement: meters (m)', 'velocity: m·s⁻¹', 'time: s', 'acceleration: m·s⁻²'],
    explanation: 'Determines the displacement of an object moving under constant acceleration (often gravity in vertical projectile motion).',
    paper: 'Physics',
    matricTopic: 'Vertical Projectile Motion'
  },
  {
    formula: 'v_f² = v_i² + 2aΔy',
    name: 'Equations of Motion: Time-Independent',
    category: 'Kinematics',
    variables: ['v_f = final velocity', 'v_i = initial velocity', 'a = acceleration', 'Δy = displacement'],
    units: ['velocity: m·s⁻¹', 'acceleration: m·s⁻²', 'displacement: m'],
    explanation: 'Relates final velocity directly to displacement and acceleration, independent of elapsed time.',
    paper: 'Physics',
    matricTopic: 'Vertical Projectile Motion'
  },
  // Physics - Work Energy Power
  {
    formula: 'W = F Δx cosθ',
    name: 'Work Done by Force',
    category: 'Work & Energy',
    variables: ['W = Work done', 'F = force magnitude', 'Δx = displacement magnitude', 'θ = angle between force and displacement vectors'],
    units: ['Work: Joules (J)', 'Force: N', 'displacement: m', 'angle: degrees'],
    explanation: 'The transfer of energy to an object by a force that causes the object to move in the direction of the force.',
    paper: 'Physics',
    matricTopic: 'Work, Energy & Power'
  },
  {
    formula: 'W_net = ΔE_k',
    name: 'Work-Energy Theorem',
    category: 'Work & Energy',
    variables: ['W_net = net work done', 'ΔE_k = change in kinetic energy (E_kf - E_ki)'],
    units: ['Work: J', 'Kinetic Energy: J'],
    explanation: 'The net work done on an object is equal to the change in the object\'s kinetic energy.',
    paper: 'Physics',
    matricTopic: 'Work, Energy & Power'
  },
  {
    formula: 'P = W / Δt',
    name: 'Definition of Power',
    category: 'Work & Energy',
    variables: ['P = Power', 'W = work done', 'Δt = elapsed time'],
    units: ['Power: Watts (W) or J·s⁻¹', 'Work: J', 'time: s'],
    explanation: 'The rate at which work is done or energy is expended.',
    paper: 'Physics',
    matricTopic: 'Work, Energy & Power'
  },
  // Physics - Circuits
  {
    formula: 'EMF = I(R + r)',
    name: "Internal Resistance Ohm's Law",
    category: 'Electricity',
    variables: ['EMF = Electromotive force of cell', 'I = total circuit current', 'R = external resistance', 'r = internal resistance'],
    units: ['EMF: Volts (V)', 'current: Amperes (A)', 'resistance: Ohms (Ω)'],
    explanation: 'Accounts for potential difference lost (lost volts Ir) inside the cell due to its own internal resistance.',
    paper: 'Physics',
    matricTopic: 'Electric Circuits (Internal Resistance)'
  },
  // Physics - Electrodynamics
  {
    formula: 'ε = -N (ΔΦ / Δt)',
    name: "Faraday's Law of Induction",
    category: 'Electrodynamics',
    variables: ['ε = induced EMF', 'N = number of turns in coil', 'ΔΦ = change in magnetic flux', 'Δt = time interval'],
    units: ['induced EMF: Volts (V)', 'flux: Webers (Wb)', 'time: s'],
    explanation: 'The magnitude of the induced EMF in a circuit is directly proportional to the rate of change of magnetic flux linkage.',
    paper: 'Physics',
    matricTopic: 'Electrodynamics (Motors & Generators)'
  },
  // Chemistry - Stoichiometry
  {
    formula: 'n = m / M',
    name: 'Molar Amount from Mass',
    category: 'Stoichiometry',
    variables: ['n = number of moles', 'm = mass of substance', 'M = molar mass of substance'],
    units: ['moles: mol', 'mass: grams (g)', 'molar mass: g·mol⁻¹'],
    explanation: 'Calculates the number of chemical moles in a given physical mass of a chemical compound.',
    paper: 'Chemistry',
    matricTopic: 'Organic Chemistry (Nomenclature & Reactions)'
  },
  {
    formula: 'c = n / V = m / (M V)',
    name: 'Molarity / Concentration',
    category: 'Stoichiometry',
    variables: ['c = concentration', 'n = moles of solute', 'V = volume of solution', 'm = solute mass', 'M = molar mass'],
    units: ['concentration: mol·dm⁻³', 'moles: mol', 'volume: dm³ (liters)', 'mass: g'],
    explanation: 'Measures the concentration of a solute in a chemical solution. Note that 1 dm³ = 1 Liter = 1000 mL.',
    paper: 'Chemistry',
    matricTopic: 'Acids & Bases (Titrations)'
  },
  // Chemistry - Acids & Bases
  {
    formula: 'pH = -log₁₀[H₃O⁺]',
    name: 'pH Definition',
    category: 'Acids & Bases',
    variables: ['pH = power of hydrogen index', '[H₃O⁺] = concentration of hydronium ions'],
    units: ['pH: dimensionless', 'hydronium concentration: mol·dm⁻³'],
    explanation: 'A logarithmic measure of the acidity or alkalinity of an aqueous chemical solution.',
    paper: 'Chemistry',
    matricTopic: 'Acids & Bases (Titrations)'
  },
  {
    formula: 'K_c = [products] / [reactants]',
    name: 'Equilibrium Constant',
    category: 'Equilibrium',
    variables: ['K_c = equilibrium constant', '[products] = concentrations at equilibrium', '[reactants] = concentrations at equilibrium'],
    units: ['K_c: dimensionless (usually)'],
    explanation: 'Describes the ratio of reactants to products in a reversible chemical reaction at equilibrium at a constant temperature.',
    paper: 'Chemistry',
    matricTopic: 'Rates of Reactions & Chemical Equilibrium'
  }
];

const LANGUAGES = [
  { code: 'English', name: 'English' },
  { code: 'Zulu', name: 'isiZulu' },
  { code: 'Xhosa', name: 'isiXhosa' },
  { code: 'Sepedi', name: 'Sepedi' },
  { code: 'Afrikaans', name: 'Afrikaans' }
];

const MATRIC_TOPICS = [
  "Newton's Laws & Dynamics",
  "Vertical Projectile Motion",
  "Work, Energy & Power",
  "Electrodynamics (Motors & Generators)",
  "Electric Circuits (Internal Resistance)",
  "Organic Chemistry (Nomenclature & Reactions)",
  "Rates of Reactions & Chemical Equilibrium",
  "Acids & Bases (Titrations)",
  "Electrochemical Cells (Galvanic & Electrolytic)"
];

export default function TutorPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'exam' | 'formula'>('chat');

  // CHAT STATE
  const [messages, setMessages] = useState<DisplayMessage[]>(() => {
    const greeting = getTemporalGreeting();
    return [
      {
        id: '1',
        role: 'model',
        text: `${greeting}! I'm your CAPS Physical Sciences tutor. How can I help you with Physics or Chemistry today?`
      }
    ];
  });
  const [chatInput, setChatInput] = useState('');
  const [chatLang, setChatLang] = useState('English');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // EXAM PREP STATE
  const [selectedTopic, setSelectedTopic] = useState(MATRIC_TOPICS[0]);
  const [examLoading, setExamLoading] = useState(false);
  const [challenge, setChallenge] = useState<{
    title: string;
    scenario: string;
    questions: { num: string; text: string; marks: number }[];
    memo: string;
  } | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [gradingResult, setGradingResult] = useState<{
    totalAwarded: number;
    maxMarks: number;
    gradingDetails: { num: string; awarded: number; max: number; feedback: string }[];
    generalFeedback: string;
  } | null>(null);
  const [gradingLoading, setGradingLoading] = useState(false);

  // FORMULA SHEET STATE
  const [selectedFormula, setSelectedFormula] = useState<FormulaItem | null>(null);
  const [formulaSearch, setFormulaSearch] = useState('');

  // Auto scroll chat
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Chat send handler
  const handleChatSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput;
    const userMsgId = Date.now().toString();
    
    // Add user message
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userText }]);
    setChatInput('');
    setChatLoading(true);

    try {
      // Map display history to API structure
      const historyForAPI: ChatMessage[] = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const reply = await askTutor(userText, historyForAPI, chatLang);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: 'Error: Could not retrieve response from tutor. Check your connection.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Pre-fill helper from formula sheet
  const triggerExplanationFromFormula = (formulaName: string, formulaStr: string) => {
    setChatInput(`Explain the formula for ${formulaName} (${formulaStr}) with a clear CAPS physical science example and units.`);
    setActiveTab('chat');
  };

  // Generate Challenge
  const handleGenerateChallenge = async () => {
    setExamLoading(true);
    setGradingResult(null);
    setStudentAnswers({});
    try {
      const data = await generateMatricExamChallenge(selectedTopic);
      if (data && data.scenario && data.questions) {
        setChallenge(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setExamLoading(false);
    }
  };

  // Grade challenge
  const handleGradeChallenge = async () => {
    if (!challenge) return;
    setGradingLoading(true);
    try {
      const result = await evaluateExamAnswer(
        challenge.scenario,
        challenge.questions,
        studentAnswers,
        challenge.memo
      );
      if (result) {
        setGradingResult(result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGradingLoading(false);
    }
  };

  // Filtered formulas
  const filteredFormulas = FORMULAS.filter(f => 
    f.name.toLowerCase().includes(formulaSearch.toLowerCase()) ||
    f.formula.toLowerCase().includes(formulaSearch.toLowerCase()) ||
    f.category.toLowerCase().includes(formulaSearch.toLowerCase()) ||
    f.matricTopic.toLowerCase().includes(formulaSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto h-[calc(100dvh-7.5rem)] lg:h-[calc(100dvh-6rem)] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      
      {/* Top Header & Segmented Mode Switcher */}
      <div className="px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white shrink-0">
        
        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>AI Tutor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exam')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'exam'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Matric Exam Prep</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('formula')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'formula'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>CAPS Formulas</span>
          </button>
        </div>

        {/* Right Toolbar: Language Selector & Curriculum Indicator */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Languages className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={chatLang}
              onChange={(e) => setChatLang(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none border-none cursor-pointer pr-1"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>DBE Aligned</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 min-h-0 relative flex flex-col bg-slate-50/50 overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: CONVERSATIONAL TUTOR CHAT */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[88%] md:max-w-[75%] p-4 rounded-2xl shadow-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none font-medium text-xs md:text-sm'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none font-medium'
                    }`}>
                      {msg.role === 'user' ? msg.text : (
                        <div className="space-y-1.5">
                          {renderMarkdown(msg.text)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-2.5">
                      <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                      <span className="text-xs font-semibold text-slate-600">Formulating explanation...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 md:p-4 bg-white border-t border-slate-200 shrink-0">
                <form onSubmit={handleChatSend} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Ask a question about Physical Sciences (explaining in ${LANGUAGES.find(l => l.code === chatLang)?.name || 'English'})...`}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition font-medium"
                    disabled={chatLoading}
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || chatLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 md:px-5 rounded-xl flex items-center justify-center font-bold text-xs md:text-sm shadow-xs transition shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4 md:mr-1.5" />
                    <span className="hidden md:inline">Ask Tutor</span>
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* TAB 2: MATRIC EXAM CHALLENGE PREP */}
          {activeTab === 'exam' && (
            <motion.div
              key="exam-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col p-4 md:p-6 space-y-6 overflow-y-auto"
            >
              {/* Header */}
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base md:text-lg flex items-center gap-2">
                  <Award className="text-indigo-600 w-5 h-5" />
                  CAPS Matric Exam Challenger & Grader
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Generate mock Grade 12 Physical Sciences paper questions, provide calculations or definitions, and receive itemized marking against the official DBE memorandum.
                </p>
              </div>

              {/* Topic Picker and Generator */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-end gap-4 shadow-xs">
                <div className="w-full flex-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Select Syllabus Module
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs md:text-sm font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {MATRIC_TOPICS.map((topic, i) => (
                      <option key={i} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleGenerateChallenge}
                  disabled={examLoading}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-5 rounded-lg shadow-xs transition disabled:opacity-50 flex items-center justify-center gap-2 h-10 shrink-0 cursor-pointer"
                >
                  {examLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Drafting Paper...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      Generate Question
                    </>
                  )}
                </button>
              </div>

              {/* Simulation Challenge Content */}
              {challenge && (
                <div className="space-y-5">
                  {/* Scenario */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="font-extrabold text-sm md:text-base text-slate-900">{challenge.title}</h4>
                      <span className="bg-blue-50 text-blue-700 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-md border border-blue-200">
                        Mock Exam Question
                      </span>
                    </div>
                    <p className="text-slate-800 text-xs md:text-sm font-medium leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200/60">
                      {challenge.scenario}
                    </p>
                  </div>

                  {/* Questions and Inputs */}
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">Provide Your Answers</h4>
                    {challenge.questions.map((q, i) => (
                      <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs space-y-2.5">
                        <div className="flex items-start justify-between">
                          <span className="font-extrabold text-xs md:text-sm text-slate-900">
                            {q.num} {q.text}
                          </span>
                          <span className="font-mono text-xs text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded ml-2 shrink-0">
                            [{q.marks} Marks]
                          </span>
                        </div>
                        
                        <textarea
                          rows={3}
                          value={studentAnswers[q.num] || ''}
                          onChange={(e) => {
                            setStudentAnswers(prev => ({ ...prev, [q.num]: e.target.value }));
                          }}
                          placeholder="Type your answer, formulas, and units here..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs md:text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleGradeChallenge}
                      disabled={gradingLoading || Object.keys(studentAnswers).length === 0}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-xs transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {gradingLoading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Examiner Marking Answers...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Submit Answers for Official Grading
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Grading Results Panel */}
              {gradingResult && (
                <div className="bg-slate-900 text-white rounded-xl p-5 md:p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h4 className="font-bold text-blue-400 text-xs uppercase tracking-wider">Examiner Report Card</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">CAPS Physical Sciences Grade 12 Memorandum Audit</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl md:text-3xl font-black text-emerald-400">
                        {gradingResult.totalAwarded} / {gradingResult.maxMarks}
                      </div>
                      <div className="text-[11px] text-slate-400 font-semibold">
                        ({Math.round((gradingResult.totalAwarded / gradingResult.maxMarks) * 100)}%)
                      </div>
                    </div>
                  </div>

                  {/* Sub question details */}
                  <div className="space-y-3">
                    {gradingResult.gradingDetails.map((detail, idx) => (
                      <div key={idx} className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-lg space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-200">Question {detail.num}</span>
                          <span className="font-mono text-xs font-bold text-slate-300 bg-slate-700 px-2 py-0.5 rounded">
                            {detail.awarded} / {detail.max} Marks
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-normal">
                          {detail.feedback}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* General feedback */}
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-xs text-slate-300 uppercase tracking-wide mb-1">Examiner General Comments</h5>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {gradingResult.generalFeedback}
                    </p>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!challenge && !examLoading && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-white rounded-xl border border-slate-200">
                  <Award className="w-10 h-10 text-slate-300" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">No Active Mock Question</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                      Select a syllabus module above and click "Generate Question" to start your practice session.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: INTERACTIVE FORMULA SHEET */}
          {activeTab === 'formula' && (
            <motion.div
              key="formula-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col p-4 md:p-6 space-y-5 overflow-y-auto"
            >
              {/* Header & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base md:text-lg flex items-center gap-2">
                    <FileText className="text-blue-600 w-5 h-5" />
                    Interactive CAPS Formula Sheet
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any formula to inspect variable units and physical definitions.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formulaSearch}
                    onChange={(e) => setFormulaSearch(e.target.value)}
                    placeholder="Search formula or topic..."
                    className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs rounded-lg pl-9 pr-3 py-2 border border-slate-200 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Grid of Formulas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Physics Section */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Physics (Paper 1) Formulas
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {filteredFormulas.filter(f => f.paper === 'Physics').map((f, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedFormula(f)}
                        className={`text-left p-3.5 rounded-xl border transition cursor-pointer ${
                          selectedFormula?.formula === f.formula
                            ? 'bg-blue-50 border-blue-500 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                          {f.category}
                        </div>
                        <div className="font-mono text-sm font-bold text-slate-900 mb-0.5">{f.formula}</div>
                        <div className="text-xs text-slate-600 font-medium">{f.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chemistry Section */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-600"></span>
                    Chemistry (Paper 2) Formulas
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {filteredFormulas.filter(f => f.paper === 'Chemistry').map((f, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedFormula(f)}
                        className={`text-left p-3.5 rounded-xl border transition cursor-pointer ${
                          selectedFormula?.formula === f.formula
                            ? 'bg-pink-50 border-pink-500 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-pink-300'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-pink-600 uppercase tracking-wider mb-1">
                          {f.category}
                        </div>
                        <div className="font-mono text-sm font-bold text-slate-900 mb-0.5">{f.formula}</div>
                        <div className="text-xs text-slate-600 font-medium">{f.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Selected Formula Details Panel */}
              {selectedFormula && (
                <div className="bg-white border-2 border-slate-300 rounded-xl p-5 space-y-4 shadow-sm mt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{selectedFormula.name}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                        {selectedFormula.category} · Paper {selectedFormula.paper === 'Physics' ? '1' : '2'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedFormula(null)}
                      className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-center font-mono text-base md:text-lg font-bold text-slate-900">
                    {selectedFormula.formula}
                  </div>

                  {/* Variables */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                    <div className="space-y-1.5">
                      <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Symbol Guide</h5>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700">
                        {selectedFormula.variables.map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1.5">
                      <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SI Standard Units</h5>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700">
                        {selectedFormula.units.map((u, i) => (
                          <li key={i}>{u}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Physical meaning */}
                  <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-lg space-y-1">
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Physical Meaning</h5>
                    <p className="text-slate-700 text-xs leading-relaxed font-normal">
                      {selectedFormula.explanation}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      onClick={() => triggerExplanationFromFormula(selectedFormula.name, selectedFormula.formula)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Ask Tutor to Explain Concept
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedTopic(selectedFormula.matricTopic);
                        setActiveTab('exam');
                        handleGenerateChallenge();
                      }}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      Generate Practice Question
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Terminal, Code, Eye, Download, Copy, RotateCcw, Send, Play, Check, AlertCircle, Search, Atom, FlaskConical, Zap, BookOpen } from 'lucide-react';
import { generateDynamicSandboxLab } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface RefinementStep {
  prompt: string;
  timestamp: string;
}

interface CapsTemplate {
  id: string;
  title: string;
  discipline: 'Physics' | 'Chemistry';
  grade: 'Grade 12' | 'Grade 11' | 'Grade 10';
  badge: string;
  topic: string;
  summary: string;
  prompt: string;
}

const TEMPLATE_SUGGESTIONS: CapsTemplate[] = [
  {
    id: 'internal-resistance',
    title: 'Internal Resistance & Battery EMF',
    discipline: 'Physics',
    grade: 'Grade 12',
    badge: 'FAT Practical 1',
    topic: 'Electric Circuits (Paper 1)',
    summary: 'Adjust rheostat resistance to measure lost volts and determine battery EMF & internal resistance from the V-I gradient.',
    prompt: 'Create an interactive South African CAPS Grade 12 physics experiment for determining the Internal Resistance (r) and Electromotive Force (EMF, ε) of a battery. The circuit contains a battery of EMF=9V with internal resistance r=1.5Ω, a variable linear rheostat (2Ω to 50Ω), an ammeter, a voltmeter across the battery terminals, and a switch. Provide sliders to adjust the rheostat resistance, a switch toggle, real-time gauges for Terminal Potential Difference (V) and Current (I), a live data table recording (I, V) data points, and a real-time graph of V vs I showing the negative gradient line where -slope = r and y-intercept = EMF. Include a CAPS calculations panel showing V = EMF - Ir.'
  },
  {
    id: 'reaction-rates',
    title: 'Reaction Rates & Maxwell-Boltzmann',
    discipline: 'Chemistry',
    grade: 'Grade 12',
    badge: 'Core SBA Practical',
    topic: 'Reaction Kinetics (Paper 2)',
    summary: 'Investigate CaCO₃ + HCl gas volume rates with sliders for temperature, acid concentration, surface area, and catalyst.',
    prompt: 'Create an interactive CAPS Grade 12 chemistry lab simulating the reaction of calcium carbonate (CaCO3) marble chips with hydrochloric acid (HCl) to produce carbon dioxide (CO2) gas: CaCO3(s) + 2HCl(aq) -> CaCl2(aq) + H2O(l) + CO2(g). Include interactive controls for: Temperature (20°C to 70°C), HCl concentration (0.5M to 3.0M), Surface Area (large chunks vs powdered CaCO3), and Catalyst toggle. Include a dynamic Maxwell-Boltzmann distribution curve showing activation energy (Ea) shift with temperature/catalyst, an animated conical flask with gas syringe collecting CO2, and a real-time graph of Volume of CO2 vs Time with reaction rate gradient.'
  },
  {
    id: 'photoelectric-effect',
    title: 'Photoelectric Effect & Planck Constant',
    discipline: 'Physics',
    grade: 'Grade 12',
    badge: 'Matric Exam Focus',
    topic: 'Photons & Electrons (Paper 1)',
    summary: 'Adjust light wavelength & intensity on target metals (Cs, Zn, Pt) to observe threshold frequency and kinetic energy slopes.',
    prompt: 'Create an interactive CAPS Grade 12 Photoelectric Effect simulation. Setup features a vacuum tube with a metal photocathode, an anode, an ammeter, and an adjustable light source. Include controls for: Light wavelength/frequency (from Infrared 800nm to deep Ultraviolet 150nm), Light intensity (0% to 100%), and Target Metal selector (Cesium: 2.14eV, Zinc: 4.31eV, Platinum: 6.35eV, Copper: 4.70eV). Visually animate incident photons striking the cathode and ejected photoelectrons flying across to the anode if photon energy h*f exceeds work function W0. Include dynamic meters for Photon Energy (E=hf), Maximum Kinetic Energy (Ek_max = E - W0), and a real-time graph of Ek_max vs Light Frequency showing the threshold frequency (f0) cutoff and Planck\'s constant (h) slope.'
  },
  {
    id: 'chemical-equilibrium',
    title: 'Equilibrium & Le Châtelier Principle',
    discipline: 'Chemistry',
    grade: 'Grade 12',
    badge: 'Matric Exam Focus',
    topic: 'Equilibrium Systems (Paper 2)',
    summary: '2NO₂ (brown) ⇌ N₂O₄ (colorless) system. Shift equilibrium via temperature, syringe volume, and dynamic concentration graphs.',
    prompt: 'Create an interactive CAPS Grade 12 simulation of the gaseous equilibrium system: 2NO2(g) [Dark Brown] <=> N2O4(g) [Colorless], Delta H = -57.2 kJ/mol (Exothermic). Include a sealed gas syringe or chamber where users can adjust: Temperature (0°C ice bath to 100°C boiling water), Syringe Volume/Pressure (compression from 50ml down to 10ml), and Added NO2 moles. Animate the visual color shift of the gas (dark reddish-brown to pale yellow/colorless). Include a real-time concentration-time graph [NO2] and [N2O4] showing the immediate stress spike and subsequent Le Châtelier shift to new equilibrium, plus dynamic Kc and Qc value calculation.'
  },
  {
    id: 'doppler-effect',
    title: 'Doppler Effect Wave Visualizer',
    discipline: 'Physics',
    grade: 'Grade 12',
    badge: 'Paper 1 Core',
    topic: 'Waves & Sound (Paper 1)',
    summary: 'Ambulance siren wavefront compression/expansion with approach/recede frequency calculations and audio pitch generation.',
    prompt: 'Create an interactive CAPS Grade 12 Doppler Effect audio-visual simulation. An ambulance emits a siren at a source frequency fs=500Hz with sound speed v=340 m/s. Include controls for: Ambulance velocity vs (0 to 60 m/s), Observer position/velocity vL (stationary on sidewalk or moving), and Approach/Recede toggle. Render a 2D canvas showing circular sound wavefronts compressing ahead of the ambulance and stretching behind it. Calculate and display the observed frequency fL using the CAPS formula fL = ((v +- vL)/(v +- vs)) * fs. Include a real-time pitch tone audio synthesis (Web Audio API) or visual pitch bar, and a graph of frequency heard vs time as the source passes the observer.'
  },
  {
    id: 'galvanic-cell',
    title: 'Galvanic Cell (Zn-Cu Daniell Cell)',
    discipline: 'Chemistry',
    grade: 'Grade 12',
    badge: 'Core Practical',
    topic: 'Electrochemistry (Paper 2)',
    summary: 'Zn-Cu cell with salt bridge ion flow, anode mass loss, cathode plating, and standard reduction EMF potential calculations.',
    prompt: 'Create an interactive CAPS Grade 12 Galvanic Cell (Daniell Cell) simulation with Zinc (Zn/Zn2+) and Copper (Cu/Cu2+) half-cells connected by a U-tube salt bridge (KNO3) and external wire with a high-resistance voltmeter and light bulb. Include controls for: Half-cell metal pairs dropdown (e.g. Zn-Cu, Mg-Cu, Fe-Cu, Zn-Ag), Electrolyte molarity sliders (0.1M to 2.0M), and Temperature slider. Animate electron flow from anode to cathode, ion migration in the salt bridge (K+ to cathode, NO3- to anode), zinc electrode mass dissolving, and copper electrode plating. Display standard reduction potentials table reference, net cell reaction, and calculate standard cell EMF: E°cell = E°cathode - E°anode.'
  },
  {
    id: 'newtons-incline',
    title: "Newton's 2nd Law & Incline Friction",
    discipline: 'Physics',
    grade: 'Grade 11',
    badge: 'Mechanics Core',
    topic: 'Dynamics & Forces (Paper 1)',
    summary: 'Crate on ramp with adjustable angle (0°-60°), friction coefficients, free-body force vectors, and real-time velocity-time plots.',
    prompt: 'Create an interactive CAPS Grade 11/12 inclined plane mechanics lab. A crate of mass m sits on a ramp inclined at angle theta. Include interactive controls for: Ramp Angle (0° to 60°), Crate Mass (1kg to 20kg), Coefficient of Static/Kinetic Friction mu_s and mu_k (ice, polished wood, rubber), and Applied Pulling Force F_app (parallel to incline or at an angle). Display an interactive free-body force diagram showing Gravity components (Fg_parallel = mg*sin(theta), Fg_perpendicular = mg*cos(theta)), Normal Force N, Friction force f_k, and Net Force F_net. Include a Play/Pause simulation of the crate sliding, with live velocity and acceleration gauges, and a real-time velocity-time graph.'
  },
  {
    id: 'acid-base-titration',
    title: 'Acid-Base Titration & pH Curve',
    discipline: 'Chemistry',
    grade: 'Grade 12',
    badge: 'FAT Practical 2',
    topic: 'Acids & Bases (Paper 2)',
    summary: 'Standard 0.1M NaOH into 25ml HCl with stopcock flow slider, bromothymol blue color transition, and live pH titration curve.',
    prompt: 'Create an interactive CAPS Grade 12 Acid-Base Titration simulator. Apparatus includes a 50ml burette with 0.10M Sodium Hydroxide (NaOH) and a 250ml conical flask with 25.0ml Hydrochloric Acid (HCl) or Ethanoic Acid (CH3COOH) of unknown concentration. Add an interactive burette stopcock valve control (dropwise 0.1ml, steady drip, or continuous stream), magnetic stirrer toggle, and indicator selector (Bromothymol Blue, Phenolphthalein, Methyl Orange). Render realistic liquid meniscus, swirling flask color animation transitioning across the pH range, a digital pH meter, and a live pH vs Volume of Base Added titration curve showing the equivalence point and buffer region.'
  },
  {
    id: 'electrodynamics-generator',
    title: 'AC Generator vs DC Motor',
    discipline: 'Physics',
    grade: 'Grade 12',
    badge: 'Paper 1 Focus',
    topic: 'Electrodynamics (Paper 1)',
    summary: 'Armature coil rotating in magnetic field. Toggle slip-rings vs commutator to visualize induced AC sine waves vs DC output.',
    prompt: 'Create an interactive CAPS Grade 12 Electrodynamics 3D/2D visualizer for an AC Generator and DC Motor. Features a rectangular armature coil rotating inside a permanent magnetic field (N to S poles). Include controls to toggle between: AC Generator (with slip rings and carbon brushes) and DC Motor (with split-ring commutator and DC power source), Magnetic Field Strength slider (0.1T to 2.0T), Coil Area/Turns slider, and Rotation Speed RPM slider. Animate rotating magnetic flux lines, induced current direction via Fleming\'s Right-Hand Rule / Left-Hand Rule, and output a live oscilloscope graph of Alternating Voltage EMF(t) = EMF_max * sin(omega*t) or pulsating DC voltage.'
  },
  {
    id: 'boyles-law',
    title: "Boyle's Law & Kinetic Gas Theory",
    discipline: 'Chemistry',
    grade: 'Grade 11',
    badge: 'Paper 2 Core',
    topic: 'Ideal Gases (Paper 2)',
    summary: 'Gas syringe with particle collisions in container, P vs V hyperbolic curve, and P vs 1/V linear verification graph.',
    prompt: 'Create an interactive CAPS Grade 11 Ideal Gas Laws lab exploring Boyle\'s Law (P1V1 = P2V2 at constant T) and Charles\'s Law (V/T = k). The simulator features a sealed cylinder with a movable piston, thermometer, and pressure gauge. Include controls to adjust: Syringe Volume (10ml to 100ml), Gas Temperature (100K to 600K), and Number of gas moles. In a canvas, simulate microscopic gas particles bouncing elastically against the container walls with velocity proportional to sqrt(T). Generate real-time dual graphs: Pressure (P) vs Volume (V) showing the hyperbola, and Pressure (P) vs Inverse Volume (1/V) showing the straight line through the origin proving inverse proportionality.'
  }
];

export default function SandboxPage() {
  const [userInput, setUserInput] = useState('');
  const [activePrompt, setActivePrompt] = useState('');
  const [code, setCode] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [refinements, setRefinements] = useState<RefinementStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Physics' | 'Chemistry' | 'Grade 12'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Filter templates
  const filteredTemplates = TEMPLATE_SUGGESTIONS.filter(t => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Grade 12'
        ? t.grade === 'Grade 12'
        : t.discipline === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.badge.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Auto-scroll the chat refinement history
  const historyEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [refinements]);

  // Load a starting template
  useEffect(() => {
    if (!code) {
      // Start with a basic default HTML welcome state in the iframe
      const defaultState = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white flex flex-col items-center justify-center min-h-[400px] h-full p-8 font-sans">
  <div class="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden">
    <div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
    <div class="w-14 h-14 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-indigo-500/20">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    </div>
    <h1 class="text-2xl font-black tracking-tight text-white mb-2">VyLab AI Sandbox</h1>
    <p class="text-slate-400 text-sm leading-relaxed mb-6">Select a pre-built South African CAPS lab template from the left or write a custom prompt to generate an interactive, customized science simulation on the fly!</p>
    <div class="inline-flex items-center gap-2 text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-full font-semibold">
      <span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span> Ready for input
    </div>
  </div>
</body>
</html>`;
      setCode(defaultState);
    }
  }, [code]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleBuildSimulation(promptText: string) {
    if (!promptText.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setActivePrompt(promptText);
    
    // Save prompt to refinements
    const newStep: RefinementStep = {
      prompt: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRefinements(prev => [...prev, newStep]);
    setUserInput('');

    try {
      const generatedCode = await generateDynamicSandboxLab(promptText, history);
      setCode(generatedCode);
      if (generatedCode.includes('Simulation Generation Issue') || generatedCode.includes('Failed to Generate')) {
        setErrorMsg('Simulation generation encountered an issue. You can retry.');
      } else {
        setHistory(prev => [...prev, generatedCode]);
      }
      setActiveTab('preview');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Failed to generate simulation. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activePrompt.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 30)}_sim.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setCode('');
    setHistory([]);
    setRefinements([]);
    setActivePrompt('');
    setUserInput('');
    setErrorMsg(null);
  };

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-6.5rem)] xl:h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden rounded-2xl border border-slate-800">
      
      {/* ─── LEFT PANEL: CONTROLS & ITERATION ─── */}
      <div className="w-full xl:w-[420px] border-b xl:border-b-0 xl:border-r border-slate-800 flex flex-col bg-slate-900 shrink-0 h-1/2 xl:h-full">
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">AI Simulation Sandbox</h2>
              <p className="text-[10px] text-slate-400">Interactive Lab Sandbox</p>
            </div>
          </div>
          {(code && history.length > 0) && (
            <button 
              onClick={handleReset}
              title="Reset Sandbox"
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Refinements Log / Suggestions Container */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
          {refinements.length === 0 ? (
            // TEMPLATE SUGGESTIONS PAGE
            <div className="space-y-3">
              <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-3 flex gap-2.5">
                <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-indigo-200/90 leading-relaxed">
                  Select a CAPS practical below to generate a tailored physics or chemistry simulation with live graphs and interactive controls.
                </p>
              </div>

              {/* Search & Category Tabs */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search CAPS practicals (e.g. Doppler, Titration)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {(['All', 'Grade 12', 'Physics', 'Chemistry'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {cat === 'All' ? 'All Practicals' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  CAPS Lesson Templates ({filteredTemplates.length})
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {filteredTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleBuildSimulation(t.prompt)}
                    disabled={loading}
                    className="w-full text-left p-3 rounded-xl border border-slate-800/90 bg-slate-950/70 hover:bg-slate-850 hover:border-indigo-500/50 transition-all flex flex-col gap-1.5 shadow-sm group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start w-full gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 ${
                          t.discipline === 'Physics'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {t.discipline === 'Physics' ? <Zap className="w-2.5 h-2.5" /> : <FlaskConical className="w-2.5 h-2.5" />}
                          {t.discipline}
                        </span>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50">
                          {t.grade}
                        </span>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {t.badge}
                        </span>
                      </div>
                      <div className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition shrink-0">
                        <Play className="w-2.5 h-2.5 ml-0.5" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                        {t.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {t.summary}
                      </p>
                    </div>

                    <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                      Topic: {t.topic}
                    </div>
                  </button>
                ))}

                {filteredTemplates.length === 0 && (
                  <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                    No templates match "{searchQuery}". Try searching for another topic or clear the filter.
                  </div>
                )}
              </div>
            </div>
          ) : (
            // REFINEMENT LOG
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Refinement Log</span>
              
              <div className="space-y-2.5 max-h-[300px] xl:max-h-none overflow-y-auto">
                {refinements.map((step, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex gap-2.5 items-start">
                    <div className="w-5 h-5 bg-indigo-500/10 text-indigo-400 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">{step.prompt}</p>
                      <span className="text-[9px] text-slate-500 font-semibold">{step.timestamp}</span>
                    </div>
                  </div>
                ))}
                <div ref={historyEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Input Chat Area */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-2">
          {errorMsg && (
            <div className="flex items-center justify-between p-2 bg-red-950/40 border border-red-800/40 rounded-xl text-xs text-red-300">
              <div className="flex items-center gap-1.5 min-w-0">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="truncate">{errorMsg}</span>
              </div>
              {activePrompt && (
                <button
                  onClick={() => handleBuildSimulation(activePrompt)}
                  disabled={loading}
                  className="px-2 py-0.5 bg-red-800/60 hover:bg-red-700 rounded-md text-[10px] font-semibold text-white transition shrink-0 ml-2"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 p-2 bg-indigo-950/20 border border-indigo-900/20 rounded-xl text-xs text-indigo-400">
              <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Vylex AI is engineering simulator code...</span>
            </div>
          )}

          <div className="flex items-end gap-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1.5 focus-within:border-indigo-500 transition-colors">
            <textarea
              rows={2}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleBuildSimulation(userInput);
                }
              }}
              placeholder={refinements.length > 0 ? "Ask to refine it (e.g. 'Add a reset button' or 'Make the graph color red')..." : "Design a custom lab simulation..."}
              className="flex-1 bg-transparent border-none outline-none resize-none px-2 py-1 text-xs text-slate-100 placeholder-slate-500"
              disabled={loading}
            />
            <button
              onClick={() => handleBuildSimulation(userInput)}
              disabled={loading || !userInput.trim()}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-slate-800 disabled:text-slate-600 transition shrink-0 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ─── RIGHT PANEL: LIVE DISPLAY & CODE VIEW ─── */}
      <div className="flex-1 flex flex-col bg-slate-950 h-1/2 xl:h-full min-w-0">
        
        {/* Navigation & Controls */}
        <div className="h-12 border-b border-slate-800 px-4 flex items-center justify-between bg-slate-950 shrink-0">
          <div className="flex border border-slate-800 rounded-lg p-0.5 bg-slate-900">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition ${
                activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition ${
                activeTab === 'code' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Source Code</span>
            </button>
          </div>

          {code && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-850 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold transition"
              >
                {copySuccess ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-850 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold transition"
              >
                <Download className="w-3 h-3" />
                <span>Save HTML</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 min-h-0 relative">
          
          <AnimatePresence mode="wait">
            {activeTab === 'preview' ? (
              <motion.div 
                key="preview-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full bg-slate-950 p-4"
              >
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800">
                  {code ? (
                    <iframe
                      ref={iframeRef}
                      srcDoc={code}
                      sandbox="allow-scripts"
                      className="w-full h-full border-none bg-white"
                      title="AI Dynamic Simulation Runner"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-slate-900 text-slate-500 text-xs">
                      Live simulation display is waiting for generation...
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="code-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full p-4 overflow-hidden flex flex-col"
              >
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden flex flex-col">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800 shrink-0">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dynamic Component Code</span>
                  </div>
                  <textarea
                    readOnly
                    value={code}
                    className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-indigo-200 outline-none resize-none overflow-auto leading-relaxed"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}

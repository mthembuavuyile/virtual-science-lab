import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Terminal, Code, Eye, Download, Copy, RotateCcw, Send, Play, Check, AlertCircle } from 'lucide-react';
import { generateDynamicSandboxLab } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface RefinementStep {
  prompt: string;
  timestamp: string;
}

const TEMPLATE_SUGGESTIONS = [
  {
    title: 'Ticker-Timer Uniform Acceleration',
    prompt: 'Create a ticker-timer lab where a trolley rolls down an inclined ramp. Include variables to adjust the ramp angle (0 to 30 degrees), trolley mass, and frequency of the ticker (10Hz to 100Hz). Generate the ticker tape visual output dynamically showing dots spaced out as speed increases, and show a real-time table of positions, velocities, and a displacement-time graph.'
  },
  {
    title: 'Ohmic vs Non-Ohmic Conductor',
    prompt: 'Create a circuit setup with a variable power source, an ammeter, and a resistor that can be toggled between an Ohmic resistor (constant resistance) and a light bulb (Non-Ohmic conductor where resistance increases with temperature/current). Include sliders to adjust voltage (0V to 15V) and show a real-time graph of Current (I) vs Voltage (V) showing the straight line versus the curved bulb characteristics.'
  },
  {
    title: 'Acid-Base Titration Simulator',
    prompt: 'Create an interactive titration simulator. A burette is filled with 0.1M sodium hydroxide (NaOH) and a flask contains 25ml of hydrochloric acid (HCl) of unknown concentration. Add a slider to open/close the burette valve to drip NaOH into the flask. Include a Bromothymol Blue pH indicator color animation (yellow to green to blue) and a graph plotting pH vs volume of NaOH added.'
  },
  {
    title: 'Electrolytic Cell Setup',
    prompt: 'Create an electrolysis lab of copper sulfate solution using carbon electrodes. Show a visual beaker containing blue copper sulfate solution, cathode, and anode. Add a slider for applied voltage (0V to 6V). When current flows, show bubbles of oxygen at the anode, a red copper layer plating onto the cathode, and a graph of copper mass deposited over time according to current.'
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
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  async function handleBuildSimulation(promptText: string) {
    if (!promptText.trim()) return;
    setLoading(true);
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
      setHistory(prev => [...prev, generatedCode]);
      setActiveTab('preview');
    } catch (err) {
      console.error(err);
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
  };

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-6.5rem)] xl:h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden rounded-2xl border border-slate-800">
      
      {/* ─── LEFT PANEL: CONTROLS & ITERATION ─── */}
      <div className="w-full xl:w-96 border-b xl:border-b-0 xl:border-r border-slate-800 flex flex-col bg-slate-900 shrink-0 h-1/2 xl:h-full">
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">AI Simulation Sandbox</h2>
              <p className="text-[10px] text-slate-400">Claude-style dynamic widget generator</p>
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {refinements.length === 0 ? (
            // TEMPLATE SUGGESTIONS PAGE
            <div className="space-y-3">
              <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-3 flex gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-indigo-300/80 leading-relaxed">
                  Click a CAPS topic template below to build a dynamic physics/chemistry simulation instantly, or write custom instructions below.
                </p>
              </div>

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">CAPS Lesson Templates</span>
              <div className="grid grid-cols-1 gap-2.5">
                {TEMPLATE_SUGGESTIONS.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleBuildSimulation(t.prompt)}
                    disabled={loading}
                    className="w-full text-left p-3 rounded-xl border border-slate-800/80 bg-slate-900 hover:bg-slate-800/60 hover:border-slate-700 transition flex flex-col gap-1.5 shadow-sm group"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition">{t.title}</span>
                      <Play className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 transition" />
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {t.prompt}
                    </p>
                  </button>
                ))}
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

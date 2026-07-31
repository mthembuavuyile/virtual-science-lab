import React, { useState } from 'react';
import { Sparkles, Brain, Check, X, RefreshCw, BookOpen, ChevronRight, Globe, AlertCircle } from 'lucide-react';
import { analyzeExperiment, evaluateQuizAnswer } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface AnalyzeExperimentPanelProps {
  simName: string;
  state: Record<string, any>;
}

const LANGUAGES = [
  { code: 'English', name: 'English' },
  { code: 'Zulu', name: 'isiZulu' },
  { code: 'Xhosa', name: 'isiXhosa' },
  { code: 'Sepedi', name: 'Sepedi (Northern Sotho)' },
  { code: 'Afrikaans', name: 'Afrikaans' },
  { code: 'Slang', name: 'Kasi Slang / Tsotsitaal' }
];

export default function AnalyzeExperimentPanel({ simName, state }: AnalyzeExperimentPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState('English');
  const [analysis, setAnalysis] = useState<{
    conceptBreakdown: string;
    saContext: string;
    quiz: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };
  } | null>(null);

  // Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState<string>('');
  const [gradingLoading, setGradingLoading] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setNoteSaved(false);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setQuizFeedback('');
    try {
      const data = await analyzeExperiment(simName, state, selectedLang);
      if (data && data.conceptBreakdown) {
        setAnalysis(data);
      } else {
        setError('Received invalid data from AI. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the AI tutor. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (selectedOption === null || !analysis) return;
    setGradingLoading(true);
    try {
      const userAnswerText = analysis.quiz.options[selectedOption];
      const isCorrect = selectedOption === analysis.quiz.correctIndex;
      const feedback = await evaluateQuizAnswer(
        analysis.quiz.question,
        userAnswerText,
        isCorrect ? 'Correct! ' + analysis.quiz.explanation : 'Incorrect. ' + analysis.quiz.explanation
      );
      setQuizFeedback(feedback);
      setQuizSubmitted(true);
    } catch (err) {
      console.error(err);
      setQuizFeedback(selectedOption === analysis.quiz.correctIndex ? 'Correct!' : 'Incorrect.');
      setQuizSubmitted(true);
    } finally {
      setGradingLoading(false);
    }
  };

  const handleSaveToNotebook = () => {
    if (!analysis) return;
    try {
      const saved = localStorage.getItem('virtualLabNotebook');
      const currentNotes = saved ? JSON.parse(saved) : [];
      
      const newNote = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        content: `=== AI EXPERIMENT ANALYSIS ===\nLab: ${simName}\nLanguage: ${selectedLang}\nParameters: ${JSON.stringify(state, null, 2)}\n\n--- CONCEPT BREAKDOWN ---\n${analysis.conceptBreakdown}\n\n--- SOUTH AFRICAN CONTEXT ---\n${analysis.saContext}`
      };

      localStorage.setItem('virtualLabNotebook', JSON.stringify([newNote, ...currentNotes]));
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Floating Sparkle Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 sm:bottom-20 lg:bottom-6 right-3 sm:right-6 z-40 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full py-2.5 px-3.5 sm:py-3.5 sm:px-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-1.5 group font-semibold text-xs sm:text-sm border border-purple-500/20 cursor-pointer"
      >
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse shrink-0" />
        <span>Ask AI <span className="hidden xs:inline sm:inline">to Analyze</span></span>
      </button>

      {/* Slide-out Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md md:max-w-lg bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Brain className="text-purple-600 w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm md:text-base">Vylex AI Lab Co-Pilot</h3>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{simName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Panel Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-16 md:pb-6 space-y-6">
                {/* Language Select */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    Explanation Language / Metaphor
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setSelectedLang(l.code)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          selectedLang === l.code
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Analyzing simulation state...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Analyze Current State
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-800 text-xs">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                    <div>{error}</div>
                  </div>
                )}

                {/* Analysis Loading Animation */}
                {loading && (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin" />
                      <Brain className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-slate-800 text-sm">Consulting CAPS Syllabus...</h4>
                      <p className="text-xs text-slate-400 mt-1">Generating custom physics model explanation</p>
                    </div>
                  </div>
                )}

                {/* Analysis Display */}
                {!loading && analysis && (
                  <div className="space-y-6">
                    {/* Concept Breakdown Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <Brain className="w-5 h-5 text-purple-600" />
                        <h4 className="font-extrabold text-slate-900 text-sm md:text-base">Scientific Concept</h4>
                      </div>
                      <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line prose max-w-none">
                        {analysis.conceptBreakdown}
                      </div>

                      {/* Save to Notebook Button */}
                      <button
                        onClick={handleSaveToNotebook}
                        className={`w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border transition ${
                          noteSaved
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {noteSaved ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-500" /> Saved to session notebook!
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-4 h-4 text-slate-500" /> Save this explanation to Notebook
                          </>
                        )}
                      </button>
                    </div>

                    {/* South African Context Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 shadow-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇿🇦</span>
                        <h4 className="font-extrabold text-blue-900 text-sm">South African Context</h4>
                      </div>
                      <div className="text-blue-900 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                        {analysis.saContext}
                      </div>
                    </div>

                    {/* Interactive Quiz Question */}
                    <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <h4 className="font-extrabold text-amber-400 text-xs uppercase tracking-wider">Test Your Understanding</h4>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-400">Exam Prep</span>
                      </div>
                      <div className="text-sm font-bold leading-relaxed">{analysis.quiz.question}</div>
                      
                      <div className="space-y-2.5">
                        {analysis.quiz.options.map((opt, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              if (!quizSubmitted) setSelectedOption(index);
                            }}
                            disabled={quizSubmitted}
                            className={`w-full text-left p-3 rounded-xl text-xs transition border flex items-center justify-between ${
                              selectedOption === index
                                ? quizSubmitted
                                  ? index === analysis.quiz.correctIndex
                                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                                    : 'bg-red-950 border-red-500 text-red-300'
                                  : 'bg-amber-950/80 border-amber-500 text-amber-300'
                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-800/80'
                            }`}
                          >
                            <span>{opt}</span>
                            {selectedOption === index && (
                              quizSubmitted ? (
                                index === analysis.quiz.correctIndex ? (
                                  <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                ) : (
                                  <X className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                                )
                              ) : (
                                <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                              )
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Quiz Button */}
                      {!quizSubmitted ? (
                        <button
                          onClick={handleQuizSubmit}
                          disabled={selectedOption === null || gradingLoading}
                          className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 font-extrabold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2"
                        >
                          {gradingLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Evaluating...
                            </>
                          ) : (
                            'Submit Answer'
                          )}
                        </button>
                      ) : (
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-xs space-y-1">
                          <div className={`font-bold flex items-center gap-1.5 ${
                            selectedOption === analysis.quiz.correctIndex ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {selectedOption === analysis.quiz.correctIndex ? 'Correct!' : 'Incorrect'}
                          </div>
                          <div className="text-slate-300 leading-relaxed font-medium mt-1">{quizFeedback}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Initial State / Prompt to Analyze */}
                {!loading && !analysis && (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <Brain className="w-12 h-12 text-slate-300 animate-pulse" />
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Co-Pilot Offline</h4>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                        Configure your variables in the lab simulator and click the button above to receive a full AI review.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share2, PlusSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePWA } from '../../hooks/usePWA';

export default function PWAInstallBanner() {
  const { isInstallable, isStandalone, isIOS, showIOSPrompt, setShowIOSPrompt, triggerInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (isStandalone || dismissed || !isInstallable) {
    return null;
  }

  return (
    <>
      {/* ── Desktop & Mobile Floating Install Banner ── */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-16 lg:bottom-6 right-4 left-4 sm:left-auto sm:max-w-md z-40"
        >
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-blue-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-white truncate">Install VyLab App</h4>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                    Offline Ready
                  </span>
                </div>
                <p className="text-xs text-slate-300 truncate mt-0.5">
                  Run 36+ CAPS science labs without internet.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={triggerInstall}
                className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>Install</span>
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── iOS Home Screen Add Modal ── */}
      <AnimatePresence>
        {showIOSPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 text-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Install on iOS</h3>
                    <p className="text-xs text-slate-400">Safari Home Screen App</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSPrompt(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 my-5 text-sm text-slate-300">
                <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-xs">1. Tap the Share button</p>
                    <p className="text-xs text-slate-400">Located in Safari's bottom toolbar menu.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                  <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg shrink-0">
                    <PlusSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-xs">2. Select "Add to Home Screen"</p>
                    <p className="text-xs text-slate-400">Scroll down in options menu and tap Add.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-xs">3. Launch VyLab</p>
                    <p className="text-xs text-slate-400">Access offline science simulations anytime!</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSPrompt(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-semibold text-sm rounded-xl transition-colors cursor-pointer text-center"
              >
                Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

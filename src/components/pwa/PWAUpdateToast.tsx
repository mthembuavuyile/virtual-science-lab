import React from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePWA } from '../../hooks/usePWA';

export default function PWAUpdateToast() {
  const { needRefresh, updateServiceWorker, dismissUpdate } = usePWA();

  if (!needRefresh) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92vw]"
      >
        <div className="bg-slate-900 text-white p-3.5 px-4 rounded-2xl shadow-2xl border border-blue-500/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-xs text-white truncate">New VyLab Update Ready</p>
              <p className="text-[11px] text-slate-300 truncate">Reload to apply latest lab updates</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={updateServiceWorker}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Update</span>
            </button>
            <button
              onClick={dismissUpdate}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

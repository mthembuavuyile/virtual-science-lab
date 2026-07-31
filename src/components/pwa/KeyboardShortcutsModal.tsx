import React, { useEffect, useState } from 'react';
import { Keyboard, X, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle shortcuts modal on '?' or 'Shift + /' or 'Ctrl + K'
      if ((e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const shortcuts = [
    { key: '?', description: 'Toggle keyboard shortcuts menu' },
    { key: 'Space', description: 'Pause / Resume active experiment simulation' },
    { key: 'R', description: 'Reset current lab simulation to defaults' },
    { key: 'F', description: 'Toggle fullscreen lab view' },
    { key: 'M', description: 'Mute / Unmute experiment sound effects' },
    { key: 'Esc', description: 'Close modals / Exit fullscreen' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="Keyboard Shortcuts (?)"
        className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg transition-colors cursor-pointer hidden sm:flex items-center gap-1 text-xs"
      >
        <Keyboard className="w-4 h-4" />
        <span className="text-[11px] font-medium text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">?</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Keyboard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Keyboard Shortcuts</h3>
                    <p className="text-xs text-slate-500">Accelerate your SPA science lab experience</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-2.5">
                {shortcuts.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <span className="text-xs font-medium text-slate-700">{item.description}</span>
                    <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-white text-slate-800 border border-slate-300 rounded-md shadow-2xs">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Press <kbd className="font-mono text-slate-700 font-bold bg-slate-100 px-1 py-0.5 rounded">Esc</kbd> anytime to close</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

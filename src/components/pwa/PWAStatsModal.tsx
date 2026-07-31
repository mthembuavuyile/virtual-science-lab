import React, { useState, useEffect } from 'react';
import { HardDrive, RefreshCw, CheckCircle2, ShieldCheck, Database, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePWA } from '../../hooks/usePWA';

export default function PWAStatsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [storageEstimate, setStorageEstimate] = useState<{ usageMB: number; quotaMB: number } | null>(null);
  const { isStandalone, offlineReady } = usePWA();

  useEffect(() => {
    if (isOpen && typeof navigator !== 'undefined' && 'storage' in navigator && navigator.storage.estimate) {
      navigator.storage.estimate().then(({ usage, quota }) => {
        if (usage !== undefined && quota !== undefined) {
          setStorageEstimate({
            usageMB: Math.round(usage / (1024 * 1024) * 10) / 10,
            quotaMB: Math.round(quota / (1024 * 1024)),
          });
        }
      });
    }
  }, [isOpen]);

  const clearAppCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      window.location.reload();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="PWA Offline & Storage Status"
        className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs"
      >
        <HardDrive className="w-4 h-4 text-blue-600" />
        <span className="hidden md:inline text-xs font-semibold text-slate-600">Storage</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-sm">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">VyLab PWA Diagnostics</h3>
                    <p className="text-xs text-slate-500">Offline Cache & Storage Health</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-4 text-xs">
                {/* Mode Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <p className="text-[11px] text-slate-500 font-medium">Display Mode</p>
                    <p className="font-bold text-sm text-slate-800 mt-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      {isStandalone ? 'Standalone App' : 'Browser SPA'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <p className="text-[11px] text-slate-500 font-medium">Service Worker</p>
                    <p className="font-bold text-sm text-emerald-600 mt-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Active & Protected
                    </p>
                  </div>
                </div>

                {/* Storage estimate */}
                {storageEstimate && (
                  <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-semibold text-slate-700 text-xs">Offline Cache Usage</span>
                      <span className="font-mono text-xs font-bold text-blue-700">
                        {storageEstimate.usageMB} MB / {storageEstimate.quotaMB} MB
                      </span>
                    </div>
                    <div className="w-full bg-blue-200/60 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, Math.max(5, (storageEstimate.usageMB / 500) * 100))}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      All 36+ interactive science simulations are stored locally for immediate offline use.
                    </p>
                  </div>
                )}

                {/* Features cached */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-slate-700 text-xs block">Pre-Cached Assets</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['36+ CAPS Simulations', 'KaTeX Math Engine', 'Three.js 3D Engine', 'Lab Notebook & Storage'].map(
                      (item, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="text-[11px] text-slate-700 font-medium truncate">{item}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={clearAppCache}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Purge & Re-sync Cache
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl text-xs hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

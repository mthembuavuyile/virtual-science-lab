import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, HardDrive, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export default function OfflineIndicator() {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  return (
    <>
      {/* ── Header Badge Indicator ── */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all">
        {isOnline ? (
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border-emerald-200">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="hidden sm:inline">Online • PWA Cached</span>
            <Wifi className="w-3.5 h-3.5 sm:hidden" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border-amber-300">
            <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span className="text-xs">Offline Mode</span>
          </div>
        )}
      </div>

      {/* ── Reconnected Toast ── */}
      <AnimatePresence>
        {showReconnected && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-4 z-50 bg-emerald-950 text-emerald-100 border border-emerald-500/40 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Connection restored! All lab data synced.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900 font-sans relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[80px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-400/10 rounded-full blur-[80px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 flex flex-col items-center text-center max-w-lg w-full bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white/40"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
          className="w-24 h-24 bg-pink-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm"
        >
          <AlertTriangle className="w-12 h-12 text-pink-600" />
        </motion.div>

        <h1 className="text-8xl font-extrabold tracking-tight text-slate-900 mb-4">
          404
        </h1>
        
        <h2 className="text-3xl font-bold mb-4 text-slate-800">
          Page Not Found
        </h2>
        
        <p className="text-slate-600 mb-10 leading-relaxed text-lg">
          The page you're looking for doesn't exist, has been moved, or is temporarily unavailable. Let's get you back to the lab.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            to=".."
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-base font-semibold text-slate-700 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-base font-semibold text-white shadow-md shadow-blue-600/20"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

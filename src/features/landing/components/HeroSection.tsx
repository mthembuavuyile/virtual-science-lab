import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Shuffle, FileText, Beaker } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="pt-20 pb-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-6">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>CAPS & SACAI Aligned Virtual Science Laboratory</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-5xl mx-auto leading-[1.1]">
            South Africa's Complete <span className="text-blue-600">Physical Sciences</span> Virtual Lab.
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            Interactive STEM simulations, calibrated experimental apparatus, and official DBE-aligned formal SBA practical assessments for <strong>Grades 10–12</strong> learners, homeschooling parents, and matric educators.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/app" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-bold shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2">
              <Beaker className="w-5 h-5" />
              Launch Virtual Science Lab <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/app/labs" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-7 py-4 rounded-xl text-base font-bold shadow-sm transition-all flex items-center justify-center gap-2">
              Explore CAPS Simulators
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-2 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Umalusi, SACAI & DBE Moderation Layout
            </span>
            <span className="flex items-center gap-2 text-slate-700">
              <Shuffle className="w-4 h-4 text-indigo-600" />
              Calibrated Apparatus & Random Variance
            </span>
            <span className="flex items-center gap-2 text-slate-700">
              <FileText className="w-4 h-4 text-emerald-600" />
              Instant 4-Page Moderation Dossier PDF
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


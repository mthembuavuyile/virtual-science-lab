import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="pt-20 pb-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-5xl mx-auto leading-[1.1]">
            No Science Lab at Home? Complete Mandatory <span className="text-blue-600">Matric Practicals</span> Online.
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            The certified virtual practical assessment platform for <strong>Homeschooling Parents</strong> (Impaq, Brainline, CambriLearn) and <strong>Independent Matric Centers</strong>. Run calibrated apparatus, collect authentic jittered data, and export official <strong>4-page DBE Moderation Dossier PDFs</strong> in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/app/sba" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-bold shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2">
              Launch SBA Practical Hub <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/app/sba/gr12-internal-resistance" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-7 py-4 rounded-xl text-base font-bold shadow-sm transition-all flex items-center justify-center gap-2">
              Try Free Practical (Internal Resistance)
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-700">
              ✅ 100% Guaranteed Umalusi & SACAI Layout
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              ✅ Unique Anti-Plagiarism Random Variance
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              ✅ Instant 4-Page Moderation PDF
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

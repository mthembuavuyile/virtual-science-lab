import React from 'react';
import { Beaker, BookOpen, Zap } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-2 block">
            The End-to-End SBA Workflow
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            From Virtual Experiment to Certified Moderation PDF
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm">
            Designed specifically around Department of Basic Education (DBE) Subject Assessment Guidelines for Physical Sciences Grades 10–12.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Beaker className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Calibrated Digital Rigs</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tweak real physical parameters (rheostats, burette stopcocks, water baths) with calibrated instrument noise so every learner produces authentic, non-identical data tables.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
              <Zap className="text-indigo-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. Auto-Graphing & Gradients</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Interactive Cartesian canvas plots points, draws lines of best fit, calculates mathematical slopes, and extracts physical constants (internal resistance r, EMF E, refractive index n) directly on screen.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <BookOpen className="text-emerald-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. 1-Click Moderation PDF</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Evaluates answers against the official DBE marking rubric and downloads a formal 4-page A4 portfolio report ready for teacher sign-off and district moderation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

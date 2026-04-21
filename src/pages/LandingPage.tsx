import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Beaker, BookOpen, Presentation, ChevronRight, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Beaker className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">VyLab</span>
          </div>
          <nav className="hidden md:flex gap-6 font-medium text-slate-600 text-sm">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#curriculum" className="hover:text-blue-600 transition-colors">CAPS Curriculum</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Schools</a>
          </nav>
          <div className="flex gap-4 items-center">
            <Link to="/app" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Sign In</Link>
            <Link to="/app" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
              Go to App
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-24 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-tight">
                Your Pocket Science Laboratory
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Run real experiments from home using interactive simulators. Explore <span className="text-pink-600 font-semibold">Chemistry</span> and <span className="text-blue-600 font-semibold">Physics</span> without the need for expensive equipment. Perfectly aligned to the South African CAPS curriculum.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center shadow-sm">
                <Link to="/app" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
                  Launch Simulators <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-24 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Powerful STEM Modules</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Explore our diverse range of interactive science tools designed precisely for high school learners.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                  <Beaker className="text-pink-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Chemistry</h3>
                <p className="text-slate-600 leading-relaxed">Run pH indicating titrations, mix inorganic chemicals and observe precipitate formation in real-time visual simulations.</p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="text-blue-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Physics</h3>
                <p className="text-slate-600 leading-relaxed">Adjust voltages and resistance in Ohm's law circuits, or configure velocity and gravity in our 2D projectile kinematics labs.</p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="text-purple-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">AI Syllabus Tutor</h3>
                <p className="text-slate-600 leading-relaxed">Stuck on a concept? Chat with our AI tutor trained specifically on the CAPS physical science guidelines to guide your learning.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Beaker className="text-white w-5 h-5" />
            <span className="font-bold text-xl text-white">VyLab</span>
          </div>
          <p className="text-sm">Built for South African STEM Learners.</p>
        </div>
      </footer>
    </div>
  );
}

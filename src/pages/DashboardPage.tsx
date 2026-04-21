import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Beaker, Zap, MessageSquare } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 font-bold text-xs rounded-full mb-4 border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            System Online & Ready
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Welcome to VyLab</h1>
          <p className="text-slate-600 max-w-xl text-lg leading-relaxed mb-6">
            Access CAPS-aligned STEM simulators. Select a module below to start running interactive experiments directly in your browser.
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/app/chemistry')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm">
              Start Chemistry Lab
            </button>
            <button onClick={() => navigate('/app/physics')} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-6 rounded-lg transition-colors">
              Explore Physics
            </button>
          </div>
        </div>
        {/* Decorative Background Element */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl opacity-50 pointer-events-none"></div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Featured Simulators</h2>
        <span className="text-sm font-semibold text-slate-500">Curated for Grade 12</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col" onClick={() => navigate('/app/chemistry')}>
          <div className="h-32 bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Essential</div>
            <Beaker className="text-white w-12 h-12 opacity-90 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="text-xs font-bold text-pink-600 mb-2 uppercase tracking-wide">Chemistry</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Acids, Bases & Reactions</h3>
            <p className="text-slate-600 text-sm flex-1">Titration pH simulator & Inorganic qualitative mixing tests with visual indicators.</p>
            <div className="mt-6 text-sm font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">Open Lab &rarr;</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col" onClick={() => navigate('/app/physics')}>
          <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
            <Zap className="text-white w-12 h-12 opacity-90 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wide">Physics</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Circuits & Kinematics</h3>
            <p className="text-slate-600 text-sm flex-1">Construct Ohm's law circuits and simulate Projectile motion in 2D space.</p>
            <div className="mt-6 text-sm font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">Open Lab &rarr;</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col" onClick={() => navigate('/app/tutor')}>
          <div className="h-32 bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center relative overflow-hidden">
            <MessageSquare className="text-white w-12 h-12 opacity-90 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="text-xs font-bold text-purple-600 mb-2 uppercase tracking-wide">AI Guide</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">STEM Syllabus Tutor</h3>
            <p className="text-slate-600 text-sm flex-1">Ask your personalized AI tutor focused directly on the CAPS Physical Sciences syllabus.</p>
            <div className="mt-6 text-sm font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">Chat Now &rarr;</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

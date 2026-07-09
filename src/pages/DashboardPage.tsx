import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Beaker, Zap, MessageSquare, GraduationCap, ArrowRight, FlaskConical } from 'lucide-react';
import { labRegistry } from '../data/experiments';

export default function DashboardPage() {
  const navigate = useNavigate();

  // Pick 3 featured labs to showcase
  const featured = [
    labRegistry.find(l => l.id === 'electrodynamics')!,
    labRegistry.find(l => l.id === 'ohms-law')!,
    labRegistry.find(l => l.id === 'electrochemistry')!,
  ].filter(Boolean);

  const chemCount = labRegistry.filter(l => l.discipline === 'Chemistry').length;
  const physicsCount = labRegistry.filter(l => l.discipline === 'Physics').length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Welcome to VyLab</h1>
          <p className="text-slate-600 max-w-xl text-lg leading-relaxed mb-6">
            Access CAPS-aligned STEM simulators. Browse all {labRegistry.length} experiments or jump into a featured lab below.
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/app/labs')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Browse All Labs
            </button>
            <button onClick={() => navigate('/app/tutor')} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-6 rounded-lg transition-colors">
              Ask AI Tutor
            </button>
          </div>
        </div>
        {/* Decorative Background Element */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl opacity-50 pointer-events-none"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
          <div className="text-2xl font-extrabold text-blue-600">{labRegistry.length}</div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Total Labs</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
          <div className="text-2xl font-extrabold text-pink-600">{chemCount}</div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Chemistry</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
          <div className="text-2xl font-extrabold text-indigo-600">{physicsCount}</div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Physics</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Featured Simulators</h2>
        <button
          onClick={() => navigate('/app/labs')}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {featured.map((lab) => {
          const DIcon = lab.icon;
          return (
            <motion.div
              key={lab.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
              onClick={() => navigate(`/app/labs/${lab.id}`)}
            >
              <div className={`h-32 bg-gradient-to-br ${lab.gradient} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {lab.priority}
                </div>
                <DIcon className="text-white w-12 h-12 opacity-90 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wide">{lab.discipline} · Grade {lab.grade}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{lab.title}</h3>
                <p className="text-slate-600 text-sm flex-1">{lab.description}</p>
                <div className="mt-6 text-sm font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">Open Lab &rarr;</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

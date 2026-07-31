import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Beaker, Zap, MessageSquare, GraduationCap, ArrowRight, FlaskConical, Atom, TestTubes } from 'lucide-react';
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
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-blue-900/20 mb-8 relative overflow-hidden border border-blue-800/50">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)]" style={{ backgroundSize: '24px 24px' }}></div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500 rounded-full translate-x-1/3 -translate-y-1/4 blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-purple-500 rounded-full -translate-x-1/4 translate-y-1/3 blur-[80px] opacity-10 pointer-events-none"></div>
        
        <div className="relative z-10 text-white">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight text-white">Welcome to VyLab</h1>
          <p className="text-blue-100/80 max-w-xl text-lg leading-relaxed mb-8 font-medium">
            Access CAPS-aligned STEM simulators. Browse all {labRegistry.length} experiments or jump into a featured lab below.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate('/app/labs')} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center gap-2 hover:-translate-y-0.5">
              <GraduationCap className="w-5 h-5" />
              Browse All Labs
            </button>
            <button onClick={() => navigate('/app/tutor')} className="bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white font-semibold py-3 px-6 rounded-xl transition-all hover:-translate-y-0.5">
              Ask AI Tutor
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <motion.div whileHover={{ y: -4 }} className="bg-white rounded-lg p-5 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group flex flex-col items-center justify-center min-h-[120px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <TestTubes className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500/5 group-hover:text-blue-500/10 group-hover:scale-110 transition-all duration-500 -rotate-12" />
          <div className="relative z-10 flex items-center gap-3 mb-1">
            <TestTubes className="w-8 h-8 text-blue-500" />
            <span className="text-4xl font-black text-slate-900 tracking-tight">{labRegistry.length}</span>
          </div>
          <div className="relative z-10 text-xs font-bold text-slate-400 uppercase tracking-wider mt-1.5">Total Labs</div>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-white rounded-lg p-5 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group flex flex-col items-center justify-center min-h-[120px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-pink-500"></div>
          <FlaskConical className="absolute -right-4 -bottom-4 w-24 h-24 text-pink-500/5 group-hover:text-pink-500/10 group-hover:scale-110 transition-all duration-500 rotate-12" />
          <div className="relative z-10 flex items-center gap-3 mb-1">
            <FlaskConical className="w-8 h-8 text-pink-500" />
            <span className="text-4xl font-black text-slate-900 tracking-tight">{chemCount}</span>
          </div>
          <div className="relative z-10 text-xs font-bold text-slate-400 uppercase tracking-wider mt-1.5">Chemistry</div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-white rounded-lg p-5 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group flex flex-col items-center justify-center min-h-[120px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
          <Atom className="absolute -right-4 -bottom-4 w-24 h-24 text-purple-500/5 group-hover:text-purple-500/10 group-hover:scale-110 transition-all duration-500 animate-spin-slow" />
          <div className="relative z-10 flex items-center gap-3 mb-1">
            <Atom className="w-8 h-8 text-purple-500" />
            <span className="text-4xl font-black text-slate-900 tracking-tight">{physicsCount}</span>
          </div>
          <div className="relative z-10 text-xs font-bold text-slate-400 uppercase tracking-wider mt-1.5">Physics</div>
        </motion.div>
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

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {featured.map((lab) => {
          const DIcon = lab.icon;
          return (
            <motion.div
              key={lab.id}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all cursor-pointer group flex flex-col"
              onClick={() => navigate(`/app/labs/${lab.id}`)}
            >
              <div className={`h-40 bg-gradient-to-br ${lab.gradient} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)]" style={{ backgroundSize: '16px 16px' }}></div>
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm border border-white/20">
                  {lab.priority}
                </div>
                <DIcon className="text-white w-14 h-14 opacity-95 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-out drop-shadow-md relative z-10" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <div className="p-6 flex-1 flex flex-col bg-white">
                <div className="text-xs font-black text-blue-600 mb-2.5 uppercase tracking-wider flex items-center gap-2">
                   <span>{lab.discipline}</span>
                   <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                   <span>Grade {lab.grade}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2.5 tracking-tight group-hover:text-blue-600 transition-colors">{lab.title}</h3>
                <p className="text-slate-500 text-sm flex-1 leading-relaxed">{lab.description}</p>
                <div className="mt-6 text-sm font-extrabold text-blue-600 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  Open Simulator <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

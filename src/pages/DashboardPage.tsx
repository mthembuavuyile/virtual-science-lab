import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Beaker, Zap, MessageSquare, GraduationCap, ArrowRight, FlaskConical, Atom, TestTubes } from 'lucide-react';
import { labRegistry } from '../data/experiments';

function getTemporalGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 22) return 'Good evening';
  return 'Working late?';
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const greeting = getTemporalGreeting();

  // Featured labs to showcase on home page
  const featuredIds = [
    'g10-chemical-bonding',
    'g11-ideal-gases',
    'electrochemistry',
    'g10-heating-curves',
    'g10-atom-periodic',
    'ohms-law',
    'g12-momentum',
    'g12-doppler',
    'electrodynamics',
  ];

  const featured = featuredIds
    .map(id => labRegistry.find(l => l.id === id))
    .filter(Boolean);

  const chemCount = labRegistry.filter(l => l.discipline === 'Chemistry').length;
  const physicsCount = labRegistry.filter(l => l.discipline === 'Physics').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-slate-900 p-6 sm:p-8 md:p-10 rounded-2xl shadow-sm relative overflow-hidden border border-slate-800">
        <div className="relative z-10 text-white">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1 block">
            {greeting} — Physical Sciences Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 tracking-tight text-white">
            Welcome to VyLab
          </h1>
          <p className="text-slate-300 max-w-xl text-sm sm:text-base leading-relaxed mb-6 font-normal">
            Access CAPS-aligned STEM simulators. Browse all {labRegistry.length} experiments, complete formal SBA practicals, or consult the AI syllabus tutor.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/app/labs')} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs text-xs sm:text-sm">
              <GraduationCap className="w-4 h-4" />
              Browse All Labs
            </button>
            <button onClick={() => navigate('/app/sba')} className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-5 rounded-xl transition flex items-center gap-2 cursor-pointer text-xs sm:text-sm">
              <Beaker className="w-4 h-4" />
              SBA Practical Hub
            </button>
            <button onClick={() => navigate('/app/tutor')} className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold py-2.5 px-5 rounded-xl transition flex items-center gap-2 cursor-pointer text-xs sm:text-sm">
              <MessageSquare className="w-4 h-4" />
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {featured.map((lab) => {
          const DIcon = lab.icon;
          return (
            <motion.div
              key={lab.id}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all cursor-pointer group flex flex-col"
              onClick={() => navigate(`/app/labs/${lab.id}`)}
            >
              <div className="h-40 bg-slate-800 flex items-center justify-center relative overflow-hidden">
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

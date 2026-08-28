import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { labRegistry } from '../../../data/experiments';

export function FeaturedSimulatorsSection() {
  return (
    <section id="featured-simulators" className="py-20 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-2 block">
              Interactive STEM Modules
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Featured Simulators
            </h2>
          </div>
          <Link
            to="/app/labs"
            className="mt-4 md:mt-0 text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            Explore All CAPS Simulators <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            'g10-chemical-bonding',
            'g11-ideal-gases',
            'electrochemistry',
            'g10-heating-curves',
            'g10-atom-periodic',
            'ohms-law',
            'g12-momentum',
            'g12-doppler',
            'electrodynamics',
          ]
            .map(id => labRegistry.find(l => l.id === id))
            .filter(Boolean)
            .map(lab => {
              if (!lab) return null;
              const DIcon = lab.icon;
              return (
                <Link
                  key={lab.id}
                  to={`/app/labs/${lab.id}`}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden transition-all group flex flex-col hover:-translate-y-1 shadow-sm"
                >
                  <div className="h-32 bg-slate-800 flex flex-col items-center justify-center relative">
                    <div className="absolute top-3 left-3 bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Gr {lab.grade} {lab.discipline}
                    </div>
                    <DIcon className="text-blue-500 w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col bg-slate-900">
                    <h3 className="text-base font-bold text-slate-100 mb-2">
                      {lab.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed flex-1 mb-4">
                      {lab.description}
                    </p>
                    <div className="text-xs font-semibold text-blue-400 flex items-center gap-1.5 mt-auto">
                      Launch Module <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </section>
  );
}

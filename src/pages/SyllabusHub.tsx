import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, FlaskConical, Zap, GraduationCap, LayoutGrid } from 'lucide-react';
import { labRegistry, Discipline } from '../data/experiments';

type GradeFilter = 'all' | '10' | '11' | '12';
type DisciplineFilter = 'all' | Discipline;

export default function SyllabusHub() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const gradeFilter = (searchParams.get('grade') as GradeFilter) || 'all';
  const disciplineFilter = (searchParams.get('discipline') as DisciplineFilter) || 'all';
  const searchQuery = searchParams.get('q') || '';

  const updateFilters = (newGrade?: GradeFilter, newDiscipline?: DisciplineFilter, newSearch?: string) => {
    const params = new URLSearchParams(searchParams);
    const g = newGrade !== undefined ? newGrade : gradeFilter;
    const d = newDiscipline !== undefined ? newDiscipline : disciplineFilter;
    const q = newSearch !== undefined ? newSearch : searchQuery;

    if (g && g !== 'all') params.set('grade', g); else params.delete('grade');
    if (d && d !== 'all') params.set('discipline', d); else params.delete('discipline');
    if (q && q.trim()) params.set('q', q); else params.delete('q');

    setSearchParams(params, { replace: true });
  };

  const filteredLabs = useMemo(() => {
    return labRegistry.filter(lab => {
      // Grade filter
      if (gradeFilter !== 'all' && lab.grade !== Number(gradeFilter)) return false;
      // Discipline filter
      if (disciplineFilter !== 'all' && lab.discipline !== disciplineFilter) return false;
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          lab.title.toLowerCase().includes(q) ||
          lab.description.toLowerCase().includes(q) ||
          lab.unitTitle.toLowerCase().includes(q) ||
          lab.simulations.some(s => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [gradeFilter, disciplineFilter, searchQuery]);

  const priorityColor = (p: string) => {
    if (p === 'Critical') return 'bg-red-50 text-red-700 border-red-200';
    if (p === 'High') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  const disciplineIcon = (d: Discipline) => {
    return d === 'Chemistry' ? FlaskConical : Zap;
  };

  const gradeOptions: { value: GradeFilter; label: string }[] = [
    { value: 'all', label: 'All Grades' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' },
  ];

  const disciplineOptions: { value: DisciplineFilter; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: 'all', label: 'All', icon: LayoutGrid },
    { value: 'Chemistry', label: 'Chemistry', icon: FlaskConical },
    { value: 'Physics', label: 'Physics', icon: Zap },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 mb-1.5 flex items-center gap-2 lg:gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 lg:p-2 rounded-lg">
            <GraduationCap className="text-white w-5 h-5 lg:w-6 lg:h-6" />
          </div>
          Syllabus Hub
        </h1>
        <p className="text-slate-500 text-xs lg:text-sm">
          All CAPS-aligned experiments in one place. Filter by grade, discipline, or search to find your lab.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 lg:p-4 mb-6 shadow-sm space-y-3 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => updateFilters(undefined, undefined, e.target.value)}
            placeholder="Search experiments, topics, simulations..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>

        {/* Discipline Tabs */}
        <div className="scroll-tabs flex bg-slate-100 p-1 rounded-lg shrink-0">
          {disciplineOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateFilters(undefined, opt.value, undefined)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                disciplineFilter === opt.value
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <opt.icon className="w-3.5 h-3.5" />
              {opt.label}
            </button>
          ))}
        </div>

        {/* Grade Tabs */}
        <div className="scroll-tabs flex bg-slate-100 p-1 rounded-lg shrink-0">
          {gradeOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateFilters(opt.value, undefined, undefined)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                gradeFilter === opt.value
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-slate-500">
          {filteredLabs.length} experiment{filteredLabs.length !== 1 ? 's' : ''} found
        </p>
        {(gradeFilter !== 'all' || disciplineFilter !== 'all' || searchQuery) && (
          <button
            onClick={() => updateFilters('all', 'all', '')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Lab Grid */}
      {filteredLabs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLabs.map((lab, i) => {
            const DIcon = lab.icon;
            return (
              <motion.div
                key={lab.id}
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/app/labs/${lab.id}`)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                {/* Gradient Top */}
                <div className={`h-24 bg-gradient-to-br ${lab.gradient} flex items-center justify-between px-5 relative overflow-hidden`}>
                  <div>
                    <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">{lab.unit}</span>
                    <div className="inline-flex ml-2 text-[9px] font-bold px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-sm">
                      {lab.priority}
                    </div>
                    <div className={`inline-flex ml-2 text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-sm ${
                      !lab.id.startsWith('g10-') && !lab.id.startsWith('g11-') && !lab.id.startsWith('g12-')
                        ? 'bg-emerald-500/25 text-emerald-100 border border-emerald-400/20'
                        : 'bg-indigo-500/25 text-indigo-100 border border-indigo-400/20'
                    }`}>
                      {!lab.id.startsWith('g10-') && !lab.id.startsWith('g11-') && !lab.id.startsWith('g12-')
                        ? 'Full Sim'
                        : 'Guide + Sim'
                      }
                    </div>
                    <div className="block mt-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/15 text-white/80 backdrop-blur-sm">
                        Grade {lab.grade} · {lab.discipline}
                      </span>
                    </div>
                  </div>
                  <DIcon className="text-white w-10 h-10 opacity-80 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{lab.title}</h3>
                  <p className="text-xs text-slate-500 flex-1 mb-4">{lab.description}</p>

                  {/* Simulation pills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {lab.simulations.slice(0, 3).map(s => (
                      <span key={s} className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                    {lab.simulations.length > 3 && (
                      <span className="text-[9px] font-bold text-slate-400 px-1">+{lab.simulations.length - 3}</span>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                    Open Lab <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">No experiments found</h3>
          <p className="text-sm text-slate-500">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}

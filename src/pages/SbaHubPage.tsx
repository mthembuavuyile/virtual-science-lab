import React, { useState } from 'react';
import { sbaPracticals } from '../data/sba-practicals';
import { SbaPractical, Discipline } from '../types/sba';
import { 
  FileText, 
  Award, 
  ChevronRight, 
  ShieldCheck, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

export default function SbaHubPage() {
  const { t } = useLanguage();
  const [selectedDiscipline, setSelectedDiscipline] = useState<'All' | Discipline>('All');
  const [selectedGrade, setSelectedGrade] = useState<number | 'All'>('All');

  const filteredPracticals = sbaPracticals.filter(p => {
    if (selectedDiscipline !== 'All' && p.discipline !== selectedDiscipline) return false;
    if (selectedGrade !== 'All' && p.grade !== selectedGrade) return false;
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Hero Header */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-sm relative overflow-hidden border border-slate-800">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>CAPS & SACAI Formal Assessment Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {t('hub_title')}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {t('hub_subtitle')}
          </p>

          <div className="pt-2 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-400/10 border border-emerald-300/20 text-emerald-200 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" /> All practicals are free to use
          </div>
        </div>

        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <FileText className="w-56 h-56 text-white" />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Filter className="w-4 h-4 text-slate-400" /> {t('hub_filter_subject')}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'Physics', 'Chemistry'] as const).map(disc => (
            <button
              key={disc}
              onClick={() => setSelectedDiscipline(disc as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedDiscipline === disc
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {disc === 'All' ? t('hub_all') : disc}
            </button>
          ))}

          <span className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {(["All", 10, 11, 12] as const).map(gr => (
            <button
              key={String(gr)}
              onClick={() => setSelectedGrade(gr as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedGrade === gr
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {gr === 'All' ? t('hub_all_grades') : `${t('common_grade')} ${gr}`}
            </button>
          ))}
        </div>
      </div>

      {/* Practicals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPracticals.map(practical => {
          return (
            <div
              key={practical.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {practical.capsTaskNumber}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Free access
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">
                  {practical.title}
                </h3>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {practical.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{practical.discipline} • {t('common_grade')} {practical.grade}</span>
                  <span className="font-bold text-slate-700">{practical.marks} {t('hub_marks')}</span>
                </div>
              </div>

              <div className="mt-5 pt-2">
                <Link
                  to={`/app/sba/${practical.id}`}
                  className="w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  {t('sba_launch')} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compliance & Verification Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">
              Umalusi, SACAI & DBE Moderation Layout
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Every exported PDF includes experimental verification hashes, raw data records, and formal DBE marksheets.
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 shrink-0">
          Free access included
        </span>
      </div>
    </div>
  );
}


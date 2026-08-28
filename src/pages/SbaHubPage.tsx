import React, { useState } from 'react';
import { sbaPracticals } from '../data/sba-practicals';
import { SbaPractical, Discipline } from '../types/sba';
import { isPracticalUnlocked } from '../lib/license-store';
import PricingModal from '../components/sba/PricingModal';
import { 
  FileText, 
  Award, 
  CheckCircle2, 
  Lock, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  BookOpen,
  Filter,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SbaHubPage() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<'All' | Discipline>('All');
  const [selectedGrade, setSelectedGrade] = useState<number | 'All'>('All');
  const [pricingOpen, setPricingOpen] = useState(false);
  const [selectedForPurchase, setSelectedForPurchase] = useState<SbaPractical | undefined>(undefined);

  const filteredPracticals = sbaPracticals.filter(p => {
    if (selectedDiscipline !== 'All' && p.discipline !== selectedDiscipline) return false;
    if (selectedGrade !== 'All' && p.grade !== selectedGrade) return false;
    return true;
  });

  const handleUnlockClick = (p: SbaPractical, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedForPurchase(p);
    setPricingOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              CAPS • SACAI • IEB Moderation Compliance Engine
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Prescribed Formal SBA Practicals & Automated Moderation
            </h1>
            <p className="text-sm md:text-base text-slate-300">
              Complete mandatory Grade 10–12 Physical Sciences practical tasks online with calibrated apparatus, anti-plagiarism unique variance, auto-marking, and formal 4-page moderation PDF exports.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => { setSelectedForPurchase(undefined); setPricingOpen(true); }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Unlock All Practical Packs (R349)
              </button>
              <Link
                to="/app/sba/gr12-internal-resistance"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition flex items-center gap-1.5"
              >
                Try Free Practical Demo <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
            <FileText className="w-64 h-64 text-white" />
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter className="w-4 h-4" /> Filter by Subject:
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Physics', 'Chemistry'].map(disc => (
              <button
                key={disc}
                onClick={() => setSelectedDiscipline(disc as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedDiscipline === disc
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {disc}
              </button>
            ))}

            <span className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

            {['All', 10, 11, 12].map(gr => (
              <button
                key={String(gr)}
                onClick={() => setSelectedGrade(gr as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedGrade === gr
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {gr === 'All' ? 'All Grades' : `Grade ${gr}`}
              </button>
            ))}
          </div>
        </div>

        {/* Practicals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPracticals.map(practical => {
            const unlocked = isPracticalUnlocked(practical.id);

            return (
              <div
                key={practical.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {practical.capsTaskNumber}
                    </span>
                    {practical.isFree ? (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        Free Trial Lab
                      </span>
                    ) : unlocked ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> R99 Pass
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {practical.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {practical.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>{practical.discipline} • Gr {practical.grade}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{practical.marks} Marks</span>
                  </div>
                </div>

                <div className="mt-5 pt-3">
                  <Link
                    to={`/app/sba/${practical.id}`}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      unlocked || practical.isFree
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {unlocked || practical.isFree ? (
                      <>
                        Launch SBA Practical <ChevronRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-400" /> Start Lab (R99 / R349)
                      </>
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Homeschooler & Tutor Peace of Mind Guarantee */}
        <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                100% Guaranteed Umalusi, SACAI & DBE Moderation Layout
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Every exported PDF contains full experimental verification hashes, unique jittered raw data, and formal DBE marksheets.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { setSelectedForPurchase(undefined); setPricingOpen(true); }}
            className="px-5 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition shrink-0"
          >
            Get Annual Grade Pass (R349)
          </button>
        </div>

      </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={pricingOpen}
        onClose={() => setPricingOpen(false)}
        practicalTitle={selectedForPurchase?.title}
        practicalId={selectedForPurchase?.id}
        onSuccessUnlock={() => {}}
      />
    </div>
  );
}

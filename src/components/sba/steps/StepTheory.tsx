import React from 'react';
import { SbaPractical, TheoryAnswers, StudentInfo } from '../../../types/sba';
import { User, School, Calendar, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface StepTheoryProps {
  practical: SbaPractical;
  studentInfo: StudentInfo;
  onStudentInfoChange: (info: StudentInfo) => void;
  theory: TheoryAnswers;
  onTheoryChange: (theory: TheoryAnswers) => void;
}

export default function StepTheory({
  practical,
  studentInfo,
  onStudentInfoChange,
  theory,
  onTheoryChange
}: StepTheoryProps) {
  const updateStudent = (field: keyof StudentInfo, value: any) => {
    onStudentInfoChange({ ...studentInfo, [field]: value });
  };

  const updateTheory = (field: keyof TheoryAnswers, value: any) => {
    onTheoryChange({ ...theory, [field]: value });
  };

  const updateControlledVar = (index: number, val: string) => {
    const updated = [...theory.controlledVars];
    updated[index] = val;
    onTheoryChange({ ...theory, controlledVars: updated });
  };

  const addControlledVar = () => {
    if (theory.controlledVars.length >= 4) return;
    onTheoryChange({ ...theory, controlledVars: [...theory.controlledVars, ''] });
  };

  return (
    <div className="space-y-6">
      {/* Student Details Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-4">
          <User className="w-4 h-4" />
          Candidate & Moderation Metadata (Page 1 Details)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Learner Full Name *
            </label>
            <input
              type="text"
              value={studentInfo.fullName}
              onChange={e => updateStudent('fullName', e.target.value)}
              placeholder="e.g. Sipho Ndlovu"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              ID / SACAI / Matric Number *
            </label>
            <input
              type="text"
              value={studentInfo.idOrSacaiNumber}
              onChange={e => updateStudent('idOrSacaiNumber', e.target.value)}
              placeholder="e.g. 0504125890082"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              School / Distance Learning Center
            </label>
            <input
              type="text"
              value={studentInfo.schoolOrCenter}
              onChange={e => updateStudent('schoolOrCenter', e.target.value)}
              placeholder="e.g. Impaq / Brainline / Home"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assessment Date
            </label>
            <input
              type="date"
              value={studentInfo.assessmentDate}
              onChange={e => updateStudent('assessmentDate', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Aim & Scientific Problem */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Prescribed DBE Aim
          </span>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            {practical.aim}
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span>1. Investigative Question * (2 Marks)</span>
            <span className="text-[11px] text-slate-400 font-normal">Must be phrased as a question (?)</span>
          </label>
          <input
            type="text"
            value={theory.investigativeQuestion}
            onChange={e => updateTheory('investigativeQuestion', e.target.value)}
            placeholder={`e.g. ${practical.expectedInvestigativeQuestion}`}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span>2. Scientific Hypothesis * (2 Marks)</span>
            <span className="text-[11px] text-slate-400 font-normal">State expected relationship with scientific rationale</span>
          </label>
          <textarea
            rows={2}
            value={theory.hypothesis}
            onChange={e => updateTheory('hypothesis', e.target.value)}
            placeholder={`e.g. ${practical.expectedHypothesisPattern}`}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Identification of Variables */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4">
          3. Identification of Variables (3 Marks)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Independent Variable (What you manipulate) *
            </label>
            <input
              type="text"
              value={theory.independentVar}
              onChange={e => updateTheory('independentVar', e.target.value)}
              placeholder={`e.g. ${practical.variables.independent.name} (${practical.variables.independent.symbol})`}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">Hint: {practical.variables.independent.description}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Dependent Variable (What you measure) *
            </label>
            <input
              type="text"
              value={theory.dependentVar}
              onChange={e => updateTheory('dependentVar', e.target.value)}
              placeholder={`e.g. ${practical.variables.dependent.name} (${practical.variables.dependent.symbol})`}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">Hint: {practical.variables.dependent.description}</p>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Controlled / Fixed Variables (Minimum 2 required)
          </label>
          <div className="space-y-2">
            {theory.controlledVars.map((cVar, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="w-6 h-9 flex items-center justify-center text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={cVar}
                  onChange={e => updateControlledVar(idx, e.target.value)}
                  placeholder={`e.g. ${practical.variables.controlled[idx]?.name || 'Ambient Temperature'}`}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          {theory.controlledVars.length < 4 && (
            <button
              type="button"
              onClick={addControlledVar}
              className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              + Add another controlled variable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { SbaPractical, TheoryAnswers, StudentInfo } from '../../../types/sba';
import { User, HelpCircle, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

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
  const { t } = useLanguage();

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

  // Shared input class — always light, high contrast, no dark mode
  const inputClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
  const textareaClass = "w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1";
  const cardClass = "bg-white border border-slate-200 rounded-xl p-5 shadow-sm";

  return (
    <div className="space-y-5">
      {/* Student Details Card */}
      <div className={cardClass}>
        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2 mb-4">
          <User className="w-4 h-4" />
          {t('theory_candidate_title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>{t('theory_full_name')}</label>
            <input
              type="text"
              value={studentInfo.fullName}
              onChange={e => updateStudent('fullName', e.target.value)}
              placeholder="e.g. Sipho Ndlovu"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t('theory_id_number')}</label>
            <input
              type="text"
              value={studentInfo.idOrSacaiNumber}
              onChange={e => updateStudent('idOrSacaiNumber', e.target.value)}
              placeholder="e.g. 0504125890082"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t('theory_school')}</label>
            <input
              type="text"
              value={studentInfo.schoolOrCenter}
              onChange={e => updateStudent('schoolOrCenter', e.target.value)}
              placeholder="e.g. Impaq / Brainline / Home"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t('theory_date')}</label>
            <input
              type="date"
              value={studentInfo.assessmentDate}
              onChange={e => updateStudent('assessmentDate', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Aim & Scientific Problem */}
      <div className={`${cardClass} space-y-4`}>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            {t('theory_prescribed_aim')}
          </span>
          <p className="text-sm font-medium text-slate-800 bg-blue-50 p-3 rounded-lg border border-blue-100">
            {practical.aim}
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>{t('theory_question_label')}</span>
            <span className="text-[11px] text-slate-400 font-normal">{t('theory_question_hint')}</span>
          </label>
          <input
            type="text"
            value={theory.investigativeQuestion}
            onChange={e => updateTheory('investigativeQuestion', e.target.value)}
            placeholder={`e.g. ${practical.expectedInvestigativeQuestion}`}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>{t('theory_hypothesis_label')}</span>
            <span className="text-[11px] text-slate-400 font-normal">{t('theory_hypothesis_hint')}</span>
          </label>
          <textarea
            rows={2}
            value={theory.hypothesis}
            onChange={e => updateTheory('hypothesis', e.target.value)}
            placeholder={`e.g. ${practical.expectedHypothesisPattern}`}
            className={textareaClass}
          />
        </div>
      </div>

      {/* Identification of Variables */}
      <div className={cardClass}>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4">
          {t('theory_variables_title')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={`${labelClass} flex items-center justify-between`}>
              <span>{t('theory_independent')}</span>
            </label>
            <input
              type="text"
              value={theory.independentVar}
              onChange={e => updateTheory('independentVar', e.target.value)}
              placeholder={`e.g. ${practical.variables.independent.name} (${practical.variables.independent.symbol})`}
              className={inputClass}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {t('theory_hint')}: {practical.variables.independent.description}
            </p>
          </div>

          <div>
            <label className={labelClass}>{t('theory_dependent')}</label>
            <input
              type="text"
              value={theory.dependentVar}
              onChange={e => updateTheory('dependentVar', e.target.value)}
              placeholder={`e.g. ${practical.variables.dependent.name} (${practical.variables.dependent.symbol})`}
              className={inputClass}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {t('theory_hint')}: {practical.variables.dependent.description}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label className={`${labelClass} mb-2`}>
            {t('theory_controlled')}
          </label>
          <div className="space-y-2">
            {theory.controlledVars.map((cVar, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="w-6 h-9 flex items-center justify-center text-xs font-bold text-slate-500 bg-slate-100 rounded-md shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={cVar}
                  onChange={e => updateControlledVar(idx, e.target.value)}
                  placeholder={`e.g. ${practical.variables.controlled[idx]?.name || 'Ambient Temperature'}`}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            ))}
          </div>
          {theory.controlledVars.length < 4 && (
            <button
              type="button"
              onClick={addControlledVar}
              className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('theory_add_variable')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

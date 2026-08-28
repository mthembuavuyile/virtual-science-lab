import React from 'react';
import { SbaPractical, AnalysisAnswers, RubricEvaluation } from '../../../types/sba';
import { AlertTriangle, ShieldCheck, CheckCircle2, Award, FileText, Sparkles } from 'lucide-react';

interface StepAnalysisProps {
  practical: SbaPractical;
  analysis: AnalysisAnswers;
  onAnalysisChange: (analysis: AnalysisAnswers) => void;
  evaluation: RubricEvaluation | null;
  onRunEvaluation: () => void;
  onDownloadPdf: () => void;
}

export default function StepAnalysis({
  practical,
  analysis,
  onAnalysisChange,
  evaluation,
  onRunEvaluation,
  onDownloadPdf
}: StepAnalysisProps) {
  const updateField = (field: keyof AnalysisAnswers, value: string) => {
    onAnalysisChange({ ...analysis, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Discussion & Errors Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Section E: Error Analysis, Precautions & Scientific Conclusion (4 Marks)
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              1. Sources of Experimental Error (Systematic & Random) *
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Mention heating, friction, parallax, or leaks</span>
          </label>
          <textarea
            rows={2}
            value={analysis.sourcesOfError}
            onChange={e => updateField('sourcesOfError', e.target.value)}
            placeholder={`e.g. ${practical.commonErrors.join(' ')}`}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              2. Precautions Observed *
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Safety and uncertainty control measures</span>
          </label>
          <textarea
            rows={2}
            value={analysis.precautionsObserved}
            onChange={e => updateField('precautionsObserved', e.target.value)}
            placeholder={`e.g. ${practical.precautions.join(' ')}`}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              3. Final Scientific Conclusion *
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Relate directly back to hypothesis with derived constants</span>
          </label>
          <textarea
            rows={2}
            value={analysis.conclusion}
            onChange={e => updateField('conclusion', e.target.value)}
            placeholder={`e.g. The experimental results confirm that as current increases, terminal potential difference decreases linearly. The internal resistance of the battery was determined to be r = 1.45 Ω and the EMF was E = 8.95 V.`}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900 text-white p-5 rounded-2xl shadow-lg">
        <div>
          <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Official CAPS Rubric Evaluation
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit this submission against the Department of Basic Education marking rubric.
          </p>
        </div>

        <button
          type="button"
          onClick={onRunEvaluation}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Run Official Rubric Audit
        </button>
      </div>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Formal Moderation Result
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                Score: {evaluation.totalMarksAwarded} / {evaluation.maxMarks} Marks ({evaluation.percentage}%)
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">
                Status: {evaluation.gradeLevel} • {evaluation.isModerationPassed ? '✅ Moderation Passed' : '⚠️ Review Required'}
              </p>
            </div>

            <button
              type="button"
              onClick={onDownloadPdf}
              className="w-full md:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              Download Formal SBA Report (4-Page PDF)
            </button>
          </div>

          {/* Itemized Breakdown Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
              Itemized CAPS Marksheet Breakdown
            </h4>
            <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs">
              {evaluation.items.map((it, idx) => (
                <div key={idx} className="p-3 bg-slate-50/50 dark:bg-slate-800/40 flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">{it.criterion}</span>
                    <span className="text-[11px] text-slate-500">{it.feedback}</span>
                  </div>
                  <div className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400 shrink-0">
                    {it.awardedMarks} / {it.maxMarks}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  SbaPractical, 
  StudentInfo, 
  TheoryAnswers, 
  DataRow, 
  GraphCalculation, 
  AnalysisAnswers, 
  RubricEvaluation, 
  SbaSubmission 
} from '../../types/sba';
import StepTheory from './steps/StepTheory';
import StepApparatus from './steps/StepApparatus';
import StepDataTable from './steps/StepDataTable';
import StepGraphPlotter from './steps/StepGraphPlotter';
import StepAnalysis from './steps/StepAnalysis';
import PricingModal from './PricingModal';
import { evaluateSbaSubmission } from '../../lib/sba-evaluator';
import { generateSbaPdf } from '../../lib/sba-pdf-generator';
import { isPracticalUnlocked, saveSubmissionToLocal } from '../../lib/license-store';
import { 
  FileText, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Download, 
  Lock, 
  Sparkles, 
  Clock, 
  Award,
  BookOpen,
  Share2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface SbaRunnerProps {
  practical: SbaPractical;
}

const STAGES = [
  { id: 1, name: '1. Theory & Variables', shortName: 'Theory' },
  { id: 2, name: '2. Digital Apparatus', shortName: 'Apparatus' },
  { id: 3, name: '3. Data Table', shortName: 'Data Table' },
  { id: 4, name: '4. Graphical Analysis', shortName: 'Graph' },
  { id: 5, name: '5. Moderation & PDF', shortName: 'Moderation' }
];

export default function SbaRunner({ practical }: SbaRunnerProps) {
  const navigate = useNavigate();
  const storageKey = `vylab_sba_progress_${practical.id}`;

  const [currentStep, setCurrentStep] = useState(1);
  const [unlocked, setUnlocked] = useState(isPracticalUnlocked(practical.id));
  const [pricingOpen, setPricingOpen] = useState(false);

  // Student info state
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    fullName: '',
    idOrSacaiNumber: '',
    schoolOrCenter: '',
    grade: practical.grade,
    assessmentDate: new Date().toISOString().split('T')[0]
  });

  // Theory answers state
  const [theory, setTheory] = useState<TheoryAnswers>({
    investigativeQuestion: practical.expectedInvestigativeQuestion,
    hypothesis: practical.expectedHypothesisPattern,
    independentVar: `${practical.variables.independent.name} (${practical.variables.independent.symbol})`,
    dependentVar: `${practical.variables.dependent.name} (${practical.variables.dependent.symbol})`,
    controlledVars: practical.variables.controlled.map(c => `${c.name} (${c.symbol})`)
  });

  // Data table state
  const [dataTable, setDataTable] = useState<DataRow[]>([]);

  // Graph calculation state
  const [graphCalc, setGraphCalc] = useState<GraphCalculation>({
    point1: { x: 0, y: 0 },
    point2: { x: 0, y: 0 },
    calculatedSlope: 0,
    calculatedIntercept: 0,
    derivedConstantName: practical.graphConfig.expectedSlopeName,
    derivedConstantValue: 0,
    unit: practical.graphConfig.expectedSlopeUnit
  });

  // Analysis answers state
  const [analysis, setAnalysis] = useState<AnalysisAnswers>({
    sourcesOfError: practical.commonErrors.join(' '),
    precautionsObserved: practical.precautions.join(' '),
    conclusion: ''
  });

  // Rubric evaluation state
  const [evaluation, setEvaluation] = useState<RubricEvaluation | null>(null);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.studentInfo) setStudentInfo(parsed.studentInfo);
        if (parsed.theory) setTheory(parsed.theory);
        if (parsed.dataTable) setDataTable(parsed.dataTable);
        if (parsed.graphCalc) setGraphCalc(parsed.graphCalc);
        if (parsed.analysis) setAnalysis(parsed.analysis);
        if (parsed.evaluation) setEvaluation(parsed.evaluation);
      }
    } catch (e) {
      console.error('Failed to load saved progress:', e);
    }
  }, [storageKey]);

  // Auto-save progress to localStorage
  useEffect(() => {
    try {
      const payload = { studentInfo, theory, dataTable, graphCalc, analysis, evaluation };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to auto-save:', e);
    }
  }, [storageKey, studentInfo, theory, dataTable, graphCalc, analysis, evaluation]);

  // Check paywall
  useEffect(() => {
    setUnlocked(isPracticalUnlocked(practical.id));
  }, [practical.id]);

  const handleAddDataRow = (row: DataRow) => {
    setDataTable(prev => [...prev, row]);
  };

  const handleRunEvaluation = () => {
    const res = evaluateSbaSubmission(practical, theory, dataTable, graphCalc, analysis);
    setEvaluation(res);

    // Save final submission
    const submission: SbaSubmission = {
      id: `sub-${Date.now()}`,
      practicalId: practical.id,
      studentInfo,
      theory,
      dataTable,
      graphCalc,
      analysis,
      evaluation: res,
      completedAt: new Date().toISOString(),
      verificationHash: `CAPS-${practical.discipline.slice(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };
    saveSubmissionToLocal(submission);
  };

  const handleDownloadPdf = () => {
    // If evaluation not run, run it first
    let currentEval = evaluation;
    if (!currentEval) {
      currentEval = evaluateSbaSubmission(practical, theory, dataTable, graphCalc, analysis);
      setEvaluation(currentEval);
    }

    const submission: SbaSubmission = {
      id: `sub-${Date.now()}`,
      practicalId: practical.id,
      studentInfo,
      theory,
      dataTable,
      graphCalc,
      analysis,
      evaluation: currentEval,
      completedAt: new Date().toISOString(),
      verificationHash: `CAPS-${practical.discipline.slice(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };

    const doc = generateSbaPdf(practical, submission);
    const fileName = `SBA_${practical.grade}_${practical.discipline}_${studentInfo.fullName.replace(/\s+/g, '_') || 'Submission'}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-4 py-3 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/app/sba"
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition shrink-0 cursor-pointer"
              title="Return to SBA Practical Hub"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                  {practical.capsTaskNumber}
                </span>
                <span className="text-xs text-slate-500 font-medium truncate">
                  {practical.discipline} • Grade {practical.grade}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight mt-0.5 truncate">
                {practical.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-center shrink-0">
            {!unlocked && (
              <button
                type="button"
                onClick={() => setPricingOpen(true)}
                className="flex-1 sm:flex-none px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" /> Unlock SBA Dossier
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export SBA PDF
            </button>
          </div>
        </div>

        {/* 5-Step Responsive Stepper Bar */}
        <div className="border-t border-slate-100 px-3 sm:px-6 py-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-1.5 sm:gap-2 justify-between min-w-max sm:min-w-0">
            {STAGES.map(stage => {
              const isActive = currentStep === stage.id;
              const isPassed = currentStep > stage.id;

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setCurrentStep(stage.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-2 sm:px-3 rounded-lg transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                      : isPassed
                      ? 'text-slate-700 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isPassed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : stage.id}
                  </span>
                  <span className="hidden sm:inline">{stage.name}</span>
                  <span className="sm:hidden">{stage.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Step Body */}
      <main className="w-full">
        {currentStep === 1 && (
          <StepTheory
            practical={practical}
            studentInfo={studentInfo}
            onStudentInfoChange={setStudentInfo}
            theory={theory}
            onTheoryChange={setTheory}
          />
        )}

        {currentStep === 2 && (
          <StepApparatus
            practical={practical}
            onAddDataRow={handleAddDataRow}
            loggedCount={dataTable.length}
          />
        )}

        {currentStep === 3 && (
          <StepDataTable
            practical={practical}
            dataTable={dataTable}
            onDataTableChange={setDataTable}
          />
        )}

        {currentStep === 4 && (
          <StepGraphPlotter
            practical={practical}
            dataTable={dataTable}
            graphCalc={graphCalc}
            onGraphCalcChange={setGraphCalc}
          />
        )}

        {currentStep === 5 && (
          <StepAnalysis
            practical={practical}
            analysis={analysis}
            onAnalysisChange={setAnalysis}
            evaluation={evaluation}
            onRunEvaluation={handleRunEvaluation}
            onDownloadPdf={handleDownloadPdf}
          />
        )}

        {/* Step Navigation Bottom Bar */}
        <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous Step
          </button>

          <span className="text-xs text-slate-400 font-medium">
            Step {currentStep} of 5
          </span>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition"
            >
              Next Step: {STAGES[currentStep].shortName} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" /> Finish & Download PDF
            </button>
          )}
        </div>
      </main>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={pricingOpen}
        onClose={() => setPricingOpen(false)}
        practicalTitle={practical.title}
        practicalId={practical.id}
        onSuccessUnlock={() => setUnlocked(true)}
      />
    </div>
  );
}

import React, { Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLabById } from '../data/experiments';
import { ArrowLeft, Loader2 } from 'lucide-react';

function LabLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      <p className="text-sm font-semibold text-slate-500">Loading simulation...</p>
    </div>
  );
}

export default function LabLoader() {
  const { labId } = useParams<{ labId: string }>();
  const navigate = useNavigate();

  const lab = labId ? getLabById(labId) : undefined;

  const handleBack = () => {
    // If user has history in session, go back; otherwise fallback to syllabus hub
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/app/labs');
    }
  };

  if (!lab) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center">
          <span className="text-4xl">🔬</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Experiment Not Found</h2>
          <p className="text-sm text-slate-500 max-w-md">
            The lab <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">{labId}</span> doesn't exist in the CAPS syllabus registry.
          </p>
        </div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors shadow-sm text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
    );
  }

  const LabComponent = lab.component;

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb header */}
      <div className="flex items-center gap-3 mb-3 shrink-0">
        <button
          onClick={handleBack}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <div className={`p-1 rounded-md bg-gradient-to-br ${lab.gradient}`}>
            <lab.icon className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="text-sm lg:text-base font-bold text-slate-900 truncate">{lab.title}</h1>
          <span className="hidden sm:inline text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 whitespace-nowrap">
            {lab.unit} · Grade {lab.grade}
          </span>
        </div>
      </div>

      {/* Lab component */}
      <div className="flex-1 min-h-0 overflow-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
        <Suspense fallback={<LabLoadingFallback />}>
          <LabComponent />
        </Suspense>
      </div>
    </div>
  );
}

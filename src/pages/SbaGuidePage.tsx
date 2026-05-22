import React, { useState } from 'react';
import { FileText, Sparkles, RefreshCw, Check, AlertTriangle, BookOpen, Trash2, Plus, Info } from 'lucide-react';
import { moderateSbaReport } from '../lib/gemini';

interface InternalResistanceData {
  current: number;
  voltage: number;
}

interface StandardSolutionData {
  bottlePlusSolute: number;
  emptyBottle: number;
}

interface VinegarTitrationData {
  trial: number;
  initialReading: number;
  finalReading: number;
}

export default function SbaGuidePage() {
  const [selectedPractical, setSelectedPractical] = useState<'internal-r' | 'std-sol' | 'vinegar'>('internal-r');

  // AI Moderation States
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<{
    isConsistent: boolean;
    theoreticalAnalysis: string;
    sourcesOfError: string[];
    draftDiscussion: string;
    conclusionDraft: string;
  } | null>(null);
  const [noteSaved, setNoteSaved] = useState(false);

  /* ────────── STATE: battery internal resistance ────────── */
  const [batteryEMF, setBatteryEMF] = useState<number>(9);
  const [rData, setRData] = useState<InternalResistanceData[]>([
    { current: 0.2, voltage: 8.6 },
    { current: 0.4, voltage: 8.2 },
    { current: 0.6, voltage: 7.8 },
    { current: 0.8, voltage: 7.4 }
  ]);

  const addRRow = () => {
    if (rData.length >= 6) return;
    setRData([...rData, { current: 1.0, voltage: 7.0 }]);
  };

  const removeRRow = (index: number) => {
    if (rData.length <= 2) return;
    setRData(rData.filter((_, i) => i !== index));
  };

  const updateRRow = (index: number, field: keyof InternalResistanceData, val: number) => {
    const updated = [...rData];
    updated[index][field] = val;
    setRData(updated);
  };

  /* ────────── STATE: standard solution ────────── */
  const [soluteType, setSoluteType] = useState<'Na2CO3' | 'H2C2O4'>('Na2CO3'); // Sodium Carbonate (106 g/mol) or Oxalic Acid (126 g/mol)
  const [stdVolumeMl, setStdVolumeMl] = useState<number>(250); // Flask volume
  const [stdTargetConc, setStdTargetConc] = useState<number>(0.1); // Target concentration
  const [stdData, setStdData] = useState<StandardSolutionData>({
    bottlePlusSolute: 5.45,
    emptyBottle: 2.80
  });

  const getMolarMass = () => {
    return soluteType === 'Na2CO3' ? 106.0 : 126.0;
  };

  /* ────────── STATE: vinegar titration ────────── */
  const [vinegarPipetteMl, setVinegarPipetteMl] = useState<number>(25.0); // Volume of diluted vinegar
  const [naohConcentration, setNaohConcentration] = useState<number>(0.1); // NaOH concentration
  const [vinegarData, setVinegarData] = useState<VinegarTitrationData[]>([
    { trial: 1, initialReading: 0.0, finalReading: 22.3 },
    { trial: 2, initialReading: 0.0, finalReading: 22.1 },
    { trial: 3, initialReading: 0.0, finalReading: 22.2 }
  ]);

  const addTitrationRow = () => {
    if (vinegarData.length >= 5) return;
    setVinegarData([...vinegarData, { trial: vinegarData.length + 1, initialReading: 0.0, finalReading: 22.0 }]);
  };

  const removeTitrationRow = (index: number) => {
    if (vinegarData.length <= 2) return;
    const filtered = vinegarData.filter((_, i) => i !== index).map((row, i) => ({
      ...row,
      trial: i + 1
    }));
    setVinegarData(filtered);
  };

  const updateTitrationRow = (index: number, field: 'initialReading' | 'finalReading', val: number) => {
    const updated = [...vinegarData];
    updated[index][field] = val;
    setVinegarData(updated);
  };

  /* ────────── AI SUBMISSION MODERATION ────────── */
  const handleModerate = async () => {
    setLoading(true);
    setReport(null);
    setNoteSaved(false);

    try {
      let practicalTitle = '';
      let variables: Record<string, any> = {};
      let dataPoints: Array<Record<string, any>> = [];

      if (selectedPractical === 'internal-r') {
        practicalTitle = 'SBA Practical: Internal Resistance of a Battery';
        variables = { batteryEMFRated: batteryEMF };
        dataPoints = rData.map(r => ({ currentAmps: r.current, voltageVolts: r.voltage }));
      } else if (selectedPractical === 'std-sol') {
        practicalTitle = 'SBA Practical: Preparation of a Standard Solution';
        variables = {
          solute: soluteType === 'Na2CO3' ? 'Sodium Carbonate (Na2CO3)' : 'Oxalic Acid (H2C2O4)',
          flaskVolumeMl: stdVolumeMl,
          targetConcentrationMolar: stdTargetConc
        };
        dataPoints = [
          {
            massBottlePlusSoluteGrams: stdData.bottlePlusSolute,
            massEmptyBottleGrams: stdData.emptyBottle,
            netSoluteMassGrams: Number((stdData.bottlePlusSolute - stdData.emptyBottle).toFixed(3))
          }
        ];
      } else {
        practicalTitle = 'SBA Practical: Determining Concentration of Ethanoic Acid in Vinegar';
        variables = {
          dilutedVinegarVolumePipettedMl: vinegarPipetteMl,
          naohStandardConcentrationMolar: naohConcentration
        };
        dataPoints = vinegarData.map(v => ({
          trial: v.trial,
          initialReadingMl: v.initialReading,
          finalReadingMl: v.finalReading,
          volumeAddedMl: Number((v.finalReading - v.initialReading).toFixed(2))
        }));
      }

      const res = await moderateSbaReport(practicalTitle, variables, dataPoints);
      if (res && res.theoreticalAnalysis) {
        setReport(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToNotebook = () => {
    if (!report) return;
    try {
      const saved = localStorage.getItem('virtualLabNotebook');
      const currentNotes = saved ? JSON.parse(saved) : [];
      
      const newNote = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        content: `=== AI SBA LAB REPORT MODERATION ===\nPractical: ${
          selectedPractical === 'internal-r'
            ? 'Internal Resistance r of a Cell'
            : selectedPractical === 'std-sol'
            ? 'Preparation of standard solution'
            : 'Concentration of vinegar titration'
        }\n\n--- CONSISTENCY AUDIT ---\nConsistent: ${report.isConsistent ? 'Yes' : 'No'}\n${report.theoreticalAnalysis}\n\n--- SOURCES OF ERROR ---\n${report.sourcesOfError.join('\n')}\n\n--- DISCUSSION ---\n${report.draftDiscussion}\n\n--- CONCLUSION ---\n${report.conclusionDraft}`
      };

      localStorage.setItem('virtualLabNotebook', JSON.stringify([newNote, ...currentNotes]));
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  /* ────────── LOCAL FORMULA PREVIEWS ────────── */
  // Internal resistance slope preview
  const getBatteryPreview = () => {
    if (rData.length < 2) return null;
    // Calculate simple slope of delta V / delta I to show current estimation of r
    const iDiff = rData[rData.length - 1].current - rData[0].current;
    const vDiff = rData[rData.length - 1].voltage - rData[0].voltage;
    if (iDiff === 0) return null;
    const estimatedR = -vDiff / iDiff;
    return estimatedR > 0 ? estimatedR.toFixed(2) : '0.00';
  };

  // Standard Solution calculation preview
  const getStdSolPreview = () => {
    const netMass = stdData.bottlePlusSolute - stdData.emptyBottle;
    if (netMass <= 0) return '0.00';
    const volumeDm3 = stdVolumeMl / 1000;
    const molarMass = getMolarMass();
    const calculatedConc = netMass / (molarMass * volumeDm3);
    return {
      netMass: netMass.toFixed(3),
      concentration: calculatedConc.toFixed(4)
    };
  };

  // Vinegar concentration calculation preview
  const getVinegarPreview = () => {
    const validTrials = vinegarData.map(v => v.finalReading - v.initialReading).filter(v => v > 0);
    if (validTrials.length === 0) return null;
    const averageBaseVolume = validTrials.reduce((sum, current) => sum + current, 0) / validTrials.length;
    // Mole ratio 1:1, concentration of acid: c_a = (c_b * V_b) / V_a
    const ca = (naohConcentration * averageBaseVolume) / vinegarPipetteMl;
    return {
      avgBaseVol: averageBaseVolume.toFixed(2),
      calculatedCa: ca.toFixed(4)
    };
  };

  return (
    <div className="flex flex-col gap-6 p-1 lg:p-3 overflow-auto">
      
      {/* Description Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-extrabold text-slate-800 text-lg md:text-xl flex items-center gap-2">
            <FileText className="text-purple-600 w-5 h-5" />
            School-Based Assessment (SBA) Practical Moderator
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Audits your experimental high school practical values, highlights source-errors, checks chemistry/physics consistency, and helps draft scientific arguments.
          </p>
        </div>
        
        {/* Selection buttons */}
        <div className="scroll-tabs flex bg-slate-200 p-1 rounded-lg w-full md:w-auto shrink-0">
          <button
            onClick={() => { setSelectedPractical('internal-r'); setReport(null); }}
            className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              selectedPractical === 'internal-r' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Internal Resistance (Physics)
          </button>
          <button
            onClick={() => { setSelectedPractical('std-sol'); setReport(null); }}
            className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              selectedPractical === 'std-sol' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Standard Solution (Chem)
          </button>
          <button
            onClick={() => { setSelectedPractical('vinegar'); setReport(null); }}
            className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              selectedPractical === 'vinegar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Vinegar Titration (Chem)
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Left Side: Parameters Table Inputs */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
          
          {/* PRACTICAL 1: INTERNAL RESISTANCE */}
          {selectedPractical === 'internal-r' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-900 text-xs">
                <Info className="w-5 h-5 text-blue-500 shrink-0" />
                <div>
                  <h4 className="font-extrabold mb-1">Experiment Summary</h4>
                  Connecting a variable resistor to a cell, we measure potential difference (V) and current (I) across the circuit. Theoretical relationship is: V = -rI + EMF. Plotting V vs I, the internal resistance r is the positive slope magnitude.
                </div>
              </div>

              {/* General inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rated Battery EMF (Volts)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="24"
                    value={batteryEMF}
                    onChange={(e) => setBatteryEMF(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs md:text-sm font-bold text-slate-800 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Theoretical Internal Resistance Estimate</label>
                  <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs md:text-sm font-bold text-slate-800">
                    r ≈ {getBatteryPreview()} Ω
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">Experimental Trials Data Log</h4>
                  <button
                    onClick={addRRow}
                    disabled={rData.length >= 6}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Trial
                  </button>
                </div>
                
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-3 font-bold text-slate-600">Trial</th>
                        <th className="p-3 font-bold text-slate-600">Current I (Amperes)</th>
                        <th className="p-3 font-bold text-slate-600">Terminal Volts V (Volts)</th>
                        <th className="p-3 font-bold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-500">#{idx + 1}</td>
                          <td className="p-3">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="10"
                              value={row.current}
                              onChange={(e) => updateRRow(idx, 'current', Number(e.target.value))}
                              className="bg-slate-50 border border-slate-300 rounded-lg p-1.5 font-semibold text-slate-800 outline-none w-28"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="24"
                              value={row.voltage}
                              onChange={(e) => updateRRow(idx, 'voltage', Number(e.target.value))}
                              className="bg-slate-50 border border-slate-300 rounded-lg p-1.5 font-semibold text-slate-800 outline-none w-28"
                            />
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => removeRRow(idx)}
                              disabled={rData.length <= 2}
                              className="text-red-500 hover:text-red-600 disabled:opacity-30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PRACTICAL 2: STANDARD SOLUTION */}
          {selectedPractical === 'std-sol' && (
            <div className="space-y-6">
              <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 flex gap-3 text-pink-900 text-xs">
                <Info className="w-5 h-5 text-pink-500 shrink-0" />
                <div>
                  <h4 className="font-extrabold mb-1">Experiment Summary</h4>
                  Preparing a standard solution of a known concentration in a volumetric flask. We calculate solute mass, weigh it, dissolve in distilled water, and dilute to standard graduation marks. Concentration is computed as: $c = m / (M \cdot V)$.
                </div>
              </div>

              {/* General parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Solute Compound</label>
                  <select
                    value={soluteType}
                    onChange={(e) => setSoluteType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs md:text-sm font-bold text-slate-800 outline-none"
                  >
                    <option value="Na2CO3">Sodium Carbonate (Na₂CO₃) · 106 g/mol</option>
                    <option value="H2C2O4">Oxalic Acid (H₂C₂O₄) · 126 g/mol</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Volumetric Flask Volume (mL)</label>
                  <input
                    type="number"
                    step="50"
                    min="50"
                    max="1000"
                    value={stdVolumeMl}
                    onChange={(e) => setStdVolumeMl(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs md:text-sm font-bold text-slate-800 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Concentration (mol/dm³)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="2"
                    value={stdTargetConc}
                    onChange={(e) => setStdTargetConc(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs md:text-sm font-bold text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Weighing bottle measurements */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">Weighing Balance Measurements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mass: Weighing Bottle + Solute (g)</label>
                    <input
                      type="number"
                      step="0.001"
                      min="0.1"
                      max="100"
                      value={stdData.bottlePlusSolute}
                      onChange={(e) => setStdData({ ...stdData, bottlePlusSolute: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-bold text-slate-800 text-sm outline-none"
                    />
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mass: Empty Weighing Bottle (g)</label>
                    <input
                      type="number"
                      step="0.001"
                      min="0.1"
                      max="100"
                      value={stdData.emptyBottle}
                      onChange={(e) => setStdData({ ...stdData, emptyBottle: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-bold text-slate-800 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Local estimate results */}
                <div className="bg-[#1E293B] text-white p-4 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block">Net Solute Weighed:</span>
                    <span className="font-bold text-sm text-pink-400">{typeof getStdSolPreview() === 'object' ? (getStdSolPreview() as any).netMass : '0'} g</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 font-bold block">Calculated Concentration:</span>
                    <span className="font-bold text-sm text-pink-400">{typeof getStdSolPreview() === 'object' ? (getStdSolPreview() as any).concentration : '0'} mol·dm⁻³</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRACTICAL 3: VINEGAR TITRATION */}
          {selectedPractical === 'vinegar' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 text-amber-900 text-xs">
                <Info className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <h4 className="font-extrabold mb-1">Experiment Summary</h4>
                  Determining the concentration of commercial vinegar (ethanoic acid). Pipette 25 mL of diluted vinegar, titrate with standard NaOH base using phenolphthalein. The equivalence point occurs at standard color transition (pale pink). $c_a V_a = c_b V_b$ mole ratio.
                </div>
              </div>

              {/* General values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Volume of Diluted Vinegar (Va) (mL)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="100"
                    value={vinegarPipetteMl}
                    onChange={(e) => setVinegarPipetteMl(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs md:text-sm font-bold text-slate-800 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Concentration of NaOH Base (cb) (mol/dm³)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.01"
                    max="2"
                    value={naohConcentration}
                    onChange={(e) => setNaohConcentration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs md:text-sm font-bold text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">Titration Trials Log</h4>
                  <button
                    onClick={addTitrationRow}
                    disabled={vinegarData.length >= 5}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Trial
                  </button>
                </div>
                
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-3 font-bold text-slate-600">Trial</th>
                        <th className="p-3 font-bold text-slate-600">Initial Burette NaOH (mL)</th>
                        <th className="p-3 font-bold text-slate-600">Final Burette NaOH (mL)</th>
                        <th className="p-3 font-bold text-slate-600">Volume Added (mL)</th>
                        <th className="p-3 font-bold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {vinegarData.map((row, idx) => {
                        const added = row.finalReading - row.initialReading;
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-500">#{row.trial}</td>
                            <td className="p-3">
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="50"
                                value={row.initialReading}
                                onChange={(e) => updateTitrationRow(idx, 'initialReading', Number(e.target.value))}
                                className="bg-slate-50 border border-slate-300 rounded-lg p-1.5 font-semibold text-slate-800 outline-none w-24"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="50"
                                value={row.finalReading}
                                onChange={(e) => updateTitrationRow(idx, 'finalReading', Number(e.target.value))}
                                className="bg-slate-50 border border-slate-300 rounded-lg p-1.5 font-semibold text-slate-800 outline-none w-24"
                              />
                            </td>
                            <td className="p-3 font-bold text-slate-800">
                              {added >= 0 ? added.toFixed(2) : '0.00'} mL
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => removeTitrationRow(idx)}
                                disabled={vinegarData.length <= 2}
                                className="text-red-500 hover:text-red-600 disabled:opacity-30"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Local titration preview */}
                {getVinegarPreview() && (
                  <div className="bg-[#1E293B] text-white p-4 rounded-xl flex justify-between items-center text-xs mt-3">
                    <div>
                      <span className="text-slate-400 font-bold block">Avg NaOH Volume (Vb):</span>
                      <span className="font-bold text-sm text-amber-400">{getVinegarPreview()?.avgBaseVol} mL</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 font-bold block">Diluted Acid Concentration (ca):</span>
                      <span className="font-bold text-sm text-amber-400">{getVinegarPreview()?.calculatedCa} mol·dm⁻³</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Trigger */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleModerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Auditing Laboratory Values...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  Submit to Lab Moderator
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Side: AI Moderated Report Output */}
        <div className="w-full xl:w-96 shrink-0 flex flex-col">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex-1 flex flex-col space-y-6 min-h-[450px]">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-amber-400 text-xs uppercase tracking-wider">Moderation Report</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">SBA Experimental Data Evaluation</p>
              </div>
              {report && (
                <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                  report.isConsistent 
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400' 
                    : 'bg-red-950 border-red-500 text-red-400'
                }`}>
                  {report.isConsistent ? 'Consistent Data' : 'Consistency Warning'}
                </div>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-purple-950 border-t-purple-500 animate-spin" />
                  <FileText className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-slate-200 text-sm">Evaluating Practical data...</h4>
                  <p className="text-xs text-slate-400 mt-1">Calculating percentage errors and auditing trends</p>
                </div>
              </div>
            )}

            {/* Results display */}
            {!loading && report && (
              <div className="space-y-5 overflow-y-auto flex-1 text-xs pr-1">
                
                {/* consistency & math */}
                <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-xl space-y-2">
                  <h5 className="font-extrabold text-amber-300 uppercase tracking-wide text-[10px]">Data Audit & Calculations</h5>
                  <p className="text-slate-300 leading-relaxed font-medium">
                    {report.theoreticalAnalysis}
                  </p>
                </div>

                {/* sources of error */}
                <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-xl space-y-2">
                  <h5 className="font-extrabold text-amber-300 uppercase tracking-wide text-[10px] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    High School Sources of Error
                  </h5>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300 font-medium">
                    {report.sourcesOfError.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>

                {/* draft discussion */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
                  <h5 className="font-extrabold text-slate-200 uppercase tracking-wide text-[10px]">Drafted Discussion Paragraph</h5>
                  <p className="text-slate-300 leading-relaxed italic bg-slate-900/50 p-3 rounded-lg border border-slate-800 font-mono text-[10px] whitespace-pre-wrap">
                    "{report.draftDiscussion}"
                  </p>
                </div>

                {/* conclusion */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
                  <h5 className="font-extrabold text-slate-200 uppercase tracking-wide text-[10px]">Drafted Conclusion</h5>
                  <p className="text-slate-300 leading-relaxed font-medium bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                    "{report.conclusionDraft}"
                  </p>
                </div>

                {/* Notebook saving */}
                <button
                  onClick={handleSaveToNotebook}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition border ${
                    noteSaved
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                      : 'bg-white text-slate-950 border-white hover:bg-slate-100'
                  }`}
                >
                  {noteSaved ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" /> Saved to notebook!
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 text-slate-500" /> Save Report to Notebook
                    </>
                  )}
                </button>

              </div>
            )}

            {/* Offline/Prompt */}
            {!loading && !report && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-700 animate-pulse" />
                <div>
                  <h4 className="font-bold text-slate-300 text-sm">No Report Generated</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                    Input your school measurement points on the left table, and click "Submit to Lab Moderator" to analyze them.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

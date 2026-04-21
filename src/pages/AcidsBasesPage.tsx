import React, { useState } from 'react';
import { FlaskConical, Beaker, Droplets } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import TitrationLab from '../components/simulations/TitrationLab';

export default function AcidsBasesPage() {
  const [activeTab, setActiveTab] = useState<'titration' | 'ph' | 'mix'>('titration');

  return (
    <div className="flex flex-col h-full">
      {/* Sub-nav */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-pink-100 p-1.5 lg:p-2 rounded-lg">
            <FlaskConical className="text-pink-600 w-4 h-4 lg:w-5 lg:h-5" />
          </div>
          <h1 className="text-base lg:text-xl font-bold text-slate-900">Acids & Bases</h1>
          <Badge variant="outline" className="text-[8px] lg:text-[9px]">UNIT 4</Badge>
        </div>
        <div className="scroll-tabs flex bg-slate-200 p-1 rounded-lg sm:ml-auto w-full sm:w-auto">
          {[
            { id: 'titration' as const, label: 'Titration' },
            { id: 'ph' as const, label: 'pH Sim' },
            { id: 'mix' as const, label: 'Mixing' },
          ].map(t => (
            <button key={t.id}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs lg:text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === t.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}
              onClick={() => setActiveTab(t.id)}
            >{t.label}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
        {activeTab === 'titration' && <TitrationLab />}
        {activeTab === 'ph' && <PhSimulatorInline />}
        {activeTab === 'mix' && <MixSimulatorInline />}
      </div>
    </div>
  );
}

/* ────────── pH SIMULATOR ────────── */

function getPhFromConc(conc: number, baseML: number) {
  const acidMol = conc * 0.025;
  const baseMol = 0.1 * (baseML / 1000);
  const excess = acidMol - baseMol;
  if (excess > 0.0001) return Math.max(0, -Math.log10(excess / 0.025));
  if (excess < -0.0001) return Math.min(14, 14 - (-Math.log10(-excess / 0.025)));
  return 7;
}

function getColourFromPH(pH: number) {
  if (pH < 3) return '#ef4444';
  if (pH < 5) return '#f97316';
  if (pH < 6) return '#eab308';
  if (pH < 7.5) return '#22c55e';
  if (pH < 9) return '#14b8a6';
  if (pH < 11) return '#3b82f6';
  return '#a855f7';
}

function PhSimulatorInline() {
  const [conc, setConc] = useState(0.1);
  const [baseAdded, setBaseAdded] = useState(0);
  const [indicator, setIndicator] = useState('universal');

  const pH = getPhFromConc(conc, baseAdded);
  const colour = getColourFromPH(pH);

  let indicatorText = '';
  if (indicator === 'universal') indicatorText = `Universal → pH ${pH.toFixed(1)}`;
  else if (indicator === 'litmus') indicatorText = pH < 7 ? 'Litmus → RED' : 'Litmus → BLUE';
  else if (indicator === 'phenol') indicatorText = pH < 8.2 ? 'Phenol → COLOURLESS' : 'Phenol → PINK';
  else if (indicator === 'methyl') indicatorText = pH < 3.1 ? 'Methyl → RED' : pH < 4.4 ? 'Methyl → ORANGE' : 'Methyl → YELLOW';

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Visual */}
      <div className="lg:w-1/2 p-4 lg:p-8 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col items-center justify-center">
        <div className="mb-6 text-center">
          <div className="w-24 h-32 lg:w-28 lg:h-36 mx-auto border-2 border-slate-300 rounded-b-3xl relative overflow-hidden mb-3">
            <div className="absolute bottom-0 left-0 right-0 h-[70%] transition-colors duration-300" style={{ backgroundColor: colour, opacity: 0.8 }} />
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold font-mono" style={{ color: colour }}>{pH.toFixed(2)}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">pH</div>
        </div>

        <div className="w-full max-w-xs">
          <div className="flex h-3 lg:h-4 rounded-full overflow-hidden mb-1.5">
            <div className="flex-1 bg-red-500" /><div className="flex-1 bg-orange-500" /><div className="flex-1 bg-yellow-500" />
            <div className="flex-1 bg-green-500" /><div className="flex-1 bg-teal-500" /><div className="flex-1 bg-blue-500" /><div className="flex-1 bg-purple-500" />
          </div>
          <div className="relative h-3 mb-3">
            <div className="absolute w-1.5 h-3 bg-slate-900 rounded-sm transition-all duration-300 -translate-x-1/2" style={{ left: `${(pH / 14) * 100}%` }} />
          </div>
          <div className="text-center font-bold text-xs lg:text-sm text-slate-700 bg-white border border-slate-200 py-1.5 lg:py-2 rounded-lg shadow-sm">
            {indicatorText}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="lg:w-1/2 p-4 lg:p-8 flex flex-col">
        <h3 className="text-sm lg:text-lg font-bold text-slate-900 mb-4">Controls</h3>
        <div className="space-y-4">
          <div>
            <label className="flex justify-between text-xs lg:text-sm font-semibold text-slate-700 mb-1.5">
              Acid Conc. (mol/L) <span className="text-blue-600">{conc.toFixed(3)}</span>
            </label>
            <input type="range" min="0.001" max="10" step="0.001" value={conc} onChange={e => setConc(parseFloat(e.target.value))} className="w-full accent-blue-600" />
          </div>
          <div>
            <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1.5">Indicator</label>
            <select value={indicator} onChange={e => setIndicator(e.target.value)} className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg p-2 text-sm outline-none">
              <option value="universal">Universal</option>
              <option value="litmus">Litmus</option>
              <option value="phenol">Phenolphthalein</option>
              <option value="methyl">Methyl Orange</option>
            </select>
          </div>
          <div>
            <label className="flex justify-between text-xs lg:text-sm font-semibold text-slate-700 mb-1.5">
              NaOH Added (mL) <span className="text-blue-600">{baseAdded.toFixed(1)}</span>
            </label>
            <input type="range" min="0" max="50" step="0.5" value={baseAdded} onChange={e => setBaseAdded(parseFloat(e.target.value))} className="w-full accent-blue-600" />
          </div>
        </div>

        <div className="mt-auto pt-4 bg-blue-50 p-3 rounded-xl border border-blue-100">
          <h4 className="flex items-center gap-1.5 text-blue-800 font-bold text-xs mb-1">
            <Droplets className="w-3.5 h-3.5" /> Observation
          </h4>
          <div className="text-[10px] lg:text-xs text-blue-900 font-medium">
            {pH < 3 ? 'STRONGLY ACIDIC.' : pH < 7 ? 'Weakly acidic.' :
             (pH >= 7 && pH <= 7.1) ? 'NEUTRALISATION POINT!' : pH <= 11 ? 'ALKALINE. Excess NaOH.' : 'STRONGLY ALKALINE.'}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────── MIX SIMULATOR ────────── */

const CHEMS = [
  { id: 'hcl', name: 'HCl', sub: 'Hydrochloric Acid' },
  { id: 'naoh', name: 'NaOH', sub: 'Sodium Hydroxide' },
  { id: 'agno3', name: 'AgNO₃', sub: 'Silver Nitrate' },
  { id: 'nacl', name: 'NaCl', sub: 'Sodium Chloride' },
  { id: 'ui', name: 'Indicator', sub: 'Universal' },
];

function MixSimulatorInline() {
  const [beaker, setBeaker] = useState<typeof CHEMS>([]);
  const [mixedInfo, setMixedInfo] = useState<{ color: string; text: string } | null>(null);

  const addChem = (chem: typeof CHEMS[0]) => {
    if (beaker.length >= 2 || beaker.find(c => c.id === chem.id)) return;
    setBeaker([...beaker, chem]);
    setMixedInfo(null);
  };

  const handleMix = () => {
    if (beaker.length !== 2) return;
    const ids = beaker.map(c => c.id).sort().join('+');
    let color = 'rgba(203, 213, 225, 0.4)';
    let text = 'No significant reaction.';

    if (ids === 'hcl+naoh') { color = 'rgba(148, 163, 184, 0.2)'; text = "NEUTRALIZATION\nHCl + NaOH → NaCl + H₂O"; }
    else if (ids === 'agno3+nacl') { color = '#e2e8f0'; text = "PRECIPITATION\nAgNO₃ + NaCl → AgCl↓ + NaNO₃\nWhite precipitate forms."; }
    else if (ids === 'hcl+ui') { color = 'rgba(239, 68, 68, 0.6)'; text = "Indicator turns RED (acidic)."; }
    else if (ids === 'naoh+ui') { color = 'rgba(168, 85, 247, 0.6)'; text = "Indicator turns PURPLE (alkaline)."; }

    setMixedInfo({ color, text });
  };

  const resetMix = () => { setBeaker([]); setMixedInfo(null); };

  let liquidColor = 'transparent';
  if (mixedInfo) liquidColor = mixedInfo.color;
  else if (beaker.length > 0) liquidColor = 'rgba(226, 232, 240, 0.5)';

  let liquidHeight = '0%';
  if (beaker.length === 1) liquidHeight = '30%';
  else if (beaker.length === 2) liquidHeight = '60%';

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Shelf */}
      <div className="lg:w-1/3 p-3 lg:p-6 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200">
        <h3 className="text-[10px] lg:text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Reagents</h3>
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
          {CHEMS.map(c => (
            <button key={c.id} onClick={() => addChem(c)}
              disabled={beaker.length >= 2 || beaker.some(b => b.id === c.id)}
              className="bg-white border border-slate-200 p-2 lg:p-3 rounded-xl text-left hover:border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <div className="font-bold text-pink-600 text-xs lg:text-sm">{c.name}</div>
              <div className="text-[9px] lg:text-xs text-slate-500 font-semibold hidden sm:block">{c.sub}</div>
            </button>
          ))}
        </div>
        <button onClick={resetMix} className="mt-4 text-[10px] lg:text-sm font-semibold text-slate-500 hover:text-red-600 underline">Reset</button>
      </div>

      {/* Beaker */}
      <div className="lg:w-2/3 p-4 lg:p-8 flex flex-col items-center justify-center">
        <div className="w-28 h-36 lg:w-36 lg:h-44 border-2 border-slate-300 rounded-b-3xl relative overflow-hidden mb-4">
          <div className="absolute bottom-0 left-0 right-0 transition-all duration-300" style={{ height: liquidHeight, backgroundColor: liquidColor }} />
        </div>

        <div className="flex gap-1.5 mb-4 min-h-[24px]">
          {beaker.map(b => (
            <div key={b.id} className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-pink-200">+ {b.name}</div>
          ))}
        </div>

        <button onClick={handleMix} disabled={beaker.length !== 2 || mixedInfo !== null}
          className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold py-2.5 px-8 rounded-xl shadow-md transition-all mb-4 flex items-center gap-1.5 text-sm">
          <FlaskConical className="w-4 h-4" /> Mix
        </button>

        {mixedInfo && (
          <div className="w-full max-w-md bg-pink-50 border border-pink-100 p-3 lg:p-4 rounded-2xl">
            <h4 className="font-bold text-pink-800 text-xs mb-1">Result</h4>
            <p className="text-[10px] lg:text-sm font-medium text-pink-900 whitespace-pre-wrap">{mixedInfo.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}

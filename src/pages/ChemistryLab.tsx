import React, { useState } from 'react';
import { Beaker, Droplets, FlaskConical } from 'lucide-react';

export default function ChemistryLab() {
  const [activeTab, setActiveTab] = useState<'ph' | 'mix'>('ph');

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="bg-pink-100 p-2 rounded-lg">
            <Beaker className="text-pink-600 w-6 h-6" />
          </div>
          Chemistry Laboratory
        </h1>
        <div className="flex bg-slate-200 p-1 rounded-lg">
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'ph' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setActiveTab('ph')}
          >
            pH Titration
          </button>
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'mix' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setActiveTab('mix')}
          >
            Precipitate Mixing
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {activeTab === 'ph' ? <PhSimulator /> : <MixSimulator />}
      </div>
    </div>
  );
}

function getPhFromConc(conc: number, baseML: number) {
  const acidMol = conc * 0.025; // 25mL of acid
  const baseMol = 0.1 * (baseML / 1000);
  const excessAcid = acidMol - baseMol;
  let pH;
  if(excessAcid > 0.0001) {
    const concExcess = excessAcid / 0.025;
    pH = -Math.log10(concExcess);
  } else if(excessAcid < -0.0001) {
    const excessBase = -excessAcid;
    const concBase = excessBase / 0.025;
    const pOH = -Math.log10(concBase);
    pH = 14 - pOH;
  } else {
    pH = 7;
  }
  return Math.max(0, Math.min(14, pH));
}

function getColourFromPH(pH: number) {
  if(pH < 3) return '#ef4444'; // red-500
  if(pH < 5) return '#f97316'; // orange-500
  if(pH < 6) return '#eab308'; // yellow-500
  if(pH < 7.5) return '#22c55e'; // green-500
  if(pH < 9) return '#14b8a6'; // teal-500
  if(pH < 11) return '#3b82f6'; // blue-500
  return '#a855f7'; // purple-500
}

function PhSimulator() {
  const [conc, setConc] = useState(0.1);
  const [baseAdded, setBaseAdded] = useState(0);
  const [indicator, setIndicator] = useState('universal');
  
  const pH = getPhFromConc(conc, baseAdded);
  const colour = getColourFromPH(pH);

  let indicatorText = '';
  if (indicator === 'universal') {
    indicatorText = `Universal → pH ${pH.toFixed(1)}`;
  } else if (indicator === 'litmus') {
    indicatorText = pH < 7 ? 'Litmus → RED' : 'Litmus → BLUE';
  } else if (indicator === 'phenol') {
    indicatorText = pH < 8.2 ? 'Phenol → COLOURLESS' : 'Phenol → PINK';
  } else if (indicator === 'methyl') {
    if(pH < 3.1) indicatorText = 'Methyl → RED';
    else if(pH < 4.4) indicatorText = 'Methyl → ORANGE';
    else indicatorText = 'Methyl → YELLOW';
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Visualizer */}
      <div className="md:w-1/2 p-8 bg-slate-50 border-r border-slate-200 flex flex-col items-center justify-center">
         <div className="ph-beaker mb-8">
           <div className="beaker-outer border-slate-300">
             <div 
               className="beaker-liquid" 
               style={{ backgroundColor: colour, opacity: 0.8 }}
             ></div>
           </div>
           <div className="text-3xl font-extrabold font-mono" style={{ color: colour }}>
             {pH.toFixed(2)}
           </div>
           <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sample pH</div>
         </div>

         <div className="w-full max-w-xs">
           <div className="flex h-4 rounded-full overflow-hidden mb-2">
             <div className="flex-1 bg-red-500"></div>
             <div className="flex-1 bg-orange-500"></div>
             <div className="flex-1 bg-yellow-500"></div>
             <div className="flex-1 bg-green-500"></div>
             <div className="flex-1 bg-teal-500"></div>
             <div className="flex-1 bg-blue-500"></div>
             <div className="flex-1 bg-purple-500"></div>
           </div>
           <div className="relative h-4 mb-4">
              <div 
                className="absolute w-2 h-4 bg-slate-900 rounded-[1px] transition-all duration-300 -translate-x-1/2"
                style={{ left: `${(pH / 14) * 100}%` }}
              ></div>
           </div>
           <div className="text-center font-bold text-slate-700 bg-white border border-slate-200 py-2 rounded-lg shadow-sm">
             {indicatorText}
           </div>
         </div>
      </div>

      {/* Controls */}
      <div className="md:w-1/2 p-8 flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Simulation Controls</h3>
        
        <div className="space-y-6">
          <div>
            <label className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
              Acid Concentration (mol/L) <span className="text-blue-600">{conc.toFixed(3)}</span>
            </label>
            <input 
              type="range" min="0.001" max="10" step="0.001" 
              value={conc} 
              onChange={e => setConc(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Indicator Type</label>
            <select 
              value={indicator} 
              onChange={e => setIndicator(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="universal">Universal Indicator</option>
              <option value="litmus">Litmus</option>
              <option value="phenol">Phenolphthalein</option>
              <option value="methyl">Methyl Orange</option>
            </select>
          </div>

          <div>
            <label className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
              Titration: NaOH Added (mL) <span className="text-blue-600">{baseAdded.toFixed(1)} mL</span>
            </label>
            <input 
              type="range" min="0" max="50" step="0.5" 
              value={baseAdded} 
              onChange={e => setBaseAdded(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </div>

        <div className="mt-auto bg-blue-50 p-4 rounded-xl border border-blue-100">
           <h4 className="flex items-center gap-2 text-blue-800 font-bold mb-2">
             <Droplets className="w-4 h-4" /> Observation
           </h4>
           <div className="text-sm text-blue-900 leading-relaxed font-medium">
             {pH < 3 ? 'Solution is STRONGLY ACIDIC.' : 
              pH < 7 ? 'Solution is weakly acidic.' : 
              (pH >= 7 && pH <= 7.1) ? 'NEUTRALISATION POINT reached! Moles of acid = moles of base.' : 
              pH <= 11 ? 'Solution is ALKALINE. Excess NaOH present.' : 'STRONGLY ALKALINE solution.'}
           </div>
        </div>
      </div>
    </div>
  );
}

const CHEMS = [
  { id: 'hcl', name: 'HCl', sub: 'Hydrochloric Acid' },
  { id: 'naoh', name: 'NaOH', sub: 'Sodium Hydroxide' },
  { id: 'agno3', name: 'AgNO₃', sub: 'Silver Nitrate' },
  { id: 'nacl', name: 'NaCl', sub: 'Sodium Chloride' },
  { id: 'ui', name: 'Indicator', sub: 'Universal (pH)' },
];

function MixSimulator() {
  const [beaker, setBeaker] = useState<typeof CHEMS>([]);
  const [mixedInfo, setMixedInfo] = useState<{color:string, text:string}|null>(null);

  const addChem = (chem: typeof CHEMS[0]) => {
    if (beaker.length >= 2 || beaker.find(c => c.id === chem.id)) return;
    setBeaker([...beaker, chem]);
    setMixedInfo(null);
  };

  const handleMix = () => {
    if(beaker.length !== 2) return;
    const ids = beaker.map(c => c.id).sort().join('+');
    let color = 'rgba(203, 213, 225, 0.4)'; // slate-300 transparent
    let text = 'No significant reaction observed.';

    if(ids === 'hcl+naoh') {
      color = 'rgba(148, 163, 184, 0.2)';
      text = "NEUTRALIZATION\nHCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)\nReaction is highly exothermic.";
    } else if(ids === 'agno3+nacl') {
      color = '#e2e8f0'; // solidish white/gray
      text = "PRECIPITATION\nAgNO₃(aq) + NaCl(aq) → AgCl(s)↓ + NaNO₃(aq)\nA white precipitate forms immediately.";
    } else if(ids === 'hcl+ui') {
      color = 'rgba(239, 68, 68, 0.6)'; // red
      text = "ACIDITY TEST\nUniversal Indicator turns RED (Low pH).";
    } else if(ids === 'naoh+ui') {
      color = 'rgba(168, 85, 247, 0.6)'; // purple
      text = "ALKALINITY TEST\nUniversal Indicator turns PURPLE (High pH).";
    }

    setMixedInfo({ color, text });
  };

  const resetMix = () => {
    setBeaker([]);
    setMixedInfo(null);
  };

  let liquidColor = 'transparent';
  if (mixedInfo) liquidColor = mixedInfo.color;
  else if (beaker.length > 0) liquidColor = 'rgba(226, 232, 240, 0.5)';

  let liquidHeight = '0%';
  if (beaker.length === 1) liquidHeight = '30%';
  else if (beaker.length === 2) liquidHeight = '60%';

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Shelf */}
      <div className="md:w-1/3 p-6 bg-slate-50 border-r border-slate-200">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Reagents Shelf</h3>
        <div className="grid grid-cols-1 gap-3">
          {CHEMS.map(c => (
            <button 
              key={c.id} 
              onClick={() => addChem(c)}
              disabled={beaker.length >= 2 || beaker.some(b => b.id === c.id)}
              className="bg-white border border-slate-200 p-3 rounded-xl text-left hover:border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div className="font-bold text-pink-600">{c.name}</div>
              <div className="text-xs text-slate-500 font-semibold">{c.sub}</div>
            </button>
          ))}
        </div>
        <button onClick={resetMix} className="mt-8 text-sm font-semibold text-slate-500 hover:text-red-600 underline">
          Empty Beaker & Reset
        </button>
      </div>

      {/* Visual */}
      <div className="md:w-2/3 p-8 flex flex-col items-center justify-center relative">
         <div className="chemistry-mixer-beaker mb-6">
            <div 
              className="mixer-liquid" 
              style={{ height: liquidHeight, backgroundColor: liquidColor }}
            >
              {mixedInfo && idsMatch(beaker, 'agno3', 'nacl') && (
                <div style={{ backgroundImage: 'radial-gradient(rgba(100,100,100,0.5) 2px, transparent 2px)', backgroundSize: '8px 8px', width: '100%', height: '100%' }}></div>
              )}
            </div>
         </div>

         <div className="flex gap-2 mb-8 min-h-[32px]">
            {beaker.map(b => (
              <div key={b.id} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold border border-pink-200">
                + {b.name}
              </div>
            ))}
         </div>

         <button 
           onClick={handleMix}
           disabled={beaker.length !== 2 || mixedInfo !== null}
           className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold py-3 px-12 rounded-xl shadow-md transition-all mb-8 flex items-center gap-2"
         >
           <FlaskConical className="w-5 h-5" /> Mix Reagents
         </button>

         {mixedInfo && (
           <div className="w-full max-w-md bg-pink-50 border border-pink-100 p-5 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
             <h4 className="font-bold text-pink-800 mb-2 flex items-center gap-2">
                Reagents Reacted!
             </h4>
             <p className="text-sm font-medium text-pink-900 whitespace-pre-wrap">{mixedInfo.text}</p>
           </div>
         )}
      </div>
    </div>
  );
}

function idsMatch(beaker: typeof CHEMS, id1:string, id2:string) {
  const ids = beaker.map(c => c.id).sort().join('+');
  const target = [id1, id2].sort().join('+');
  return ids === target;
}

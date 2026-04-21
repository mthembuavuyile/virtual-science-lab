import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Beaker,
  Thermometer,
  Droplets,
  FlaskConical,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/* ────────── DATA ────────── */

interface OrganicSubstance {
  id: string;
  name: string;
  formula: string;
  boilingPoint: number;
  viscosity: 'low' | 'medium' | 'high';
  polarSoluble: boolean;
  nonPolarSoluble: boolean;
  family: string;
}

const substances: OrganicSubstance[] = [
  { id: 'methanol', name: 'Methanol', formula: 'CH₃OH', boilingPoint: 64.7, viscosity: 'low', polarSoluble: true, nonPolarSoluble: false, family: 'Alcohol' },
  { id: 'ethanol', name: 'Ethanol', formula: 'C₂H₅OH', boilingPoint: 78.4, viscosity: 'low', polarSoluble: true, nonPolarSoluble: false, family: 'Alcohol' },
  { id: 'propan-1-ol', name: 'Propan-1-ol', formula: 'C₃H₇OH', boilingPoint: 97.2, viscosity: 'medium', polarSoluble: true, nonPolarSoluble: false, family: 'Alcohol' },
  { id: 'butan-1-ol', name: 'Butan-1-ol', formula: 'C₄H₉OH', boilingPoint: 117.7, viscosity: 'medium', polarSoluble: false, nonPolarSoluble: true, family: 'Alcohol' },
  { id: 'pentane', name: 'Pentane', formula: 'C₅H₁₂', boilingPoint: 36.1, viscosity: 'low', polarSoluble: false, nonPolarSoluble: true, family: 'Alkane' },
  { id: 'hexane', name: 'Hexane', formula: 'C₆H₁₄', boilingPoint: 69, viscosity: 'low', polarSoluble: false, nonPolarSoluble: true, family: 'Alkane' },
  { id: 'ethanoic-acid', name: 'Ethanoic Acid', formula: 'CH₃COOH', boilingPoint: 118.1, viscosity: 'medium', polarSoluble: true, nonPolarSoluble: false, family: 'Carboxylic Acid' },
  { id: 'ethyl-ethanoate', name: 'Ethyl Ethanoate', formula: 'CH₃COOC₂H₅', boilingPoint: 77.1, viscosity: 'low', polarSoluble: false, nonPolarSoluble: true, family: 'Ester' },
];

type TabId = 'solubility' | 'boiling' | 'viscosity' | 'reactions' | 'polymers' | 'plastics';

const tabs: { id: TabId; label: string }[] = [
  { id: 'solubility', label: 'Solubility' },
  { id: 'boiling', label: 'Boiling Pt' },
  { id: 'viscosity', label: 'Viscosity' },
  { id: 'reactions', label: 'Reactions' },
  { id: 'polymers', label: 'Polymers' },
  { id: 'plastics', label: 'Plastics' },
];

/* ────────── MAIN COMPONENT ────────── */

export default function OrganicCompoundsLab() {
  const [activeTab, setActiveTab] = useState<TabId>('solubility');

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 lg:gap-6 p-3 lg:p-6">
      <div className="flex-1 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden min-h-0">
        {/* Header */}
        <div className="p-3 lg:p-4 border-b border-[#F1F5F9] flex justify-between items-center bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Beaker className="w-4 h-4 lg:w-5 lg:h-5 text-[#2563EB]" />
            <span className="font-bold text-xs lg:text-sm tracking-tight uppercase text-[#1E293B]">
              Organic Compounds
            </span>
          </div>
          <Badge variant="outline" className="text-[9px]">UNIT 1</Badge>
        </div>

        {/* Tab Bar — scrollable on mobile */}
        <div className="scroll-tabs flex bg-[#F8FAFC] border-b border-[#F1F5F9] px-2 lg:px-4 gap-0.5">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[#94A3B8] hover:text-[#64748B]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'solubility' && <SolubilityPanel />}
          {activeTab === 'boiling' && <BoilingPointPanel />}
          {activeTab === 'viscosity' && <ViscosityPanel />}
          {activeTab === 'reactions' && <ReactionsPanel />}
          {activeTab === 'polymers' && <PolymersPanel />}
          {activeTab === 'plastics' && <PlasticsPanel />}
        </div>
      </div>

      {/* Info Sidebar — below on mobile */}
      <div className="w-full lg:w-[320px] flex flex-col gap-4 lg:gap-6 shrink-0">
        <Card className="p-4 lg:p-6 border-[#E2E8F0] shadow-sm">
          <h3 className="font-bold text-base lg:text-lg tracking-tight mb-3">Substance Reference</h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-3 max-h-60 lg:max-h-[400px] overflow-auto">
            {substances.map(s => (
              <div key={s.id} className="p-2 lg:p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-xs lg:text-sm font-bold text-[#0F172A]">{s.name}</span>
                  <Badge variant="outline" className="text-[8px] lg:text-[9px] hidden sm:inline-flex">{s.family}</Badge>
                </div>
                <p className="text-[9px] lg:text-[10px] font-mono text-[#64748B]">{s.formula} · BP {s.boilingPoint}°C</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4 lg:p-6 border-[#E2E8F0] shadow-sm bg-[#1E293B] text-white">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-xs lg:text-sm uppercase tracking-wider">Key Concept</h3>
          </div>
          <p className="text-[10px] lg:text-xs text-blue-100/80 leading-relaxed">
            Organic compounds are carbon-based molecules. Their physical properties depend on molecular size, functional groups, and intermolecular forces such as hydrogen bonding and Van der Waals forces.
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ────────── SUB-PANELS ────────── */

function SolubilityPanel() {
  const [selected, setSelected] = useState<OrganicSubstance>(substances[0]);
  const [solvent, setSolvent] = useState<'polar' | 'nonpolar'>('polar');
  const [tested, setTested] = useState(false);
  const dissolves = solvent === 'polar' ? selected.polarSoluble : selected.nonPolarSoluble;

  return (
    <div className="p-4 lg:p-8 flex flex-col items-center gap-6">
      <h3 className="text-base lg:text-lg font-bold text-[#0F172A]">Solubility Testing</h3>

      {/* Substance grid */}
      <div className="w-full">
        <label className="text-[10px] lg:text-xs font-bold text-[#64748B] uppercase mb-2 block">Select Substance</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {substances.slice(0, 6).map(s => (
            <button
              key={s.id}
              onClick={() => { setSelected(s); setTested(false); }}
              className={`p-2 rounded-lg border text-left transition-all text-xs ${
                selected.id === s.id
                  ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] font-bold'
                  : 'border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569]'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Beaker */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-28 h-36 lg:w-32 lg:h-40 bg-white border-2 border-[#CBD5E1] rounded-b-3xl overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[60%]"
            animate={{
              backgroundColor: tested
                ? dissolves ? 'rgba(59, 130, 246, 0.3)' : 'rgba(203, 213, 225, 0.4)'
                : solvent === 'polar' ? 'rgba(147, 197, 253, 0.4)' : 'rgba(253, 224, 71, 0.3)',
            }}
            transition={{ duration: 0.5 }}
          />
          {tested && !dissolves && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-14 h-3 bg-[#94A3B8] rounded-full opacity-60" />
          )}
        </div>
        <span className="text-[10px] lg:text-xs font-bold text-[#64748B]">
          {solvent === 'polar' ? 'Water (Polar)' : 'Hexane (Non-Polar)'}
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <div className="flex bg-[#F1F5F9] p-1 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => { setSolvent('polar'); setTested(false); }}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-[10px] lg:text-xs font-bold transition-colors ${solvent === 'polar' ? 'bg-white shadow-sm text-[#2563EB]' : 'text-[#64748B]'}`}
          >
            Water (Polar)
          </button>
          <button
            onClick={() => { setSolvent('nonpolar'); setTested(false); }}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-[10px] lg:text-xs font-bold transition-colors ${solvent === 'nonpolar' ? 'bg-white shadow-sm text-[#2563EB]' : 'text-[#64748B]'}`}
          >
            Hexane (Non-Polar)
          </button>
        </div>
        <Button onClick={() => setTested(true)} disabled={tested} className="bg-[#2563EB] hover:bg-[#1D4ED8] w-full sm:w-auto">
          <Droplets className="w-4 h-4 mr-2" /> Add to Solvent
        </Button>
      </div>

      {tested && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 lg:p-4 rounded-xl border w-full text-center ${
            dissolves ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <p className="font-bold text-sm">{dissolves ? '✓ DISSOLVES' : '✗ DOES NOT DISSOLVE'}</p>
          <p className="text-[10px] lg:text-xs mt-1">
            {selected.name} is {dissolves ? 'soluble' : 'insoluble'} in {solvent === 'polar' ? 'water' : 'hexane'}.
            {dissolves ? ' "Like dissolves like".' : ' Intermolecular forces too different.'}
          </p>
        </motion.div>
      )}
    </div>
  );
}

function BoilingPointPanel() {
  const sorted = [...substances].sort((a, b) => a.boilingPoint - b.boilingPoint);
  const maxBP = Math.max(...sorted.map(s => s.boilingPoint));

  return (
    <div className="p-4 lg:p-8">
      <h3 className="text-base lg:text-lg font-bold text-[#0F172A] mb-1">Boiling Point Comparison</h3>
      <p className="text-[10px] lg:text-xs text-[#94A3B8] mb-6">Homologous series show increasing boiling points with chain length.</p>

      <div className="space-y-3">
        {sorted.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3"
          >
            <div className="w-20 lg:w-32 text-right shrink-0">
              <span className="text-xs lg:text-sm font-bold text-[#0F172A] block truncate">{s.name}</span>
            </div>
            <div className="flex-1 bg-[#F1F5F9] rounded-full h-5 lg:h-6 overflow-hidden">
              <motion.div
                className="h-full rounded-full flex items-center justify-end pr-2"
                initial={{ width: 0 }}
                animate={{ width: `${(s.boilingPoint / maxBP) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                style={{ background: `linear-gradient(90deg, #3B82F6, ${s.boilingPoint > 100 ? '#EF4444' : '#60A5FA'})` }}
              >
                <span className="text-[8px] lg:text-[10px] font-bold text-white">{s.boilingPoint}°C</span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-[10px] lg:text-xs text-blue-800">
          <strong>Observation:</strong> Boiling point increases with chain length. Alcohols have higher BPs than alkanes due to hydrogen bonding.
        </p>
      </div>
    </div>
  );
}

function ViscosityPanel() {
  const viscosityLevels = { low: 1, medium: 2, high: 3 };

  return (
    <div className="p-4 lg:p-8">
      <h3 className="text-base lg:text-lg font-bold text-[#0F172A] mb-1">Viscosity Comparison</h3>
      <p className="text-[10px] lg:text-xs text-[#94A3B8] mb-6">Higher viscosity = slower flow.</p>

      <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 lg:gap-6">
        {substances.slice(0, 4).map(s => (
          <div key={s.id} className="flex flex-col items-center gap-2">
            <div className="relative w-8 lg:w-12 h-24 lg:h-32 bg-[#F1F5F9] border-2 border-[#CBD5E1] rounded-b-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 right-0 bg-blue-300/50"
                initial={{ height: '80%' }}
                animate={{ height: '20%' }}
                transition={{ duration: viscosityLevels[s.viscosity] * 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />
            </div>
            <div className="text-center">
              <p className="text-[10px] lg:text-xs font-bold text-[#0F172A] truncate max-w-16 lg:max-w-full">{s.name}</p>
              <Badge className={`text-[8px] lg:text-[9px] mt-0.5 ${
                s.viscosity === 'high' ? 'bg-red-100 text-red-700' :
                s.viscosity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {s.viscosity}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-[10px] lg:text-xs text-blue-800">
          <strong>Key:</strong> Viscosity increases with chain length and intermolecular force strength.
        </p>
      </div>
    </div>
  );
}

function ReactionsPanel() {
  const [selectedReaction, setSelectedReaction] = useState(0);
  const reactions = [
    { name: 'Combustion of Ethanol', equation: 'C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O', observation: 'BLUE FLAME produced. Exothermic.', color: '#3B82F6', type: 'Combustion' },
    { name: 'Ethanoic Acid + NaOH', equation: 'CH₃COOH + NaOH → CH₃COONa + H₂O', observation: 'NEUTRALIZATION. Solution warms up.', color: '#22C55E', type: 'Neutralization' },
    { name: 'Esterification', equation: 'CH₃COOH + C₂H₅OH → CH₃COOC₂H₅ + H₂O', observation: 'FRUITY SMELL. Requires H₂SO₄ catalyst + heat.', color: '#F59E0B', type: 'Condensation' },
    { name: 'Bromine Water Test', equation: 'C₂H₄ + Br₂ → C₂H₄Br₂', observation: 'ORANGE → COLOURLESS (unsaturation test).', color: '#EF4444', type: 'Addition' },
  ];
  const r = reactions[selectedReaction];

  return (
    <div className="p-4 lg:p-8">
      <h3 className="text-base lg:text-lg font-bold text-[#0F172A] mb-4">Reaction Behavior</h3>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:w-56">
          {reactions.map((rx, i) => (
            <button
              key={i}
              onClick={() => setSelectedReaction(i)}
              className={`p-2 lg:p-3 rounded-xl text-left transition-all border ${
                selectedReaction === i ? 'border-[#2563EB] bg-blue-50' : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              <span className="text-[10px] lg:text-xs font-bold text-[#0F172A] block">{rx.name}</span>
              <span className="text-[9px] lg:text-[10px] text-[#94A3B8]">{rx.type}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col items-center gap-4">
          <motion.div
            key={selectedReaction}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 lg:w-40 lg:h-40 rounded-full flex items-center justify-center"
            style={{ backgroundColor: r.color + '20', border: `3px solid ${r.color}` }}
          >
            <FlaskConical className="w-10 h-10 lg:w-16 lg:h-16" style={{ color: r.color }} />
          </motion.div>
          <div className="text-center w-full">
            <p className="font-mono text-xs lg:text-sm font-bold text-[#0F172A] mb-2">{r.equation}</p>
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <p className="text-[10px] lg:text-xs font-medium text-[#475569]">{r.observation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PolymersPanel() {
  const [step, setStep] = useState(0);
  const polymerSteps = [
    { title: 'Monomers Ready', desc: 'Individual monomer units arranged.', visual: '○ ○ ○ ○ ○ ○' },
    { title: 'Polymerization Begins', desc: 'Monomers begin linking.', visual: '○-○  ○-○  ○-○' },
    { title: 'Chain Growing', desc: 'Chain extends. Water may be released.', visual: '○-○-○-○  ○-○' },
    { title: 'Polymer Formed!', desc: 'Long-chain macromolecule formed.', visual: '○-○-○-○-○-○' },
  ];

  return (
    <div className="p-4 lg:p-8">
      <h3 className="text-base lg:text-lg font-bold text-[#0F172A] mb-4">Polymer Formation</h3>

      <div className="flex flex-col items-center gap-6">
        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-2xl lg:text-4xl font-mono font-bold text-[#2563EB] tracking-widest py-4 lg:py-8"
        >
          {polymerSteps[step].visual}
        </motion.div>

        <div className="text-center">
          <h4 className="text-xs lg:text-sm font-bold text-[#0F172A] mb-1">Step {step + 1}: {polymerSteps[step].title}</h4>
          <p className="text-[10px] lg:text-xs text-[#64748B]">{polymerSteps[step].desc}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>← Prev</Button>
          <div className="flex gap-1.5">
            {polymerSteps.map((_, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i <= step ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'}`} />
            ))}
          </div>
          <Button size="sm" onClick={() => setStep(Math.min(polymerSteps.length - 1, step + 1))} disabled={step === polymerSteps.length - 1} className="bg-[#2563EB] hover:bg-[#1D4ED8]">Next →</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <h5 className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Addition Polymer</h5>
            <p className="text-[10px] lg:text-xs text-[#475569]">Polyethylene — monomers add without losing atoms.</p>
          </div>
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <h5 className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Condensation Polymer</h5>
            <p className="text-[10px] lg:text-xs text-[#475569]">Nylon — monomers join, releasing H₂O.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlasticsPanel() {
  const [selectedPlastic, setSelectedPlastic] = useState(0);
  const [temperature, setTemperature] = useState(25);
  const plastics = [
    { name: 'Polyethylene (LDPE)', flexibility: 'High', meltingPoint: 115, elasticity: 'Medium', type: 'Thermoplastic' },
    { name: 'PVC', flexibility: 'Medium', meltingPoint: 160, elasticity: 'Low', type: 'Thermoplastic' },
    { name: 'Polystyrene', flexibility: 'Low', meltingPoint: 240, elasticity: 'Low', type: 'Thermoplastic' },
    { name: 'Bakelite', flexibility: 'None', meltingPoint: 300, elasticity: 'None', type: 'Thermoset' },
  ];
  const p = plastics[selectedPlastic];
  const isNearMelting = temperature >= p.meltingPoint * 0.8;
  const isMelted = temperature >= p.meltingPoint;

  return (
    <div className="p-4 lg:p-8">
      <h3 className="text-base lg:text-lg font-bold text-[#0F172A] mb-4">Plastic Property Testing</h3>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:w-48">
          {plastics.map((pl, i) => (
            <button key={i} onClick={() => { setSelectedPlastic(i); setTemperature(25); }}
              className={`p-2 lg:p-3 rounded-xl border text-left transition-all ${selectedPlastic === i ? 'border-[#2563EB] bg-blue-50' : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'}`}
            >
              <span className="text-[10px] lg:text-xs font-bold text-[#0F172A] block">{pl.name}</span>
              <span className="text-[9px] text-[#94A3B8]">{pl.type}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-4">
          {/* Temp slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-[#64748B]" />
                <label className="text-[10px] lg:text-xs font-bold text-[#64748B] uppercase">Temperature</label>
              </div>
              <span className={`text-xs font-mono font-bold ${isMelted ? 'text-red-500' : 'text-[#0F172A]'}`}>{temperature}°C</span>
            </div>
            <Slider value={[temperature]} min={25} max={350} step={5} onValueChange={(v) => setTemperature(v[0])} />
          </div>

          {/* Visual */}
          <motion.div className="h-28 lg:h-40 rounded-2xl border-2 flex items-center justify-center"
            animate={{
              borderColor: isMelted ? '#EF4444' : isNearMelting ? '#F59E0B' : '#E2E8F0',
              backgroundColor: isMelted ? 'rgba(239,68,68,0.1)' : isNearMelting ? 'rgba(245,158,11,0.05)' : '#F8FAFC',
            }}
          >
            <motion.div animate={{ borderRadius: isMelted ? '50%' : '12px', scale: isMelted ? 0.6 : 1, opacity: isMelted ? 0.5 : 1 }}
              className="w-20 h-20 bg-[#2563EB]/20 border-2 border-[#2563EB] flex items-center justify-center"
            >
              <span className="text-[10px] lg:text-xs font-bold text-[#2563EB]">{isMelted ? 'MELTED' : isNearMelting ? 'SOFTENING' : 'SOLID'}</span>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-3 gap-2">
            {[{ label: 'Flexibility', val: p.flexibility }, { label: 'Elasticity', val: p.elasticity }, { label: 'Melt Pt', val: `${p.meltingPoint}°C` }].map(item => (
              <div key={item.label} className="p-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center">
                <p className="text-[8px] lg:text-[10px] font-bold text-[#64748B] uppercase mb-0.5">{item.label}</p>
                <p className="text-xs font-bold text-[#0F172A]">{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scale,
  Thermometer,
  Layers,
  RotateCcw,
  Info,
  ArrowLeftRight,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

/* ────────── TYPES ────────── */

interface EquilibriumSystem {
  id: string;
  name: string;
  shortName: string;
  equation: string;
  forwardColor: string;
  reverseColor: string;
  description: string;
}

const systems: EquilibriumSystem[] = [
  {
    id: 'cobalt', name: 'Cobalt Chloride', shortName: 'Co²⁺',
    equation: '[Co(H₂O)₆]²⁺ ⇌ [CoCl₄]²⁻ + 6H₂O',
    forwardColor: '#EC4899', reverseColor: '#3B82F6',
    description: 'Shifts between pink (aqueous) and blue (chloride complex) forms.',
  },
  {
    id: 'iron', name: 'Iron Thiocyanate', shortName: 'Fe³⁺',
    equation: 'Fe³⁺ + 3SCN⁻ ⇌ Fe(SCN)₃',
    forwardColor: '#FCD34D', reverseColor: '#DC2626',
    description: 'Pale yellow reactants form deep red product.',
  },
  {
    id: 'nitrogen', name: 'N₂O₄ / NO₂', shortName: 'NO₂',
    equation: 'N₂O₄ ⇌ 2NO₂',
    forwardColor: '#F1F5F9', reverseColor: '#92400E',
    description: 'Temperature increase shifts to brown NO₂ (endothermic).',
  },
];

/* ────────── MAIN ────────── */

export default function EquilibriumLab() {
  const [selectedSystem, setSelectedSystem] = useState(0);
  const [temperature, setTemperature] = useState(298);
  const [concentration, setConcentration] = useState(1.0);
  const [pressure, setPressure] = useState(1.0);
  const [shiftHistory, setShiftHistory] = useState<string[]>([]);

  const sys = systems[selectedSystem];

  const equilibriumPosition = useMemo(() => {
    let pos = 50;
    pos += (temperature - 298) * 0.15;
    pos += (concentration - 1.0) * 15;
    if (sys.id === 'nitrogen') {
      pos -= (pressure - 1.0) * 20;
    }
    return Math.max(5, Math.min(95, pos));
  }, [temperature, concentration, pressure, sys.id]);

  const shiftDirection = equilibriumPosition > 55 ? 'RIGHT (Products)' : equilibriumPosition < 45 ? 'LEFT (Reactants)' : 'BALANCED';

  const resetLab = () => {
    setTemperature(298);
    setConcentration(1.0);
    setPressure(1.0);
    setShiftHistory([]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-3 lg:p-6 overflow-auto">
      {/* Main Simulation */}
      <div className="flex-1 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden min-h-0">
        {/* Header */}
        <div className="p-3 lg:p-4 border-b border-[#F1F5F9] flex justify-between items-center bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 lg:w-5 lg:h-5 text-[#2563EB]" />
            <span className="font-bold text-xs lg:text-sm tracking-tight uppercase text-[#1E293B]">
              Equilibrium Lab
            </span>
          </div>
          <Badge className={`text-[9px] ${
            shiftDirection.includes('RIGHT') ? 'bg-blue-500' :
            shiftDirection.includes('LEFT') ? 'bg-pink-500' : 'bg-emerald-500'
          }`}>
            {shiftDirection}
          </Badge>
        </div>

        {/* System Selector — scrollable on mobile */}
        <div className="scroll-tabs flex border-b border-[#F1F5F9] bg-[#F8FAFC] px-2 lg:px-4 gap-0.5">
          {systems.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setSelectedSystem(i); resetLab(); }}
              className={`px-3 lg:px-4 py-2.5 text-[10px] lg:text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                selectedSystem === i
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[#94A3B8] hover:text-[#64748B]'
              }`}
            >
              {s.shortName}
            </button>
          ))}
        </div>

        {/* Visualization */}
        <div className="relative bg-[#1E293B] overflow-hidden simulation-grid flex items-center justify-center py-12 lg:py-0 lg:flex-1">
          {/* Equation */}
          <div className="absolute top-3 lg:top-8 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-3 lg:px-6 py-2 rounded-xl border border-white/10 max-w-[90%]">
            <p className="text-[10px] lg:text-sm font-mono font-bold text-white text-center truncate">{sys.equation}</p>
          </div>

          {/* Balance Bar */}
          <div className="w-[85%] lg:w-[80%] max-w-lg mt-8">
            <div className="flex justify-between mb-2">
              <span className="text-[9px] lg:text-xs font-bold text-white/60 uppercase">Reactants</span>
              <span className="text-[9px] lg:text-xs font-bold text-white/60 uppercase">Products</span>
            </div>
            <div className="relative h-6 lg:h-8 bg-white/10 rounded-full overflow-hidden border border-white/20">
              <motion.div
                className="absolute top-0 left-0 h-full rounded-full"
                animate={{ width: `${equilibriumPosition}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                style={{ background: `linear-gradient(90deg, ${sys.forwardColor}, ${sys.reverseColor})` }}
              />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[2px] bg-white/30" />
            </div>
            <div className="flex justify-center mt-3">
              <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <span className="text-[10px] font-mono font-bold text-white">{equilibriumPosition.toFixed(1)}%</span>
              </div>
            </div>

            {/* Solution color */}
            <div className="flex justify-center mt-4">
              <motion.div
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl border-2 border-white/20 shadow-lg"
                animate={{ backgroundColor: `color-mix(in srgb, ${sys.reverseColor} ${Math.round(equilibriumPosition)}%, ${sys.forwardColor})` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Controls — stacked on mobile */}
        <div className="p-3 lg:p-6 bg-white border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-[#64748B]" />
                <label className="text-[10px] lg:text-xs font-bold text-[#64748B] uppercase">Temp (K)</label>
              </div>
              <span className="text-[10px] lg:text-xs font-mono font-bold text-[#0F172A]">{temperature}</span>
            </div>
            <Slider value={[temperature]} min={200} max={500} step={1} onValueChange={(v) => setTemperature(v[0])} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#64748B]" />
                <label className="text-[10px] lg:text-xs font-bold text-[#64748B] uppercase">Conc. (M)</label>
              </div>
              <span className="text-[10px] lg:text-xs font-mono font-bold text-[#0F172A]">{concentration.toFixed(1)}</span>
            </div>
            <Slider value={[concentration]} min={0.1} max={3.0} step={0.1} onValueChange={(v) => setConcentration(v[0])} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#64748B]" />
                <label className="text-[10px] lg:text-xs font-bold text-[#64748B] uppercase">Press. (atm)</label>
              </div>
              <span className="text-[10px] lg:text-xs font-mono font-bold text-[#0F172A]">{pressure.toFixed(1)}</span>
            </div>
            <Slider value={[pressure]} min={0.5} max={5.0} step={0.1} onValueChange={(v) => setPressure(v[0])} />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[320px] flex flex-col gap-4 lg:gap-6 shrink-0">
        <Card className="p-4 lg:p-6 border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base lg:text-lg tracking-tight">Controls</h3>
            <Button variant="outline" size="sm" onClick={resetLab}>
              <RotateCcw className="w-3 h-3 mr-1" /> Reset
            </Button>
          </div>
          <p className="text-[10px] lg:text-xs text-[#64748B]">
            Adjust temperature, concentration, and pressure to see how the equilibrium shifts according to Le Châtelier's principle.
          </p>
        </Card>

        <Card className="p-4 lg:p-6 border-[#E2E8F0] shadow-sm bg-[#1E293B] text-white">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-xs lg:text-sm uppercase tracking-wider">Le Châtelier's Principle</h3>
          </div>
          <p className="text-[10px] lg:text-xs text-blue-100/80 leading-relaxed mb-2">
            When a system at equilibrium is disturbed, it shifts to counteract the change.
          </p>
          <Separator className="bg-white/10 my-2" />
          <p className="text-[10px] text-blue-100/60 leading-relaxed">{sys.description}</p>
        </Card>
      </div>
    </div>
  );
}

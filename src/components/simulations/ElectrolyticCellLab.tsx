import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  RotateCcw,
  Info,
  Activity,
  Play,
  Battery,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

/* ────────── DATA ────────── */

interface ElectrolysisSetup {
  id: string;
  name: string;
  shortName: string;
  electrolyte: string;
  anodeProduct: string;
  cathodeProduct: string;
  anodeReaction: string;
  cathodeReaction: string;
  anodeColor: string;
  cathodeColor: string;
  solutionColor: string;
  description: string;
}

const setups: ElectrolysisSetup[] = [
  {
    id: 'cuso4', name: 'Copper Sulfate Electrolysis', shortName: 'CuSO₄',
    electrolyte: 'CuSO₄ (aq)', anodeProduct: 'O₂ gas', cathodeProduct: 'Cu metal',
    anodeReaction: '2H₂O → O₂ + 4H⁺ + 4e⁻', cathodeReaction: 'Cu²⁺ + 2e⁻ → Cu',
    anodeColor: '#94A3B8', cathodeColor: '#B45309', solutionColor: 'rgba(59, 130, 246, 0.3)',
    description: 'Copper ions deposit as metal at cathode. Blue colour fades.',
  },
  {
    id: 'nacl', name: 'Salt Water Electrolysis', shortName: 'NaCl',
    electrolyte: 'NaCl (aq)', anodeProduct: 'Cl₂ gas', cathodeProduct: 'H₂ gas',
    anodeReaction: '2Cl⁻ → Cl₂ + 2e⁻', cathodeReaction: '2H₂O + 2e⁻ → H₂ + 2OH⁻',
    anodeColor: '#22C55E', cathodeColor: '#E2E8F0', solutionColor: 'rgba(148, 163, 184, 0.2)',
    description: 'Chlorine at anode, hydrogen at cathode. NaOH forms.',
  },
  {
    id: 'water', name: 'Water Electrolysis', shortName: 'H₂O',
    electrolyte: 'H₂SO₄ (dilute)', anodeProduct: 'O₂ gas', cathodeProduct: 'H₂ gas',
    anodeReaction: '2H₂O → O₂ + 4H⁺ + 4e⁻', cathodeReaction: '2H⁺ + 2e⁻ → H₂',
    anodeColor: '#F1F5F9', cathodeColor: '#F1F5F9', solutionColor: 'rgba(203, 213, 225, 0.15)',
    description: 'Hydrogen 2:1 ratio to oxygen by volume.',
  },
];

/* ────────── MAIN ────────── */

export default function ElectrolyticCellLab() {
  const [selectedSetup, setSelectedSetup] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [voltage, setVoltage] = useState(6);
  const [time, setTime] = useState(0);
  const [gasAnodeLevel, setGasAnodeLevel] = useState(0);
  const [gasCathodeLevel, setGasCathodeLevel] = useState(0);

  const setup = setups[selectedSetup];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        const rate = voltage / 60;
        setTime(prev => prev + 0.1);
        setGasAnodeLevel(prev => Math.min(100, prev + rate * 0.5));
        setGasCathodeLevel(prev => Math.min(100, prev + rate));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, voltage]);

  const resetLab = () => { setIsRunning(false); setTime(0); setGasAnodeLevel(0); setGasCathodeLevel(0); };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-3 lg:p-6 overflow-auto">
      {/* Simulation */}
      <div className="flex-1 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden min-h-0">
        <div className="p-3 lg:p-4 border-b border-[#F1F5F9] flex justify-between items-center bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 lg:w-5 lg:h-5 text-[#2563EB]" />
            <span className="font-bold text-xs lg:text-sm tracking-tight uppercase text-[#1E293B]">Electrolytic Cell</span>
          </div>
          <div className="text-[10px] lg:text-xs font-mono bg-white px-2 py-0.5 rounded-full border border-[#E2E8F0]">
            <span className="text-[#64748B]">t: </span><span className="font-bold text-[#2563EB]">{time.toFixed(1)}s</span>
          </div>
        </div>

        {/* Setup tabs */}
        <div className="scroll-tabs flex border-b border-[#F1F5F9] bg-[#F8FAFC] px-2 gap-0.5">
          {setups.map((s, i) => (
            <button key={s.id} onClick={() => { setSelectedSetup(i); resetLab(); }}
              className={`px-3 py-2.5 text-[10px] lg:text-xs font-bold uppercase border-b-2 transition-colors whitespace-nowrap ${
                selectedSetup === i ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#94A3B8]'
              }`}
            >{s.shortName}</button>
          ))}
        </div>

        {/* Viz */}
        <div className="relative bg-[#F8FAFC] overflow-hidden simulation-grid flex items-center justify-center py-8 lg:py-0 lg:flex-1 min-h-[260px]">
          {/* DC Supply */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-20 lg:w-28 h-10 lg:h-14 bg-[#1E293B] rounded-xl border-2 border-[#475569] flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-emerald-400 font-mono text-sm lg:text-lg font-bold">{voltage}V</div>
                <div className="text-[6px] lg:text-[8px] text-white/40 font-bold uppercase">DC</div>
              </div>
            </div>
            <div className="flex gap-20 lg:gap-28">
              <div className="w-0.5 h-6 lg:h-10 bg-red-500" />
              <div className="w-0.5 h-6 lg:h-10 bg-gray-800" />
            </div>
          </div>

          {/* Container */}
          <div className="relative w-52 lg:w-72 h-36 lg:h-44 bg-white/40 border-2 border-[#CBD5E1] rounded-b-3xl overflow-hidden mt-16 lg:mt-20">
            <div className="absolute bottom-0 left-0 right-0 h-[75%] transition-colors" style={{ backgroundColor: setup.solutionColor }} />
            {/* Anode */}
            <div className="absolute top-0 left-[25%] -translate-x-1/2 w-4 lg:w-6 h-24 lg:h-32 shadow-md z-10" style={{ backgroundColor: setup.anodeColor }}>
              <span className="text-[7px] font-bold text-white bg-red-500 px-0.5 rounded-b block text-center">+</span>
            </div>
            {/* Cathode */}
            <div className="absolute top-0 right-[25%] translate-x-1/2 w-4 lg:w-6 h-24 lg:h-32 shadow-md z-10" style={{ backgroundColor: setup.cathodeColor }}>
              <span className="text-[7px] font-bold text-white bg-gray-800 px-0.5 rounded-b block text-center">−</span>
            </div>

            {/* Bubbles */}
            <AnimatePresence>
              {isRunning && [...Array(3)].map((_, i) => (
                <motion.div key={`a-${i}`} className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
                  style={{ left: `${22 + Math.random() * 8}%` }}
                  initial={{ bottom: '20%', opacity: 0.8 }} animate={{ bottom: '80%', opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}
              {isRunning && [...Array(4)].map((_, i) => (
                <motion.div key={`c-${i}`} className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
                  style={{ right: `${22 + Math.random() * 8}%` }}
                  initial={{ bottom: '20%', opacity: 0.8 }} animate={{ bottom: '80%', opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </AnimatePresence>

            {/* Ion flow */}
            <AnimatePresence>
              {isRunning && [...Array(2)].map((_, i) => (
                <React.Fragment key={`ion-${i}`}>
                  <motion.div className="absolute w-2.5 h-2.5 rounded-full bg-red-400/50 text-[5px] font-bold text-red-800 flex items-center justify-center"
                    initial={{ left: '45%', top: `${35 + i * 18}%` }} animate={{ left: '73%' }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
                  >+</motion.div>
                  <motion.div className="absolute w-2.5 h-2.5 rounded-full bg-blue-400/50 text-[5px] font-bold text-blue-800 flex items-center justify-center"
                    initial={{ left: '55%', top: `${40 + i * 18}%` }} animate={{ left: '27%' }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
                  >−</motion.div>
                </React.Fragment>
              ))}
            </AnimatePresence>
          </div>

          {/* Labels */}
          <div className="absolute bottom-2 left-4 lg:left-[15%] text-center">
            <p className="text-[8px] lg:text-[10px] font-bold text-[#64748B]">Anode (+)</p>
            <p className="text-[7px] lg:text-[9px] text-[#94A3B8]">{setup.anodeProduct}</p>
          </div>
          <div className="absolute bottom-2 right-4 lg:right-[15%] text-center">
            <p className="text-[8px] lg:text-[10px] font-bold text-[#64748B]">Cathode (−)</p>
            <p className="text-[7px] lg:text-[9px] text-[#94A3B8]">{setup.cathodeProduct}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="p-3 lg:p-6 bg-white border-t border-[#F1F5F9] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-8">
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#64748B]" />
                <label className="text-[10px] lg:text-xs font-bold text-[#64748B] uppercase">Voltage (V)</label>
              </div>
              <span className="text-[10px] lg:text-xs font-mono font-bold">{voltage} V</span>
            </div>
            <Slider value={[voltage]} min={2} max={12} step={1} onValueChange={(v) => setVoltage(v[0])} />
          </div>
          <div className="flex items-center gap-2">
            <Button size="default" className={`flex-1 sm:flex-none sm:w-28 shadow-md ${isRunning ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'}`}
              onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? <><PauseIcon className="w-4 h-4 mr-1" />Stop</> : <><Play className="w-4 h-4 mr-1" />Start</>}
            </Button>
            <Button variant="outline" onClick={resetLab}><RotateCcw className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[340px] flex flex-col gap-4 lg:gap-6 shrink-0">
        <Card className="p-4 lg:p-6 border-[#E2E8F0] shadow-sm">
          <h3 className="font-bold text-base lg:text-lg tracking-tight mb-4">Cell Analysis</h3>
          <div className="space-y-3">
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">Electrolyte</span>
              <p className="text-xs lg:text-sm font-mono font-bold text-[#0F172A]">{setup.electrolyte}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl border border-red-100">
              <span className="text-[10px] font-bold text-red-400 uppercase block mb-1">Anode (Oxidation)</span>
              <p className="text-[10px] lg:text-sm font-mono font-medium text-red-800">{setup.anodeReaction}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-[10px] font-bold text-blue-400 uppercase block mb-1">Cathode (Reduction)</span>
              <p className="text-[10px] lg:text-sm font-mono font-medium text-blue-800">{setup.cathodeReaction}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-[9px] font-bold text-[#64748B] uppercase mb-1">Anode Gas</p>
                <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-red-400 rounded-full" animate={{ width: `${gasAnodeLevel}%` }} />
                </div>
                <p className="text-[9px] font-mono text-[#94A3B8] mt-0.5">{gasAnodeLevel.toFixed(0)}%</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-bold text-[#64748B] uppercase mb-1">Cathode Gas</p>
                <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-blue-400 rounded-full" animate={{ width: `${gasCathodeLevel}%` }} />
                </div>
                <p className="text-[9px] font-mono text-[#94A3B8] mt-0.5">{gasCathodeLevel.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-6 border-[#E2E8F0] shadow-sm bg-[#1E293B] text-white">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-xs lg:text-sm uppercase tracking-wider">How It Works</h3>
          </div>
          <p className="text-[10px] lg:text-xs text-blue-100/80 leading-relaxed">{setup.description}</p>
        </Card>
      </div>
    </div>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

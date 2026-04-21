import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Factory, Play, RotateCcw, Info, Droplets, Wind, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ChlorAlkaliLab() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [current, setCurrent] = useState(5);
  const [chlorine, setChlorine] = useState(0);
  const [hydrogen, setHydrogen] = useState(0);
  const [naoh, setNaoh] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        const rate = current / 50;
        setTime(prev => prev + 0.1);
        setChlorine(prev => Math.min(100, prev + rate * 0.8));
        setHydrogen(prev => Math.min(100, prev + rate));
        setNaoh(prev => Math.min(100, prev + rate * 0.9));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, current]);

  const resetLab = () => { setIsRunning(false); setTime(0); setChlorine(0); setHydrogen(0); setNaoh(0); };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-3 lg:p-6 overflow-auto">
      {/* Main */}
      <div className="flex-1 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden min-h-0">
        <div className="p-3 lg:p-4 border-b border-[#F1F5F9] flex justify-between items-center bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Factory className="w-4 h-4 lg:w-5 lg:h-5 text-[#2563EB]" />
            <span className="font-bold text-xs lg:text-sm tracking-tight uppercase text-[#1E293B]">Chlor-Alkali</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[9px]">UNIT 6</Badge>
            <span className="text-[10px] font-mono font-bold text-[#2563EB]">{time.toFixed(1)}s</span>
          </div>
        </div>

        {/* Viz */}
        <div className="relative bg-[#1E293B] overflow-hidden simulation-grid py-6 lg:py-0 lg:flex-1 min-h-[300px] flex items-center justify-center">
          {/* Equation */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 max-w-[95%]">
            <p className="text-[9px] lg:text-sm font-mono font-bold text-white text-center">
              2NaCl + 2H₂O → Cl₂ + H₂ + 2NaOH
            </p>
          </div>

          {/* Simplified cell */}
          <div className="relative w-[280px] lg:w-[400px] h-[200px] lg:h-[240px] mt-6">
            {/* Brine */}
            <div className="absolute top-0 left-2 flex flex-col items-center">
              <motion.div animate={{ y: isRunning ? [0, 3, 0] : 0 }} transition={{ repeat: Infinity, duration: 2 }}
                className="w-8 h-8 lg:w-10 lg:h-10 bg-cyan-500/20 border border-cyan-500/40 rounded-lg flex items-center justify-center">
                <Droplets className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
              </motion.div>
              <span className="text-[8px] lg:text-[10px] font-bold text-cyan-400 mt-1">Brine</span>
            </div>

            {/* Cell body */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[240px] lg:w-[320px] h-[120px] lg:h-[150px] bg-white/5 border-2 border-white/20 rounded-2xl overflow-hidden">
              {/* Membrane */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full z-10">
                <motion.div className="w-full h-full"
                  animate={{ opacity: isRunning ? [0.3, 1, 0.3] : 0.5 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ background: 'linear-gradient(180deg, #FBBF24, #F59E0B)' }}
                />
              </div>
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[6px] lg:text-[7px] font-bold text-yellow-400 z-20 bg-[#1E293B] px-1">MEMBRANE</span>

              {/* Anode */}
              <div className="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center">
                <div className="w-3 h-14 lg:h-16 bg-[#94A3B8] rounded-sm mb-1" />
                <span className="text-[8px] font-bold text-red-400">ANODE</span>
                <AnimatePresence>
                  {isRunning && [...Array(3)].map((_, i) => (
                    <motion.div key={`cl-${i}`} className="absolute w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: 'rgba(74, 222, 128, 0.5)', left: `${15 + Math.random() * 25}%` }}
                      initial={{ bottom: '25%', opacity: 0.8 }} animate={{ bottom: '85%', opacity: 0 }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5 }}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Cathode */}
              <div className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center">
                <div className="w-3 h-14 lg:h-16 bg-[#475569] rounded-sm mb-1" />
                <span className="text-[8px] font-bold text-blue-400">CATHODE</span>
                <AnimatePresence>
                  {isRunning && [...Array(4)].map((_, i) => (
                    <motion.div key={`h-${i}`} className="absolute w-1 h-1 rounded-full bg-white/40"
                      style={{ right: `${15 + Math.random() * 25}%` }}
                      initial={{ bottom: '25%', opacity: 0.8 }} animate={{ bottom: '85%', opacity: 0 }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Output labels */}
            <div className="absolute bottom-0 left-[10%] flex flex-col items-center">
              <div className="w-6 h-6 bg-green-500/20 border border-green-500/40 rounded flex items-center justify-center">
                <Wind className="w-3 h-3 text-green-400" />
              </div>
              <span className="text-[8px] font-bold text-green-400 mt-0.5">Cl₂</span>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-6 h-6 bg-purple-500/20 border border-purple-500/40 rounded flex items-center justify-center">
                <Droplets className="w-3 h-3 text-purple-400" />
              </div>
              <span className="text-[8px] font-bold text-purple-400 mt-0.5">NaOH</span>
            </div>
            <div className="absolute bottom-0 right-[10%] flex flex-col items-center">
              <div className="w-6 h-6 bg-white/10 border border-white/20 rounded flex items-center justify-center">
                <Wind className="w-3 h-3 text-white/60" />
              </div>
              <span className="text-[8px] font-bold text-white/60 mt-0.5">H₂</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-3 lg:p-6 bg-white border-t border-[#F1F5F9] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#64748B]" />
                <label className="text-[10px] lg:text-xs font-bold text-[#64748B] uppercase">Current (A)</label>
              </div>
              <span className="text-[10px] lg:text-xs font-mono font-bold">{current} A</span>
            </div>
            <Slider value={[current]} min={1} max={20} step={1} onValueChange={(v) => setCurrent(v[0])} />
          </div>
          <div className="flex items-center gap-2">
            <Button className={`flex-1 sm:flex-none sm:w-28 shadow-md ${isRunning ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'}`}
              onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? 'Stop' : <><Play className="w-4 h-4 mr-1" />Start</>}
            </Button>
            <Button variant="outline" onClick={resetLab}><RotateCcw className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[320px] flex flex-col gap-4 shrink-0">
        <Card className="p-4 lg:p-6 border-[#E2E8F0] shadow-sm">
          <h3 className="font-bold text-base lg:text-lg tracking-tight mb-4">Production</h3>
          <div className="space-y-4">
            {[
              { name: 'Chlorine (Cl₂)', value: chlorine, color: 'bg-green-500', textColor: 'text-green-600', use: 'PVC, disinfectants' },
              { name: 'Hydrogen (H₂)', value: hydrogen, color: 'bg-[#94A3B8]', textColor: 'text-[#64748B]', use: 'Ammonia, fuel cells' },
              { name: 'NaOH', value: naoh, color: 'bg-purple-500', textColor: 'text-purple-600', use: 'Soap, paper' },
            ].map(p => (
              <div key={p.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] lg:text-xs font-bold text-[#0F172A]">{p.name}</span>
                  <span className={`text-[10px] font-mono font-bold ${p.textColor}`}>{p.value.toFixed(0)}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <motion.div className={`h-full ${p.color} rounded-full`} animate={{ width: `${p.value}%` }} />
                </div>
                <p className="text-[9px] text-[#94A3B8] mt-0.5">{p.use}</p>
              </div>
            ))}

            <Separator />
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <h4 className="text-[9px] font-bold text-[#64748B] uppercase mb-1.5">Membrane Process</h4>
              <ul className="space-y-0.5 text-[9px] lg:text-[10px] text-[#475569]">
                <li>• Brine enters anode compartment</li>
                <li>• Na⁺ passes through membrane</li>
                <li>• Cl⁻ oxidised → Cl₂ at anode</li>
                <li>• H₂O reduced → H₂ + OH⁻ at cathode</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-[#E2E8F0] shadow-sm bg-[#1E293B] text-white">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-xs uppercase tracking-wider">Industry</h3>
          </div>
          <p className="text-[10px] text-blue-100/80 leading-relaxed">
            The membrane cell is the most modern chlor-alkali method. It prevents contamination between compartments.
          </p>
        </Card>
      </div>
    </div>
  );
}

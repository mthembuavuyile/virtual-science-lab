import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  RotateCcw, 
  Info,
  ArrowRight,
  Activity,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Metal {
  id: string;
  name: string;
  symbol: string;
  reductionPotential: number; // Volts (E0)
  color: string;
  ionColor: string;
}

const metals: Metal[] = [
  { id: 'li', name: 'Lithium', symbol: 'Li', reductionPotential: -3.04, color: '#E2E8F0', ionColor: '#F1F5F9' },
  { id: 'mg', name: 'Magnesium', symbol: 'Mg', reductionPotential: -2.37, color: '#CBD5E1', ionColor: '#E2E8F0' },
  { id: 'al', name: 'Aluminum', symbol: 'Al', reductionPotential: -1.66, color: '#94A3B8', ionColor: '#CBD5E1' },
  { id: 'zn', name: 'Zinc', symbol: 'Zn', reductionPotential: -0.76, color: '#64748B', ionColor: '#94A3B8' },
  { id: 'fe', name: 'Iron', symbol: 'Fe', reductionPotential: -0.44, color: '#475569', ionColor: '#64748B' },
  { id: 'cu', name: 'Copper', symbol: 'Cu', reductionPotential: 0.34, color: '#B45309', ionColor: '#3B82F6' },
  { id: 'ag', name: 'Silver', symbol: 'Ag', reductionPotential: 0.80, color: '#F8FAFC', ionColor: '#E2E8F0' },
  { id: 'au', name: 'Gold', symbol: 'Au', reductionPotential: 1.50, color: '#FBBF24', ionColor: '#FEF3C7' },
];

export default function GalvanicCellLab() {
  const [leftMetal, setLeftMetal] = useState<Metal>(metals[3]); // Zinc
  const [rightMetal, setRightMetal] = useState<Metal>(metals[5]); // Copper
  const [isConnected, setIsConnected] = useState(false);

  const cellPotential = useMemo(() => {
    const e0_left = leftMetal.reductionPotential;
    const e0_right = rightMetal.reductionPotential;
    
    // Anode is the one with lower reduction potential (more negative)
    // Cathode is the one with higher reduction potential
    const cathode = Math.max(e0_left, e0_right);
    const anode = Math.min(e0_left, e0_right);
    
    return cathode - anode;
  }, [leftMetal, rightMetal]);

  const anode = leftMetal.reductionPotential < rightMetal.reductionPotential ? leftMetal : rightMetal;
  const cathode = leftMetal.reductionPotential < rightMetal.reductionPotential ? rightMetal : leftMetal;

  const resetLab = () => {
    setIsConnected(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-3 lg:p-6 overflow-auto">
      {/* Simulation Visual Area */}
      <div className="flex-1 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden min-h-[400px] lg:min-h-0">
        <div className="p-4 border-b border-[#F1F5F9] flex justify-between items-center bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#2563EB]" />
            <span className="font-bold text-sm tracking-tight uppercase text-[#1E293B]">Galvanic Cell Setup</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono bg-white px-3 py-1 rounded-full border border-[#E2E8F0]">
              <span className="text-[#64748B]">Voltmeter:</span>
              <span className="font-bold text-[#2563EB]">{isConnected ? cellPotential.toFixed(2) : '0.00'} V</span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative bg-[#F8FAFC] flex items-center justify-center overflow-hidden simulation-grid min-h-[320px] lg:min-h-[400px]">
          {/* Voltmeter */}
          <div className="absolute top-8 lg:top-12 left-1/2 -translate-x-1/2 flex flex-col items-center scale-75 lg:scale-100 origin-top">
            <div className="w-24 h-24 bg-[#1E293B] rounded-2xl border-4 border-[#475569] flex flex-col items-center justify-center shadow-xl relative">
              <div className="text-emerald-400 font-mono text-xl font-bold">
                {isConnected ? cellPotential.toFixed(2) : '0.00'}
              </div>
              <div className="text-[10px] text-white/40 font-bold uppercase">Volts</div>
              {/* Wires */}
              <div className="absolute -left-12 top-1/2 w-12 h-1 bg-red-500" />
              <div className="absolute -right-12 top-1/2 w-12 h-1 bg-black" />
            </div>
          </div>

          {/* Left Beaker */}
          <div className="absolute bottom-8 lg:bottom-12 left-1/4 -translate-x-1/2 flex flex-col items-center scale-75 lg:scale-100 origin-bottom z-10">
            <div className="relative w-40 h-48 bg-white/40 border-2 border-white/60 rounded-b-3xl overflow-hidden shadow-inner">
              {/* Solution */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-[70%] transition-colors duration-500"
                style={{ backgroundColor: leftMetal.ionColor, opacity: 0.6 }}
              />
              {/* Electrode */}
              <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-40 shadow-md z-10"
                style={{ backgroundColor: leftMetal.color }}
                whileHover={{ y: -5 }}
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs font-bold text-[#0F172A]">{leftMetal.name} Electrode</p>
              <p className="text-[10px] text-[#64748B]">{leftMetal.symbol}²⁺ Solution</p>
            </div>
          </div>

          {/* Right Beaker */}
          <div className="absolute bottom-8 lg:bottom-12 right-1/4 translate-x-1/2 flex flex-col items-center scale-75 lg:scale-100 origin-bottom z-10">
            <div className="relative w-40 h-48 bg-white/40 border-2 border-white/60 rounded-b-3xl overflow-hidden shadow-inner">
              {/* Solution */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-[70%] transition-colors duration-500"
                style={{ backgroundColor: rightMetal.ionColor, opacity: 0.6 }}
              />
              {/* Electrode */}
              <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-40 shadow-md z-10"
                style={{ backgroundColor: rightMetal.color }}
                whileHover={{ y: -5 }}
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs font-bold text-[#0F172A]">{rightMetal.name} Electrode</p>
              <p className="text-[10px] text-[#64748B]">{rightMetal.symbol}²⁺ Solution</p>
            </div>
          </div>

          {/* Salt Bridge */}
          <div className="absolute bottom-28 lg:bottom-32 left-1/2 -translate-x-1/2 w-[60%] lg:w-[40%] h-12 border-x-8 border-t-8 border-white/80 rounded-t-full scale-75 lg:scale-100 origin-bottom z-0" />

          {/* Electron Flow Animation */}
          <AnimatePresence>
            {isConnected && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-24 w-[50%] h-1 pointer-events-none"
              >
                <div className="relative w-full h-full">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_8px_#FBBF24]"
                      initial={{ left: anode === leftMetal ? '0%' : '100%' }}
                      animate={{ left: anode === leftMetal ? '100%' : '0%' }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: i * 0.4,
                        ease: 'linear'
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selection Panel */}
        <div className="p-4 lg:p-6 bg-white border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
          <div className="space-y-2 lg:space-y-4">
            <label className="text-xs font-bold text-[#64748B] uppercase">Left Electrode</label>
            <div className="grid grid-cols-4 gap-2">
              {metals.map(m => (
                <button
                  key={m.id}
                  onClick={() => setLeftMetal(m)}
                  className={`p-2 rounded-lg border-2 transition-all ${leftMetal.id === m.id ? 'border-[#0F172A] bg-[#F1F5F9]' : 'border-transparent hover:bg-[#F8FAFC]'}`}
                >
                  <div className="w-full h-4 rounded-sm mb-1" style={{ backgroundColor: m.color }} />
                  <span className="text-[10px] font-bold">{m.symbol}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2 lg:space-y-4">
            <label className="text-xs font-bold text-[#64748B] uppercase">Right Electrode</label>
            <div className="grid grid-cols-4 gap-2">
              {metals.map(m => (
                <button
                  key={m.id}
                  onClick={() => setRightMetal(m)}
                  className={`p-2 rounded-lg border-2 transition-all ${rightMetal.id === m.id ? 'border-[#0F172A] bg-[#F1F5F9]' : 'border-transparent hover:bg-[#F8FAFC]'}`}
                >
                  <div className="w-full h-4 rounded-sm mb-1" style={{ backgroundColor: m.color }} />
                  <span className="text-[10px] font-bold">{m.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Panel */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4 lg:gap-6 shrink-0">
        <Card className="flex-1 p-6 border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg tracking-tight">Cell Analysis</h3>
            <Activity className="w-5 h-5 text-[#94A3B8]" />
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#64748B] uppercase">Anode (Oxidation)</span>
                <Badge className="bg-[#EF4444]">{anode.symbol}</Badge>
              </div>
              <p className="text-sm font-mono font-medium text-[#0F172A]">
                {anode.symbol} → {anode.symbol}²⁺ + 2e⁻
              </p>
              <p className="text-[10px] text-[#94A3B8] mt-1">E° = {anode.reductionPotential.toFixed(2)} V</p>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-[#CBD5E1]" />
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#64748B] uppercase">Cathode (Reduction)</span>
                <Badge className="bg-[#3B82F6]">{cathode.symbol}</Badge>
              </div>
              <p className="text-sm font-mono font-medium text-[#0F172A]">
                {cathode.symbol}²⁺ + 2e⁻ → {cathode.symbol}
              </p>
              <p className="text-[10px] text-[#94A3B8] mt-1">E° = {cathode.reductionPotential.toFixed(2)} V</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <Button 
                className={`w-full h-12 text-lg font-bold shadow-md ${isConnected ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'}`}
                onClick={() => setIsConnected(!isConnected)}
              >
                {isConnected ? 'Disconnect Circuit' : 'Connect Circuit'}
              </Button>
              <Button variant="outline" className="w-full border-[#E2E8F0]" onClick={resetLab}>
                <RotateCcw className="w-4 h-4 mr-2" /> Reset Lab
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#E2E8F0] shadow-sm bg-[#1E293B] text-white">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-sm uppercase tracking-wider">How it works</h3>
          </div>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            Electrons flow from the **Anode** (where oxidation occurs) to the **Cathode** (where reduction occurs). The salt bridge maintains electrical neutrality by allowing ions to migrate between the half-cells.
          </p>
        </Card>
      </div>
    </div>
  );
}

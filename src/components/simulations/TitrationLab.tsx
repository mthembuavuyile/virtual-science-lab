import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplets, 
  RotateCcw, 
  Play, 
  Pause, 
  Info,
  Thermometer,
  FlaskConical,
  Pipette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface DataPoint {
  volume: number;
  ph: number;
}

export default function TitrationLab() {
  // State
  const [buretteVolume, setBuretteVolume] = useState(50); // Total volume in burette (mL)
  const [addedVolume, setAddedVolume] = useState(0); // Volume added to flask (mL)
  const [isTitrating, setIsTitrating] = useState(false);
  const [flowRate, setFlowRate] = useState(0.5); // mL per second
  const [data, setData] = useState<DataPoint[]>([{ volume: 0, ph: 1.0 }]);
  const [indicator, setIndicator] = useState<'phenolphthalein' | 'methyl-orange' | 'litmus'>('phenolphthalein');
  
  // Constants for simulation (HCl + NaOH)
  const acidConcentration = 0.1; // mol/dm3
  const acidVolume = 25; // mL
  const baseConcentration = 0.1; // mol/dm3
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate pH based on volume added
  const calculatePH = (vBase: number) => {
    const nAcid = (acidConcentration * acidVolume) / 1000;
    const nBase = (baseConcentration * vBase) / 1000;
    const totalVolume = (acidVolume + vBase) / 1000;

    if (nBase < nAcid) {
      // Acidic region
      const hPlus = (nAcid - nBase) / totalVolume;
      return -Math.log10(hPlus);
    } else if (nBase === nAcid) {
      // Equivalence point
      return 7.0;
    } else {
      // Basic region
      const ohMinus = (nBase - nAcid) / totalVolume;
      const pOH = -Math.log10(ohMinus);
      return 14 - pOH;
    }
  };

  useEffect(() => {
    if (isTitrating && buretteVolume > 0) {
      timerRef.current = setInterval(() => {
        setAddedVolume(prev => {
          const next = prev + (flowRate / 10); // Update every 100ms
          const currentPH = calculatePH(next);
          setData(d => [...d, { volume: Number(next.toFixed(2)), ph: Number(currentPH.toFixed(2)) }]);
          return next;
        });
        setBuretteVolume(prev => Math.max(0, prev - (flowRate / 10)));
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTitrating, flowRate]);

  const resetLab = () => {
    setIsTitrating(false);
    setBuretteVolume(50);
    setAddedVolume(0);
    setData([{ volume: 0, ph: 1.0 }]);
  };

  const currentPH = calculatePH(addedVolume);

  // Indicator Color Logic
  const getFlaskColor = () => {
    if (indicator === 'phenolphthalein') {
      return currentPH > 8.2 ? 'rgba(236, 72, 153, 0.6)' : 'rgba(255, 255, 255, 0.4)';
    }
    if (indicator === 'methyl-orange') {
      if (currentPH < 3.1) return 'rgba(239, 68, 68, 0.6)';
      if (currentPH > 4.4) return 'rgba(251, 191, 36, 0.6)';
      return 'rgba(249, 115, 22, 0.6)';
    }
    if (indicator === 'litmus') {
      return currentPH < 7 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(59, 130, 246, 0.6)';
    }
    return 'rgba(255, 255, 255, 0.4)';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-3 lg:p-6 overflow-auto">
      {/* Simulation Visual Area */}
      <div className="flex-1 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden min-h-[400px] lg:min-h-0">
        <div className="p-4 border-b border-[#F1F5F9] flex justify-between items-center bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Pipette className="w-5 h-5 text-[#2563EB]" />
            <span className="font-bold text-sm tracking-tight uppercase text-[#1E293B]">Titration Setup</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono bg-white px-3 py-1 rounded-full border border-[#E2E8F0]">
              <span className="text-[#64748B]">pH:</span>
              <span className="font-bold text-[#2563EB]">{currentPH.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-white px-3 py-1 rounded-full border border-[#E2E8F0]">
              <span className="text-[#64748B]">Volume Added:</span>
              <span className="font-bold text-[#2563EB]">{addedVolume.toFixed(2)} mL</span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative flex items-center justify-center bg-[#F8FAFC] overflow-hidden simulation-grid">
          {/* Burette */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-6 h-64 bg-white/80 border-2 border-[#94A3B8] rounded-full relative overflow-hidden">
              {/* Liquid in Burette */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-blue-200/50"
                animate={{ height: `${(buretteVolume / 50) * 100}%` }}
                transition={{ type: 'tween' }}
              />
              {/* Scale marks */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 px-1 pointer-events-none">
                {[...Array(11)].map((_, i) => (
                  <div key={i} className="w-full h-[1px] bg-[#CBD5E1] flex justify-end">
                    <span className="text-[6px] text-[#94A3B8] -mt-1 mr-1">{i * 5}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Stopcock */}
            <div className="w-10 h-4 bg-[#475569] rounded-sm mt-[-2px] relative z-10">
              <div className={`w-1 h-6 bg-[#1E293B] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform ${isTitrating ? 'rotate-90' : 'rotate-0'}`} />
            </div>
            {/* Tip */}
            <div className="w-2 h-8 bg-[#94A3B8] rounded-b-full" />
            
            {/* Droplets */}
            <AnimatePresence>
              {isTitrating && (
                <motion.div
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: 120, opacity: 0 }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-[340px]"
                >
                  <Droplets className="w-3 h-3 text-blue-400 fill-blue-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Erlenmeyer Flask */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <div className="relative w-32 h-32">
              <FlaskConical className="w-full h-full text-[#475569] relative z-10" strokeWidth={1.5} />
              {/* Liquid in Flask */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] overflow-hidden">
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 transition-colors duration-500"
                  style={{ 
                    height: `${((acidVolume + addedVolume) / 100) * 100}%`,
                    backgroundColor: getFlaskColor()
                  }}
                />
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-20 left-12 space-y-4">
            <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-sm max-w-[180px]">
              <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Burette Content</p>
              <p className="text-xs font-semibold text-[#0F172A]">NaOH (Base)</p>
              <p className="text-[10px] text-[#94A3B8]">Concentration: 0.1 mol/dm³</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-sm max-w-[180px]">
              <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Flask Content</p>
              <p className="text-xs font-semibold text-[#0F172A]">HCl (Acid)</p>
              <p className="text-[10px] text-[#94A3B8]">Volume: 25.00 mL</p>
              <p className="text-[10px] text-[#94A3B8]">Concentration: 0.1 mol/dm³</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 lg:p-6 bg-white border-t border-[#F1F5F9] flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:gap-8">
          <div className="flex-1 space-y-2 lg:space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] lg:text-xs font-bold text-[#64748B] uppercase">Flow Rate (mL/s)</label>
              <span className="text-[10px] lg:text-xs font-mono font-bold text-[#0F172A]">{flowRate.toFixed(1)}</span>
            </div>
            <Slider 
              value={[flowRate]} 
              min={0.1} 
              max={2.0} 
              step={0.1} 
              onValueChange={(v) => setFlowRate(v[0])} 
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <Button 
              size="default" 
              className={`flex-1 sm:flex-none sm:w-32 shadow-md ${isTitrating ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'}`}
              onClick={() => setIsTitrating(!isTitrating)}
            >
              {isTitrating ? (
                <><Pause className="w-4 h-4 mr-2" /> Stop</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Start</>
              )}
            </Button>
            <Button variant="outline" size="lg" className="border-[#E2E8F0]" onClick={resetLab}>
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Analysis Panel */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4 lg:gap-6 shrink-0">
        <Card className="flex-1 p-6 border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg tracking-tight">Titration Curve</h3>
            <Badge variant="outline" className="text-[10px] font-bold">REAL-TIME DATA</Badge>
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="volume" 
                  label={{ value: 'Volume Base (mL)', position: 'insideBottom', offset: -5, fontSize: 10 }}
                  fontSize={10}
                  tick={{ fill: '#94A3B8' }}
                />
                <YAxis 
                  domain={[0, 14]} 
                  label={{ value: 'pH', angle: -90, position: 'insideLeft', fontSize: 10 }}
                  fontSize={10}
                  tick={{ fill: '#94A3B8' }}
                />
                <Tooltip 
                  contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelFormatter={(v) => `Volume: ${v} mL`}
                />
                <ReferenceLine y={7} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Equivalence', position: 'right', fontSize: 8, fill: '#EF4444' }} />
                <Line 
                  type="monotone" 
                  dataKey="ph" 
                  stroke="#0F172A" 
                  strokeWidth={2} 
                  dot={false} 
                  animationDuration={0}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 pt-6 border-t border-[#F1F5F9]">
            <h4 className="text-xs font-bold text-[#64748B] uppercase mb-3">Indicator Selection</h4>
            <div className="grid grid-cols-3 gap-2">
              <IndicatorButton 
                label="Phenol." 
                active={indicator === 'phenolphthalein'} 
                onClick={() => setIndicator('phenolphthalein')} 
              />
              <IndicatorButton 
                label="Methyl O." 
                active={indicator === 'methyl-orange'} 
                onClick={() => setIndicator('methyl-orange')} 
              />
              <IndicatorButton 
                label="Litmus" 
                active={indicator === 'litmus'} 
                onClick={() => setIndicator('litmus')} 
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#E2E8F0] shadow-sm bg-[#1E293B] text-white">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Scientific Insight</h3>
          </div>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            The equivalence point is reached when the moles of base added equal the moles of acid initially present. For a strong acid-strong base titration like HCl and NaOH, the pH at equivalence is exactly 7.0.
          </p>
        </Card>
      </div>
    </div>
  );
}

function IndicatorButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-2 py-2 rounded-lg text-[10px] font-bold transition-all duration-200
        ${active ? 'bg-[#0F172A] text-white shadow-md' : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] hover:bg-[#F1F5F9]'}
      `}
    >
      {label}
    </button>
  );
}

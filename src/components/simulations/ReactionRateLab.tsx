import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Thermometer, 
  Zap, 
  Layers, 
  Play, 
  RotateCcw,
  Info,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export default function ReactionRateLab() {
  // Variables
  const [temperature, setTemperature] = useState(298); // Kelvin
  const [concentration, setConcentration] = useState(1.0); // mol/dm3
  const [surfaceArea, setSurfaceArea] = useState<'low' | 'high'>('low');
  const [hasCatalyst, setHasCatalyst] = useState(false);
  
  // Simulation State
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [productAmount, setProductAmount] = useState(0);
  const [data, setData] = useState<{ time: number, amount: number }[]>([{ time: 0, amount: 0 }]);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Initialize Particles
  useEffect(() => {
    const count = Math.floor(concentration * 20);
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const speed = (temperature / 100) * (hasCatalyst ? 1.5 : 1);
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        color: i % 2 === 0 ? '#3B82F6' : '#EF4444'
      });
    }
    setParticles(newParticles);
  }, [concentration, temperature, hasCatalyst]);

  // Simulation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 0.1);
        
        // Calculate reaction rate factor
        // Rate = k * [A]^n
        // k increases with Temp (Arrhenius) and Catalyst
        const k = Math.exp(-1000 / (8.314 * temperature)) * 1000000 * (hasCatalyst ? 2.5 : 1);
        const surfaceFactor = surfaceArea === 'high' ? 2 : 1;
        const rate = k * concentration * surfaceFactor;
        
        setProductAmount(prev => {
          const next = Math.min(100, prev + rate);
          setData(d => [...d, { time: Number((time + 0.1).toFixed(1)), amount: Number(next.toFixed(2)) }]);
          return next;
        });

        // Update particle positions
        setParticles(prev => prev.map(p => {
          let nx = p.x + p.vx;
          let ny = p.y + p.vy;
          let nvx = p.vx;
          let nvy = p.vy;

          if (nx < 0 || nx > 100) nvx = -nvx;
          if (ny < 0 || ny > 100) nvy = -nvy;

          return { ...p, x: nx, y: ny, vx: nvx, vy: nvy };
        }));

        if (productAmount >= 100) setIsRunning(false);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, temperature, concentration, surfaceArea, hasCatalyst, time, productAmount]);

  const resetLab = () => {
    setIsRunning(false);
    setTime(0);
    setProductAmount(0);
    setData([{ time: 0, amount: 0 }]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-3 lg:p-6 overflow-auto">
      {/* Simulation Visual Area */}
      <div className="flex-1 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden min-h-[350px] lg:min-h-0">
        <div className="p-4 border-b border-[#F1F5F9] flex justify-between items-center bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#2563EB]" />
            <span className="font-bold text-sm tracking-tight uppercase text-[#1E293B]">Collision Theory Lab</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono bg-white px-3 py-1 rounded-full border border-[#E2E8F0]">
              <span className="text-[#64748B]">Reaction Progress:</span>
              <span className="font-bold text-[#2563EB]">{productAmount.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative bg-[#1E293B] overflow-hidden simulation-grid">
          {/* Particle Container */}
          <div className="absolute inset-0 m-8 border-2 border-white/10 rounded-2xl overflow-hidden bg-black/20">
            {particles.map(p => (
              <motion.div
                key={p.id}
                className="absolute w-3 h-3 rounded-full shadow-lg"
                style={{ 
                  left: `${p.x}%`, 
                  top: `${p.y}%`, 
                  backgroundColor: p.color,
                  boxShadow: `0 0 10px ${p.color}44`
                }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 0 }}
              />
            ))}
            
            {/* Catalyst Surface if enabled */}
            {hasCatalyst && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-0 left-0 right-0 h-4 bg-emerald-500/30 border-t border-emerald-500/50 flex items-center justify-center"
              >
                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Catalytic Surface Active</span>
              </motion.div>
            )}
          </div>

          {/* Stats Overlay */}
          <div className="absolute top-12 left-12 grid grid-cols-2 gap-4">
            <div className="bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <p className="text-[8px] font-bold text-white/40 uppercase mb-1">Avg. Kinetic Energy</p>
              <p className="text-sm font-mono font-bold text-white">{(temperature * 0.01).toFixed(2)} eV</p>
            </div>
            <div className="bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <p className="text-[8px] font-bold text-white/40 uppercase mb-1">Collision Frequency</p>
              <p className="text-sm font-mono font-bold text-white">{(concentration * temperature * 0.005).toFixed(1)} Hz</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 lg:p-6 bg-white border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
          <div className="space-y-4 lg:space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-[#64748B]" />
                  <label className="text-xs font-bold text-[#64748B] uppercase">Temperature (K)</label>
                </div>
                <span className="text-xs font-mono font-bold text-[#0F172A]">{temperature} K</span>
              </div>
              <Slider 
                value={[temperature]} 
                min={273} 
                max={500} 
                step={1} 
                onValueChange={(v) => setTemperature(v[0])} 
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#64748B]" />
                  <label className="text-xs font-bold text-[#64748B] uppercase">Concentration (M)</label>
                </div>
                <span className="text-xs font-mono font-bold text-[#0F172A]">{concentration.toFixed(1)} M</span>
              </div>
              <Slider 
                value={[concentration]} 
                min={0.1} 
                max={5.0} 
                step={0.1} 
                onValueChange={(v) => setConcentration(v[0])} 
              />
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-[#F8FAFC] p-3 lg:p-4 rounded-xl border border-[#E2E8F0] gap-3">
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-[#475569]">Catalyst</span>
                </div>
                <Switch checked={hasCatalyst} onCheckedChange={setHasCatalyst} />
              </div>
              <Separator orientation="vertical" className="hidden sm:block h-8" />
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <span className="text-xs font-bold text-[#475569]">High Surface Area</span>
                <Switch checked={surfaceArea === 'high'} onCheckedChange={(v) => setSurfaceArea(v ? 'high' : 'low')} />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <Button 
                size="lg" 
                className={`flex-1 shadow-md ${isRunning ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'}`}
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? <><Pause className="w-4 h-4 mr-2" /> Stop</> : <><Play className="w-4 h-4 mr-2" /> Start</>}
              </Button>
              <Button variant="outline" size="lg" className="border-[#E2E8F0]" onClick={resetLab}>
                <RotateCcw className="w-4 h-4 mr-2" /> Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Panel */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4 lg:gap-6 shrink-0">
        <Card className="flex-1 p-6 border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg tracking-tight">Reaction Progress</h3>
            <TrendingUp className="w-5 h-5 text-[#94A3B8]" />
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fontSize: 10 }}
                  fontSize={10}
                  tick={{ fill: '#94A3B8' }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  label={{ value: 'Product (%)', angle: -90, position: 'insideLeft', fontSize: 10 }}
                  fontSize={10}
                  tick={{ fill: '#94A3B8' }}
                />
                <Tooltip 
                  contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  strokeWidth={3} 
                  dot={false} 
                  animationDuration={0}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 border-[#E2E8F0] shadow-sm bg-[#1E293B] text-white">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Collision Theory</h3>
          </div>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            For a reaction to occur, particles must collide with **sufficient kinetic energy** (Activation Energy) and the **correct orientation**. Increasing temperature increases the average kinetic energy, leading to more frequent and more energetic collisions.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Pause({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

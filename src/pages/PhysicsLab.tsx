import React, { useState, useEffect, useRef } from 'react';
import { Zap, Activity } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function PhysicsLab() {
  const [activeTab, setActiveTab] = useState<'circuit' | 'kinematics'>('circuit');

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Zap className="text-blue-600 w-6 h-6" />
          </div>
          Physics Laboratory
        </h1>
        <div className="flex bg-slate-200 p-1 rounded-lg">
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'circuit' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setActiveTab('circuit')}
          >
            Ohm's Law Circuit
          </button>
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'kinematics' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setActiveTab('kinematics')}
          >
            Projectile Motion
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {activeTab === 'circuit' ? <CircuitSimulator /> : <ProjectileSimulator />}
      </div>
    </div>
  );
}

function CircuitSimulator() {
  const [voltage, setVoltage] = useState(9);
  const [resistance, setResistance] = useState(10);
  
  const current = voltage / resistance;
  const power = voltage * current;

  // Animation logic for electron flow
  const dotRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(0);

  useEffect(() => {
    let animationFrameId: number;
    
    function animate() {
      if(dotRef.current) {
        // speed proportional to current
        const speed = 0.5 + (current * 2);
        phaseRef.current += speed;
        
        const w = 240; 
        const h = 160;
        const totalDist = (w*2) + (h*2);
        
        let p = phaseRef.current % totalDist;
        let x = 0, y = 0;

        if (p < w) { x = p; y = 0; }
        else if (p < w + h) { x = w; y = p - w; }
        else if (p < (w*2) + h) { x = w - (p - (w+h)); y = h; }
        else { x = 0; y = h - (p - ((w*2)+h)); }

        dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [current]);

  const bulbIntensity = Math.min(1, power / 40); 
  const bulbShadow = power / 2;

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Visualizer */}
      <div className="md:w-1/2 p-8 bg-slate-50 border-r border-slate-200 flex flex-col items-center justify-center">
         <div className="circuit-board scale-90 md:scale-100">
           <div className="wire-path"></div>
           
           {/* Battery */}
           <div className="absolute top-[20px] left-[150px] bg-white border-2 border-slate-800 px-3 py-1 flex items-center justify-center gap-1 rounded font-mono text-sm z-10">
             <span className="text-red-500 font-bold">+</span>
             <div className="w-4 h-[2px] bg-slate-800"></div>
             <span className="text-blue-500 font-bold">-</span>
             <div className="absolute -top-6 text-xs font-bold bg-slate-100 px-2 py-0.5 rounded">{voltage.toFixed(1)}V</div>
           </div>

           {/* Resistor/Bulb */}
           <div className="absolute bottom-[20px] left-[150px] bg-white z-10 p-2 rounded-full border-2 border-slate-200 flex items-center justify-center">
             <span 
               className="text-3xl filter transition-all duration-300"
               style={{ opacity: 0.3 + (bulbIntensity * 0.7), dropShadow: `0 0 ${bulbShadow}px rgba(250,204,21,1)` }}
             >💡</span>
             <div className="absolute -bottom-6 text-xs font-bold bg-slate-100 px-2 py-0.5 rounded">{resistance.toFixed(0)}Ω</div>
           </div>

           {/* Electron */}
           <div ref={dotRef} className="electron-dot-flow"></div>
         </div>
      </div>

      {/* Controls */}
      <div className="md:w-1/2 flex flex-col">
        <div className="p-8 pb-4">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Circuit Parameters</h3>
          
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
                Voltage Source (V) <span className="text-blue-600">{voltage.toFixed(1)}</span>
              </label>
              <input 
                type="range" min="1" max="24" step="0.5" 
                value={voltage} 
                onChange={e => setVoltage(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
                Resistance Load (Ω) <span className="text-blue-600">{resistance.toFixed(0)}</span>
              </label>
              <input 
                type="range" min="1" max="100" step="1" 
                value={resistance} 
                onChange={e => setResistance(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-800 text-slate-100 p-8 flex flex-col justify-center">
           <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> Live Data Stream
           </div>

           <div className="mb-6">
             <div className="text-xs text-slate-400 font-bold mb-1">CURRENT (I = V/R)</div>
             <div className="text-xl font-mono">
               <span className="text-blue-400">I</span> = {voltage.toFixed(1)} / {resistance.toFixed(0)} = <span className="text-yellow-400 font-bold ml-2">{current.toFixed(2)} A</span>
             </div>
           </div>

           <div>
             <div className="text-xs text-slate-400 font-bold mb-1">POWER (P = V·I)</div>
             <div className="text-xl font-mono">
               <span className="text-green-400">P</span> = {voltage.toFixed(1)} × {current.toFixed(2)} = <span className="text-pink-400 font-bold ml-2">{power.toFixed(1)} W</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ProjectileSimulator() {
  const [v, setV] = useState(50);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(9.8);

  // Compute Data Points
  const angRad = angle * Math.PI / 180;
  const vx = v * Math.cos(angRad);
  const vy = v * Math.sin(angRad);
  
  const tFlight = (2 * vy) / gravity;
  const hMax = (vy ** 2) / (2 * gravity);
  let range = vx * tFlight;
  if (isNaN(range) || range < 0) range = 0;

  const points = [];
  const steps = 50;
  for(let i=0; i<=steps; i++) {
    const t = (tFlight / steps) * i;
    const x = vx * t;
    const y = (vy * t) - (0.5 * gravity * t * t);
    if(y >= -0.1 && x >= 0) points.push({ distance: Number(x.toFixed(2)), height: Number(Math.max(0, y).toFixed(2)) });
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Controls */}
      <div className="md:w-1/3 p-6 bg-slate-50 border-r border-slate-200 overflow-y-auto">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Launch Parameters</h3>
        
        <div className="space-y-6">
          <div>
            <label className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
              Initial Velocity (v₀) <span className="text-blue-600">{v} m/s</span>
            </label>
            <input 
              type="range" min="10" max="200" step="5" 
              value={v} 
              onChange={e => setV(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
              Launch Angle (θ) <span className="text-blue-600">{angle}°</span>
            </label>
            <input 
              type="range" min="0" max="90" step="1" 
              value={angle} 
              onChange={e => setAngle(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Gravity Environment (g)</label>
            <select 
              value={gravity} 
              onChange={e => setGravity(parseFloat(e.target.value))}
              className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-2 focus:ring-blue-500 outline-none"
            >
              <option value="9.8">Earth (9.8 m/s²)</option>
              <option value="1.62">Moon (1.62 m/s²)</option>
              <option value="3.72">Mars (3.72 m/s²)</option>
            </select>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Max Height</div>
             <div className="text-2xl font-mono font-bold text-blue-600">{hMax.toFixed(1)} m</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Max Range</div>
             <div className="text-2xl font-mono font-bold text-green-600">{range.toFixed(1)} m</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Flight Time</div>
             <div className="text-xl font-mono font-bold text-purple-600">{isNaN(tFlight) ? '0.0' : tFlight.toFixed(2)} s</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="md:w-2/3 p-6 flex flex-col relative h-[500px] md:h-auto">
         <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" /> Kinematics Trajectory
         </h4>
         <div className="flex-1 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart
               data={points}
               margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
             >
               <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
               <XAxis dataKey="distance" type="number" textAnchor="end" tick={{fontSize: 12}} />
               <YAxis type="number" tick={{fontSize: 12}} />
               <Tooltip 
                 labelFormatter={(val) => `Distance: ${val}m`}
                 formatter={(val: number) => [`${val}m`, 'Height']}
               />
               <Line type="monotone" dataKey="height" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
             </LineChart>
           </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
}

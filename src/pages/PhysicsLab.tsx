import React, { useState, useEffect, useRef } from 'react';
import { Zap, Activity, Info, HelpCircle } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import Electrodynamics3D from '../components/simulations/Electrodynamics3D';
import AnalyzeExperimentPanel from '../components/AnalyzeExperimentPanel';

export default function PhysicsLab() {
  const [activeTab, setActiveTab] = useState<'circuit' | 'kinematics' | 'electrodynamics'>('circuit');

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Zap className="text-blue-600 w-5 h-5 lg:w-6 lg:h-6" />
          </div>
          Physics Laboratory
        </h1>
        <div className="scroll-tabs flex bg-slate-200 p-1 rounded-lg">
          <button 
            className={`px-3 py-1.5 rounded-md text-xs lg:text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'circuit' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setActiveTab('circuit')}
          >
            Ohm's Law Circuit
          </button>
          <button 
            className={`px-3 py-1.5 rounded-md text-xs lg:text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'kinematics' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setActiveTab('kinematics')}
          >
            Projectile Motion
          </button>
          <button 
            className={`px-3 py-1.5 rounded-md text-xs lg:text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'electrodynamics' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setActiveTab('electrodynamics')}
          >
            3D Electrodynamics
          </button>
        </div>
      </div>

      <div className="flex-grow bg-white border border-slate-200 rounded-2xl shadow-sm lg:overflow-hidden flex flex-col min-h-[400px] lg:min-h-[500px]">
        {activeTab === 'circuit' && <CircuitSimulator />}
        {activeTab === 'kinematics' && <ProjectileSimulator />}
        {activeTab === 'electrodynamics' && <Electrodynamics3D />}
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
      if (dotRef.current) {
        // speed proportional to current
        const speed = 0.5 + (current * 2);
        phaseRef.current += speed;
        
        const w = 240; 
        const h = 160;
        const totalDist = (w * 2) + (h * 2);
        
        let p = phaseRef.current % totalDist;
        let x = 0, y = 0;

        if (p < w) { x = p; y = 0; }
        else if (p < w + h) { x = w; y = p - w; }
        else if (p < (w * 2) + h) { x = w - (p - (w + h)); y = h; }
        else { x = 0; y = h - (p - ((w * 2) + h)); }

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
    <div className="flex flex-col lg:flex-row lg:h-full">
      {/* Visualizer */}
      <div className="lg:w-1/2 p-4 lg:p-6 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col items-center justify-center shrink-0 min-h-[300px] lg:min-h-0">
         <div className="circuit-board scale-90 sm:scale-100">
           <div className="wire-path"></div>
           
           {/* Battery */}
           <div className="absolute top-[20px] left-[150px] bg-white border-2 border-slate-800 px-3 py-1 flex items-center justify-center gap-1 rounded font-mono text-sm z-10">
             <span className="text-red-500 font-bold text-xs select-none">+</span>
             <div className="w-4 h-[2px] bg-slate-800"></div>
             <span className="text-blue-500 font-bold text-xs select-none">-</span>
             <div className="absolute -top-6 text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{voltage.toFixed(1)}V</div>
           </div>

           {/* Resistor/Bulb */}
           <div className="absolute bottom-[20px] left-[150px] bg-white z-10 p-2 rounded-full border-2 border-slate-300 flex items-center justify-center">
             <span 
               className="text-3xl filter transition-all duration-350"
               style={{ 
                 opacity: 0.3 + (bulbIntensity * 0.7), 
                 filter: `drop-shadow(0 0 ${bulbShadow}px rgba(250,204,21,1))` 
               }}
             >💡</span>
             <div className="absolute -bottom-6 text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{resistance.toFixed(0)}Ω</div>
           </div>

           {/* Electron */}
           <div ref={dotRef} className="electron-dot-flow shadow-[0_0_8px_#faea15] bg-yellow-400 border border-yellow-600"></div>
         </div>
      </div>

      {/* Controls */}
      <div className="lg:w-1/2 flex flex-col justify-between lg:overflow-y-auto">
        <div className="p-4 lg:p-6">
          <h3 className="text-sm lg:text-base font-bold text-slate-900 mb-6">Circuit Parameters</h3>
          
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-xs lg:text-sm font-semibold text-slate-700 mb-2">
                Voltage Source (V) <span className="text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-mono text-xs">{voltage.toFixed(1)} V</span>
              </label>
              <input 
                type="range" min="1" max="24" step="0.5" 
                value={voltage} 
                onChange={e => setVoltage(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <label className="flex justify-between text-xs lg:text-sm font-semibold text-slate-700 mb-2">
                Resistance Load (Ω) <span className="text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-mono text-xs">{resistance.toFixed(0)} Ω</span>
              </label>
              <input 
                type="range" min="1" max="100" step="1" 
                value={resistance} 
                onChange={e => setResistance(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          <div className="mt-8 bg-blue-50/50 border border-blue-100 p-4 rounded-xl space-y-2">
            <h4 className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
              <HelpCircle className="w-4 h-4 shrink-0" />
              CAPS Relationship Note
            </h4>
            <p className="text-[11px] text-blue-950 leading-relaxed font-medium">
              Ohm's Law states that current is directly proportional to potential difference (voltage) across a conductor at a constant temperature. Doubling the voltage source will double the current flowing through this resistor!
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-slate-100 p-6 flex flex-col justify-center border-t border-slate-800">
           <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> Live Telemetry
           </div>

           <div className="mb-4">
             <div className="text-[10px] text-slate-400 font-bold mb-1">CURRENT (I = V/R)</div>
             <div className="text-base lg:text-lg font-mono">
               <span className="text-blue-400">I</span> = {voltage.toFixed(1)} / {resistance.toFixed(0)} = <span className="text-yellow-400 font-bold ml-2">{current.toFixed(2)} A</span>
             </div>
           </div>

           <div>
             <div className="text-[10px] text-slate-400 font-bold mb-1">POWER (P = V·I)</div>
             <div className="text-base lg:text-lg font-mono">
               <span className="text-green-400">P</span> = {voltage.toFixed(1)} × {current.toFixed(2)} = <span className="text-pink-400 font-bold ml-2">{power.toFixed(1)} W</span>
             </div>
           </div>
        </div>
      </div>

      {/* Gemini Analysis Button Panel */}
      <AnalyzeExperimentPanel
        simName="Ohm's Law Resistance Circuit"
        state={{
          applied_voltage_volts: voltage,
          load_resistance_ohms: resistance,
          measured_current_amperes: current.toFixed(2),
          power_dissipated_watts: power.toFixed(1)
        }}
      />
    </div>
  );
}

function ProjectileSimulator() {
  const [v, setV] = useState(50);
  const [angle, setAngle] = useState(45);
  const [mass, setMass] = useState(10);
  const [drag, setDrag] = useState(false);
  const [gravity, setGravity] = useState(9.8);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compute flight points using Euler integration (matching virtual-lab.html exactly)
  const calculateTrajectory = () => {
    const angRad = angle * Math.PI / 180;
    let vx = v * Math.cos(angRad);
    let vy = v * Math.sin(angRad);
    let x = 0;
    let y = 0;
    let t = 0;
    const dt = 0.05;

    const points = [{ distance: 0, height: 0 }];
    const k = drag ? 0.02 : 0; // drag constant
    let hMax = 0;

    while (y >= 0 && t < 100) {
      t += dt;
      const speed = Math.sqrt(vx * vx + vy * vy);
      const dragAcc = (k / mass) * speed * speed;
      const dragX = -dragAcc * (vx / speed) || 0;
      const dragY = -dragAcc * (vy / speed) || 0;

      vx += dragX * dt;
      vy += (dragY - gravity) * dt;

      x += vx * dt;
      y += vy * dt;

      if (y > hMax) hMax = y;
      if (y >= 0) points.push({ distance: Number(x.toFixed(1)), height: Number(y.toFixed(1)) });
    }

    return {
      points,
      hMax: Number(hMax.toFixed(1)),
      range: Number(x.toFixed(1)),
      tFlight: Number(t.toFixed(1))
    };
  };

  const { points, hMax, range, tFlight } = calculateTrajectory();

  // Render the trajectory in the 2D canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (points.length === 0) return;

    const maxX = Math.max(...points.map(p => p.distance), 10);
    const maxY = Math.max(...points.map(p => p.height), 10);
    const padding = 24;
    const w = rect.width - (padding * 2);
    const h = rect.height - (padding * 2);

    // Draw Grid background
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    for(let gx = padding; gx <= rect.width - padding; gx += w / 10) {
      ctx.beginPath();
      ctx.moveTo(gx, padding);
      ctx.lineTo(gx, rect.height - padding);
      ctx.stroke();
    }
    for(let gy = padding; gy <= rect.height - padding; gy += h / 10) {
      ctx.beginPath();
      ctx.moveTo(padding, gy);
      ctx.lineTo(rect.width - padding, gy);
      ctx.stroke();
    }

    // Draw Ground
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, rect.height - padding);
    ctx.lineTo(rect.width - padding, rect.height - padding);
    ctx.stroke();

    // Draw Trajectory line
    ctx.beginPath();
    ctx.moveTo(padding, rect.height - padding);

    points.forEach(p => {
      const px = padding + (p.distance / maxX) * w;
      const py = (rect.height - padding) - (p.height / maxY) * h;
      ctx.lineTo(px, py);
    });

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw Landing Point Ball
    const lastPoint = points[points.length - 1];
    const endX = padding + (lastPoint.distance / maxX) * w;
    const endY = (rect.height - padding) - (lastPoint.height / maxY) * h;
    
    ctx.beginPath();
    ctx.arc(endX, endY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [points]);

  return (
    <div className="flex flex-col lg:flex-row lg:h-full">
      {/* Controls panel */}
      <div className="lg:w-4/12 p-4 lg:p-6 bg-slate-50 border-t lg:border-t-0 lg:border-r border-slate-200 lg:overflow-y-auto order-2 lg:order-1">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Launch Parameters</h3>
        
        <div className="space-y-5">
          <div>
            <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              Initial Velocity (v₀) <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono text-xs">{v} m/s</span>
            </label>
            <input 
              type="range" min="10" max="150" step="5" 
              value={v} 
              onChange={e => setV(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              Launch Angle (θ) <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono text-xs">{angle}°</span>
            </label>
            <input 
              type="range" min="5" max="85" step="1" 
              value={angle} 
              onChange={e => setAngle(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              Mass of Projectile <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-mono text-xs">{mass} kg</span>
            </label>
            <input 
              type="range" min="1" max="100" step="1" 
              value={mass} 
              onChange={e => setMass(parseFloat(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700">Air Resistance (Drag)</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={drag} 
                onChange={e => setDrag(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gravity Environment (g)</label>
            <select 
              value={gravity} 
              onChange={e => setGravity(parseFloat(e.target.value))}
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="9.8">Earth (9.8 m/s²)</option>
              <option value="1.62">Moon (1.62 m/s²)</option>
              <option value="3.72">Mars (3.72 m/s²)</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
             <div className="text-[9px] text-slate-400 font-bold uppercase">Max Height</div>
             <div className="text-sm font-mono font-bold text-blue-600 mt-1">{hMax} m</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
             <div className="text-[9px] text-slate-400 font-bold uppercase">Max Range</div>
             <div className="text-sm font-mono font-bold text-green-600 mt-1">{range} m</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
             <div className="text-[9px] text-slate-400 font-bold uppercase">Flight Time</div>
             <div className="text-sm font-mono font-bold text-purple-600 mt-1">{tFlight} s</div>
          </div>
        </div>
      </div>

      {/* Trajectory Canvas & Graphical Analysis */}
      <div className="lg:w-8/12 p-4 lg:p-6 flex flex-col gap-4 order-1 lg:order-2">
        <div className="bg-white border border-slate-200 rounded-2xl p-2 relative h-[200px] sm:h-[240px] md:h-[280px] shadow-sm shrink-0">
          <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
            Visual Trajectory Path
          </div>
          <canvas ref={canvasRef} className="w-full h-full block bg-slate-50/50 rounded-xl" />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex-1 flex flex-col min-h-[200px] sm:min-h-[220px]">
          <h4 className="font-bold text-slate-700 text-xs flex items-center gap-2 mb-3">
             <Activity className="w-4 h-4 text-blue-500" /> Height vs Distance Analysis (CAPS Graphing)
          </h4>
          <div className="flex-1 w-full h-[140px] sm:h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={points}
                margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="distance" type="number" fontSize={10} tick={{fill: '#94a3b8'}} />
                <YAxis type="number" fontSize={10} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  labelFormatter={(val) => `Distance: ${val}m`}
                  formatter={(val: number) => [`${val}m`, 'Height']}
                  contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="height" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gemini Analysis Button Panel */}
      <AnalyzeExperimentPanel
        simName="2D Kinematics Projectile Simulator"
        state={{
          initial_velocity_m_s: v,
          launch_angle_degrees: angle,
          projectile_mass_kg: mass,
          air_resistance_drag: drag ? 'Enabled' : 'Disabled',
          gravity_m_s2: gravity,
          calculated_max_height_m: hMax,
          calculated_max_range_m: range,
          calculated_flight_time_seconds: tFlight
        }}
      />
    </div>
  );
}

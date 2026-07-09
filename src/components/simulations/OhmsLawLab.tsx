import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle } from 'lucide-react';
import AnalyzeExperimentPanel from '../AnalyzeExperimentPanel';

export default function OhmsLawLab() {
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

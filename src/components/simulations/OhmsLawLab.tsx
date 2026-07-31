import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  HelpCircle, 
  RotateCcw, 
  Activity, 
  Zap, 
  GitBranch, 
  Layers, 
  Trash2,
  BookmarkPlus,
  Gauge
} from 'lucide-react';
import AnalyzeExperimentPanel from '../AnalyzeExperimentPanel';

export type CircuitTopology = 'single' | 'series' | 'parallel';
export type ConductorType = 'ohmic' | 'bulb' | 'diode';

interface DataPoint {
  voltage: number;
  current: number;
  resistance: number;
  topology: CircuitTopology;
}

export default function OhmsLawLab() {
  const [topology, setTopology] = useState<CircuitTopology>('single');
  const [conductor, setConductor] = useState<ConductorType>('ohmic');
  
  const [voltage, setVoltage] = useState(12); // Volts
  const [r1, setR1] = useState(10); // Ohms
  const [r2, setR2] = useState(20); // Ohms

  const [loggedPoints, setLoggedPoints] = useState<DataPoint[]>([]);
  const [selectedProbe, setSelectedProbe] = useState<'total' | 'r1' | 'r2'>('total');

  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const electronPhaseRef = useRef(0);
  const [electronPos, setElectronPos] = useState(0);

  // Compute Physics based on Topology & Conductor
  const physics = useMemo(() => {
    let effectiveR1 = r1;
    let effectiveR2 = r2;

    // Non-ohmic behavior
    if (conductor === 'bulb') {
      effectiveR1 = r1 * (1 + 0.03 * voltage);
      effectiveR2 = r2 * (1 + 0.03 * voltage);
    } else if (conductor === 'diode') {
      if (voltage < 0.7) {
        return {
          rEq: Infinity,
          iTotal: 0,
          i1: 0,
          i2: 0,
          v1: 0,
          v2: 0,
          power: 0,
          isBlocked: true,
          effectiveR1,
          effectiveR2
        };
      }
    }

    const netV = conductor === 'diode' ? Math.max(0, voltage - 0.7) : voltage;

    if (topology === 'single') {
      const rEq = effectiveR1;
      const iTotal = netV / rEq;
      return {
        rEq,
        iTotal,
        i1: iTotal,
        i2: 0,
        v1: netV,
        v2: 0,
        power: netV * iTotal,
        isBlocked: false,
        effectiveR1,
        effectiveR2
      };
    } else if (topology === 'series') {
      const rEq = effectiveR1 + effectiveR2;
      const iTotal = netV / rEq;
      const v1 = iTotal * effectiveR1;
      const v2 = iTotal * effectiveR2;
      return {
        rEq,
        iTotal,
        i1: iTotal,
        i2: iTotal,
        v1,
        v2,
        power: netV * iTotal,
        isBlocked: false,
        effectiveR1,
        effectiveR2
      };
    } else {
      // Parallel
      const rEq = (effectiveR1 * effectiveR2) / (effectiveR1 + effectiveR2);
      const i1 = netV / effectiveR1;
      const i2 = netV / effectiveR2;
      const iTotal = i1 + i2;
      return {
        rEq,
        iTotal,
        i1,
        i2,
        v1: netV,
        v2: netV,
        power: netV * iTotal,
        isBlocked: false,
        effectiveR1,
        effectiveR2
      };
    }
  }, [topology, conductor, voltage, r1, r2]);

  // Electron animation loop
  useEffect(() => {
    let animId: number;
    const animate = () => {
      const speed = physics.iTotal * 1.5;
      electronPhaseRef.current = (electronPhaseRef.current + speed) % 1000;
      setElectronPos(electronPhaseRef.current);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [physics.iTotal]);

  const handleLogDataPoint = () => {
    setLoggedPoints(prev => [
      ...prev,
      {
        voltage,
        current: Number(physics.iTotal.toFixed(2)),
        resistance: Number(physics.rEq.toFixed(1)),
        topology,
      }
    ]);
  };

  const handleClearGraph = () => {
    setLoggedPoints([]);
  };

  // Render V-I Characteristic Canvas Graph
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = 38;

    ctx.clearRect(0, 0, w, h);

    // Draw Grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;

    for (let x = padding; x < w; x += (w - padding) / 5) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h - padding);
      ctx.stroke();
    }
    for (let y = 10; y < h - padding; y += (h - padding) / 4) {
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding, 5);
    ctx.lineTo(padding, h - padding);
    ctx.lineTo(w - 5, h - padding);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '10px sans-serif';
    ctx.fillText('V (Volts)', 5, 12);
    ctx.fillText('I (Amps)', w - 45, h - 10);

    const maxV = 24;
    const maxI = 3.5;

    const mapX = (iVal: number) => padding + Math.min(1, iVal / maxI) * (w - padding - 15);
    const mapY = (vVal: number) => (h - padding) - Math.min(1, vVal / maxV) * (h - padding - 15);

    // Plot Theoretical V-I Curve
    ctx.strokeStyle = conductor === 'ohmic' ? '#3b82f6' : conductor === 'bulb' ? '#f59e0b' : '#ec4899';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const steps = 60;
    for (let s = 0; s <= steps; s++) {
      const vSim = (s / steps) * maxV;
      let iSim = 0;

      if (conductor === 'ohmic') {
        iSim = vSim / physics.rEq;
      } else if (conductor === 'bulb') {
        const rTemp1 = r1 * (1 + 0.03 * vSim);
        const rTemp2 = r2 * (1 + 0.03 * vSim);
        const reqSim = topology === 'single' ? rTemp1 : topology === 'series' ? (rTemp1 + rTemp2) : (rTemp1 * rTemp2) / (rTemp1 + rTemp2);
        iSim = vSim / reqSim;
      } else if (conductor === 'diode') {
        iSim = vSim < 0.7 ? 0 : (vSim - 0.7) / (topology === 'single' ? r1 : topology === 'series' ? (r1 + r2) : (r1 * r2) / (r1 + r2));
      }

      const px = mapX(iSim);
      const py = mapY(vSim);

      if (s === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Live Operating Point
    const currentX = mapX(physics.iTotal);
    const currentY = mapY(voltage);

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Logged Experimental Data Points
    loggedPoints.forEach((pt) => {
      const lx = mapX(pt.current);
      const ly = mapY(pt.voltage);

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(lx, ly, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#a7f3d0';
      ctx.font = '9px monospace';
      ctx.fillText(`(${pt.voltage}V, ${pt.current}A)`, lx + 6, ly - 3);
    });

  }, [voltage, physics, conductor, topology, loggedPoints, r1, r2]);

  const probeReadout = useMemo(() => {
    if (selectedProbe === 'r1') {
      return { label: 'Resistor 1 (R₁)', v: physics.v1, i: physics.i1, r: physics.effectiveR1 };
    } else if (selectedProbe === 'r2' && topology !== 'single') {
      return { label: 'Resistor 2 (R₂)', v: physics.v2, i: physics.i2, r: physics.effectiveR2 };
    } else {
      return { label: 'Total Circuit Source', v: voltage, i: physics.iTotal, r: physics.rEq };
    }
  }, [selectedProbe, physics, voltage, topology]);

  // Helper to render component visual inside SVG schematic (Glowing Bulb, Diode, Resistor)
  const renderComponentSVG = (id: 'r1' | 'r2', label: string, resistanceVal: number) => {
    const isSelected = (id === 'r1' && selectedProbe === 'r1') || (id === 'r2' && selectedProbe === 'r2');
    
    if (conductor === 'bulb') {
      const p = id === 'r1' ? (physics.v1 * physics.i1) : (physics.v2 * physics.i2);
      const intensity = Math.min(1, Math.max(0.1, p / 20));

      return (
        <g className="cursor-pointer" onClick={() => setSelectedProbe(id)}>
          {/* Glowing Aura */}
          <circle
            cx="40"
            cy="16"
            r={12 + intensity * 8}
            fill="#facc15"
            opacity={0.25 + intensity * 0.65}
          />
          {/* Outer Glass Globe */}
          <circle
            cx="40"
            cy="16"
            r="15"
            fill={intensity > 0.5 ? '#fef08a' : '#fef3c7'}
            stroke={isSelected ? '#3b82f6' : '#eab308'}
            strokeWidth="2.5"
          />
          {/* Filament Symbol */}
          <path d="M 32 20 Q 40 8 48 20" fill="none" stroke={intensity > 0.4 ? '#ef4444' : '#d97706'} strokeWidth="2" />
          <text x="40" y="42" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">
            💡 {label}: {Math.round(resistanceVal)}Ω
          </text>
        </g>
      );
    } else if (conductor === 'diode') {
      return (
        <g className="cursor-pointer" onClick={() => setSelectedProbe(id)}>
          <rect x="0" y="0" width="80" height="32" rx="6" fill="#0f172a" stroke={isSelected ? '#3b82f6' : '#ec4899'} strokeWidth="2.5" />
          {/* Diode Triangle & Bar Symbol */}
          <path d="M 28 8 L 44 16 L 28 24 Z" fill="#ec4899" />
          <line x1="44" y1="8" x2="44" y2="24" stroke="#ec4899" strokeWidth="2.5" />
          <text x="40" y="44" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">⚡ {label}</text>
        </g>
      );
    } else {
      return (
        <g className="cursor-pointer" onClick={() => setSelectedProbe(id)}>
          <rect x="0" y="0" width="80" height="32" rx="6" fill="#0f172a" stroke={isSelected ? '#3b82f6' : '#f59e0b'} strokeWidth="2.5" />
          <text x="40" y="20" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
            {label}: {resistanceVal}Ω
          </text>
        </g>
      );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:h-full">
      {/* Visualizer & Interactive Schematics */}
      <div className="lg:w-7/12 p-3 sm:p-4 lg:p-6 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col gap-3 sm:gap-4 shrink-0">
        
        {/* Topology & Conductor Controls Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-slate-200/80 p-1.5 rounded-xl text-xs font-semibold">
          <div className="grid grid-cols-3 gap-1 w-full sm:w-auto">
            <button
              onClick={() => setTopology('single')}
              className={`py-1.5 px-1.5 sm:px-2.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer text-[11px] sm:text-xs ${
                topology === 'single' ? 'bg-white text-blue-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Single</span>
            </button>
            <button
              onClick={() => setTopology('series')}
              className={`py-1.5 px-1.5 sm:px-2.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer text-[11px] sm:text-xs ${
                topology === 'series' ? 'bg-white text-blue-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Series</span>
            </button>
            <button
              onClick={() => setTopology('parallel')}
              className={`py-1.5 px-1.5 sm:px-2.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer text-[11px] sm:text-xs ${
                topology === 'parallel' ? 'bg-white text-blue-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Parallel</span>
            </button>
          </div>

          {/* Conductor Material Selector */}
          <div className="w-full sm:w-auto">
            <select
              value={conductor}
              onChange={(e) => setConductor(e.target.value as ConductorType)}
              className="w-full sm:w-auto bg-white text-slate-800 text-[11px] sm:text-xs font-bold py-1.5 px-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer truncate"
            >
              <option value="ohmic">Ohmic (Fixed Resistor)</option>
              <option value="bulb">Non-Ohmic (Filament Bulb 💡)</option>
              <option value="diode">Non-Ohmic (Semiconductor Diode ⚡)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Circuit Diagram Container */}
        <div className="bg-slate-900 rounded-2xl relative h-[230px] sm:h-[280px] border border-slate-800 shadow-inner flex flex-col justify-center items-center p-2 sm:p-4 overflow-hidden">
          
          <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold tracking-wider flex items-center gap-1.5 border border-white/10">
            <span className={`w-1.5 h-1.5 rounded-full ${physics.isBlocked ? 'bg-red-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
            {topology.toUpperCase()} ({conductor.toUpperCase()})
          </div>

          {/* SVG Schematic Canvas */}
          <svg className="w-full h-full max-w-[400px] max-h-[240px]" viewBox="0 0 400 240">
            {/* Battery Source Left Side */}
            <rect x="25" y="85" width="30" height="70" rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="40" y="125" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">{voltage.toFixed(1)}V</text>
            <text x="40" y="78" fill="#ef4444" fontSize="13" fontWeight="bold" textAnchor="middle">+</text>
            <text x="40" y="172" fill="#3b82f6" fontSize="13" fontWeight="bold" textAnchor="middle">-</text>

            {/* Circuit Wires depending on Topology */}
            {topology === 'single' && (
              <>
                {/* Loop Wire */}
                <path d="M 40 85 L 40 30 L 360 30 L 360 210 L 40 210 L 40 155" fill="none" stroke="#64748b" strokeWidth="3" />
                
                {/* Single Component Top */}
                <g transform="translate(160, 14)">
                  {renderComponentSVG('r1', conductor === 'bulb' ? 'Bulb' : 'R₁', r1)}
                </g>

                {/* Animated Electrons */}
                {!physics.isBlocked && physics.iTotal > 0 && (
                  <circle
                    r="4"
                    fill="#facc15"
                    cx={
                      (electronPos % 1000) < 250 ? 40 + ((electronPos % 1000) / 250) * 320 :
                      (electronPos % 1000) < 500 ? 360 :
                      (electronPos % 1000) < 750 ? 360 - (((electronPos % 1000) - 500) / 250) * 320 : 40
                    }
                    cy={
                      (electronPos % 1000) < 250 ? 30 :
                      (electronPos % 1000) < 500 ? 30 + (((electronPos % 1000) - 250) / 250) * 180 :
                      (electronPos % 1000) < 750 ? 210 : 210 - (((electronPos % 1000) - 750) / 250) * 55
                    }
                  />
                )}
              </>
            )}

            {topology === 'series' && (
              <>
                <path d="M 40 85 L 40 30 L 360 30 L 360 210 L 40 210 L 40 155" fill="none" stroke="#64748b" strokeWidth="3" />
                
                {/* R1 Top Left */}
                <g transform="translate(100, 14)">
                  {renderComponentSVG('r1', 'R₁', r1)}
                </g>

                {/* R2 Top Right */}
                <g transform="translate(225, 14)">
                  {renderComponentSVG('r2', 'R₂', r2)}
                </g>
              </>
            )}

            {topology === 'parallel' && (
              <>
                {/* Main Frame Wire */}
                <path d="M 40 85 L 40 30 L 360 30 L 360 210 L 40 210 L 40 155" fill="none" stroke="#64748b" strokeWidth="3" />
                
                {/* Branch 1 Top */}
                <g transform="translate(160, 14)">
                  {renderComponentSVG('r1', 'Branch 1', r1)}
                </g>

                {/* Middle Junction Wires */}
                <path d="M 110 30 L 110 115 L 290 115 L 290 30" fill="none" stroke="#64748b" strokeWidth="2.5" />
                
                {/* Branch 2 Middle */}
                <g transform="translate(160, 99)">
                  {renderComponentSVG('r2', 'Branch 2', r2)}
                </g>
              </>
            )}
          </svg>

          {/* Interactive Probe Target Selector */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-lg border border-white/10 text-[10px]">
            <span className="text-slate-400 font-bold px-1 hidden xs:inline">Probe:</span>
            <button
              onClick={() => setSelectedProbe('total')}
              className={`px-2 py-0.5 rounded cursor-pointer transition ${selectedProbe === 'total' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/10'}`}
            >
              Source
            </button>
            <button
              onClick={() => setSelectedProbe('r1')}
              className={`px-2 py-0.5 rounded cursor-pointer transition ${selectedProbe === 'r1' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/10'}`}
            >
              R₁
            </button>
            {topology !== 'single' && (
              <button
                onClick={() => setSelectedProbe('r2')}
                className={`px-2 py-0.5 rounded cursor-pointer transition ${selectedProbe === 'r2' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/10'}`}
              >
                R₂
              </button>
            )}
          </div>
        </div>

        {/* Real-time V-I Graph Plotter */}
        <div className="bg-slate-950 rounded-2xl p-3 sm:p-4 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider gap-2">
            <span className="flex items-center gap-1.5 text-emerald-400 truncate">
              <Activity className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">V vs I Characteristics</span>
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleLogDataPoint}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer shrink-0 whitespace-nowrap"
              >
                <BookmarkPlus className="w-3 h-3 shrink-0" /> <span>Log Point</span>
              </button>
              <button
                onClick={handleClearGraph}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] transition cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Trash2 className="w-3 h-3 shrink-0" /> <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="h-32 sm:h-36 bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden relative">
            <canvas ref={graphCanvasRef} className="w-full h-full block" />
            <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
              Slope (R) = {(physics.v1 / Math.max(0.001, physics.i1)).toFixed(1)} Ω
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Controls & Live Multimeter Readouts */}
      <div className="lg:w-5/12 p-3 sm:p-4 lg:p-6 flex flex-col justify-between lg:overflow-y-auto">
        <div className="space-y-4 sm:space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Circuit Parameters</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjust voltage & resistance to verify Ohm's Law (V = I · R).
            </p>
          </div>

          {/* Sliders */}
          <div className="space-y-3.5 sm:space-y-4 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <label className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                Voltage Source (V_total)
                <span className="font-mono text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded text-[10px]">{voltage.toFixed(1)} V</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="24"
                step="0.5"
                value={voltage}
                onChange={(e) => setVoltage(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                {conductor === 'bulb' ? 'Bulb Base Resistance (R₁)' : 'Resistor 1 (R₁)'}
                <span className="font-mono text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded text-[10px]">{r1} Ω</span>
              </label>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={r1}
                onChange={(e) => setR1(parseInt(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {topology !== 'single' && (
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  {conductor === 'bulb' ? 'Bulb Base Resistance (R₂)' : 'Resistor 2 (R₂)'}
                  <span className="font-mono text-sky-600 bg-sky-50 border border-sky-100 px-1.5 py-0.5 rounded text-[10px]">{r2} Ω</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={r2}
                  onChange={(e) => setR2(parseInt(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Multimeter Probes Telemetry */}
          <div className="bg-slate-900 text-white rounded-xl p-3 sm:p-4 space-y-2.5 sm:space-y-3 shadow-md">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Gauge className="w-3.5 h-3.5" /> Virtual Multimeter Readout
              </span>
              <span className="text-amber-400 font-mono">{probeReadout.label}</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center font-mono">
              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                <div className="text-[9px] text-slate-400 font-sans uppercase">Voltage (V)</div>
                <div className="text-xs sm:text-sm font-bold text-blue-400 mt-0.5">{probeReadout.v.toFixed(2)} V</div>
              </div>

              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                <div className="text-[9px] text-slate-400 font-sans uppercase">Current (I)</div>
                <div className="text-xs sm:text-sm font-bold text-yellow-400 mt-0.5">{probeReadout.i.toFixed(2)} A</div>
              </div>

              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                <div className="text-[9px] text-slate-400 font-sans uppercase">Resistance (R)</div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">{probeReadout.r.toFixed(1)} Ω</div>
              </div>
            </div>
          </div>

          {/* CAPS Physics Insight Box */}
          <div className="bg-blue-50/50 border border-blue-100 p-3 sm:p-4 rounded-xl space-y-1.5 sm:space-y-2">
            <h4 className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
              <HelpCircle className="w-4 h-4 shrink-0" />
              CAPS Examination Note
            </h4>
            <p className="text-[11px] text-blue-900/90 leading-relaxed font-medium">
              {conductor === 'bulb'
                ? "Filament bulbs are Non-Ohmic conductors. As voltage increases, the filament heats up, causing its electrical resistance to rise and producing a curved V-I graph."
                : topology === 'single'
                ? "Ohm's Law (V = I · R) applies to Ohmic conductors at constant temperature. The slope of the V-I graph represents resistance."
                : topology === 'series'
                ? "In Series circuits, current (I) is identical throughout all components, while total voltage divides (V_total = V1 + V2)."
                : "In Parallel circuits, potential difference (V) is identical across all branches, while total current divides (I_total = I1 + I2)."}
            </p>
          </div>
        </div>

        {/* Reset button */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              setVoltage(12);
              setR1(10);
              setR2(20);
              setTopology('single');
              setConductor('ohmic');
              setLoggedPoints([]);
            }}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-600 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Lab Setup
          </button>
        </div>
      </div>

      {/* Floating AI Panel connection */}
      <AnalyzeExperimentPanel
        simName={`Ohm's Law Laboratory (${topology.toUpperCase()} - ${conductor.toUpperCase()})`}
        state={{
          topology,
          conductor_type: conductor,
          voltage_source_volts: voltage,
          r1_ohms: r1,
          r2_ohms: topology !== 'single' ? r2 : undefined,
          equivalent_resistance_ohms: physics.rEq.toFixed(1),
          total_current_amperes: physics.iTotal.toFixed(2),
          total_power_watts: physics.power.toFixed(1),
        }}
      />
    </div>
  );
}

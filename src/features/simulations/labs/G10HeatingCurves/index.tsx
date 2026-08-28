import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Pause, Play, RotateCcw } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface G10HeatingCurvesProps {
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  simStep: number;
  dataLog: any[];
  setDataLog: React.Dispatch<React.SetStateAction<any[]>>;
  setLiveTelemetry: (data: any) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  liveTelemetry: any;
}

export default function G10HeatingCurves({
  isPlaying,
  setIsPlaying,
  simStep,
  dataLog,
  setDataLog,
  setLiveTelemetry,
  isFullscreen,
  toggleFullscreen,
  liveTelemetry
}: G10HeatingCurvesProps) {
  // State for Heating Curves
  const [heatSubstance, setHeatSubstance] = useState<'ice' | 'stearic'>('ice');
  const [heaterPower, setHeaterPower] = useState(60); // Watts
  const [sampleMass, setSampleMass] = useState(50); // grams

  // Physics Engine logic
  useEffect(() => {
    if (!isPlaying) return;

    const timeSec = simStep * 10;
    let calculatedTemp = -15;

    if (heatSubstance === 'ice') {
      const rateSolid = (heaterPower / sampleMass) * 4;
      const rateLiquid = (heaterPower / sampleMass) * 2;
      const rateGas = (heaterPower / sampleMass) * 3;
      const meltingTime = (sampleMass / heaterPower) * 60; 
      const boilingTime = (sampleMass / heaterPower) * 120;

      const solidEnd = 15 / rateSolid;
      const meltEnd = solidEnd + meltingTime;
      const liquidEnd = meltEnd + (100 / rateLiquid);
      const boilEnd = liquidEnd + boilingTime;

      if (timeSec < solidEnd) {
        calculatedTemp = -15 + rateSolid * timeSec;
      } else if (timeSec < meltEnd) {
        calculatedTemp = 0;
      } else if (timeSec < liquidEnd) {
        calculatedTemp = rateLiquid * (timeSec - meltEnd);
      } else if (timeSec < boilEnd) {
        calculatedTemp = 100;
      } else {
        calculatedTemp = 100 + rateGas * (timeSec - boilEnd);
      }
    } else {
      const rateSolid = (heaterPower / sampleMass) * 2.5;
      const rateLiquid = (heaterPower / sampleMass) * 1.5;
      const meltingTime = (sampleMass / heaterPower) * 100;

      const solidEnd = (69 - 30) / rateSolid;
      const meltEnd = solidEnd + meltingTime;

      if (timeSec < solidEnd) {
        calculatedTemp = 30 + rateSolid * timeSec;
      } else if (timeSec < meltEnd) {
        calculatedTemp = 69;
      } else {
        calculatedTemp = 69 + rateLiquid * (timeSec - meltEnd);
      }
    }

    const tempValue = parseFloat(calculatedTemp.toFixed(1));
    
    setDataLog(prev => {
      if (prev.some(d => d.time === timeSec)) return prev;
      return [...prev, { time: timeSec, temp: tempValue }];
    });

    setLiveTelemetry({
      substance: heatSubstance,
      heater_power_watts: heaterPower,
      mass_grams: sampleMass,
      elapsed_time_sec: timeSec,
      measured_temperature_celsius: tempValue,
      state: heatSubstance === 'ice'
        ? (tempValue < 0 ? 'Solid (Ice)' : tempValue < 100 ? 'Liquid (Water)' : 'Gas (Steam)')
        : (tempValue < 69 ? 'Solid' : 'Liquid')
    });
  }, [isPlaying, simStep, heatSubstance, heaterPower, sampleMass, setDataLog, setLiveTelemetry]);

  return (
    <div className="flex flex-col h-full">
      {/* WIDGET CONTAINER */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl p-4 shadow-inner relative overflow-hidden min-h-[250px]">
        <div className="absolute top-2.5 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={toggleFullscreen}
            className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-blue-600" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            Interactive Lab
          </span>
        </div>

        <div className="w-full text-center space-y-4">
          <div className="flex items-center justify-center gap-6">
            <div className="relative w-28 h-28 bg-slate-100 border-2 border-slate-800 rounded-b-xl flex flex-col justify-end p-2 overflow-hidden">
              {isPlaying && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-10 bg-orange-500 rounded-full animate-bounce opacity-85 blur-xs" />
              )}
              <div 
                className={`w-full transition-all duration-500 rounded-lg flex items-center justify-center text-xs font-bold ${
                  heatSubstance === 'ice' 
                    ? liveTelemetry?.measured_temperature_celsius < 0 
                      ? 'bg-blue-100 text-blue-800 h-16 border-2 border-blue-200' 
                      : liveTelemetry?.measured_temperature_celsius < 100 
                        ? 'bg-cyan-200/80 text-cyan-800 h-10 border-b border-cyan-400' 
                        : 'bg-slate-100 text-slate-500 h-4 border-dashed border'
                    : liveTelemetry?.measured_temperature_celsius < 69 
                      ? 'bg-amber-100 text-amber-800 h-16 border border-amber-300' 
                      : 'bg-yellow-200 text-yellow-800 h-10'
                }`}
              >
                {heatSubstance === 'ice' 
                  ? liveTelemetry?.measured_temperature_celsius < 0 ? '🧊 ICE' : liveTelemetry?.measured_temperature_celsius < 100 ? '💧 WATER' : '💨 STEAM'
                  : liveTelemetry?.measured_temperature_celsius < 69 ? '🧪 SOLID ACID' : '🧪 MELTED ACID'
                }
              </div>
            </div>
            <div className="bg-slate-900 text-green-400 font-mono p-4 rounded-xl border border-slate-800 text-2xl shadow">
              {liveTelemetry?.measured_temperature_celsius !== undefined 
                ? `${liveTelemetry.measured_temperature_celsius.toFixed(1)}°C` 
                : `${heatSubstance === 'ice' ? -15.0 : 30.0}°C`
              }
              <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
                {liveTelemetry?.state || 'Ready'}
              </div>
            </div>
          </div>

          {dataLog.length > 0 && (
            <div className="w-full h-32 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataLog}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -2 }} />
                  <YAxis label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* CONTROLS PANEL */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-5 mt-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Experiment Parameters</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition ${
                isPlaying 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isPlaying ? (
                <><Pause className="w-3.5 h-3.5" /> Pause</>
              ) : (
                <><Play className="w-3.5 h-3.5" /> Play</>
              )}
            </button>
            {!isPlaying && dataLog.length > 0 && (
              <button
                onClick={() => {
                  setDataLog([]);
                  setLiveTelemetry({});
                }}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => setHeatSubstance('ice')}
                className={`p-2 rounded-lg font-bold border transition ${heatSubstance === 'ice' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-slate-50 text-slate-600'}`}
              >
                Ice (H₂O)
              </button>
              <button 
                onClick={() => setHeatSubstance('stearic')}
                className={`p-2 rounded-lg font-bold border transition ${heatSubstance === 'stearic' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-600'}`}
              >
                Stearic Acid
              </button>
            </div>
            <div>
              <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                Bunsen Burner Power (W) <span className="font-mono">{heaterPower} W</span>
              </label>
              <input type="range" min="30" max="150" value={heaterPower} onChange={e => setHeaterPower(Number(e.target.value))} className="w-full accent-blue-600" />
            </div>
            <div>
              <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                Sample Mass (g) <span className="font-mono">{sampleMass} g</span>
              </label>
              <input type="range" min="10" max="100" value={sampleMass} onChange={e => setSampleMass(Number(e.target.value))} className="w-full accent-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

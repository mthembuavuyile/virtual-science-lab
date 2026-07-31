import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Snowflake,
  Play,
  Pause,
  RotateCcw,
  Thermometer,
  Activity,
  BarChart2,
  Table,
  HelpCircle,
  Zap,
  CheckCircle2,
  ChevronRight,
  Download,
  Info,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

/* ────────── TYPES & SUBSTANCE DATA ────────── */

export type SubstanceId = 'water' | 'stearic' | 'unknown';

export interface SubstanceSpec {
  id: SubstanceId;
  name: string;
  formula: string;
  initialTempHeating: number;
  initialTempCooling: number;
  meltingPoint: number;
  boilingPoint: number;
  latentFusion: number; // J/g
  latentVap: number; // J/g
  cSolid: number; // J/g°C
  cLiquid: number; // J/g°C
  cGas: number; // J/g°C
  color: string;
  summary: string;
}

const SUBSTANCES: Record<SubstanceId, SubstanceSpec> = {
  water: {
    id: 'water',
    name: 'Water (H₂O)',
    formula: 'H₂O',
    initialTempHeating: -20,
    initialTempCooling: 120,
    meltingPoint: 0,
    boilingPoint: 100,
    latentFusion: 334,
    latentVap: 2260,
    cSolid: 2.09,
    cLiquid: 4.18,
    cGas: 2.01,
    color: '#3B82F6',
    summary: 'Standard pure substance with well-defined melting (0°C) and boiling (100°C) plateaus.'
  },
  stearic: {
    id: 'stearic',
    name: 'Stearic Acid (CAPS Practical)',
    formula: 'C₁₈H₃₆O₂',
    initialTempHeating: 25,
    initialTempCooling: 90,
    meltingPoint: 69,
    boilingPoint: 361,
    latentFusion: 199,
    latentVap: 1400,
    cSolid: 1.6,
    cLiquid: 2.3,
    cGas: 2.0,
    color: '#F59E0B',
    summary: 'Prescribed Grade 10 practical: cooling molten stearic acid to observe the 69°C freezing plateau.'
  },
  unknown: {
    id: 'unknown',
    name: 'Unknown Substance X',
    formula: 'X',
    initialTempHeating: -10,
    initialTempCooling: 130,
    meltingPoint: 45,
    boilingPoint: 115,
    latentFusion: 220,
    latentVap: 1800,
    cSolid: 1.8,
    cLiquid: 3.2,
    cGas: 1.9,
    color: '#10B981',
    summary: 'Student challenge mode: determine melting point and boiling point from experimental data.'
  }
};

export interface DataPoint {
  timeSec: number;
  temp: number;
  phase: string;
  state: 'solid' | 'melting' | 'liquid' | 'boiling' | 'gas';
}

type TabId = 'heating' | 'cooling' | 'kmt' | 'datalog' | 'quiz';

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'heating', label: 'Heating Curve', icon: Flame },
  { id: 'cooling', label: 'Cooling Curve (Stearic)', icon: Snowflake },
  { id: 'kmt', label: 'Kinetic Molecular Theory', icon: Activity },
  { id: 'datalog', label: 'Data & Calculator', icon: Table },
  { id: 'quiz', label: 'Quiz & Practice', icon: HelpCircle },
];

/* ────────── MAIN LAB COMPONENT ────────── */

export default function HeatingCoolingCurveLab() {
  const [activeTab, setActiveTab] = useState<TabId>('heating');
  const [substanceId, setSubstanceId] = useState<SubstanceId>('water');
  const [flamePower, setFlamePower] = useState<number>(2); // 0: Off, 1: Low, 2: Med, 3: High
  const [coolingRate, setCoolingRate] = useState<'air' | 'water'>('air');
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const substance = SUBSTANCES[substanceId];

  // Simulation Physics State
  const [timeSec, setTimeSec] = useState<number>(0);
  const [temp, setTemp] = useState<number>(substance.initialTempHeating);
  const [phaseProgress, setPhaseProgress] = useState<number>(0); // 0-100% during latent heat plateaus
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

  // Reset simulation when substance or mode changes
  const resetSimulation = (modeOverride?: TabId) => {
    setIsRunning(false);
    setTimeSec(0);
    const tab = modeOverride || activeTab;
    const initialT = tab === 'cooling' ? substance.initialTempCooling : substance.initialTempHeating;
    setTemp(initialT);
    setPhaseProgress(0);

    const initialPhase = getPhaseState(initialT, substance, 0);
    setDataPoints([{ timeSec: 0, temp: initialT, phase: initialPhase.label, state: initialPhase.state }]);
  };

  useEffect(() => {
    resetSimulation();
  }, [substanceId, activeTab]);

  // Simulation Physics Tick Engine
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeSec(prevTime => {
          const dt = 1 * simSpeed;
          const nextTime = prevTime + dt;

          setTemp(prevTemp => {
            let nextT = prevTemp;
            const mode = activeTab === 'cooling' ? 'cooling' : 'heating';

            if (mode === 'heating') {
              if (flamePower === 0) return prevTemp; // Flame off

              const heatRate = flamePower * 1.8 * simSpeed;

              // Check if at melting plateau
              if (Math.abs(prevTemp - substance.meltingPoint) < 0.2 && phaseProgress < 100) {
                setPhaseProgress(p => {
                  const np = p + (heatRate / (substance.latentFusion * 0.15)) * 10;
                  if (np >= 100) {
                    return 100;
                  }
                  return np;
                });
                nextT = substance.meltingPoint;
              }
              // Check if at boiling plateau
              else if (Math.abs(prevTemp - substance.boilingPoint) < 0.2 && phaseProgress < 100) {
                setPhaseProgress(p => {
                  const np = p + (heatRate / (substance.latentVap * 0.08)) * 10;
                  if (np >= 100) {
                    return 100;
                  }
                  return np;
                });
                nextT = substance.boilingPoint;
              }
              // Temperature rise
              else {
                let c = substance.cLiquid;
                if (prevTemp < substance.meltingPoint) c = substance.cSolid;
                if (prevTemp > substance.boilingPoint) c = substance.cGas;

                const dT = (heatRate / (c * 2.5)) * dt;
                nextT = prevTemp + dT;

                // Trigger plateau transition when reaching transition temperatures
                if (prevTemp < substance.meltingPoint && nextT >= substance.meltingPoint) {
                  nextT = substance.meltingPoint;
                  setPhaseProgress(0);
                } else if (prevTemp < substance.boilingPoint && nextT >= substance.boilingPoint) {
                  nextT = substance.boilingPoint;
                  setPhaseProgress(0);
                }
              }
            } else {
              // Cooling mode
              const coolFactor = coolingRate === 'water' ? 1.4 : 0.7;
              const lossRate = coolFactor * 1.2 * simSpeed;

              // Cooling plateau at freezing point
              if (Math.abs(prevTemp - substance.meltingPoint) < 0.3 && phaseProgress < 100) {
                setPhaseProgress(p => {
                  const np = p + (lossRate / (substance.latentFusion * 0.15)) * 10;
                  if (np >= 100) return 100;
                  return np;
                });
                nextT = substance.meltingPoint;
              } else {
                let c = substance.cLiquid;
                if (prevTemp < substance.meltingPoint) c = substance.cSolid;
                if (prevTemp > substance.boilingPoint) c = substance.cGas;

                const dT = (lossRate / (c * 2.5)) * dt;
                nextT = Math.max(20, prevTemp - dT); // Room temp min 20°C

                if (prevTemp > substance.meltingPoint && nextT <= substance.meltingPoint) {
                  nextT = substance.meltingPoint;
                  setPhaseProgress(0);
                }
              }
            }

            const currentPhase = getPhaseState(nextT, substance, phaseProgress);

            // Record data point
            setDataPoints(pts => [
              ...pts,
              { timeSec: nextTime, temp: Math.round(nextT * 10) / 10, phase: currentPhase.label, state: currentPhase.state }
            ]);

            return nextT;
          });

          return nextTime;
        });
      }, 300 / simSpeed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, flamePower, simSpeed, activeTab, substance, coolingRate, phaseProgress]);

  const currentPhaseInfo = getPhaseState(temp, substance, phaseProgress);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 lg:gap-6 p-3 lg:p-6 overflow-auto">
      {/* Simulation Container */}
      <div className="flex-1 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden min-h-[520px]">
        {/* Header */}
        <div className="p-3 lg:p-4 border-b border-[#F1F5F9] flex justify-between items-center bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500 rounded-lg text-white">
              <Flame className="w-4 h-4 lg:w-5 lg:h-5" />
            </div>
            <div>
              <h2 className="font-bold text-xs lg:text-sm tracking-tight uppercase text-[#1E293B]">
                Heating and Cooling Curves
              </h2>
              <p className="text-[10px] text-[#64748B]">
                Grade 10 CAPS Physical Sciences · Matter & Materials
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[9px] font-mono bg-amber-50 text-amber-800 border-amber-200">
              {substance.name}
            </Badge>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex bg-[#F8FAFC] border-b border-[#F1F5F9] px-2 lg:px-4 gap-1 overflow-x-auto">
          {TABS.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                  if (t.id === 'cooling' && substanceId !== 'stearic') {
                    setSubstanceId('stearic');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-amber-500 text-amber-700 bg-white shadow-xs'
                    : 'border-transparent text-[#94A3B8] hover:text-[#64748B] hover:bg-slate-100/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-6 bg-slate-50/50">
          {activeTab === 'heating' && (
            <HeatingLabPanel
              substance={substance}
              substanceId={substanceId}
              onSelectSubstance={setSubstanceId}
              flamePower={flamePower}
              onChangeFlame={setFlamePower}
              isRunning={isRunning}
              onToggleRun={() => setIsRunning(!isRunning)}
              onReset={resetSimulation}
              simSpeed={simSpeed}
              onChangeSpeed={setSimSpeed}
              timeSec={timeSec}
              temp={temp}
              dataPoints={dataPoints}
              currentPhase={currentPhaseInfo}
            />
          )}
          {activeTab === 'cooling' && (
            <CoolingLabPanel
              substance={substance}
              coolingRate={coolingRate}
              onChangeCoolingRate={setCoolingRate}
              isRunning={isRunning}
              onToggleRun={() => setIsRunning(!isRunning)}
              onReset={resetSimulation}
              simSpeed={simSpeed}
              onChangeSpeed={setSimSpeed}
              timeSec={timeSec}
              temp={temp}
              dataPoints={dataPoints}
              currentPhase={currentPhaseInfo}
            />
          )}
          {activeTab === 'kmt' && (
            <KMTVisualizerPanel temp={temp} substance={substance} currentPhase={currentPhaseInfo} />
          )}
          {activeTab === 'datalog' && (
            <DataCalculatorPanel dataPoints={dataPoints} substance={substance} />
          )}
          {activeTab === 'quiz' && (
            <QuizPanel />
          )}
        </div>
      </div>

      {/* Info Sidebar */}
      <div className="w-full lg:w-[320px] flex flex-col gap-4 lg:gap-6 shrink-0">
        {/* Real-Time Meter Card */}
        <Card className="p-4 lg:p-5 border-[#E2E8F0] shadow-sm bg-white">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Live Metering</span>
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>{timeSec}s</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl mb-3 shadow-inner">
            <div className="flex items-center gap-2">
              <Thermometer className="w-6 h-6 text-red-400" />
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Temperature</span>
                <span className="text-2xl font-black font-mono text-amber-300">
                  {temp.toFixed(1)}°C
                </span>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] bg-slate-800 text-white border-slate-700">
              {currentPhaseInfo.label}
            </Badge>
          </div>

          <div className="space-y-2 text-xs font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Melting Point:</span>
              <span className="font-bold text-slate-800">{substance.meltingPoint}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Boiling Point:</span>
              <span className="font-bold text-slate-800">{substance.boilingPoint}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Latent Heat Fusion:</span>
              <span className="font-bold text-slate-800">{substance.latentFusion} J/g</span>
            </div>
          </div>
        </Card>

        {/* CAPS Core Concept Card */}
        <Card className="p-4 lg:p-5 border-amber-200 shadow-sm bg-gradient-to-br from-slate-900 to-amber-950 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-200">CAPS Exam Core Rules</h4>
          </div>
          <ul className="text-xs space-y-2 text-amber-100/90 leading-relaxed list-disc list-inside">
            <li><strong className="text-white">Sloped Regions:</strong> Heat energy increases average Kinetic Energy (E_k ∝ T). Temperature rises.</li>
            <li><strong className="text-white">Flat Plateaus:</strong> Heat energy increases Potential Energy (E_p) to break intermolecular bonds during phase change. Temperature remains constant!</li>
            <li><strong className="text-white">Stearic Acid Freezing:</strong> Solidifies at 69°C releasing latent heat of fusion.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ────────── HELPER: PHASE STATE DETERMINATOR ────────── */

function getPhaseState(
  t: number,
  sub: SubstanceSpec,
  progress: number
): { label: string; state: 'solid' | 'melting' | 'liquid' | 'boiling' | 'gas'; color: string } {
  if (Math.abs(t - sub.meltingPoint) < 0.2 && progress < 100) {
    return { label: `Melting (Solid + Liquid ${Math.round(progress)}%)`, state: 'melting', color: '#F59E0B' };
  }
  if (Math.abs(t - sub.boilingPoint) < 0.2 && progress < 100) {
    return { label: `Boiling (Liquid + Gas ${Math.round(progress)}%)`, state: 'boiling', color: '#EF4444' };
  }
  if (t < sub.meltingPoint) {
    return { label: 'Solid Phase', state: 'solid', color: '#3B82F6' };
  }
  if (t < sub.boilingPoint) {
    return { label: 'Liquid Phase', state: 'liquid', color: '#10B981' };
  }
  return { label: 'Gas / Vapor Phase', state: 'gas', color: '#8B5CF6' };
}

/* ────────── SUB-PANEL 1: HEATING LAB ────────── */

function HeatingLabPanel({
  substance,
  substanceId,
  onSelectSubstance,
  flamePower,
  onChangeFlame,
  isRunning,
  onToggleRun,
  onReset,
  simSpeed,
  onChangeSpeed,
  timeSec,
  temp,
  dataPoints,
  currentPhase
}: {
  substance: SubstanceSpec;
  substanceId: SubstanceId;
  onSelectSubstance: (id: SubstanceId) => void;
  flamePower: number;
  onChangeFlame: (p: number) => void;
  isRunning: boolean;
  onToggleRun: () => void;
  onReset: () => void;
  simSpeed: number;
  onChangeSpeed: (s: number) => void;
  timeSec: number;
  temp: number;
  dataPoints: DataPoint[];
  currentPhase: { label: string; state: string; color: string };
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Control Column */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <Card className="p-4 border-slate-200 bg-white space-y-4">
          <h3 className="font-bold text-xs uppercase text-slate-800 tracking-wide">
            Experimental Setup Controls
          </h3>

          {/* Substance Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Select Substance</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(SUBSTANCES) as SubstanceId[]).map(id => (
                <button
                  key={id}
                  onClick={() => onSelectSubstance(id)}
                  className={`p-2 rounded-lg border text-left text-xs font-bold transition-all ${
                    substanceId === id
                      ? 'border-amber-500 bg-amber-50 text-amber-800'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {SUBSTANCES[id].name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Flame Burner Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Bunsen Burner Heat Power:
              </span>
              <span className="font-mono font-bold text-amber-600">
                {flamePower === 0 ? 'OFF' : flamePower === 1 ? 'LOW' : flamePower === 2 ? 'MED' : 'HIGH'}
              </span>
            </div>
            <Slider
              value={[flamePower]}
              min={0}
              max={3}
              step={1}
              onValueChange={(val) => onChangeFlame(Array.isArray(val) ? val[0] : (val as number))}
            />
          </div>

          {/* Speed & Run Controls */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <Button
              onClick={onToggleRun}
              className={`flex-1 font-bold text-xs gap-2 ${
                isRunning ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Pause Heating' : 'Start Heating'}
            </Button>

            <Button variant="outline" size="icon" onClick={onReset} title="Reset Experiment">
              <RotateCcw className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
        </Card>

        {/* 2D Animated Apparatus Box */}
        <Card className="p-4 border-slate-200 bg-white flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
          <span className="absolute top-2 left-3 text-[10px] font-bold text-slate-400 uppercase">
            Beaker & Thermometer Visualizer
          </span>

          <div className="relative w-40 h-44 border-b-4 border-x-2 border-slate-400 rounded-b-2xl flex items-end justify-center bg-slate-50 overflow-hidden shadow-inner mt-4">
            {/* Liquid / Solid Contents */}
            <motion.div
              className="w-full transition-all duration-300 flex items-center justify-center"
              style={{
                height: `${Math.min(90, Math.max(25, 40 + (temp / 150) * 40))}%`,
                backgroundColor: currentPhase.color,
                opacity: 0.7
              }}
            >
              <span className="text-[10px] font-mono font-bold text-white uppercase">
                {currentPhase.state}
              </span>
            </motion.div>

            {/* Thermometer */}
            <div className="absolute top-2 w-3 h-36 bg-slate-200 border border-slate-400 rounded-full flex flex-col justify-end p-0.5 shadow-sm">
              <div
                className="w-full bg-red-600 rounded-full transition-all duration-300"
                style={{ height: `${Math.min(100, Math.max(10, ((temp + 30) / 180) * 100))}%` }}
              />
            </div>
          </div>

          {/* Flame Visual */}
          {flamePower > 0 && isRunning && (
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="flex gap-1 mt-1 text-amber-500"
            >
              <Flame className={`w-${flamePower + 4} h-${flamePower + 4} fill-amber-400`} />
            </motion.div>
          )}
        </Card>
      </div>

      {/* Right Column: Dynamic SVG Temperature-Time Graph */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <Card className="p-4 border-slate-200 bg-white flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-xs uppercase text-slate-800 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              Real-Time Temperature vs Time Graph (T-t Plot)
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Points logged: {dataPoints.length}</span>
          </div>

          {/* SVG Live Plotter */}
          <div className="flex-1 w-full min-h-[280px] bg-slate-900 rounded-xl p-3 relative flex items-center justify-center overflow-hidden">
            <SVGHeatingPlot dataPoints={dataPoints} substance={substance} />
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ────────── SUB-PANEL 2: COOLING LAB (STEARIC ACID) ────────── */

function CoolingLabPanel({
  substance,
  coolingRate,
  onChangeCoolingRate,
  isRunning,
  onToggleRun,
  onReset,
  simSpeed,
  onChangeSpeed,
  timeSec,
  temp,
  dataPoints,
  currentPhase
}: {
  substance: SubstanceSpec;
  coolingRate: 'air' | 'water';
  onChangeCoolingRate: (r: 'air' | 'water') => void;
  isRunning: boolean;
  onToggleRun: () => void;
  onReset: () => void;
  simSpeed: number;
  onChangeSpeed: (s: number) => void;
  timeSec: number;
  temp: number;
  dataPoints: DataPoint[];
  currentPhase: { label: string; state: string; color: string };
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 flex flex-col gap-4">
        <Card className="p-4 border-slate-200 bg-white space-y-4">
          <h3 className="font-bold text-xs uppercase text-amber-800 tracking-wide">
            CAPS Practical: Stearic Acid Cooling Curve
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            Molten stearic acid at 90°C is allowed to cool down. Record the temperature every 30 seconds to plot the freezing plateau at 69°C.
          </p>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Cooling Environment</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeCoolingRate('air')}
                className={`p-2.5 rounded-lg border text-xs font-bold text-left transition-all ${
                  coolingRate === 'air'
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                Room Air Cooling (Normal)
              </button>
              <button
                onClick={() => onChangeCoolingRate('water')}
                className={`p-2.5 rounded-lg border text-xs font-bold text-left transition-all ${
                  coolingRate === 'water'
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                Cold Water Bath (Fast)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <Button
              onClick={onToggleRun}
              className={`flex-1 font-bold text-xs gap-2 ${
                isRunning ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Pause Cooling' : 'Start Cooling'}
            </Button>

            <Button variant="outline" size="icon" onClick={onReset}>
              <RotateCcw className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-7 flex flex-col gap-4">
        <Card className="p-4 border-slate-200 bg-white flex-1 flex flex-col">
          <h4 className="font-bold text-xs uppercase text-slate-800 mb-3 flex items-center gap-1.5">
            <Snowflake className="w-4 h-4 text-blue-500" />
            Stearic Acid Cooling Graph (69°C Plateau)
          </h4>
          <div className="flex-1 w-full min-h-[280px] bg-slate-900 rounded-xl p-3 relative flex items-center justify-center overflow-hidden">
            <SVGHeatingPlot dataPoints={dataPoints} substance={substance} />
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ────────── SVG LIVE PLOTTER COMPONENT ────────── */

function SVGHeatingPlot({ dataPoints, substance }: { dataPoints: DataPoint[]; substance: SubstanceSpec }) {
  const width = 500;
  const height = 240;
  const padding = 35;

  const maxTime = Math.max(60, dataPoints[dataPoints.length - 1]?.timeSec || 60);
  const minTemp = -30;
  const maxTemp = 140;

  const getX = (t: number) => padding + (t / maxTime) * (width - padding * 2);
  const getY = (temp: number) => height - padding - ((temp - minTemp) / (maxTemp - minTemp)) * (height - padding * 2);

  const pathD = useMemo(() => {
    if (dataPoints.length === 0) return '';
    return dataPoints.reduce((acc, pt, i) => {
      const x = getX(pt.timeSec);
      const y = getY(pt.temp);
      return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }, [dataPoints, maxTime]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      {/* Grid Lines */}
      {[-20, 0, 40, 69, 100, 120].map(tVal => {
        const y = getY(tVal);
        return (
          <g key={`grid-${tVal}`}>
            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#334155" strokeDasharray="3,3" strokeWidth="1" />
            <text x={padding - 5} y={y + 3} textAnchor="end" fill="#94A3B8" fontSize="9" fontFamily="monospace">
              {tVal}°C
            </text>
          </g>
        );
      })}

      {/* Axis Lines */}
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#64748B" strokeWidth="2" />
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#64748B" strokeWidth="2" />

      {/* Axis Labels */}
      <text x={width / 2} y={height - 8} textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="bold">
        Time (seconds)
      </text>
      <text x={12} y={height / 2} textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="bold" transform={`rotate(-90 12 ${height / 2})`}>
        Temp (°C)
      </text>

      {/* Live Line Plot */}
      {pathD && <path d={pathD} fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />}

      {/* Current Data Point Pulse */}
      {dataPoints.length > 0 && (
        <circle
          cx={getX(dataPoints[dataPoints.length - 1].timeSec)}
          cy={getY(dataPoints[dataPoints.length - 1].temp)}
          r="5"
          fill="#EF4444"
          className="animate-pulse"
        />
      )}
    </svg>
  );
}

/* ────────── SUB-PANEL 3: KMT VISUALIZER ────────── */

function KMTVisualizerPanel({
  temp,
  substance,
  currentPhase
}: {
  temp: number;
  substance: SubstanceSpec;
  currentPhase: { label: string; state: string; color: string };
}) {
  const particleCount = 24;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 flex flex-col gap-4">
        <Card className="p-4 border-slate-200 bg-white flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
          <span className="absolute top-3 left-3 text-[10px] font-bold text-slate-400 uppercase">
            Microscopic Particle Motion Simulation
          </span>

          <div className="relative w-72 h-72 bg-slate-900 rounded-2xl border-2 border-slate-700 flex items-center justify-center overflow-hidden shadow-inner mt-4">
            {Array.from({ length: particleCount }).map((_, idx) => {
              const row = Math.floor(idx / 5);
              const col = idx % 5;

              // Compute particle speeds based on Kinetic Energy (Temperature)
              const speed = currentPhase.state === 'solid' ? 0.3 : currentPhase.state === 'liquid' ? 1.5 : 4.0;

              return (
                <motion.div
                  key={idx}
                  animate={
                    currentPhase.state === 'solid'
                      ? { x: [col * 35 - 70 + Math.sin(idx) * 2, col * 35 - 70 - Math.sin(idx) * 2] }
                      : {
                          x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                          y: [Math.random() * 200 - 100, Math.random() * 200 - 100]
                        }
                  }
                  transition={{ repeat: Infinity, duration: 1 / speed, ease: 'easeInOut' }}
                  className="absolute w-5 h-5 rounded-full shadow-md flex items-center justify-center border border-white/40"
                  style={{ backgroundColor: currentPhase.color }}
                />
              );
            })}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-4">
        <Card className="p-4 border-slate-200 bg-white space-y-4">
          <h4 className="font-bold text-xs uppercase text-slate-800">Energy & Phase Concepts</h4>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <strong className="text-blue-900 block mb-1">Average Kinetic Energy ($E_k$):</strong>
              <p className="text-slate-600 leading-relaxed">
                Directly proportional to temperature ($E_k \propto T$). As temperature rises, particles move/vibrate faster.
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <strong className="text-amber-900 block mb-1">Potential Energy ($E_p$):</strong>
              <p className="text-slate-600 leading-relaxed">
                Increases during phase transitions (melting/boiling plateaus) to overcome intermolecular forces without raising temperature.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ────────── SUB-PANEL 4: DATA & CALCULATOR ────────── */

function DataCalculatorPanel({ dataPoints, substance }: { dataPoints: DataPoint[]; substance: SubstanceSpec }) {
  const [massGrams, setMassGrams] = useState(100);

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-4 border-slate-200 bg-white">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-xs uppercase text-slate-800">
            Recorded Experimental Data Log
          </h3>
          <Badge variant="outline" className="text-xs font-mono">{dataPoints.length} Records</Badge>
        </div>

        <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-lg text-xs font-mono">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 sticky top-0">
              <tr>
                <th className="p-2 border-b">Time (s)</th>
                <th className="p-2 border-b">Temp (°C)</th>
                <th className="p-2 border-b">Phase State</th>
              </tr>
            </thead>
            <tbody>
              {dataPoints.slice(-20).map((pt, idx) => (
                <tr key={idx} className="border-b hover:bg-slate-50">
                  <td className="p-2">{pt.timeSec}s</td>
                  <td className="p-2 font-bold text-amber-700">{pt.temp}°C</td>
                  <td className="p-2">{pt.phase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ────────── SUB-PANEL 5: QUIZ ────────── */

function QuizPanel() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      q: 'During a phase change (melting or boiling plateau), what happens to the temperature of a pure substance?',
      options: ['Increases rapidly', 'Decreases', 'Remains constant', 'Fluctuates randomly'],
      correct: 2,
      exp: 'During a phase change, heat energy is used as latent heat to overcome intermolecular forces (increasing Potential Energy $E_p$), so temperature remains constant.'
    },
    {
      q: 'What is the melting point of pure Stearic Acid in the prescribed Grade 10 practical?',
      options: ['0°C', '69°C', '100°C', '361°C'],
      correct: 1,
      exp: 'Stearic acid melts and solidifies at a characteristic plateau temperature of 69°C.'
    },
    {
      q: 'Average Kinetic Energy of particles is directly proportional to:',
      options: ['Pressure', 'Volume', 'Temperature', 'Density'],
      correct: 2,
      exp: 'Temperature is a measure of the average Kinetic Energy ($E_k \propto T$) of particles.'
    },
    {
      q: 'On a heating curve, sloped regions represent:',
      options: ['Phase transitions', 'Increase in Kinetic Energy and Temperature', 'Loss of heat energy', 'Constant Potential Energy only'],
      correct: 1,
      exp: 'Sloped regions represent temperature increase where added heat increases particle Kinetic Energy ($E_k$).'
    }
  ];

  const handleNext = () => {
    if (selectedOpt === questions[currentIdx].correct) {
      setScore(prev => prev + 1);
    }
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {!showResult ? (
        <Card className="p-6 border-slate-200 bg-white space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-amber-600 uppercase">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <Badge variant="outline" className="text-xs font-mono">Score: {score}</Badge>
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {questions[currentIdx].q}
          </h3>

          <div className="space-y-2.5">
            {questions[currentIdx].options.map((opt, optIdx) => (
              <button
                key={optIdx}
                onClick={() => setSelectedOpt(optIdx)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                  selectedOpt === optIdx
                    ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>{opt}</span>
                {selectedOpt === optIdx && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
              </button>
            ))}
          </div>

          {selectedOpt !== null && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              💡 <strong>Explanation:</strong> {questions[currentIdx].exp}
            </div>
          )}

          <Button
            disabled={selectedOpt === null}
            onClick={handleNext}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-1.5 py-2.5"
          >
            {currentIdx + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Card>
      ) : (
        <Card className="p-8 border-slate-200 bg-white text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            🎉
          </div>
          <h3 className="text-xl font-black text-slate-900">Quiz Completed!</h3>
          <p className="text-sm text-slate-600">
            You scored <strong className="text-amber-600 font-bold">{score} out of {questions.length}</strong> on Heating & Cooling Curves.
          </p>

          <Button onClick={() => { setCurrentIdx(0); setSelectedOpt(null); setScore(0); setShowResult(false); }} className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-2">
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </Button>
        </Card>
      )}
    </div>
  );
}

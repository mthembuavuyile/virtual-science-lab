import React, { useState, useEffect, useMemo } from 'react';
import { SbaPractical, DataRow } from '../../../types/sba';
import { Zap, Play, Pause, RotateCcw, Plus, CheckCircle, Flame, Droplets, Eye, Gauge, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface StepApparatusProps {
  practical: SbaPractical;
  onAddDataRow: (row: DataRow) => void;
  loggedCount: number;
}

export default function StepApparatus({ practical, onAddDataRow, loggedCount }: StepApparatusProps) {
  // Common states
  const [justLogged, setJustLogged] = useState(false);

  // 1. Internal Resistance Lab States
  const [rheostatR, setRheostatR] = useState(15);
  const [isSwitchClosed, setIsSwitchClosed] = useState(true);

  // 2. Titration Lab States
  const [buretteVolume, setBuretteVolume] = useState(0); // Volume of NaOH dispensed
  const [isDispensing, setIsDispensing] = useState(false);

  // 3. Reaction Rate Lab States
  const [tempCelsius, setTempCelsius] = useState(25);
  const [reactionTimer, setReactionTimer] = useState(0);
  const [isReacting, setIsReacting] = useState(false);

  // 4. Snell's Law Lab States
  const [angleI, setAngleI] = useState(30);

  // 5. Boyle's Law Lab States
  const [pumpPressure, setPumpPressure] = useState(100);

  // 6. Newton's 2nd Law Lab States
  const [hangingMassGrams, setHangingMassGrams] = useState(20);

  // Noise generator for anti-plagiarism variance
  const randomNoise = useMemo(() => (Math.random() - 0.5) * 0.04, [loggedCount]);

  /* ────────── 1. INTERNAL RESISTANCE RIG CALCULATION ────────── */
  const batteryTrueEmf = 9.0; // Volts
  const batteryTrueR = 1.45; // Ohms
  const leadResistance = 0.2; // Ohms

  const internalRPhysics = useMemo(() => {
    if (!isSwitchClosed) {
      return { current: 0, voltage: Number((batteryTrueEmf + randomNoise * 0.2).toFixed(2)), power: 0 };
    }
    const totalR = rheostatR + batteryTrueR + leadResistance;
    const currentRaw = batteryTrueEmf / totalR;
    const terminalVRaw = batteryTrueEmf - currentRaw * batteryTrueR;
    
    // Add calibrated instrument noise
    const current = Number((currentRaw * (1 + randomNoise)).toFixed(2));
    const voltage = Number((terminalVRaw * (1 + randomNoise * 0.5)).toFixed(2));
    const power = Number((voltage * current).toFixed(2));

    return { current, voltage, power };
  }, [rheostatR, isSwitchClosed, randomNoise]);

  /* ────────── 2. TITRATION CALCULATION ────────── */
  const titrationEndpoint = 22.4; // mL of NaOH required
  const isEndpointReached = buretteVolume >= titrationEndpoint;
  const flaskColor = useMemo(() => {
    if (buretteVolume < titrationEndpoint - 0.5) return 'rgba(240, 249, 255, 0.4)'; // clear
    if (buretteVolume < titrationEndpoint + 0.5) return 'rgba(244, 114, 182, 0.5)'; // pale pink
    return 'rgba(219, 39, 119, 0.85)'; // deep magenta
  }, [buretteVolume, titrationEndpoint]);

  useEffect(() => {
    let interval: any;
    if (isDispensing && buretteVolume < 50) {
      interval = setInterval(() => {
        setBuretteVolume(v => Math.min(50, Number((v + 0.1).toFixed(2))));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isDispensing, buretteVolume]);

  /* ────────── 3. REACTION RATE CALCULATION ────────── */
  const theoreticalReactionTime = useMemo(() => {
    // Arrhenius relationship: higher temp -> shorter time
    const t = 120 * Math.exp(-0.035 * (tempCelsius - 20));
    return Number((t * (1 + randomNoise)).toFixed(1));
  }, [tempCelsius, randomNoise]);

  useEffect(() => {
    let interval: any;
    if (isReacting && reactionTimer < theoreticalReactionTime) {
      interval = setInterval(() => {
        setReactionTimer(t => Number((t + 0.1).toFixed(1)));
      }, 50);
    } else if (reactionTimer >= theoreticalReactionTime) {
      setIsReacting(false);
    }
    return () => clearInterval(interval);
  }, [isReacting, reactionTimer, theoreticalReactionTime]);

  /* ────────── 4. SNELL'S LAW CALCULATION ────────── */
  const glassRefractiveIndex = 1.52;
  const snellPhysics = useMemo(() => {
    const radI = (angleI * Math.PI) / 180;
    const sinI = Math.sin(radI);
    const sinRRaw = sinI / glassRefractiveIndex;
    const radR = Math.asin(sinRRaw);
    const angleRRaw = (radR * 180) / Math.PI;

    const angleR = Number((angleRRaw * (1 + randomNoise * 0.3)).toFixed(1));
    const sinR = Number(Math.sin((angleR * Math.PI) / 180).toFixed(3));
    const sinIFormatted = Number(sinI.toFixed(3));

    return { angleI, angleR, sinI: sinIFormatted, sinR };
  }, [angleI, randomNoise]);

  /* ────────── 5. BOYLE'S LAW CALCULATION ────────── */
  const boylePhysics = useMemo(() => {
    const kConstant = 2400; // kPa * cm3
    const pReal = pumpPressure * (1 + randomNoise * 0.2);
    const vReal = kConstant / pReal;
    const invV = Number((1 / vReal).toFixed(4));
    const pv = Number((pReal * vReal).toFixed(1));

    return {
      pressure: Number(pReal.toFixed(1)),
      volume: Number(vReal.toFixed(1)),
      invVolume: invV,
      pvProduct: pv
    };
  }, [pumpPressure, randomNoise]);

  /* ────────── 6. NEWTON'S 2ND LAW CALCULATION ────────── */
  const newtonPhysics = useMemo(() => {
    const totalMassKg = 1.0; // 1.0 kg system
    const g = 9.8;
    const massKg = hangingMassGrams / 1000;
    const fNet = Number((massKg * g).toFixed(3));
    const accelRaw = fNet / totalMassKg;
    const accel = Number((accelRaw * (1 + randomNoise)).toFixed(2));
    const deltaV = Number((accel * 0.5).toFixed(3));

    return { hangingMassGrams, netForce: fNet, deltaV, acceleration: accel };
  }, [hangingMassGrams, randomNoise]);

  /* ────────── LOG DATA ACTION ────────── */
  const handleLogCurrentReading = () => {
    const rowId = `trial-${Date.now()}`;
    let newRow: DataRow = { id: rowId, readingNum: loggedCount + 1, trialNum: loggedCount + 1 };

    if (practical.id === 'gr12-internal-resistance') {
      newRow = {
        ...newRow,
        current: internalRPhysics.current,
        voltage: internalRPhysics.voltage,
        power: internalRPhysics.power
      };
    } else if (practical.id === 'gr12-titration') {
      newRow = {
        ...newRow,
        initialBurette: 0.0,
        finalBurette: buretteVolume,
        titreVolume: buretteVolume
      };
    } else if (practical.id === 'gr12-reaction-rates') {
      const invT = Number((1 / theoreticalReactionTime).toFixed(4));
      newRow = {
        ...newRow,
        tempCelsius: tempCelsius,
        tempKelvin: Number((tempCelsius + 273.15).toFixed(1)),
        timeSeconds: theoreticalReactionTime,
        rateInverseTime: invT
      };
    } else if (practical.id === 'gr11-snells-law') {
      newRow = {
        ...newRow,
        angleI: snellPhysics.angleI,
        angleR: snellPhysics.angleR,
        sinI: snellPhysics.sinI,
        sinR: snellPhysics.sinR
      };
    } else if (practical.id === 'gr11-boyles-law') {
      newRow = {
        ...newRow,
        pressure: boylePhysics.pressure,
        volume: boylePhysics.volume,
        invVolume: boylePhysics.invVolume,
        pvProduct: boylePhysics.pvProduct
      };
    } else if (practical.id === 'gr11-newton2') {
      newRow = {
        ...newRow,
        hangingMassGrams: newtonPhysics.hangingMassGrams,
        netForce: newtonPhysics.netForce,
        deltaV: newtonPhysics.deltaV,
        acceleration: newtonPhysics.acceleration
      };
    }

    onAddDataRow(newRow);
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Rig Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-bold text-base text-slate-100">
                Active Digital Apparatus: {practical.shortTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Adjust parameters below and record calibrated readings directly into your SBA table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300">
              Logged Trials: <strong className="text-blue-400">{loggedCount}</strong> / {practical.recommendedDataPointsCount}
            </span>
          </div>
        </div>

        {/* ─── RIG 1: INTERNAL RESISTANCE ─── */}
        {practical.id === 'gr12-internal-resistance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Voltmeter Display */}
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Terminal Voltmeter (V)
                </span>
                <div className="font-mono text-4xl font-extrabold text-blue-400 tracking-tight">
                  {internalRPhysics.voltage.toFixed(2)}{' '}
                  <span className="text-lg font-normal text-slate-500">V</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-2">Precision: ±0.01 V DC</span>
              </div>

              {/* Ammeter Display */}
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Circuit Ammeter (I)
                </span>
                <div className="font-mono text-4xl font-extrabold text-amber-400 tracking-tight">
                  {internalRPhysics.current.toFixed(2)}{' '}
                  <span className="text-lg font-normal text-slate-500">A</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-2">Precision: ±0.01 A DC</span>
              </div>

              {/* Rheostat Control */}
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl flex flex-col justify-center">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-300">Rheostat (R_ext)</span>
                  <span className="font-mono text-sm font-bold text-emerald-400">{rheostatR} Ω</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={35}
                  step={1}
                  value={rheostatR}
                  onChange={e => setRheostatR(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                  <span>High Current (3 Ω)</span>
                  <span>Low Current (35 Ω)</span>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-xs font-medium text-slate-400">Switch Key</span>
                  <button
                    type="button"
                    onClick={() => setIsSwitchClosed(!isSwitchClosed)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                      isSwitchClosed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {isSwitchClosed ? 'CLOSED (ON)' : 'OPEN (OFF)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── RIG 2: ACID-BASE TITRATION ─── */}
        {practical.id === 'gr12-titration' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual Flask & Burette */}
            <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-xl flex flex-col items-center">
              <div className="w-full flex justify-between text-xs text-slate-400 mb-4">
                <span>Burette Level: <strong className="text-blue-400">{buretteVolume} cm³</strong></span>
                <span>Indicator: <strong className="text-pink-400">Phenolphthalein</strong></span>
              </div>

              {/* Conical Flask Graphic */}
              <div className="relative w-40 h-44 flex flex-col items-center justify-end">
                <div
                  className="w-32 h-28 rounded-b-3xl border-4 border-slate-600 transition-colors duration-500 relative flex items-center justify-center"
                  style={{ backgroundColor: flaskColor }}
                >
                  <span className="text-[11px] font-bold text-slate-800 bg-white/70 px-2 py-0.5 rounded">
                    {isEndpointReached ? '🌸 Endpoint (Pink)' : '💧 Colourless'}
                  </span>
                </div>
              </div>
            </div>

            {/* Titration Controls */}
            <div className="space-y-4">
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-slate-300">Dispense NaOH Volume</span>
                  <span className="font-mono text-sm font-bold text-pink-400">{buretteVolume.toFixed(2)} cm³</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={0.5}
                  value={buretteVolume}
                  onChange={e => setBuretteVolume(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDispensing(!isDispensing)}
                    className="flex-1 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    {isDispensing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isDispensing ? 'Stop Dropwise Flow' : 'Start Dropwise Flow'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setBuretteVolume(0); setIsDispensing(false); }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── RIG 3: REACTION RATES ─── */}
        {practical.id === 'gr12-reaction-rates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" /> Water Bath Temperature
                </span>
                <span className="font-mono text-base font-bold text-amber-400">{tempCelsius} °C</span>
              </div>
              <input
                type="range"
                min={20}
                max={60}
                step={5}
                value={tempCelsius}
                onChange={e => { setTempCelsius(Number(e.target.value)); setReactionTimer(0); setIsReacting(false); }}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Room Temp (20°C)</span>
                <span>Warm Bath (60°C)</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-400 mb-1">Opacity Disappearance Time (t)</span>
              <div className="font-mono text-3xl font-extrabold text-emerald-400">
                {theoreticalReactionTime.toFixed(1)} <span className="text-sm font-normal text-slate-500">s</span>
              </div>
              <span className="text-xs text-slate-400 mt-2 font-mono">
                Reaction Rate (1/t) = {(1 / theoreticalReactionTime).toFixed(4)} s⁻¹
              </span>
            </div>
          </div>
        )}

        {/* ─── RIG 4: SNELL'S LAW ─── */}
        {practical.id === 'gr11-snells-law' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300">Incident Ray Angle (θ_i)</span>
                <span className="font-mono text-base font-bold text-red-400">{angleI}°</span>
              </div>
              <input
                type="range"
                min={10}
                max={75}
                step={5}
                value={angleI}
                onChange={e => setAngleI(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Near Normal (10°)</span>
                <span>Glancing (75°)</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl flex flex-col justify-center space-y-2 font-mono text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Angle of Refraction (θ_r):</span>
                <strong className="text-blue-400">{snellPhysics.angleR}°</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>sin(θ_i) in Air:</span>
                <strong className="text-red-400">{snellPhysics.sinI.toFixed(3)}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>sin(θ_r) in Glass:</span>
                <strong className="text-blue-400">{snellPhysics.sinR.toFixed(3)}</strong>
              </div>
            </div>
          </div>
        )}

        {/* ─── RIG 5: BOYLE'S LAW ─── */}
        {practical.id === 'gr11-boyles-law' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300">Applied Pressure (P)</span>
                <span className="font-mono text-base font-bold text-indigo-400">{pumpPressure} kPa</span>
              </div>
              <input
                type="range"
                min={100}
                max={250}
                step={10}
                value={pumpPressure}
                onChange={e => setPumpPressure(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl flex flex-col justify-center space-y-2 font-mono text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Gas Volume (V):</span>
                <strong className="text-emerald-400">{boylePhysics.volume} cm³</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Inverse Volume (1/V):</span>
                <strong className="text-indigo-400">{boylePhysics.invVolume} cm⁻³</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>P · V Product:</span>
                <strong className="text-amber-400">{boylePhysics.pvProduct} kPa·cm³</strong>
              </div>
            </div>
          </div>
        )}

        {/* ─── RIG 6: NEWTON'S 2ND LAW ─── */}
        {practical.id === 'gr11-newton2' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300">Hanging Mass (m_h)</span>
                <span className="font-mono text-base font-bold text-violet-400">{hangingMassGrams} g</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={10}
                value={hangingMassGrams}
                onChange={e => setHangingMassGrams(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
              <p className="text-[11px] text-slate-500">Transferred from trolley to maintain constant m_total = 1.0 kg.</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl flex flex-col justify-center space-y-2 font-mono text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Net Force (F_net):</span>
                <strong className="text-amber-400">{newtonPhysics.netForce} N</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Acceleration (a):</span>
                <strong className="text-emerald-400">{newtonPhysics.acceleration} m/s²</strong>
              </div>
            </div>
          </div>
        )}

        {/* Log Button Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-slate-400">
            {loggedCount >= practical.recommendedDataPointsCount
              ? '✅ Sufficient data points logged. You may log more or proceed to Step 3.'
              : `⚠️ Log at least ${practical.recommendedDataPointsCount - loggedCount} more point(s) for statistical accuracy.`}
          </span>

          <button
            type="button"
            onClick={handleLogCurrentReading}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${
              justLogged
                ? 'bg-emerald-600 text-white scale-95'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02]'
            }`}
          >
            {justLogged ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Reading Logged to SBA Table!
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Record Reading to SBA Table
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

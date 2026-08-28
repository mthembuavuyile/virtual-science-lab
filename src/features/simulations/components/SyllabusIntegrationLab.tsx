import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  HelpCircle, 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  FileText, 
  Check, 
  AlertCircle, 
  Compass, 
  Waves, 
  Flame, 
  Droplets, 
  Globe, 
  Scale, 
  Lightbulb, 
  Sun, 
  Volume2, 
  Mountain, 
  Zap, 
  Info,
  ChevronRight,
  RefreshCw,
  Maximize2,
  Minimize2,
  Share2
} from 'lucide-react';
import { useHardwareCapabilities } from '@/src/hooks/useHardwareCapabilities';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar,
  ReferenceLine
} from 'recharts';
import { getLabById, LabEntry } from '@/src/data/experiments';
import AnalyzeExperimentPanel from '@/src/components/AnalyzeExperimentPanel';
import RichText from '@/src/components/ui/RichText';
import { guidesContent } from '@/src/features/simulations/data/guides';
import { generalQuizzes } from '@/src/features/simulations/data/quizzes';
import G10HeatingCurves from '../labs/G10HeatingCurves';


export default function SyllabusIntegrationLab() {
  const { labId } = useParams<{ labId: string }>();
  const navigate = useNavigate();
  const lab = labId ? getLabById(labId) : undefined;
  const { vibrate, isFullscreen, toggleFullscreen, requestWakeLock, releaseWakeLock, shareContent } = useHardwareCapabilities();

  // Generic control states
  const [isPlaying, setIsPlaying] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [dataLog, setDataLog] = useState<any[]>([]);

  // Screen Wake Lock during active lab experiment
  useEffect(() => {
    if (isPlaying) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  }, [isPlaying, requestWakeLock, releaseWakeLock]);

  // Simulation-specific parameters
  // 1D motion
  const [initVelocity, setInitVelocity] = useState(2); // m/s
  const [acceleration, setAcceleration] = useState(1); // m/s^2
  // Conservation of energy
  const [skateHeight, setSkateHeight] = useState(6); // meters
  const [skateMass, setSkateMass] = useState(60); // kg
  const [skateFriction, setSkateFriction] = useState(0); // friction coefficient
  // Waves & Sound
  const [waveFreq, setWaveFreq] = useState(440); // Hz
  const [waveAmp, setWaveAmp] = useState(5); // arbitrary scale
  // Vectors 2D
  const [vecMagnitude, setVecMagnitude] = useState(50);
  const [vecAngle, setVecAngle] = useState(30); // degrees
  // Newton's 2nd law
  const [newtonForce, setNewtonForce] = useState(5); // N
  const [newtonMass, setNewtonMass] = useState(1.5); // kg
  // Geometrical optics Snell's law
  const [opticsAngle, setOpticsAngle] = useState(30); // degrees
  const [opticsN1, setOpticsN1] = useState(1.0); // Air
  const [opticsN2, setOpticsN2] = useState(1.5); // Glass
  // Boyle's Law
  const [gasVolume, setGasVolume] = useState(50); // mL
  const [gasTemp, setGasTemp] = useState(300); // Kelvin
  // Intermolecular forces
  const [imfTemp, setImfTemp] = useState(25); // Celsius
  const [evapLevels, setEvapLevels] = useState({ water: 100, ethanol: 100, acetone: 100 });
  // Conservation of Momentum
  const [momM1, setMomM1] = useState(2); // kg
  const [momM2, setMomM2] = useState(2); // kg
  const [momV1, setMomV1] = useState(4); // m/s
  const [momV2, setMomV2] = useState(-2); // m/s
  const [collisionType, setCollisionType] = useState<'elastic' | 'inelastic'>('elastic');
  // Doppler Effect
  const [dopplerFreq, setDopplerFreq] = useState(400); // Hz
  const [dopplerSpeed, setDopplerSpeed] = useState(25); // m/s
  // Photoelectric effect
  const [lightWavelength, setLightWavelength] = useState(400); // nm
  const [lightIntensity, setLightIntensity] = useState(50); // %
  const [phototubeMetal, setPhototubeMetal] = useState<'cesium' | 'sodium' | 'zinc'>('cesium');
  
  // The Mole
  const [carbonCount, setCarbonCount] = useState(1);
  const [hydrogenCount, setHydrogenCount] = useState(4);
  const [oxygenCount, setOxygenCount] = useState(0);
  const [moleSampleMass, setMoleSampleMass] = useState(16); // grams
  // Aqueous Reactions
  const [solA, setSolA] = useState<'AgNO3' | 'NaCl' | 'BaCl2'>('AgNO3');
  const [solB, setSolB] = useState<'NaCl' | 'Na2SO4' | 'KNO3'>('NaCl');
  // Circuits
  const [circuitV, setCircuitV] = useState(12); // Volts
  const [circuitR1, setCircuitR1] = useState(10); // Ohms
  const [circuitR2, setCircuitR2] = useState(10); // Ohms
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('series');
  // Quantitative Chem
  const [quantMassA, setQuantMassA] = useState(10);
  const [quantMassB, setQuantMassB] = useState(10);
  // Acids Bases
  const [titrationVol, setTitrationVol] = useState(0);

  // Generic state object to feed the AI co-pilot panel
  const [liveTelemetry, setLiveTelemetry] = useState<Record<string, any>>({});

  // Canvas ref for wave simulations
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Audio refs for real sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Mini quiz states for general/non-sim topics
  const [quizScore, setQuizScore] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [quizDone, setQuizDone] = useState(false);

  // Doppler Audio Synthesis
  useEffect(() => {
    if (labId !== 'g12-doppler') {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
        oscillatorRef.current = null;
        gainNodeRef.current = null;
      }
      return;
    }

    if (isPlaying) {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }

      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (audioCtxRef.current && !oscillatorRef.current) {
        oscillatorRef.current = audioCtxRef.current.createOscillator();
        gainNodeRef.current = audioCtxRef.current.createGain();
        
        oscillatorRef.current.type = 'sine'; // A clear tone
        gainNodeRef.current.gain.value = 0.2; // Volume control
        
        oscillatorRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(audioCtxRef.current.destination);
        
        oscillatorRef.current.start();
      }

      if (oscillatorRef.current && liveTelemetry.measured_frequency_hz) {
        // Smooth transition to new frequency
        oscillatorRef.current.frequency.setTargetAtTime(
          liveTelemetry.measured_frequency_hz, 
          audioCtxRef.current!.currentTime, 
          0.05
        );
      }
    } else {
      if (oscillatorRef.current) {
        try { oscillatorRef.current.stop(); } catch(e) {}
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
    }
  }, [isPlaying, labId, liveTelemetry.measured_frequency_hz]);

  // Audio cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Reset simulation when labId changes
  useEffect(() => {
    setIsPlaying(false);
    setSimStep(0);
    setDataLog([]);
    setEvapLevels({ water: 100, ethanol: 100, acetone: 100 });
    setActiveQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setQuizScore(0);
    setQuizDone(false);
  }, [labId]);

  // 1. WAVE ANIMATION ON CANVAS
  useEffect(() => {
    if (labId === 'g10-waves-sound') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let phase = 0;
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        // Wave settings
        const amp = waveAmp * 8; // scale
        const freq = waveFreq / 1000; // scale
        
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const y = (canvas.height / 2) + Math.sin(x * freq + phase) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        phase -= 0.15;
        animationFrameId.current = requestAnimationFrame(render);
      };

      if (isPlaying) {
        animationFrameId.current = requestAnimationFrame(render);
      } else {
        // Render static wave
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const y = (canvas.height / 2) + Math.sin(x * (waveFreq / 1000)) * (waveAmp * 8);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      return () => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      };
    }
  }, [labId, waveFreq, waveAmp, isPlaying]);

  // 2. MAIN SIMULATION TIMER TICK
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSimStep(prev => prev + 1);
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // 3. PROCESS TICK EFFECTS
  useEffect(() => {
    if (!isPlaying) return;

    // 1D Kinematics
    if (labId === 'g10-motion-1d') {
      const t = simStep * 0.2; // seconds
      const x = 0 + initVelocity * t + 0.5 * acceleration * t * t;
      const v = initVelocity + acceleration * t;

      setDataLog(prev => {
        if (prev.some(d => d.time === parseFloat(t.toFixed(1)))) return prev;
        return [...prev, { time: parseFloat(t.toFixed(1)), position: parseFloat(x.toFixed(2)), velocity: parseFloat(v.toFixed(2)) }];
      });

      setLiveTelemetry({
        initial_velocity_mps: initVelocity,
        acceleration_mps2: acceleration,
        elapsed_time_seconds: t.toFixed(1),
        current_position_meters: x.toFixed(2),
        current_velocity_mps: v.toFixed(2)
      });

      if (t >= 10) setIsPlaying(false);
    }

    // Skate Ramp Energy
    if (labId === 'g10-mechanical-energy') {
      // Skater moving on a simple pendulum model mapping track
      const g = 9.8;
      const theta = (simStep * 0.15) % (Math.PI * 2);
      const amp = skateHeight;
      const activeHeight = Math.abs(amp * Math.cos(theta));
      
      const PE = skateMass * g * activeHeight;
      const maxE = skateMass * g * skateHeight;
      // conservation (loss due to friction if configured, let's keep it simple)
      const KE = Math.max(0, maxE - PE);
      
      // Speed v = sqrt(2*KE/m)
      const speed = Math.sqrt((2 * KE) / skateMass);

      setDataLog(prev => [
        ...prev,
        {
          step: simStep,
          PE: Math.round(PE),
          KE: Math.round(KE),
          Total: Math.round(maxE)
        }
      ].slice(-20)); // Keep rolling 20 steps

      setLiveTelemetry({
        skater_mass_kg: skateMass,
        ramp_release_height_meters: skateHeight,
        current_height_meters: activeHeight.toFixed(2),
        potential_energy_joules: Math.round(PE),
        kinetic_energy_joules: Math.round(KE),
        total_energy_joules: Math.round(maxE),
        velocity_mps: speed.toFixed(2)
      });
    }

    // Newton's 2nd Law
    if (labId === 'g11-newton-laws') {
      const a = newtonForce / newtonMass;
      const t = simStep * 0.2;
      const d = 0.5 * a * t * t;
      const v = a * t;

      setDataLog(prev => {
        if (prev.some(dt => dt.time === parseFloat(t.toFixed(1)))) return prev;
        return [...prev, { time: parseFloat(t.toFixed(1)), acceleration: parseFloat(a.toFixed(2)), velocity: parseFloat(v.toFixed(2)) }];
      });

      setLiveTelemetry({
        net_force_newtons: newtonForce,
        trolley_mass_kg: newtonMass,
        acceleration_mps2: a.toFixed(2),
        elapsed_time_seconds: t.toFixed(1),
        current_velocity_mps: v.toFixed(2),
        distance_traveled_meters: d.toFixed(2)
      });

      if (t >= 8) setIsPlaying(false);
    }

    // Intermolecular Forces Evaporation rates
    if (labId === 'g11-intermolecular') {
      // Evaporation rates relative to IMF
      // Acetone (weakest, dip-dip) -> fastest
      // Ethanol (medium, H-bond) -> medium
      // Water (strongest, H-bond) -> slowest
      const tempFactor = 1 + (imfTemp - 20) * 0.03;
      setEvapLevels(prev => {
        const nextAcetone = Math.max(0, prev.acetone - 4 * tempFactor);
        const nextEthanol = Math.max(0, prev.ethanol - 1.5 * tempFactor);
        const nextWater = Math.max(0, prev.water - 0.5 * tempFactor);

        if (nextAcetone === 0 && nextEthanol === 0 && nextWater === 0) {
          setIsPlaying(false);
        }

        return {
          water: parseFloat(nextWater.toFixed(1)),
          ethanol: parseFloat(nextEthanol.toFixed(1)),
          acetone: parseFloat(nextAcetone.toFixed(1))
        };
      });

      setLiveTelemetry({
        ambient_temperature_celsius: imfTemp,
        water_level_pct: evapLevels.water,
        ethanol_level_pct: evapLevels.ethanol,
        acetone_level_pct: evapLevels.acetone,
        conclusion: 'Acetone evaporates quickest due to weak dipole-dipole forces, followed by Ethanol and Water which exhibit stronger Hydrogen bonding.'
      });
    }

    // Momentum Trolley Crash
    if (labId === 'g12-momentum') {
      const crashStep = 15; // crash at step 15
      let p1 = momM1 * momV1;
      let p2 = momM2 * momV2;
      let totalP_initial = p1 + p2;

      let v1_active = momV1;
      let v2_active = momV2;

      if (simStep >= crashStep) {
        if (collisionType === 'inelastic') {
          // stick together
          const vf = totalP_initial / (momM1 + momM2);
          v1_active = vf;
          v2_active = vf;
        } else {
          // perfect elastic
          const vf1 = ((momM1 - momM2) / (momM1 + momM2)) * momV1 + ((2 * momM2) / (momM1 + momM2)) * momV2;
          const vf2 = ((2 * momM1) / (momM1 + momM2)) * momV1 + ((momM2 - momM1) / (momM1 + momM2)) * momV2;
          v1_active = vf1;
          v2_active = vf2;
        }
        setIsPlaying(false); // Stop after collision
      }

      setLiveTelemetry({
        collision_type: collisionType,
        trolley_1_mass_kg: momM1,
        trolley_2_mass_kg: momM2,
        initial_velocity_t1_mps: momV1,
        initial_velocity_t2_mps: momV2,
        final_velocity_t1_mps: v1_active.toFixed(2),
        final_velocity_t2_mps: v2_active.toFixed(2),
        initial_total_momentum_kg_mps: totalP_initial.toFixed(2),
        final_total_momentum_kg_mps: (momM1 * v1_active + momM2 * v2_active).toFixed(2)
      });
    }

    // Doppler Effect
    if (labId === 'g12-doppler') {
      // Listener is stationary at x = 200
      // Car starts at x = 0, goes to x = 400
      const carX = simStep * 10;
      const t = simStep * 0.2;
      const vs = 343; // sound speed m/s
      let apparent = dopplerFreq;

      if (carX < 200) {
        // approaching
        apparent = dopplerFreq * (vs / (vs - dopplerSpeed));
      } else if (carX > 200) {
        // moving away
        apparent = dopplerFreq * (vs / (vs + dopplerSpeed));
      }

      setDataLog(prev => [
        ...prev,
        {
          distance: carX - 200,
          frequency: Math.round(apparent)
        }
      ]);

      setLiveTelemetry({
        emitted_frequency_hz: dopplerFreq,
        source_velocity_mps: dopplerSpeed,
        listener_position: 'Stationary (0m)',
        car_distance_meters: (carX - 200).toFixed(0),
        measured_frequency_hz: Math.round(apparent),
        shift_percent: (((apparent - dopplerFreq) / dopplerFreq) * 100).toFixed(1) + '%'
      });

      if (carX >= 400) setIsPlaying(false);
    }
  }, [simStep, isPlaying, labId]);

  // Static telemetry triggers for slider adjusters
  useEffect(() => {
    if (isPlaying) return;

    // Vectors 2D
    if (labId === 'g11-vectors-2d') {
      const rad = (vecAngle * Math.PI) / 180;
      const vx = vecMagnitude * Math.cos(rad);
      const vy = vecMagnitude * Math.sin(rad);

      setLiveTelemetry({
        magnitude_units: vecMagnitude,
        angle_degrees: vecAngle,
        horizontal_component_vx: vx.toFixed(2),
        vertical_component_vy: vy.toFixed(2),
        calculation_formula_vx: `Vx = ${vecMagnitude} * cos(${vecAngle}°) = ${vx.toFixed(2)}`,
        calculation_formula_vy: `Vy = ${vecMagnitude} * sin(${vecAngle}°) = ${vy.toFixed(2)}`
      });
    }

    // Snell's Law Optics
    if (labId === 'g11-optics') {
      const radI = (opticsAngle * Math.PI) / 180;
      const sinR = (opticsN1 * Math.sin(radI)) / opticsN2;
      let angleRefracted = 0;
      let totalInternalReflection = false;

      if (sinR > 1.0) {
        totalInternalReflection = true;
      } else {
        angleRefracted = (Math.asin(sinR) * 180) / Math.PI;
      }

      const criticalAngle = opticsN2 > opticsN1 ? (Math.asin(opticsN1 / opticsN2) * 180) / Math.PI : null;

      setLiveTelemetry({
        medium_1_refractive_index: opticsN1,
        medium_2_refractive_index: opticsN2,
        angle_of_incidence_degrees: opticsAngle,
        angle_of_refraction_degrees: totalInternalReflection ? 'TIR (Reflected)' : angleRefracted.toFixed(2),
        total_internal_reflection_occurred: totalInternalReflection,
        calculated_critical_angle_degrees: criticalAngle ? criticalAngle.toFixed(2) : 'None (n1 >= n2)'
      });
    }

    // Boyle's Law Gas
    if (labId === 'g11-ideal-gases') {
      // PV = nRT -> P = nRT/V. Let nR = 8.314 * 0.05
      const nR = 0.4157;
      const pressureKpa = (nR * gasTemp) / (gasVolume / 1000); // V in Liters
      
      setLiveTelemetry({
        gas_volume_milliliters: gasVolume,
        gas_temperature_kelvin: gasTemp,
        calculated_pressure_kilopascals: pressureKpa.toFixed(1),
        product_pv_constant: (pressureKpa * (gasVolume / 1000)).toFixed(3)
      });
    }

    // Photoelectric effect
    if (labId === 'g12-optical-phenomena') {
      // E = hf = hc/lambda. hc = 1240 eV*nm
      const photonEnergyEv = 1240 / lightWavelength;
      const workFunctions = { cesium: 2.14, sodium: 2.36, zinc: 4.3 };
      const w0 = workFunctions[phototubeMetal];
      const maxKe = photonEnergyEv - w0;
      const isEjected = maxKe > 0;

      setLiveTelemetry({
        metal_cathode: phototubeMetal,
        work_function_ev: w0,
        incident_wavelength_nm: lightWavelength,
        incident_frequency_hz: ((3e8 / (lightWavelength * 1e-9)) / 1e12).toFixed(1) + ' THz',
        photon_energy_ev: photonEnergyEv.toFixed(2),
        photoelectrons_ejected: isEjected,
        max_electron_kinetic_energy_ev: isEjected ? maxKe.toFixed(2) : 0,
        current_signal_microamps: isEjected ? (lightIntensity * 0.4).toFixed(1) : 0
      });
    }

    // The Mole (Stoichiometry)
    if (labId === 'g10-stoichiometry-intro') {
      const molarMass = (carbonCount * 12.011) + (hydrogenCount * 1.008) + (oxygenCount * 15.999);
      const moles = moleSampleMass / molarMass;
      setLiveTelemetry({
        carbon_atoms: carbonCount,
        hydrogen_atoms: hydrogenCount,
        oxygen_atoms: oxygenCount,
        calculated_molar_mass_g_mol: molarMass.toFixed(2),
        sample_mass_grams: moleSampleMass,
        calculated_moles_n: moles.toFixed(3)
      });
    }

    // Aqueous Reactions
    if (labId === 'g10-aqueous-reactions') {
      let precipitate = 'None';
      if (solA === 'AgNO3' && solB === 'NaCl') precipitate = 'AgCl (White Precipitate)';
      else if (solA === 'BaCl2' && solB === 'Na2SO4') precipitate = 'BaSO4 (White Precipitate)';
      
      setLiveTelemetry({
        solution_A: solA,
        solution_B: solB,
        precipitate_formed: precipitate,
        reaction_type: precipitate !== 'None' ? 'Precipitation (Double Displacement)' : 'No Reaction'
      });
    }

    // Circuits Intro
    if (labId === 'g10-circuits') {
      let rEq = 0;
      if (circuitType === 'series') {
        rEq = circuitR1 + circuitR2;
      } else {
        rEq = 1 / ((1 / circuitR1) + (1 / circuitR2));
      }
      const totalI = circuitV / rEq;
      
      setLiveTelemetry({
        circuit_type: circuitType,
        source_voltage_V: circuitV,
        resistor_1_ohms: circuitR1,
        resistor_2_ohms: circuitR2,
        equivalent_resistance_ohms: rEq.toFixed(2),
        total_current_A: totalI.toFixed(2)
      });
    }

    // Quantitative Chem (Limiting Reactants: 2H2 + O2 -> 2H2O)
    if (labId === 'g11-quantitative') {
      const molesH2 = quantMassA / 2.016;
      const molesO2 = quantMassB / 31.998;
      const limiting = (molesH2 / 2) < molesO2 ? 'H2 (Hydrogen)' : 'O2 (Oxygen)';
      const h2oYield = limiting === 'H2 (Hydrogen)' ? molesH2 : (molesO2 * 2);
      
      setLiveTelemetry({
        mass_H2_g: quantMassA,
        mass_O2_g: quantMassB,
        moles_H2: molesH2.toFixed(3),
        moles_O2: molesO2.toFixed(3),
        limiting_reactant: limiting,
        theoretical_yield_H2O_mol: h2oYield.toFixed(3),
        theoretical_yield_H2O_g: (h2oYield * 18.015).toFixed(2)
      });
    }

    // Acids Bases (Titration of HCl with NaOH)
    if (labId === 'g11-acids-bases') {
      const initialVolA = 25; // mL of 0.1M HCl
      const concA = 0.1;
      const concB = 0.1; // NaOH
      const molesH = (initialVolA * concA) / 1000;
      const molesOH = (titrationVol * concB) / 1000;
      
      let pH = 1.0;
      if (titrationVol === 0) {
        pH = 1.0;
      } else if (molesH > molesOH) {
        const excessH = (molesH - molesOH);
        const totalVol = (initialVolA + titrationVol) / 1000;
        pH = -Math.log10(excessH / totalVol);
      } else if (molesH === molesOH) {
        pH = 7.0;
      } else {
        const excessOH = (molesOH - molesH);
        const totalVol = (initialVolA + titrationVol) / 1000;
        const pOH = -Math.log10(excessOH / totalVol);
        pH = 14 - pOH;
      }
      
      setLiveTelemetry({
        analyte_HCl_vol_mL: initialVolA,
        titrant_NaOH_added_mL: titrationVol,
        calculated_pH: pH.toFixed(2),
        equivalence_reached: titrationVol >= 25 ? 'Yes' : 'No'
      });
    }
  }, [
    labId, 
    isPlaying, 
    vecMagnitude, 
    vecAngle, 
    opticsAngle, 
    opticsN1, 
    opticsN2, 
    gasVolume, 
    gasTemp, 
    lightWavelength, 
    lightIntensity, 
    phototubeMetal
  ]);

  if (!lab) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
        <h2 className="text-lg font-bold text-slate-800">Lab guide loading error.</h2>
        <button onClick={() => navigate('/app/labs')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Back to Hub</button>
      </div>
    );
  }

  // Define Syllabus Guide metadata to show on the details pane

  const getGuide = () => {
    return guidesContent[lab.id] || {
      theory: `This module covers CAPS topics for ${lab.title}. Under the CAPS curriculum, this includes understanding core concepts, equations, and real-world industrial or laboratory systems.`,
      procedure: 'Configure variables in the left panel to run mock experiments and generate data for AI evaluation.',
      tech: `Tech integration for this lab generally involves PhET interactive HTML5 applets, Tracker video analysis, or smart device sensors (like Phyphox) to capture physical data in the classroom.`,
      formulas: ['n = m / M', 'C = n / V', 'pH = -log[H3O+]']
    };
  };

  const activeGuide = getGuide();

  // Mini quiz questions for fallback or general sections

  const activeQuiz = generalQuizzes[lab.id] || [
    {
      q: 'Which of the following is a fundamental physical science concept taught in this unit?',
      o: ['Analyzing variable parameters', 'Relying solely on guesswork', 'Ignoring data trends', 'Eliminating testing groups'],
      c: 0,
      exp: 'Analyzing variable parameters under controlled conditions is the core of scientific inquiry and CAPS practicals.'
    }
  ];

  const handleQuizAnswer = (index: number) => {
    setSelectedAnswerIndex(index);
    if (index === activeQuiz[activeQuestionIndex].c) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedAnswerIndex(null);
    if (activeQuestionIndex < activeQuiz.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
    } else {
      setQuizDone(true);
    }
  };

  const handleResetQuiz = () => {
    setActiveQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setQuizScore(0);
    setQuizDone(false);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:h-full">
      
      {/* ── LEFT PANEL: INTERACTIVE WIDGET / PLOTS ── */}
      <div className="lg:w-1/2 p-4 lg:p-6 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[420px] lg:min-h-0">
        
        {/* WIDGET CONTAINER */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl p-4 shadow-inner relative overflow-hidden min-h-[250px]">
          <div className="absolute top-2.5 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={() => {
                vibrate(15);
                shareContent({
                  title: `${lab.title} | VyLab Science Simulator`,
                  text: `Try out the ${lab.title} simulation on VyLab!`,
                });
              }}
              title="Share Lab Link"
              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                vibrate(20);
                toggleFullscreen();
              }}
              title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen View (F)'}
              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-blue-600" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Interactive Lab
            </span>
          </div>

          {/* Render Active Simulation Widget */}
          
          {/* 2. Motion in One Dimension */}
          {lab.id === 'g10-motion-1d' && (
            <div className="w-full text-center space-y-4">
              {/* Ball animation */}
              <div className="relative w-full h-12 bg-slate-100 border-y border-slate-200 rounded-lg overflow-hidden flex items-center">
                {/* Rolling ball */}
                <div 
                  className="w-6 h-6 bg-red-600 rounded-full shadow border-2 border-red-800 transition-all duration-200 absolute"
                  style={{ 
                    left: `${Math.min(95, Math.max(0, (parseFloat(liveTelemetry.current_position_meters || 0) * 1.5)))}%` 
                  }}
                />
                {/* Track mark */}
                <div className="absolute right-4 text-[9px] font-bold text-slate-400 font-mono">100m Track</div>
              </div>

              {/* Live readouts */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">Time</div>
                  <div className="text-sm font-bold font-mono">{liveTelemetry.elapsed_time_seconds || '0.0'} s</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">Position</div>
                  <div className="text-sm font-bold font-mono text-blue-600">{liveTelemetry.current_position_meters || '0.00'} m</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">Velocity</div>
                  <div className="text-sm font-bold font-mono text-emerald-600">{liveTelemetry.current_velocity_mps || '0.00'} m/s</div>
                </div>
              </div>

              {/* Recharts Plots */}
              {dataLog.length > 0 && (
                <div className="w-full h-28 text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dataLog}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="position" name="Pos (m)" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                      <Line type="monotone" dataKey="velocity" name="Vel (m/s)" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* 3. Conservation of Mechanical Energy */}
          {lab.id === 'g10-mechanical-energy' && (
            <div className="w-full text-center space-y-4">
              {/* Parabolic track display */}
              <div className="relative w-full h-24 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 200 100">
                  {/* The parabolic ramp */}
                  <path d="M 10 10 Q 100 90 190 10" fill="none" stroke="#64748b" strokeWidth="4" />
                  
                  {/* Dynamic skater node */}
                  {liveTelemetry.current_height_meters && (
                    <circle 
                      cx={100 + 90 * Math.sin((simStep * 0.15) % (Math.PI * 2))}
                      cy={10 + 80 * (1 - (parseFloat(liveTelemetry.current_height_meters) / skateHeight))}
                      r="6" 
                      fill="#e11d48" 
                      stroke="#4c0519" 
                      strokeWidth="2" 
                    />
                  )}
                </svg>
              </div>

              {/* Energy levels bar chart */}
              <div className="w-full h-28 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataLog.length > 0 ? [dataLog[dataLog.length - 1]] : [{ PE: 0, KE: 0, Total: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="step" hide />
                    <YAxis label={{ value: 'Energy (J)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="PE" name="Potential Energy (mgh)" fill="#3b82f6" />
                    <Bar dataKey="KE" name="Kinetic Energy (0.5mv²)" fill="#10b981" />
                    <Bar dataKey="Total" name="Total Mech Energy" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 4. Sound waves & frequency generator */}
          {lab.id === 'g10-waves-sound' && (
            <div className="w-full space-y-4">
              <canvas ref={canvasRef} width="350" height="150" className="w-full h-36 bg-slate-900 border border-slate-800 rounded-xl shadow" />
              <div className="flex justify-center gap-6 text-xs text-slate-500 font-semibold">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" /> Live Oscillator Wave</div>
                <div>Frequency: <span className="font-mono text-slate-800 font-bold">{waveFreq} Hz</span></div>
              </div>
            </div>
          )}

          {/* 5. 2D Vectors */}
          {lab.id === 'g11-vectors-2d' && (
            <div className="w-full flex flex-col items-center space-y-4">
              {/* SVG vector plane */}
              <div className="w-48 h-48 bg-slate-900 border border-slate-800 rounded-xl shadow relative">
                <svg className="w-full h-full" viewBox="-10 -10 120 120">
                  {/* Grid lines */}
                  <line x1="0" y1="100" x2="100" y2="100" stroke="#334155" strokeWidth="1" />
                  <line x1="0" y1="0" x2="0" y2="100" stroke="#334155" strokeWidth="1" />
                  
                  {/* Perpendicular Component vector arrows */}
                  {liveTelemetry.horizontal_component_vx && (
                    <>
                      {/* Vx arrow */}
                      <line x1="0" y1="100" x2={parseFloat(liveTelemetry.horizontal_component_vx)} y2="100" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3,3" />
                      {/* Vy arrow */}
                      <line x1={parseFloat(liveTelemetry.horizontal_component_vx)} y1="100" x2={parseFloat(liveTelemetry.horizontal_component_vx)} y2={100 - parseFloat(liveTelemetry.vertical_component_vy)} stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="3,3" />
                      {/* Resultant Vector arrow */}
                      <line x1="0" y1="100" x2={parseFloat(liveTelemetry.horizontal_component_vx)} y2={100 - parseFloat(liveTelemetry.vertical_component_vy)} stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow)" />
                    </>
                  )}
                  {/* Angle arc */}
                  <path d="M 15 100 A 15 15 0 0 0 12.8 89.3" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Trigonometric Output table */}
              <div className="w-full grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-50 border p-2 rounded-lg">
                  <span className="text-red-500 font-bold">Vx</span> = {liveTelemetry.horizontal_component_vx} units
                </div>
                <div className="bg-slate-50 border p-2 rounded-lg">
                  <span className="text-blue-500 font-bold">Vy</span> = {liveTelemetry.vertical_component_vy} units
                </div>
              </div>
            </div>
          )}

          {/* 6. Newton's Second Law */}
          {lab.id === 'g11-newton-laws' && (
            <div className="w-full text-center space-y-4">
              {/* Acceleration Animation */}
              <div className="relative w-full h-16 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center">
                {/* Track line */}
                <div className="w-full h-1 bg-slate-800 absolute bottom-4" />
                
                {/* Pulley pulley */}
                <div className="w-4 h-4 bg-slate-600 rounded-full absolute right-4 bottom-4" />

                {/* Trolley */}
                <div 
                  className="w-12 h-6 bg-orange-100 border border-orange-500 rounded-lg absolute bottom-5 flex items-center justify-center text-[10px] font-bold text-orange-900 transition-all duration-200"
                  style={{ 
                    left: `${Math.min(75, Math.max(0, (parseFloat(liveTelemetry.distance_traveled_meters || 0) * 12)))}%` 
                  }}
                >
                  {newtonMass.toFixed(1)}kg
                </div>

                {/* Pulling string */}
                <div className="h-[2px] bg-slate-400 absolute bottom-7 left-0 right-4 z-0" />
              </div>

              {/* Live graphs */}
              {dataLog.length > 0 && (
                <div className="w-full h-28 text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dataLog}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="velocity" name="Vel (m/s)" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* 7. Snell's Law Optics */}
          {lab.id === 'g11-optics' && (
            <div className="w-full flex flex-col items-center space-y-4">
              <div className="w-48 h-48 bg-slate-900 border border-slate-800 rounded-xl shadow relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="-10 -10 120 120">
                  {/* Medium 2 Block */}
                  <rect x="0" y="50" width="100" height="50" fill="#38bdf8" fillOpacity="0.25" stroke="#0284c7" strokeWidth="1" />
                  
                  {/* Normal Line */}
                  <line x1="50" y1="10" x2="50" y2="90" stroke="#64748b" strokeWidth="1" strokeDasharray="4,4" />

                  {/* Text descriptions */}
                  <text x="5" y="20" fill="#94a3b8" fontSize="8">n1 = {opticsN1.toFixed(1)} (Air)</text>
                  <text x="5" y="80" fill="#0ea5e9" fontSize="8">n2 = {opticsN2.toFixed(2)} (Glass)</text>

                  {/* Incident light beam */}
                  {(() => {
                    const radI = (opticsAngle * Math.PI) / 180;
                    const sinR = (opticsN1 * Math.sin(radI)) / opticsN2;
                    let angleRefracted = 0;
                    let tir = false;

                    if (sinR > 1.0) tir = true;
                    else angleRefracted = (Math.asin(sinR) * 180) / Math.PI;

                    const startX = 50 - 40 * Math.sin(radI);
                    const startY = 50 - 40 * Math.cos(radI);
                    
                    const radR = (angleRefracted * Math.PI) / 180;
                    const endX = tir ? (50 + 40 * Math.sin(radI)) : (50 + 40 * Math.sin(radR));
                    const endY = tir ? (50 - 40 * Math.cos(radI)) : (50 + 40 * Math.cos(radR));

                    return (
                      <>
                        {/* Incident beam (Red laser) */}
                        <line x1={startX} y1={startY} x2="50" y2="50" stroke="#ef4444" strokeWidth="2.5" />
                        {/* Refracted beam */}
                        <line x1="50" y1="50" x2={endX} y2={endY} stroke={tir ? "#ef4444" : "#10b981"} strokeWidth="2.5" />
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Snell readout */}
              <div className="w-full text-center text-xs bg-slate-50 border p-2.5 rounded-lg space-y-1">
                <div>Refracted Angle: <span className="font-bold font-mono text-emerald-600">{liveTelemetry.angle_of_refraction_degrees}°</span></div>
                {liveTelemetry.calculated_critical_angle_degrees !== 'None (n1 >= n2)' && (
                  <div className="text-[10px] text-slate-400 font-semibold">Critical Angle for Interface: {liveTelemetry.calculated_critical_angle_degrees}°</div>
                )}
              </div>
            </div>
          )}

          {/* 8. Boyle's Law Gas Syringe */}
          {lab.id === 'g11-ideal-gases' && (
            <div className="w-full text-center space-y-4">
              <div className="flex items-center justify-center gap-6">
                {/* SVG Syringe */}
                <div className="relative w-40 h-16 bg-slate-100 border-y-2 border-r-2 border-slate-400 rounded-r-lg flex items-center justify-start p-1">
                  {/* Piston plunger */}
                  <div 
                    className="h-full bg-slate-300 border-r-2 border-slate-500 rounded-l absolute left-0 transition-all duration-300"
                    style={{ width: `${100 - gasVolume}%` }}
                  />
                  {/* Chamber displaying gas gas */}
                  <div 
                    className="h-full bg-cyan-200/40 rounded-r absolute right-0 transition-all duration-300"
                    style={{ width: `${gasVolume}%` }}
                  >
                    {/* Bouncing nodes representing gas particles */}
                    <div className="w-full h-full flex flex-wrap gap-1.5 justify-center items-center p-1.5 overflow-hidden animate-pulse">
                      {[...Array(Math.min(10, Math.floor(gasVolume/6)))].map((_, i) => (
                        <div key={i} className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce shadow border border-cyan-600" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pressure Gauge */}
                <div className="bg-slate-900 text-cyan-400 font-mono p-4 rounded-xl border border-slate-800 text-2xl shadow">
                  {liveTelemetry.calculated_pressure_kilopascals || '101.3'} kPa
                  <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
                    Pressure (PV={liveTelemetry.product_pv_constant})
                  </div>
                </div>
              </div>

              {/* Isotherm P vs V graph representation */}
              <div className="text-[10px] text-slate-500 font-bold text-center mt-1">
                Decreasing volume increases gas collision frequency with syringe walls, multiplying pressure.
              </div>
            </div>
          )}

          {/* 9. Intermolecular forces evaporation */}
          {lab.id === 'g11-intermolecular' && (
            <div className="w-full space-y-4">
              {/* Three test tubes evaporating */}
              <div className="flex justify-around items-end h-28 bg-slate-50 border border-slate-200 rounded-xl p-4">
                {/* Water Tube */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-20 bg-slate-200 border-2 border-slate-400 rounded-b-full flex flex-col justify-end p-0.5 relative overflow-hidden">
                    <div className="bg-blue-400 w-full transition-all duration-300 rounded-b-full" style={{ height: `${evapLevels.water}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 mt-2">Water (H-Bond)</span>
                </div>

                {/* Ethanol Tube */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-20 bg-slate-200 border-2 border-slate-400 rounded-b-full flex flex-col justify-end p-0.5 relative overflow-hidden">
                    <div className="bg-teal-400 w-full transition-all duration-300 rounded-b-full" style={{ height: `${evapLevels.ethanol}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 mt-2">Ethanol (H-Bond)</span>
                </div>

                {/* Acetone Tube */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-20 bg-slate-200 border-2 border-slate-400 rounded-b-full flex flex-col justify-end p-0.5 relative overflow-hidden">
                    <div className="bg-indigo-400 w-full transition-all duration-300 rounded-b-full" style={{ height: `${evapLevels.acetone}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 mt-2">Acetone (Dipole)</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-bold text-center">
                Acetone evaporates fastest due to weak dipole-dipole forces compared to water's strong hydrogen bonding networks.
              </div>
            </div>
          )}

          {/* 10. Conservation of Momentum */}
          {lab.id === 'g12-momentum' && (
            <div className="w-full text-center space-y-4">
              <div className="relative w-full h-16 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center">
                {/* Track line */}
                <div className="w-full h-1 bg-slate-800 absolute bottom-4" />

                {/* Trolley 1 */}
                <div 
                  className="w-14 h-8 bg-blue-100 border border-blue-500 rounded-lg absolute bottom-5 flex flex-col items-center justify-center text-[8px] font-bold text-blue-900 transition-all duration-200"
                  style={{ 
                    left: isPlaying ? '35%' : simStep >= 15 ? '42%' : '15%'
                  }}
                >
                  <div>Cart 1</div>
                  <div>{momM1}kg · {momV1}m/s</div>
                </div>

                {/* Trolley 2 */}
                <div 
                  className="w-14 h-8 bg-rose-100 border border-rose-500 rounded-lg absolute bottom-5 flex flex-col items-center justify-center text-[8px] font-bold text-rose-900 transition-all duration-200"
                  style={{ 
                    left: isPlaying ? '55%' : simStep >= 15 ? '57%' : '75%'
                  }}
                >
                  <div>Cart 2</div>
                  <div>{momM2}kg · {momV2}m/s</div>
                </div>
              </div>

              {/* Momentum Table values */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-50 border p-2 rounded-lg text-left">
                  <div className="font-bold text-blue-700">Initial total momentum:</div>
                  <div>{liveTelemetry.initial_total_momentum_kg_mps || '4.00'} kg·m/s</div>
                </div>
                <div className="bg-slate-50 border p-2 rounded-lg text-left">
                  <div className="font-bold text-emerald-700">Final total momentum:</div>
                  <div>{liveTelemetry.final_total_momentum_kg_mps || '4.00'} kg·m/s</div>
                </div>
              </div>
            </div>
          )}

          {/* 11. Doppler Effect */}
          {lab.id === 'g12-doppler' && (
            <div className="w-full text-center space-y-4">
              <div className="relative w-full h-16 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center">
                {/* Station listener */}
                <div className="absolute left-1/2 -translate-x-1/2 text-2xl z-10">🧍</div>

                {/* Emitting car */}
                <div 
                  className="absolute text-xl z-20 transition-all duration-200"
                  style={{ 
                    left: `${(simStep * 10) / 4}%` 
                  }}
                >
                  🚒
                </div>
                {/* Sound wave concentric lines */}
                {isPlaying && (
                  <div className="absolute w-12 h-12 border-2 border-red-500 rounded-full animate-ping opacity-60" style={{ left: `${(simStep * 10) / 4}%` }} />
                )}
              </div>

              {/* Doppler chart */}
              {dataLog.length > 0 && (
                <div className="w-full h-24 text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dataLog}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="distance" hide />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip />
                      <Line type="monotone" dataKey="frequency" name="Apparent Freq (Hz)" stroke="#818cf8" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* 12. Photoelectric Effect */}
          {lab.id === 'g12-optical-phenomena' && (
            <div className="w-full text-center space-y-4">
              <div className="relative w-full h-20 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-between p-3">
                {/* Anode plate light shines on */}
                <div className="w-4 h-full bg-slate-500 rounded" />

                {/* Ejected photoelectrons */}
                {liveTelemetry.photoelectrons_ejected === true && (
                  <div className="flex-1 flex justify-around items-center h-full text-xs animate-pulse">
                    <span className="text-yellow-400 animate-ping">⚡ e⁻</span>
                    <span className="text-yellow-400 animate-ping">⚡ e⁻</span>
                    <span className="text-yellow-400 animate-ping">⚡ e⁻</span>
                  </div>
                )}
                {liveTelemetry.photoelectrons_ejected === false && (
                  <div className="flex-1 text-[9px] text-slate-500 font-semibold">No emission (photon energy &lt; work function)</div>
                )}

                {/* Cathode current collector */}
                <div className="w-4 h-full bg-yellow-600 rounded shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
              </div>

              {/* Live reads */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-2.5 rounded-lg border">
                <div>Photon Energy: <span className="font-bold text-indigo-600">{liveTelemetry.photon_energy_ev} eV</span></div>
                <div>Max KE: <span className="font-bold text-amber-600">{liveTelemetry.max_electron_kinetic_energy_ev} eV</span></div>
              </div>
            </div>
          )}

          {/* 13. The Mole */}
          {lab.id === 'g10-stoichiometry-intro' && (
            <div className="w-full text-center space-y-4">
              <div className="text-4xl font-bold bg-slate-900 text-emerald-400 p-6 rounded-xl border-4 border-slate-700 shadow-inner flex items-center justify-center gap-1 font-mono">
                C<sub className="text-xl text-slate-400">{carbonCount}</sub>H<sub className="text-xl text-slate-400">{hydrogenCount}</sub>{oxygenCount > 0 && <>O<sub className="text-xl text-slate-400">{oxygenCount}</sub></>}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-2.5 rounded-lg border">
                <div>Molar Mass (M): <span className="font-bold text-blue-600">{liveTelemetry.calculated_molar_mass_g_mol} g/mol</span></div>
                <div>Moles (n): <span className="font-bold text-amber-600">{liveTelemetry.calculated_moles_n} mol</span></div>
              </div>
            </div>
          )}

          {/* 14. Aqueous Reactions */}
          {lab.id === 'g10-aqueous-reactions' && (
            <div className="w-full text-center space-y-4">
              <div className="flex items-center justify-center gap-4 bg-slate-100 p-6 rounded-xl border border-slate-300">
                <div className="w-16 h-20 bg-blue-200/50 rounded-b-xl border-2 border-slate-400 flex items-center justify-center font-bold text-[10px] shadow-inner text-blue-900">{solA}(aq)</div>
                <div className="text-2xl font-bold text-slate-400">+</div>
                <div className="w-16 h-20 bg-teal-200/50 rounded-b-xl border-2 border-slate-400 flex items-center justify-center font-bold text-[10px] shadow-inner text-teal-900">{solB}(aq)</div>
              </div>
              <div className={`p-3 rounded-lg border font-bold text-xs transition-colors ${liveTelemetry.precipitate_formed === 'None' ? 'bg-slate-50 text-slate-500' : 'bg-red-50 text-red-700 border-red-300 shadow-sm'}`}>
                {liveTelemetry.precipitate_formed === 'None' ? 'No Precipitate Formed (Aqueous Products)' : `↓ ${liveTelemetry.precipitate_formed}`}
              </div>
            </div>
          )}

          {/* 15. Circuits */}
          {lab.id === 'g10-circuits' && (
            <div className="w-full text-center space-y-4">
              <div className="h-32 bg-slate-900 border-2 border-slate-800 rounded-xl flex items-center justify-center p-4 relative shadow-inner">
                {circuitType === 'series' ? (
                  <div className="w-4/5 h-16 border-2 border-amber-500 rounded-lg flex items-center justify-around relative">
                    <div className="absolute -left-3 bg-red-500 text-white text-[8px] px-1 font-bold rounded">Battery {circuitV}V</div>
                    <div className="bg-slate-800 w-8 h-4 border border-slate-600 rounded text-[9px] text-slate-300 flex items-center justify-center font-bold">R1</div>
                    <div className="bg-slate-800 w-8 h-4 border border-slate-600 rounded text-[9px] text-slate-300 flex items-center justify-center font-bold">R2</div>
                  </div>
                ) : (
                  <div className="w-3/5 h-20 border-2 border-amber-500 rounded-lg flex flex-col items-center justify-around relative">
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[8px] px-1 font-bold rounded">Battery {circuitV}V</div>
                    <div className="w-full h-0 border-t-2 border-amber-500 absolute top-1/2 -translate-y-1/2" />
                    <div className="bg-slate-800 w-8 h-4 border border-slate-600 rounded text-[9px] text-slate-300 flex items-center justify-center z-10 -mt-2 font-bold">R1</div>
                    <div className="bg-slate-800 w-8 h-4 border border-slate-600 rounded text-[9px] text-slate-300 flex items-center justify-center z-10 mt-2 font-bold">R2</div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-2.5 rounded-lg border">
                <div>Eq Resistance: <span className="font-bold text-indigo-600">{liveTelemetry.equivalent_resistance_ohms} Ω</span></div>
                <div>Total Current: <span className="font-bold text-emerald-600">{liveTelemetry.total_current_A} A</span></div>
              </div>
            </div>
          )}

          {/* 16. Quantitative Chem (Limiting Reactants) */}
          {lab.id === 'g11-quantitative' && (
            <div className="w-full text-center space-y-4">
              <div className="flex items-center justify-center gap-4 bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-inner">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-300 font-bold text-xs">{quantMassA}g</div>
                  <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Hydrogen</span>
                </div>
                <div className="text-xl font-bold text-slate-500">+</div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-300 font-bold text-xs">{quantMassB}g</div>
                  <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Oxygen</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-2.5 rounded-lg border">
                <div>Limiting: <span className="font-bold text-rose-600">{liveTelemetry.limiting_reactant}</span></div>
                <div>H2O Yield: <span className="font-bold text-emerald-600">{liveTelemetry.theoretical_yield_H2O_g} g</span></div>
              </div>
            </div>
          )}

          {/* 17. Acids and Bases (Titration) */}
          {lab.id === 'g11-acids-bases' && (
            <div className="w-full text-center space-y-4">
              <div className="flex justify-center items-center h-32 bg-slate-50 rounded-xl border border-slate-200 relative">
                {/* Burette */}
                <div className="absolute top-2 w-4 h-20 border-2 border-slate-400 rounded-b flex flex-col justify-end bg-slate-100 overflow-hidden">
                  <div className="w-full bg-slate-300" style={{ height: `${100 - (titrationVol / 50) * 100}%` }} />
                </div>
                {/* Flask */}
                <div className="absolute bottom-2 w-16 h-16 border-2 border-slate-400 rounded-b-full rounded-t-lg bg-slate-100/50 flex flex-col justify-end overflow-hidden shadow-inner">
                  <div className={`w-full transition-colors duration-500 ${parseFloat(liveTelemetry.calculated_pH) >= 7 ? 'bg-pink-300' : 'bg-slate-200'}`} style={{ height: `${40 + (titrationVol / 50) * 60}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900 text-slate-300 p-2.5 rounded-lg shadow-inner">
                <div>NaOH added: <span className="font-bold text-blue-400">{titrationVol} mL</span></div>
                <div>pH: <span className={`font-bold ${parseFloat(liveTelemetry.calculated_pH) < 7 ? 'text-red-400' : parseFloat(liveTelemetry.calculated_pH) > 7 ? 'text-purple-400' : 'text-emerald-400'}`}>{liveTelemetry.calculated_pH}</span></div>
              </div>
            </div>
          )}

          {/* 18. General Falling Workbook Quiz / fallbacks */}
          {![
            'g10-heating-curves', 'g10-motion-1d', 'g10-mechanical-energy', 'g10-waves-sound',
            'g11-vectors-2d', 'g11-newton-laws', 'g11-optics', 'g11-ideal-gases', 'g11-intermolecular',
            'g12-momentum', 'g12-doppler', 'g12-optical-phenomena',
            'g10-stoichiometry-intro', 'g10-aqueous-reactions', 'g10-circuits',
            'g11-quantitative', 'g11-acids-bases'
          ].includes(lab.id) && (
            <div className="w-full space-y-3">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Info className="w-4 h-4 text-blue-500" />
                CAPS Interactive Review
              </h4>
              
              {!quizDone ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Question {activeQuestionIndex + 1} of {activeQuiz.length}</div>
                  <p className="text-xs font-bold leading-relaxed">{activeQuiz[activeQuestionIndex].q}</p>
                  
                  <div className="space-y-1.5 mt-2">
                    {activeQuiz[activeQuestionIndex].o.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => selectedAnswerIndex === null && handleQuizAnswer(oIdx)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-medium border transition-colors flex justify-between items-center ${
                          selectedAnswerIndex === oIdx
                            ? oIdx === activeQuiz[activeQuestionIndex].c
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-red-50 border-red-300 text-red-800'
                            : selectedAnswerIndex !== null && oIdx === activeQuiz[activeQuestionIndex].c
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedAnswerIndex === oIdx && (
                          oIdx === activeQuiz[activeQuestionIndex].c 
                            ? <Check className="w-4 h-4 text-emerald-500" /> 
                            : <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </button>
                    ))}
                  </div>

                  {selectedAnswerIndex !== null && (
                    <div className="text-[10px] text-slate-500 bg-slate-100 p-2 rounded border mt-2">
                      <span className="font-bold text-slate-700">Explanation:</span> {activeQuiz[activeQuestionIndex].exp}
                      <button 
                        onClick={handleNextQuizQuestion}
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition"
                      >
                        Next Question
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl text-center space-y-3">
                  <div className="text-3xl">🏆</div>
                  <h5 className="font-bold text-sm">Review Quiz Completed!</h5>
                  <p className="text-xs">You scored <span className="font-bold">{quizScore} / {activeQuiz.length}</span> correct answers.</p>
                  <button 
                    onClick={handleResetQuiz}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded-xl text-xs transition"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── CONTROLS PANEL ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-5 mt-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Experiment Parameters</h3>
            
            {/* Play controls if simulation widget uses ticks */}
            {[
              'g10-heating-curves', 'g10-motion-1d', 'g10-mechanical-energy', 'g10-waves-sound',
              'g11-newton-laws', 'g11-intermolecular', 'g12-momentum', 'g12-doppler'
            ].includes(lab.id) && (
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
                    <>
                      <Pause className="w-3.5 h-3.5" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> Run Sim
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setSimStep(0);
                    setDataLog([]);
                    setEvapLevels({ water: 100, ethanol: 100, acetone: 100 });
                  }}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Dynamic Sliders based on active lab.id */}
          <div className="space-y-4">
            
            {/* 2. Motion in 1D */}
            {lab.id === 'g10-motion-1d' && (
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Initial Velocity (v₀) <span className="font-mono text-blue-600 font-bold">{initVelocity} m/s</span>
                  </label>
                  <input type="range" min="-5" max="10" value={initVelocity} onChange={e => setInitVelocity(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Acceleration (a) <span className="font-mono text-emerald-600 font-bold">{acceleration} m/s²</span>
                  </label>
                  <input type="range" min="-3" max="5" value={acceleration} onChange={e => setAcceleration(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
            )}

            {/* 3. Skate Ramp Mechanical Energy */}
            {lab.id === 'g10-mechanical-energy' && (
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Drop Height (h) <span className="font-mono text-blue-600 font-bold">{skateHeight} m</span>
                  </label>
                  <input type="range" min="2" max="10" value={skateHeight} onChange={e => setSkateHeight(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Skater Mass (m) <span className="font-mono text-emerald-600 font-bold">{skateMass} kg</span>
                  </label>
                  <input type="range" min="10" max="120" value={skateMass} onChange={e => setSkateMass(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
            )}

            {/* 4. Waves & Sound Oscillator */}
            {lab.id === 'g10-waves-sound' && (
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Frequency (f) <span className="font-mono text-blue-600 font-bold">{waveFreq} Hz</span>
                  </label>
                  <input type="range" min="100" max="1000" step="10" value={waveFreq} onChange={e => setWaveFreq(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Amplitude (A) <span className="font-mono text-emerald-600 font-bold">{waveAmp} units</span>
                  </label>
                  <input type="range" min="1" max="12" value={waveAmp} onChange={e => setWaveAmp(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
            )}

            {/* 5. Vectors 2D Component resolver */}
            {lab.id === 'g11-vectors-2d' && (
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Vector Magnitude (R) <span className="font-mono text-blue-600 font-bold">{vecMagnitude} units</span>
                  </label>
                  <input type="range" min="10" max="100" value={vecMagnitude} onChange={e => setVecMagnitude(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Polar Angle (θ) <span className="font-mono text-emerald-600 font-bold">{vecAngle}°</span>
                  </label>
                  <input type="range" min="0" max="90" value={vecAngle} onChange={e => setVecAngle(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
            )}

            {/* 6. Newton's Second Law acceleration */}
            {lab.id === 'g11-newton-laws' && (
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Pulling Force (F) <span className="font-mono text-blue-600 font-bold">{newtonForce} N</span>
                  </label>
                  <input type="range" min="1" max="25" step="0.5" value={newtonForce} onChange={e => setNewtonForce(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Trolley Mass (m) <span className="font-mono text-emerald-600 font-bold">{newtonMass} kg</span>
                  </label>
                  <input type="range" min="0.5" max="5.0" step="0.1" value={newtonMass} onChange={e => setNewtonMass(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
            )}

            {/* 7. Snell's Law block tracing */}
            {lab.id === 'g11-optics' && (
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Incident Laser Angle (θi) <span className="font-mono text-blue-600 font-bold">{opticsAngle}°</span>
                  </label>
                  <input type="range" min="0" max="90" value={opticsAngle} onChange={e => setOpticsAngle(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Block Material Refractive Index (n₂) <span className="font-mono text-emerald-600 font-bold">{opticsN2.toFixed(2)}</span>
                  </label>
                  <input type="range" min="1.0" max="2.5" step="0.05" value={opticsN2} onChange={e => setOpticsN2(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
            )}

            {/* 8. Boyle's Law syringe */}
            {lab.id === 'g11-ideal-gases' && (
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Syringe Chamber Volume (V) <span className="font-mono text-blue-600 font-bold">{gasVolume} mL</span>
                  </label>
                  <input type="range" min="10" max="100" value={gasVolume} onChange={e => setGasVolume(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Gas Chamber Temperature (T) <span className="font-mono text-emerald-600 font-bold">{gasTemp} K</span>
                  </label>
                  <input type="range" min="150" max="500" value={gasTemp} onChange={e => setGasTemp(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
            )}

            {/* 9. Intermolecular Forces ambient temperature */}
            {lab.id === 'g11-intermolecular' && (
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Evaporator Temperature <span className="font-mono text-blue-600 font-bold">{imfTemp}°C</span>
                  </label>
                  <input type="range" min="15" max="65" value={imfTemp} onChange={e => setImfTemp(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
            )}

            {/* 10. Conservation of Momentum */}
            {lab.id === 'g12-momentum' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button 
                    onClick={() => setCollisionType('elastic')}
                    className={`p-1.5 rounded-lg font-bold border transition ${collisionType === 'elastic' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-slate-50 text-slate-600'}`}
                  >
                    Elastic (Bouncy)
                  </button>
                  <button 
                    onClick={() => setCollisionType('inelastic')}
                    className={`p-1.5 rounded-lg font-bold border transition ${collisionType === 'inelastic' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-slate-50 text-slate-600'}`}
                  >
                    Inelastic (Stick)
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Cart 1 Mass (kg)</label>
                    <input type="number" min="0.5" max="10" step="0.5" value={momM1} onChange={e => setMomM1(Number(e.target.value))} className="w-full bg-slate-50 border p-1 rounded font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Cart 2 Mass (kg)</label>
                    <input type="number" min="0.5" max="10" step="0.5" value={momM2} onChange={e => setMomM2(Number(e.target.value))} className="w-full bg-slate-50 border p-1 rounded font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Cart 1 Speed (m/s)</label>
                    <input type="number" min="0" max="10" step="1" value={momV1} onChange={e => setMomV1(Number(e.target.value))} className="w-full bg-slate-50 border p-1 rounded font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Cart 2 Speed (m/s)</label>
                    <input type="number" min="-10" max="0" step="1" value={momV2} onChange={e => setMomV2(Number(e.target.value))} className="w-full bg-slate-50 border p-1 rounded font-mono text-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* 11. Doppler Effect */}
            {lab.id === 'g12-doppler' && (
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Siren Frequency (f_S) <span className="font-mono text-blue-600 font-bold">{dopplerFreq} Hz</span>
                  </label>
                  <input type="range" min="300" max="800" step="10" value={dopplerFreq} onChange={e => setDopplerFreq(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Vehicle Velocity (v_S) <span className="font-mono text-emerald-600 font-bold">{dopplerSpeed} m/s</span>
                  </label>
                  <input type="range" min="0" max="80" value={dopplerSpeed} onChange={e => setDopplerSpeed(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
            )}

            {/* 12. Photoelectric Effect */}
            {lab.id === 'g12-optical-phenomena' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                  {['cesium', 'sodium', 'zinc'].map(metal => (
                    <button 
                      key={metal}
                      onClick={() => setPhototubeMetal(metal as any)}
                      className={`p-1 rounded border capitalize transition ${phototubeMetal === metal ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-slate-50 text-slate-600'}`}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Light Wavelength (λ) <span className="font-mono text-blue-600 font-bold">{lightWavelength} nm</span>
                  </label>
                  <input type="range" min="200" max="750" value={lightWavelength} onChange={e => setLightWavelength(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Light Intensity <span className="font-mono text-emerald-600 font-bold">{lightIntensity}%</span>
                  </label>
                  <input type="range" min="10" max="100" value={lightIntensity} onChange={e => setLightIntensity(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
            )}

            {/* 13. The Mole */}
            {lab.id === 'g10-stoichiometry-intro' && (
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Carbon Atoms (C) <span className="font-mono text-blue-600 font-bold">{carbonCount}</span>
                  </label>
                  <input type="range" min="0" max="10" value={carbonCount} onChange={e => setCarbonCount(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Hydrogen Atoms (H) <span className="font-mono text-emerald-600 font-bold">{hydrogenCount}</span>
                  </label>
                  <input type="range" min="0" max="22" value={hydrogenCount} onChange={e => setHydrogenCount(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Oxygen Atoms (O) <span className="font-mono text-rose-600 font-bold">{oxygenCount}</span>
                  </label>
                  <input type="range" min="0" max="10" value={oxygenCount} onChange={e => setOxygenCount(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Sample Mass <span className="font-mono text-amber-600 font-bold">{moleSampleMass} g</span>
                  </label>
                  <input type="range" min="1" max="100" value={moleSampleMass} onChange={e => setMoleSampleMass(Number(e.target.value))} className="w-full accent-amber-600" />
                </div>
              </div>
            )}

            {/* 14. Aqueous Reactions */}
            {lab.id === 'g10-aqueous-reactions' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                  <div className="col-span-3 text-xs text-slate-700">Solution A:</div>
                  {['AgNO3', 'NaCl', 'BaCl2'].map(sol => (
                    <button 
                      key={sol}
                      onClick={() => setSolA(sol as any)}
                      className={`p-1 rounded border transition ${solA === sol ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-slate-50 text-slate-600'}`}
                    >
                      {sol}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold mt-2">
                  <div className="col-span-3 text-xs text-slate-700">Solution B:</div>
                  {['NaCl', 'Na2SO4', 'KNO3'].map(sol => (
                    <button 
                      key={sol}
                      onClick={() => setSolB(sol as any)}
                      className={`p-1 rounded border transition ${solB === sol ? 'bg-teal-100 text-teal-800 border-teal-200' : 'bg-slate-50 text-slate-600'}`}
                    >
                      {sol}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 15. Circuits */}
            {lab.id === 'g10-circuits' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs font-bold mb-3">
                  <button onClick={() => setCircuitType('series')} className={`p-2 rounded border ${circuitType === 'series' ? 'bg-indigo-100 border-indigo-300 text-indigo-800' : 'bg-slate-50 text-slate-600'}`}>Series Circuit</button>
                  <button onClick={() => setCircuitType('parallel')} className={`p-2 rounded border ${circuitType === 'parallel' ? 'bg-indigo-100 border-indigo-300 text-indigo-800' : 'bg-slate-50 text-slate-600'}`}>Parallel Circuit</button>
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Voltage (V) <span className="font-mono text-red-600 font-bold">{circuitV} V</span>
                  </label>
                  <input type="range" min="1" max="24" value={circuitV} onChange={e => setCircuitV(Number(e.target.value))} className="w-full accent-red-600" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Resistor 1 (R1) <span className="font-mono text-slate-600 font-bold">{circuitR1} Ω</span>
                  </label>
                  <input type="range" min="1" max="100" value={circuitR1} onChange={e => setCircuitR1(Number(e.target.value))} className="w-full accent-slate-600" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    Resistor 2 (R2) <span className="font-mono text-slate-600 font-bold">{circuitR2} Ω</span>
                  </label>
                  <input type="range" min="1" max="100" value={circuitR2} onChange={e => setCircuitR2(Number(e.target.value))} className="w-full accent-slate-600" />
                </div>
              </div>
            )}

            {/* 16. Quantitative Chem (Limiting Reactants) */}
            {lab.id === 'g11-quantitative' && (
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    H2 Mass (g) <span className="font-mono text-blue-600 font-bold">{quantMassA} g</span>
                  </label>
                  <input type="range" min="1" max="50" value={quantMassA} onChange={e => setQuantMassA(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    O2 Mass (g) <span className="font-mono text-red-600 font-bold">{quantMassB} g</span>
                  </label>
                  <input type="range" min="1" max="100" value={quantMassB} onChange={e => setQuantMassB(Number(e.target.value))} className="w-full accent-red-600" />
                </div>
              </div>
            )}

            {/* 17. Acids and Bases (Titration) */}
            {lab.id === 'g11-acids-bases' && (
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    0.1M NaOH Added (Titrant) <span className="font-mono text-purple-600 font-bold">{titrationVol} mL</span>
                  </label>
                  <input type="range" min="0" max="50" step="0.5" value={titrationVol} onChange={e => setTitrationVol(Number(e.target.value))} className="w-full accent-purple-600" />
                </div>
                <div className="text-[10px] text-slate-500 font-bold text-center">Analyte: 25mL of 0.1M HCl</div>
              </div>
            )}

            {/* Fallbacks or non-sim topics (e.g. atomic structure calculations, etc.) */}
            {![
              'g10-heating-curves', 'g10-motion-1d', 'g10-mechanical-energy', 'g10-waves-sound',
              'g11-vectors-2d', 'g11-newton-laws', 'g11-optics', 'g11-ideal-gases', 'g11-intermolecular',
              'g12-momentum', 'g12-doppler', 'g12-optical-phenomena',
              'g10-stoichiometry-intro', 'g10-aqueous-reactions', 'g10-circuits',
              'g11-quantitative', 'g11-acids-bases'
            ].includes(lab.id) && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-widest text-[9px] block">Concept Workbook Parameters</span>
                <p className="text-slate-500">Configure parameters to study chemical structures, reactions, and formula properties.</p>
                <div className="flex justify-center mt-2.5">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full flex items-center gap-1">
                    <Activity className="w-3 h-3 animate-pulse" /> Active Guide Mode
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: EDUCATIONAL GUIDE / TECH INTEGRATIONS ── */}
      <div className="lg:w-1/2 flex flex-col justify-between lg:overflow-y-auto bg-white">
        <div className="p-4 lg:p-6 space-y-6">
          
          {/* Section 1: CAPS Theory & Concepts */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              CAPS Scientific Theory
            </h3>
            <div className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 font-medium">
              <RichText content={activeGuide.theory} />
            </div>
          </div>

          {/* Section 2: Laboratory Formula Sheet */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-slate-500" />
              Reference Formulas & Equations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {activeGuide.formulas.map((formula, idx) => (
                <div key={idx} className="bg-slate-50/80 border border-slate-200 p-2.5 rounded-lg text-slate-700 font-bold flex justify-between items-center">
                  <RichText content={formula} className="text-center w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Smart Tech & Smartphone Integrations (Phyphox, Tracker, etc.) */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-4 rounded-xl space-y-3 shadow-xs">
            <h4 className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-indigo-600 shrink-0 animate-bounce" />
              Smartphone Sensor & Free Tech Integration
            </h4>
            <p className="text-[11px] text-indigo-950 leading-relaxed font-semibold">
              {activeGuide.tech}
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[9px] font-extrabold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded border border-indigo-200">
                Phyphox Compatible
              </span>
              <span className="text-[9px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                Tracker Analysis
              </span>
              <span className="text-[9px] font-extrabold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded border border-cyan-200">
                PhET Sandbox
              </span>
            </div>
          </div>

          {/* Section 4: Virtual Laboratory Procedure */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              Recommended Experimental Procedure
            </h4>
            <div className="text-xs text-slate-600 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 leading-relaxed">
              {activeGuide.procedure}
            </div>
          </div>

        </div>

        {/* Co-pilot Telemetry data-bridge panel */}
        <div className="bg-slate-900 text-slate-100 p-5 flex flex-col justify-center border-t border-slate-800 shrink-0">
          <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5 justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Live Guide Telemetry
            </div>
            <span className="text-[8px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-400 font-mono">
              CAPS API Bridge
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-xs">
            {Object.entries(liveTelemetry).slice(0, 4).map(([key, val]) => (
              <div key={key} className="truncate">
                <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{key.replace(/_/g, ' ')}</div>
                <div className="text-white font-bold">{String(val)}</div>
              </div>
            ))}
            {Object.keys(liveTelemetry).length === 0 && (
              <div className="col-span-2 text-slate-500 italic text-[11px] py-1.5 text-center">
                Select variables or run the simulation to pipe measurements to the AI.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating AI Co-Pilot analysis button panel */}
      <AnalyzeExperimentPanel
        simName={lab.title}
        state={liveTelemetry}
      />
    </div>
  );
}

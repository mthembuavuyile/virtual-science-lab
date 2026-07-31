import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, HelpCircle, Activity, Zap, Layers, RefreshCw } from 'lucide-react';
import AnalyzeExperimentPanel from '../AnalyzeExperimentPanel';

export type ElectroMode = 'dc_motor' | 'dc_generator' | 'ac_generator';

export default function Electrodynamics3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const oscRef = useRef<HTMLCanvasElement>(null);

  const [mode, setMode] = useState<ElectroMode>('ac_generator');
  const [voltage, setVoltage] = useState(12); // DC Motor applied voltage
  const [speed, setSpeed] = useState(30); // Generator crank speed (RPM)
  const [bField, setBField] = useState(1.5); // Magnetic Field Strength (Tesla)
  const [isRunning, setIsRunning] = useState(true);

  // References for Three.js objects
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const coilRef = useRef<any>(null);
  const commutatorGroupRef = useRef<any>(null);
  const frameIdRef = useRef<number | null>(null);
  const rotationAngleRef = useRef<number>(0);
  const emfHistoryRef = useRef<number[]>(Array(100).fill(0));

  // Function to build/update the 3D Commutator geometry (Slip Rings vs Split Ring)
  const buildCommutator3D = (currentMode: ElectroMode) => {
    const THREE = (window as any).THREE;
    const group = commutatorGroupRef.current;
    if (!THREE || !group) return;

    // Clear previous ring geometry
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.9 });
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.85 });
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, metalness: 0.2 });
    const insulatorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });

    if (currentMode === 'ac_generator') {
      // ─── SLIP RINGS (Two continuous parallel independent rings) ───
      // Ring 1 (Side A of armature coil)
      const ringGeo1 = new THREE.CylinderGeometry(0.24, 0.24, 0.25, 32);
      const ring1 = new THREE.Mesh(ringGeo1, brassMat);
      ring1.position.set(1.9, 0, 0);
      ring1.rotation.z = Math.PI / 2;
      group.add(ring1);

      // Ring 2 (Side B of armature coil)
      const ringGeo2 = new THREE.CylinderGeometry(0.24, 0.24, 0.25, 32);
      const ring2 = new THREE.Mesh(ringGeo2, copperMat);
      ring2.position.set(2.4, 0, 0);
      ring2.rotation.z = Math.PI / 2;
      group.add(ring2);

      // Stationary Carbon Brushes touching each ring
      const brushGeo = new THREE.BoxGeometry(0.15, 0.35, 0.15);
      const brush1 = new THREE.Mesh(brushGeo, carbonMat);
      brush1.position.set(1.9, 0.32, 0);
      group.add(brush1);

      const brush2 = new THREE.Mesh(brushGeo, carbonMat);
      brush2.position.set(2.4, -0.32, 0);
      group.add(brush2);

    } else {
      // ─── SPLIT-RING COMMUTATOR (Single ring split into two semicircular halves with gaps) ───
      // Top Half Segment
      const segGeo1 = new THREE.CylinderGeometry(0.26, 0.26, 0.45, 32, 1, true, 0.15, Math.PI - 0.3);
      const seg1 = new THREE.Mesh(segGeo1, brassMat);
      seg1.position.set(2.15, 0, 0);
      seg1.rotation.z = Math.PI / 2;
      group.add(seg1);

      // Bottom Half Segment
      const segGeo2 = new THREE.CylinderGeometry(0.26, 0.26, 0.45, 32, 1, true, Math.PI + 0.15, Math.PI - 0.3);
      const seg2 = new THREE.Mesh(segGeo2, copperMat);
      seg2.position.set(2.15, 0, 0);
      seg2.rotation.z = Math.PI / 2;
      group.add(seg2);

      // Insulating Gap (Mica/Air gap)
      const gapGeo = new THREE.BoxGeometry(0.48, 0.54, 0.04);
      const gap = new THREE.Mesh(gapGeo, insulatorMat);
      gap.position.set(2.15, 0, 0);
      group.add(gap);

      // Stationary Carbon Brushes touching top & bottom
      const brushGeo = new THREE.BoxGeometry(0.18, 0.36, 0.18);
      const brushTop = new THREE.Mesh(brushGeo, carbonMat);
      brushTop.position.set(2.15, 0.35, 0);
      group.add(brushTop);

      const brushBottom = new THREE.Mesh(brushGeo, carbonMat);
      brushBottom.position.set(2.15, -0.35, 0);
      group.add(brushBottom);
    }
  };

  // Initialize Three.js Scene
  useEffect(() => {
    const THREE = (window as any).THREE;
    if (!THREE || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a'); // slate-900
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4, 8);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // 4. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // 5. Magnets (North Red, South Blue)
    const magnetGeo = new THREE.BoxGeometry(2.5, 2.5, 1.5);
    const matN = new THREE.MeshPhongMaterial({ color: 0xef4444, flatShading: true }); // North Red
    const matS = new THREE.MeshPhongMaterial({ color: 0x3b82f6, flatShading: true }); // South Blue

    const magN = new THREE.Mesh(magnetGeo, matN);
    magN.position.set(-3.2, 0, 0);
    scene.add(magN);

    const magS = new THREE.Mesh(magnetGeo, matS);
    magS.position.set(3.2, 0, 0);
    scene.add(magS);

    // 6. Central Shaft (Metallic Axle)
    const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 8, 16);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2, metalness: 0.8 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.rotation.z = Math.PI / 2;
    scene.add(shaft);

    // 7. Coil (Armature - Rectangular loop)
    const coil = new THREE.Group();
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.9 }); // Copper color

    const hWire = new THREE.CylinderGeometry(0.08, 0.08, 4, 16);
    const vWire = new THREE.CylinderGeometry(0.08, 0.08, 2, 16);

    const topWire = new THREE.Mesh(hWire, wireMat);
    topWire.position.y = 1;
    topWire.rotation.z = Math.PI / 2;
    coil.add(topWire);

    const bottomWire = new THREE.Mesh(hWire, wireMat);
    bottomWire.position.y = -1;
    bottomWire.rotation.z = Math.PI / 2;
    coil.add(bottomWire);

    const leftWire = new THREE.Mesh(vWire, wireMat);
    leftWire.position.set(-2, 0, 0);
    coil.add(leftWire);

    const rightWire = new THREE.Mesh(vWire, wireMat);
    rightWire.position.set(2, 0, 0);
    coil.add(rightWire);

    // Commutator Group (Slip Rings vs Split Ring)
    const commutatorGroup = new THREE.Group();
    coil.add(commutatorGroup);
    commutatorGroupRef.current = commutatorGroup;

    scene.add(coil);
    coilRef.current = coil;

    // Build initial commutator
    buildCommutator3D(mode);

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const animate = () => {
      if (!sceneRef.current || !rendererRef.current) return;
      rendererRef.current.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    };
  }, []);

  // Update commutator when mode changes
  useEffect(() => {
    buildCommutator3D(mode);
  }, [mode]);

  // Update physics simulation loop
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        let deltaRad = 0;
        let emf = 0;

        if (mode === 'dc_motor') {
          // Speed depends on applied voltage and magnetic field
          deltaRad = (voltage * bField) * 0.006;
          // DC motor back-EMF with brush ripple
          emf = voltage * (0.92 + 0.08 * Math.abs(Math.sin(rotationAngleRef.current * 2)));
        } else if (mode === 'dc_generator') {
          // Speed is direct crank speed
          deltaRad = (speed / 60) * 2 * Math.PI * 0.016;
          // Split-Ring Commutator flips negative half-cycle to positive -> |sin(w*t)|
          const rawEmf = Math.sin(rotationAngleRef.current) * speed * bField * 0.4;
          emf = Math.abs(rawEmf); // Rectified Pulsating DC
        } else {
          // AC Generator with Slip Rings
          deltaRad = (speed / 60) * 2 * Math.PI * 0.016;
          // Continuous slip-ring contact -> pure sine wave AC
          emf = Math.sin(rotationAngleRef.current) * speed * bField * 0.4;
        }

        // Apply rotation
        rotationAngleRef.current += deltaRad;
        if (coilRef.current) {
          coilRef.current.rotation.x = rotationAngleRef.current;
        }

        // Log EMF value for oscilloscope
        const history = [...emfHistoryRef.current];
        history.push(emf);
        if (history.length > 100) history.shift();
        emfHistoryRef.current = history;

        drawOscilloscope();
      }, 16);
    }

    return () => clearInterval(intervalId);
  }, [mode, voltage, speed, bField, isRunning]);

  const drawOscilloscope = () => {
    const canvas = oscRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;

    for (let y = 15; y < height; y += 15) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    for (let x = 25; x < width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Zero line
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // EMF Waveform color based on mode
    let waveColor = '#a78bfa'; // Purple for AC Slip Rings
    if (mode === 'dc_generator') waveColor = '#f59e0b'; // Amber for DC Split-Ring Generator
    if (mode === 'dc_motor') waveColor = '#10b981'; // Emerald for DC Motor

    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const points = emfHistoryRef.current;
    const step = width / (points.length - 1);

    points.forEach((val, i) => {
      const x = i * step;
      const scale = mode === 'dc_motor' ? height / 60 : height / 70;
      const y = (height / 2) - (val * scale);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  };

  const handleReset = () => {
    rotationAngleRef.current = 0;
    if (coilRef.current) {
      coilRef.current.rotation.x = 0;
    }
    emfHistoryRef.current = Array(100).fill(0);
    drawOscilloscope();
  };

  const getSimState = () => {
    if (mode === 'ac_generator') {
      return {
        mode: 'AC Generator',
        commutator_type: 'Slip Rings (2 Continuous Parallel Rings)',
        crank_rotational_speed_rpm: speed,
        magnetic_field_tesla: bField,
        output_waveform: 'Alternating Current (AC Sine Wave)',
        peak_induced_emf_volts: (speed * bField * 0.4).toFixed(1),
        frequency_hz: (speed / 60).toFixed(2),
      };
    } else if (mode === 'dc_generator') {
      return {
        mode: 'DC Generator (Dynamo)',
        commutator_type: 'Split-Ring Commutator (2 Halves with Insulating Gap)',
        crank_rotational_speed_rpm: speed,
        magnetic_field_tesla: bField,
        output_waveform: 'Rectified Pulsating Direct Current (DC)',
        peak_induced_emf_volts: (speed * bField * 0.4).toFixed(1),
        ripple_frequency_hz: ((speed / 60) * 2).toFixed(2),
      };
    } else {
      return {
        mode: 'DC Electric Motor',
        commutator_type: 'Split-Ring Commutator (Torque Reversal Mechanism)',
        applied_voltage_volts: voltage,
        magnetic_field_tesla: bField,
        output_motion: 'Continuous Unidirectional Rotation',
        estimated_speed_rpm: Math.round(voltage * bField * 15),
      };
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:h-full">
      {/* 3D Visualizer & Oscilloscope */}
      <div className="lg:w-7/12 p-4 lg:p-6 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col gap-4 shrink-0">
        
        {/* Mode Selection Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-200/80 p-1.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => { setMode('ac_generator'); handleReset(); }}
            className={`py-2 px-2 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
              mode === 'ac_generator' ? 'bg-white text-purple-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> AC Generator</span>
            <span className="text-[10px] font-mono text-purple-600">Slip Rings</span>
          </button>

          <button
            onClick={() => { setMode('dc_generator'); handleReset(); }}
            className={`py-2 px-2 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
              mode === 'dc_generator' ? 'bg-white text-amber-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> DC Generator</span>
            <span className="text-[10px] font-mono text-amber-600">Split Ring</span>
          </button>

          <button
            onClick={() => { setMode('dc_motor'); handleReset(); }}
            className={`py-2 px-2 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
              mode === 'dc_motor' ? 'bg-white text-emerald-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> DC Motor</span>
            <span className="text-[10px] font-mono text-emerald-600">Split Ring</span>
          </button>
        </div>

        {/* Three.js Container */}
        <div className="bg-slate-900 rounded-2xl relative h-[240px] sm:h-[300px] md:h-[360px] overflow-hidden border border-slate-800 shadow-inner flex flex-col p-2 shrink-0">
          <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-wider flex items-center gap-1.5 border border-white/10">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            3D Electrodynamics Engine
          </div>

          <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-white text-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400">Current Ring Setup:</div>
            <div className="font-semibold text-amber-400">
              {mode === 'ac_generator' ? 'Slip Rings (2 Continuous Rings + Brushes)' : 'Split-Ring Commutator (2 Halves + Insulating Gap)'}
            </div>
          </div>
          
          <div ref={containerRef} className="flex-1 w-full h-full rounded-xl overflow-hidden" />
        </div>

        {/* Oscilloscope */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Activity className="w-3.5 h-3.5" />
              Oscilloscope: {mode === 'ac_generator' ? 'AC Sinusoidal Output (V)' : mode === 'dc_generator' ? 'Rectified Pulsating DC Output (V)' : 'DC Voltage Ripple (V)'}
            </span>
            <span className="font-mono text-slate-500">Live Waveform</span>
          </div>
          <div className="h-28 bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden relative">
            <canvas ref={oscRef} className="w-full h-full block" />
            <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
              {mode === 'ac_generator' && `AC Sine Wave: ±${(speed * bField * 0.4).toFixed(1)}V`}
              {mode === 'dc_generator' && `Pulsating DC: 0V to +${(speed * bField * 0.4).toFixed(1)}V`}
              {mode === 'dc_motor' && `Applied DC: ${voltage.toFixed(1)}V`}
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Controls & Comparative Physics Lesson */}
      <div className="lg:w-5/12 p-4 lg:p-6 flex flex-col justify-between lg:overflow-y-auto">
        <div className="space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Electrodynamics Controls</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare Slip Rings (AC) vs Split-Ring Commutators (DC).
            </p>
          </div>

          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
            {mode === 'dc_motor' ? (
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  Applied Battery Voltage (V)
                  <span className="font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px]">{voltage} V</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={voltage}
                  onChange={(e) => setVoltage(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            ) : (
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  Armature Crank Speed (RPM)
                  <span className="font-mono text-purple-600 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded text-[10px]">{speed} RPM</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            )}

            <div>
              <label className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                Stator Magnetic Field (T)
                <span className="font-mono text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded text-[10px]">{bField.toFixed(1)} Tesla</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={bField}
                onChange={(e) => setBField(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          {/* Slip Ring vs Split Ring CAPS Physics Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <h4 className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
              CAPS Exam Concept: Slip Rings vs Split Rings
            </h4>

            {mode === 'ac_generator' ? (
              <div className="space-y-2 text-xs text-slate-700">
                <div className="font-semibold text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100">
                  <span className="font-bold">Slip Rings (AC Generator):</span> Two unbroken metallic rings mounted parallel on the shaft. Each side of the coil stays connected to the same ring throughout rotation.
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                  <li>Produces an <strong>Alternating Current (AC)</strong> sine wave.</li>
                  <li>Every 180°, induced EMF changes direction in the external circuit.</li>
                  <li>Used in thermal & hydro power station generators.</li>
                </ul>
              </div>
            ) : mode === 'dc_generator' ? (
              <div className="space-y-2 text-xs text-slate-700">
                <div className="font-semibold text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100">
                  <span className="font-bold">Split-Ring Commutator (DC Generator):</span> A single ring split into two halves with insulating gaps. Carbon brushes swap contacts every half-turn (180°).
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                  <li>Converts internal AC into <strong>Rectified Pulsating Direct Current (DC)</strong>.</li>
                  <li>External current flow remains unidirectional (always positive).</li>
                  <li>Used in bicycles dynamos and DC power sources.</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-slate-700">
                <div className="font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                  <span className="font-bold">Split-Ring Commutator (DC Motor):</span> Swaps current direction in the coil every 180° so the magnetic torque stays in the same direction.
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                  <li>Prevents the motor armature from stalling or turning backwards.</li>
                  <li>Converts <strong>Electrical Energy → Mechanical Energy</strong>.</li>
                  <li>Used in electric vehicle drives, fans, and power tools.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Playback buttons */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs shadow transition cursor-pointer ${
              isRunning ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRunning ? (
              <><Pause className="w-4 h-4" /> Pause Simulation</>
            ) : (
              <><Play className="w-4 h-4" /> Start Simulation</>
            )}
          </button>
          <button
            onClick={handleReset}
            className="px-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Floating AI Panel connection */}
      <AnalyzeExperimentPanel
        simName={
          mode === 'ac_generator'
            ? '3D AC Generator (Slip Rings)'
            : mode === 'dc_generator'
            ? '3D DC Generator (Split-Ring Commutator)'
            : '3D DC Electric Motor (Split-Ring Commutator)'
        }
        state={getSimState()}
      />
    </div>
  );
}

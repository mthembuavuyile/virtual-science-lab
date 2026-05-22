import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, HelpCircle, Activity } from 'lucide-react';
import AnalyzeExperimentPanel from '../AnalyzeExperimentPanel';

export default function Electrodynamics3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const oscRef = useRef<HTMLCanvasElement>(null);

  const [mode, setMode] = useState<'dc_motor' | 'ac_generator'>('dc_motor');
  const [voltage, setVoltage] = useState(12); // DC Motor applied voltage
  const [speed, setSpeed] = useState(30); // AC Generator crank speed (RPM)
  const [bField, setBField] = useState(1.5); // Magnetic Field Strength (Tesla)
  const [isRunning, setIsRunning] = useState(true);

  // References for Three.js objects
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const coilRef = useRef<any>(null);
  const frameIdRef = useRef<number | null>(null);
  const rotationAngleRef = useRef<number>(0);
  const emfHistoryRef = useRef<number[]>(Array(100).fill(0));

  // Initialize Three.js
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

    // Clear previous canvas
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // 4. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // 5. Magnets (North is Red, South is Blue)
    const magnetGeo = new THREE.BoxGeometry(2.5, 2.5, 1.5);
    const matN = new THREE.MeshPhongMaterial({ color: 0xef4444, flatShading: true }); // North Red
    const matS = new THREE.MeshPhongMaterial({ color: 0x3b82f6, flatShading: true }); // South Blue

    const magN = new THREE.Mesh(magnetGeo, matN);
    magN.position.set(-3.2, 0, 0);
    scene.add(magN);

    // Add 'N' label or helper
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

    // Commutator / Slip rings visual
    const ringGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.4, 16);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(2.2, 0, 0);
    ring.rotation.z = Math.PI / 2;
    coil.add(ring);

    scene.add(coil);
    coilRef.current = coil;

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

  // Update physics simulation loop
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        // Calculate speed of rotation (radians per tick)
        let deltaRad = 0;
        let emf = 0;

        if (mode === 'dc_motor') {
          // Speed depends on applied voltage and magnetic field
          deltaRad = (voltage * bField) * 0.006;
          // DC motor voltage has some ripple depending on position relative to brushes
          emf = voltage * (0.92 + 0.08 * Math.abs(Math.sin(rotationAngleRef.current * 2)));
        } else {
          // Speed is direct crank speed
          deltaRad = (speed / 60) * 2 * Math.PI * 0.016; // rad per 16ms
          // AC Generator voltage is sinusoidal: EMF = B * A * w * sin(w * t)
          emf = Math.sin(rotationAngleRef.current) * speed * bField * 0.4;
        }

        // Apply rotation
        rotationAngleRef.current += deltaRad;
        if (coilRef.current) {
          coilRef.current.rotation.x = rotationAngleRef.current;
        }

        // Log EMF value for chart
        const history = [...emfHistoryRef.current];
        history.push(emf);
        if (history.length > 100) history.shift();
        emfHistoryRef.current = history;

        // Draw Oscilloscope
        drawOscilloscope();
      }, 16); // ~60fps calculation
    }

    return () => clearInterval(intervalId);
  }, [mode, voltage, speed, bField, isRunning]);

  const drawOscilloscope = () => {
    const canvas = oscRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = '#334155'; // slate-700
    ctx.lineWidth = 0.5;

    // Horizontal grid lines
    for (let y = 20; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    // Vertical grid lines
    for (let x = 30; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw Zero line
    ctx.strokeStyle = '#64748b'; // slate-500
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Draw EMF Wave
    ctx.strokeStyle = mode === 'dc_motor' ? '#10b981' : '#a78bfa'; // emerald vs purple
    ctx.lineWidth = 2;
    ctx.beginPath();

    const points = emfHistoryRef.current;
    const step = width / (points.length - 1);

    points.forEach((val, i) => {
      const x = i * step;
      // Map EMF values to canvas Y coordinates (height/2 is zero)
      // Scale depends on mode (AC values can be larger)
      const scale = mode === 'dc_motor' ? height / 60 : height / 80;
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

  // Compile exact variables for Gemini context
  const getSimState = () => {
    return mode === 'dc_motor'
      ? {
          rotor_type: 'DC Motor with Split-Ring Commutator',
          applied_voltage_volts: voltage,
          magnetic_field_tesla: bField,
          estimated_rotational_speed_rpm: Math.round(voltage * bField * 15),
          measured_current_ripple_amps: (voltage / 10).toFixed(2),
        }
      : {
          rotor_type: 'AC Generator with Slip Rings',
          crank_rotational_speed_rpm: speed,
          magnetic_field_tesla: bField,
          peak_induced_emf_volts: (speed * bField * 0.4).toFixed(1),
          induced_frequency_hz: (speed / 60).toFixed(2),
        };
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* 3D Visualizer & Oscilloscope */}
      <div className="lg:w-7/12 p-4 lg:p-6 bg-slate-50 border-r border-slate-200 flex flex-col gap-4">
        {/* Three.js Container */}
        <div className="bg-slate-900 rounded-2xl relative h-[360px] overflow-hidden border border-slate-800 shadow-inner flex flex-col p-2">
          <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-wider flex items-center gap-1.5 border border-white/10">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            3D Physics Engine (Three.js)
          </div>
          
          <div ref={containerRef} className="flex-1 w-full h-full rounded-xl overflow-hidden" />
        </div>

        {/* Oscilloscope */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Activity className="w-3.5 h-3.5" />
              Oscilloscope: Induced EMF (V)
            </span>
            <span className="font-mono text-slate-500">Live Telemetry</span>
          </div>
          <div className="h-28 bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden relative">
            <canvas ref={oscRef} width="400" height="112" className="w-full h-full block" />
            <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
              {mode === 'dc_motor' 
                ? `Steady state: ~${voltage.toFixed(1)}V (DC)`
                : `Peak EMF: ±${(speed * bField * 0.4).toFixed(1)}V (AC)`
              }
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Controls & Lesson */}
      <div className="lg:w-5/12 p-4 lg:p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Electrodynamics Setup</h3>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value as any);
                handleReset();
              }}
              className="bg-white border border-slate-200 rounded-lg py-1 px-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
            >
              <option value="dc_motor">DC Motor (Split-Ring)</option>
              <option value="ac_generator">AC Generator (Slip Rings)</option>
            </select>
          </div>

          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
            {mode === 'dc_motor' ? (
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  Applied Battery Voltage (V)
                  <span className="font-mono text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded text-[10px]">{voltage} V</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={voltage}
                  onChange={(e) => setVoltage(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            ) : (
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  Hand-Crank Speed (RPM)
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
                <span className="font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px]">{bField.toFixed(1)} Tesla</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={bField}
                onChange={(e) => setBField(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          {/* CAPS Syllabus Tip Box */}
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl space-y-2">
            <h4 className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
              <HelpCircle className="w-4 h-4 shrink-0" />
              CAPS Examination Insight
            </h4>
            <p className="text-[11px] text-blue-900/90 leading-relaxed font-medium">
              {mode === 'dc_motor' 
                ? 'DC Motors convert electrical energy to mechanical energy. The split-ring commutator changes the direction of the current in the coil every half-rotation to keep the torque in the same direction, preventing the loop from stalling.'
                : 'Generators convert mechanical energy to electrical energy. AC Generators use slip-rings to maintain continuous electrical contact with the rotating coil, generating a sinusoidal alternating potential difference (EMF).'
              }
            </p>
          </div>
        </div>

        {/* Bottom Playback buttons */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs shadow transition ${
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
            className="px-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Floating AI Panel connection */}
      <AnalyzeExperimentPanel
        simName={mode === 'dc_motor' ? 'DC Electrodynamics Motor' : 'AC Electrodynamics Generator'}
        state={getSimState()}
      />
    </div>
  );
}

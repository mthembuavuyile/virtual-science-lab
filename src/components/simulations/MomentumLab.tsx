import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Shuffle,
  Activity,
  Zap,
  ShieldAlert,
  Calculator,
  Award,
  Info,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

type TabType = 'collision' | 'impulse' | 'elasticity' | 'calculator' | 'quiz';

/* ─────────────────────────────────────────────────────────────
   CAPS Quiz Questions
───────────────────────────────────────────────────────────── */
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Linear momentum is defined as:',
    options: [
      'The product of an object\'s mass and its acceleration.',
      'The rate of change of an object\'s velocity.',
      'The product of an object\'s mass and its velocity.',
      'The force required to stop a moving object.'
    ],
    correctIndex: 2,
    explanation: 'Linear momentum (p) is defined as the product of an object\'s mass (m) and its velocity (v), represented by the equation p = mv.'
  },
  {
    id: 2,
    question: 'According to Newton\'s Second Law expressed in terms of momentum:',
    options: [
      'The net force is equal to the change in momentum.',
      'The net force is equal to the rate of change of momentum.',
      'The momentum of an isolated system is constant.',
      'Impulse is equal to the product of force and time.'
    ],
    correctIndex: 1,
    explanation: 'Newton\'s Second Law in terms of momentum states that the net force acting on an object is equal to the rate of change of momentum (F_net = Δp / Δt).'
  },
  {
    id: 3,
    question: 'In an isolated system, which of the following is true for an inelastic collision?',
    options: [
      'Both total momentum and total kinetic energy are conserved.',
      'Neither total momentum nor total kinetic energy is conserved.',
      'Total kinetic energy is conserved, but total momentum is not.',
      'Total momentum is conserved, but total kinetic energy is not.'
    ],
    correctIndex: 3,
    explanation: 'In any collision in an isolated system, total momentum is conserved. However, in an inelastic collision, some kinetic energy is transformed into other forms of energy (like heat or sound), so total kinetic energy is NOT conserved.'
  },
  {
    id: 4,
    question: 'Impulse is mathematically equal to:',
    options: [
      'The change in kinetic energy.',
      'The change in momentum.',
      'The rate of change of momentum.',
      'The product of mass and acceleration.'
    ],
    correctIndex: 1,
    explanation: 'The Impulse-Momentum Theorem states that the impulse (F_net * Δt) applied to an object is equal to its change in momentum (Δp).'
  },
  {
    id: 5,
    question: 'How do airbags in a car reduce the force experienced by a passenger during a crash?',
    options: [
      'They decrease the passenger\'s change in momentum.',
      'They decrease the time interval over which the collision occurs.',
      'They increase the time interval over which the collision occurs.',
      'They absorb the passenger\'s kinetic energy and convert it into momentum.'
    ],
    correctIndex: 2,
    explanation: 'Airbags increase the time (Δt) it takes for the passenger to come to a stop. According to F_net = Δp / Δt, for a given change in momentum (Δp), a larger time interval (Δt) results in a smaller net force (F_net).'
  },
  {
    id: 6,
    question: 'Two trolleys approach each other on a frictionless track. Trolley A (1 kg) moves right at 2 m/s. Trolley B (2 kg) moves left at 1 m/s. They collide and stick together. What is their final velocity?',
    options: [
      '1 m/s to the right',
      '0.5 m/s to the right',
      '0 m/s',
      '0.5 m/s to the left'
    ],
    correctIndex: 2,
    explanation: 'Taking right as positive: p_initial = (1)(2) + (2)(-1) = 2 - 2 = 0 kg·m/s. Since p_final must also be 0, and they stick together (m_total = 3 kg), then 3 * v_f = 0, so v_f = 0 m/s.'
  }
];

export default function MomentumLab() {
  const [activeTab, setActiveTab] = useState<TabType>('collision');

  // --- Tab 1: Collision Simulator State ---
  const [m1, setM1] = useState(1.0); // kg
  const [v1, setV1] = useState(2.0); // m/s
  const [m2, setM2] = useState(1.5); // kg
  const [v2, setV2] = useState(-1.0); // m/s
  const [collisionType, setCollisionType] = useState<'elastic' | 'inelastic'>('elastic');
  
  const [isSimRunning, setIsSimRunning] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Derived initial physics
  const p1i = m1 * v1;
  const p2i = m2 * v2;
  const pTotal_i = p1i + p2i;

  const ke1i = 0.5 * m1 * v1 * v1;
  const ke2i = 0.5 * m2 * v2 * v2;
  const keTotal_i = ke1i + ke2i;

  // Compute final velocities based on collision type
  const finalState = useMemo(() => {
    let v1f = 0;
    let v2f = 0;

    if (collisionType === 'elastic') {
      // 1D elastic collision formulas
      v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
      v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
    } else {
      // Perfectly inelastic (stick together)
      const vf = (m1 * v1 + m2 * v2) / (m1 + m2);
      v1f = vf;
      v2f = vf;
    }

    const p1f = m1 * v1f;
    const p2f = m2 * v2f;
    const pTotal_f = p1f + p2f;

    const ke1f = 0.5 * m1 * v1f * v1f;
    const ke2f = 0.5 * m2 * v2f * v2f;
    const keTotal_f = ke1f + ke2f;

    return { v1f, v2f, p1f, p2f, pTotal_f, ke1f, ke2f, keTotal_f };
  }, [m1, v1, m2, v2, collisionType]);

  // --- Animation Loop ---
  useEffect(() => {
    if (activeTab !== 'collision') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    
    // Virtual positions (meters), let 0 be center
    let pos1 = -4; // starts 4m left of center
    let pos2 = 4;  // starts 4m right of center
    
    // Scale for rendering (pixels per meter)
    const scale = 40;
    const centerY = canvas.height / 2;
    const centerX = canvas.width / 2;
    
    const trolleyWidth = 60;
    const trolleyHeight = 30;

    // We assume collision happens at x=0 (relative to center of mass, roughly)
    // Actually, let's just do time-based integration until they touch.
    let currentV1 = v1;
    let currentV2 = v2;
    let hasCollided = false;

    // Reset positions if simTime is 0
    if (simTime === 0) {
      pos1 = -4;
      pos2 = 4;
      hasCollided = false;
      currentV1 = v1;
      currentV2 = v2;
    }

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000; // seconds
      lastTime = time;

      if (isSimRunning) {
        // Only update physics if running
        // Check collision: distance between centers <= trolleyWidth (in meters = trolleyWidth/scale)
        const separation = Math.abs(pos2 - pos1);
        const contactDist = trolleyWidth / scale;

        if (!hasCollided && separation <= contactDist) {
          hasCollided = true;
          currentV1 = finalState.v1f;
          currentV2 = finalState.v2f;
          
          // Slight correction so they don't overlap too much
          if (pos1 < pos2) {
             pos1 = pos2 - contactDist;
          }
        }

        pos1 += currentV1 * dt;
        pos2 += currentV2 * dt;
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw track
      ctx.beginPath();
      ctx.moveTo(0, centerY + trolleyHeight / 2);
      ctx.lineTo(canvas.width, centerY + trolleyHeight / 2);
      ctx.strokeStyle = '#334155'; // slate-700
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw Trolley 1 (Red/Rose)
      const x1 = centerX + pos1 * scale;
      ctx.fillStyle = '#e11d48'; // rose-600
      ctx.fillRect(x1 - trolleyWidth/2, centerY - trolleyHeight/2, trolleyWidth, trolleyHeight);
      ctx.fillStyle = 'white';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`m₁: ${m1}kg`, x1, centerY + 4);
      
      // Draw Wheels
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.arc(x1 - 15, centerY + trolleyHeight/2, 6, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(x1 + 15, centerY + trolleyHeight/2, 6, 0, Math.PI*2); ctx.fill();

      // Velocity Vector 1
      if (Math.abs(currentV1) > 0.1) {
          ctx.beginPath();
          ctx.moveTo(x1, centerY - trolleyHeight/2 - 10);
          ctx.lineTo(x1 + currentV1 * 20, centerY - trolleyHeight/2 - 10);
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2;
          ctx.stroke();
          // Arrowhead
          ctx.beginPath();
          if (currentV1 > 0) {
              ctx.moveTo(x1 + currentV1 * 20, centerY - trolleyHeight/2 - 10);
              ctx.lineTo(x1 + currentV1 * 20 - 5, centerY - trolleyHeight/2 - 15);
              ctx.lineTo(x1 + currentV1 * 20 - 5, centerY - trolleyHeight/2 - 5);
          } else {
              ctx.moveTo(x1 + currentV1 * 20, centerY - trolleyHeight/2 - 10);
              ctx.lineTo(x1 + currentV1 * 20 + 5, centerY - trolleyHeight/2 - 15);
              ctx.lineTo(x1 + currentV1 * 20 + 5, centerY - trolleyHeight/2 - 5);
          }
          ctx.fillStyle = '#f43f5e';
          ctx.fill();
      }

      // Draw Trolley 2 (Blue/Indigo)
      const x2 = centerX + pos2 * scale;
      ctx.fillStyle = '#4f46e5'; // indigo-600
      ctx.fillRect(x2 - trolleyWidth/2, centerY - trolleyHeight/2, trolleyWidth, trolleyHeight);
      ctx.fillStyle = 'white';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`m₂: ${m2}kg`, x2, centerY + 4);

      // Draw Wheels
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.arc(x2 - 15, centerY + trolleyHeight/2, 6, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(x2 + 15, centerY + trolleyHeight/2, 6, 0, Math.PI*2); ctx.fill();

      // Velocity Vector 2
      if (Math.abs(currentV2) > 0.1) {
          ctx.beginPath();
          ctx.moveTo(x2, centerY - trolleyHeight/2 - 10);
          ctx.lineTo(x2 + currentV2 * 20, centerY - trolleyHeight/2 - 10);
          ctx.strokeStyle = '#818cf8';
          ctx.lineWidth = 2;
          ctx.stroke();
          // Arrowhead
          ctx.beginPath();
          if (currentV2 > 0) {
              ctx.moveTo(x2 + currentV2 * 20, centerY - trolleyHeight/2 - 10);
              ctx.lineTo(x2 + currentV2 * 20 - 5, centerY - trolleyHeight/2 - 15);
              ctx.lineTo(x2 + currentV2 * 20 - 5, centerY - trolleyHeight/2 - 5);
          } else {
              ctx.moveTo(x2 + currentV2 * 20, centerY - trolleyHeight/2 - 10);
              ctx.lineTo(x2 + currentV2 * 20 + 5, centerY - trolleyHeight/2 - 15);
              ctx.lineTo(x2 + currentV2 * 20 + 5, centerY - trolleyHeight/2 - 5);
          }
          ctx.fillStyle = '#818cf8';
          ctx.fill();
      }
      
      // Draw status text
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(hasCollided ? 'AFTER COLLISION' : 'BEFORE COLLISION', 10, 20);
      ctx.fillText(`v₁ = ${currentV1.toFixed(2)} m/s`, 10, 40);
      ctx.fillText(`v₂ = ${currentV2.toFixed(2)} m/s`, 10, 60);

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [activeTab, isSimRunning, m1, v1, m2, v2, collisionType, finalState, simTime]);

  const handleReset = () => {
    setIsSimRunning(false);
    setSimTime(0); // Trigger reset in effect
    setTimeout(() => setSimTime(1), 10); // Small hack to force re-render
  };

  // --- Tab 2: Impulse State ---
  const [impulseScenario, setImpulseScenario] = useState<'wall' | 'crumple' | 'airbag'>('wall');
  
  // --- Tab 4: Calculator State ---
  const [calcMode, setCalcMode] = useState<'p' | 'F' | 'J'>('p');
  const [calcMass, setCalcMass] = useState(1000);
  const [calcVi, setCalcVi] = useState(20);
  const [calcVf, setCalcVf] = useState(0);
  const [calcTime, setCalcTime] = useState(0.1);

  // --- Tab 5: Quiz State ---
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);
  const quizScore = useMemo(() => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) score++;
    });
    return score;
  }, [userAnswers]);


  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans p-3 lg:p-6 overflow-y-auto">
      {/* ─────────────────────────────────────────────────────────────
          APP BRANDED HEADER & TAB BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4 lg:mb-6 shrink-0">
        <div className="p-4 lg:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base lg:text-lg font-bold text-slate-900 tracking-tight">Conservation of Momentum</h1>
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-rose-600 border-rose-200 bg-rose-50">
                  Grade 12 CAPS
                </Badge>
              </div>
              <p className="text-xs text-slate-500">Momentum, Impulse, Elasticity & Collisions in 1D</p>
            </div>
          </div>
        </div>

        {/* Tab Selector Bar */}
        <div className="flex bg-slate-50/80 px-2 lg:px-4 gap-1 overflow-x-auto border-t border-slate-200">
          {[
            { id: 'collision', label: 'Trolley Collision', icon: Activity },
            { id: 'impulse', label: 'Impulse & Safety', icon: ShieldAlert },
            { id: 'elasticity', label: 'Elastic vs Inelastic', icon: Zap },
            { id: 'calculator', label: 'Newton\'s 2nd Law', icon: Calculator },
            { id: 'quiz', label: 'CAPS Quiz', icon: Award }
          ].map((t) => {
            const IconComponent = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold transition-all whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'border-rose-600 text-rose-700 bg-white shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA BY TAB
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0">
        
        {/* =========================================================
            TAB 1: TROLLEY COLLISION
            ========================================================= */}
        {activeTab === 'collision' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            
            {/* Left Control Panel */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <Card className="p-4 bg-white border-slate-200 shadow-sm text-slate-800">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-rose-600" />
                  Initial Conditions
                </h2>
                
                {/* Trolley 1 Controls */}
                <div className="space-y-3 p-3 bg-rose-50/50 rounded-xl border border-rose-100 mb-4">
                  <div className="flex justify-between items-center text-xs font-bold text-rose-700">
                    <span>Trolley 1 (Red)</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">Mass (m₁)</span>
                      <span className="font-mono font-medium">{m1.toFixed(1)} kg</span>
                    </div>
                    <Slider value={[m1]} min={0.5} max={5} step={0.5} onValueChange={(v) => {setM1(v[0]); handleReset();}} disabled={isSimRunning} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">Velocity (v₁)</span>
                      <span className="font-mono font-medium">{v1.toFixed(1)} m/s</span>
                    </div>
                    <Slider value={[v1]} min={-5} max={5} step={0.5} onValueChange={(v) => {setV1(v[0]); handleReset();}} disabled={isSimRunning} />
                  </div>
                </div>

                {/* Trolley 2 Controls */}
                <div className="space-y-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 mb-4">
                  <div className="flex justify-between items-center text-xs font-bold text-indigo-700">
                    <span>Trolley 2 (Blue)</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">Mass (m₂)</span>
                      <span className="font-mono font-medium">{m2.toFixed(1)} kg</span>
                    </div>
                    <Slider value={[m2]} min={0.5} max={5} step={0.5} onValueChange={(v) => {setM2(v[0]); handleReset();}} disabled={isSimRunning} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">Velocity (v₂)</span>
                      <span className="font-mono font-medium">{v2.toFixed(1)} m/s</span>
                    </div>
                    <Slider value={[v2]} min={-5} max={5} step={0.5} onValueChange={(v) => {setV2(v[0]); handleReset();}} disabled={isSimRunning} />
                  </div>
                </div>

                {/* Collision Type */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-semibold text-slate-600 block">Collision Type</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => {setCollisionType('elastic'); handleReset();}}
                      disabled={isSimRunning}
                      className={`py-2 rounded-lg font-bold border transition-all ${
                        collisionType === 'elastic' ? 'bg-white border-rose-500 text-rose-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                      } disabled:opacity-50`}
                    >
                      Elastic (Bounce)
                    </button>
                    <button
                      onClick={() => {setCollisionType('inelastic'); handleReset();}}
                      disabled={isSimRunning}
                      className={`py-2 rounded-lg font-bold border transition-all ${
                        collisionType === 'inelastic' ? 'bg-white border-rose-500 text-rose-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                      } disabled:opacity-50`}
                    >
                      Inelastic (Stick)
                    </button>
                  </div>
                </div>

                {/* Play Controls */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                  <Button 
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-9"
                    onClick={() => setIsSimRunning(!isSimRunning)}
                  >
                    {isSimRunning ? <><Pause className="w-4 h-4 mr-1"/> Pause</> : <><Play className="w-4 h-4 mr-1"/> Run Collision</>}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-9 w-12 border-slate-200 text-slate-600 hover:bg-slate-100"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

              </Card>
            </div>

            {/* Right Simulation & Data Panel */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              
              {/* Canvas Viewport */}
              <Card className="p-1 bg-white border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-950 rounded-xl relative overflow-hidden aspect-video max-h-[350px]">
                  <canvas ref={canvasRef} width={800} height={400} className="w-full h-full object-contain" />
                  
                  {/* Direction Legend */}
                  <div className="absolute top-4 right-4 flex gap-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                    <span>← Negative (Left)</span>
                    <span className="text-slate-600">|</span>
                    <span>Positive (Right) →</span>
                  </div>
                </div>
              </Card>

              {/* Data Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Momentum Data */}
                <Card className="p-4 bg-white border-slate-200 shadow-sm">
                  <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Momentum (p = mv)
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="grid grid-cols-3 gap-2 pb-2 border-b border-slate-100 font-bold text-slate-500">
                      <div>Object</div>
                      <div className="text-right">Before (kg·m/s)</div>
                      <div className="text-right">After (kg·m/s)</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-rose-600">
                      <div>Trolley 1</div>
                      <div className="text-right">{p1i.toFixed(2)}</div>
                      <div className="text-right">{finalState.p1f.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-indigo-600">
                      <div>Trolley 2</div>
                      <div className="text-right">{p2i.toFixed(2)}</div>
                      <div className="text-right">{finalState.p2f.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 font-bold text-slate-800">
                      <div>Total (Σp)</div>
                      <div className="text-right">{pTotal_i.toFixed(2)}</div>
                      <div className="text-right">{finalState.pTotal_f.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-700 text-xs font-medium flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4" />
                     Δp = 0. Momentum is Conserved!
                  </div>
                </Card>

                {/* Kinetic Energy Data */}
                <Card className="p-4 bg-white border-slate-200 shadow-sm">
                  <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Kinetic Energy (½mv²)
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="grid grid-cols-3 gap-2 pb-2 border-b border-slate-100 font-bold text-slate-500">
                      <div>Object</div>
                      <div className="text-right">Before (J)</div>
                      <div className="text-right">After (J)</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-rose-600">
                      <div>Trolley 1</div>
                      <div className="text-right">{ke1i.toFixed(2)}</div>
                      <div className="text-right">{finalState.ke1f.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-indigo-600">
                      <div>Trolley 2</div>
                      <div className="text-right">{ke2i.toFixed(2)}</div>
                      <div className="text-right">{finalState.ke2f.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 font-bold text-slate-800">
                      <div>Total (ΣEₖ)</div>
                      <div className="text-right">{keTotal_i.toFixed(2)}</div>
                      <div className="text-right">{finalState.keTotal_f.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className={`mt-3 p-2 rounded text-xs font-medium flex items-center gap-2 border ${collisionType === 'elastic' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                     {collisionType === 'elastic' ? (
                       <><CheckCircle2 className="w-4 h-4" /> ΔEₖ = 0. Kinetic Energy Conserved.</>
                     ) : (
                       <><Info className="w-4 h-4" /> ΔEₖ ≠ 0. Kinetic Energy NOT Conserved.</>
                     )}
                  </div>
                </Card>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================
            TAB 2: IMPULSE & SAFETY
            ========================================================= */}
        {activeTab === 'impulse' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            <div className="lg:col-span-4 flex flex-col gap-4">
              <Card className="p-4 bg-white border-slate-200 shadow-sm text-slate-800">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <ShieldAlert className="w-4 h-4 text-orange-600" />
                  Select Crash Scenario
                </h2>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setImpulseScenario('wall')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      impulseScenario === 'wall' ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm font-bold">Rigid Wall (No Airbag)</div>
                    <div className="text-[11px] text-slate-500 mt-1">Very short collision time (Δt). Extremely high peak force. Fatal.</div>
                  </button>
                  <button
                    onClick={() => setImpulseScenario('crumple')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      impulseScenario === 'crumple' ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm font-bold">Crumple Zone Active</div>
                    <div className="text-[11px] text-slate-500 mt-1">Increases Δt as the car front crushes. Lowers peak force. Survivable.</div>
                  </button>
                  <button
                    onClick={() => setImpulseScenario('airbag')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      impulseScenario === 'airbag' ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm font-bold">Airbag Deployed</div>
                    <div className="text-[11px] text-slate-500 mt-1">Maximum Δt for the passenger. Lowest peak force. Safe.</div>
                  </button>
                </div>
              </Card>

              <Card className="p-4 bg-white border-slate-200 shadow-sm text-slate-800">
                <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">CAPS Core Principle</h3>
                <p className="text-xs text-slate-600 mb-2">
                  The Impulse-Momentum Theorem states: <strong className="text-rose-600">F_net * Δt = Δp</strong>.
                </p>
                <p className="text-xs text-slate-600 mb-2">
                  For a car crashing at a given speed, the change in momentum (Δp) is <strong>constant</strong> (it always goes from initial velocity to zero).
                </p>
                <p className="text-xs text-slate-600">
                  Therefore, by <strong>increasing the time (Δt)</strong> it takes to stop (using airbags, crumple zones, or seatbelts), we proportionately <strong>decrease the net force (F_net)</strong> acting on the passenger.
                </p>
              </Card>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-4">
               <Card className="p-6 bg-white border-slate-200 shadow-sm flex flex-col justify-center items-center min-h-[400px]">
                 <h3 className="text-sm font-bold text-slate-800 mb-4">Force vs Time Graph (Impulse = Area)</h3>
                 
                 {/* Visual Representation of the Area Graph */}
                 <div className="w-full max-w-lg relative h-64 border-l-2 border-b-2 border-slate-800 p-4">
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-slate-600">Net Force (F)</div>
                    <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600">Time (Δt)</div>
                    
                    {/* Graph Area */}
                    <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                       {impulseScenario === 'wall' && (
                         <div className="w-16 bg-red-500/30 border-2 border-red-600 h-[95%] relative flex items-center justify-center rounded-t-sm">
                           <span className="text-red-700 font-bold text-xs absolute -top-6">High F</span>
                           <span className="text-red-700 font-bold text-xs absolute -bottom-6">Small Δt</span>
                           <span className="font-bold text-red-800 text-sm">Δp</span>
                         </div>
                       )}
                       {impulseScenario === 'crumple' && (
                         <div className="w-32 bg-orange-500/30 border-2 border-orange-600 h-[47%] relative flex items-center justify-center rounded-t-[50%]">
                           <span className="text-orange-700 font-bold text-xs absolute -top-6">Medium F</span>
                           <span className="text-orange-700 font-bold text-xs absolute -bottom-6">Medium Δt</span>
                           <span className="font-bold text-orange-800 text-sm">Δp</span>
                         </div>
                       )}
                       {impulseScenario === 'airbag' && (
                         <div className="w-64 bg-green-500/30 border-2 border-green-600 h-[23%] relative flex items-center justify-center rounded-t-[50%]">
                           <span className="text-green-700 font-bold text-xs absolute -top-6">Low F</span>
                           <span className="text-green-700 font-bold text-xs absolute -bottom-6">Large Δt</span>
                           <span className="font-bold text-green-800 text-sm">Δp</span>
                         </div>
                       )}
                    </div>
                 </div>
                 
                 <div className="mt-8 text-center text-xs text-slate-500">
                   Notice that the <strong>Area (Impulse = Δp)</strong> remains exactly the same in all three scenarios.<br/> Only the shape (height vs width) changes.
                 </div>
               </Card>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: ELASTIC VS INELASTIC (REDIRECT)
            ========================================================= */}
        {activeTab === 'elasticity' && (
          <div className="flex flex-col items-center justify-center h-full">
            <Card className="p-8 text-center max-w-md bg-white border-slate-200 shadow-sm">
              <Zap className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-slate-800 mb-2">Elastic vs Inelastic Comparison</h2>
              <p className="text-sm text-slate-600 mb-6">
                This functionality is integrated directly into the <strong>Trolley Collision</strong> tab. 
                Switch back to the Collision tab and use the "Collision Type" toggle to compare Elastic and Inelastic collisions, and observe the Kinetic Energy verification table.
              </p>
              <Button onClick={() => setActiveTab('collision')} className="bg-rose-600 hover:bg-rose-700 text-white">
                Go to Collision Simulator
              </Button>
            </Card>
          </div>
        )}

        {/* =========================================================
            TAB 4: CALCULATOR
            ========================================================= */}
        {activeTab === 'calculator' && (
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            <Card className="p-6 bg-white border-slate-200 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                <Calculator className="w-4 h-4 text-purple-600" />
                Newton's Second Law & Momentum Calculator
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600">Mass (kg)</label>
                    <input type="number" value={calcMass} onChange={e => setCalcMass(Number(e.target.value))} className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded font-mono text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">Initial Velocity, vi (m/s)</label>
                    <input type="number" value={calcVi} onChange={e => setCalcVi(Number(e.target.value))} className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded font-mono text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">Final Velocity, vf (m/s)</label>
                    <input type="number" value={calcVf} onChange={e => setCalcVf(Number(e.target.value))} className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded font-mono text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">Time Interval, Δt (s)</label>
                    <input type="number" value={calcTime} onChange={e => setCalcTime(Number(e.target.value))} className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded font-mono text-sm" step={0.01} />
                  </div>
                </div>
                
                <div className="bg-slate-900 text-slate-300 p-5 rounded-xl font-mono text-sm shadow-inner flex flex-col justify-center">
                  <div className="text-xs text-purple-400 mb-2 font-bold font-sans">STEP-BY-STEP CALCULATION:</div>
                  
                  <div className="mb-4 space-y-1">
                     <div>p_initial = m * vi</div>
                     <div>p_initial = {calcMass} * {calcVi} = <span className="text-white font-bold">{calcMass * calcVi} kg·m/s</span></div>
                  </div>
                  
                  <div className="mb-4 space-y-1">
                     <div>p_final = m * vf</div>
                     <div>p_final = {calcMass} * {calcVf} = <span className="text-white font-bold">{calcMass * calcVf} kg·m/s</span></div>
                  </div>
                  
                  <div className="mb-4 space-y-1 text-amber-300">
                     <div>Δp = p_final - p_initial</div>
                     <div>Δp = {calcMass * calcVf} - {calcMass * calcVi} = <span className="font-bold">{calcMass * calcVf - calcMass * calcVi} kg·m/s</span></div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-700 space-y-1 text-emerald-400">
                     <div>F_net = Δp / Δt</div>
                     <div>F_net = {(calcMass * calcVf - calcMass * calcVi)} / {calcTime}</div>
                     <div className="text-lg font-bold text-white mt-1">F_net = {((calcMass * calcVf - calcMass * calcVi) / calcTime).toFixed(2)} N</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================
            TAB 5: QUIZ
            ========================================================= */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {!showQuizResults ? (
              <>
                {QUIZ_QUESTIONS.map((q, idx) => (
                  <Card key={q.id} className="p-5 bg-white border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex gap-2">
                      <span className="text-rose-600">{idx + 1}.</span> {q.question}
                    </h3>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => setUserAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                          className={`w-full text-left p-3 text-sm rounded-lg border transition-all ${
                            userAnswers[q.id] === optIdx
                              ? 'bg-rose-50 border-rose-500 text-rose-900 font-medium'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </button>
                      ))}
                    </div>
                  </Card>
                ))}
                <div className="flex justify-end mt-2 mb-8">
                  <Button
                    onClick={() => setShowQuizResults(true)}
                    disabled={Object.keys(userAnswers).length !== QUIZ_QUESTIONS.length}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                  >
                    Submit Quiz & View Results
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <Card className="p-6 bg-rose-600 text-white text-center rounded-2xl shadow-lg">
                  <Award className="w-12 h-12 mx-auto mb-2 text-rose-200" />
                  <h2 className="text-2xl font-black mb-1">Quiz Completed!</h2>
                  <p className="text-rose-100 mb-4">You scored {quizScore} out of {QUIZ_QUESTIONS.length}</p>
                  <Button variant="secondary" onClick={() => { setShowQuizResults(false); setUserAnswers({}); }} className="text-rose-900 font-bold bg-white hover:bg-rose-50">
                    <RotateCcw className="w-4 h-4 mr-2" /> Retake Quiz
                  </Button>
                </Card>

                {QUIZ_QUESTIONS.map((q, idx) => {
                  const userAnswer = userAnswers[q.id];
                  const isCorrect = userAnswer === q.correctIndex;
                  return (
                    <Card key={q.id} className={`p-5 border-l-4 shadow-sm ${isCorrect ? 'border-l-emerald-500 bg-white' : 'border-l-rose-500 bg-white'}`}>
                      <h3 className="text-sm font-bold text-slate-900 mb-2">{idx + 1}. {q.question}</h3>
                      <div className="text-xs space-y-1 mb-3">
                        <div className="text-slate-500">Your answer: <span className={isCorrect ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>{q.options[userAnswer]}</span></div>
                        {!isCorrect && <div className="text-slate-500">Correct answer: <span className="text-emerald-600 font-bold">{q.options[q.correctIndex]}</span></div>}
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 border border-slate-100 flex gap-2 items-start">
                        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <p>{q.explanation}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

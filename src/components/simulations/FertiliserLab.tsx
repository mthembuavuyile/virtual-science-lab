import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sprout, RotateCcw, Info, Leaf, Droplets, TestTubeDiagonal, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type TabId = 'soil-test' | 'fertilizer-process' | 'plant-growth';

export default function FertiliserLab() {
  const [activeTab, setActiveTab] = useState<TabId>('soil-test');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'soil-test', label: 'NPK Testing' },
    { id: 'fertilizer-process', label: 'Production' },
    { id: 'plant-growth', label: 'Plant Growth' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-3 lg:p-6 overflow-auto">
      <div className="flex-1 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden min-h-0">
        <div className="p-3 lg:p-4 border-b border-[#F1F5F9] flex justify-between items-center bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 lg:w-5 lg:h-5 text-[#2563EB]" />
            <span className="font-bold text-xs lg:text-sm tracking-tight uppercase text-[#1E293B]">Fertilisers</span>
          </div>
          <Badge variant="outline" className="text-[9px]">UNIT 7</Badge>
        </div>

        <div className="scroll-tabs flex bg-[#F8FAFC] border-b border-[#F1F5F9] px-2 gap-0.5">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-3 lg:px-4 py-2.5 text-[10px] lg:text-xs font-bold uppercase border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.id ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#94A3B8]'
              }`}
            >{t.label}</button>
          ))}
        </div>

        <div className="flex-1 overflow-auto">
          {activeTab === 'soil-test' && <SoilTestPanel />}
          {activeTab === 'fertilizer-process' && <FertilizerProcessPanel />}
          {activeTab === 'plant-growth' && <PlantGrowthPanel />}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[300px] flex flex-col gap-4 shrink-0">
        <Card className="p-4 border-[#E2E8F0] shadow-sm">
          <h3 className="font-bold text-sm lg:text-base tracking-tight mb-3">NPK Reference</h3>
          <div className="space-y-2">
            {[
              { letter: 'N', name: 'Nitrogen', color: 'bg-blue-500', role: 'Leaf & stem growth', deficiency: 'Yellow leaves' },
              { letter: 'P', name: 'Phosphorus', color: 'bg-red-500', role: 'Root & flowering', deficiency: 'Purple leaves' },
              { letter: 'K', name: 'Potassium', color: 'bg-amber-500', role: 'Disease resistance', deficiency: 'Brown edges' },
            ].map(n => (
              <div key={n.letter} className="flex items-start gap-2 p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <div className={`w-6 h-6 ${n.color} rounded-md flex items-center justify-center text-white font-bold text-[10px] shrink-0`}>{n.letter}</div>
                <div>
                  <p className="text-[10px] lg:text-xs font-bold text-[#0F172A]">{n.name}</p>
                  <p className="text-[9px] text-[#64748B]">{n.role}</p>
                  <p className="text-[8px] text-[#94A3B8]">Deficiency: {n.deficiency}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 border-[#E2E8F0] shadow-sm bg-[#1E293B] text-white">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-bold text-xs uppercase tracking-wider">CAPS Context</h3>
          </div>
          <p className="text-[10px] text-blue-100/80 leading-relaxed">
            Fertilisers provide macronutrients (N, P, K) essential for sustainable agriculture in South Africa.
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ────────── SOIL TEST ────────── */

function SoilTestPanel() {
  const [soilType, setSoilType] = useState<'sandy' | 'loam' | 'clay'>('loam');
  const [tested, setTested] = useState(false);

  const profiles = {
    sandy: { n: 15, p: 10, k: 25, ph: 5.5, desc: 'Fast drainage, low retention' },
    loam: { n: 45, p: 40, k: 50, ph: 6.5, desc: 'Balanced drainage & retention' },
    clay: { n: 60, p: 55, k: 35, ph: 7.2, desc: 'Slow drainage, high retention' },
  };
  const profile = profiles[soilType];
  const getStatus = (v: number) => v < 25 ? { label: 'LOW', cls: 'text-red-600 bg-red-50 border-red-200' } : v < 50 ? { label: 'MOD', cls: 'text-amber-600 bg-amber-50 border-amber-200' } : { label: 'OK', cls: 'text-green-600 bg-green-50 border-green-200' };

  return (
    <div className="p-4 lg:p-8">
      <h3 className="text-sm lg:text-lg font-bold text-[#0F172A] mb-4">NPK Soil Analysis</h3>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="space-y-2 w-full lg:w-48">
          <label className="text-[10px] font-bold text-[#64748B] uppercase">Soil Sample</label>
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
            {(['sandy', 'loam', 'clay'] as const).map(s => (
              <button key={s} onClick={() => { setSoilType(s); setTested(false); }}
                className={`p-2 lg:p-3 rounded-xl border text-left transition-all ${soilType === s ? 'border-[#2563EB] bg-blue-50' : 'border-[#E2E8F0]'}`}>
                <span className="text-[10px] lg:text-xs font-bold text-[#0F172A] capitalize block">{s}</span>
                <span className="text-[8px] lg:text-[10px] text-[#94A3B8] hidden lg:block">{profiles[s].desc}</span>
              </button>
            ))}
          </div>
          <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] mt-2" onClick={() => setTested(true)} disabled={tested}>
            <TestTubeDiagonal className="w-4 h-4 mr-1" /> Run Test
          </Button>
        </div>

        <div className="flex-1">
          {!tested ? (
            <div className="h-40 lg:h-full flex items-center justify-center text-[#94A3B8]">
              <div className="text-center">
                <TestTubeDiagonal className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-bold">Select soil & run test</p>
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* pH */}
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase">pH</span>
                  <span className="text-sm font-mono font-bold">{profile.ph}</span>
                </div>
                <div className="flex h-2.5 rounded-full overflow-hidden mt-1.5">
                  <div className="flex-1 bg-red-400" /><div className="flex-1 bg-orange-400" /><div className="flex-1 bg-yellow-400" />
                  <div className="flex-1 bg-green-400" /><div className="flex-1 bg-teal-400" /><div className="flex-1 bg-blue-400" /><div className="flex-1 bg-purple-400" />
                </div>
              </div>

              {/* NPK */}
              {[
                { label: 'Nitrogen (N)', value: profile.n, color: '#3B82F6' },
                { label: 'Phosphorus (P)', value: profile.p, color: '#EF4444' },
                { label: 'Potassium (K)', value: profile.k, color: '#F59E0B' },
              ].map(nut => {
                const status = getStatus(nut.value);
                return (
                  <div key={nut.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] lg:text-xs font-bold">{nut.label}</span>
                      <Badge className={`text-[8px] ${status.cls} border`}>{status.label}</Badge>
                    </div>
                    <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${nut.value}%` }}
                        transition={{ duration: 0.8 }} style={{ backgroundColor: nut.color }} />
                    </div>
                  </div>
                );
              })}

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-[10px] text-blue-800">
                  {profile.n < 30 && 'Add N fertiliser (LAN 28%). '}
                  {profile.p < 30 && 'Add superphosphate. '}
                  {profile.k < 30 && 'Add potassium chloride. '}
                  {profile.n >= 30 && profile.p >= 30 && profile.k >= 30 && 'Nutrients adequate.'}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────── FERTILIZER PROCESS ────────── */

function FertilizerProcessPanel() {
  const [sel, setSel] = useState(0);
  const processes = [
    { name: 'Haber (NH₃)', equation: 'N₂ + 3H₂ ⇌ 2NH₃', conditions: '200 atm, 450°C, Fe catalyst',
      steps: ['N₂ from air', 'H₂ from natural gas', 'Mixed 1:3, compressed', 'Over Fe catalyst at 450°C', 'NH₃ condensed (15-25%)'] },
    { name: 'Ostwald (HNO₃)', equation: '4NH₃ + 5O₂ → 4NO + 6H₂O', conditions: 'Pt-Rh catalyst, 850°C',
      steps: ['NH₃ oxidised to NO over Pt', 'NO → NO₂ with oxygen', 'NO₂ dissolved in water → HNO₃', 'HNO₃ + NH₃ → NH₄NO₃'] },
    { name: 'Contact (H₂SO₄)', equation: '2SO₂ + O₂ ⇌ 2SO₃', conditions: 'V₂O₅ catalyst, 450°C',
      steps: ['Sulfur burned → SO₂', 'SO₂ → SO₃ with V₂O₅', 'SO₃ dissolved in H₂SO₄', 'H₂SO₄ + phosphate rock → fertiliser'] },
  ];
  const proc = processes[sel];

  return (
    <div className="p-4 lg:p-8">
      <h3 className="text-sm lg:text-lg font-bold text-[#0F172A] mb-4">Production Processes</h3>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 lg:w-44">
          {processes.map((p, i) => (
            <button key={i} onClick={() => setSel(i)}
              className={`p-2 rounded-xl border text-left ${sel === i ? 'border-[#2563EB] bg-blue-50' : 'border-[#E2E8F0]'}`}>
              <span className="text-[10px] lg:text-xs font-bold text-[#0F172A] block">{p.name}</span>
            </button>
          ))}
        </div>
        <div className="flex-1 space-y-4">
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <p className="text-xs lg:text-sm font-mono font-bold text-[#0F172A] mb-1">{proc.equation}</p>
            <p className="text-[9px] text-[#64748B]">{proc.conditions}</p>
          </div>
          <div className="space-y-2">
            {proc.steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }} className="flex items-start gap-2">
                <div className="w-5 h-5 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-[9px] font-bold shrink-0">{i + 1}</div>
                <p className="text-[10px] lg:text-xs text-[#475569]">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────── PLANT GROWTH ────────── */

function PlantGrowthPanel() {
  const [nitrogen, setNitrogen] = useState(50);
  const [phosphorus, setPhosphorus] = useState(50);
  const [potassium, setPotassium] = useState(50);
  const [days, setDays] = useState(0);
  const [isGrowing, setIsGrowing] = useState(false);

  const growthScore = useMemo(() => {
    const overall = (nitrogen / 100) * 0.4 + (phosphorus / 100) * 0.3 + (potassium / 100) * 0.3;
    const excess = [nitrogen, phosphorus, potassium].filter(v => v > 80).length;
    return Math.max(0, Math.min(1, overall - excess * 0.05));
  }, [nitrogen, phosphorus, potassium]);

  const plantHeight = Math.min(100, days * growthScore * 5);
  const leafCount = Math.floor(plantHeight / 25);
  const healthColor = plantHeight > 70 ? '#22C55E' : plantHeight > 40 ? '#F59E0B' : '#EF4444';
  const healthLabel = plantHeight > 70 ? 'Healthy' : plantHeight > 40 ? 'Moderate' : 'Poor';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGrowing && days < 30) {
      interval = setInterval(() => setDays(prev => Math.min(30, prev + 1)), 500);
    }
    if (days >= 30) setIsGrowing(false);
    return () => clearInterval(interval);
  }, [isGrowing, days]);

  return (
    <div className="p-4 lg:p-8">
      <h3 className="text-sm lg:text-lg font-bold text-[#0F172A] mb-4">Plant Growth Response</h3>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Controls */}
        <div className="w-full lg:w-48 space-y-4">
          {[
            { label: 'N', value: nitrogen, set: setNitrogen, color: 'text-blue-600' },
            { label: 'P', value: phosphorus, set: setPhosphorus, color: 'text-red-600' },
            { label: 'K', value: potassium, set: setPotassium, color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className={`text-[10px] font-bold ${s.color} uppercase`}>{s.label}</label>
                <span className="text-[10px] font-mono font-bold">{s.value}%</span>
              </div>
              <Slider value={[s.value]} min={0} max={100} step={5} onValueChange={(v) => s.set(v[0])} />
            </div>
          ))}
          <Separator />
          <div className="flex gap-2">
            <Button className={`flex-1 shadow-md text-xs ${isGrowing ? 'bg-[#EF4444]' : 'bg-green-600 hover:bg-green-700'}`}
              onClick={() => setIsGrowing(!isGrowing)} disabled={days >= 30}>
              <Sun className="w-3.5 h-3.5 mr-1" />{isGrowing ? 'Pause' : 'Grow'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setIsGrowing(false); setDays(0); }}>
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-center">
            <p className="text-[9px] font-bold text-[#64748B] uppercase">Day</p>
            <p className="text-xl font-mono font-bold text-[#0F172A]">{days}/30</p>
          </div>
        </div>

        {/* Plant */}
        <div className="flex-1 flex flex-col items-center justify-end">
          <div className="relative w-full max-w-xs h-48 lg:h-56 flex items-end justify-center">
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-amber-800/20 rounded-t-xl border border-amber-800/30" />
            <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-1.5 rounded-t-full"
              animate={{ height: `${plantHeight * 1.5}px`, backgroundColor: healthColor }}
              transition={{ type: 'spring', stiffness: 60 }}
            />
            {[...Array(leafCount)].map((_, i) => (
              <motion.div key={i} className="absolute w-6 h-3 rounded-full" initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{
                  backgroundColor: healthColor + '60', border: `1px solid ${healthColor}`,
                  bottom: `${40 + (i + 1) * 28}px`,
                  left: i % 2 === 0 ? 'calc(50% + 3px)' : undefined,
                  right: i % 2 !== 0 ? 'calc(50% + 3px)' : undefined,
                  transform: `rotate(${i % 2 === 0 ? '-20deg' : '20deg'})`,
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: healthColor }} />
            <span className="text-xs font-bold" style={{ color: healthColor }}>{healthLabel}</span>
            <span className="text-[10px] text-[#94A3B8]">· {plantHeight.toFixed(0)}%</span>
          </div>

          <div className="mt-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] w-full text-center">
            <ul className="space-y-0.5 text-[9px] lg:text-[10px] text-[#475569]">
              {nitrogen < 20 && <li>⚠ Low N: Yellowing leaves</li>}
              {phosphorus < 20 && <li>⚠ Low P: Purple discolouration</li>}
              {potassium < 20 && <li>⚠ Low K: Brown leaf margins</li>}
              {nitrogen > 80 && <li>⚠ Excess N: Leaf burn risk</li>}
              {nitrogen >= 20 && nitrogen <= 80 && phosphorus >= 20 && potassium >= 20 && <li>✓ Balanced conditions</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

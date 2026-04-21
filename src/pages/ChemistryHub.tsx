import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Beaker,
  Activity,
  Scale,
  FlaskConical,
  Zap,
  Factory,
  Sprout,
  ArrowRight,
} from 'lucide-react';

interface UnitCard {
  title: string;
  unit: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  priority: 'Critical' | 'High' | 'Standard';
  description: string;
  simulations: string[];
}

const units: UnitCard[] = [
  {
    title: 'Organic Compounds & Macromolecules',
    unit: 'Unit 1',
    path: '/app/chemistry/organic',
    icon: Beaker,
    gradient: 'from-teal-500 to-emerald-600',
    priority: 'Standard',
    description: 'Solubility, boiling points, viscosity, reactions, polymers, and plastic properties.',
    simulations: ['Solubility Testing', 'Boiling Point Chart', 'Viscosity Comparison', 'Reaction Behaviour', 'Polymer Formation', 'Plastic Properties'],
  },
  {
    title: 'Rate & Extent of Reactions',
    unit: 'Unit 2',
    path: '/app/chemistry/rates',
    icon: Activity,
    gradient: 'from-orange-500 to-red-600',
    priority: 'High',
    description: 'Temperature, concentration, surface area, catalysts — collision theory in action.',
    simulations: ['Collision Theory Lab', 'Particle Animation', 'Reaction Graphs', 'Temperature Effect', 'Catalyst Toggle'],
  },
  {
    title: 'Chemical Equilibrium',
    unit: 'Unit 3',
    path: '/app/chemistry/equilibrium',
    icon: Scale,
    gradient: 'from-violet-500 to-purple-600',
    priority: 'High',
    description: 'Le Châtelier\'s principle — shift equilibrium by changing conditions.',
    simulations: ['Cobalt Chloride System', 'Iron Thiocyanate', 'N₂O₄/NO₂ System', 'Colour Change', 'Shift Analysis'],
  },
  {
    title: 'Acids and Bases',
    unit: 'Unit 4',
    path: '/app/chemistry/acids-bases',
    icon: FlaskConical,
    gradient: 'from-pink-500 to-rose-600',
    priority: 'Critical',
    description: 'pH titration, indicator tests, strong vs weak acid comparison.',
    simulations: ['pH Simulator', 'Titration Lab', 'Indicator Colours', 'Precipitate Mixing', 'Titration Curve'],
  },
  {
    title: 'Electrochemistry',
    unit: 'Unit 5',
    path: '/app/chemistry/electrochemistry',
    icon: Zap,
    gradient: 'from-blue-500 to-indigo-600',
    priority: 'Critical',
    description: 'Galvanic cells, electrolytic cells, EMF series, and ion flow.',
    simulations: ['Galvanic Cell', 'Electrolytic Cell', 'CuSO₄ Electrolysis', 'NaCl Electrolysis', 'Metal Reactivity'],
  },
  {
    title: 'Chlor-Alkali Industry',
    unit: 'Unit 6',
    path: '/app/chemistry/chlor-alkali',
    icon: Factory,
    gradient: 'from-slate-500 to-gray-700',
    priority: 'Standard',
    description: 'Industrial brine electrolysis producing Cl₂, H₂, and NaOH.',
    simulations: ['Membrane Cell', 'Production Tracking', 'Product Uses'],
  },
  {
    title: 'Fertilisers',
    unit: 'Unit 7',
    path: '/app/chemistry/fertilisers',
    icon: Sprout,
    gradient: 'from-lime-500 to-green-600',
    priority: 'Standard',
    description: 'NPK analysis, fertiliser production, and plant growth modelling.',
    simulations: ['NPK Soil Testing', 'Haber Process', 'Ostwald Process', 'Plant Growth Sim'],
  },
];

export default function ChemistryHub() {
  const navigate = useNavigate();

  const priorityColor = (p: string) => {
    if (p === 'Critical') return 'bg-red-50 text-red-700 border-red-200';
    if (p === 'High') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 mb-2 flex items-center gap-2 lg:gap-3">
          <div className="bg-pink-100 p-1.5 lg:p-2 rounded-lg">
            <Beaker className="text-pink-600 w-5 h-5 lg:w-6 lg:h-6" />
          </div>
          Chemistry Laboratory
        </h1>
        <p className="text-slate-500 text-xs lg:text-sm">
          All 7 CAPS-aligned chemistry units. Select a unit to enter its interactive simulation environment.
        </p>
      </div>

      {/* Unit Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {units.map((unit, i) => (
          <motion.div
            key={unit.path}
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(unit.path)}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
          >
            {/* Gradient Top */}
            <div className={`h-24 bg-gradient-to-br ${unit.gradient} flex items-center justify-between px-5 relative overflow-hidden`}>
              <div>
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">{unit.unit}</span>
                <div className={`inline-flex ml-2 text-[9px] font-bold px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-sm`}>
                  {unit.priority}
                </div>
              </div>
              <unit.icon className="text-white w-10 h-10 opacity-80 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">{unit.title}</h3>
              <p className="text-xs text-slate-500 flex-1 mb-4">{unit.description}</p>

              {/* Simulation pills */}
              <div className="flex flex-wrap gap-1 mb-4">
                {unit.simulations.slice(0, 3).map(s => (
                  <span key={s} className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{s}</span>
                ))}
                {unit.simulations.length > 3 && (
                  <span className="text-[9px] font-bold text-slate-400 px-1">+{unit.simulations.length - 3}</span>
                )}
              </div>

              <div className="text-xs font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                Open Lab <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

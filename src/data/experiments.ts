import React from 'react';
import { 
  LucideIcon, 
  Beaker, 
  Zap, 
  Activity, 
  FlaskConical, 
  Scale, 
  Factory, 
  Sprout, 
  CircleDot,
  Rocket,
  Atom
} from 'lucide-react';

export type Discipline = 'Chemistry' | 'Physics';

export interface LabEntry {
  id: string;
  title: string;
  discipline: Discipline;
  grade: 10 | 11 | 12;
  unit: string;
  unitTitle: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  priority: 'Critical' | 'High' | 'Standard';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  simulations: string[];
  /** Lazy-loaded React component for this lab */
  component: React.LazyExoticComponent<React.ComponentType<any>>;
}

// ─── Chemistry Labs ───────────────────────────────────────────────

const OrganicCompoundsLab = React.lazy(() => import('../components/simulations/OrganicCompoundsLab'));
const ReactionRateLab = React.lazy(() => import('../components/simulations/ReactionRateLab'));
const EquilibriumLab = React.lazy(() => import('../components/simulations/EquilibriumLab'));
const AcidsBasesPage = React.lazy(() => import('../pages/AcidsBasesPage'));
const ElectrochemistryPage = React.lazy(() => import('../pages/ElectrochemistryPage'));
const ChlorAlkaliLab = React.lazy(() => import('../components/simulations/ChlorAlkaliLab'));
const FertiliserLab = React.lazy(() => import('../components/simulations/FertiliserLab'));

// ─── Physics Labs ─────────────────────────────────────────────────

const OhmsLawLab = React.lazy(() => import('../components/simulations/OhmsLawLab'));
const ProjectileMotionLab = React.lazy(() => import('../components/simulations/ProjectileMotionLab'));
const Electrodynamics3D = React.lazy(() => import('../components/simulations/Electrodynamics3D'));

// ─── Lab Registry ─────────────────────────────────────────────────

export const labRegistry: LabEntry[] = [
  // ── Chemistry ──
  {
    id: 'organic',
    title: 'Organic Compounds & Macromolecules',
    discipline: 'Chemistry',
    grade: 12,
    unit: 'Unit 1',
    unitTitle: 'Organic Chemistry',
    description: 'Solubility, boiling points, viscosity, reactions, polymers, and plastic properties.',
    icon: Beaker,
    gradient: 'from-teal-500 to-emerald-600',
    priority: 'Standard',
    difficulty: 'Easy',
    simulations: ['Solubility Testing', 'Boiling Point Chart', 'Viscosity Comparison', 'Reaction Behaviour', 'Polymer Formation', 'Plastic Properties'],
    component: OrganicCompoundsLab,
  },
  {
    id: 'rates',
    title: 'Rate & Extent of Reactions',
    discipline: 'Chemistry',
    grade: 12,
    unit: 'Unit 2',
    unitTitle: 'Reaction Kinetics',
    description: 'Temperature, concentration, surface area, catalysts — collision theory in action.',
    icon: Activity,
    gradient: 'from-orange-500 to-red-600',
    priority: 'High',
    difficulty: 'Medium',
    simulations: ['Collision Theory Lab', 'Particle Animation', 'Reaction Graphs', 'Temperature Effect', 'Catalyst Toggle'],
    component: ReactionRateLab,
  },
  {
    id: 'equilibrium',
    title: 'Chemical Equilibrium',
    discipline: 'Chemistry',
    grade: 12,
    unit: 'Unit 3',
    unitTitle: 'Chemical Equilibrium',
    description: "Le Châtelier's principle — shift equilibrium by changing conditions.",
    icon: Scale,
    gradient: 'from-violet-500 to-purple-600',
    priority: 'High',
    difficulty: 'Hard',
    simulations: ['Cobalt Chloride System', 'Iron Thiocyanate', 'N₂O₄/NO₂ System', 'Colour Change', 'Shift Analysis'],
    component: EquilibriumLab,
  },
  {
    id: 'acids-bases',
    title: 'Acids and Bases',
    discipline: 'Chemistry',
    grade: 12,
    unit: 'Unit 4',
    unitTitle: 'Acids & Bases',
    description: 'pH titration, indicator tests, strong vs weak acid comparison.',
    icon: FlaskConical,
    gradient: 'from-pink-500 to-rose-600',
    priority: 'Critical',
    difficulty: 'Medium',
    simulations: ['pH Simulator', 'Titration Lab', 'Indicator Colours', 'Precipitate Mixing', 'Titration Curve'],
    component: AcidsBasesPage,
  },
  {
    id: 'electrochemistry',
    title: 'Electrochemistry',
    discipline: 'Chemistry',
    grade: 12,
    unit: 'Unit 5',
    unitTitle: 'Electrochemistry',
    description: 'Galvanic cells, electrolytic cells, EMF series, and ion flow.',
    icon: Zap,
    gradient: 'from-blue-500 to-indigo-600',
    priority: 'Critical',
    difficulty: 'Hard',
    simulations: ['Galvanic Cell', 'Electrolytic Cell', 'CuSO₄ Electrolysis', 'NaCl Electrolysis', 'Metal Reactivity'],
    component: ElectrochemistryPage,
  },
  {
    id: 'chlor-alkali',
    title: 'Chlor-Alkali Industry',
    discipline: 'Chemistry',
    grade: 12,
    unit: 'Unit 6',
    unitTitle: 'Industrial Chemistry',
    description: 'Industrial brine electrolysis producing Cl₂, H₂, and NaOH.',
    icon: Factory,
    gradient: 'from-slate-500 to-gray-700',
    priority: 'Standard',
    difficulty: 'Medium',
    simulations: ['Membrane Cell', 'Production Tracking', 'Product Uses'],
    component: ChlorAlkaliLab,
  },
  {
    id: 'fertilisers',
    title: 'Fertilisers & Soil Science',
    discipline: 'Chemistry',
    grade: 12,
    unit: 'Unit 7',
    unitTitle: 'Fertilisers',
    description: 'NPK analysis, fertiliser production, and plant growth modelling.',
    icon: Sprout,
    gradient: 'from-lime-500 to-green-600',
    priority: 'Standard',
    difficulty: 'Easy',
    simulations: ['NPK Soil Testing', 'Haber Process', 'Ostwald Process', 'Plant Growth Sim'],
    component: FertiliserLab,
  },

  // ── Physics ──
  {
    id: 'ohms-law',
    title: "Ohm's Law Circuit",
    discipline: 'Physics',
    grade: 11,
    unit: 'Unit 1',
    unitTitle: 'Electric Circuits',
    description: 'Construct a simple circuit and explore the relationship between voltage, current, and resistance.',
    icon: CircleDot,
    gradient: 'from-sky-500 to-blue-600',
    priority: 'Critical',
    difficulty: 'Medium',
    simulations: ['Live Circuit Diagram', 'Electron Flow Animation', 'V-I Graph', 'Power Calculation'],
    component: OhmsLawLab,
  },
  {
    id: 'projectile-motion',
    title: 'Projectile Motion',
    discipline: 'Physics',
    grade: 12,
    unit: 'Unit 2',
    unitTitle: '2D Kinematics',
    description: 'Launch a projectile and analyze trajectory, max height, range, and flight time.',
    icon: Rocket,
    gradient: 'from-amber-500 to-orange-600',
    priority: 'High',
    difficulty: 'Medium',
    simulations: ['Trajectory Canvas', 'Height vs Distance Graph', 'Drag Toggle', 'Multi-Gravity Environments'],
    component: ProjectileMotionLab,
  },
  {
    id: 'electrodynamics',
    title: '3D Electrodynamics',
    discipline: 'Physics',
    grade: 12,
    unit: 'Unit 3',
    unitTitle: 'Electrodynamics',
    description: 'Explore 3D electromagnetic field visualization and motor principles.',
    icon: Atom,
    gradient: 'from-fuchsia-500 to-purple-600',
    priority: 'High',
    difficulty: 'Hard',
    simulations: ['3D Field Visualizer', 'Motor Principle', 'Force Vectors'],
    component: Electrodynamics3D,
  },
];

/** Look up a single lab by its ID */
export function getLabById(id: string): LabEntry | undefined {
  return labRegistry.find(lab => lab.id === id);
}

/** Get all unique disciplines present in the registry */
export function getDisciplines(): Discipline[] {
  return [...new Set(labRegistry.map(l => l.discipline))];
}

/** Get all unique grades present in the registry */
export function getGrades(): number[] {
  return [...new Set(labRegistry.map(l => l.grade))].sort();
}

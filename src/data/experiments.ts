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
  Atom,
  Compass,
  Waves,
  Flame,
  Droplets,
  Globe,
  Shuffle,
  Gauge,
  Combine,
  Lightbulb,
  Sun,
  Volume2,
  Mountain
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

// ─── Chemistry Labs (Full Simulations) ─────────────────────────────

const HeatingCoolingCurveLab = React.lazy(() => import('../components/simulations/HeatingCoolingCurveLab'));
const AtomPeriodicLab = React.lazy(() => import('../components/simulations/AtomPeriodicLab'));
const ChemicalBondingLab = React.lazy(() => import('../components/simulations/ChemicalBondingLab'));
const OrganicCompoundsLab = React.lazy(() => import('../components/simulations/OrganicCompoundsLab'));
const ReactionRateLab = React.lazy(() => import('../components/simulations/ReactionRateLab'));
const EquilibriumLab = React.lazy(() => import('../components/simulations/EquilibriumLab'));
const AcidsBasesPage = React.lazy(() => import('../pages/AcidsBasesPage'));
const ElectrochemistryPage = React.lazy(() => import('../pages/ElectrochemistryPage'));
const ChlorAlkaliLab = React.lazy(() => import('../components/simulations/ChlorAlkaliLab'));
const FertiliserLab = React.lazy(() => import('../components/simulations/FertiliserLab'));
const HydrosphereLab = React.lazy(() => import('../components/simulations/HydrosphereLab'));

// ─── Physics Labs (Full Simulations) ───────────────────────────────

const OhmsLawLab = React.lazy(() => import('../components/simulations/OhmsLawLab'));
const ProjectileMotionLab = React.lazy(() => import('../components/simulations/ProjectileMotionLab'));
const Electrodynamics3D = React.lazy(() => import('../components/simulations/Electrodynamics3D'));
const MomentumLab = React.lazy(() => import('../components/simulations/MomentumLab'));

// ─── Unified Curriculum Integration Guide Component ─────────────────

const SyllabusIntegrationLab = React.lazy(() => import('../features/simulations/components/SyllabusIntegrationLab'));

// ─── Lab Registry ─────────────────────────────────────────────────

export const labRegistry: LabEntry[] = [
  // ==========================================
  // GRADE 10 - CHEMISTRY
  // ==========================================
  {
    id: 'g10-heating-curves',
    title: 'Heating and Cooling Curves',
    discipline: 'Chemistry',
    grade: 10,
    unit: 'Unit 1',
    unitTitle: 'Matter & Materials',
    description: 'Melting ice or stearic acid, logging temperature over time to plot phase transitions.',
    icon: Flame,
    gradient: 'from-orange-400 to-amber-500',
    priority: 'Critical',
    difficulty: 'Easy',
    simulations: ['Heating Stearic Acid', 'Melting Ice', 'Cooling Curve', 'Latent Heat Analysis'],
    component: HeatingCoolingCurveLab,
  },
  {
    id: 'g10-atom-periodic',
    title: 'The Atom & Periodic Table',
    discipline: 'Chemistry',
    grade: 10,
    unit: 'Unit 2',
    unitTitle: 'Atomic Structure',
    description: 'Explore isotopes, electron configuration (Aufbau), and periodic trends.',
    icon: Atom,
    gradient: 'from-blue-400 to-indigo-500',
    priority: 'High',
    difficulty: 'Easy',
    simulations: ['Isotope Builder', 'Electron Configuration', 'Periodic Trends Tracker'],
    component: AtomPeriodicLab,
  },
  {
    id: 'g10-chemical-bonding',
    title: 'Chemical Bonding',
    discipline: 'Chemistry',
    grade: 10,
    unit: 'Unit 3',
    unitTitle: 'Chemical Bonding',
    description: 'Investigate ionic, covalent, and metallic bonds and how they share or transfer electrons.',
    icon: Shuffle,
    gradient: 'from-purple-400 to-pink-500',
    priority: 'High',
    difficulty: 'Medium',
    simulations: ['Covalent Dot structures', 'Ionic Lattice Builder', 'Metallic Electron Sea'],
    component: ChemicalBondingLab,
  },
  {
    id: 'g10-aqueous-reactions',
    title: 'Reactions in Aqueous Solutions',
    discipline: 'Chemistry',
    grade: 10,
    unit: 'Unit 4',
    unitTitle: 'Aqueous Reactions',
    description: 'Understand precipitation, acid-base neutralisation, and redox reactions in water.',
    icon: Droplets,
    gradient: 'from-sky-400 to-teal-500',
    priority: 'Standard',
    difficulty: 'Medium',
    simulations: ['Precipitation Mixer', 'Redox Ion Transfer', 'Conductivity Tester'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'g10-stoichiometry-intro',
    title: 'Quantitative Aspects: The Mole',
    discipline: 'Chemistry',
    grade: 10,
    unit: 'Unit 5',
    unitTitle: 'Stoichiometry Intro',
    description: 'An introduction to the mole, molar mass, calculations, and basic stoichiometric ratios.',
    icon: Scale,
    gradient: 'from-emerald-400 to-teal-600',
    priority: 'High',
    difficulty: 'Medium',
    simulations: ['Molar Mass Calculator', 'Mole-to-Gram Balance', 'Stoichiometry Sandbox'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'g10-hydrosphere',
    title: 'The Hydrosphere',
    discipline: 'Chemistry',
    grade: 10,
    unit: 'Unit 6',
    unitTitle: 'Hydrosphere',
    description: 'Explore the hydrological cycle, water budget, 6-stage purification, qualitative ion testing (Cl⁻, SO₄²⁻, CO₃²⁻, NO₃⁻), salinity conductivity, and AMD remediation.',
    icon: Globe,
    gradient: 'from-blue-500 to-cyan-500',
    priority: 'High',
    difficulty: 'Medium',
    simulations: ['Water Cycle & Global Budget', 'Municipal Purification Plant', 'Qualitative Ion Testing Rack', 'Conductivity & Salinity Rig', 'AMD & Eutrophication Remediation', 'CAPS Exam Prep Quiz'],
    component: HydrosphereLab,
  },

  // ==========================================
  // GRADE 10 - PHYSICS
  // ==========================================
  {
    id: 'g10-vectors',
    title: 'Vectors and Scalars in 1D',
    discipline: 'Physics',
    grade: 10,
    unit: 'Unit 1',
    unitTitle: 'Mechanics (1D)',
    description: 'Learn direction, magnitude, resultant vectors, and displacement in one dimension.',
    icon: Compass,
    gradient: 'from-teal-400 to-emerald-500',
    priority: 'Standard',
    difficulty: 'Easy',
    simulations: ['1D Vector Addition', 'Resultant Calculator', 'Displacement Map'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'g10-motion-1d',
    title: 'Motion in One Dimension',
    discipline: 'Physics',
    grade: 10,
    unit: 'Unit 2',
    unitTitle: 'Kinematics',
    description: 'Plot kinematics graphs (x-t, v-t, a-t). Tech integration: Tracker Video Analysis.',
    icon: Gauge,
    gradient: 'from-orange-500 to-red-500',
    priority: 'Critical',
    difficulty: 'Medium',
    simulations: ['Kinematics Plotter', 'Tracker Video Analyzer', 'Ticker-Timer Simulator'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'g10-mechanical-energy',
    title: 'Mechanical Energy',
    discipline: 'Physics',
    grade: 10,
    unit: 'Unit 3',
    unitTitle: 'Energy Conservation',
    description: 'Potential energy, kinetic energy, and verifying the Conservation of Mechanical Energy.',
    icon: Zap,
    gradient: 'from-amber-400 to-orange-500',
    priority: 'High',
    difficulty: 'Medium',
    simulations: ['Skate Ramp Conservation', 'Free Fall Energy Tracker', 'Pendulum Energy swing'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'g10-waves-sound',
    title: 'Waves, Sound, and Light',
    discipline: 'Physics',
    grade: 10,
    unit: 'Unit 4',
    unitTitle: 'Waves & Sound',
    description: 'Transverse/longitudinal wave equations. Tech integration: Phyphox microphone frequency tests.',
    icon: Waves,
    gradient: 'from-sky-500 to-indigo-500',
    priority: 'Standard',
    difficulty: 'Medium',
    simulations: ['Wave Waveforms Canvas', 'Phyphox Wave Frequency', 'Electromagnetic Spectrum'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'g10-circuits',
    title: 'Electricity & Circuits (Intro)',
    discipline: 'Physics',
    grade: 10,
    unit: 'Unit 5',
    unitTitle: 'Electrostatics & DC',
    description: 'Introduction to basic series/parallel circuits. Tech integration: PhET Construction Kit.',
    icon: CircleDot,
    gradient: 'from-rose-400 to-pink-600',
    priority: 'High',
    difficulty: 'Easy',
    simulations: ['PhET Circuit Builder', 'Series vs Parallel', 'Current flow animations'],
    component: SyllabusIntegrationLab,
  },

  // ==========================================
  // GRADE 11 - CHEMISTRY
  // ==========================================
  {
    id: 'g11-intermolecular',
    title: 'Intermolecular Forces & VSEPR',
    discipline: 'Chemistry',
    grade: 11,
    unit: 'Unit 1',
    unitTitle: 'Molecular Structure',
    description: 'Molecular shapes, VSEPR, and test evaporation rates of Water vs Ethanol vs Acetone.',
    icon: Combine,
    gradient: 'from-purple-500 to-indigo-600',
    priority: 'Critical',
    difficulty: 'Hard',
    simulations: ['Evaporation Rate Lab', 'VSEPR Molecular Shapes', 'Surface Tension Test'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'g11-ideal-gases',
    title: "Ideal Gases: Boyle's Law",
    discipline: 'Chemistry',
    grade: 11,
    unit: 'Unit 2',
    unitTitle: 'Gas Laws',
    description: 'Relation between pressure, volume, temperature. Tech integration: PhET Gas Properties.',
    icon: Gauge,
    gradient: 'from-teal-500 to-cyan-600',
    priority: 'High',
    difficulty: 'Medium',
    simulations: ["Boyle's Law Syringe", "Charles's Law Balloon", "Gay-Lussac's Law Chamber"],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'g11-quantitative',
    title: 'Quantitative Chemistry',
    discipline: 'Chemistry',
    grade: 11,
    unit: 'Unit 3',
    unitTitle: 'Quantitative Chem',
    description: 'Calculate concentrations, limiting reagents, and percentage yields for reactions.',
    icon: Scale,
    gradient: 'from-emerald-500 to-green-600',
    priority: 'High',
    difficulty: 'Hard',
    simulations: ['Limiting Reagent Balance', 'Concentration Calculator', 'Percentage Yield Lab'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'g11-acids-bases',
    title: 'Acids and Bases (Grade 11)',
    discipline: 'Chemistry',
    grade: 11,
    unit: 'Unit 4',
    unitTitle: 'Acids & Bases',
    description: 'Study properties, neutralisation reactions, and basic titrations of acids/bases.',
    icon: FlaskConical,
    gradient: 'from-pink-400 to-red-500',
    priority: 'Standard',
    difficulty: 'Medium',
    simulations: ['Acid-Base Indicator Lab', 'Neutralisation Reactions', 'pH dilution simulator'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'g11-lithosphere',
    title: 'The Lithosphere: Mining',
    discipline: 'Chemistry',
    grade: 11,
    unit: 'Unit 5',
    unitTitle: 'Lithosphere',
    description: 'Mining and chemical processing of minerals (Gold, Platinum, Coal) in South Africa.',
    icon: Mountain,
    gradient: 'from-amber-600 to-yellow-700',
    priority: 'Standard',
    difficulty: 'Easy',
    simulations: ['Mineral Extraction Lab', 'Blast Furnace Chemistry', 'Environmental Audit'],
    component: SyllabusIntegrationLab,
  },

  // ==========================================
  // GRADE 11 - PHYSICS
  // ==========================================
  {
    id: 'g11-vectors-2d',
    title: 'Vectors in 2D',
    discipline: 'Physics',
    grade: 11,
    unit: 'Unit 1',
    unitTitle: '2D Mechanics',
    description: 'Resolving vectors into perpendicular X and Y components and finding resultants.',
    icon: Compass,
    gradient: 'from-cyan-500 to-blue-600',
    priority: 'High',
    difficulty: 'Hard',
    simulations: ['2D Component Resolver', 'Vector Force Table', 'Resultant Calculator'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'g11-newton-laws',
    title: "Newton's Laws of Motion",
    discipline: 'Physics',
    grade: 11,
    unit: 'Unit 2',
    unitTitle: 'Newtonian Mechanics',
    description: "Newton's 1st, 2nd, and 3rd laws. Tech integration: Phyphox trolley acceleration.",
    icon: Sprout, // Using Sprout or Activity or Lucide icon
    gradient: 'from-orange-500 to-amber-600',
    priority: 'Critical',
    difficulty: 'Hard',
    simulations: ["Newton's Second Law Trolley", 'Fnet = ma Plotter', 'Universal Gravitation'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'g11-optics',
    title: 'Geometrical Optics: Refraction',
    discipline: 'Physics',
    grade: 11,
    unit: 'Unit 3',
    unitTitle: 'Optics',
    description: "Refraction, Snell's law, and critical angles. Tracing laser through glass block.",
    icon: Lightbulb,
    gradient: 'from-amber-400 to-yellow-500',
    priority: 'High',
    difficulty: 'Medium',
    simulations: ["Snell's Law Prism Tracing", 'Critical Angle Finder', 'Refractive Index Table'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'g11-electrostatics',
    title: 'Electrostatics',
    discipline: 'Physics',
    grade: 11,
    unit: 'Unit 4',
    unitTitle: 'Electrostatics',
    description: "Coulomb's Law, charge conservation, and electric field lines between charges.",
    icon: Zap,
    gradient: 'from-blue-600 to-indigo-700',
    priority: 'Standard',
    difficulty: 'Medium',
    simulations: ["Coulomb's Law Scale", 'Electric Field Visualizer', 'Charge Distribution'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'g11-electromagnetism',
    title: 'Electromagnetism: Faraday',
    discipline: 'Physics',
    grade: 11,
    unit: 'Unit 5',
    unitTitle: 'Electromagnetism',
    description: "Faraday's Law of induction. Move a magnet through a coil to induce EMF.",
    icon: Atom,
    gradient: 'from-fuchsia-600 to-purple-700',
    priority: 'Standard',
    difficulty: 'Medium',
    simulations: ['Faraday Induction Coil', 'Magnetic Flux Visualizer', 'Lenz Law Simulation'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'ohms-law',
    title: "Ohm's Law Circuit",
    discipline: 'Physics',
    grade: 11,
    unit: 'Unit 6',
    unitTitle: 'Electric Circuits',
    description: 'Construct a simple circuit and explore the relationship between voltage, current, and resistance.',
    icon: CircleDot,
    gradient: 'from-sky-500 to-blue-600',
    priority: 'Critical',
    difficulty: 'Medium',
    simulations: ['Live Circuit Diagram', 'Electron Flow Animation', 'V-I Graph', 'Power Calculation'],
    component: OhmsLawLab,
  },

  // ==========================================
  // GRADE 12 - CHEMISTRY
  // ==========================================
  {
    id: 'organic',
    title: 'Organic Compounds & Reactions',
    discipline: 'Chemistry',
    grade: 12,
    unit: 'Unit 1',
    unitTitle: 'Organic Chemistry',
    description: 'IUPAC naming, intermolecular forces (evaporation/boiling points), and Esterification.',
    icon: Beaker,
    gradient: 'from-teal-500 to-emerald-600',
    priority: 'Critical',
    difficulty: 'Medium',
    simulations: ['Solubility Testing', 'Boiling Point Chart', 'Viscosity Comparison', 'Reaction Behaviour', 'Esterification Lab'],
    component: OrganicCompoundsLab,
  },
  {
    id: 'rates',
    title: 'Rate & Extent of Reactions',
    discipline: 'Chemistry',
    grade: 12,
    unit: 'Unit 2',
    unitTitle: 'Reaction Kinetics',
    description: 'Temperature, concentration, surface area, catalysts. Tech: Disappearing cross lab.',
    icon: Activity,
    gradient: 'from-orange-500 to-red-600',
    priority: 'High',
    difficulty: 'Medium',
    simulations: ['Collision Theory Lab', 'Particle Animation', 'Reaction Graphs', 'Disappearing Cross Sim'],
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
    simulations: ['Cobalt Chloride System', 'Iron Thiocyanate', 'N₂O₄/NO₂ System', 'Shift Analysis'],
    component: EquilibriumLab,
  },
  {
    id: 'acids-bases',
    title: 'Acids & Bases (Matric Titration)',
    discipline: 'Chemistry',
    grade: 12,
    unit: 'Unit 4',
    unitTitle: 'Acids & Bases',
    description: 'pH titration curves, indicator selections, strong vs weak comparisons.',
    icon: FlaskConical,
    gradient: 'from-pink-500 to-rose-600',
    priority: 'Critical',
    difficulty: 'Medium',
    simulations: ['pH Simulator', 'Titration Lab', 'Indicator Colours', 'Titration Curve'],
    component: AcidsBasesPage,
  },
  {
    id: 'electrochemistry',
    title: 'Electrochemical Cells',
    discipline: 'Chemistry',
    grade: 12,
    unit: 'Unit 5',
    unitTitle: 'Electrochemistry',
    description: 'Galvanic cells, electrolytic cells, EMF calculations, and ion flow.',
    icon: Zap,
    gradient: 'from-blue-500 to-indigo-600',
    priority: 'Critical',
    difficulty: 'Hard',
    simulations: ['Galvanic Cell', 'Electrolytic Cell', 'CuSO₄ Electrolysis', 'Metal Reactivity'],
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
    title: 'Fertilisers: Industrial Chem',
    discipline: 'Chemistry',
    grade: 12,
    unit: 'Unit 7',
    unitTitle: 'Fertilisers',
    description: 'Haber, Ostwald, Contact processes. NPK chemical ratio analysis and plant growth.',
    icon: Sprout,
    gradient: 'from-lime-500 to-green-600',
    priority: 'Standard',
    difficulty: 'Easy',
    simulations: ['Haber Process', 'Ostwald Process', 'Contact Process', 'NPK Soil Testing'],
    component: FertiliserLab,
  },

  // ==========================================
  // GRADE 12 - PHYSICS
  // ==========================================
  {
    id: 'g12-momentum',
    title: 'Conservation of Momentum',
    discipline: 'Physics',
    grade: 12,
    unit: 'Unit 1',
    unitTitle: 'Momentum & Impulse',
    description: 'Elastic and inelastic collisions of trolleys. Tech: Video collision analysis.',
    icon: Activity,
    gradient: 'from-rose-500 to-red-600',
    priority: 'High',
    difficulty: 'Medium',
    simulations: ['Trolley Collision Lab', 'Elastic vs Inelastic', 'Momentum Conservation Table'],
    component: MomentumLab,
  },
  {
    id: 'projectile-motion',
    title: 'Vertical Projectile Motion',
    discipline: 'Physics',
    grade: 12,
    unit: 'Unit 2',
    unitTitle: '2D Kinematics',
    description: 'Launch a projectile and analyze trajectory, free-fall graphs (y-t, v-t, a-t).',
    icon: Rocket,
    gradient: 'from-amber-500 to-orange-600',
    priority: 'High',
    difficulty: 'Medium',
    simulations: ['Trajectory Canvas', 'Height vs Distance Graph', 'Drag Toggle', 'Multi-Gravity Environments'],
    component: ProjectileMotionLab,
  },
  {
    id: 'g12-work-energy',
    title: 'Work, Energy, and Power',
    discipline: 'Physics',
    grade: 12,
    unit: 'Unit 3',
    unitTitle: 'Work & Energy',
    description: 'Work-Energy Theorem, non-conservative forces, power calculations.',
    icon: Zap,
    gradient: 'from-emerald-500 to-teal-600',
    priority: 'High',
    difficulty: 'Hard',
    simulations: ['Work-Energy Theorem Scale', 'Incline Plane Friction', 'Power rating simulator'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'g12-doppler',
    title: 'The Doppler Effect',
    discipline: 'Physics',
    grade: 12,
    unit: 'Unit 4',
    unitTitle: 'Waves & Sound',
    description: 'Pitch shifts of moving sound sources. Tech: Phyphox / pitch spectrum analyzer.',
    icon: Volume2,
    gradient: 'from-indigo-500 to-purple-600',
    priority: 'High',
    difficulty: 'Easy',
    simulations: ['Moving Sound Source wave compression', 'Siren apparent frequency shift', 'Doppler Formula Solver'],
    component: SyllabusIntegrationLab,
  },
  {
    id: 'electrodynamics',
    title: '3D Electrodynamics',
    discipline: 'Physics',
    grade: 12,
    unit: 'Unit 5',
    unitTitle: 'Electrodynamics',
    description: 'Explore 3D electromagnetic field visualization, AC/DC generators, and motors.',
    icon: Atom,
    gradient: 'from-fuchsia-500 to-purple-600',
    priority: 'High',
    difficulty: 'Hard',
    simulations: ['3D Field Visualizer', 'Motor Principle', 'Force Vectors'],
    component: Electrodynamics3D,
  },
  {
    id: 'g12-optical-phenomena',
    title: 'Photoelectric Effect',
    discipline: 'Physics',
    grade: 12,
    unit: 'Unit 6',
    unitTitle: 'Optical Phenomena',
    description: 'Shine light on metal plates to eject electrons, proving wave-particle duality.',
    icon: Sun,
    gradient: 'from-yellow-500 to-amber-600',
    priority: 'Critical',
    difficulty: 'Hard',
    simulations: ['Photoelectric Cell', 'Frequency Threshold Slider', 'Kinetic Energy vs Frequency Graph'],
    component: SyllabusIntegrationLab,
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

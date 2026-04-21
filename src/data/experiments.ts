import { LucideIcon, Beaker, Zap, Activity, FlaskConical, Scale, Factory, Sprout } from 'lucide-react';

export type Subject = 'Physical Sciences';

export type Unit = 
  | 'Organic Compounds' 
  | 'Rate & Extent of Reactions' 
  | 'Chemical Equilibrium' 
  | 'Acids and Bases' 
  | 'Electrochemistry' 
  | 'Chlor-Alkali Industry' 
  | 'Fertilisers';

export interface Experiment {
  id: string;
  title: string;
  subject: Subject;
  unit: Unit;
  description: string;
  icon: LucideIcon;
  priority: 'High' | 'Critical' | 'Standard';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const experiments: Experiment[] = [
  {
    id: 'titration-lab',
    title: 'Acid-Base Titration',
    subject: 'Physical Sciences',
    unit: 'Acids and Bases',
    description: 'Determine the concentration of an unknown acid using a standard base solution and indicators.',
    icon: FlaskConical,
    priority: 'Critical',
    difficulty: 'Medium',
  },
  {
    id: 'reaction-rates',
    title: 'Reaction Rates & Collision Theory',
    subject: 'Physical Sciences',
    unit: 'Rate & Extent of Reactions',
    description: 'Explore how temperature, concentration, and surface area affect the rate of a chemical reaction.',
    icon: Activity,
    priority: 'High',
    difficulty: 'Medium',
  },
  {
    id: 'galvanic-cell',
    title: 'Galvanic Cell Construction',
    subject: 'Physical Sciences',
    unit: 'Electrochemistry',
    description: 'Build a voltaic cell and measure the potential difference between different metal electrodes.',
    icon: Zap,
    priority: 'Critical',
    difficulty: 'Hard',
  },
  {
    id: 'equilibrium-shift',
    title: 'Le Châtelier’s Principle',
    subject: 'Physical Sciences',
    unit: 'Chemical Equilibrium',
    description: 'Observe how systems at equilibrium respond to changes in concentration, pressure, and temperature.',
    icon: Scale,
    priority: 'High',
    difficulty: 'Hard',
  },
  {
    id: 'organic-solubility',
    title: 'Organic Compound Solubility',
    subject: 'Physical Sciences',
    unit: 'Organic Compounds',
    description: 'Test the solubility of various organic molecules in polar and non-polar solvents.',
    icon: Beaker,
    priority: 'Standard',
    difficulty: 'Easy',
  },
  {
    id: 'brine-electrolysis',
    title: 'Chlor-Alkali Industry',
    subject: 'Physical Sciences',
    unit: 'Chlor-Alkali Industry',
    description: 'Simulate the industrial electrolysis of brine to produce chlorine, hydrogen, and sodium hydroxide.',
    icon: Factory,
    priority: 'Standard',
    difficulty: 'Medium',
  },
  {
    id: 'npk-analysis',
    title: 'NPK Soil Analysis',
    subject: 'Physical Sciences',
    unit: 'Fertilisers',
    description: 'Analyze soil nutrient levels and determine the appropriate fertilizer mix for optimal plant growth.',
    icon: Sprout,
    priority: 'Standard',
    difficulty: 'Easy',
  },
];

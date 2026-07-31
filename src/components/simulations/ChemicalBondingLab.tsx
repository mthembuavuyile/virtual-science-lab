import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shuffle,
  Atom,
  Zap,
  Flame,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Scale,
  ChevronRight,
  Info,
  Layers,
  Award,
  Lightbulb,
  Hammer,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

/* ─────────────────────────────────────────────────────────────
   TYPES & DATA DEFINITIONS
───────────────────────────────────────────────────────────── */

type TabType = 'covalent' | 'ionic' | 'metallic' | 'electronegativity' | 'quiz';

interface ElementInfo {
  symbol: string;
  name: string;
  atomicNumber: number;
  valency: number;
  valenceElectrons: number;
  electronegativity: number;
  category: 'metal' | 'nonmetal' | 'metalloid';
  color: string;
}

const ELEMENTS_DATA: Record<string, ElementInfo> = {
  H: { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, valency: 1, valenceElectrons: 1, electronegativity: 2.20, category: 'nonmetal', color: '#e2e8f0' },
  Li: { symbol: 'Li', name: 'Lithium', atomicNumber: 3, valency: 1, valenceElectrons: 1, electronegativity: 0.98, category: 'metal', color: '#f87171' },
  Be: { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, valency: 2, valenceElectrons: 2, electronegativity: 1.57, category: 'metal', color: '#fbbf24' },
  B: { symbol: 'B', name: 'Boron', atomicNumber: 5, valency: 3, valenceElectrons: 3, electronegativity: 2.04, category: 'metalloid', color: '#34d399' },
  C: { symbol: 'C', name: 'Carbon', atomicNumber: 6, valency: 4, valenceElectrons: 4, electronegativity: 2.55, category: 'nonmetal', color: '#94a3b8' },
  N: { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, valency: 3, valenceElectrons: 5, electronegativity: 3.04, category: 'nonmetal', color: '#60a5fa' },
  O: { symbol: 'O', name: 'Oxygen', atomicNumber: 8, valency: 2, valenceElectrons: 6, electronegativity: 3.44, category: 'nonmetal', color: '#f43f5e' },
  F: { symbol: 'F', name: 'Fluorine', atomicNumber: 9, valency: 1, valenceElectrons: 7, electronegativity: 3.98, category: 'nonmetal', color: '#a78bfa' },
  Na: { symbol: 'Na', name: 'Sodium', atomicNumber: 11, valency: 1, valenceElectrons: 1, electronegativity: 0.93, category: 'metal', color: '#fb923c' },
  Mg: { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, valency: 2, valenceElectrons: 2, electronegativity: 1.31, category: 'metal', color: '#facc15' },
  Al: { symbol: 'Al', name: 'Aluminium', atomicNumber: 13, valency: 3, valenceElectrons: 3, electronegativity: 1.61, category: 'metal', color: '#9ca3af' },
  Si: { symbol: 'Si', name: 'Silicon', atomicNumber: 14, valency: 4, valenceElectrons: 4, electronegativity: 1.90, category: 'metalloid', color: '#2dd4bf' },
  P: { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, valency: 3, valenceElectrons: 5, electronegativity: 2.19, category: 'nonmetal', color: '#fb923c' },
  S: { symbol: 'S', name: 'Sulfur', atomicNumber: 16, valency: 2, valenceElectrons: 6, electronegativity: 2.58, category: 'nonmetal', color: '#fde047' },
  Cl: { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, valency: 1, valenceElectrons: 7, electronegativity: 3.16, category: 'nonmetal', color: '#4ade80' },
  K: { symbol: 'K', name: 'Potassium', atomicNumber: 19, valency: 1, valenceElectrons: 1, electronegativity: 0.82, category: 'metal', color: '#f472b6' },
  Ca: { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, valency: 2, valenceElectrons: 2, electronegativity: 1.00, category: 'metal', color: '#e879f9' }
};

/* Precise Covalent Molecule Specs */
interface CovalentMolecule {
  id: string;
  name: string;
  formula: string;
  bondType: 'Single Covalent' | 'Double Covalent' | 'Triple Covalent';
  geometry: string;
  polarity: 'Non-Polar' | 'Polar';
  centralAtom: string;
  bondedAtoms: string[];
  sharedPairs: number;
  lonePairs: number;
  description: string;
  lewisLayout: {
    centerSymbol: string;
    centerLonePairs: { pos: 'top' | 'bottom' | 'left' | 'right'; count: number }[];
    bonds: {
      atomSymbol: string;
      pos: 'left' | 'right' | 'top' | 'bottom';
      sharedPairs: number;
      lonePairs: { pos: 'top' | 'bottom' | 'left' | 'right'; count: number }[];
    }[];
  };
}

const COVALENT_MOLECULES: CovalentMolecule[] = [
  {
    id: 'H2',
    name: 'Hydrogen Gas',
    formula: 'H₂',
    bondType: 'Single Covalent',
    geometry: 'Linear',
    polarity: 'Non-Polar',
    centralAtom: 'H',
    bondedAtoms: ['H'],
    sharedPairs: 1,
    lonePairs: 0,
    description: 'Two hydrogen atoms each share 1 valence electron to achieve a stable helium duet (2 e⁻). Zero lone pairs.',
    lewisLayout: {
      centerSymbol: 'H',
      centerLonePairs: [],
      bonds: [
        { atomSymbol: 'H', pos: 'right', sharedPairs: 1, lonePairs: [] }
      ]
    }
  },
  {
    id: 'Cl2',
    name: 'Chlorine Gas',
    formula: 'Cl₂',
    bondType: 'Single Covalent',
    geometry: 'Linear',
    polarity: 'Non-Polar',
    centralAtom: 'Cl',
    bondedAtoms: ['Cl'],
    sharedPairs: 1,
    lonePairs: 6,
    description: 'Two chlorine atoms share 1 electron pair. Left Cl keeps 6 purple lone pair electrons (3 pairs); Right Cl keeps 6 cyan lone pair electrons.',
    lewisLayout: {
      centerSymbol: 'Cl',
      centerLonePairs: [{ pos: 'top', count: 2 }, { pos: 'bottom', count: 2 }, { pos: 'left', count: 2 }],
      bonds: [
        { atomSymbol: 'Cl', pos: 'right', sharedPairs: 1, lonePairs: [{ pos: 'top', count: 2 }, { pos: 'bottom', count: 2 }, { pos: 'right', count: 2 }] }
      ]
    }
  },
  {
    id: 'O2',
    name: 'Oxygen Gas',
    formula: 'O₂',
    bondType: 'Double Covalent',
    geometry: 'Linear',
    polarity: 'Non-Polar',
    centralAtom: 'O',
    bondedAtoms: ['O'],
    sharedPairs: 2,
    lonePairs: 4,
    description: 'Two oxygen atoms share 2 pairs (4 e⁻) in a double bond (O=O). Left O keeps 4 purple lone pair electrons (2 pairs); Right O keeps 4 cyan lone pair electrons.',
    lewisLayout: {
      centerSymbol: 'O',
      centerLonePairs: [{ pos: 'top', count: 2 }, { pos: 'bottom', count: 2 }],
      bonds: [
        { atomSymbol: 'O', pos: 'right', sharedPairs: 2, lonePairs: [{ pos: 'top', count: 2 }, { pos: 'bottom', count: 2 }] }
      ]
    }
  },
  {
    id: 'N2',
    name: 'Nitrogen Gas',
    formula: 'N₂',
    bondType: 'Triple Covalent',
    geometry: 'Linear',
    polarity: 'Non-Polar',
    centralAtom: 'N',
    bondedAtoms: ['N'],
    sharedPairs: 3,
    lonePairs: 2,
    description: 'Two nitrogen atoms share 3 pairs (6 e⁻) in a triple bond (N≡N). Left N retains 1 purple lone pair on the left; Right N retains 1 cyan lone pair on the right.',
    lewisLayout: {
      centerSymbol: 'N',
      centerLonePairs: [{ pos: 'left', count: 2 }],
      bonds: [
        { atomSymbol: 'N', pos: 'right', sharedPairs: 3, lonePairs: [{ pos: 'right', count: 2 }] }
      ]
    }
  },
  {
    id: 'H2O',
    name: 'Water Molecule',
    formula: 'H₂O',
    bondType: 'Single Covalent',
    geometry: 'Bent / V-Shaped',
    polarity: 'Polar',
    centralAtom: 'O',
    bondedAtoms: ['H', 'H'],
    sharedPairs: 2,
    lonePairs: 2,
    description: 'Oxygen is the central atom with 6 valence electrons. It retains 2 unshared lone pairs (4 e⁻) and shares 1 electron pair with each of two Hydrogen atoms.',
    lewisLayout: {
      centerSymbol: 'O',
      centerLonePairs: [{ pos: 'top', count: 2 }, { pos: 'bottom', count: 2 }],
      bonds: [
        { atomSymbol: 'H', pos: 'left', sharedPairs: 1, lonePairs: [] },
        { atomSymbol: 'H', pos: 'right', sharedPairs: 1, lonePairs: [] }
      ]
    }
  },
  {
    id: 'NH3',
    name: 'Ammonia',
    formula: 'NH₃',
    bondType: 'Single Covalent',
    geometry: 'Trigonal Pyramidal',
    polarity: 'Polar',
    centralAtom: 'N',
    bondedAtoms: ['H', 'H', 'H'],
    sharedPairs: 3,
    lonePairs: 1,
    description: 'Nitrogen is the central atom with 5 valence electrons. It retains 1 unshared lone pair (2 e⁻) and shares 1 electron pair with each of three Hydrogen atoms.',
    lewisLayout: {
      centerSymbol: 'N',
      centerLonePairs: [{ pos: 'top', count: 2 }],
      bonds: [
        { atomSymbol: 'H', pos: 'left', sharedPairs: 1, lonePairs: [] },
        { atomSymbol: 'H', pos: 'right', sharedPairs: 1, lonePairs: [] },
        { atomSymbol: 'H', pos: 'bottom', sharedPairs: 1, lonePairs: [] }
      ]
    }
  },
  {
    id: 'CH4',
    name: 'Methane',
    formula: 'CH₄',
    bondType: 'Single Covalent',
    geometry: 'Tetrahedral',
    polarity: 'Non-Polar',
    centralAtom: 'C',
    bondedAtoms: ['H', 'H', 'H', 'H'],
    sharedPairs: 4,
    lonePairs: 0,
    description: 'Carbon is the central atom with 4 valence electrons. It shares 1 electron pair with each of four Hydrogen atoms, using all valence electrons with no lone pairs.',
    lewisLayout: {
      centerSymbol: 'C',
      centerLonePairs: [],
      bonds: [
        { atomSymbol: 'H', pos: 'top', sharedPairs: 1, lonePairs: [] },
        { atomSymbol: 'H', pos: 'bottom', sharedPairs: 1, lonePairs: [] },
        { atomSymbol: 'H', pos: 'left', sharedPairs: 1, lonePairs: [] },
        { atomSymbol: 'H', pos: 'right', sharedPairs: 1, lonePairs: [] }
      ]
    }
  },
  {
    id: 'CO2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    bondType: 'Double Covalent',
    geometry: 'Linear',
    polarity: 'Non-Polar',
    centralAtom: 'C',
    bondedAtoms: ['O', 'O'],
    sharedPairs: 4,
    lonePairs: 4,
    description: 'Carbon is the central atom forming two double bonds (O=C=O). Each Oxygen shares 2 electron pairs with Carbon and retains 2 lone pairs.',
    lewisLayout: {
      centerSymbol: 'C',
      centerLonePairs: [],
      bonds: [
        { atomSymbol: 'O', pos: 'left', sharedPairs: 2, lonePairs: [{ pos: 'top', count: 2 }, { pos: 'bottom', count: 2 }] },
        { atomSymbol: 'O', pos: 'right', sharedPairs: 2, lonePairs: [{ pos: 'top', count: 2 }, { pos: 'bottom', count: 2 }] }
      ]
    }
  }
];

/* Ionic Compound Presets */
interface IonicCompound {
  id: string;
  name: string;
  formula: string;
  cation: string;
  anion: string;
  cationCharge: number;
  anionCharge: number;
  meltingPoint: string;
  description: string;
}

const IONIC_COMPOUNDS: IonicCompound[] = [
  {
    id: 'NaCl',
    name: 'Sodium Chloride (Table Salt)',
    formula: 'NaCl',
    cation: 'Na',
    anion: 'Cl',
    cationCharge: 1,
    anionCharge: -1,
    meltingPoint: '801 °C',
    description: 'Sodium transfers 1 electron to Chlorine, forming Na⁺ and Cl⁻ ions arranged in a 3D crystal lattice.'
  },
  {
    id: 'MgO',
    name: 'Magnesium Oxide',
    formula: 'MgO',
    cation: 'Mg',
    anion: 'O',
    cationCharge: 2,
    anionCharge: -2,
    meltingPoint: '2,852 °C',
    description: 'Magnesium transfers 2 valence electrons to Oxygen. Strong +2/-2 electrostatic forces result in an extremely high melting point.'
  },
  {
    id: 'CaCl2',
    name: 'Calcium Chloride',
    formula: 'CaCl₂',
    cation: 'Ca',
    anion: 'Cl',
    cationCharge: 2,
    anionCharge: -1,
    meltingPoint: '772 °C',
    description: 'Calcium transfers 1 electron to each of two Chlorine atoms, forming Ca²⁺ and two Cl⁻ ions.'
  },
  {
    id: 'LiF',
    name: 'Lithium Fluoride',
    formula: 'LiF',
    cation: 'Li',
    anion: 'F',
    cationCharge: 1,
    anionCharge: -1,
    meltingPoint: '845 °C',
    description: 'Lithium transfers its single 2s electron to Fluorine, achieving full noble-gas electron configurations for both ions.'
  }
];

/* Metallic Samples */
interface MetallicSample {
  id: string;
  name: string;
  symbol: string;
  charge: number;
  conductivity: string;
  color: string;
  electronDensity: 'Low' | 'Medium' | 'High';
  description: string;
}

const METALLIC_SAMPLES: MetallicSample[] = [
  {
    id: 'Cu',
    name: 'Copper',
    symbol: 'Cu',
    charge: 2,
    conductivity: '59.6 MS/m',
    color: '#f97316',
    electronDensity: 'High',
    description: 'Extremely high electrical and thermal conductivity due to dense delocalized d/s electrons.'
  },
  {
    id: 'Na',
    name: 'Sodium Metal',
    symbol: 'Na',
    charge: 1,
    conductivity: '21.0 MS/m',
    color: '#fdba74',
    electronDensity: 'Low',
    description: 'Soft alkali metal with 1 valence electron per atom in the delocalized sea.'
  },
  {
    id: 'Al',
    name: 'Aluminium',
    symbol: 'Al',
    charge: 3,
    conductivity: '37.7 MS/m',
    color: '#cbd5e1',
    electronDensity: 'High',
    description: 'Each Al atom contributes 3 valence electrons to the sea, producing strong metallic bonding.'
  },
  {
    id: 'Fe',
    name: 'Iron',
    symbol: 'Fe',
    charge: 2,
    conductivity: '10.0 MS/m',
    color: '#94a3b8',
    electronDensity: 'Medium',
    description: 'Transition metal with strong metallic cohesion, malleable under heat.'
  }
];

/* CAPS Quiz Questions */
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
    question: 'Which statement best describes the mechanism of covalent bonding?',
    options: [
      'Electrostatic attraction between metal cations and a sea of delocalised electrons.',
      'Complete transfer of valence electrons from a metal atom to a non-metal atom.',
      'Sharing of one or more electron pairs between non-metal atoms to achieve an octet.',
      'Attraction between neutral atoms caused by gravity.'
    ],
    correctIndex: 2,
    explanation: 'Covalent bonds form when non-metal atoms share valence electrons so that each atom attains a stable noble gas electron structure (octet or duet).'
  },
  {
    id: 2,
    question: 'Why do ionic compounds conduct electricity when molten or dissolved in water, but NOT in the solid state?',
    options: [
      'In the solid state, valence electrons are bound inside covalent bonds.',
      'In the solid state, ions are locked in a rigid crystal lattice and cannot move; when molten/aqueous, ions are free to move and carry charge.',
      'Water creates new metallic electrons in the solution.',
      'Ionic compounds only conduct electricity when heated above 5000 °C.'
    ],
    correctIndex: 1,
    explanation: 'Electrical conductivity requires mobile charged particles. In a solid ionic lattice, ions are fixed. When melted or dissolved, ions separate and become mobile charge carriers.'
  },
  {
    id: 3,
    question: 'How does the "sea of delocalised electrons" model explain the malleability of metals?',
    options: [
      'Metals contain liquid water pockets inside their atoms.',
      'Metal cations are held by rigid covalent bonds that bend without snapping.',
      'When force is applied, layers of positive metal cations slide over each other without shattering because the flexible electron sea maintains cohesion.',
      'Metals lose all their electrons whenever struck by a hammer.'
    ],
    correctIndex: 2,
    explanation: 'Because delocalised electrons move freely in all directions, metal cation layers can slide past one another without generating strong repulsion, making metals malleable and ductile.'
  },
  {
    id: 4,
    question: 'In a Water molecule (H₂O), where is the Oxygen atom positioned in the Lewis structure?',
    options: [
      'Oxygen is placed in the dead center with 2 lone pairs (4 e⁻) and bonded to 2 Hydrogen atoms.',
      'Oxygen is placed on the far right outside the hydrogens.',
      'Oxygen loses all its electrons to Hydrogen.',
      'Oxygen has 4 single bonds.'
    ],
    correctIndex: 0,
    explanation: 'In H₂O, Oxygen is the central atom with 6 valence electrons. It retains 2 unshared lone pairs (4 e⁻) and shares 1 pair with each of the two Hydrogen atoms (H - O - H).'
  },
  {
    id: 5,
    question: 'In an Oxygen molecule (O₂), how many valence electron pairs are shared between the two Oxygen atoms?',
    options: [
      '1 shared pair (Single bond)',
      '2 shared pairs (Double bond)',
      '3 shared pairs (Triple bond)',
      '4 shared pairs (Quadruple bond)'
    ],
    correctIndex: 1,
    explanation: 'Each Oxygen atom has 6 valence electrons and needs 2 more to complete its octet. Sharing 2 pairs (4 electrons total) forms a double covalent bond (O=O).'
  },
  {
    id: 6,
    question: 'When a mechanical strike is applied to an ionic crystal lattice (e.g. NaCl), why does the crystal shatter (brittleness)?',
    options: [
      'The strike causes like-charged ions (+ and +, - and -) to align, leading to intense electrostatic repulsion that splits the crystal.',
      'The strike melts the ionic lattice into gas instantaneously.',
      'The valence electrons absorb the shock and turn into photons.',
      'Covalent bonds between Na and Cl are broken by heat.'
    ],
    correctIndex: 0,
    explanation: 'Shifting ion layers by one lattice spacing aligns positive ions next to positive ions and negative next to negative. The electrostatic repulsion splits the crystal cleanly along cleavage planes.'
  }
];

/* ─────────────────────────────────────────────────────────────
   2D SPATIAL LEWIS DOT VISUALIZER COMPONENT
───────────────────────────────────────────────────────────── */

function AccurateLewisVisualizer({ molecule, covalentStep }: { molecule: CovalentMolecule; covalentStep: number }) {
  const layout = molecule.lewisLayout;

  const renderDots = (count: number, colorClass: string, isVertical: boolean = false) => {
    return (
      <div className={`flex items-center justify-center gap-1.5 ${isVertical ? 'flex-col py-1' : 'px-1 py-0.5'}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full ${colorClass} shadow-sm`} />
        ))}
      </div>
    );
  };

  const getBondAt = (pos: 'top' | 'bottom' | 'left' | 'right') => {
    return layout.bonds.find((b) => b.pos === pos);
  };

  const topBond = getBondAt('top');
  const bottomBond = getBondAt('bottom');
  const leftBond = getBondAt('left');
  const rightBond = getBondAt('right');

  const topLP = layout.centerLonePairs.find((lp) => lp.pos === 'top');
  const bottomLP = layout.centerLonePairs.find((lp) => lp.pos === 'bottom');
  const leftLP = layout.centerLonePairs.find((lp) => lp.pos === 'left');
  const rightLP = layout.centerLonePairs.find((lp) => lp.pos === 'right');

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      {/* Legend Header */}
      <div className="flex items-center gap-4 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Center ({layout.centerSymbol}) e⁻
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Bonded e⁻
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <span className="w-2 h-2 rounded-full bg-cyan-400" /> Shared Pair
        </span>
      </div>

      {/* 2D Grid Layout */}
      <div className="grid grid-cols-3 grid-rows-3 gap-2 items-center justify-items-center py-2 max-w-lg w-full relative">

        {/* TOP ROW */}
        <div className="col-start-2 row-start-1 flex flex-col items-center justify-center">
          {topBond ? (
            <div className="flex flex-col items-center gap-1">
              <div className="relative flex items-center justify-center p-4 rounded-2xl bg-cyan-950/30 border-2 border-cyan-500/40 shadow-lg min-w-[70px] min-h-[70px]">
                {topBond.lonePairs.map((lp, i) => (
                  <div key={i} className={`absolute ${lp.pos === 'top' ? 'top-1' : lp.pos === 'left' ? 'left-1' : 'right-1'}`}>
                    {renderDots(lp.count, 'bg-cyan-400', lp.pos !== 'top')}
                  </div>
                ))}
                <span className="text-2xl font-black text-white">{topBond.atomSymbol}</span>
              </div>
              {/* Shared Pair vertical */}
              <div className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg flex flex-col items-center gap-1">
                {covalentStep === 2 ? (
                  Array.from({ length: topBond.sharedPairs }).map((_, p) => (
                    <div key={p} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                  ))
                ) : (
                  <span className="text-[9px] text-slate-500 font-mono">Approach</span>
                )}
              </div>
            </div>
          ) : topLP ? (
            <div className="py-1">{renderDots(topLP.count, 'bg-purple-400')}</div>
          ) : null}
        </div>

        {/* MIDDLE ROW - LEFT */}
        <div className="col-start-1 row-start-2 flex items-center justify-center">
          {leftBond ? (
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center p-4 rounded-2xl bg-cyan-950/30 border-2 border-cyan-500/40 shadow-lg min-w-[70px] min-h-[70px]">
                {leftBond.lonePairs.map((lp, i) => (
                  <div key={i} className={`absolute ${lp.pos === 'top' ? 'top-1' : lp.pos === 'bottom' ? 'bottom-1' : 'left-1'}`}>
                    {renderDots(lp.count, 'bg-cyan-400', lp.pos === 'left')}
                  </div>
                ))}
                <span className="text-2xl font-black text-white">{leftBond.atomSymbol}</span>
              </div>
              {/* Shared pair horizontal */}
              <div className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg flex items-center gap-1.5">
                {covalentStep === 2 ? (
                  Array.from({ length: leftBond.sharedPairs }).map((_, p) => (
                    <div key={p} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                  ))
                ) : (
                  <span className="text-[9px] text-slate-500 font-mono">Approach</span>
                )}
              </div>
            </div>
          ) : leftLP ? (
            <div className="px-1">{renderDots(leftLP.count, 'bg-purple-400', true)}</div>
          ) : null}
        </div>

        {/* MIDDLE ROW - CENTRAL ATOM */}
        <div className="col-start-2 row-start-2 flex items-center justify-center z-20">
          <div className="relative flex items-center justify-center p-6 rounded-2xl bg-purple-950/50 border-2 border-purple-500/60 shadow-xl min-w-[100px] min-h-[100px]">
            <span className="text-3xl font-black text-white">{layout.centerSymbol}</span>
            <span className="absolute -bottom-4 bg-purple-900 text-purple-200 text-[9px] font-bold px-2 py-0.5 rounded-full border border-purple-400">
              CENTRAL ATOM
            </span>
          </div>
        </div>

        {/* MIDDLE ROW - RIGHT */}
        <div className="col-start-3 row-start-2 flex items-center justify-center">
          {rightBond ? (
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg flex items-center gap-1.5">
                {covalentStep === 2 ? (
                  Array.from({ length: rightBond.sharedPairs }).map((_, p) => (
                    <div key={p} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                  ))
                ) : (
                  <span className="text-[9px] text-slate-500 font-mono">Approach</span>
                )}
              </div>
              <div className="relative flex items-center justify-center p-4 rounded-2xl bg-cyan-950/30 border-2 border-cyan-500/40 shadow-lg min-w-[70px] min-h-[70px]">
                {rightBond.lonePairs.map((lp, i) => (
                  <div key={i} className={`absolute ${lp.pos === 'top' ? 'top-1' : lp.pos === 'bottom' ? 'bottom-1' : 'right-1'}`}>
                    {renderDots(lp.count, 'bg-cyan-400', lp.pos === 'right')}
                  </div>
                ))}
                <span className="text-2xl font-black text-white">{rightBond.atomSymbol}</span>
              </div>
            </div>
          ) : rightLP ? (
            <div className="px-1">{renderDots(rightLP.count, 'bg-purple-400', true)}</div>
          ) : null}
        </div>

        {/* BOTTOM ROW */}
        <div className="col-start-2 row-start-3 flex flex-col items-center justify-center">
          {bottomBond ? (
            <div className="flex flex-col items-center gap-1 mt-2">
              <div className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg flex flex-col items-center gap-1">
                {covalentStep === 2 ? (
                  Array.from({ length: bottomBond.sharedPairs }).map((_, p) => (
                    <div key={p} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                  ))
                ) : (
                  <span className="text-[9px] text-slate-500 font-mono">Approach</span>
                )}
              </div>
              <div className="relative flex items-center justify-center p-4 rounded-2xl bg-cyan-950/30 border-2 border-cyan-500/40 shadow-lg min-w-[70px] min-h-[70px]">
                {bottomBond.lonePairs.map((lp, i) => (
                  <div key={i} className={`absolute ${lp.pos === 'bottom' ? 'bottom-1' : lp.pos === 'left' ? 'left-1' : 'right-1'}`}>
                    {renderDots(lp.count, 'bg-cyan-400', lp.pos !== 'bottom')}
                  </div>
                ))}
                <span className="text-2xl font-black text-white">{bottomBond.atomSymbol}</span>
              </div>
            </div>
          ) : bottomLP ? (
            <div className="py-1">{renderDots(bottomLP.count, 'bg-purple-400')}</div>
          ) : null}
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */

export default function ChemicalBondingLab() {
  const [activeTab, setActiveTab] = useState<TabType>('covalent');

  // Covalent tab state
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>('H2O');
  const [covalentViewMode, setCovalentViewMode] = useState<'lewis' | 'bohr' | 'structural'>('lewis');
  const [covalentStep, setCovalentStep] = useState<number>(2);

  // Ionic tab state
  const [selectedIonicId, setSelectedIonicId] = useState<string>('NaCl');
  const [ionicState, setIonicState] = useState<'solid' | 'aqueous'>('solid');
  const [isHammerStriking, setIsHammerStriking] = useState<boolean>(false);
  const [crystalFractured, setCrystalFractured] = useState<boolean>(false);

  // Metallic tab state
  const [selectedMetalId, setSelectedMetalId] = useState<string>('Cu');
  const [isVoltageOn, setIsVoltageOn] = useState<boolean>(false);
  const [isHeatOn, setIsHeatOn] = useState<boolean>(false);
  const [isMetalMalleableApplied, setIsMetalMalleableApplied] = useState<boolean>(false);

  // Electronegativity state
  const [elem1Symbol, setElem1Symbol] = useState<string>('H');
  const [elem2Symbol, setElem2Symbol] = useState<string>('F');

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);

  // Derived data
  const currentMolecule = useMemo(() => {
    return COVALENT_MOLECULES.find((m) => m.id === selectedMoleculeId) || COVALENT_MOLECULES[0];
  }, [selectedMoleculeId]);

  const currentIonic = useMemo(() => {
    return IONIC_COMPOUNDS.find((i) => i.id === selectedIonicId) || IONIC_COMPOUNDS[0];
  }, [selectedIonicId]);

  const currentMetal = useMemo(() => {
    return METALLIC_SAMPLES.find((m) => m.id === selectedMetalId) || METALLIC_SAMPLES[0];
  }, [selectedMetalId]);

  const elem1 = ELEMENTS_DATA[elem1Symbol] || ELEMENTS_DATA['H'];
  const elem2 = ELEMENTS_DATA[elem2Symbol] || ELEMENTS_DATA['F'];
  const deltaEN = useMemo(() => {
    return Math.abs(elem1.electronegativity - elem2.electronegativity);
  }, [elem1, elem2]);

  const bondClassification = useMemo(() => {
    if (deltaEN < 0.5) return { type: 'Non-Polar Covalent', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-300' };
    if (deltaEN < 1.7) return { type: 'Polar Covalent', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-300' };
    return { type: 'Ionic Bond', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-300' };
  }, [deltaEN]);

  /* Canvas Animation */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (activeTab !== 'metallic') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = canvas.width;
    const height = canvas.height;

    const cols = 5;
    const rows = 3;
    const spacingX = width / (cols + 1);
    const spacingY = height / (rows + 1);

    const cations: { x: number; y: number }[] = [];
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        let offsetX = 0;
        if (isMetalMalleableApplied && r === 1) offsetX = 35;
        cations.push({ x: c * spacingX + offsetX, y: r * spacingY });
      }
    }

    const numElectrons = currentMetal.charge * 18;
    const electrons: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    for (let i = 0; i < numElectrons; i++) {
      electrons.push({
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 40) + 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 3.5
      });
    }

    let thermalTick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      thermalTick += 0.05;

      // Render Cations
      cations.forEach((cat) => {
        let jitterX = 0;
        let jitterY = 0;
        if (isHeatOn) {
          const heatIntensity = (width - cat.x) / width;
          jitterX = Math.sin(thermalTick * 5 + cat.x) * (4 * heatIntensity + 1);
          jitterY = Math.cos(thermalTick * 5 + cat.y) * (4 * heatIntensity + 1);
        }

        const renderX = cat.x + jitterX;
        const renderY = cat.y + jitterY;

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = currentMetal.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(renderX, renderY, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${currentMetal.symbol}${currentMetal.charge > 1 ? currentMetal.charge : ''}+`, renderX, renderY);
      });

      // Render Electrons
      electrons.forEach((e) => {
        if (isVoltageOn) {
          e.vx += 0.25;
          if (e.vx > 4) e.vx = 4;
        }
        if (isHeatOn) {
          e.vx += (Math.random() - 0.5) * 0.8;
          e.vy += (Math.random() - 0.5) * 0.8;
        }

        e.x += e.vx;
        e.y += e.vy;

        if (!isVoltageOn) {
          e.vx *= 0.98;
          e.vy *= 0.98;
          if (Math.abs(e.vx) < 0.2) e.vx = (Math.random() - 0.5) * 1.5;
          if (Math.abs(e.vy) < 0.2) e.vy = (Math.random() - 0.5) * 1.5;
        }

        if (e.x > width - 10) {
          if (isVoltageOn) e.x = 10;
          else { e.x = width - 10; e.vx *= -1; }
        }
        if (e.x < 10) { e.x = 10; e.vx *= -1; }
        if (e.y > height - 10) { e.y = height - 10; e.vy *= -1; }
        if (e.y < 10) { e.y = 10; e.vy *= -1; }

        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab, selectedMetalId, isVoltageOn, isHeatOn, isMetalMalleableApplied, currentMetal]);

  const quizScore = useMemo(() => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) score++;
    });
    return score;
  }, [userAnswers]);

  const handleHammerStrike = () => {
    setIsHammerStriking(true);
    setTimeout(() => {
      setIsHammerStriking(false);
      setCrystalFractured(true);
    }, 400);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans p-3 lg:p-6 overflow-y-auto">
      {/* ─────────────────────────────────────────────────────────────
          APP BRANDED HEADER & TAB BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4 lg:mb-6 shrink-0">
        <div className="p-4 lg:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-sm">
              <Shuffle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base lg:text-lg font-bold text-slate-900 tracking-tight">Chemical Bonding Laboratory</h1>
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-purple-600 border-purple-200 bg-purple-50">
                  Grade 10 CAPS
                </Badge>
              </div>
              <p className="text-xs text-slate-500">Ionic, Covalent & Metallic Bonding · Lewis Diagrams · Electronegativity</p>
            </div>
          </div>
        </div>

        {/* Tab Selector Bar */}
        <div className="flex bg-slate-50/80 px-2 lg:px-4 gap-1 overflow-x-auto border-t border-slate-200">
          {[
            { id: 'covalent', label: 'Covalent Bonding', icon: Atom },
            { id: 'ionic', label: 'Ionic Transfer', icon: Zap },
            { id: 'metallic', label: 'Metallic Sea', icon: Layers },
            { id: 'electronegativity', label: 'Electronegativity', icon: Scale },
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
                    ? 'border-purple-600 text-purple-700 bg-white shadow-xs'
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
            TAB 1: COVALENT BONDING & LEWIS STRUCTURES
            ========================================================= */}
        {activeTab === 'covalent' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Control Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <Card className="p-4 bg-white border-slate-200 shadow-sm text-slate-800">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Atom className="w-4 h-4 text-purple-600" />
                  Select Molecule Template
                </h2>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {COVALENT_MOLECULES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMoleculeId(m.id);
                        setCovalentStep(2);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedMoleculeId === m.id
                          ? 'bg-purple-50 border-purple-500 text-purple-950 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-purple-700">{m.formula}</div>
                      <div className="text-[11px] text-slate-500 truncate">{m.name}</div>
                    </button>
                  ))}
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <label className="text-xs font-semibold text-slate-600 block">Visual Representation Mode</label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
                    <button
                      onClick={() => setCovalentViewMode('lewis')}
                      className={`py-1.5 rounded-md font-bold text-center transition-colors ${
                        covalentViewMode === 'lewis' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Lewis Dot
                    </button>
                    <button
                      onClick={() => setCovalentViewMode('bohr')}
                      className={`py-1.5 rounded-md font-bold text-center transition-colors ${
                        covalentViewMode === 'bohr' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Bohr Shells
                    </button>
                    <button
                      onClick={() => setCovalentViewMode('structural')}
                      className={`py-1.5 rounded-md font-bold text-center transition-colors ${
                        covalentViewMode === 'structural' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Structural
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 mt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600">Bond Formation Timeline</span>
                    <span className="text-purple-600 font-bold">
                      {covalentStep === 0 ? 'Free Atoms' : covalentStep === 1 ? 'Approaching' : 'Bonded Octet'}
                    </span>
                  </div>
                  <Slider
                    value={[covalentStep]}
                    min={0}
                    max={2}
                    step={1}
                    onValueChange={(val) => setCovalentStep(val[0])}
                    className="py-1 cursor-pointer"
                  />
                </div>
              </Card>

              {/* Molecular Insights Card */}
              <Card className="p-4 bg-white border-slate-200 shadow-sm text-slate-800">
                <h3 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Molecular Insights</h3>
                <div className="space-y-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Central Atom:</span>
                    <span className="font-bold text-purple-700">{currentMolecule.centralAtom}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Bond Type:</span>
                    <span className="font-bold text-slate-800">{currentMolecule.bondType}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Shared Pairs:</span>
                    <span className="font-bold text-emerald-600">{currentMolecule.sharedPairs} pair(s) ({currentMolecule.sharedPairs * 2} e⁻)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Lone Pairs:</span>
                    <span className="font-bold text-amber-600">{currentMolecule.lonePairs} pair(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Polarity:</span>
                    <span className={`font-bold ${currentMolecule.polarity === 'Polar' ? 'text-amber-600' : 'text-blue-600'}`}>
                      {currentMolecule.polarity}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Interactive Visual Canvas Panel */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <Card className="p-6 bg-white border-slate-200 shadow-sm flex flex-col justify-between items-center min-h-[420px]">
                <div className="w-full flex justify-between items-center mb-4">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-bold text-xs">
                    {currentMolecule.name} ({currentMolecule.formula})
                  </Badge>
                  <span className="text-xs text-slate-500 font-mono">
                    Mode: {covalentViewMode.toUpperCase()} VIEW
                  </span>
                </div>

                {/* Dark Simulation Viewport */}
                <div className="w-full flex-1 my-auto flex flex-col items-center justify-center py-8 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#3b0764_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

                  {/* LEWIS DOT VIEW */}
                  {covalentViewMode === 'lewis' && (
                    <motion.div
                      key={`${selectedMoleculeId}-${covalentStep}`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="z-10 w-full flex flex-col items-center"
                    >
                      <AccurateLewisVisualizer molecule={currentMolecule} covalentStep={covalentStep} />
                    </motion.div>
                  )}

                  {/* BOHR SHELL VIEW */}
                  {covalentViewMode === 'bohr' && (
                    <div className="flex items-center justify-center gap-2 z-10">
                      <div className="relative w-36 h-36 rounded-full border-2 border-dashed border-purple-400 flex items-center justify-center bg-purple-950/20">
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                          {currentMolecule.centralAtom}
                        </div>
                        <div className="absolute -right-14 w-36 h-36 rounded-full border-2 border-dashed border-cyan-400 flex items-center justify-center bg-cyan-950/20">
                          <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-xs">
                            {currentMolecule.bondedAtoms[0]}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STRUCTURAL VIEW */}
                  {covalentViewMode === 'structural' && (
                    <div className="flex items-center justify-center gap-4 text-3xl font-black text-purple-300 font-mono bg-slate-900 px-8 py-6 rounded-2xl border border-slate-800 z-10">
                      <span>{currentMolecule.centralAtom}</span>
                      <span className="text-cyan-400 tracking-tighter">
                        {currentMolecule.sharedPairs === 1 ? '—' : currentMolecule.sharedPairs === 2 ? '═' : '≡'}
                      </span>
                      <span>{currentMolecule.bondedAtoms[0]}</span>
                    </div>
                  )}
                </div>

                {/* Bottom CAPS Core Concept Card */}
                <div className="w-full mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs">
                  <div className="font-bold flex items-center gap-2 mb-1 text-purple-300">
                    <Info className="w-4 h-4 text-purple-400" />
                    CAPS Covalent Bonding Core Rule:
                  </div>
                  <p className="text-slate-300 leading-relaxed">{currentMolecule.description}</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: IONIC TRANSFER & CRYSTAL LATTICE
            ========================================================= */}
        {activeTab === 'ionic' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            <div className="lg:col-span-4 flex flex-col gap-4">
              <Card className="p-4 bg-white border-slate-200 shadow-sm text-slate-800">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-blue-600" />
                  Select Ionic Compound
                </h2>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {IONIC_COMPOUNDS.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => {
                        setSelectedIonicId(comp.id);
                        setCrystalFractured(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedIonicId === comp.id
                          ? 'bg-blue-50 border-blue-500 text-blue-950 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-blue-700">{comp.formula}</div>
                      <div className="text-[11px] text-slate-500 truncate">{comp.name}</div>
                    </button>
                  ))}
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <label className="text-xs font-semibold text-slate-600 block">Physical State / Conductivity</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIonicState('solid')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        ionicState === 'solid'
                          ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      Solid Lattice
                    </button>
                    <button
                      onClick={() => setIonicState('aqueous')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        ionicState === 'aqueous'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <Activity className="w-4 h-4" />
                      Molten / Solution
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                  <label className="text-xs font-semibold text-slate-600 block">Mechanical Stress Test</label>
                  <Button
                    onClick={handleHammerStrike}
                    disabled={isHammerStriking}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Hammer className="w-4 h-4" />
                    Strike with Hammer (Cleavage)
                  </Button>
                  {crystalFractured && (
                    <button
                      onClick={() => setCrystalFractured(false)}
                      className="text-xs text-blue-600 font-bold underline hover:text-blue-800 w-full text-center block pt-1"
                    >
                      Reset Crystal Lattice
                    </button>
                  )}
                </div>
              </Card>

              {/* Lattice Properties */}
              <Card className="p-4 bg-white border-slate-200 shadow-sm text-slate-800">
                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Lattice Specs</h3>
                <div className="space-y-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Cation (Metal):</span>
                    <span className="font-bold text-rose-600">{currentIonic.cation} ({currentIonic.cationCharge}+)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Anion (Non-metal):</span>
                    <span className="font-bold text-emerald-600">{currentIonic.anion} ({Math.abs(currentIonic.anionCharge)}-)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Melting Point:</span>
                    <span className="font-bold text-amber-600">{currentIonic.meltingPoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Conductivity:</span>
                    <span className={`font-bold ${ionicState === 'aqueous' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {ionicState === 'aqueous' ? 'High (Mobile Ions)' : 'Zero (Locked Lattice)'}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Visualizer Panel */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <Card className="p-6 bg-white border-slate-200 shadow-sm flex flex-col justify-between items-center min-h-[420px]">
                <div className="w-full flex justify-between items-center mb-4">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-xs">
                    {currentIonic.name} ({currentIonic.formula})
                  </Badge>

                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                    <Lightbulb className={`w-4 h-4 ${ionicState === 'aqueous' ? 'text-amber-500 animate-pulse fill-amber-500' : 'text-slate-400'}`} />
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {ionicState === 'aqueous' ? 'CIRCUIT CLOSED (GLOWING)' : 'CIRCUIT OPEN (NO CURRENT)'}
                    </span>
                  </div>
                </div>

                {/* Dark Lattice Viewport */}
                <div className="w-full flex-1 my-auto flex flex-col items-center justify-center py-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner relative">
                  <div className="grid grid-cols-4 gap-3 p-6 bg-slate-900/90 rounded-2xl border border-slate-800 relative z-10">
                    {[
                      { bg: 'bg-rose-600', label: `${currentIonic.cation}⁺` },
                      { bg: 'bg-emerald-600', label: `${currentIonic.anion}⁻` },
                      { bg: 'bg-rose-600', label: `${currentIonic.cation}⁺` },
                      { bg: 'bg-emerald-600', label: `${currentIonic.anion}⁻` },
                      
                      { bg: 'bg-emerald-600', label: `${currentIonic.anion}⁻` },
                      { bg: 'bg-rose-600', label: `${currentIonic.cation}⁺` },
                      { bg: 'bg-emerald-600', label: `${currentIonic.anion}⁻` },
                      { bg: 'bg-rose-600', label: `${currentIonic.cation}⁺` },

                      { bg: 'bg-rose-600', label: `${currentIonic.cation}⁺` },
                      { bg: 'bg-emerald-600', label: `${currentIonic.anion}⁻` },
                      { bg: 'bg-rose-600', label: `${currentIonic.cation}⁺` },
                      { bg: 'bg-emerald-600', label: `${currentIonic.anion}⁻` },
                    ].map((ion, idx) => {
                      let shiftClass = '';
                      if (crystalFractured && idx < 4) shiftClass = 'translate-x-6 border-2 border-rose-500';

                      return (
                        <motion.div
                          key={idx}
                          animate={ionicState === 'aqueous' ? { x: [0, (Math.random() - 0.5) * 10, 0], y: [0, (Math.random() - 0.5) * 10, 0] } : {}}
                          transition={{ repeat: Infinity, duration: 2 + (idx % 3) * 0.4 }}
                          className={`w-12 h-12 rounded-full ${ion.bg} text-white font-bold text-xs flex items-center justify-center shadow-md transition-transform duration-500 ${shiftClass}`}
                        >
                          {ion.label}
                        </motion.div>
                      );
                    })}
                  </div>

                  {crystalFractured && (
                    <div className="mt-4 px-4 py-2 rounded-xl bg-rose-950 border border-rose-500 text-rose-300 text-xs font-bold text-center z-10 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      Cleavage Fracture! Like-charged ions aligned (+/+ and -/-), causing repulsion that shattered the lattice.
                    </div>
                  )}
                </div>

                {/* Bottom CAPS Rule */}
                <div className="w-full mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs">
                  <div className="font-bold flex items-center gap-2 mb-1 text-blue-300">
                    <Info className="w-4 h-4 text-blue-400" />
                    CAPS Ionic Lattice Rule:
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Solid ionic crystals do not conduct electricity because ions are fixed in rigid lattice positions. Molten or aqueous ionic compounds conduct electricity because free mobile ions carry electric charge.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: METALLIC SEA OF ELECTRONS SIMULATOR
            ========================================================= */}
        {activeTab === 'metallic' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            <div className="lg:col-span-4 flex flex-col gap-4">
              <Card className="p-4 bg-white border-slate-200 shadow-sm text-slate-800">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-amber-600" />
                  Select Metal Sample
                </h2>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {METALLIC_SAMPLES.map((metal) => (
                    <button
                      key={metal.id}
                      onClick={() => setSelectedMetalId(metal.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedMetalId === metal.id
                          ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-amber-700">{metal.name}</div>
                      <div className="text-[11px] text-slate-500">Valency +{metal.charge}</div>
                    </button>
                  ))}
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <label className="text-xs font-semibold text-slate-600 block">Interactive Experiments</label>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Zap className={`w-4 h-4 ${isVoltageOn ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                      <span>Voltage (Electric Drift)</span>
                    </div>
                    <button
                      onClick={() => setIsVoltageOn(!isVoltageOn)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                        isVoltageOn ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isVoltageOn ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Flame className={`w-4 h-4 ${isHeatOn ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                      <span>Heat Source (Thermal)</span>
                    </div>
                    <button
                      onClick={() => setIsHeatOn(!isHeatOn)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                        isHeatOn ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isHeatOn ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Hammer className={`w-4 h-4 ${isMetalMalleableApplied ? 'text-cyan-600' : 'text-slate-400'}`} />
                      <span>Hammer (Malleability)</span>
                    </div>
                    <button
                      onClick={() => setIsMetalMalleableApplied(!isMetalMalleableApplied)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                        isMetalMalleableApplied ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isMetalMalleableApplied ? 'SHIFTED' : 'STRIKE'}
                    </button>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white border-slate-200 shadow-sm text-slate-800">
                <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Metallic Properties</h3>
                <div className="space-y-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Conductivity:</span>
                    <span className="font-bold text-emerald-600">{currentMetal.conductivity}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Delocalized e⁻ Density:</span>
                    <span className="font-bold text-amber-600">{currentMetal.electronDensity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kernel Charge:</span>
                    <span className="font-bold text-purple-600">+{currentMetal.charge}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Canvas Viewport */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <Card className="p-6 bg-white border-slate-200 shadow-sm flex flex-col justify-between items-center min-h-[420px]">
                <div className="w-full flex justify-between items-center mb-2">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-bold text-xs">
                    Sea of Electrons Model ({currentMetal.name})
                  </Badge>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> e⁻ Sea</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-white border border-amber-500" /> Kernel</span>
                  </div>
                </div>

                <div className="w-full flex-1 my-auto flex items-center justify-center relative">
                  <canvas
                    ref={canvasRef}
                    width={560}
                    height={280}
                    className="w-full max-w-[560px] h-[280px] bg-slate-950 rounded-2xl border border-slate-800 shadow-inner"
                  />
                  {isVoltageOn && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-amber-500 text-white font-bold text-xs rounded-lg shadow-md animate-pulse">
                      + ANODE (DRIFT →)
                    </div>
                  )}
                </div>

                <div className="w-full mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs">
                  <div className="font-bold flex items-center gap-2 mb-1 text-amber-300">
                    <Info className="w-4 h-4 text-amber-400" />
                    CAPS Metallic Bonding Definition:
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Metallic bonding is the electrostatic attraction between positive atomic kernels and the surrounding sea of delocalised valence electrons. Free-moving electrons explain high electrical conductivity, thermal conductivity, and malleability.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: ELECTRONEGATIVITY & BOND TYPE CALCULATOR
            ========================================================= */}
        {activeTab === 'electronegativity' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            <div className="lg:col-span-5 flex flex-col gap-4">
              <Card className="p-5 bg-white border-slate-200 shadow-sm text-slate-800">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <Scale className="w-4 h-4 text-teal-600" />
                  Select Atom Pair
                </h2>

                <div className="space-y-2 mb-4">
                  <label className="text-xs font-bold text-teal-700">First Atom (Element A)</label>
                  <select
                    value={elem1Symbol}
                    onChange={(e) => setElem1Symbol(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm"
                  >
                    {Object.values(ELEMENTS_DATA).map((el) => (
                      <option key={el.symbol} value={el.symbol}>
                        {el.name} ({el.symbol}) — EN: {el.electronegativity}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-teal-700">Second Atom (Element B)</label>
                  <select
                    value={elem2Symbol}
                    onChange={(e) => setElem2Symbol(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm"
                  >
                    {Object.values(ELEMENTS_DATA).map((el) => (
                      <option key={el.symbol} value={el.symbol}>
                        {el.name} ({el.symbol}) — EN: {el.electronegativity}
                      </option>
                    ))}
                  </select>
                </div>
              </Card>

              <Card className="p-5 bg-white border-slate-200 shadow-sm text-slate-800">
                <h3 className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">Pauling Scale Benchmark</h3>
                <div className="space-y-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">ΔEN &lt; 0.5:</span>
                    <span className="font-bold text-emerald-600">Non-Polar Covalent</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">0.5 ≤ ΔEN &lt; 1.7:</span>
                    <span className="font-bold text-amber-600">Polar Covalent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ΔEN ≥ 1.7:</span>
                    <span className="font-bold text-rose-600">Ionic Bond</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Display */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <Card className="p-6 bg-white border-slate-200 shadow-sm flex flex-col justify-between items-center min-h-[420px]">
                <div className="w-full flex justify-between items-center mb-4">
                  <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 font-bold text-xs">
                    Bond Dipole & Electronegativity Difference
                  </Badge>
                  <span className="text-xs font-mono text-slate-500">
                    ΔEN = |{elem1.electronegativity} - {elem2.electronegativity}|
                  </span>
                </div>

                <div className="w-full flex-1 my-auto flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center text-white font-bold">
                        <span className="text-xl">{elem1.symbol}</span>
                        <span className="text-[9px] text-teal-400">EN {elem1.electronegativity}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{elem1.name}</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="text-xs font-mono text-cyan-300">
                        {elem1.electronegativity < elem2.electronegativity ? 'δ⁺ ─────→ δ⁻' : elem1.electronegativity > elem2.electronegativity ? 'δ⁻ ←───── δ⁺' : '── (No dipole) ──'}
                      </div>
                      <div className="w-28 h-1 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full" />
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center text-white font-bold">
                        <span className="text-xl">{elem2.symbol}</span>
                        <span className="text-[9px] text-emerald-400">EN {elem2.electronegativity}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{elem2.name}</span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border text-center max-w-sm w-full shadow-md ${bondClassification.bg}`}>
                    <div className="text-[10px] font-mono uppercase text-slate-500">Electronegativity Difference</div>
                    <div className="text-2xl font-black text-slate-900 my-0.5">ΔEN = {deltaEN.toFixed(2)}</div>
                    <div className={`text-xs font-bold ${bondClassification.color}`}>
                      {bondClassification.type}
                    </div>
                  </div>
                </div>

                <div className="w-full mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs">
                  <div className="font-bold flex items-center gap-2 mb-1 text-teal-300">
                    <Info className="w-4 h-4 text-teal-400" />
                    CAPS Electronegativity Trend:
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Electronegativity is a measure of the tendency of an atom to attract a bonding pair of electrons. Electronegativity increases across a period (left to right) and decreases down a group.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: CAPS QUIZ & CHALLENGE MODE
            ========================================================= */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            <Card className="p-6 bg-white border-slate-200 shadow-sm text-slate-800">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-rose-600" />
                    CAPS Grade 10 Chemical Bonding Examination Quiz
                  </h2>
                  <p className="text-xs text-slate-500">Test your mastery of chemical bonding principles.</p>
                </div>
                {showQuizResults && (
                  <Badge variant="outline" className="bg-rose-50 border-rose-300 text-rose-700 text-xs px-3 py-1 font-bold">
                    Score: {quizScore} / {QUIZ_QUESTIONS.length} ({Math.round((quizScore / QUIZ_QUESTIONS.length) * 100)}%)
                  </Badge>
                )}
              </div>

              <div className="space-y-6">
                {QUIZ_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="font-bold text-xs text-slate-900 mb-3">
                      {idx + 1}. {q.question}
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswers[q.id] === optIdx;
                        const isCorrect = optIdx === q.correctIndex;

                        let optClass = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';
                        if (showQuizResults) {
                          if (isCorrect) optClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                          else if (isSelected) optClass = 'bg-rose-50 border-rose-500 text-rose-900 font-bold';
                        } else if (isSelected) {
                          optClass = 'bg-purple-50 border-purple-500 text-purple-900 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={showQuizResults}
                            onClick={() => setUserAnswers({ ...userAnswers, [q.id]: optIdx })}
                            className={`w-full p-3 rounded-lg border text-xs text-left transition-all flex items-center justify-between ${optClass}`}
                          >
                            <span>{opt}</span>
                            {showQuizResults && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {showQuizResults && (
                      <div className="mt-3 p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-600">
                        <span className="font-bold text-rose-600">Explanation: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
                {!showQuizResults ? (
                  <Button
                    onClick={() => setShowQuizResults(true)}
                    disabled={Object.keys(userAnswers).length < QUIZ_QUESTIONS.length}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs"
                  >
                    Submit Answers
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setUserAnswers({});
                      setShowQuizResults(false);
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Quiz
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Atom,
  Search,
  Sparkles,
  Layers,
  TrendingUp,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Scale,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

/* ────────── TYPES & ELEMENT DATA ────────── */

export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: ElementCategory;
  group: number; // 1-18
  period: number; // 1-7
  electrons: number[]; // shell breakdown e.g. [2, 8, 1]
  config: string; // e.g. 1s² 2s² 2p⁶ 3s¹
  condensedConfig: string; // e.g. [Ne] 3s¹
  electronegativity?: number;
  atomicRadius?: number; // pm
  ionizationEnergy?: number; // kJ/mol
  phase: 'solid' | 'liquid' | 'gas';
  valency: number;
  commonIsotopes: { massNumber: number; abundance: number; stable: boolean }[];
  summary: string;
}

const CATEGORY_COLORS: Record<ElementCategory, { bg: string; text: string; border: string; badge: string }> = {
  'alkali-metal': { bg: 'bg-red-50 hover:bg-red-100', text: 'text-red-700', border: 'border-red-300', badge: 'bg-red-500' },
  'alkaline-earth': { bg: 'bg-amber-50 hover:bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', badge: 'bg-amber-500' },
  'transition-metal': { bg: 'bg-blue-50 hover:bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', badge: 'bg-blue-500' },
  'post-transition': { bg: 'bg-emerald-50 hover:bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', badge: 'bg-emerald-500' },
  'metalloid': { bg: 'bg-teal-50 hover:bg-teal-100', text: 'text-teal-700', border: 'border-teal-300', badge: 'bg-teal-500' },
  'nonmetal': { bg: 'bg-purple-50 hover:bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', badge: 'bg-purple-500' },
  'halogen': { bg: 'bg-pink-50 hover:bg-pink-100', text: 'text-pink-700', border: 'border-pink-300', badge: 'bg-pink-500' },
  'noble-gas': { bg: 'bg-indigo-50 hover:bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300', badge: 'bg-indigo-500' },
  'lanthanide': { bg: 'bg-violet-50 hover:bg-violet-100', text: 'text-violet-700', border: 'border-violet-300', badge: 'bg-violet-400' },
  'actinide': { bg: 'bg-rose-50 hover:bg-rose-100', text: 'text-rose-700', border: 'border-rose-300', badge: 'bg-rose-400' },
};

const CATEGORY_LABELS: Record<ElementCategory, string> = {
  'alkali-metal': 'Alkali Metal',
  'alkaline-earth': 'Alkaline Earth',
  'transition-metal': 'Transition Metal',
  'post-transition': 'Post-Transition',
  'metalloid': 'Metalloid',
  'nonmetal': 'Reactive Nonmetal',
  'halogen': 'Halogen',
  'noble-gas': 'Noble Gas',
  'lanthanide': 'Lanthanide',
  'actinide': 'Actinide',
};

// Detailed dataset for first 36 elements + selected key elements
const ELEMENTS: ElementData[] = [
  { number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, category: 'nonmetal', group: 1, period: 1, electrons: [1], config: '1s¹', condensedConfig: '1s¹', electronegativity: 2.20, atomicRadius: 53, ionizationEnergy: 1312, phase: 'gas', valency: 1, commonIsotopes: [{ massNumber: 1, abundance: 99.98, stable: true }, { massNumber: 2, abundance: 0.02, stable: true }, { massNumber: 3, abundance: 0.0, stable: false }], summary: 'Lightest chemical element. Highly flammable gas consisting of diatomic H₂ molecules.' },
  { number: 2, symbol: 'He', name: 'Helium', mass: 4.0026, category: 'noble-gas', group: 18, period: 1, electrons: [2], config: '1s²', condensedConfig: '1s²', electronegativity: undefined, atomicRadius: 31, ionizationEnergy: 2372, phase: 'gas', valency: 0, commonIsotopes: [{ massNumber: 4, abundance: 99.99, stable: true }, { massNumber: 3, abundance: 0.01, stable: true }], summary: 'Colorless, odorless, inert noble gas with a full 1s shell.' },
  { number: 3, symbol: 'Li', name: 'Lithium', mass: 6.94, category: 'alkali-metal', group: 1, period: 2, electrons: [2, 1], config: '1s² 2s¹', condensedConfig: '[He] 2s¹', electronegativity: 0.98, atomicRadius: 167, ionizationEnergy: 520, phase: 'solid', valency: 1, commonIsotopes: [{ massNumber: 7, abundance: 92.41, stable: true }, { massNumber: 6, abundance: 7.59, stable: true }], summary: 'Soft, silvery alkali metal. Highly reactive with water, forming Li⁺ ions.' },
  { number: 4, symbol: 'Be', name: 'Beryllium', mass: 9.0122, category: 'alkaline-earth', group: 2, period: 2, electrons: [2, 2], config: '1s² 2s²', condensedConfig: '[He] 2s²', electronegativity: 1.57, atomicRadius: 112, ionizationEnergy: 899, phase: 'solid', valency: 2, commonIsotopes: [{ massNumber: 9, abundance: 100, stable: true }], summary: 'Relatively rare, lightweight metal used in aerospace alloys.' },
  { number: 5, symbol: 'B', name: 'Boron', mass: 10.81, category: 'metalloid', group: 13, period: 2, electrons: [2, 3], config: '1s² 2s² 2p¹', condensedConfig: '[He] 2s² 2p¹', electronegativity: 2.04, atomicRadius: 87, ionizationEnergy: 801, phase: 'solid', valency: 3, commonIsotopes: [{ massNumber: 11, abundance: 80.1, stable: true }, { massNumber: 10, abundance: 19.9, stable: true }], summary: 'Low-abundance metalloid used in borosilicate glass and electronics.' },
  { number: 6, symbol: 'C', name: 'Carbon', mass: 12.011, category: 'nonmetal', group: 14, period: 2, electrons: [2, 4], config: '1s² 2s² 2p²', condensedConfig: '[He] 2s² 2p²', electronegativity: 2.55, atomicRadius: 67, ionizationEnergy: 1086, phase: 'solid', valency: 4, commonIsotopes: [{ massNumber: 12, abundance: 98.9, stable: true }, { massNumber: 13, abundance: 1.1, stable: true }, { massNumber: 14, abundance: 0.0001, stable: false }], summary: 'Basis of all known organic life. Forms 4 covalent bonds via sp³/sp² hybridization.' },
  { number: 7, symbol: 'N', name: 'Nitrogen', mass: 14.007, category: 'nonmetal', group: 15, period: 2, electrons: [2, 5], config: '1s² 2s² 2p³', condensedConfig: '[He] 2s² 2p³', electronegativity: 3.04, atomicRadius: 56, ionizationEnergy: 1402, phase: 'gas', valency: 3, commonIsotopes: [{ massNumber: 14, abundance: 99.63, stable: true }, { massNumber: 15, abundance: 0.37, stable: true }], summary: 'Makes up 78% of Earth atmosphere as N₂ gas with a strong triple bond.' },
  { number: 8, symbol: 'O', name: 'Oxygen', mass: 15.999, category: 'nonmetal', group: 16, period: 2, electrons: [2, 6], config: '1s² 2s² 2p⁴', condensedConfig: '[He] 2s² 2p⁴', electronegativity: 3.44, atomicRadius: 48, ionizationEnergy: 1314, phase: 'gas', valency: 2, commonIsotopes: [{ massNumber: 16, abundance: 99.76, stable: true }, { massNumber: 18, abundance: 0.20, stable: true }], summary: 'Highly reactive nonmetal, essential for respiration and oxidation.' },
  { number: 9, symbol: 'F', name: 'Fluorine', mass: 18.998, category: 'halogen', group: 17, period: 2, electrons: [2, 7], config: '1s² 2s² 2p⁵', condensedConfig: '[He] 2s² 2p⁵', electronegativity: 3.98, atomicRadius: 42, ionizationEnergy: 1681, phase: 'gas', valency: 1, commonIsotopes: [{ massNumber: 19, abundance: 100, stable: true }], summary: 'The most electronegative element in the periodic table. Extremely reactive gas.' },
  { number: 10, symbol: 'Ne', name: 'Neon', mass: 20.180, category: 'noble-gas', group: 18, period: 2, electrons: [2, 8], config: '1s² 2s² 2p⁶', condensedConfig: '[He] 2s² 2p⁶', electronegativity: undefined, atomicRadius: 38, ionizationEnergy: 2081, phase: 'gas', valency: 0, commonIsotopes: [{ massNumber: 20, abundance: 90.48, stable: true }, { massNumber: 22, abundance: 9.25, stable: true }], summary: 'Inert noble gas that glows reddish-orange in high-voltage discharge tubes.' },
  { number: 11, symbol: 'Na', name: 'Sodium', mass: 22.990, category: 'alkali-metal', group: 1, period: 3, electrons: [2, 8, 1], config: '1s² 2s² 2p⁶ 3s¹', condensedConfig: '[Ne] 3s¹', electronegativity: 0.93, atomicRadius: 190, ionizationEnergy: 496, phase: 'solid', valency: 1, commonIsotopes: [{ massNumber: 23, abundance: 100, stable: true }], summary: 'Soft, highly reactive metal that reacts violently with water.' },
  { number: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.305, category: 'alkaline-earth', group: 2, period: 3, electrons: [2, 8, 2], config: '1s² 2s² 2p⁶ 3s²', condensedConfig: '[Ne] 3s²', electronegativity: 1.31, atomicRadius: 145, ionizationEnergy: 738, phase: 'solid', valency: 2, commonIsotopes: [{ massNumber: 24, abundance: 78.99, stable: true }, { massNumber: 25, abundance: 10.0, stable: true }, { massNumber: 26, abundance: 11.01, stable: true }], summary: 'Shiny grey solid that burns with a brilliant white flame to form MgO.' },
  { number: 13, symbol: 'Al', name: 'Aluminium', mass: 26.982, category: 'post-transition', group: 13, period: 3, electrons: [2, 8, 3], config: '1s² 2s² 2p⁶ 3s² 3p¹', condensedConfig: '[Ne] 3s² 3p¹', electronegativity: 1.61, atomicRadius: 118, ionizationEnergy: 578, phase: 'solid', valency: 3, commonIsotopes: [{ massNumber: 27, abundance: 100, stable: true }], summary: 'Abundant lightweight metal with excellent corrosion resistance due to Al₂O₃ oxide layer.' },
  { number: 14, symbol: 'Si', name: 'Silicon', mass: 28.085, category: 'metalloid', group: 14, period: 3, electrons: [2, 8, 4], config: '1s² 2s² 2p⁶ 3s² 3p²', condensedConfig: '[Ne] 3s² 3p²', electronegativity: 1.90, atomicRadius: 111, ionizationEnergy: 787, phase: 'solid', valency: 4, commonIsotopes: [{ massNumber: 28, abundance: 92.23, stable: true }, { massNumber: 29, abundance: 4.68, stable: true }, { massNumber: 30, abundance: 3.09, stable: true }], summary: 'Semiconductor metalloid vital to computer microchips and solar cells.' },
  { number: 15, symbol: 'P', name: 'Phosphorus', mass: 30.974, category: 'nonmetal', group: 15, period: 3, electrons: [2, 8, 5], config: '1s² 2s² 2p⁶ 3s² 3p³', condensedConfig: '[Ne] 3s² 3p³', electronegativity: 2.19, atomicRadius: 98, ionizationEnergy: 1012, phase: 'solid', valency: 3, commonIsotopes: [{ massNumber: 31, abundance: 100, stable: true }], summary: 'Essential nutrient in DNA, RNA, and ATP. Occurs as white and red allotropes.' },
  { number: 16, symbol: 'S', name: 'Sulfur', mass: 32.06, category: 'nonmetal', group: 16, period: 3, electrons: [2, 8, 6], config: '1s² 2s² 2p⁶ 3s² 3p⁴', condensedConfig: '[Ne] 3s² 3p⁴', electronegativity: 2.58, atomicRadius: 88, ionizationEnergy: 1000, phase: 'solid', valency: 2, commonIsotopes: [{ massNumber: 32, abundance: 94.99, stable: true }, { massNumber: 34, abundance: 4.25, stable: true }], summary: 'Yellow crystalline solid used in sulfuric acid production and fertilizers.' },
  { number: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, category: 'halogen', group: 17, period: 3, electrons: [2, 8, 7], config: '1s² 2s² 2p⁶ 3s² 3p⁵', condensedConfig: '[Ne] 3s² 3p⁵', electronegativity: 3.16, atomicRadius: 79, ionizationEnergy: 1251, phase: 'gas', valency: 1, commonIsotopes: [{ massNumber: 35, abundance: 75.77, stable: true }, { massNumber: 37, abundance: 24.23, stable: true }], summary: 'Yellow-green toxic halogen gas used for water purification and table salt (NaCl).' },
  { number: 18, symbol: 'Ar', name: 'Argon', mass: 39.948, category: 'noble-gas', group: 18, period: 3, electrons: [2, 8, 8], config: '1s² 2s² 2p⁶ 3s² 3p⁶', condensedConfig: '[Ne] 3s² 3p⁶', electronegativity: undefined, atomicRadius: 71, ionizationEnergy: 1521, phase: 'gas', valency: 0, commonIsotopes: [{ massNumber: 40, abundance: 99.6, stable: true }], summary: 'Third most abundant gas in Earth atmosphere. Used in inert welding atmospheres.' },
  { number: 19, symbol: 'K', name: 'Potassium', mass: 39.098, category: 'alkali-metal', group: 1, period: 4, electrons: [2, 8, 8, 1], config: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹', condensedConfig: '[Ar] 4s¹', electronegativity: 0.82, atomicRadius: 243, ionizationEnergy: 419, phase: 'solid', valency: 1, commonIsotopes: [{ massNumber: 39, abundance: 93.26, stable: true }, { massNumber: 41, abundance: 6.73, stable: true }], summary: 'Essential biological alkali metal required for nerve signal transmission.' },
  { number: 20, symbol: 'Ca', name: 'Calcium', mass: 40.078, category: 'alkaline-earth', group: 2, period: 4, electrons: [2, 8, 8, 2], config: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s²', condensedConfig: '[Ar] 4s²', electronegativity: 1.00, atomicRadius: 194, ionizationEnergy: 590, phase: 'solid', valency: 2, commonIsotopes: [{ massNumber: 40, abundance: 96.94, stable: true }], summary: 'Vital for bone structure, teeth, and cement manufacture.' },
  { number: 26, symbol: 'Fe', name: 'Iron', mass: 55.845, category: 'transition-metal', group: 8, period: 4, electrons: [2, 8, 14, 2], config: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶', condensedConfig: '[Ar] 3d⁶ 4s²', electronegativity: 1.83, atomicRadius: 156, ionizationEnergy: 762, phase: 'solid', valency: 2, commonIsotopes: [{ massNumber: 56, abundance: 91.75, stable: true }, { massNumber: 54, abundance: 5.85, stable: true }], summary: 'Most common element on Earth by mass, core component of steel.' },
  { number: 29, symbol: 'Cu', name: 'Copper', mass: 63.546, category: 'transition-metal', group: 11, period: 4, electrons: [2, 8, 18, 1], config: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹ 3d¹⁰', condensedConfig: '[Ar] 3d¹⁰ 4s¹', electronegativity: 1.90, atomicRadius: 145, ionizationEnergy: 745, phase: 'solid', valency: 2, commonIsotopes: [{ massNumber: 63, abundance: 69.15, stable: true }, { massNumber: 65, abundance: 30.85, stable: true }], summary: 'Ductile metal with exceptionally high thermal and electrical conductivity.' },
  { number: 30, symbol: 'Zn', name: 'Zinc', mass: 65.38, category: 'transition-metal', group: 12, period: 4, electrons: [2, 8, 18, 2], config: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰', condensedConfig: '[Ar] 3d¹⁰ 4s²', electronegativity: 1.65, atomicRadius: 142, ionizationEnergy: 906, phase: 'solid', valency: 2, commonIsotopes: [{ massNumber: 64, abundance: 49.2, stable: true }, { massNumber: 66, abundance: 27.7, stable: true }], summary: 'Used for galvanizing steel to prevent rusting and in galvanic battery cells.' },
  { number: 35, symbol: 'Br', name: 'Bromine', mass: 79.904, category: 'halogen', group: 17, period: 4, electrons: [2, 8, 18, 7], config: '1s² ... 4s² 4p⁵', condensedConfig: '[Ar] 3d¹⁰ 4s² 4p⁵', electronegativity: 2.96, atomicRadius: 94, ionizationEnergy: 1140, phase: 'liquid', valency: 1, commonIsotopes: [{ massNumber: 79, abundance: 50.69, stable: true }, { massNumber: 81, abundance: 49.31, stable: true }], summary: 'Red-brown liquid nonmetal at room temp with strong evaporating fumes.' },
  { number: 36, symbol: 'Kr', name: 'Krypton', mass: 83.798, category: 'noble-gas', group: 18, period: 4, electrons: [2, 8, 18, 8], config: '1s² ... 4s² 4p⁶', condensedConfig: '[Ar] 3d¹⁰ 4s² 4p⁶', electronegativity: 3.00, atomicRadius: 88, ionizationEnergy: 1351, phase: 'gas', valency: 0, commonIsotopes: [{ massNumber: 84, abundance: 57.0, stable: true }], summary: 'Noble gas used in flash lamps and high-speed photography lighting.' },
];

// Helper to fill grid placeholders for elements 1-118
function getElementByNumber(z: number): ElementData {
  const found = ELEMENTS.find(e => e.number === z);
  if (found) return found;

  // Fallback metadata generator for elements above Z=36
  let group = 1;
  let period = 1;
  let category: ElementCategory = 'transition-metal';

  if (z >= 57 && z <= 71) {
    category = 'lanthanide';
    period = 6;
    group = 3;
  } else if (z >= 89 && z <= 103) {
    category = 'actinide';
    period = 7;
    group = 3;
  } else {
    if (z <= 2) period = 1;
    else if (z <= 10) period = 2;
    else if (z <= 18) period = 3;
    else if (z <= 36) period = 4;
    else if (z <= 54) period = 5;
    else if (z <= 86) period = 6;
    else period = 7;

    if (z === 37 || z === 55 || z === 87) group = 1;
    else if (z === 38 || z === 56 || z === 88) group = 2;
    else if (z === 54 || z === 86 || z === 118) group = 18;
    else if (z === 53 || z === 85 || z === 117) group = 17;
  }

  const SYMBOLS = [
    '', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
    'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
    'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
    'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm',
    'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'
  ];

  const NAMES = [
    '', 'Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon', 'Nitrogen', 'Oxygen', 'Fluorine', 'Neon',
    'Sodium', 'Magnesium', 'Aluminium', 'Silicon', 'Phosphorus', 'Sulfur', 'Chlorine', 'Argon', 'Potassium', 'Calcium',
    'Scandium', 'Titanium', 'Vanadium', 'Chromium', 'Manganese', 'Iron', 'Cobalt', 'Nickel', 'Copper', 'Zinc', 'Gallium',
    'Germanium', 'Arsenic', 'Selenium', 'Bromine', 'Krypton', 'Rubidium', 'Strontium', 'Yttrium', 'Zirconium', 'Niobium',
    'Molybdenum', 'Technetium', 'Ruthenium', 'Rhodium', 'Palladium', 'Silver', 'Cadmium', 'Indium', 'Tin', 'Antimony',
    'Tellurium', 'Iodine', 'Xenon', 'Caesium', 'Barium', 'Lanthanum', 'Cerium', 'Praseodymium', 'Neodymium', 'Promethium',
    'Samarium', 'Europium', 'Gadolinium', 'Terbium', 'Dysprosium', 'Holmium', 'Erbium', 'Thulium', 'Ytterbium', 'Lutetium',
    'Hafnium', 'Tantalum', 'Tungsten', 'Rhenium', 'Osmium', 'Iridium', 'Platinum', 'Gold', 'Mercury', 'Thallium', 'Lead',
    'Bismuth', 'Polonium', 'Astatine', 'Radon', 'Francium', 'Radium', 'Actinium', 'Thorium', 'Protactinium', 'Uranium',
    'Neptunium', 'Plutonium', 'Americium', 'Curium', 'Berkelium', 'Californium', 'Einsteinium', 'Fermium', 'Mendelevium',
    'Nobelium', 'Lawrencium', 'Rutherfordium', 'Dubnium', 'Seaborgium', 'Bohrium', 'Hassium', 'Meitnerium', 'Darmstadtium',
    'Roentgenium', 'Copernicium', 'Nihonium', 'Flerovium', 'Moscovium', 'Livermorium', 'Tennessine', 'Oganesson'
  ];

  return {
    number: z,
    symbol: SYMBOLS[z] || `E${z}`,
    name: NAMES[z] || `Element ${z}`,
    mass: Math.round(z * 2.1),
    category,
    group,
    period,
    electrons: [2, 8, Math.max(1, z - 10)],
    config: `Z=${z} configuration`,
    condensedConfig: `[Core] + ${z}e⁻`,
    phase: z === 80 || z === 35 ? 'liquid' : z === 1 || z === 2 || z === 7 || z === 8 || z === 9 || z === 10 || z === 17 || z === 18 || z === 36 || z === 54 || z === 86 ? 'gas' : 'solid',
    valency: 1,
    commonIsotopes: [{ massNumber: Math.round(z * 2.1), abundance: 100, stable: true }],
    summary: `Chemical element with atomic number ${z}.`
  };
}

type TabId = 'periodic' | 'builder' | 'config' | 'trends' | 'quiz';

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'periodic', label: 'Periodic Table', icon: Atom },
  { id: 'builder', label: 'Atom Builder', icon: Sparkles },
  { id: 'config', label: 'Electron Config', icon: Layers },
  { id: 'trends', label: 'Periodic Trends', icon: TrendingUp },
  { id: 'quiz', label: 'Quiz & Practice', icon: HelpCircle },
];

/* ────────── MAIN COMPONENT ────────── */

export default function AtomPeriodicLab() {
  const [activeTab, setActiveTab] = useState<TabId>('periodic');
  const [selectedElement, setSelectedElement] = useState<ElementData>(ELEMENTS[5]); // Default: Carbon

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 lg:gap-6 p-3 lg:p-6 overflow-auto">
      {/* Simulation Box */}
      <div className="flex-1 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden min-h-[500px]">
        {/* Header */}
        <div className="p-3 lg:p-4 border-b border-[#F1F5F9] flex justify-between items-center bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <Atom className="w-4 h-4 lg:w-5 lg:h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="font-bold text-xs lg:text-sm tracking-tight uppercase text-[#1E293B]">
                The Atom & Periodic Table
              </h2>
              <p className="text-[10px] text-[#64748B]">Grade 10 CAPS Physical Sciences · Atomic Structure</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[9px] font-mono bg-blue-50 text-blue-700 border-blue-200">
              {selectedElement.name} ({selectedElement.symbol}) Z={selectedElement.number}
            </Badge>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#F8FAFC] border-b border-[#F1F5F9] px-2 lg:px-4 gap-1 overflow-x-auto">
          {TABS.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-[#2563EB] text-[#2563EB] bg-white shadow-xs'
                    : 'border-transparent text-[#94A3B8] hover:text-[#64748B] hover:bg-slate-100/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-6 bg-slate-50/50">
          {activeTab === 'periodic' && (
            <PeriodicTablePanel selected={selectedElement} onSelect={setSelectedElement} />
          )}
          {activeTab === 'builder' && (
            <AtomBuilderPanel selected={selectedElement} onSelect={setSelectedElement} />
          )}
          {activeTab === 'config' && (
            <ElectronConfigPanel selected={selectedElement} onSelect={setSelectedElement} />
          )}
          {activeTab === 'trends' && (
            <PeriodicTrendsPanel selected={selectedElement} onSelect={setSelectedElement} />
          )}
          {activeTab === 'quiz' && (
            <QuizPanel />
          )}
        </div>
      </div>

      {/* Info Sidebar */}
      <div className="w-full lg:w-[340px] flex flex-col gap-4 lg:gap-6 shrink-0">
        {/* Selected Element Quick Inspector Card */}
        <Card className="p-4 lg:p-5 border-[#E2E8F0] shadow-sm bg-white">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Atomic Number Z={selectedElement.number}</span>
              <h3 className="text-xl font-black text-slate-900 leading-none mt-0.5">{selectedElement.name}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedElement.condensedConfig}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border ${CATEGORY_COLORS[selectedElement.category].bg} ${CATEGORY_COLORS[selectedElement.category].border} shadow-inner`}>
              <span className="text-[9px] font-bold text-slate-400 self-start ml-1.5">{selectedElement.number}</span>
              <span className={`text-xl font-black ${CATEGORY_COLORS[selectedElement.category].text}`}>{selectedElement.symbol}</span>
            </div>
          </div>

          <Badge variant="outline" className={`text-[10px] mb-3 ${CATEGORY_COLORS[selectedElement.category].bg} ${CATEGORY_COLORS[selectedElement.category].text}`}>
            {CATEGORY_LABELS[selectedElement.category]}
          </Badge>

          <p className="text-xs text-slate-600 mb-4 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {selectedElement.summary}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-50 p-2 rounded border border-slate-100">
              <span className="text-[9px] text-slate-400 uppercase block font-sans">Atomic Mass A</span>
              <span className="font-bold text-slate-800">{selectedElement.mass.toFixed(3)} u</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-100">
              <span className="text-[9px] text-slate-400 uppercase block font-sans">Valency</span>
              <span className="font-bold text-slate-800">{selectedElement.valency}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-100">
              <span className="text-[9px] text-slate-400 uppercase block font-sans">Electronegativity</span>
              <span className="font-bold text-slate-800">{selectedElement.electronegativity ?? 'N/A'}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-100">
              <span className="text-[9px] text-slate-400 uppercase block font-sans">Atomic Radius</span>
              <span className="font-bold text-slate-800">{selectedElement.atomicRadius ? `${selectedElement.atomicRadius} pm` : 'N/A'}</span>
            </div>
          </div>
        </Card>

        {/* CAPS Exam Concept Card */}
        <Card className="p-4 lg:p-5 border-blue-100 shadow-sm bg-gradient-to-br from-slate-900 to-blue-950 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-200">CAPS Exam Core Concepts</h4>
          </div>
          <ul className="text-xs space-y-2 text-blue-100/90 leading-relaxed list-disc list-inside">
            <li><strong className="text-white">Atomic Number (Z):</strong> Number of protons in nucleus. Defines element identity.</li>
            <li><strong className="text-white">Mass Number (A):</strong> Total protons + neutrons ($A = Z + N$).</li>
            <li><strong className="text-white">Isotopes:</strong> Atoms of same element ($Z$) with different number of neutrons ($N$).</li>
            <li><strong className="text-white">Aufbau Principle:</strong> Orbitals fill in order of increasing energy level.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ────────── SUB-PANEL 1: PERIODIC TABLE ────────── */

function PeriodicTablePanel({
  selected,
  onSelect
}: {
  selected: ElementData;
  onSelect: (el: ElementData) => void;
}) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredGrid = useMemo(() => {
    const list: (ElementData | null)[] = [];
    // Standard periodic grid: 7 periods, 18 columns
    for (let p = 1; p <= 7; p++) {
      for (let g = 1; g <= 18; g++) {
        let z = 0;
        if (p === 1) {
          if (g === 1) z = 1;
          if (g === 18) z = 2;
        } else if (p === 2) {
          if (g === 1) z = 3;
          if (g === 2) z = 4;
          if (g >= 13) z = g - 13 + 5;
        } else if (p === 3) {
          if (g === 1) z = 11;
          if (g === 2) z = 12;
          if (g >= 13) z = g - 13 + 13;
        } else if (p === 4) {
          z = g + 18;
        } else if (p === 5) {
          z = g + 36;
        } else if (p === 6) {
          if (g === 1) z = 55;
          if (g === 2) z = 56;
          if (g === 3) z = 57;
          if (g >= 4) z = g + 68;
        } else if (p === 7) {
          if (g === 1) z = 87;
          if (g === 2) z = 88;
          if (g === 3) z = 89;
          if (g >= 4) z = g + 100;
        }

        if (z > 0) {
          list.push(getElementByNumber(z));
        } else {
          list.push(null);
        }
      }
    }
    return list;
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search element (e.g. Carbon, Fe, 6)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        {/* Category Legend Pills */}
        <div className="flex flex-wrap gap-1 max-w-full">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
              filterCategory === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            All
          </button>
          {(Object.keys(CATEGORY_LABELS) as ElementCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(filterCategory === cat ? 'all' : cat)}
              className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                CATEGORY_COLORS[cat].bg
              } ${CATEGORY_COLORS[cat].text} ${CATEGORY_COLORS[cat].border} ${
                filterCategory === cat ? 'ring-2 ring-blue-500 font-bold scale-105' : 'opacity-80 hover:opacity-100'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Periodic Table Grid */}
      <div className="bg-white p-3 lg:p-4 rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <div className="grid grid-cols-[repeat(18,minmax(34px,1fr))] gap-1 min-w-[640px]">
          {filteredGrid.map((el, idx) => {
            if (!el) {
              return <div key={`empty-${idx}`} className="h-10 lg:h-12" />;
            }

            const matchesSearch =
              !search ||
              el.name.toLowerCase().includes(search.toLowerCase()) ||
              el.symbol.toLowerCase().includes(search.toLowerCase()) ||
              el.number.toString() === search.trim();

            const matchesCat = filterCategory === 'all' || el.category === filterCategory;
            const isHighlighted = matchesSearch && matchesCat;
            const isSelected = selected.number === el.number;

            const catColors = CATEGORY_COLORS[el.category];

            return (
              <motion.button
                key={`el-${el.number}`}
                whileHover={{ scale: 1.08, zIndex: 20 }}
                onClick={() => onSelect(el)}
                className={`relative flex flex-col items-center justify-center p-1 rounded-lg border text-center transition-all h-10 lg:h-12 ${
                  catColors.bg
                } ${catColors.border} ${
                  isSelected
                    ? 'ring-2 ring-blue-600 font-bold shadow-md z-10 scale-105'
                    : isHighlighted
                    ? 'opacity-100'
                    : 'opacity-25 grayscale'
                }`}
              >
                <span className="text-[7px] lg:text-[8px] font-bold text-slate-400 absolute top-0.5 left-1">
                  {el.number}
                </span>
                <span className={`text-xs lg:text-sm font-black ${catColors.text} leading-none mt-1`}>
                  {el.symbol}
                </span>
                <span className="text-[7px] text-slate-500 font-mono hidden lg:block leading-none mt-0.5 truncate max-w-full">
                  {el.mass.toFixed(1)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ────────── SUB-PANEL 2: ATOM & ISOTOPE BUILDER ────────── */

function AtomBuilderPanel({
  selected,
  onSelect
}: {
  selected: ElementData;
  onSelect: (el: ElementData) => void;
}) {
  const [protons, setProtons] = useState<number>(selected.number);
  const [neutrons, setNeutrons] = useState<number>(Math.round(selected.mass - selected.number));
  const [electrons, setElectrons] = useState<number>(selected.number);

  React.useEffect(() => {
    setProtons(selected.number);
    setNeutrons(Math.round(selected.mass - selected.number));
    setElectrons(selected.number);
  }, [selected.number]);

  const currentElement = getElementByNumber(protons);
  const massNumber = protons + neutrons;
  const netCharge = protons - electrons;

  const chargeLabel =
    netCharge === 0
      ? 'Neutral Atom'
      : netCharge > 0
      ? `Cation (+${netCharge})`
      : `Anion (${netCharge})`;

  const ratio = neutrons / (protons || 1);
  const isStable = protons <= 20 ? Math.abs(ratio - 1.0) < 0.25 : ratio >= 1.1 && ratio <= 1.5;

  const shells = useMemo(() => {
    let rem = electrons;
    const s: number[] = [];
    const caps = [2, 8, 18, 32];
    for (let c of caps) {
      if (rem <= 0) break;
      const count = Math.min(rem, c);
      s.push(count);
      rem -= count;
    }
    return s.length > 0 ? s : [0];
  }, [electrons]);

  const [iso1Mass, setIso1Mass] = useState(35);
  const [iso1Abun, setIso1Abun] = useState(75.77);
  const [iso2Mass, setIso2Mass] = useState(37);
  const [iso2Abun, setIso2Abun] = useState(24.23);

  const calculatedAr = ((iso1Mass * iso1Abun + iso2Mass * iso2Abun) / 100).toFixed(3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Particle Stepper Controls */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <Card className="p-4 border-slate-200 bg-white">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide mb-4">
            Subatomic Particle Control
          </h3>

          {/* Protons Slider */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-red-600 flex items-center gap-1">
                🔴 Protons (Z): <span className="text-sm font-black">{protons}</span>
              </span>
              <span className="text-[10px] text-slate-400">Determines Element</span>
            </div>
            <Slider
              value={[protons]}
              min={1}
              max={36}
              step={1}
              onValueChange={(val) => {
                const v = (val as number[])[0];
                setProtons(v);
                onSelect(getElementByNumber(v));
              }}
            />
          </div>

          {/* Neutrons Slider */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-blue-600 flex items-center gap-1">
                🔵 Neutrons (N): <span className="text-sm font-black">{neutrons}</span>
              </span>
              <span className="text-[10px] text-slate-400">Determines Isotope</span>
            </div>
            <Slider
              value={[neutrons]}
              min={0}
              max={45}
              step={1}
              onValueChange={(val) => setNeutrons((val as number[])[0])}
            />
          </div>

          {/* Electrons Slider */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-amber-600 flex items-center gap-1">
                🟡 Electrons (e⁻): <span className="text-sm font-black">{electrons}</span>
              </span>
              <span className="text-[10px] text-slate-400">Determines Charge</span>
            </div>
            <Slider
              value={[electrons]}
              min={0}
              max={36}
              step={1}
              onValueChange={(val) => setElectrons((val as number[])[0])}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setProtons(selected.number);
              setNeutrons(Math.round(selected.mass - selected.number));
              setElectrons(selected.number);
            }}
            className="w-full text-xs gap-1.5 text-slate-600"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Neutral {currentElement.name}
          </Button>
        </Card>

        {/* Live Isotope Summary */}
        <Card className="p-4 border-slate-200 bg-white space-y-3">
          <h4 className="font-bold text-xs uppercase text-slate-700">Atomic Identity & Symbol</h4>
          <div className="flex items-center justify-between bg-slate-900 text-white p-3 rounded-xl">
            <div className="flex flex-col items-center leading-none font-mono">
              <span className="text-xs text-amber-300 font-bold">{massNumber}</span>
              <span className="text-xs text-blue-300 font-bold">{protons}</span>
            </div>
            <span className="text-3xl font-black text-white">{currentElement.symbol}</span>
            <div className="text-right font-mono">
              <span className="text-xs block text-slate-300 font-bold">{chargeLabel}</span>
              <span className="text-[10px] text-slate-400">
                {isStable ? '🟢 Stable Isotope' : '🔴 Unstable / Radioactive'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* 2D Bohr Visualizer Canvas */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <Card className="p-4 border-slate-200 bg-white flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
          <span className="absolute top-3 left-3 text-[10px] font-bold text-slate-400 uppercase">
            Interactive Bohr Model Simulation
          </span>

          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            {shells.map((count, sIdx) => {
              const radius = 40 + sIdx * 32;
              return (
                <div key={`shell-${sIdx}`} className="absolute">
                  <div
                    className="rounded-full border border-dashed border-slate-300"
                    style={{ width: radius * 2, height: radius * 2 }}
                  />
                  {Array.from({ length: count }).map((_, eIdx) => {
                    const angle = (eIdx / count) * 360;
                    const rad = (angle * Math.PI) / 180;
                    const x = radius * Math.cos(rad);
                    const y = radius * Math.sin(rad);

                    return (
                      <motion.div
                        key={`e-${sIdx}-${eIdx}`}
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 8 + sIdx * 4, ease: 'linear' }}
                        className="absolute w-full h-full left-0 top-0 flex items-center justify-center pointer-events-none"
                      >
                        <div
                          className="absolute w-3.5 h-3.5 bg-amber-400 border border-amber-600 rounded-full shadow-xs flex items-center justify-center text-[7px] font-bold text-slate-900"
                          style={{
                            transform: `translate(${x}px, ${y}px)`
                          }}
                        >
                          -
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}

            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-blue-600 rounded-full shadow-lg flex flex-col items-center justify-center z-10 text-white border-2 border-white">
              <span className="text-[10px] font-black">{protons}P</span>
              <span className="text-[9px] font-bold text-blue-200">{neutrons}N</span>
            </div>
          </div>

          <div className="flex gap-4 mt-2 text-[10px] text-slate-500 font-mono">
            <span>Shell breakdown: {shells.map((c, i) => `n=${i + 1}: ${c}e⁻`).join(' | ')}</span>
          </div>
        </Card>

        {/* CAPS Relative Atomic Mass (A_r) Calculator Tool */}
        <Card className="p-4 border-slate-200 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-xs uppercase text-slate-800">
              CAPS Isotopic Abundance & Relative Atomic Mass ($A_r$) Calculator
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Isotope 1 (e.g. ³⁵Cl)</span>
              <div className="flex gap-2">
                <div>
                  <label className="text-[9px] text-slate-400">Mass (u)</label>
                  <input
                    type="number"
                    value={iso1Mass}
                    onChange={e => setIso1Mass(Number(e.target.value))}
                    className="w-full p-1 border rounded bg-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400">Abundance (%)</label>
                  <input
                    type="number"
                    value={iso1Abun}
                    onChange={e => setIso1Abun(Number(e.target.value))}
                    className="w-full p-1 border rounded bg-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Isotope 2 (e.g. ³⁷Cl)</span>
              <div className="flex gap-2">
                <div>
                  <label className="text-[9px] text-slate-400">Mass (u)</label>
                  <input
                    type="number"
                    value={iso2Mass}
                    onChange={e => setIso2Mass(Number(e.target.value))}
                    className="w-full p-1 border rounded bg-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400">Abundance (%)</label>
                  <input
                    type="number"
                    value={iso2Abun}
                    onChange={e => setIso2Abun(Number(e.target.value))}
                    className="w-full p-1 border rounded bg-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-200 flex justify-between items-center text-xs font-mono">
            <span className="text-blue-800 font-bold">
              Formula: (Mass₁ × %₁) + (Mass₂ × %₂) / 100
            </span>
            <span className="text-base font-black text-blue-900">{calculatedAr} u</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ────────── SUB-PANEL 3: ELECTRON CONFIGURATION ────────── */

function ElectronConfigPanel({
  selected,
  onSelect
}: {
  selected: ElementData;
  onSelect: (el: ElementData) => void;
}) {
  const z = selected.number;

  const orbitals = [
    { name: '1s', capacity: 2 },
    { name: '2s', capacity: 2 },
    { name: '2p', capacity: 6 },
    { name: '3s', capacity: 2 },
    { name: '3p', capacity: 6 },
    { name: '4s', capacity: 2 },
    { name: '3d', capacity: 10 },
  ];

  const orbitalCounts = useMemo(() => {
    let rem = z;
    const res: Record<string, number> = {};
    for (let orb of orbitals) {
      if (rem <= 0) {
        res[orb.name] = 0;
      } else {
        const count = Math.min(rem, orb.capacity);
        res[orb.name] = count;
        rem -= count;
      }
    }
    return res;
  }, [z]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Selector */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-800 uppercase">
            Aufbau Energy Level Orbital Diagram
          </h3>
          <p className="text-[10px] text-slate-500">
            Filling order: 1s → 2s → 2p → 3s → 3p → 4s → 3d
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-mono bg-blue-50 text-blue-700">
          {selected.name} (Z={z}): {selected.config}
        </Badge>
      </div>

      {/* Orbital Box Diagram */}
      <div className="bg-white p-4 lg:p-6 rounded-xl border border-slate-200 space-y-6">
        <div className="flex flex-wrap gap-4 items-end justify-center">
          {orbitals.map(orb => {
            const count = orbitalCounts[orb.name] || 0;
            const numBoxes = orb.name.endsWith('p') ? 3 : orb.name.endsWith('d') ? 5 : 1;

            const boxes: ('empty' | 'up' | 'pair')[] = [];
            for (let b = 0; b < numBoxes; b++) {
              if (count === 0) boxes.push('empty');
              else if (count <= numBoxes) {
                boxes.push(b < count ? 'up' : 'empty');
              } else {
                const extra = count - numBoxes;
                boxes.push(b < extra ? 'pair' : 'up');
              }
            }

            return (
              <div key={orb.name} className="flex flex-col items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700 font-mono">
                  {orb.name}
                  <sup className="text-blue-600 font-extrabold">{count}</sup>
                </span>

                <div className="flex gap-1">
                  {boxes.map((box, bIdx) => (
                    <div
                      key={`${orb.name}-${bIdx}`}
                      className="w-9 h-11 border-2 border-slate-700 rounded bg-slate-50 flex items-center justify-center text-sm font-bold font-mono text-blue-700"
                    >
                      {box === 'up' && '↑'}
                      {box === 'pair' && '↑↓'}
                      {box === 'empty' && ''}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Lewis Dot Representation & Valence Electrons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">
              Lewis Valence Dot Diagram
            </span>
            <div className="w-20 h-20 bg-white rounded-2xl border-2 border-blue-300 flex items-center justify-center relative shadow-sm">
              <span className="text-2xl font-black text-slate-900">{selected.symbol}</span>
              {selected.electrons[selected.electrons.length - 1] >= 1 && (
                <div className="absolute top-1 text-blue-600 font-black text-sm">·</div>
              )}
              {selected.electrons[selected.electrons.length - 1] >= 2 && (
                <div className="absolute right-1.5 text-blue-600 font-black text-sm">·</div>
              )}
              {selected.electrons[selected.electrons.length - 1] >= 3 && (
                <div className="absolute bottom-1 text-blue-600 font-black text-sm">·</div>
              )}
              {selected.electrons[selected.electrons.length - 1] >= 4 && (
                <div className="absolute left-1.5 text-blue-600 font-black text-sm">·</div>
              )}
              {selected.electrons[selected.electrons.length - 1] >= 5 && (
                <div className="absolute top-1.5 left-6 text-blue-600 font-black text-sm">·</div>
              )}
              {selected.electrons[selected.electrons.length - 1] >= 6 && (
                <div className="absolute right-3 top-6 text-blue-600 font-black text-sm">·</div>
              )}
              {selected.electrons[selected.electrons.length - 1] >= 7 && (
                <div className="absolute bottom-1.5 left-6 text-blue-600 font-black text-sm">·</div>
              )}
              {selected.electrons[selected.electrons.length - 1] >= 8 && (
                <div className="absolute left-3 top-6 text-blue-600 font-black text-sm">·</div>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 uppercase">Valence & Core Electrons</h4>
            <p className="text-slate-600">
              <strong>Valence Electrons:</strong>{' '}
              <span className="font-mono font-bold text-blue-600">
                {selected.electrons[selected.electrons.length - 1]}
              </span>{' '}
              in outer shell.
            </p>
            <p className="text-slate-600">
              <strong>Core Electrons:</strong>{' '}
              <span className="font-mono font-bold text-slate-800">
                {z - selected.electrons[selected.electrons.length - 1]}
              </span>
            </p>
            <p className="text-slate-600">
              <strong>Condensed Noble Gas Notation:</strong>{' '}
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-900">
                {selected.condensedConfig}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────── SUB-PANEL 4: PERIODIC TRENDS ────────── */

function PeriodicTrendsPanel({
  selected,
  onSelect
}: {
  selected: ElementData;
  onSelect: (el: ElementData) => void;
}) {
  const [activeSeries, setActiveSeries] = useState<'p2' | 'p3' | 'g1' | 'g17'>('p3');

  const seriesData = useMemo(() => {
    if (activeSeries === 'p2') return [3, 4, 5, 6, 7, 8, 9, 10].map(getElementByNumber);
    if (activeSeries === 'p3') return [11, 12, 13, 14, 15, 16, 17, 18].map(getElementByNumber);
    if (activeSeries === 'g1') return [1, 3, 11, 19].map(getElementByNumber);
    return [9, 17, 35].map(getElementByNumber);
  }, [activeSeries]);

  return (
    <div className="flex flex-col gap-6">
      {/* Series Selector Buttons */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold text-sm text-slate-800 uppercase">
          Periodic Trends Analysis
        </h3>
        <div className="flex gap-1.5">
          <button
            onClick={() => setActiveSeries('p2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSeries === 'p2' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Period 2 (Li → Ne)
          </button>
          <button
            onClick={() => setActiveSeries('p3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSeries === 'p3' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Period 3 (Na → Ar)
          </button>
          <button
            onClick={() => setActiveSeries('g1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSeries === 'g1' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Group 1 (H → K)
          </button>
          <button
            onClick={() => setActiveSeries('g17')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSeries === 'g17' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Group 17 (F → Br)
          </button>
        </div>
      </div>

      {/* Visual Sphere Atomic Size Comparison */}
      <Card className="p-4 lg:p-6 border-slate-200 bg-white">
        <h4 className="font-bold text-xs uppercase text-slate-500 mb-4">
          Atomic Radius Comparison (Spheres in Picometers)
        </h4>

        <div className="flex items-end justify-around gap-2 overflow-x-auto pb-4">
          {seriesData.map(el => {
            const radius = el.atomicRadius || 50;
            const scale = radius / 2.5;

            return (
              <button
                key={el.number}
                onClick={() => onSelect(el)}
                className="flex flex-col items-center gap-2 group focus:outline-none"
              >
                <span className="text-[10px] font-mono text-slate-400">{radius} pm</span>
                <div
                  className="rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 shadow-md group-hover:ring-4 ring-blue-300 transition-all flex items-center justify-center text-white font-bold text-xs"
                  style={{ width: scale, height: scale }}
                >
                  {el.symbol}
                </div>
                <span className="text-xs font-bold text-slate-800">{el.symbol}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
          💡 <strong>Key Trend Rule:</strong> Across a Period (Left to Right), atomic radius <strong>decreases</strong> due to increasing effective nuclear charge (Z_eff) pulling electrons closer. Down a Group, atomic radius <strong>increases</strong> as new electron shells (n) are added.
        </div>
      </Card>

      {/* Numerical Data Graph Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Ionization Energy */}
        <Card className="p-4 border-slate-200 bg-white">
          <h4 className="font-bold text-xs uppercase text-slate-800 mb-3">
            First Ionization Energy (kJ/mol)
          </h4>
          <div className="space-y-2">
            {seriesData.map(el => (
              <div key={el.number} className="flex items-center gap-2 text-xs">
                <span className="w-8 font-bold text-slate-700 font-mono">{el.symbol}</span>
                <div className="flex-1 bg-slate-100 h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${((el.ionizationEnergy || 500) / 2500) * 100}%` }}
                  />
                </div>
                <span className="w-16 font-mono text-right font-bold text-slate-800">
                  {el.ionizationEnergy}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Electronegativity */}
        <Card className="p-4 border-slate-200 bg-white">
          <h4 className="font-bold text-xs uppercase text-slate-800 mb-3">
            Electronegativity (Pauling Scale)
          </h4>
          <div className="space-y-2">
            {seriesData.map(el => (
              <div key={el.number} className="flex items-center gap-2 text-xs">
                <span className="w-8 font-bold text-slate-700 font-mono">{el.symbol}</span>
                <div className="flex-1 bg-slate-100 h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${((el.electronegativity || 0) / 4) * 100}%` }}
                  />
                </div>
                <span className="w-16 font-mono text-right font-bold text-slate-800">
                  {el.electronegativity ?? 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ────────── SUB-PANEL 5: QUIZ & PRACTICE ────────── */

function QuizPanel() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      q: 'What subatomic particle defines the atomic number (Z) and identity of an element?',
      options: ['Neutrons', 'Protons', 'Electrons', 'Photons'],
      correct: 1,
      exp: 'Protons define the atomic number Z. Changing the number of protons changes the element itself.'
    },
    {
      q: 'An atom of Carbon-14 (Z=6) has how many neutrons?',
      options: ['6', '8', '14', '12'],
      correct: 1,
      exp: 'Neutrons = Mass Number A (14) - Atomic Number Z (6) = 8 neutrons.'
    },
    {
      q: 'Which principle states that electrons fill the lowest energy orbitals first?',
      options: ['Hund Rule', 'Pauli Exclusion Principle', 'Aufbau Principle', 'Boyle Law'],
      correct: 2,
      exp: 'The Aufbau Principle states orbitals fill in order of increasing energy level (1s → 2s → 2p → 3s...).'
    },
    {
      q: 'What is the correct electron configuration for Sodium (Z=11)?',
      options: ['1s² 2s² 2p⁶ 3s¹', '1s² 2s² 2p⁷', '1s² 2s² 3s⁷', '1s² 2s⁸ 3s¹'],
      correct: 0,
      exp: 'Sodium (Z=11) has 11 electrons: 1s² 2s² 2p⁶ 3s¹ or [Ne] 3s¹.'
    },
    {
      q: 'Across Period 3 from Sodium (Na) to Chlorine (Cl), atomic radius:',
      options: ['Increases', 'Decreases', 'Remains constant', 'Doubles'],
      correct: 1,
      exp: 'Across a period, nuclear charge Z increases while shielding stays constant, pulling electron shells closer and decreasing radius.'
    }
  ];

  const handleNext = () => {
    if (selectedOpt === questions[currentIdx].correct) {
      setScore(prev => prev + 1);
    }

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {!showResult ? (
        <Card className="p-6 border-slate-200 bg-white space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-blue-600 uppercase">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <Badge variant="outline" className="text-xs font-mono">Score: {score}</Badge>
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {questions[currentIdx].q}
          </h3>

          <div className="space-y-2.5">
            {questions[currentIdx].options.map((opt, optIdx) => (
              <button
                key={optIdx}
                onClick={() => setSelectedOpt(optIdx)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                  selectedOpt === optIdx
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>{opt}</span>
                {selectedOpt === optIdx && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </button>
            ))}
          </div>

          {selectedOpt !== null && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              💡 <strong>Explanation:</strong> {questions[currentIdx].exp}
            </div>
          )}

          <Button
            disabled={selectedOpt === null}
            onClick={handleNext}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 py-2.5"
          >
            {currentIdx + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Card>
      ) : (
        <Card className="p-8 border-slate-200 bg-white text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            🎉
          </div>
          <h3 className="text-xl font-black text-slate-900">Quiz Completed!</h3>
          <p className="text-sm text-slate-600">
            You scored <strong className="text-blue-600 font-bold">{score} out of {questions.length}</strong> on CAPS Atomic Structure.
          </p>

          <Button onClick={restartQuiz} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-2">
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </Button>
        </Card>
      )}
    </div>
  );
}

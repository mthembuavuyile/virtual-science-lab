import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Droplets,
  Filter,
  Beaker,
  Zap,
  Activity,
  Sun,
  CloudRain,
  Layers,
  RotateCcw,
  Download,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sliders,
  Sparkles,
  Share2,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Check,
  X,
  HelpCircle,
  TrendingUp,
  Waves,
  FlaskConical,
  Mountain,
  TreePine,
  ArrowDown,
  ArrowUp,
  BatteryCharging,
  Wind,
  Trash2,
  TestTube,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import AnalyzeExperimentPanel from '../AnalyzeExperimentPanel';
import RichText from '../ui/RichText';
import { useHardwareCapabilities } from '@/src/hooks/useHardwareCapabilities';
import { jsPDF } from 'jspdf';

/* ─────────────────────────────────────────────────────────────
   TYPES & DATA CONSTANTS
   ───────────────────────────────────────────────────────────── */

export type HydrosphereTab =
  | 'cycle'
  | 'purification'
  | 'ion-tests'
  | 'conductivity'
  | 'environment'
  | 'quiz';

interface TabItem {
  id: HydrosphereTab;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const TABS: TabItem[] = [
  { id: 'cycle', label: 'Water Cycle & Global Budget', shortLabel: 'Water Cycle', icon: Globe },
  { id: 'purification', label: 'Purification Plant', shortLabel: 'Purification', icon: Filter, badge: 'Industrial' },
  { id: 'ion-tests', label: 'Aqueous Ion Testing', shortLabel: 'Ion Tests', icon: Beaker, badge: 'CAPS Practical' },
  { id: 'conductivity', label: 'Conductivity & Salinity', shortLabel: 'Conductivity', icon: Zap },
  { id: 'environment', label: 'AMD & Eutrophication', shortLabel: 'Case Studies', icon: Mountain, badge: 'SA Context' },
  { id: 'quiz', label: 'CAPS Exam Quiz', shortLabel: 'Exam Prep', icon: HelpCircle, badge: '10 Qs' },
];

// Global Water Distribution Data
const GLOBAL_WATER_DATA = [
  { name: 'Oceans (Saltwater)', value: 97.2, color: '#0284c7', subtext: 'Saline water covering ~71% of Earth surface' },
  { name: 'Glaciers & Ice Caps', value: 2.15, color: '#38bdf8', subtext: 'Locked freshwater (Antarctica, Greenland)' },
  { name: 'Groundwater (Aquifers)', value: 0.62, color: '#10b981', subtext: 'Subsurface accessible freshwater' },
  { name: 'Lakes, Rivers & Atmosphere', value: 0.03, color: '#f59e0b', subtext: 'Readily accessible surface water & vapor' }
];

const SA_WATER_STATS = [
  { metric: 'Mean Annual Rainfall', sa: '450 mm/year', world: '860 mm/year', note: 'South Africa is the 30th driest country' },
  { metric: 'Rainfall Converted to Runoff', sa: 'Only 9%', world: '35% average', note: 'High evaporation losses due to sunny climate' },
  { metric: 'Surface Water Dependence', sa: '77%', world: '50%', note: 'Dams & river transfer schemes are vital' },
  { metric: 'Water Stressed Municipalities', sa: '> 55%', world: '30%', note: 'Requires strict conservation & purification' }
];

// Ion Testing Unknown Water Samples
export interface WaterSample {
  id: string;
  name: string;
  origin: string;
  description: string;
  ionsPresent: ('Cl-' | 'SO4-2' | 'CO3-2' | 'NO3-' | 'Ca2+' | 'Mg2+')[];
  hardnessType: 'None' | 'Temporary' | 'Permanent';
  initialAppearance: string;
  expectedConductivity: number; // uS/cm
}

const WATER_SAMPLES: WaterSample[] = [
  {
    id: 'sample-sea',
    name: 'Atlantic Ocean Seawater (Camps Bay, WC)',
    origin: 'Marine Coastal Water',
    description: 'High sodium chloride and sulfate content with natural oceanic mineral salts.',
    ionsPresent: ['Cl-', 'SO4-2', 'Ca2+', 'Mg2+'],
    hardnessType: 'Permanent',
    initialAppearance: 'Clear with slight oceanic tang',
    expectedConductivity: 52000
  },
  {
    id: 'sample-amd',
    name: 'Witwatersrand Mine Shaft Runoff (AMD)',
    origin: 'Acid Mine Drainage (Gauteng / Highveld)',
    description: 'High acidity, heavily concentrated in dissolved sulfates (SO₄²⁻) and iron ions from pyrite oxidation.',
    ionsPresent: ['SO4-2'],
    hardnessType: 'Permanent',
    initialAppearance: 'Yellow-orange tint, cloudy acidic precipitate',
    expectedConductivity: 14500
  },
  {
    id: 'sample-borehole',
    name: 'Karoo Dolomitic Borehole Groundwater',
    origin: 'Subterranean Limestone Aquifer',
    description: 'Rich in dissolved calcium hydrogen carbonate Ca(HCO₃)₂ and carbonates causing temporary hardness.',
    ionsPresent: ['CO3-2', 'Ca2+', 'Cl-'],
    hardnessType: 'Temporary',
    initialAppearance: 'Crystal clear, high mineral content',
    expectedConductivity: 850
  },
  {
    id: 'sample-agri',
    name: 'Agricultural Runoff Canal (Vaal Catchment)',
    origin: 'Farmland Drainage & Fertilizer Inflow',
    description: 'Enriched in dissolved nitrate fertilizers (NO₃⁻) and chloride salts.',
    ionsPresent: ['NO3-', 'Cl-'],
    hardnessType: 'None',
    initialAppearance: 'Slightly turbid with greenish algal traces',
    expectedConductivity: 1200
  },
  {
    id: 'sample-pure',
    name: 'Deionized Laboratory Standard (Control)',
    origin: 'Double-Distilled Pure H₂O',
    description: 'Zero dissolved ions; used as the scientific baseline control for purity and testing.',
    ionsPresent: [],
    hardnessType: 'None',
    initialAppearance: 'Ultra-pure, colorless, odorless',
    expectedConductivity: 0.05
  },
  {
    id: 'sample-mystery',
    name: 'Mystery Unknown Sample X (Diagnostic Test)',
    origin: 'Unlabeled Municipal Inflow',
    description: 'Perform qualitative chemical tests to deduce the identity of the dissolved ions!',
    ionsPresent: ['Cl-', 'SO4-2', 'Ca2+'],
    hardnessType: 'Permanent',
    initialAppearance: 'Clear transparent water',
    expectedConductivity: 2400
  }
];

// Conductivity Test Solutions
const CONDUCTIVITY_SOLUTIONS = [
  { id: 'pure', name: 'Deionized Pure Water', formula: 'H₂O (l)', ions: 'None (< 10⁻⁷ M)', ec: 0.05, tds: 0, bulb: 0, type: 'Non-Electrolyte', color: '#38bdf8' },
  { id: 'sugar', name: 'Sucrose Solution', formula: 'C₁₂H₂₂O₁₁ (aq)', ions: 'Neutral molecules only', ec: 1.2, tds: 500, bulb: 0, type: 'Non-Electrolyte (Molecular)', color: '#a855f7' },
  { id: 'tap', name: 'Municipal Tap Water', formula: 'H₂O + Trace Minerals', ions: 'Na⁺, Ca²⁺, Cl⁻, HCO₃⁻ (Trace)', ec: 240, tds: 150, bulb: 25, type: 'Weak Electrolyte', color: '#0ea5e9' },
  { id: 'river', name: 'Orange River Surface Water', formula: 'Natural Catchment Water', ions: 'Ca²⁺, Mg²⁺, SO₄²⁻, Cl⁻', ec: 780, tds: 490, bulb: 45, type: 'Moderate Electrolyte', color: '#10b981' },
  { id: 'amd', name: 'Acid Mine Drainage (AMD)', formula: 'H₂SO₄ + FeSO₄ (aq)', ions: 'H⁺, Fe²⁺, Fe³⁺, SO₄²⁻ (Dense)', ec: 14500, tds: 4800, bulb: 85, type: 'Strong Electrolyte (Acidic)', color: '#f59e0b' },
  { id: 'sea', name: 'Atlantic Seawater (3.5% Salinity)', formula: 'NaCl + MgCl₂ (aq)', ions: 'Na⁺, Cl⁻, Mg²⁺, SO₄²⁻, K⁺', ec: 52000, tds: 35000, bulb: 100, type: 'Strong Electrolyte', color: '#0284c7' },
];

// Comprehensive CAPS Hydrosphere Questions (10 Questions)
const CAPS_QUIZ_QUESTIONS = [
  {
    q: 'Which single source of energy primarily drives the global hydrological (water) cycle?',
    options: ['Geothermal heat from Earth mantle', 'Solar radiation from the Sun', 'Gravitational pull of the Moon', 'Frictional heat of atmospheric winds'],
    correct: 1,
    explanation: 'Solar radiation provides the thermal energy required to evaporate surface water from oceans and drive plant transpiration, initiating the water cycle.'
  },
  {
    q: 'In municipal water treatment, what is the specific chemical function of adding Aluminium Sulphate (Alum)?',
    options: [
      'Disinfecting pathogens and viruses',
      'Neutralizing suspended colloidal dirt particles to form large flocs (Coagulation/Flocculation)',
      'Adjusting the water taste and adding fluoride',
      'Dissolving permanent calcium hardness'
    ],
    correct: 1,
    explanation: 'Alum (Al₂(SO₄)₃) acts as a coagulant. It provides Al³⁺ ions that neutralize negatively charged colloidal clay particles, allowing them to clump into settleable flocs.'
  },
  {
    q: 'A student tests an unknown water sample by adding dilute HNO₃ followed by aqueous AgNO₃. A dense white precipitate forms which dissolves upon adding dilute aqueous ammonia (NH₃). Which ion is present?',
    options: ['Sulphate (SO₄²⁻)', 'Chloride (Cl⁻)', 'Carbonate (CO₃²⁻)', 'Nitrate (NO₃⁻)'],
    correct: 1,
    explanation: 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s) (white precipitate). AgCl dissolves in dilute NH₃ by forming the soluble diamminesilver(I) complex [Ag(NH₃)₂]⁺.'
  },
  {
    q: 'Which reagent pair is used in the prescribed CAPS qualitative test to confirm the presence of sulphate (SO₄²⁻) ions in water?',
    options: [
      'Dilute HNO₃ followed by Ba(NO₃)₂ solution',
      'Concentrated H₂SO₄ followed by FeSO₄',
      'Dilute HCl followed by limewater Ca(OH)₂',
      'Soap solution followed by boiling'
    ],
    correct: 0,
    explanation: 'Adding dilute HNO₃ (to eliminate carbonates) followed by Ba(NO₃)₂ or BaCl₂ produces a thick white precipitate of Barium Sulphate (BaSO₄), which is insoluble in acid.'
  },
  {
    q: 'Temporary water hardness is caused by which dissolved chemical compound?',
    options: [
      'Calcium sulphate (CaSO₄)',
      'Magnesium chloride (MgCl₂)',
      'Calcium hydrogen carbonate (Ca(HCO₃)₂)',
      'Sodium chloride (NaCl)'
    ],
    correct: 2,
    explanation: 'Temporary hardness is caused by dissolved Ca(HCO₃)₂ or Mg(HCO₃)₂. Heating/boiling decomposes it into insoluble calcium carbonate (limescale): Ca(HCO₃)₂ → CaCO₃(s) + H₂O + CO₂.'
  },
  {
    q: 'Why does a concentrated sucrose (table sugar) solution fail to conduct electricity, whereas a table salt (NaCl) solution conducts brightly?',
    options: [
      'Sucrose is insoluble in water',
      'Sucrose dissolves into neutral molecules with no free moving ions, whereas NaCl dissociates into mobile hydrated Na⁺ and Cl⁻ ions',
      'Sugar molecules absorb electrical current and store it as chemical energy',
      'Salt solutions have a much higher temperature than sugar solutions'
    ],
    correct: 1,
    explanation: 'Electrical conductivity in aqueous solutions requires mobile charge carriers (ions). Sucrose is a covalent molecular solute that stays neutral, while ionic NaCl dissociates into Na⁺ and Cl⁻.'
  },
  {
    q: 'What is the primary chemical cause of Acid Mine Drainage (AMD) in the Witwatersrand gold and Mpumalanga coal mining regions?',
    options: [
      'Leaching of limestone rock by acid rain',
      'Oxidation of pyrite (iron disulphide, FeS₂) when exposed to oxygen and water',
      'Discharge of untreated alkaline detergent waste',
      'Overuse of nitrogenous agricultural fertilizers'
    ],
    correct: 1,
    explanation: 'Pyrite oxidation: 2FeS₂ + 7O₂ + 2H₂O → 2Fe²⁺ + 4SO₄²⁻ + 4H⁺. This produces high concentrations of sulphuric acid and dissolved heavy metals.'
  },
  {
    q: 'How is Acid Mine Drainage (AMD) treated in neutralization plants before being released into river systems?',
    options: [
      'Adding concentrated nitric acid to oxidize metals',
      'Adding calcium carbonate (limestone) or slaked lime (Ca(OH)₂) to raise pH and precipitate heavy metals as hydroxides',
      'Boiling the water to evaporate the acid',
      'Passing it through coarse gravel screens only'
    ],
    correct: 1,
    explanation: 'Adding lime (Ca(OH)₂) neutralizes H⁺ ions, raises the pH from acidic (<3) to neutral (~7.5), and causes iron to precipitate as insoluble Fe(OH)₃ ("yellow boy") and gypsum (CaSO₄·2H₂O).'
  },
  {
    q: 'In the phenomenon of eutrophication in South African dams (such as Hartbeespoort Dam), what directly causes mass fish deaths?',
    options: [
      'Direct toxicity from solar radiation',
      'Bacteria decomposing massive algal blooms consume dissolved oxygen, causing severe hypoxia (oxygen depletion)',
      'Algae physically blocking fish gills from inhaling water',
      'A sharp increase in water salinity from ocean currents'
    ],
    correct: 1,
    explanation: 'Excess nitrates and phosphates trigger rapid algal blooms. When algae die, aerobic decomposers multiply rapidly and deplete dissolved oxygen (DO < 2 mg/L), suffocating aquatic life.'
  },
  {
    q: 'According to South African SANS 241 potable water quality standards, what is the acceptable target range for drinking water pH?',
    options: ['1.0 – 3.0', '4.0 – 5.5', '6.5 – 8.5', '10.0 – 14.0'],
    correct: 2,
    explanation: 'Potable water must have a near-neutral pH between 6.5 and 8.5 to prevent pipe corrosion (if too acidic) or heavy mineral scaling and bitter taste (if too alkaline).'
  }
];

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */

export default function HydrosphereLab() {
  const { vibrate, isFullscreen, toggleFullscreen, shareContent } = useHardwareCapabilities();
  const [activeTab, setActiveTab] = useState<HydrosphereTab>('cycle');

  // ==========================================
  // MODULE 1: WATER CYCLE STATE
  // ==========================================
  const [solarFlux, setSolarFlux] = useState<number>(650); // W/m² (100 - 1000)
  const [ambientTemp, setAmbientTemp] = useState<number>(24); // °C (-5 to 40)
  const [humidity, setHumidity] = useState<number>(55); // % (10 to 95)
  const [soilType, setSoilType] = useState<'sandy' | 'loam' | 'clay'>('loam');
  const [vegetationCover, setVegetationCover] = useState<number>(60); // %

  // Derived Water Cycle Metrics
  const waterCycleMetrics = useMemo(() => {
    // Evaporation: driven by solar flux and temp, inhibited by humidity
    const baseEvap = (solarFlux / 1000) * (Math.max(0, ambientTemp + 10) / 35) * (1 - humidity / 130);
    const evapRate = Math.max(0.2, parseFloat((baseEvap * 6.5).toFixed(2))); // mm/day

    // Transpiration: vegetation * temp * solar
    const transpRate = parseFloat(((vegetationCover / 100) * evapRate * 0.75).toFixed(2));

    // Cloud condensation index (0 - 100)
    const condensationIndex = Math.min(100, Math.max(10, Math.round(humidity * 0.7 + (evapRate + transpRate) * 5)));

    // Precipitation rate (mm/hr)
    const isPrecipitating = condensationIndex > 60;
    const precipRate = isPrecipitating ? parseFloat(((condensationIndex - 60) * 0.35).toFixed(2)) : 0;
    const precipType = ambientTemp <= 0 ? 'Snow/Sleet' : precipRate > 8 ? 'Heavy Thunderstorm' : precipRate > 0 ? 'Gentle Rain' : 'None';

    // Infiltration coefficient
    const soilInfilFactor = soilType === 'sandy' ? 0.75 : soilType === 'loam' ? 0.5 : 0.2;
    const infiltrationRate = parseFloat((precipRate * soilInfilFactor).toFixed(2));
    const surfaceRunoffRate = parseFloat((precipRate * (1 - soilInfilFactor)).toFixed(2));
    const damStorageM3s = parseFloat((surfaceRunoffRate * 12.5).toFixed(1));

    return {
      evapRate,
      transpRate,
      condensationIndex,
      precipRate,
      precipType,
      infiltrationRate,
      surfaceRunoffRate,
      damStorageM3s
    };
  }, [solarFlux, ambientTemp, humidity, soilType, vegetationCover]);

  // ==========================================
  // MODULE 2: WATER PURIFICATION PLANT STATE
  // ==========================================
  const [screenClear, setScreenClear] = useState<boolean>(true);
  const [coagulantDose, setCoagulantDose] = useState<number>(25); // mg/L Alum (0 to 60)
  const [paddleSpeed, setPaddleSpeed] = useState<number>(30); // RPM
  const [settlingTime, setSettlingTime] = useState<number>(45); // min (10 to 90)
  const [filterMedia, setFilterMedia] = useState<{ carbon: boolean; sand: boolean; gravel: boolean }>({
    carbon: true,
    sand: true,
    gravel: true
  });
  const [chlorineDose, setChlorineDose] = useState<number>(2.5); // mg/L (0 to 6)
  const [limeDose, setLimeDose] = useState<number>(15); // mg/L Ca(OH)2 (0 to 40)
  const [isPurifying, setIsPurifying] = useState<boolean>(true);

  // Water Quality Sensor Calculations
  const waterQuality = useMemo(() => {
    // Raw baseline values (polluted Vaal/Orange river water)
    const rawTurbidity = 95; // NTU
    const rawMicrobes = 6500; // CFU/100mL
    const rawTDS = 380; // mg/L
    const rawColor = 45; // Pt-Co
    const rawPH = 6.0;

    // Stage 1: Screening (removes floating trash, slight turbidity benefit)
    const screenBenefit = screenClear ? 0.9 : 1.0;

    // Stage 2 & 3: Coagulation + Sedimentation
    // Optimal alum is 25-35 mg/L, optimal paddle is 25-40 RPM, settling > 40 min
    const coagEfficiency = Math.max(0.1, 1 - Math.abs(coagulantDose - 30) / 45) * Math.min(1, paddleSpeed / 25);
    const settleEfficiency = Math.min(1, settlingTime / 50);
    const clarifierTurbidity = rawTurbidity * (1 - 0.75 * coagEfficiency * settleEfficiency) * screenBenefit;

    // Stage 4: Multi-media Filtration
    let filterMult = 1.0;
    if (filterMedia.gravel) filterMult *= 0.7;
    if (filterMedia.sand) filterMult *= 0.3;
    if (filterMedia.carbon) filterMult *= 0.15;
    const finalTurbidity = parseFloat((clarifierTurbidity * filterMult).toFixed(2));
    const finalColor = parseFloat((rawColor * (filterMedia.carbon ? 0.08 : 0.6)).toFixed(1));

    // Stage 5: Chlorination & Disinfection
    // Required chlorine for 6500 CFU is ~2.0 mg/L with good filtration
    const chlorineEfficiency = Math.min(1, chlorineDose / 2.2);
    const filterMicrobeRemoval = (filterMedia.sand && filterMedia.carbon) ? 0.92 : 0.5;
    const remainingMicrobes = Math.round(rawMicrobes * (1 - filterMicrobeRemoval) * Math.max(0, 1 - chlorineEfficiency * 1.05));
    const freeChlorineResidual = Math.max(0, parseFloat((chlorineDose - 1.2 - remainingMicrobes * 0.0001).toFixed(2)));

    // Stage 6: pH Adjustment (Alum acidifies, Lime raises pH)
    const alumAcidDrop = (coagulantDose / 30) * 0.6;
    const limePHRise = (limeDose / 15) * 1.8;
    const finalPH = parseFloat((rawPH - alumAcidDrop + limePHRise).toFixed(1));

    const finalTDS = Math.round(rawTDS + coagulantDose * 0.5 + limeDose * 0.8 - (filterMedia.carbon ? 40 : 0));

    // SANS 241 Potability Criteria
    const isTurbiditySafe = finalTurbidity <= 1.0;
    const isMicrobesSafe = remainingMicrobes === 0;
    const isPHSafe = finalPH >= 6.5 && finalPH <= 8.5;
    const isChlorineSafe = freeChlorineResidual >= 0.2 && freeChlorineResidual <= 0.8;
    const isPotable = isTurbiditySafe && isMicrobesSafe && isPHSafe && isChlorineSafe;

    return {
      finalTurbidity,
      remainingMicrobes,
      finalColor,
      freeChlorineResidual,
      finalPH,
      finalTDS,
      isPotable,
      isTurbiditySafe,
      isMicrobesSafe,
      isPHSafe,
      isChlorineSafe
    };
  }, [screenClear, coagulantDose, paddleSpeed, settlingTime, filterMedia, chlorineDose, limeDose]);

  // ==========================================
  // MODULE 3: AQUEOUS ION TESTING BENCH
  // ==========================================
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sample-sea');
  const [activeReagent, setActiveReagent] = useState<string | null>(null);
  const [testTubeHistory, setTestTubeHistory] = useState<{
    reagent: string;
    reactionText: string;
    precipitate: string | null;
    gasEvolved: string | null;
    equation: string;
    positiveIon: string;
  }[]>([]);
  const [soapShaken, setSoapShaken] = useState<boolean>(false);
  const [soapBoiled, setSoapBoiled] = useState<boolean>(false);
  const [sodaAshAdded, setSodaAshAdded] = useState<boolean>(false);

  const activeSample = useMemo(() => {
    return WATER_SAMPLES.find(s => s.id === selectedSampleId) || WATER_SAMPLES[0];
  }, [selectedSampleId]);

  const resetIonBench = () => {
    setActiveReagent(null);
    setTestTubeHistory([]);
    setSoapShaken(false);
    setSoapBoiled(false);
    setSodaAshAdded(false);
    vibrate(20);
  };

  const handleApplyReagent = (reagentType: 'agno3' | 'bano3' | 'hcl' | 'brown-ring' | 'soap') => {
    vibrate(25);
    setActiveReagent(reagentType);

    let reactionText = '';
    let precipitate: string | null = null;
    let gasEvolved: string | null = null;
    let equation = '';
    let positiveIon = '';

    if (reagentType === 'agno3') {
      if (activeSample.ionsPresent.includes('Cl-')) {
        reactionText = 'Dense, curdy white precipitate formed instantly. Precipitate readily dissolves upon adding aqueous NH₃.';
        precipitate = 'AgCl(s) (Curdy White Precipitate)';
        equation = 'Ag^+(aq) + Cl^-(aq) \\rightarrow AgCl(s) \\downarrow';
        positiveIon = 'Chloride (Cl⁻) Confirmed';
      } else {
        reactionText = 'Solution remains clear and colorless. No precipitate observed.';
        equation = 'No reaction with Ag⁺(aq)';
        positiveIon = 'Chloride (Cl⁻) Absent';
      }
    } else if (reagentType === 'bano3') {
      if (activeSample.ionsPresent.includes('SO4-2')) {
        reactionText = 'Thick, dense white precipitate formed. Precipitate is insoluble in dilute HNO₃/HCl acid.';
        precipitate = 'BaSO₄(s) (Dense Heavy White)';
        equation = 'Ba^{2+}(aq) + SO_4^{2-}(aq) \\rightarrow BaSO_4(s) \\downarrow';
        positiveIon = 'Sulphate (SO₄²⁻) Confirmed';
      } else {
        reactionText = 'Solution remains clear. No white precipitate forms with Ba²⁺.';
        equation = 'No reaction with Ba^{2+}(aq)';
        positiveIon = 'Sulphate (SO₄²⁻) Absent';
      }
    } else if (reagentType === 'hcl') {
      if (activeSample.ionsPresent.includes('CO3-2')) {
        reactionText = 'Vigorous effervescence (bubbling). Colorless gas passed through clear limewater turns it milky white.';
        gasEvolved = 'CO₂(g) Effervescence (Turns limewater milky)';
        equation = 'CO_3^{2-}(aq) + 2H^+(aq) \\rightarrow CO_2(g) \\uparrow + H_2O(l)';
        positiveIon = 'Carbonate (CO₃²⁻) Confirmed';
      } else {
        reactionText = 'No bubbling or effervescence observed upon acid addition.';
        equation = 'No reaction with H⁺(aq)';
        positiveIon = 'Carbonate (CO₃²⁻) Absent';
      }
    } else if (reagentType === 'brown-ring') {
      if (activeSample.ionsPresent.includes('NO3-')) {
        reactionText = 'A distinct dark brown ring forms at the junction between the concentrated H₂SO₄ and FeSO₄ liquid layers.';
        precipitate = '[Fe(H₂O)₅(NO)]²⁺ (Dark Brown Ring)';
        equation = 'NO_3^- + 3Fe^{2+} + 4H^+ \\rightarrow 3Fe^{3+} + NO + 2H_2O \\quad \\rightarrow [Fe(H_2O)_5(NO)]^{2+}';
        positiveIon = 'Nitrate (NO₃⁻) Confirmed';
      } else {
        reactionText = 'No brown ring formed at the acid interface.';
        equation = 'No complexation with Fe^{2+}/NO_3^-';
        positiveIon = 'Nitrate (NO₃⁻) Absent';
      }
    } else if (reagentType === 'soap') {
      setSoapShaken(true);
      const isHard = activeSample.hardnessType !== 'None';
      if (!isHard) {
        reactionText = 'Copious, fluffy white soap lather (foam > 4.5 cm). No scum formed.';
        positiveIon = 'Soft Water (No significant Ca²⁺/Mg²⁺)';
      } else if (activeSample.hardnessType === 'Temporary') {
        if (soapBoiled) {
          reactionText = 'After boiling, Ca(HCO₃)₂ decomposed to CaCO₃ precipitate. Shaking now produces rich lather (> 4.0 cm)!';
          positiveIon = 'Temporary Hardness Removed via Boiling';
        } else {
          reactionText = 'Gray curd/scum formed. Poor lather (< 0.8 cm). Boiling can decompose bicarbonate hardness.';
          positiveIon = 'Temporary Hardness Detected (Ca(HCO₃)₂)';
        }
      } else {
        // Permanent
        if (sodaAshAdded) {
          reactionText = 'After adding Washing Soda (Na₂CO₃), Ca²⁺ precipitated as CaCO₃. Rich lather restored (> 3.8 cm)!';
          positiveIon = 'Permanent Hardness Removed via Na₂CO₃';
        } else {
          reactionText = 'Heavy insoluble curd/scum. Lather fails (< 0.5 cm). Boiling does NOT remove permanent hardness.';
          positiveIon = 'Permanent Hardness Detected (CaSO₄/CaCl₂)';
        }
      }
      equation = isHard ? 'Ca^{2+}(aq) + 2St^-(aq) \\rightarrow Ca(St)_2(s) \\downarrow \\text{ (Scum)}' : '\\text{Soap dissolves freely} \\rightarrow \\text{Lather}';
    }

    setTestTubeHistory(prev => [
      { reagent: reagentType, reactionText, precipitate, gasEvolved, equation, positiveIon },
      ...prev
    ]);
  };

  // ==========================================
  // MODULE 4: CONDUCTIVITY & SALINITY STATE
  // ==========================================
  const [selectedSolutionId, setSelectedSolutionId] = useState<string>('tap');
  const [circuitVoltage, setCircuitVoltage] = useState<number>(6); // Volts (0 to 12)
  const [circuitClosed, setCircuitClosed] = useState<boolean>(true);

  const activeSolution = useMemo(() => {
    return CONDUCTIVITY_SOLUTIONS.find(s => s.id === selectedSolutionId) || CONDUCTIVITY_SOLUTIONS[2];
  }, [selectedSolutionId]);

  const conductivityReadout = useMemo(() => {
    if (!circuitClosed || circuitVoltage === 0) {
      return { ec: 0, currentMA: 0, bulbBrightness: 0, tds: 0 };
    }
    const voltFactor = circuitVoltage / 6;
    const ec = activeSolution.ec;
    // Current in mA through 1cm² electrodes
    const currentMA = parseFloat((Math.min(500, (ec / 150) * voltFactor * 1.5)).toFixed(1));
    const bulbBrightness = Math.min(100, Math.round(activeSolution.bulb * (circuitVoltage / 6)));
    return {
      ec,
      currentMA,
      bulbBrightness,
      tds: activeSolution.tds
    };
  }, [selectedSolutionId, circuitVoltage, circuitClosed, activeSolution]);

  // ==========================================
  // MODULE 5: ENVIRONMENTAL CASE STUDIES STATE
  // ==========================================
  // AMD Neutralization Reactor
  const [amdLimeDoseGrams, setAmdLimeDoseGrams] = useState<number>(0); // g/L Ca(OH)2 (0 to 10)

  const amdMetrics = useMemo(() => {
    // Initial AMD: pH 2.2, Iron 350 mg/L, Sulfate 4200 mg/L
    const rawPH = 2.2;
    const rawFe = 350;
    const rawSulfate = 4200;

    // Lime neutralizing power (each 1g lime neutralizes ~0.8 pH units and precipitates ~70mg Fe)
    const neutralizedPH = parseFloat(Math.min(9.5, rawPH + amdLimeDoseGrams * 0.85).toFixed(1));
    const fePrecipitatedPct = Math.min(99.5, amdLimeDoseGrams * 18);
    const residualFe = parseFloat((rawFe * (1 - fePrecipitatedPct / 100)).toFixed(1));
    const yellowBoySludgeGrams = parseFloat((amdLimeDoseGrams * 0.68 + (rawFe - residualFe) * 0.0019).toFixed(2));
    const sulfateTreated = parseFloat((rawSulfate - amdLimeDoseGrams * 140).toFixed(0));

    const status = neutralizedPH >= 6.5 && neutralizedPH <= 8.5 && residualFe < 5
      ? 'Safe for River Discharge (SANS Compliant)'
      : neutralizedPH < 5.5
      ? 'Hazardous Acidic Runoff (Pyrite Contaminated)'
      : 'Over-limed Alkaline Water';

    return {
      neutralizedPH,
      residualFe,
      yellowBoySludgeGrams,
      sulfateTreated,
      status
    };
  }, [amdLimeDoseGrams]);

  // Eutrophication Dam Simulator
  const [nutrientInflow, setNutrientInflow] = useState<number>(75); // % (0 to 100)
  const [wetlandBufferActive, setWetlandBufferActive] = useState<boolean>(false);
  const [aerationActive, setAerationActive] = useState<boolean>(false);

  const eutrophicationMetrics = useMemo(() => {
    const netNutrients = nutrientInflow * (wetlandBufferActive ? 0.35 : 1.0);
    const algalDensity = Math.min(100, Math.round(netNutrients * 1.1));
    // Dissolved oxygen starts at 9.0 mg/L (healthy), drops under decomposition, boosted by aeration
    const doCrash = (algalDensity / 100) * 7.5;
    const aerationBoost = aerationActive ? 3.8 : 0;
    const dissolvedOxygen = parseFloat(Math.max(0.4, Math.min(11.0, 9.0 - doCrash + aerationBoost)).toFixed(1));
    const fishHealth = dissolvedOxygen >= 6.0 ? 'Thriving (Normal Ecosystem)' : dissolvedOxygen >= 3.5 ? 'Stressed (Slowed Growth)' : 'Dead Zone (Mass Hypoxic Mortality)';

    return {
      algalDensity,
      dissolvedOxygen,
      fishHealth
    };
  }, [nutrientInflow, wetlandBufferActive, aerationActive]);

  // ==========================================
  // MODULE 6: CAPS QUIZ STATE
  // ==========================================
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(CAPS_QUIZ_QUESTIONS.length).fill(null));
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const handleSelectQuizOption = (optIdx: number) => {
    if (selectedAnswer !== null) return;
    vibrate(15);
    setSelectedAnswer(optIdx);
    const newAns = [...userAnswers];
    newAns[quizIndex] = optIdx;
    setUserAnswers(newAns);
  };

  const handleNextQuiz = () => {
    if (quizIndex < CAPS_QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelectedAnswer(userAnswers[quizIndex + 1]);
    } else {
      setQuizFinished(true);
    }
  };

  const handlePrevQuiz = () => {
    if (quizIndex > 0) {
      setQuizIndex(quizIndex - 1);
      setSelectedAnswer(userAnswers[quizIndex - 1]);
    }
  };

  const quizScore = useMemo(() => {
    return userAnswers.reduce((acc, ans, idx) => {
      if (ans === CAPS_QUIZ_QUESTIONS[idx].correct) return (acc ?? 0) + 1;
      return acc ?? 0;
    }, 0);
  }, [userAnswers]);

  // ==========================================
  // EXPORT PDF LAB REPORT
  // ==========================================
  const handleExportPDF = () => {
    vibrate(30);
    const doc = new jsPDF();

    // Header banner
    doc.setFillColor(2, 132, 199);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('VyLab Science · CAPS Formal Practical Report', 14, 12);
    doc.setFontSize(11);
    doc.text('The Hydrosphere · Grade 10 Physical Sciences (Chemistry Unit 6)', 14, 22);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-ZA')} | Student Laboratory Record`, 14, 36);

    // Section 1: Water Cycle Parameters
    doc.setFontSize(12);
    doc.setTextColor(2, 132, 199);
    doc.text('1. Hydrological Cycle & Catchment Dynamics', 14, 46);
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`• Solar Flux: ${solarFlux} W/m² | Ambient Temp: ${ambientTemp}°C | Humidity: ${humidity}%`, 16, 53);
    doc.text(`• Evaporation Rate: ${waterCycleMetrics.evapRate} mm/day | Transpiration: ${waterCycleMetrics.transpRate} mm/day`, 16, 59);
    doc.text(`• Precipitation: ${waterCycleMetrics.precipType} (${waterCycleMetrics.precipRate} mm/hr)`, 16, 65);
    doc.text(`• Infiltration: ${waterCycleMetrics.infiltrationRate} mm/hr | Surface Runoff: ${waterCycleMetrics.surfaceRunoffRate} mm/hr`, 16, 71);

    // Section 2: Water Treatment Plant
    doc.setFontSize(12);
    doc.setTextColor(2, 132, 199);
    doc.text('2. Municipal Water Purification Plant SANS 241 Status', 14, 82);
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`• Coagulant (Alum): ${coagulantDose} mg/L | Chlorine Dose: ${chlorineDose} mg/L | Lime Dose: ${limeDose} mg/L`, 16, 89);
    doc.text(`• Final Turbidity: ${waterQuality.finalTurbidity} NTU (Standard < 1.0 NTU: ${waterQuality.isTurbiditySafe ? 'PASS' : 'FAIL'})`, 16, 95);
    doc.text(`• E. coli Microbes: ${waterQuality.remainingMicrobes} CFU/100mL (Standard 0: ${waterQuality.isMicrobesSafe ? 'PASS' : 'FAIL'})`, 16, 101);
    doc.text(`• Final pH: ${waterQuality.finalPH} (Standard 6.5 - 8.5: ${waterQuality.isPHSafe ? 'PASS' : 'FAIL'})`, 16, 107);
    doc.text(`• Overall SANS 241 Potability: ${waterQuality.isPotable ? 'CERTIFIED POTABLE (SAFE)' : 'NON-POTABLE (CONTAMINATED)'}`, 16, 113);

    // Section 3: Ion Testing Log
    doc.setFontSize(12);
    doc.setTextColor(2, 132, 199);
    doc.text('3. Qualitative Aqueous Ion Testing Bench Log', 14, 124);
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`Active Water Sample: ${activeSample.name}`, 16, 131);
    let yPos = 137;
    testTubeHistory.slice(0, 4).forEach((test, idx) => {
      doc.text(`${idx + 1}. [${test.reagent.toUpperCase()}] ${test.positiveIon} - ${test.reactionText.substring(0, 75)}...`, 16, yPos);
      yPos += 6;
    });

    // Section 4: Conductivity & Environmental Case Studies
    doc.setFontSize(12);
    doc.setTextColor(2, 132, 199);
    doc.text('4. Electrical Conductivity & Acid Mine Drainage Remediation', 14, yPos + 6);
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`• Tested Solution: ${activeSolution.name} | Conductivity: ${conductivityReadout.ec} uS/cm | Type: ${activeSolution.type}`, 16, yPos + 13);
    doc.text(`• AMD Lime Neutralization: ${amdLimeDoseGrams} g/L Lime -> Output pH: ${amdMetrics.neutralizedPH} | Status: ${amdMetrics.status}`, 16, yPos + 19);

    // Section 5: Quiz Score
    doc.setFontSize(12);
    doc.setTextColor(2, 132, 199);
    doc.text('5. CAPS Grade 10 Examination Assessment', 14, yPos + 30);
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`Score: ${quizScore} / ${CAPS_QUIZ_QUESTIONS.length} (${Math.round((quizScore / CAPS_QUIZ_QUESTIONS.length) * 100)}%)`, 16, yPos + 37);

    doc.save(`VyLab_Hydrosphere_Report_Grade10_${Date.now()}.pdf`);
  };

  // State object to feed the multilingual AI Co-Pilot
  const liveTelemetry = useMemo(() => {
    return {
      activeTab,
      solarFlux_W_m2: solarFlux,
      ambientTemp_C: ambientTemp,
      humidity_pct: humidity,
      evaporationRate_mm_day: waterCycleMetrics.evapRate,
      precipitation_type: waterCycleMetrics.precipType,
      purification_turbidity_NTU: waterQuality.finalTurbidity,
      purification_microbes_CFU: waterQuality.remainingMicrobes,
      purification_pH: waterQuality.finalPH,
      purification_isPotable: waterQuality.isPotable,
      activeWaterSample: activeSample.name,
      activeSampleIons: activeSample.ionsPresent.join(', '),
      conductivity_uS_cm: conductivityReadout.ec,
      conductivity_type: activeSolution.type,
      amd_neutralized_pH: amdMetrics.neutralizedPH,
      amd_status: amdMetrics.status,
      eutrophication_dissolved_oxygen_mg_L: eutrophicationMetrics.dissolvedOxygen,
      quiz_score: `${quizScore}/${CAPS_QUIZ_QUESTIONS.length}`
    };
  }, [
    activeTab,
    solarFlux,
    ambientTemp,
    humidity,
    waterCycleMetrics,
    waterQuality,
    activeSample,
    conductivityReadout,
    activeSolution,
    amdMetrics,
    eutrophicationMetrics,
    quizScore
  ]);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans text-slate-800">
      
      {/* ── TOP HEADER / NAVIGATION ── */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-md">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base lg:text-lg text-slate-900 leading-tight">The Hydrosphere</h2>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 text-[10px] font-bold">
                Unit 6 · Grade 10
              </Badge>
              <Badge variant="outline" className="text-[10px] font-medium border-slate-300 text-slate-600 hidden sm:inline-flex">
                CAPS Prescribed
              </Badge>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              Water cycle dynamics, 6-stage purification, qualitative ion testing, salinity conductivity, and AMD remediation.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportPDF}
            className="text-xs font-semibold flex items-center gap-1.5 border-slate-200 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
            title="Download PDF Lab Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Report</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              vibrate(15);
              shareContent({
                title: 'The Hydrosphere Virtual Lab | VyLab',
                text: 'Experiment with the water cycle, water purification, ion testing, and AMD on VyLab!'
              });
            }}
            className="p-2 border-slate-200 hover:bg-slate-100 cursor-pointer"
            title="Share Lab"
          >
            <Share2 className="w-4 h-4 text-slate-600" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              vibrate(20);
              toggleFullscreen();
            }}
            className="p-2 border-slate-200 hover:bg-slate-100 cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-blue-600" /> : <Maximize2 className="w-4 h-4 text-slate-600" />}
          </Button>

          {/* AI Copilot Trigger */}
          <AnalyzeExperimentPanel simName="The Hydrosphere (Grade 10)" state={liveTelemetry} />
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div className="bg-white/80 backdrop-blur-xs border-b border-slate-200 px-3 py-1.5 shrink-0 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                vibrate(10);
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-500'}`} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <div className="flex-1 overflow-y-auto p-3 lg:p-6 space-y-4">
        
        {/* ========================================================
            MODULE 1: WATER CYCLE & GLOBAL WATER DISTRIBUTION
            ======================================================== */}
        {activeTab === 'cycle' && (
          <div className="space-y-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left Column: Interactive Landscape Canvas & Controls */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Visual Landscape Card */}
                <Card className="p-4 bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 border-slate-200 overflow-hidden relative shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
                      <h3 className="font-bold text-sm text-slate-800">Catchment Hydrology Simulator</h3>
                    </div>
                    <Badge className="bg-sky-600 text-white text-[10px]">
                      {waterCycleMetrics.precipType}
                    </Badge>
                  </div>

                  {/* Landscape Animated Scene (SVG) */}
                  <div className="w-full h-72 md:h-80 bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-200 rounded-2xl relative overflow-hidden border border-sky-400/40 shadow-inner">
                    
                    {/* The Sun */}
                    <div
                      className="absolute rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_40px_rgba(251,191,36,0.8)] flex items-center justify-center text-amber-900 font-bold text-[9px] transition-all duration-500"
                      style={{
                        top: '12%',
                        left: '12%',
                        width: `${Math.max(45, (solarFlux / 1000) * 75)}px`,
                        height: `${Math.max(45, (solarFlux / 1000) * 75)}px`
                      }}
                    >
                      ☀ {solarFlux}W
                    </div>

                    {/* Evaporation Arrows Rising from Ocean */}
                    <div className="absolute bottom-6 right-6 flex flex-col items-center gap-1 text-cyan-700 font-bold text-[10px]">
                      <motion.div
                        animate={{ y: [0, -18, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="flex items-center gap-1 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-blue-500" />
                        <span>Evaporation: {waterCycleMetrics.evapRate} mm/d</span>
                      </motion.div>
                      <div className="flex gap-1.5">
                        <span className="animate-bounce">💧</span>
                        <span className="animate-bounce delay-100">💧</span>
                        <span className="animate-bounce delay-200">💧</span>
                      </div>
                    </div>

                    {/* Drakensberg Mountain Range (Left to Center) */}
                    <svg className="absolute bottom-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1000 400" preserveAspectRatio="none">
                      {/* Distant Peaks */}
                      <polygon points="0,400 0,160 140,230 280,120 420,240 560,180 700,320 1000,350 1000,400" fill="#64748b" opacity="0.6" />
                      
                      {/* Snowcaps if Temp <= 0 */}
                      {ambientTemp <= 2 && (
                        <polygon points="250,140 280,120 310,145 295,150 280,140" fill="#f8fafc" />
                      )}

                      {/* Foreland Mountains & Green Escarpment */}
                      <polygon points="0,400 0,220 120,270 260,200 380,280 520,240 680,330 820,310 1000,360 1000,400" fill="#15803d" />
                      
                      {/* Orange/Vaal River Path */}
                      <path d="M 270,215 Q 400,280 500,290 T 750,335 T 1000,380" fill="none" stroke="#38bdf8" strokeWidth="12" strokeLinecap="round" />
                      <path d="M 270,215 Q 400,280 500,290 T 750,335 T 1000,380" fill="none" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
                      
                      {/* Ocean Water Body (Right Corner) */}
                      <polygon points="750,400 750,340 1000,340 1000,400" fill="#0369a1" />
                    </svg>

                    {/* Vegetation Transpiration (Center Hills) */}
                    <div className="absolute bottom-20 left-1/3 flex flex-col items-center">
                      <motion.div
                        animate={{ y: [0, -12, 0], opacity: [0.4, 0.9, 0.4] }}
                        transition={{ repeat: Infinity, duration: 2.4 }}
                        className="bg-emerald-950/70 text-emerald-200 text-[9px] px-2 py-0.5 rounded-md font-mono"
                      >
                        Transpiration: {waterCycleMetrics.transpRate} mm/d
                      </motion.div>
                      <div className="flex gap-2 text-lg text-emerald-900 mt-1">
                        🌲 🌳 🌿
                      </div>
                    </div>

                    {/* Clouds & Condensation (Top Right / Center) */}
                    <motion.div
                      animate={{ x: [-10, 15, -10] }}
                      transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                      className="absolute top-8 left-1/3 flex flex-col items-center"
                    >
                      <div
                        className={`px-4 py-2 rounded-3xl font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all ${
                          waterCycleMetrics.condensationIndex > 70
                            ? 'bg-slate-700/90 text-white'
                            : 'bg-white/90 text-slate-800'
                        }`}
                      >
                        <CloudRain className={`w-5 h-5 ${waterCycleMetrics.precipRate > 0 ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
                        <span className="text-xs">
                          Clouds ({waterCycleMetrics.condensationIndex}% Condensation)
                        </span>
                      </div>

                      {/* Rain / Snow Particles */}
                      {waterCycleMetrics.precipRate > 0 && (
                        <div className="flex gap-2 mt-2 text-cyan-600 text-xs animate-rain">
                          {ambientTemp <= 0 ? (
                            <>❄ ❄ ❄ ❄ ❄</>
                          ) : (
                            <>🌧 💧 🌧 💧 🌧</>
                          )}
                        </div>
                      )}
                    </motion.div>

                    {/* Ground Layer & Subsurface Aquifer (Bottom Box) */}
                    <div className="absolute bottom-2 left-4 bg-amber-950/80 text-amber-200 backdrop-blur-xs p-2 rounded-xl border border-amber-800/60 text-[10px] font-mono shadow-md">
                      <div className="font-bold text-amber-300 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" /> Subsurface Aquifer
                      </div>
                      <div>Infiltration: {waterCycleMetrics.infiltrationRate} mm/hr ({soilType} soil)</div>
                      <div>Surface Runoff: {waterCycleMetrics.surfaceRunoffRate} mm/hr</div>
                    </div>
                  </div>

                  {/* Real-time Hydrology Metrics Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Solar Flux</span>
                      <div className="text-sm font-bold text-amber-600 font-mono">{solarFlux} W/m²</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Total Vapor Inflow</span>
                      <div className="text-sm font-bold text-sky-600 font-mono">
                        {(waterCycleMetrics.evapRate + waterCycleMetrics.transpRate).toFixed(2)} mm/day
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Precipitation</span>
                      <div className="text-sm font-bold text-blue-700 font-mono">
                        {waterCycleMetrics.precipRate} mm/hr
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Dam Catchment Flow</span>
                      <div className="text-sm font-bold text-emerald-600 font-mono">
                        {waterCycleMetrics.damStorageM3s} m³/s
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Catchment Parameter Sliders */}
                <Card className="p-4 bg-white border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-blue-600" />
                      Environmental Variables
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSolarFlux(650);
                        setAmbientTemp(24);
                        setHumidity(55);
                        setSoilType('loam');
                        setVegetationCover(60);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Defaults
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Solar Flux */}
                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Solar Insolation (Heat Flux)</span>
                        <span className="font-mono text-amber-600">{solarFlux} W/m²</span>
                      </div>
                      <Slider
                        min={100}
                        max={1000}
                        step={25}
                        value={[solarFlux]}
                        onValueChange={val => setSolarFlux(val[0])}
                        className="accent-amber-500"
                      />
                    </div>

                    {/* Ambient Temp */}
                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Ambient Temperature</span>
                        <span className="font-mono text-rose-600">{ambientTemp} °C</span>
                      </div>
                      <Slider
                        min={-5}
                        max={42}
                        step={1}
                        value={[ambientTemp]}
                        onValueChange={val => setAmbientTemp(val[0])}
                      />
                    </div>

                    {/* Humidity */}
                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Atmospheric Humidity</span>
                        <span className="font-mono text-blue-600">{humidity} %</span>
                      </div>
                      <Slider
                        min={10}
                        max={95}
                        step={5}
                        value={[humidity]}
                        onValueChange={val => setHumidity(val[0])}
                      />
                    </div>

                    {/* Vegetation */}
                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Indigenous Catchment Vegetation</span>
                        <span className="font-mono text-emerald-600">{vegetationCover} %</span>
                      </div>
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={[vegetationCover]}
                        onValueChange={val => setVegetationCover(val[0])}
                      />
                    </div>
                  </div>

                  {/* Soil Type Selection */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-slate-700">Catchment Soil Geology:</span>
                    <div className="flex gap-2">
                      {(['sandy', 'loam', 'clay'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setSoilType(type)}
                          className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                            soilType === type
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {type} Soil ({type === 'sandy' ? 'High Infiltration' : type === 'loam' ? 'Balanced' : 'High Runoff'})
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column: Global Water Budget & South African Scarcity Context */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Global Water Distribution Pie Chart */}
                <Card className="p-4 bg-white border-slate-200 shadow-sm space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-600" />
                    Global Water Distribution
                  </h4>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={GLOBAL_WATER_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={38}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {GLOBAL_WATER_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {GLOBAL_WATER_DATA.map(item => (
                      <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="font-semibold text-slate-700">{item.name}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* South African Water Scarcity Context Card */}
                <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    South Africa Water Scarcity Context
                  </div>
                  <p className="text-xs text-amber-900/80 leading-relaxed">
                    South Africa is classified as a semi-arid, water-stressed country. Only <span className="font-bold text-amber-900">9% of rainfall</span> reaches rivers as runoff due to high evaporation rates.
                  </p>
                  
                  <div className="space-y-2 text-xs">
                    {SA_WATER_STATS.map(stat => (
                      <div key={stat.metric} className="bg-white/80 backdrop-blur-xs p-2 rounded-xl border border-amber-200/60">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{stat.metric}</span>
                          <span className="text-blue-700">{stat.sa}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex justify-between mt-0.5">
                          <span>Global Average: {stat.world}</span>
                          <span className="text-amber-700 font-medium">{stat.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE 2: MUNICIPAL WATER PURIFICATION PLANT
            ======================================================== */}
        {activeTab === 'purification' && (
          <div className="space-y-4 max-w-7xl mx-auto">
            
            {/* Header / Pipeline Overview Card */}
            <Card className="p-4 bg-white border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    Municipal Water Treatment Plant Simulator
                  </h3>
                  <p className="text-xs text-slate-500">
                    Operate a 6-stage physical and chemical treatment process to purify raw contaminated river water to potable SANS 241 standards.
                  </p>
                </div>

                {/* SANS 241 Potability Badge */}
                <div
                  className={`px-4 py-2 rounded-2xl flex items-center gap-2 border font-bold text-xs transition-all shadow-sm ${
                    waterQuality.isPotable
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}
                >
                  {waterQuality.isPotable ? (
                    <>
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div>SANS 241 POTABLE WATER</div>
                        <div className="text-[10px] text-emerald-600 font-normal">Certified Safe for Human Consumption</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                      <div>
                        <div>CONTAMINATED (NON-POTABLE)</div>
                        <div className="text-[10px] text-rose-600 font-normal">Adjust dosage & filters to meet quality standards</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 6-Stage Process Flow Pipeline Graphic */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
                
                {/* Stage 1: Screening */}
                <div className={`p-3 rounded-xl border flex flex-col justify-between ${screenClear ? 'bg-blue-50/50 border-blue-200' : 'bg-rose-50 border-rose-300'}`}>
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                      <span>Stage 1</span>
                      <span className="text-xs">🗑</span>
                    </div>
                    <div className="font-bold text-slate-800 mt-1">Coarse Screening</div>
                    <div className="text-[10px] text-slate-500 mt-1">Removes floating debris, plastics & leaves.</div>
                  </div>
                  <button
                    onClick={() => setScreenClear(!screenClear)}
                    className={`mt-2 py-1 px-2 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                      screenClear ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white animate-pulse'
                    }`}
                  >
                    {screenClear ? 'Screen Clean ✓' : 'Screen Clogged !'}
                  </button>
                </div>

                {/* Stage 2: Coagulation & Flocculation */}
                <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                      <span>Stage 2</span>
                      <span className="text-xs">🧪</span>
                    </div>
                    <div className="font-bold text-slate-800 mt-1">Flocculation</div>
                    <div className="text-[10px] text-slate-500 mt-1">Alum Al₂(SO₄)₃ neutralizes clay colloids into flocs.</div>
                  </div>
                  <div className="mt-2 text-[10px] font-mono font-bold text-blue-700 bg-white p-1 rounded border">
                    Alum: {coagulantDose} mg/L
                  </div>
                </div>

                {/* Stage 3: Sedimentation Clarifier */}
                <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                      <span>Stage 3</span>
                      <span className="text-xs">⏳</span>
                    </div>
                    <div className="font-bold text-slate-800 mt-1">Sedimentation</div>
                    <div className="text-[10px] text-slate-500 mt-1">Heavy flocs sink to sludge bottom basin.</div>
                  </div>
                  <div className="mt-2 text-[10px] font-mono font-bold text-slate-700 bg-white p-1 rounded border">
                    Settling: {settlingTime} min
                  </div>
                </div>

                {/* Stage 4: Multi-Media Filtration */}
                <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                      <span>Stage 4</span>
                      <span className="text-xs">🧱</span>
                    </div>
                    <div className="font-bold text-slate-800 mt-1">Sand & Carbon</div>
                    <div className="text-[10px] text-slate-500 mt-1">Anthracite, quartz sand & gravel column.</div>
                  </div>
                  <div className="mt-2 text-[10px] font-mono font-bold text-emerald-700 bg-white p-1 rounded border">
                    {filterMedia.carbon && filterMedia.sand ? 'Triple Media' : 'Partial Filter'}
                  </div>
                </div>

                {/* Stage 5: Disinfection (Chlorine) */}
                <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                      <span>Stage 5</span>
                      <span className="text-xs">💧</span>
                    </div>
                    <div className="font-bold text-slate-800 mt-1">Chlorination</div>
                    <div className="text-[10px] text-slate-500 mt-1">Kills pathogenic bacteria, viruses & E. coli.</div>
                  </div>
                  <div className="mt-2 text-[10px] font-mono font-bold text-indigo-700 bg-white p-1 rounded border">
                    Cl₂: {chlorineDose} mg/L
                  </div>
                </div>

                {/* Stage 6: pH Stabilization */}
                <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                      <span>Stage 6</span>
                      <span className="text-xs">⚖</span>
                    </div>
                    <div className="font-bold text-slate-800 mt-1">pH & Lime</div>
                    <div className="text-[10px] text-slate-500 mt-1">Slaked lime Ca(OH)₂ brings pH to 6.5–8.5.</div>
                  </div>
                  <div className="mt-2 text-[10px] font-mono font-bold text-teal-700 bg-white p-1 rounded border">
                    Lime: {limeDose} mg/L
                  </div>
                </div>
              </div>
            </Card>

            {/* Treatment Controls & Live Sensor Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Plant Controls (Left Column) */}
              <div className="lg:col-span-7 space-y-4">
                <Card className="p-4 bg-white border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    Chemical Dosing & Unit Operation Sliders
                  </h4>

                  <div className="space-y-4 text-xs">
                    {/* Alum Coagulant Slider */}
                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Aluminium Sulphate Coagulant Dose (Alum)</span>
                        <span className="font-mono text-blue-600 font-bold">{coagulantDose} mg/L</span>
                      </div>
                      <Slider
                        min={0}
                        max={60}
                        step={1}
                        value={[coagulantDose]}
                        onValueChange={val => setCoagulantDose(val[0])}
                      />
                      <span className="text-[10px] text-slate-400">Target: 25 - 35 mg/L to clump microscopic colloidal particles.</span>
                    </div>

                    {/* Settling Time Slider */}
                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Sedimentation Clarifier Retention Time</span>
                        <span className="font-mono text-slate-700 font-bold">{settlingTime} minutes</span>
                      </div>
                      <Slider
                        min={10}
                        max={90}
                        step={5}
                        value={[settlingTime]}
                        onValueChange={val => setSettlingTime(val[0])}
                      />
                    </div>

                    {/* Multi-Media Filter Layers Selection */}
                    <div>
                      <span className="font-semibold text-slate-700 block mb-1.5">Active Filter Bed Layers:</span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setFilterMedia(m => ({ ...m, carbon: !m.carbon }))}
                          className={`p-2 rounded-xl border text-left cursor-pointer transition ${
                            filterMedia.carbon ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold' : 'bg-slate-50 text-slate-400'
                          }`}
                        >
                          <div className="text-xs">Activated Carbon</div>
                          <div className="text-[9px] font-normal">Removes odor & organics</div>
                        </button>
                        <button
                          onClick={() => setFilterMedia(m => ({ ...m, sand: !m.sand }))}
                          className={`p-2 rounded-xl border text-left cursor-pointer transition ${
                            filterMedia.sand ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold' : 'bg-slate-50 text-slate-400'
                          }`}
                        >
                          <div className="text-xs">Quartz Sand</div>
                          <div className="text-[9px] font-normal">Traps fine micro-flocs</div>
                        </button>
                        <button
                          onClick={() => setFilterMedia(m => ({ ...m, gravel: !m.gravel }))}
                          className={`p-2 rounded-xl border text-left cursor-pointer transition ${
                            filterMedia.gravel ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold' : 'bg-slate-50 text-slate-400'
                          }`}
                        >
                          <div className="text-xs">Support Gravel</div>
                          <div className="text-[9px] font-normal">Even underdrain flow</div>
                        </button>
                      </div>
                    </div>

                    {/* Chlorine Dose Slider */}
                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Disinfection: Chlorine (Cl₂ / NaOCl) Dosage</span>
                        <span className="font-mono text-indigo-600 font-bold">{chlorineDose} mg/L</span>
                      </div>
                      <Slider
                        min={0}
                        max={6}
                        step={0.1}
                        value={[chlorineDose]}
                        onValueChange={val => setChlorineDose(val[0])}
                      />
                      <span className="text-[10px] text-slate-400">Target residual: 0.2 – 0.5 mg/L free chlorine.</span>
                    </div>

                    {/* Slaked Lime Dose Slider */}
                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>pH Stabilization: Slaked Lime Ca(OH)₂ Dosage</span>
                        <span className="font-mono text-teal-600 font-bold">{limeDose} mg/L</span>
                      </div>
                      <Slider
                        min={0}
                        max={40}
                        step={1}
                        value={[limeDose]}
                        onValueChange={val => setLimeDose(val[0])}
                      />
                      <span className="text-[10px] text-slate-400">Neutralizes alum acidity to maintain SANS 241 pH 6.5–8.5.</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Real-time Quality Meters (Right Column) */}
              <div className="lg:col-span-5 space-y-4">
                <Card className="p-4 bg-white border-slate-200 shadow-sm space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Treated Water Quality Analyzers
                  </h4>

                  {/* Turbidity Meter */}
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Turbidity (Clarity)</div>
                      <div className="text-base font-bold font-mono text-slate-900">
                        {waterQuality.finalTurbidity} NTU
                      </div>
                    </div>
                    <Badge className={waterQuality.isTurbiditySafe ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'}>
                      {waterQuality.isTurbiditySafe ? '✓ SANS Pass (< 1.0)' : '✕ Turbid / Fail'}
                    </Badge>
                  </div>

                  {/* Microbial Count Meter */}
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">E. coli / Coliform Microbes</div>
                      <div className="text-base font-bold font-mono text-slate-900">
                        {waterQuality.remainingMicrobes} CFU/100mL
                      </div>
                    </div>
                    <Badge className={waterQuality.isMicrobesSafe ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'}>
                      {waterQuality.isMicrobesSafe ? '✓ Sterile / Safe (0 CFU)' : '✕ Pathogenic Risk'}
                    </Badge>
                  </div>

                  {/* pH Meter */}
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Water pH Level</div>
                      <div className="text-base font-bold font-mono text-slate-900">
                        pH {waterQuality.finalPH}
                      </div>
                    </div>
                    <Badge className={waterQuality.isPHSafe ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'}>
                      {waterQuality.isPHSafe ? '✓ Potable (6.5 – 8.5)' : waterQuality.finalPH < 6.5 ? '✕ Corrosive Acid' : '✕ Alkaline'}
                    </Badge>
                  </div>

                  {/* Free Chlorine Residual */}
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Free Residual Chlorine</div>
                      <div className="text-base font-bold font-mono text-slate-900">
                        {waterQuality.freeChlorineResidual} mg/L
                      </div>
                    </div>
                    <Badge className={waterQuality.isChlorineSafe ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}>
                      {waterQuality.isChlorineSafe ? '✓ Safe Residual (0.2-0.5)' : '✕ Sub-optimal'}
                    </Badge>
                  </div>

                  {/* Total Dissolved Solids */}
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Total Dissolved Solids (TDS)</div>
                      <div className="text-base font-bold font-mono text-slate-900">
                        {waterQuality.finalTDS} mg/L
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">SANS Limit &lt; 1200 mg/L</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE 3: QUALITATIVE AQUEOUS ION TESTING BENCH
            ======================================================== */}
        {activeTab === 'ion-tests' && (
          <div className="space-y-4 max-w-7xl mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left Column: Test Tube Rack & Reagent Controls */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Sample Selector & Virtual Bench */}
                <Card className="p-4 bg-white border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-blue-600" />
                        CAPS Qualitative Ion Identification Rack
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Perform prescribed chemical tests for Cl⁻, SO₄²⁻, CO₃²⁻, NO₃⁻, and Water Hardness.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={resetIonBench}
                      className="text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Clean Test Tubes
                    </Button>
                  </div>

                  {/* Sample Selection Dropdown */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Select Water Sample to Analyze:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {WATER_SAMPLES.map(sample => (
                        <button
                          key={sample.id}
                          onClick={() => {
                            setSelectedSampleId(sample.id);
                            resetIonBench();
                          }}
                          className={`p-2 rounded-xl border text-left transition cursor-pointer text-xs ${
                            selectedSampleId === sample.id
                              ? 'bg-blue-600 text-white font-bold shadow-sm'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          <div className="truncate">{sample.name}</div>
                          <div className={`text-[9px] font-normal truncate ${selectedSampleId === sample.id ? 'text-blue-100' : 'text-slate-400'}`}>
                            {sample.origin}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Virtual Test Tube Visualization */}
                  <div className="h-56 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-4 flex items-center justify-around relative overflow-hidden border border-slate-800 shadow-inner">
                    
                    {/* Test Tube 1: Active Sample */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-36 border-2 border-slate-400/60 rounded-b-full bg-slate-800/40 relative overflow-hidden flex flex-col justify-end p-1 shadow-lg backdrop-blur-xs">
                        
                        {/* Liquid in tube */}
                        <div
                          className={`w-full rounded-b-full transition-all duration-700 relative ${
                            testTubeHistory.length > 0 && testTubeHistory[0].precipitate
                              ? 'bg-white/80'
                              : activeSample.id === 'sample-amd'
                              ? 'bg-amber-500/70'
                              : 'bg-cyan-200/50'
                          }`}
                          style={{ height: '70%' }}
                        >
                          {/* Precipitate settling at bottom */}
                          {testTubeHistory.length > 0 && testTubeHistory[0].precipitate && (
                            <div className="absolute bottom-0 w-full h-8 bg-white/95 border-t border-slate-300 animate-pulse rounded-b-full flex items-center justify-center text-[7px] font-bold text-slate-800">
                              Precipitate ↓
                            </div>
                          )}

                          {/* Gas bubbles for carbonate test */}
                          {testTubeHistory.length > 0 && testTubeHistory[0].gasEvolved && (
                            <div className="absolute inset-0 flex justify-around items-end overflow-hidden">
                              <span className="animate-ping text-xs">🫧</span>
                              <span className="animate-ping delay-100 text-xs">🫧</span>
                              <span className="animate-ping delay-200 text-xs">🫧</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-2">Active Tube</span>
                    </div>

                    {/* Reaction Callout Display */}
                    <div className="flex-1 max-w-[55%] text-left bg-slate-900/90 border border-slate-700 p-3 rounded-xl text-xs space-y-1.5 shadow-xl">
                      <div className="text-[10px] text-blue-400 font-mono font-bold uppercase flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Live Chemical Observation:
                      </div>
                      <p className="text-slate-200 font-semibold leading-relaxed">
                        {testTubeHistory.length > 0 ? testTubeHistory[0].reactionText : 'Add a chemical reagent dropper below to test for dissolved anions or water hardness.'}
                      </p>
                      {testTubeHistory.length > 0 && (
                        <div className="pt-1 border-t border-slate-800">
                          <span className="text-[10px] text-emerald-400 font-bold block">{testTubeHistory[0].positiveIon}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reagent Dropper Action Buttons */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-700 block">Add Test Reagent:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      
                      {/* Test 1: AgNO3 (Chloride) */}
                      <Button
                        variant="outline"
                        onClick={() => handleApplyReagent('agno3')}
                        className="flex flex-col items-start p-2.5 h-auto border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-left cursor-pointer"
                      >
                        <div className="font-bold text-blue-700 flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5" /> Dilute HNO₃ + AgNO₃
                        </div>
                        <span className="text-[10px] text-slate-500">Test for Chloride (Cl⁻)</span>
                      </Button>

                      {/* Test 2: Ba(NO3)2 (Sulphate) */}
                      <Button
                        variant="outline"
                        onClick={() => handleApplyReagent('bano3')}
                        className="flex flex-col items-start p-2.5 h-auto border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-left cursor-pointer"
                      >
                        <div className="font-bold text-indigo-700 flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5" /> Dilute HNO₃ + Ba(NO₃)₂
                        </div>
                        <span className="text-[10px] text-slate-500">Test for Sulphate (SO₄²⁻)</span>
                      </Button>

                      {/* Test 3: HCl + Limewater (Carbonate) */}
                      <Button
                        variant="outline"
                        onClick={() => handleApplyReagent('hcl')}
                        className="flex flex-col items-start p-2.5 h-auto border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-left cursor-pointer"
                      >
                        <div className="font-bold text-amber-700 flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5" /> Dilute HCl + Limewater
                        </div>
                        <span className="text-[10px] text-slate-500">Test for Carbonate (CO₃²⁻)</span>
                      </Button>

                      {/* Test 4: Brown Ring Test (Nitrate) */}
                      <Button
                        variant="outline"
                        onClick={() => handleApplyReagent('brown-ring')}
                        className="flex flex-col items-start p-2.5 h-auto border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-left cursor-pointer"
                      >
                        <div className="font-bold text-rose-700 flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5" /> FeSO₄ + Conc. H₂SO₄
                        </div>
                        <span className="text-[10px] text-slate-500">Brown Ring Test (NO₃⁻)</span>
                      </Button>

                      {/* Test 5: Soap Lather Test */}
                      <Button
                        variant="outline"
                        onClick={() => handleApplyReagent('soap')}
                        className="flex flex-col items-start p-2.5 h-auto border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-left cursor-pointer"
                      >
                        <div className="font-bold text-emerald-700 flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5" /> Soap Solution & Shake
                        </div>
                        <span className="text-[10px] text-slate-500">Hardness Test (Ca²⁺/Mg²⁺)</span>
                      </Button>

                      {/* Hardness Treatment Actions */}
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSoapBoiled(true);
                            handleApplyReagent('soap');
                          }}
                          className="flex-1 text-[10px] font-bold cursor-pointer"
                          title="Boil temporary hardness water"
                        >
                          <Flame className="w-3 h-3 mr-1 text-red-500" /> Boil Sample
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSodaAshAdded(true);
                            handleApplyReagent('soap');
                          }}
                          className="flex-1 text-[10px] font-bold cursor-pointer"
                          title="Add Washing Soda Na2CO3"
                        >
                          + Na₂CO₃
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column: Observation Log & Chemical Equations */}
              <div className="lg:col-span-5 space-y-4">
                <Card className="p-4 bg-white border-slate-200 shadow-sm space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Qualitative Reaction Log & Equations
                  </h4>

                  {testTubeHistory.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      No chemical tests performed yet. Click a reagent dropper on the left to begin identification.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                      {testTubeHistory.map((entry, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-blue-700 uppercase tracking-wider text-[10px]">Test #{testTubeHistory.length - idx}: {entry.reagent}</span>
                            <Badge variant="outline" className="text-[9px] bg-white">
                              {entry.positiveIon}
                            </Badge>
                          </div>
                          <p className="text-slate-700 text-[11px]">{entry.reactionText}</p>
                          
                          {/* KaTeX Equation */}
                          <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-[10px] text-slate-900 overflow-x-auto">
                            <RichText content={`$$${entry.equation}$$`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE 4: ELECTRICAL CONDUCTIVITY & SALINITY
            ======================================================== */}
        {activeTab === 'conductivity' && (
          <div className="space-y-4 max-w-7xl mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Circuit Apparatus Visualizer (Left Column) */}
              <div className="lg:col-span-7 space-y-4">
                <Card className="p-4 bg-white border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        Electrolyte Conductivity Testing Rig
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Measure current flow, bulb illumination, and electrical conductivity (μS/cm) across electrolytes.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setCircuitClosed(!circuitClosed)}
                      className={`text-xs font-bold cursor-pointer transition ${
                        circuitClosed ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-slate-700 text-white'
                      }`}
                    >
                      {circuitClosed ? 'Open Switch' : 'Close Switch'}
                    </Button>
                  </div>

                  {/* Circuit Visual Bench */}
                  <div className="h-64 bg-slate-900 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden border border-slate-800 shadow-inner">
                    
                    {/* Top Wire with Power Source & Light Bulb */}
                    <div className="flex justify-between items-center px-8 z-10">
                      {/* DC Power Supply */}
                      <div className="bg-slate-800 border border-slate-700 p-2 rounded-xl text-center shadow-md">
                        <span className="text-[8px] font-bold text-amber-400 uppercase">DC Supply</span>
                        <div className="text-sm font-mono font-bold text-white">{circuitVoltage} V</div>
                      </div>

                      {/* Incandescent Light Bulb */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-14 h-14 rounded-full border-2 border-slate-600 flex items-center justify-center transition-all duration-300 relative"
                          style={{
                            backgroundColor: conductivityReadout.bulbBrightness > 0
                              ? `rgba(251, 191, 36, ${conductivityReadout.bulbBrightness / 100})`
                              : '#1e293b',
                            boxShadow: conductivityReadout.bulbBrightness > 10
                              ? `0 0 ${conductivityReadout.bulbBrightness * 0.4}px rgba(251, 191, 36, 0.9)`
                              : 'none'
                          }}
                        >
                          <span className="text-xl">💡</span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 mt-1">
                          {conductivityReadout.bulbBrightness}% Brightness
                        </span>
                      </div>

                      {/* Digital Ammeter */}
                      <div className="bg-slate-800 border border-slate-700 p-2 rounded-xl text-center shadow-md">
                        <span className="text-[8px] font-bold text-emerald-400 uppercase">Ammeter</span>
                        <div className="text-sm font-mono font-bold text-emerald-400">{conductivityReadout.currentMA} mA</div>
                      </div>
                    </div>

                    {/* Beaker with Immersed Electrodes */}
                    <div className="flex justify-center items-end relative">
                      <div className="w-56 h-32 border-x-2 border-b-2 border-slate-400 rounded-b-3xl bg-slate-800/40 relative overflow-hidden flex flex-col justify-end p-2 backdrop-blur-xs">
                        
                        {/* Two Carbon/Platinum Electrodes */}
                        <div className="absolute top-0 left-12 w-3 h-24 bg-slate-400 rounded-b shadow-md flex items-center justify-center text-[7px] font-bold text-slate-900">
                          +
                        </div>
                        <div className="absolute top-0 right-12 w-3 h-24 bg-slate-400 rounded-b shadow-md flex items-center justify-center text-[7px] font-bold text-slate-900">
                          -
                        </div>

                        {/* Liquid Solution */}
                        <div
                          className="w-full h-20 rounded-b-2xl transition-all duration-500 relative flex items-center justify-center"
                          style={{ backgroundColor: `${activeSolution.color}55` }}
                        >
                          {/* Animated migrating ions if current flows */}
                          {circuitClosed && conductivityReadout.currentMA > 0 && (
                            <div className="flex gap-4 text-xs animate-pulse">
                              <span className="text-yellow-300">Na⁺ ➔</span>
                              <span className="text-cyan-300">⬅ Cl⁻</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Voltage Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Variable DC Power Supply Potential</span>
                      <span className="font-mono text-amber-600 font-bold">{circuitVoltage} V</span>
                    </div>
                    <Slider
                      min={0}
                      max={12}
                      step={1}
                      value={[circuitVoltage]}
                      onValueChange={val => setCircuitVoltage(val[0])}
                    />
                  </div>
                </Card>
              </div>

              {/* Solution Selector & Telemetry (Right Column) */}
              <div className="lg:col-span-5 space-y-4">
                <Card className="p-4 bg-white border-slate-200 shadow-sm space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    Select Solution to Test
                  </h4>

                  <div className="space-y-1.5 text-xs">
                    {CONDUCTIVITY_SOLUTIONS.map(sol => (
                      <button
                        key={sol.id}
                        onClick={() => setSelectedSolutionId(sol.id)}
                        className={`w-full p-2.5 rounded-xl border text-left transition cursor-pointer flex justify-between items-center ${
                          selectedSolutionId === sol.id
                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div>
                          <div>{sol.name}</div>
                          <div className={`text-[10px] font-mono font-normal ${selectedSolutionId === sol.id ? 'text-blue-100' : 'text-slate-400'}`}>
                            {sol.formula} ({sol.type})
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold">{sol.ec} μS/cm</span>
                      </button>
                    ))}
                  </div>

                  {/* Live Meter Readouts */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Electrical Conductivity</span>
                      <div className="text-base font-bold font-mono text-blue-700">{conductivityReadout.ec} μS/cm</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">TDS Salinity</span>
                      <div className="text-base font-bold font-mono text-emerald-700">{conductivityReadout.tds} ppm</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE 5: ENVIRONMENTAL CASE STUDIES (AMD & EUTROPHICATION)
            ======================================================== */}
        {activeTab === 'environment' && (
          <div className="space-y-4 max-w-7xl mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Case Study 1: Acid Mine Drainage (AMD) Remediation */}
              <Card className="p-4 bg-white border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    ⛏
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Case Study 1: Witwatersrand Acid Mine Drainage</h3>
                    <p className="text-[11px] text-slate-500">Pyrite oxidation & lime neutralization reactor in South African mining.</p>
                  </div>
                </div>

                {/* Pyrite Oxidation Reaction Box */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                  <div className="font-bold text-amber-900">Pyrite Oxidation Reaction:</div>
                  <div className="font-mono text-[10px] text-amber-950 overflow-x-auto">
                    <RichText content="$$2\text{FeS}_2(s) + 7\text{O}_2(g) + 2\text{H}_2\text{O}(l) \rightarrow 2\text{Fe}^{2+}(aq) + 4\text{SO}_4^{2-}(aq) + 4\text{H}^+(aq)$$" />
                  </div>
                  <p className="text-[10px] text-amber-800">
                    Pyrite in abandoned gold and coal mine shafts oxidizes in the presence of air and groundwater, generating severe sulphuric acid (pH &lt; 2.5) and leaching heavy metals.
                  </p>
                </div>

                {/* Lime Dosing Control Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Add Hydrated Lime Ca(OH)₂ / Limestone CaCO₃:</span>
                    <span className="font-mono text-blue-700 font-bold">{amdLimeDoseGrams} g/L</span>
                  </div>
                  <Slider
                    min={0}
                    max={10}
                    step={0.5}
                    value={[amdLimeDoseGrams]}
                    onValueChange={val => setAmdLimeDoseGrams(val[0])}
                  />
                  <span className="text-[10px] text-slate-400">Neutralizes acid and precipitates iron as "yellow boy" Fe(OH)₃ sludge.</span>
                </div>

                {/* AMD Remediation Readouts */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl border bg-slate-50">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Treated pH</span>
                    <div className={`text-base font-bold font-mono ${amdMetrics.neutralizedPH >= 6.5 && amdMetrics.neutralizedPH <= 8.5 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      pH {amdMetrics.neutralizedPH}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl border bg-slate-50">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Yellow Boy Fe(OH)₃ Sludge</span>
                    <div className="text-base font-bold font-mono text-amber-700">{amdMetrics.yellowBoySludgeGrams} g/L</div>
                  </div>
                </div>

                <Badge className={`w-full justify-center py-1.5 text-xs ${amdMetrics.status.includes('Safe') ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'}`}>
                  {amdMetrics.status}
                </Badge>
              </Card>

              {/* Case Study 2: Eutrophication in South African Dams */}
              <Card className="p-4 bg-white border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    🌿
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Case Study 2: Eutrophication in Hartbeespoort Dam</h3>
                    <p className="text-[11px] text-slate-500">Nutrient loading, algal blooms & dissolved oxygen depletion.</p>
                  </div>
                </div>

                {/* Nutrient Inflow Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Agricultural & Sewage Nutrient Inflow (NO₃⁻ / PO₄³⁻):</span>
                    <span className="font-mono text-emerald-700 font-bold">{nutrientInflow} %</span>
                  </div>
                  <Slider
                    min={10}
                    max={100}
                    step={5}
                    value={[nutrientInflow]}
                    onValueChange={val => setNutrientInflow(val[0])}
                  />
                </div>

                {/* Remediation Interventions */}
                <div className="flex gap-2">
                  <Button
                    variant={wetlandBufferActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setWetlandBufferActive(!wetlandBufferActive)}
                    className="flex-1 text-xs cursor-pointer"
                  >
                    {wetlandBufferActive ? '✓ Wetland Buffer Active' : '+ Add Wetland Buffer'}
                  </Button>
                  <Button
                    variant={aerationActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAerationActive(!aerationActive)}
                    className="flex-1 text-xs cursor-pointer"
                  >
                    {aerationActive ? '✓ Aeration Pump On' : '+ Start Aeration'}
                  </Button>
                </div>

                {/* Eutrophication Readouts */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl border bg-slate-50">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Algal Bloom Density</span>
                    <div className="text-base font-bold font-mono text-emerald-600">{eutrophicationMetrics.algalDensity} %</div>
                  </div>
                  <div className="p-2.5 rounded-xl border bg-slate-50">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Dissolved Oxygen (DO)</span>
                    <div className={`text-base font-bold font-mono ${eutrophicationMetrics.dissolvedOxygen >= 6.0 ? 'text-blue-600' : 'text-rose-600'}`}>
                      {eutrophicationMetrics.dissolvedOxygen} mg/L
                    </div>
                  </div>
                </div>

                <Badge className={`w-full justify-center py-1.5 text-xs ${eutrophicationMetrics.fishHealth.includes('Thriving') ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'}`}>
                  Aquatic Status: {eutrophicationMetrics.fishHealth}
                </Badge>
              </Card>
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE 6: CAPS EXAM PRACTICE QUIZ (10 QUESTIONS)
            ======================================================== */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-4">
            
            <Card className="p-5 bg-white border-slate-200 shadow-sm space-y-4">
              
              {/* Quiz Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-sm lg:text-base text-slate-900">
                    CAPS Grade 10 Hydrosphere Examination Prep
                  </h3>
                </div>
                <Badge variant="outline" className="text-xs font-mono font-bold">
                  Question {quizIndex + 1} of {CAPS_QUIZ_QUESTIONS.length}
                </Badge>
              </div>

              {/* Question Text */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  {CAPS_QUIZ_QUESTIONS[quizIndex].q}
                </p>

                {/* Multiple Choice Options */}
                <div className="space-y-2">
                  {CAPS_QUIZ_QUESTIONS[quizIndex].options.map((option, optIdx) => {
                    const isSelected = selectedAnswer === optIdx;
                    const isCorrect = optIdx === CAPS_QUIZ_QUESTIONS[quizIndex].correct;
                    const hasAnswered = selectedAnswer !== null;

                    let btnStyle = 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200';
                    if (hasAnswered) {
                      if (isSelected) {
                        btnStyle = isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                          : 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                      } else if (isCorrect) {
                        btnStyle = 'bg-emerald-50/60 border-emerald-300 text-emerald-800 font-bold';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectQuizOption(optIdx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {hasAnswered && isSelected && (
                          isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {selectedAnswer !== null && (
                  <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-blue-900">
                      <Info className="w-3.5 h-3.5" /> Explanation & CAPS Syllabus Note:
                    </span>
                    <p className="leading-relaxed">{CAPS_QUIZ_QUESTIONS[quizIndex].explanation}</p>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={quizIndex === 0}
                  onClick={handlePrevQuiz}
                  className="text-xs cursor-pointer"
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {CAPS_QUIZ_QUESTIONS.map((_, i) => (
                    <span
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full ${
                        userAnswers[i] === null
                          ? 'bg-slate-200'
                          : userAnswers[i] === CAPS_QUIZ_QUESTIONS[i].correct
                          ? 'bg-emerald-500'
                          : 'bg-rose-500'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  size="sm"
                  disabled={selectedAnswer === null}
                  onClick={handleNextQuiz}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  {quizIndex === CAPS_QUIZ_QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Button>
              </div>
            </Card>

            {/* Score Summary Card if finished */}
            {quizFinished && (
              <Card className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center space-y-3 shadow-lg">
                <div className="text-3xl">🏆</div>
                <h4 className="font-bold text-lg">Examination Practice Completed!</h4>
                <p className="text-sm text-blue-100">
                  You scored <span className="font-bold text-white text-base">{quizScore} / {CAPS_QUIZ_QUESTIONS.length}</span> ({Math.round((quizScore / CAPS_QUIZ_QUESTIONS.length) * 100)}%).
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setQuizIndex(0);
                      setSelectedAnswer(null);
                      setUserAnswers(new Array(CAPS_QUIZ_QUESTIONS.length).fill(null));
                      setQuizFinished(false);
                    }}
                    className="text-xs font-bold cursor-pointer"
                  >
                    Retake Quiz
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleExportPDF}
                    className="bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold cursor-pointer"
                  >
                    Download Certificate & Report (PDF)
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

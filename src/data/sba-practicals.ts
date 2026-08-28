import { SbaPractical } from '../types/sba';

export const sbaPracticals: SbaPractical[] = [
  // ─── 1. Gr 12 Internal Resistance & EMF (Physics Term 3) ─────────
  {
    id: 'gr12-internal-resistance',
    title: 'Grade 12 Physics: Internal Resistance (r) & EMF (E) of a Battery',
    shortTitle: 'Internal Resistance & EMF',
    discipline: 'Physics',
    grade: 12,
    term: 3,
    capsTaskNumber: 'FAT 3 / SBA Practical 1',
    capsCode: 'CAPS-PHY-GR12-T3-EXP01',
    marks: 20,
    durationMinutes: 45,
    isFree: true,
    badge: 'Official SBA Task 2026',
    description: 'Determine the internal resistance (r) and electromotive force (EMF) of a cell or battery by varying the external resistance in a closed circuit.',
    aim: 'To determine the internal resistance (r) and EMF (E) of a 9V battery by measuring terminal potential difference (V) at various current values (I).',
    investigativeQuestionPrompt: 'State an investigative question describing the relationship between current in the circuit and the terminal potential difference across the battery.',
    expectedInvestigativeQuestion: 'What is the relationship between the current (I) in the circuit and the terminal potential difference (V) across the battery?',
    expectedHypothesisPattern: 'As the current in the circuit increases, the terminal potential difference (V) decreases linearly due to lost volts across internal resistance.',
    variables: {
      independent: {
        name: 'Current',
        symbol: 'I',
        unit: 'A',
        description: 'Controlled by varying the rheostat resistance.'
      },
      dependent: {
        name: 'Terminal Potential Difference',
        symbol: 'V',
        unit: 'V',
        description: 'Measured across the battery terminals with a voltmeter.'
      },
      controlled: [
        {
          name: 'Temperature of battery and wires',
          symbol: 'T',
          unit: '°C',
          description: 'Circuit is opened between readings to prevent heating.'
        },
        {
          name: 'Battery EMF and internal characteristics',
          symbol: 'E, r',
          unit: 'V, Ω',
          description: 'The same battery source is maintained throughout.'
        },
        {
          name: 'Connecting lead resistance',
          symbol: 'R_leads',
          unit: 'Ω',
          description: 'Thick copper connecting leads of constant length are used.'
        }
      ]
    },
    apparatusDescription: [
      '9.0V DC Power cell / Battery pack',
      'High-precision Digital DC Voltmeter (0 - 20 V)',
      'High-precision Digital DC Ammeter (0 - 5 A)',
      'Variable linear rheostat (0 - 50 Ω)',
      'Switch key (SPST)',
      'Thick copper connecting wires with alligator clips'
    ],
    controls: [
      {
        id: 'rheostat',
        label: 'Rheostat Slider (External Resistance R)',
        type: 'slider',
        min: 2,
        max: 40,
        step: 1,
        defaultValue: 25,
        unit: 'Ω'
      },
      {
        id: 'switch',
        label: 'Circuit Switch',
        type: 'switch',
        defaultValue: true
      }
    ],
    dataColumns: [
      { key: 'readingNum', label: 'Trial', symbol: '#', unit: '', decimalPlaces: 0 },
      { key: 'current', label: 'Current', symbol: 'I', unit: 'A', decimalPlaces: 2 },
      { key: 'voltage', label: 'Terminal Potential Difference', symbol: 'V', unit: 'V', decimalPlaces: 2 },
      { key: 'power', label: 'External Power (P = V x I)', symbol: 'P', unit: 'W', isCalculated: true, decimalPlaces: 2 }
    ],
    recommendedDataPointsCount: 5,
    graphConfig: {
      xAxis: {
        key: 'current',
        label: 'Current',
        symbol: 'I',
        unit: 'A',
        min: 0,
        max: 3.5,
        step: 0.5
      },
      yAxis: {
        key: 'voltage',
        label: 'Terminal Potential Difference',
        symbol: 'V',
        unit: 'V',
        min: 0,
        max: 10,
        step: 1
      },
      expectedSlopeName: 'Internal Resistance (-r)',
      expectedSlopeUnit: 'Ω',
      expectedSlopeSign: 'negative',
      physicalMeaningOfSlope: 'The gradient of the V vs I line is equal to the negative internal resistance of the battery (-r).',
      physicalMeaningOfIntercept: 'The y-intercept (when I = 0 A) represents the open-circuit Electromotive Force (EMF, E) of the battery.',
      expectedInterceptKey: 'EMF (E)'
    },
    precautions: [
      'Open the switch between successive readings to prevent internal heating of the battery, which changes its internal resistance.',
      'Ensure all connecting terminals are screwed tightly to avoid parallax or stray contact resistance.',
      'Avoid setting the rheostat to 0 Ω to prevent short-circuiting the battery.'
    ],
    commonErrors: [
      'Leaving the switch closed for extended periods, causing cell heating and non-linear lost volts.',
      'Forgetting that gradient is negative (-r) and writing a negative internal resistance as the final answer.',
      'Plotting I on the y-axis without inverting the slope formula.'
    ],
    rubric: [
      {
        id: 'r1',
        category: 'Investigative Framework',
        criterion: 'Formulates a clear investigative question stating relation between I and V (2 marks)',
        maxMarks: 2
      },
      {
        id: 'r2',
        category: 'Investigative Framework',
        criterion: 'Correctly identifies independent (I), dependent (V), and 2 controlled variables (3 marks)',
        maxMarks: 3
      },
      {
        id: 'r3',
        category: 'Data Collection & Accuracy',
        criterion: 'Tabulates at least 5 distinct (I, V) data pairs with correct units (3 marks)',
        maxMarks: 3
      },
      {
        id: 'r4',
        category: 'Graphical Analysis',
        criterion: 'Correctly labeled axes with units, suitable scale, and accurate point plotting (4 marks)',
        maxMarks: 4
      },
      {
        id: 'r5',
        category: 'Calculations & Constant Derivation',
        criterion: 'Draws continuous line of best fit, calculates gradient and determines r and EMF correctly (5 marks)',
        maxMarks: 5
      },
      {
        id: 'r6',
        category: 'Error Analysis & Conclusion',
        criterion: 'Identifies realistic sources of error (e.g. heating effect) and states valid conclusion matching hypothesis (3 marks)',
        maxMarks: 3
      }
    ]
  },

  // ─── 2. Gr 12 Acid-Base Titration (Chemistry Term 2) ─────────────
  {
    id: 'gr12-titration',
    title: 'Grade 12 Chemistry: Titration & Standardisation of NaOH with Oxalic Acid',
    shortTitle: 'Acid-Base Titration (Standardisation)',
    discipline: 'Chemistry',
    grade: 12,
    term: 2,
    capsTaskNumber: 'FAT 2 / Chemistry SBA Practical',
    capsCode: 'CAPS-CHEM-GR12-T2-EXP01',
    marks: 25,
    durationMinutes: 50,
    isFree: false,
    badge: 'High-Stakes Practical',
    description: 'Prepare a standard oxalic acid solution (H2C2O4) and accurately titrate it against unknown sodium hydroxide (NaOH) using phenolphthalein indicator.',
    aim: 'To determine the exact concentration of a sodium hydroxide (NaOH) solution by titration against a primary standard solution of oxalic acid dihydrate ((COOH)2.2H2O).',
    investigativeQuestionPrompt: 'Formulate an investigative question regarding the volume of sodium hydroxide required to neutralise a known volume and concentration of oxalic acid.',
    expectedInvestigativeQuestion: 'What volume of sodium hydroxide (NaOH) of unknown concentration is required to completely neutralise 25.0 cm³ of 0.05 mol/dm³ oxalic acid standard solution?',
    expectedHypothesisPattern: 'A fixed volume of standard oxalic acid will require a stoichiometric volume of NaOH proportional to their mole ratio (1:2) at the equivalence point.',
    variables: {
      independent: {
        name: 'Volume of NaOH added from burette',
        symbol: 'V_b',
        unit: 'cm³',
        description: 'Controlled drop-by-drop via the burette tap.'
      },
      dependent: {
        name: 'Colour change / pH endpoint',
        symbol: 'pH / colour',
        unit: '',
        description: 'Observed through sharp pink color transition of phenolphthalein indicator.'
      },
      controlled: [
        {
          name: 'Volume of oxalic acid in conical flask',
          symbol: 'V_a',
          unit: 'cm³',
          description: 'Measured precisely at 25.0 cm³ using a volumetric pipette.'
        },
        {
          name: 'Concentration of primary standard oxalic acid',
          symbol: 'c_a',
          unit: 'mol/dm³',
          description: 'Prepared accurately as 0.050 mol/dm³ standard.'
        },
        {
          name: 'Indicator volume added',
          symbol: 'V_ind',
          unit: 'drops',
          description: 'Exactly 2-3 drops of phenolphthalein per trial.'
        }
      ]
    },
    apparatusDescription: [
      '50.00 cm³ class-A volumetric burette on retort stand with clamp',
      '25.00 cm³ volumetric pipette with pipette filler bulb',
      '250.0 cm³ conical titration flasks (Erlenmeyer)',
      'White ceramic tile for endpoint contrast',
      '0.050 mol/dm³ primary standard oxalic acid dihydrate solution',
      'Sodium hydroxide solution (~0.1 mol/dm³) of unknown concentration',
      'Phenolphthalein indicator dropper bottle',
      'Distilled wash bottle'
    ],
    controls: [
      {
        id: 'stopcock',
        label: 'Burette Stopcock Flow Rate',
        type: 'slider',
        min: 0,
        max: 2.0,
        step: 0.1,
        defaultValue: 0,
        unit: 'cm³/s'
      },
      {
        id: 'indicator',
        label: 'Indicator Selection',
        type: 'select',
        defaultValue: 'phenolphthalein',
        options: [
          { label: 'Phenolphthalein (Colourless to Pale Pink, pH 8.2-10)', value: 'phenolphthalein' },
          { label: 'Methyl Orange (Red to Yellow, pH 3.1-4.4)', value: 'methyl-orange' },
          { label: 'Bromothymol Blue (Yellow to Blue, pH 6.0-7.6)', value: 'bromothymol-blue' }
        ]
      }
    ],
    dataColumns: [
      { key: 'trialNum', label: 'Titration Trial', symbol: '#', unit: '', decimalPlaces: 0 },
      { key: 'initialBurette', label: 'Initial Burette Reading', symbol: 'V_initial', unit: 'cm³', decimalPlaces: 2 },
      { key: 'finalBurette', label: 'Final Burette Reading', symbol: 'V_final', unit: 'cm³', decimalPlaces: 2 },
      { key: 'titreVolume', label: 'Titre Volume (NaOH Added)', symbol: 'V_b', unit: 'cm³', isCalculated: true, decimalPlaces: 2 }
    ],
    recommendedDataPointsCount: 4,
    graphConfig: {
      xAxis: {
        key: 'volumeAdded',
        label: 'Volume of NaOH Added',
        symbol: 'V_b',
        unit: 'cm³',
        min: 0,
        max: 40,
        step: 5
      },
      yAxis: {
        key: 'pH',
        label: 'Solution pH in Flask',
        symbol: 'pH',
        unit: '',
        min: 0,
        max: 14,
        step: 2
      },
      expectedSlopeName: 'Equivalence Inflection (pH change)',
      expectedSlopeUnit: 'pH/cm³',
      expectedSlopeSign: 'positive',
      physicalMeaningOfSlope: 'The vertical steep inflection point represents the stoichiometric equivalence point where moles of acid are completely neutralised by base.',
      physicalMeaningOfIntercept: 'Initial pH of 0.05 mol/dm³ oxalic acid prior to base addition (~1.3).'
    },
    precautions: [
      'Rinse the burette with a small portion of the NaOH solution before filling to prevent dilution by residual water.',
      'Ensure no air bubbles are trapped in the burette jet tip prior to taking the initial reading.',
      'Place a white tile underneath the conical flask to accurately detect the first permanent faint pink colour lasting >30 seconds.'
    ],
    commonErrors: [
      'Overshooting the endpoint resulting in a dark magenta colour rather than persistent faint pink.',
      'Misreading the meniscus by looking at the top curve rather than bottom of the concave meniscus at eye level.',
      'Forgetting the 1:2 mole ratio (H2C2O4 + 2NaOH -> Na2C2O4 + 2H2O) in concentration calculations.'
    ],
    rubric: [
      {
        id: 't1',
        category: 'Investigative Framework',
        criterion: 'States clear investigative question and balanced chemical equation with correct state symbols (3 marks)',
        maxMarks: 3
      },
      {
        id: 't2',
        category: 'Investigative Framework',
        criterion: 'Identifies standard solution parameters, pipette volume and controlled variables (3 marks)',
        maxMarks: 3
      },
      {
        id: 't3',
        category: 'Data Collection & Accuracy',
        criterion: 'Records rough trial plus at least 3 concordant titres within 0.10 cm³ precision (5 marks)',
        maxMarks: 5
      },
      {
        id: 't4',
        category: 'Calculations & Constant Derivation',
        criterion: 'Calculates mean concordant titre and derives NaOH molarity using n=m/M and c=n/V (7 marks)',
        maxMarks: 7
      },
      {
        id: 't5',
        category: 'Error Analysis & Conclusion',
        criterion: 'Explains indicator choice, identifies experimental error sources (meniscus, overshoot) and reports final standardized concentration with correct units (4 marks)',
        maxMarks: 4
      },
      {
        id: 't6',
        category: 'Calculations & Constant Derivation',
        criterion: 'Calculates percentage error against true standard value (3 marks)',
        maxMarks: 3
      }
    ]
  },

  // ─── 3. Gr 12 Reaction Rates & Collision Theory (Chemistry Term 1) ──
  {
    id: 'gr12-reaction-rates',
    title: 'Grade 12 Chemistry: Rate of Reaction & Effect of Temperature/Concentration',
    shortTitle: 'Reaction Rates & Collision Theory',
    discipline: 'Chemistry',
    grade: 12,
    term: 1,
    capsTaskNumber: 'FAT 1 / Chemistry SBA Practical',
    capsCode: 'CAPS-CHEM-GR12-T1-EXP01',
    marks: 20,
    durationMinutes: 45,
    isFree: false,
    badge: 'Mandatory CAPS FAT',
    description: 'Investigate the rate of reaction between sodium thiosulphate (Na2S2O3) and hydrochloric acid (HCl) by measuring disappearing cross time at varying temperatures.',
    aim: 'To investigate the effect of temperature on the rate of reaction between sodium thiosulphate and hydrochloric acid by determining the inverse time (1/t) for sulfur precipitate opacity.',
    investigativeQuestionPrompt: 'State the relationship between temperature of the reactants and the reaction rate (1/time) for sulfur formation.',
    expectedInvestigativeQuestion: 'How does an increase in temperature affect the reaction rate (1/t) of the reaction between sodium thiosulphate and hydrochloric acid?',
    expectedHypothesisPattern: 'As temperature increases, reaction rate (1/t) increases exponentially because a greater fraction of particles possess kinetic energy >= activation energy (E_a).',
    variables: {
      independent: {
        name: 'Temperature of reactants',
        symbol: 'T',
        unit: '°C',
        description: 'Adjusted using a controlled water bath from 20°C to 60°C.'
      },
      dependent: {
        name: 'Reaction time / Rate (1/t)',
        symbol: 't / (1/t)',
        unit: 's / s⁻¹',
        description: 'Time taken for colloidal sulfur precipitate to obscure the black cross underneath the flask.'
      },
      controlled: [
        {
          name: 'Concentration & volume of Na2S2O3',
          symbol: 'c, V',
          unit: 'mol/dm³, cm³',
          description: 'Fixed at 0.15 mol/dm³, 50.0 cm³.'
        },
        {
          name: 'Concentration & volume of HCl',
          symbol: 'c_acid, V_acid',
          unit: 'mol/dm³, cm³',
          description: 'Fixed at 2.0 mol/dm³, 5.0 cm³.'
        },
        {
          name: 'Cross marking intensity & viewing depth',
          symbol: 'depth',
          unit: 'mm',
          description: 'Same conical flask and black marker cross on white card used.'
        }
      ]
    },
    apparatusDescription: [
      '100 cm³ Erlenmeyer conical flask',
      'White tile with bold black X cross marker',
      'Digital precision stopwatch (0.01s accuracy)',
      'Digital temperature-controlled water bath',
      'Laboratory thermometer (0 - 100 °C)',
      '0.15 mol/dm³ Sodium Thiosulphate solution (Na2S2O3)',
      '2.0 mol/dm³ Hydrochloric Acid (HCl)',
      'Graduated measuring cylinders (50 cm³ and 10 cm³)'
    ],
    controls: [
      {
        id: 'temperature',
        label: 'Water Bath Temperature (T)',
        type: 'slider',
        min: 20,
        max: 60,
        step: 5,
        defaultValue: 25,
        unit: '°C'
      }
    ],
    dataColumns: [
      { key: 'trialNum', label: 'Trial', symbol: '#', unit: '', decimalPlaces: 0 },
      { key: 'tempCelsius', label: 'Temperature', symbol: 'T', unit: '°C', decimalPlaces: 1 },
      { key: 'tempKelvin', label: 'Absolute Temp', symbol: 'T_K', unit: 'K', isCalculated: true, decimalPlaces: 1 },
      { key: 'timeSeconds', label: 'Time for Cross to Disappear', symbol: 't', unit: 's', decimalPlaces: 1 },
      { key: 'rateInverseTime', label: 'Reaction Rate (1/t)', symbol: '1/t', unit: 's⁻¹', isCalculated: true, decimalPlaces: 4 }
    ],
    recommendedDataPointsCount: 5,
    graphConfig: {
      xAxis: {
        key: 'tempCelsius',
        label: 'Temperature',
        symbol: 'T',
        unit: '°C',
        min: 15,
        max: 65,
        step: 10
      },
      yAxis: {
        key: 'rateInverseTime',
        label: 'Reaction Rate (1/time)',
        symbol: '1/t',
        unit: 's⁻¹',
        min: 0,
        max: 0.12,
        step: 0.02
      },
      expectedSlopeName: 'Rate Sensitivity Curve',
      expectedSlopeUnit: 's⁻¹/°C',
      expectedSlopeSign: 'positive',
      physicalMeaningOfSlope: 'The upward curve indicates that reaction rate increases non-linearly with temperature due to Maxwell-Boltzmann distribution shift.',
      physicalMeaningOfIntercept: 'Reaction rate approaches zero at very low temperatures.'
    },
    precautions: [
      'Look directly vertically downwards from above the flask neck to minimize parallax when judging the extinction of the cross.',
      'Ensure the reaction is carried out in a well-ventilated area because toxic sulfur dioxide (SO2) gas is released as a byproduct.',
      'Immediately rinse the conical flask with water after each trial to prevent sulfur adhering to the glass walls.'
    ],
    commonErrors: [
      'Starting the stopwatch before adding the full aliquot of HCl and giving an initial swirl.',
      'Assuming 1/t is directly linear with Celsius temperature instead of an exponential curve related to Arrhenius equation.',
      'Not allowing the flask contents to reach thermal equilibrium with the water bath before mixing.'
    ],
    rubric: [
      {
        id: 'rr1',
        category: 'Investigative Framework',
        criterion: 'States valid investigative question and hypothesis linking temperature to kinetic energy and collision frequency (3 marks)',
        maxMarks: 3
      },
      {
        id: 'rr2',
        category: 'Investigative Framework',
        criterion: 'Correctly identifies independent, dependent and controlled variables (3 marks)',
        maxMarks: 3
      },
      {
        id: 'rr3',
        category: 'Data Collection & Accuracy',
        criterion: 'Tabulates 5 temperature trials with measured time and calculates 1/t accurately (4 marks)',
        maxMarks: 4
      },
      {
        id: 'rr4',
        category: 'Graphical Analysis',
        criterion: 'Plots smooth curve of Rate (1/t) vs Temperature with labeled axes and correct units (4 marks)',
        maxMarks: 4
      },
      {
        id: 'rr5',
        category: 'Error Analysis & Conclusion',
        criterion: 'Explains Maxwell-Boltzmann collision theory and formulates scientific conclusion (4 marks)',
        maxMarks: 4
      },
      {
        id: 'rr6',
        category: 'Error Analysis & Conclusion',
        criterion: 'Lists SO2 safety precautions and human judgment error regarding cross disappearance (2 marks)',
        maxMarks: 2
      }
    ]
  },

  // ─── 4. Gr 11 Snell's Law & Refractive Index (Physics Term 2) ─────
  {
    id: 'gr11-snells-law',
    title: "Grade 11 Physics: Snell's Law & Refractive Index of Optical Glass",
    shortTitle: "Snell's Law (Refraction of Light)",
    discipline: 'Physics',
    grade: 11,
    term: 2,
    capsTaskNumber: 'FAT 2 / Physics SBA Practical',
    capsCode: 'CAPS-PHY-GR11-T2-EXP01',
    marks: 20,
    durationMinutes: 45,
    isFree: false,
    badge: 'Core Gr 11 Practical',
    description: 'Verify Snell’s Law of Refraction for light passing from air into rectangular optical glass and determine the refractive index (n) of glass.',
    aim: 'To verify Snell’s Law of refraction (n1 sin θ1 = n2 sin θ2) and calculate the optical refractive index (n) of rectangular crown glass.',
    investigativeQuestionPrompt: 'State the mathematical relationship between the sine of angle of incidence (sin i) and sine of angle of refraction (sin r).',
    expectedInvestigativeQuestion: 'What is the relationship between the sine of the angle of incidence (sin i) in air and the sine of the angle of refraction (sin r) in glass?',
    expectedHypothesisPattern: 'The sine of the angle of incidence is directly proportional to the sine of the angle of refraction (sin i / sin r = constant = n_glass).',
    variables: {
      independent: {
        name: 'Angle of Incidence in Air',
        symbol: 'θ_i (i)',
        unit: '°',
        description: 'Varying incident laser ray from 10° to 70° relative to normal.'
      },
      dependent: {
        name: 'Angle of Refraction in Glass',
        symbol: 'θ_r (r)',
        unit: '°',
        description: 'Measured angle between refracted beam in glass and normal line.'
      },
      controlled: [
        {
          name: 'Optical medium (Crown glass block)',
          symbol: 'n_glass',
          unit: '',
          description: 'Same rectangular block with polished flat faces used.'
        },
        {
          name: 'Wavelength of monochromatic light source',
          symbol: 'λ',
          unit: 'nm',
          description: 'Red laser ray box (650 nm) kept constant.'
        },
        {
          name: 'Initial medium',
          symbol: 'n_air',
          unit: '',
          description: 'Air medium at STP with refractive index 1.000.'
        }
      ]
    },
    apparatusDescription: [
      'Rectangular optical crown glass block (100 mm x 60 mm x 20 mm)',
      'Monochromatic single-slit red laser beam projector (650 nm)',
      '360° circular protractor printed on A3 optical plotting sheet',
      'Fine 0.5mm drafting pencil and straightedge ruler',
      'Soft cork mounting board with optical alignment pins'
    ],
    controls: [
      {
        id: 'angleIncidence',
        label: 'Incident Ray Angle (θ_i)',
        type: 'slider',
        min: 10,
        max: 75,
        step: 5,
        defaultValue: 30,
        unit: '°'
      }
    ],
    dataColumns: [
      { key: 'trialNum', label: 'Trial', symbol: '#', unit: '', decimalPlaces: 0 },
      { key: 'angleI', label: 'Angle of Incidence (i)', symbol: 'θ_i', unit: '°', decimalPlaces: 1 },
      { key: 'angleR', label: 'Angle of Refraction (r)', symbol: 'θ_r', unit: '°', decimalPlaces: 1 },
      { key: 'sinI', label: 'Sine of Angle of Incidence', symbol: 'sin(θ_i)', unit: '', isCalculated: true, decimalPlaces: 3 },
      { key: 'sinR', label: 'Sine of Angle of Refraction', symbol: 'sin(θ_r)', unit: '', isCalculated: true, decimalPlaces: 3 }
    ],
    recommendedDataPointsCount: 5,
    graphConfig: {
      xAxis: {
        key: 'sinR',
        label: 'Sine of Angle of Refraction',
        symbol: 'sin(θ_r)',
        unit: '',
        min: 0,
        max: 0.7,
        step: 0.1
      },
      yAxis: {
        key: 'sinI',
        label: 'Sine of Angle of Incidence',
        symbol: 'sin(θ_i)',
        unit: '',
        min: 0,
        max: 1.0,
        step: 0.1
      },
      expectedSlopeName: 'Refractive Index of Glass (n)',
      expectedSlopeUnit: '',
      expectedSlopeSign: 'positive',
      physicalMeaningOfSlope: 'The gradient of sin(θ_i) vs sin(θ_r) represents the absolute refractive index (n ≈ 1.50) of the glass block.',
      physicalMeaningOfIntercept: 'Line passes through the origin (0, 0) because when θ_i = 0°, light passes straight through with θ_r = 0°.'
    },
    precautions: [
      'Ensure the incident ray strikes exactly at the midpoint normal line where glass meets air.',
      'Keep laser light at eye level and avoid looking directly into the laser aperture.',
      'Use thin, sharp pencil markings when tracing the optical pins to reduce protractor reading uncertainty.'
    ],
    commonErrors: [
      'Measuring angles against the glass surface rather than perpendicular to the normal line.',
      'Plotting angles (i vs r) directly instead of their sines (sin i vs sin r), which fails to produce a straight line.',
      'Rounding sin values to 1 decimal place, leading to severe gradient distortion.'
    ],
    rubric: [
      {
        id: 'sn1',
        category: 'Investigative Framework',
        criterion: "States Snell's Law equation and identifies independent, dependent and controlled variables (3 marks)",
        maxMarks: 3
      },
      {
        id: 'sn2',
        category: 'Data Collection & Accuracy',
        criterion: 'Records 5 angle pairs and calculates sin(i) and sin(r) correctly to 3 decimal places (4 marks)',
        maxMarks: 4
      },
      {
        id: 'sn3',
        category: 'Graphical Analysis',
        criterion: 'Plots sin(i) vs sin(r) straight-line graph passing through origin with suitable scale (4 marks)',
        maxMarks: 4
      },
      {
        id: 'sn4',
        category: 'Calculations & Constant Derivation',
        criterion: 'Calculates gradient using two far points on best-fit line and states refractive index n (5 marks)',
        maxMarks: 5
      },
      {
        id: 'sn5',
        category: 'Error Analysis & Conclusion',
        criterion: 'States percentage error against theoretical glass index (n=1.52) and formulates conclusion (4 marks)',
        maxMarks: 4
      }
    ]
  },

  // ─── 5. Gr 11 Boyle's Law (Chemistry / Physics Term 2) ───────────
  {
    id: 'gr11-boyles-law',
    title: "Grade 11 Physics & Chemistry: Boyle's Law (Pressure vs Volume)",
    shortTitle: "Boyle's Law (Ideal Gases)",
    discipline: 'Physics',
    grade: 11,
    term: 2,
    capsTaskNumber: 'FAT 2 / Physical Sciences Practical',
    capsCode: 'CAPS-PHY-GR11-T2-EXP02',
    marks: 20,
    durationMinutes: 40,
    isFree: false,
    badge: 'Core Ideal Gas Task',
    description: 'Verify the inverse relationship between the pressure and volume of a fixed mass of enclosed gas at constant temperature.',
    aim: 'To verify Boyle’s Law by measuring the pressure (P) of an enclosed column of air at various compressed and expanded volumes (V) at constant temperature.',
    investigativeQuestionPrompt: 'State the relationship between the pressure exerted on an enclosed gas and its volume when temperature is kept constant.',
    expectedInvestigativeQuestion: 'What is the relationship between the pressure (P) and volume (V) of a fixed mass of gas at constant temperature?',
    expectedHypothesisPattern: 'The pressure of a fixed mass of gas is inversely proportional to its volume at constant temperature (P ∝ 1/V or P x V = constant).',
    variables: {
      independent: {
        name: 'Volume of Enclosed Gas Column',
        symbol: 'V',
        unit: 'cm³',
        description: 'Adjusted by compressing or expanding the oil/air syringe cylinder.'
      },
      dependent: {
        name: 'Pressure of Enclosed Gas',
        symbol: 'P',
        unit: 'kPa',
        description: 'Measured on the Bourdon pressure gauge.'
      },
      controlled: [
        {
          name: 'Temperature of gas',
          symbol: 'T',
          unit: 'K',
          description: 'Wait 30 seconds after compression to allow gas to return to ambient room temp.'
        },
        {
          name: 'Mass/Amount of enclosed gas',
          symbol: 'n',
          unit: 'mol',
          description: 'Hermetically sealed glass tube with zero leaks.'
        }
      ]
    },
    apparatusDescription: [
      "Boyle's Law apparatus with graduated glass tube and colored hydraulic oil",
      'Bourdon pressure gauge (-100 to +300 kPa)',
      'Hand compression pump with safety screw release valve',
      'Ambient digital room thermometer (0 - 50 °C)'
    ],
    controls: [
      {
        id: 'pumpPressure',
        label: 'Hand Pump Compression Pressure',
        type: 'slider',
        min: 100,
        max: 250,
        step: 10,
        defaultValue: 100,
        unit: 'kPa'
      }
    ],
    dataColumns: [
      { key: 'trialNum', label: 'Trial', symbol: '#', unit: '', decimalPlaces: 0 },
      { key: 'pressure', label: 'Gas Pressure', symbol: 'P', unit: 'kPa', decimalPlaces: 1 },
      { key: 'volume', label: 'Gas Volume', symbol: 'V', unit: 'cm³', decimalPlaces: 1 },
      { key: 'invVolume', label: 'Inverse Volume (1/V)', symbol: '1/V', unit: 'cm⁻³', isCalculated: true, decimalPlaces: 4 },
      { key: 'pvProduct', label: 'P x V Product', symbol: 'P·V', unit: 'kPa·cm³', isCalculated: true, decimalPlaces: 1 }
    ],
    recommendedDataPointsCount: 5,
    graphConfig: {
      xAxis: {
        key: 'invVolume',
        label: 'Inverse Volume (1/V)',
        symbol: '1/V',
        unit: 'cm⁻³',
        min: 0,
        max: 0.05,
        step: 0.01
      },
      yAxis: {
        key: 'pressure',
        label: 'Pressure (P)',
        symbol: 'P',
        unit: 'kPa',
        min: 0,
        max: 300,
        step: 50
      },
      expectedSlopeName: 'Constant k = nRT',
      expectedSlopeUnit: 'kPa·cm³ (J)',
      expectedSlopeSign: 'positive',
      physicalMeaningOfSlope: 'The gradient of the P vs 1/V straight line represents the constant product k = nRT from the ideal gas law.',
      physicalMeaningOfIntercept: 'Line passes through the origin (0, 0), confirming direct proportionality between P and 1/V.'
    },
    precautions: [
      'Pump the syringe slowly to prevent adiabatic heating of the gas, which alters temperature.',
      'Allow the apparatus to settle for 30 seconds after changing volume before recording pressure.',
      'Ensure the safety valve is closed and tube seal is tight to prevent air molecules escaping.'
    ],
    commonErrors: [
      'Plotting P vs V directly and trying to draw a straight line instead of recognizing the hyperbola curve.',
      'Forgetting to convert gauge pressure to absolute pressure if gauge reads relative to atmospheric (101.3 kPa).',
      'Taking readings immediately after rapid pumping before heat dissipation.'
    ],
    rubric: [
      {
        id: 'bl1',
        category: 'Investigative Framework',
        criterion: "States Boyle's Law definition and identifies independent, dependent and controlled variables (3 marks)",
        maxMarks: 3
      },
      {
        id: 'bl2',
        category: 'Data Collection & Accuracy',
        criterion: 'Tabulates 5 (P, V) readings, calculates 1/V and checks P*V product constancy (5 marks)',
        maxMarks: 5
      },
      {
        id: 'bl3',
        category: 'Graphical Analysis',
        criterion: 'Plots P vs 1/V straight-line graph through origin with labeled axes (4 marks)',
        maxMarks: 4
      },
      {
        id: 'bl4',
        category: 'Calculations & Constant Derivation',
        criterion: 'Calculates gradient k from best-fit line and calculates gas moles n using ideal gas law (4 marks)',
        maxMarks: 4
      },
      {
        id: 'bl5',
        category: 'Error Analysis & Conclusion',
        criterion: 'Discusses adiabatic heating and air leakage as error sources, draws valid scientific conclusion (4 marks)',
        maxMarks: 4
      }
    ]
  },

  // ─── 6. Gr 11 Newton's Second Law of Motion (Physics Term 1) ─────
  {
    id: 'gr11-newton2',
    title: "Grade 11 Physics: Newton's Second Law of Motion (Fnet = m·a)",
    shortTitle: "Newton's 2nd Law (Ticker-Timer & Trolley)",
    discipline: 'Physics',
    grade: 11,
    term: 1,
    capsTaskNumber: 'FAT 1 / Physics SBA Practical',
    capsCode: 'CAPS-PHY-GR11-T1-EXP01',
    marks: 20,
    durationMinutes: 45,
    isFree: false,
    badge: 'Foundation Mechanics Task',
    description: 'Investigate the relationship between net force (Fnet) applied to a dynamic trolley and its resulting acceleration (a) at constant total system mass.',
    aim: 'To verify Newton’s Second Law of Motion by investigating the relationship between net accelerating force (Fnet) and acceleration (a) of a trolley of constant mass.',
    investigativeQuestionPrompt: 'State the relationship between the accelerating net force acting on a trolley and its acceleration when total mass is kept constant.',
    expectedInvestigativeQuestion: 'What is the relationship between the net force (Fnet) applied to a trolley system and its acceleration (a) when total mass is constant?',
    expectedHypothesisPattern: 'Acceleration is directly proportional to the net force applied to the system when total mass is held constant (a ∝ Fnet).',
    variables: {
      independent: {
        name: 'Net Accelerating Force',
        symbol: 'F_net',
        unit: 'N',
        description: 'Varying hanging slotted masses (0.1N to 0.5N) transferred from trolley to hanger.'
      },
      dependent: {
        name: 'Acceleration of Trolley System',
        symbol: 'a',
        unit: 'm/s²',
        description: 'Calculated from ticker-timer tape dot intervals (50 Hz).'
      },
      controlled: [
        {
          name: 'Total mass of entire system (trolley + hanging weights)',
          symbol: 'm_total',
          unit: 'kg',
          description: 'Masses are transferred from trolley to hanger so m_total remains 1.00 kg.'
        },
        {
          name: 'Frictional resistance on runway',
          symbol: 'f_k',
          unit: 'N',
          description: 'Runway is friction-compensated by tilting slightly until trolley moves at constant velocity.'
        },
        {
          name: 'Ticker-timer frequency',
          symbol: 'f',
          unit: 'Hz',
          description: 'Standard 50 Hz AC mains (period T = 0.02s).'
        }
      ]
    },
    apparatusDescription: [
      'Dynamics wooden/aluminum trolley with low-friction ball bearings',
      'Smooth 2.0 m inclined track runway with friction compensation block',
      'AC ticker-timer (50 Hz) with carbon disc and ticker tape rolls',
      'Lightweight frictionless pulley attached to runway end',
      'Hanging mass hanger with 5 x 10g (0.098 N) slotted weights',
      'Light inextensible braided cord string',
      'Electronic laboratory balance (0.1g accuracy)'
    ],
    controls: [
      {
        id: 'hangingMass',
        label: 'Accelerating Hanging Mass (m_h)',
        type: 'slider',
        min: 10,
        max: 50,
        step: 10,
        defaultValue: 20,
        unit: 'g'
      }
    ],
    dataColumns: [
      { key: 'trialNum', label: 'Trial', symbol: '#', unit: '', decimalPlaces: 0 },
      { key: 'hangingMassGrams', label: 'Hanging Mass', symbol: 'm_h', unit: 'g', decimalPlaces: 0 },
      { key: 'netForce', label: 'Net Force (F_net = m_h x g)', symbol: 'F_net', unit: 'N', isCalculated: true, decimalPlaces: 3 },
      { key: 'deltaV', label: 'Velocity Change', symbol: 'Δv', unit: 'm/s', decimalPlaces: 3 },
      { key: 'acceleration', label: 'Acceleration', symbol: 'a', unit: 'm/s²', isCalculated: true, decimalPlaces: 2 }
    ],
    recommendedDataPointsCount: 5,
    graphConfig: {
      xAxis: {
        key: 'netForce',
        label: 'Net Force (F_net)',
        symbol: 'F_net',
        unit: 'N',
        min: 0,
        max: 0.6,
        step: 0.1
      },
      yAxis: {
        key: 'acceleration',
        label: 'Acceleration (a)',
        symbol: 'a',
        unit: 'm/s²',
        min: 0,
        max: 0.6,
        step: 0.1
      },
      expectedSlopeName: 'Inverse Total Mass (1/m_total)',
      expectedSlopeUnit: 'kg⁻¹',
      expectedSlopeSign: 'positive',
      physicalMeaningOfSlope: 'The gradient of the a vs Fnet graph represents the reciprocal of the total system mass (1/m_total = 1.0 kg⁻¹).',
      physicalMeaningOfIntercept: 'Line passes through the origin (0, 0), confirming that zero net force produces zero acceleration.'
    },
    precautions: [
      'Compensate for track friction before beginning by raising one end until trolley rolls with uniform velocity (equal dot spacing on tape).',
      'Transfer masses from the trolley bed to the hanger rather than adding extra mass from the bench, to preserve constant total mass m_total.',
      'Catch the trolley softly before it impacts the pulley buffer.'
    ],
    commonErrors: [
      'Adding weights to the hanger without removing them from the trolley, which violates the controlled variable of constant system mass.',
      'Forgetting to friction-compensate the track, resulting in a non-zero x-intercept equal to kinetic friction f_k.',
      'Miscalculating time interval between 10-dot ticker tape segments (10 dots = 0.20s at 50 Hz).'
    ],
    rubric: [
      {
        id: 'n1',
        category: 'Investigative Framework',
        criterion: "States Newton's 2nd Law and explains mass transfer technique for constant system mass (3 marks)",
        maxMarks: 3
      },
      {
        id: 'n2',
        category: 'Data Collection & Accuracy',
        criterion: 'Tabulates 5 net forces with tape acceleration measurements (4 marks)',
        maxMarks: 4
      },
      {
        id: 'n3',
        category: 'Graphical Analysis',
        criterion: 'Plots acceleration vs F_net straight line passing through origin (4 marks)',
        maxMarks: 4
      },
      {
        id: 'n4',
        category: 'Calculations & Constant Derivation',
        criterion: 'Calculates gradient, derives system mass m_total and compares with electronic balance reading (5 marks)',
        maxMarks: 5
      },
      {
        id: 'n5',
        category: 'Error Analysis & Conclusion',
        criterion: 'Explains friction compensation and tape drag as error sources, draws valid scientific conclusion (4 marks)',
        maxMarks: 4
      }
    ]
  }
];

export function getSbaPractical(id: string): SbaPractical | undefined {
  return sbaPracticals.find(p => p.id === id);
}

  export const generalQuizzes: Record<string, { q: string; o: string[]; c: number; exp: string }[]> = {
    'g10-atom-periodic': [
      {
        q: 'What is the correct electron configuration for a neutral Oxygen atom (Z = 8)?',
        o: ['1s² 2s² 2p⁴', '1s² 2s⁴ 2p²', '1s² 2s² 2p⁶', '1s² 2s² 2p² 3s²'],
        c: 0,
        exp: 'Oxygen has 8 electrons. Following the Aufbau principle: 2 in 1s, 2 in 2s, and the remaining 4 fill the 2p orbitals.'
      },
      {
        q: 'Which of the following periodic trends INCREASES as you move from left to right across a period?',
        o: ['Atomic Radius', 'Metallic Character', 'Ionisation Energy', 'Atomic Number decreases'],
        c: 2,
        exp: 'Ionisation energy increases across a period due to stronger nuclear charge holding valence electrons tightly.'
      }
    ],
    'g10-chemical-bonding': [
      {
        q: 'Which type of chemical bond involves the sharing of electron pairs between atoms?',
        o: ['Ionic Bond', 'Covalent Bond', 'Metallic Bond', 'Hydrogen Bond'],
        c: 1,
        exp: 'Covalent bonds are formed by the mutual sharing of valence electrons between non-metal atoms.'
      },
      {
        q: 'What is the key characteristic of metallic bonding?',
        o: ['Transfer of electrons', 'Shared electron pairs', 'A sea of delocalised electrons', 'Electrostatic lattice attraction'],
        c: 2,
        exp: 'Metallic bonding is described as positively charged metal cores floating in a sea of delocalised valence electrons.'
      }
    ],
    'g10-heating-curves': [
      {
        q: 'What happens to the temperature of a pure substance during a phase change (like melting)?',
        o: ['It increases rapidly', 'It decreases', 'It remains constant', 'It fluctuates'],
        c: 2,
        exp: 'During a phase change, the added heat energy is used to break intermolecular bonds rather than increase kinetic energy, so temperature is constant.'
      }
    ],
    'g10-aqueous-reactions': [
      {
        q: 'What is a precipitate in an aqueous reaction?',
        o: ['A gas bubble formed', 'An insoluble solid that emerges from a liquid solution', 'A sudden drop in temperature', 'A change in color of a liquid'],
        c: 1,
        exp: 'A precipitate is an insoluble solid that forms when two aqueous solutions react.'
      },
      {
        q: 'Which of the following is typically a strong electrolyte in water?',
        o: ['Sugar (Glucose)', 'Sodium Chloride (NaCl)', 'Pure water', 'Ethanol'],
        c: 1,
        exp: 'Sodium Chloride fully dissociates into ions in water, making it a strong electrolyte.'
      }
    ],
    'g10-stoichiometry-intro': [
      {
        q: 'What is the value of Avogadro\'s number?',
        o: ['6.02 x 10^23', '3.00 x 10^8', '9.81', '1.60 x 10^-19'],
        c: 0,
        exp: 'Avogadro\'s number (6.022 x 10^23) is the number of particles in exactly one mole of a pure substance.'
      },
      {
        q: 'If the molar mass of Carbon is 12 g/mol and Oxygen is 16 g/mol, what is the molar mass of CO2?',
        o: ['28 g/mol', '32 g/mol', '44 g/mol', '56 g/mol'],
        c: 2,
        exp: '12 + (2 * 16) = 12 + 32 = 44 g/mol.'
      }
    ],
    'g10-hydrosphere': [
      {
        q: 'What is the primary driving force of the water cycle?',
        o: ['Lunar gravity', 'Geothermal heat', 'Solar energy', 'Wind currents'],
        c: 2,
        exp: 'The sun provides the energy needed for evaporation and transpiration, driving the global water cycle.'
      },
      {
        q: 'Which process in water purification is used to kill bacteria?',
        o: ['Filtration', 'Chlorination', 'Sedimentation', 'Flocculation'],
        c: 1,
        exp: 'Chlorine or other disinfectants are added to water to kill harmful microorganisms.'
      }
    ],
    'g10-vectors': [
      {
        q: 'Which of the following is a vector quantity?',
        o: ['Distance', 'Speed', 'Mass', 'Displacement'],
        c: 3,
        exp: 'Displacement has both magnitude and a specific direction, making it a vector.'
      },
      {
        q: 'If you walk 4m East, then 3m West, what is your total displacement?',
        o: ['7m East', '1m East', '1m West', '7m West'],
        c: 1,
        exp: 'Displacement is a vector sum: +4m (East) and -3m (West) = +1m (East).'
      }
    ],
    'g10-motion-1d': [
      {
        q: 'What does the slope of a position-time graph represent?',
        o: ['Acceleration', 'Displacement', 'Velocity', 'Force'],
        c: 2,
        exp: 'The rate of change of position with respect to time is velocity (dx/dt).'
      },
      {
        q: 'If an object is slowing down while moving in the positive direction, its acceleration is:',
        o: ['Positive', 'Negative', 'Zero', 'Constant'],
        c: 1,
        exp: 'To slow down, the acceleration must be opposite to the direction of velocity. Thus, it is negative.'
      }
    ],
    'g10-mechanical-energy': [
      {
        q: 'In a frictionless system, the total mechanical energy is:',
        o: ['Continuously decreasing', 'Always zero', 'Conserved (constant)', 'Equal to potential energy only'],
        c: 2,
        exp: 'The Law of Conservation of Mechanical Energy states that PE + KE remains constant in an isolated system.'
      },
      {
        q: 'When a pendulum swings to its highest point, its kinetic energy is:',
        o: ['At its maximum', 'Zero', 'Equal to its potential energy', 'Negative'],
        c: 1,
        exp: 'At the highest point, it momentarily stops, meaning velocity is 0 and Kinetic Energy is 0.'
      }
    ],
    'g10-waves-sound': [
      {
        q: 'The pitch of a sound is directly related to its:',
        o: ['Amplitude', 'Frequency', 'Speed', 'Wavelength'],
        c: 1,
        exp: 'Higher frequency sound waves are perceived as having a higher pitch.'
      },
      {
        q: 'Sound waves are an example of:',
        o: ['Transverse waves', 'Electromagnetic waves', 'Longitudinal waves', 'Standing waves'],
        c: 2,
        exp: 'Sound waves are longitudinal, consisting of alternating compressions and rarefactions.'
      }
    ],
    'g10-circuits': [
      {
        q: 'In a series circuit, which quantity remains the same across all components?',
        o: ['Voltage', 'Current', 'Resistance', 'Power'],
        c: 1,
        exp: 'Current has only one path to flow in a series circuit, so it is the same everywhere.'
      },
      {
        q: 'What happens to the total resistance when you add more resistors in parallel?',
        o: ['It increases', 'It decreases', 'It stays the same', 'It drops to zero'],
        c: 1,
        exp: 'Adding parallel branches provides more paths for current, thus decreasing overall resistance.'
      }
    ],
    'g11-intermolecular': [
      {
        q: 'Which intermolecular force is the strongest?',
        o: ['London Dispersion Forces', 'Dipole-Dipole interactions', 'Hydrogen Bonding', 'Ion-Dipole forces'],
        c: 2,
        exp: 'Hydrogen bonding is an exceptionally strong dipole-dipole interaction occurring between H and N, O, or F.'
      },
      {
        q: 'A liquid with strong intermolecular forces will have a:',
        o: ['Low boiling point', 'High vapor pressure', 'High boiling point', 'Fast evaporation rate'],
        c: 2,
        exp: 'Strong IMFs require more energy (higher temperature) to overcome for boiling to occur.'
      }
    ],
    'g11-ideal-gases': [
      {
        q: 'Boyle\'s Law states that at constant temperature, pressure is:',
        o: ['Directly proportional to volume', 'Inversely proportional to volume', 'Equal to volume', 'Independent of volume'],
        c: 1,
        exp: 'P1*V1 = P2*V2. As volume decreases, pressure increases proportionally.'
      },
      {
        q: 'According to Charles\'s Law, what must be held constant?',
        o: ['Pressure', 'Volume', 'Temperature', 'Moles of gas'],
        c: 0,
        exp: 'Charles\'s Law (V1/T1 = V2/T2) assumes pressure and the amount of gas are held constant.'
      }
    ],
    'g11-quantitative': [
      {
        q: 'What is a limiting reagent?',
        o: ['The product formed in the smallest amount', 'The reactant that is left over', 'The reactant that is completely consumed first', 'A catalyst that speeds up the reaction'],
        c: 2,
        exp: 'The limiting reagent dictates the maximum amount of product that can be formed.'
      },
      {
        q: 'Percentage yield is calculated by:',
        o: ['(Theoretical Yield / Actual Yield) * 100', '(Actual Yield / Theoretical Yield) * 100', 'Actual Yield + Theoretical Yield', '(Actual Yield - Theoretical Yield) / 100'],
        c: 1,
        exp: 'Percentage yield compares what was actually produced to the maximum theoretically possible.'
      }
    ],
    'g11-acids-bases': [
      {
        q: 'According to the Arrhenius theory, an acid is a substance that:',
        o: ['Produces OH⁻ ions in solution', 'Accepts a proton (H⁺)', 'Produces H⁺ (H₃O⁺) ions in aqueous solution', 'Donates an electron pair'],
        c: 2,
        exp: 'Arrhenius acids increase the concentration of H⁺ ions when dissolved in water.'
      },
      {
        q: 'What are the products of a standard acid-base neutralisation reaction?',
        o: ['Salt and Hydrogen gas', 'Salt and Water', 'Base and Water', 'Acid and Salt'],
        c: 1,
        exp: 'An acid and a base react to form a salt and water (e.g., HCl + NaOH -> NaCl + H2O).'
      }
    ],
    'g11-lithosphere': [
      {
        q: 'Which sector is a major part of the South African mining industry?',
        o: ['Silicon extraction', 'Gold and Platinum', 'Lithium batteries', 'Bauxite mining'],
        c: 1,
        exp: 'South Africa is known globally for its extensive gold, platinum group metals, and coal reserves.'
      },
      {
        q: 'What is the main environmental concern of deep-level gold mining?',
        o: ['Acid mine drainage', 'Ozone layer depletion', 'Excess oxygen production', 'Ocean acidification'],
        c: 0,
        exp: 'Acid mine drainage occurs when sulphide minerals are exposed to air and water, forming sulfuric acid.'
      }
    ],
    'g11-vectors-2d': [
      {
        q: 'To resolve a vector into its vertical component (y-axis) when given the angle with the x-axis, you use:',
        o: ['Cosine', 'Sine', 'Tangent', 'Pythagorean theorem'],
        c: 1,
        exp: 'Vy = V * sin(θ), assuming θ is the angle relative to the horizontal.'
      },
      {
        q: 'The resultant of two forces, 3N East and 4N North, is:',
        o: ['7N', '1N', '5N', '12N'],
        c: 2,
        exp: 'Using Pythagoras: √(3² + 4²) = √(9+16) = √25 = 5N.'
      }
    ],
    'g11-newton-laws': [
      {
        q: 'Newton\'s First Law is also known as the Law of:',
        o: ['Inertia', 'Acceleration', 'Action-Reaction', 'Gravitation'],
        c: 0,
        exp: 'An object will remain at rest or uniform motion unless acted upon by a net external force (Inertia).'
      },
      {
        q: 'If the net force on an object is doubled, its acceleration will:',
        o: ['Halve', 'Remain the same', 'Double', 'Quadruple'],
        c: 2,
        exp: 'According to Newton\'s Second Law (F = ma), acceleration is directly proportional to net force.'
      }
    ],
    'g11-optics': [
      {
        q: 'Refraction occurs when light:',
        o: ['Bounces off a mirror', 'Changes speed passing between different optical media', 'Is absorbed by a black surface', 'Travels through a vacuum'],
        c: 1,
        exp: 'Refraction is the bending of light caused by a change in its wave speed in different densities.'
      },
      {
        q: 'Total internal reflection can only happen when light travels from:',
        o: ['A less dense to a more dense medium', 'A vacuum into glass', 'A more dense to a less dense medium', 'Air into water'],
        c: 2,
        exp: 'It requires light moving towards a lower refractive index medium (e.g., glass to air) at an angle greater than the critical angle.'
      }
    ],
    'g11-electrostatics': [
      {
        q: 'According to Coulomb\'s Law, the electrostatic force is inversely proportional to:',
        o: ['The product of the charges', 'The square of the distance between charges', 'The mass of the charges', 'The medium\'s temperature'],
        c: 1,
        exp: 'F = k(q1*q2)/r². The force drops off with the square of the distance (1/r²).'
      },
      {
        q: 'Electric field lines point in the direction a ______ charge would move.',
        o: ['Negative test', 'Positive test', 'Neutral', 'Stationary'],
        c: 1,
        exp: 'By convention, electric field lines emanate from positive charges and point towards negative ones.'
      }
    ],
    'g11-electromagnetism': [
      {
        q: 'Faraday\'s Law of Electromagnetic Induction states that an induced EMF is proportional to the:',
        o: ['Rate of change of magnetic flux', 'Strength of the magnetic field alone', 'Resistance of the wire', 'Length of the coil only'],
        c: 0,
        exp: 'EMF = -N(ΔΦ/Δt). The faster the magnetic flux changes, the greater the induced voltage.'
      },
      {
        q: 'Which rule determines the direction of the induced current opposing the change in magnetic flux?',
        o: ['Fleming\'s Left Hand Rule', 'Ohm\'s Law', 'Lenz\'s Law', 'Ampere\'s Law'],
        c: 2,
        exp: 'Lenz\'s Law states the induced current will flow to create a magnetic field that opposes the change producing it.'
      }
    ],
    'g12-work-energy': [
      {
        q: 'The Work-Energy Theorem states that the net work done on an object equals its change in:',
        o: ['Potential Energy', 'Kinetic Energy', 'Mechanical Energy', 'Momentum'],
        c: 1,
        exp: 'W_net = ΔEK. Work done by all forces results in a change of speed/kinetic energy.'
      },
      {
        q: 'Power is defined as:',
        o: ['Force times distance', 'Work done per unit time', 'Energy conserved over distance', 'Mass times acceleration'],
        c: 1,
        exp: 'P = W / t. It is the rate at which work is done or energy is transferred.'
      }
    ],
    'g12-momentum': [
      {
        q: 'What is conserved in an isolated system according to the law of conservation of momentum?',
        o: ['Kinetic Energy', 'Potential Energy', 'Total Momentum', 'Velocity'],
        c: 2,
        exp: 'In any collision in an isolated system, the total momentum before equals total momentum after.'
      }
    ],
    'g12-doppler': [
      {
        q: 'As an ambulance with a siren approaches you, the sound waves are:',
        o: ['Compressed, lowering the pitch', 'Spread out, lowering the pitch', 'Compressed, raising the pitch', 'Spread out, raising the pitch'],
        c: 2,
        exp: 'The relative motion compresses the wave fronts ahead of the source, resulting in a higher perceived frequency.'
      },
      {
        q: 'If a star is moving away from Earth, its light spectrum will be:',
        o: ['Blue-shifted', 'Red-shifted', 'Unchanged', 'Invisible'],
        c: 1,
        exp: 'Moving away stretches the light waves, shifting them towards the longer wavelength (red) end of the spectrum.'
      }
    ],
    'g12-optical-phenomena': [
      {
        q: 'The photoelectric effect provides strong evidence for the:',
        o: ['Wave nature of light', 'Particle nature of light', 'Continuous energy spectrum', 'Refraction of light'],
        c: 1,
        exp: 'It proves light exists as discrete energy packets (photons) that collide with electrons.'
      },
      {
        q: 'To eject an electron, the incident photon must have an energy greater than the metal\'s:',
        o: ['Kinetic energy', 'Work function', 'Temperature', 'Atomic mass'],
        c: 1,
        exp: 'The work function (W0) is the minimum binding energy keeping the electron inside the metal.'
      }
    ]
  };
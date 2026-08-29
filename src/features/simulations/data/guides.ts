  export const guidesContent: Record<string, { theory: string; procedure: string; tech: string; formulas: string[] }> = {
    // Grade 10 Physics
    'g10-vectors': {
      theory: 'Vectors have both magnitude and direction, unlike scalars which only have magnitude. Displacement, velocity, force, and acceleration are vector quantities. When adding vectors in 1D, choose a reference positive direction (e.g. Right is positive).',
      procedure: 'Arrange 1D vector arrows head-to-tail on a line. Solve for the resultant vector by algebraically summing the signed vector magnitudes.',
      tech: 'Use a measuring tape or smartphone mapping GPS to track physical displacement in a straight line. Walk in two steps (e.g. 5m East, then 3m West) and compare total distance (8m) to displacement vector (2m East).',
      formulas: ['R = A + B (vector sum)', 'Distance = |A| + |B|']
    },
    'g10-motion-1d': {
      theory: 'Kinematics is the description of motion without referencing forces. 1D motion is motion along a straight line path. Position (x), velocity (v), and acceleration (a) describe the kinematics. Graphs of position, velocity, and acceleration vs. time are linked by derivatives (slopes) and integrals (areas).',
      procedure: 'Set the initial velocity and acceleration parameters. Press Run to trace the trolley moving. View the position-time and velocity-time graphs updating in real-time. Notice how a constant acceleration leads to a curved position-time graph and linear velocity-time graph.',
      tech: 'Film a ball rolling down a slanted track using a smartphone. Import the video into Tracker Video Analysis. Define a coordinate system, scale coordinate lengths with a physical ruler, and auto-track the moving ball to plot real-time speed, velocity, and acceleration curves.',
      formulas: ['v_f = v_i + a*t', 'x_f = x_i + v_i*t + 0.5*a*t^2', 'v_f^2 = v_i^2 + 2*a*dx']
    },
    'g10-mechanical-energy': {
      theory: 'The Law of Conservation of Mechanical Energy states that in an isolated system subject only to conservative forces (like gravity), the total mechanical energy (ME) remains constant. Mechanical energy is the sum of Kinetic Energy (KE = 0.5*m*v^2) and Gravitational Potential Energy (PE = m*g*h).',
      procedure: 'Configure the height and mass of the skater. Release the skater and observe how PE peaks at the highest point of the ramp, whereas KE peaks at the lowest point (h=0). Observe that total Mechanical Energy remains flat and conserved.',
      tech: 'Download the PhET Interactive Simulation "Energy Skate Park: Basics" on a browser or tablet. Run the track simulation under zero friction, enable the energy bar charts, and verify that total mechanical energy remains constant at all points.',
      formulas: ['PE = m * g * h', 'KE = 0.5 * m * v^2', 'ME = PE + KE = constant']
    },
    'g10-waves-sound': {
      theory: 'Waves transfer energy without transferring matter. Transverse waves have particles vibrating perpendicular to wave motion (e.g. light). Longitudinal waves have particles vibrating parallel to wave motion (e.g. sound). Sound wave pitch corresponds to frequency, while loudness corresponds to amplitude.',
      procedure: 'Adjust frequency and amplitude sliders. View the transverse sine wave on the live waveform canvas. Toggle parameters to see compressions and rarefactions of sound.',
      tech: 'Open the Phyphox app on your phone and select the "Audio Scope" or "Frequency Generator" sensor. Use your phone\'s microphone to capture whistled notes, revealing pure sinusoidal frequencies, or measure ambient sound pressure changes in real-time.',
      formulas: ['v = f * \\lambda (wave speed)', 'T = 1/f (period)']
    },
    'g10-circuits': {
      theory: 'An electric circuit is a closed loop conducting path. In a series circuit, components are connected end-to-end; current is constant through all components, while total voltage divides. In parallel, components form branching paths; voltage is constant across branches, while total current divides.',
      procedure: 'Study circuit series vs parallel topologies. Adding a resistor in series increases total resistance and drops current. Adding a resistor in parallel drops overall circuit resistance and draws more current.',
      tech: 'Load the PhET "Circuit Construction Kit: DC" simulation. Assemble a test circuit with 3 bulbs in series and observe how adding a fourth bulb dims the system. Re-arrange the bulbs in parallel and note how adding bulbs does not change individual brightness.',
      formulas: ['R_series = R1 + R2 + R3', '1/R_parallel = 1/R1 + 1/R2 + 1/R3', 'V = I * R']
    },

    // Grade 10 Chemistry
    'g10-heating-curves': {
      theory: 'Matter exists in solid, liquid, or gas states. Heating a substance increases its internal kinetic energy (temperature rises). During phase transitions (melting and boiling), the added thermal energy is consumed to break intermolecular bonds rather than increase temp, resulting in a temperature plateau.',
      procedure: 'Select the substance (ice or stearic acid) and set heater power. Click Start to trace the phase transitions. Look for the flat plateaus in the Temperature vs. Time graph, indicating latent heat of fusion (0°C for ice) and latent heat of vaporisation (100°C for water).',
      tech: 'In a real school lab, heat crushed ice in a beaker over a Bunsen burner. Record the temperature every 30 seconds using a thermometer until the water is boiling. Plot the phase change curves on graph paper to measure melting and boiling plateaus.',
      formulas: ['Q = m * c * \\Delta T (sensible heat)', 'Q = m * L (latent heat of phase change)']
    },
    'g10-hydrosphere': {
      theory: 'The Hydrosphere encompasses all water bodies on Earth (oceans 97.2%, glaciers 2.15%, groundwater 0.62%, surface freshwater 0.03%). Solar radiation drives the hydrological cycle (evaporation, transpiration, condensation, precipitation, infiltration, runoff). Municipal water purification uses screening, coagulation/flocculation (Alum), sedimentation, multi-media filtration, chlorination (pathogen disinfection), and lime pH stabilization (SANS 241). Qualitative ion testing identifies Cl⁻ (AgNO₃/NH₃), SO₄²⁻ (Ba(NO₃)₂/HNO₃), CO₃²⁻ (HCl/limewater), and NO₃⁻ (brown ring test).',
      procedure: '1. Adjust solar flux and humidity to observe catchment evaporation and precipitation. 2. Operate the 6-stage purification plant: optimize Alum dosage (25-35 mg/L), settling time, and chlorine residual (0.2-0.5 mg/L) to achieve SANS 241 potable certification. 3. In the ion bench, add AgNO₃ to confirm chloride precipitates (AgCl) and Ba(NO₃)₂ for sulfates (BaSO₄). 4. Use the conductivity rig to compare distilled water vs seawater vs AMD. 5. Neutralize acid mine drainage with lime Ca(OH)₂.',
      tech: 'Use digital turbidity (NTU), electrical conductivity (μS/cm), and digital pH probes connected to a mobile datalogger (such as Vernier LabQuest or Pasco SPARKvue) to test local river samples against municipal tap water.',
      formulas: [
        '\\text{Ag}^+(aq) + \\text{Cl}^-(aq) \\rightarrow \\text{AgCl}(s) \\downarrow',
        '\\text{Ba}^{2+}(aq) + \\text{SO}_4^{2-}(aq) \\rightarrow \\text{BaSO}_4(s) \\downarrow',
        '\\text{CO}_3^{2-}(aq) + 2\\text{H}^+(aq) \\rightarrow \\text{CO}_2(g) \\uparrow + \\text{H}_2\\text{O}(l)',
        '2\\text{FeS}_2(s) + 7\\text{O}_2(g) + 2\\text{H}_2\\text{O}(l) \\rightarrow 2\\text{Fe}^{2+} + 4\\text{SO}_4^{2-} + 4\\text{H}^+'
      ]
    },

    // Grade 11 Physics
    'g11-vectors-2d': {
      theory: 'Vectors in 2D cannot be added by simple arithmetic. They are resolved into perpendicular horizontal (x) and vertical (y) components using trigonometry. The resultant vector is found by summing all x-components and y-components separately, then using Pythagoras.',
      procedure: 'Use the sliders to adjust vector magnitude and angle. Watch the 2D grid display the vector components (Vx and Vy) and calculate exact trigonometric resolutions.',
      tech: 'Set up a force table experiment in a laboratory. Attach three spring balances to a central ring via strings. Pull them in different 2D directions until the ring is static, proving the vector sum of forces equals zero.',
      formulas: ['V_x = V * \\cos(\\theta)', 'V_y = V * \\sin(\\theta)', 'V_{resultant} = \\sqrt{Vx^2 + Vy^2}', '\\theta = \\arctan(Vy/Vx)']
    },
    'g11-newton-laws': {
      theory: "Newton's Second Law of Motion states that when a net force acts on an object, the object accelerates in the direction of the force. Acceleration is directly proportional to net force and inversely proportional to the mass: F_net = m * a. Newton's 1st law defines inertia, and 3rd law defines action-reaction pairs.",
      procedure: 'Adjust pulling force and trolley mass. Click Play to accelerate the trolley. Graph the acceleration curve. Note how doubling force doubles acceleration, while doubling mass halves it.',
      tech: 'Strapping a smartphone running the Phyphox app to a physics trolley. Select "Accelerometer (without g)" and run a trial pulling the trolley with constant weights. Export the acceleration graph to verify F_net = ma in real time.',
      formulas: ['F_{net} = m * a', 'F_g = G * (m1*m2)/r^2 (Universal Gravitation)']
    },
    'g11-optics': {
      theory: "Refraction is the bending of light as it passes from one optical medium to another of different density. This is caused by changes in light speed. Snell's Law states that n1*sin(θi) = n2*sin(θr). Total internal reflection (TIR) occurs when light travels from dense to less dense medium and exceeds the critical angle.",
      procedure: 'Adjust the incident angle and refractive indices. Watch the laser ray bend as it hits the boundary. If the incident angle exceeds the calculated critical angle, look at the transition to total internal reflection.',
      tech: 'Shine a red laser pointer through a rectangular glass block placed on graph paper. Trace the incident, refracted, and emergent light beams. Measure incident and refracted angles using a protractor to calculate refractive index.',
      formulas: ["n1 * \\sin(\\theta_i) = n2 * \\sin(\\theta_r)", "\\sin(\\theta_c) = n1 / n2 (Critical Angle)"]
    },
    'g11-ideal-gases': {
      theory: "Boyle's Law states that the volume of a fixed mass of gas is inversely proportional to its pressure at a constant temperature (P1*V1 = P2*V2). Charles's Law relates volume and temperature, while Gay-Lussac's Law relates pressure and temperature. Combined, they form the Ideal Gas Law.",
      procedure: 'Adjust volume and temperature sliders. View the compression syringe. Notice that decreasing volume crowds the gas molecules, leading to a rise in collisions and pressure. Inspect the live PV constant values.',
      tech: 'Attach a large plastic syringe to a pressure sensor dial. Compress the plunger to set volumes (e.g. 50mL, 40mL, 30mL) and record the pressure readings. Plot Pressure vs 1/Volume to obtain a straight line proving Boyle\'s Law.',
      formulas: ['P * V = n * R * T (Ideal Gas Law)', 'P1 * V1 = P2 * V2 (Boyle\'s)', 'V1/T1 = V2/T2 (Charles\'s)']
    },
    'g11-intermolecular': {
      theory: 'Intermolecular forces (IMFs) are attractive forces between molecules. London dispersion forces are weakest, followed by dipole-dipole interactions, and hydrogen bonding (strongest). Stronger IMFs hold molecules tightly in liquid phase, leading to lower vapor pressure, higher boiling points, and slower evaporation rates.',
      procedure: 'Set ambient temperature and click Evaporate. Watch the liquid levels of Water (Hydrogen bonds - strong IMF), Ethanol (Hydrogen bonds - moderate IMF), and Acetone (dipole-dipole - weak IMF) decrease in real-time.',
      tech: 'Place a drop of water, ethanol, and nail polish remover (acetone) on separate spots on a glass slide. Time how long each takes to evaporate. The speed of evaporation directly corresponds to the strength of their intermolecular bonds.',
      formulas: ['IMF Strength: London < Dipole-Dipole < Hydrogen Bond', 'Evaporation Rate \\propto 1 / IMF Strength']
    },

    // Grade 12 Physics
    'g12-momentum': {
      theory: 'Momentum is a vector quantity defined as product of mass and velocity (p=mv). In an isolated system, the total linear momentum is conserved in all collisions. In an elastic collision, total kinetic energy is also conserved. In an inelastic collision, kinetic energy is lost as sound/heat/deformation.',
      procedure: 'Configure mass and velocity parameters for Trolley 1 and Trolley 2. Select elastic or inelastic collision. Click Run to watch them crash. Look at the momentum balance calculations table verifying conservation.',
      tech: 'Position two trolleys on a smooth linear track. Attach a ticker-tape or record a video of the crash. Use Tracker video analysis to calculate velocities before and after the collision to verify the Conservation of Momentum.',
      formulas: ['p = m * v', 'm1*v1i + m2*v2i = m1*v1f + m2*v2f (Conservation of Momentum)', 'KE = 0.5 * m * v^2']
    },
    'g12-doppler': {
      theory: 'The Doppler Effect is the change in frequency (pitch) of sound detected by a listener when the sound source and/or listener are in motion relative to each other. As the source approaches, wave crests are compressed (higher frequency/pitch). As the source recedes, wave crests spread out (lower frequency/pitch).',
      procedure: 'Set frequency and speed parameters. Run the siren source. Watch wave compressions in front of the car. Observe the sudden frequency drop as the siren passes the stationary observer.',
      tech: 'Place a smartphone inside a soft ball, play a steady tone (e.g. 500 Hz), and throw it past another phone recording with a spectrum analyzer app (like Phyphox). The spectral plot will show a distinct frequency shift (Doppler curve).',
      formulas: ["f_L = f_S * [ v / (v \\mp v_S) ] (stationary listener)", "v = 343 m/s (speed of sound in air)"]
    },
    'g12-optical-phenomena': {
      theory: 'The Photoelectric Effect is the process whereby electrons are ejected from a metal surface when light of a sufficiently high frequency shines on it. It proves that light acts as discrete packets of energy (photons). Wavelength governs photon energy ($E=hc/\\lambda$), while intensity governs electron ejection count.',
      procedure: 'Select the metal cathode (Cesium, Sodium, or Zinc) and adjust wavelength. Note that red light (low energy) ejects zero electrons, while ultraviolet light (high energy) ejects many. Observe the current meter.',
      tech: 'Connect a vacuum phototube to a variable power supply and sensitive microammeter. Shine monochromatic light of different wavelengths on the cathode. Adjust the stopping potential to measure the maximum kinetic energy of the photoelectrons.',
      formulas: ['E = h * f = h * c / \\lambda', 'E = W_0 + K_{max} (Einstein Photoelectric Equation)', 'W_0 = h * f_0 (Work Function)']
    }
  };
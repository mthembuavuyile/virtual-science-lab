import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Beaker, BookOpen, Presentation, ChevronRight, Zap } from 'lucide-react';

const AtomAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center max-h-[800px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="relative w-[500px] h-[500px] md:w-[800px] md:h-[800px] flex items-center justify-center opacity-40"
      >
        <div className="absolute w-32 h-32 bg-blue-400/5 rounded-full blur-2xl" />
        
        {/* Core - Technical style */}
        <div className="absolute w-2 h-2 bg-blue-600/20 rounded-full" />
        <div className="absolute w-8 h-8 border border-blue-600/10 rounded-full" />
        
        {/* Orbits - Very thin and technical */}
        <div className="absolute w-full h-[20%] border border-slate-300 rounded-[100%] rotate-0" />
        <div className="absolute w-full h-[20%] border border-slate-300 rounded-[100%] rotate-60" />
        <div className="absolute w-full h-[20%] border border-slate-300 rounded-[100%] -rotate-60" />

        {/* Electrons - small precise dots */}
        <div className="absolute w-full h-[20%] rounded-[100%] rotate-0">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full" />
        </div>
        <div className="absolute w-full h-[20%] rounded-[100%] rotate-60">
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full" />
        </div>
        <div className="absolute w-full h-[20%] rounded-[100%] -rotate-60">
           <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Beaker className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">VyLab</span>
          </div>
          <nav className="hidden md:flex gap-6 font-medium text-slate-600 text-sm">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#curriculum" className="hover:text-blue-600 transition-colors">CAPS Curriculum</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Schools</a>
          </nav>
          <div className="flex gap-4 items-center">
            <Link to="/app" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5">
              Launch Simulator <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-24 pb-32 overflow-hidden relative">
          <AtomAnimation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-tight">
                Your Pocket Science Laboratory
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Run real experiments from home using interactive simulators. Explore <span className="text-pink-600 font-semibold">Chemistry</span> and <span className="text-blue-600 font-semibold">Physics</span> without the need for expensive equipment. Perfectly aligned to the South African CAPS curriculum.
              </p>
              <div className="flex flex-col items-center justify-center">
                <Link to="/app" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
                  Launch Simulators <ChevronRight className="w-5 h-5" />
                </Link>
                <p className="text-xs text-slate-500 mt-3 font-medium">
                  No account registration required &mdash; start experimenting instantly as a guest.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-24 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Powerful STEM Modules</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Explore our diverse range of interactive science tools designed precisely for high school learners.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                  <Beaker className="text-pink-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Chemistry</h3>
                <p className="text-slate-600 leading-relaxed">Run pH indicating titrations, mix inorganic chemicals and observe precipitate formation in real-time visual simulations.</p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="text-blue-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Physics</h3>
                <p className="text-slate-600 leading-relaxed">Adjust voltages and resistance in Ohm's law circuits, or configure velocity and gravity in our 2D projectile kinematics labs.</p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="text-purple-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">AI Syllabus Tutor</h3>
                <p className="text-slate-600 leading-relaxed">Stuck on a concept? Chat with our AI tutor trained specifically on the CAPS physical science guidelines to guide your learning.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CAPS Curriculum Section */}
        <section id="curriculum" className="py-24 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Aligned with the CAPS Syllabus</h2>
              <p className="text-slate-600 max-w-3xl mx-auto text-base">
                A structured three-year Physical Sciences journey. From fundamental Grade 10 measurements to complex Grade 12 systems, we map every topic and provide guided instructions on turning your desk into a lab using smart tech.
              </p>

              {/* Tech Integrations Banner */}
              <div className="mt-8 pt-6 border-t border-slate-200/60 max-w-2xl mx-auto w-full">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Compatible with leading scientific tools</p>
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-600">
                  <span className="hover:text-slate-900 transition-colors">Phyphox Phone App</span>
                  <span className="text-slate-300 font-normal">/</span>
                  <span className="hover:text-slate-900 transition-colors">Tracker Video Analysis</span>
                  <span className="text-slate-300 font-normal">/</span>
                  <span className="hover:text-slate-900 transition-colors">PhET Interactive Simulators</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Grade 10: The Foundation */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Grade 10</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">The Foundation</h3>
                  <p className="text-xs text-slate-400 mb-4 font-semibold">Transitioning to formal rules of Science</p>

                  {/* Physics & Chemistry splits */}
                  <div className="space-y-4 text-xs">
                    <div>
                      <h4 className="font-extrabold text-blue-900 mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> Physics Topics
                      </h4>
                      <ul className="space-y-1 text-slate-600 font-medium pl-3 list-disc">
                        <li>Vectors & Scalars (1D direction & magnitude)</li>
                        <li>Motion in One Dimension (Kinematics)</li>
                        <li>Mechanical Energy (Conservation of ME)</li>
                        <li>Waves, Sound, & Light (transverse & longitudinal)</li>
                        <li>Electricity & Magnetism (electrostatics & DC)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-emerald-950 mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Chemistry Topics
                      </h4>
                      <ul className="space-y-1 text-slate-600 font-medium pl-3 list-disc">
                        <li>Matter & Materials (phase change curves)</li>
                        <li>Atom & Periodic Table (isotopes & configuration)</li>
                        <li>Chemical Bonding (covalent, ionic, metallic)</li>
                        <li>Reactions in Aqueous Solutions</li>
                        <li>Quantitative Aspects (intro to the "mole")</li>
                        <li>The Hydrosphere (water cycle & purification)</li>
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <h4 className="font-extrabold text-slate-800 mb-1 flex items-center gap-1">
                        🧪 Tech & Guided Practicals
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                        • Phase curves using melted stearic acid logs.<br />
                        • 1D kinematics graphs using rolling ball video in <b>Tracker</b>.<br />
                        • Circuits built via <b>PhET Simulator</b>.<br />
                        • Measure wave frequency via <b>Phyphox</b> mic.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  <span className="text-[9px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">Tracker Video</span>
                  <span className="text-[9px] font-extrabold bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded border border-cyan-100">PhET Labs</span>
                  <span className="text-[9px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">Phyphox Mic</span>
                </div>
              </div>

              {/* Grade 11: Deepening the Concepts */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-2">Grade 11</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Deepening Concepts</h3>
                  <p className="text-xs text-slate-400 mb-4 font-semibold">Invisible forces, fields, and 2D mechanics</p>

                  <div className="space-y-4 text-xs">
                    <div>
                      <h4 className="font-extrabold text-pink-900 mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-pink-600 rounded-full"></span> Physics Topics
                      </h4>
                      <ul className="space-y-1 text-slate-600 font-medium pl-3 list-disc">
                        <li>Vectors in 2D (horizontal & vertical components)</li>
                        <li>Newton's Laws & Universal Gravitation</li>
                        <li>Geometrical Optics (Refraction, Snell's law)</li>
                        <li>Electrostatics (Coulomb's law & fields)</li>
                        <li>Electromagnetism (Faraday's induction law)</li>
                        <li>Electric Circuits (Internal resistance & Ohm's law)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-emerald-950 mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Chemistry Topics
                      </h4>
                      <ul className="space-y-1 text-slate-600 font-medium pl-3 list-disc">
                        <li>Atomic Combinations (VSEPR & intermolecular forces)</li>
                        <li>Ideal Gases (Boyle's, Charles's, Gay-Lussac's)</li>
                        <li>Quantitative Chem (limiting reagents & concentration)</li>
                        <li>Acids & Bases (neutralisation titrations)</li>
                        <li>The Lithosphere (mining & mineral processing)</li>
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <h4 className="font-extrabold text-slate-800 mb-1 flex items-center gap-1">
                        🧪 Tech & Guided Practicals
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                        • Newton's 2nd law via <b>Phyphox</b> on a trolley.<br />
                        • Boyle's Law syringe compression vs <b>PhET Gas</b>.<br />
                        • Evaporation logs determining IMF bond strength.<br />
                        • Laser refraction glass blocks index mapping.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  <span className="text-[9px] font-extrabold bg-pink-50 text-pink-700 px-2 py-0.5 rounded border border-pink-100">Newton's Laws</span>
                  <span className="text-[9px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">Ohm's Law Sim</span>
                  <span className="text-[9px] font-extrabold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-100">Snell's Laser</span>
                </div>
              </div>

              {/* Grade 12: Application and Synthesis */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between ring-2 ring-blue-600 ring-offset-2 hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-bl-xl uppercase tracking-wider">
                  Matric Focus
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">Grade 12</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Application & Synthesis</h3>
                  <p className="text-xs text-slate-400 mb-4 font-semibold">Dynamic systems, organic molecules, and exam prep</p>

                  <div className="space-y-4 text-xs">
                    <div>
                      <h4 className="font-extrabold text-purple-950 mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span> Physics Topics
                      </h4>
                      <ul className="space-y-1 text-slate-600 font-medium pl-3 list-disc">
                        <li>Momentum & Impulse (collisions on a track)</li>
                        <li>Vertical Projectile Motion (free-fall graphs)</li>
                        <li>Work, Energy, & Power (Work-Energy theorem)</li>
                        <li>Doppler Effect (moving sirens pitch shifts)</li>
                        <li>Electrodynamics (AC/DC generators & motors)</li>
                        <li>Optical Phenomena (Photoelectric effect particle proof)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-emerald-950 mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Chemistry Topics
                      </h4>
                      <ul className="space-y-1 text-slate-600 font-medium pl-3 list-disc">
                        <li>Organic Chemistry (naming, properties, reactions)</li>
                        <li>Rates of Reaction (collision theory in action)</li>
                        <li>Chemical Equilibrium (Le Chatelier's principle)</li>
                        <li>Acids & Bases (advanced titrations & pH)</li>
                        <li>Electrochemical Cells (galvanic & electrolytic)</li>
                        <li>Fertiliser Industry (Haber, Ostwald, Contact)</li>
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <h4 className="font-extrabold text-slate-800 mb-1 flex items-center gap-1">
                        🧪 Tech & Guided Practicals
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                        • Momentum cart crash video tracking calculations.<br />
                        • Disappearing cross reaction rate timing logging.<br />
                        • Carboxylic acid + alcohol esterification reactions.<br />
                        • Doppler soft-ball flybys with spectral software logs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  <span className="text-[9px] font-extrabold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100">Organic Ester</span>
                  <span className="text-[9px] font-extrabold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100">Titration Curves</span>
                  <span className="text-[9px] font-extrabold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100">Electrodynamics</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing / Schools Section */}
        <section id="pricing" className="py-24 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Flexible Access for Schools & Learners</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                No sign-up is required for individual learners. For schools needing deep integration, we provide custom workspace solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Individual plan */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 relative flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Individual Student</h3>
                  <p className="text-slate-500 text-sm mb-6">Perfect for home learning, homework help, and matric exam prep.</p>
                  <div className="text-4xl font-extrabold text-slate-900 mb-6">R0<span className="text-sm font-medium text-slate-500"> / forever</span></div>
                  <ul className="space-y-3 text-sm text-slate-600 mb-8">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      100% Free Instant Guest Access
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      All Physics & Chemistry Labs included
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      AI Syllabus Tutor & AI Sandbox
                    </li>
                  </ul>
                </div>
                <Link to="/app" className="w-full bg-slate-900 hover:bg-slate-800 text-white text-center py-3 rounded-lg font-semibold transition-colors">
                  Start Experimenting
                </Link>
              </div>

              {/* Schools plan */}
              <div className="p-8 rounded-2xl bg-blue-50 border border-blue-200 relative flex flex-col justify-between ring-1 ring-blue-300">
                <div>
                  <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    School Pilot Program
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">For Schools & Teachers</h3>
                  <p className="text-slate-500 text-sm mb-6">Unified dashboard for teachers to manage practical work and student marks.</p>
                  <div className="text-4xl font-extrabold text-slate-900 mb-6">Contact Us</div>
                  <ul className="space-y-3 text-sm text-slate-600 mb-8">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      Custom teacher dashboards & class analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      Downloadable SBA-aligned practical sheets
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      Unified Vylex Nexys digital workspace integration
                    </li>
                  </ul>
                </div>
                <a
                  href="https://vylexnexys.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
                >
                  Contact Vylex Nexys
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 text-left">
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Beaker className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-xl text-white">VyLab</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                South Africa's premier CAPS-aligned virtual science laboratory. Learn Physics and Chemistry through interactive, frictionless simulations.
              </p>
            </div>

            {/* Column 2: EdTech Workspace */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">EdTech Workspace</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://vylexnexys.co.za"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white transition-colors font-medium"
                  >
                    Vylex Nexys
                  </a>
                </li>
                <li className="text-xs text-slate-500 leading-snug">
                  A unified digital environment engineered to streamline independent study, optimize academic research, and structure daily learning workflows.
                </li>
              </ul>
            </div>

            {/* Column 3: Parent Company */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Technology Partner</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://vylex.co.za"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white transition-colors font-medium"
                  >
                    Vylex
                  </a>
                </li>
                <li className="text-xs text-slate-500 leading-snug">
                  The parent technology company driving innovation, advanced engineering, and digital transformation.
                </li>
              </ul>
            </div>

            {/* Column 4: Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#curriculum" className="hover:text-white transition-colors">CAPS Curriculum</a></li>
                <li><Link to="/app" className="hover:text-white transition-colors font-medium text-blue-400">Launch Simulators</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} VyLab. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <span>Built by</span>
              <a href="https://vylexnexys.co.za" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-semibold">Vylex Nexys</a>
              <span>under</span>
              <a href="https://vylex.co.za" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-semibold">Vylex</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

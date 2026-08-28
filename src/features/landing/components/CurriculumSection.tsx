import React from 'react';
import { FlaskConical } from 'lucide-react';

export function CurriculumSection() {
  return (
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
                  <h4 className="font-extrabold text-slate-800 mb-1 flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-blue-600" /> Tech & Guided Practicals
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
                  <h4 className="font-extrabold text-slate-800 mb-1 flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-pink-600" /> Tech & Guided Practicals
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
                  <h4 className="font-extrabold text-slate-800 mb-1 flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-purple-600" /> Tech & Guided Practicals
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
  );
}


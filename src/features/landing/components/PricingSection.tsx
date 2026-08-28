import React from 'react';
import { Link } from 'react-router-dom';

export function PricingSection() {
  return (
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
  );
}

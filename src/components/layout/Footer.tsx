import React from 'react';
import { Link } from 'react-router-dom';
import { Beaker } from 'lucide-react';

export function Footer() {
  return (
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
                  className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <svg width="24" height="24" viewBox="0 0 100 100" className="flex-shrink-0">
                    <path fill="#FBA919" d="M20 10 L50 70 L80 10 L100 10 L50 100 L0 10 Z"/>
                    <rect fill="#FBA919" x="42" y="10" width="16" height="30"/>
                  </svg>
                  <span className="text-[20px] font-[800] tracking-[-1px] text-white">
                    vylex<span className="text-[#FBA919]">.</span>
                  </span>
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
  );
}

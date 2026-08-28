import React from 'react';
import { Link } from 'react-router-dom';
import { Beaker, ChevronRight } from 'lucide-react';

export function Header() {
  return (
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
  );
}

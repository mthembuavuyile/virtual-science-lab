import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Beaker, 
  LayoutDashboard, 
  Zap, 
  MessageSquare, 
  BookOpen,
  Menu,
  X,
  Activity,
  Scale,
  FlaskConical,
  Factory,
  Sprout,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chemExpanded, setChemExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const isChemRoute = location.pathname.startsWith('/app/chemistry');

  const chemUnits = [
    { name: 'All Units', path: '/app/chemistry', icon: Beaker },
    { name: 'Organic Compounds', path: '/app/chemistry/organic', icon: Beaker },
    { name: 'Reaction Rates', path: '/app/chemistry/rates', icon: Activity },
    { name: 'Equilibrium', path: '/app/chemistry/equilibrium', icon: Scale },
    { name: 'Acids & Bases', path: '/app/chemistry/acids-bases', icon: FlaskConical },
    { name: 'Electrochemistry', path: '/app/chemistry/electrochemistry', icon: Zap },
    { name: 'Chlor-Alkali', path: '/app/chemistry/chlor-alkali', icon: Factory },
    { name: 'Fertilisers', path: '/app/chemistry/fertilisers', icon: Sprout },
  ];

  const otherNav = [
    { name: 'Physics Lab', path: '/app/physics', icon: Zap },
    { name: 'AI Tutor', path: '/app/tutor', icon: MessageSquare },
    { name: 'My Notebook', path: '/app/notebook', icon: BookOpen },
  ];

  // Bottom bar items (mobile)
  const bottomNavItems = [
    { name: 'Home', path: '/app', icon: LayoutDashboard },
    { name: 'Chemistry', path: '/app/chemistry', icon: Beaker, matchPrefix: '/app/chemistry' },
    { name: 'Physics', path: '/app/physics', icon: Zap },
    { name: 'Tutor', path: '/app/tutor', icon: MessageSquare },
    { name: 'Notebook', path: '/app/notebook', icon: BookOpen },
  ];

  // Get page title from path
  const getPageTitle = () => {
    if (location.pathname === '/app') return 'Dashboard';
    const chemUnit = chemUnits.find(u => u.path === location.pathname);
    if (chemUnit) return chemUnit.name;
    const other = otherNav.find(u => u.path === location.pathname);
    if (other) return other.name;
    return location.pathname.split('/').pop() || 'Dashboard';
  };

  return (
    <div className="flex h-[100dvh] bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* ─── DESKTOP SIDEBAR (hidden on mobile) ─── */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="hidden lg:flex bg-white border-r border-slate-200 flex-col z-20 shrink-0"
      >
        <div className="h-14 flex items-center px-4 border-b border-slate-200 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Beaker className="text-white w-5 h-5" />
          </div>
          {sidebarOpen && (
            <span className="ml-3 font-bold text-lg tracking-tight whitespace-nowrap">VyLab</span>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          {/* Dashboard */}
          <NavLink
            to="/app"
            className={({ isActive }) => `
              flex items-center px-3 py-2.5 rounded-lg transition-all
              ${isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
            `}
            end
          >
            <LayoutDashboard className={`w-5 h-5 shrink-0 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
            {sidebarOpen && <span className="whitespace-nowrap text-sm">Dashboard</span>}
          </NavLink>

          {/* Chemistry Section */}
          {sidebarOpen ? (
            <>
              <button
                onClick={() => setChemExpanded(!chemExpanded)}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all w-full text-left mt-2 ${
                  isChemRoute ? 'bg-pink-50 text-pink-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Beaker className="w-5 h-5 shrink-0 mr-3" />
                <span className="whitespace-nowrap text-sm flex-1">Chemistry</span>
                {chemExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              <AnimatePresence>
                {chemExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 border-l-2 border-slate-100 pl-2 space-y-0.5">
                      {chemUnits.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={({ isActive }) => `
                            flex items-center px-3 py-2 rounded-lg transition-all text-sm
                            ${isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
                          `}
                          end
                        >
                          <item.icon className="w-4 h-4 shrink-0 mr-2.5" />
                          <span className="whitespace-nowrap text-[13px]">{item.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <NavLink
              to="/app/chemistry"
              className={({ isActive }) => `
                flex items-center px-3 py-2.5 rounded-lg transition-all mt-2
                ${isActive || isChemRoute ? 'bg-pink-50 text-pink-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'} 
              `}
            >
              <Beaker className="w-5 h-5 mx-auto" />
            </NavLink>
          )}

          <div className="h-px bg-slate-100 my-2" />

          {otherNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-3 py-2.5 rounded-lg transition-all
                ${isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
              `}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
              {sidebarOpen && <span className="whitespace-nowrap text-sm">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-12 lg:h-14 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 shrink-0 justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            {/* Mobile logo / back */}
            <div className="lg:hidden w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer" onClick={() => navigate('/')}>
              <Beaker className="text-white w-4 h-4" />
            </div>
            <h2 className="font-semibold text-sm lg:text-lg text-slate-800 truncate">
              {getPageTitle()}
            </h2>
          </div>
          <div className="flex items-center gap-2">
             <div className="text-[10px] lg:text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 lg:py-1 rounded-full border border-green-200">
                CAPS
             </div>
             <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-[10px] lg:text-xs">
                U
             </div>
          </div>
        </header>

        {/* Content area — bottom padding for mobile nav */}
        <div className="flex-1 overflow-auto bg-slate-50/50 p-3 lg:p-6 pb-20 lg:pb-6">
           <Outlet />
        </div>
      </main>

      {/* ─── MOBILE BOTTOM NAV (visible on mobile only) ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 safe-area-bottom">
        <div className="flex items-stretch h-14">
          {bottomNavItems.map((item) => {
            const isActive = item.matchPrefix 
              ? location.pathname.startsWith(item.matchPrefix)
              : location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
                end={!item.matchPrefix}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className={`text-[10px] font-semibold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

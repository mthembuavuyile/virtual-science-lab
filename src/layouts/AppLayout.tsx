import React, { useState, useMemo } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Beaker, 
  LayoutDashboard, 
  Zap, 
  MessageSquare, 
  BookOpen,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  FileText,
  Terminal,
  GraduationCap,
  FlaskConical,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { labRegistry } from '../data/experiments';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chemExpanded, setChemExpanded] = useState(true);
  const [physicsExpanded, setPhysicsExpanded] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLabRoute = location.pathname.startsWith('/app/labs');

  // Derive sidebar nav items from the lab registry
  const chemLabs = useMemo(() => labRegistry.filter(l => l.discipline === 'Chemistry'), []);
  const physicsLabs = useMemo(() => labRegistry.filter(l => l.discipline === 'Physics'), []);

  const otherNav = [
    { name: 'AI Tutor', path: '/app/tutor', icon: MessageSquare },
    { name: 'AI Sandbox', path: '/app/sandbox', icon: Terminal },
    { name: 'SBA Lab Guide', path: '/app/sba-guide', icon: FileText },
    { name: 'My Notebook', path: '/app/notebook', icon: BookOpen },
  ];

  // Bottom bar items (mobile)
  const bottomNavItems: Array<{ name: string; path: string; icon: any; matchPrefix?: string }> = [
    { name: 'Home', path: '/app', icon: LayoutDashboard },
    { name: 'Labs', path: '/app/labs', icon: GraduationCap, matchPrefix: '/app/labs' },
    { name: 'Tutor', path: '/app/tutor', icon: MessageSquare },
    { name: 'Notebook', path: '/app/notebook', icon: BookOpen },
  ];

  // Get page title from path
  const getPageTitle = () => {
    if (location.pathname === '/app') return 'Dashboard';
    if (location.pathname === '/app/labs') return 'Syllabus Hub';
    // Check if it's a specific lab
    const labMatch = location.pathname.match(/^\/app\/labs\/(.+)$/);
    if (labMatch) {
      const lab = labRegistry.find(l => l.id === labMatch[1]);
      if (lab) return lab.title;
    }
    const other = otherNav.find(u => u.path === location.pathname);
    if (other) return other.name;
    return location.pathname.split('/').pop() || 'Dashboard';
  };

  /** Renders a collapsible discipline section for the sidebar */
  function DisciplineSection({
    label,
    icon: SectionIcon,
    labs,
    expanded,
    onToggle,
    accentClass,
    isSidebarExpanded,
    onLinkClick,
    onCollapsedClick,
  }: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    labs: typeof chemLabs;
    expanded: boolean;
    onToggle: () => void;
    accentClass: string;
    isSidebarExpanded: boolean;
    onLinkClick?: () => void;
    onCollapsedClick?: () => void;
  }) {
    const isActive = labs.some(l => location.pathname === `/app/labs/${l.id}`);

    if (!isSidebarExpanded) {
      return (
        <button
          onClick={onCollapsedClick}
          title={label}
          className={`
            w-full flex items-center px-3 py-2.5 rounded-lg transition-all mt-1 cursor-pointer
            ${isActive ? accentClass : 'text-slate-600 hover:bg-slate-100'}
          `}
        >
          <SectionIcon className="w-5 h-5 mx-auto" />
        </button>
      );
    }

    return (
      <>
        <button
          onClick={onToggle}
          className={`flex items-center px-3 py-2.5 rounded-lg transition-all w-full text-left mt-1 ${
            isActive ? accentClass : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <SectionIcon className="w-5 h-5 shrink-0 mr-3" />
          <span className="whitespace-nowrap text-sm flex-1">{label}</span>
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="ml-4 border-l-2 border-slate-100 pl-2 space-y-0.5">
                {labs.map((lab) => (
                  <NavLink
                    key={lab.id}
                    to={`/app/labs/${lab.id}`}
                    onClick={onLinkClick}
                    className={({ isActive: linkActive }) => `
                      flex items-start px-3 py-2 rounded-lg transition-all text-sm
                      ${linkActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
                    `}
                    end
                  >
                    <lab.icon className="w-4 h-4 shrink-0 mr-2.5 mt-0.5" />
                    <span className="text-[13px] leading-tight break-words">{lab.title}</span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

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
            title={sidebarOpen ? undefined : "Dashboard"}
            className={({ isActive }) => `
              flex items-center px-3 py-2.5 rounded-lg transition-all
              ${isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
            `}
            end
          >
            <LayoutDashboard className={`w-5 h-5 shrink-0 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
            {sidebarOpen && <span className="whitespace-nowrap text-sm">Dashboard</span>}
          </NavLink>

          {/* Syllabus Hub */}
          <NavLink
            to="/app/labs"
            title={sidebarOpen ? undefined : "Syllabus Hub"}
            className={({ isActive }) => `
              flex items-center px-3 py-2.5 rounded-lg transition-all
              ${isActive && location.pathname === '/app/labs' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
            `}
            end
          >
            <GraduationCap className={`w-5 h-5 shrink-0 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
            {sidebarOpen && <span className="whitespace-nowrap text-sm">Syllabus Hub</span>}
          </NavLink>

          {/* Chemistry Section */}
          <DisciplineSection
            label="Chemistry"
            icon={FlaskConical}
            labs={chemLabs}
            expanded={chemExpanded}
            onToggle={() => setChemExpanded(!chemExpanded)}
            accentClass="bg-pink-50 text-pink-700 font-semibold"
            isSidebarExpanded={sidebarOpen}
            onCollapsedClick={() => {
              setSidebarOpen(true);
              setChemExpanded(true);
            }}
          />

          {/* Physics Section */}
          <DisciplineSection
            label="Physics"
            icon={Zap}
            labs={physicsLabs}
            expanded={physicsExpanded}
            onToggle={() => setPhysicsExpanded(!physicsExpanded)}
            accentClass="bg-blue-50 text-blue-700 font-semibold"
            isSidebarExpanded={sidebarOpen}
            onCollapsedClick={() => {
              setSidebarOpen(true);
              setPhysicsExpanded(true);
            }}
          />

          <div className="h-px bg-slate-100 my-2" />

          {otherNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={sidebarOpen ? undefined : item.name}
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
            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
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
            {/* Hamburger button on mobile */}
            <button 
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-1 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Mobile logo */}
            <div className="lg:hidden w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer" onClick={() => navigate('/app')}>
              <Beaker className="text-white w-4 h-4" />
            </div>
            <h2 className="font-semibold text-sm lg:text-lg text-slate-800 truncate">
              {getPageTitle()}
            </h2>
          </div>
          <div className="flex items-center gap-2.5">
             <div className="text-[10px] lg:text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 lg:py-1 rounded-full border border-green-200">
                CAPS
             </div>
             <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-full py-1 px-2.5 text-slate-700 text-[10px] lg:text-xs font-medium">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
               Guest Mode
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

      {/* ─── MOBILE SLIDE-OVER DRAWER (AnimatePresence) ─── */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 lg:hidden"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 flex flex-col z-50 lg:hidden shadow-2xl overflow-hidden"
            >
              <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200">
                <div className="flex items-center cursor-pointer" onClick={() => { navigate('/app'); setIsMobileDrawerOpen(false); }}>
                  <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Beaker className="text-white w-5 h-5" />
                  </div>
                  <span className="ml-3 font-bold text-lg tracking-tight whitespace-nowrap">VyLab</span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
                {/* Dashboard */}
                <NavLink
                  to="/app"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2.5 rounded-lg transition-all text-sm
                    ${isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                  `}
                  end
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0 mr-3" />
                  <span className="text-sm">Dashboard</span>
                </NavLink>

                {/* Syllabus Hub */}
                <NavLink
                  to="/app/labs"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2.5 rounded-lg transition-all text-sm
                    ${isActive && location.pathname === '/app/labs' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                  `}
                  end
                >
                  <GraduationCap className="w-5 h-5 shrink-0 mr-3" />
                  <span className="text-sm">Syllabus Hub</span>
                </NavLink>

                {/* Chemistry Section */}
                <DisciplineSection
                  label="Chemistry"
                  icon={FlaskConical}
                  labs={chemLabs}
                  expanded={chemExpanded}
                  onToggle={() => setChemExpanded(!chemExpanded)}
                  accentClass="bg-pink-50 text-pink-700 font-semibold"
                  isSidebarExpanded={true}
                  onLinkClick={() => setIsMobileDrawerOpen(false)}
                />

                {/* Physics Section */}
                <DisciplineSection
                  label="Physics"
                  icon={Zap}
                  labs={physicsLabs}
                  expanded={physicsExpanded}
                  onToggle={() => setPhysicsExpanded(!physicsExpanded)}
                  accentClass="bg-blue-50 text-blue-700 font-semibold"
                  isSidebarExpanded={true}
                  onLinkClick={() => setIsMobileDrawerOpen(false)}
                />

                <div className="h-px bg-slate-100 my-2" />

                {otherNav.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={({ isActive }) => `
                      flex items-center px-3 py-2.5 rounded-lg transition-all text-sm
                      ${isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                    `}
                  >
                    <item.icon className="w-5 h-5 shrink-0 mr-3" />
                    <span className="text-sm">{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

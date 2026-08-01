import React, { useState, useMemo, useEffect } from 'react';
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
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { labRegistry, LabEntry } from '../data/experiments';
import OfflineIndicator from '../components/pwa/OfflineIndicator';
import PWAInstallBanner from '../components/pwa/PWAInstallBanner';
import PWAUpdateToast from '../components/pwa/PWAUpdateToast';
import KeyboardShortcutsModal from '../components/pwa/KeyboardShortcutsModal';
import PWAStatsModal from '../components/pwa/PWAStatsModal';
import { useRouteMeta } from '../hooks/useRouteMeta';

export default function AppLayout() {
  useRouteMeta();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chemExpanded, setChemExpanded] = useState(true);
  const [physicsExpanded, setPhysicsExpanded] = useState(true);
  const [expandedGrades, setExpandedGrades] = useState<Record<string, boolean>>({
    'Chemistry-10': true,
    'Chemistry-11': true,
    'Chemistry-12': true,
    'Physics-10': true,
    'Physics-11': true,
    'Physics-12': true,
  });
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-expand discipline & grade based on active route
  useEffect(() => {
    const labMatch = location.pathname.match(/^\/app\/labs\/(.+)$/);
    if (labMatch) {
      const activeLab = labRegistry.find(l => l.id === labMatch[1]);
      if (activeLab) {
        if (activeLab.discipline === 'Chemistry') setChemExpanded(true);
        if (activeLab.discipline === 'Physics') setPhysicsExpanded(true);
        const gradeKey = `${activeLab.discipline}-${activeLab.grade}`;
        setExpandedGrades(prev => ({ ...prev, [gradeKey]: true }));
      }
    }
  }, [location.pathname]);

  const toggleGrade = (discipline: string, grade: number, e?: React.MouseEvent) => {
    const key = `${discipline}-${grade}`;
    setExpandedGrades(prev => ({ ...prev, [key]: !prev[key] }));
    if (e?.currentTarget) {
      const el = e.currentTarget as HTMLElement;
      setTimeout(() => {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }, 50);
    }
  };

  // Filtered labs by search query
  const filteredLabs = useMemo(() => {
    if (!searchQuery.trim()) return labRegistry;
    const q = searchQuery.toLowerCase();
    return labRegistry.filter(l => 
      l.title.toLowerCase().includes(q) || 
      l.discipline.toLowerCase().includes(q) ||
      l.unitTitle.toLowerCase().includes(q) ||
      `grade ${l.grade}`.includes(q)
    );
  }, [searchQuery]);

  const chemLabs = useMemo(() => filteredLabs.filter(l => l.discipline === 'Chemistry'), [filteredLabs]);
  const physicsLabs = useMemo(() => filteredLabs.filter(l => l.discipline === 'Physics'), [filteredLabs]);

  const chemLabsByGrade = useMemo(() => {
    return {
      10: chemLabs.filter(l => l.grade === 10),
      11: chemLabs.filter(l => l.grade === 11),
      12: chemLabs.filter(l => l.grade === 12),
    };
  }, [chemLabs]);

  const physicsLabsByGrade = useMemo(() => {
    return {
      10: physicsLabs.filter(l => l.grade === 10),
      11: physicsLabs.filter(l => l.grade === 11),
      12: physicsLabs.filter(l => l.grade === 12),
    };
  }, [physicsLabs]);

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
    const labMatch = location.pathname.match(/^\/app\/labs\/(.+)$/);
    if (labMatch) {
      const lab = labRegistry.find(l => l.id === labMatch[1]);
      if (lab) return lab.title;
    }
    const other = otherNav.find(u => u.path === location.pathname);
    if (other) return other.name;
    return location.pathname.split('/').pop() || 'Dashboard';
  };

  /** Renders a collapsible discipline section with collapsible grade sub-links */
  function DisciplineSection({
    label,
    icon: SectionIcon,
    labsByGrade,
    totalLabsCount,
    expanded,
    onToggle,
    accentClass,
    isSidebarExpanded,
    onLinkClick,
    onCollapsedClick,
  }: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    labsByGrade: Record<number, LabEntry[]>;
    totalLabsCount: number;
    expanded: boolean;
    onToggle: () => void;
    accentClass: string;
    isSidebarExpanded: boolean;
    onLinkClick?: () => void;
    onCollapsedClick?: () => void;
  }) {
    const allLabsInDiscipline = Object.values(labsByGrade).flat();
    const isActive = allLabsInDiscipline.some(l => location.pathname === `/app/labs/${l.id}`);

    if (!isSidebarExpanded) {
      return (
        <button
          onClick={onCollapsedClick}
          title={`${label} (${totalLabsCount} labs)`}
          className={`
            w-full flex items-center px-3 py-2.5 rounded-lg transition-all mt-1 cursor-pointer
            ${isActive ? accentClass : 'text-slate-600 hover:bg-slate-100'}
          `}
        >
          <SectionIcon className="w-5 h-5 mx-auto" />
        </button>
      );
    }

    const grades: Array<10 | 11 | 12> = [10, 11, 12];

    return (
      <div className="mt-1">
        {/* Main Discipline Header */}
        <button
          onClick={(e) => {
            onToggle();
            const el = e.currentTarget;
            setTimeout(() => {
              el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }, 50);
          }}
          className={`flex items-center px-3 py-2.5 rounded-lg transition-all w-full text-left font-medium cursor-pointer ${
            isActive ? accentClass : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <SectionIcon className="w-5 h-5 shrink-0 mr-3" />
          <span className="whitespace-nowrap text-sm flex-1 font-semibold">{label}</span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 mr-2">
            {totalLabsCount}
          </span>
          {expanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Collapsible Discipline Content (Grade Sub-links) */}
        <AnimatePresence initial={false}>
          {(expanded || searchQuery.trim() !== '') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-3 pl-2.5 border-l-2 border-slate-200/80 space-y-1 mt-1">
                {grades.map((grade) => {
                  const labs = labsByGrade[grade] || [];
                  if (labs.length === 0 && searchQuery.trim()) return null;

                  const gradeKey = `${label}-${grade}`;
                  const isGradeExpanded = searchQuery.trim() !== '' || !!expandedGrades[gradeKey];
                  const isGradeActive = labs.some(l => location.pathname === `/app/labs/${l.id}`);

                  return (
                    <div key={grade} className="rounded-lg">
                      {/* Sub-link Grade Accordion Toggle */}
                      <button
                        onClick={(e) => toggleGrade(label, grade, e)}
                        className={`flex items-center w-full px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                          isGradeActive
                            ? 'text-blue-700 bg-blue-50/70'
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        <span className="flex-1 text-left">Grade {grade}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 mr-1.5">
                          {labs.length}
                        </span>
                        {isGradeExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>

                      {/* Sub-link Lab List */}
                      <AnimatePresence initial={false}>
                        {isGradeExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-2 pl-2 border-l border-slate-200/60 space-y-0.5 my-1">
                              {labs.map((lab) => (
                                <NavLink
                                  key={lab.id}
                                  to={`/app/labs/${lab.id}`}
                                  onClick={onLinkClick}
                                  className={({ isActive: linkActive }) => `
                                    flex items-start px-2.5 py-1.5 rounded-md transition-all text-xs group
                                    ${linkActive 
                                      ? 'bg-blue-600 text-white font-medium shadow-xs' 
                                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }
                                  `}
                                  end
                                >
                                  <lab.icon className="w-3.5 h-3.5 shrink-0 mr-2 mt-0.5 opacity-80 group-hover:opacity-100" />
                                  <span className="leading-snug break-words flex-1 text-[12px]">
                                    {lab.title}
                                  </span>
                                </NavLink>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* ─── DESKTOP SIDEBAR (hidden on mobile) ─── */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden lg:flex bg-white border-r border-slate-200 flex-col z-20 shrink-0"
      >
        <div className="h-14 flex items-center px-4 border-b border-slate-200 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <Beaker className="text-white w-5 h-5" />
          </div>
          {sidebarOpen && (
            <span className="ml-3 font-bold text-lg tracking-tight whitespace-nowrap text-slate-900">VyLab</span>
          )}
        </div>

        {sidebarOpen && (
          <div className="px-3 pt-3 pb-1 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search labs..."
                className="w-full bg-slate-100 text-slate-800 placeholder-slate-400 text-xs rounded-lg pl-9 pr-8 py-2 border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        <nav className="flex-1 py-3 px-3 flex flex-col gap-1 overflow-y-auto overscroll-contain">
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
            {sidebarOpen && <span className="whitespace-nowrap text-sm font-medium">Dashboard</span>}
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
            {sidebarOpen && <span className="whitespace-nowrap text-sm font-medium">Syllabus Hub</span>}
          </NavLink>

          {/* Chemistry Section */}
          <DisciplineSection
            label="Chemistry"
            icon={FlaskConical}
            labsByGrade={chemLabsByGrade}
            totalLabsCount={chemLabs.length}
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
            labsByGrade={physicsLabsByGrade}
            totalLabsCount={physicsLabs.length}
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
              {sidebarOpen && <span className="whitespace-nowrap text-sm font-medium">{item.name}</span>}
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
        <header className="h-12 lg:h-14 bg-white border-b border-slate-200 flex items-center px-3 lg:px-6 shrink-0 justify-between shadow-sm z-10 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Hamburger button on mobile */}
            <button 
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Mobile logo */}
            <div className="lg:hidden w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer shadow-xs shrink-0" onClick={() => navigate('/app')}>
              <Beaker className="text-white w-4 h-4" />
            </div>
            <h2 className="font-semibold text-xs sm:text-sm lg:text-lg text-slate-800 truncate min-w-0">
              {getPageTitle()}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <OfflineIndicator />
            <KeyboardShortcutsModal />
            <PWAStatsModal />
            <div className="hidden sm:block text-[9px] sm:text-[10px] lg:text-xs font-bold bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 rounded-full border border-green-200 shrink-0 whitespace-nowrap">
              CAPS
            </div>
          </div>
        </header>

        <PWAUpdateToast />
        <PWAInstallBanner />

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
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white border-r border-slate-200 flex flex-col z-50 lg:hidden shadow-2xl h-[100dvh] overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 shrink-0">
                <div className="flex items-center cursor-pointer" onClick={() => { navigate('/app'); setIsMobileDrawerOpen(false); }}>
                  <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <Beaker className="text-white w-5 h-5" />
                  </div>
                  <span className="ml-3 font-bold text-lg tracking-tight whitespace-nowrap text-slate-900">VyLab</span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Input */}
              <div className="px-3 pt-3 pb-1 shrink-0">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search labs & topics..."
                    className="w-full bg-slate-100 text-slate-800 placeholder-slate-400 text-xs rounded-lg pl-9 pr-8 py-2 border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Navigation Area */}
              <nav className="flex-1 py-3 px-3 flex flex-col gap-1 overflow-y-auto overscroll-contain touch-pan-y pb-24 [webkit-overflow-scrolling:touch]">
                {/* Dashboard */}
                <NavLink
                  to="/app"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2.5 rounded-lg transition-all text-sm font-medium
                    ${isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}
                  `}
                  end
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0 mr-3 text-slate-500" />
                  <span className="text-sm">Dashboard</span>
                </NavLink>

                {/* Syllabus Hub */}
                <NavLink
                  to="/app/labs"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2.5 rounded-lg transition-all text-sm font-medium
                    ${isActive && location.pathname === '/app/labs' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}
                  `}
                  end
                >
                  <GraduationCap className="w-5 h-5 shrink-0 mr-3 text-slate-500" />
                  <span className="text-sm">Syllabus Hub</span>
                </NavLink>

                <div className="h-px bg-slate-100 my-1.5" />

                {/* Quick Expand / Collapse controls */}
                <div className="flex items-center justify-between px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  <span>CAPS Lab Curriculum</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setChemExpanded(true);
                        setPhysicsExpanded(true);
                        setExpandedGrades({
                          'Chemistry-10': true, 'Chemistry-11': true, 'Chemistry-12': true,
                          'Physics-10': true, 'Physics-11': true, 'Physics-12': true,
                        });
                      }}
                      className="hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      Expand All
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => {
                        setChemExpanded(false);
                        setPhysicsExpanded(false);
                        setExpandedGrades({});
                      }}
                      className="hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>

                {/* Chemistry Section */}
                <DisciplineSection
                  label="Chemistry"
                  icon={FlaskConical}
                  labsByGrade={chemLabsByGrade}
                  totalLabsCount={chemLabs.length}
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
                  labsByGrade={physicsLabsByGrade}
                  totalLabsCount={physicsLabs.length}
                  expanded={physicsExpanded}
                  onToggle={() => setPhysicsExpanded(!physicsExpanded)}
                  accentClass="bg-blue-50 text-blue-700 font-semibold"
                  isSidebarExpanded={true}
                  onLinkClick={() => setIsMobileDrawerOpen(false)}
                />

                <div className="h-px bg-slate-100 my-2" />

                <div className="px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Study Tools
                </div>

                {otherNav.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={({ isActive }) => `
                      flex items-center px-3 py-2.5 rounded-lg transition-all text-sm font-medium
                      ${isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}
                    `}
                  >
                    <item.icon className="w-5 h-5 shrink-0 mr-3 text-slate-500" />
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

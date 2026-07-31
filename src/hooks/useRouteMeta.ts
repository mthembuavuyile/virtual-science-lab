import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { labRegistry } from '../data/experiments';

export function useRouteMeta() {
  const location = useLocation();

  useEffect(() => {
    let title = 'VyLab | CAPS-Aligned Virtual Science Lab';
    let description = 'Interactive CAPS-aligned chemistry and physics virtual laboratory for South African High Schools.';

    if (location.pathname === '/app') {
      title = 'Dashboard | VyLab Virtual Science Lab';
      description = 'Access your science lab progress, recent experiments, and CAPS curriculum shortcuts.';
    } else if (location.pathname === '/app/labs') {
      title = 'Syllabus Hub | CAPS Science Experiments | VyLab';
      description = 'Explore all Grade 10-12 Chemistry and Physics experiments aligned with the South African CAPS curriculum.';
    } else if (location.pathname.startsWith('/app/labs/')) {
      const labId = location.pathname.replace('/app/labs/', '');
      const lab = labRegistry.find((l) => l.id === labId);
      if (lab) {
        title = `${lab.title} (Grade ${lab.grade} ${lab.discipline}) | VyLab`;
        description = `${lab.unitTitle} — Interactive virtual simulation for ${lab.title} in Grade ${lab.grade} ${lab.discipline}.`;
      }
    } else if (location.pathname === '/app/tutor') {
      title = 'AI Science Tutor | VyLab Assistant';
      description = 'Ask AI lab assistant for assistance with chemistry equations, physics problem solving, and SBA lab reports.';
    } else if (location.pathname === '/app/notebook') {
      title = 'My Lab Notebook | VyLab';
      description = 'Your offline stored experiment notes, observations, graphs, and SBA lab summaries.';
    } else if (location.pathname === '/app/sandbox') {
      title = 'AI Science Sandbox | VyLab';
      description = 'Experiment with custom science equations and interactive canvas visualizers.';
    } else if (location.pathname === '/app/sba-guide') {
      title = 'SBA Lab Practical Guide | VyLab';
      description = 'Complete guide for Grade 10-12 Physical Sciences School-Based Assessment (SBA) lab practicals.';
    }

    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [location.pathname]);
}

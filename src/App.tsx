import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/DashboardPage';
import SyllabusHub from './pages/SyllabusHub';
import LabLoader from './pages/LabLoader';
import TutorPage from './pages/TutorPage';
import NotebookPage from './pages/NotebookPage';
import SbaGuidePage from './pages/SbaGuidePage';
import SandboxPage from './pages/SandboxPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />

          {/* ── Unified Lab System ── */}
          <Route path="labs" element={<SyllabusHub />} />
          <Route path="labs/:labId" element={<LabLoader />} />

          {/* ── Backward-compatible redirects ── */}
          {/* Chemistry hub → Syllabus Hub */}
          <Route path="chemistry" element={<Navigate to="/app/labs" replace />} />
          <Route path="chemistry/organic" element={<Navigate to="/app/labs/organic" replace />} />
          <Route path="chemistry/rates" element={<Navigate to="/app/labs/rates" replace />} />
          <Route path="chemistry/equilibrium" element={<Navigate to="/app/labs/equilibrium" replace />} />
          <Route path="chemistry/acids-bases" element={<Navigate to="/app/labs/acids-bases" replace />} />
          <Route path="chemistry/electrochemistry" element={<Navigate to="/app/labs/electrochemistry" replace />} />
          <Route path="chemistry/chlor-alkali" element={<Navigate to="/app/labs/chlor-alkali" replace />} />
          <Route path="chemistry/fertilisers" element={<Navigate to="/app/labs/fertilisers" replace />} />
          {/* Physics → individual labs */}
          <Route path="physics" element={<Navigate to="/app/labs" replace />} />

          {/* ── Other Sections (unchanged) ── */}
          <Route path="tutor" element={<TutorPage />} />
          <Route path="sandbox" element={<SandboxPage />} />
          <Route path="sba-guide" element={<SbaGuidePage />} />
          <Route path="notebook" element={<NotebookPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ChemistryHub from './pages/ChemistryHub';
import PhysicsLab from './pages/PhysicsLab';
import TutorPage from './pages/TutorPage';
import NotebookPage from './pages/NotebookPage';

// Unit-specific lab pages
import AcidsBasesPage from './pages/AcidsBasesPage';
import ElectrochemistryPage from './pages/ElectrochemistryPage';
import OrganicCompoundsLab from './components/simulations/OrganicCompoundsLab';
import ReactionRateLab from './components/simulations/ReactionRateLab';
import EquilibriumLab from './components/simulations/EquilibriumLab';
import ChlorAlkaliLab from './components/simulations/ChlorAlkaliLab';
import FertiliserLab from './components/simulations/FertiliserLab';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />

          {/* Chemistry Hub + Unit Routes */}
          <Route path="chemistry" element={<ChemistryHub />} />
          <Route path="chemistry/organic" element={<OrganicCompoundsLab />} />
          <Route path="chemistry/rates" element={<ReactionRateLab />} />
          <Route path="chemistry/equilibrium" element={<EquilibriumLab />} />
          <Route path="chemistry/acids-bases" element={<AcidsBasesPage />} />
          <Route path="chemistry/electrochemistry" element={<ElectrochemistryPage />} />
          <Route path="chemistry/chlor-alkali" element={<ChlorAlkaliLab />} />
          <Route path="chemistry/fertilisers" element={<FertiliserLab />} />

          {/* Other Sections */}
          <Route path="physics" element={<PhysicsLab />} />
          <Route path="tutor" element={<TutorPage />} />
          <Route path="notebook" element={<NotebookPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

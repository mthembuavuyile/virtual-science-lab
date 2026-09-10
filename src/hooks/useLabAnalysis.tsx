/**
 * LabAnalysisContext
 *
 * Allows individual lab simulations to "claim" the AI Analysis panel slot.
 * When a lab renders its own <AnalyzeExperimentPanel> with live simulation state,
 * it registers itself here so that LabLoader's universal fallback panel is suppressed
 * — preventing a duplicate floating button.
 *
 * Usage in a lab component:
 *   const { claimPanel } = useLabAnalysis();
 *   useEffect(() => claimPanel(), []);
 *
 * LabLoader checks `isPanelClaimed` before rendering the universal panel.
 */
import React, { createContext, useContext, useState, useCallback } from 'react';

interface LabAnalysisContextValue {
  /** True if the current lab has registered its own AnalyzeExperimentPanel */
  isPanelClaimed: boolean;
  /** Call this (ideally in a useEffect) to suppress the LabLoader fallback panel */
  claimPanel: () => void;
  /** Reset — called by LabLoader on each route change */
  resetClaim: () => void;
}

const LabAnalysisContext = createContext<LabAnalysisContextValue>({
  isPanelClaimed: false,
  claimPanel: () => {},
  resetClaim: () => {},
});

export function LabAnalysisProvider({ children }: { children: React.ReactNode }) {
  const [isPanelClaimed, setIsPanelClaimed] = useState(false);
  const claimPanel = useCallback(() => setIsPanelClaimed(true), []);
  const resetClaim = useCallback(() => setIsPanelClaimed(false), []);
  return (
    <LabAnalysisContext.Provider value={{ isPanelClaimed, claimPanel, resetClaim }}>
      {children}
    </LabAnalysisContext.Provider>
  );
}

export function useLabAnalysis() {
  return useContext(LabAnalysisContext);
}

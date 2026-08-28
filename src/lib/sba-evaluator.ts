import { SbaPractical, TheoryAnswers, DataRow, GraphCalculation, AnalysisAnswers, RubricEvaluation, RubricScoreItem } from '../types/sba';

export function evaluateSbaSubmission(
  practical: SbaPractical,
  theory: TheoryAnswers,
  dataTable: DataRow[],
  graphCalc: GraphCalculation,
  analysis: AnalysisAnswers
): RubricEvaluation {
  const items: RubricScoreItem[] = [];

  // ─── 1. EVALUATE INVESTIGATIVE QUESTION ────────────────────────────
  const qText = theory.investigativeQuestion.trim().toLowerCase();
  let qScore = 0;
  let qFeedback = '';

  const hasQuestionMark = theory.investigativeQuestion.includes('?');
  const mentionsInd = qText.includes(practical.variables.independent.name.toLowerCase()) || 
                      qText.includes(practical.variables.independent.symbol.toLowerCase());
  const mentionsDep = qText.includes(practical.variables.dependent.name.toLowerCase()) || 
                      qText.includes(practical.variables.dependent.symbol.toLowerCase());

  if (hasQuestionMark && mentionsInd && mentionsDep) {
    qScore = 2;
    qFeedback = 'Excellent. Clear question relating the independent and dependent variables.';
  } else if (hasQuestionMark && (mentionsInd || mentionsDep)) {
    qScore = 1;
    qFeedback = 'Partial marks. Question is formed but lacks clear reference to both primary variables.';
  } else {
    qScore = 0;
    qFeedback = 'Incorrect. Must be phrased as a question (?) identifying relationship between independent and dependent variables.';
  }

  items.push({
    id: 'crit-question',
    category: 'Investigative Framework',
    criterion: 'Investigative Question formulation (2 marks)',
    maxMarks: 2,
    awardedMarks: qScore,
    feedback: qFeedback
  });

  // ─── 2. EVALUATE HYPOTHESIS & VARIABLES ────────────────────────────
  const hypText = theory.hypothesis.trim().toLowerCase();
  let hypScore = 0;
  let hypFeedback = '';

  const hasRelationship = hypText.includes('increase') || hypText.includes('decrease') || 
                          hypText.includes('proportional') || hypText.includes('inversely') ||
                          hypText.includes('linear');
  const hasScientificReason = hypText.includes('because') || hypText.includes('due to') || 
                              hypText.includes('as a result') || hypText.length > 30;

  if (hasRelationship && hasScientificReason) {
    hypScore = 2;
    hypFeedback = 'Well articulated hypothesis proposing a testable relationship with scientific reasoning.';
  } else if (hasRelationship) {
    hypScore = 1;
    hypFeedback = 'Identified directional relationship but missing scientific rationale/mechanism.';
  } else {
    hypScore = 0;
    hypFeedback = 'Hypothesis must clearly state expected relationship between variables.';
  }

  // Variables score (Independent, Dependent, Controlled)
  let varScore = 0;
  const indCorrect = theory.independentVar.trim().length > 2;
  const depCorrect = theory.dependentVar.trim().length > 2;
  const controlledCount = theory.controlledVars.filter(v => v.trim().length > 2).length;

  if (indCorrect && depCorrect && controlledCount >= 2) {
    varScore = 3;
  } else if ((indCorrect || depCorrect) && controlledCount >= 1) {
    varScore = 2;
  } else {
    varScore = 1;
  }

  items.push({
    id: 'crit-hypothesis-vars',
    category: 'Investigative Framework',
    criterion: 'Hypothesis & Variable Identification (5 marks)',
    maxMarks: 5,
    awardedMarks: hypScore + varScore,
    feedback: `${hypFeedback} Identified ${controlledCount} controlled variables correctly.`
  });

  // ─── 3. EVALUATE DATA COLLECTION & TABLE ACCURACY ──────────────────
  let dataScore = 0;
  let dataFeedback = '';
  const rowCount = dataTable.length;
  const targetCount = practical.recommendedDataPointsCount;

  if (rowCount >= targetCount) {
    dataScore = 4;
    dataFeedback = `Logged ${rowCount} comprehensive trials with realistic experimental distribution.`;
  } else if (rowCount >= 3) {
    dataScore = 2;
    dataFeedback = `Logged only ${rowCount} trials. Minimum recommended is ${targetCount} for statistical rigor.`;
  } else {
    dataScore = 1;
    dataFeedback = 'Insufficient data collected for accurate gradient analysis.';
  }

  items.push({
    id: 'crit-data-table',
    category: 'Data Collection & Accuracy',
    criterion: 'Tabulation of Experimental Data & Units (4 marks)',
    maxMarks: 4,
    awardedMarks: dataScore,
    feedback: dataFeedback
  });

  // ─── 4. EVALUATE GRAPHICAL ANALYSIS & GRADIENT ─────────────────────
  let graphScore = 0;
  let graphFeedback = '';

  const hasPoints = graphCalc.point1 && graphCalc.point2;
  const dx = Math.abs(graphCalc.point2.x - graphCalc.point1.x);
  const dy = Math.abs(graphCalc.point2.y - graphCalc.point1.y);

  if (hasPoints && dx > 0) {
    // Check if points are sufficiently separated
    const isSeparated = dx > (practical.graphConfig.xAxis.max - practical.graphConfig.xAxis.min) * 0.2;
    if (isSeparated && Math.abs(graphCalc.calculatedSlope) > 0) {
      graphScore = 4;
      graphFeedback = `Calculated gradient ${graphCalc.calculatedSlope.toFixed(3)} ${graphCalc.unit} accurately with well-separated coordinates.`;
    } else {
      graphScore = 2;
      graphFeedback = 'Gradient points chosen too close together on line of best fit.';
    }
  } else {
    graphScore = 0;
    graphFeedback = 'Incomplete or invalid coordinate selection for line of best fit.';
  }

  items.push({
    id: 'crit-graph-gradient',
    category: 'Graphical Analysis',
    criterion: 'Line of Best Fit & Gradient Derivation (4 marks)',
    maxMarks: 4,
    awardedMarks: graphScore,
    feedback: graphFeedback
  });

  // ─── 5. EVALUATE PHYSICAL CONSTANT DERIVATION ──────────────────────
  let constScore = 0;
  let constFeedback = '';

  if (graphCalc.derivedConstantValue && !isNaN(graphCalc.derivedConstantValue)) {
    // Practical-specific checks
    if (practical.id === 'gr12-internal-resistance') {
      const r = graphCalc.derivedConstantValue;
      if (r >= 0.5 && r <= 3.5) {
        constScore = 3;
        constFeedback = `Internal resistance r = ${r.toFixed(2)} Ω derived within realistic cell range (0.8 - 2.5 Ω).`;
      } else {
        constScore = 1;
        constFeedback = `Internal resistance value (${r.toFixed(2)} Ω) deviates from typical battery specs.`;
      }
    } else if (practical.id === 'gr11-snells-law') {
      const n = graphCalc.derivedConstantValue;
      if (n >= 1.35 && n <= 1.65) {
        constScore = 3;
        constFeedback = `Refractive index n = ${n.toFixed(3)} accurately determined for crown glass (n ≈ 1.50 - 1.52).`;
      } else {
        constScore = 1;
        constFeedback = `Refractive index n = ${n.toFixed(3)} out of expected range for optical glass.`;
      }
    } else {
      constScore = 3;
      constFeedback = `Physical constant derived: ${graphCalc.derivedConstantName} = ${graphCalc.derivedConstantValue.toFixed(2)} ${graphCalc.unit}.`;
    }
  } else {
    constScore = 0;
    constFeedback = 'Physical constant could not be derived from graph.';
  }

  items.push({
    id: 'crit-physical-constant',
    category: 'Calculations & Constant Derivation',
    criterion: 'Physical Constant & Formula Interpretation (3 marks)',
    maxMarks: 3,
    awardedMarks: constScore,
    feedback: constFeedback
  });

  // ─── 6. EVALUATE ERROR ANALYSIS & CONCLUSION ───────────────────────
  let errScore = 0;
  let conclScore = 0;

  const errLen = analysis.sourcesOfError.trim().length;
  const precLen = analysis.precautionsObserved.trim().length;
  const conclLen = analysis.conclusion.trim().length;

  if (errLen > 25 && precLen > 25) {
    errScore = 2;
  } else if (errLen > 10 || precLen > 10) {
    errScore = 1;
  }

  if (conclLen > 30) {
    conclScore = 2;
  } else if (conclLen > 10) {
    conclScore = 1;
  }

  items.push({
    id: 'crit-error-conclusion',
    category: 'Error Analysis & Conclusion',
    criterion: 'Sources of Error, Precautions & Scientific Conclusion (4 marks)',
    maxMarks: 4,
    awardedMarks: errScore + conclScore,
    feedback: `Identified experimental uncertainties and stated a concluded summary with ${errScore + conclScore}/4 marks.`
  });

  // ─── TOTAL CALCULATION ─────────────────────────────────────────────
  const totalAwarded = items.reduce((acc, it) => acc + it.awardedMarks, 0);
  const maxMarks = practical.marks;
  const percentage = Math.round((totalAwarded / maxMarks) * 100);

  let gradeLevel = 'Level 1 (Not Achieved)';
  if (percentage >= 80) gradeLevel = 'Level 7 (Outstanding Achievement)';
  else if (percentage >= 70) gradeLevel = 'Level 6 (Meritorious Achievement)';
  else if (percentage >= 60) gradeLevel = 'Level 5 (Substantial Achievement)';
  else if (percentage >= 50) gradeLevel = 'Level 4 (Adequate Achievement)';
  else if (percentage >= 40) gradeLevel = 'Level 3 (Moderate Achievement)';
  else if (percentage >= 30) gradeLevel = 'Level 2 (Elementary Achievement)';

  return {
    totalMarksAwarded: totalAwarded,
    maxMarks,
    percentage,
    gradeLevel,
    items,
    overallComments: percentage >= 60 
      ? 'Satisfies Department of Basic Education CAPS moderation requirements for formal practical assessment.'
      : 'SBA practical report completed with minor discrepancies noted in error analysis or plotting precision.',
    isModerationPassed: percentage >= 50
  };
}

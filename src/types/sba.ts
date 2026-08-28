export type Discipline = 'Physics' | 'Chemistry';

export type SbaPracticalId = 
  | 'gr12-internal-resistance'
  | 'gr12-titration'
  | 'gr12-reaction-rates'
  | 'gr11-snells-law'
  | 'gr11-boyles-law'
  | 'gr11-newton2'
  | 'gr10-heating-curves'
  | 'gr10-circuits'
  | 'gr11-imf'
  | 'gr12-momentum'
  | 'gr12-work-energy'
  | 'gr12-esters';

export interface VariableDefinition {
  name: string;
  symbol: string;
  unit: string;
  description: string;
}

export interface RubricCriterion {
  id: string;
  category: 'Investigative Framework' | 'Data Collection & Accuracy' | 'Graphical Analysis' | 'Calculations & Constant Derivation' | 'Error Analysis & Conclusion';
  criterion: string;
  maxMarks: number;
  expectedPattern?: string | RegExp;
  tolerancePercent?: number;
}

export interface DataColumnDef {
  key: string;
  label: string;
  symbol: string;
  unit: string;
  isCalculated?: boolean;
  formulaDescription?: string;
  decimalPlaces?: number;
}

export interface GraphConfig {
  xAxis: {
    key: string;
    label: string;
    symbol: string;
    unit: string;
    min: number;
    max: number;
    step: number;
  };
  yAxis: {
    key: string;
    label: string;
    symbol: string;
    unit: string;
    min: number;
    max: number;
    step: number;
  };
  expectedSlopeName: string;
  expectedSlopeUnit: string;
  expectedSlopeSign: 'positive' | 'negative';
  physicalMeaningOfSlope: string;
  physicalMeaningOfIntercept: string;
  expectedInterceptKey?: string;
}

export interface ApparatusControl {
  id: string;
  label: string;
  type: 'slider' | 'switch' | 'select' | 'button';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | string | boolean;
  unit?: string;
  options?: Array<{ label: string; value: string | number }>;
}

export interface SbaPractical {
  id: SbaPracticalId;
  title: string;
  shortTitle: string;
  discipline: Discipline;
  grade: 10 | 11 | 12;
  term: 1 | 2 | 3 | 4;
  capsTaskNumber: string;
  capsCode: string;
  marks: number;
  durationMinutes: number;
  isFree: boolean;
  badge: string;
  description: string;
  aim: string;
  investigativeQuestionPrompt: string;
  expectedInvestigativeQuestion: string;
  expectedHypothesisPattern: string;
  variables: {
    independent: VariableDefinition;
    dependent: VariableDefinition;
    controlled: VariableDefinition[];
  };
  apparatusDescription: string[];
  controls: ApparatusControl[];
  dataColumns: DataColumnDef[];
  recommendedDataPointsCount: number;
  graphConfig: GraphConfig;
  precautions: string[];
  commonErrors: string[];
  rubric: RubricCriterion[];
}

export interface StudentInfo {
  fullName: string;
  idOrSacaiNumber: string;
  schoolOrCenter: string;
  grade: number;
  assessmentDate: string;
}

export interface TheoryAnswers {
  investigativeQuestion: string;
  hypothesis: string;
  independentVar: string;
  dependentVar: string;
  controlledVars: string[];
}

export interface DataRow {
  id: string;
  [key: string]: number | string;
}

export interface GraphCalculation {
  point1: { x: number; y: number };
  point2: { x: number; y: number };
  calculatedSlope: number;
  calculatedIntercept: number;
  derivedConstantName: string;
  derivedConstantValue: number;
  unit: string;
}

export interface AnalysisAnswers {
  sourcesOfError: string;
  precautionsObserved: string;
  conclusion: string;
  evaluationQuestions?: Record<string, string>;
}

export interface RubricScoreItem {
  id: string;
  category: string;
  criterion: string;
  maxMarks: number;
  awardedMarks: number;
  feedback: string;
}

export interface RubricEvaluation {
  totalMarksAwarded: number;
  maxMarks: number;
  percentage: number;
  gradeLevel: string;
  items: RubricScoreItem[];
  overallComments: string;
  isModerationPassed: boolean;
}

export interface SbaSubmission {
  id: string;
  practicalId: SbaPracticalId;
  studentInfo: StudentInfo;
  theory: TheoryAnswers;
  dataTable: DataRow[];
  graphCalc: GraphCalculation;
  analysis: AnalysisAnswers;
  evaluation: RubricEvaluation;
  completedAt: string;
  verificationHash: string;
}

export interface AnalysisResult {
  headline: string;
  source: string;
  date: string;
  regionTag: "Local" | "Regional" | "Global";
  priorityLevel: "Critical" | "Important" | "Monitor";
  isHighImpact: boolean;
  sectors: string[];
  executiveSummary: string[];
  coreInterpretation: {
    whatIsHappening: string;
    whyItMatters: string;
    hiddenSignals: string;
  };
  impactMatrix: {
    economic: ImpactDetail;
    financial: ImpactDetail;
    government: ImpactDetail;
    business: ImpactDetail;
    social: ImpactDetail;
  };
  impactScores: {
    economic: number;
    financial: number;
    government: number;
    business: number;
    social: number;
  };
  risksAndOpportunities: {
    risks: string[];
    opportunities: string[];
  };
  forwardOutlook: {
    shortTerm: string;
    midTerm: string;
    mostLikelyScenario: string;
  };
  strategicRecommendations: {
    immediateActions: string[];
    monitorClosely: string[];
    strategicAdjustments: string[];
  };
  signalVisualization: string[];
  ultraAdvanced: {
    specializedCritics: {
      industry: string;
      criticism: string;
      solutionFocus: string;
    }[];
    economicAnalysis: {
      macroeconomic: string;
      mesoeconomic: string;
      microeconomic: string;
    };
    growthStrategies: {
      redOcean: string;
      blueOcean: string;
      historicalPractices: string;
      novelStrategicPlan: string;
    };
  };
}

export interface ImpactDetail {
  direction: "↑" | "↓" | "→";
  explanation: string;
}

export interface CompanyProfile {
  industry: string;
  companyName: string;
  companySize: string;
  annualRevenue: string;
  annualExpenses: string;
}

export interface CustomActionPlan {
  executiveSummary: string;
  immediateTactics: string[];
  resourceAllocation: string;
  growthStrategy: string;
  riskMitigation: string;
}


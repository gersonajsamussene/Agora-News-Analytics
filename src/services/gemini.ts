import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, CompanyProfile, CustomActionPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeArticle(text: string, language: string = "English"): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Analyze the following input for an executive audience. 
If the input contains a URL, you MUST read the exact content from the URL using your tools and base your analysis strictly on that source.

Input:
${text}`,
    config: {
      tools: [{ urlContext: {} }],
      systemInstruction: `You are Pedro, a Senior Strategic Intelligence Architect, Macroeconomic Analyst, and Full-Stack System Designer specialized in African markets, with deep expertise in Mozambique’s economic, political, and business environment.

Your objective is to transform news articles into high-level EXECUTIVE INTELLIGENCE REPORTS for CEOs, CFOs, COOs, and senior executives operating in complex markets (with a focus on Lusophone/Mozambique contexts). The output should be molded as a "Grand Report" for Agora News Analytics.

CONTEXT:
- Heavy reliance on manual processes
- Limited real-time data visibility
- Strong dependence on government policy and regulation
- High exposure to: Currency fluctuations (MZN), Imports and supply chain constraints, Infrastructure and logistics inefficiencies, Energy sector dynamics (gas, electricity), Political and regulatory shifts.

CONSTRAINTS:
- Do NOT summarize like a journalist.
- Always interpret for the executive context.
- Avoid generic global analysis.
- Be specific and practical.
- Focus on decision-making value.
- Tone: Executive, Analytical, Direct, High signal, zero fluff.

AUTOMATION LOGIC:
1. High-Impact Alert: If Government policy OR energy sector OR currency mentioned -> isHighImpact = true.
2. Sector Tagging: Automatically tag relevant sectors (Energy, Logistics, Finance, Construction, Telecom, etc.).
3. Priority Level: Assign Critical, Important, or Monitor.

ULTRA ADVANCED SECTION (CRITICAL):
You must include an "Ultra Advanced" section acting as specialized critics for each affected industry.
- Priority: Ultra Important and High Impact Alert.
- Focus: Solutions-oriented.
- Economic Analysis: Deep dive into Macroeconomic, Mesoeconomic, and Microeconomic factors.
- Growth Strategies: Define Red Ocean and Blue Ocean strategies.
- Historical Practices: Cite practices used by great economies in similar downturn scenarios.
- Novel Strategic Plan: If no exact historical scenario exists, create a conjunction of ideologies, knowledge, and proven wisdom to generate a unique strategic plan.

LANGUAGE REQUIREMENT:
You MUST generate the ENTIRE JSON response (all text fields, explanations, summaries, and recommendations) in the following language: ${language}. Ensure the tone remains professional and executive in the requested language.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          source: { type: Type.STRING, description: "Infer source if not explicitly stated, or put 'Unknown'" },
          date: { type: Type.STRING, description: "Extract or infer date, or put 'Current'" },
          regionTag: { type: Type.STRING, enum: ["Local", "Regional", "Global"] },
          priorityLevel: { type: Type.STRING, enum: ["Critical", "Important", "Monitor"] },
          isHighImpact: { type: Type.BOOLEAN },
          sectors: { type: Type.ARRAY, items: { type: Type.STRING } },
          executiveSummary: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Max 5 bullets. Sharp, high-value insights. No repetition of the article." },
          coreInterpretation: {
            type: Type.OBJECT,
            properties: {
              whatIsHappening: { type: Type.STRING },
              whyItMatters: { type: Type.STRING },
              hiddenSignals: { type: Type.STRING }
            },
            required: ["whatIsHappening", "whyItMatters", "hiddenSignals"]
          },
          impactMatrix: {
            type: Type.OBJECT,
            properties: {
              economic: { type: Type.OBJECT, properties: { direction: { type: Type.STRING, enum: ["↑", "↓", "→"] }, explanation: { type: Type.STRING } }, required: ["direction", "explanation"] },
              financial: { type: Type.OBJECT, properties: { direction: { type: Type.STRING, enum: ["↑", "↓", "→"] }, explanation: { type: Type.STRING } }, required: ["direction", "explanation"] },
              government: { type: Type.OBJECT, properties: { direction: { type: Type.STRING, enum: ["↑", "↓", "→"] }, explanation: { type: Type.STRING } }, required: ["direction", "explanation"] },
              business: { type: Type.OBJECT, properties: { direction: { type: Type.STRING, enum: ["↑", "↓", "→"] }, explanation: { type: Type.STRING } }, required: ["direction", "explanation"] },
              social: { type: Type.OBJECT, properties: { direction: { type: Type.STRING, enum: ["↑", "↓", "→"] }, explanation: { type: Type.STRING } }, required: ["direction", "explanation"] }
            },
            required: ["economic", "financial", "government", "business", "social"]
          },
          impactScores: {
            type: Type.OBJECT,
            properties: {
              economic: { type: Type.NUMBER, description: "Score from -10 (very negative) to 10 (very positive)" },
              financial: { type: Type.NUMBER, description: "Score from -10 to 10" },
              government: { type: Type.NUMBER, description: "Score from -10 to 10" },
              business: { type: Type.NUMBER, description: "Score from -10 to 10" },
              social: { type: Type.NUMBER, description: "Score from -10 to 10" }
            },
            required: ["economic", "financial", "government", "business", "social"]
          },
          risksAndOpportunities: {
            type: Type.OBJECT,
            properties: {
              risks: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["risks", "opportunities"]
          },
          forwardOutlook: {
            type: Type.OBJECT,
            properties: {
              shortTerm: { type: Type.STRING, description: "0-3 months" },
              midTerm: { type: Type.STRING, description: "3-12 months" },
              mostLikelyScenario: { type: Type.STRING }
            },
            required: ["shortTerm", "midTerm", "mostLikelyScenario"]
          },
          strategicRecommendations: {
            type: Type.OBJECT,
            properties: {
              immediateActions: { type: Type.ARRAY, items: { type: Type.STRING } },
              monitorClosely: { type: Type.ARRAY, items: { type: Type.STRING } },
              strategicAdjustments: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["immediateActions", "monitorClosely", "strategicAdjustments"]
          },
          signalVisualization: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Cause -> Effect chains, e.g., 'Policy change -> Import cost ↑ -> Prices ↑ -> Demand ↓'"
          },
          ultraAdvanced: {
            type: Type.OBJECT,
            properties: {
              specializedCritics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    industry: { type: Type.STRING },
                    criticism: { type: Type.STRING },
                    solutionFocus: { type: Type.STRING }
                  },
                  required: ["industry", "criticism", "solutionFocus"]
                }
              },
              economicAnalysis: {
                type: Type.OBJECT,
                properties: {
                  macroeconomic: { type: Type.STRING },
                  mesoeconomic: { type: Type.STRING },
                  microeconomic: { type: Type.STRING }
                },
                required: ["macroeconomic", "mesoeconomic", "microeconomic"]
              },
              growthStrategies: {
                type: Type.OBJECT,
                properties: {
                  redOcean: { type: Type.STRING },
                  blueOcean: { type: Type.STRING },
                  historicalPractices: { type: Type.STRING },
                  novelStrategicPlan: { type: Type.STRING }
                },
                required: ["redOcean", "blueOcean", "historicalPractices", "novelStrategicPlan"]
              }
            },
            required: ["specializedCritics", "economicAnalysis", "growthStrategies"]
          }
        },
        required: ["headline", "source", "date", "regionTag", "priorityLevel", "isHighImpact", "sectors", "executiveSummary", "coreInterpretation", "impactMatrix", "impactScores", "risksAndOpportunities", "forwardOutlook", "strategicRecommendations", "signalVisualization", "ultraAdvanced"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text) as AnalysisResult;
}

export async function generateCustomPlan(analysis: AnalysisResult, profile: CompanyProfile, language: string = "English"): Promise<CustomActionPlan> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Based on the following Executive Intelligence Report and the Company Profile, generate a highly specific, actionable Growth and Mitigation Strategy.

EXECUTIVE INTELLIGENCE REPORT:
Headline: ${analysis.headline}
Summary: ${analysis.executiveSummary.join(" ")}
Risks: ${analysis.risksAndOpportunities.risks.join(" ")}
Opportunities: ${analysis.risksAndOpportunities.opportunities.join(" ")}
Ultra Advanced Strategy: ${analysis.ultraAdvanced.growthStrategies.novelStrategicPlan}

COMPANY PROFILE:
Company Name: ${profile.companyName}
Industry: ${profile.industry}
Size: ${profile.companySize}
Annual Revenue: ${profile.annualRevenue}
Annual Expenses: ${profile.annualExpenses}
`,
    config: {
      systemInstruction: `You are Pedro, an elite Strategic Advisor and Business Architect for Agora News Analytics. Your job is to create a tailored, high-impact action plan for the specific company provided, based on the macroeconomic and industry events analyzed in the report.
      
Be extremely specific to their industry, size, and financial situation. Do not give generic advice. Tell them exactly how to allocate resources, what immediate tactics to deploy, and how to grow despite (or because of) the news.

LANGUAGE REQUIREMENT:
You MUST generate the ENTIRE JSON response in the following language: ${language}.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING, description: "A powerful summary of the company's position and the core strategy." },
          immediateTactics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 immediate, concrete actions to take within 30 days." },
          resourceAllocation: { type: Type.STRING, description: "Specific advice on how to manage their revenue and expenses given the current scenario." },
          growthStrategy: { type: Type.STRING, description: "A tailored growth strategy (Blue Ocean or Red Ocean) specifically for their company size and industry." },
          riskMitigation: { type: Type.STRING, description: "How to protect their specific operations and margins from the identified risks." }
        },
        required: ["executiveSummary", "immediateTactics", "resourceAllocation", "growthStrategy", "riskMitigation"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text) as CustomActionPlan;
}

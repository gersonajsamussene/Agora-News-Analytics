import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ArrowRight, BarChart3, Briefcase, ChevronRight, Globe, Lightbulb, LineChart, ShieldAlert, Target, TrendingDown, TrendingUp, Zap, Languages, Link as LinkIcon, Download, Copy, History, BrainCircuit, Compass, BookOpen, CheckCircle2, X } from 'lucide-react';
import { analyzeArticle, generateCustomPlan } from './services/gemini';
import { AnalysisResult, CompanyProfile, CustomActionPlan } from './types';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { LandingPage, AgoraLogo } from './components/LandingPage';

const LANGUAGES = [
  { id: 'English', label: 'English' },
  { id: 'Portuguese', label: 'Português' },
  { id: 'Spanish', label: 'Español' },
  { id: 'French', label: 'Français' },
  { id: 'German', label: 'Deutsch' },
  { id: 'Xangana', label: 'Xangana' }
];

interface HistoryItem {
  id: string;
  date: string;
  input: string;
  language: string;
  result: AnalysisResult;
}

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('Spanish');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  // Plan Creator State
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [customPlan, setCustomPlan] = useState<CustomActionPlan | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    industry: '',
    companyName: '',
    companySize: '1-10',
    annualRevenue: '',
    annualExpenses: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('mzeie_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const saveToHistory = (newResult: AnalysisResult, currentInput: string, currentLang: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      input: currentInput,
      language: currentLang,
      result: newResult
    };
    const updatedHistory = [newItem, ...history].slice(0, 10); // Keep last 10
    setHistory(updatedHistory);
    localStorage.setItem('mzeie_history', JSON.stringify(updatedHistory));
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setInput(item.input);
    setLanguage(item.language);
    setResult(item.result);
    setCustomPlan(null); // Reset plan when loading history
    setShowHistory(false);
  };

  const isUrl = input.trim().startsWith('http://') || input.trim().startsWith('https://');

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setCustomPlan(null); // Reset plan on new analysis
    try {
      const res = await analyzeArticle(input, language);
      setResult(res);
      saveToHistory(res, input, language);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    const opt = {
      margin:       10,
      filename:     `Executive_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Temporarily add a class to force light mode styles for the PDF
    element.classList.add('pdf-export-mode');
    
    // @ts-ignore
    import('html2pdf.js').then((html2pdf) => {
      html2pdf.default().set(opt).from(element).save().then(() => {
        element.classList.remove('pdf-export-mode');
      });
    });
  };

  const copyForLinkedIn = () => {
    if (!result) return;
    const text = `🚨 EXECUTIVE INTELLIGENCE REPORT 🚨
  
📰 ${result.headline}
📍 Source: ${result.source} | 📅 ${result.date}

📌 EXECUTIVE SUMMARY:
${result.executiveSummary.map(b => `• ${b}`).join('\n')}

🧠 CORE INTERPRETATION:
${result.coreInterpretation.whatIsHappening}

📈 IMPACT MATRIX:
• Economic: ${result.impactMatrix.economic.direction}
• Financial: ${result.impactMatrix.financial.direction}
• Business: ${result.impactMatrix.business.direction}

💡 STRATEGIC RECOMMENDATIONS:
${result.strategicRecommendations.immediateActions.map(a => `• ${a}`).join('\n')}

🔍 Analysis by Pedro - Agora News Analytics
#AgoraNewsAnalytics #BusinessIntelligence #Strategy #ExecutiveReport`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    setGeneratingPlan(true);
    try {
      const plan = await generateCustomPlan(result, companyProfile, language);
      setCustomPlan(plan);
      setShowPlanModal(false);
    } catch (err: any) {
      setError(err.message || "Failed to generate custom plan.");
    } finally {
      setGeneratingPlan(false);
    }
  };

  const chartData = result?.impactScores ? [
    { name: 'Economic', score: result.impactScores.economic },
    { name: 'Financial', score: result.impactScores.financial },
    { name: 'Government', score: result.impactScores.government },
    { name: 'Business', score: result.impactScores.business },
    { name: 'Social', score: result.impactScores.social },
  ] : [];

  if (!isStarted) {
    return <LandingPage onStart={() => setIsStarted(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-zinc-300 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-[#0B0B0B]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white border border-zinc-200/10 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              <AgoraLogo className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-medium text-zinc-100 tracking-tight">
              Agora News Analytics
            </h1>
          </div>
          <div className="text-xs font-mono text-zinc-500 flex items-center gap-4">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
            >
              <History className="w-4 h-4" />
              HISTORY
            </button>
            <span>SYS.STATUS: <span className="text-emerald-400">ONLINE</span></span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* History Panel */}
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-zinc-900/80 border border-zinc-800/50 rounded-xl p-6 mb-8 no-print"
          >
            <h3 className="text-sm font-medium text-zinc-300 mb-4 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4" /> Recent Analyses
            </h3>
            {history.length === 0 ? (
              <p className="text-sm text-zinc-500">No history available yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map(item => (
                  <button
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className="text-left bg-zinc-950 border border-zinc-800 rounded-lg p-4 hover:border-emerald-500/50 transition-colors"
                  >
                    <div className="text-xs text-zinc-500 mb-2">{item.date} • {item.language}</div>
                    <div className="text-sm font-medium text-zinc-200 line-clamp-2">{item.result.headline}</div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Input Section */}
        <section className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 shadow-2xl shadow-black/50 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-3">
            <label htmlFor="article-input" className="block text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              Intelligence Input
              {isUrl && <Badge variant="outline" icon={<LinkIcon className="w-3 h-3" />}>URL DETECTED</Badge>}
            </label>
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-zinc-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 cursor-pointer"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="relative">
            <textarea
              id="article-input"
              rows={4}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-y"
              placeholder="Paste an article URL (e.g., https://...) or raw text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="absolute bottom-4 right-4">
              <button
                onClick={handleAnalyze}
                disabled={loading || !input.trim()}
                className="bg-zinc-100 hover:bg-white text-zinc-900 px-6 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </section>

        {/* Results Dashboard */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-20"
            id="report-content"
          >
            {/* Print Only Header */}
            <div className="print-only mb-8 border-b-2 border-zinc-800 pb-4">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-zinc-200">
                      <AgoraLogo className="w-6 h-6" />
                    </div>
                    Agora News Analytics
                  </h1>
                  <p className="text-sm text-zinc-500 mt-1">CONFIDENTIAL EXECUTIVE REPORT</p>
                </div>
                <div className="text-right text-sm font-mono text-zinc-500">
                  <p>Generated: {new Date().toLocaleDateString()}</p>
                  <p>Analyst: Pedro</p>
                </div>
              </div>
            </div>

            {/* Headline & Metadata */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge 
                    variant={result.priorityLevel === 'Critical' ? 'critical' : result.priorityLevel === 'Important' ? 'important' : 'monitor'}
                  >
                    {result.priorityLevel.toUpperCase()} PRIORITY
                  </Badge>
                  {result.isHighImpact && (
                    <Badge variant="critical" icon={<AlertTriangle className="w-3 h-3" />}>
                      HIGH IMPACT ALERT
                    </Badge>
                  )}
                  <Badge variant="outline" icon={<Globe className="w-3 h-3" />}>
                    {result.regionTag.toUpperCase()}
                  </Badge>
                  {result.sectors.map(sector => (
                    <Badge key={sector} variant="secondary">{sector.toUpperCase()}</Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 no-print">
                  <button onClick={copyForLinkedIn} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md text-xs font-medium transition-colors">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy for LinkedIn'}
                  </button>
                  <button onClick={downloadPDF} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-medium transition-colors">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-100 leading-tight">
                {result.headline}
              </h2>
              <div className="flex items-center justify-between text-sm text-zinc-500 font-mono border-b border-zinc-800/50 pb-4">
                <div className="flex items-center gap-4">
                  <span>SRC: {result.source}</span>
                  <span>•</span>
                  <span>T: {result.date}</span>
                </div>
                <div className="text-emerald-400/80 font-medium tracking-wide">
                  Analysis by Pedro
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Summary & Interpretation */}
              <div className="lg:col-span-2 space-y-6">
                <Card title="Executive Summary" icon={<Target className="w-5 h-5 text-emerald-400" />}>
                  <ul className="space-y-3">
                    {result.executiveSummary.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <ChevronRight className="w-5 h-5 text-emerald-500/50 shrink-0 mt-0.5" />
                        <span className="text-zinc-300 leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card title="Core Interpretation" icon={<Lightbulb className="w-5 h-5 text-amber-400" />}>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-mono text-zinc-500 mb-2 uppercase">What is actually happening</h4>
                      <p className="text-zinc-200 leading-relaxed">{result.coreInterpretation.whatIsHappening}</p>
                    </div>
                    <div className="h-px w-full bg-zinc-800/50" />
                    <div>
                      <h4 className="text-xs font-mono text-zinc-500 mb-2 uppercase">Why it matters in Mozambique</h4>
                      <p className="text-zinc-200 leading-relaxed">{result.coreInterpretation.whyItMatters}</p>
                    </div>
                    <div className="h-px w-full bg-zinc-800/50" />
                    <div>
                      <h4 className="text-xs font-mono text-zinc-500 mb-2 uppercase">Hidden Signals</h4>
                      <p className="text-zinc-200 leading-relaxed">{result.coreInterpretation.hiddenSignals}</p>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card title="Risks" icon={<ShieldAlert className="w-5 h-5 text-rose-400" />} className="border-t-2 border-t-rose-500/50">
                    <ul className="space-y-3">
                      {result.risksAndOpportunities.risks.map((risk, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50 shrink-0 mt-2" />
                          <span className="text-zinc-300 text-sm leading-relaxed">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card title="Opportunities" icon={<Zap className="w-5 h-5 text-emerald-400" />} className="border-t-2 border-t-emerald-500/50">
                    <ul className="space-y-3">
                      {result.risksAndOpportunities.opportunities.map((opp, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shrink-0 mt-2" />
                          <span className="text-zinc-300 text-sm leading-relaxed">{opp}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </div>

              {/* Right Column: Impact, Outlook, Actions */}
              <div className="space-y-6">
                <Card title="Impact Matrix" icon={<BarChart3 className="w-5 h-5 text-blue-400" />}>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <ImpactRow label="Economic" impact={result.impactMatrix.economic} />
                      <ImpactRow label="Financial" impact={result.impactMatrix.financial} />
                      <ImpactRow label="Government" impact={result.impactMatrix.government} />
                      <ImpactRow label="Business" impact={result.impactMatrix.business} />
                      <ImpactRow label="Social" impact={result.impactMatrix.social} />
                    </div>
                    
                    {chartData.length > 0 && (
                      <div className="h-64 w-full bg-zinc-950/50 rounded-lg border border-zinc-800/50 p-4 flex flex-col mt-4">
                        <h4 className="text-xs font-mono text-zinc-500 mb-4 text-center">IMPACT QUANTIFICATION (-10 to +10)</h4>
                        <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                              <XAxis type="number" domain={[-10, 10]} stroke="#52525b" fontSize={10} tickFormatter={(val) => val > 0 ? `+${val}` : val} />
                              <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={10} width={70} />
                              <Tooltip 
                                cursor={{fill: '#27272a', opacity: 0.4}}
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', fontSize: '12px' }}
                                formatter={(value: number) => [value > 0 ? `+${value}` : value, 'Score']}
                              />
                              <ReferenceLine x={0} stroke="#52525b" />
                              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16} isAnimationActive={false}>
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.score >= 0 ? '#10b981' : '#f43f5e'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <Card title="Forward Outlook" icon={<LineChart className="w-5 h-5 text-purple-400" />}>
                  <div className="space-y-4">
                    <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800/50">
                      <h4 className="text-xs font-mono text-zinc-500 mb-1 uppercase">Short-term (0-3 mo)</h4>
                      <p className="text-sm text-zinc-300">{result.forwardOutlook.shortTerm}</p>
                    </div>
                    <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800/50">
                      <h4 className="text-xs font-mono text-zinc-500 mb-1 uppercase">Mid-term (3-12 mo)</h4>
                      <p className="text-sm text-zinc-300">{result.forwardOutlook.midTerm}</p>
                    </div>
                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                      <h4 className="text-xs font-mono text-purple-400/80 mb-1 uppercase">Most Likely Scenario</h4>
                      <p className="text-sm text-zinc-200">{result.forwardOutlook.mostLikelyScenario}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Bottom Full Width Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Strategic Recommendations" icon={<Briefcase className="w-5 h-5 text-amber-400" />}>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-mono text-zinc-500 mb-3 uppercase flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500" /> Immediate Actions
                    </h4>
                    <ul className="space-y-2">
                      {result.strategicRecommendations.immediateActions.map((action, idx) => (
                        <li key={idx} className="text-sm text-zinc-300 pl-4 border-l border-zinc-800">{action}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono text-zinc-500 mb-3 uppercase flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" /> Monitor Closely
                    </h4>
                    <ul className="space-y-2">
                      {result.strategicRecommendations.monitorClosely.map((item, idx) => (
                        <li key={idx} className="text-sm text-zinc-300 pl-4 border-l border-zinc-800">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono text-zinc-500 mb-3 uppercase flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" /> Strategic Adjustments
                    </h4>
                    <ul className="space-y-2">
                      {result.strategicRecommendations.strategicAdjustments.map((adj, idx) => (
                        <li key={idx} className="text-sm text-zinc-300 pl-4 border-l border-zinc-800">{adj}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              <Card title="Signal Visualization" icon={<Activity className="w-5 h-5 text-emerald-400" />}>
                <div className="space-y-4">
                  {result.signalVisualization.map((chain, idx) => (
                    <div key={idx} className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-4 font-mono text-sm text-zinc-400 flex flex-wrap items-center gap-2">
                      {chain.split('->').map((part, pIdx, arr) => (
                        <React.Fragment key={pIdx}>
                          <span className="text-zinc-200">{part.trim()}</span>
                          {pIdx < arr.length - 1 && <ArrowRight className="w-4 h-4 text-zinc-600" />}
                        </React.Fragment>
                      ))}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* ULTRA ADVANCED SECTION */}
            <div className="mt-12 pt-8 border-t-2 border-emerald-500/20 page-break-before">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Ultra Advanced Analysis</h2>
                  <p className="text-sm text-emerald-400/80 font-mono">Specialized Industry Critics & Strategic Growth</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Specialized Industry Critics" icon={<Target className="w-5 h-5 text-rose-400" />} className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.ultraAdvanced.specializedCritics.map((critic, idx) => (
                      <div key={idx} className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-5 space-y-3">
                        <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wider border-b border-zinc-800 pb-2">{critic.industry}</h4>
                        <div>
                          <span className="text-xs font-mono text-rose-400 uppercase block mb-1">Criticism</span>
                          <p className="text-sm text-zinc-400">{critic.criticism}</p>
                        </div>
                        <div>
                          <span className="text-xs font-mono text-emerald-400 uppercase block mb-1">Solution Focus</span>
                          <p className="text-sm text-zinc-300">{critic.solutionFocus}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Economic Deep Dive" icon={<BarChart3 className="w-5 h-5 text-blue-400" />}>
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-xs font-mono text-zinc-500 mb-1 uppercase">Macroeconomic</h4>
                      <p className="text-sm text-zinc-300 leading-relaxed">{result.ultraAdvanced.economicAnalysis.macroeconomic}</p>
                    </div>
                    <div className="h-px w-full bg-zinc-800/50" />
                    <div>
                      <h4 className="text-xs font-mono text-zinc-500 mb-1 uppercase">Mesoeconomic</h4>
                      <p className="text-sm text-zinc-300 leading-relaxed">{result.ultraAdvanced.economicAnalysis.mesoeconomic}</p>
                    </div>
                    <div className="h-px w-full bg-zinc-800/50" />
                    <div>
                      <h4 className="text-xs font-mono text-zinc-500 mb-1 uppercase">Microeconomic</h4>
                      <p className="text-sm text-zinc-300 leading-relaxed">{result.ultraAdvanced.economicAnalysis.microeconomic}</p>
                    </div>
                  </div>
                </Card>

                <Card title="Growth Strategies & Historical Context" icon={<Compass className="w-5 h-5 text-amber-400" />}>
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-4">
                        <h4 className="text-xs font-mono text-rose-400 mb-2 uppercase">Red Ocean Strategy</h4>
                        <p className="text-xs text-zinc-300">{result.ultraAdvanced.growthStrategies.redOcean}</p>
                      </div>
                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="text-xs font-mono text-blue-400 mb-2 uppercase">Blue Ocean Strategy</h4>
                        <p className="text-xs text-zinc-300">{result.ultraAdvanced.growthStrategies.blueOcean}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-mono text-zinc-500 mb-2 uppercase flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Historical Practices
                      </h4>
                      <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                        {result.ultraAdvanced.growthStrategies.historicalPractices}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono text-emerald-400 mb-2 uppercase flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Novel Strategic Plan
                      </h4>
                      <p className="text-sm text-zinc-200 leading-relaxed bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/20">
                        {result.ultraAdvanced.growthStrategies.novelStrategicPlan}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* CUSTOM ACTION PLAN SECTION */}
            <div className="mt-12 pt-8 border-t-2 border-emerald-500/20 page-break-before">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Custom Strategic Plan</h2>
                    <p className="text-sm text-blue-400/80 font-mono">Tailored Growth & Mitigation Strategy</p>
                  </div>
                </div>
                
                {!customPlan && (
                  <button
                    onClick={() => setShowPlanModal(true)}
                    disabled={generatingPlan}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 no-print"
                  >
                    {generatingPlan ? (
                      <><Activity className="w-4 h-4 animate-spin" /> Generating Plan...</>
                    ) : (
                      <><Zap className="w-4 h-4" /> Create Custom Plan</>
                    )}
                  </button>
                )}
              </div>

              {customPlan && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Executive Summary for {companyProfile.companyName || 'Your Company'}</h3>
                    <p className="text-zinc-300 leading-relaxed">{customPlan.executiveSummary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Immediate Tactics (30 Days)" icon={<Zap className="w-5 h-5 text-amber-400" />}>
                      <ul className="space-y-3">
                        {customPlan.immediateTactics.map((tactic, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span className="text-sm text-zinc-300">{tactic}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <Card title="Resource Allocation" icon={<LineChart className="w-5 h-5 text-emerald-400" />}>
                      <p className="text-sm text-zinc-300 leading-relaxed">{customPlan.resourceAllocation}</p>
                    </Card>

                    <Card title="Growth Strategy" icon={<TrendingUp className="w-5 h-5 text-blue-400" />}>
                      <p className="text-sm text-zinc-300 leading-relaxed">{customPlan.growthStrategy}</p>
                    </Card>

                    <Card title="Risk Mitigation" icon={<ShieldAlert className="w-5 h-5 text-rose-400" />}>
                      <p className="text-sm text-zinc-300 leading-relaxed">{customPlan.riskMitigation}</p>
                    </Card>
                  </div>
                </motion.div>
              )}
            </div>

          </motion.div>
        )}
      </main>

      {/* Onboarding Modal for Plan Creator */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                Company Profile
              </h3>
              <button onClick={() => setShowPlanModal(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleGeneratePlan} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">Company Name</label>
                <input 
                  type="text" 
                  required
                  value={companyProfile.companyName}
                  onChange={e => setCompanyProfile({...companyProfile, companyName: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. MozLogistics SA"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">Industry</label>
                <input 
                  type="text" 
                  required
                  value={companyProfile.industry}
                  onChange={e => setCompanyProfile({...companyProfile, industry: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Transportation & Logistics"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">Company Size</label>
                <select 
                  value={companyProfile.companySize}
                  onChange={e => setCompanyProfile({...companyProfile, companySize: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="1-10">1-10 Employees</option>
                  <option value="11-50">11-50 Employees</option>
                  <option value="51-200">51-200 Employees</option>
                  <option value="201-500">201-500 Employees</option>
                  <option value="500+">500+ Employees</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">Annual Revenue</label>
                  <input 
                    type="text" 
                    required
                    value={companyProfile.annualRevenue}
                    onChange={e => setCompanyProfile({...companyProfile, annualRevenue: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. $5M"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">Annual Expenses</label>
                  <input 
                    type="text" 
                    required
                    value={companyProfile.annualExpenses}
                    onChange={e => setCompanyProfile({...companyProfile, annualExpenses: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. $3.5M"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Generate Strategic Plan
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function Card({ title, icon, children, className = '' }: { title: string, icon?: React.ReactNode, children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden page-break-inside-avoid ${className}`}>
      <div className="px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/80 flex items-center gap-3">
        {icon}
        <h3 className="text-sm font-medium text-zinc-100 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function Badge({ children, variant = 'default', icon }: { children: React.ReactNode, variant?: 'default' | 'critical' | 'important' | 'monitor' | 'outline' | 'secondary', icon?: React.ReactNode }) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-300',
    critical: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    important: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    monitor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    outline: 'border border-zinc-700 text-zinc-400',
    secondary: 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium ${variants[variant]}`}>
      {icon}
      {children}
    </span>
  );
}

function ImpactRow({ label, impact }: { label: string, impact: { direction: string, explanation: string } }) {
  const getIcon = (dir: string) => {
    if (dir === '↑') return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    if (dir === '↓') return <TrendingDown className="w-4 h-4 text-rose-400" />;
    return <ArrowRight className="w-4 h-4 text-zinc-500" />;
  };

  return (
    <div className="flex flex-col gap-1 pb-3 border-b border-zinc-800/50 last:border-0 last:pb-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-300">{label}</span>
        <div className="flex items-center gap-2 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
          {getIcon(impact.direction)}
          <span className="text-xs font-mono text-zinc-400">{impact.direction}</span>
        </div>
      </div>
      <p className="text-xs text-zinc-500 leading-relaxed">{impact.explanation}</p>
    </div>
  );
}

export default App;

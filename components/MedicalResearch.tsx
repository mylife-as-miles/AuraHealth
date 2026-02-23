import React, { useState } from 'react';
import {
  Download,
  Plus,
  Bot,
  Sparkles,
  Paperclip,
  ArrowUp,
  Library,
  Maximize2,
  MoreHorizontal,
  FileText,
  Search,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ErrorBar,
  Cell,
  ReferenceLine
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import { SafeChart } from './SafeChart';

// Mock Data matching the screenshot
const MOCK_DATA = {
  synthesis: `Recent meta-analyses and large-scale randomized controlled trials (RCTs) indicate that GLP-1 receptor agonists (GLP-1 RAs) offer significant cardiovascular benefits in individuals without diabetes, particularly those with obesity or established cardiovascular disease.

*   **Reduction in MACE:** The SELECT trial demonstrated a 20% reduction in major adverse cardiovascular events (MACE) with semaglutide 2.4 mg compared to placebo in non-diabetic patients with overweight or obesity. [1]
*   **Blood Pressure & Lipid Profile:** Consistent evidence points to modest reductions in systolic blood pressure and improvements in lipid profiles, independent of weight loss magnitude. [3, 5]
*   **Heart Failure:** Benefits noted in heart failure with preserved ejection fraction (HFpEF), showing improved symptoms and physical limitations. [2]`,
  confidence: 0.92,
  sources: [
    { id: '1', title: 'SELECT Trial', journal: 'NEJM', year: '2023', url: '#' },
    { id: '2', title: 'STEP-HFpEF', journal: 'NEJM', year: '2023', url: '#' },
    { id: '3', title: 'SUSTAIN-6', journal: 'NEJM', year: '2016', url: '#' },
    { id: '4', title: 'PIONEER 6', journal: 'NEJM', year: '2019', url: '#' },
    { id: '5', title: 'Meta-Analysis: GLP-1', journal: 'Lancet', year: '2024', url: '#' }
  ],
  riskChart: [
    { name: 'SELECT', x: 0.80, y: 1, error: [0.08, 0.10], color: '#54E097' },
    { name: 'STEP-HFpEF', x: 0.65, y: 2, error: [0.10, 0.20], color: '#54E097' },
    { name: 'SUSTAIN-6', x: 0.74, y: 3, error: [0.14, 0.21], color: '#14F5D6' }
  ],
  weightChart: [
    { name: 'Placebo', value: 2.4, color: '#E5E7EB' },
    { name: 'Lira', value: 6.2, color: '#14F5D6' },
    { name: 'Sema', value: 14.9, color: '#54E097' },
    { name: 'Tirz', value: 20.9, color: '#FE5796' }
  ]
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-card-dark p-2 border border-border-light dark:border-border-dark rounded-lg shadow-lg text-xs">
        <p className="font-bold text-primary dark:text-white mb-1">{label || payload[0].payload.name}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom shape for Forest Plot points
const ForestPoint = (props: any) => {
  const { cx, cy, fill } = props;
  return <rect x={cx - 3} y={cy - 3} width={6} height={6} fill={fill} rx={1} />;
};

export default function MedicalResearch() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(MOCK_DATA);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error('Research analysis failed');

      const newData = await res.json();

      // Transform chart data if necessary or trust the API response structure
      // Here we assume the API returns the correct structure, but we might need to map it
      // to the specific Recharts format we defined (x, y, error) if the prompt isn't perfect.
      // For now, we update the state directly.

      // Basic validation/transformation fallback
      const transformedData = {
        ...newData,
        riskChart: newData.charts?.find((c: any) => c.type === 'risk_reduction')?.data.map((d: any, i: number) => ({
          ...d,
          x: d.value,
          y: i + 1,
          // Calculate error bars if min/max are provided
          error: [d.value - d.min, d.max - d.value]
        })) || [],
        weightChart: newData.charts?.find((c: any) => c.type === 'bar_comparison')?.data || []
      };

      setData(transformedData);
    } catch (error) {
      console.error("Search failed", error);
      // Optional: Add error state/toast here
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const content = `# Medical Research Synthesis\n\n${data.synthesis}\n\n## Sources\n${data.sources.map(s => `- ${s.title} (${s.journal}, ${s.year})`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'research_synthesis.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden relative animate-in fade-in duration-500">

      {/* Secondary Toolbar */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-border-light dark:border-border-dark bg-white/50 dark:bg-card-dark/50 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-primary dark:text-white">Evidence Synthesis</h2>
          <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold border border-secondary/20">BETA</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Research
          </button>
          <button
            onClick={() => setQuery('')}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            New Query
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scroll p-6 space-y-6 pb-32 relative">

          {/* User Query Card */}
          <div className="flex justify-end animate-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="bg-white dark:bg-card-dark p-4 rounded-2xl rounded-tr-sm shadow-sm border border-border-light dark:border-border-dark max-w-2xl">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Latest evidence on GLP-1 agonists for cardiovascular health in non-diabetic patients
              </p>
            </div>
            <div className="ml-3 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary/20 to-cyan/20 flex items-center justify-center text-primary font-bold border border-white dark:border-card-dark shadow-sm">
                <span className="text-xs">MK</span>
              </div>
            </div>
          </div>

          {/* AI Response Area */}
          <div className="flex gap-4 max-w-4xl animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Bot className="w-4 h-4" />
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="bg-white dark:bg-card-dark rounded-3xl p-6 shadow-soft dark:shadow-none dark:border dark:border-border-dark border border-transparent transition-all hover:shadow-lg hover:shadow-primary/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-primary dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    Clinical Synthesis
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Confidence</span>
                    <div className="flex gap-0.5">
                      {[...Array(4)].map((_, i) => {
                        const activeBars = Math.round((data.confidence || 0) * 4);
                        return (
                          <div key={i} className={`w-1.5 h-3 rounded-full ${i < activeBars ? 'bg-secondary' : 'bg-secondary/30'}`} />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                  <ReactMarkdown
                    components={{
                      li: ({ node, ...props }) => (
                        <li className="flex gap-3 text-sm mb-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          <span>{props.children}</span>
                        </li>
                      ),
                      strong: ({ node, ...props }) => <strong className="text-primary dark:text-white font-bold">{props.children}</strong>,
                      a: ({ node, ...props }) => <a className="text-cyan text-xs font-bold hover:underline ml-1" {...props}>{props.children}</a>
                    }}
                  >
                    {data.synthesis}
                  </ReactMarkdown>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 font-medium">#GLP1</span>
                  <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 font-medium">#Cardiology</span>
                  <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 font-medium">#ObesityManagement</span>
                </div>
              </div>
            </div>
          </div>
          {/* Input Area (Bottom) */}
          <div className="p-6 pt-2 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent z-30 absolute bottom-0 left-0 w-full">
            <div className="relative bg-white dark:bg-card-dark rounded-2xl shadow-lg border border-border-light dark:border-border-dark p-2 flex items-end gap-2 max-w-4xl">
              <button className="p-2 text-gray-400 hover:text-primary dark:hover:text-white transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                <Paperclip className="w-5 h-5" />
              </button>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 resize-none py-2.5 max-h-32 custom-scroll"
                placeholder="Ask a follow-up question or refine criteria..."
                rows={1}
              />
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className={`p-2 rounded-xl shadow-md transition-all flex items-center justify-center ${loading || !query.trim() ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90'}`}
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowUp className="w-5 h-5" />}
              </button>
            </div>
            <div className="text-center mt-2 max-w-4xl">
              <p className="text-[10px] text-gray-400">MedGemma can make mistakes. Verify important clinical information.</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar (Evidence Visualization) */}
        <aside className="w-full md:w-[400px] flex-shrink-0 bg-white/60 dark:bg-card-dark/30 border-l border-border-light dark:border-border-dark backdrop-blur-sm flex flex-col z-20 h-full">
          <div className="flex-1 p-5 overflow-y-auto custom-scroll space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Evidence Visualization</h3>

            {/* Chart 1: MACE Risk Reduction (Forest Plot approx) */}
            <div className="bg-white dark:bg-card-dark rounded-2xl p-4 shadow-sm border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-primary dark:text-white">MACE Risk Reduction</h4>
                <button className="text-gray-400 hover:text-primary dark:hover:text-white transition-colors">
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
              <div className="h-40 w-full relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <div className="w-px h-full border-l border-dashed border-gray-300 dark:border-gray-700 absolute left-1/2" />
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <SafeChart>
                    <ScatterChart
                      layout="vertical"
                      margin={{ top: 10, right: 10, bottom: 20, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis type="number" dataKey="x" domain={[0.4, 1.6]} tick={{ fontSize: 9 }} tickCount={5} stroke="#9CA3AF" />
                      <YAxis
                        type="number"
                        dataKey="y"
                        domain={[0, 4]}
                        ticks={[1, 2, 3]}
                        tick={({ x, y, payload }) => {
                          const item = data.riskChart.find(d => d.y === payload.value);
                          if (!item) return null;
                          return (
                            <text x={x} y={y} dy={3} textAnchor="end" fill="#6B7280" fontSize={9} fontWeight={600}>
                              {item.name}
                            </text>
                          );
                        }}
                        width={70}
                        stroke="#9CA3AF"
                        interval={0}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter data={data.riskChart} fill="#8884d8" shape={<ForestPoint />}>
                        {data.riskChart.map((entry, index) => (
                          <Cell key={`cell-\${index}`} fill={entry.color} />
                        ))}
                        <ErrorBar dataKey="error" width={0} strokeWidth={2} direction="x" stroke="#374151" />
                      </Scatter>
                    </ScatterChart>
                  </SafeChart>
                </ResponsiveContainer>

                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8 text-[9px] text-gray-400 pointer-events-none">
                  <span>Favors Treatment</span>
                  <span>Favors Placebo</span>
                </div>
              </div>
            </div>

            {/* Chart 2: Weight Loss Comparison */}
            <div className="bg-white dark:bg-card-dark rounded-2xl p-4 shadow-sm border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-primary dark:text-white">Weight Loss Efficacy (68 Weeks)</h4>
              </div>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <SafeChart>
                    <BarChart data={data.weightChart} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#9CA3AF" axisLine={false} tickLine={false} />
                      <Tooltip
                        cursor={{ fill: 'transparent' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white dark:bg-card-dark px-2 py-1 rounded shadow-lg border border-border-light dark:border-border-dark text-[10px] font-bold">
                                {payload[0].value}%
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                        {data.weightChart.map((entry, index) => (
                          <Cell key={`cell-\${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </SafeChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sources List */}
            <div className="bg-white dark:bg-card-dark border-t border-border-light dark:border-border-dark flex flex-col shadow-[-4px_-4px_20px_rgba(0,0,0,0.05)] rounded-tl-2xl -mx-5 -mb-5 mt-auto">
              <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Library className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xs font-bold text-primary dark:text-white">Sources</h3>
                </div>
                <span className="text-[10px] text-gray-400">{data.sources.length} citations</span>
              </div>
              <div className="max-h-48 overflow-y-auto custom-scroll p-2">
                {data.sources.map((source) => (
                  <a key={source.id} href={source.url} className="block p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group">
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-cyan mt-0.5">[{source.id}]</span>
                      <div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-white transition-colors line-clamp-1">{source.title}</p>
                        <p className="text-[10px] text-gray-400">{source.journal}, {source.year}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

    </div>
  );
}

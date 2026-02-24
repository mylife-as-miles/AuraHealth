import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  ChevronDown,
  Activity,
  Loader2,
  List,
  ChevronRight
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
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { useActiveModel } from '../lib/useActiveModel';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: any; // User: string, Model: Data Object
  isLoading?: boolean;
  timestamp: number;
}

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
  const { modelId, modelName } = useActiveModel();

  const userEmail = localStorage.getItem('aura_auth_email');
  const user = useLiveQuery(() => userEmail ? db.authUsers.where('email').equals(userEmail).first() : undefined, [userEmail]);

  // Get initials from user name or fallback to "DR"
  const userInitials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'DR';

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, progressStep]);

  const activeMessage = messages.find(m => m.id === activeMessageId);
  const activeData = activeMessage?.role === 'model' ? activeMessage.content : null;

  const handleSearch = async (overrideQuery?: string) => {
    const searchQuery = overrideQuery || query;
    if (!searchQuery.trim()) return;

    // Clear input if it was a manual type
    if (!overrideQuery) setQuery('');

    setLoading(true);
    setProgressStep('analyzing');

    // Create User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: searchQuery,
      timestamp: Date.now()
    };

    // Create Placeholder AI Message
    const aiMsgId = (Date.now() + 1).toString();
    const aiMsg: Message = {
      id: aiMsgId,
      role: 'model',
      content: null,
      isLoading: true,
      timestamp: Date.now() + 1
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setActiveMessageId(aiMsgId);

    try {
      // Prepare history for API
      // Filter out loading messages or failed ones if necessary, but here we just take completed ones
      const history = messages
        .filter(m => !m.isLoading && m.content)
        .map(m => ({
          role: m.role,
          content: m.role === 'user' ? m.content : JSON.stringify(m.content) // simplified serialization for now
        }));

      const res = await fetch('/api/gemini/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery, modelId, history }),
      });

      if (!res.ok) throw new Error('Research analysis failed');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Response body is not readable');
      const decoder = new TextDecoder('utf-8');

      let readBuffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        readBuffer += decoder.decode(value, { stream: true });
        const lines = readBuffer.split('\n');
        readBuffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.status === 'complete') {
              const newData = parsed.data;
              const transformedData = {
                ...newData,
                riskChart: newData.charts?.find((c: any) => c.type === 'risk_reduction')?.data?.map((d: any, i: number) => ({
                  ...d,
                  x: d.value,
                  y: i + 1,
                  error: d.min !== undefined && d.max !== undefined ? [Math.abs(d.value - d.min), Math.abs(d.max - d.value)] : [0, 0]
                })) || [],
                weightChart: newData.charts?.find((c: any) => c.type === 'bar_comparison')?.data || []
              };

              setMessages(prev => prev.map(m =>
                m.id === aiMsgId
                  ? { ...m, content: transformedData, isLoading: false }
                  : m
              ));

            } else if (parsed.status === 'error') {
              throw new Error(parsed.message || 'Stream parsing error');
            } else if (parsed.status) {
              setProgressStep(parsed.status);
            }
          } catch (e) {
            console.error("JSON parse error on line:", line, e);
          }
        }
      }
    } catch (error) {
      console.error("Search failed", error);
      setMessages(prev => prev.map(m =>
        m.id === aiMsgId
          ? { ...m, isLoading: false, content: { synthesis: "An error occurred while fetching the research analysis." } }
          : m
      ));
    } finally {
      setLoading(false);
      setProgressStep('');
    }
  };

  const handleExport = () => {
    if (!activeData) return;
    const content = `# Medical Research Synthesis\n\n${activeData.synthesis}\n\n## Sources\n${activeData.sources?.map((s: any) => `- ${s.title} (${s.journal}, ${s.year})`).join('\n')}`;
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
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">
        {/* LEFT WRAPPER: Chat and Input Box */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto custom-scroll relative" ref={scrollRef}>
            <div className="flex flex-col min-h-full p-6 space-y-6 pb-32 justify-end">

              {messages.length === 0 && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-80 m-auto mt-12 mb-8 animate-in zoom-in duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-cyan/10 text-cyan flex items-center justify-center mb-4 shadow-inner border border-cyan/20">
                    <Library size={32} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Clinical Evidence Synthesis</h2>
                  <div className="flex flex-wrap justify-center gap-3 max-w-[600px]">
                    {[
                      "Latest evidence on GLP-1 agonists for cardiovascular health in non-diabetic patients",
                      "Efficacy of PARP inhibitors in BRCA-mutated early breast cancer",
                      "Efficacy of dual antiplatelet therapy vs monotherapy post-TAVR"
                    ].map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setQuery(prompt)}
                        className="text-xs bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 hover:border-cyan/50 hover:text-cyan text-gray-600 dark:text-gray-300 rounded-xl px-4 py-2 transition-all text-left shadow-sm hover:shadow-md"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className="w-full">
                  {msg.role === 'user' ? (
                     /* User Query Card */
                    <div className="flex justify-end animate-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-white dark:bg-card-dark p-4 rounded-2xl rounded-tr-sm shadow-sm border border-border-light dark:border-border-dark max-w-2xl">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {msg.content}
                        </p>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary/20 to-cyan/20 flex items-center justify-center text-primary font-bold border border-white dark:border-card-dark shadow-sm">
                          <span className="text-xs">{userInitials}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* AI Response Area */
                    <div className="flex gap-4 max-w-4xl animate-in slide-in-from-bottom-4 duration-500 delay-100">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20">
                          <Bot className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="flex-1 space-y-6">
                        {msg.isLoading ? (
                           <div className="bg-white dark:bg-card-dark/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                             <h3 className="font-bold text-sm flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-200">
                               <ChevronDown className="w-4 h-4 text-gray-400" /> Thinking
                             </h3>

                             <div className="pl-2 space-y-0 relative border-l-2 border-gray-100 dark:border-gray-800 ml-2">

                               {/* Step 1 */}
                               <div className={`flex items-center gap-3 py-3 px-4 relative transition-opacity duration-300 ${progressStep && progressStep !== '' ? 'opacity-100' : 'opacity-40'}`}>
                                 <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FE5796] border-4 border-white dark:border-[#1E1E2E]" />
                                 <Activity className={`w-4 h-4 ${progressStep === 'analyzing' ? 'text-[#FE5796] animate-pulse' : 'text-gray-400'}`} />
                                 <span className={`text-sm ${progressStep === 'analyzing' ? 'text-primary dark:text-white font-bold' : 'text-gray-500 font-medium'}`}>Analyzing query</span>
                               </div>

                               {/* Step 2 */}
                               <div className={`flex items-center gap-3 py-3 px-4 relative transition-opacity duration-300 ${['searching', 'synthesizing', 'finished', 'complete'].includes(progressStep) ? 'opacity-100' : 'opacity-40'}`}>
                                 <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#F5A623] border-4 border-white dark:border-[#1E1E2E]" />
                                 {progressStep === 'searching' ? (
                                   <Loader2 className="w-4 h-4 text-[#F5A623] animate-spin" />
                                 ) : (
                                   <Search className={`w-4 h-4 ${['synthesizing', 'finished', 'complete'].includes(progressStep) ? 'text-gray-400' : 'text-[#F5A623]'}`} />
                                 )}
                                 <span className={`text-sm ${progressStep === 'searching' ? 'text-primary dark:text-white font-bold' : 'text-gray-500 font-medium'}`}>Searching published medical literature, guidelines, FDA, CDC, and more</span>
                               </div>

                               {/* Step 3 */}
                               <div className={`flex items-center gap-3 py-3 px-4 relative transition-opacity duration-300 ${['synthesizing', 'finished', 'complete'].includes(progressStep) ? 'opacity-100' : 'opacity-40'}`}>
                                 <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FF453A] border-4 border-white dark:border-[#1E1E2E]" />
                                 {progressStep === 'synthesizing' ? (
                                   <Loader2 className="w-4 h-4 text-[#FF453A] animate-spin" />
                                 ) : (
                                   <Library className={`w-4 h-4 ${['finished', 'complete'].includes(progressStep) ? 'text-gray-400' : 'text-[#FF453A]'}`} />
                                 )}
                                 <span className={`text-sm ${progressStep === 'synthesizing' ? 'text-primary dark:text-white font-bold' : 'text-gray-500 font-medium'}`}>Synthesizing relevant information</span>
                               </div>

                             </div>
                           </div>
                        ) : msg.content && (
                          <>
                            <div
                              onClick={() => setActiveMessageId(msg.id)}
                              className={`bg-white dark:bg-card-dark rounded-3xl p-6 shadow-soft dark:shadow-none dark:border dark:border-border-dark border transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/5 ${activeMessageId === msg.id ? 'border-primary ring-1 ring-primary' : 'border-transparent'}`}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-primary dark:text-white flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-secondary" />
                                  Clinical Synthesis
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] uppercase font-bold text-gray-400">Confidence</span>
                                  <div className="flex gap-0.5">
                                    {[...Array(4)].map((_, i) => {
                                      const activeBars = Math.round((msg.content.confidence || 0) * 4);
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
                                  {msg.content.synthesis || ''}
                                </ReactMarkdown>
                              </div>

                              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 font-medium">#EvidenceBased</span>
                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 font-medium">#ClinicalSynthesis</span>
                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 font-medium">{modelName ? `#${modelName.replace(/\s+/g, '')}` : '#MedGemma'}</span>
                              </div>
                            </div>

                            {/* Follow-Up Questions Card */}
                            {msg.content.followUpQuestions?.length > 0 && msg.id === messages[messages.length - 1]?.id && (
                              <div className="bg-gray-50 dark:bg-[#2A2A3E] rounded-2xl p-5 border border-gray-100 dark:border-white/5 mt-4">
                                <h4 className="font-bold text-sm text-primary dark:text-white flex items-center gap-2 mb-4">
                                  <List className="w-4 h-4 text-gray-400" />
                                  Follow-Up Questions
                                </h4>
                                <div className="space-y-0 divide-y divide-gray-200/60 dark:divide-white/5">
                                  {msg.content.followUpQuestions.map((q: string, i: number) => (
                                    <button
                                      key={i}
                                      type="button"
                                      onClick={() => handleSearch(q)}
                                      className="w-full flex items-center justify-between py-3 text-left text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors group"
                                    >
                                      <span className="pr-4">{q}</span>
                                      <ChevronRight className="w-4 h-4 flex-shrink-0 text-orange-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Input Area (Bottom) */}
          <div className="bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent z-30 absolute bottom-0 left-0 w-full flex flex-col items-center pt-8 pb-4 px-6 scale-90 sm:scale-100 origin-bottom">
            <div className="relative bg-white dark:bg-card-dark rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-border-light dark:border-border-dark p-2 flex items-end gap-2 w-full max-w-4xl">
              <button type="button" className="p-2 text-gray-400 hover:text-primary dark:hover:text-white transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
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
                type="button"
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                className={`p-2 rounded-xl shadow-md transition-all flex items-center justify-center ${loading || !query.trim() ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90'}`}
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowUp className="w-5 h-5" />}
              </button>
            </div>
            <div className="text-center mt-3 max-w-4xl w-full">
              <p className="text-[10px] text-gray-400">{modelName || 'MedGemma'} can make mistakes. Verify important clinical information.</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar (Evidence Visualization) */}
        {activeData && (
          <aside className="w-full md:w-[400px] flex-shrink-0 bg-white/60 dark:bg-card-dark/30 border-l border-border-light dark:border-border-dark backdrop-blur-sm flex flex-col z-20 h-full animate-in slide-in-from-right-8 duration-500">
            <div className="flex-1 p-5 overflow-y-auto custom-scroll space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Evidence Visualization</h3>

              {/* Chart 1: MACE Risk Reduction (Forest Plot approx) */}
              {activeData.riskChart && activeData.riskChart.length > 0 && (
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
                              const item = activeData.riskChart.find((d: any) => d.y === payload.value);
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
                          <Scatter data={activeData.riskChart} fill="#8884d8" shape={<ForestPoint />}>
                            {activeData.riskChart.map((entry: any, index: number) => (
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
              )}

              {/* Chart 2: Weight Loss Comparison */}
              {activeData.weightChart && activeData.weightChart.length > 0 && (
                <div className="bg-white dark:bg-card-dark rounded-2xl p-4 shadow-sm border border-border-light dark:border-border-dark">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-primary dark:text-white">Weight Loss Efficacy (68 Weeks)</h4>
                  </div>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <SafeChart>
                        <BarChart data={activeData.weightChart} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
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
                            {activeData.weightChart.map((entry: any, index: number) => (
                              <Cell key={`cell-\${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </SafeChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Sources List */}
              {activeData.sources && activeData.sources.length > 0 && (
                <div className="bg-white dark:bg-card-dark border-t border-border-light dark:border-border-dark flex flex-col shadow-[-4px_-4px_20px_rgba(0,0,0,0.05)] rounded-tl-2xl -mx-5 -mb-5 mt-auto">
                  <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Library className="w-4 h-4 text-gray-400" />
                      <h3 className="text-xs font-bold text-primary dark:text-white">Sources</h3>
                    </div>
                    <span className="text-[10px] text-gray-400">{activeData.sources.length} citations</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto custom-scroll p-2">
                    {activeData.sources.map((source: any) => (
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
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

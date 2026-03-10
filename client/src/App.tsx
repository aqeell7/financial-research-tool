import { useState } from 'react';
import { Upload, Loader2, AlertCircle } from 'lucide-react';

interface AnalysisData {
  tone: string;
  confidence_level: string;
  key_concerns: string[];
  key_positives: string[];
  forward_guidance: string;
  capacity_utilization: string;
  growth_initiatives: string[];
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("document", file);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://financial-research-tool-dfhm.onrender.com/api/documents/upload";
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to analyze document");
      }

      setAnalysis(data.analysisData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center relative z-10 scroll-smooth">
      {/* Mesh Gradient Background */}
      <div className="mesh-gradient" />

      <div className="w-full max-w-5xl space-y-16 mt-16 mb-24 relative">

        {/* NEW HERO SECTION */}
        <div className="text-center space-y-6 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
            AI-Powered Extraction
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Turn Earnings Calls into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Structured Data.</span> Instantly.
          </h1>

          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Upload unstructured financial transcripts and let our semantic engine generate zero-hallucination institutional intelligence.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 rounded-xl bg-slate-900 text-white font-medium shadow-md shadow-slate-900/10 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 border border-slate-800 w-full sm:w-auto"
            >
              Start Extraction Pipeline
            </button>
            <a
              href="https://github.com/aqeell7/financial-research-tool"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-xl bg-white text-slate-700 font-medium shadow-sm hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-slate-200 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              View Documentation
            </a>
          </div>
        </div>

        {/* Upload Card */}
        <div id="upload-section" className="glass-card p-10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] flex flex-col items-center space-y-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden mt-20">
          <div className="absolute inset-0 bg-white/40 pointer-events-none rounded-3xl"></div>
          <div className="relative z-10 w-full flex flex-col items-center space-y-6">
            <div className="p-5 bg-indigo-50/50 text-indigo-600 rounded-2xl border border-indigo-100/50 shadow-sm">
              <Upload size={32} strokeWidth={1.5} />
            </div>

            <div className="w-full max-w-md">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-xl bg-white/50 border border-slate-200/50 shadow-sm"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || isLoading}
              className="w-full max-w-md bg-slate-900 text-white py-3.5 rounded-xl text-base font-medium hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex justify-center items-center shadow-md border border-slate-800"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin mr-2" size={18} /> Processing Document...</>
              ) : (
                'Run Extraction Pipeline'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50/90 backdrop-blur-sm text-red-800 p-5 rounded-2xl flex items-start border border-red-100/50 shadow-sm text-sm font-medium">
            <AlertCircle className="mr-3 shrink-0 mt-0.5" size={18} />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {analysis && (
          <div className="glass-card rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] overflow-hidden text-left relative transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <div className="absolute inset-0 bg-white/60 pointer-events-none z-0"></div>

            <div className="relative z-10">
              {/* Header Section */}
              <div className="bg-white/40 p-8 border-b border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Transcript Analysis</h2>
                  <p className="text-xs text-slate-500 mt-1.5 uppercase tracking-widest font-semibold flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                    AI Extraction Complete
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize border shadow-sm ${analysis.tone.toLowerCase().includes('optimistic') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      analysis.tone.toLowerCase().includes('cautious') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        analysis.tone.toLowerCase().includes('pessimistic') ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                    Tone: {analysis.tone}
                  </span>
                  <span className="px-4 py-1.5 rounded-full text-xs font-semibold capitalize border bg-white text-slate-700 border-slate-200 shadow-sm">
                    Confidence: {analysis.confidence_level}
                  </span>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">

                <div className="space-y-10">
                  <div className="bg-white/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      </div>
                      Key Positives
                    </h3>
                    <ul className="space-y-3">
                      {analysis.key_positives.map((item, idx) => (
                        <li key={idx} className="text-slate-600 text-sm leading-relaxed pl-4 border-l-2 border-emerald-100">{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center mr-3">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      </div>
                      Key Concerns
                    </h3>
                    <ul className="space-y-3">
                      {analysis.key_concerns.map((item, idx) => (
                        <li key={idx} className="text-slate-600 text-sm leading-relaxed pl-4 border-l-2 border-rose-100">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50"></div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Forward Guidance</h3>
                    <p className="text-white text-sm leading-relaxed font-medium relative z-10">{analysis.forward_guidance}</p>
                  </div>

                  <div className="bg-white/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      </div>
                      Growth Initiatives
                    </h3>
                    <ul className="space-y-3">
                      {analysis.growth_initiatives.map((item, idx) => (
                        <li key={idx} className="text-slate-600 text-sm leading-relaxed pl-4 border-l-2 border-indigo-100">{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/50 p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-700">Capacity Utilization</h3>
                    <p className="text-slate-900 text-sm font-semibold bg-slate-100 px-3 py-1 rounded-lg">{analysis.capacity_utilization}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
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
    <div className="min-h-screen p-8 flex flex-col items-center font-sans tracking-tight">
      <div className="w-full max-w-4xl space-y-8 mt-8">
        
        {/* Header - More authoritative */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">Earnings Intelligence</h1>
          <p className="text-neutral-500 text-sm">Upload a transcript PDF for structured semantic extraction.</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200 flex flex-col items-center space-y-5">
          <div className="p-4 bg-neutral-100 text-neutral-600 rounded-md border border-neutral-200">
            <Upload size={28} strokeWidth={1.5} />
          </div>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange}
            className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-neutral-100 file:text-neutral-800 hover:file:bg-neutral-200 cursor-pointer transition-colors"
          />
          
          <button 
            onClick={handleUpload} 
            disabled={!file || isLoading}
            className="w-full bg-neutral-900 text-white py-2.5 rounded-md text-sm font-medium hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-sm"
          >
            {isLoading ? (
              <><Loader2 className="animate-spin mr-2" size={16} /> Processing Document...</>
            ) : (
              'Run Extraction Pipeline'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md flex items-start border border-red-100 text-sm">
            <AlertCircle className="mr-3 shrink-0 mt-0.5" size={16} />
            <p>{error}</p>
          </div>
        )}

        {analysis && (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden text-left">
            {/* Header Section */}
            <div className="bg-neutral-50/50 p-6 border-b border-neutral-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Transcript Analysis</h2>
                <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-medium">AI Extraction Complete</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-md text-xs font-medium capitalize border ${
                  analysis.tone.toLowerCase().includes('optimistic') ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  analysis.tone.toLowerCase().includes('cautious') ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  analysis.tone.toLowerCase().includes('pessimistic') ? 'bg-rose-50 text-rose-800 border-rose-200' :
                  'bg-neutral-100 text-neutral-800 border-neutral-200'
                }`}>
                  Tone: {analysis.tone}
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-medium capitalize border bg-neutral-100 text-neutral-700 border-neutral-200">
                  Confidence: {analysis.confidence_level}
                </span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                    Key Positives
                  </h3>
                  <ul className="space-y-2.5">
                    {analysis.key_positives.map((item, idx) => (
                      <li key={idx} className="text-neutral-600 text-sm leading-relaxed pl-4 border-l border-neutral-200">{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2"></span>
                    Key Concerns
                  </h3>
                  <ul className="space-y-2.5">
                    {analysis.key_concerns.map((item, idx) => (
                      <li key={idx} className="text-neutral-600 text-sm leading-relaxed pl-4 border-l border-neutral-200">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                {/* Replaced blue box with a sleek neutral gray box */}
                <div className="bg-neutral-50 p-5 rounded-md border border-neutral-200">
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">Forward Guidance</h3>
                  <p className="text-neutral-800 text-sm leading-relaxed font-medium">{analysis.forward_guidance}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    Growth Initiatives
                  </h3>
                  <ul className="space-y-2.5">
                    {analysis.growth_initiatives.map((item, idx) => (
                      <li key={idx} className="text-neutral-600 text-sm leading-relaxed pl-4 border-l border-neutral-200">{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">Capacity Utilization</h3>
                  <p className="text-neutral-800 text-sm">{analysis.capacity_utilization}</p>
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
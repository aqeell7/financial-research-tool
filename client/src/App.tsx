import { useState } from 'react';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';

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
      setError(null)
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
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Earnings Call Analyst</h1>
          <p className="text-gray-500 mt-2">Upload a transcript PDF to extract structured insights.</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center space-y-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
            <Upload size={32} />
          </div>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          
          <button 
            onClick={handleUpload} 
            disabled={!file || isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <><Loader2 className="animate-spin mr-2" size={20} /> Analyzing Document...</>
            ) : (
              'Run AI Analysis'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start border border-red-200">
            <AlertCircle className="mr-3 shrink-0 mt-0.5" size={20} />
            <p>{error}</p>
          </div>
        )}

        {analysis && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-left">
            {/* Header Section */}
            <div className="bg-gray-50 p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Earnings Call Summary</h2>
                <p className="text-sm text-gray-500 mt-1">Extracted via AI Analysis</p>
              </div>
              <div className="flex gap-3">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize border ${
                  analysis.tone.toLowerCase().includes('optimistic') ? 'bg-green-100 text-green-800 border-green-200' :
                  analysis.tone.toLowerCase().includes('cautious') ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                  analysis.tone.toLowerCase().includes('pessimistic') ? 'bg-red-100 text-red-800 border-red-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  Tone: {analysis.tone}
                </span>
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold capitalize border bg-blue-50 text-blue-800 border-blue-200">
                  Confidence: {analysis.confidence_level}
                </span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold  mb-3 flex items-center text-green-700">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Key Positives
                  </h3>
                  <ul className="space-y-2">
                    {analysis.key_positives.map((item, idx) => (
                      <li key={idx} className="text-gray-700 text-sm pl-4 border-l-2 border-green-200">{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold  mb-3 flex items-center text-red-700">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                    Key Concerns
                  </h3>
                  <ul className="space-y-2">
                    {analysis.key_concerns.map((item, idx) => (
                      <li key={idx} className="text-gray-700 text-sm pl-4 border-l-2 border-red-200">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2">Forward Guidance</h3>
                  <p className="text-gray-800 text-sm leading-relaxed">{analysis.forward_guidance}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold  mb-3 flex items-center text-purple-700">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                    Growth Initiatives
                  </h3>
                  <ul className="space-y-2">
                    {analysis.growth_initiatives.map((item, idx) => (
                      <li key={idx} className="text-gray-700 text-sm pl-4 border-l-2 border-purple-200">{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Capacity Utilization</h3>
                  <p className="text-gray-800 text-sm">{analysis.capacity_utilization}</p>
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
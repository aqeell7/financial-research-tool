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
      const response = await fetch("http://localhost:5002/api/documents/upload", {
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
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
            <FileText className="mx-auto mb-3 text-green-500" size={48} />
            <h2 className="text-xl font-semibold text-gray-800">Analysis Complete</h2>
            <p>Data received successfully. Ready to build the dashboard view!</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
import React, { useState, useRef } from 'react';
import { analyzePlantImage } from '../services/geminiService';
import { PlantAnalysisResult } from '../types';
import { Upload, Camera, CheckCircle, AlertOctagon, Loader2, RefreshCw, Stethoscope } from 'lucide-react';

export const DiseaseDetector: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PlantAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        setAnalysis(null); // Reset previous analysis
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      // Extract pure base64 without data prefix for the API
      const base64Data = selectedImage.split(',')[1];
      const mimeType = selectedImage.split(';')[0].split(':')[1];
      
      const result = await analyzePlantImage(base64Data, mimeType);
      setAnalysis(result);
    } catch (error) {
      alert("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20 md:pb-0">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-emerald-900">Plant Doctor</h2>
        <p className="text-emerald-600">Upload a photo of your plant to identify diseases and get treatment advice.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div 
            className={`
              relative h-80 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden
              ${selectedImage ? 'border-emerald-500 bg-black' : 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100/50 cursor-pointer'}
            `}
            onClick={() => !selectedImage && fileInputRef.current?.click()}
          >
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Selected plant" 
                className="w-full h-full object-contain" 
              />
            ) : (
              <div className="text-center p-6">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="text-emerald-600" size={32} />
                </div>
                <p className="text-emerald-800 font-semibold mb-1">Click to upload or take photo</p>
                <p className="text-emerald-600/70 text-sm">Supports JPG, PNG</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            
            {selectedImage && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors"
              >
                <RefreshCw size={20} />
              </button>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={!selectedImage || loading}
              className={`flex-1 py-3 px-6 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                ${!selectedImage || loading 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] shadow-emerald-200'
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Stethoscope size={20} /> Diagnose Plant
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 h-fit min-h-[320px]">
          {!analysis && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-3">
              <Upload size={48} className="opacity-20" />
              <p>Results will appear here after analysis.</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-emerald-700 font-medium animate-pulse">Consulting AI Knowledge Base...</p>
            </div>
          )}

          {analysis && (
            <div className="space-y-6 animate-slide-up">
              <div className="flex items-start justify-between border-b border-emerald-50 pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{analysis.diagnosis}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                      analysis.confidence.toLowerCase().includes('high') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {analysis.confidence} Confidence
                    </span>
                  </div>
                </div>
                {analysis.diagnosis.toLowerCase().includes('healthy') ? (
                  <CheckCircle className="text-green-500" size={32} />
                ) : (
                  <AlertOctagon className="text-red-500" size={32} />
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Observation</h4>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg text-sm">
                  {analysis.rawText}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Recommended Treatment</h4>
                <p className="text-gray-700 leading-relaxed bg-emerald-50/50 p-3 rounded-lg text-sm border-l-4 border-emerald-400">
                  {analysis.treatment}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
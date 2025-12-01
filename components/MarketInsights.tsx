import React, { useState } from 'react';
import { getMarketInsights } from '../services/geminiService';
import { MarketInsight } from '../types';
import { Search, ExternalLink, TrendingUp, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const MarketInsights: React.FC = () => {
  const [query, setQuery] = useState('corn and wheat prices');
  const [insight, setInsight] = useState<MarketInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setInsight(null);
    try {
      const result = await getMarketInsights(query);
      setInsight(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20 md:pb-0">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-emerald-900">Market Insights</h2>
        <p className="text-emerald-600">Real-time agricultural market data grounded in Google Search.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="E.g., Soybean prices in Brazil, fertilizer costs 2024..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
             {loading ? <Loader2 className="animate-spin" size={20} /> : <TrendingUp size={20} />}
             <span className="hidden sm:inline">Analyze Market</span>
          </button>
        </div>

        {insight ? (
          <div className="space-y-6 animate-slide-up">
            <div className="prose prose-emerald max-w-none">
              <ReactMarkdown>{insight.content}</ReactMarkdown>
            </div>
            
            {insight.sources.length > 0 && (
              <div className="border-t border-gray-100 pt-4 mt-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Sources</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {insight.sources.map((source, idx) => (
                    <a 
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-sm text-emerald-700 transition-colors truncate"
                    >
                      <ExternalLink size={14} className="flex-shrink-0" />
                      <span className="truncate">{source.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12 text-gray-400">
               <TrendingUp size={48} className="mx-auto mb-4 opacity-20" />
               <p>Enter a commodity or market topic to get the latest grounded insights.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

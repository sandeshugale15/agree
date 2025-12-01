import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { DiseaseDetector } from './components/DiseaseDetector';
import { CropAdvisor } from './components/CropAdvisor';
import { MarketInsights } from './components/MarketInsights';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.PLANT_DOCTOR:
        return <DiseaseDetector />;
      case AppView.ADVISOR:
        return <CropAdvisor />;
      case AppView.MARKET:
        return <MarketInsights />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-emerald-200">
      <Navigation currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="md:pl-64 min-h-screen transition-all duration-300">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;

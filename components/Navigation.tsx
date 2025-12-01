import React from 'react';
import { AppView } from '../types';
import { Sprout, Activity, Stethoscope, MessageSquare, TrendingUp } from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { view: AppView.DASHBOARD, label: 'Dashboard', icon: <Activity size={20} /> },
    { view: AppView.PLANT_DOCTOR, label: 'Plant Doctor', icon: <Stethoscope size={20} /> },
    { view: AppView.ADVISOR, label: 'Advisor', icon: <MessageSquare size={20} /> },
    { view: AppView.MARKET, label: 'Market', icon: <TrendingUp size={20} /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-emerald-900 text-white h-screen fixed left-0 top-0 shadow-xl z-20">
        <div className="p-6 flex items-center gap-3 border-b border-emerald-800">
          <div className="bg-white p-2 rounded-full">
            <Sprout className="text-emerald-700" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">AgriSmart AI</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.view
                  ? 'bg-emerald-500/20 text-emerald-100 font-semibold border border-emerald-500/30'
                  : 'text-emerald-300 hover:bg-emerald-800/50 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-emerald-800">
          <p className="text-xs text-emerald-400/60 text-center">Powered by Gemini 2.5</p>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-6 pb-safe pt-2">
        <div className="flex justify-between items-center">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`flex flex-col items-center gap-1 p-2 min-w-[64px] ${
                currentView === item.view ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              {React.cloneElement(item.icon as React.ReactElement, { size: 24 })}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

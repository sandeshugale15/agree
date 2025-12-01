import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { CloudRain, Sun, Droplets, Wind, AlertTriangle, Sprout } from 'lucide-react';
import { WeatherData } from '../types';

const weatherData: WeatherData[] = [
  { day: 'Mon', temp: 22, rainfall: 12 },
  { day: 'Tue', temp: 24, rainfall: 5 },
  { day: 'Wed', temp: 19, rainfall: 25 },
  { day: 'Thu', temp: 21, rainfall: 8 },
  { day: 'Fri', temp: 25, rainfall: 0 },
  { day: 'Sat', temp: 27, rainfall: 0 },
  { day: 'Sun', temp: 23, rainfall: 2 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-emerald-900">Farm Overview</h2>
        <p className="text-emerald-600">Welcome back. Here is your daily summary.</p>
      </header>

      {/* Weather Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-full text-amber-600">
            <Sun size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">Temperature</p>
            <p className="text-xl font-bold text-gray-800">24°C</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <CloudRain size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">Rainfall</p>
            <p className="text-xl font-bold text-gray-800">12mm</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-4">
          <div className="p-3 bg-cyan-100 rounded-full text-cyan-600">
            <Droplets size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">Humidity</p>
            <p className="text-xl font-bold text-gray-800">68%</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-full text-gray-600">
            <Wind size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">Wind</p>
            <p className="text-xl font-bold text-gray-800">14km/h</p>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rainfall Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Weekly Forecast</h3>
            <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">7 Days</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weatherData}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="temp" stroke="#fbbf24" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts / Tasks */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Alerts & Tasks</h3>
          <div className="space-y-4">
            <div className="flex gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
              <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-semibold text-red-700">Pest Alert: Aphids</p>
                <p className="text-xs text-red-600 mt-1">High risk in tomato sector due to recent humidity.</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <Droplets className="text-amber-500 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-semibold text-amber-700">Irrigation Needed</p>
                <p className="text-xs text-amber-600 mt-1">Sector 4 soil moisture is below 30%.</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <Sprout className="text-emerald-500 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-semibold text-emerald-700">Harvest Ready</p>
                <p className="text-xs text-emerald-600 mt-1">Basil ready for harvest in Greenhouse 2.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
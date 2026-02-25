import { format } from 'date-fns';
import { Calendar, Clock, CloudRain, Sun, CloudFog, Map as MapIcon } from 'lucide-react';
import { WeatherCondition } from '../types';
import { cn } from '../lib/utils';

interface ForecastControlProps {
  date: Date;
  onDateChange: (date: Date) => void;
  time: number;
  onTimeChange: (time: number) => void;
  weather: WeatherCondition;
  onWeatherChange: (weather: WeatherCondition) => void;
  mapStyle: 'satellite' | 'standard';
  onMapStyleChange: (style: 'satellite' | 'standard') => void;
}

export function ForecastControl({
  date,
  onDateChange,
  time,
  onTimeChange,
  weather,
  onWeatherChange,
  mapStyle,
  onMapStyleChange,
}: ForecastControlProps) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-30 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
        
        {/* Date Picker */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Date</label>
            <input
              type="date"
              value={format(date, 'yyyy-MM-dd')}
              onChange={(e) => onDateChange(new Date(e.target.value))}
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none w-full"
            />
          </div>
        </div>

        {/* Time Slider */}
        <div className="flex items-center gap-3 w-full md:flex-1">
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider">Time</label>
              <span className="text-xs font-mono text-blue-300">
                {format(new Date().setHours(time, 0), 'h:00 a')}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              value={time}
              onChange={(e) => onTimeChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        {/* Weather Selector */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className={cn(
            "p-2 rounded-lg transition-colors",
            weather === 'Sunny' ? "bg-yellow-500/20 text-yellow-400" :
            weather === 'Rainy' ? "bg-blue-500/20 text-blue-400" :
            "bg-gray-500/20 text-gray-400"
          )}>
            {weather === 'Sunny' && <Sun className="w-5 h-5" />}
            {weather === 'Rainy' && <CloudRain className="w-5 h-5" />}
            {weather === 'Foggy' && <CloudFog className="w-5 h-5" />}
          </div>
          <div className="flex-1 md:w-32">
            <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Weather</label>
            <select
              value={weather}
              onChange={(e) => onWeatherChange(e.target.value as WeatherCondition)}
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none w-full appearance-none"
            >
              <option value="Sunny">Sunny</option>
              <option value="Rainy">Rainy</option>
              <option value="Foggy">Foggy</option>
            </select>
          </div>
        </div>

        {/* Map Style Selector */}
        <div className="flex items-center gap-3 w-full md:w-auto border-l border-white/10 pl-6">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
            <MapIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 md:w-32">
            <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Map View</label>
            <div className="flex bg-slate-800 rounded-lg p-0.5 border border-white/10">
              <button
                onClick={() => onMapStyleChange('standard')}
                className={cn(
                  "flex-1 px-2 py-1 text-xs rounded-md transition-all",
                  mapStyle === 'standard' ? "bg-purple-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                )}
              >
                Map
              </button>
              <button
                onClick={() => onMapStyleChange('satellite')}
                className={cn(
                  "flex-1 px-2 py-1 text-xs rounded-md transition-all",
                  mapStyle === 'satellite' ? "bg-purple-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                )}
              >
                Sat
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
